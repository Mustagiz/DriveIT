import React from 'react';
import { ShieldCheck, Luggage, Wind, Zap, Fuel, Sparkles, Navigation } from 'lucide-react';
import styles from './RideCorridorTimeline.module.css';

export default function RideCorridorTimeline({ ride, isExpanded, onOpenToll }) {
  if (!ride) return null;

  const originName = ride.originCity?.split(',')[0] || 'Origin';
  const destName = ride.destinationCity?.split(',')[0] || 'Destination';
  const fuelType = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
  const isElectric = fuelType === 'ELECTRIC';

  // Extract or synthesize corridor waypoints
  const waypoints = Array.isArray(ride.waypoints) && ride.waypoints.length > 0
    ? ride.waypoints
    : [
        { name: `${originName} Hub / Pickup Spot`, time: ride.departureTime || '07:00 AM', status: 'pickup' },
        { name: 'Expressway FASTag Gate & Rest Hub', time: 'Midway Stop', status: 'stop' },
        { name: `${destName} Terminal Drop`, time: 'Scheduled Arrival', status: 'dropoff' }
      ];

  const co2Saved = isElectric ? '16.4 kg' : '8.2 kg';
  const tollIncluded = ride.tollFee || 140;

  return (
    <div className={`${styles.drawer} ${isExpanded ? styles.drawerExpanded : ''}`}>
      <div className={styles.timeline}>
        {waypoints.map((wp, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === waypoints.length - 1;
          const nodeClass = isFirst ? styles.nodeGreen : isLast ? styles.nodeRed : styles.nodeYellow;

          return (
            <div key={idx} className={styles.milestone}>
              <div className={`${styles.node} ${nodeClass}`} />
              <div className={styles.milestoneContent}>
                <span className={styles.milestoneTitle}>{wp.name || wp.stopName || 'Waypoint'}</span>
                <span className={styles.milestoneSub}>{wp.time ? `Schedule: ${wp.time}` : 'Scheduled corridor stop'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.amenitiesGrid}>
        <div
          className={`${styles.tollPill} ${onOpenToll ? styles.tollPillInteractive : ''}`}
          onClick={(e) => {
            if (onOpenToll) {
              e.stopPropagation();
              onOpenToll();
            }
          }}
          title={onOpenToll ? "Click to view full FASTag Toll & Fare Breakdown" : undefined}
        >
          <span>🛣️ FASTag Toll Included:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>₹{tollIncluded} split</span>
            {onOpenToll && <span className={styles.tollPillLink}>Breakdown ➔</span>}
          </span>
        </div>

        <div className={styles.amenityItem}>
          <Luggage size={13} color="#00AFF5" />
          <span>Max 2 Bags / Passenger</span>
        </div>

        <div className={styles.amenityItem}>
          <Wind size={13} color="#38BDF8" />
          <span>Dual Climate AC</span>
        </div>

        <div className={styles.amenityItem}>
          <Sparkles size={13} color="#F59E0B" />
          <span>🌱 {co2Saved} CO₂ Offset</span>
        </div>

        <div className={styles.amenityItem}>
          {isElectric ? <Zap size={13} color="#00AFF5" /> : <Fuel size={13} color="#F97316" />}
          <span>{isElectric ? '100% Green EV Drive' : 'Express Highway Cruising'}</span>
        </div>
      </div>
    </div>
  );
}
