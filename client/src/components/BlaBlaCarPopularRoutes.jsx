import React from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
import styles from './BlaBlaCarPopularRoutes.module.css';

const TOP_CARPOOL_RIDES = [
  { from: 'Gurgaon', to: 'Rohtak' },
  { from: 'Dadri', to: 'Gurgaon' },
  { from: 'Meerut', to: 'Ghaziabad' },
  { from: 'Mumbai', to: 'Pune' },
  { from: 'Bengaluru', to: 'Chennai' },
  { from: 'Delhi', to: 'Jaipur' }
];

export default function BlaBlaCarPopularRoutes({ onSelectRoute }) {
  return (
    <section className={styles.sectionWrapper} aria-label="Top carpool rides">
      <div className={styles.container}>
        <h2 className={styles.heading}>Top carpool rides</h2>
        <div className={styles.grid}>
          {TOP_CARPOOL_RIDES.map((route, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.routeCard}
              onClick={() => onSelectRoute && onSelectRoute(route.from, route.to)}
            >
              <div className={styles.routeText}>
                <span>{route.from}</span>
                <span className={styles.arrow}>→</span>
                <span>{route.to}</span>
              </div>
              <ChevronRight size={18} className={styles.chevron} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
