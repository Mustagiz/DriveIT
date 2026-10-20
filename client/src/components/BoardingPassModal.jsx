import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { 
  X, Car, MapPin, Navigation, User, Phone, ShieldCheck, 
  QrCode, AlertTriangle, ShieldAlert, Sparkles, KeyRound, 
  Radio, Share2, CheckCircle2, Gauge, Zap, Wind, ArrowRight, ExternalLink 
} from 'lucide-react';
import { Card, CardBody, Button, Badge } from '../components/ui';
import EmergencySOSModal from './EmergencySOSModal';
import LiveRideTrackingCockpit from './LiveRideTrackingCockpit';
import QRCodeDisplay from './common/QRCodeDisplay';
import { formatDate, formatTime } from '../utils/dateTime';
import { sounds } from '../utils/soundEffects';
import { useToast } from './Toast';
import styles from './BoardingPassModal.module.css';

export default function BoardingPassModal({ booking, onClose, onCancelBooking }) {
  const [showSOS, setShowSOS] = useState(false);
  const [showCockpit, setShowCockpit] = useState(false);
  const [tokenCounter, setTokenCounter] = useState(30);
  const [isBoardedLocally, setIsBoardedLocally] = useState(booking?.boardingStatus === 'BOARDED');
  const [boardedTimestamp, setBoardedTimestamp] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTokenCounter((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!booking) return null;

  const getNumericOtp = (b) => {
    if (b?.boardingOtp && /^\d{4}$/.test(String(b.boardingOtp).trim())) {
      return String(b.boardingOtp).trim();
    }
    const match = (b?.id || b?.bookingRef || '').match(/\d{4}/);
    if (match) return match[0];

    const str = b?.id || b?.bookingRef || '8921';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 9000;
    }
    return String(1000 + Math.abs(hash));
  };

  const isCancelled = booking.status === 'CANCELLED';
  const isBoarded = isBoardedLocally || booking.boardingStatus === 'BOARDED';
  const otpCode = getNumericOtp(booking);

  const handleSimulateBoarding = () => {
    sounds.playBoardingChime();
    setIsBoardedLocally(true);
    const now = new Date();
    setBoardedTimestamp(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    showToast('Passenger boarding clearance verified successfully! 🛫', 'success');
  };

  const handleSharePass = async () => {
    const title = `Driveit Pass: ${booking.bookingRef}`;
    const text = `Intercity Ride Boarding Pass: ${booking.passengerName} (${booking.pickupLocation || 'Origin'} ➔ ${booking.dropoffLocation || 'Destination'}). OTP: ${otpCode}`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        showToast('Boarding pass shared successfully!', 'success');
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\nLink: ${url}`);
        showToast('Boarding pass details copied to clipboard!', 'info');
      } catch (e) {
        showToast('Unable to copy to clipboard', 'warning');
      }
    }
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.ticketContainer}>
          {/* 1. Airline Header Ribbon */}
          <div className={`${styles.ticketHeader} ${isCancelled ? styles.ticketHeaderCancelled : ''}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo size="sm" showTagline={false} light={isCancelled} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '900', letterSpacing: '0.04em' }}>
                  DIGITAL BOARDING PASS
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', opacity: 0.9 }}>
                  Ref: {booking.bookingRef}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '900',
                background: isBoarded ? '#10B981' : 'rgba(0, 0, 0, 0.25)',
                color: isBoarded ? '#000000' : '#FFFFFF',
                padding: '3px 10px',
                borderRadius: '8px',
                textTransform: 'uppercase'
              }}>
                {isBoarded ? 'BOARDED' : isCancelled ? 'CANCELLED' : 'READY TO BOARD'}
              </span>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(0, 0, 0, 0.15)',
                  border: 'none',
                  color: isCancelled ? '#FFFFFF' : '#0E240B',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Close Pass"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: '24px', position: 'relative' }}>
            {/* 2. Passenger & Dynamic QR Code Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-bg-secondary)',
              border: '1.5px solid var(--color-border)',
              padding: '18px 20px',
              borderRadius: '20px',
              marginBottom: '14px',
              position: 'relative'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800' }}>
                  CONFIRMED PASSENGER
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                  {booking.passengerName}
                </div>
                <div style={{ fontSize: '13px', color: '#10B981', marginTop: '2px', fontWeight: '800' }}>
                  {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat Reserved (Cabin)' : 'Seats Reserved (Cabin)'}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Paid: <strong style={{ color: 'var(--color-text-primary)' }}>₹{booking.totalPrice?.toFixed(0) || 350}</strong> (FASTag Toll Split Included)
                </div>

                {/* 4-Digit Boarding OTP Code */}
                <div style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(132, 204, 22, 0.14)',
                  border: '1px solid rgba(132, 204, 22, 0.35)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: '800'
                }}>
                  <KeyRound size={13} />
                  <span>Boarding OTP: <strong>{otpCode}</strong></span>
                </div>
              </div>

              {/* Dynamic Scannable QR Code with TOTP Progress */}
              <div style={{
                background: '#FFFFFF',
                padding: '8px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                border: '2px solid #84CC16',
                width: '100px'
              }}>
                <QRCodeDisplay
                  value={JSON.stringify({
                    bookingRef: booking.bookingRef || booking.id || 'DRIVE-MUM-PUN-889',
                    passengerName: booking.passengerName || 'Ananya Sen',
                    otp: otpCode,
                    pickup: booking.pickupLocation || booking.ride?.originAddress || 'Origin Hub',
                    dropoff: booking.dropoffLocation || booking.ride?.destinationAddress || 'Destination Hub',
                    seats: booking.seatsBooked || 1,
                    totalPrice: booking.totalPrice || 385,
                    tokenEpoch: Math.floor(Date.now() / 30000)
                  })}
                  size={84}
                  darkColor="#0F172A"
                  lightColor="#FFFFFF"
                />
                <span style={{ fontSize: '9px', color: '#166534', fontWeight: '900', marginTop: '4px', letterSpacing: '0.04em' }}>
                  SCAN AT GATE
                </span>
                
                {/* 30-Second Rolling Meter */}
                <div className={styles.totpBarContainer}>
                  <div 
                    className={styles.totpBarFill} 
                    style={{ width: `${(tokenCounter / 30) * 100}%` }} 
                  />
                </div>
                <span style={{ fontSize: '8px', color: '#64748B', marginTop: '2px' }}>
                  Refreshes {tokenCounter}s
                </span>
              </div>
            </div>

            {/* Boarded Verification Stamp overlay if passenger is boarded */}
            {isBoarded && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 16px 0' }}>
                <div className={styles.stampBadge}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <CheckCircle2 size={15} />
                    <span>BOARDED & VERIFIED ✓</span>
                  </div>
                  <span style={{ fontSize: '9.5px', opacity: 0.85, marginTop: '2px' }}>
                    Cleared: {boardedTimestamp || '07:32 AM'} • FastLane Hub
                  </span>
                </div>
              </div>
            )}

            {/* 3. Physical Airline Ticket Perforated Divider with Notches */}
            <div className={styles.perforatedLineContainer}>
              <div className={styles.notchLeft} />
              <div className={styles.dashedDivider} />
              <div className={styles.notchRight} />
            </div>

            {/* 4. Route Waypoints */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: '18px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: '#10B981', fontWeight: '800', textTransform: 'uppercase' }}>PICKUP POINT</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {booking.pickupLocation || booking.ride?.originAddress || 'Origin Hub'}
                  </div>
                  {booking.ride && (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '2px', fontWeight: '600' }}>
                      Date: {formatDate(booking.ride.departureDate)} • Time: {formatTime(booking.ride.departureTime)}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', marginTop: '4px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '10.5px', color: '#EF4444', fontWeight: '800', textTransform: 'uppercase' }}>DROPOFF POINT</div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    {booking.dropoffLocation || booking.ride?.destinationAddress || 'Destination Hub'}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Driver & Vehicle Identity */}
            <div style={{
              background: 'rgba(132, 204, 22, 0.08)',
              border: '1.5px solid rgba(132, 204, 22, 0.25)',
              borderRadius: '18px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={booking.driverAvatar || booking.driver?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                  alt="Driver"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #84CC16' }}
                />
                <div>
                  <div style={{ fontSize: '14.5px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                    {booking.driverName || booking.driver?.name || 'Rahul Sharma (UIDAI Verified)'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#166534', fontWeight: '700' }}>
                    {booking.ride?.vehicle ? `${booking.ride.vehicle.make} ${booking.ride.vehicle.model} • ${booking.ride.vehicle.plate}` : 'Tata Nexon EV • MH-12-RN-7788'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleSharePass}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    cursor: 'pointer'
                  }}
                  title="Share Boarding Pass"
                >
                  <Share2 size={13} />
                </button>

                {!isBoarded && !isCancelled && (
                  <button
                    type="button"
                    onClick={handleSimulateBoarding}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10B981',
                      color: '#10B981',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                    title="Simulate Pilot Scanning & Boarding Passenger"
                  >
                    Check In ✓
                  </button>
                )}
              </div>
            </div>

            {/* 6. Embedded Live Highway Telemetry Strip */}
            <div className={styles.telemetryStrip}>
              <div className={styles.telemetryMetrics}>
                <div className={styles.telemetryItem} title="Highway Cruising Velocity">
                  <Gauge size={14} color="#84CC16" />
                  <span>88 km/h</span>
                </div>
                <div className={styles.telemetryItem} title="Battery State of Charge">
                  <Zap size={14} color="#10B981" />
                  <span>76% SoC</span>
                </div>
                <div className={styles.telemetryItem} title="Next FASTag Toll Plaza">
                  <Navigation size={14} color="#38BDF8" />
                  <span>14 km to Toll</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowCockpit(true)}
                  style={{
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '7px 12px',
                    fontSize: '11.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <Radio size={12} className="animate-pulse" />
                  <span>Cockpit HUD 🛰️</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSOS(true)}
                  style={{
                    background: '#EF4444',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '7px 10px',
                    fontSize: '11.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Highway Emergency SOS"
                >
                  <ShieldAlert size={12} />
                  <span>SOS</span>
                </button>
              </div>
            </div>

            {/* 7. Modal Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {!isCancelled && onCancelBooking && (
                <button
                  type="button"
                  onClick={() => onCancelBooking(booking.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Booking
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  border: 'none',
                  color: '#0E240B',
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  fontSize: '13.5px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
                  transition: 'all 150ms ease'
                }}
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Highway Cockpit Modal */}
      {showCockpit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{ width: '720px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <LiveRideTrackingCockpit
              ride={booking.ride || {
                originCity: booking.pickupLocation || 'Mumbai',
                destinationCity: booking.dropoffLocation || 'Pune',
                vehicle: { make: 'Tata', model: 'Nexon EV', plate: 'MH-12-RN-7788', electric: true }
              }}
              onClose={() => setShowCockpit(false)}
            />
            <button
              type="button"
              onClick={() => setShowCockpit(false)}
              style={{
                width: '100%',
                marginTop: '12px',
                background: 'var(--color-bg-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Return to Boarding Pass
            </button>
          </div>
        </div>
      )}

      {/* Emergency SOS Modal Integration */}
      {showSOS && (
        <EmergencySOSModal
          isOpen={showSOS}
          onClose={() => setShowSOS(false)}
          tripDetails={{
            vehiclePlate: booking.ride?.vehicle?.plate || 'MH-12-RN-7788',
            vehicleModel: booking.ride?.vehicle ? `${booking.ride.vehicle.make} ${booking.ride.vehicle.model}` : 'Tata Nexon EV',
            pilotName: booking.driverName || 'Rahul Sharma'
          }}
        />
      )}
    </>
  );
}
