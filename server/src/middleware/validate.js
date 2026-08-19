import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: result.error.flatten()
      });
    }
    req.query = result.data;
    next();
  };
};

export const schemas = {
  register: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roles: z.array(z.string()).optional(),
    accountType: z.string().optional(),
    phone: z.string().optional(),
    aadhaarNumber: z.string().optional(),
    aadhaarDocUrl: z.string().optional(),
    drivingLicenseNumber: z.string().optional(),
    drivingLicenseDocUrl: z.string().optional(),
    vehicleRcNumber: z.string().optional(),
    vehicleRcDocUrl: z.string().optional(),
    vehicle: z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      year: z.coerce.number().optional(),
      color: z.string().optional(),
      plate: z.string().optional(),
      fuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
      electric: z.boolean().optional()
    }).optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehiclePlate: z.string().optional(),
    vehicleColor: z.string().optional(),
    vehicleFuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
    isElectric: z.boolean().optional(),
    bio: z.string().optional()
  }),

  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  }),

  googleAuth: z.object({
    idToken: z.string().optional(),
    googleId: z.string().optional(),
    email: z.string().email('Invalid Google account email'),
    name: z.string().min(1, 'Name is required'),
    avatar: z.string().optional(),
    accountType: z.enum(['passenger', 'pilot', 'booker', 'lister']).optional(),
    role: z.string().optional(),
    phone: z.string().optional()
  }),

  sendOtp: z.object({
    phone: z.string().min(10, 'Valid 10-digit mobile number is required')
  }),

  verifyOtp: z.object({
    phone: z.string().min(10, 'Valid mobile number is required'),
    otp: z.string().min(4, 'Verification code is required'),
    name: z.string().optional(),
    accountType: z.enum(['passenger', 'pilot', 'booker', 'lister']).optional(),
    role: z.string().optional()
  }),

  updateProfile: z.object({
    name: z.string().min(2).optional(),
    avatar: z.string().url().optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    emergencyContact: z.string().optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  }),

  createRide: z.object({
    originCity: z.string().min(1),
    originAddress: z.string().optional().or(z.literal('')),
    destinationCity: z.string().min(1),
    destinationAddress: z.string().optional().or(z.literal('')),
    waypoints: z.array(z.string()).optional(),
    departureDate: z.string().min(1),
    departureTime: z.string().min(1),
    estimatedDurationHours: z.coerce.number().optional(),
    distanceKm: z.coerce.number().optional(),
    distanceMiles: z.coerce.number().optional(),
    pricePerSeat: z.coerce.number(),
    totalSeats: z.coerce.number(),
    vehicle: z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      plate: z.string().optional(),
      color: z.string().optional(),
      fuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
      electric: z.boolean().optional()
    }).optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehiclePlate: z.string().optional(),
    vehicleFuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
    isElectric: z.boolean().optional(),
    amenities: z.object({
      ac: z.boolean().optional(),
      luggage: z.string().optional(),
      petsAllowed: z.boolean().optional(),
      smokingAllowed: z.boolean().optional(),
      musicAllowed: z.boolean().optional(),
      instantBook: z.boolean().optional(),
      fastagIncluded: z.boolean().optional()
    }).optional(),
    luggage: z.string().optional(),
    notes: z.string().optional()
  }),

  createBooking: z.object({
    rideId: z.string().min(1),
    seats: z.coerce.number().int().positive().max(8).optional().default(1),
    pickupLocation: z.string().optional().nullable(),
    dropoffLocation: z.string().optional().nullable(),
    unitPrice: z.coerce.number().optional().nullable(),
    totalPrice: z.coerce.number().optional().nullable(),
    pickupStopIndex: z.coerce.number().optional().nullable(),
    dropoffStopIndex: z.coerce.number().optional().nullable(),
    isPartial: z.boolean().optional().nullable(),
    segmentDistanceKm: z.coerce.number().optional().nullable(),
    note: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    rideDetails: z.record(z.any()).optional().nullable()
  }),

  rateRide: z.object({
    bookingId: z.string().optional(),
    overallRating: z.coerce.number().int().min(1).max(5),
    safetyRating: z.coerce.number().int().min(1).max(5).optional(),
    cleanlinessRating: z.coerce.number().int().min(1).max(5).optional(),
    punctualityRating: z.coerce.number().int().min(1).max(5).optional(),
    comfortRating: z.coerce.number().int().min(1).max(5).optional(),
    comment: z.string().max(500).optional()
  }),

  createReport: z.object({
    bookingId: z.string().optional(),
    reportedUserId: z.string().optional(),
    category: z.string().min(1),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    evidenceUrl: z.string().url().optional()
  }),

  createMessage: z.object({
    message: z.string().min(1, 'Message cannot be empty'),
    recipientId: z.string().optional()
  }),

  createBanner: z.object({
    title: z.string().min(1),
    tagline: z.string().optional(),
    badge: z.string().optional(),
    description: z.string().optional(),
    active: z.boolean().optional()
  }),

  calculatePricing: z.object({
    distanceKm: z.coerce.number().positive(),
    fuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
    isElectric: z.boolean().optional(),
    corridor: z.string().optional()
  }),

  updateKyc: z.object({
    fullName: z.string().min(2).optional(),
    aadhaarNumber: z.string().min(4).optional(),
    drivingLicenseNumber: z.string().optional(),
    drivingLicenseDocUrl: z.string().optional(),
    vehicleRcNumber: z.string().optional(),
    aadhaarDocUrl: z.string().optional(),
    vehicleRcDocUrl: z.string().optional(),
    passportPhotoUrl: z.string().optional(),
    vehiclePlate: z.string().optional(),
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehicleColor: z.string().optional(),
    vehicleFuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
    isElectric: z.boolean().optional(),
    vehicleDetails: z.object({
      make: z.string().optional(),
      model: z.string().optional(),
      plate: z.string().optional(),
      color: z.string().optional(),
      fuelType: z.enum(['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'HYBRID']).or(z.string()).optional(),
      electric: z.boolean().optional()
    }).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one KYC field must be provided'
  })
};
