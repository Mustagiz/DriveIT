import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// OpenRouteService free API (no key needed for standard use, but key improves rate limits)
// Register free at openrouteservice.org for a key — optional
const ORS_KEY = process.env.ORS_API_KEY || '';
const ORS_BASE = 'https://api.openrouteservice.org/v2/directions/driving-car';
const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

// Cache routes in memory (origin-dest keyed)
const routeCache = new Map();
const weatherCache = new Map();
const ROUTE_CACHE_TTL = 12 * 60 * 60 * 1000;  // 12 hours
const WEATHER_CACHE_TTL = 30 * 60 * 1000;      // 30 minutes

function routeCacheKey(olat, olng, dlat, dlng) {
  // Round to 3 decimal places so nearby coords share cache
  return `${parseFloat(olat).toFixed(3)},${parseFloat(olng).toFixed(3)}-${parseFloat(dlat).toFixed(3)},${parseFloat(dlng).toFixed(3)}`;
}

// ─── Tier 1: OpenRouteService (India-accurate, free) ─────────────────────────
async function fetchOrsRoute(olat, olng, dlat, dlng) {
  const body = {
    coordinates: [
      [parseFloat(olng), parseFloat(olat)],
      [parseFloat(dlng), parseFloat(dlat)]
    ],
    format: 'geojson'
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  if (ORS_KEY) headers['Authorization'] = ORS_KEY;

  const res = await fetch(ORS_BASE, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(6000)
  });

  if (!res.ok) throw new Error(`ORS error: ${res.status}`);
  const data = await res.json();

  const feature = data.features?.[0];
  if (!feature) throw new Error('No ORS route');

  const coords = feature.geometry.coordinates;
  const summary = feature.properties?.summary;

  return {
    geometry: { type: 'LineString', coordinates: coords },
    distanceKm: Math.round((summary?.distance || 0) / 1000 * 10) / 10,
    durationMins: Math.round((summary?.duration || 0) / 60),
    source: 'ors'
  };
}

// ─── Tier 2: OSRM (public fallback) ──────────────────────────────────────────
async function fetchOsrmRoute(olat, olng, dlat, dlng) {
  const url = `${OSRM_BASE}/${olng},${olat};${dlng},${dlat}?overview=full&geometries=geojson&steps=false`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`OSRM error: ${res.status}`);
  const data = await res.json();

  const route = data.routes?.[0];
  if (!route) throw new Error('No OSRM route');

  return {
    geometry: route.geometry,
    distanceKm: Math.round(route.distance / 1000 * 10) / 10,
    durationMins: Math.round(route.duration / 60),
    source: 'osrm'
  };
}

// ─── Tier 3: Straight-line estimate ──────────────────────────────────────────
function straightLineEstimate(olat, olng, dlat, dlng) {
  const R = 6371;
  const dLat = (Number(dlat) - Number(olat)) * Math.PI / 180;
  const dLng = (Number(dlng) - Number(olng)) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(Number(olat) * Math.PI / 180) * Math.cos(Number(dlat) * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25);

  return {
    geometry: {
      type: 'LineString',
      coordinates: [
        [Number(olng), Number(olat)],
        [Number(dlng), Number(dlat)]
      ]
    },
    distanceKm,
    durationMins: Math.round(distanceKm / 70 * 60), // ~70 km/h highway avg
    source: 'fallback'
  };
}

// ─── GET /api/routing/route ───────────────────────────────────────────────────
router.get('/route', async (req, res) => {
  const { olat, olng, dlat, dlng } = req.query;

  if (!olat || !olng || !dlat || !dlng) {
    return res.status(400).json({
      error: 'Required: olat, olng, dlat, dlng (origin and destination coordinates)'
    });
  }

  const cacheKey = routeCacheKey(olat, olng, dlat, dlng);
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < ROUTE_CACHE_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  let routeData = null;
  let lastError = null;

  // Try ORS first (better India accuracy)
  try {
    routeData = await fetchOrsRoute(olat, olng, dlat, dlng);
  } catch (err) {
    lastError = err;
  }

  // Fallback to OSRM
  if (!routeData) {
    try {
      routeData = await fetchOsrmRoute(olat, olng, dlat, dlng);
    } catch (err) {
      lastError = err;
    }
  }

  // Final fallback: straight-line estimate
  if (!routeData) {
    routeData = straightLineEstimate(olat, olng, dlat, dlng);
  }

  const coords = routeData.geometry.coordinates;
  const durationMins = routeData.durationMins;

  const result = {
    success: true,
    distanceKm: routeData.distanceKm,
    durationMins,
    durationHours: Math.round(durationMins / 60 * 10) / 10,
    geometry: routeData.geometry,
    source: routeData.source,
    // Simplified animation coords (≤80 points for smooth animation)
    animationCoords: coords
      .filter((_, i) => i % Math.max(1, Math.floor(coords.length / 80)) === 0)
      .map(c => ({ lat: c[1], lng: c[0] })),
    waypoints: []
  };

  routeCache.set(cacheKey, { data: result, timestamp: Date.now() });
  res.json(result);
});

// ─── GET /api/routing/weather ─────────────────────────────────────────────────
// Uses Open-Meteo (100% free, no API key required, GDPR compliant)
// Returns current conditions at a highway midpoint for the map HUD
router.get('/weather', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  const cacheKey = `weather_${parseFloat(lat).toFixed(2)}_${parseFloat(lng).toFixed(2)}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_CACHE_TTL) {
    return res.json({ ...cached.data, cached: true });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode,windspeed_10m,precipitation&timezone=Asia%2FKolkata&forecast_days=1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    const data = await response.json();

    const current = data.current;
    const code = current?.weathercode ?? 0;

    // WMO weather code → simple label and emoji
    const weatherLabel = (c) => {
      if (c === 0) return { label: 'Clear Sky', emoji: '☀️', roadCondition: 'Dry Grip' };
      if (c <= 3) return { label: 'Partly Cloudy', emoji: '⛅', roadCondition: 'Dry Grip' };
      if (c <= 49) return { label: 'Foggy', emoji: '🌫️', roadCondition: 'Low Visibility' };
      if (c <= 67) return { label: 'Rain', emoji: '🌧️', roadCondition: 'Wet Road' };
      if (c <= 77) return { label: 'Snow/Hail', emoji: '🌨️', roadCondition: 'Slippery' };
      if (c <= 82) return { label: 'Light Rain', emoji: '🌦️', roadCondition: 'Wet Road' };
      if (c <= 99) return { label: 'Thunderstorm', emoji: '⛈️', roadCondition: 'Storm Alert' };
      return { label: 'Clear', emoji: '☀️', roadCondition: 'Dry Grip' };
    };

    const { label, emoji, roadCondition } = weatherLabel(code);

    const result = {
      success: true,
      temperature: Math.round(current?.temperature_2m ?? 28),
      windspeed: Math.round(current?.windspeed_10m ?? 0),
      precipitation: current?.precipitation ?? 0,
      weathercode: code,
      label,
      emoji,
      roadCondition,
      displayText: `${emoji} ${Math.round(current?.temperature_2m ?? 28)}°C ${roadCondition}`
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);
  } catch (err) {
    // Return a safe default rather than error
    res.json({
      success: true,
      temperature: 28,
      windspeed: 12,
      precipitation: 0,
      weathercode: 0,
      label: 'Clear Sky',
      emoji: '☀️',
      roadCondition: 'Dry Grip',
      displayText: '☀️ 28°C Dry Grip',
      fallback: true
    });
  }
});

// ─── GET /api/routing/geocode ─────────────────────────────────────────────────
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query q is required' });

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', India')}&format=json&limit=3`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'DriveIT-App/2.0 (driveit.in)' },
      signal: AbortSignal.timeout(5000)
    });
    const results = await response.json();

    const locations = results.map(r => ({
      name: r.display_name,
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      type: r.type
    }));

    res.json({ success: true, locations });
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', details: err.message });
  }
});

export default router;
