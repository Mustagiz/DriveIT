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
import WifiLoader from '../components/WifiLoader';
import { useAuth } from '../context/AuthContext';

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
      'linear-gradient(135deg, #F59E0B, #D97706)',
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
            border: '2px solid rgba(245, 158, 11, 0.4)',
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

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let fetchedRides = data.rides || [];

        // Client-side auxiliary filters for instant responsiveness
        if (evOnly) {
          fetchedRides = fetchedRides.filter(r => r.vehicle?.electric === true || r.vehicle?.fuelType === 'ELECTRIC');
        }
        if (verifiedOnly) {
          fetchedRides = fetchedRides.filter(r => r.driverVerified !== false && r.driver?.verified !== false);
        }
        if (womenOnly) {
          fetchedRides = fetchedRides.filter(r => r.womenOnly === true || r.driverGender === 'female' || r.driver?.gender === 'female');
        }
        if (reqSeats > 1) {
          fetchedRides = fetchedRides.filter(r => (r.availableSeats || 0) >= reqSeats);
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
      }
    } catch (err) {
      console.error('Error fetching pilots list:', err);
    } finally {
      setLoading(false);
    }
  }, [originInput, destinationInput, selectedDateTime, filterEVOnly, filterVerifiedOnly, filterWomenOnly, sortBy, seatsRequired]);

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


  // Helper to format long addresses cleanly without clutter
  const formatCleanLocation = (fullAddr, fallbackCity) => {
    const raw = (fullAddr || fallbackCity || '').trim();
    if (!raw) return 'Expressway Hub';
    const parts = raw.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length === 1) return parts[0];
    let landmark = parts[0];
    let city = parts[parts.length - 1];
    if (landmark.length > 22) {
      landmark = landmark.slice(0, 20) + '...';
    }
    return `${landmark}, ${city}`;
  };

  // Helper to format raw dates neatly (e.g. 2026-08-16 -> Sun, Aug 16)
  const formatDateBadge = (dateStr) => {
    if (!dateStr) return 'Today';
    try {
      const d = new Date(dateStr + 'T00:00:00');
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
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
            color: '#F59E0B',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
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
        spotlightColor="rgba(245, 158, 11, 0.18)"
        style={{
          borderRadius: '26px',
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          padding: '24px 28px',
          marginBottom: '30px',
          boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.08)'
        }}
      >
        <form onSubmit={handleApplySearch}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1.35fr) auto minmax(200px, 1.35fr) minmax(200px, 1.15fr) auto',
            gap: '12px',
            alignItems: 'flex-end',
            marginBottom: '18px'
          }}>
            {/* Origin Input */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
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
            <div style={{ paddingBottom: '2px' }}>
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
                  color: '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotate(180deg) scale(1.06)';
                  e.currentTarget.style.borderColor = '#F59E0B';
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
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
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
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.05em' }}>
                <Calendar size={13} color="#FBBF24" />
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
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
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
                  boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
                }}
              >
                <Sparkles size={16} />
                <span>Search Pilots ⚡</span>
              </button>
            </div>
          </div>

          {/* Preset Expressway Corridors Quick-Select Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}>
            <span style={{ fontSize: '11.5px', fontWeight: '900', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              Expressways:
            </span>
            <button
              type="button"
              onClick={() => handleSelectCorridor('Mumbai', 'Pune')}
              style={{
                background: originInput.includes('Mumbai') && destinationInput.includes('Pune') ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Mumbai') && destinationInput.includes('Pune') ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
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
                background: originInput.includes('Bengaluru') && destinationInput.includes('Chennai') ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Bengaluru') && destinationInput.includes('Chennai') ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
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
                background: originInput.includes('Delhi') && destinationInput.includes('Jaipur') ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Delhi') && destinationInput.includes('Jaipur') ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
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
                background: originInput.includes('Hyderabad') && destinationInput.includes('Vijayawada') ? 'rgba(245, 158, 11, 0.15)' : 'var(--color-bg-secondary)',
                border: originInput.includes('Hyderabad') && destinationInput.includes('Vijayawada') ? '1.5px solid #F59E0B' : '1px solid var(--color-border)',
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
                transition: 'all 120ms ease'
              }}
            >
              <span>Hyd ➔ Vijayawada</span>
              <strong style={{ color: '#10B981' }}>₹420</strong>
            </button>
          </div>

          {/* Filter Pills & Sorting Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            {/* Quick Filter Toggle Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setFilterEVOnly(prev => !prev)}
                style={{
                  background: filterEVOnly ? '#10B981' : 'var(--color-bg-secondary)',
                  color: filterEVOnly ? '#000000' : 'var(--color-text-primary)',
                  border: filterEVOnly ? '1.5px solid #10B981' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 16px',
                  fontSize: '12.5px',
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
                <span>100% Green EV Only</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterVerifiedOnly(prev => !prev)}
                style={{
                  background: filterVerifiedOnly ? '#38BDF8' : 'var(--color-bg-secondary)',
                  color: filterVerifiedOnly ? '#000000' : 'var(--color-text-primary)',
                  border: filterVerifiedOnly ? '1.5px solid #38BDF8' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 16px',
                  fontSize: '12.5px',
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
                <span>UIDAI Verified Pilots</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterWomenOnly(prev => !prev)}
                style={{
                  background: filterWomenOnly ? '#EC4899' : 'var(--color-bg-secondary)',
                  color: filterWomenOnly ? '#FFFFFF' : 'var(--color-text-primary)',
                  border: filterWomenOnly ? '1.5px solid #EC4899' : '1.5px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '7px 16px',
                  fontSize: '12.5px',
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-bg-secondary)', border: '1.5px solid var(--color-border)', borderRadius: '12px', padding: '4px 10px' }}>
                <Users size={13} color="#F59E0B" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>Seats:</span>
                {[1, 2, 3, 4].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeatsRequired(s)}
                    style={{
                      background: seatsRequired === s ? '#F59E0B' : 'transparent',
                      color: seatsRequired === s ? '#000000' : 'var(--color-text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '24px',
                      height: '24px',
                      fontSize: '12px',
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
                    fontSize: '12.5px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 10px',
                    borderRadius: '8px'
                  }}
                >
                  <X size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-tertiary)' }}>
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
      <WifiLoader loading={loading} text="scanning highway pilots..." />

      {rides.length === 0 && !loading ? (
        /* Empty State */
        <SpotlightCard
          spotlightColor="rgba(245, 158, 11, 0.2)"
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
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#F59E0B',
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
              onClick={handleClearFilters}
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)'
              }}
            >
              View All Active Corridors
            </button>
          </div>
        </SpotlightCard>
      ) : (
        /* Render Ultra-Professional Available Pilot Cards (Exactly 9 Entries per Page) */
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {rides.slice((currentPageNum - 1) * ITEMS_PER_PAGE, (currentPageNum - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE).map(ride => {
              const isElectric = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
              const isDiesel = ride.vehicle?.fuelType === 'DIESEL';
              const availableSeats = ride.availableSeats ?? 3;

              return (
                <SpotlightCard
                  key={ride.id}
                  spotlightColor={isElectric ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)'}
                  style={{
                    borderRadius: '22px',
                    background: 'var(--color-bg-surface)',
                    border: '1.5px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                    boxShadow: '0 6px 24px -6px rgba(0, 0, 0, 0.05)',
                    position: 'relative'
                  }}
                >
                  <div style={{ padding: '22px 24px' }}>
                    {/* 1. Pilot Header Strip */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <PilotAvatar
                          src={ride.driverAvatar}
                          name={ride.driverName}
                          size={44}
                        />

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '15.5px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                              {ride.driverName || 'Verified Pilot'}
                            </span>
                            <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: '900', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                              <Star size={11} fill="#F59E0B" />
                              {ride.driverRating || '4.95'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
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
                          padding: '4px 10px',
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
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: '800'
                        }}>
                          <Fuel size={11} />
                          <span>{isDiesel ? 'Diesel' : 'Petrol'}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Structured Route Section */}
                    <div style={{
                      background: 'var(--color-bg-secondary)',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      marginBottom: '14px'
                    }}>
                      {/* Pickup Point */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                        <div style={{ minWidth: '60px', textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                            {ride.departureTime || '07:30 AM'}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }}>
                            Pickup
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3px', flexShrink: 0 }}>
                          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                          <div style={{ width: '2px', height: '22px', background: 'var(--color-border)', margin: '2px 0' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ride.originAddress || ride.originCity}>
                            {formatCleanLocation(ride.originAddress, ride.originCity)}
                          </div>
                        </div>
                      </div>

                      {/* Dropoff Point */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ minWidth: '60px', textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-secondary)' }}>
                            {formatDateBadge(ride.departureDate)}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase' }}>
                            Dropoff
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3px', flexShrink: 0 }}>
                          <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444' }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ride.destinationAddress || ride.destinationCity}>
                            {formatCleanLocation(ride.destinationAddress, ride.destinationCity)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Vehicle Info & Seats Left */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        <Car size={14} color="#F59E0B" />
                        <span style={{ fontWeight: '800', color: 'var(--color-text-primary)' }}>
                          {ride.vehicle?.make} {ride.vehicle?.model}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                          • {ride.vehicle?.plate || 'MH12 JK 3456'}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '11.5px',
                        fontWeight: '900',
                        color: availableSeats <= 1 ? '#EF4444' : '#10B981',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Users size={12} />
                        {availableSeats} seat{availableSeats > 1 ? 's' : ''} left
                      </span>
                    </div>

                    {/* 4. Amenities Line */}
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>❄️ AC</span>
                      <span>•</span>
                      <span>🧳 Luggage Space</span>
                      <span>•</span>
                      <span style={{ color: '#10B981', fontWeight: '700' }}>⚡ FASTag Included</span>
                    </div>
                  </div>

                  {/* 5. Pricing & Booking Action Footer */}
                  <div style={{
                    padding: '16px 24px',
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
                      onClick={() => onSelectRide && onSelectRide(ride)}
                      style={{
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        border: 'none',
                        color: '#000000',
                        borderRadius: '13px',
                        padding: '10px 20px',
                        fontSize: '13.5px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                        transition: 'all 160ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 18px rgba(245, 158, 11, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.35)';
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
                      background: currentPageNum === pageNum ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--color-bg-secondary)',
                      color: currentPageNum === pageNum ? '#000000' : 'var(--color-text-primary)',
                      border: currentPageNum === pageNum ? 'none' : '1.5px solid var(--color-border)',
                      fontSize: '13.5px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: currentPageNum === pageNum ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none',
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
    </div>
  );
}



