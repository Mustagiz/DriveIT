import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'https';

const GOOGLE_API_KEY = 'AIzaSyD-Ptzpw8j8Rd3Oe8r6OSzRsdqtOzrv0Rc';
const INDIA_BBOX = '68.1,6.4,97.4,35.5';

function httpsRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlString);
    const reqOptions = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || { 'User-Agent': 'DriveIt-Rideshare/2.0' },
    };

    const req = https.request(reqOptions, (apiRes) => {
      let body = '';
      apiRes.on('data', c => body += c);
      apiRes.on('end', () => {
        try { resolve({ status: apiRes.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: apiRes.statusCode, data: null }); }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });

    if (options.body) req.write(options.body);
    req.end();
  });
}

// Fallback OSM/Photon search when Google quota is exceeded
async function fallbackOsmGeocode(q) {
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q.trim())}&limit=12&lang=en&lat=20.5937&lon=78.9629&bbox=${INDIA_BBOX}`;
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q.trim())}&countrycodes=in&limit=6&addressdetails=1`;

    const [photonRes, nominatimRes] = await Promise.allSettled([
      httpsRequest(photonUrl),
      httpsRequest(nominatimUrl)
    ]);

    const results = [];
    const seen = new Set();

    if (photonRes.status === 'fulfilled' && photonRes.value?.data?.features) {
      for (const f of photonRes.value.data.features) {
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

    if (nominatimRes.status === 'fulfilled' && Array.isArray(nominatimRes.value?.data)) {
      for (const item of nominatimRes.value.data) {
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

    return results.slice(0, 8);
  } catch (err) {
    console.error('[Geocode] Fallback error:', err.message);
    return [];
  }
}

function geocodeProxyPlugin() {
  return {
    name: 'geocode-proxy',
    configureServer(server) {

      // Resolve place_id to lat/lng
      server.middlewares.use('/api/geocode/resolve', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        const urlParams = new URLSearchParams(req.url.replace(/^[^?]*\?/, ''));
        const place_id = urlParams.get('place_id');

        if (!place_id) { res.end('{}'); return; }

        try {
          const resp = await httpsRequest(
            `https://places.googleapis.com/v1/places/${encodeURIComponent(place_id)}?fields=location,displayName,formattedAddress`,
            { headers: { 'X-Goog-Api-Key': GOOGLE_API_KEY, 'Content-Type': 'application/json' } }
          );

          if (resp.data?.location) {
            res.end(JSON.stringify({
              lat: resp.data.location.latitude,
              lng: resp.data.location.longitude,
              name: resp.data.displayName?.text || '',
              address: resp.data.formattedAddress || '',
            }));
            return;
          }
          res.end('{}');
        } catch {
          res.end('{}');
        }
      });

      // Main Autocomplete Endpoint with automatic Google -> OSM fallback
      server.middlewares.use('/api/geocode', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        const urlParams = new URLSearchParams(req.url.replace(/^[^?]*\?/, ''));
        const q = urlParams.get('q');

        if (!q || !q.trim()) { res.end('[]'); return; }

        try {
          // 1. Try Google Places API first
          const body = JSON.stringify({
            input: q.trim(),
            includedRegionCodes: ['in'],
            languageCode: 'en',
          });

          const resp = await httpsRequest('https://places.googleapis.com/v1/places:autocomplete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_API_KEY,
              'Content-Length': Buffer.byteLength(body),
            },
            body,
          });

          // If Google succeeded with predictions
          if (resp.status === 200 && resp.data?.suggestions?.length) {
            const results = resp.data.suggestions.slice(0, 8).map(s => {
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
            res.end(JSON.stringify(results));
            return;
          }

          // 2. If Google is rate limited (429 / RESOURCE_EXHAUSTED) or returns 0 results, fall back seamlessly
          const fallbackResults = await fallbackOsmGeocode(q);
          res.end(JSON.stringify(fallbackResults));
        } catch (e) {
          console.error('[Geocode] Error, falling back to OSM:', e.message);
          const fallbackResults = await fallbackOsmGeocode(q);
          res.end(JSON.stringify(fallbackResults));
        }
      });

    }
  };
}

export default defineConfig({
  plugins: [react(), geocodeProxyPlugin()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true
      }
    }
  }
});
