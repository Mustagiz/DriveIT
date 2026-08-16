import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { PORT, NODE_ENV } from './config/constants.js';
import { corsMiddleware, securityHeaders, authLimiter, generalLimiter } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import ridesRoutes from './routes/rides.js';
import listerRoutes from './routes/lister.js';
import bookerRoutes from './routes/booker.js';
import adminRoutes from './routes/admin.js';
import bannersRoutes from './routes/banners.js';
import chatRoutes from './routes/chat.js';
import pricingRoutes from './routes/pricing.js';
import geocodeRoutes from './routes/geocode.js';
import kycRoutes from './routes/kyc.js';
import paymentsRoutes from './routes/payments.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import routingRoutes from './routes/routing.js';
import trustRoutes from './routes/trust.js';
import { setupSocket } from './socket.js';

const app = express();

app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/api/auth', authLimiter);
app.use(generalLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ─── Core Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rides', ridesRoutes);
app.use('/api/lister', listerRoutes);
app.use('/api/booker', bookerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/banners', bannersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/kyc', kycRoutes);

// ─── New v3.0 Routes ──────────────────────────────────────────────────────────
app.use('/api/payments', paymentsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/routing', routingRoutes);
app.use('/api/trust', trustRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'driveit-api',
    version: '3.0.0',
    features: [
      'real-time-gps-tracking',
      'ai-pricing-engine',
      'razorpay-payments',
      'trust-safety-scores',
      'carpool-subscriptions',
      'osrm-routing',
      'multi-city-corridors'
    ]
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const server = createServer(app);
const io = setupSocket(server);

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Driveit v3.0 Platform API running on http://localhost:${PORT}`);
    console.log(`🗺️  Real-time GPS tracking: Socket.io ready`);
    console.log(`💰 AI Pricing Engine: NHAI toll data loaded`);
    console.log(`🛡️  Trust & Safety Scoring: active`);
    console.log(`🚦 OSRM Routing: live`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  });
}

export { io };
export default app;
