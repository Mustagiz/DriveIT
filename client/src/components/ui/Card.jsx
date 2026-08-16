import React from 'react';
import styles from './Card.module.css';

export const Card = ({ children, elevated, interactive, className = '', ...props }) => {
  const classNames = [
    styles.card,
    elevated ? styles.cardElevated : '',
    interactive ? styles.cardInteractive : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`${styles.cardHeader} ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`${styles.cardBody} ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`${styles.cardFooter} ${className}`}>{children}</div>
);

export default Card;
