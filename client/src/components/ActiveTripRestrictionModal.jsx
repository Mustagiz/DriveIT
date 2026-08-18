import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, X, Ticket, Zap } from 'lucide-react';
import { formatDate, formatTime } from '../utils/dateTime';

export default function ActiveTripRestrictionModal({ isOpen, onClose, onNavigate, activeSession }) {
  if (!isOpen || !activeSession?.hasActiveSession) return null;

  const isBooking = activeSession.type === 'BOOKING';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #FDE68A',
        borderRadius: '24px',
        width: '520px',
        maxWidth: '100%',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        animation: 'modalSlideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1F5F9',
            border: 'none',
            color: '#64748B',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 150ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E2E8F0';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={16} />
        </button>

        {/* Top Alert Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            border: '2px solid #F59E0B',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.25)'
          }}>
            <ShieldAlert size={32} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FEF3C7',
            border: '1px solid #FDE68A',
            color: '#B45309',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '900',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <span>1 Active Trip Rule Enforced</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
            Active Trip Already in Progress
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
            DriveIT limits passengers to <strong>only one active trip request or booking</strong> at a time.
          </p>
        </div>

        {/* Ongoing Session Details Card */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px 18px',
          marginBottom: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isBooking ? <Ticket size={14} color="#84CC16" /> : <Zap size={14} color="#0284C7" />}
              <span>{isBooking ? 'CURRENT ACTIVE RESERVATION' : 'CURRENT ACTIVE ROUTE REQUEST'}</span>
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: '900',
              background: isBooking ? '#DCFCE7' : '#E0F2FE',
              color: isBooking ? '#15803D' : '#0369A1',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {isBooking ? 'CONFIRMED' : 'OPEN DEMAND'}
            </span>
          </div>

          <div style={{ fontSize: '14.5px', fontWeight: '900', color: '#0F172A', marginBottom: '4px' }}>
            {activeSession.route}
          </div>

          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {activeSession.ref && (
              <span>Ref: <strong style={{ color: '#0F172A' }}>{activeSession.ref}</strong></span>
            )}
            {activeSession.departureDate && (
              <span>📅 {formatDate(activeSession.departureDate)}</span>
            )}
            {activeSession.departureTime && (
              <span>⏰ {formatTime(activeSession.departureTime)}</span>
            )}
          </div>
        </div>

        {/* Customer Instructions */}
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start'
        }}>
          <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12.5px', color: '#92400E', lineHeight: '1.45', fontWeight: '600' }}>
            To proceed with a new trip, you must first <strong>cancel or finish your existing active trip</strong> in the Passenger Flight Deck.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onNavigate) {
                onNavigate('booker-trips');
              } else {
                window.location.href = '/#/booker-trips';
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '13.5px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(132, 204, 22, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(132, 204, 22, 0.35)';
            }}
          >
            <span>Go to Flight Deck to Cancel Existing Trip</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              color: '#475569',
              borderRadius: '14px',
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#475569';
            }}
          >
            Keep Current Ongoing Trip
          </button>
        </div>
      </div>
    </div>
  );
}
