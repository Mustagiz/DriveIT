import express from 'express';

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const INDIA_BBOX = '68.1,6.4,97.4,35.5';

// Major Indian Transit Hub Centers for Proximity Biasing
const CORRIDOR_BIAS_CENTERS = {
  mumbai_pune: { lat: 18.7500, lng: 73.4000 },
  bengaluru_chennai: { lat: 12.9716, lng: 79.1500 },
  delhi_jaipur: { lat: 27.5000, lng: 76.5000 },
  hyderabad_vijayawada: { lat: 16.8000, lng: 79.8000 }
};

/**
 * Enhanced OpenStreetMap / Photon geocoder with landmark & highway corridor normalization
 */
async function fallbackOsmGeocode(q, biasCenter = null) {
  try {
    const cleanQuery = q.trim();
    const latBias = biasCenter?.lat || 20.5937;
    const lonBias = biasCenter?.lng || 78.9629;

    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=15&lang=en&lat=${latBias}&lon=${lonBias}&bbox=${INDIA_BBOX}`;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&countrycodes=in&limit=8&addressdetails=1`;

    const [photonRes, nominatimRes] = await Promise.allSettled([
      fetch(photonUrl, { headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/3.1' }, signal: AbortSignal.timeout(4000) }),
      fetch(nominatimUrl, { headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/3.1' }, signal: AbortSignal.timeout(4000) })
    ]);

    const results = [];
    const seen = new Set();

    if (photonRes.status === 'fulfilled' && photonRes.value.ok) {
      const data = await photonRes.value.json();
      if (data?.features) {
        for (const f of data.features) {
          const cc = (f.properties?.countrycode || '').toUpperCase();
          const country = (f.properties?.country || '').toLowerCase();
          if (cc !== 'IN' && country !== 'india') continue;

          const p = f.properties;
          const primary = p.name || p.street || p.city || p.state || cleanQuery;
          const secondary = [
            p.housenumber ? `${p.housenumber} ${p.street || ''}`.trim() : p.street,
            p.suburb || p.district || p.locality,
            p.city || p.town || p.village,
            p.state, p.postcode, 'India'
          ].filter(Boolean).join(', ').replace(/,\s*,/g, ',').trim();

          const key = `${primary.toLowerCase()}-${Math.round(f.geometry.coordinates[1] * 100)}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              primary,
              secondary,
              city: p.city || p.town || p.village || p.state || 'India',
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
            });
          }
        }
      }
    }

    if (nominatimRes.status === 'fulfilled' && nominatimRes.value.ok) {
      const data = await nominatimRes.value.json();
      if (Array.isArray(data)) {
        for (const item of data) {
          const parts = item.display_name.split(',');
          const primary = parts[0].trim();
          const secondary = parts.slice(1, 5).join(', ').trim();
          const key = `${primary.toLowerCase()}-${Math.round(parseFloat(item.lat) * 100)}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push({
              primary,
              secondary,
              city: item.address?.city || item.address?.town || item.address?.village || item.address?.state || 'India',
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            });
          }
        }
      }
    }

    return results.slice(0, 8);
  } catch (err) {
    console.error('[Geocode] Fallback error:', err.message);
    return [];
  }
}

// ─── 1. Forward Geocoding Autocomplete ────────────────────────────────────────
router.get('/', async (req, res) => {
  const { q, sessionToken, corridor } = req.query;
  if (!q || !q.trim()) return res.json([]);

  const biasCenter = CORRIDOR_BIAS_CENTERS[corridor] || null;

  try {
    if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'your_google_api_key_here') {
      const payload = {
        input: q.trim(),
        includedRegionCodes: ['in'],
        languageCode: 'en'
      };

      if (sessionToken) {
        payload.sessionToken = sessionToken;
      }

      if (biasCenter) {
        payload.locationBias = {
          circle: {
            center: { latitude: biasCenter.lat, longitude: biasCenter.lng },
            radius: 80000.0 // 80km corridor bias
          }
        };
      }

      const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.suggestions?.length) {
          const results = data.suggestions.slice(0, 8).map(s => {
            const p = s.placePrediction;
            const main = p.structuredFormat?.mainText?.text || p.text?.text?.split(',')[0] || q.trim();
            const secondary = p.structuredFormat?.secondaryText?.text || p.text?.text?.split(',').slice(1).join(', ').trim() || '';
            return {
              primary: main,
              secondary,
              city: secondary.split(',')[0]?.trim() || 'India',
              place_id: p.placeId,
              lat: 0,
              lng: 0,
            };
          });
          return res.json(results);
        }
      }
    }

    // Fallback: OSM / Photon geocoding with India bias
    const fallbackResults = await fallbackOsmGeocode(q, biasCenter);
    res.json(fallbackResults);
  } catch (err) {
    const fallbackResults = await fallbackOsmGeocode(q, biasCenter);
    res.json(fallbackResults);
  }
});

// ─── 2. Resolve Place ID to Exact Lat/Lng Coordinates ─────────────────────────
router.get('/resolve', async (req, res) => {
  const { place_id, sessionToken } = req.query;
  if (!place_id) return res.json({});

  try {
    if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'your_google_api_key_here') {
      const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(place_id)}?fields=location,displayName,formattedAddress${sessionToken ? `&sessionToken=${sessionToken}` : ''}`;
      const response = await fetch(url, {
        headers: {
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(4000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.location) {
          return res.json({
            lat: data.location.latitude,
            lng: data.location.longitude,
            name: data.displayName?.text || '',
            address: data.formattedAddress || '',
          });
        }
      }
    }

    res.json({});
  } catch (err) {
    res.status(500).json({});
  }
});

// ─── 3. Reverse Geocoding (Coordinates ➔ Exact Street / Milestone Address) ────
router.get('/reverse', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);

  try {
    // 1. Try Google Geocoding API if key is present
    if (GOOGLE_API_KEY && GOOGLE_API_KEY !== 'your_google_api_key_here') {
      const gUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${numLat},${numLng}&key=${GOOGLE_API_KEY}`;
      const gRes = await fetch(gUrl, { signal: AbortSignal.timeout(4000) });
      if (gRes.ok) {
        const gData = await gRes.json();
        if (gData.results?.length > 0) {
          const topResult = gData.results[0];
          return res.json({
            success: true,
            formattedAddress: topResult.formatted_address,
            primary: topResult.address_components?.[0]?.long_name || 'Selected Location',
            city: topResult.address_components?.find(c => c.types.includes('locality'))?.long_name || 'India',
            lat: numLat,
            lng: numLng
          });
        }
      }
    }

    // 2. Fallback: OpenStreetMap Nominatim Reverse Geocoding
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${numLat}&lon=${numLng}&zoom=18&addressdetails=1`;
    const osmRes = await fetch(osmUrl, {
      headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/3.1' },
      signal: AbortSignal.timeout(4000)
    });

    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const primary = addr.amenity || addr.building || addr.road || addr.suburb || osmData.name || 'Selected Location';
      return res.json({
        success: true,
        formattedAddress: osmData.display_name,
        primary,
        city: addr.city || addr.town || addr.village || addr.state || 'India',
        lat: numLat,
        lng: numLng
      });
    }

    res.json({
      success: true,
      formattedAddress: `Lat: ${numLat.toFixed(4)}, Lng: ${numLng.toFixed(4)}`,
      primary: 'Pinned Highway Location',
      lat: numLat,
      lng: numLng
    });
  } catch (err) {
    res.json({
      success: true,
      formattedAddress: `Location (${numLat.toFixed(4)}, ${numLng.toFixed(4)})`,
      primary: 'Pinned Location',
      lat: numLat,
      lng: numLng
    });
  }
});

// ─── 4. Highway Snap-to-Road Nearest Snapping ──────────────────────────────────
router.get('/snap-to-road', async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  try {
    const osrmUrl = `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`;
    const osrmRes = await fetch(osrmUrl, { signal: AbortSignal.timeout(3500) });
    if (osrmRes.ok) {
      const data = await osrmRes.json();
      if (data.waypoints?.length > 0) {
        const wp = data.waypoints[0];
        return res.json({
          success: true,
          snappedLat: wp.location[1],
          snappedLng: wp.location[0],
          roadName: wp.name || 'Highway Corridor'
        });
      }
    }
    res.json({ success: true, snappedLat: parseFloat(lat), snappedLng: parseFloat(lng), roadName: 'Standard Route' });
  } catch (err) {
    res.json({ success: true, snappedLat: parseFloat(lat), snappedLng: parseFloat(lng), roadName: 'Standard Route' });
  }
});

export default router;
