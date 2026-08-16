import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Logo({ size = 'md', showTagline = false, light }) {
  const { isDark } = useTheme?.() || { isDark: true };

  const sizes = {
    sm: { box: 30, font: '1.1rem', tag: '0.6rem' },
    md: { box: 38, font: '1.35rem', tag: '0.65rem' },
    lg: { box: 52, font: '1.85rem', tag: '0.78rem' },
    xl: { box: 64, font: '2.4rem', tag: '0.85rem' }
  };

  const dim = sizes[size] || sizes.md;

  // Determine text color based on active theme or explicit prop
  const effectiveIsDark = light !== undefined ? !light : isDark;
  const textColor = effectiveIsDark ? '#FFFFFF' : '#0F172A';
  const tagColor = 'var(--color-primary-500, #F59E0B)';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      userSelect: 'none'
    }}>
      {/* Amber Glowing Brand Icon */}
      <div style={{
        width: `${dim.box}px`,
        height: `${dim.box}px`,
        borderRadius: `${dim.box * 0.26}px`,
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)',
        position: 'relative',
        flexShrink: 0
      }}>
        <svg viewBox="0 0 100 100" width="72%" height="72%" style={{ overflow: 'visible' }}>
          <path 
            d="M 22 18 L 60 18 C 82 18, 92 30, 84 55 C 76 80, 58 84, 38 84 L 12 84 Z" 
            fill="#090D16" 
          />
          <polygon points="60,26 44,48 56,48 44,74 68,46 54,46" fill="#FFD000" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display, var(--font-heading))',
          fontSize: dim.font,
          fontWeight: 900,
          fontStyle: 'italic',
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: textColor,
          display: 'flex',
          alignItems: 'baseline'
        }}>
          <span style={{ color: textColor }}>Drive</span>
          <span style={{ position: 'relative' }}>
            <span style={{ color: textColor }}>i</span>
            <span style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '5px',
              height: '5px',
              borderRadius: 'var(--radius-full, 9999px)',
              background: '#F59E0B'
            }} />
          </span>
          <span style={{ color: textColor }}>t</span>
        </div>

        {showTagline && (
          <div style={{
            fontSize: dim.tag,
            color: tagColor,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ opacity: 0.7 }}>—</span>
            <span>Fast. Easy. Everyday</span>
            <span style={{ opacity: 0.7 }}>—</span>
          </div>
        )}
      </div>
    </div>
  );
}
