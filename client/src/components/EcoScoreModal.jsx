import React from 'react';
import { Leaf, Award, Zap, TrendingUp, Sparkles, X, CheckCircle2, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';

export default function EcoScoreModal({ isOpen, onClose, co2SavedKg = 142 }) {
  if (!isOpen) return null;

  const treesPlanted = (co2SavedKg * 0.045).toFixed(1);
  const cleanKm = Math.round(co2SavedKg * 5.4);

  const getTier = (kg) => {
    if (kg >= 500) return { name: 'Platinum Net-Zero Hero', color: '#38BDF8', icon: '👑', next: null };
    if (kg >= 200) return { name: 'Gold Green Pioneer', color: '#84CC16', icon: '🥇', next: '500 kg (Platinum)' };
    if (kg >= 50) return { name: 'Silver Eco Rider', color: '#10B981', icon: '🥈', next: '200 kg (Gold)' };
    return { name: 'Bronze Commuter', color: '#65A30D', icon: '🥉', next: '50 kg (Silver)' };
  };

  const currentTier = getTier(co2SavedKg);

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
        background: 'var(--color-bg-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '28px',
        width: '480px',
        maxWidth: '100%',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--color-bg-secondary)',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#10B981',
            padding: '4px 14px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '900',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>
            <Leaf size={13} />
            <span>Driveit Green Mobility Score</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
            Your Carbon Offset Impact
          </h2>
        </div>

        {/* Tier Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.04))',
          border: '1.5px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '22px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '38px', marginBottom: '4px' }}>{currentTier.icon}</div>
          <div style={{ fontSize: '18px', fontWeight: '900', color: currentTier.color }}>
            {currentTier.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', marginTop: '4px' }}>
            Top 8% of Eco-Conscious Intercity Highway Commuters
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              <span>{co2SavedKg} kg CO₂ saved</span>
              <span>Goal: {currentTier.next || 'Max Tier Reached'}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-surface)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: '#10B981', borderRadius: '999px' }} />
            </div>
          </div>
        </div>

        {/* 3 Metric Tiles */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <Leaf size={18} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
              {co2SavedKg} kg
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '700' }}>
              CO₂ Eliminated
            </div>
          </div>

          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#38BDF8', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <Sparkles size={18} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
              {treesPlanted}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '700' }}>
              Trees Planted Eq.
            </div>
          </div>

          <div style={{
            background: 'var(--color-bg-secondary)',
            borderRadius: '16px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#84CC16', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <Zap size={18} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
              {cleanKm} km
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '700' }}>
              Green KM Shared
            </div>
          </div>
        </div>

        {/* Eco Vouchers & Rewards */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Gift size={22} color="#84CC16" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                ₹150 FASTag Eco Discount Unlocked
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
                Auto-applied on your next intercity booking
              </div>
            </div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: '900', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '6px' }}>
            ACTIVE
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#000000',
            border: 'none',
            borderRadius: '14px',
            padding: '12px',
            fontSize: '14px',
            fontWeight: '900',
            cursor: 'pointer'
          }}
        >
          Keep Riding Green 🌿
        </button>
      </div>
    </div>
  );
}
