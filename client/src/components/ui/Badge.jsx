import React from 'react';
import styles from './Badge.module.css';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
};

export default Badge;
