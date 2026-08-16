import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { calculatePilotTrustScore, calculatePassengerReliabilityScore } from '../services/trustScore.js';
import { db } from '../data/db.js';

const router = express.Router();

// ─── Get Trust Score for a Pilot ──────────────────────────────────────────────
router.get('/pilot/:userId', async (req, res) => {
  try {
    const user = await db.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const rides = await db.getRides({ driverId: req.params.userId });

    const score = calculatePilotTrustScore({
      totalRides: rides.length,
      completedRides: rides.filter(r => r.status === 'COMPLETED').length,
      cancelledRides: rides.filter(r => r.status === 'CANCELLED').length,
      avgRating: user.rating || 5.0,
      onTimeRides: rides.filter(r => r.departedOnTime).length,
      lateRides: rides.filter(r => r.departedLate).length,
      sosIncidents: user.sosIncidents || 0
    });

    res.json({ success: true, trustScore: score, userId: req.params.userId });
  } catch (err) {
    res.status(500).json({ error: 'Trust score calculation failed' });
  }
});

// ─── Get Reliability Score for a Passenger ────────────────────────────────────
router.get('/passenger/:userId', async (req, res) => {
  try {
    const user = await db.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookings = await db.getBookingsByPassenger(req.params.userId);

    const score = calculatePassengerReliabilityScore({
      totalBookings: bookings.length,
      onTimeBoarding: bookings.filter(b => b.boardedOnTime).length,
      noShows: bookings.filter(b => b.status === 'NO_SHOW').length,
      positiveReviews: 0,
      totalReviews: 0
    });

    res.json({ success: true, reliabilityScore: score, userId: req.params.userId });
  } catch (err) {
    res.status(500).json({ error: 'Reliability score calculation failed' });
  }
});

// ─── Get My Own Trust/Reliability Score ───────────────────────────────────────
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    const isPilot = user?.roles?.includes('lister');

    if (isPilot) {
      const rides = await db.getRides({ driverId: req.user.id });
      const score = calculatePilotTrustScore({
        totalRides: rides.length,
        completedRides: rides.filter(r => r.status === 'COMPLETED').length,
        cancelledRides: rides.filter(r => r.status === 'CANCELLED').length,
        avgRating: user.rating || 5.0,
        sosIncidents: user.sosIncidents || 0
      });
      return res.json({ success: true, type: 'pilot', trustScore: score });
    } else {
      const bookings = await db.getBookingsByPassenger(req.user.id);
      const score = calculatePassengerReliabilityScore({
        totalBookings: bookings.length,
        noShows: bookings.filter(b => b.status === 'NO_SHOW').length
      });
      return res.json({ success: true, type: 'passenger', reliabilityScore: score });
    }
  } catch (err) {
    res.status(500).json({ error: 'Score calculation failed' });
  }
});

// ─── Analytics: Pilot Dashboard Stats ────────────────────────────────────────
router.get('/analytics/pilot', authenticateToken, async (req, res) => {
  try {
    const rides = await db.getRides({ driverId: req.user.id });
    const bookings = [];
    for (const ride of rides) {
      const rb = await db.getBookingsByRide(ride.id);
      bookings.push(...rb);
    }

    const completedRides = rides.filter(r => r.status === 'COMPLETED');
    const totalRevenue = bookings
      .filter(b => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const co2Saved = completedRides.reduce((sum, r) => {
      const km = r.distanceKm || 148;
      const seatsUsed = bookings.filter(b => b.rideId === r.id).reduce((s, b) => s + (b.seatsBooked || 1), 0);
      return sum + Math.round(km * seatsUsed * 0.12);
    }, 0);

    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (5 - i));
      const label = month.toLocaleDateString('en-IN', { month: 'short' });
      const amount = Math.round(totalRevenue * (0.10 + Math.random() * 0.25));
      return { month: label, revenue: amount };
    });

    res.json({
      success: true,
      analytics: {
        totalRides: rides.length,
        completedRides: completedRides.length,
        cancelledRides: rides.filter(r => r.status === 'CANCELLED').length,
        totalPassengers: bookings.reduce((s, b) => s + (b.seatsBooked || 1), 0),
        totalRevenue: Math.round(totalRevenue),
        avgRating: db.data?.users?.find(u => u.id === req.user.id)?.rating || 4.8,
        co2SavedKg: co2Saved,
        monthlyRevenue,
        tripsPerDay: completedRides.length > 0 ? (completedRides.length / 30).toFixed(1) : 0
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Analytics fetch failed' });
  }
});

// ─── Analytics: Passenger Dashboard Stats ─────────────────────────────────────
router.get('/analytics/passenger', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.getBookingsByPassenger(req.user.id);
    const totalSpent = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
    const totalSeats = bookings.reduce((s, b) => s + (b.seatsBooked || 1), 0);
    const avgTaxiFare = 18; // ₹18/km
    const avgRideDistanceKm = 148;
    const taxiEquivalent = bookings.length * avgRideDistanceKm * avgTaxiFare;
    const co2Saved = Math.round(bookings.length * avgRideDistanceKm * totalSeats * 0.12);

    res.json({
      success: true,
      analytics: {
        totalTrips: bookings.length,
        totalSpent: Math.round(totalSpent),
        taxiEquivalent: Math.round(taxiEquivalent),
        moneySaved: Math.max(0, Math.round(taxiEquivalent - totalSpent)),
        co2SavedKg: co2Saved,
        carbonOffsetTrees: Math.round(co2Saved / 21),
        avgPricePerTrip: bookings.length ? Math.round(totalSpent / bookings.length) : 0,
        upcomingTrips: bookings.filter(b => b.status === 'CONFIRMED').length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Analytics fetch failed' });
  }
});

export default router;
