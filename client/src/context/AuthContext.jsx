import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rideshare_token') || null);
  const [activeRole, setActiveRole] = useState(localStorage.getItem('rideshare_active_role') || 'booker');
  const [loading, setLoading] = useState(true);
  const [demoUsers, setDemoUsers] = useState([]);

  // Fetch current user details on initial mount only
  useEffect(() => {
    fetchDemoUsers();
    const savedToken = localStorage.getItem('rideshare_token');
    const savedUser = localStorage.getItem('rideshare_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        const role = parsed.activeRole || parsed.roles?.[0] || 'booker';
        setActiveRole(role);
      } catch (e) {
        console.warn('Could not parse cached user:', e);
      }
    }
    if (savedToken) {
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

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
        localStorage.setItem('rideshare_user', JSON.stringify(data));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
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
    const role = data.user.activeRole || data.user.roles[0];
    localStorage.setItem('rideshare_token', data.token);
    localStorage.setItem('rideshare_active_role', role);
    localStorage.setItem('rideshare_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setActiveRole(role);
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
    const role = data.user.activeRole || data.user.roles[0];
    localStorage.setItem('rideshare_token', data.token);
    localStorage.setItem('rideshare_active_role', role);
    localStorage.setItem('rideshare_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setActiveRole(role);
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
    const role = data.user.activeRole || data.user.roles[0] || 'booker';
    localStorage.setItem('rideshare_token', data.token);
    localStorage.setItem('rideshare_active_role', role);
    localStorage.setItem('rideshare_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setActiveRole(role);
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
    localStorage.setItem('rideshare_user', JSON.stringify(data.user));
    return data.user;
  };

  const DEMO_FALLBACK_PROFILES = {
    usr_rahul_driver: { id: 'usr_rahul_driver', name: 'Rahul Sharma', email: 'rahul@driveit.in', roles: ['lister'], activeRole: 'lister', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', verified: true, kyc_status: 'VERIFIED' },
    usr_vikram_pending: { id: 'usr_vikram_pending', name: 'Vikram Joshi', email: 'vikram@driveit.in', roles: ['lister'], activeRole: 'lister', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', verified: false, kyc_status: 'PENDING' },
    usr_ananya_rider: { id: 'usr_ananya_rider', name: 'Ananya Sen', email: 'ananya@driveit.in', roles: ['booker'], activeRole: 'booker', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', verified: true, kyc_status: 'VERIFIED' },
    usr_priya_driver: { id: 'usr_priya_driver', name: 'Priya Menon', email: 'priya@driveit.in', roles: ['lister'], activeRole: 'lister', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', verified: true, kyc_status: 'VERIFIED' },
    usr_aman_support: { id: 'usr_aman_support', name: 'Aman Verma', email: 'aman@driveit.in', roles: ['support', 'admin'], activeRole: 'support', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', verified: true, kyc_status: 'VERIFIED' },
    usr_rohan_dual: { id: 'usr_rohan_dual', name: 'Rohan Kapoor', email: 'rohan@driveit.in', roles: ['lister', 'booker'], activeRole: 'lister', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', verified: true, kyc_status: 'VERIFIED' }
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

      const role = data.user.activeRole || data.user.roles[0];
      localStorage.setItem('rideshare_token', data.token);
      localStorage.setItem('rideshare_active_role', role);
      localStorage.setItem('rideshare_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setActiveRole(role);
      return data.user;
    } catch (err) {
      console.warn('Demo API fallback triggered:', err.message);
      const fallbackUser = DEMO_FALLBACK_PROFILES[userId] || DEMO_FALLBACK_PROFILES.usr_rahul_driver;
      const fakeToken = `demo_token_${fallbackUser.id}_${Date.now()}`;
      localStorage.setItem('rideshare_token', fakeToken);
      localStorage.setItem('rideshare_active_role', fallbackUser.activeRole);
      localStorage.setItem('rideshare_user', JSON.stringify(fallbackUser));
      setToken(fakeToken);
      setUser(fallbackUser);
      setActiveRole(fallbackUser.activeRole);
      return fallbackUser;
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
    localStorage.removeItem('rideshare_user');
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
