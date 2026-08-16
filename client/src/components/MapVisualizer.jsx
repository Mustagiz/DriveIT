import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { 
  ExternalLink, 
  Layers, 
  Navigation2, 
  Compass, 
  Radio, 
  Zap, 
  ShieldCheck, 
  Car, 
  CreditCard,
  Sparkles,
  Target,
  Sun
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import styles from './MapVisualizer.module.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Curated Geocodes for Indian Expressways & Hubs
const KNOWN_COORDS = {
  mumbai: [19.0760, 72.8777],
  bkc: [19.0657, 72.8687],
  dadar: [19.0178, 72.8478],
  vashi: [19.0660, 72.9904],
  'navi mumbai': [19.0330, 73.0297],
  thane: [19.2183, 72.9781],
  borivali: [19.2288, 72.8541],
  andheri: [19.1197, 72.8464],
  powai: [19.1176, 72.9060],
  pune: [18.5204, 73.8567],
  swargate: [18.5018, 73.8587],
  hinjawadi: [18.5913, 73.7389],
  wakad: [18.5987, 73.7687],
  baner: [18.5642, 73.7769],
  'viman nagar': [18.5679, 73.9143],
  magarpatta: [18.5158, 73.9272],
  bengaluru: [12.9716, 77.5946],
  chennai: [13.0827, 80.2707],
  delhi: [28.6139, 77.2090],
  gurgaon: [28.4595, 77.0266],
  noida: [28.5355, 77.3910],
  jaipur: [26.9124, 75.7873],
  hyderabad: [17.3850, 78.4867],
  vijayawada: [16.5062, 80.6480],
  goa: [15.2993, 74.1240],
  lonavala: [18.7557, 73.4091],
  agra: [27.1767, 78.0081],
  mysore: [12.2958, 76.6394]
};

// Express Toll Plazas Data
const HIGHWAY_TOLL_GATES = [
  { name: 'Khalapur Toll Plaza', coords: [18.8410, 73.2840], toll: '₹85', highway: 'Mumbai-Pune Exp (NH48)' },
  { name: 'Urse Toll Plaza', coords: [18.7300, 73.6600], toll: '₹85', highway: 'Mumbai-Pune Exp (NH48)' },
  { name: 'Kherki Daula Plaza', coords: [28.4060, 76.9950], toll: '₹65', highway: 'Delhi-Jaipur Exp (NH48)' },
  { name: 'Manoharpur Toll Plaza', coords: [27.3020, 75.9520], toll: '₹75', highway: 'Delhi-Jaipur (NH48)' },
  { name: 'Attibele Toll Plaza', coords: [12.7780, 77.7710], toll: '₹40', highway: 'BLR-Chennai Highway' },
  { name: 'Pantangi Toll Plaza', coords: [17.1580, 78.9610], toll: '₹70', highway: 'HYD-Vijayawada (NH65)' }
];



export const CORRIDOR_PRESETS = [
  { id: 'mum_pun', name: 'Mumbai ➔ Pune', from: 'Mumbai', to: 'Pune', fare: '₹350', km: '148 km', tolls: '₹170' },
  { id: 'del_jai', name: 'Delhi ➔ Jaipur', from: 'Delhi', to: 'Jaipur', fare: '₹450', km: '270 km', tolls: '₹140' },
  { id: 'blr_che', name: 'Bengaluru ➔ Chennai', from: 'Bengaluru', to: 'Chennai', fare: '₹400', km: '340 km', tolls: '₹110' },
  { id: 'hyd_vij', name: 'Hyderabad ➔ Vijayawada', from: 'Hyderabad', to: 'Vijayawada', fare: '₹420', km: '275 km', tolls: '₹135' }
];

function resolveLocationCoords(query, defaultCoords) {
  if (!query || typeof query !== 'string') return defaultCoords;
  const clean = query.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (clean.includes(key)) return coords;
  }
  return defaultCoords;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.22);
}

function formatDuration(distanceKm) {
  const hours = distanceKm / 68;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m > 0 ? `${m}m` : ''}`;
}

function calculateBearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin((lon2 - lon1) * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos((lon2 - lon1) * (Math.PI / 180));
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

// Custom Professional SVG Map Icons
const createOriginIcon = () => L.divIcon({
  className: 'custom-origin-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        background: linear-gradient(135deg, #10B981, #059669);
        color: #FFFFFF;
        font-size: 10px;
        font-weight: 900;
        padding: 4px 9px;
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6), 0 0 0 1.5px rgba(255,255,255,0.95);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        letter-spacing: 0.02em;
      ">
        <span style="width: 5px; height: 5px; border-radius: 50%; background: #FFFFFF;"></span>
        <span>START</span>
      </div>
      <div style="
        width: 0; 
        height: 0; 
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #059669;
      "></div>
      <div style="
        width: 12px;
        height: 12px;
        background: #10B981;
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 12px #10B981;
        margin-top: -2px;
      "></div>
    </div>
  `,
  iconSize: [80, 42],
  iconAnchor: [40, 42]
});

const createDestIcon = () => L.divIcon({
  className: 'custom-dest-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        background: linear-gradient(135deg, #F59E0B, #D97706);
        color: #000000;
        font-size: 10px;
        font-weight: 900;
        padding: 4px 9px;
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.6), 0 0 0 1.5px rgba(255,255,255,0.95);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
        letter-spacing: 0.02em;
      ">
        <span>🏁 ARRIVAL</span>
      </div>
      <div style="
        width: 0; 
        height: 0; 
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #D97706;
      "></div>
      <div style="
        width: 12px;
        height: 12px;
        background: #F59E0B;
        border: 2px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 12px #F59E0B;
        margin-top: -2px;
      "></div>
    </div>
  `,
  iconSize: [80, 42],
  iconAnchor: [40, 42]
});

const createTollIcon = (tollText) => L.divIcon({
  className: 'custom-toll-pin',
  html: `
    <div style="
      background: linear-gradient(135deg, #7C3AED, #6D28D9);
      border: 1.5px solid rgba(255, 255, 255, 0.9);
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 2.5px 8px;
      border-radius: 7px;
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.55);
      display: flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    ">
      <span>⚡ FASTag ${tollText}</span>
    </div>
  `,
  iconSize: [76, 24],
  iconAnchor: [38, 12]
});



const create2DCarIcon = (bearing = 0, speed = 94) => L.divIcon({
  className: 'custom-2d-vector-car',
  html: `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
    ">
      <!-- Floating Speed Telemetry Pill -->
      <div style="
        position: absolute;
        top: -11px;
        background: #0B0F19;
        border: 1.5px solid #10B981;
        color: #34D399;
        font-size: 8.5px;
        font-weight: 900;
        padding: 1.5px 7px;
        border-radius: 9999px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        white-space: nowrap;
        z-index: 10;
        display: flex;
        align-items: center;
        gap: 3px;
      ">
        <span style="width: 4px; height: 4px; border-radius: 50%; background: #10B981;"></span>
        <span>${speed} km/h</span>
      </div>

      <!-- Rotatable 2D Top-Down Car Chassis -->
      <div style="
        transform: rotate(${bearing}deg);
        transition: transform 120ms linear;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
      ">
        <!-- Headlight Beams Glow -->
        <div style="
          position: absolute;
          top: -24px;
          width: 28px;
          height: 28px;
          background: linear-gradient(to top, rgba(254, 240, 138, 0.55) 0%, transparent 100%);
          clip-path: polygon(25% 100%, 75% 100%, 100% 0%, 0% 0%);
          pointer-events: none;
        "></div>

        <!-- 2D SVG Car Model (Top-Down Tata Nexon / EV Sedan) -->
        <svg viewBox="0 0 40 70" width="28" height="49" style="filter: drop-shadow(0 6px 14px rgba(0,0,0,0.75));">
          <defs>
            <linearGradient id="carBodyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#065F46" />
            </linearGradient>
            <linearGradient id="carRoofGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>

          <!-- Wheels -->
          <rect x="1" y="10" width="4" height="12" rx="2" fill="#0F172A" />
          <rect x="35" y="10" width="4" height="12" rx="2" fill="#0F172A" />
          <rect x="1" y="48" width="4" height="12" rx="2" fill="#0F172A" />
          <rect x="35" y="48" width="4" height="12" rx="2" fill="#0F172A" />

          <!-- Main Aerodynamic Body -->
          <path d="M7 16 C7 8, 12 3, 20 3 C28 3, 33 8, 33 16 L34 54 C34 62, 29 67, 20 67 C11 67, 6 62, 6 54 Z" fill="url(#carBodyGrad)" stroke="#FFFFFF" stroke-width="1.2" />

          <!-- Front Headlights -->
          <ellipse cx="11" cy="6" rx="2.5" ry="1.5" fill="#FEF08A" />
          <ellipse cx="29" cy="6" rx="2.5" ry="1.5" fill="#FEF08A" />

          <!-- Front Windshield -->
          <path d="M10 22 L13 14 Q20 12 27 14 L30 22 Z" fill="url(#glassGrad)" opacity="0.95" />

          <!-- Roof & Sunroof -->
          <rect x="10" y="24" width="20" height="22" rx="4" fill="url(#carRoofGrad)" />
          <rect x="13" y="27" width="14" height="8" rx="2" fill="#38BDF8" opacity="0.8" />

          <!-- Rear Windshield -->
          <path d="M11 48 L13 54 Q20 55 27 54 L29 48 Z" fill="url(#glassGrad)" opacity="0.95" />

          <!-- Rear Red Tail Lights -->
          <rect x="9" y="64" width="5" height="2" rx="1" fill="#EF4444" />
          <rect x="26" y="64" width="5" height="2" rx="1" fill="#EF4444" />

          <!-- Side Mirrors -->
          <rect x="3" y="19" width="3" height="4" rx="1.5" fill="#047857" />
          <rect x="34" y="19" width="3" height="4" rx="1.5" fill="#047857" />
        </svg>
      </div>
    </div>
  `,
  iconSize: [64, 64],
  iconAnchor: [32, 32]
});

function MapViewController({ boundsCoordinates, recenterTrigger }) {
  const map = useMap();

  useEffect(() => {
    if (boundsCoordinates && boundsCoordinates.length >= 2) {
      const bounds = L.latLngBounds(boundsCoordinates);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 12,
        animate: true,
        duration: 0.9
      });
    }
  }, [map, boundsCoordinates, recenterTrigger]);

  return null;
}

export default function MapVisualizer({
  origin = 'Mumbai',
  destination = 'Pune',
  originCoords: propOriginCoords,
  destCoords: propDestCoords,
  onCorridorSelect
}) {
  const { isDark } = useTheme();
  const [mapMode, setMapMode] = useState('radar'); // 'radar' | 'satellite' | 'voyager' | 'google_embed'
  const [originCoords, setOriginCoords] = useState(propOriginCoords || KNOWN_COORDS.mumbai);
  const [destCoords, setDestCoords] = useState(propDestCoords || KNOWN_COORDS.pune);
  const [routePolyline, setRoutePolyline] = useState([]);
  const [distanceKm, setDistanceKm] = useState(148);
  const [durationText, setDurationText] = useState('2h 15m');
  const [carPosition, setCarPosition] = useState(null);
  const [carProgressIdx, setCarProgressIdx] = useState(0);
  const [carBearing, setCarBearing] = useState(45);
  const [recenterCount, setRecenterCount] = useState(0);

  // Synchronize incoming props
  useEffect(() => {
    let resolvedOrigin = propOriginCoords || resolveLocationCoords(origin, KNOWN_COORDS.mumbai);
    let resolvedDest = propDestCoords || resolveLocationCoords(destination, KNOWN_COORDS.pune);

    setOriginCoords(resolvedOrigin);
    setDestCoords(resolvedDest);

    const dist = calculateDistance(resolvedOrigin[0], resolvedOrigin[1], resolvedDest[0], resolvedDest[1]);
    setDistanceKm(dist > 0 ? dist : 148);
    setDurationText(dist > 0 ? formatDuration(dist) : '2h 15m');

    // Fetch real road highway polyline from OSRM Backend
    const fetchRoute = async () => {
      try {
        const url = `/api/routing/route?olat=${resolvedOrigin[0]}&olng=${resolvedOrigin[1]}&dlat=${resolvedDest[0]}&dlng=${resolvedDest[1]}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.geometry?.coordinates?.length > 0) {
            const leafletCoords = data.geometry.coordinates.map(pt => [pt[1], pt[0]]);
            setRoutePolyline(leafletCoords);
            if (data.distanceKm) setDistanceKm(Math.round(data.distanceKm));
            if (data.durationMins) {
              const h = Math.floor(data.durationMins / 60);
              const m = data.durationMins % 60;
              setDurationText(h > 0 ? `${h}h ${m}m` : `${m}m`);
            }
            const initialIdx = Math.floor(leafletCoords.length * 0.25);
            setCarPosition(leafletCoords[initialIdx]);
            setCarProgressIdx(initialIdx);
            if (leafletCoords.length > 1) {
              const initialBearing = calculateBearing(leafletCoords[0][0], leafletCoords[0][1], leafletCoords[1][0], leafletCoords[1][1]);
              setCarBearing(Math.round(initialBearing));
            }
            return;
          }
        }
      } catch (err) {
        console.warn('OSRM routing fetch fallback to direct polyline:', err.message);
      }
      const pts = [resolvedOrigin, resolvedDest];
      setRoutePolyline(pts);
      setCarPosition(resolvedOrigin);
      const b = calculateBearing(resolvedOrigin[0], resolvedOrigin[1], resolvedDest[0], resolvedDest[1]);
      setCarBearing(Math.round(b));
    };

    fetchRoute();
  }, [origin, destination, propOriginCoords, propDestCoords]);

  // Smooth Pilot Vehicle Animation Along Highway Road with Directional Bearing
  useEffect(() => {
    if (!routePolyline || routePolyline.length < 5) return;

    const interval = setInterval(() => {
      setCarProgressIdx(prev => {
        const next = (prev + 1) % routePolyline.length;
        const currentPt = routePolyline[prev];
        const nextPt = routePolyline[next];
        if (currentPt && nextPt) {
          const bearing = calculateBearing(currentPt[0], currentPt[1], nextPt[0], nextPt[1]);
          setCarBearing(Math.round(bearing));
        }
        setCarPosition(routePolyline[next]);
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [routePolyline]);

  const originClean = origin ? origin.trim() : 'Mumbai';
  const destClean = destination ? destination.trim() : 'Pune';

  const saddrQuery = propOriginCoords ? `${propOriginCoords[0]},${propOriginCoords[1]}` : encodeURIComponent(originClean);
  const daddrQuery = propDestCoords ? `${propDestCoords[0]},${propDestCoords[1]}` : encodeURIComponent(destClean);

  const googleEmbedUrl = `https://maps.google.com/maps?saddr=${saddrQuery}&daddr=${daddrQuery}&output=embed`;
  const googleMapsAppUrl = `https://www.google.com/maps/dir/?api=1&origin=${saddrQuery}&destination=${daddrQuery}&travelmode=driving`;

  // Relevant toll gates along this corridor
  const visibleTolls = HIGHWAY_TOLL_GATES.filter(tg => {
    const d1 = calculateDistance(originCoords[0], originCoords[1], tg.coords[0], tg.coords[1]);
    const d2 = calculateDistance(destCoords[0], destCoords[1], tg.coords[0], tg.coords[1]);
    return (d1 + d2) <= (distanceKm * 1.35);
  });



  return (
    <div className={styles.mapWrapper}>
      {/* Quick Corridor Selection Bar */}
      <div className={styles.corridorsBar}>
        <span className={styles.corridorsTitle} style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
          <Sparkles size={13} color="#F59E0B" />
          <span>Express Corridors:</span>
        </span>
        {CORRIDOR_PRESETS.map((preset) => {
          const isSelected = originClean.toLowerCase().includes(preset.from.toLowerCase()) && destClean.toLowerCase().includes(preset.to.toLowerCase());
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onCorridorSelect ? onCorridorSelect(preset.from, preset.to) : null}
              className={styles.corridorBtn}
              style={{
                background: isSelected
                  ? 'rgba(245, 158, 11, 0.18)'
                  : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF'),
                border: isSelected
                  ? '1.5px solid #F59E0B'
                  : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0'),
                color: isDark ? '#F8FAFC' : '#1E293B'
              }}
            >
              <span>{preset.name}</span>
              <span className={styles.corridorFare}>{preset.fare}</span>
            </button>
          );
        })}
      </div>

      {/* Main Map Container Card */}
      <div className={styles.mapContainerCard} style={{
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
        background: isDark ? '#080C14' : '#FFFFFF'
      }}>
        {/* Subtle Vignette Ambient Lighting */}
        <div className={styles.vignetteOverlay} />

        {/* Top Control Bar */}
        <div className={styles.topControlBar}>
          {/* Layer Mode Switcher */}
          <div className={styles.modeSwitcher} style={{
            background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1'
          }}>
            <button
              type="button"
              onClick={() => setMapMode('radar')}
              className={styles.modeBtn}
              style={{
                background: mapMode === 'radar' ? '#F59E0B' : 'transparent',
                color: mapMode === 'radar' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                fontWeight: mapMode === 'radar' ? '800' : '700'
              }}
            >
              <Radio size={12} />
              <span>Radar ⚡</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('voyager')}
              className={styles.modeBtn}
              style={{
                background: mapMode === 'voyager' ? '#F59E0B' : 'transparent',
                color: mapMode === 'voyager' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                fontWeight: mapMode === 'voyager' ? '800' : '700'
              }}
            >
              <Navigation2 size={12} />
              <span>Carto</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              className={styles.modeBtn}
              style={{
                background: mapMode === 'satellite' ? '#F59E0B' : 'transparent',
                color: mapMode === 'satellite' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                fontWeight: mapMode === 'satellite' ? '800' : '700'
              }}
            >
              <Layers size={12} />
              <span>Satellite</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('google_embed')}
              className={styles.modeBtn}
              style={{
                background: mapMode === 'google_embed' ? '#F59E0B' : 'transparent',
                color: mapMode === 'google_embed' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                fontWeight: mapMode === 'google_embed' ? '800' : '700'
              }}
            >
              <Compass size={12} />
              <span>Google Live</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className={styles.topRightActions}>
            {/* Recenter View Button */}
            <button
              type="button"
              onClick={() => setRecenterCount(c => c + 1)}
              className={styles.recenterBtn}
              title="Recenter and fit route in view"
            >
              <Target size={12} color="#38BDF8" />
              <span>Recenter</span>
            </button>

            {/* 1-Click Launch in Google Maps App */}
            <a
              href={googleMapsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.googleMapsBtn}
              title="Open real turn-by-turn navigation in Google Maps"
            >
              <Navigation2 size={12} />
              <span className={styles.googleMapsBtnText}>Google Maps</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* Map Rendering Engine */}
        {mapMode === 'google_embed' ? (
          <iframe
            key={`${saddrQuery}-${daddrQuery}`}
            title="Google Maps Live Directions"
            src={googleEmbedUrl}
            style={{
              width: '100%',
              height: '440px',
              border: 'none',
              filter: 'contrast(1.05) saturate(1.1)'
            }}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <MapContainer
            center={originCoords}
            zoom={8}
            style={{ height: '440px', width: '100%', background: isDark ? '#080C14' : '#F8FAFC' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; CARTO / Esri'
              url={
                mapMode === 'satellite'
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : mapMode === 'voyager'
                    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                    : isDark
                      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
                      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              }
            />

            <MapViewController 
              boundsCoordinates={[originCoords, destCoords]} 
              recenterTrigger={recenterCount}
            />

            {/* Glowing Expressway Route Geometry */}
            {routePolyline.length > 0 && (
              <>
                {/* 1. Broad Ambient Cyan/Amber Highway Glow */}
                <Polyline
                  positions={routePolyline}
                  pathOptions={{
                    color: '#06B6D4',
                    weight: 10,
                    opacity: 0.22,
                    lineCap: 'round'
                  }}
                />
                {/* 2. Core Solid Highway Road Line */}
                <Polyline
                  positions={routePolyline}
                  pathOptions={{
                    color: '#F59E0B',
                    weight: 4.5,
                    opacity: 0.95,
                    lineCap: 'round'
                  }}
                />
                {/* 3. High-Speed Flow Traffic Dash */}
                <Polyline
                  positions={routePolyline}
                  pathOptions={{
                    color: '#FFFFFF',
                    weight: 2,
                    opacity: 0.8,
                    dashArray: '6, 14',
                    lineCap: 'round'
                  }}
                />
              </>
            )}

            {/* Origin Pin */}
            {originCoords && (
              <Marker position={originCoords} icon={createOriginIcon()}>
                <Popup>
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontWeight: '900', color: '#10B981', fontSize: '13px' }}>🟢 Verified Departure Hub</div>
                    <div style={{ fontSize: '12px', marginTop: '2px', fontWeight: '700', color: '#0F172A' }}>{originClean}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>⚡ 0 min pilot wait time • Instant EV Pickup</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination Pin */}
            {destCoords && (
              <Marker position={destCoords} icon={createDestIcon()}>
                <Popup>
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontWeight: '900', color: '#D97706', fontSize: '13px' }}>🏁 Drop-off Destination</div>
                    <div style={{ fontSize: '12px', marginTop: '2px', fontWeight: '700', color: '#0F172A' }}>{destClean}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>⏱️ Est. Arrival: {durationText}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* FASTag Toll Gate Markers */}
            {visibleTolls.map((toll, i) => (
              <Marker key={`toll-${i}`} position={toll.coords} icon={createTollIcon(toll.toll)}>
                <Popup>
                  <div style={{ padding: '4px' }}>
                    <strong style={{ color: '#7C3AED', fontSize: '12px' }}>{toll.name}</strong>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{toll.highway}</div>
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '2px' }}>⚡ Automated RFID 0-Second Lane</div>
                  </div>
                </Popup>
              </Marker>
            ))}



            {/* Animated 2D Modular Pilot Vehicle in Motion */}
            {carPosition && (
              <Marker position={carPosition} icon={create2DCarIcon(carBearing, 94)}>
                <Popup>
                  <div style={{ padding: '6px', textAlign: 'center' }}>
                    <div style={{ fontWeight: '800', color: '#10B981', fontSize: '12px' }}>🚗 Verified EV Pilot (Tata Nexon EV)</div>
                    <div style={{ fontSize: '11px', color: '#0F172A', marginTop: '2px', fontWeight: '600' }}>Pilot: Rahul Sharma (★ 4.96)</div>
                    <div style={{ fontSize: '10.5px', color: '#0284C7', fontWeight: '700', marginTop: '2px' }}>⚡ Cruising at 94 km/h • FASTag RFID Active</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}

        {/* Floating Telemetry & FASTag Cockpit HUD Ribbon */}
        <div className={styles.bottomHudRibbon} style={{
          background: isDark ? 'rgba(11, 15, 25, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
          color: isDark ? '#FFFFFF' : '#0F172A'
        }}>
          <div className={styles.hudRouteTitle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div className={styles.livePulseDot} />
              <span className={styles.routeText} style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>
                {originClean.split(',')[0]} ➔ {destClean.split(',')[0]}
              </span>
            </div>
            <span className={styles.liveRadarBadge}>
              ● LIVE RADAR
            </span>
          </div>

          <div className={styles.hudMetricsRow}>
            <span className={styles.hudMetricItem} style={{ color: '#FBBF24' }}>
              <Zap size={11} color="#FBBF24" />
              <span>{distanceKm} KM</span>
            </span>

            <span className={styles.hudDivider}>•</span>

            <span className={styles.hudMetricItem} style={{ color: '#34D399' }}>
              <span>⏱️ {durationText}</span>
            </span>

            <span className={styles.hudDivider}>•</span>

            {/* Responsive FASTag Toll Badge */}
            <span className={styles.hudFastagBadge} title="Automated FASTag Electronic Toll Clearance">
              <CreditCard size={11} />
              <span>FASTag: {visibleTolls.length > 0 ? `₹${visibleTolls.length * 85}` : '₹0'}</span>
            </span>

            <span className={styles.hudDivider}>•</span>

            {/* Live Weather & Road Grip Pill */}
            <span className={styles.hudWeatherPill}>
              <Sun size={11} color="#FCD34D" />
              <span>28°C Dry Grip</span>
            </span>

            <span className={styles.hudDivider}>•</span>

            <span className={styles.hudMetricItem} style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
              <ShieldCheck size={11} color="#10B981" />
              <span>100% Verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
