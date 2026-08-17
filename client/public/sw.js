/**
 * DriveIT Service Worker v3.1
 * Network-first for navigation & API (instant updates), cache-first only for immutable versioned assets
 */

const CACHE_NAME = 'driveit-v3.1';
const API_CACHE_NAME = 'driveit-api-v3.1';

// ─── Install: Auto-activate new worker immediately ───────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ─── Activate: Purge all old caches and claim clients immediately ─────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== API_CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── Fetch Strategy ───────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and WebSocket connections
  if (event.request.method !== 'GET') return;
  if (url.pathname.includes('/socket.io')) return;

  // 1. Navigation (HTML): ALWAYS Network-First so users get latest deployed changes immediately
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }

  // 2. Backend API requests: Network-First with cache fallback
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirstApi(event.request));
    return;
  }

  // 3. Static Versioned Assets (/assets/): Stale-While-Revalidate
  event.respondWith(staleWhileRevalidate(event.request));
});

// Network-First for Navigation (HTML)
async function networkFirstNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match('/index.html');
    if (fallback) return fallback;
    throw err;
  }
}

// Network-First for API
async function networkFirstApi(request) {
  try {
    const response = await fetch(request);
    if (response.ok && !request.url.includes('/auth/')) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline mode active', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Stale-While-Revalidate for static assets
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cached);

  return cached || fetchPromise;
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
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    data: data.url || '/',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DriveIT Highway Update', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'close') return;

  const urlToOpen = event.notification.data || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
