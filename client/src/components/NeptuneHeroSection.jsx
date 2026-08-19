import React from 'react';
import { 
  ArrowRight, 
  Car, 
  Compass, 
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import styles from './NeptuneHeroSection.module.css';

export default function NeptuneHeroSection({ onNavigate }) {
  const handleExploreClick = () => {
    if (onNavigate) {
      onNavigate('pilots');
    }
  };

  const handlePublishClick = () => {
    if (onNavigate) {
      onNavigate('post-ride');
    }
  };

  return (
    <section className={styles.heroWrapper} aria-label="Highway Rideshare Hero Section">
      {/* 2px Conic Laser Border Shell (Rotating Glowing Perimeter) */}
      <div className={styles.gradientShell}>
        <div className={styles.innerSurface}>
          {/* Animated Highway Matrix Grid */}
          <div className={styles.highwayGridBg} aria-hidden="true" />

          {/* Floating Ambient Lighting & Pulsing Orbs */}
          <div className={styles.ambientGlow} aria-hidden="true" />
          <div className={styles.ambientGlowLeft} aria-hidden="true" />

          {/* Left Floating Interactive Micro-Badge */}
          <div className={styles.floatingBadgeLeft}>
            <Zap size={15} color="#84CC16" />
            <span>Tata Nexon EV • 10% Off</span>
          </div>

          {/* Right Floating Interactive Micro-Badge */}
          <div className={styles.floatingBadgeRight}>
            <ShieldCheck size={15} color="#10B981" />
            <span>DigiLocker KYC Verified</span>
          </div>

          <div className={styles.heroContent}>
            {/* Live Telemetry Status Pill */}
            <div className={styles.heroBadge}>
              <span className={styles.pulseDot} aria-hidden="true" />
              <span>India’s Verified Highway Carpool Platform</span>
            </div>

            {/* Headline Hierarchy: display-lg (Geist 60px / Light 300) with Shimmering Gradient */}
            <h1 className={styles.heroTitle}>
              Seamless Highway Rideshare Across <span className={styles.heroHighlight}>India’s Corridors.</span>
            </h1>

            {/* Supporting Copy: body-md (Geist 18px / Regular 400) */}
            <p className={styles.heroSubtitle}>
              Connect with verified car owners heading your way on major expressways. 
              Split fuel and NHAI FASTag tolls with zero surge and guaranteed 4-digit OTP safety.
            </p>

            {/* CTA Group: Neptune Pill Buttons */}
            <div className={styles.ctaGroup}>
              <button 
                type="button" 
                className={styles.btnPrimaryPill}
                onClick={handleExploreClick}
              >
                <Compass size={18} />
                <span>Explore Verified Pilots</span>
                <ArrowRight size={18} />
              </button>

              <button 
                type="button" 
                className={styles.btnSecondaryPill}
                onClick={handlePublishClick}
              >
                <Car size={18} />
                <span>Publish Empty Seats</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
