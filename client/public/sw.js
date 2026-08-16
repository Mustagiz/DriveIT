/**
 * DriveIT Service Worker v3.0
 * Cache-first for static assets, network-first for API, background sync for offline
 */

const CACHE_NAME = 'driveit-v3.0';
const API_CACHE_NAME = 'driveit-api-v3.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

const API_BASE = 'http://localhost:5050/api';

// ─── Install: Cache static assets ────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: Clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch: Strategy routing ──────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and socket.io connections
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/socket.io')) return;

  // API: Network-first with cache fallback
  if (url.hostname === 'localhost' && url.port === '5050') {
    event.respondWith(networkFirstApi(event.request));
    return;
  }

  // Static: Cache-first
  event.respondWith(cacheFirstStatic(event.request));
});

async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      // Cache GET API responses for offline (excluding auth)
      if (!request.url.includes('/auth/')) {
        cache.put(request, response.clone());
      }
    }
    return response;
  } catch (err) {
    // Network failed — try cache
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Serving from cache:', request.url);
      return cached;
    }
    return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function cacheFirstStatic(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    throw err;
  }
}

// ─── Push Notifications ────────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: 'DriveIT', body: event.data.text() };
  }

  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: data.image || null,
    tag: data.tag || 'driveit-notification',
    data: { url: data.url || '/', rideId: data.rideId },
    vibrate: [200, 100, 200],
    actions: data.actions || [
      { action: 'view', title: '👁️ View', icon: '/icons/icon-72x72.png' },
      { action: 'dismiss', title: '✕ Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DriveIT', options)
  );
});

// ─── Notification click handler ────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) return clients.openWindow(url);
      })
  );
});

// ─── Background Sync (offline booking queue) ──────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'booking-sync') {
    event.waitUntil(processOfflineBookings());
  }
});

async function processOfflineBookings() {
  // This would read from IndexedDB and retry failed bookings
  console.log('[SW] Processing offline booking queue...');
}
