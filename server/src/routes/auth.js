import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, ROLES } from '../config/constants.js';
import { db } from '../data/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';

const router = express.Router();

const generateToken = (user, activeRole = null) => {
  const roleToSet = activeRole || (user.roles && user.roles[0]) || ROLES.BOOKER;
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      activeRole: roleToSet
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      roles,
      accountType,
      phone,
      aadhaarNumber,
      aadhaarDocUrl,
      drivingLicenseNumber,
      drivingLicenseDocUrl,
      vehicleRcNumber,
      vehicleRcDocUrl,
      vehicle,
      vehicleMake,
      vehicleModel,
      vehiclePlate,
      vehicleColor,
      isElectric,
      bio
    } = req.body;

    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    let assignedRoles = (roles && Array.isArray(roles) && roles.length > 0)
      ? roles
      : [ROLES.BOOKER];

    if (accountType === 'pilot' || accountType === 'lister') {
      assignedRoles = [ROLES.LISTER];
    }

    const isPilot = assignedRoles.includes(ROLES.LISTER);

    const effectiveAadhaarNum = aadhaarNumber || req.body.aadhaar?.number || (isPilot ? '8921' : null);
    const effectiveAadhaarDoc = aadhaarDocUrl || req.body.aadhaar?.docUrl || (isPilot ? 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600' : null);
    const effectiveDlNum = drivingLicenseNumber || req.body.drivingLicense?.number || (isPilot ? 'MH-14-2018-0099412' : null);
    const effectiveDlDoc = drivingLicenseDocUrl || req.body.drivingLicense?.docUrl || (isPilot ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600' : null);
    const effectiveRcNum = vehicleRcNumber || vehiclePlate || req.body.vehicle?.rcNumber || req.body.vehicle?.plate || (isPilot ? 'MH-12-RN-7788' : null);
    const effectiveRcDoc = vehicleRcDocUrl || req.body.vehicle?.rcDocUrl || (isPilot ? 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600' : null);

    const vehicleObj = vehicle || (isPilot ? {
      make: vehicleMake || req.body.vehicle?.make || 'Tata',
      model: vehicleModel || req.body.vehicle?.model || 'Nexon EV Empowered',
      year: 2024,
      color: vehicleColor || req.body.vehicle?.color || 'Intensi-Teal',
      plate: effectiveRcNum,
      fuelType: isElectric ? 'ELECTRIC' : 'PETROL',
      electric: isElectric !== undefined ? Boolean(isElectric) : true
    } : null);

    const formattedAadhaar = effectiveAadhaarNum 
      ? (effectiveAadhaarNum.startsWith('XXXX') ? effectiveAadhaarNum : `XXXX-XXXX-${effectiveAadhaarNum.slice(-4)}`) 
      : null;

    const newUser = await db.createUser({
      name,
      email,
      password,
      roles: assignedRoles,
      phone: phone || '',
      bio: bio || '',
      aadhaar_number: formattedAadhaar,
      aadhaar_doc_url: effectiveAadhaarDoc,
      driving_license_number: effectiveDlNum,
      driving_license_doc_url: effectiveDlDoc,
      vehicle_rc_number: effectiveRcNum,
      vehicle_rc_doc_url: effectiveRcDoc,
      vehicle: vehicleObj,
      kyc_status: isPilot ? 'PENDING' : 'VERIFIED',
      verified: !isPilot
    });

    const token = generateToken(newUser);
    res.status(201).json({
      message: isPilot 
        ? 'Pilot account registered! Your credentials & vehicle documents have been submitted to our National Operations Desk for mandatory verification.'
        : 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        roles: newUser.roles,
        activeRole: newUser.roles[0],
        avatar: newUser.avatar,
        vehicle: newUser.vehicle,
        kyc_status: newUser.kyc_status,
        verified: newUser.verified,
        aadhaar_number: newUser.aadhaar_number,
        aadhaar_doc_url: newUser.aadhaar_doc_url,
        driving_license_number: newUser.driving_license_number,
        driving_license_doc_url: newUser.driving_license_doc_url,
        vehicle_rc_number: newUser.vehicle_rc_number,
        vehicle_rc_doc_url: newUser.vehicle_rc_doc_url,
        kyc_rejection_reason: newUser.kyc_rejection_reason || null
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let passwordMatch = false;
    if (user.password === password) {
      passwordMatch = true;
    } else {
      try {
        passwordMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        passwordMatch = false;
      }
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'Account suspended. Please contact platform support.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        activeRole: user.roles[0],
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'LOCAL',
        google_id: user.google_id || null,
        vehicle: user.vehicle,
        verified: user.verified,
        kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
        aadhaar_number: user.aadhaar_number || null,
        aadhaar_doc_url: user.aadhaar_doc_url || null,
        driving_license_number: user.driving_license_number || null,
        driving_license_doc_url: user.driving_license_doc_url || null,
        vehicle_rc_number: user.vehicle_rc_number || null,
        vehicle_rc_doc_url: user.vehicle_rc_doc_url || null,
        kyc_rejection_reason: user.kyc_rejection_reason || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google Federated Authentication (Sign In & Sign Up unified)
router.post('/google', validate(schemas.googleAuth), async (req, res) => {
  try {
    const { idToken, googleId, email, name, avatar, accountType, role, phone } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const effectiveGoogleId = googleId || `google_${Buffer.from(normalizedEmail).toString('hex').substr(0, 16)}`;

    // 1. Check if user exists by google_id OR by email
    let user = await db.findUserByGoogleId(effectiveGoogleId);
    let isNewUser = false;
    let autoLinked = false;

    if (!user) {
      const existingByEmail = await db.findUserByEmail(normalizedEmail);
      if (existingByEmail) {
        // Auto-link Google credentials to existing account
        user = await db.linkGoogleAccount(existingByEmail.id, {
          googleId: effectiveGoogleId,
          email: normalizedEmail,
          avatar: avatar || existingByEmail.avatar
        });
        autoLinked = true;
      }
    }

    // 2. If user doesn't exist, create a new user profile (Registration via Google)
    if (!user) {
      isNewUser = true;
      const isPilot = accountType === 'pilot' || accountType === 'lister' || role === 'lister';
      const assignedRoles = isPilot ? [ROLES.LISTER] : [ROLES.BOOKER];

      user = await db.createUser({
        name: name || 'Google Member',
        email: normalizedEmail,
        googleId: effectiveGoogleId,
        authProvider: 'GOOGLE',
        roles: assignedRoles,
        phone: phone || '',
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        verified: !isPilot,
        kyc_status: isPilot ? 'PENDING' : 'VERIFIED'
      });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'Account suspended. Please contact platform support.' });
    }

    const token = generateToken(user);
    res.json({
      message: isNewUser ? 'Google account created successfully' : autoLinked ? 'Google account linked and logged in' : 'Google login successful',
      token,
      isNewUser,
      autoLinked,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        activeRole: user.roles[0],
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'GOOGLE',
        google_id: user.google_id || effectiveGoogleId,
        vehicle: user.vehicle,
        verified: user.verified,
        kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
        aadhaar_number: user.aadhaar_number || null,
        aadhaar_doc_url: user.aadhaar_doc_url || null,
        driving_license_number: user.driving_license_number || null,
        driving_license_doc_url: user.driving_license_doc_url || null,
        vehicle_rc_number: user.vehicle_rc_number || null,
        vehicle_rc_doc_url: user.vehicle_rc_doc_url || null,
        kyc_rejection_reason: user.kyc_rejection_reason || null
      }
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// Link Google account to active session
router.post('/google/link', authenticateToken, validate(schemas.googleAuth), async (req, res) => {
  try {
    const { googleId, email, avatar } = req.body;
    const effectiveGoogleId = googleId || `google_${Buffer.from(email).toString('hex').substr(0, 16)}`;

    const updatedUser = await db.linkGoogleAccount(req.user.id, {
      googleId: effectiveGoogleId,
      email,
      avatar
    });

    res.json({
      message: 'Google account linked successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Google link error:', err);
    res.status(500).json({ error: 'Failed to link Google account' });
  }
});

// ============================================================================
// MOBILE PHONE OTP AUTHENTICATION
// ============================================================================

// 1. Send OTP via SMS
router.post('/otp/send', validate(schemas.sendOtp), async (req, res) => {
  try {
    const { phone } = req.body;
    const cleanPhone = phone.replace(/[\s\-]/g, '');

    // Generate random 6-digit numeric OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Cache hashed OTP in database service (5-min TTL)
    db.saveOtp(cleanPhone, rawOtp);

    console.log(`\n==================================================`);
    console.log(`📱 [SMS GATEWAY SIMULATION]`);
    console.log(`To: ${cleanPhone}`);
    console.log(`Message: Your DriveIT verification code is ${rawOtp}. Valid for 5 minutes.`);
    console.log(`==================================================\n`);

    res.json({
      message: 'OTP verification code sent successfully',
      phone: cleanPhone,
      expiresIn: 300
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ error: 'Failed to dispatch verification SMS' });
  }
});

// 2. Verify OTP and Sign In / Register
router.post('/otp/verify', validate(schemas.verifyOtp), async (req, res) => {
  try {
    const { phone, otp, name, accountType, role } = req.body;
    const cleanPhone = phone.replace(/[\s\-]/g, '');

    const verifyResult = db.verifyOtp(cleanPhone, otp);
    if (!verifyResult.success) {
      return res.status(400).json({ error: verifyResult.error });
    }

    // Lookup user by phone
    let user = await db.findUserByPhone(cleanPhone);
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const isPilot = accountType === 'pilot' || accountType === 'lister' || role === 'lister';
      const assignedRoles = isPilot ? [ROLES.LISTER] : [ROLES.BOOKER];
      const standardPhone = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone.slice(-10)}`;
      const syntheticEmail = `${standardPhone.replace('+', '')}@phone.driveit.in`;

      user = await db.createUser({
        name: name || `Commuter ${cleanPhone.slice(-4)}`,
        email: syntheticEmail,
        phone: standardPhone,
        authProvider: 'PHONE',
        roles: assignedRoles,
        avatar: isPilot 
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' 
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        verified: !isPilot,
        kyc_status: isPilot ? 'PENDING' : 'VERIFIED'
      });
    }

    if (user.banned) {
      return res.status(403).json({ error: 'Account suspended. Please contact platform support.' });
    }

    const token = generateToken(user);

    res.json({
      message: isNewUser ? 'Mobile account registered successfully' : 'Phone login successful',
      token,
      isNewUser,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        activeRole: user.roles[0],
        avatar: user.avatar,
        auth_provider: user.auth_provider || 'PHONE',
        vehicle: user.vehicle,
        verified: user.verified,
        kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
        aadhaar_number: user.aadhaar_number || null,
        aadhaar_doc_url: user.aadhaar_doc_url || null,
        driving_license_number: user.driving_license_number || null,
        driving_license_doc_url: user.driving_license_doc_url || null,
        vehicle_rc_number: user.vehicle_rc_number || null,
        vehicle_rc_doc_url: user.vehicle_rc_doc_url || null,
        kyc_rejection_reason: user.kyc_rejection_reason || null
      }
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      activeRole: req.user.activeRole || user.roles[0],
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      verified: Boolean(user.verified),
      kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
      kyc_rejection_reason: user.kyc_rejection_reason || null,
      aadhaar_number: user.aadhaar_number || null,
      aadhaar_doc_url: user.aadhaar_doc_url || null,
      driving_license_number: user.driving_license_number || null,
      driving_license_doc_url: user.driving_license_doc_url || null,
      vehicle_rc_number: user.vehicle_rc_number || null,
      vehicle_rc_doc_url: user.vehicle_rc_doc_url || null,
      vehicle: user.vehicle
    });
  } catch (err) {
    console.error('Error in /me:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update User Profile
router.patch('/profile', authenticateToken, validate(schemas.updateProfile), async (req, res) => {
  try {
    const { name, avatar, phone, bio, emergencyContact } = req.body;
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updatedUser = await db.updateUser(user.id, {
      name: name || user.name,
      avatar: avatar || user.avatar,
      phone: phone || user.phone,
      bio: bio !== undefined ? bio : user.bio,
      emergencyContact: emergencyContact || user.emergencyContact
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Switch active role
router.post('/switch-role', authenticateToken, async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.roles.includes(targetRole) && !user.roles.includes(ROLES.ADMIN)) {
      return res.status(400).json({ error: `User does not possess role: ${targetRole}` });
    }

    const token = generateToken(user, targetRole);
    res.json({
      message: `Switched active role to ${targetRole}`,
      token,
      activeRole: targetRole
    });
  } catch (err) {
    console.error('Role switch error:', err);
    res.status(500).json({ error: 'Failed to switch role' });
  }
});

// Demo accounts
router.get('/demo-users', async (req, res) => {
  try {
    const users = await db.getUsers();
    const all = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roles: u.roles,
      bio: u.bio,
      avatar: u.avatar,
      vehicle: u.vehicle,
      rating: u.rating,
      banned: u.banned
    }));
    res.json(all);
  } catch (err) {
    console.error('Error fetching demo users:', err);
    res.status(500).json({ error: 'Failed to fetch demo users' });
  }
});

// Demo quick-login
router.post('/demo-login', async (req, res) => {
  try {
    const target = req.body.userId || req.body.email || req.body.id;
    let user = null;
    if (target) {
      user = (await db.findUserById(target)) || (await db.findUserByEmail(target));
    }

    if (!user) {
      return res.status(404).json({ error: 'Demo user not found.' });
    }

    const token = generateToken(user);
    res.json({
      message: `Logged in as demo user ${user.name}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        activeRole: user.roles[0],
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        verified: Boolean(user.verified),
        kyc_status: user.kyc_status || (user.verified ? 'VERIFIED' : 'PENDING'),
        aadhaar_number: user.aadhaar_number || null,
        driving_license_number: user.driving_license_number || null,
        vehicle_rc_number: user.vehicle_rc_number || null,
        vehicle: user.vehicle
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Demo login failed' });
  }
});

export default router;
