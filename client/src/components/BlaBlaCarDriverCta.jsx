import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import styles from './BlaBlaCarDriverCta.module.css';

export default function BlaBlaCarDriverCta({ onPublishClick }) {
  return (
    <section className={styles.section} aria-label="Publish a ride CTA">
      <div className={styles.container}>
        <div className={styles.textCol}>
          <span className={styles.eyebrow}>Pilot Community</span>
          <h2 className={styles.title}>Driving in your car soon?</h2>
          <p className={styles.description}>
            Good news: carpooling with DriveIT is simple, safe and helps you recover fuel and expressway FASTag toll expenses on your empty seats.
          </p>
          <div className={styles.perksList}>
            <div className={styles.perkItem}>
              <CheckCircle2 size={16} color="#00AFF5" />
              <span>Verified Aadhaar passengers only</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={16} color="#00AFF5" />
              <span>Automated toll & fuel cost sharing</span>
            </div>
            <div className={styles.perkItem}>
              <CheckCircle2 size={16} color="#00AFF5" />
              <span>Zero commercial commission charges</span>
            </div>
          </div>
          <button
            type="button"
            className={styles.ctaBtn}
            onClick={onPublishClick}
          >
            <span>Offer a ride</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className={styles.imageCol}>
          <img
            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600"
            alt="Offer a carpool ride"
            className={styles.driverImg}
          />
        </div>
      </div>
    </section>
  );
}
