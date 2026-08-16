import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import styles from './AdBannerCarousel.module.css';

// 4 Customizable Ad / Promo Banners
export const DEFAULT_ADS = [
  {
    id: 'ad_1',
    badge: 'EXCLUSIVE EV PROMO',
    badgeColor: '#10B981',
    title: 'Drive Green, Save ₹150 Flat',
    subtitle: 'Book your first Tata Nexon EV or MG ZS carpool across Mumbai-Pune or Bengaluru-Chennai expressway.',
    ctaText: 'Claim Discount',
    ctaLink: '#',
    promoCode: 'EVSAVE150',
    image: 'https://images.unsplash.com/photo-1769711405945-e194b222452b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gradient: 'linear-gradient(135deg, rgba(6, 78, 59, 0.92) 0%, rgba(15, 23, 42, 0.95) 100%)'
  },
  {
    id: 'ad_2',
    badge: 'PARTNER PROGRAM',
    badgeColor: '#F59E0B',
    title: 'Earn up to ₹45,000 / Month with EV Carpool',
    subtitle: 'List your daily intercity empty seats. 100% UIDAI Aadhaar verified professionals only.',
    ctaText: 'Become a Partner',
    ctaLink: '#',
    promoCode: 'DRIVEPARTNER',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(135deg, rgba(120, 53, 15, 0.92) 0%, rgba(15, 23, 42, 0.95) 100%)'
  },
  {
    id: 'ad_3',
    badge: 'CORPORATE COMMUTER PASS',
    badgeColor: '#3B82F6',
    title: 'Unlimited Business Class Commutes',
    subtitle: 'Tax-exempt corporate travel invoices, premium sedan guarantee, and zero cancellation charges.',
    ctaText: 'Explore Corporate Pass',
    ctaLink: '#',
    promoCode: 'CORP2026',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.92) 0%, rgba(15, 23, 42, 0.95) 100%)'
  },
  {
    id: 'ad_4',
    badge: 'FASTAG & SAFETY SHIELD',
    badgeColor: '#8B5CF6',
    title: 'Zero Highway Toll Delays + ₹5L Trip Cover',
    subtitle: 'Every ride includes complimentary HDFC ERGO accidental insurance and automated FASTag expressway lane clearance.',
    ctaText: 'View Safety Details',
    ctaLink: '#',
    promoCode: 'SAFETYPLUS',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
    gradient: 'linear-gradient(135deg, rgba(88, 28, 135, 0.92) 0%, rgba(15, 23, 42, 0.95) 100%)'
  }
];

export default function AdBannerCarousel({ ads = DEFAULT_ADS, autoPlayInterval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, ads.length, autoPlayInterval]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % ads.length);
  };

  const currentAd = ads[currentIndex];

  return (
    <div 
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {ads.map((ad, idx) => (
        <div
          key={ad.id}
          className={`${styles.slide} ${idx === currentIndex ? styles.slideActive : ''}`}
          style={{
            backgroundImage: `url(${ad.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {/* Rich Gradient Scrim Overlay */}
          <div 
            className={styles.gradientOverlay} 
            style={{ background: ad.gradient }}
          />

          <div className={styles.slideContent}>
            {/* Top Badge */}
            <div className={styles.badgeWrapper}>
              <span className={styles.badge} style={{ borderColor: ad.badgeColor, color: ad.badgeColor }}>
                <Sparkles size={12} />
                <span>{ad.badge}</span>
              </span>
              {ad.promoCode && (
                <span className={styles.promoPill}>
                  <Tag size={11} />
                  <span>CODE: <strong>{ad.promoCode}</strong></span>
                </span>
              )}
            </div>

            {/* Title & Subtitle */}
            <h2 className={styles.title}>{ad.title}</h2>
            <p className={styles.subtitle}>{ad.subtitle}</p>

            {/* CTA Button */}
            <div className={styles.ctaRow}>
              <button 
                type="button"
                onClick={() => alert(`Activated promo: ${ad.promoCode || ad.title}`)}
                className={styles.ctaBtn}
              >
                <span>{ad.ctaText}</span>
                <ArrowRight size={14} />
              </button>
              <span className={styles.sponsorNotice}>Sponsored Partner Ad • 2026</span>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        type="button" 
        onClick={handlePrev} 
        className={`${styles.navBtn} ${styles.prevBtn}`}
        aria-label="Previous Ad Banner"
      >
        <ChevronLeft size={20} />
      </button>

      <button 
        type="button" 
        onClick={handleNext} 
        className={`${styles.navBtn} ${styles.nextBtn}`}
        aria-label="Next Ad Banner"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Indicator Dots */}
      <div className={styles.dotsRow}>
        {ads.map((ad, idx) => (
          <button
            key={ad.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
