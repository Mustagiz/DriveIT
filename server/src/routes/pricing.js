import express from 'express';
import { db } from '../data/db.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

// Dynamic Fare Calculator
router.post('/calculate', validate(schemas.calculatePricing), async (req, res) => {
  const { distanceKm, fuelType, isElectric = false, corridor = 'general' } = req.body;

  const estimate = await db.calculateDynamicPrice({
    distanceKm,
    fuelType: fuelType || (isElectric ? 'ELECTRIC' : 'PETROL'),
    isElectric: fuelType ? fuelType === 'ELECTRIC' : Boolean(isElectric),
    corridor
  });

  res.json({
    success: true,
    pricing: estimate
  });
});

export default router;
