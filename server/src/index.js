import express from 'express';
import compression from 'compression';
import { createServer } from 'http';
import { PORT, NODE_ENV } from './config/constants.js';
import { corsMiddleware, securityHeaders, authLimiter, generalLimiter, requestIdMiddleware } from './middleware/security.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { pushService } from './services/pushService.js';
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
import legalRoutes from './routes/legal.js';
import { setupSocket } from './socket.js';

const app = express();

// ─── Production Middleware Pipeline ───────────────────────────────────────────
app.use(requestIdMiddleware);
app.use(compression());
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/api/auth', authLimiter);
app.use(generalLimiter);

// Structured Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (NODE_ENV !== 'test') {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`, {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: duration
      });
    }
  });
  next();
});

// ─── Core & Feature Routes ───────────────────────────────────────────────────
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
app.use('/api/payments', paymentsRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/routing', routingRoutes);
app.use('/api/trust', trustRoutes);
app.use('/api/legal', legalRoutes);

// ─── WebPush Public Key Endpoint ─────────────────────────────────────────────
app.get('/api/push/vapid-key', (req, res) => {
  res.json({
    publicKey: pushService.getPublicKey()
  });
});

app.post('/api/push/subscribe', (req, res) => {
  const { userId, subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription payload required' });
  }
  pushService.saveSubscription(userId || 'anonymous_guest', subscription);
  res.json({ success: true, message: 'WebPush subscription registered' });
});

// ─── Comprehensive System Diagnostics Health Check ───────────────────────────
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'driveit-api',
    version: '3.1.0',
    environment: NODE_ENV,
    uptimeSeconds: Math.round(process.uptime()),
    memory: {
      heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      rssMB: Math.round(memoryUsage.rss / 1024 / 1024)
    },
    features: {
      realTimeGpsTracking: 'ENABLED',
      aiPricingEngine: 'ENABLED',
      razorpayGateway: 'READY (Sandbox/Live Adaptable)',
      smsOtpGateway: 'READY (MSG91/Fast2SMS Adaptable)',
      digiLockerKyc: 'ENABLED',
      antiCollisionPhysics: 'ACTIVE',
      oneActiveTripPolicy: 'ENFORCED'
    }
  });
});

// ─── Standardized Production Error Handler ────────────────────────────────────
app.use(errorHandler);

const server = createServer(app);
const io = setupSocket(server);

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    logger.info(`🚀 DriveIT v3.1.0 Platform API online on http://localhost:${PORT}`);
    logger.info(`🗺️  Corridor collision physics engine: ACTIVE`);
    logger.info(`🛡️  Trust & Safety Aadhaar KYC: ACTIVE`);
    logger.info(`📋 Healthcheck diagnostics: http://localhost:${PORT}/api/health`);
  });
}

export { io };
export default app;
