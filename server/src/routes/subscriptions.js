import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../data/db.js';

const router = express.Router();

// In-memory subscriptions store (would use DB in production)
const subscriptions = [];

const SUBSCRIPTION_TIERS = {
  WEEKLY: { label: 'Weekly Pass', days: 7, discountPercent: 12, price: null },
  MONTHLY: { label: 'Monthly Pass', days: 30, discountPercent: 20, price: null },
  QUARTERLY: { label: '3-Month Pass', days: 90, discountPercent: 28, price: null }
};

// ─── Create Subscription ─────────────────────────────────────────────────────
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      corridorKey,     // 'MUM-PNE'
      origin,          // 'Bandra Kurla Complex, Mumbai'
      destination,     // 'Swargate, Pune'
      departureTime,   // '08:00'
      days,            // ['MON', 'TUE', 'WED', 'THU', 'FRI']
      seats = 1,
      tier = 'WEEKLY'
    } = req.body;

    const tierData = SUBSCRIPTION_TIERS[tier] || SUBSCRIPTION_TIERS.WEEKLY;

    // Calculate discount price from average ride fare
    const baseWeeklyFare = 450 * seats * (days?.length || 5);
    const discountedPrice = Math.round(baseWeeklyFare * (1 - tierData.discountPercent / 100));

    const subscription = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      passengerId: req.user.id,
      passengerName: req.user.name,
      corridorKey: corridorKey || 'GENERAL',
      origin,
      destination,
      departureTime,
      days: days || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      seats: Number(seats),
      tier,
      tierLabel: tierData.label,
      discountPercent: tierData.discountPercent,
      pricePerPeriod: discountedPrice,
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + tierData.days * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true,
      ridesBooked: 0,
      ridesFulfilled: 0,
      createdAt: new Date().toISOString()
    };

    subscriptions.push(subscription);

    res.status(201).json({
      success: true,
      subscription,
      message: `${tierData.label} activated! Seats auto-reserved for matching rides.`
    });
  } catch (err) {
    console.error('Subscription create error:', err);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// ─── Get My Subscriptions ─────────────────────────────────────────────────────
router.get('/my', authenticateToken, async (req, res) => {
  const mySubscriptions = subscriptions.filter(s => s.passengerId === req.user.id);

  // Add days remaining
  const enriched = mySubscriptions.map(sub => ({
    ...sub,
    daysRemaining: Math.max(0, Math.ceil(
      (new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)
    )),
    isExpired: new Date(sub.endDate) < new Date()
  }));

  res.json({ success: true, subscriptions: enriched, total: enriched.length });
});

// ─── Cancel Subscription ──────────────────────────────────────────────────────
router.delete('/:id', authenticateToken, async (req, res) => {
  const idx = subscriptions.findIndex(
    s => s.id === req.params.id && s.passengerId === req.user.id
  );

  if (idx === -1) {
    return res.status(404).json({ error: 'Subscription not found' });
  }

  subscriptions[idx].status = 'CANCELLED';
  subscriptions[idx].cancelledAt = new Date().toISOString();
  subscriptions[idx].autoRenew = false;

  res.json({
    success: true,
    message: 'Subscription cancelled. No further auto-renewals.',
    subscription: subscriptions[idx]
  });
});

// ─── Toggle Auto-Renew ────────────────────────────────────────────────────────
router.patch('/:id/auto-renew', authenticateToken, async (req, res) => {
  const sub = subscriptions.find(s => s.id === req.params.id && s.passengerId === req.user.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found' });

  sub.autoRenew = !sub.autoRenew;
  res.json({ success: true, autoRenew: sub.autoRenew, subscription: sub });
});

// ─── Available Subscription Tiers ─────────────────────────────────────────────
router.get('/tiers', (req, res) => {
  res.json({ success: true, tiers: SUBSCRIPTION_TIERS });
});

export default router;
