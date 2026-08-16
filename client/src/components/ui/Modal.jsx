import React from 'react';
import styles from './Modal.module.css';

export const Modal = ({ children, open, onClose, size = 'md', className = '' }) => {
  if (!open) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modalContent} ${styles[size]} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ children, onClose, className = '' }) => (
  <div className={`${styles.modalHeader} ${className}`}>
    <h3 className={styles.modalTitle}>{children}</h3>
    {onClose && (
      <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

export const ModalBody = ({ children, className = '' }) => (
  <div className={`${styles.modalBody} ${className}`}>{children}</div>
);

export const ModalFooter = ({ children, className = '' }) => (
  <div className={`${styles.modalFooter} ${className}`}>{children}</div>
);

export default Modal;
