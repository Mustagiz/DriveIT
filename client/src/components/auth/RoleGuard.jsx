import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UnauthorizedFallback from './UnauthorizedFallback';

export default function RoleGuard({ 
  allowedRoles = [], 
  requireAuth = true,
  children, 
  onNavigate,
  fallback 
}) {
  const { user, isAuthenticated, activeRole } = useAuth();

  if (requireAuth && (!isAuthenticated || !user)) {
    return fallback || (
      <UnauthorizedFallback 
        reason="UNAUTHENTICATED" 
        onNavigate={onNavigate} 
      />
    );
  }

  if (allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    
    // Admins always have access
    const isAdmin = userRoles.includes('admin');
    
    // Check if user has one of allowed roles or if their active view matches
    const hasRole = isAdmin || allowedRoles.some(role => userRoles.includes(role) || activeRole === role);

    if (!hasRole) {
      return fallback || (
        <UnauthorizedFallback 
          reason="FORBIDDEN" 
          requiredRoles={allowedRoles} 
          onNavigate={onNavigate} 
        />
      );
    }
  }

  return children;
}
