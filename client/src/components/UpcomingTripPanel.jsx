import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function UpcomingTripPanel({ onOpenBoardingPass, onNavigate, onQuickSelectRoute }) {
  const { user, isAuthenticated, token } = useAuth();
  const { isDark } = useTheme();
  const [activeBooking, setActiveBooking] = useState(null);
  const [pilotRide, setPilotRide] = useState(null);
  const [pilotManifest, setPilotManifest] = useState(null);
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
    }
  }, [user, isAuthenticated]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
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
            // Fetch the passenger manifest for this ride
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
        }
      }
    } catch (err) {
      console.error('Error loading active trip:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. PILOT UPCOMING TRIP VIEW WITH SPECIFIC PASSENGER DETAILS ---
  if (isPilot && pilotRide) {
    const originName = pilotRide.originCity ? pilotRide.originCity.split(',')[0] : 'Mumbai';
    const destName = pilotRide.destinationCity ? pilotRide.destinationCity.split(',')[0] : 'Pune';
    const passengers = pilotManifest?.passengers || [];
    const totalBookedSeats = pilotRide.bookedSeats || passengers.reduce((acc, p) => acc + (p.seatsBooked || 1), 0);
    const earnings = pilotRide.totalEarnings || (totalBookedSeats * Number(pilotRide.pricePerSeat || 350));

    return (
      <div style={{
        height: '380px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))'
          : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.35)' : '1.5px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '20px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(245, 158, 11, 0.15)'
          : '0 10px 25px -5px rgba(245, 158, 11, 0.15)',
        backdropFilter: 'blur(20px)',
        transition: 'all 200ms ease'
      }}>
        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '3px 10px',
                borderRadius: '12px',
                color: isDark ? '#F59E0B' : '#D97706',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                <Car size={12} />
                PILOT DRIVE • SCHEDULED
              </span>
              <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                {pilotRide.vehicle?.make} {pilotRide.vehicle?.model}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '13px', fontWeight: '900' }}>
              <IndianRupee size={13} />
              <span>₹{earnings} Earned</span>
            </div>
          </div>

          {/* Route & Departure Bar */}
          <div style={{
            background: isDark ? 'rgba(0, 0, 0, 0.28)' : '#F8FAFC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 12px',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {originName}
                </span>
                <ArrowRight size={12} color={isDark ? '#94A3B8' : '#64748B'} />
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px #F59E0B' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {destName}
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#F59E0B' : '#D97706', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 6px', borderRadius: '6px' }}>
                {totalBookedSeats} / {pilotRide.totalSeats} Seats Booked
              </span>
            </div>

            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅 {pilotRide.departureDate} at {pilotRide.departureTime}</span>
              <span>•</span>
              <span>₹{pilotRide.pricePerSeat}/seat</span>
              {pilotRide.vehicle?.electric && (
                <>
                  <span>•</span>
                  <span style={{ color: '#06B6D4', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                    <Zap size={10} /> EV
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Specific Details of Passengers Booked */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#F59E0B' : '#D97706', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={13} />
                Booked Passengers ({passengers.length})
              </span>
              <span style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Contact & Boarding Details
              </span>
            </div>

            {passengers.length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '130px',
                overflowY: 'auto',
                paddingRight: '2px',
                scrollbarWidth: 'thin'
              }}>
                {passengers.map((p, idx) => (
                  <div
                    key={p.bookingId || idx}
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <img
                        src={p.passengerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={p.passengerName || p.name || 'Passenger'}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.passengerName || p.name || 'Verified Passenger'}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                          <Phone size={10} />
                          <a
                            href={`tel:${p.passengerPhone || p.phone || '+91 98110 54321'}`}
                            style={{ color: '#10B981', textDecoration: 'none' }}
                          >
                            {p.passengerPhone || p.phone || '+91 98110 54321'}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '10px', fontWeight: '800', background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9', color: isDark ? '#CBD5E1' : '#475569', padding: '3px 6px', borderRadius: '6px' }}>
                        {p.seatsBooked || 1} Seat
                      </span>
                      <a
                        href={`tel:${p.passengerPhone || p.phone || '+91 98110 54321'}`}
                        title={`Call ${p.passengerName || p.name || 'Passenger'}`}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#10B981',
                          padding: '5px 8px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '800',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 120ms ease'
                        }}
                      >
                        <PhoneCall size={11} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: isDark ? '1px dashed rgba(255, 255, 255, 0.15)' : '1px dashed #CBD5E1',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                fontSize: '12px',
                color: isDark ? '#94A3B8' : '#64748B'
              }}>
                🚗 No co-passengers booked yet. Empty seats are live on expressway radar.
              </div>
            )}
          </div>
        </div>

        {/* Footer Action Button */}
        <button
          type="button"
          onClick={() => {
            if (onNavigate) {
              onNavigate('lister');
            } else {
              window.location.href = '/lister';
            }
          }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#000000',
            border: 'none',
            borderRadius: '12px',
            padding: '11px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.4)',
            transition: 'all 150ms ease'
          }}
        >
          <Users size={15} />
          <span>Manage Passenger Manifest in Pilot Console</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // --- 2. PASSENGER (BOOKER) ACTIVE TRIP VIEW ---
  if (activeBooking) {
    const originName = activeBooking.ride ? activeBooking.ride.originCity?.split(',')[0] : 'Mumbai';
    const destName = activeBooking.ride ? activeBooking.ride.destinationCity?.split(',')[0] : 'Pune';

    return (
      <div style={{
        height: '380px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9))'
          : 'linear-gradient(145deg, #FFFFFF, #F8FAFC)',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #E2E8F0',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(245, 158, 11, 0.15)'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
        backdropFilter: 'blur(20px)',
        transition: 'all 200ms ease'
      }}>
        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '3px 10px',
                borderRadius: '12px',
                color: '#10B981',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                CONFIRMED
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                Ref: {activeBooking.bookingRef || 'DRIVE-101'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isDark ? '#F59E0B' : '#D97706', fontSize: '13px', fontWeight: '800' }}>
              <Zap size={14} />
              <span>₹{activeBooking.totalPrice}</span>
            </div>
          </div>

          {/* Route Display with glowing pins */}
          <div style={{
            background: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAFC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '12px 14px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {originName}
                </span>
              </div>
              <ArrowRight size={14} color={isDark ? '#94A3B8' : '#64748B'} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px #F59E0B' }} />
                <span style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {destName}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', display: 'flex', justifyContent: 'space-between' }}>
              <span>{activeBooking.ride?.departureDate || 'Tomorrow'} • {activeBooking.ride?.departureTime || '07:30 AM'}</span>
              <span>{activeBooking.seatsBooked || 1} Seat Reserved</span>
            </div>
          </div>

          {/* Pilot Info Strip with Contact Option */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
            borderRadius: '12px'
          }}>
            <img
              src={activeBooking.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
              alt={activeBooking.driverName || 'Pilot'}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeBooking.driverName || 'Rahul Sharma'}
              </div>
              <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Verified EV Pilot • {activeBooking.ride?.vehicle?.make || 'Tata'} {activeBooking.ride?.vehicle?.model || 'Nexon EV'}
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={13} />
              FASTag
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onOpenBoardingPass && onOpenBoardingPass(activeBooking)}
          style={{
            width: '100%',
            background: '#F59E0B',
            color: '#000000',
            border: 'none',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.4)',
            transition: 'all 150ms ease'
          }}
        >
          <QrCode size={16} />
          <span>View Digital Boarding Pass</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // Premium Empty State with Quick Explore Corridor Shortcuts
  return (
    <div style={{
      height: '380px',
      background: isDark
        ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 53, 0.9))'
        : '#FFFFFF',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
      borderRadius: '20px',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: isDark
        ? '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
      backdropFilter: 'blur(20px)',
      transition: 'all 200ms ease'
    }}>
      {/* Top Beacon & Heading */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          position: 'relative',
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: isDark
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))'
            : 'rgba(245, 158, 11, 0.1)',
          border: isDark ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(245, 158, 11, 0.3)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.2)'
        }}>
          <Car size={26} color={isDark ? '#F59E0B' : '#D97706'} />
          <span style={{
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#10B981',
            border: `2px solid ${isDark ? '#0F172A' : '#FFFFFF'}`,
            boxShadow: '0 0 8px #10B981'
          }} />
        </div>

        <div style={{
          fontSize: '16px',
          fontWeight: '800',
          color: isDark ? '#FFFFFF' : '#0F172A',
          marginBottom: '4px',
          letterSpacing: '-0.01em'
        }}>
          {isPilot ? 'No Active Pilot Routes' : 'No Active Rides in Progress'}
        </div>

        <p style={{
          fontSize: '12px',
          color: isDark ? '#94A3B8' : '#64748B',
          lineHeight: 1.4,
          margin: 0
        }}>
          {isPilot 
            ? 'Post a scheduled corridor ride to open seat bookings for verified commuters:'
            : 'Tap a popular expressway corridor below to match instant EV rides:'}
        </p>
      </div>

      {/* Quick Corridor Selection Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0' }}>
        {[
          { from: 'Mumbai', to: 'Pune', fare: '₹350', time: '2h 15m' },
          { from: 'Bengaluru', to: 'Chennai', fare: '₹650', time: '4h 30m' },
          { from: 'Delhi', to: 'Jaipur', fare: '₹550', time: '3h 45m' }
        ].map((c) => (
          <button
            key={`${c.from}-${c.to}`}
            type="button"
            onClick={() => onQuickSelectRoute && onQuickSelectRoute(c.from, c.to)}
            style={{
              width: '100%',
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#F59E0B';
              e.currentTarget.style.background = isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
              e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A' }}>
                {c.from} ➔ {c.to}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>{c.time}</span>
              <span style={{ fontSize: '12px', fontWeight: '900', color: '#10B981' }}>{c.fare}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Trust & Compliance Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F1F5F9',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '6px 10px',
        fontSize: '11px',
        color: isDark ? '#94A3B8' : '#64748B',
        fontWeight: '600'
      }}>
        <Shield size={12} color="#10B981" />
        <span>100% Aadhaar & FASTag Verified Pilot Fleet</span>
      </div>
    </div>
  );
}
