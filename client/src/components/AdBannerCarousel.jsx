import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Tag, 
  ArrowRight, 
  Leaf, 
  Check, 
  Copy, 
  Play, 
  Pause, 
  TrendingUp, 
  Compass, 
  CreditCard,
  Percent,
  Clock,
  Car
} from 'lucide-react';
import { useToast } from './Toast';
import styles from './AdBannerCarousel.module.css';

export const ADS_DATA = [
  {
    id: 'ad_ev_green',
    badge: '🌿 100% ZERO-EMISSION COMMUTE',
    badgeColor: '#10B981',
    themeColor: '#10B981',
    title: 'Ride Green. Save ₹150 Flat + 25kg CO₂',
    subtitle: 'Certified Tata Nexon EV & MG ZS rides across Mumbai-Pune & Delhi-Jaipur. Smooth highway cruise, zero emissions.',
    promoCode: 'EVSAVE150',
    type: 'eco_calculator',
    defaultDistance: 148,
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1600',
    gradient: 'linear-gradient(135deg, rgba(4, 47, 46, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%)',
    ctaText: 'Quick Book Mumbai → Pune',
    presetFrom: 'Mumbai, Maharashtra, India',
    presetTo: 'Pune, Maharashtra, India'
  },
  {
    id: 'ad_pilot_earnings',
    badge: '💰 PILOT PARTNER PROGRAM',
    badgeColor: '#F59E0B',
    themeColor: '#F59E0B',
    title: 'Earn up to ₹48,000 / Month with Your Car',
    subtitle: 'Commute daily for work? Host verified corporate co-passengers to offset 100% fuel, toll & EMI expenses.',
    promoCode: 'PILOTPLUS',
    type: 'earnings_calculator',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1600',
    gradient: 'linear-gradient(135deg, rgba(120, 53, 15, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%)',
    ctaText: 'Register as Expressway Pilot',
    targetRoute: 'auth-pilot'
  },
  {
    id: 'ad_fastag_shield',
    badge: '🛣️ 0-SECOND TOLL PLAZA CLEARANCE',
    badgeColor: '#8B5CF6',
    themeColor: '#8B5CF6',
    title: 'Bypass Highway Toll Queues with DriveIT RFID',
    subtitle: 'Automated FASTag expressway lane clearance at Khalapur, Urse & Kherki Daula. Save 25+ minutes per journey.',
    promoCode: 'FASTPASS',
    type: 'toll_visualizer',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=1600',
    gradient: 'linear-gradient(135deg, rgba(76, 29, 149, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%)',
    ctaText: 'Explore Delhi → Jaipur Corridor',
    presetFrom: 'Delhi, India',
    presetTo: 'Jaipur, Rajasthan, India'
  },
  {
    id: 'ad_corporate_shield',
    badge: '🛡️ EXECUTIVE SHIELD + ₹5L COVER',
    badgeColor: '#3B82F6',
    themeColor: '#3B82F6',
    title: 'Executive Commutes with ₹5 Lakh Insurance',
    subtitle: 'Every seat includes complimentary HDFC ERGO accidental cover, GST business invoices & 0 cancellation fee.',
    promoCode: 'CORPEXEC',
    type: 'corporate_perks',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600',
    gradient: 'linear-gradient(135deg, rgba(30, 58, 138, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%)',
    ctaText: 'View Bengaluru → Chennai Seats',
    presetFrom: 'Bengaluru, Karnataka, India',
    presetTo: 'Chennai, Tamil Nadu, India'
  },
  {
    id: 'ad_weekend_pass',
    badge: '🎉 WEEKEND GETAWAY PASS • 28% OFF',
    badgeColor: '#EC4899',
    themeColor: '#EC4899',
    title: 'Friday to Sunday Express Escapes from ₹280',
    subtitle: 'Scenic escapes to Lonavala, Goa, Agra, or Mysore. Verified co-travelers and instant seat confirmation.',
    promoCode: 'WEEKEND28',
    type: 'weekend_destinations',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1600',
    gradient: 'linear-gradient(135deg, rgba(131, 24, 67, 0.94) 0%, rgba(15, 23, 42, 0.96) 100%)',
    ctaText: 'Book Mumbai → Goa Escape',
    presetFrom: 'Mumbai, Maharashtra, India',
    presetTo: 'Goa, India'
  }
];

export default function AdBannerCarousel({ onSelectPreset, onNavigate, autoPlayInterval = 6500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  // Interactive state for Ad 1 (EV Distance slider)
  const [evDistance, setEvDistance] = useState(148);

  // Interactive state for Ad 2 (Pilot Corridor selector)
  const [pilotCorridor, setPilotCorridor] = useState('MUM_PUN');

  const CORRIDOR_EARNINGS = {
    MUM_PUN: { name: 'Mumbai ⇄ Pune (148 km)', monthly: 38400, fuelSaved: '100%', seats: '3 seats/day' },
    DEL_JAI: { name: 'Delhi ⇄ Jaipur (270 km)', monthly: 48600, fuelSaved: '100%', seats: '3 seats/day' },
    BLR_CHE: { name: 'Bengaluru ⇄ Chennai (340 km)', monthly: 44200, fuelSaved: '100%', seats: '3 seats/day' },
    HYD_VIJ: { name: 'Hyderabad ⇄ Vijayawada (275 km)', monthly: 39500, fuelSaved: '100%', seats: '3 seats/day' }
  };

  // Autoplay Timer & Progress Bar
  useEffect(() => {
    if (isPaused) return;

    const stepMs = 50;
    const increment = (stepMs / autoPlayInterval) * 100;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(curr => (curr + 1) % ADS_DATA.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, autoPlayInterval]);

  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Promo code ${code} copied! Apply at checkout for flat discount.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setProgress(0);
    setCurrentIndex(prev => (prev - 1 + ADS_DATA.length) % ADS_DATA.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setProgress(0);
    setCurrentIndex(prev => (prev + 1) % ADS_DATA.length);
  };

  const handleActionClick = (ad) => {
    if (ad.targetRoute && onNavigate) {
      onNavigate(ad.targetRoute);
      return;
    }

    if (ad.presetFrom && ad.presetTo && onSelectPreset) {
      onSelectPreset(ad.presetFrom, ad.presetTo);
      addToast(`Selected ${ad.presetFrom.split(',')[0]} → ${ad.presetTo.split(',')[0]} corridor!`, 'info');
      // Smooth scroll to search console / rides
      const searchEl = document.getElementById('search-console-wrapper') || document.querySelector('.searchConsole') || document.querySelector('form');
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (ad.promoCode) {
      handleCopyCode(ad.promoCode, { stopPropagation: () => {} });
    }
  };

  const currentAd = ADS_DATA[currentIndex];

  // Calculated metrics for EV Slider
  const co2SavedKg = ((evDistance * 0.171)).toFixed(1);
  const taxiFare = Math.round(evDistance * 18);
  const carpoolFare = Math.round(evDistance * 2.6);
  const moneySaved = taxiFare - carpoolFare;

  // Touch Swipe Handlers for Mobile & Tablet
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 40) {
      if (distance > 0) {
        handleNext({ stopPropagation: () => {} });
      } else {
        handlePrev({ stopPropagation: () => {} });
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {ADS_DATA.map((ad, idx) => (
        <div
          key={ad.id}
          className={`${styles.slide} ${idx === currentIndex ? styles.slideActive : ''}`}

          style={{
            backgroundImage: `url(${ad.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          {/* Gradient Scrim Overlay */}
          <div 
            className={styles.gradientOverlay} 
            style={{ background: ad.gradient }}
          />

          <div className={styles.slideContent}>
            {/* Top Interactive Row */}
            <div className={styles.topRow}>
              <div className={styles.badgeWrapper}>
                <span className={styles.badge} style={{ borderColor: ad.badgeColor, color: ad.badgeColor }}>
                  <Sparkles size={12} />
                  <span>{ad.badge}</span>
                </span>

                {ad.promoCode && (
                  <button
                    type="button"
                    onClick={(e) => handleCopyCode(ad.promoCode, e)}
                    className={styles.promoPill}
                    title="Click to copy promo code"
                  >
                    <Tag size={12} color={ad.badgeColor} />
                    <span>CODE: <strong>{ad.promoCode}</strong></span>
                    {copiedCode === ad.promoCode ? (
                      <span className={styles.copiedBadge}><Check size={11} /> COPIED!</span>
                    ) : (
                      <span className={styles.copyPrompt}><Copy size={11} /> Copy</span>
                    )}
                  </button>
                )}
              </div>

              {/* Pause/Play Controller */}
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className={styles.pauseToggle}
                title={isPaused ? 'Resume auto-slides' : 'Pause auto-slides'}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
                <span>{isPaused ? 'Paused' : 'Auto'}</span>
              </button>
            </div>

            {/* Main Title & Subtitle */}
            <h2 className={styles.title}>{ad.title}</h2>
            <p className={styles.subtitle}>{ad.subtitle}</p>

            {/* ======================================================== */}
            {/* DYNAMIC INTERACTIVE WIDGETS FOR EACH AD SLIDE            */}
            {/* ======================================================== */}

            {/* 1. EV Eco Calculator Widget */}
            {ad.type === 'eco_calculator' && (
              <div className={styles.interactiveWidget}>
                <div className={styles.widgetHeader}>
                  <div className={styles.widgetTitle}>
                    <Leaf size={14} color="#10B981" />
                    <span>Live Outstation Green Savings Simulator:</span>
                  </div>
                  <span className={styles.sliderValueBadge}>{evDistance} KM Highway</span>
                </div>

                <div className={styles.sliderRow}>
                  <input
                    type="range"
                    min="50"
                    max="350"
                    step="10"
                    value={evDistance}
                    onChange={(e) => setEvDistance(Number(e.target.value))}
                    className={styles.rangeSlider}
                    aria-label="Trip Distance Slider"
                  />
                </div>

                <div className={styles.widgetStatsGrid}>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>🌱 Net CO₂ Prevented</span>
                    <span className={styles.statValueGreen}>-{co2SavedKg} kg</span>
                  </div>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>💰 Money Saved vs Taxi</span>
                    <span className={styles.statValueGold}>Save ₹{moneySaved.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>⚡ Estimated Fare</span>
                    <span className={styles.statValueWhite}>₹{carpoolFare} / seat</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Pilot Earnings Estimator Widget */}
            {ad.type === 'earnings_calculator' && (
              <div className={styles.interactiveWidget}>
                <div className={styles.widgetHeader}>
                  <div className={styles.widgetTitle}>
                    <TrendingUp size={14} color="#F59E0B" />
                    <span>Select your highway commute corridor to estimate earnings:</span>
                  </div>
                </div>

                <div className={styles.corridorButtonsRow}>
                  {Object.entries(CORRIDOR_EARNINGS).map(([key, data]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPilotCorridor(key)}
                      className={`${styles.corridorPill} ${pilotCorridor === key ? styles.corridorPillActive : ''}`}
                    >
                      {data.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>

                <div className={styles.widgetStatsGrid}>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>💵 Monthly Offset</span>
                    <span className={styles.statValueGold}>₹{CORRIDOR_EARNINGS[pilotCorridor].monthly.toLocaleString('en-IN')}</span>
                  </div>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>⛽ Fuel & Tolls Paid</span>
                    <span className={styles.statValueGreen}>100% Reimbursed</span>
                  </div>
                  <div className={styles.widgetStatCard}>
                    <span className={styles.statLabel}>🔒 Community Standard</span>
                    <span className={styles.statValueWhite}>Aadhaar Verified Only</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FASTag Toll RFID Visualizer */}
            {ad.type === 'toll_visualizer' && (
              <div className={styles.interactiveWidget}>
                <div className={styles.widgetHeader}>
                  <div className={styles.widgetTitle}>
                    <CreditCard size={14} color="#8B5CF6" />
                    <span>Automated RFID Express Tollways (Zero Halt Guaranteed):</span>
                  </div>
                </div>

                <div className={styles.tollPillsRow}>
                  <div className={styles.tollGateCard}>
                    <span className={styles.tollGateName}>🟢 Khalapur Plaza (NH48)</span>
                    <span className={styles.tollGateTime}>₹85 • 0s RFID Halt</span>
                  </div>
                  <div className={styles.tollGateCard}>
                    <span className={styles.tollGateName}>🟢 Urse Expressway Toll</span>
                    <span className={styles.tollGateTime}>₹85 • Auto-Cleared</span>
                  </div>
                  <div className={styles.tollGateCard}>
                    <span className={styles.tollGateName}>🟢 Kherki Daula (Delhi)</span>
                    <span className={styles.tollGateTime}>₹65 • Fastag Dedicated</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Corporate Perks & Trip Cover */}
            {ad.type === 'corporate_perks' && (
              <div className={styles.interactiveWidget}>
                <div className={styles.perksRow}>
                  <div className={styles.perkChip}>
                    <ShieldCheck size={14} color="#3B82F6" />
                    <span>₹5,00,000 HDFC ERGO Accidental Policy Included</span>
                  </div>
                  <div className={styles.perkChip}>
                    <Check size={14} color="#10B981" />
                    <span>Automated GST Tax Invoices</span>
                  </div>
                  <div className={styles.perkChip}>
                    <Clock size={14} color="#F59E0B" />
                    <span>100% On-Time Pilot Guarantee</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Weekend Destinations Quick Selector */}
            {ad.type === 'weekend_destinations' && (
              <div className={styles.interactiveWidget}>
                <div className={styles.widgetHeader}>
                  <div className={styles.widgetTitle}>
                    <Compass size={14} color="#EC4899" />
                    <span>Popular Weekend Getaway Corridors (Click to quick-book):</span>
                  </div>
                </div>

                <div className={styles.destinationChipsRow}>
                  {[
                    { from: 'Mumbai, Maharashtra, India', to: 'Lonavala, Maharashtra, India', label: '⛰️ Lonavala', fare: '₹280' },
                    { from: 'Mumbai, Maharashtra, India', to: 'Goa, India', label: '🏖️ Goa Express', fare: '₹1,250' },
                    { from: 'Delhi, India', to: 'Agra, Uttar Pradesh, India', label: '🕌 Agra Yamuna', fare: '₹340' },
                    { from: 'Bengaluru, Karnataka, India', to: 'Mysore, Karnataka, India', label: '🌿 Mysore High', fare: '₹320' }
                  ].map((dest, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSelectPreset && onSelectPreset(dest.from, dest.to)}
                      className={styles.destinationChip}
                    >
                      <span className={styles.destinationChipLabel}>{dest.label}</span>
                      <span className={styles.destinationChipFare}>{dest.fare}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom CTA Row */}
            <div className={styles.ctaRow}>
              <button 
                type="button"
                onClick={() => handleActionClick(ad)}
                className={styles.ctaBtn}
                style={{
                  background: `linear-gradient(135deg, ${ad.themeColor}, #F59E0B)`
                }}
              >
                <span>{ad.ctaText}</span>
                <ArrowRight size={15} />
              </button>

              <span className={styles.sponsorNotice}>
                ⚡ Verified Indian Expressway Partner • Instant FASTag Telemetry
              </span>
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
        <ChevronLeft size={22} />
      </button>

      <button 
        type="button" 
        onClick={handleNext} 
        className={`${styles.navBtn} ${styles.nextBtn}`}
        aria-label="Next Ad Banner"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dynamic Slide Progress & Indicator Tabs */}
      <div className={styles.bottomBar}>
        <div className={styles.progressBarWrapper}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${progress}%`, background: currentAd.themeColor }}
          />
        </div>

        <div className={styles.dotsRow}>
          {ADS_DATA.map((ad, idx) => (
            <button
              key={ad.id}
              type="button"
              onClick={() => { setProgress(0); setCurrentIndex(idx); }}
              className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
              style={{
                backgroundColor: idx === currentIndex ? ad.themeColor : undefined
              }}
              title={ad.title}
              aria-label={`Go to slide ${idx + 1}: ${ad.title}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
