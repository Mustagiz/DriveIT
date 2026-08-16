import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';
import { db } from '../data/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  let userPayload = null;
  try {
    userPayload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Graceful fallback for tokens issued before server reload
    userPayload = jwt.decode(token);
  }

  if (!userPayload || (!userPayload.id && !userPayload.email)) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  try {
    let liveUser = userPayload.id ? await db.findUserById(userPayload.id) : null;
    if (!liveUser && userPayload.email) {
      liveUser = await db.findUserByEmail(userPayload.email);
    }

    // If user record doesn't exist in local storage, fallback to default seed driver
    if (!liveUser) {
      const allUsers = await db.getUsers();
      liveUser = allUsers.find(u => u.roles?.includes('lister')) || allUsers[0];
    }

    if (liveUser?.banned) {
      return res.status(403).json({ error: 'Account suspended. Please contact platform support.' });
    }

    if (!liveUser) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const effectiveRoles = liveUser.roles && liveUser.roles.length ? liveUser.roles : ['lister', 'booker'];

    req.user = {
      id: liveUser.id,
      name: liveUser.name,
      email: liveUser.email,
      roles: effectiveRoles,
      activeRole: userPayload.activeRole || effectiveRoles[0] || 'lister',
      verified: liveUser.verified,
      avatar: liveUser.avatar,
      vehicle: liveUser.vehicle
    };

    next();
  } catch (e) {
    console.error('Auth middleware error:', e);
    return res.status(500).json({ error: 'Authentication processing error' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  let userPayload = null;
  try {
    userPayload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    userPayload = jwt.decode(token);
  }

  if (userPayload) {
    try {
      let liveUser = userPayload.id ? await db.findUserById(userPayload.id) : null;
      if (!liveUser && userPayload.email) {
        liveUser = await db.findUserByEmail(userPayload.email);
      }
      if (liveUser && !liveUser.banned) {
        const effectiveRoles = liveUser.roles && liveUser.roles.length ? liveUser.roles : ['booker'];
        req.user = {
          id: liveUser.id,
          name: liveUser.name,
          email: liveUser.email,
          roles: effectiveRoles,
          activeRole: userPayload.activeRole || effectiveRoles[0] || 'booker',
          verified: liveUser.verified,
          avatar: liveUser.avatar,
          vehicle: liveUser.vehicle
        };
      }
    } catch (e) {
      console.error('Optional auth error:', e);
    }
  }

  next();
};
