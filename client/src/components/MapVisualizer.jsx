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
  Gauge,
  CreditCard,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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

// Custom Professional SVG Map Icons
const createOriginIcon = () => L.divIcon({
  className: 'custom-origin-pin',
  html: `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
      <div style="
        background: linear-gradient(135deg, #10B981, #059669);
        color: #FFFFFF;
        font-size: 10.5px;
        font-weight: 800;
        padding: 4px 9px;
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6), 0 0 0 1.5px rgba(255,255,255,0.9);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span style="width: 6px; height: 6px; border-radius: 50%; background: #FFFFFF;"></span>
        <span>ORIGIN</span>
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
        box-shadow: 0 0 10px #10B981;
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
        font-size: 10.5px;
        font-weight: 900;
        padding: 4px 9px;
        border-radius: 9999px;
        box-shadow: 0 4px 14px rgba(245, 158, 11, 0.6), 0 0 0 1.5px rgba(255,255,255,0.9);
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
        <span>🟨 DROP-OFF</span>
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
        box-shadow: 0 0 10px #F59E0B;
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
      background: #7C3AED;
      border: 1.5px solid #FFFFFF;
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(124, 58, 237, 0.5);
      display: flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
    ">
      <span>⚡ FASTag ${tollText}</span>
    </div>
  `,
  iconSize: [70, 24],
  iconAnchor: [35, 12]
});

const createCarIcon = () => L.divIcon({
  className: 'custom-moving-car',
  html: `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #0F172A;
      border: 2px solid #F59E0B;
      box-shadow: 0 0 16px rgba(245, 158, 11, 0.8), 0 4px 10px rgba(0,0,0,0.6);
    ">
      <span style="font-size: 14px;">🚗</span>
      <div style="
        position: absolute;
        inset: -6px;
        border-radius: 50%;
        border: 1.5px solid #F59E0B;
        opacity: 0.5;
        animation: pingCar 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function MapViewController({ boundsCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (boundsCoordinates && boundsCoordinates.length >= 2) {
      const bounds = L.latLngBounds(boundsCoordinates);
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    }
  }, [map, boundsCoordinates]);

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
            // Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
            const leafletCoords = data.geometry.coordinates.map(pt => [pt[1], pt[0]]);
            setRoutePolyline(leafletCoords);
            if (data.distanceKm) setDistanceKm(Math.round(data.distanceKm));
            if (data.durationMins) {
              const h = Math.floor(data.durationMins / 60);
              const m = data.durationMins % 60;
              setDurationText(h > 0 ? `${h}h ${m}m` : `${m}m`);
            }
            // Set initial car position at 25% along the route
            const initialIdx = Math.floor(leafletCoords.length * 0.25);
            setCarPosition(leafletCoords[initialIdx]);
            setCarProgressIdx(initialIdx);
            return;
          }
        }
      } catch (err) {
        console.warn('OSRM routing fetch fallback to direct polyline:', err.message);
      }
      // Fallback: interpolate smooth direct polyline
      const pts = [resolvedOrigin, resolvedDest];
      setRoutePolyline(pts);
      setCarPosition(resolvedOrigin);
    };

    fetchRoute();
  }, [origin, destination, propOriginCoords, propDestCoords]);

  // Smooth Pilot Vehicle Animation Along Highway Road
  useEffect(() => {
    if (!routePolyline || routePolyline.length < 5) return;

    const interval = setInterval(() => {
      setCarProgressIdx(prev => {
        const next = (prev + 1) % routePolyline.length;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Quick Corridor Selection Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        scrollbarWidth: 'none'
      }}>
        <span style={{ fontSize: '11.5px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={13} color="#F59E0B" />
          <span>Express Corridors:</span>
        </span>
        {CORRIDOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onCorridorSelect ? onCorridorSelect(preset.from, preset.to) : null}
            style={{
              background: (originClean.toLowerCase().includes(preset.from.toLowerCase()) && destClean.toLowerCase().includes(preset.to.toLowerCase()))
                ? 'rgba(245, 158, 11, 0.18)'
                : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF'),
              border: (originClean.toLowerCase().includes(preset.from.toLowerCase()) && destClean.toLowerCase().includes(preset.to.toLowerCase()))
                ? '1.5px solid #F59E0B'
                : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0'),
              borderRadius: '10px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: '700',
              color: isDark ? '#F8FAFC' : '#1E293B',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <span>{preset.name}</span>
            <span style={{ fontSize: '10.5px', color: '#10B981', fontWeight: '800' }}>{preset.fare}</span>
          </button>
        ))}
      </div>

      {/* Main Map Container Card */}
      <div style={{
        borderRadius: '22px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)'
          : '0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        background: isDark ? '#080C14' : '#FFFFFF',
        height: '420px',
        position: 'relative',
        zIndex: 1,
        isolation: 'isolate',
        transition: 'all 200ms ease'
      }}>
        {/* Top Control Bar */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 500,
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {/* Layer Mode Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(16px)',
            padding: '4px',
            borderRadius: '12px',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            <button
              type="button"
              onClick={() => setMapMode('radar')}
              style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '5px 10px',
                borderRadius: '8px',
                background: mapMode === 'radar' ? '#F59E0B' : 'transparent',
                color: mapMode === 'radar' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Radio size={12} />
              <span>Radar ⚡</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('voyager')}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '8px',
                background: mapMode === 'voyager' ? '#F59E0B' : 'transparent',
                color: mapMode === 'voyager' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Navigation2 size={12} />
              <span>Carto</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '8px',
                background: mapMode === 'satellite' ? '#F59E0B' : 'transparent',
                color: mapMode === 'satellite' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Layers size={12} />
              <span>Satellite</span>
            </button>

            <button
              type="button"
              onClick={() => setMapMode('google_embed')}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 10px',
                borderRadius: '8px',
                background: mapMode === 'google_embed' ? '#F59E0B' : 'transparent',
                color: mapMode === 'google_embed' ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Compass size={12} />
              <span>Google Live</span>
            </button>
          </div>

          {/* 1-Click Launch in Google Maps App */}
          <a
            href={googleMapsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '800',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
              transition: 'all 150ms ease'
            }}
            title="Open real turn-by-turn navigation in Google Maps"
          >
            <Navigation2 size={12} />
            <span>Open in Google Maps</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Map Rendering Engine */}
        {mapMode === 'google_embed' ? (
          <iframe
            key={`${saddrQuery}-${daddrQuery}`}
            title="Google Maps Live Directions"
            src={googleEmbedUrl}
            style={{
              width: '100%',
              height: '420px',
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
            style={{ height: '420px', width: '100%', background: isDark ? '#080C14' : '#F8FAFC' }}
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

            <MapViewController boundsCoordinates={[originCoords, destCoords]} />

            {/* Glowing Expressway Route Geometry */}
            {routePolyline.length > 0 && (
              <>
                {/* Wide Ambient Glow Line */}
                <Polyline
                  positions={routePolyline}
                  pathOptions={{
                    color: '#F59E0B',
                    weight: 8,
                    opacity: 0.3,
                    lineCap: 'round'
                  }}
                />
                {/* Crisp Foreground Highway Line */}
                <Polyline
                  positions={routePolyline}
                  pathOptions={{
                    color: '#F59E0B',
                    weight: 4.5,
                    opacity: 0.95,
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
                    <div style={{ fontWeight: '800', color: '#10B981', fontSize: '13px' }}>🟢 Verified Departure Hub</div>
                    <div style={{ fontSize: '12px', marginTop: '2px', fontWeight: '600', color: '#0F172A' }}>{originClean}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>⚡ 0 min pilot wait time</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Destination Pin */}
            {destCoords && (
              <Marker position={destCoords} icon={createDestIcon()}>
                <Popup>
                  <div style={{ padding: '6px' }}>
                    <div style={{ fontWeight: '800', color: '#D97706', fontSize: '13px' }}>🟨 Arrival Hub</div>
                    <div style={{ fontSize: '12px', marginTop: '2px', fontWeight: '600', color: '#0F172A' }}>{destClean}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>⏱️ Est. Arrival: {durationText}</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* FASTag Toll Gate Markers */}
            {visibleTolls.map((toll, i) => (
              <Marker key={i} position={toll.coords} icon={createTollIcon(toll.toll)}>
                <Popup>
                  <div style={{ padding: '4px' }}>
                    <strong style={{ color: '#7C3AED', fontSize: '12px' }}>{toll.name}</strong>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{toll.highway}</div>
                    <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginTop: '2px' }}>⚡ Automated RFID Clearance</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Animated Pilot Vehicle in Motion */}
            {carPosition && (
              <Marker position={carPosition} icon={createCarIcon()}>
                <Popup>
                  <div style={{ padding: '4px', textAlign: 'center' }}>
                    <strong style={{ color: '#F59E0B' }}>🚗 Verified EV Pilot in Transit</strong>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>Live Expressway Speed: 94 km/h</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        )}

        {/* Floating Telemetry & Cockpit HUD Ribbon */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          right: '12px',
          background: isDark ? 'rgba(11, 15, 25, 0.94)' : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(18px)',
          borderRadius: '14px',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: isDark ? '#FFFFFF' : '#0F172A',
          fontSize: '11.5px',
          fontWeight: '700',
          zIndex: 500,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
            <span style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: '900', fontSize: '12px' }}>
              {originClean.split(',')[0]} ➔ {destClean.split(',')[0]}
            </span>
            <span style={{ fontSize: '10.5px', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
              ● LIVE RADAR
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#FBBF24', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={12} color="#FBBF24" />
              {distanceKm} KM
            </span>
            <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>•</span>
            <span style={{ color: '#34D399', fontWeight: '800' }}>
              ⏱️ {durationText}
            </span>
            <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>•</span>
            <span style={{ color: '#A78BFA', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CreditCard size={12} />
              Tolls: {visibleTolls.length > 0 ? `₹${visibleTolls.length * 85}` : '₹0'}
            </span>
            <span style={{ color: isDark ? '#475569' : '#CBD5E1' }}>•</span>
            <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={12} color="#10B981" />
              100% Aadhaar Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
