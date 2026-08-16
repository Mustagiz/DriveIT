import React, { useState } from 'react';
import styles from './ShinyText.module.css';

export default function ShinyText({ text, className = '', paused = false }) {
  const [isPaused, setIsPaused] = useState(paused);

  return (
    <span
      className={`${styles.shinyText} ${isPaused ? styles.shinyTextPaused : ''} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {text}
    </span>
  );
}
