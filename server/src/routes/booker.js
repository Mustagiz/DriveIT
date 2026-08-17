import express from 'express';
import { ROLES, BOOKING_STATUS } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

// Apply Booker RBAC to all sub-routes
// Allow all authenticated users to book seats
router.use(authenticateToken);
router.use(requireRole([ROLES.BOOKER, ROLES.LISTER, ROLES.ADMIN, ROLES.SUPPORT, 'passenger', 'pilot']));

// 1. Book seats on a ride
router.post('/bookings', validate(schemas.createBooking), async (req, res) => {
  try {
    const { rideId, seats = 1, pickupLocation, dropoffLocation, notes, note, rideDetails } = req.body;
    const seatsToBook = parseInt(seats, 10) || 1;

    let ride = await db.findRideById(rideId);
    if (!ride && rideDetails) {
      // Reconstruct ride if created across serverless nodes or client local sessions
      ride = await db.createRide({
        id: rideId,
        ...rideDetails,
        availableSeats: rideDetails.availableSeats || rideDetails.totalSeats || 3,
        totalSeats: rideDetails.totalSeats || 3,
        pricePerSeat: rideDetails.pricePerSeat || 350
      });
    }

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found or no longer active' });
    }

    if (ride.driverId && req.user?.id && ride.driverId === req.user.id) {
      return res.status(400).json({ error: 'Pilots cannot book seats on their own listed departures.' });
    }

    if (ride.accepting_bookings === false) {
      return res.status(400).json({ error: 'The pilot has currently paused new bookings for this ride.' });
    }

    const allBookings = await db.getBookings({ passengerId: req.user.id });
    const duplicateBooking = allBookings.find(b => b.rideId === ride.id && b.status === BOOKING_STATUS.CONFIRMED);
    if (duplicateBooking) {
      return res.status(400).json({
        error: `You already have an active boarding pass (${duplicateBooking.bookingRef}) for this corridor departure.`,
        activeBookingId: duplicateBooking.id,
        activeBookingRef: duplicateBooking.bookingRef
      });
    }

    const updatedRide = await db.reserveSeats(rideId, seatsToBook);

    const unitPrice = req.body.unitPrice ? parseFloat(req.body.unitPrice) : (ride.pricePerSeat || 350);
    const subtotal = unitPrice * seatsToBook;
    const serviceFee = parseFloat((subtotal * 0.10).toFixed(2));
    const totalPrice = req.body.totalPrice ? parseFloat(req.body.totalPrice) : parseFloat((subtotal + serviceFee).toFixed(2));

    const booking = await db.createBooking({
      rideId: ride.id,
      passengerId: req.user.id,
      passengerName: req.user.name,
      passengerAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      passengerPhone: req.user.phone || '+91 98110 54321',
      seatsBooked: seatsToBook,
      unitPrice,
      serviceFee,
      totalPrice,
      pickupLocation: pickupLocation || ride.originAddress,
      dropoffLocation: dropoffLocation || ride.destinationAddress,
      pickupStopIndex: req.body.pickupStopIndex ?? 0,
      dropoffStopIndex: req.body.dropoffStopIndex ?? null,
      isPartial: req.body.isPartial || false,
      segmentDistanceKm: req.body.segmentDistanceKm || ride.distanceKm || 148,
      notes: notes || note || '',
      driverId: ride.driverId,
      driverName: ride.driverName,
      driverAvatar: ride.driverAvatar
    });

    // Realtime notification broadcast to pilot flight decks
    try {
      const { getIO } = await import('../config/socket.js');
      getIO()?.emit('booking:created', { booking, ride: updatedRide });
      getIO()?.emit('ride:updated', { rideId: ride.id, bookedSeats: updatedRide.bookedSeats, availableSeats: updatedRide.availableSeats });
    } catch (e) {
      console.warn('Socket broadcast warning:', e);
    }

    res.status(201).json({
      message: 'Booking confirmed successfully!',
      booking,
      remainingSeats: updatedRide.availableSeats
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// 2. View all bookings
router.get('/bookings', async (req, res) => {
  try {
    const userBookings = await db.getBookings({ passengerId: req.user.id });

    const populated = await Promise.all(userBookings.map(async (b) => {
      const ride = await db.findRideById(b.rideId);
      const driver = ride ? await db.findUserById(ride.driverId) : null;
      const reviews = await db.getReviews({ bookingId: b.id });
      const review = reviews[0] || null;

      return {
        ...b,
        reviewed: Boolean(review),
        review,
        ride: ride ? {
          id: ride.id,
          originCity: ride.originCity,
          originAddress: ride.originAddress,
          destinationCity: ride.destinationCity,
          destinationAddress: ride.destinationAddress,
          departureDate: ride.departureDate,
          departureTime: ride.departureTime,
          status: ride.status,
          vehicle: ride.vehicle,
          amenities: ride.amenities,
          distanceKm: ride.distanceKm || 148,
          distanceMiles: ride.distanceMiles,
          estimatedDurationHours: ride.estimatedDurationHours
        } : null,
        driver: driver ? {
          name: driver.name,
          avatar: driver.avatar,
          rating: driver.rating,
          phone: driver.phone,
          verified: driver.verified
        } : null
      };
    }));

    res.json({
      total: populated.length,
      bookings: populated
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// 3. Cancel a booking
router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await db.findBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.passengerId !== req.user.id && !req.user.roles.includes(ROLES.ADMIN)) {
      return res.status(403).json({ error: 'Unauthorized to cancel this booking' });
    }

    if (booking.status === BOOKING_STATUS.CANCELLED) {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const updatedBooking = await db.updateBooking(booking.id, {
      status: BOOKING_STATUS.CANCELLED,
      cancellationReason: reason || 'Passenger requested cancellation'
    });

    const updatedRide = await db.releaseSeats(booking.rideId, booking.seatsBooked);

    res.json({
      message: 'Booking cancelled successfully. Seats have been restored.',
      booking: updatedBooking,
      rideUpdated: updatedRide ? {
        id: updatedRide.id,
        availableSeats: updatedRide.availableSeats,
        status: updatedRide.status
      } : null
    });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// 4. Rate Driver
router.post('/rides/:id/rate', validate(schemas.rateRide), async (req, res) => {
  try {
    const { bookingId, overallRating, safetyRating, cleanlinessRating, punctualityRating, comment } = req.body;
    const ride = await db.findRideById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const ratingNum = parseInt(overallRating, 10);
    if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Overall star rating must be between 1 and 5' });
    }

    const newReview = await db.createReview({
      rideId: ride.id,
      bookingId: bookingId || null,
      listerId: ride.driverId,
      bookerId: req.user.id,
      bookerName: req.user.name,
      overallRating: ratingNum,
      safetyRating: parseInt(safetyRating, 10) || ratingNum,
      cleanlinessRating: parseInt(cleanlinessRating, 10) || ratingNum,
      punctualityRating: parseInt(punctualityRating, 10) || ratingNum,
      comment: (comment || '').trim()
    });

    res.status(201).json({
      message: 'Rating and feedback submitted successfully. Thank you!',
      review: newReview
    });
  } catch (err) {
    console.error('Error rating ride:', err);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// 5. Report Incident
router.post('/reports', validate(schemas.createReport), async (req, res) => {
  try {
    const { bookingId, reportedUserId, category, description, evidenceUrl } = req.body;

    const reportedUser = reportedUserId ? await db.findUserById(reportedUserId) : null;

    const newReport = await db.createReport({
      bookingId: bookingId || null,
      reporterId: req.user.id,
      reporterName: req.user.name,
      reporterRole: 'booker',
      reportedUserId: reportedUserId || null,
      reportedUserName: reportedUser ? reportedUser.name : 'Unknown User',
      category,
      description: description.trim(),
      evidenceUrl: evidenceUrl || ''
    });

    res.status(201).json({
      message: 'Incident reported to Driveit Trust & Safety Desk. Our operations team will investigate promptly.',
      report: newReport
    });
  } catch (err) {
    console.error('Error reporting incident:', err);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

export default router;
