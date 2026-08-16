import React from 'react';
import './StarBorder.css';

export default function StarBorder({
  as: Component = 'button',
  className = '',
  color = '#F59E0B',
  speed = '6s',
  thickness = 1,
  children,
  ...props
}) {
  return (
    <Component className={`star-border-container ${className}`} {...props}>
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
}
