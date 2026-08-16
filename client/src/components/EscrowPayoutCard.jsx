import React, { useState } from 'react';
import { 
  ShieldCheck, IndianRupee, ArrowRight, CheckCircle2, 
  Lock, Zap, Sparkles, Building, RefreshCw, FileText, Check 
} from 'lucide-react';
import { useToast } from './Toast';

export default function EscrowPayoutCard({ 
  ride = {}, 
  totalBookedSeats = 3, 
  pricePerSeat = 350,
  pilotVpa = 'rahul.sharma@okaxis',
  onPayoutComplete 
}) {
  const [escrowStatus, setEscrowStatus] = useState('ESCROW_LOCKED'); // 'ESCROW_HELD' | 'ESCROW_LOCKED' | 'PAYOUT_RELEASED'
  const [isProcessing, setIsProcessing] = useState(false);
  const [utrNumber, setUtrNumber] = useState(null);
  const { addToast } = useToast();

  const grossFare = totalBookedSeats * pricePerSeat;
  const fastagDeduction = 180;
  const platformFee = Math.round(grossFare * 0.05); // 5% fee
  const greenBonus = ride.vehicle?.electric !== false ? 50 : 0;
  const netPayout = Math.max(0, grossFare - fastagDeduction - platformFee + greenBonus);

  const handleTriggerPayout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedUtr = `UPI-${Date.now().toString().slice(-8)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setUtrNumber(generatedUtr);
      setEscrowStatus('PAYOUT_RELEASED');
      addToast(`✅ ₹${netPayout} Transferred via UPI to ${pilotVpa}`, 'success');
      if (onPayoutComplete) onPayoutComplete({ netPayout, utr: generatedUtr });
    }, 1200);
  };

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.06)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Automated Escrow Protocol
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              Pilot Settlement & Earnings
            </h3>
          </div>
        </div>

        {/* Escrow Status Pill */}
        <span style={{
          fontSize: '11px',
          fontWeight: '900',
          padding: '4px 10px',
          borderRadius: '8px',
          background: escrowStatus === 'PAYOUT_RELEASED'
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(245, 158, 11, 0.15)',
          color: escrowStatus === 'PAYOUT_RELEASED' ? '#10B981' : '#F59E0B',
          border: escrowStatus === 'PAYOUT_RELEASED'
            ? '1px solid rgba(16, 185, 129, 0.3)'
            : '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          {escrowStatus === 'PAYOUT_RELEASED' ? '● PAYOUT SETTLED' : '● ESCROW LOCKED'}
        </span>
      </div>

      {/* 3-Phase Escrow Progression Tracker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          padding: '10px',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', marginBottom: '2px' }}>
            ✓ PHASE 1
          </div>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            Funds Held
          </div>
        </div>

        <div style={{
          background: 'var(--color-bg-secondary)',
          borderRadius: '12px',
          padding: '10px',
          textAlign: 'center',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981', marginBottom: '2px' }}>
            ✓ PHASE 2
          </div>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
            OTP Boarded
          </div>
        </div>

        <div style={{
          background: escrowStatus === 'PAYOUT_RELEASED' ? 'rgba(16, 185, 129, 0.12)' : 'var(--color-bg-secondary)',
          borderRadius: '12px',
          padding: '10px',
          textAlign: 'center',
          border: escrowStatus === 'PAYOUT_RELEASED' ? '1px solid #10B981' : '1px solid var(--color-border)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: escrowStatus === 'PAYOUT_RELEASED' ? '#10B981' : '#F59E0B', marginBottom: '2px' }}>
            {escrowStatus === 'PAYOUT_RELEASED' ? '✓ PHASE 3' : '⚡ PHASE 3'}
          </div>
          <div style={{ fontSize: '11.5px', fontWeight: '800', color: escrowStatus === 'PAYOUT_RELEASED' ? '#10B981' : 'var(--color-text-primary)' }}>
            UPI Release
          </div>
        </div>
      </div>

      {/* Financial Ledger Breakdown */}
      <div style={{
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
          <span>Gross Passenger Fares ({totalBookedSeats} Seats @ ₹{pricePerSeat})</span>
          <strong style={{ color: 'var(--color-text-primary)' }}>+₹{grossFare}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#EF4444' }}>
          <span>FASTag Expressway Toll Pass-through</span>
          <strong>-₹{fastagDeduction}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
          <span>Driveit Platform & Safety Tech Fee (5%)</span>
          <strong>-₹{platformFee}</strong>
        </div>

        {greenBonus > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#10B981' }}>
            <span>⚡ Green EV Fleet Offset Incentive</span>
            <strong>+₹{greenBonus}</strong>
          </div>
        )}

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '10px',
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', textTransform: 'uppercase' }}>
              Net Instant Pilot Payout
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981' }}>
              ₹{netPayout}
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '11.5px', color: 'var(--color-text-tertiary)' }}>
            Destination VPA:<br />
            <strong style={{ color: 'var(--color-text-primary)' }}>{pilotVpa}</strong>
          </div>
        </div>
      </div>

      {/* Payout Action & Receipt */}
      {escrowStatus === 'PAYOUT_RELEASED' ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '14px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#10B981', fontWeight: '900', fontSize: '13px' }}>
            <CheckCircle2 size={16} />
            <span>Transferred via NPCI / UPI Instant Rails</span>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary)', marginTop: '4px', fontFamily: 'monospace' }}>
            UTR Ref: <strong>{utrNumber || 'UPI-982104-4421'}</strong>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleTriggerPayout}
          disabled={isProcessing}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#000000',
            border: 'none',
            borderRadius: '14px',
            padding: '13px',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.35)'
          }}
        >
          {isProcessing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Initiating UPI Instant Transfer...</span>
            </>
          ) : (
            <>
              <Zap size={16} />
              <span>Release Instant UPI Payout (₹{netPayout})</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
