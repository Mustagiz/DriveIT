import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rideshare_token') || null);
  const [activeRole, setActiveRole] = useState(localStorage.getItem('rideshare_active_role') || 'booker');
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  // Fetch current user details on load
  useEffect(() => {
    fetchDemoUsers();
    if (token) {
      fetchCurrentUser(token);
    } else {
      // Default to rider Alex as demo starter if unauthenticated
      setLoading(false);
    }
  }, [token]);

  const fetchDemoUsers = async () => {
    try {
      const res = await fetch('/api/auth/demo-users');
      if (res.ok) {
        const data = await res.json();
        setDemoUsers(data);
      }
    } catch (err) {
      console.warn('Could not fetch demo users:', err);
    }
  };

  const fetchCurrentUser = async (authToken) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        const role = data.activeRole || (data.roles && data.roles[0]) || 'booker';
        setActiveRole(role);
        localStorage.setItem('rideshare_active_role', role);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    localStorage.setItem('rideshare_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setActiveRole(data.user.activeRole || data.user.roles[0]);
    localStorage.setItem('rideshare_active_role', data.user.activeRole || data.user.roles[0]);
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }
    localStorage.setItem('rideshare_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setActiveRole(data.user.activeRole || data.user.roles[0]);
    localStorage.setItem('rideshare_active_role', data.user.activeRole || data.user.roles[0]);
    return data.user;
  };

  const loginWithGoogle = async (googlePayload) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Google authentication failed');
    }
    localStorage.setItem('rideshare_token', data.token);
    setToken(data.token);
    setUser(data.user);
    const role = data.user.activeRole || data.user.roles[0] || 'booker';
    setActiveRole(role);
    localStorage.setItem('rideshare_active_role', role);
    return data;
  };

  const linkGoogleAccount = async (googlePayload) => {
    const res = await fetch('/api/auth/google/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(googlePayload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to link Google account');
    }
    setUser(data.user);
    return data.user;
  };

  const loginAsDemo = async (userId) => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('rideshare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      const role = data.user.activeRole || data.user.roles[0];
      setActiveRole(role);
      localStorage.setItem('rideshare_active_role', role);
      return data.user;
    } catch (err) {
      console.error('Demo login error:', err);
      throw err;
    }
  };

  const switchActiveRole = async (targetRole) => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ targetRole })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('rideshare_token', data.token);
        setToken(data.token);
        setActiveRole(targetRole);
        localStorage.setItem('rideshare_active_role', targetRole);
        if (user) {
          setUser({ ...user, activeRole: targetRole });
        }
      }
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const updateProfile = async (updates) => {
    if (!token) {
      if (user) {
        const updated = { ...user, ...updates };
        setUser(updated);
        return updated;
      }
      return;
    }
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      if (data.user) {
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      if (user) {
        const updated = { ...user, ...updates };
        setUser(updated);
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('rideshare_token');
    localStorage.removeItem('rideshare_active_role');
    setToken(null);
    setUser(null);
    setActiveRole('booker');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        activeRole,
        loading,
        demoUsers,
        login,
        register,
        loginWithGoogle,
        linkGoogleAccount,
        loginAsDemo,
        switchActiveRole,
        updateProfile,
        logout,
        isAuthenticated: !!token && !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
