import React from 'react';
import { 
  Shuffle, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Zap, 
  CheckCircle,
  Coffee,
  Sparkles
} from 'lucide-react';
import { Haptics } from '../../utils/haptics';
import useMaterialRipple from '../../utils/useMaterialRipple';
import styles from './ExpresswayRelayCard.module.css';

export default function ExpresswayRelayCard({ relay, onSelectRelay }) {
  const triggerRipple = useMaterialRipple();
  if (!relay) return null;

  const {
    originCity,
    destinationCity,
    interchangeHub,
    departureTime,
    estimatedArrivalTime,
    totalDurationHours,
    totalDistanceKm,
    pricePerSeat,
    originalPrice,
    discountPercent,
    layoverMinutes,
    transferWarranty,
    leg1,
    leg2
  } = relay;

  const handleBook = (e) => {
    triggerRipple(e);
    Haptics.medium();
    if (onSelectRelay) {
      onSelectRelay(relay);
    }
  };

  return (
    <div className={styles.relayCard} role="region" aria-label="Expressway Relay Multi-Hop Trip">
      {/* Top Header Badge Ribbon */}
      <div className={styles.relayBadgeRibbon}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={styles.relayTag}>
            <Shuffle size={13} />
            <span>Expressway Relay ({discountPercent}% Off)</span>
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-secondary)' }}>
            {totalDistanceKm} km • {totalDurationHours} hrs total
          </span>
        </div>

        <span className={styles.warrantyTag}>
          <ShieldCheck size={14} />
          <span>Guaranteed Connection Shield</span>
        </span>
      </div>

      {/* Transfer Timeline Legs */}
      <div className={styles.timelineWrapper}>
        {/* Leg 1: Feeder Leg */}
        <div className={styles.legBlock}>
          <div className={styles.legLeft}>
            <div className={styles.legTitle}>
              <span>Leg 1: {originCity.split(',')[0]} ➔ {interchangeHub.name}</span>
            </div>
            <div className={styles.legSubtitle}>
              Depart: <strong>{leg1.departureTime}</strong> • Arrive Hub: <strong>{leg1.estimatedArrivalAtHub}</strong>
            </div>
            <div className={styles.pilotTag}>
              <img src={leg1.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'} alt={leg1.driverName} className={styles.pilotMiniAvatar} />
              <span>Pilot A: <strong>{leg1.driverName}</strong> ({leg1.vehicle?.make} {leg1.vehicle?.model})</span>
            </div>
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '8px' }}>
            ⚡ EV Feeder
          </span>
        </div>

        {/* Interchange Dwell / Layover Pill */}
        <div className={styles.interchangePill}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coffee size={15} />
            <span><strong>{layoverMinutes}-min Transfer Window</strong> at {interchangeHub.name}</span>
          </div>
          <span style={{ fontSize: '11px', opacity: 0.9 }}>
            24/7 CCTV Safe Zone • Refreshments
          </span>
        </div>

        {/* Leg 2: Connecting Leg */}
        <div className={styles.legBlock}>
          <div className={styles.legLeft}>
            <div className={styles.legTitle}>
              <span>Leg 2: {interchangeHub.name} ➔ {destinationCity.split(',')[0]}</span>
            </div>
            <div className={styles.legSubtitle}>
              Depart: <strong>{leg2.departureFromHub}</strong> • Arrive Dest: <strong>{estimatedArrivalTime}</strong>
            </div>
            <div className={styles.pilotTag}>
              <img src={leg2.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'} alt={leg2.driverName} className={styles.pilotMiniAvatar} />
              <span>Pilot B: <strong>{leg2.driverName}</strong> ({leg2.vehicle?.make} {leg2.vehicle?.model})</span>
            </div>
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '8px' }}>
            Expressway Relay
          </span>
        </div>
      </div>

      {/* Footer Price & Booking CTA */}
      <div className={styles.relayFooter}>
        <div className={styles.priceWrapper}>
          <span className={styles.priceAmount}>
            ₹{pricePerSeat} <span className={styles.strikePrice}>₹{originalPrice}</span>
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Single unified checkout • Both legs included
          </span>
        </div>

        <button 
          type="button" 
          className={`${styles.bookRelayBtn} md-ripple-container`}
          onClick={handleBook}
        >
          <Sparkles size={16} />
          <span>Book Unified Relay (₹{pricePerSeat})</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
