import React from 'react';
import styles from './Skeleton.module.css';

export const Skeleton = ({ variant = 'text', size = 'md', className = '' }) => {
  const classNames = [styles.skeleton, styles[variant], styles[size], className].filter(Boolean).join(' ');
  return <div className={classNames} />;
};

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} variant="text" size="md" className={i === lines - 1 ? styles.paragraphShort : ''} />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div style={{
    background: 'var(--color-bg-surface)',
    borderRadius: 'var(--radius-2xl)',
    padding: 'var(--space-6)',
    border: '1px solid var(--color-border)'
  }}>
    <Skeleton variant="rectangle" size="lg" className={styles.rectangle} style={{ height: 160, marginBottom: 'var(--space-4)' }} />
    <Skeleton variant="text" size="lg" className={styles.title} />
    <Skeleton variant="text" size="md" className={styles.paragraph} />
    <Skeleton variant="text" size="md" className={styles.paragraphShort} />
  </div>
);

export default Skeleton;
