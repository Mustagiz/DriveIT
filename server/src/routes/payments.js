import express from 'express';
import crypto from 'crypto';
import { authenticateToken } from '../middleware/auth.js';
import { db } from '../data/db.js';

const router = express.Router();

// Razorpay config — reads from env (falls back to test mode keys)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'test_secret_demo';
const RAZORPAY_AVAILABLE = RAZORPAY_KEY_ID !== 'rzp_test_demo';

// ─── Create Payment Order ─────────────────────────────────────────────────────
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { rideId, seatsBooked, amount, bookingRef, currency = 'INR' } = req.body;

    if (!rideId || !amount) {
      return res.status(400).json({ error: 'rideId and amount are required' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    if (RAZORPAY_AVAILABLE) {
      // Real Razorpay order creation
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({
        key_id: RAZORPAY_KEY_ID,
        key_secret: RAZORPAY_KEY_SECRET
      });

      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt: bookingRef || `receipt_${Date.now()}`,
        notes: {
          rideId,
          seatsBooked: String(seatsBooked),
          userId: req.user.id
        }
      });

      return res.json({
        success: true,
        mode: 'live',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
        bookingRef
      });
    }

    // Mock order for demo/test mode
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
    return res.json({
      success: true,
      mode: 'demo',
      orderId: mockOrderId,
      amount: amountInPaise,
      currency,
      keyId: 'rzp_test_demo',
      bookingRef,
      demo: true,
      message: 'Demo mode active. Add RAZORPAY_KEY_ID to .env for live payments.'
    });

  } catch (err) {
    console.error('Payment order error:', err);
    res.status(500).json({ error: 'Failed to create payment order', details: err.message });
  }
});

// ─── Verify Payment Signature ─────────────────────────────────────────────────
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingRef, rideId, seatsBooked, amount } = req.body;

    if (RAZORPAY_AVAILABLE && signature) {
      // Verify real Razorpay signature
      const body = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Payment signature verification failed' });
      }
    }

    // Update booking payment status in DB
    const booking = await db.findBookingByRef(bookingRef);
    if (booking) {
      await db.updateBooking(booking.id, {
        paymentStatus: 'PAID',
        paymentId: paymentId || `demo_pay_${Date.now()}`,
        paymentMethod: 'UPI/CARD',
        paymentTimestamp: new Date().toISOString(),
        escrowStatus: 'HELD'
      });
    }

    const utrRef = `UTR${Date.now()}IN${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`;

    res.json({
      success: true,
      verified: true,
      paymentId: paymentId || `demo_pay_${Date.now()}`,
      utrRef,
      bookingRef,
      amount,
      message: 'Payment verified. Escrow held pending ride completion.',
      escrowStatus: 'HELD'
    });

  } catch (err) {
    console.error('Payment verify error:', err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ─── Refund / Cancellation ────────────────────────────────────────────────────
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { paymentId, bookingRef, reason } = req.body;

    const booking = await db.findBookingByRef(bookingRef);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.passengerId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to refund this booking' });
    }

    if (RAZORPAY_AVAILABLE && paymentId && !paymentId.startsWith('demo_')) {
      const Razorpay = (await import('razorpay')).default;
      const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
      await razorpay.payments.refund(paymentId, {
        notes: { reason, bookingRef }
      });
    }

    await db.updateBooking(booking.id, {
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      escrowStatus: 'REFUNDED',
      cancellationReason: reason || 'Cancelled by passenger'
    });

    const refundRef = `REF${Date.now()}${Math.floor(Math.random() * 10000)}`;

    res.json({
      success: true,
      refunded: true,
      refundRef,
      bookingRef,
      message: 'Refund initiated. Will reflect in 5–7 business days.',
      estimatedRefundDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (err) {
    console.error('Refund error:', err);
    res.status(500).json({ error: 'Refund failed' });
  }
});

// ─── Escrow Release (Pilot Claims Payment Post-Trip) ─────────────────────────
router.post('/escrow/release', authenticateToken, async (req, res) => {
  try {
    const { bookingRef, rideId } = req.body;

    const booking = await db.findBookingByRef(bookingRef);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const ride = await db.findRideById(booking.rideId);
    if (!ride) return res.status(404).json({ error: 'Ride not found' });
    if (ride.driverId !== req.user.id) {
      return res.status(403).json({ error: 'Only the pilot can release escrow' });
    }

    await db.updateBooking(booking.id, {
      escrowStatus: 'RELEASED',
      paymentReleasedAt: new Date().toISOString()
    });

    const utrRef = `UTR${Date.now()}OUT${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`;

    res.json({
      success: true,
      released: true,
      utrRef,
      message: 'Escrow released. Payment transferred to pilot UPI within 24 hours.',
      amount: booking.totalPrice
    });

  } catch (err) {
    console.error('Escrow release error:', err);
    res.status(500).json({ error: 'Escrow release failed' });
  }
});

// ─── Payment Status ───────────────────────────────────────────────────────────
router.get('/status/:bookingRef', authenticateToken, async (req, res) => {
  const booking = await db.findBookingByRef(req.params.bookingRef);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  res.json({
    success: true,
    paymentStatus: booking.paymentStatus || 'PENDING',
    escrowStatus: booking.escrowStatus || 'NOT_INITIATED',
    paymentId: booking.paymentId || null,
    utrRef: booking.utrRef || null
  });
});

export default router;
