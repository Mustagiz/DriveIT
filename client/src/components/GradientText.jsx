import React, { useState } from 'react';
import styles from './GradientText.module.css';

export default function GradientText({ children, className = '', paused = false, direction = 'horizontal' }) {
  const [isPaused, setIsPaused] = useState(paused);

  const directionClass = direction === 'vertical' ? styles.vertical : direction === 'diagonal' ? styles.diagonal : '';

  return (
    <span
      className={`${styles.gradientText} ${directionClass} ${isPaused ? styles.gradientTextPaused : ''} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {children}
    </span>
  );
}
