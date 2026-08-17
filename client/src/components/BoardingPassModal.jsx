import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { X, Car, MapPin, Navigation, User, Phone, ShieldCheck, QrCode, AlertTriangle, ShieldAlert, Sparkles, KeyRound, Radio } from 'lucide-react';
import { Card, CardBody, Button, Badge } from '../components/ui';
import EmergencySOSModal from './EmergencySOSModal';
import LiveRideTrackingCockpit from './LiveRideTrackingCockpit';
import QRCodeDisplay from './common/QRCodeDisplay';

export default function BoardingPassModal({ booking, onClose, onCancelBooking }) {
  const [showSOS, setShowSOS] = useState(false);
  const [showCockpit, setShowCockpit] = useState(false);
  const [tokenCounter, setTokenCounter] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokenCounter(prev => (prev <= 1 ? 30 : prev - 1));
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
  const isBoarded = booking.boardingStatus === 'BOARDED';
  const otpCode = getNumericOtp(booking);

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 200ms ease-out'
      }}>
        <div style={{
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
          position: 'relative'
        }}>
          {/* Header Banner */}
          <div style={{
            background: isCancelled 
              ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' 
              : 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: isCancelled ? '#FFFFFF' : '#0E240B',
            borderTopLeftRadius: '26px',
            borderTopRightRadius: '26px'
          }}>
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
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Passenger & Dynamic QR Code Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--color-bg-secondary)',
              border: '1.5px solid var(--color-border)',
              padding: '18px 20px',
              borderRadius: '20px',
              marginBottom: '18px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800' }}>
                  CONFIRMED PASSENGER
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                  {booking.passengerName}
                </div>
                <div style={{ fontSize: '13px', color: '#10B981', marginTop: '2px', fontWeight: '800' }}>
                  {booking.seatsBooked} {booking.seatsBooked === 1 ? 'Seat Reserved' : 'Seats Reserved'}
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

              {/* Dynamic Scannable QR Code */}
              <div style={{
                background: '#FFFFFF',
                padding: '8px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                border: '2px solid #84CC16'
              }}>
                <QRCodeDisplay
                  value={JSON.stringify({
                    bookingRef: booking.bookingRef || booking.id || 'DRIVE-MUM-PUN-889',
                    passengerName: booking.passengerName || 'Ananya Sen',
                    otp: otpCode,
                    pickup: booking.pickupLocation || booking.ride?.originAddress || 'Origin Hub',
                    dropoff: booking.dropoffLocation || booking.ride?.destinationAddress || 'Destination Hub',
                    seats: booking.seatsBooked || 1,
                    totalPrice: booking.totalPrice || 385
                  })}
                  size={84}
                  darkColor="#0F172A"
                  lightColor="#FFFFFF"
                />
                <span style={{ fontSize: '9px', color: '#166534', fontWeight: '900', marginTop: '4px', letterSpacing: '0.04em' }}>
                  SCAN AT PICKUP
                </span>
                <span style={{ fontSize: '8.5px', color: '#64748B', marginTop: '1px' }}>
                  Refreshes: {tokenCounter}s
                </span>
              </div>
            </div>

            {/* Route Points */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: '18px',
              padding: '16px',
              marginBottom: '18px',
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
                      {booking.ride.departureDate} at {booking.ride.departureTime}
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

            {/* Driver & Vehicle Identity */}
            <div style={{
              background: 'rgba(132, 204, 22, 0.08)',
              border: '1.5px solid rgba(132, 204, 22, 0.25)',
              borderRadius: '18px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCockpit(true)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.14)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10B981',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Open Live Expressway Telematics"
                >
                  <Radio size={13} className="animate-pulse" />
                  <span>Track Live 🛰️</span>
                </button>

                {/* Safety SOS Beacon Trigger Button */}
                <button
                  type="button"
                  onClick={() => setShowSOS(true)}
                  style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.35)'
                  }}
                >
                  <ShieldAlert size={14} />
                  <span>SOS</span>
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(132, 204, 22, 0.45)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(132, 204, 22, 0.35)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
                }}
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Highway Cockpit Modal */}
      {showCockpit && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{ width: '640px', maxWidth: '100%' }}>
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
