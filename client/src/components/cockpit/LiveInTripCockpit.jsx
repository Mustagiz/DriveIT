import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Share2, 
  Compass, 
  Navigation, 
  Zap, 
  Clock, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../utils/useSocket';
import { Haptics } from '../../utils/haptics';
import useMaterialRipple from '../../utils/useMaterialRipple';
import { speakAnnouncement, playCockpitChime } from '../../utils/cockpitAudioAnnouncer';
import styles from './LiveInTripCockpit.module.css';

// Default Mumbai - Pune Expressway Highway Simulation Polyline Coordinates
const DEFAULT_CORRIDOR_WAYPOINTS = [
  { name: 'BKC Mumbai', lat: 19.0657, lng: 72.8687 },
  { name: 'Vashi Toll Plaza', lat: 19.0645, lng: 72.9967, isToll: true, toll: 45 },
  { name: 'Kalamboli Expressway Entry', lat: 19.0200, lng: 73.1000 },
  { name: 'Khalapur Toll Plaza', lat: 18.8354, lng: 73.2842, isToll: true, toll: 85 },
  { name: 'Lonavala Food Mall & Supercharger', lat: 18.7557, lng: 73.4091, isRestStop: true },
  { name: 'Khandala Ghat Descent', lat: 18.7610, lng: 73.3750, isSpeedZone: true },
  { name: 'Talegaon Toll Plaza', lat: 18.7214, lng: 73.6738, isToll: true, toll: 85 },
  { name: 'Wakad Flyover', lat: 18.5987, lng: 73.7654 },
  { name: 'Swargate Metro Hub Pune', lat: 18.5018, lng: 73.8580 }
];

export default function LiveInTripCockpit({ 
  ride = null, 
  tripId = 'trip_mum_pun_001', 
  onClose 
}) {
  const { user } = useAuth();
  const socket = useSocket();
  const triggerRipple = useMaterialRipple();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Cockpit States
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speedKmh, setSpeedKmh] = useState(94);
  const [currentCoord, setCurrentCoord] = useState({ lat: 18.8354, lng: 73.2842 });
  const [heading, setHeading] = useState(118);
  const [distanceRemainingKm, setDistanceRemainingKm] = useState(68);
  const [etaMinutes, setEtaMinutes] = useState(48);
  const [activeWaypoint, setActiveWaypoint] = useState({
    name: 'Khalapur Toll Plaza',
    type: 'TOLL_PLAZA',
    toll: '₹85.00',
    distanceMeters: 1200,
    announcement: 'Approaching Khalapur Toll Plaza in 1.2 kilometers. NHAI FASTag RFID active.'
  });
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosSuccess, setSosSuccess] = useState(false);

  const lastAnnouncedWpId = useRef(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [currentCoord.lat, currentCoord.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Dark HUD Tiles (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Draw Highway Corridor Route
    const latlngs = DEFAULT_CORRIDOR_WAYPOINTS.map(w => [w.lat, w.lng]);
    const polyline = L.polyline(latlngs, {
      color: '#84CC16',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(map);
    routePolylineRef.current = polyline;

    // Vehicle Pulse Icon
    const carIconHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(132, 204, 22, 0.35); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0F172A; border: 2.5px solid #84CC16; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px #84CC16;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BEF264" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
          </svg>
        </div>
      </div>
      <style>@keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }</style>
    `;

    const customIcon = L.divIcon({
      html: carIconHtml,
      className: 'cockpit-vehicle-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const marker = L.marker([currentCoord.lat, currentCoord.lng], { icon: customIcon }).addTo(map);
    vehicleMarkerRef.current = marker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Real-time Telemetry Loop (Socket or Highway Simulator)
  useEffect(() => {
    let stepIndex = 3; // Start near Khalapur
    let progressRatio = 0.35;

    const interval = setInterval(() => {
      progressRatio += 0.008;
      if (progressRatio >= 0.95) progressRatio = 0.2;

      // Interpolate along waypoints
      const idx = Math.min(Math.floor(progressRatio * (DEFAULT_CORRIDOR_WAYPOINTS.length - 1)), DEFAULT_CORRIDOR_WAYPOINTS.length - 2);
      const start = DEFAULT_CORRIDOR_WAYPOINTS[idx];
      const end = DEFAULT_CORRIDOR_WAYPOINTS[idx + 1];
      const subRatio = (progressRatio * (DEFAULT_CORRIDOR_WAYPOINTS.length - 1)) - idx;

      const nextLat = start.lat + (end.lat - start.lat) * subRatio;
      const nextLng = start.lng + (end.lng - start.lng) * subRatio;
      const newSpeed = 88 + Math.floor(Math.random() * 14); // 88 - 102 km/h
      const remainingDist = Math.max(12, Math.round(148 * (1 - progressRatio)));
      const remainingEta = Math.round(remainingDist / 1.4);

      setSpeedKmh(newSpeed);
      setCurrentCoord({ lat: nextLat, lng: nextLng });
      setDistanceRemainingKm(remainingDist);
      setEtaMinutes(remainingEta);

      // Smooth Map Pan
      if (mapInstanceRef.current && vehicleMarkerRef.current) {
        vehicleMarkerRef.current.setLatLng([nextLat, nextLng]);
        mapInstanceRef.current.panTo([nextLat, nextLng], { animate: true, duration: 1 });
      }

      // Check upcoming waypoint triggers
      const upcoming = DEFAULT_CORRIDOR_WAYPOINTS[idx + 1];
      if (upcoming && upcoming.name !== lastAnnouncedWpId.current) {
        lastAnnouncedWpId.current = upcoming.name;
        const wpData = {
          name: upcoming.name,
          type: upcoming.isToll ? 'TOLL_PLAZA' : (upcoming.isRestStop ? 'REST_STOP' : 'SPEED_ZONE'),
          toll: upcoming.isToll ? `₹${upcoming.toll}.00` : null,
          distanceMeters: 1200,
          announcement: upcoming.isToll 
            ? `Approaching ${upcoming.name} in 1.2 kilometers. NHAI FASTag ₹${upcoming.toll} active.`
            : `Approaching ${upcoming.name}. Rest amenities and EV charging available.`
        };
        setActiveWaypoint(wpData);
        speakAnnouncement(wpData.announcement, audioEnabled);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [audioEnabled]);

  // Handle SOS Emergency Click
  const handleTriggerSOS = (e) => {
    triggerRipple(e);
    Haptics.error();
    playCockpitChime('sos');
    setSosModalOpen(true);
  };

  const handleConfirmSOS = () => {
    Haptics.success();
    setSosSuccess(true);
    if (socket) {
      socket.emit('cockpit:sos:trigger', {
        tripId,
        senderId: user?.id || 'passenger_01',
        senderName: user?.name || 'Passenger',
        lat: currentCoord.lat,
        lng: currentCoord.lng,
        vehiclePlate: ride?.vehicle?.plate || 'MH-12-RN-7788'
      });
    }
  };

  return (
    <div className={styles.cockpitWrapper} role="region" aria-label="Live In-Trip Cockpit">
      {/* Map Canvas */}
      <div ref={mapRef} className={styles.mapContainer} />

      {/* Cockpit HUD Overlay */}
      <div className={styles.hudOverlay}>
        
        {/* ── Top HUD Header ── */}
        <div className={styles.topHudHeader}>
          <div className={styles.topStatusBar}>
            <div className={styles.radarStatusPill}>
              <span className={styles.radarBlinkDot} />
              <span>LIVE RADAR • 60 FPS</span>
            </div>

            <div className={styles.corridorTitle}>
              <span>Mumbai ➔ Pune Expressway (NH-48)</span>
            </div>

            <div className={styles.hudHeaderActions}>
              <button 
                type="button" 
                className={`${styles.iconBtn} ${audioEnabled ? styles.iconBtnActive : ''} md-ripple-container`}
                onClick={(e) => {
                  triggerRipple(e);
                  setAudioEnabled(!audioEnabled);
                  if (!audioEnabled) playCockpitChime('waypoint');
                }}
                title={audioEnabled ? 'Voice Announcements Active' : 'Voice Muted'}
                aria-label="Toggle Cockpit Audio"
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>

          {/* ── Automated Waypoint Banner ── */}
          {activeWaypoint && (
            <div className={styles.waypointBanner}>
              <div className={styles.waypointInfo}>
                <div className={styles.waypointIconBox}>
                  {activeWaypoint.type === 'TOLL_PLAZA' ? <Zap size={20} /> : <Navigation size={20} />}
                </div>
                <div className={styles.waypointText}>
                  <span className={styles.waypointName}>{activeWaypoint.name}</span>
                  <span className={styles.waypointSub}>
                    {activeWaypoint.toll ? `Automatic FASTag Electronic Pass • ${activeWaypoint.toll}` : 'Expressway Highway Facility'}
                  </span>
                </div>
              </div>
              <span className={styles.waypointDistBadge}>
                IN {activeWaypoint.distanceMeters / 1000} KM
              </span>
            </div>
          )}
        </div>

        {/* ── Center Radar Compass Badge ── */}
        <div className={styles.radarCenterCompass}>
          <Compass size={14} color="#84CC16" />
          <span>HEADING: {heading}° SE • GRIP: DRY 28°C</span>
        </div>

        {/* ── Bottom Cockpit Telemetry Strip ── */}
        <div className={styles.bottomCockpitStrip}>
          <div className={styles.telemetryGrid}>
            <div className={styles.telemetryCard}>
              <span className={styles.telemetryLabel}>CRUISING SPEED</span>
              <span className={styles.telemetryValue}>
                {speedKmh} <span className={styles.telemetryUnit}>KM/H</span>
              </span>
            </div>

            <div className={styles.telemetryCard}>
              <span className={styles.telemetryLabel}>DISTANCE LEFT</span>
              <span className={styles.telemetryValue}>
                {distanceRemainingKm} <span className={styles.telemetryUnit}>KM</span>
              </span>
            </div>

            <div className={styles.telemetryCard}>
              <span className={styles.telemetryLabel}>ESTIMATED ARRIVAL</span>
              <span className={styles.telemetryValue}>
                {etaMinutes} <span className={styles.telemetryUnit}>MINS</span>
              </span>
            </div>

            <div className={styles.telemetryCard}>
              <span className={styles.telemetryLabel}>PROPULSION</span>
              <span className={styles.telemetryValue} style={{ color: '#BEF264' }}>
                100% <span className={styles.telemetryUnit}>GREEN EV</span>
              </span>
            </div>
          </div>

          {/* ── Bottom Action Strip ── */}
          <div className={styles.actionStrip}>
            <div className={styles.pilotMiniInfo}>
              <img 
                src={ride?.driver?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200'} 
                alt="Pilot" 
                className={styles.pilotAvatar} 
              />
              <span>Pilot: <strong>{ride?.driver?.name || 'Rahul Sharma'}</strong> (Tata Nexon EV)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                type="button" 
                className={`${styles.shareBtn} md-ripple-container`}
                onClick={(e) => {
                  triggerRipple(e);
                  Haptics.selection();
                  if (navigator.share) {
                    navigator.share({
                      title: 'DriveIT Live Radar',
                      text: 'Tracking my intercity highway ride on DriveIT live cockpit!',
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Live Radar Link copied to clipboard!');
                  }
                }}
              >
                <Share2 size={14} />
                <span>Share Live</span>
              </button>

              <button 
                type="button" 
                className={`${styles.sosBtn} md-ripple-container`}
                onClick={handleTriggerSOS}
              >
                <ShieldAlert size={14} />
                <span>SOS 1033</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── SOS Emergency Confirmation Modal ── */}
      {sosModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#0F172A',
            border: '2px solid #EF4444',
            borderRadius: '24px',
            maxWidth: '460px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4)',
            color: '#FFFFFF',
            textAlign: 'center'
          }}>
            {!sosSuccess ? (
              <>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <AlertTriangle size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Highway SOS Emergency Beacon</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '20px' }}>
                  This will broadcast your live coordinates ({currentCoord.lat.toFixed(4)}, {currentCoord.lng.toFixed(4)}) and Pilot plate MH-12-RN-7788 directly to <strong>NHAI Highway Patrol (1033)</strong> and your emergency contacts.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setSosModalOpen(false)}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#334155', border: 'none', color: '#FFFFFF', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleConfirmSOS}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', background: '#EF4444', border: 'none', color: '#FFFFFF', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Broadcast SOS
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(132, 204, 22, 0.2)', color: '#84CC16', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>SOS Beacon Broadcasted</h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5', marginBottom: '20px' }}>
                  NHAI Highway Control and your emergency network have received your telemetry ping. Help is on the way.
                </p>
                <button 
                  type="button"
                  onClick={() => { setSosModalOpen(false); setSosSuccess(false); }}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#84CC16', border: 'none', color: '#0E240B', fontWeight: '800', cursor: 'pointer' }}
                >
                  Return to Cockpit
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
