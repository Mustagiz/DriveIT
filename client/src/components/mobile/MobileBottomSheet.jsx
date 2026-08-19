import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Haptics } from '../../utils/haptics';
import useMaterialRipple from '../../utils/useMaterialRipple';
import styles from './MobileBottomSheet.module.css';

export default function MobileBottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef(null);
  const triggerRipple = useMaterialRipple();

  // Android Back-Button Interception (Hardware & Gesture Back)
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ bottomSheetOpen: true }, '');
    const handlePopState = () => {
      if (onClose) onClose();
    };

    window.addEventListener('popstate', handlePopState, { once: true });
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Touch Gesture Listeners
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    // Only allow downward drag
    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > 120) {
      Haptics.selection();
      if (onClose) onClose();
    }
    setTranslateY(0);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div 
        ref={sheetRef}
        className={styles.bottomSheetContainer}
        style={{
          transform: translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 250ms cubic-bezier(0.32, 0.72, 0, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Drag Handle Bar */}
        <div className={styles.dragHandleRow}>
          <div className={styles.dragHandleBar} />
        </div>

        {/* Header */}
        <div className={styles.bottomSheetHeader}>
          <h3 className={styles.sheetTitle}>{title || 'Details'}</h3>
          <button 
            type="button" 
            className={`${styles.closeButton} md-ripple-container`}
            onClick={(e) => {
              triggerRipple(e);
              if (onClose) onClose();
            }}
            aria-label="Close sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sheet Content Body */}
        <div className={styles.bottomSheetBody}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
