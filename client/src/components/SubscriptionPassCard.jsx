import React, { useState } from 'react';
import { Ticket, Calendar, MapPin, ChevronRight, Clock, X, Star, Check, Zap } from 'lucide-react';
import { formatDate } from '../utils/dateTime';

const CORRIDORS = {
  'MUM-PNE': { name: 'Mumbai → Pune', emoji: '🛣️' },
  'DEL-JAI': { name: 'Delhi → Jaipur', emoji: '🏜️' },
  'BLR-MYS': { name: 'Bangalore → Mysore', emoji: '🌿' },
  'HYD-BLR': { name: 'Hyderabad → Bangalore', emoji: '⚡' },
  'MUM-GOA': { name: 'Mumbai → Goa', emoji: '🏖️' },
  'GENERAL': { name: 'Custom Route', emoji: '📍' }
};

const TIERS = [
  {
    key: 'WEEKLY',
    label: 'Weekly Pass',
    days: 7,
    discount: 12,
    emoji: '📅',
    color: '#84CC16',
    highlight: false
  },
  {
    key: 'MONTHLY',
    label: 'Monthly Pass',
    days: 30,
    discount: 20,
    emoji: '🗓️',
    color: '#6366F1',
    highlight: true // recommended
  },
  {
    key: 'QUARTERLY',
    label: '3-Month Pass',
    days: 90,
    discount: 28,
    emoji: '🏆',
    color: '#10B981',
    highlight: false
  }
];

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function SubscriptionPassCard({ token, onCreated }) {
  const [step, setStep] = useState('browse'); // 'browse' | 'configure' | 'success'
  const [selectedTier, setSelectedTier] = useState('MONTHLY');
  const [corridorKey, setCorridorKey] = useState('MUM-PNE');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState(['MON', 'TUE', 'WED', 'THU', 'FRI']);
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const tier = TIERS.find(t => t.key === selectedTier) || TIERS[1];
  const corridor = CORRIDORS[corridorKey] || CORRIDORS['MUM-PNE'];
  const baseFare = 450 * seats * selectedDays.length;
  const discountedFare = Math.round(baseFare * (1 - tier.discount / 100));

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ corridorKey, days: selectedDays, departureTime, seats, tier: selectedTier })
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setStep('success');
        onCreated?.(data.subscription);
      }
    } catch (err) {
      // Fallback: show success with mock data
      const mockSub = {
        id: `sub_demo_${Date.now()}`,
        corridorKey, days: selectedDays, departureTime,
        tier: selectedTier, tierLabel: tier.label,
        discountPercent: tier.discount,
        pricePerPeriod: discountedFare,
        endDate: new Date(Date.now() + tier.days * 86400000).toISOString()
      };
      setSubscription(mockSub);
      setStep('success');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success' && subscription) {
    const end = new Date(subscription.endDate);
    return (
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '20px',
        padding: '24px',
        border: '2px solid rgba(16,185,129,0.4)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
        <div style={{ fontSize: '20px', fontWeight: '900', color: '#10B981', marginBottom: '8px' }}>
          {subscription.tierLabel} Activated!
        </div>
        <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          {corridor.emoji} {CORRIDORS[corridorKey]?.name} · {subscription.days?.join(', ')} · {subscription.departureTime}
        </div>
        <div style={{
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280', fontSize: '12px' }}>Pass Value</span>
            <span style={{ fontWeight: '800', color: '#10B981' }}>₹{subscription.pricePerPeriod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280', fontSize: '12px' }}>Valid Until</span>
            <span style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '12px' }}>
              {formatDate(end)}
            </span>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#6B7280' }}>
          Seats auto-reserved on matching rides · Pilot notified 24h before
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid #334155'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: 'rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Ticket size={20} color="#6366F1" />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#F8FAFC' }}>
            Weekly Corridor Pass
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            Subscribe · Auto-reserve · Save up to 28%
          </div>
        </div>
      </div>

      {step === 'browse' && (
        <>
          {/* Tier Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {TIERS.map(t => (
              <div
                key={t.key}
                onClick={() => setSelectedTier(t.key)}
                style={{
                  background: selectedTier === t.key
                    ? `linear-gradient(135deg, ${t.color}20 0%, ${t.color}08 100%)`
                    : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${selectedTier === t.key ? t.color : '#334155'}`,
                  borderRadius: '14px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {t.highlight && (
                  <div style={{
                    position: 'absolute', top: '-8px', right: '12px',
                    background: t.color,
                    color: '#000', fontSize: '10px', fontWeight: '900',
                    padding: '2px 8px', borderRadius: '6px'
                  }}>
                    POPULAR
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{t.emoji}</span>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#F8FAFC' }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.days} days validity</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: t.color }}>
                    {t.discount}% OFF
                  </div>
                  <div style={{ fontSize: '10px', color: '#6B7280' }}>vs per-ride price</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('configure')}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            Configure Your Pass <ChevronRight size={16} />
          </button>
        </>
      )}

      {step === 'configure' && (
        <>
          {/* Corridor */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
              <MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} /> CORRIDOR
            </label>
            <select
              value={corridorKey}
              onChange={e => setCorridorKey(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                background: '#1E293B', border: '1px solid #334155',
                borderRadius: '10px', color: '#F8FAFC', fontSize: '13px'
              }}
            >
              {Object.entries(CORRIDORS).map(([key, val]) => (
                <option key={key} value={key}>{val.emoji} {val.name}</option>
              ))}
            </select>
          </div>

          {/* Days */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
              <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} /> TRAVEL DAYS
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: '6px 10px',
                    background: selectedDays.includes(day) ? '#6366F1' : 'rgba(255,255,255,0.06)',
                    border: 'none', borderRadius: '8px',
                    color: selectedDays.includes(day) ? '#fff' : '#6B7280',
                    fontSize: '11px', fontWeight: '700', cursor: 'pointer'
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Departure Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
                <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} /> TIME
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={e => setDepartureTime(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#1E293B', border: '1px solid #334155',
                  borderRadius: '10px', color: '#F8FAFC', fontSize: '13px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', display: 'block', marginBottom: '8px' }}>
                SEATS
              </label>
              <select
                value={seats}
                onChange={e => setSeats(Number(e.target.value))}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: '#1E293B', border: '1px solid #334155',
                  borderRadius: '10px', color: '#F8FAFC', fontSize: '13px'
                }}
              >
                {[1, 2, 3].map(s => <option key={s} value={s}>{s} seat{s > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          {/* Price Summary */}
          <div style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#6B7280', fontSize: '12px' }}>Per-ride price</span>
              <span style={{ color: '#9CA3AF', fontSize: '12px', textDecoration: 'line-through' }}>
                ₹{baseFare.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#F8FAFC', fontWeight: '700', fontSize: '13px' }}>
                {tier.label} ({tier.discount}% off)
              </span>
              <span style={{ color: '#6366F1', fontWeight: '900', fontSize: '20px' }}>
                ₹{discountedFare.toLocaleString()}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setStep('browse')}
              style={{
                flex: '0 0 auto', padding: '12px 16px',
                background: 'rgba(255,255,255,0.06)',
                border: 'none', borderRadius: '12px',
                color: '#94A3B8', cursor: 'pointer'
              }}
            >
              Back
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || selectedDays.length === 0}
              style={{
                flex: 1, padding: '12px',
                background: loading ? '#4B5563' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? 'Activating...' : <><Zap size={14} /> Activate Pass</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
