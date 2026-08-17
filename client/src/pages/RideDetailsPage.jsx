import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import RouteVisualizer from '../components/RouteVisualizer';
import SeatSelector from '../components/SeatSelector';
import BoardingPassModal from '../components/BoardingPassModal';
import LiveRideTrackingCockpit from '../components/LiveRideTrackingCockpit';
import EscrowPayoutCard from '../components/EscrowPayoutCard';
import WifiLoader from '../components/WifiLoader';
import UpiCheckoutModal from '../components/payment/UpiCheckoutModal';
import TripChatModal from '../components/chat/TripChatModal';
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  Navigation, 
  Star, 
  ShieldCheck, 
  Zap, 
  Lock, 
  CheckCircle2, 
  Tag, 
  Info,
  Calendar,
  Clock,
  Briefcase,
  Music,
  CigaretteOff,
  Dog,
  AlertTriangle,
  ExternalLink,
  Radio,
  Building,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function RideDetailsPage({ rideId, onBack, onNavigate }) {
  const { user, isAuthenticated, token, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickupIndex, setPickupIndex] = useState(0);
  const [dropoffIndex, setDropoffIndex] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [pickupNote, setPickupNote] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [existingActiveBooking, setExistingActiveBooking] = useState(null);
  const [authPromptModalOpen, setAuthPromptModalOpen] = useState(false);
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('route'); // 'route' | 'cockpit' | 'escrow'

  useEffect(() => {
    fetchRideDetails();
    if (isAuthenticated) {
      fetchUserActiveBooking();
    }
  }, [rideId, user, isAuthenticated]);

  // Check for pending booking after authentication
  useEffect(() => {
    if (isAuthenticated && ride) {
      const pendingRaw = sessionStorage.getItem('driveit_pending_booking');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.rideId === ride.id) {
            sessionStorage.removeItem('driveit_pending_booking');
            if (pending.seats) setSelectedSeats(pending.seats);
            if (pending.pickupIndex !== undefined) setPickupIndex(pending.pickupIndex);
            if (pending.dropoffIndex !== undefined) setDropoffIndex(pending.dropoffIndex);
            if (pending.note) setPickupNote(pending.note);
            setTimeout(() => {
              handleBookSeatsDirectly(pending);
            }, 300);
          }
        } catch (e) {
          console.warn('Error reading pending booking:', e);
        }
      }
    }
  }, [isAuthenticated, ride]);

  const fetchUserActiveBooking = async () => {
    try {
      const res = await fetch('/api/booker/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const active = (data.bookings || []).find(b => b.status === 'CONFIRMED');
        setExistingActiveBooking(active || null);
      }
    } catch (e) {
      console.warn('Error checking active bookings:', e);
    }
  };

  const fetchRideDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rides/${rideId}`);
      if (res.ok) {
        const data = await res.json();
        setRide(data);
        const stopsCount = (data.waypoints?.length || 0) + 2;
        setPickupIndex(0);
        setDropoffIndex(stopsCount - 1);
      } else {
        addToast('Ride not found or no longer active', 'error');
        onBack();
      }
    } catch (err) {
      console.error('Error fetching ride:', err);
      addToast('Network error fetching ride details', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <WifiLoader loading={true} text="loading highway telematics..." />;
  }

  if (!ride) return null;

  // Build Route Stops Array
  const stops = [
    { index: 0, name: ride.originCity, address: ride.originAddress, cumulativeKm: 0 }
  ];
  if (ride.waypoints && ride.waypoints.length > 0) {
    const totalDist = ride.distanceKm || 148;
    ride.waypoints.forEach((wp, idx) => {
      const approxKm = Math.round(((idx + 1) / (ride.waypoints.length + 1)) * totalDist);
      stops.push({
        index: stops.length,
        name: wp.split('(')[0].trim(),
        address: wp,
        cumulativeKm: approxKm
      });
    });
  }
  stops.push({
    index: stops.length,
    name: ride.destinationCity,
    address: ride.destinationAddress,
    cumulativeKm: ride.distanceKm || 148
  });

  const selectedPickup = stops[pickupIndex] || stops[0];
  const selectedDropoff = stops[dropoffIndex] || stops[stops.length - 1];

  const totalFullDistance = ride.distanceKm || 148;
  const segmentDistanceKm = Math.max(10, selectedDropoff.cumulativeKm - selectedPickup.cumulativeKm);
  const isPartialSegment = segmentDistanceKm < totalFullDistance;

  const fuelType = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
  let ratePerKm = 3.75;
  if (fuelType === 'ELECTRIC') ratePerKm = 3.06;
  else if (fuelType === 'DIESEL') ratePerKm = 3.50;

  const calculatedUnitPrice = isPartialSegment
    ? Math.max(50, Math.round(segmentDistanceKm * ratePerKm))
    : (ride.pricePerSeat || 350);

  const subtotal = calculatedUnitPrice * selectedSeats;
  const serviceFee = Math.max(15, Math.round(subtotal * 0.08));
  const totalPrice = subtotal + serviceFee;

  const handleBookSeatsDirectly = async (overrideData = null) => {
    setBookingInProgress(true);
    try {
      const payload = {
        rideId: ride.id,
        seats: overrideData?.seats || selectedSeats,
        unitPrice: calculatedUnitPrice,
        totalPrice: overrideData?.totalPrice || totalPrice,
        pickupLocation: selectedPickup.address || selectedPickup.name,
        dropoffLocation: selectedDropoff.address || selectedDropoff.name,
        pickupStopIndex: pickupIndex,
        dropoffStopIndex: dropoffIndex,
        note: overrideData?.note || pickupNote
      };

      const res = await fetch('/api/booker/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking({
          ...data.booking,
          ride: {
            ...ride,
            departureDate: ride.departureDate,
            departureTime: ride.departureTime,
            vehicle: ride.vehicle
          }
        });
        addToast('🎉 Booking Confirmed! Digital Boarding Pass Ready.', 'success');
        fetchRideDetails();
      } else {
        const err = await res.json();
        addToast(err.message || err.error || 'Failed to book seats', 'error');
      }
    } catch (e) {
      addToast('Network error during booking confirmation', 'error');
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleBookClick = () => {
    if (!isAuthenticated) {
      sessionStorage.setItem('driveit_pending_booking', JSON.stringify({
        rideId: ride.id,
        seats: selectedSeats,
        pickupIndex,
        dropoffIndex,
        note: pickupNote,
        totalPrice
      }));
      setAuthPromptModalOpen(true);
      return;
    }
    setUpiModalOpen(true);
  };

  const isEv = fuelType === 'ELECTRIC';
  const isDiesel = fuelType === 'DIESEL';
  const isPetrol = fuelType === 'PETROL';

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          background: 'var(--color-bg-secondary)',
          border: '1.5px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          borderRadius: '12px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: '800',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '20px',
          transition: 'all 150ms ease'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Search Results</span>
      </button>

      {/* Main Grid: Left Itinerary & Telematics, Right Booking Checkout Box */}
      <div className="responsive-grid-ride-details">
        {/* Left Column: Driver Hero, View Mode Switcher, & Route/Cockpit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Driver & Vehicle Bento Card */}
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'}
                    alt={ride.driverName}
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #84CC16'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    background: '#10B981',
                    color: '#000000',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--color-bg-surface)'
                  }}>
                    <CheckCircle2 size={11} strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
                      {ride.driverName}
                    </h2>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '800',
                      background: 'rgba(16, 185, 129, 0.14)',
                      color: '#10B981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      UIDAI Verified Pilot
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                    <span style={{ color: '#84CC16', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={13} fill="#84CC16" />
                      {ride.driverRating || 4.95}
                    </span>
                    <span>•</span>
                    <span style={{ fontWeight: '600' }}>{ride.driverReviewsCount || 160}+ verified highway trips</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setChatModalOpen(true)}
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease'
                }}
              >
                <MessageSquare size={14} color="#84CC16" />
                <span>Chat with Pilot</span>
              </button>
            </div>

            {/* Pilot Bio Quote */}
            {ride.driver?.bio && (
              <div style={{
                fontSize: '12.5px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                marginBottom: '16px',
                background: 'var(--color-bg-secondary)',
                padding: '10px 14px',
                borderRadius: '12px',
                borderLeft: '3px solid #84CC16'
              }}>
                💬 "{ride.driver.bio}"
              </div>
            )}

            {/* Vehicle Spec Strip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: isEv ? 'rgba(16, 185, 129, 0.1)' : isPetrol ? 'rgba(132, 204, 22, 0.1)' : 'rgba(99, 102, 241, 0.1)',
              border: `1px solid ${isEv ? 'rgba(16, 185, 129, 0.3)' : isPetrol ? 'rgba(132, 204, 22, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
              borderRadius: '14px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Car size={20} color={isEv ? '#10B981' : isPetrol ? '#65A30D' : '#6366F1'} />
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {ride.vehicle?.year || '2024'} {ride.vehicle?.make} {ride.vehicle?.model}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)' }}>
                    Color: {ride.vehicle?.color} • Plate: <strong style={{ color: 'var(--color-text-primary)' }}>{ride.vehicle?.plate}</strong> • {isEv ? 'Zero Tailpipe Emission' : 'BS-VI Phase 2'}
                  </div>
                </div>
              </div>

              <div>
                {isEv && (
                  <span style={{ fontSize: '11px', fontWeight: '900', background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={11} fill="currentColor" /> 100% Green EV
                  </span>
                )}
                {isPetrol && (
                  <span style={{ fontSize: '11px', fontWeight: '900', background: 'rgba(132, 204, 22, 0.2)', color: '#65A30D', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(132, 204, 22, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    ⛽ Petrol
                  </span>
                )}
                {isDiesel && (
                  <span style={{ fontSize: '11px', fontWeight: '900', background: 'rgba(99, 102, 241, 0.2)', color: '#6366F1', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.35)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    🛢️ Diesel CRDi
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive View Mode Switcher Pill Bar */}
          <div style={{
            display: 'flex',
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            padding: '5px',
            borderRadius: '16px',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
          }}>
            <button
              type="button"
              onClick={() => setActiveViewMode('route')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeViewMode === 'route' ? '#84CC16' : 'transparent',
                color: activeViewMode === 'route' ? '#000000' : 'var(--color-text-secondary)',
                fontSize: '12.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 150ms ease'
              }}
            >
              <Navigation size={14} />
              <span>Route Timeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('cockpit')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeViewMode === 'cockpit' ? '#10B981' : 'transparent',
                color: activeViewMode === 'cockpit' ? '#000000' : 'var(--color-text-secondary)',
                fontSize: '12.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 150ms ease'
              }}
            >
              <Radio size={14} className={activeViewMode === 'cockpit' ? 'animate-pulse' : ''} />
              <span>Live Telematics Cockpit 🛰️</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('escrow')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: 'none',
                background: activeViewMode === 'escrow' ? '#38BDF8' : 'transparent',
                color: activeViewMode === 'escrow' ? '#000000' : 'var(--color-text-secondary)',
                fontSize: '12.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 150ms ease'
              }}
            >
              <ShieldCheck size={14} />
              <span>Escrow & UPI 💳</span>
            </button>
          </div>

          {/* Conditional View Mode Content */}
          {activeViewMode === 'route' && (
            <RouteVisualizer ride={ride} />
          )}

          {activeViewMode === 'cockpit' && (
            <LiveRideTrackingCockpit ride={ride} />
          )}

          {activeViewMode === 'escrow' && (
            <div style={{ marginBottom: '24px' }}>
              <EscrowPayoutCard
                ride={ride}
                totalBookedSeats={selectedSeats || 1}
                pricePerSeat={calculatedUnitPrice}
                pilotVpa="rahul.pilot@okaxis"
              />
            </div>
          )}

          {/* Vehicle Amenities Grid */}
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
              Vehicle Amenities & Highway Policies
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Tag size={16} color="#84CC16" />
                <span>FASTag Tolls Included</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Briefcase size={16} color="#10B981" />
                <span>Luggage: {ride.amenities?.luggage || '1 Trolley + 1 Backpack'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Dog size={16} color={ride.amenities?.petsAllowed ? '#10B981' : '#64748B'} />
                <span>{ride.amenities?.petsAllowed ? 'Pets Allowed' : 'No Pets'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <CigaretteOff size={16} color="#EF4444" />
                <span>Non-smoking ride</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Music size={16} color="#A855F7" />
                <span>Music / Podcast onboard</span>
              </div>
            </div>

            {ride.notes && (
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '11px', color: '#84CC16', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}>
                  Driver Notes
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {ride.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Highway Segment Selector, Seat Selection & Booking Summary */}
        <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Waypoint Segment Selector */}
          {stops.length > 2 && (
            <div style={{
              background: 'var(--color-bg-surface)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '24px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: '900', color: '#84CC16', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={14} />
                  <span>Choose Highway Segment</span>
                </div>
                {isPartialSegment && (
                  <span style={{ fontSize: '10.5px', fontWeight: '800', background: 'rgba(132, 204, 22, 0.14)', color: '#65A30D', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(132, 204, 22, 0.3)' }}>
                    Proportional Leg
                  </span>
                )}
              </div>

              {/* Pickup Stop Select */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                  📍 Boarding Stop (From)
                </label>
                <select
                  value={pickupIndex}
                  onChange={(e) => {
                    const newP = Number(e.target.value);
                    setPickupIndex(newP);
                    if (dropoffIndex <= newP) {
                      setDropoffIndex(Math.min(stops.length - 1, newP + 1));
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {stops.slice(0, stops.length - 1).map((s, idx) => (
                    <option key={`p-${idx}`} value={idx}>
                      {s.name} ({s.cumulativeKm} km marker)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropoff Stop Select */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                  🏁 Alighting Stop (To)
                </label>
                <select
                  value={dropoffIndex}
                  onChange={(e) => setDropoffIndex(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--color-border)',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-bg-secondary)',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {stops.slice(pickupIndex + 1).map((s) => (
                    <option key={`d-${s.index}`} value={s.index}>
                      {s.name} ({s.cumulativeKm} km marker)
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance & Rate Pill */}
              <div style={{
                padding: '10px 14px',
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.3)',
                borderRadius: '12px',
                fontSize: '12px',
                color: '#65A30D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Distance: <strong>{segmentDistanceKm} km</strong></span>
                <span>Proportional Fare: <strong>₹{calculatedUnitPrice}/seat</strong></span>
              </div>
            </div>
          )}

          {/* Luxury Seat Selector */}
          <SeatSelector
            totalSeats={ride.totalSeats}
            availableSeats={ride.availableSeats}
            selectedSeats={selectedSeats}
            onSelectSeats={setSelectedSeats}
            pricePerSeat={calculatedUnitPrice}
            pilotName={ride.driverName}
          />

          {/* Pricing & Checkout Summary Card */}
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
                Fare & Checkout Summary
              </h3>
              <span style={{ fontSize: '10px', fontWeight: '900', background: 'rgba(16, 185, 129, 0.14)', color: '#10B981', padding: '3px 8px', borderRadius: '6px' }}>
                FASTAG INCLUDED
              </span>
            </div>

            {/* Active booking warning */}
            {existingActiveBooking && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1.5px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '14px',
                padding: '12px 14px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#EF4444', fontWeight: '800', fontSize: '13px' }}>
                  <AlertTriangle size={15} />
                  <span>Active Ride In Progress</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '4px 0 8px', lineHeight: 1.4 }}>
                  You have active booking <strong>{existingActiveBooking.bookingRef}</strong>. Manage your ongoing ride.
                </p>
                <button
                  onClick={() => onNavigate('booker-trips')}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  View Active Pass ➔
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>₹{calculatedUnitPrice} × {selectedSeats} {selectedSeats === 1 ? 'seat' : 'seats'}</span>
                <strong style={{ color: 'var(--color-text-primary)' }}>₹{subtotal.toFixed(0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Platform Safety & UPI Escrow <Info size={12} />
                </span>
                <strong style={{ color: 'var(--color-text-primary)' }}>₹{serviceFee.toFixed(0)}</strong>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--color-border)',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    Total Payable Fare
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: '900', color: '#10B981' }}>
                    ₹{totalPrice.toFixed(0)}
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textAlign: 'right' }}>
                  UPI / Cards / NetBanking<br />
                  <strong style={{ color: '#10B981' }}>Instant Refund Guaranteed</strong>
                </div>
              </div>
            </div>

            {/* Special Landmark Note Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-tertiary)', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>
                Pickup Spot Landmark Notes (Optional)
              </label>
              <input
                type="text"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                placeholder="e.g. Near Diamond Bourse gate / 1 trolley bag"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  color: 'var(--color-text-primary)',
                  fontSize: '12.5px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={bookingInProgress || ride.availableSeats <= 0}
              onClick={handleBookClick}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '900',
                cursor: (bookingInProgress || ride.availableSeats <= 0) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(132, 204, 22, 0.4)',
                transition: 'all 150ms ease'
              }}
            >
              {bookingInProgress ? (
                <span>Locking Seats & Generating Pass...</span>
              ) : ride.availableSeats <= 0 ? (
                <span>Ride Fully Booked</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Confirm & Reserve {selectedSeats} {selectedSeats === 1 ? 'Seat' : 'Seats'} (₹{totalPrice.toFixed(0)}) ➔</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Auth Prompt Modal if Guest */}
      {authPromptModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            borderRadius: '24px',
            padding: '32px 28px',
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(132, 204, 22, 0.15)',
              color: '#84CC16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '1.5px solid rgba(132, 204, 22, 0.4)'
            }}>
              <ShieldCheck size={28} />
            </div>

            <h3 style={{ fontSize: '21px', fontWeight: '900', color: 'var(--color-text-primary)', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              Sign In to Complete Booking
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: '0 0 24px', lineHeight: 1.55 }}>
              Please sign in or create an account to verify your identity and generate your digital boarding pass with FASTag toll split.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  setAuthPromptModalOpen(false);
                  onNavigate && onNavigate('auth');
                }}
                style={{
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '13px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
                  transition: 'all 150ms ease'
                }}
              >
                Sign In / Register ➔
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginAsDemo('usr_ananya_rider');
                  setAuthPromptModalOpen(false);
                }}
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1.5px solid rgba(132, 204, 22, 0.3)',
                  color: '#84CC16',
                  borderRadius: '13px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                ⚡ 1-Click Instant Sign In (Demo Rider)
              </button>

              <button
                type="button"
                onClick={() => setAuthPromptModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-text-tertiary)',
                  borderRadius: '12px',
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* UPI Fast Checkout Modal */}
      <UpiCheckoutModal
        isOpen={upiModalOpen}
        onClose={() => setUpiModalOpen(false)}
        ride={ride}
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        pickupLocation={selectedPickup.address || selectedPickup.name}
        dropoffLocation={selectedDropoff.address || selectedDropoff.name}
        onConfirmBooking={handleBookSeatsDirectly}
      />

      {/* In-Trip Pilot ↔ Passenger Chat Modal */}
      <TripChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        ride={ride}
        user={user}
      />

      {/* Booking In Progress WiFi Loader */}
      <WifiLoader loading={bookingInProgress} text="securing boarding pass..." />

      {/* Confirmed Booking Digital Boarding Pass Modal */}
      {confirmedBooking && (
        <BoardingPassModal
          booking={confirmedBooking}
          onClose={() => {
            setConfirmedBooking(null);
            onNavigate && onNavigate('booker-trips');
          }}
          onCancelBooking={() => {
            setConfirmedBooking(null);
            fetchRideDetails();
          }}
        />
      )}
    </div>
  );
}
