import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Car, 
  Compass, 
  Zap,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Navigation,
  Sparkles,
  Lock,
  Wallet
} from 'lucide-react';
import styles from './NeptuneHeroSection.module.css';

const HERO_POINTS = [
  {
    id: 'corridor',
    tag: 'Highway Carpool',
    icon: <Navigation size={12} color="#15803D" />,
    text: 'Connect with verified car owners heading your way on major expressways. Split fuel and NHAI FASTag tolls with zero commercial surge.'
  },
  {
    id: 'green_ev',
    tag: '100% Green EV',
    icon: <Zap size={12} color="#84CC16" />,
    text: 'Cruise in Tata Nexon & MG ZS electric vehicles. Enjoy 10% instant green fare discounts and offset 25kg CO₂ on every single journey.'
  },
  {
    id: 'safety_kyc',
    tag: 'DigiLocker KYC',
    icon: <ShieldCheck size={12} color="#10B981" />,
    text: 'Travel with government UIDAI Aadhaar & Driving Licence verified pilots, guaranteed 4-digit boarding PINs, and 24/7 highway SOS telemetry.'
  },
  {
    id: 'fair_split',
    tag: 'Transparent Split',
    icon: <Wallet size={12} color="#38BDF8" />,
    text: 'Save up to ₹1,200 per intercity commute with direct driver settlements, automatic FASTag toll division, and zero hidden platform commissions.'
  },
  {
    id: 'live_radar',
    tag: 'Live Radar & Passes',
    icon: <Sparkles size={12} color="#F59E0B" />,
    text: 'Track real-time GPS vehicle coordinates on the expressway radar and board in seconds with dynamic encrypted QR boarding passes.'
  }
];

export default function NeptuneHeroSection({ onNavigate }) {
  const [activePointIndex, setActivePointIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setActivePointIndex((prev) => (prev + 1) % HERO_POINTS.length);
        setIsFading(false);
      }, 300);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    if (index === activePointIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActivePointIndex(index);
      setIsFading(false);
    }, 250);
  };

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

  const currentPoint = HERO_POINTS[activePointIndex];

  return (
    <section className={styles.heroWrapper} aria-label="Highway Rideshare Hero Section">
      {/* 2px Conic Laser Border Shell (Continuous Rotating Glowing Perimeter) */}
      <div className={styles.gradientShell}>
        <div className={styles.innerSurface}>
          {/* Animated Highway Matrix Grid */}
          <div className={styles.highwayGridBg} aria-hidden="true" />

          {/* Concentric GPS Radar Telemetry Pulse Rings */}
          <div className={styles.radarCenter} aria-hidden="true">
            <div className={styles.radarRing1} />
            <div className={styles.radarRing2} />
            <div className={styles.radarRing3} />
          </div>

          {/* Animated SVG Highway Corridor Vector Curve with Cruising Light Cruiser */}
          <svg className={styles.svgHighwayOverlay} viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="roadGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#84CC16" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="roadGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#84CC16" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <path 
              d="M-50,450 C300,520 450,180 850,220 C1050,240 1150,80 1250,50" 
              fill="none" 
              stroke="url(#roadGradient1)" 
              strokeWidth="2.5"
              className={styles.highwayRoadPath}
            />
            <path 
              d="M-50,150 C250,100 500,480 800,400 C1000,350 1100,500 1250,450" 
              fill="none" 
              stroke="url(#roadGradient2)" 
              strokeWidth="2"
              className={styles.highwayRoadPath}
            />
          </svg>

          {/* Shooting Speed-Streak Light Beams (Expressway Simulation) */}
          <div className={styles.speedStreak1} aria-hidden="true" />
          <div className={styles.speedStreak2} aria-hidden="true" />
          <div className={styles.speedStreak3} aria-hidden="true" />

          {/* Floating Particle Starlets */}
          <div className={styles.particle1} aria-hidden="true" />
          <div className={styles.particle2} aria-hidden="true" />
          <div className={styles.particle3} aria-hidden="true" />
          <div className={styles.particle4} aria-hidden="true" />
          <div className={styles.particle5} aria-hidden="true" />

          {/* Floating Ambient Lighting & Pulsing Orbs */}
          <div className={styles.ambientGlow} aria-hidden="true" />
          <div className={styles.ambientGlowLeft} aria-hidden="true" />

          {/* Left Floating Interactive Micro-Badges */}
          <div className={styles.floatingBadgeLeftTop}>
            <Zap size={14} color="#84CC16" />
            <span>Tata Nexon EV • 10% Off</span>
          </div>
          <div className={styles.floatingBadgeLeftBottom}>
            <Navigation size={14} color="#38BDF8" />
            <span>Mumbai ➔ Pune • 42 Live Rides</span>
          </div>

          {/* Right Floating Interactive Micro-Badges */}
          <div className={styles.floatingBadgeRightTop}>
            <ShieldCheck size={14} color="#10B981" />
            <span>DigiLocker KYC Verified</span>
          </div>
          <div className={styles.floatingBadgeRightBottom}>
            <Leaf size={14} color="#84CC16" />
            <span>1,420 kg CO₂ Saved Today</span>
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

            {/* Animated Fade Subtitle Rotating Points */}
            <div className={styles.subtitleContainer}>
              <div className={isFading ? styles.fadeAnimationOut : styles.fadeAnimationIn}>
                <span className={styles.subtitlePillTag}>
                  {currentPoint.icon}
                  <span>{currentPoint.tag}</span>
                </span>
                <p className={styles.heroSubtitle}>
                  {currentPoint.text}
                </p>
              </div>

              {/* Interactive Navigation Dots */}
              <div className={styles.subtitleDots} role="tablist" aria-label="Hero value proposition slider">
                {HERO_POINTS.map((pt, idx) => (
                  <button
                    key={pt.id}
                    type="button"
                    role="tab"
                    aria-selected={idx === activePointIndex}
                    title={pt.tag}
                    aria-label={`Slide ${idx + 1}: ${pt.tag}`}
                    className={idx === activePointIndex ? styles.subtitleDotActive : styles.subtitleDot}
                    onClick={() => handleDotClick(idx)}
                  />
                ))}
              </div>
            </div>

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
