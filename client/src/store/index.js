import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Auth Store ─────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      activeRole: 'booker',
      trustScore: null,

      setAuth: (user, token) => set({
        user,
        token,
        activeRole: user?.activeRole || user?.roles?.[0] || 'booker'
      }),

      updateUser: (updates) => set(state => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      setTrustScore: (score) => set({ trustScore: score }),

      setActiveRole: (role) => set(state => ({
        activeRole: role,
        user: state.user ? { ...state.user, activeRole: role } : null
      })),

      logout: () => set({ user: null, token: null, activeRole: 'booker', trustScore: null }),

      isAuthenticated: () => !!get().token,
      isPilot: () => get().user?.roles?.includes('lister') || false,
      isAdmin: () => get().user?.roles?.includes('admin') || false,
    }),
    {
      name: 'driveit-auth',
      partialize: (state) => ({ user: state.user, token: state.token, activeRole: state.activeRole })
    }
  )
);

// ─── Ride Store ─────────────────────────────────────────────────────────────
export const useRideStore = create((set, get) => ({
  rides: [],
  searchFilters: {
    origin: '',
    destination: '',
    date: '',
    seats: 1
  },
  selectedRide: null,
  bookingStatus: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  bookingResult: null,

  // Search filters
  setSearchFilters: (filters) => set(state => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),

  clearSearchFilters: () => set({
    searchFilters: { origin: '', destination: '', date: '', seats: 1 }
  }),

  // Rides
  setRides: (rides) => set({ rides }),
  addRide: (ride) => set(state => ({ rides: [ride, ...state.rides] })),
  updateRide: (rideId, updates) => set(state => ({
    rides: state.rides.map(r => r.id === rideId ? { ...r, ...updates } : r)
  })),

  // Selected ride
  setSelectedRide: (ride) => set({ selectedRide: ride }),
  clearSelectedRide: () => set({ selectedRide: null }),

  // Booking flow
  setBookingStatus: (status, result = null) => set({
    bookingStatus: status,
    bookingResult: result
  }),

  // GPS state
  gpsPosition: null,
  isTracking: false,
  setGpsPosition: (position) => set({ gpsPosition: position, isTracking: true }),
  stopTracking: () => set({ gpsPosition: null, isTracking: false })
}));

// ─── Pricing Store ──────────────────────────────────────────────────────────
export const usePricingStore = create((set) => ({
  currentQuote: null,
  loading: false,
  corridors: [],

  setQuote: (quote) => set({ currentQuote: quote }),
  setLoading: (loading) => set({ loading }),
  setCorridors: (corridors) => set({ corridors }),

  fetchQuote: async ({ distanceKm, fuelType, origin, destination, seatsBooked }) => {
    set({ loading: true });
    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distanceKm, fuelType, origin, destination, seatsBooked })
      });
      const data = await res.json();
      if (data.success) {
        set({ currentQuote: data.pricing, loading: false });
        return data.pricing;
      }
    } catch (err) {
      console.error('Pricing fetch failed:', err);
    }
    set({ loading: false });
    return null;
  }
}));

// ─── Notification Store ──────────────────────────────────────────────────────
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => set(state => ({
    notifications: [
      { id: Date.now(), read: false, timestamp: new Date().toISOString(), ...notification },
      ...state.notifications
    ].slice(0, 50), // Keep last 50
    unreadCount: state.unreadCount + 1
  })),

  markAllRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),

  markRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  clearAll: () => set({ notifications: [], unreadCount: 0 })
}));
