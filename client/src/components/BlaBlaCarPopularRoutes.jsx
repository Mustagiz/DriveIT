import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import styles from './BlaBlaCarPopularRoutes.module.css';

const POPULAR_ROUTES = [
  { from: 'New Delhi', to: 'Chandigarh', price: '₹450' },
  { from: 'Mumbai', to: 'Pune', price: '₹350' },
  { from: 'Bengaluru', to: 'Chennai', price: '₹400' },
  { from: 'Pune', to: 'Mumbai', price: '₹350' },
  { from: 'Delhi', to: 'Jaipur', price: '₹420' },
  { from: 'Bengaluru', to: 'Mysuru', price: '₹300' }
];

export default function BlaBlaCarPopularRoutes({ onSelectRoute }) {
  return (
    <section className={styles.section} aria-label="Popular Carpool Rides">
      <h2 className={styles.heading}>Where do you want to go?</h2>
      <div className={styles.grid}>
        {POPULAR_ROUTES.map((route, idx) => (
          <button
            key={idx}
            type="button"
            className={styles.routeCard}
            onClick={() => onSelectRoute && onSelectRoute(route.from, route.to)}
          >
            <div className={styles.routeTitle}>
              <span>{route.from}</span>
              <ArrowRight size={14} className={styles.arrow} />
              <span>{route.to}</span>
            </div>
            <div className={styles.priceRow}>
              <span className={styles.priceText}>{route.price}</span>
              <ChevronRight size={16} className={styles.chevron} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
