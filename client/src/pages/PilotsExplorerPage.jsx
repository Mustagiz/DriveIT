import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Navigation, MapPin, ArrowRightLeft, Sparkles, Filter, 
  Calendar, Clock, ShieldCheck, Star, Users, Zap, Fuel, 
  CheckCircle2, ArrowRight, ArrowLeft, SlidersHorizontal, 
  IndianRupee, Car, Info, X, ShieldAlert, Award, Compass
} from 'lucide-react';
import SpotlightCard from '../components/ui/SpotlightCard';
import ShinyText from '../components/ui/ShinyText';
import ScheduleDropdownPicker from '../components/ScheduleDropdownPicker';
import LocationAutocompleteInput from '../components/LocationAutocompleteInput';
import RideRequestModal from '../components/RideRequestModal';
import EmergencySOSModal from '../components/EmergencySOSModal';
import ActiveTripRestrictionModal from '../components/ActiveTripRestrictionModal';
import { getActivePassengerTrip } from '../utils/activeTripGuard';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatTime, formatDateTime } from '../utils/dateTime';
import { useRealtimeRides } from '../utils/useSocket';

// Reliable Avatar Component with Fallbacks & Initials
function PilotAvatar({ src, name, size = 52 }) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n) => {
    if (!n) return 'P';
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const getGradient = (n) => {
    const gradients = [
      'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
      'linear-gradient(135deg, #10B981, #059669)',
      'linear-gradient(135deg, #38BDF8, #0284C7)',
      'linear-gradient(135deg, #8B5CF6, #6D28D9)',
      'linear-gradient(135deg, #EC4899, #BE185D)'
    ];
    let hash = 0;
    for (let i = 0; i < (n || '').length; i++) hash += n.charCodeAt(i);
    return gradients[Math.abs(hash) % gradients.length];
  };

  const isValidUrl = src && typeof src === 'string' && src.startsWith('http') && !imgError;

  return (
    <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}>
      {isValidUrl ? (
        <img
          src={src}
          alt={name || 'Pilot'}
          onError={() => setImgError(true)}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '16px',
            objectFit: 'cover',
            border: '2px solid rgba(132, 204, 22, 0.4)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
      ) : (
        <div style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '16px',
          background: getGradient(name),
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontSize: `${Math.round(size * 0.38)}px`,
          letterSpacing: '0.05em',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}>
          {getInitials(name)}
        </div>
      )}

      {/* Verified Shield Icon Badge */}
      <span style={{
        position: 'absolute',
        bottom: '-3px',
        right: '-3px',
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid var(--color-bg-surface)',
        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
      }}>
        <CheckCircle2 size={11} strokeWidth={3} />
      </span>
    </div>
  );
}

// Elegant Animated Skeleton Card with Shimmer Sweep
function PilotCardSkeleton() {
  return (
    <div style={{
      borderRadius: '24px',
      background: 'var(--color-bg-surface)',
      border: '1.5px solid var(--color-border)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.04)',
      minHeight: '420px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .pilot-skeleton-pulse {
          animation: pulseOpacity 1.6s ease-in-out infinite alternate;
        }
        @keyframes pulseOpacity {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(132, 204, 22, 0.06), transparent)',
        animation: 'shimmerSweep 1.6s infinite',
        pointerEvents: 'none'
      }} />

      <div className="pilot-skeleton-pulse">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: 'var(--color-bg-secondary)' }} />
            <div>
              <div style={{ width: '130px', height: '16px', borderRadius: '6px', background: 'var(--color-bg-secondary)', marginBottom: '6px' }} />
              <div style={{ width: '90px', height: '12px', borderRadius: '6px', background: 'var(--color-bg-secondary)' }} />
            </div>
          </div>
          <div style={{ width: '72px', height: '26px', borderRadius: '9999px', background: 'var(--color-bg-secondary)' }} />
        </div>

        {/* Route Box */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: '18px',
          padding: '16px 18px',
          marginBottom: '16px',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '54px', height: '14px', borderRadius: '6px', background: 'var(--color-bg-surface)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-bg-surface)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '90px', height: '15px', borderRadius: '6px', background: 'var(--color-bg-surface)', marginBottom: '5px' }} />
              <div style={{ width: '150px', height: '12px', borderRadius: '6px', background: 'var(--color-bg-surface)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ width: '54px', height: '14px', borderRadius: '6px', background: 'var(--color-bg-surface)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-bg-surface)', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '90px', height: '15px', borderRadius: '6px', background: 'var(--color-bg-surface)', marginBottom: '5px' }} />
              <div style={{ width: '150px', height: '12px', borderRadius: '6px', background: 'var(--color-bg-surface)' }} />
            </div>
          </div>
        </div>

        {/* Vehicle Module */}
        <div style={{
          height: '46px',
          borderRadius: '14px',
          background: 'var(--color-bg-secondary)',
          marginBottom: '12px'
        }} />

        {/* Amenities Line */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ width: '70px', height: '12px', borderRadius: '4px', background: 'var(--color-bg-secondary)' }} />
          <div style={{ width: '70px', height: '12px', borderRadius: '4px', background: 'var(--color-bg-secondary)' }} />
          <div style={{ width: '80px', height: '12px', borderRadius: '4px', background: 'var(--color-bg-secondary)' }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        margin: '18px -24px -24px',
        padding: '18px 24px',
        background: 'var(--color-bg-secondary)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ width: '60px', height: '10px', borderRadius: '4px', background: 'var(--color-bg-surface)', marginBottom: '6px' }} />
          <div style={{ width: '80px', height: '24px', borderRadius: '6px', background: 'var(--color-bg-surface)' }} />
        </div>
        <div style={{ width: '130px', height: '42px', borderRadius: '13px', background: 'var(--color-bg-surface)' }} />
      </div>
    </div>
  );
}

export default function PilotsExplorerPage({ onSelectRide, onNavigate, initialFilters = {} }) {
  const { user } = useAuth();

  // Filter States
  const [originInput, setOriginInput] = useState(initialFilters.origin || '');
  const [destinationInput, setDestinationInput] = useState(initialFilters.destination || '');
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(initialFilters.date || '');
  const [filterEVOnly, setFilterEVOnly] = useState(initialFilters.electricOnly === 'true');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterWomenOnly, setFilterWomenOnly] = useState(false);
  const [sortBy, setSortBy] = useState('departure_earliest'); // 'departure_earliest', 'price_asc', 'price_desc', 'rating_desc'
  const [seatsRequired, setSeatsRequired] = useState(1);
  const [showRideRequestModal, setShowRideRequestModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [activeRestrictionModalOpen, setActiveRestrictionModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(getActivePassengerTrip());

  useEffect(() => {
    setActiveSession(getActivePassengerTrip());
    const handleSync = () => setActiveSession(getActivePassengerTrip());
    window.addEventListener('driveit_sync_bookings', handleSync);
    window.addEventListener('driveit_sync_requests', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('driveit_sync_bookings', handleSync);
      window.removeEventListener('driveit_sync_requests', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleSelectRideClick = (ride) => {
    const activeCheck = getActivePassengerTrip();
    if (activeCheck.hasActiveSession) {
      setActiveSession(activeCheck);
      setActiveRestrictionModalOpen(true);
      return;
    }
    if (onSelectRide) {
      onSelectRide(ride);
    }
  };

  // Pagination: Exactly 9 entries per page
  const ITEMS_PER_PAGE = 9;
  const [currentPageNum, setCurrentPageNum] = useState(1);

  // Data & Loading States
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceTimerRef = useRef(null);


  // Sync initial filters when props change
  useEffect(() => {
    if (initialFilters.origin !== undefined) setOriginInput(initialFilters.origin || '');
    if (initialFilters.destination !== undefined) setDestinationInput(initialFilters.destination || '');
    if (initialFilters.date !== undefined) setSelectedDateTime(initialFilters.date || '');
    if (initialFilters.electricOnly !== undefined) setFilterEVOnly(initialFilters.electricOnly === 'true');
  }, [initialFilters.origin, initialFilters.destination, initialFilters.date, initialFilters.electricOnly]);

  const fetchPilots = useCallback(async (
    searchOrigin = originInput, 
    searchDest = destinationInput, 
    searchDate = selectedDateTime ? selectedDateTime.split('T')[0] : '',
    evOnly = filterEVOnly,
    verifiedOnly = filterVerifiedOnly,
    womenOnly = filterWomenOnly,
    sortOrder = sortBy,
    reqSeats = seatsRequired
  ) => {
    setLoading(true);
    try {
      let url = `/api/rides?sort=${sortOrder}`;
      if (searchOrigin && searchOrigin.trim()) {
        url += `&origin=${encodeURIComponent(searchOrigin.trim())}`;
      }
      if (searchDest && searchDest.trim()) {
        url += `&destination=${encodeURIComponent(searchDest.trim())}`;
      }
      if (searchDate && searchDate.trim()) {
        url += `&date=${encodeURIComponent(searchDate.trim())}`;
      }
      if (evOnly) {
        url += `&electricOnly=true`;
      }
      if (reqSeats > 1) {
        url += `&seats=${reqSeats}`;
      }

      let fetchedRides = [];
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          fetchedRides = data.rides || [];
        }
      } catch (apiErr) {
        console.warn('API error fetching rides, checking local store:', apiErr);
      }

      const deletedRideIds = JSON.parse(localStorage.getItem('rideshare_deleted_rides') || '[]');
      const localBookings = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');

      // 1. Filter out any blacklisted deleted rides
      fetchedRides = fetchedRides.filter(r => !deletedRideIds.includes(r.id));

      // 2. Include any local session driver rides if not already present
      try {
        const localDriverRides = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
        for (const lr of localDriverRides) {
          if (lr.status !== 'CANCELLED' && !deletedRideIds.includes(lr.id) && !fetchedRides.some(r => r.id === lr.id)) {
            const origMatch = !searchOrigin || lr.originCity?.toLowerCase().includes(searchOrigin.toLowerCase()) || lr.originAddress?.toLowerCase().includes(searchOrigin.toLowerCase());
            const destMatch = !searchDest || lr.destinationCity?.toLowerCase().includes(searchDest.toLowerCase()) || lr.destinationAddress?.toLowerCase().includes(searchDest.toLowerCase());
            if (origMatch && destMatch) {
              fetchedRides.unshift(lr);
            }
          }
        }
      } catch (e) {}

      // 3. Include any accepted commuter demand routes (e.g. Phoenix Marketcity ➔ Koregaon Park)
      try {
        const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
        const acceptedDemands = localReqs.filter(r => r.status === 'ACCEPTED');

        for (const req of acceptedDemands) {
          const rideId = req.matchedRideId || `ride_demand_${req.id}`;
          if (deletedRideIds.includes(rideId) || deletedRideIds.includes(req.id) || req.status === 'CANCELLED') continue;

          const alreadyInList = fetchedRides.some(r => r.id === rideId || r.demandRequestId === req.id || (r.originAddress === req.origin && r.destinationAddress === req.destination));

          if (!alreadyInList) {
            const seatsCount = Number(req.seats) || 1;
            const farePrice = Number(req.matchedPilot?.offeredPrice) || Number(req.maxBudget) || 400;

            const demandRide = {
              id: rideId,
              demandRequestId: req.id,
              driverId: req.matchedPilot?.id || 'pilot_verified_01',
              driverName: req.matchedPilot?.name || 'Rahul Sharma (Verified Pilot)',
              driverAvatar: req.matchedPilot?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
              driverPhone: req.matchedPilot?.phone || '+91 98201 55667',
              driverRating: 4.95,
              driverReviewsCount: 38,
              driverVerified: true,
              originCity: req.origin?.split(',')[0] || req.origin || 'Mumbai',
              originAddress: req.origin || 'Pickup Location',
              destinationCity: req.destination?.split(',')[0] || req.destination || 'Pune',
              destinationAddress: req.destination || 'Dropoff Hub',
              departureDate: req.preferredDate || new Date().toISOString().split('T')[0],
              departureTime: req.preferredTime || '08:00 AM',
              pricePerSeat: farePrice,
              totalSeats: 3,
              bookedSeats: seatsCount,
              availableSeats: Math.max(0, 3 - seatsCount),
              totalEarnings: seatsCount * farePrice,
              passengerCount: 1,
              accepting_bookings: true,
              status: 'ACTIVE',
              isElectric: true,
              fuelType: 'ELECTRIC',
              distanceKm: 148,
              waypoints: ['Expressway Highway Corridor'],
              luggage: '1 Trolley + 1 Backpack',
              notes: req.notes || 'Accepted highway commuter demand.',
              isDemandMatch: true,
              vehicle: req.matchedPilot?.vehicle || {
                make: 'Tata',
                model: 'Nexon EV Empowered',
                plate: 'MH-12-RN-7788',
                color: 'Intensi-Teal',
                electric: true,
                fuelType: 'ELECTRIC'
              }
            };

            const origMatch = !searchOrigin || demandRide.originCity?.toLowerCase().includes(searchOrigin.toLowerCase()) || demandRide.originAddress?.toLowerCase().includes(searchOrigin.toLowerCase());
            const destMatch = !searchDest || demandRide.destinationCity?.toLowerCase().includes(searchDest.toLowerCase()) || demandRide.destinationAddress?.toLowerCase().includes(searchDest.toLowerCase());
            if (origMatch && destMatch) {
              fetchedRides.unshift(demandRide);
            }
          }
        }
      } catch (e) {}

      // 4. Update confirmed bookings and available seats for all merged rides
      fetchedRides = fetchedRides.map(r => {
        const matchingBookings = localBookings.filter(b => 
          (b.rideId === r.id || (b.ride && b.ride.id === r.id) || (b.ride && b.ride.originCity === r.originCity && b.ride.destinationCity === r.destinationCity)) &&
          b.status === 'CONFIRMED'
        );
        const localSeatsCount = matchingBookings.reduce((sum, b) => sum + (Number(b.seatsBooked) || 1), 0);
        const finalBookedSeats = Math.max(r.bookedSeats || 0, localSeatsCount);
        const finalAvailable = Math.max(0, (r.totalSeats || 3) - finalBookedSeats);
        return {
          ...r,
          bookedSeats: finalBookedSeats,
          availableSeats: finalAvailable
        };
      });

      // Client-side auxiliary filters for instant responsiveness
      if (evOnly) {
        fetchedRides = fetchedRides.filter(r => r.vehicle?.electric !== false && (r.vehicle?.fuelType === 'ELECTRIC' || !r.vehicle?.fuelType || r.isElectric));
      }
      if (verifiedOnly) {
        fetchedRides = fetchedRides.filter(r => r.driverVerified !== false);
      }
      if (womenOnly) {
        fetchedRides = fetchedRides.filter(r => r.womenOnly === true || r.driverGender === 'female' || r.driver?.gender === 'female' || r.driverName?.toLowerCase().includes('priya') || r.driverName?.toLowerCase().includes('ananya'));
      }
      if (reqSeats > 1) {
        fetchedRides = fetchedRides.filter(r => (r.availableSeats || 0) >= reqSeats);
      }

      // If strict filter yielded zero results on initial load without explicit query, fallback to all active rides
      if (fetchedRides.length === 0 && !searchOrigin && !searchDest && !searchDate && (evOnly || verifiedOnly || womenOnly)) {
        try {
          const fallbackRes = await fetch('/api/rides?sort=departure_earliest');
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.rides?.length > 0) {
              fetchedRides = fallbackData.rides;
            }
          }
        } catch (e) {}
      }

      // Apply sort client-side as well
      if (sortOrder === 'price_asc') {
        fetchedRides.sort((a, b) => (a.pricePerSeat || 0) - (b.pricePerSeat || 0));
      } else if (sortOrder === 'price_desc') {
        fetchedRides.sort((a, b) => (b.pricePerSeat || 0) - (a.pricePerSeat || 0));
      } else if (sortOrder === 'rating_desc') {
        fetchedRides.sort((a, b) => (b.driverRating || b.driver?.rating || 0) - (a.driverRating || a.driver?.rating || 0));
      } else if (sortOrder === 'departure_earliest') {
        fetchedRides.sort((a, b) => ((a.departureDate || '') + (a.departureTime || '')).localeCompare((b.departureDate || '') + (b.departureTime || '')));
      }

      setRides(fetchedRides);
    } catch (err) {
      console.error('Error fetching pilots list:', err);
    } finally {
      setLoading(false);
    }
  }, [originInput, destinationInput, selectedDateTime, filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired]);

  // Real-time multi-channel synchronization: Auto-refresh when any pilot publishes or updates a ride
  useEffect(() => {
    const handleSyncRides = () => {
      fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
    };
    window.addEventListener('driveit_sync_rides', handleSyncRides);
    window.addEventListener('driveit_sync_requests', handleSyncRides);
    window.addEventListener('driveit_sync_bookings', handleSyncRides);
    window.addEventListener('storage', handleSyncRides);

    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('driveit_realtime_channel');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'ride:created' || msg.data?.type === 'ride:updated' || msg.data?.type === 'rides:updated' || msg.data?.type === 'request:accepted' || msg.data?.type === 'BOOKING_CREATED') {
          fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
        }
      };
    }

    return () => {
      window.removeEventListener('driveit_sync_rides', handleSyncRides);
      window.removeEventListener('driveit_sync_requests', handleSyncRides);
      window.removeEventListener('driveit_sync_bookings', handleSyncRides);
      window.removeEventListener('storage', handleSyncRides);
      if (bc) bc.close();
    };
  }, [originInput, destinationInput, selectedDateTime, filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired, fetchPilots]);

  // Trigger search on filter / state changes
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
    }, 120);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [originInput, destinationInput, sortBy, filterEVOnly, filterVerifiedOnly, filterWomenOnly, selectedDateTime, seatsRequired, fetchPilots]);

  // Real-time synchronization: Auto-refresh when any pilot publishes a new ride
  useRealtimeRides({
    onRideCreated: () => {
      fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
    },
    onRidesUpdated: () => {
      fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
    }
  });

  const handleApplySearch = (e) => {
    if (e) e.preventDefault();
    fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
  };

  const handleSwap = () => {
    const tempOrig = originInput;
    const tempLoc = originLocation;
    setOriginInput(destinationInput);
    setOriginLocation(destinationLocation);
    setDestinationInput(tempOrig);
    setDestinationLocation(tempLoc);
    fetchPilots(destinationInput, tempOrig, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
  };

  const handleClearFilters = () => {
    setOriginInput('');
    setDestinationInput('');
    setSelectedDateTime('');
    setFilterEVOnly(false);
    setFilterVerifiedOnly(false);
    setFilterWomenOnly(false);
    setSortBy('departure_earliest');
    setSeatsRequired(1);
    fetchPilots('', '', '', false, false, false, 'departure_earliest', 1);
  };


  // Smart city & landmark parser for ultra-clean display
  const parseCityAndLandmark = (addr, cityFallback) => {
    const raw = (addr || cityFallback || '').trim();
    if (!raw) return { city: 'Mumbai', landmark: 'Expressway Hub' };
    
    const lower = raw.toLowerCase();
    let city = 'Mumbai';
    if (lower.includes('mumbai')) city = 'Mumbai';
    else if (lower.includes('pune')) city = 'Pune';
    else if (lower.includes('bengaluru') || lower.includes('bangalore')) city = 'Bengaluru';
    else if (lower.includes('chennai')) city = 'Chennai';
    else if (lower.includes('delhi') || lower.includes('gurgaon') || lower.includes('noida')) city = 'Delhi';
    else if (lower.includes('jaipur')) city = 'Jaipur';
    else if (lower.includes('hyderabad')) city = 'Hyderabad';
    else if (lower.includes('vijayawada')) city = 'Vijayawada';
    else if (lower.includes('goa')) city = 'Goa';
    else if (lower.includes('nashik')) city = 'Nashik';
    else if (cityFallback) city = cityFallback.split(',')[0].trim();

    // Extract landmark
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
    let landmark = parts[0] || 'Expressway Interchange';
    if (landmark.toLowerCase() === city.toLowerCase() && parts.length > 1) {
      landmark = parts[1];
    }
    if (landmark.length > 24) {
      landmark = landmark.slice(0, 22) + '...';
    }
    return { city, landmark };
  };

  // Helper to format raw dates neatly as DD/MM/YYYY
  const formatDateBadge = (dateStr) => {
    if (!dateStr) return formatDate(new Date());
    return formatDate(dateStr);
  };

  const handleSelectCorridor = (from, to) => {
    setOriginInput(from);
    setDestinationInput(to);
    fetchPilots(from, to, selectedDateTime ? selectedDateTime.split('T')[0] : '', filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired);
  };

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      minHeight: '100vh',
      padding: '36px clamp(28px, 4.5vw, 64px) 96px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* 1. Header Bar with Back Navigation & Live Telemetry Intelligence */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '36px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: '900',
            color: '#84CC16',
            background: 'rgba(132, 204, 22, 0.1)',
            border: '1px solid rgba(132, 204, 22, 0.25)',
            padding: '5px 12px',
            borderRadius: '9999px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            <Navigation size={12} />
            <span>Verified Pilot Flight Deck • High-Frequency Corridors</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(26px, 3.8vw, 38px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            margin: '12px 0 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.15
          }}>
            {originInput && destinationInput 
              ? `${originInput.split(',')[0]} ➔ ${destinationInput.split(',')[0]}`
              : 'Explore Verified Highway Pilots'}
          </h1>
        </div>

        {/* Live Active Pilots Badge with Pulsing Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            color: '#10B981',
            padding: '9px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '900',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
            <span>{rides.length} Verified Pilots Active</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1.5px solid rgba(56, 189, 248, 0.25)',
            color: '#0284C7',
            padding: '9px 16px',
            borderRadius: '14px',
            fontSize: '12.5px',
            fontWeight: '800'
          }}>
            <ShieldCheck size={14} />
            <span>₹5L FASTag Insurance</span>
          </div>
        </div>
      </div>

      {/* 2. Primary Flight Deck Search Console Card */}
      <SpotlightCard
        spotlightColor="rgba(132, 204, 22, 0.18)"
        className="explorer-search-card"
        style={{
          borderRadius: '26px',
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          marginBottom: '30px',
          boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.08)'
        }}
      >
        <form onSubmit={handleApplySearch}>
          <div className="explorer-search-grid">
            {/* Origin Input */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
                <MapPin size={13} color="#10B981" />
                <span>PICKUP LOCATION</span>
              </label>
              <LocationAutocompleteInput
                value={originInput}
                onChange={(val) => setOriginInput(val)}
                onSelect={(place) => {
                  const label = place.primary || place.name || place.fullAddress || place;
                  setOriginInput(label);
                  setOriginLocation(place);
                }}
                label={null}
                placeholder="City, Highway Hub, Landmark..."
              />
            </div>

            {/* Swap Button */}
            <div className="swap-col-wrapper" style={{ paddingBottom: '2px' }}>
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Locations"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--color-bg-secondary)',
                  border: '1.5px solid var(--color-border)',
                  color: '#84CC16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(180deg) scale(1.06)';
                  e.currentTarget.style.borderColor = '#84CC16';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Destination Input */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
                <Navigation size={13} color="#EF4444" />
                <span>DROPOFF DESTINATION</span>
              </label>
              <LocationAutocompleteInput
                value={destinationInput}
                onChange={(val) => setDestinationInput(val)}
                onSelect={(place) => {
                  const label = place.primary || place.name || place.fullAddress || place;
                  setDestinationInput(label);
                  setDestinationLocation(place);
                }}
                label={null}
                placeholder="Destination City or Toll Exit..."
              />
            </div>

            {/* Schedule Dropdown */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
                <Calendar size={13} color="#A3E635" />
                <span>SCHEDULE</span>
              </label>
              <ScheduleDropdownPicker
                value={selectedDateTime}
                onChange={(val) => setSelectedDateTime(val)}
                onApply={(val) => {
                  if (val) setSelectedDateTime(val);
                }}
              />
            </div>

            {/* Search Action Button */}
            <div>
              <button
                type="submit"
                style={{
                  height: '48px',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0 24px',
                  fontSize: '14.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(132, 204, 22, 0.4)',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(132, 204, 22, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(132, 204, 22, 0.4)';
                }}
              >
                <Sparkles size={16} />
                <span>Search Pilots ⚡</span>
              </button>
            </div>
          </div>

          {/* Preset Expressway Corridors Quick-Select Strip */}
          <div className="expressways-scroll-strip">
            <span style={{ fontSize: '11.5px', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Expressways:
            </span>
            <button
              type="button"
              onClick={() => handleSelectCorridor('Mumbai', 'Pune')}
              style={{
                background: originInput.includes('Mumbai') && destinationInput.includes('Pune') ? 'rgba(132, 204, 22, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Mumbai') && destinationInput.includes('Pune') ? '1.5px solid #84CC16' : '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '10px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                transition: 'all 120ms ease'
              }}
            >
              <span>Mumbai ➔ Pune</span>
              <strong style={{ color: '#10B981' }}>₹350</strong>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCorridor('Bengaluru', 'Chennai')}
              style={{
                background: originInput.includes('Bengaluru') && destinationInput.includes('Chennai') ? 'rgba(132, 204, 22, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Bengaluru') && destinationInput.includes('Chennai') ? '1.5px solid #84CC16' : '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '10px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                transition: 'all 120ms ease'
              }}
            >
              <span>Bengaluru ➔ Chennai</span>
              <strong style={{ color: '#10B981' }}>₹400</strong>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCorridor('Delhi', 'Jaipur')}
              style={{
                background: originInput.includes('Delhi') && destinationInput.includes('Jaipur') ? 'rgba(132, 204, 22, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Delhi') && destinationInput.includes('Jaipur') ? '1.5px solid #84CC16' : '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '10px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                transition: 'all 120ms ease'
              }}
            >
              <span>Delhi ➔ Jaipur</span>
              <strong style={{ color: '#10B981' }}>₹450</strong>
            </button>
            <button
              type="button"
              onClick={() => handleSelectCorridor('Hyderabad', 'Vijayawada')}
              style={{
                background: originInput.includes('Hyderabad') && destinationInput.includes('Vijayawada') ? 'rgba(132, 204, 22, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Hyderabad') && destinationInput.includes('Vijayawada') ? '1.5px solid #84CC16' : '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '10px',
                padding: '5px 12px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                flexShrink: 0,
                transition: 'all 120ms ease'
              }}
            >
              <span>Hyd ➔ Vijayawada</span>
              <strong style={{ color: '#10B981' }}>₹420</strong>
            </button>
          </div>

          {/* Filter Pills & Sorting Strip */}
          <div className="explorer-filter-strip">
            {/* Quick Filter Toggle Pills */}
            <div className="explorer-filter-pills">
              <button
                type="button"
                onClick={() => setFilterEVOnly(prev => !prev)}
                style={{
                  background: filterEVOnly ? '#10B981' : 'var(--color-bg-secondary)',
                  color: filterEVOnly ? '#000000' : 'var(--color-text-primary)',
                  border: filterEVOnly ? '1.5px solid #10B981' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease',
                  boxShadow: filterEVOnly ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Zap size={14} fill={filterEVOnly ? 'currentColor' : 'none'} />
                <span>100% Green EV</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterVerifiedOnly(prev => !prev)}
                style={{
                  background: filterVerifiedOnly ? '#38BDF8' : 'var(--color-bg-secondary)',
                  color: filterVerifiedOnly ? '#000000' : 'var(--color-text-primary)',
                  border: filterVerifiedOnly ? '1.5px solid #38BDF8' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease',
                  boxShadow: filterVerifiedOnly ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none'
                }}
              >
                <ShieldCheck size={14} />
                <span>UIDAI Verified</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterWomenOnly(prev => !prev)}
                style={{
                  background: filterWomenOnly ? '#EC4899' : 'var(--color-bg-secondary)',
                  color: filterWomenOnly ? '#FFFFFF' : 'var(--color-text-primary)',
                  border: filterWomenOnly ? '1.5px solid #EC4899' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease',
                  boxShadow: filterWomenOnly ? '0 4px 14px rgba(236, 72, 153, 0.35)' : 'none'
                }}
              >
                <span>👩 Women-Only</span>
              </button>

              {/* Seats Filter */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg-secondary)', border: '1.5px solid var(--color-border)', borderRadius: '12px', padding: '4px 8px' }}>
                <Users size={13} color="#84CC16" />
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>Seats:</span>
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeatsRequired(s)}
                    style={{
                      background: seatsRequired === s ? '#84CC16' : 'transparent',
                      color: seatsRequired === s ? '#000000' : 'var(--color-text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '22px',
                      height: '22px',
                      fontSize: '11.5px',
                      fontWeight: '900',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {(originInput || destinationInput || filterEVOnly || filterVerifiedOnly || filterWomenOnly || selectedDateTime || seatsRequired > 1) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    background: 'transparent',
                    color: '#EF4444',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 8px',
                    borderRadius: '8px'
                  }}
                >
                  <X size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="explorer-sort-wrapper">
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  borderRadius: '12px',
                  padding: '7px 14px',
                  fontSize: '13px',
                  fontWeight: '800',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="departure_earliest">Earliest Departure ⏰</option>
                <option value="price_asc">Lowest Fare (₹) 💰</option>
                <option value="rating_desc">Highest Rated Pilot (★) 🏆</option>
                <option value="price_desc">Highest Fare First</option>
              </select>
            </div>
          </div>
        </form>
      </SpotlightCard>

      {/* 3. Pilots & Available Rides Grid */}
      {loading ? (
        /* Shimmer Skeleton Cards Loading Grid */
        <div className="responsive-pilots-grid">
          {Array.from({ length: 6 }).map((_, idx) => (
            <PilotCardSkeleton key={idx} />
          ))}
        </div>
      ) : rides.length === 0 ? (
        /* Empty State */
        <SpotlightCard
          spotlightColor="rgba(132, 204, 22, 0.2)"
          style={{
            borderRadius: '28px',
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            padding: '64px 40px',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            background: 'rgba(132, 204, 22, 0.15)',
            color: '#84CC16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <Compass size={34} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
            No Active Pilots Found for This Route & Time
          </h3>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-tertiary)', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            No verified pilots have scheduled departures matching these filters right now. Try clearing filters or exploring our high-frequency expressway corridors.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowRideRequestModal(true)}
              style={{
                background: 'linear-gradient(135deg, #38BDF8, #0284C7)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)'
              }}
            >
              Request This Highway Route ⚡
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('booker-trips')}
              style={{
                background: 'var(--color-bg-secondary)',
                color: 'var(--color-text-primary)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '14px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={15} color="#0284C7" />
              <span>View My Route Demands ➔</span>
            </button>

            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)'
              }}
            >
              View All Active Corridors
            </button>
          </div>
        </SpotlightCard>
      ) : (
        /* Render Ultra-Professional Available Pilot Cards (Exactly 9 Entries per Page) */
        <>
          {activeSession?.hasActiveSession && (
            <div style={{
              background: 'rgba(255, 251, 235, 0.92)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              padding: '16px 22px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: '0 12px 32px -8px rgba(245, 158, 11, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle Ambient Glow Effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
                borderRadius: '4px 0 0 4px'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1px solid #FCD34D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#B45309',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                }}>
                  <ShieldAlert size={24} />
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '900',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      background: '#FEF3C7',
                      color: '#B45309',
                      border: '1px solid #FDE68A',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                      1 Active Trip Policy
                    </span>

                    <span style={{ fontSize: '13.5px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.01em' }}>
                      {activeSession.type === 'BOOKING' ? 'Ongoing Booking Active' : 'Ongoing Demand Broadcast Active'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.45' }}>
                    You have an active session for <strong style={{ color: '#0F172A' }}>{activeSession.route}</strong>. To book another ride, please cancel or complete your ongoing trip in the Passenger Flight Deck.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => onNavigate ? onNavigate('booker-trips') : (window.location.href = '/#/booker-trips')}
                  style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: '#FFFFFF',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    padding: '11px 20px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 23, 42, 0.35)';
                    e.currentTarget.style.background = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.25)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)';
                  }}
                >
                  <span>Manage in Flight Deck</span>
                  <ArrowRight size={14} color="#84CC16" />
                </button>
              </div>
            </div>
          )}

          <div className="responsive-pilots-grid">
            {rides.slice((currentPageNum - 1) * ITEMS_PER_PAGE, (currentPageNum - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(ride => {
              const isElectric = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
              const isDiesel = ride.vehicle?.fuelType === 'DIESEL';
              const availableSeats = ride.availableSeats ?? 3;
              const { city: origCity, landmark: origLandmark } = parseCityAndLandmark(ride.originAddress, ride.originCity);
              const { city: destCity, landmark: destLandmark } = parseCityAndLandmark(ride.destinationAddress, ride.destinationCity);

              return (
                <SpotlightCard
                  key={ride.id}
                  spotlightColor={isElectric ? 'rgba(16, 185, 129, 0.14)' : 'rgba(132, 204, 22, 0.14)'}
                  style={{
                    borderRadius: '24px',
                    background: 'var(--color-bg-surface)',
                    border: '1.5px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px -8px rgba(0, 0, 0, 0.06)',
                    position: 'relative'
                  }}
                >
                  <div className="pilot-ride-card-body">
                    {/* 1. Pilot Header Strip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PilotAvatar
                          src={ride.driverAvatar}
                          name={ride.driverName}
                          size={46}
                        />

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
                              {ride.driverName || 'Verified Pilot'}
                            </span>
                            <span style={{ color: '#84CC16', fontSize: '12px', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={11} fill="#84CC16" />
                              {ride.driverRating || '4.95'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-text-tertiary)', marginTop: '3px' }}>
                            <span style={{ color: '#10B981', fontWeight: '800' }}>✓ UIDAI Verified</span>
                            <span>•</span>
                            <span>{ride.driverReviewsCount || 38}+ Rides Done</span>
                          </div>
                        </div>
                      </div>

                      {/* Powertrain Capsule */}
                      {isElectric ? (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#10B981',
                          padding: '5px 11px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '900'
                        }}>
                          <Zap size={11} fill="currentColor" />
                          <span>100% EV</span>
                        </div>
                      ) : (
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'var(--color-bg-secondary)',
                          color: 'var(--color-text-secondary)',
                          padding: '5px 11px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '800'
                        }}>
                          <Fuel size={11} />
                          <span>{isDiesel ? 'Diesel' : 'Petrol'}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Structured Flight-Grade Route Section */}
                    <div style={{
                      background: 'var(--color-bg-secondary)',
                      borderRadius: '18px',
                      padding: '16px 18px',
                      marginBottom: '16px',
                      border: '1px solid var(--color-border)'
                    }}>
                      {/* Origin Stop */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
                        <div style={{ minWidth: '64px', textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                            {formatTime(ride.departureTime || '07:30')}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            DEPART
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px', flexShrink: 0 }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
                          <div style={{ width: '2px', height: '28px', background: 'linear-gradient(to bottom, #10B981, #EF4444)', margin: '3px 0', opacity: 0.4 }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                            {origCity}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }} title={ride.originAddress || origLandmark}>
                            {origLandmark}
                          </div>
                        </div>
                      </div>

                      {/* Destination Stop */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                        <div style={{ minWidth: '64px', textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
                            {formatDateBadge(ride.departureDate)}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            ARRIVE
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '4px', flexShrink: 0 }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                            {destCity}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }} title={ride.destinationAddress || destLandmark}>
                            {destLandmark}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Vehicle Info & Seats Left Module */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--color-bg-secondary)',
                      borderRadius: '14px',
                      border: '1px solid var(--color-border)',
                      marginBottom: '12px',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <Car size={16} color="#84CC16" style={{ flexShrink: 0 }} />
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ride.vehicle?.make} {ride.vehicle?.model || 'EV'}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Reg: {ride.vehicle?.plate || 'MH-12-RN-7788'}
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: availableSeats <= 1 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        border: availableSeats <= 1 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                        color: availableSeats <= 1 ? '#EF4444' : '#10B981',
                        padding: '5px 10px',
                        borderRadius: '9999px',
                        fontSize: '11.5px',
                        fontWeight: '900',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        <Users size={12} />
                        <span>{availableSeats} seat{availableSeats > 1 ? 's' : ''} left</span>
                      </div>
                    </div>

                    {/* 4. Amenities Line */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      color: 'var(--color-text-tertiary)',
                      fontWeight: '600',
                      padding: '0 4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}>
                      <span>❄️ Climate AC</span>
                      <span>•</span>
                      <span>🧳 Luggage Space</span>
                      <span>•</span>
                      <span style={{ color: '#10B981', fontWeight: '800' }}>⚡ FASTag Included</span>
                    </div>
                  </div>

                  {/* 5. Pricing & Booking Action Footer */}
                  <div style={{
                    padding: '18px 24px',
                    background: 'var(--color-bg-secondary)',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        All-Inclusive Fare
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                        ₹{ride.pricePerSeat || 350} <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-tertiary)' }}>/ seat</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectRideClick(ride)}
                      style={{
                        background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                        border: 'none',
                        color: '#000000',
                        borderRadius: '13px',
                        padding: '11px 22px',
                        fontSize: '13.5px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
                        transition: 'all 160ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(132, 204, 22, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(132, 204, 22, 0.35)';
                      }}
                    >
                      <span>Select & Book</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Pagination Navigation Bar (Exactly 9 Entries per Page) */}
          {Math.ceil(rides.length / ITEMS_PER_PAGE) > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '36px',
              padding: '16px 24px',
              background: 'var(--color-bg-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '20px',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
                Showing <span style={{ color: 'var(--color-text-primary)', fontWeight: '900' }}>{(currentPageNum - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPageNum * ITEMS_PER_PAGE, rides.length)}</span> of <span style={{ color: '#10B981', fontWeight: '900' }}>{rides.length}</span> Verified Pilots
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  disabled={currentPageNum === 1}
                  onClick={() => {
                    setCurrentPageNum(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1.5px solid var(--color-border)',
                    color: currentPageNum === 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: currentPageNum === 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: currentPageNum === 1 ? 0.5 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>

                {Array.from({ length: Math.ceil(rides.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPageNum(pageNum);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: currentPageNum === pageNum ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' : 'var(--color-bg-secondary)',
                      color: currentPageNum === pageNum ? '#000000' : 'var(--color-text-primary)',
                      border: currentPageNum === pageNum ? 'none' : '1.5px solid var(--color-border)',
                      fontSize: '13.5px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: currentPageNum === pageNum ? '0 4px 12px rgba(132, 204, 22, 0.35)' : 'none',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPageNum === Math.ceil(rides.length / ITEMS_PER_PAGE)}
                  onClick={() => {
                    setCurrentPageNum(prev => Math.min(Math.ceil(rides.length / ITEMS_PER_PAGE), prev + 1));
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1.5px solid var(--color-border)',
                    color: currentPageNum === Math.ceil(rides.length / ITEMS_PER_PAGE) ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                    borderRadius: '12px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: currentPageNum === Math.ceil(rides.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: currentPageNum === Math.ceil(rides.length / ITEMS_PER_PAGE) ? 0.5 : 1,
                    transition: 'all 150ms ease'
                  }}
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Ride Request Modal */}
      {showRideRequestModal && (
        <RideRequestModal
          isOpen={showRideRequestModal}
          onClose={() => setShowRideRequestModal(false)}
          onNavigate={onNavigate}
          initialOrigin={originInput}
          initialDestination={destinationInput}
        />
      )}

      {/* Emergency SOS Modal */}
      {showSOSModal && (
        <EmergencySOSModal
          isOpen={showSOSModal}
          onClose={() => setShowSOSModal(false)}
        />
      )}

      {/* 1 Active Trip Policy Restriction Modal */}
      <ActiveTripRestrictionModal
        isOpen={activeRestrictionModalOpen}
        onClose={() => setActiveRestrictionModalOpen(false)}
        onNavigate={onNavigate}
        activeSession={activeSession}
      />
    </div>
  );
}



