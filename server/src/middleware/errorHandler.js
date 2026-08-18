import { logger } from '../utils/logger.js';
import { NODE_ENV } from '../config/constants.js';

export const errorHandler = (err, req, res, next) => {
  const requestId = req.id || 'unknown_req';
  const statusCode = err.status || err.statusCode || 500;

  // Log detailed error internally
  logger.error(`[Unhandled API Error] ${req.method} ${req.originalUrl} - Code: ${statusCode}`, {
    requestId,
    error: err.message,
    stack: err.stack,
    ip: req.ip
  });

  // Client response (scrub internal details in production)
  const isProduction = NODE_ENV === 'production';
  const clientResponse = {
    success: false,
    error: err.code || (statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
    message: isProduction && statusCode >= 500
      ? 'An unexpected error occurred. Please try again or contact support.'
      : err.message || 'Server error',
    requestId,
    timestamp: new Date().toISOString()
  };

  if (!isProduction && err.stack) {
    clientResponse.debug = { stack: err.stack };
  }

  res.status(statusCode).json(clientResponse);
};

export default errorHandler;
