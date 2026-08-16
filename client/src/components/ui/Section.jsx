import React from 'react';
import styles from './Section.module.css';

export const Section = ({ title, description, action, children, className = '' }) => {
  return (
    <section className={`${styles.section} ${className}`}>
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h2 className={styles.title}>{title}</h2>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export const Divider = ({ className = '' }) => (
  <hr className={`${styles.divider} ${className}`} />
);

export default Section;
