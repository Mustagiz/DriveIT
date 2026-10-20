import React from 'react';
import styles from './BlaBlaCarHeroSection.module.css';

export default function BlaBlaCarHeroSection({ children }) {
  return (
    <section className={styles.heroSection} aria-label="Hero Section">
      {/* High-res authentic scenic road trip travel banner */}
      <div className={styles.bannerImageWrapper}>
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1600"
          alt="Road trip carpooling"
          className={styles.bannerImg}
        />
        <div className={styles.bannerOverlay} />
        <div className={styles.heroTextContainer}>
          <h1 className={styles.heroTitle}>Your pick of rides at low prices</h1>
          <p className={styles.heroSubtitle}>
            Carpool with verified pilots across India’s major highway corridors.
          </p>
        </div>
      </div>

      {/* Floating Search Capsule Container */}
      <div className={styles.searchConsoleWrapper}>
        {children}
      </div>
    </section>
  );
}
