import express from 'express';

const router = express.Router();

const GOOGLE_API_KEY = 'AIzaSyD-Ptzpw8j8Rd3Oe8r6OSzRsdqtOzrv0Rc';
const INDIA_BBOX = '68.1,6.4,97.4,35.5';

async function fallbackOsmGeocode(q) {
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=12&lang=en&lat=20.5937&lon=78.9629&bbox=${INDIA_BBOX}`;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q.trim())}&countrycodes=in&limit=6&addressdetails=1`;

    const [photonRes, nominatimRes] = await Promise.allSettled([
      fetch(photonUrl, { headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/2.0' }, signal: AbortSignal.timeout(4000) }),
      fetch(nominatimUrl, { headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/2.0' }, signal: AbortSignal.timeout(4000) })
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
          const primary = p.name || p.street || p.city || p.state || q.trim();
          const secondary = [
            p.housenumber ? `${p.housenumber} ${p.street || ''}`.trim() : p.street,
            p.suburb || p.district || p.locality,
            p.city || p.town || p.village,
            p.state, p.postcode, p.country
          ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

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
          const secondary = parts.slice(1, 6).join(',').trim();
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

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) return res.json([]);

  try {
    // 1. Try Google Places API (v1)
    const response = await fetch(
      'https://places.googleapis.com/v1/places:autocomplete',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
        },
        body: JSON.stringify({
          input: q.trim(),
          includedRegionCodes: ['in'],
          languageCode: 'en',
        }),
        signal: AbortSignal.timeout(4000)
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.suggestions?.length) {
        const results = data.suggestions.slice(0, 8).map(s => {
          const p = s.placePrediction;
          const main = p.structuredFormat?.mainText?.text || p.text?.text?.split(',')[0] || q.trim();
          const secondary = p.structuredFormat?.secondaryText?.text || p.text?.text?.split(',').slice(1).join(',').trim() || '';
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

    // 2. If Google returned 429 quota or 0 results, fall back seamlessly
    const fallbackResults = await fallbackOsmGeocode(q);
    res.json(fallbackResults);
  } catch (err) {
    const fallbackResults = await fallbackOsmGeocode(q);
    res.json(fallbackResults);
  }
});

router.get('/resolve', async (req, res) => {
  const { place_id } = req.query;
  if (!place_id) return res.json({});

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(place_id)}?fields=location,displayName,formattedAddress`,
      {
        headers: {
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(4000)
      }
    );

    if (!response.ok) return res.json({});

    const data = await response.json();
    if (!data.location) return res.json({});

    res.json({
      lat: data.location.latitude,
      lng: data.location.longitude,
      name: data.displayName?.text || '',
      address: data.formattedAddress || '',
    });
  } catch (err) {
    res.status(500).json({});
  }
});

export default router;
