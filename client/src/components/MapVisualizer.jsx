import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { ExternalLink, Layers, Navigation2, Compass, Radio, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Curated Fast Geocache for Top Indian Cities & Hubs
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
  hyderabad: [17.3850, 78.4867]
};

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
  const hours = distanceKm / 65;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  return `${h}h ${m > 0 ? `${m}m` : ''}`;
}

const createIcon = (color = '#10B981') => L.divIcon({
  className: 'custom-radar-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 18px;
        height: 18px;
        background: ${color};
        border: 2.5px solid #FFFFFF;
        border-radius: 50%;
        box-shadow: 0 0 14px ${color}, 0 2px 8px rgba(0,0,0,0.6);
      "></div>
      <div style="
        position: absolute;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: ${color};
        opacity: 0.3;
        animation: radarPulse 2s infinite ease-out;
      "></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapViewController({ originCoords, destinationCoords }) {
  const map = useMap();

  useEffect(() => {
    if (originCoords && destinationCoords) {
      const bounds = L.latLngBounds([originCoords, destinationCoords]);
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 12,
        animate: true,
        duration: 0.8
      });
    } else if (originCoords) {
      map.setView(originCoords, 10, { animate: true });
    }
  }, [map, originCoords, destinationCoords]);

  return null;
}

export default function MapVisualizer({
  origin = 'Mumbai',
  destination = 'Pune',
  originCoords: propOriginCoords,
  destCoords: propDestCoords
}) {
  const { isDark } = useTheme();
  const [mapMode, setMapMode] = useState('radar'); // 'radar' | 'satellite' | 'google_embed'
  const [originCoords, setOriginCoords] = useState(propOriginCoords || KNOWN_COORDS.mumbai);
  const [destCoords, setDestCoords] = useState(propDestCoords || KNOWN_COORDS.pune);
  const [distanceKm, setDistanceKm] = useState(148);
  const [durationText, setDurationText] = useState('2h 15m');

  useEffect(() => {
    if (propOriginCoords && propOriginCoords[0] && propOriginCoords[1]) {
      setOriginCoords(propOriginCoords);
    }
  }, [propOriginCoords]);

  useEffect(() => {
    if (propDestCoords && propDestCoords[0] && propDestCoords[1]) {
      setDestCoords(propDestCoords);
    }
  }, [propDestCoords]);

  useEffect(() => {
    let resolvedOrigin = propOriginCoords || resolveLocationCoords(origin, KNOWN_COORDS.mumbai);
    let resolvedDest = propDestCoords || resolveLocationCoords(destination, KNOWN_COORDS.pune);

    setOriginCoords(resolvedOrigin);
    setDestCoords(resolvedDest);

    const dist = calculateDistance(resolvedOrigin[0], resolvedOrigin[1], resolvedDest[0], resolvedDest[1]);
    setDistanceKm(dist > 0 ? dist : 148);
    setDurationText(dist > 0 ? formatDuration(dist) : '2h 15m');
  }, [origin, destination, propOriginCoords, propDestCoords]);

  const originClean = origin ? origin.trim() : 'Mumbai';
  const destClean = destination ? destination.trim() : 'Pune';

  const saddrQuery = propOriginCoords ? `${propOriginCoords[0]},${propOriginCoords[1]}` : encodeURIComponent(originClean);
  const daddrQuery = propDestCoords ? `${propDestCoords[0]},${propDestCoords[1]}` : encodeURIComponent(destClean);

  const googleEmbedUrl = `https://maps.google.com/maps?saddr=${saddrQuery}&daddr=${daddrQuery}&output=embed`;
  const googleMapsAppUrl = `https://www.google.com/maps/dir/?api=1&origin=${saddrQuery}&destination=${daddrQuery}&travelmode=driving`;

  return (
    <div style={{
      borderRadius: '20px',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
      overflow: 'hidden',
      boxShadow: isDark
        ? '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        : '0 10px 25px -5px rgba(0, 0, 0, 0.06)',
      background: isDark ? '#0B0F19' : '#FFFFFF',
      height: '380px',
      position: 'relative',
      zIndex: 1,
      isolation: 'isolate',
      transition: 'all 200ms ease'
    }}>
      {/* Top Floating Control Bar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 500,
        pointerEvents: 'auto'
      }}>
        {/* Layer Mode Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          padding: '4px',
          borderRadius: '12px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
          boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.08)'
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
              gap: '4px',
              transition: 'all 150ms ease'
            }}
          >
            <Radio size={12} />
            <span>Radar ⚡</span>
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
              gap: '4px',
              transition: 'all 150ms ease'
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
              gap: '4px',
              transition: 'all 150ms ease'
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
            background: 'rgba(16, 185, 129, 0.92)',
            backdropFilter: 'blur(12px)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: '800',
            padding: '6px 12px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            textDecoration: 'none',
            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)',
            transition: 'all 150ms ease'
          }}
          title="Open this route directly in Google Maps"
        >
          <Navigation2 size={12} />
          <span>Open in Google Maps</span>
          <ExternalLink size={10} />
        </a>
      </div>

      {/* Map Content */}
      {mapMode === 'google_embed' ? (
        <iframe
          key={`${saddrQuery}-${daddrQuery}`}
          title="Google Maps Live Directions"
          src={googleEmbedUrl}
          style={{
            width: '100%',
            height: '380px',
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
          style={{ height: '380px', width: '100%', background: isDark ? '#0B0F19' : '#F8FAFC' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; CARTO / OSM'
            url={
              mapMode === 'satellite'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : isDark
                  ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            }
          />

          <MapViewController
            originCoords={originCoords}
            destinationCoords={destCoords}
          />

          {originCoords && destCoords && (
            <Polyline
              positions={[originCoords, destCoords]}
              pathOptions={{
                color: '#F59E0B',
                weight: 4.5,
                opacity: 0.95,
                dashArray: '8, 8',
                lineCap: 'round'
              }}
            />
          )}

          {originCoords && (
            <Marker position={originCoords} icon={createIcon('#10B981')}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ color: '#10B981' }}>🟢 Origin (FROM)</strong>
                  <div style={{ fontSize: '12px', marginTop: '2px', color: '#0F172A' }}>{originClean}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {destCoords && (
            <Marker position={destCoords} icon={createIcon('#F59E0B')}>
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ color: '#F59E0B' }}>🟨 Destination (TO)</strong>
                  <div style={{ fontSize: '12px', marginTop: '2px', color: '#0F172A' }}>{destClean}</div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      )}

      {/* Floating Speed & Telemetry HUD Ribbon */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        right: '12px',
        background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: '12px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: isDark ? '#FFFFFF' : '#0F172A',
        fontSize: '11px',
        fontWeight: '700',
        zIndex: 500,
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 200ms ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
          <span style={{ color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: '800' }}>
            {originClean.split(',')[0]} ➔ {destClean.split(',')[0]}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#D97706', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Zap size={11} />
            {distanceKm} km
          </span>
          <span style={{ color: isDark ? '#475569' : '#94A3B8' }}>•</span>
          <span style={{ color: '#10B981', fontWeight: '800' }}>
            ⏱️ {durationText}
          </span>
          <span style={{ color: isDark ? '#475569' : '#94A3B8' }}>•</span>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: '10px', fontWeight: '600' }}>
            ⚡ FASTag Corridor
          </span>
        </div>
      </div>
    </div>
  );
}
