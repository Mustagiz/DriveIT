import { useState, useRef, useCallback, useEffect } from 'react';
import { Haptics } from './haptics';

/**
 * Android Physics-Based Pull-to-Refresh Hook
 */
export function usePullToRefresh(onRefresh) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handleTouchStart = useCallback((e) => {
    if (typeof window === 'undefined') return;
    if (window.scrollY <= 5 && !refreshing) {
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    }
  }, [refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current || refreshing) return;
    const currentY = e.touches[0].clientY;
    const delta = currentY - startY.current;

    if (delta > 0 && window.scrollY <= 5) {
      // Apply elastic drag resistance
      const distance = Math.min(85, delta * 0.42);
      setPullDistance(distance);
      if (distance >= 65 && pullDistance < 65) {
        Haptics.selection();
      }
    }
  }, [refreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= 65 && typeof onRefresh === 'function') {
      Haptics.medium();
      setRefreshing(true);
      setPullDistance(48); // Snap to loading spinner height
      try {
        await onRefresh();
      } catch (err) {
        console.warn('Pull-to-refresh error:', err);
      } finally {
        setTimeout(() => {
          setRefreshing(false);
          setPullDistance(0);
        }, 400);
      }
    } else {
      setPullDistance(0);
    }
    startY.current = 0;
  }, [pullDistance, onRefresh]);

  return {
    pullDistance,
    refreshing,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}

export default usePullToRefresh;
