import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Zap, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Radio
} from 'lucide-react';
import { useToast } from './Toast';
import ScrollReveal from './ScrollReveal';
import ShinyText from './ui/ShinyText';
import styles from './RegionalRoutesDirectorySection.module.css';

export default function RegionalRoutesDirectorySection({ onSelectRoute }) {
  const { showToast } = useToast();
  const [activeRegionId, setActiveRegionId] = useState('maharashtra');
  const [dynamicStates, setDynamicStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback initial regions structure
  const fallbackRegions = [
    {
      id: 'maharashtra',
      title: 'Maharashtra & West',
      subtitle: 'Mumbai-Pune Expressway, NH-48 & Samruddhi Mahamarg',
      badge: '480+ Daily Trips',
      routes: [
        { from: 'Mumbai', to: 'Pune', fare: '₹349', time: '1h 56m', highway: 'Mumbai-Pune Exp (NH-48)', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Pune, Maharashtra, India', evReady: true, activeCount: 8 },
        { from: 'Pune', to: 'Mumbai', fare: '₹349', time: '1h 56m', highway: 'Mumbai-Pune Exp (NH-48)', originQuery: 'Pune, Maharashtra, India', destQuery: 'Mumbai, Maharashtra, India', evReady: true, activeCount: 6 },
        { from: 'Mumbai', to: 'Nashik', fare: '₹299', time: '3h 10m', highway: 'Samruddhi Mahamarg', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Nashik, Maharashtra, India', evReady: false, activeCount: 3 },
        { from: 'Mumbai', to: 'Goa', fare: '₹1,250', time: '8h 45m', highway: 'NH-66 Coastal Corridor', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Goa, India', evReady: true, activeCount: 2 },
        { from: 'Pune', to: 'Kolhapur', fare: '₹380', time: '3h 30m', highway: 'NH-48 South Express', originQuery: 'Pune, Maharashtra, India', destQuery: 'Kolhapur, Maharashtra, India', evReady: false, activeCount: 4 },
        { from: 'Mumbai', to: 'Nagpur', fare: '₹1,350', time: '7h 45m', highway: 'Samruddhi Mahamarg', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Nagpur, Maharashtra, India', evReady: true, activeCount: 3 }
      ]
    },
    {
      id: 'north',
      title: 'Delhi NCR & North',
      subtitle: 'Yamuna Expressway, Delhi-Jaipur & NH-44 Grand Trunk',
      badge: '360+ Daily Trips',
      routes: [
        { from: 'Delhi', to: 'Jaipur', fare: '₹449', time: '3h 40m', highway: 'Delhi-Jaipur Exp (NH-48)', originQuery: 'Delhi, India', destQuery: 'Jaipur, Rajasthan, India', evReady: true, activeCount: 7 },
        { from: 'Delhi', to: 'Agra', fare: '₹340', time: '2h 15m', highway: 'Yamuna Expressway', originQuery: 'Delhi, India', destQuery: 'Agra, Uttar Pradesh, India', evReady: true, activeCount: 5 },
        { from: 'Delhi', to: 'Chandigarh', fare: '₹399', time: '3h 50m', highway: 'NH-44 Grand Trunk', originQuery: 'Delhi, India', destQuery: 'Chandigarh, India', evReady: false, activeCount: 4 },
        { from: 'Delhi', to: 'Dehradun', fare: '₹520', time: '4h 30m', highway: 'Delhi-Dehradun Exp', originQuery: 'Delhi, India', destQuery: 'Dehradun, Uttarakhand, India', evReady: false, activeCount: 2 }
      ]
    },
    {
      id: 'south',
      title: 'Karnataka & South',
      subtitle: 'Bengaluru-Mysuru Expressway, Chennai NH-48 & Hyderabad Corridor',
      badge: '420+ Daily Trips',
      routes: [
        { from: 'Bengaluru', to: 'Mysuru', fare: '₹299', time: '1h 30m', highway: 'Bengaluru-Mysuru 10-Lane', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Mysuru, Karnataka, India', evReady: true, activeCount: 6 },
        { from: 'Bengaluru', to: 'Chennai', fare: '₹399', time: '4h 45m', highway: 'NH-48 Golden Quadrilateral', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Chennai, Tamil Nadu, India', evReady: true, activeCount: 5 },
        { from: 'Hyderabad', to: 'Vijayawada', fare: '₹420', time: '3h 55m', highway: 'NH-65 Highway', originQuery: 'Hyderabad, Telangana, India', destQuery: 'Vijayawada, Andhra Pradesh, India', evReady: false, activeCount: 3 }
      ]
    },
    {
      id: 'gujarat',
      title: 'Gujarat & West',
      subtitle: 'National Expressway 1 (NE-1) & Western Freight Corridor',
      badge: '290+ Daily Trips',
      routes: [
        { from: 'Ahmedabad', to: 'Vadodara', fare: '₹249', time: '1h 15m', highway: 'National Expressway 1 (NE-1)', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Vadodara, Gujarat, India', evReady: true, activeCount: 5 },
        { from: 'Surat', to: 'Mumbai', fare: '₹480', time: '4h 30m', highway: 'NH-48 Coastal Link', originQuery: 'Surat, Gujarat, India', destQuery: 'Mumbai, Maharashtra, India', evReady: true, activeCount: 4 }
      ]
    }
  ];

  useEffect(() => {
    const fetchCorridors = async () => {
      try {
        const res = await fetch('/api/rides/corridors/summary');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.states) && data.states.length > 0) {
            const mapped = data.states.map(st => ({
              id: st.stateId,
              title: st.stateName,
              subtitle: st.badge,
              badge: `${st.totalStateDepartures > 0 ? st.totalStateDepartures + ' Active Rides' : '100% Verified'}`,
              routes: st.corridors.map(c => ({
                from: c.from,
                to: c.to,
                fare: `₹${c.lowestPricePerSeat || c.baseFare}`,
                time: `${Math.round(c.distanceKm / 70)}h ${Math.round((c.distanceKm % 70) * 0.8)}m`,
                highway: c.highway,
                originQuery: `${c.from}, India`,
                destQuery: `${c.to}, India`,
                evReady: c.evRidesAvailable,
                activeCount: c.activeDeparturesCount
              }))
            }));
            setDynamicStates(mapped);
          }
        }
      } catch (err) {
        console.warn('Corridors summary fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCorridors();
  }, []);

  const regions = dynamicStates.length > 0 ? dynamicStates : fallbackRegions;
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
                <MapPin size={14} color={isActive ? '#062103' : '#10B981'} />
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
                  {route.activeCount > 0 && (
                    <span className={styles.corridorPill} style={{ color: '#84CC16', fontWeight: 800 }}>
                      <Radio size={10} color="#84CC16" />
                      <span>{route.activeCount} live</span>
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
