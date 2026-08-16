import express from 'express';
import { calculateSmartPrice, CORRIDOR_TOLLS, detectCorridor } from '../services/pricingEngine.js';

const router = express.Router();

// Full AI Smart Pricing Quote
router.post('/calculate', async (req, res) => {
  try {
    const {
      distanceKm,
      fuelType = 'PETROL',
      corridor = 'GENERAL',
      totalSeats = 4,
      seatsBooked = 1,
      origin = '',
      destination = '',
      departureHour,
      departureDay
    } = req.body;

    if (!distanceKm || distanceKm <= 0) {
      return res.status(400).json({ error: 'distanceKm is required and must be positive' });
    }

    const hour = departureHour !== undefined ? departureHour : new Date().getHours();
    const day = departureDay !== undefined ? departureDay : new Date().getDay();

    const pricing = calculateSmartPrice({
      distanceKm: Number(distanceKm),
      fuelType,
      corridor,
      totalSeats: Number(totalSeats),
      seatsBooked: Number(seatsBooked),
      departureHour: Number(hour),
      departureDay: Number(day),
      origin,
      destination
    });

    res.json({ success: true, pricing });
  } catch (err) {
    console.error('Pricing error:', err);
    res.status(500).json({ error: 'Pricing calculation failed' });
  }
});

// Get all corridor data
router.get('/corridors', (req, res) => {
  const corridors = Object.entries(CORRIDOR_TOLLS).map(([key, val]) => ({
    key,
    name: val.name,
    distanceKm: val.distanceKm,
    totalToll: val.totalToll,
    tollGates: val.tollGates,
    waypoints: val.waypoints
  }));
  res.json({ success: true, corridors });
});

// Detect corridor from city pair
router.get('/detect-corridor', (req, res) => {
  const { origin, destination } = req.query;
  const key = detectCorridor(origin || '', destination || '');
  const data = CORRIDOR_TOLLS[key] || CORRIDOR_TOLLS.GENERAL;
  res.json({ success: true, corridor: key, ...data });
});

// Quick fare estimate (no auth required)
router.get('/estimate', (req, res) => {
  const { km = 100, fuel = 'PETROL', seats = 4 } = req.query;
  const pricing = calculateSmartPrice({
    distanceKm: Number(km),
    fuelType: fuel,
    totalSeats: Number(seats),
    seatsBooked: 1
  });
  res.json({
    success: true,
    estimate: {
      pricePerSeat: pricing.finalPricePerSeat,
      co2SavedKg: pricing.co2SavedKg,
      savingsVsTaxi: pricing.savingsVsTaxi,
      surgeLabel: pricing.surgeLabel
    }
  });
});

export default router;
