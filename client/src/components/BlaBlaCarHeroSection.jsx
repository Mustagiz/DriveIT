import React from 'react';
import styles from './BlaBlaCarHeroSection.module.css';

export default function BlaBlaCarHeroSection({ children }) {
  return (
    <section className={styles.heroSection} aria-label="BlaBlaCar Hero">
      <div className={styles.heroSplit}>
        {/* Left Headline */}
        <div className={styles.headlineWrapper}>
          <h1 className={styles.heroHeadline}>
            Travel anywhere together. Spend smarter.
          </h1>
        </div>

        {/* Right Photo */}
        <div className={styles.imageWrapper}>
          <img
            src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=1200"
            alt="Travel anywhere together in carpool"
            className={styles.heroPhoto}
          />
        </div>
      </div>

      {/* Floating Search Bar with Blue Capsule Border */}
      <div className={styles.searchConsoleWrapper}>
        {children}
      </div>
    </section>
  );
}
