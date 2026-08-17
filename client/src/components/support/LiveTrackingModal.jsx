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
  ExternalLink,
  ShieldAlert,
  Compass,
  Volume2,
  Activity,
  AlertTriangle
} from 'lucide-react';
import MapVisualizer from '../MapVisualizer';
import { useTheme } from '../../context/ThemeContext';
import { sounds } from '../../utils/soundEffects';
import styles from './LiveTrackingModal.module.css';

export default function LiveTrackingModal({ isOpen, onClose, ride }) {
  const { isDark } = useTheme();
  const [liveSpeed, setLiveSpeed] = useState(ride?.telemetry?.currentSpeedKmh || 88);
  const [liveBattery, setLiveBattery] = useState(ride?.telemetry?.batteryPercent || 78);
  const [etaMins, setEtaMins] = useState(ride?.telemetry?.etaMinutes || 38);
  const [distanceCoveredKm, setDistanceCoveredKm] = useState(ride?.telemetry?.distanceCoveredKm || 54);
  const [sosActive, setSosActive] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  const totalDistance = ride?.distanceKm || 148;
  const progressPercent = Math.min(100, Math.round((distanceCoveredKm / totalDistance) * 100));

  // Live Telemetry Simulation Pulse & Vehicle Motion
  useEffect(() => {
    if (!isOpen || !ride) return;

    sounds.playRadarPing();

    const interval = setInterval(() => {
      setLiveSpeed(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.min(104, Math.max(72, prev + delta));
      });
      setLiveBattery(prev => Math.max(15, Number((prev - 0.04).toFixed(1))));
      setEtaMins(prev => Math.max(1, prev > 1 ? Number((prev - 0.15).toFixed(0)) : 1));
      setDistanceCoveredKm(prev => Math.min(totalDistance, prev + 0.3));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen, ride, totalDistance]);

  if (!isOpen || !ride) return null;

  const originName = ride.originCity?.split(',')[0] || 'Mumbai';
  const destName = ride.destinationCity?.split(',')[0] || 'Pune';
  const passengers = ride.passengers || [];

  const handleTriggerSos = () => {
    sounds.playSosAlert();
    setSosActive(true);
    setTimeout(() => {
      setSosSuccess(true);
    }, 1200);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.livePulseBadge}>
              <span className={styles.liveDot} />
              <span>LIVE NATIONAL HIGHWAY RADAR • NH-48</span>
              <span className={styles.radarPing} onClick={() => sounds.playRadarPing()}>
                <Volume2 size={12} /> Ping Radar
              </span>
            </div>
            <h2 className={styles.title}>
              {originName} ➔ {destName} ({ride.vehicle?.make} {ride.vehicle?.model})
            </h2>
            <div className={styles.subtitle}>
              Pilot: <strong>{ride.driverName}</strong> • Plate: <code>{ride.vehicle?.plate}</code> • Ref: <code>#{ride.id.slice(-6)}</code>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* SOS Emergency Banner if triggered */}
        {sosSuccess && (
          <div className={styles.sosAlertBanner}>
            <ShieldAlert size={20} color="#DC2626" />
            <div>
              <strong>EMERGENCY HIGHWAY DISPATCH BROADCASTED:</strong>
              <p>GPS coordinates ({distanceCoveredKm.toFixed(1)} km from origin) dispatched to National Highway Patrol & DriveIT Emergency Response Cell.</p>
            </div>
          </div>
        )}

        {/* Telemetry HUD Grid */}
        <div className={styles.hudGrid}>
          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Gauge size={14} color="#84CC16" />
              <span>Cruising Speed</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#84CC16' }}>
              {liveSpeed} <small>km/h</small>
            </div>
            <div className={styles.hudSub}>Expressway Limit: 100 km/h • Optimum</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <BatteryCharging size={14} color="#10B981" />
              <span>EV Battery</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#10B981' }}>
              {liveBattery.toFixed(0)}% <small>⚡</small>
            </div>
            <div className={styles.hudSub}>Estimated Range: 220 km remaining</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Clock size={14} color="#38BDF8" />
              <span>Estimated Arrival</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#38BDF8' }}>
              {Math.round(etaMins)} <small>mins</small>
            </div>
            <div className={styles.hudSub}>FASTag Tolls: Auto-Cleared</div>
          </div>

          <div className={styles.hudCard}>
            <div className={styles.hudLabel}>
              <Users size={14} color="#A855F7" />
              <span>Occupancy</span>
            </div>
            <div className={styles.hudValue} style={{ color: '#A855F7' }}>
              {ride.totalBookedSeats || passengers.length || 2} / {ride.totalSeats || 3} <small>seats</small>
            </div>
            <div className={styles.hudSub}>{passengers.length || 2} verified commuters on board</div>
          </div>
        </div>

        {/* Live Route Progress Bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span>Route Cleared: <strong>{distanceCoveredKm.toFixed(1)} km</strong> of {totalDistance} km ({progressPercent}%)</span>
            <span className={styles.nextTollBadge}>📍 Next: Khalapur Toll Plaza (4.2 km)</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
            <div className={styles.carPin} style={{ left: `${Math.min(96, progressPercent)}%` }}>
              🚗
            </div>
          </div>
        </div>

        {/* Live Route Map */}
        <div className={styles.mapWrapper}>
          <div className={styles.mapBanner}>
            <span>Live Satellite Beacon: {ride.telemetry?.currentLocation || `KM ${distanceCoveredKm.toFixed(0)} - Western Ghats Expressway Corridor`}</span>
            <span style={{ color: '#10B981', fontWeight: '800' }}>● GPS Fix: 14 Satellites</span>
          </div>
          <div style={{ height: '240px', width: '100%' }}>
            <MapVisualizer
              origin={ride.originAddress || ride.originCity}
              destination={ride.destinationAddress || ride.destinationCity}
            />
          </div>
        </div>

        {/* Passenger Manifest Table */}
        <div className={styles.passengerSection}>
          <div className={styles.sectionHeading}>
            <Users size={15} color="#84CC16" />
            <span>On-Board Verified Passenger Manifest ({passengers.length || 2})</span>
          </div>
          <div className={styles.passengerList}>
            {(passengers.length > 0 ? passengers : [
              { passengerName: 'Ananya Sen', pickupPoint: 'BKC Expressway Entry', dropoffPoint: 'Swargate Hub', totalFare: 350, boardingPin: '4829' },
              { passengerName: 'Rohan Kapoor', pickupPoint: 'Vashi Toll Plaza', dropoffPoint: 'Wakad Metro', totalFare: 350, boardingPin: '9102' }
            ]).map((p, idx) => (
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
                    OTP Pass: <code>{p.boardingPin || '4829'}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Hotline, Actions & Emergency SOS */}
        <div className={styles.actionsFooter}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href={`tel:${ride.driverPhone || '+919820112345'}`}
              className={styles.contactBtn}
            >
              <Phone size={14} /> Call Pilot ({ride.driverName})
            </a>
            {!sosSuccess && (
              <button
                type="button"
                onClick={handleTriggerSos}
                className={styles.sosTriggerBtn}
              >
                <AlertTriangle size={14} /> Trigger Emergency SOS
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.doneBtn}
          >
            Close Radar
          </button>
        </div>
      </div>
    </div>
  );
}
