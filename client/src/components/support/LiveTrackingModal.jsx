import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Radio, 
  ShieldCheck, 
  Phone, 
  Zap, 
  Gauge, 
  BatteryCharging, 
  Clock, 
  Users, 
  CheckCircle2,
  AlertOctagon,
  ExternalLink
} from 'lucide-react';
import MapVisualizer from '../MapVisualizer';
import { useTheme } from '../../context/ThemeContext';
import styles from './LiveTrackingModal.module.css';

export default function LiveTrackingModal({ isOpen, onClose, ride }) {
  const { isDark } = useTheme();
  const [liveSpeed, setLiveSpeed] = useState(ride?.telemetry?.currentSpeedKmh || 84);
  const [liveBattery, setLiveBattery] = useState(ride?.telemetry?.batteryPercent || 76);
  const [etaMins, setEtaMins] = useState(ride?.telemetry?.etaMinutes || 42);

  // Live Telemetry Simulation Pulse
  useEffect(() => {
    if (!isOpen || !ride) return;
    const interval = setInterval(() => {
      setLiveSpeed(prev => Math.min(105, Math.max(68, prev + Math.floor(Math.random() * 7) - 3)));
      setLiveBattery(prev => Math.max(15, prev - 0.05));
      setEtaMins(prev => Math.max(1, prev > 1 ? prev - 0.2 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, ride]);

  if (!isOpen || !ride) return null;

  const originName = ride.originCity?.split(',')[0] || 'Mumbai';
  const destName = ride.destinationCity?.split(',')[0] || 'Pune';
  const passengers = ride.passengers || [];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.livePulseBadge}>
              <span className={styles.liveDot} />
              <span>LIVE ON HIGHWAY TELEMETRY</span>
            </div>
            <h2 className={styles.title}>
              {originName} ➔ {destName} ({ride.vehicle?.make} {ride.vehicle?.model})
            </h2>
            <div className={styles.subtitle}>
              Pilot: <strong>{ride.driverName}</strong> • Plate: <code>{ride.vehicle?.plate}</code> • Ref: <code>{ride.id}</code>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Telemetry HUD Grid */}
        <div className={styles.hudGrid}>
          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Gauge size={14} color="#F59E0B" />
              <span>Vehicle Speed</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#F59E0B' }}>
              {liveSpeed} <small>km/h</small>
            </div>
            <div className={styles.hudSub}>Speed Limit: 100 km/h (Expressway)</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <BatteryCharging size={14} color="#10B981" />
              <span>EV Battery</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#10B981' }}>
              {liveBattery.toFixed(0)}% <small>⚡</small>
            </div>
            <div className={styles.hudSub}>Estimated Range: 185 km remaining</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Clock size={14} color="#38BDF8" />
              <span>Estimated Arrival</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#38BDF8' }}>
              {Math.round(etaMins)} <small>mins</small>
            </div>
            <div className={styles.hudSub}>FASTag Toll Status: CLEARED</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Users size={14} color="#A855F7" />
              <span>Occupancy</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#A855F7' }}>
              {ride.totalBookedSeats || passengers.length} / {ride.totalSeats} <small>seats</small>
            </div>
            <div className={styles.hudSub}>{passengers.length} verified passengers on board</div>
          </div>
        </div>

        {/* Live Route Map */}
        <div className={styles.mapWrapper}>
          <div className={styles.mapBanner}>
            <span>Live GPS Fix: {ride.telemetry?.currentLocation || 'KM 48.2 - Khalapur Toll Plaza'}</span>
            <span style={{ color: '#10B981', fontWeight: '800' }}>● GPS Lock: 12 Satellites</span>
          </div>
          <div style={{ height: '260px', width: '100%' }}>
            <MapVisualizer
              origin={ride.originAddress || ride.originCity}
              destination={ride.destinationAddress || ride.destinationCity}
            />
          </div>
        </div>

        {/* Passenger Manifest Table */}
        <div className={styles.passengerSection}>
          <div className={styles.sectionHeading}>
            <Users size={16} color="#F59E0B" />
            <span>On-Board Verified Passenger Manifest ({passengers.length})</span>
          </div>
          {passengers.length > 0 ? (
            <div className={styles.passengerList}>
              {passengers.map((p, idx) => (
                <div key={idx} className={styles.passengerCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={styles.passengerAvatar}>
                      {p.passengerName.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.passengerName}>
                        {p.passengerName}
                        <span className={styles.verifiedTag}>
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      </div>
                      <div className={styles.passengerMeta}>
                        Pickup: <strong>{p.pickupPoint}</strong> ➔ Drop: <strong>{p.dropoffPoint}</strong>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: '#10B981' }}>
                      ₹{p.totalFare || 350}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      PIN: <code>{p.boardingPin}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#64748B', padding: '8px' }}>
              No passenger manifest records attached to this corridor.
            </div>
          )}
        </div>

        {/* Support Hotline & Actions */}
        <div className={styles.actionsFooter}>
          <a
            href={`tel:${ride.driverPhone || '+919820112345'}`}
            className={styles.contactBtn}
          >
            <Phone size={14} /> Call Pilot ({ride.driverName})
          </a>
          <button
            type="button"
            onClick={onClose}
            className={styles.doneBtn}
          >
            Close Telemetry Radar
          </button>
        </div>
      </div>
    </div>
  );
}
