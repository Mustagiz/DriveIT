import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, Play, Pause, RotateCcw, Zap, Compass, 
  MapPin, Clock, Gauge, Fuel, ShieldCheck, Radio, CheckCircle2, AlertTriangle, ArrowRight, Layers, Eye 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';

// Fix Leaflet Default Icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper: Calculate Bearing between two Lat/Lng points
function calculateBearing(startLat, startLng, endLat, endLng) {
  const rad = Math.PI / 180;
  const lat1 = startLat * rad;
  const lat2 = endLat * rad;
  const dLng = (endLng - startLng) * rad;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

// Custom Rotating Vehicle Icon
const createCarIcon = (bearing = 0, isDark = false) => {
  return L.divIcon({
    className: 'custom-car-marker',
    html: `
      <div style="
        transform: rotate(${bearing}deg);
        transition: transform 0.25s ease-out;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 36px;
          height: 36px;
          background: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.9), 0 4px 10px rgba(0,0,0,0.6);
          border: 2px solid #FFFFFF;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11" fill="#000000"></polygon>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
};

// Custom Landmark Icon
const createLandmarkIcon = (name, color, label) => {
  return L.divIcon({
    className: 'custom-landmark-marker',
    html: `
      <div style="
        background: ${color};
        color: #000000;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        border: 1.5px solid #FFFFFF;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>●</span>
        <span>${label}</span>
      </div>
    `,
    iconSize: [80, 24],
    iconAnchor: [40, 12]
  });
};

// Auto-Pan Camera Follower
function CameraFollower({ position, followMode }) {
  const map = useMap();
  useEffect(() => {
    if (position && followMode) {
      map.panTo(position, { animate: true, duration: 0.4 });
    }
  }, [position, followMode, map]);
  return null;
}

// Realistic Highway Coordinate Segments (Mumbai -> Pune Yashwantrao Chavan Expressway)
const HIGHWAY_ROUTE_POINTS = [
  [19.0600, 72.8656], // BKC Mumbai
  [19.0550, 72.8900], // Chembur
  [19.0667, 72.9989], // Vashi Toll Plaza (KM 18)
  [19.0200, 73.0900], // Belapur
  [18.9800, 73.1200], // Panvel Expressway Start
  [18.8900, 73.2100], // Rasayani
  [18.7900, 73.2800], // Khalapur Toll Plaza (KM 45)
  [18.7600, 73.3400], // Bhor Ghat Ascend
  [18.7547, 73.4062], // Khandala / Lonavala Food Mall (KM 65)
  [18.7300, 73.4900], // Kamshet Tunnel
  [18.7180, 73.6600], // Urse Toll Plaza (KM 110)
  [18.6500, 73.7400], // Dehu Road Bypass
  [18.5900, 73.7800], // Wakad Pune
  [18.5300, 73.8300], // Shivajinagar
  [18.5018, 73.8636]  // Swargate Pune (KM 148)
];

export default function LiveRideTrackingCockpit({ ride = {}, onClose }) {
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [progressPercent, setProgressPercent] = useState(32); // 0 - 100%
  const [currentSpeed, setCurrentSpeed] = useState(88); // km/h
  const [batterySoc, setBatterySoc] = useState(74); // %
  const [mapType, setMapType] = useState('map'); // 'map' | 'track'
  const [followCar, setFollowCar] = useState(true);

  const isEv = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
  const totalKm = ride.distanceKm || 148;
  const coveredKm = Math.round((progressPercent / 100) * totalKm);
  const remainingKm = Math.max(0, totalKm - coveredKm);
  const remainingMinutes = Math.max(2, Math.round((remainingKm / (currentSpeed || 80)) * 60));

  // Compute interpolated GPS point along coordinates
  const totalSegments = HIGHWAY_ROUTE_POINTS.length - 1;
  const rawIdx = (progressPercent / 100) * totalSegments;
  const segIdx = Math.min(Math.floor(rawIdx), totalSegments - 1);
  const segFraction = rawIdx - segIdx;

  const p1 = HIGHWAY_ROUTE_POINTS[segIdx];
  const p2 = HIGHWAY_ROUTE_POINTS[segIdx + 1] || p1;

  const currentLat = p1[0] + (p2[0] - p1[0]) * segFraction;
  const currentLng = p1[1] + (p2[1] - p1[1]) * segFraction;
  const currentBearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

  const completedCoords = HIGHWAY_ROUTE_POINTS.slice(0, segIdx + 1).concat([[currentLat, currentLng]]);
  const remainingCoords = [[currentLat, currentLng]].concat(HIGHWAY_ROUTE_POINTS.slice(segIdx + 1));

  // Expressway Milestones
  const milestones = [
    { id: 1, name: 'Mumbai BKC', km: 0, pct: 0, time: '07:30 AM' },
    { id: 2, name: 'Vashi Toll', km: 18, pct: 14, time: '07:50 AM' },
    { id: 3, name: 'Khalapur Plaza', km: 45, pct: 32, time: '08:18 AM' },
    { id: 4, name: 'Ghats / Lonavala', km: 65, pct: 48, time: '08:45 AM' },
    { id: 5, name: 'Urse Toll', km: 110, pct: 75, time: '09:20 AM' },
    { id: 6, name: 'Pune Swargate', km: totalKm, pct: 100, time: '10:00 AM' }
  ];

  const upcomingMilestone = milestones.find(m => m.pct > progressPercent) || milestones[milestones.length - 1];

  // 60-FPS Simulation Loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 0.35 * speedMultiplier;
          setCurrentSpeed(Math.round(86 + Math.sin(next * 4) * 8));
          if (isEv) setBatterySoc(Math.max(10, Math.round(82 - (next * 0.48))));
          return Math.min(100, next);
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speedMultiplier, isEv]);

  const handleReset = () => {
    setProgressPercent(0);
    setIsPlaying(true);
    setCurrentSpeed(84);
    if (isEv) setBatterySoc(85);
  };

  return (
    <div style={{
      background: 'var(--color-bg-surface)',
      border: '1.5px solid var(--color-border)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      marginBottom: '24px',
      position: 'relative'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isPlaying ? '#10B981' : '#F59E0B',
            boxShadow: isPlaying ? '0 0 12px #10B981' : 'none'
          }} className={isPlaying ? 'animate-pulse' : ''} />
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={13} className="animate-pulse" />
              <span>Live Highway Telematics (GPS Synced)</span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', margin: '2px 0 0' }}>
              {ride.originCity || 'Mumbai'} ➔ {ride.destinationCity || 'Pune'} Expressway Corridor
            </h3>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setMapType(mapType === 'map' ? 'track' : 'map')}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Layers size={13} />
            <span>{mapType === 'map' ? 'Linear Track' : 'Live Map'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(239, 68, 68, 0.14)' : 'linear-gradient(135deg, #10B981, #059669)',
              color: isPlaying ? '#EF4444' : '#000000',
              border: isPlaying ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            <span>{isPlaying ? 'Pause' : 'Simulate'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSpeedMultiplier(prev => (prev === 1 ? 2 : prev === 2 ? 5 : 1))}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: '#F59E0B',
              borderRadius: '10px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            {speedMultiplier}x
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-tertiary)',
              borderRadius: '10px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
            title="Reset to Origin"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Primary HUD Gauge Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Speedometer */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            <Gauge size={12} color="#38BDF8" />
            <span>Cruising Speed</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#38BDF8', lineHeight: 1.1 }}>
            {isPlaying ? currentSpeed : 0} <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-text-tertiary)' }}>km/h</span>
          </div>
          <div style={{ fontSize: '10.5px', color: '#10B981', fontWeight: '700', marginTop: '2px' }}>
            ⚡ Limit: 100 km/h
          </div>
        </div>

        {/* Live ETA */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            <Clock size={12} color="#F59E0B" />
            <span>Live ETA</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#F59E0B', lineHeight: 1.1 }}>
            {progressPercent >= 100 ? 'ARRIVED' : `${remainingMinutes}m`}
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', fontWeight: '700', marginTop: '2px' }}>
            {remainingKm} km remaining
          </div>
        </div>

        {/* Battery SOC */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            {isEv ? <Zap size={12} color="#10B981" /> : <Fuel size={12} color="#F59E0B" />}
            <span>{isEv ? 'EV Battery (SOC)' : 'Fuel Level'}</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#10B981', lineHeight: 1.1 }}>
            {isEv ? `${batterySoc}%` : '85%'}
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary)', fontWeight: '700', marginTop: '2px' }}>
            {isEv ? `~${Math.round(batterySoc * 2.8)} km range` : 'Eco Cruising'}
          </div>
        </div>

        {/* Next Milestone Radar */}
        <div style={{
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '14px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
            <MapPin size={12} color="#EC4899" />
            <span>Next Milestone</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '4px' }} title={upcomingMilestone?.name}>
            {upcomingMilestone?.name}
          </div>
          <div style={{ fontSize: '10.5px', color: '#38BDF8', fontWeight: '700', marginTop: '3px' }}>
            in {Math.max(1, Math.round(((upcomingMilestone?.pct - progressPercent) / 100) * totalKm))} km
          </div>
        </div>
      </div>

      {/* MAP VIEW: Real Leaflet Map with Animated Rotated Car Marker */}
      {mapType === 'map' ? (
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1.5px solid var(--color-border)',
          height: '320px',
          marginBottom: '20px',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <MapContainer
            center={[currentLat, currentLng]}
            zoom={12}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              url={isDark 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              }
              attribution="&copy; OpenStreetMap"
            />

            {/* Trailing Completed Polyline */}
            <Polyline positions={completedCoords} color="#10B981" weight={6} opacity={0.9} />

            {/* Upcoming Remaining Polyline */}
            <Polyline positions={remainingCoords} color="#94A3B8" weight={4} dashArray="6, 8" opacity={0.7} />

            {/* Origin & Destination Markers */}
            <Marker position={HIGHWAY_ROUTE_POINTS[0]} icon={createLandmarkIcon('Mumbai', '#10B981', 'Origin Hub')} />
            <Marker position={HIGHWAY_ROUTE_POINTS[HIGHWAY_ROUTE_POINTS.length - 1]} icon={createLandmarkIcon('Pune', '#EF4444', 'Destination')} />

            {/* Rotated Moving Vehicle Marker */}
            <Marker
              position={[currentLat, currentLng]}
              icon={createCarIcon(currentBearing, isDark)}
            >
              <Popup>
                <div style={{ fontSize: '12px', fontWeight: '800' }}>
                  ⚡ {ride.driverName || 'Rahul Sharma'}<br />
                  {currentSpeed} km/h • Bearing: {Math.round(currentBearing)}°
                </div>
              </Popup>
            </Marker>

            {/* Auto Camera Follow */}
            <CameraFollower position={[currentLat, currentLng]} followMode={followCar} />
          </MapContainer>

          {/* Map Follow Mode Toggle Overlay */}
          <button
            type="button"
            onClick={() => setFollowCar(!followCar)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 1000,
              background: followCar ? '#10B981' : 'var(--color-bg-surface)',
              color: followCar ? '#000000' : 'var(--color-text-primary)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}
          >
            <Compass size={12} />
            <span>{followCar ? 'Auto-Tracking Car' : 'Free Pan'}</span>
          </button>
        </div>
      ) : (
        /* LINEAR TRACK VIEW */
        <div style={{
          background: isDark ? '#0B0F19' : '#F1F5F9',
          border: isDark ? '1.5px solid rgba(255, 255, 255, 0.1)' : '1.5px solid #CBD5E1',
          borderRadius: '18px',
          padding: '24px 20px',
          position: 'relative',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          {/* Road Surface Line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            right: '20px',
            height: '10px',
            background: isDark ? '#1E293B' : '#E2E8F0',
            borderRadius: '999px',
            transform: 'translateY(-50%)'
          }} />

          {/* Filled Progress */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '20px',
            width: `calc(${progressPercent}% * 0.9 + 10px)`,
            height: '10px',
            background: 'linear-gradient(90deg, #F59E0B, #10B981)',
            borderRadius: '999px',
            transform: 'translateY(-50%)',
            transition: 'width 300ms ease'
          }} />

          {/* Moving Car Marker */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: `calc(20px + ${progressPercent}% * 0.88)`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            transition: 'left 300ms ease'
          }}>
            <div style={{
              background: '#10B981',
              color: '#000000',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px #10B981, 0 4px 10px rgba(0,0,0,0.5)',
              border: '2px solid #FFFFFF'
            }}>
              <Navigation size={18} style={{ transform: `rotate(${currentBearing}deg)` }} />
            </div>
          </div>

          {/* Responsive Milestone Markers with clean spacing */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 5
          }}>
            {milestones.map((m) => {
              const isPassed = progressPercent >= m.pct;
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '55px'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isPassed ? '#10B981' : (isDark ? '#334155' : '#CBD5E1'),
                    border: '2px solid var(--color-bg-surface)',
                    boxShadow: isPassed ? '0 0 8px rgba(16, 185, 129, 0.6)' : 'none',
                    marginBottom: '8px'
                  }} />
                  <span style={{
                    fontSize: '10px',
                    fontWeight: isPassed ? '800' : '600',
                    color: isPassed ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {m.name.split(' ')[0]}
                  </span>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>
                    {m.km} km
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pilot Telematics Signature Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--color-bg-secondary)',
        borderRadius: '14px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#10B981" />
          <span style={{ color: 'var(--color-text-secondary)' }}>
            Vehicle Telemetry: <strong style={{ color: 'var(--color-text-primary)' }}>{ride.vehicle?.make || 'Tata'} {ride.vehicle?.model || 'Nexon EV'} ({ride.vehicle?.plate || 'MH-12-RN-7788'})</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: '800' }}>
          <span>● GPS Synced (NHAI FASTag Radar Active)</span>
        </div>
      </div>
    </div>
  );
}
