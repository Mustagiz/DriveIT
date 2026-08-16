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

  // Data & Loading States
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const debounceTimerRef = useRef(null);

  const fetchPilots = useCallback(async (
    searchOrigin = originInput, 
    searchDest = destinationInput, 
    searchDate = selectedDateTime ? selectedDateTime.split('T')[0] : '',
    evOnly = filterEVOnly,
    verifiedOnly = filterVerifiedOnly,
    womenOnly = filterWomenOnly,
    sortOrder = sortBy
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
      if (seatsRequired > 1) {
        url += `&seats=${seatsRequired}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let fetchedRides = data.rides || [];

        // Client-side auxiliary filters
        if (verifiedOnly) {
          fetchedRides = fetchedRides.filter(r => r.driverVerified !== false);
        }
        if (womenOnly) {
          fetchedRides = fetchedRides.filter(r => r.womenOnly === true || r.driverGender === 'female');
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
      fetchPilots();
    }, 150);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sortBy, filterEVOnly, filterVerifiedOnly, filterWomenOnly, selectedDateTime]);

  const handleApplySearch = (e) => {
    if (e) e.preventDefault();
    fetchPilots(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '');
  };

  const handleSwap = () => {
    const tempOrig = originInput;
    const tempLoc = originLocation;
    setOriginInput(destinationInput);
    setOriginLocation(destinationLocation);
    setDestinationInput(tempOrig);
    setDestinationLocation(tempLoc);
    fetchPilots(destinationInput, tempOrig, selectedDateTime ? selectedDateTime.split('T')[0] : '');
  };

  const handleClearFilters = () => {
    setOriginInput('');
    setDestinationInput('');
    setSelectedDateTime('');
    setFilterEVOnly(false);
    setFilterVerifiedOnly(false);
    setFilterWomenOnly(false);
    setSortBy('departure_earliest');
    fetchPilots('', '', '', false, false, false, 'departure_earliest');
  };

  // Helper to format long addresses neatly
  const formatLocationSnippet = (fullAddr, fallbackCity) => {
    if (!fullAddr) return fallbackCity || 'Expressway Hub';
    const parts = fullAddr.split(',').map(p => p.trim());
    if (parts.length <= 2) return fullAddr;
    return `${parts[0]}, ${parts[1]}`;
  };

  return (
    <div className="container container-wide page" style={{ minHeight: '100vh', paddingBottom: '90px' }}>
      {/* 1. Header Bar with Back Navigation & Live Pilot Count */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('home')}
            style={{
              background: 'var(--color-bg-surface)',
              border: '1.5px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: '14px',
              padding: '10px 18px',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 150ms ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Navigation size={13} />
              <span>Verified Pilot Flight Deck</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(24px, 3.6vw, 36px)',
              fontWeight: '900',
              color: 'var(--color-text-primary)',
              margin: '2px 0 0',
              letterSpacing: '-0.03em',
              lineHeight: 1.15
            }}>
              {originInput && destinationInput 
                ? `${originInput.split(',')[0]} ➔ ${destinationInput.split(',')[0]}`
                : 'Explore Verified Highway Pilots'}
            </h1>
          </div>
        </div>

        {/* Live Active Pilots Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          color: '#10B981',
          padding: '10px 20px',
          borderRadius: '16px',
          fontSize: '13.5px',
          fontWeight: '900',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span>{rides.length} Verified Pilots Available</span>
        </div>
      </div>

      {/* 2. Primary Filter & Search Console */}
      <SpotlightCard
        spotlightColor="rgba(245, 158, 11, 0.18)"
        style={{
          borderRadius: '28px',
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          padding: '24px 28px',
          marginBottom: '32px',
          boxShadow: '0 16px 36px -12px rgba(0, 0, 0, 0.08)'
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
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.04em' }}>
                <MapPin size={13} color="#10B981" />
                <span>PICKUP LOCATION</span>
              </label>
              <LocationAutocompleteInput
                value={originInput}
                onChange={(val) => {
                  setOriginInput(val);
                }}
                onSelect={(place) => {
                  setOriginLocation(place);
                  fetchPilots(place.fullAddress || place.name, destinationInput);
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
                  transition: 'all 150ms ease'
                }}
              >
                <ArrowRightLeft size={16} />
              </button>
            </div>

            {/* Destination Input */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.04em' }}>
                <Navigation size={13} color="#EF4444" />
                <span>DROPOFF DESTINATION</span>
              </label>
              <LocationAutocompleteInput
                value={destinationInput}
                onChange={(val) => {
                  setDestinationInput(val);
                }}
                onSelect={(place) => {
                  setDestinationLocation(place);
                  fetchPilots(originInput, place.fullAddress || place.name);
                }}
                label={null}
                placeholder="Destination City or Toll Exit..."
              />
            </div>

            {/* Schedule Dropdown */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '900', color: '#D97706', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '0.04em' }}>
                <Calendar size={13} color="#FBBF24" />
                <span>SCHEDULE</span>
              </label>
              <ScheduleDropdownPicker
                value={selectedDateTime}
                onChange={(val) => {
                  setSelectedDateTime(val);
                  fetchPilots(originInput, destinationInput, val ? val.split('T')[0] : '');
                }}
                onApply={() => handleApplySearch()}
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
              >
                <Sparkles size={16} />
                <span>Update ⚡</span>
              </button>
            </div>
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
                  transition: 'all 150ms ease'
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
                  transition: 'all 150ms ease'
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
                  transition: 'all 150ms ease'
                }}
              >
                <span>👩 Women-Only</span>
              </button>

              {(originInput || destinationInput || filterEVOnly || filterVerifiedOnly || filterWomenOnly || selectedDateTime) && (
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
        /* Render Professional Available Pilot Cards */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}>
          {rides.map(ride => {
            const isElectric = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
            const isDiesel = ride.vehicle?.fuelType === 'DIESEL';
            const availableSeats = ride.availableSeats ?? 3;

            return (
              <SpotlightCard
                key={ride.id}
                spotlightColor={isElectric ? 'rgba(16, 185, 129, 0.22)' : 'rgba(245, 158, 11, 0.22)'}
                style={{
                  borderRadius: '26px',
                  background: 'var(--color-bg-surface)',
                  border: '1.5px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 200ms ease',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ padding: '24px 26px' }}>
                  {/* Card Header: Pilot Avatar, Name, Rating & Fuel Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <PilotAvatar
                        src={ride.driverAvatar}
                        name={ride.driverName}
                        size={52}
                      />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '16.5px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                            {ride.driverName || 'Verified Pilot'}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            background: 'rgba(16, 185, 129, 0.14)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#10B981',
                            padding: '2px 7px',
                            borderRadius: '6px'
                          }}>
                            UIDAI Verified
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '3px' }}>
                          <span style={{ color: '#F59E0B', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            <Star size={13} fill="#F59E0B" />
                            {ride.driverRating || '4.95'}
                          </span>
                          <span>•</span>
                          <span style={{ fontWeight: '600' }}>{ride.driverReviewsCount || 38}+ Rides Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* Fuel / Powertrain Badge */}
                    {isElectric ? (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(16, 185, 129, 0.14)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        color: '#10B981',
                        padding: '5px 11px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '900'
                      }}>
                        <Zap size={12} fill="currentColor" />
                        <span>100% EV</span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: isDiesel ? 'rgba(99, 102, 241, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                        border: isDiesel ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                        color: isDiesel ? '#6366F1' : '#F59E0B',
                        padding: '5px 11px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: '900'
                      }}>
                        <Fuel size={12} />
                        <span>{isDiesel ? 'CRDi Diesel' : 'Petrol'}</span>
                      </div>
                    )}
                  </div>

                  {/* Route Timeline Container */}
                  <div style={{
                    background: 'var(--color-bg-secondary)',
                    borderRadius: '18px',
                    padding: '16px 18px',
                    marginBottom: '16px',
                    border: '1px solid var(--color-border)'
                  }}>
                    {/* Pickup Point */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '3px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
                        <div style={{ width: '2px', height: '22px', background: 'var(--color-border)', margin: '4px 0' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          PICKUP • {ride.departureTime || '07:30 AM'}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ride.originAddress || ride.originCity}>
                          {formatLocationSnippet(ride.originAddress, ride.originCity)}
                        </div>
                      </div>
                    </div>

                    {/* Dropoff Point */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', marginTop: '3px', boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10.5px', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          DROPOFF • {ride.departureDate || 'Today'}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ride.destinationAddress || ride.destinationCity}>
                          {formatLocationSnippet(ride.destinationAddress, ride.destinationCity)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Spec Strip & Remaining Seats Meter */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Car size={15} color="#F59E0B" />
                      <span style={{ fontWeight: '800', color: 'var(--color-text-primary)' }}>
                        {ride.vehicle?.make} {ride.vehicle?.model}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                        ({ride.vehicle?.plate || 'MH12 JK 3456'})
                      </span>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: availableSeats <= 1 ? 'rgba(239, 68, 68, 0.14)' : 'rgba(16, 185, 129, 0.14)',
                      color: availableSeats <= 1 ? '#EF4444' : '#10B981',
                      padding: '4px 9px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      fontSize: '11.5px'
                    }}>
                      <Users size={13} />
                      <span>{availableSeats} seat{availableSeats > 1 ? 's' : ''} left</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: FASTag Fare & Direct Booking Action */}
                <div style={{
                  padding: '18px 26px',
                  background: 'var(--color-bg-secondary)',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      FASTag Toll Included
                    </div>
                    <div style={{ fontSize: '25px', fontWeight: '900', color: '#10B981', lineHeight: 1.1 }}>
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
                      borderRadius: '14px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
                      transition: 'all 160ms ease'
                    }}
                  >
                    <span>Select & Book</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
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
