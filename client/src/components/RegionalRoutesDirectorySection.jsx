import React, { useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Zap, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useToast } from './Toast';
import ScrollReveal from './ScrollReveal';
import ShinyText from './ui/ShinyText';
import styles from './RegionalRoutesDirectorySection.module.css';

export default function RegionalRoutesDirectorySection({ onSelectRoute }) {
  const { showToast } = useToast();
  const [activeRegionId, setActiveRegionId] = useState('maharashtra');

  const regions = [
    {
      id: 'maharashtra',
      title: 'Maharashtra & West',
      subtitle: 'Mumbai-Pune Expressway, NH-48 & Samruddhi Mahamarg',
      badge: '480+ Daily Trips',
      routes: [
        { from: 'Mumbai', to: 'Pune', fare: '₹349', time: '1h 56m', highway: 'Mumbai-Pune Exp (NH-48)', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Pune, Maharashtra, India', evReady: true },
        { from: 'Pune', to: 'Mumbai', fare: '₹349', time: '1h 56m', highway: 'Mumbai-Pune Exp (NH-48)', originQuery: 'Pune, Maharashtra, India', destQuery: 'Mumbai, Maharashtra, India', evReady: true },
        { from: 'Mumbai', to: 'Nashik', fare: '₹299', time: '3h 10m', highway: 'Samruddhi Mahamarg', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Nashik, Maharashtra, India', evReady: false },
        { from: 'Mumbai', to: 'Goa', fare: '₹1,250', time: '8h 45m', highway: 'NH-66 Coastal Corridor', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Goa, India', evReady: true },
        { from: 'Pune', to: 'Kolhapur', fare: '₹380', time: '3h 30m', highway: 'NH-48 South Express', originQuery: 'Pune, Maharashtra, India', destQuery: 'Kolhapur, Maharashtra, India', evReady: false },
        { from: 'Mumbai', to: 'Shirdi', fare: '₹450', time: '4h 15m', highway: 'Samruddhi Expressway', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Shirdi, Maharashtra, India', evReady: false }
      ]
    },
    {
      id: 'north',
      title: 'Delhi NCR & North',
      subtitle: 'Yamuna Expressway, Delhi-Jaipur & NH-44 Grand Trunk',
      badge: '360+ Daily Trips',
      routes: [
        { from: 'Delhi', to: 'Jaipur', fare: '₹449', time: '3h 40m', highway: 'Delhi-Jaipur Exp (NH-48)', originQuery: 'Delhi, India', destQuery: 'Jaipur, Rajasthan, India', evReady: true },
        { from: 'Delhi', to: 'Agra', fare: '₹340', time: '2h 15m', highway: 'Yamuna Expressway', originQuery: 'Delhi, India', destQuery: 'Agra, Uttar Pradesh, India', evReady: true },
        { from: 'Delhi', to: 'Chandigarh', fare: '₹399', time: '3h 50m', highway: 'NH-44 Grand Trunk', originQuery: 'Delhi, India', destQuery: 'Chandigarh, India', evReady: false },
        { from: 'Delhi', to: 'Dehradun', fare: '₹520', time: '4h 30m', highway: 'Delhi-Dehradun Exp', originQuery: 'Delhi, India', destQuery: 'Dehradun, Uttarakhand, India', evReady: false },
        { from: 'Gurgaon', to: 'Jaipur', fare: '₹420', time: '3h 20m', highway: 'NH-48 Direct Express', originQuery: 'Gurgaon, Haryana, India', destQuery: 'Jaipur, Rajasthan, India', evReady: true },
        { from: 'Noida', to: 'Lucknow', fare: '₹650', time: '5h 10m', highway: 'Agra-Lucknow Exp', originQuery: 'Noida, Uttar Pradesh, India', destQuery: 'Lucknow, Uttar Pradesh, India', evReady: false }
      ]
    },
    {
      id: 'south',
      title: 'Karnataka & South',
      subtitle: 'Bengaluru-Mysuru Expressway, Chennai NH-48 & Hyderabad Corridor',
      badge: '420+ Daily Trips',
      routes: [
        { from: 'Bengaluru', to: 'Mysuru', fare: '₹299', time: '1h 30m', highway: 'Bengaluru-Mysuru 10-Lane', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Mysuru, Karnataka, India', evReady: true },
        { from: 'Bengaluru', to: 'Chennai', fare: '₹399', time: '4h 45m', highway: 'NH-48 Golden Quadrilateral', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Chennai, Tamil Nadu, India', evReady: true },
        { from: 'Hyderabad', to: 'Vijayawada', fare: '₹420', time: '3h 55m', highway: 'NH-65 Highway', originQuery: 'Hyderabad, Telangana, India', destQuery: 'Vijayawada, Andhra Pradesh, India', evReady: false },
        { from: 'Bengaluru', to: 'Coimbatore', fare: '₹580', time: '5h 30m', highway: 'NH-44 South Corridor', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Coimbatore, Tamil Nadu, India', evReady: false },
        { from: 'Chennai', to: 'Pondicherry', fare: '₹280', time: '2h 10m', highway: 'East Coast Road (ECR)', originQuery: 'Chennai, Tamil Nadu, India', destQuery: 'Pondicherry, India', evReady: true },
        { from: 'Kochi', to: 'Trivandrum', fare: '₹350', time: '3h 40m', highway: 'NH-66 Coastal Belt', originQuery: 'Kochi, Kerala, India', destQuery: 'Thiruvananthapuram, Kerala, India', evReady: false }
      ]
    },
    {
      id: 'gujarat',
      title: 'Gujarat & West',
      subtitle: 'National Expressway 1 (NE-1) & Western Freight Corridor',
      badge: '290+ Daily Trips',
      routes: [
        { from: 'Ahmedabad', to: 'Vadodara', fare: '₹249', time: '1h 15m', highway: 'National Expressway 1 (NE-1)', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Vadodara, Gujarat, India', evReady: true },
        { from: 'Surat', to: 'Mumbai', fare: '₹480', time: '4h 30m', highway: 'NH-48 Coastal Link', originQuery: 'Surat, Gujarat, India', destQuery: 'Mumbai, Maharashtra, India', evReady: true },
        { from: 'Ahmedabad', to: 'Surat', fare: '₹390', time: '3h 45m', highway: 'NE-1 & NH-48', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Surat, Gujarat, India', evReady: false },
        { from: 'Rajkot', to: 'Ahmedabad', fare: '₹350', time: '3h 20m', highway: 'NH-47 Rajkot Highway', originQuery: 'Rajkot, Gujarat, India', destQuery: 'Ahmedabad, Gujarat, India', evReady: false },
        { from: 'Vadodara', to: 'Mumbai', fare: '₹550', time: '5h 15m', highway: 'NH-48 West Corridor', originQuery: 'Vadodara, Gujarat, India', destQuery: 'Mumbai, Maharashtra, India', evReady: false },
        { from: 'Ahmedabad', to: 'Udaipur', fare: '₹490', time: '4h 10m', highway: 'NH-48 Heritage Corridor', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Udaipur, Rajasthan, India', evReady: false }
      ]
    }
  ];

  const currentRegion = regions.find(r => r.id === activeRegionId) || regions[0];

  const handleCardClick = (route) => {
    if (typeof onSelectRoute === 'function') {
      onSelectRoute(route.from, route.to);
      showToast(`Browsing verified rides: ${route.from} ➔ ${route.to}`, 'success');
    }
  };

  return (
    <section className={styles.sectionWrapper} aria-label="Regional Highway Corridor Directory">
      <ScrollReveal>
        <div className={styles.headerBlock}>
          <div className={styles.sectionBadge}>
            <Navigation size={13} color="#10B981" />
            <ShinyText text="All-India Regional Corridor Directory" speed={3} />
          </div>

          <h2 className={styles.sectionTitle}>
            Explore Daily Highway Rides by Region
          </h2>

          <p className={styles.sectionSubtitle}>
            Select any popular route to instantly browse verified EV and executive carpool seats with zero booking commission and automated FASTag split.
          </p>
        </div>

        {/* 1. Interactive Region Selector Tabs */}
        <div className={styles.regionTabsContainer} role="tablist" aria-label="Region switcher">
          {regions.map((reg) => {
            const isActive = reg.id === activeRegionId;
            return (
              <button
                key={reg.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveRegionId(reg.id)}
                className={`${styles.regionTabBtn} ${isActive ? styles.regionTabActive : ''}`}
              >
                <MapPin size={14} color={isActive ? '#0E240B' : '#10B981'} />
                <span>{reg.title}</span>
                <span className={isActive ? styles.tabBadge : styles.tabBadgeInactive}>
                  {reg.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. Active Region Meta Banner */}
        <div className={styles.regionMetaBanner}>
          <div className={styles.regionMetaText}>
            <Sparkles size={15} color="#84CC16" />
            <span>{currentRegion.title}</span>
          </div>
          <div className={styles.regionHighwayList}>
            🛣️ {currentRegion.subtitle}
          </div>
        </div>

        {/* 3. Interactive Route Cards Grid for the Active Region */}
        <div className={styles.routesGrid}>
          {currentRegion.routes.map((route, idx) => (
            <div
              key={`${route.from}-${route.to}-${idx}`}
              onClick={() => handleCardClick(route)}
              className={styles.routeCard}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(route);
                }
              }}
              title={`Click to search rides from ${route.from} to ${route.to}`}
            >
              <div className={styles.cardTopRow}>
                <div className={styles.routePath}>
                  <span>{route.from}</span>
                  <ArrowRight size={16} className={styles.routeArrow} />
                  <span>{route.to}</span>
                </div>
                <div className={styles.fareBadge}>
                  from {route.fare}
                </div>
              </div>

              <div className={styles.cardDetailsRow}>
                <div className={styles.corridorPills}>
                  <span className={styles.corridorPill}>
                    <Clock size={11} color="#84CC16" />
                    <span>{route.time}</span>
                  </span>
                  {route.evReady && (
                    <span className={styles.corridorPill} style={{ color: '#10B981' }}>
                      <Zap size={11} color="#10B981" />
                      <span>EV</span>
                    </span>
                  )}
                </div>

                <div className={styles.exploreLink}>
                  <span>Explore Rides</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
