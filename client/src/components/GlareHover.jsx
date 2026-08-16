import React, { useRef, useState } from 'react';
import styles from './GlareHover.module.css';

export default function GlareHover({ children, className = '', glareColor = 'rgba(255, 255, 255, 0.2)' }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`${styles.glareHover} ${className}`}
    >
      <div
        className={styles.glare}
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, ${glareColor}, transparent 50%)`
        }}
      />
      {children}
    </div>
  );
}
