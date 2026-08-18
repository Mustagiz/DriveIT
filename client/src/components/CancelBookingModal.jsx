import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  RefreshCw, 
  Car,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateTime';

export default function CancelBookingModal({ booking, onClose, onConfirm, isCancelling }) {
  const [selectedReason, setSelectedReason] = useState('Changed travel schedule');
  const [customNotes, setCustomNotes] = useState('');

  if (!booking) return null;

  const reasons = [
    'Changed travel schedule or plans',
    'Found alternative transport',
    'Pilot requested rescheduling',
    'Booked incorrect departure date or time',
    'Emergency personal conflict',
    'Other reason'
  ];

  const ride = booking.ride || {};
  const origin = ride.originCity || booking.pickupLocation || 'Origin Hub';
  const destination = ride.destinationCity || booking.dropoffLocation || 'Destination Hub';
  const depDate = ride.departureDate || booking.departureDate;
  const depTime = ride.departureTime || booking.departureTime;

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Other reason' && customNotes.trim() 
      ? `Other: ${customNotes.trim()}`
      : selectedReason;
    onConfirm(booking.id, finalReason);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        background: 'var(--color-bg-surface, #FFFFFF)',
        border: '1.5px solid var(--color-border, #E2E8F0)',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(244, 63, 94, 0.03) 100%)',
          borderBottom: '1px solid var(--color-border, #E2E8F0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(220, 38, 38, 0.25)'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary, #0F172A)' }}>
                Cancel Seat Reservation
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary, #64748B)', fontWeight: '600', marginTop: '2px' }}>
                Ref: {booking.bookingRef}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isCancelling}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-tertiary, #94A3B8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Trip Summary Card */}
          <div style={{
            background: 'var(--color-bg-secondary, #F8FAFC)',
            border: '1.5px solid var(--color-border, #E2E8F0)',
            borderRadius: '16px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary, #0F172A)' }}>
                <span>{origin}</span>
                <ArrowRight size={14} color="#84CC16" />
                <span>{destination}</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '900', color: '#10B981' }}>
                ₹{booking.totalPrice || 0}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--color-text-tertiary, #64748B)', flexWrap: 'wrap' }}>
              {depDate && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {formatDate(depDate)}
                </span>
              )}
              {depTime && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {formatTime(depTime)}
                </span>
              )}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Car size={13} /> {booking.seatsBooked || 1} Seat(s)
              </span>
            </div>
          </div>

          {/* Cancellation Impact Policy Notice */}
          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            gap: '10px'
          }}>
            <RotateCcw size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: '1.45' }}>
              <strong>Immediate Seat Release & Refund:</strong> Your reserved seat will be restored to the pilot's vehicle pool. Full fare of <strong>₹{booking.totalPrice}</strong> will be refunded to your source payment method.
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--color-text-primary, #0F172A)', display: 'block', marginBottom: '8px' }}>
              Please select a cancellation reason:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {reasons.map((reason) => (
                <label
                  key={reason}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: selectedReason === reason ? 'rgba(132, 204, 22, 0.08)' : 'transparent',
                    border: selectedReason === reason ? '1.5px solid #84CC16' : '1px solid var(--color-border, #E2E8F0)',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    fontWeight: selectedReason === reason ? '700' : '500',
                    color: selectedReason === reason ? 'var(--color-text-primary, #0F172A)' : 'var(--color-text-secondary, #475569)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    style={{ accentColor: '#84CC16' }}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === 'Other reason' && (
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Please describe why you're cancelling..."
                rows={2}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border, #CBD5E1)',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--color-bg-secondary, #F8FAFC)',
          borderTop: '1px solid var(--color-border, #E2E8F0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1.5px solid var(--color-border, #CBD5E1)',
              background: 'var(--color-bg-surface, #FFFFFF)',
              color: 'var(--color-text-primary, #0F172A)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Keep My Reservation
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCancelling}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '900',
              cursor: isCancelling ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            {isCancelling ? (
              <>
                <div style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#FFFFFF',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span>Releasing Seat...</span>
              </>
            ) : (
              <>
                <X size={15} />
                <span>Confirm Cancellation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
