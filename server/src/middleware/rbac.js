import { ROLES } from '../config/constants.js';

export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles || [];

    // Admins always have access to everything
    if (userRoles.includes(ROLES.ADMIN)) {
      return next();
    }

    // Check if user has at least one of the allowed roles
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        error: `Forbidden: Access restricted to roles [${allowedRoles.join(', ')}]. Your roles: [${userRoles.join(', ')}]`,
        requiredRoles: allowedRoles,
        userRoles
      });
    }

    next();
  };
};
