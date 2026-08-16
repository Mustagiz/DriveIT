import express from 'express';
import { z } from 'zod';
import { ROLES, RIDE_STATUS, BOOKING_STATUS } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply Support/Admin RBAC
router.use(authenticateToken);
router.use(requireRole([ROLES.ADMIN, ROLES.SUPPORT]));

// 1. Dashboard Overview Metrics
router.get('/overview', async (req, res) => {
  const users = await db.getUsers();
  const rides = await db.getRides();
  const bookings = await db.getBookings();
  const reports = await db.getReports();

  const totalUsers = users.length;
  const activeDrivers = users.filter(u => u.roles.includes('lister') && !u.banned).length;
  const activePassengers = users.filter(u => u.roles.includes('booker') && !u.banned).length;
  const pendingKycCount = users.filter(u => u.kyc_status === 'PENDING').length;

  const totalRidesListed = rides.length;
  const activeRidesCount = rides.filter(r => r.status === RIDE_STATUS.ACTIVE).length;

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === BOOKING_STATUS.CONFIRMED);
  const totalBookedSeats = confirmedBookings.reduce((sum, b) => sum + b.seatsBooked, 0);

  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const totalPlatformFees = confirmedBookings.reduce((sum, b) => sum + (b.serviceFee || 0), 0);

  const totalSeatsOffered = rides.reduce((sum, r) => sum + r.totalSeats, 0);
  const fillRatePercent = totalSeatsOffered > 0
    ? Math.min(100, Math.round((totalBookedSeats / totalSeatsOffered) * 100))
    : 0;

  const openReportsCount = reports.filter(r => r.status === 'OPEN' || r.status === 'INVESTIGATING').length;

  res.json({
    metrics: {
      totalUsers,
      activeDrivers,
      activePassengers,
      pendingKycCount,
      totalRidesListed,
      activeRidesCount,
      totalBookings,
      totalBookedSeats,
      fillRatePercent,
      totalRevenue,
      totalPlatformFees,
      openReportsCount
    },
    recentRides: rides.slice(0, 10),
    recentBookings: bookings.slice(0, 10),
    recentReports: reports.slice(0, 10)
  });
});

// 2. KYC Document Review
router.post('/users/:id/kyc-review', validate(z.object({
  decision: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional()
})), async (req, res) => {
  const { decision, reason } = req.body;
  const user = await db.findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isApproved = decision === 'APPROVE';
  const updatedUser = await db.updateUser(user.id, {
    kyc_status: isApproved ? 'VERIFIED' : 'REJECTED',
    verified: isApproved,
    kyc_rejection_reason: isApproved ? null : (reason || 'Documentation did not pass National Highway compliance check')
  });

  res.json({
    message: `KYC documents for ${user.name} have been ${isApproved ? 'VERIFIED & APPROVED' : 'REJECTED'}.`,
    user: updatedUser
  });
});

// 3. User Management
router.get('/users', async (req, res) => {
  const users = await db.getUsers();
  res.json({
    total: users.length,
    users: users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      roles: u.roles,
      avatar: u.avatar,
      rating: u.rating,
      reviewsCount: u.reviewsCount,
      verified: Boolean(u.verified),
      kyc_status: u.kyc_status || (u.verified ? 'VERIFIED' : 'PENDING'),
      kyc_rejection_reason: u.kyc_rejection_reason || null,
      aadhaar_number: u.aadhaar_number || 'N/A',
      aadhaar_doc_url: u.aadhaar_doc_url || null,
      driving_license_number: u.driving_license_number || 'N/A',
      driving_license_doc_url: u.driving_license_doc_url || null,
      vehicle_rc_number: u.vehicle_rc_number || 'N/A',
      vehicle_rc_doc_url: u.vehicle_rc_doc_url || null,
      banned: Boolean(u.banned),
      vehicle: u.vehicle,
      createdAt: u.createdAt
    }))
  });
});

// Toggle ban user status
router.post('/users/:id/ban-toggle', (req, res) => {
  const user = db.findUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updated = db.updateUser(user.id, { banned: !user.banned });
  res.json({
    message: `User ${updated.name} has been ${updated.banned ? 'SUSPENDED' : 'UNBANNED'}`,
    user: updated
  });
});

// 4. Incident Reports Management
router.get('/reports', (req, res) => {
  const reports = db.getReports();
  res.json({
    total: reports.length,
    reports
  });
});

router.patch('/reports/:id', validate(z.object({
  status: z.string().optional(),
  resolutionNotes: z.string().optional()
})), async (req, res) => {
  const { status, resolutionNotes } = req.body;
  const report = await db.findReportById(req.params.id);

  if (!report) {
    return res.status(404).json({ error: 'Incident report not found' });
  }

  const updatedReport = await db.updateReport(report.id, {
    status: status || report.status,
    resolutionNotes: resolutionNotes || report.resolutionNotes
  });

  res.json({
    message: 'Incident report status updated successfully',
    report: updatedReport
  });
});

// 5. Force-cancel ride
router.post('/rides/:id/force-cancel', (req, res) => {
  const { reason } = req.body;
  const ride = db.findRideById(req.params.id);

  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }

  const updatedRide = db.updateRide(ride.id, {
    status: RIDE_STATUS.CANCELLED,
    cancellationReason: `Support Desk Override: ${reason || 'Safety/Policy Violation'}`
  });

  const bookings = db.getBookings({ rideId: ride.id, status: BOOKING_STATUS.CONFIRMED });
  bookings.forEach(b => {
    db.updateBooking(b.id, {
      status: BOOKING_STATUS.CANCELLED,
      cancellationReason: `Support cancelled ride: ${reason || 'Safety/Policy Violation'}`
    });
  });

  res.json({
    message: `Ride force-cancelled by Support Agent. ${bookings.length} passenger bookings refunded.`,
    ride: updatedRide,
    refundedBookingsCount: bookings.length
  });
});

// 6. Comprehensive Rides Management (with rich test telemetry & categorized status)
router.get('/rides', async (req, res) => {
  const dbRides = await db.getRides();
  const bookings = await db.getBookings();
  const users = await db.getUsers();

  const dummyFleet = [
    // --- ONGOING RIDES ---
    {
      id: 'ride_mum_pun_001',
      driverId: 'usr_rahul_driver',
      driverName: 'Rahul Sharma',
      driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98201 12345',
      driverRating: 4.98,
      originCity: 'Mumbai, Maharashtra',
      originAddress: 'Bandra Kurla Complex (BKC), Mumbai',
      destinationCity: 'Pune, Maharashtra',
      destinationAddress: 'Swargate Metro Hub, Pune',
      waypoints: ['Vashi Toll Plaza', 'Lonavala Food Mall', 'Wakad Flyover'],
      departureDate: '2026-08-16',
      departureTime: '07:30 AM',
      estimatedDurationHours: 2.25,
      distanceKm: 148,
      pricePerSeat: 350,
      totalSeats: 3,
      totalBookedSeats: 2,
      availableSeats: 1,
      categoryStatus: 'ONGOING',
      status: 'IN_PROGRESS',
      vehicle: {
        make: 'Tata',
        model: 'Nexon EV Empowered',
        year: 2024,
        color: 'Intensi-Teal',
        plate: 'MH-12-RN-7788',
        fuelType: 'ELECTRIC',
        electric: true
      },
      passengers: [
        { bookingId: 'bk_101', passengerName: 'Ananya Sen', phone: '+91 98200 88776', seats: 1, totalFare: 350, pickupPoint: 'BKC, Mumbai', dropoffPoint: 'Swargate, Pune', boardingPin: '8492' },
        { bookingId: 'bk_102', passengerName: 'Vikram Mehta', phone: '+91 98211 44332', seats: 1, totalFare: 350, pickupPoint: 'Vashi Toll Plaza', dropoffPoint: 'Wakad Flyover', boardingPin: '9102' }
      ],
      telemetry: {
        currentSpeedKmh: 88,
        batteryPercent: 74,
        currentLocation: 'Mumbai-Pune Expressway (KM 48.2 - Khalapur Toll Plaza)',
        etaMinutes: 38,
        fastagStatus: 'CLEARED • KHALAPUR TOLL PLAZA',
        liveCoords: [18.7522, 73.3421]
      }
    },
    {
      id: 'ride_blr_che_002',
      driverId: 'usr_priya_driver',
      driverName: 'Priya Menon',
      driverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98450 77123',
      driverRating: 4.93,
      originCity: 'Bengaluru, Karnataka',
      originAddress: 'Electronic City Toll Gate, Bengaluru',
      destinationCity: 'Chennai, Tamil Nadu',
      destinationAddress: 'Guindy Industrial Estate, Chennai',
      waypoints: ['Hosur Toll Gate', 'Krishnagiri Highway Stop', 'Sriperumbudur'],
      departureDate: '2026-08-16',
      departureTime: '06:00 AM',
      estimatedDurationHours: 5.5,
      distanceKm: 345,
      pricePerSeat: 650,
      totalSeats: 3,
      totalBookedSeats: 3,
      availableSeats: 0,
      categoryStatus: 'ONGOING',
      status: 'IN_PROGRESS',
      vehicle: {
        make: 'Hyundai',
        model: 'Creta 1.5 CRDi Diesel',
        year: 2024,
        color: 'Titan Grey',
        plate: 'KA-01-MJ-4321',
        fuelType: 'DIESEL',
        electric: false
      },
      passengers: [
        { bookingId: 'bk_201', passengerName: 'Rohan Kapoor', phone: '+91 98401 55667', seats: 1, totalFare: 650, pickupPoint: 'Electronic City, Bengaluru', dropoffPoint: 'Guindy, Chennai', boardingPin: '4821' },
        { bookingId: 'bk_202', passengerName: 'Deepa Nair', phone: '+91 98402 11998', seats: 1, totalFare: 650, pickupPoint: 'Hosur Toll Gate', dropoffPoint: 'Sriperumbudur', boardingPin: '7723' },
        { bookingId: 'bk_203', passengerName: 'Arvind Swamy', phone: '+91 98403 66778', seats: 1, totalFare: 650, pickupPoint: 'Electronic City, Bengaluru', dropoffPoint: 'Guindy, Chennai', boardingPin: '3319' }
      ],
      telemetry: {
        currentSpeedKmh: 92,
        batteryPercent: null,
        fuelPercent: 78,
        currentLocation: 'NH 48 Bengaluru-Chennai Highway (KM 112 - Ambur Corridor)',
        etaMinutes: 115,
        fastagStatus: 'CLEARED • KRISHNAGIRI PLAZA',
        liveCoords: [12.7904, 78.7167]
      }
    },
    {
      id: 'ride_del_jai_004',
      driverId: 'usr_amit_driver',
      driverName: 'Amit Verma',
      driverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98110 33445',
      driverRating: 4.96,
      originCity: 'Delhi, NCR',
      originAddress: 'IGI Aerocity Hub, New Delhi',
      destinationCity: 'Jaipur, Rajasthan',
      destinationAddress: 'MI Road / Sindhi Camp, Jaipur',
      waypoints: ['Gurgaon Cyber City', 'Manesar Toll Plaza', 'Neemrana Food Court'],
      departureDate: '2026-08-16',
      departureTime: '08:00 AM',
      estimatedDurationHours: 4.0,
      distanceKm: 270,
      pricePerSeat: 550,
      totalSeats: 4,
      totalBookedSeats: 2,
      availableSeats: 2,
      categoryStatus: 'ONGOING',
      status: 'IN_PROGRESS',
      vehicle: {
        make: 'Honda',
        model: 'City 1.5 i-VTEC Petrol',
        year: 2024,
        color: 'Radiant Red',
        plate: 'DL-03-EV-4421',
        fuelType: 'PETROL',
        electric: false
      },
      passengers: [
        { bookingId: 'bk_401', passengerName: 'Kavita Rao', phone: '+91 98111 88990', seats: 1, totalFare: 550, pickupPoint: 'Aerocity, Delhi', dropoffPoint: 'MI Road, Jaipur', boardingPin: '1109' },
        { bookingId: 'bk_402', passengerName: 'Sneha Jain', phone: '+91 98112 33441', seats: 1, totalFare: 550, pickupPoint: 'Gurgaon Cyber City', dropoffPoint: 'Sindhi Camp, Jaipur', boardingPin: '6652' }
      ],
      telemetry: {
        currentSpeedKmh: 82,
        batteryPercent: null,
        fuelPercent: 65,
        currentLocation: 'Delhi-Jaipur Expressway (KM 74 - Neemrana Corridor)',
        etaMinutes: 85,
        fastagStatus: 'CLEARED • SHAHJAHANPUR TOLL PLAZA',
        liveCoords: [27.9863, 76.3855]
      }
    },

    // --- SCHEDULED RIDES ---
    {
      id: 'ride_pun_mum_005',
      driverId: 'usr_sameer_driver',
      driverName: 'Sameer Deshmukh',
      driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98220 55441',
      driverRating: 4.91,
      originCity: 'Pune, Maharashtra',
      originAddress: 'Hinjawadi Phase 1 IT Park, Pune',
      destinationCity: 'Mumbai, Maharashtra',
      destinationAddress: 'Dadar TT Circle, Mumbai',
      waypoints: ['Wakad Bridge', 'Lonavala Expressway', 'Chembur Diamond Garden'],
      departureDate: '2026-08-16',
      departureTime: '08:30 PM',
      estimatedDurationHours: 2.5,
      distanceKm: 152,
      pricePerSeat: 380,
      totalSeats: 3,
      totalBookedSeats: 2,
      availableSeats: 1,
      categoryStatus: 'SCHEDULED',
      status: 'ACTIVE',
      vehicle: {
        make: 'Hyundai',
        model: 'Ioniq 5 RWD',
        year: 2024,
        color: 'Gravity Gold Matte',
        plate: 'MH-14-EV-5502',
        fuelType: 'ELECTRIC',
        electric: true
      },
      passengers: [
        { bookingId: 'bk_501', passengerName: 'Tanvi Joshi', phone: '+91 98221 99881', seats: 1, totalFare: 380, pickupPoint: 'Hinjawadi Phase 1', dropoffPoint: 'Dadar TT, Mumbai', boardingPin: '5512' },
        { bookingId: 'bk_502', passengerName: 'Abhishek Kulkarni', phone: '+91 98222 33447', seats: 1, totalFare: 380, pickupPoint: 'Wakad Bridge', dropoffPoint: 'Chembur, Mumbai', boardingPin: '9081' }
      ],
      telemetry: {
        currentSpeedKmh: 0,
        batteryPercent: 98,
        currentLocation: 'Hinjawadi Phase 1 IT Park, Pune',
        etaMinutes: null,
        fastagStatus: 'READY • DEPARTURE IN 1H 15M',
        liveCoords: null
      }
    },
    {
      id: 'ride_hyd_vij_006',
      driverId: 'usr_rajesh_driver',
      driverName: 'Rajesh Varma',
      driverAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98480 12345',
      driverRating: 4.88,
      originCity: 'Hyderabad, Telangana',
      originAddress: 'HITEC City Cyber Towers, Hyderabad',
      destinationCity: 'Vijayawada, Andhra Pradesh',
      destinationAddress: 'Benz Circle / PNBS, Vijayawada',
      waypoints: ['LB Nagar Ring Road', 'Suryapet Highway Food Court', 'Nandigama'],
      departureDate: '2026-08-17',
      departureTime: '06:00 AM',
      estimatedDurationHours: 4.75,
      distanceKm: 275,
      pricePerSeat: 750,
      totalSeats: 4,
      totalBookedSeats: 1,
      availableSeats: 3,
      categoryStatus: 'SCHEDULED',
      status: 'ACTIVE',
      vehicle: {
        make: 'Mahindra',
        model: 'XUV700 AX7 Diesel',
        year: 2024,
        color: 'Midnight Black',
        plate: 'TS-09-EV-3311',
        fuelType: 'DIESEL',
        electric: false
      },
      passengers: [
        { bookingId: 'bk_601', passengerName: 'Suresh Reddy', phone: '+91 98481 88772', seats: 1, totalFare: 750, pickupPoint: 'HITEC City, Hyderabad', dropoffPoint: 'Benz Circle, Vijayawada', boardingPin: '4478' }
      ],
      telemetry: {
        currentSpeedKmh: 0,
        batteryPercent: null,
        fuelPercent: 92,
        currentLocation: 'HITEC City Cyber Towers, Hyderabad',
        etaMinutes: null,
        fastagStatus: 'READY • SCHEDULED FOR TOMORROW',
        liveCoords: null
      }
    },

    // --- COMPLETED RIDES (RIDE HISTORY) ---
    {
      id: 'ride_del_jai_003',
      driverId: 'usr_kunal_driver',
      driverName: 'Kunal Malhotra',
      driverAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98100 99887',
      driverRating: 4.98,
      originCity: 'Delhi, NCR',
      originAddress: 'Noida Sector 62 Metro Hub, Delhi NCR',
      destinationCity: 'Agra, Uttar Pradesh',
      destinationAddress: 'Taj Expressway Fatehabad Exit, Agra',
      waypoints: ['Yamuna Expressway Zero Point', 'Jewar Toll Plaza', 'Mathura Cut'],
      departureDate: '2026-08-15',
      departureTime: '06:30 AM',
      estimatedDurationHours: 3.0,
      distanceKm: 210,
      pricePerSeat: 400,
      totalSeats: 4,
      totalBookedSeats: 4,
      availableSeats: 0,
      categoryStatus: 'COMPLETED',
      status: 'COMPLETED',
      vehicle: {
        make: 'MG',
        model: 'ZS EV Exclusive Plus',
        year: 2024,
        color: 'Starry Black',
        plate: 'UP-16-EV-9088',
        fuelType: 'ELECTRIC',
        electric: true
      },
      passengers: [
        { bookingId: 'bk_301', passengerName: 'Manish Gupta', phone: '+91 98101 22334', seats: 1, totalFare: 400, pickupPoint: 'Noida Sec 62', dropoffPoint: 'Fatehabad Exit, Agra', boardingPin: '7819' },
        { bookingId: 'bk_302', passengerName: 'Ritu Sharma', phone: '+91 98102 33445', seats: 1, totalFare: 400, pickupPoint: 'Noida Sec 62', dropoffPoint: 'Fatehabad Exit, Agra', boardingPin: '9012' },
        { bookingId: 'bk_303', passengerName: 'Aditya Roy', phone: '+91 98103 44556', seats: 1, totalFare: 400, pickupPoint: 'Jewar Plaza', dropoffPoint: 'Fatehabad Exit, Agra', boardingPin: '3341' },
        { bookingId: 'bk_304', passengerName: 'Pooja Verma', phone: '+91 98104 55667', seats: 1, totalFare: 400, pickupPoint: 'Noida Sec 62', dropoffPoint: 'Mathura Cut', boardingPin: '6678' }
      ],
      telemetry: {
        currentSpeedKmh: 0,
        batteryPercent: 32,
        currentLocation: 'Taj Expressway Fatehabad Exit, Agra (TRIP FINALIZED)',
        etaMinutes: 0,
        fastagStatus: 'CLEARED • ALL TOLLS PAID (JEWAR & AGRA)',
        liveCoords: null
      }
    },
    {
      id: 'ride_blr_mys_007',
      driverId: 'usr_venkat_driver',
      driverName: 'Venkat Raman',
      driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98451 88990',
      driverRating: 4.95,
      originCity: 'Bengaluru, Karnataka',
      originAddress: 'Indiranagar 100ft Road, Bengaluru',
      destinationCity: 'Mysuru, Karnataka',
      destinationAddress: 'Suburban Bus Stand, Mysuru',
      waypoints: ['Kengeri Metro', 'Bidadi Highway Food Court', 'Mandya Bypass'],
      departureDate: '2026-08-15',
      departureTime: '03:45 PM',
      estimatedDurationHours: 2.5,
      distanceKm: 145,
      pricePerSeat: 350,
      totalSeats: 3,
      totalBookedSeats: 2,
      availableSeats: 1,
      categoryStatus: 'COMPLETED',
      status: 'COMPLETED',
      vehicle: {
        make: 'Skoda',
        model: 'Slavia 1.5 TSI Petrol',
        year: 2024,
        color: 'Lava Blue',
        plate: 'KA-05-EV-1234',
        fuelType: 'PETROL',
        electric: false
      },
      passengers: [
        { bookingId: 'bk_701', passengerName: 'Karthik Subramanian', phone: '+91 98452 33441', seats: 1, totalFare: 350, pickupPoint: 'Indiranagar, Bengaluru', dropoffPoint: 'Mysuru Suburban', boardingPin: '2289' },
        { bookingId: 'bk_702', passengerName: 'Swathi Rao', phone: '+91 98453 77889', seats: 1, totalFare: 350, pickupPoint: 'Kengeri Metro', dropoffPoint: 'Mandya Bypass', boardingPin: '8812' }
      ],
      telemetry: {
        currentSpeedKmh: 0,
        batteryPercent: null,
        fuelPercent: 55,
        currentLocation: 'Suburban Bus Stand, Mysuru (TRIP COMPLETED)',
        etaMinutes: 0,
        fastagStatus: 'CLEARED • BENGALURU-MYSURU EXPRESSWAY',
        liveCoords: null
      }
    },

    // --- CANCELLED RIDES ---
    {
      id: 'ride_mum_nas_008',
      driverId: 'usr_vikas_driver',
      driverName: 'Vikas Shinde',
      driverAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
      driverPhone: '+91 98205 66778',
      driverRating: 4.82,
      originCity: 'Mumbai, Maharashtra',
      originAddress: 'Thane Teen Hath Naka, Mumbai',
      destinationCity: 'Nashik, Maharashtra',
      destinationAddress: 'CBS Nashik Metro Hub, Nashik',
      waypoints: ['Kalyan Bypass', 'Kasara Ghat Viewpoint', 'Igatpuri'],
      departureDate: '2026-08-16',
      departureTime: '05:00 AM',
      estimatedDurationHours: 3.25,
      distanceKm: 168,
      pricePerSeat: 320,
      totalSeats: 3,
      totalBookedSeats: 2,
      availableSeats: 1,
      categoryStatus: 'CANCELLED',
      status: 'CANCELLED',
      cancellationReason: 'Kasara Ghat monsoon landslide & torrential rain advisory issued by NHAI • All 2 bookings refunded 100% to source UPI',
      vehicle: {
        make: 'Tata',
        model: 'Harrier Kryotec Diesel',
        year: 2023,
        color: 'Flame Red',
        plate: 'MH-04-EV-6611',
        fuelType: 'DIESEL',
        electric: false
      },
      passengers: [
        { bookingId: 'bk_801', passengerName: 'Nilesh Patil', phone: '+91 98206 11223', seats: 1, totalFare: 320, pickupPoint: 'Thane', dropoffPoint: 'Nashik CBS', boardingPin: '4410' },
        { bookingId: 'bk_802', passengerName: 'Snehal Deshmukh', phone: '+91 98207 88990', seats: 1, totalFare: 320, pickupPoint: 'Thane', dropoffPoint: 'Igatpuri', boardingPin: '6619' }
      ],
      telemetry: {
        currentSpeedKmh: 0,
        batteryPercent: null,
        fuelPercent: 88,
        currentLocation: 'Thane, Mumbai (CANCELLED BEFORE DEPARTURE)',
        etaMinutes: null,
        fastagStatus: 'REFUNDED & CANCELLED',
        liveCoords: null
      }
    }
  ];

  res.json({
    total: dummyFleet.length,
    rides: dummyFleet
  });
});

// Reset database (development only)
router.post('/reset-db', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Database reset is disabled in production' });
  }
  db.reset();
  res.json({ message: 'Database reset to initial state successfully.' });
});

export default router;
