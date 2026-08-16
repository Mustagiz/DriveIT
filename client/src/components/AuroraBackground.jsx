import React from 'react';
import styles from './AuroraBackground.module.css';

export default function AuroraBackground({ children, className = '', style = {} }) {
  return (
    <div className={`${styles.auroraBackground} ${className}`} style={style}>
      {children}
    </div>
  );
}
