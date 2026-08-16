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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'driveit-api',
    version: '2.0.0'
  });
});

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
    console.log(`🚀 Driveit Intercity Platform API running on http://localhost:${PORT}`);
    console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
  });
}

export { io };
export default app;
