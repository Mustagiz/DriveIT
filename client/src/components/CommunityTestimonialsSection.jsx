import React, { useState, useEffect, useRef } from 'react';
import { Star, ShieldCheck, Users, CheckCircle2, Navigation, Zap, Award, HeartHandshake } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';

import ScrollReveal from './ScrollReveal';
import styles from './CommunityTestimonialsSection.module.css';

const TESTIMONIALS_DATA = [
  {
    id: 't1',
    name: 'Rohan Deshmukh',
    role: 'Senior Product Manager @ FinTech',
    route: 'Mumbai ⇄ Pune (3x / week)',
    tag: 'Verified EV Pilot',
    category: 'EV',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '₹14,500/mo saved',
    quote: 'Driveit transformed my weekly Mumbai-Pune commute. I take my Nexon EV, pick up 2 corporate co-travelers from BKC, and my FASTag tolls + electricity are 100% covered. Zero awkwardness with instant cashless payouts.'
  },
  {
    id: 't2',
    name: 'Sneha Kulkarni',
    role: 'Lead Architect @ Tech Parks',
    route: 'Bengaluru ⇄ Mysuru',
    tag: 'Women-Only Carpooler',
    category: 'WOMEN',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '720 kg CO2 avoided',
    quote: 'As a woman travelling on state expressways after late client reviews, the UIDAI biometric check and emergency live telemetry give me 100% peace of mind. The verified women-only filter is genuinely unmatched.'
  },
  {
    id: 't3',
    name: 'Vikramjit Roy',
    role: 'Management Consultant @ Big 4',
    route: 'Delhi NCR ⇄ Agra & Jaipur',
    tag: '5.0 ★ Super Pilot',
    category: 'SUPER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '180+ shared journeys',
    quote: 'Surge pricing on highway cabs was bleeding my travel allowance. With Driveit, I ride in premium ventilated EV cabins for ₹400 with intellectual co-riders. The digital boarding pass with FASTag split is pure perfection.'
  },
  {
    id: 't4',
    name: 'Dr. Ananya Nair',
    role: 'Cardiologist @ Super Specialty Hospital',
    route: 'Hyderabad ⇄ Vijayawada',
    tag: 'Medical Commuter',
    category: 'CORP',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '100% On-Time Record',
    quote: 'I consult between Hyderabad and Vijayawada weekly. Booking a seat with verified executives means I can rest or review case notes peacefully during the 4-hour highway stretch without unpredictable delays.'
  },

  {
    id: 't5',
    name: 'Aditya & Pooja Verma',
    role: 'Co-Founders @ D2C Brand',
    route: 'Ahmedabad ⇄ Vadodara',
    tag: 'Weekend Travellers',
    category: 'CORP',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '₹22,000 Saved / Quarter',
    quote: 'We travel frequently for vendor factory visits on NE-1. Driveit is far cleaner than crowded trains and half the price of private interstate cabs. The automated GST invoice feature is a huge plus for our company claims.'
  },
  {
    id: 't6',
    name: 'Kavita Sundaram',
    role: 'Principal Data Scientist',
    route: 'Chennai ⇄ Bengaluru',
    tag: 'Green Commuter',
    category: 'EV',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '980 kg CO2 Offset',
    quote: 'Finding trusted co-riders for weekend trips from Chennai to Bengaluru used to be stressful. On Driveit, every pilot has verified corporate credentials, Aadhaar KYC, and clean driving badges. Best mobility upgrade in India!'
  },
  {
    id: 't7',
    name: 'Capt. Manpreet Singh',
    role: 'Retd. Defence Officer & Road Captain',
    route: 'Chandigarh ⇄ Delhi NCR',
    tag: '4.98 ★ Elite Pilot',
    category: 'SUPER',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    saved: '240+ Highway Trips',
    quote: 'I drive my Safari between Chandigarh and Delhi twice a week. Offering 2 seats on Driveit allows me to meet fantastic professionals, share stories, and turn fuel expenditure into zero net expense. Highly recommended!'
  }
];

const CATEGORIES = [
  { id: 'ALL', label: 'All Stories 🌟' },
  { id: 'EV', label: 'EV Pilots ⚡' },
  { id: 'WOMEN', label: 'Women-Only 🛡️' },
  { id: 'CORP', label: 'Corporate Pros 💼' },
  { id: 'SUPER', label: 'Super Pilots ⭐' }
];

export default function CommunityTestimonialsSection() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const filteredTestimonials = selectedCategory === 'ALL'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.category === selectedCategory);

  const [cardsPerView, setCardsPerView] = useState(3);

  // Responsive cardsPerView calculator
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 720) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1100) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, filteredTestimonials.length - cardsPerView);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Auto-play slider with pause on hover
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  // Calculate slide percentage translation
  const slidePercentage = (100 / cardsPerView);
  const translateX = currentIndex * (slidePercentage + (cardsPerView > 1 ? (24 / cardsPerView) : 0));

  return (
    <section className={styles.sectionWrapper}>
      <ScrollReveal>
        <div className={styles.headerContainer}>
          <div className={styles.badgePill}>
            <Users size={14} />
            <ShinyText text="Verified Community & Pilot Stories" speed={3} />
          </div>

          <h2 className={styles.mainHeading}>
            Trusted by 50,000+ Highway Commuters
          </h2>

          <p className={styles.subHeading}>
            From corporate EV drivers to solo women commuters, see how India's most verified carpool network is redefining intercity mobility.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className={styles.filterTabsWrapper}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.filterBtnActive : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Multi-Card Slider Viewport */}
        <div 
          className={styles.sliderOuterContainer}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.sliderViewport}>
            <div 
              className={styles.sliderTrack}
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView + (cardsPerView === 3 ? 1.5 : cardsPerView === 2 ? 2.5 : 0))}%)`
              }}
            >
              {filteredTestimonials.map((t) => (
                <div key={t.id} className={styles.slideCardItem}>
                  <SpotlightCard
                    spotlightColor="rgba(245, 158, 11, 0.2)"
                    className={styles.cardInner}
                  >
                    {/* Rating & Impact Badge */}
                    <div className={styles.cardTopBar}>
                      <div className={styles.starsRow}>
                        {[...Array(t.rating)].map((_, r) => (
                          <Star key={r} size={15} fill="#F59E0B" />
                        ))}
                      </div>

                      <span className={styles.impactBadge}>
                        {t.saved}
                      </span>
                    </div>

                    {/* Quote */}
                    <p className={styles.quoteText}>
                      "{t.quote}"
                    </p>

                    {/* User Profile */}
                    <div className={styles.userProfileRow}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={styles.avatarImg}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=F59E0B&color=000&bold=true`;
                        }}
                      />
                      <div className={styles.userInfo}>

                        <h4 className={styles.userName}>
                          <span>{t.name}</span>
                          <CheckCircle2 size={14} color="#10B981" />
                        </h4>
                        <div className={styles.userRole}>{t.role}</div>
                        <div className={styles.userRoute}>
                          <Navigation size={10} />
                          <span>{t.route}</span>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
              ))}
            </div>
          </div>

          {/* Centered Indicator Dots */}
          <div className={styles.dotsWrapper}>
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`${styles.dotItem} ${idx === currentIndex ? styles.dotItemActive : ''}`}
                aria-label={`Go to testimonial slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

