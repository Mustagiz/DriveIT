import React from 'react';
import styles from './EmptyState.module.css';

export const EmptyState = ({ icon: Icon, title, description, action, variant = 'default', className = '' }) => {
  return (
    <div className={`${styles.emptyState} ${styles[variant]} ${className}`}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={28} />
        </div>
      )}
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
