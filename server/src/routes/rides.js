import express from 'express';
import { z } from 'zod';
import { db } from '../data/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
import { getIO } from '../socket.js';

const router = express.Router();

const rideSearchSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  seats: z.string().optional(),
  maxPrice: z.string().optional(),
  electricOnly: z.string().optional(),
  fuelType: z.string().optional(),
  petsAllowed: z.string().optional(),
  sort: z.string().optional()
});

// Search & List active rides
router.get('/', validateQuery(rideSearchSchema), async (req, res) => {
  try {
    const { origin, destination, date, seats, maxPrice, electricOnly, fuelType, petsAllowed, sort } = req.query;

    const filters = {
      status: 'ACTIVE',
      origin,
      destination,
      date,
      minSeats: seats,
      maxPrice,
      electricOnly: electricOnly === 'true',
      fuelType: fuelType || (electricOnly === 'true' ? 'ELECTRIC' : undefined),
      petsAllowed: petsAllowed === 'true'
    };

    let rides = await db.getRides(filters);

    // Dynamically calculate confirmed booked seats and remaining available seats
    rides = await Promise.all(rides.map(async (r) => {
      const bookings = await db.getBookings({ rideId: r.id, status: 'CONFIRMED' });
      const bookedSeats = bookings.reduce((sum, b) => sum + (b.seatsBooked || 0), 0);
      const remainingSeats = Math.max(0, (r.totalSeats || 3) - bookedSeats);
      return {
        ...r,
        bookedSeats,
        availableSeats: remainingSeats,
        status: remainingSeats === 0 ? 'FULL' : r.status
      };
    }));

    if (sort === 'price_asc') {
      rides.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sort === 'price_desc') {
      rides.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    } else if (sort === 'departure_earliest') {
      rides.sort((a, b) => (a.departureDate + a.departureTime).localeCompare(b.departureDate + b.departureTime));
    } else if (sort === 'rating_desc') {
      rides.sort((a, b) => b.driverRating - a.driverRating);
    }

    res.json({
      total: rides.length,
      rides
    });
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ error: 'Failed to search rides' });
  }
});

// Popular routes
router.get('/popular-routes', (req, res) => {
  const routes = [
    { from: 'Mumbai, Maharashtra', to: 'Pune, Maharashtra', count: 12, startingPrice: 350 },
    { from: 'Bengaluru, Karnataka', to: 'Chennai, Tamil Nadu', count: 8, startingPrice: 650 },
    { from: 'Delhi NCR (Gurugram)', to: 'Jaipur, Rajasthan', count: 9, startingPrice: 550 },
    { from: 'Hyderabad, Telangana', to: 'Vijayawada, Andhra Pradesh', count: 6, startingPrice: 480 },
    { from: 'Pune, Maharashtra', to: 'Goa (Panaji)', count: 7, startingPrice: 950 },
    { from: 'Delhi NCR', to: 'Chandigarh, Punjab', count: 10, startingPrice: 450 }
  ];
  res.json(routes);
});

// Single Ride details
router.get('/:id', async (req, res) => {
  try {
    const ride = await db.findRideById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const driver = await db.findUserById(ride.driverId);
    const bookings = await db.getBookings({ rideId: ride.id, status: 'CONFIRMED' });
    const totalBookedSeats = bookings.reduce((sum, b) => sum + (b.seatsBooked || 0), 0);
    const remainingSeats = Math.max(0, (ride.totalSeats || 3) - totalBookedSeats);

    res.json({
      ...ride,
      availableSeats: remainingSeats,
      driver: driver ? {
        id: driver.id,
        name: driver.name,
        avatar: driver.avatar,
        rating: driver.rating,
        reviewsCount: driver.reviewsCount,
        bio: driver.bio,
        verified: driver.verified,
        phone: driver.phone
      } : null,
      totalBookedSeats,
      remainingSeats
    });
  } catch (err) {
    console.error('Error fetching ride details:', err);
    res.status(500).json({ error: 'Failed to fetch ride details' });
  }
});

// --- Commuter Ride Requests ("Notify Me / Request Highway Ride") ---
router.get('/requests/all', async (req, res) => {
  try {
    const requests = await db.getRideRequests();
    res.json({ total: requests.length, requests });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ride requests' });
  }
});

router.get('/requests/my', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    const all = await db.getRideRequests();
    if (!userId || userId === 'guest_user') {
      return res.json({ total: all.length, requests: all });
    }
    const my = all.filter(r => r.passengerId === userId || r.passengerName?.toLowerCase().includes(req.user?.name?.toLowerCase() || ''));
    res.json({ total: my.length ? my.length : all.length, requests: my.length ? my : all });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user ride requests' });
  }
});

router.post('/requests', optionalAuth, async (req, res) => {
  try {
    const { origin, destination, preferredDate, preferredTime, seats, maxBudget, notes, contactPhone, passengerName } = req.body;
    if (!origin || !destination) {
      return res.status(400).json({ error: 'Origin and Destination are required' });
    }

    const newRequest = await db.createRideRequest({
      passengerId: req.user?.id || 'guest_user',
      passengerName: passengerName || req.user?.name || 'Highway Commuter',
      passengerAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      contactPhone: contactPhone || req.user?.phone || '+91 98200 12345',
      origin,
      destination,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '08:00 AM',
      seats: Number(seats) || 1,
      maxBudget: Number(maxBudget) || 400,
      notes: notes || ''
    });

    // Real-time synchronization for all active pilots and dashboards
    try {
      getIO()?.emit('request:created', newRequest);
      getIO()?.emit('requests:updated', { request: newRequest, action: 'CREATE' });
    } catch (e) {
      console.warn('Could not broadcast request:created via socket:', e);
    }

    res.status(201).json({ success: true, request: newRequest });
  } catch (err) {
    console.error('Error creating ride request:', err);
    res.status(500).json({ error: 'Failed to submit ride request' });
  }
});

// --- Pilot QR / OTP Boarding Verification ---
router.post('/verify-boarding', optionalAuth, async (req, res) => {
  try {
    const { bookingRef, otp } = req.body;
    if (!bookingRef && !otp) {
      return res.status(400).json({ error: 'Booking reference or OTP is required' });
    }

    const result = await db.verifyBoardingOtp(bookingRef, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('Error verifying boarding pass:', err);
    res.status(500).json({ error: 'Failed to verify boarding pass' });
  }
});

export default router;
