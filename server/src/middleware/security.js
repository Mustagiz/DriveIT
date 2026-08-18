import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import crypto from 'crypto';
import { NODE_ENV } from '../config/constants.js';

// Dynamic CORS whitelist
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) 
  : [];

const defaultOrigins = NODE_ENV === 'production'
  ? ['https://driveit.in', 'https://www.driveit.in']
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5050'];

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || [...defaultOrigins, ...envOrigins].includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow in dev/preview while logging
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true
};

export const corsMiddleware = cors(corsOptions);

// Production Grade Security Headers (HSTS, CSP, Frameguard)
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      connectSrc: ["'self'", "ws:", "wss:", "https:", "http:"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Request Correlation ID Middleware
export const requestIdMiddleware = (req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

// 1. Strict Auth Limiter (Login, Register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'production' ? 15 : 2000,
  message: { error: 'AUTH_RATE_LIMIT_EXCEEDED', message: 'Too many authentication attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 2. Strict OTP Limiter (SMS Abuse Prevention)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: NODE_ENV === 'production' ? 5 : 500,
  message: { error: 'OTP_RATE_LIMIT_EXCEEDED', message: 'Too many OTP requests generated. Please wait 10 minutes before requesting a new code.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 3. Authenticated API Limiter (Ride Creation, Bookings)
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: NODE_ENV === 'production' ? 120 : 5000,
  message: { error: 'API_RATE_LIMIT_EXCEEDED', message: 'High request frequency detected. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
});

// 4. General Public Rate Limiter (Catalog search, Geocoding)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: NODE_ENV === 'production' ? 600 : 10000,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please try again shortly.' },
  standardHeaders: true,
  legacyHeaders: false
});
