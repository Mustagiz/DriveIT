/**
 * Web Push Notification Client Manager
 * Handles Service Worker registration and VAPID push subscriptions
 */

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPushNotifications(userId = null) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
    return { supported: false };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { supported: true, granted: false };
    }

    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Fetch public VAPID key
      const keyRes = await fetch('/api/push/vapid-key');
      if (!keyRes.ok) throw new Error('Failed to retrieve VAPID key');
      const { publicKey } = await keyRes.json();

      const convertedKey = urlBase64ToUint8Array(publicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey
      });
    }

    // Register subscription on backend
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId || localStorage.getItem('rideshare_user_id') || 'guest_user',
        subscription
      })
    });

    return { supported: true, granted: true, subscription };
  } catch (err) {
    console.warn('[Push Manager] Subscription notice:', err.message);
    return { supported: true, granted: false, error: err.message };
  }
}
