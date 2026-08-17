import React, { useRef } from 'react';
import './SpotlightCard.css';

export default function SpotlightCard({ 
  children, 
  className = '', 
  spotlightColor = 'rgba(101, 163, 13, 0.12)',
  style = {},
  onClick
}) {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div 
      ref={divRef} 
      onMouseMove={handleMouseMove} 
      className={`card-spotlight ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
