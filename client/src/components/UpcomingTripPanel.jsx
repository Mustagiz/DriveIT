import React, { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../utils/dateTime';
import { 
  Car, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Shield,
  Phone,
  PhoneCall,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  IndianRupee,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Radio,
  Star,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Smart helper to neatly format and truncate long city / address names
const formatShortLocation = (cityOrAddr, fallback = 'Mumbai') => {
  if (!cityOrAddr) return fallback;
  const str = String(cityOrAddr).trim();
  const lower = str.toLowerCase();
  
  // High-frequency Indian cities normalization
  if (lower.includes('mumbai') || lower.includes('bkc') || lower.includes('bandra') || lower.includes('dadar') || lower.includes('bhendi')) return 'Mumbai';
  if (lower.includes('pune') || lower.includes('swargate') || lower.includes('hinjewadi') || lower.includes('wakad')) return 'Pune';
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('indiranagar') || lower.includes('koramangala')) return 'Bengaluru';
  if (lower.includes('chennai') || lower.includes('guindy') || lower.includes('omr')) return 'Chennai';
  if (lower.includes('delhi') || lower.includes('gurgaon') || lower.includes('noida') || lower.includes('connaught')) return 'Delhi';
  if (lower.includes('jaipur') || lower.includes('c-scheme')) return 'Jaipur';
  if (lower.includes('hyderabad') || lower.includes('hitec')) return 'Hyderabad';
  if (lower.includes('vijayawada')) return 'Vijayawada';
  if (lower.includes('goa')) return 'Goa';
  if (lower.includes('nashik')) return 'Nashik';

  // Fallback: take first token before comma
  const firstChunk = str.split(',')[0].trim();
  if (firstChunk.length > 10) {
    return firstChunk.slice(0, 8) + '...';
  }
  return firstChunk;
};

export default function UpcomingTripPanel({ onOpenBoardingPass, onNavigate, onQuickSelectRoute, onActiveTripChange }) {

  const { user, isAuthenticated, token } = useAuth();
  const { isDark } = useTheme();
  const [activeBooking, setActiveBooking] = useState(null);
  const [pilotRide, setPilotRide] = useState(null);
  const [pilotManifest, setPilotManifest] = useState(null);
  const [liveDepartures, setLiveDepartures] = useState([]);
  const [loading, setLoading] = useState(false);

  const isPilot = user?.roles?.includes('lister');
  const isBooker = user?.roles?.includes('booker') || !isPilot;

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrips();
    } else {
      setActiveBooking(null);
      setPilotRide(null);
      setPilotManifest(null);
      if (onActiveTripChange) onActiveTripChange(false);
      fetchLiveDepartures();
    }
  }, [user, isAuthenticated]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      let hasActive = false;
      // 1. If user is a pilot/lister, check for their scheduled listed rides & passenger manifest
      if (isPilot) {
        const listerRes = await fetch('/api/lister/rides', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (listerRes.ok) {
          const listerData = await listerRes.json();
          const upcoming = (listerData.rides || []).find(r => r.status === 'ACTIVE');
          if (upcoming) {
            setPilotRide(upcoming);
            hasActive = true;
            const manifestRes = await fetch(`/api/lister/rides/${upcoming.id}/manifest`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (manifestRes.ok) {
              const mData = await manifestRes.json();
              setPilotManifest(mData);
            }
          } else {
            setPilotRide(null);
            setPilotManifest(null);
          }
        }
      }

      // 2. Fetch passenger bookings if user has booker role
      if (isBooker) {
        const bookerRes = await fetch('/api/booker/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (bookerRes.ok) {
          const bookerData = await bookerRes.json();
          const active = (bookerData.bookings || []).find(b => b.status === 'CONFIRMED');
          setActiveBooking(active || null);
          if (active) {
            hasActive = true;
          } else {
            fetchLiveDepartures();
          }
        } else {
          fetchLiveDepartures();
        }
      }

      if (onActiveTripChange) onActiveTripChange(hasActive);
    } catch (err) {
      console.error('Error loading active trip:', err);
      if (onActiveTripChange) onActiveTripChange(false);
      fetchLiveDepartures();
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveDepartures = async () => {
    try {
      const res = await fetch('/api/rides?limit=3');
      if (res.ok) {
        const data = await res.json();
        setLiveDepartures((data.rides || []).slice(0, 3));
      }
    } catch (e) {
      console.warn('Could not fetch live departures:', e);
    }
  };

  // --- 1. PILOT SCHEDULED TRIP VIEW ---
  if (isPilot && pilotRide) {
    const originName = pilotRide.originCity ? pilotRide.originCity.split(',')[0] : 'Mumbai';
    const destName = pilotRide.destinationCity ? pilotRide.destinationCity.split(',')[0] : 'Pune';
    const passengers = pilotManifest?.passengers || [];
    const totalBookedSeats = pilotRide.bookedSeats || passengers.reduce((acc, p) => acc + (p.seatsBooked || 1), 0);
    const earnings = pilotRide.totalEarnings || (totalBookedSeats * Number(pilotRide.pricePerSeat || 350));

    return (
      <div style={{
        height: '480px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 53, 0.95))'
          : '#FFFFFF',
        border: isDark ? '1.5px solid rgba(132, 204, 22, 0.35)' : '1.5px solid rgba(132, 204, 22, 0.35)',
        borderRadius: '22px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(132, 204, 22, 0.15)'
          : '0 12px 30px -8px rgba(132, 204, 22, 0.15)',
        backdropFilter: 'blur(20px)',
        boxSizing: 'border-box'
      }}>
        {/* Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(132, 204, 22, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(132, 204, 22, 0.14)',
                border: '1px solid rgba(132, 204, 22, 0.35)',
                padding: '4px 10px',
                borderRadius: '10px',
                color: isDark ? '#84CC16' : '#65A30D',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.03em'
              }}>
                <Car size={13} />
                PILOT DRIVE • ACTIVE
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700' }}>
                {pilotRide.vehicle?.make} {pilotRide.vehicle?.model}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '14px', fontWeight: '900' }}>
              <span>₹{earnings} Earned</span>
            </div>
          </div>

          {/* Route & Departure Bar */}
          <div style={{
            background: isDark ? 'rgba(0, 0, 0, 0.3)' : 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                  {originName}
                </span>
                <ArrowRight size={13} color="var(--color-text-tertiary)" />
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 6px #EF4444' }} />
                <span style={{ fontSize: '14px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                  {destName}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#84CC16', background: 'rgba(132, 204, 22, 0.12)', padding: '3px 8px', borderRadius: '8px' }}>
                {totalBookedSeats} / {pilotRide.totalSeats} Booked
              </span>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
              <span>📅 {formatDate(pilotRide.departureDate)} • {formatTime(pilotRide.departureTime)}</span>
              <span>•</span>
              <span>₹{pilotRide.pricePerSeat}/seat</span>
              {pilotRide.vehicle?.electric && (
                <>
                  <span>•</span>
                  <span style={{ color: '#10B981', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Zap size={11} fill="currentColor" /> EV
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Booked Passengers Manifest */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#84CC16', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={13} />
                Booked Passengers ({passengers.length})
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                Direct Contact & OTP
              </span>
            </div>

            {passengers.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '165px',
                overflowY: 'auto',
                paddingRight: '2px'
              }}>
                {passengers.map((p, idx) => (
                  <div
                    key={p.bookingId || idx}
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={p.passengerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={p.passengerName || 'Passenger'}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.passengerName || 'Verified Passenger'}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={10} />
                          <span>{p.passengerPhone || '+91 98110 54321'}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${p.passengerPhone || '+91 98110 54321'}`}
                      style={{
                        background: 'rgba(16, 185, 129, 0.14)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#10B981',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        textDecoration: 'none'
                      }}
                    >
                      <PhoneCall size={11} />
                      <span>Call</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'var(--color-bg-secondary)',
                border: '1px dashed var(--color-border)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                fontSize: '12.5px',
                color: 'var(--color-text-tertiary)'
              }}>
                🚗 No co-passengers booked yet. Empty seats are broadcast live on Expressway Radar.
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Button */}
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate(isAuthenticated ? 'lister-hub' : 'auth-pilot');
            } else {
              window.location.hash = isAuthenticated ? '#/lister-hub' : '#/auth-pilot';
            }
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
            color: '#000000',
            border: 'none',
            borderRadius: '14px',
            padding: '13px',
            fontSize: '13.5px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)',
            transition: 'all 150ms ease'
          }}
        >
          <Users size={16} />
          <span>Open Pilot Flight Control</span>
          <ChevronRight size={15} />
        </button>
      </div>
    );
  }

  // --- 2. PASSENGER (BOOKER) CONFIRMED ACTIVE RIDE VIEW ---
  if (activeBooking) {
    const originName = activeBooking.ride ? (activeBooking.ride.originAddress || activeBooking.ride.originCity || 'Mumbai') : (activeBooking.pickupLocation || 'Bandra Kurla Complex (BKC), Mumbai');
    const destName = activeBooking.ride ? (activeBooking.ride.destinationAddress || activeBooking.ride.destinationCity || 'Pune') : (activeBooking.dropoffLocation || 'Swargate Metro Hub, Pune');
    const driverName = activeBooking.driver?.name || activeBooking.driverName || 'Rahul Sharma';
    const driverAvatar = activeBooking.driver?.avatar || activeBooking.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200';
    const vehicleModel = activeBooking.ride?.vehicle?.make ? `${activeBooking.ride.vehicle.make} ${activeBooking.ride.vehicle.model}` : 'Tata Nexon EV';
    const otp = activeBooking.boardingOtp || '4829';

    return (
      <div style={{
        height: '480px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 53, 0.95))'
          : '#FFFFFF',
        border: '1.5px solid var(--color-border)',
        borderRadius: '22px',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(16, 185, 129, 0.15)'
          : '0 12px 30px -8px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(20px)',
        boxSizing: 'border-box'
      }}>
        {/* Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                padding: '4px 10px',
                borderRadius: '10px',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: '900',
                letterSpacing: '0.03em'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                CONFIRMED • READY
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '700' }}>
                Ref: {activeBooking.bookingRef || 'DRIVE-104'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#10B981', fontSize: '16px', fontWeight: '900' }}>
              <span>₹{activeBooking.totalPrice || activeBooking.unitPrice || 385}</span>
            </div>
          </div>

          {/* Route Boarding Module */}
          <div style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '14px 16px',
            marginBottom: '14px'
          }}>
            {/* Pickup */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', marginTop: '4px', boxShadow: '0 0 6px #10B981' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '900', color: '#10B981', textTransform: 'uppercase' }}>
                  PICKUP • {formatTime(activeBooking.ride?.departureTime || '07:30')}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {originName}
                </div>
              </div>
            </div>

            {/* Dropoff */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', marginTop: '4px', boxShadow: '0 0 6px #EF4444' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: '900', color: '#EF4444', textTransform: 'uppercase' }}>
                  DATE • {formatDate(activeBooking.ride?.departureDate || new Date())}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {destName}
                </div>
              </div>
            </div>
          </div>

          {/* Pilot Info Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <img
                src={driverAvatar}
                alt={driverName}
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #10B981' }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{driverName}</span>
                  <span style={{ fontSize: '10px', color: '#84CC16', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '1px' }}>
                    <Star size={10} fill="#84CC16" /> 4.95
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                  {vehicleModel} • <span style={{ color: '#10B981', fontWeight: '800' }}>UIDAI Verified</span>
                </div>
              </div>
            </div>

            <a
              href="tel:+919811054321"
              title="Call Highway Pilot"
              style={{
                background: 'rgba(16, 185, 129, 0.14)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                padding: '6px 12px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: '800',
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={12} />
              <span>Call</span>
            </a>
          </div>

          {/* Boarding OTP Capsule */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: isDark ? 'rgba(132, 204, 22, 0.1)' : 'rgba(132, 204, 22, 0.08)',
            border: '1.5px dashed rgba(132, 204, 22, 0.4)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={14} color="#84CC16" />
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D' }}>
                Boarding OTP:
              </span>
              <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '0.12em', color: isDark ? '#FFFFFF' : '#000000' }}>
                {otp}
              </span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
              Share at pickup
            </span>
          </div>
        </div>

        {/* Action Buttons: Cockpit HUD + Boarding Pass */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('cockpit', { queryParams: { tripId: activeBooking?.rideId || 'ride_mum_pun_001' } })}
            style={{
              flex: 1,
              background: '#0F172A',
              color: '#BEF264',
              border: '1.5px solid #84CC16',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(132, 204, 22, 0.2)',
              transition: 'all 150ms ease'
            }}
          >
            <Radio size={16} color="#84CC16" />
            <span>Live Cockpit</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenBoardingPass && onOpenBoardingPass(activeBooking)}
            style={{
              flex: 1.2,
              background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)',
              transition: 'all 150ms ease'
            }}
          >
            <QrCode size={16} />
            <span>Boarding Pass</span>
          </button>
        </div>
      </div>
    );
  }

  // --- 3. DYNAMIC LIVE DEPARTING PILOTS STATE (When No Active Booking) ---
  return (
    <div style={{
      height: '480px',
      background: isDark
        ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 53, 0.95))'
        : '#FFFFFF',
      border: '1.5px solid var(--color-border)',
      borderRadius: '22px',
      padding: '22px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isDark
        ? '0 20px 40px -15px rgba(0, 0, 0, 0.5)'
        : '0 12px 30px -8px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(20px)',
      boxSizing: 'border-box'
    }}>
      {/* Top Header Strip */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(16, 185, 129, 0.14)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              padding: '4px 10px',
              borderRadius: '10px',
              color: '#10B981',
              fontSize: '11px',
              fontWeight: '900'
            }}>
              <Radio size={12} />
              LIVE EXPRESSWAY RADAR
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '800' }}>
            ● Verified Fleet
          </span>
        </div>

        <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--color-text-primary)', marginBottom: '3px' }}>
          Next Highway Departures
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', marginBottom: '12px' }}>
          Tap a scheduled pilot to focus route on Live Radar map:
        </div>

        {/* Live Departures List (Dynamically Fetched from DB) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {liveDepartures.length > 0 ? (
            liveDepartures.map((ride) => {
              const isEV = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
              const orig = formatShortLocation(ride.originCity || ride.originAddress, 'Mumbai');
              const dest = formatShortLocation(ride.destinationCity || ride.destinationAddress, 'Pune');

              return (
                <div
                  key={ride.id}
                  onClick={() => onQuickSelectRoute && onQuickSelectRoute(orig, dest)}
                  style={{
                    background: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 160ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#84CC16';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: isEV ? 'rgba(16, 185, 129, 0.15)' : 'rgba(132, 204, 22, 0.15)',
                      color: isEV ? '#10B981' : '#84CC16',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isEV ? <Zap size={16} fill="currentColor" /> : <Car size={16} />}
                    </div>

                    <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '13.5px',
                        fontWeight: '900',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden'
                      }}>
                        <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ride.originCity || ride.originAddress}>
                          {orig}
                        </span>
                        <ArrowRight size={13} color="#84CC16" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ride.destinationCity || ride.destinationAddress}>
                          {dest}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ride.driverName || 'Verified Pilot'} • {formatTime(ride.departureTime || '07:30')}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#10B981' }}>
                      ₹{ride.pricePerSeat}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: '700' }}>
                      FASTag Included
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '32px 16px',
              borderRadius: '16px',
              background: 'var(--color-bg-secondary)',
              border: '1px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Car size={32} color="#94A3B8" />
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                No Active Rides Right Now
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', maxWidth: '240px', lineHeight: 1.4 }}>
                Search any expressway corridor on the left or be the first pilot to publish a route.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Exploration CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('pilots') : (window.location.hash = '#/pilots')}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
            color: '#0E240B',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px',
            fontSize: '13.5px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(132, 204, 22, 0.45)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(132, 204, 22, 0.35)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
          }}
        >
          <Sparkles size={15} />
          <span>Explore All Highway Pilots ⚡</span>
          <ArrowRight size={15} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'var(--color-text-tertiary)',
          fontWeight: '700'
        }}>
          <ShieldCheck size={13} color="#10B981" />
          <span>₹5,00,000 FASTag Trip Insurance on All Rides</span>
        </div>
      </div>
    </div>
  );
}
