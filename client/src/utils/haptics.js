/**
 * Web Haptics Engine for Android Mobile Experiences
 * Wraps navigator.vibrate with standard Android tactile feedback patterns
 */
export const Haptics = {
  // Light tick for tab selection / toggle switches (8ms)
  selection: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch (e) {}
  },

  // Crisp click for primary action buttons & FABs (18ms)
  medium: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(18);
      }
    } catch (e) {}
  },

  // Double pulse for booking success & boarding pass verification
  success: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([12, 40, 18]);
      }
    } catch (e) {}
  },

  // Alert vibration pattern for warnings or errors
  error: () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30, 50, 40]);
      }
    } catch (e) {}
  }
};

export default Haptics;
