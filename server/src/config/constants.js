export const JWT_SECRET = process.env.JWT_SECRET || 'driveit_super_secure_jwt_secret_2026_dev_key';
export const PORT = process.env.PORT || 5050;
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const ROLES = {
  BOOKER: 'booker',
  LISTER: 'lister',
  SUPPORT: 'support',
  ADMIN: 'admin'
};

export const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
  HYBRID: 'HYBRID'
};

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'driveit-google-oauth-client.apps.googleusercontent.com';

export const FUEL_TYPES = {
  ELECTRIC: 'ELECTRIC',
  PETROL: 'PETROL',
  DIESEL: 'DIESEL',
  CNG: 'CNG',
  HYBRID: 'HYBRID'
};

export const RIDE_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  FULL: 'FULL'
};

export const BOOKING_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

if (!JWT_SECRET && NODE_ENV !== 'test') {
  console.warn('⚠️  JWT_SECRET is not set. Using default fallback. Set JWT_SECRET in production.');
}
