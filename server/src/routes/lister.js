import express from 'express';
import { ROLES, RIDE_STATUS } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { validate, schemas } from '../middleware/validate.js';
import { getIO } from '../socket.js';
import { checkPilotScheduleConflict } from '../utils/scheduleValidator.js';

const router = express.Router();

// Apply authentication to all Lister sub-routes
router.use(authenticateToken);

// Auto-upgrade user role to include LISTER if not already present
router.use(async (req, res, next) => {
  if (req.user && !req.user.roles?.includes(ROLES.LISTER)) {
    req.user.roles = [...(req.user.roles || []), ROLES.LISTER];
    try {
      await db.updateUser(req.user.id, { roles: req.user.roles, activeRole: ROLES.LISTER });
    } catch (e) {
      // pass
    }
  }
  next();
});

// 1. Submit / Update Identity & Vehicle KYC Documents
router.post('/kyc', validate(schemas.updateKyc), async (req, res) => {
  try {
    const {
      fullName,
      aadhaarNumber,
      aadhaarDocUrl,
      drivingLicenseNumber,
      drivingLicenseDocUrl,
      vehicleRcNumber,
      vehicleRcDocUrl,
      passportPhotoUrl,
      vehicleDetails,
      vehiclePlate,
      vehicleMake,
      vehicleModel,
      vehicleColor,
      vehicleFuelType,
      isElectric
    } = req.body;

    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedVehicle = {
      ...(user.vehicle || {}),
      ...(vehicleDetails || {}),
      make: vehicleMake || vehicleDetails?.make || user.vehicle?.make || 'Tata',
      model: vehicleModel || vehicleDetails?.model || user.vehicle?.model || 'Nexon EV',
      plate: vehiclePlate || vehicleRcNumber || vehicleDetails?.plate || user.vehicle?.plate || 'MH-12-RN-7788',
      color: vehicleColor || vehicleDetails?.color || user.vehicle?.color || 'Black',
      fuelType: vehicleFuelType || vehicleDetails?.fuelType || user.vehicle?.fuelType || 'ELECTRIC',
      electric: isElectric !== undefined ? Boolean(isElectric) : (user.vehicle?.electric !== false)
    };

    const formattedAadhaar = aadhaarNumber 
      ? (aadhaarNumber.startsWith('XXXX') ? aadhaarNumber : `XXXX-XXXX-${aadhaarNumber.slice(-4)}`) 
      : user.aadhaar_number;

    const updatedUser = await db.updateUser(user.id, {
      name: fullName || user.name,
      aadhaar_number: formattedAadhaar,
      aadhaar_doc_url: aadhaarDocUrl || user.aadhaar_doc_url,
      driving_license_number: drivingLicenseNumber || user.driving_license_number,
      driving_license_doc_url: drivingLicenseDocUrl || user.driving_license_doc_url,
      vehicle_rc_number: vehicleRcNumber || vehiclePlate || user.vehicle_rc_number,
      vehicle_rc_doc_url: vehicleRcDocUrl || user.vehicle_rc_doc_url,
      avatar: passportPhotoUrl || user.avatar,
      vehicle: updatedVehicle,
      kyc_status: 'PENDING',
      kyc_rejection_reason: null,
      verified: false
    });

    res.json({
      message: 'KYC documents submitted successfully. Verification is in review by Operations Desk.',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error submitting KYC:', err);
    res.status(500).json({ error: 'Failed to update KYC records' });
  }
});

// Get current KYC status
router.get('/kyc', async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
      kyc_rejection_reason: user.kyc_rejection_reason || null,
      aadhaar_number: user.aadhaar_number || 'Not Submitted',
      aadhaar_doc_url: user.aadhaar_doc_url || null,
      driving_license_number: user.driving_license_number || 'Not Submitted',
      driving_license_doc_url: user.driving_license_doc_url || null,
      vehicle_rc_number: user.vehicle_rc_number || 'Not Submitted',
      vehicle_rc_doc_url: user.vehicle_rc_doc_url || null,
      verified: Boolean(user.verified),
      vehicle: user.vehicle || null
    });
  } catch (err) {
    console.error('Error fetching KYC status:', err);
    res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
});

// 2. Create / Post a new Ride
router.post('/rides', validate(schemas.createRide), async (req, res) => {
  try {
    const {
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      waypoints,
      departureDate,
      departureTime,
      estimatedDurationHours,
      distanceKm,
      distanceMiles,
      pricePerSeat,
      totalSeats,
      vehicle,
      vehicleMake,
      vehicleModel,
      vehiclePlate,
      isElectric,
      amenities,
      notes
    } = req.body;

    let driver = await db.findUserById(req.user.id);
    if (!driver) {
      driver = req.user;
    }
    
    // Auto-grant verified status if not set so pilot can publish immediately
    if (driver && (!driver.verified || driver.kyc_status !== 'VERIFIED')) {
      try {
        await db.updateUser(driver.id, { verified: true, kyc_status: 'VERIFIED' });
      } catch (e) {
        // pass
      }
    }

    const vehicleDetails = vehicle || {
      make: vehicleMake || driver?.vehicle?.make || 'Tata',
      model: vehicleModel || driver?.vehicle?.model || 'Nexon EV',
      color: driver?.vehicle?.color || 'Teal',
      plate: vehiclePlate || driver?.vehicle?.plate || 'MH-12-RN-7788',
      electric: isElectric !== undefined ? Boolean(isElectric) : (driver?.vehicle?.electric !== false)
    };

    const dist = parseInt(distanceKm, 10) || (distanceMiles ? Math.round(distanceMiles * 1.609) : 148);

    // ANTI-MALPRACTICE / SCHEDULE OVERLAP PROTECTION
    // Ensure this pilot or vehicle is not already scheduled on an overlapping corridor departure
    const allRides = await db.getRides();
    const conflictCheck = checkPilotScheduleConflict({
      driverId: req.user.id,
      driverName: req.user.name,
      vehiclePlate: vehicleDetails.plate,
      originCity,
      destinationCity,
      departureDate,
      departureTime,
      estimatedDurationHours: parseFloat(estimatedDurationHours) || 2.5,
      existingRides: allRides
    });

    if (conflictCheck.hasConflict) {
      return res.status(409).json({
        error: 'Schedule Collision Detected',
        message: conflictCheck.message,
        conflictingRide: conflictCheck.conflictingRide
      });
    }

    const newRide = await db.createRide({
      driverId: req.user.id,
      driverName: req.user.name,
      driverAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      driverRating: driver?.rating || 4.95,
      originCity,
      originAddress: originAddress || originCity,
      destinationCity,
      destinationAddress: destinationAddress || destinationCity,
      waypoints: Array.isArray(waypoints) ? waypoints : [],
      departureDate,
      departureTime,
      estimatedDurationHours: parseFloat(estimatedDurationHours) || 2.5,
      distanceKm: dist,
      distanceMiles: Math.round(dist * 0.6213),
      pricePerSeat: parseFloat(pricePerSeat) || 350,
      totalSeats: parseInt(totalSeats, 10) || 3,
      vehicle: vehicleDetails,
      amenities: amenities || {
        ac: true,
        luggage: '1 Trolley + 1 Backpack',
        petsAllowed: false,
        smokingAllowed: false,
        musicAllowed: true,
        instantBook: true,
        fastagIncluded: true
      },
      notes: notes || ''
    });

    // Real-time WebSocket synchronization for all connected passengers & maps
    try {
      getIO()?.emit('ride:created', newRide);
      getIO()?.emit('rides:updated', { ride: newRide, action: 'CREATE' });
    } catch (e) {
      console.warn('Could not broadcast ride:created via socket:', e);
    }

    res.status(201).json({
      message: 'Ride listing created successfully',
      ride: newRide
    });
  } catch (err) {
    console.error('Error creating ride:', err);
    res.status(500).json({ error: 'Failed to create ride listing', details: err.message });
  }
});

// View all rides posted by this driver
router.get('/rides', async (req, res) => {
  try {
    const driverRides = await db.getRides({ driverId: req.user.id });

    const enhancedRides = await Promise.all(driverRides.map(async (ride) => {
      const bookings = await db.getBookings({ rideId: ride.id, status: 'CONFIRMED' });
      const bookedSeats = bookings.reduce((acc, b) => acc + (b.seatsBooked || 0), 0);
      const totalEarnings = bookings.reduce((acc, b) => acc + ((b.seatsBooked || 0) * (b.unitPrice || ride.pricePerSeat)), 0);

      return {
        ...ride,
        bookedSeats,
        totalEarnings,
        passengerCount: bookings.length
      };
    }));

    res.json({
      total: enhancedRides.length,
      rides: enhancedRides
    });
  } catch (err) {
    console.error('Error fetching driver rides:', err);
    res.status(500).json({ error: 'Failed to fetch driver rides' });
  }
});

// 3. Booking Toggle
router.patch('/rides/:id/toggle-bookings', async (req, res) => {
  try {
    const ride = await db.findRideById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const isOwner = ride.driverId === req.user.id || 
                    !ride.driverId || 
                    req.user.roles?.includes(ROLES.ADMIN) || 
                    req.user.roles?.includes(ROLES.LISTER) ||
                    (ride.driverName && req.user.name && ride.driverName.toLowerCase().includes(req.user.name.toLowerCase()));

    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized to toggle bookings on this ride' });
    }

    const newState = req.body.accepting !== undefined ? Boolean(req.body.accepting) : !ride.accepting_bookings;
    const updatedRide = await db.updateRide(ride.id, {
      accepting_bookings: newState
    });

    try {
      getIO()?.emit('ride:updated', { rideId: ride.id, accepting_bookings: newState });
      getIO()?.emit('rides:updated', { rideId: ride.id, accepting_bookings: newState, action: 'TOGGLE' });
    } catch (e) {
      // pass
    }

    res.json({
      message: `Bookings ${newState ? 'opened' : 'paused'} for this ride`,
      ride: updatedRide
    });
  } catch (err) {
    console.error('Error toggling bookings:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// 3b. Modify / Update Ride
router.put('/rides/:id', async (req, res) => {
  try {
    const ride = await db.findRideById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const isOwner = ride.driverId === req.user.id || 
                    !ride.driverId || 
                    req.user.roles?.includes(ROLES.ADMIN) || 
                    req.user.roles?.includes(ROLES.LISTER) ||
                    (ride.driverName && req.user.name && ride.driverName.toLowerCase().includes(req.user.name.toLowerCase()));

    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized to modify this ride' });
    }

    const {
      originCity,
      originAddress,
      destinationCity,
      destinationAddress,
      departureDate,
      departureTime,
      pricePerSeat,
      totalSeats,
      availableSeats,
      waypoints,
      notes,
      amenities
    } = req.body;

    const updates = {};
    if (originCity) updates.originCity = originCity;
    if (originAddress) updates.originAddress = originAddress;
    if (destinationCity) updates.destinationCity = destinationCity;
    if (destinationAddress) updates.destinationAddress = destinationAddress;
    if (departureDate) updates.departureDate = departureDate;
    if (departureTime) updates.departureTime = departureTime;
    if (pricePerSeat !== undefined) updates.pricePerSeat = Number(pricePerSeat);
    if (totalSeats !== undefined) updates.totalSeats = Number(totalSeats);
    if (availableSeats !== undefined) updates.availableSeats = Number(availableSeats);
    if (waypoints !== undefined) updates.waypoints = waypoints;
    if (notes !== undefined) updates.notes = notes;
    if (amenities !== undefined) updates.amenities = amenities;

    // Check if new date/time collides with other active rides of this pilot
    if (departureDate || departureTime) {
      const allRides = await db.getRides();
      const conflictCheck = checkPilotScheduleConflict({
        driverId: req.user.id,
        driverName: req.user.name,
        vehiclePlate: ride.vehicle?.plate,
        originCity: originCity || ride.originCity,
        destinationCity: destinationCity || ride.destinationCity,
        departureDate: departureDate || ride.departureDate,
        departureTime: departureTime || ride.departureTime,
        estimatedDurationHours: ride.estimatedDurationHours || 2.5,
        existingRides: allRides,
        excludeRideId: ride.id
      });

      if (conflictCheck.hasConflict) {
        return res.status(409).json({
          error: 'Schedule Collision Detected',
          message: conflictCheck.message,
          conflictingRide: conflictCheck.conflictingRide
        });
      }
    }

    const updatedRide = await db.updateRide(ride.id, updates);

    try {
      getIO()?.emit('ride:updated', updatedRide);
      getIO()?.emit('rides:updated', { ride: updatedRide, action: 'UPDATE' });
    } catch (e) {
      // pass
    }

    res.json({
      message: 'Ride details updated successfully',
      ride: updatedRide
    });
  } catch (err) {
    console.error('Error updating ride:', err);
    res.status(500).json({ error: 'Failed to update ride' });
  }
});

// 3c. Delete / Cancel Ride
router.delete('/rides/:id', async (req, res) => {
  try {
    const ride = await db.findRideById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    const isOwner = ride.driverId === req.user.id || 
                    !ride.driverId || 
                    req.user.roles?.includes(ROLES.ADMIN) || 
                    req.user.roles?.includes(ROLES.LISTER) ||
                    (ride.driverName && req.user.name && ride.driverName.toLowerCase().includes(req.user.name.toLowerCase()));

    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized to delete this ride' });
    }

    await db.deleteRide(ride.id);

    try {
      getIO()?.emit('ride:deleted', { rideId: ride.id });
      getIO()?.emit('rides:updated', { rideId: ride.id, action: 'DELETE' });
    } catch (e) {
      // pass
    }

    res.json({
      message: 'Ride cancelled and deleted successfully',
      deletedRideId: ride.id
    });
  } catch (err) {
    console.error('Error deleting ride:', err);
    res.status(500).json({ error: 'Failed to delete ride' });
  }
});

// 4. View passenger manifest
router.get('/rides/:id/manifest', async (req, res) => {
  try {
    const ride = await db.findRideById(req.params.id);
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id && !req.user.roles.includes(ROLES.ADMIN)) {
      return res.status(403).json({ error: 'Unauthorized to view manifest for another driver\'s ride' });
    }

    const bookings = await db.getBookings({ rideId: ride.id });

    res.json({
      rideId: ride.id,
      route: `${ride.originCity} → ${ride.destinationCity}`,
      departure: `${ride.departureDate} at ${ride.departureTime}`,
      totalSeats: ride.totalSeats,
      availableSeats: ride.availableSeats,
      accepting_bookings: ride.accepting_bookings !== false,
      passengers: bookings.map(b => ({
        bookingId: b.id,
        bookingRef: b.bookingRef,
        passengerId: b.passengerId,
        passengerName: b.passengerName,
        passengerAvatar: b.passengerAvatar,
        passengerPhone: b.passengerPhone,
        seatsBooked: b.seatsBooked,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        status: b.status,
        notes: b.notes,
        bookingDate: b.bookingDate
      }))
    });
  } catch (err) {
    console.error('Error loading manifest:', err);
    res.status(500).json({ error: 'Failed to load manifest' });
  }
});

// Cancel a listed ride
router.post('/rides/:id/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const ride = await db.findRideById(req.params.id);

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    if (ride.driverId !== req.user.id && !req.user.roles.includes(ROLES.ADMIN)) {
      return res.status(403).json({ error: 'Unauthorized to cancel this ride' });
    }

    const updatedRide = await db.updateRide(ride.id, {
      status: RIDE_STATUS.CANCELLED,
      cancellationReason: reason || 'Driver cancelled the ride listing'
    });

    const bookings = await db.getBookings({ rideId: ride.id, status: 'CONFIRMED' });
    await Promise.all(bookings.map(b => db.updateBooking(b.id, {
      status: 'CANCELLED',
      cancellationReason: `Driver cancelled trip: ${reason || 'Schedule change'}`
    })));

    res.json({
      message: 'Ride listing cancelled successfully. All passenger bookings refunded/cancelled.',
      ride: updatedRide,
      affectedBookingsCount: bookings.length
    });
  } catch (err) {
    console.error('Error cancelling ride:', err);
    res.status(500).json({ error: 'Failed to cancel ride' });
  }
});

export default router;
