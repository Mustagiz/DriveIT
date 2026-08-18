/**
 * Push Notifications Utility for DriveIT
 * Handles permission, subscription, and service worker registration
 */

const SW_URL = '/sw.js';
const API_BASE = typeof window !== 'undefined' ? (window.location.origin.includes('localhost') ? 'http://localhost:5050' : '') : '';

// VAPID public key — replace with real key from server in production
// Generate with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// ─── Register Service Worker ─────────────────────────────────────────────────
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_URL, { scope: '/' });
    console.log('[SW] Registered:', registration.scope);
    return registration;
  } catch (err) {
    console.error('[SW] Registration failed:', err);
    return null;
  }
}

// ─── Request Push Permission & Subscribe ──────────────────────────────────────
export async function subscribeToNotifications(token) {
  if (!('Notification' in window)) return { success: false, reason: 'not-supported' };

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    return { success: false, reason: 'permission-denied' };
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }

    // Send subscription to server (if in production)
    if (token) {
      try {
        await fetch(`${API_BASE}/api/notifications/subscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ subscription })
        });
      } catch {
        // Server endpoint might not exist yet — not critical
      }
    }

    console.log('[Push] Subscribed successfully');
    return { success: true, subscription };

  } catch (err) {
    console.error('[Push] Subscription failed:', err);
    return { success: false, reason: err.message };
  }
}

// ─── Unsubscribe from Push ────────────────────────────────────────────────────
export async function unsubscribeFromNotifications() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return { success: true };
    }
    return { success: true, already: true };
  } catch (err) {
    console.error('[Push] Unsubscribe failed:', err);
    return { success: false, reason: err.message };
  }
}

// ─── Show Local Notification (in-app) ────────────────────────────────────────
export function showLocalNotification(title, body, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, {
      body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: options.tag || 'driveit',
      data: options.data || {},
      vibrate: [200, 100, 200],
      ...options
    });
  });
}

// ─── Notification Templates ────────────────────────────────────────────────────
export const NotificationTemplates = {
  bookingConfirmed: (bookingRef, origin, dest) => ({
    title: '✅ Booking Confirmed!',
    body: `${origin} → ${dest} | Ref: ${bookingRef}`,
    tag: 'booking-confirmed',
    data: { url: '/booker/dashboard' }
  }),

  rideDepart30Min: (pilotName, origin) => ({
    title: '🚗 Ride in 30 minutes!',
    body: `${pilotName} departs from ${origin} soon. Be ready!`,
    tag: 'departure-reminder',
    data: { url: '/booker/dashboard' }
  }),

  newPassengerBooked: (passengerName, seatsBooked) => ({
    title: '🎉 New Passenger!',
    body: `${passengerName} booked ${seatsBooked} seat${seatsBooked > 1 ? 's' : ''} on your ride`,
    tag: 'new-booking',
    data: { url: '/lister/dashboard' }
  }),

  sosAlert: (location) => ({
    title: '🚨 SOS ALERT!',
    body: `Emergency reported near ${location}. Tap to view.`,
    tag: 'sos-alert',
    data: { url: '/admin' }
  }),

  paymentSuccess: (amount) => ({
    title: '💰 Payment Successful',
    body: `₹${amount} paid & held in escrow safely`,
    tag: 'payment-success',
    data: { url: '/booker/dashboard' }
  })
};

// ─── Check push subscription status ──────────────────────────────────────────
export async function getPushSubscriptionStatus() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) {
    return { supported: false };
  }

  const permission = Notification.permission;
  const registration = await navigator.serviceWorker.ready.catch(() => null);
  if (!registration) return { supported: true, permission, subscribed: false };

  const subscription = await registration.pushManager.getSubscription();
  return {
    supported: true,
    permission,
    subscribed: !!subscription
  };
}
