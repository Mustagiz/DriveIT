import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        id: 'usr_rahul_driver',
        name: 'Rahul Sharma',
        email: 'rahul@driveit.in',
        password: hashedPassword,
        roles: ['lister'],
        phone: '+91 98201 12345',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        bio: 'Software Architect in Pune commuting daily to Mumbai BKC. Drives a Tata Nexon EV with clean record and smooth highway cruise.',
        rating: 4.98,
        reviewsCount: 164,
        verified: true,
        kyc_status: 'VERIFIED',
        aadhaar_number: 'XXXX-XXXX-8921',
        aadhaar_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
        driving_license_number: 'MH-14-2018-0099412',
        vehicle_rc_number: 'MH-12-RN-7788',
        vehicle_rc_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
        vehicle: {
          make: 'Tata',
          model: 'Nexon EV Empowered',
          year: 2024,
          color: 'Intensi-Teal',
          plate: 'MH-12-RN-7788',
          electric: true
        }
      },
      {
        id: 'usr_priya_driver',
        name: 'Priya Menon',
        email: 'priya@driveit.in',
        password: hashedPassword,
        roles: ['lister'],
        phone: '+91 98450 67890',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        bio: 'Fintech product consultant driving between Bengaluru (Indiranagar) and Chennai (OMR) on weekends. Fastag active, quiet and punctual.',
        rating: 4.93,
        reviewsCount: 96,
        verified: true,
        kyc_status: 'VERIFIED',
        aadhaar_number: 'XXXX-XXXX-4512',
        aadhaar_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
        driving_license_number: 'KA-01-2019-0081234',
        vehicle_rc_number: 'KA-01-MJ-4321',
        vehicle_rc_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
        vehicle: {
          make: 'Hyundai',
          model: 'Creta SX(O) Hybrid',
          year: 2024,
          color: 'Ranger Khaki',
          plate: 'KA-01-MJ-4321',
          electric: false
        }
      },
      {
        id: 'usr_ananya_rider',
        name: 'Ananya Sen',
        email: 'ananya@driveit.in',
        password: hashedPassword,
        roles: ['booker'],
        phone: '+91 98110 54321',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        bio: 'Management consultant in Delhi NCR frequently traveling to Jaipur & Chandigarh. Verified passenger with minimal luggage.',
        rating: 4.96,
        reviewsCount: 42,
        verified: true,
        kyc_status: 'VERIFIED',
        aadhaar_number: 'XXXX-XXXX-9934'
      },
      {
        id: 'usr_aman_support',
        name: 'Aman Verma',
        email: 'aman@driveit.in',
        password: hashedPassword,
        roles: ['support', 'admin'],
        phone: '+91 99887 76655',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        bio: 'Driveit India Trust & Safety Operations Lead. Oversees National Highway corridors, Aadhaar KYC verification, and Fastag dispute resolution.',
        rating: 5.0,
        reviewsCount: 12,
        verified: true,
        kyc_status: 'VERIFIED'
      },
      {
        id: 'usr_rohan_dual',
        name: 'Rohan Kapoor',
        email: 'rohan@driveit.in',
        password: hashedPassword,
        roles: ['lister', 'booker'],
        phone: '+91 97654 32109',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        bio: 'Photographer traveling Western Ghats corridors. Offers seats when driving Mahindra XUV700, books EV carpools when returning.',
        rating: 4.88,
        reviewsCount: 78,
        verified: true,
        kyc_status: 'VERIFIED',
        aadhaar_number: 'XXXX-XXXX-6531',
        aadhaar_doc_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
        driving_license_number: 'MH-02-2020-0012999',
        vehicle_rc_number: 'MH-02-EE-9090',
        vehicle_rc_doc_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
        vehicle: {
          make: 'Mahindra',
          model: 'XUV700 AX7 Luxury',
          year: 2023,
          color: 'Midnight Black',
          plate: 'MH-02-EE-9090',
          electric: false
        }
      }
    ]
  });

  await prisma.ride.createMany({
    data: [
      {
        driverId: 'usr_rahul_driver',
        driverName: 'Rahul Sharma',
        driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.98,
        originCity: 'Mumbai, Maharashtra',
        originAddress: 'Bandra Kurla Complex (BKC), Mumbai',
        destinationCity: 'Pune, Maharashtra',
        destinationAddress: 'Swargate Metro Hub, Pune',
        waypoints: ['Vashi Toll Plaza', 'Lonavala Expressway Food Mall', 'Wakad Flyover'],
        departureDate: '2026-08-16',
        departureTime: '07:30 AM',
        estimatedDurationHours: 2.25,
        distanceKm: 148,
        distanceMiles: 92,
        baseFare: 80,
        pricePerSeat: 350,
        surgeMultiplier: 1.15,
        totalSeats: 3,
        availableSeats: 2,
        accepting_bookings: true,
        status: 'ACTIVE',
        vehicle: {
          make: 'Tata',
          model: 'Nexon EV Empowered',
          year: 2024,
          color: 'Intensi-Teal',
          plate: 'MH-12-RN-7788',
          electric: true
        },
        amenities: {
          ac: true,
          luggage: '1 Trolley + 1 Backpack',
          petsAllowed: false,
          smokingAllowed: false,
          musicAllowed: true,
          instantBook: true,
          fastagIncluded: true
        },
        notes: 'Zero emission EV ride. Fastag tolls included. Charging stop at Lonavala food court if needed.'
      },
      {
        driverId: 'usr_priya_driver',
        driverName: 'Priya Menon',
        driverAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.93,
        originCity: 'Bengaluru, Karnataka',
        originAddress: 'Silk Board Junction / Electronic City, Bengaluru',
        destinationCity: 'Chennai, Tamil Nadu',
        destinationAddress: 'Koyambedu CMBT / Guindy, Chennai',
        waypoints: ['Hosur Toll Gate', 'Krishnagiri Highway Stop', 'Sriperumbudur'],
        departureDate: '2026-08-16',
        departureTime: '06:00 AM',
        estimatedDurationHours: 5.5,
        distanceKm: 345,
        distanceMiles: 214,
        baseFare: 100,
        pricePerSeat: 650,
        surgeMultiplier: 1.25,
        totalSeats: 3,
        availableSeats: 2,
        accepting_bookings: true,
        status: 'ACTIVE',
        vehicle: {
          make: 'Hyundai',
          model: 'Creta SX(O) Hybrid',
          year: 2024,
          color: 'Ranger Khaki',
          plate: 'KA-01-MJ-4321',
          electric: false
        },
        amenities: {
          ac: true,
          luggage: '2 Medium Trolleys',
          petsAllowed: true,
          smokingAllowed: false,
          musicAllowed: true,
          instantBook: true,
          fastagIncluded: true
        },
        notes: 'Early morning start to beat Bangalore traffic. Calm driving style with Spotify podcast.'
      },
      {
        driverId: 'usr_rohan_dual',
        driverName: 'Rohan Kapoor',
        driverAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.88,
        originCity: 'New Delhi, Delhi NCR',
        originAddress: 'Cyber City Hub / IGI Airport T3, Gurugram',
        destinationCity: 'Jaipur, Rajasthan',
        destinationAddress: 'Sindhi Camp / Mansarovar, Jaipur',
        waypoints: ['Manesar Toll Plaza', 'Neemrana Japanese Zone', 'Shahpura Toll'],
        departureDate: '2026-08-17',
        departureTime: '08:00 AM',
        estimatedDurationHours: 4.25,
        distanceKm: 270,
        distanceMiles: 168,
        baseFare: 120,
        pricePerSeat: 550,
        surgeMultiplier: 1.10,
        totalSeats: 4,
        availableSeats: 4,
        accepting_bookings: true,
        status: 'ACTIVE',
        vehicle: {
          make: 'Mahindra',
          model: 'XUV700 AX7 Luxury',
          year: 2023,
          color: 'Midnight Black',
          plate: 'MH-02-EE-9090',
          electric: false
        },
        amenities: {
          ac: true,
          luggage: 'Large Luggage Space',
          petsAllowed: false,
          smokingAllowed: false,
          musicAllowed: true,
          instantBook: true,
          fastagIncluded: true
        },
        notes: 'Cruising via Delhi-Mumbai Expressway. Fast and smooth 8-lane expressway travel.'
      },
      {
        driverId: 'usr_rahul_driver',
        driverName: 'Rahul Sharma',
        driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        driverRating: 4.98,
        originCity: 'Pune, Maharashtra',
        originAddress: 'Chandani Chowk, Kothrud, Pune',
        destinationCity: 'Panaji, Goa',
        destinationAddress: 'Panaji Bus Stand / Miramar, Goa',
        waypoints: ['Satara NH48', 'Kolhapur McDonald\'s', 'Anmod Ghat'],
        departureDate: '2026-08-20',
        departureTime: '05:30 AM',
        estimatedDurationHours: 7.5,
        distanceKm: 440,
        distanceMiles: 273,
        baseFare: 150,
        pricePerSeat: 1200,
        surgeMultiplier: 1.35,
        totalSeats: 3,
        availableSeats: 3,
        accepting_bookings: true,
        status: 'ACTIVE',
        vehicle: {
          make: 'Tata',
          model: 'Nexon EV Empowered',
          year: 2024,
          color: 'Intensi-Teal',
          plate: 'MH-12-RN-7788',
          electric: true
        },
        amenities: {
          ac: true,
          luggage: '1 Large Bag / Passenger',
          petsAllowed: false,
          smokingAllowed: false,
          musicAllowed: true,
          instantBook: true,
          fastagIncluded: true
        },
        notes: 'Long distance scenic monsoon drive to North Goa. Regular bio & tea breaks planned.'
      }
    ]
  });

  await prisma.booking.create({
    data: {
      bookingRef: 'DRIVE-MUM-PUN-104',
      rideId: 'ride_mum_pun_001',
      passengerId: 'usr_ananya_rider',
      passengerName: 'Ananya Sen',
      passengerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      passengerPhone: '+91 98110 54321',
      seatsBooked: 1,
      unitPrice: 350.00,
      serviceFee: 35.00,
      totalPrice: 385.00,
      pickupLocation: 'Bandra Kurla Complex (BKC), Mumbai',
      dropoffLocation: 'Swargate Metro Hub, Pune',
      notes: 'Boarding near Diamond Bourse gate with 1 small trolley bag.',
      status: 'CONFIRMED',
      driverId: 'usr_rahul_driver',
      driverName: 'Rahul Sharma',
      driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'
    }
  });

  await prisma.review.create({
    data: {
      rideId: 'ride_mum_pun_001',
      bookingId: 'bk_mum_pun_001',
      listerId: 'usr_rahul_driver',
      bookerId: 'usr_ananya_rider',
      bookerName: 'Ananya Sen',
      overallRating: 5,
      safetyRating: 5,
      cleanlinessRating: 5,
      punctualityRating: 5,
      comfortRating: 5,
      comment: 'Exceptional EV ride! Rahul was extremely punctual at BKC, smooth 85 km/h cruise on the expressway, and car cabin was pristine.'
    }
  });

  await prisma.report.create({
    data: {
      reportRef: 'INC-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      bookingId: null,
      reporterId: 'usr_ananya_rider',
      reporterName: 'Ananya Sen',
      reporterRole: 'booker',
      reportedUserId: null,
      reportedUserName: 'Unknown User',
      category: 'OVERCHARGING_TOLLS',
      description: 'Fastag toll discrepancy on expressway',
      status: 'OPEN'
    }
  });

  await prisma.message.createMany({
    data: [
      {
        threadId: 'usr_ananya_rider',
        senderId: 'usr_ananya_rider',
        senderName: 'Ananya Sen',
        senderRole: 'booker',
        recipientId: 'SUPPORT_QUEUE',
        message: 'Hello Driveit Support, I have a query regarding my contactless QR boarding pass for tomorrow\'s Mumbai-Pune ride.'
      },
      {
        threadId: 'usr_ananya_rider',
        senderId: 'usr_aman_support',
        senderName: 'Aman Verma (Support Desk)',
        senderRole: 'support',
        recipientId: 'usr_ananya_rider',
        message: 'Hi Ananya! Your booking DRIVE-MUM-PUN-104 is fully confirmed. You can show the QR code directly from your dashboard when boarding Rahul\'s Nexon EV at BKC.'
      }
    ]
  });

  await prisma.banner.create({
    data: {
      title: 'Monsoon Expressway Safe Rides',
      tagline: 'Western Ghats & Mumbai-Pune EV Corridors',
      badge: 'Verified EV Fleet',
      description: '100% Aadhaar verified drivers, Fastag included, and real-time highway telemetry.',
      active: true
    }
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
