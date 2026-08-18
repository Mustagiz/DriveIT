/**
 * DriveIT Native Device Bridge
 * Unifies Web, Android PWA, and Native Android / Capacitor / React Native capabilities.
 */

export const isNativeAndroid = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.Capacitor?.isNativePlatform() ||
    window.AndroidBridge ||
    window.matchMedia('(display-mode: standalone)').matches ||
    /Android/i.test(navigator.userAgent)
  );
};

/**
 * Android Hardware Back-Button & Modal Manager
 */
export const registerHardwareBackHandler = (onBackAction) => {
  if (typeof window === 'undefined') return () => {};

  const handlePopState = (event) => {
    if (onBackAction) {
      onBackAction(event);
    }
  };

  window.addEventListener('popstate', handlePopState);

  // If Capacitor App plugin is available
  if (window.Capacitor?.Plugins?.App) {
    const backListener = window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
      if (onBackAction) {
        onBackAction({ canGoBack });
      } else if (canGoBack) {
        window.history.back();
      }
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      backListener.then(handle => handle.remove?.());
    };
  }

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
};

/**
 * Native Haptic Feedback Trigger
 * @param {'light'|'medium'|'heavy'|'success'|'warning'|'error'} type 
 */
export const triggerHapticFeedback = (type = 'light') => {
  try {
    if (typeof window === 'undefined') return;

    // Capacitor Haptics
    if (window.Capacitor?.Plugins?.Haptics) {
      const Haptics = window.Capacitor.Plugins.Haptics;
      if (type === 'light') Haptics.impact({ style: 'LIGHT' });
      else if (type === 'medium') Haptics.impact({ style: 'MEDIUM' });
      else if (type === 'heavy') Haptics.impact({ style: 'HEAVY' });
      else if (type === 'success') Haptics.notification({ type: 'SUCCESS' });
      else if (type === 'warning') Haptics.notification({ type: 'WARNING' });
      else if (type === 'error') Haptics.notification({ type: 'ERROR' });
      return;
    }

    // Standard Web Navigator Vibration (Android Chrome / Webview)
    if ('vibrate' in navigator) {
      if (type === 'light') navigator.vibrate(15);
      else if (type === 'medium') navigator.vibrate(30);
      else if (type === 'heavy') navigator.vibrate(60);
      else if (type === 'success') navigator.vibrate([20, 40, 20]);
      else if (type === 'warning') navigator.vibrate([40, 30, 40]);
      else if (type === 'error') navigator.vibrate([50, 50, 50, 50, 50]);
    }
  } catch (e) {
    // Graceful silent fallback
  }
};

/**
 * Native Android System Share Sheet
 */
export const nativeShare = async ({ title, text, url }) => {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url: url || window.location.href });
      return { success: true };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share error:', err);
      }
    }
  }

  // Fallback: Clipboard copy
  try {
    if (navigator.clipboard && url) {
      await navigator.clipboard.writeText(url);
      return { success: true, copied: true };
    }
  } catch (e) {
    // pass
  }

  return { success: false };
};

/**
 * Accurate High-Precision GPS Locator for Corridor Pilot Flight Deck
 */
export const getHighPrecisionLocation = () => {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return reject(new Error('Geolocation not supported on this device'));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          speed: pos.coords.speed,
          heading: pos.coords.heading,
          timestamp: pos.timestamp
        });
      },
      (err) => reject(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      }
    );
  });
};
