import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import useMaterialRipple from '../../utils/useMaterialRipple';
import styles from './ResponsiveCardGrid.module.css';

export default function ResponsiveCardGrid({ items = [], onCardClick }) {
  const triggerRipple = useMaterialRipple();

  return (
    <div className={styles.gridContainer} role="region" aria-label="Responsive Cards Grid">
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className={`${styles.cardItem} md-ripple-container`}
          onClick={(e) => {
            triggerRipple(e);
            if (onCardClick) onCardClick(item);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onCardClick) onCardClick(item);
            }
          }}
        >
          <div>
            {/* Top Badge & Rating Row */}
            <div className={styles.cardHeader}>
              <span className={styles.badge}>
                {item.tag || (item.isElectric ? '⚡ EV' : 'FASTag')}
              </span>
              {item.rating && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#EAB308', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Star size={11} fill="#EAB308" color="#EAB308" />
                  {item.rating}
                </span>
              )}
            </div>

            {/* Title & Route (Truncated for 2-column safety) */}
            <h4 className={styles.cardTitle} title={item.title || `${item.from || item.origin} ➔ ${item.to || item.destination}`}>
              {item.title || `${item.from || item.origin} ➔ ${item.to || item.destination}`}
            </h4>
            
            <p className={styles.cardSubtitle}>
              {item.subtitle || `${item.time || item.departureTime || ''} • ${item.distance || 'Expressway'}`}
            </p>
          </div>

          {/* Bottom Price & CTA */}
          <div className={styles.cardFooter}>
            <span className={styles.cardPrice}>
              {item.fare || (item.price ? `₹${item.price}` : '')}
            </span>
            <button type="button" className={styles.actionButton}>
              <span>Book</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
