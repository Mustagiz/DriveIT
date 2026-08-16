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

// Comprehensive Database of Geocodes for Indian Expressways & Major Hubs
const KNOWN_COORDS = {
  mumbai: [19.0760, 72.8777],
  bkc: [19.0657, 72.8687],
  dadar: [19.0178, 72.8478],
  vashi: [19.0660, 72.9904],
  pune: [18.5204, 73.8567],
  swargate: [18.5018, 73.8587],
  hinjewadi: [18.5913, 73.7389],
  wakad: [18.5987, 73.7687],
  nashik: [19.9975, 73.7898],
  sinnar: [19.8458, 73.9984],
  sangamner: [19.5760, 74.2090],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  delhi: [28.6139, 77.2090],
  gurgaon: [28.4595, 77.0266],
  noida: [28.5355, 77.3910],
  jaipur: [26.9124, 75.7873],
  hyderabad: [17.3850, 78.4867],
  vijayawada: [16.5062, 80.6480],
  goa: [15.2993, 74.1240],
  panaji: [15.4909, 73.8278],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  agra: [27.1767, 78.0081]
};

function resolveCoords(locationStr, fallback = [19.0760, 72.8777]) {
  if (!locationStr || typeof locationStr !== 'string') return fallback;
  const clean = locationStr.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (clean.includes(key)) return coords;
  }
  return fallback;
}

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

// Custom Rotating Vehicle Icon with directional triangle
const createCarIcon = (bearing = 0, isDark = false) => {
  return L.divIcon({
    className: 'custom-car-marker',
    html: `
      <div style="
        transform: rotate(${bearing}deg);
        transition: transform 0.2s ease-out;
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
          border: 2.5px solid #FFFFFF;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="#000000"></polygon>
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
        color: ${color === '#10B981' || color === '#F59E0B' ? '#000000' : '#FFFFFF'};
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 900;
        white-space: nowrap;
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        border: 1.5px solid #FFFFFF;
        display: flex;
        align-items: center;
        gap: 5px;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: currentColor;"></span>
        <span>${label || name}</span>
      </div>
    `,
    iconSize: [110, 26],
    iconAnchor: [55, 13]
  });
};

// Auto-Pan Camera Follower
function CameraFollower({ position, followMode }) {
  const map = useMap();
  useEffect(() => {
    if (position && followMode) {
      map.panTo(position, { animate: true, duration: 0.35 });
    }
  }, [position, followMode, map]);
  return null;
}

// Generate Dynamic Highway Milestones
function generateMilestones(originCity, destCity, totalKm) {
  const o = (originCity || 'Origin').split(',')[0].trim();
  const d = (destCity || 'Destination').split(',')[0].trim();
  const lowerO = o.toLowerCase();
  const lowerD = d.toLowerCase();

  // 1. Mumbai -> Pune
  if ((lowerO.includes('mumbai') && lowerD.includes('pune')) || (lowerO.includes('pune') && lowerD.includes('mumbai'))) {
    return [
      { id: 1, name: `${o} Hub`, km: 0, pct: 0 },
      { id: 2, name: 'Vashi Expressway Toll', km: 18, pct: 15 },
      { id: 3, name: 'Khalapur Food Mall', km: 48, pct: 35 },
      { id: 4, name: 'Khandala / Bhor Ghat', km: 68, pct: 50 },
      { id: 5, name: 'Urse Toll Plaza', km: 112, pct: 75 },
      { id: 6, name: `${d} Swargate`, km: totalKm || 148, pct: 100 }
    ];
  }

  // 2. Pune -> Nashik
  if ((lowerO.includes('pune') && lowerD.includes('nashik')) || (lowerO.includes('nashik') && lowerD.includes('pune'))) {
    return [
      { id: 1, name: `${o} Hub`, km: 0, pct: 0 },
      { id: 2, name: 'Chakan Auto Corridor', km: 34, pct: 16 },
      { id: 3, name: 'Narayangaon Bypass', km: 78, pct: 36 },
      { id: 4, name: 'Sangamner Plaza', km: 138, pct: 65 },
      { id: 5, name: 'Sinnar Industrial Toll', km: 182, pct: 85 },
      { id: 6, name: `${d} Central Hub`, km: totalKm || 212, pct: 100 }
    ];
  }

  // 3. Bengaluru -> Chennai
  if ((lowerO.includes('bengaluru') && lowerD.includes('chennai')) || (lowerO.includes('chennai') && lowerD.includes('bengaluru'))) {
    return [
      { id: 1, name: `${o} Electronic City`, km: 0, pct: 0 },
      { id: 2, name: 'Attibele Border Toll', km: 32, pct: 10 },
      { id: 3, name: 'Hosur Expressway Hub', km: 45, pct: 15 },
      { id: 4, name: 'Krishnagiri Plaza', km: 92, pct: 30 },
      { id: 5, name: 'Vellore Bypass', km: 215, pct: 65 },
      { id: 6, name: `${d} Guindy Hub`, km: totalKm || 340, pct: 100 }
    ];
  }

  // 4. Delhi -> Jaipur
  if ((lowerO.includes('delhi') && lowerD.includes('jaipur')) || (lowerO.includes('jaipur') && lowerD.includes('delhi'))) {
    return [
      { id: 1, name: `${o} IGI Airport`, km: 0, pct: 0 },
      { id: 2, name: 'Kherki Daula Plaza', km: 28, pct: 12 },
      { id: 3, name: 'Neemrana Hub', km: 120, pct: 45 },
      { id: 4, name: 'Kotputli Expressway', km: 155, pct: 58 },
      { id: 5, name: 'Manoharpur Toll', km: 220, pct: 82 },
      { id: 6, name: `${d} Sindhi Camp`, km: totalKm || 270, pct: 100 }
    ];
  }

  // Default Generic Milestones
  return [
    { id: 1, name: `${o} Departure`, km: 0, pct: 0 },
    { id: 2, name: 'Expressway Entry Toll', km: Math.round(totalKm * 0.18), pct: 18 },
    { id: 3, name: 'Highway Rest Stop', km: Math.round(totalKm * 0.45), pct: 45 },
    { id: 4, name: 'Corridor Midway Plaza', km: Math.round(totalKm * 0.72), pct: 72 },
    { id: 5, name: `${d} Arrival Hub`, km: totalKm, pct: 100 }
  ];
}

export default function LiveRideTrackingCockpit({ ride = {}, onClose }) {
  const { isDark } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [progressPercent, setProgressPercent] = useState(38); // 0 - 100%
  const [currentSpeed, setCurrentSpeed] = useState(88); // km/h
  const [batterySoc, setBatterySoc] = useState(68); // %
  const [mapType, setMapType] = useState('map'); // 'map' | 'track'
  const [followCar, setFollowCar] = useState(true);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [computedDistanceKm, setComputedDistanceKm] = useState(ride.distanceKm || 148);

  const originName = (ride.originCity || ride.originAddress || 'Pune').split(',')[0].trim();
  const destName = (ride.destinationCity || ride.destinationAddress || 'Nashik').split(',')[0].trim();

  const isEv = ride.vehicle?.electric !== false && (ride.vehicle?.fuelType === 'ELECTRIC' || !ride.vehicle?.fuelType);
  const totalKm = computedDistanceKm;
  const coveredKm = Math.round((progressPercent / 100) * totalKm);
  const remainingKm = Math.max(0, totalKm - coveredKm);
  const remainingMinutes = Math.max(2, Math.round((remainingKm / (currentSpeed || 80)) * 60));

  // Dynamic Origin and Destination Geocoordinates
  const origCoords = resolveCoords(ride.originCity || ride.originAddress, [18.5204, 73.8567]);
  const destCoords = resolveCoords(ride.destinationCity || ride.destinationAddress, [19.9975, 73.7898]);

  // Fetch real OSRM highway coordinates
  useEffect(() => {
    const fetchOSRMRoute = async () => {
      try {
        const url = `/api/routing/route?olat=${origCoords[0]}&olng=${origCoords[1]}&dlat=${destCoords[0]}&dlng=${destCoords[1]}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.geometry?.coordinates?.length > 0) {
            const leafletCoords = data.geometry.coordinates.map(pt => [pt[1], pt[0]]);
            setRoutePolyline(leafletCoords);
            if (data.distanceKm) {
              setComputedDistanceKm(Math.round(data.distanceKm));
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Live cockpit routing fetch error:', err.message);
      }

      // Fallback: Generate 30 smooth interpolated points between origin and destination
      const fallbackPts = [];
      const steps = 30;
      for (let i = 0; i <= steps; i++) {
        const frac = i / steps;
        const lat = origCoords[0] + (destCoords[0] - origCoords[0]) * frac;
        const lng = origCoords[1] + (destCoords[1] - origCoords[1]) * frac;
        fallbackPts.push([lat, lng]);
      }
      setRoutePolyline(fallbackPts);
    };

    fetchOSRMRoute();
  }, [ride.originCity, ride.destinationCity, ride.originAddress, ride.destinationAddress]);

  // Compute Current Car Position on Road Polyline
  const activePoints = routePolyline.length > 1 ? routePolyline : [origCoords, destCoords];
  const totalSegments = activePoints.length - 1;
  const rawIdx = (progressPercent / 100) * totalSegments;
  const segIdx = Math.min(Math.floor(rawIdx), totalSegments - 1);
  const segFraction = rawIdx - segIdx;

  const p1 = activePoints[segIdx] || origCoords;
  const p2 = activePoints[segIdx + 1] || p1;

  const currentLat = p1[0] + (p2[0] - p1[0]) * segFraction;
  const currentLng = p1[1] + (p2[1] - p1[1]) * segFraction;
  const currentBearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);

  const completedCoords = activePoints.slice(0, segIdx + 1).concat([[currentLat, currentLng]]);
  const remainingCoords = [[currentLat, currentLng]].concat(activePoints.slice(segIdx + 1));

  // Dynamic Milestones for corridor
  const milestones = generateMilestones(originName, destName, totalKm);
  const upcomingMilestone = milestones.find(m => m.pct > progressPercent) || milestones[milestones.length - 1];

  // Simulation Loop
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
          setCurrentSpeed(Math.round(84 + Math.sin(next * 5) * 8));
          if (isEv) setBatterySoc(Math.max(10, Math.round(76 - (next * 0.42))));
          return Math.min(100, next);
        });
      }, 350);
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
              {originName} ➔ {destName} Expressway Corridor
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
          height: '340px',
          marginBottom: '20px',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
        }}>
          <MapContainer
            center={[currentLat, currentLng]}
            zoom={11}
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
            <Polyline positions={completedCoords} color="#10B981" weight={6} opacity={0.95} />

            {/* Upcoming Remaining Polyline */}
            <Polyline positions={remainingCoords} color="#64748B" weight={4} dashArray="6, 8" opacity={0.7} />

            {/* Origin & Destination Markers */}
            <Marker position={activePoints[0]} icon={createLandmarkIcon(originName, '#10B981', `${originName} (Origin)`)} />
            <Marker position={activePoints[activePoints.length - 1]} icon={createLandmarkIcon(destName, '#EF4444', `${destName} (Destination)`)} />

            {/* Rotated Moving Vehicle Marker */}
            <Marker
              position={[currentLat, currentLng]}
              icon={createCarIcon(currentBearing, isDark)}
            >
              <Popup>
                <div style={{ fontSize: '12px', fontWeight: '800' }}>
                  ⚡ {ride.driverName || 'Verified Pilot'}<br />
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
