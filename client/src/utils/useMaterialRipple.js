import { useCallback } from 'react';
import { Haptics } from './haptics';

/**
 * Hook to trigger Android Material Design Ink Ripple on click/tap
 */
export function useMaterialRipple() {
  const triggerRipple = useCallback((e, withHaptic = true) => {
    if (withHaptic) {
      Haptics.selection();
    }
    const target = e.currentTarget;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = Math.max(rect.width, rect.height);
    const radius = diameter / 2;

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + radius);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + radius);

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${clientX - rect.left - radius}px`;
    circle.style.top = `${clientY - rect.top - radius}px`;
    circle.classList.add('md-ripple-ink');

    const existingRipple = target.getElementsByClassName('md-ripple-ink')[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    target.appendChild(circle);

    setTimeout(() => {
      if (circle && circle.parentNode === target) {
        circle.remove();
      }
    }, 500);
  }, []);

  return triggerRipple;
}

export default useMaterialRipple;
