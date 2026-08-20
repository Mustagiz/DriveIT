import express from 'express';
import { z } from 'zod';
import { db } from '../data/db.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
import { getIO } from '../socket.js';

import { findExpresswayRelays } from '../utils/relayMatcher.js';

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

// Search & List active rides + Expressway Relays
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

    // Strictly exclude completely booked rides or rides not accepting bookings
    rides = rides.filter(r => r.availableSeats > 0 && r.status !== 'FULL' && r.accepting_bookings !== false);

    if (sort === 'price_asc') {
      rides.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    } else if (sort === 'price_desc') {
      rides.sort((a, b) => b.pricePerSeat - a.pricePerSeat);
    } else if (sort === 'departure_earliest') {
      rides.sort((a, b) => (a.departureDate + a.departureTime).localeCompare(b.departureDate + b.departureTime));
    } else if (sort === 'rating_desc') {
      rides.sort((a, b) => b.driverRating - a.driverRating);
    }

    // Compute Expressway Multi-Hop Relays if origin and destination were queried
    let relays = [];
    if (origin && destination) {
      let allActiveRides = await db.getRides({ status: 'ACTIVE' });
      allActiveRides = await Promise.all(allActiveRides.map(async (r) => {
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

      relays = findExpresswayRelays(allActiveRides, origin, destination, {
        date,
        seats,
        electricOnly: electricOnly === 'true'
      });
    }

    res.json({
      total: rides.length,
      rides,
      totalRelays: relays.length,
      relays
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
    const my = all.filter(r => 
      r.passengerId === userId || 
      r.passengerId === 'guest_user' ||
      (req.user?.name && r.passengerName?.toLowerCase().includes(req.user.name.toLowerCase()))
    );
    res.json({ total: my.length, requests: my });
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

    const userId = req.user?.id || 'guest_user';

    // 1 Active Trip Policy Restriction Check
    const allBookings = await db.getBookings({ passengerId: userId });
    const activeBooking = allBookings.find(b => 
      b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'IN_TRANSIT' || b.status === 'ARRIVED'
    );
    if (activeBooking) {
      return res.status(400).json({
        error: `You currently have an active confirmed trip booking (${activeBooking.bookingRef || 'Active Booking'}). DriveIT restricts passengers to 1 active trip at a time. Please cancel your existing trip in the Passenger Flight Deck before broadcasting a new route demand.`,
        code: 'ACTIVE_SESSION_EXISTS',
        activeBookingRef: activeBooking.bookingRef
      });
    }

    const allRequests = await db.getRideRequests();
    const activeRequest = allRequests.find(r => 
      (r.passengerId === userId || (passengerName && r.passengerName?.toLowerCase() === passengerName.toLowerCase())) &&
      (r.status === 'OPEN' || r.status === 'ACCEPTED')
    );
    if (activeRequest) {
      return res.status(400).json({
        error: `You already have an active route demand broadcast in progress (${activeRequest.origin?.split(',')[0]} ➔ ${activeRequest.destination?.split(',')[0]}). DriveIT restricts passengers to 1 active trip at a time. Please cancel your existing request in the Passenger Flight Deck before initiating a new one.`,
        code: 'ACTIVE_SESSION_EXISTS',
        activeRequestId: activeRequest.id
      });
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

// --- Accept Commuter Demand (Pilot Offers Ride) ---
router.post('/requests/:id/accept', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { pilotId, pilotName, pilotAvatar, pilotPhone, vehicle, offeredPrice } = req.body || {};

    const updated = await db.updateRideRequest(id, {
      status: 'ACCEPTED',
      matchedPilot: {
        id: pilotId || req.user?.id || 'pilot_verified_01',
        name: pilotName || req.user?.name || 'Verified Highway Pilot',
        avatar: pilotAvatar || req.user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        phone: pilotPhone || req.user?.phone || '+91 98201 55667',
        vehicle: vehicle || { make: 'Tata', model: 'Nexon EV Empowered', plate: 'MH-12-RN-7788', electric: true },
        offeredPrice: Number(offeredPrice) || 400,
        acceptedAt: new Date().toISOString()
      }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    try {
      getIO()?.emit('request:accepted', updated);
      getIO()?.emit('requests:updated', { request: updated, action: 'ACCEPT' });
    } catch (e) {}

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept ride request' });
  }
});

// --- Decline Commuter Demand (Pilot Passes) ---
router.post('/requests/:id/decline', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};

    const updated = await db.updateRideRequest(id, {
      status: 'DECLINED',
      declineReason: reason || 'Pilot route unavailable or capacity filled'
    });

    if (!updated) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    try {
      getIO()?.emit('request:declined', updated);
      getIO()?.emit('requests:updated', { request: updated, action: 'DECLINE' });
    } catch (e) {}

    res.json({ success: true, request: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to decline ride request' });
  }
});

// --- State-Wise Expressway Corridors Summary ---
router.get('/corridors/summary', async (req, res) => {
  try {
    const allRides = db.data?.rides?.filter(r => r.status === 'ACTIVE') || [];

    const CORRIDOR_DEFS = [
      {
        stateId: 'maharashtra',
        stateName: 'Maharashtra Expressways',
        badge: 'High-Density EV Corridors',
        corridors: [
          { id: 'mum-pun', from: 'Mumbai', to: 'Pune', highway: 'Yashwantrao Chavan Expy', distanceKm: 148, baseFare: 350 },
          { id: 'mum-nas', from: 'Mumbai', to: 'Nashik', highway: 'NH160 Kasara Ghat Corridor', distanceKm: 165, baseFare: 380 },
          { id: 'pun-kol', from: 'Pune', to: 'Kolhapur', highway: 'NH48 Pune-Bengaluru Expy', distanceKm: 235, baseFare: 480 },
          { id: 'mum-nag', from: 'Mumbai', to: 'Nagpur', highway: 'Hindu Hrudaysamrat Balasaheb Thackeray (Samruddhi)', distanceKm: 701, baseFare: 1350 }
        ]
      },
      {
        stateId: 'delhi_ncr',
        stateName: 'Delhi NCR & Northern Corridors',
        badge: 'NE4 Access Controlled',
        corridors: [
          { id: 'del-jai', from: 'Delhi', to: 'Jaipur', highway: 'Delhi-Mumbai Expressway (NE4)', distanceKm: 280, baseFare: 580 },
          { id: 'del-agr', from: 'Delhi', to: 'Agra', highway: 'Yamuna Expressway (6-Lane)', distanceKm: 210, baseFare: 450 },
          { id: 'del-chd', from: 'Delhi', to: 'Chandigarh', highway: 'NH44 GT Road Corridor', distanceKm: 245, baseFare: 490 },
          { id: 'del-deh', from: 'Delhi', to: 'Dehradun', highway: 'Delhi-Dehradun Expressway', distanceKm: 235, baseFare: 520 }
        ]
      },
      {
        stateId: 'karnataka_south',
        stateName: 'Karnataka & South India',
        badge: 'Tech Executive Hubs',
        corridors: [
          { id: 'blr-mys', from: 'Bengaluru', to: 'Mysuru', highway: 'Bengaluru-Mysuru Access Highway', distanceKm: 145, baseFare: 320 },
          { id: 'blr-che', from: 'Bengaluru', to: 'Chennai', highway: 'NE7 Expressway Corridor', distanceKm: 345, baseFare: 690 },
          { id: 'blr-cbe', from: 'Bengaluru', to: 'Coimbatore', highway: 'NH544 Expressway Hub', distanceKm: 360, baseFare: 720 },
          { id: 'hyd-vij', from: 'Hyderabad', to: 'Vijayawada', highway: 'NH65 Expressway Corridor', distanceKm: 275, baseFare: 540 }
        ]
      },
      {
        stateId: 'gujarat',
        stateName: 'Gujarat Expressway Network',
        badge: 'NE1 Industrial Corridor',
        corridors: [
          { id: 'ahm-vad', from: 'Ahmedabad', to: 'Vadodara', highway: 'National Expressway 1 (NE1)', distanceKm: 110, baseFare: 260 },
          { id: 'sur-mum', from: 'Surat', to: 'Mumbai', highway: 'NH48 Coastal Corridor', distanceKm: 285, baseFare: 580 },
          { id: 'ahm-sur', from: 'Ahmedabad', to: 'Surat', highway: 'NE1 & NH48 Expressway', distanceKm: 265, baseFare: 520 }
        ]
      }
    ];

    const stateSummaries = CORRIDOR_DEFS.map(state => {
      const corridorsWithLiveStats = state.corridors.map(c => {
        // Find matching live departures
        const matchingRides = allRides.filter(r => {
          const orig = (r.originCity || '').toLowerCase();
          const dest = (r.destinationCity || '').toLowerCase();
          const f = c.from.toLowerCase();
          const t = c.to.toLowerCase();
          return (orig.includes(f) && dest.includes(t)) || (orig.includes(t) && dest.includes(f));
        });

        const activeCount = matchingRides.length;
        const lowestFare = activeCount > 0
          ? Math.min(...matchingRides.map(r => r.pricePerSeat || c.baseFare))
          : c.baseFare;

        return {
          ...c,
          activeDeparturesCount: activeCount,
          lowestPricePerSeat: lowestFare,
          evRidesAvailable: matchingRides.some(r => r.vehicle?.electric)
        };
      });

      return {
        ...state,
        corridors: corridorsWithLiveStats,
        totalStateDepartures: corridorsWithLiveStats.reduce((sum, c) => sum + c.activeDeparturesCount, 0)
      };
    });

    res.json({
      success: true,
      states: stateSummaries,
      totalCorridors: CORRIDOR_DEFS.reduce((sum, s) => sum + s.corridors.length, 0)
    });
  } catch (err) {
    console.error('Corridor summary fetch error:', err);
    res.status(500).json({ error: 'Failed to aggregate corridor summaries' });
  }
});

export default router;
