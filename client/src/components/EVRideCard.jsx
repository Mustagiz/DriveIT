import React from 'react';
import { Zap, Fuel, Gauge, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SpotlightCard } from './ui';
import styles from './EVRideCard.module.css';

export default function EVRideCard({ ride, onSelect }) {
  const fuelType = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
  const isElectric = fuelType === 'ELECTRIC';
  const isDiesel = fuelType === 'DIESEL';
  const isPetrol = fuelType === 'PETROL';

  const getCarImage = () => {
    if (isElectric || ride.vehicle?.model?.includes('Nexon') || ride.vehicle?.model?.includes('ZS')) {
      return 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=500';
    }
    if (isDiesel || ride.vehicle?.model?.includes('XUV700') || ride.vehicle?.model?.includes('Harrier')) {
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500';
    }
    if (isPetrol || ride.vehicle?.model?.includes('City') || ride.vehicle?.model?.includes('Slavia')) {
      return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500';
    }
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=500';
  };

  const isFull = ride.availableSeats === 0 || ride.status === 'FULL';
  const isCancelled = ride.status === 'CANCELLED';

  const isPartialMatch = ride.matchedSegment?.isPartial;
  const displayRoute = isPartialMatch
    ? `${ride.matchedSegment.pickupStop.name} ➔ ${ride.matchedSegment.dropoffStop.name}`
    : `${ride.originCity.split(',')[0]} ➔ ${ride.destinationCity.split(',')[0]}`;

  return (
    <SpotlightCard
      spotlightColor={isElectric ? 'rgba(16, 185, 129, 0.18)' : isPetrol ? 'rgba(132, 204, 22, 0.18)' : 'rgba(99, 102, 241, 0.18)'}
      onClick={() => !isCancelled && onSelect(ride)}
      style={{ 
        opacity: isCancelled ? 0.6 : 1,
        cursor: isCancelled ? 'not-allowed' : 'pointer',
        padding: '16px',
        borderRadius: '20px'
      }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={getCarImage()}
          alt={ride.vehicle?.model || 'Car'}
          className={styles.image}
        />
        {isElectric && <div className={styles.evBadge}>⚡ 100% EV</div>}
        {isPetrol && <div className={styles.petrolBadge}>⛽ Petrol</div>}
        {isDiesel && <div className={styles.dieselBadge}>🛢️ Diesel CRDi</div>}
        
        <div className={styles.zapBadge} style={{ background: isElectric ? 'var(--color-primary-600)' : isPetrol ? '#84CC16' : '#6366F1' }}>
          {isElectric ? <Zap size={14} fill="currentColor" className="icon-zap" /> : isPetrol ? <Fuel size={14} /> : <Gauge size={14} />}
        </div>
        <div className={styles.routeBadge} style={{ background: isPartialMatch ? 'rgba(132, 204, 22, 0.95)' : undefined, color: isPartialMatch ? '#000000' : undefined, fontWeight: '800' }}>
          {isPartialMatch && '⚡ '}
          {displayRoute}
        </div>
      </div>

      <div style={{ padding: '0 4px', marginTop: '12px' }}>
        {isPartialMatch && (
          <div style={{
            fontSize: '10px',
            fontWeight: '800',
            color: '#65A30D',
            background: 'rgba(132, 204, 22, 0.12)',
            border: '1px solid rgba(132, 204, 22, 0.25)',
            borderRadius: '6px',
            padding: '3px 8px',
            marginBottom: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>Waypoint Leg ({ride.matchedSegment.segmentDistanceKm} km of {ride.matchedSegment.totalDistanceKm} km) • ₹3.40/km</span>
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.driverInfo}>
            <div style={{ position: 'relative' }}>
              <img
                src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                alt={ride.driverName}
                className={styles.avatar}
              />
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                background: '#10B981',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid #FFFFFF'
              }} title="UIDAI Aadhaar Verified Pilot">
                <CheckCircle2 size={10} />
              </span>
            </div>
            <div>
              <div className={styles.driverName}>
                {ride.vehicle?.make} {ride.vehicle?.model}
              </div>
              <div className={styles.driverMeta}>
                <span>{ride.driverName.split(' ')[0]}</span>
                <span>•</span>
                <span className={styles.rating}>
                  <Star size={11} fill="currentColor" />
                  {ride.driverRating || 4.9}
                </span>
                <span>•</span>
                <span style={{ color: '#10B981', fontWeight: '800', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              </div>
            </div>
          </div>

          <div className={styles.priceBlock}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', justifyContent: 'flex-end' }}>
              {isPartialMatch && ride.originalPricePerSeat && (
                <span style={{ fontSize: '11px', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{ride.originalPricePerSeat}
                </span>
              )}
              <div className={styles.price}>₹{ride.pricePerSeat}</div>
            </div>
            <div className={styles.seatsLeft}>
              {ride.availableSeats} seats left
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
