import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

// Cache routes in memory (origin-dest keyed)
const routeCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ─── Get Route between two coordinate pairs ──────────────────────────────────
// Query: ?olat=18.9388&olng=72.8354&dlat=18.5204&dlng=73.8567
router.get('/route', async (req, res) => {
  try {
    const { olat, olng, dlat, dlng, overview = 'full', steps = false } = req.query;

    if (!olat || !olng || !dlat || !dlng) {
      return res.status(400).json({
        error: 'Required: olat, olng, dlat, dlng (origin and destination coordinates)'
      });
    }

    const cacheKey = `${olat},${olng}-${dlat},${dlng}`;
    const cached = routeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ ...cached.data, cached: true });
    }

    const url = `${OSRM_BASE}/${olng},${olat};${dlng},${dlat}?overview=${overview}&geometries=geojson&steps=${steps}`;
    const response = await fetch(url, { timeout: 8000 });

    if (!response.ok) throw new Error(`OSRM API error: ${response.status}`);

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(404).json({ error: 'No route found between these coordinates' });
    }

    const route = data.routes[0];
    const distanceKm = Math.round(route.distance / 1000 * 10) / 10;
    const durationMins = Math.round(route.duration / 60);

    // Extract waypoints along the route (every ~20km)
    const geometry = route.geometry;
    const coordinates = geometry.coordinates;
    const result = {
      success: true,
      distanceKm,
      durationMins,
      durationHours: Math.round(durationMins / 60 * 10) / 10,
      geometry, // Full GeoJSON LineString for Leaflet
      waypoints: data.waypoints.map(w => ({
        lat: w.location[1],
        lng: w.location[0],
        name: w.name || ''
      })),
      // Simplified route coords for animation (every 10th point)
      animationCoords: coordinates
        .filter((_, i) => i % Math.max(1, Math.floor(coordinates.length / 50)) === 0)
        .map(c => ({ lat: c[1], lng: c[0] })),
      legs: route.legs?.map(leg => ({
        distance: Math.round(leg.distance / 1000 * 10) / 10,
        duration: Math.round(leg.duration / 60)
      }))
    };

    routeCache.set(cacheKey, { data: result, timestamp: Date.now() });
    res.json(result);

  } catch (err) {
    console.error('Routing error:', err.message);

    // Fallback: return straight-line distance estimate
    const { olat, olng, dlat, dlng } = req.query;
    if (olat && dlat) {
      const R = 6371;
      const dLat = (Number(dlat) - Number(olat)) * Math.PI / 180;
      const dLng = (Number(dlng) - Number(olng)) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(Number(olat) * Math.PI / 180) * Math.cos(Number(dlat) * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;
      const distanceKm = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

      return res.json({
        success: true,
        distanceKm,
        durationMins: Math.round(distanceKm * 1.4),  // ~70km/h highway estimate
        durationHours: Math.round(distanceKm * 1.4 / 60 * 10) / 10,
        geometry: {
          type: 'LineString',
          coordinates: [[Number(olng), Number(olat)], [Number(dlng), Number(dlat)]]
        },
        animationCoords: [
          { lat: Number(olat), lng: Number(olng) },
          { lat: Number(dlat), lng: Number(dlng) }
        ],
        waypoints: [],
        fallback: true,
        error: 'OSRM unavailable, using straight-line estimate'
      });
    }

    res.status(500).json({ error: 'Routing service unavailable', details: err.message });
  }
});

// ─── Geocode city name to coordinates ────────────────────────────────────────
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query q is required' });

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', India')}&format=json&limit=3`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'DriveIT-App/2.0 (driveit.in)' },
      timeout: 5000
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
