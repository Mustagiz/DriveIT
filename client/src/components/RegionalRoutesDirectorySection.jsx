import React from 'react';
import { ArrowRight, MapPin, Sparkles, Navigation, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import ShinyText from './ui/ShinyText';

export default function RegionalRoutesDirectorySection({ onSelectRoute }) {
  const { isDark } = useTheme();

  const regions = [
    {
      id: 'maharashtra',
      title: 'Rides in Maharashtra',
      subtitle: 'Mumbai-Pune Expressway, NH-48 & Samruddhi Mahamarg',
      badge: '480+ Daily Trips',
      routes: [
        { from: 'Mumbai', to: 'Pune', fare: '₹349', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Pune, Maharashtra, India' },
        { from: 'Pune', to: 'Mumbai', fare: '₹349', originQuery: 'Pune, Maharashtra, India', destQuery: 'Mumbai, Maharashtra, India' },
        { from: 'Mumbai', to: 'Nashik', fare: '₹299', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Nashik, Maharashtra, India' },
        { from: 'Mumbai', to: 'Goa', fare: '₹1,250', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Goa, India' },
        { from: 'Pune', to: 'Kolhapur', fare: '₹380', originQuery: 'Pune, Maharashtra, India', destQuery: 'Kolhapur, Maharashtra, India' },
        { from: 'Mumbai', to: 'Shirdi', fare: '₹450', originQuery: 'Mumbai, Maharashtra, India', destQuery: 'Shirdi, Maharashtra, India' }
      ]
    },
    {
      id: 'north',
      title: 'Rides in Delhi NCR & North',
      subtitle: 'Yamuna Expressway, Delhi-Jaipur & NH-44 Grand Trunk',
      badge: '360+ Daily Trips',
      routes: [
        { from: 'Delhi', to: 'Jaipur', fare: '₹449', originQuery: 'Delhi, India', destQuery: 'Jaipur, Rajasthan, India' },
        { from: 'Delhi', to: 'Agra', fare: '₹340', originQuery: 'Delhi, India', destQuery: 'Agra, Uttar Pradesh, India' },
        { from: 'Delhi', to: 'Chandigarh', fare: '₹399', originQuery: 'Delhi, India', destQuery: 'Chandigarh, India' },
        { from: 'Delhi', to: 'Dehradun', fare: '₹520', originQuery: 'Delhi, India', destQuery: 'Dehradun, Uttarakhand, India' },
        { from: 'Gurgaon', to: 'Jaipur', fare: '₹420', originQuery: 'Gurgaon, Haryana, India', destQuery: 'Jaipur, Rajasthan, India' },
        { from: 'Noida', to: 'Lucknow', fare: '₹650', originQuery: 'Noida, Uttar Pradesh, India', destQuery: 'Lucknow, Uttar Pradesh, India' }
      ]
    },
    {
      id: 'south',
      title: 'Rides in Karnataka & South',
      subtitle: 'Bengaluru-Mysuru Expressway, Chennai NH-48 & Hyderabad Corridor',
      badge: '420+ Daily Trips',
      routes: [
        { from: 'Bengaluru', to: 'Mysuru', fare: '₹299', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Mysuru, Karnataka, India' },
        { from: 'Bengaluru', to: 'Chennai', fare: '₹399', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Chennai, Tamil Nadu, India' },
        { from: 'Hyderabad', to: 'Vijayawada', fare: '₹420', originQuery: 'Hyderabad, Telangana, India', destQuery: 'Vijayawada, Andhra Pradesh, India' },
        { from: 'Bengaluru', to: 'Coimbatore', fare: '₹580', originQuery: 'Bengaluru, Karnataka, India', destQuery: 'Coimbatore, Tamil Nadu, India' },
        { from: 'Chennai', to: 'Pondicherry', fare: '₹280', originQuery: 'Chennai, Tamil Nadu, India', destQuery: 'Pondicherry, India' },
        { from: 'Kochi', to: 'Trivandrum', fare: '₹350', originQuery: 'Kochi, Kerala, India', destQuery: 'Thiruvananthapuram, Kerala, India' }
      ]
    },
    {
      id: 'gujarat',
      title: 'Rides in Gujarat & West',
      subtitle: 'National Expressway 1 (NE-1) & Western Freight Corridor',
      badge: '290+ Daily Trips',
      routes: [
        { from: 'Ahmedabad', to: 'Vadodara', fare: '₹249', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Vadodara, Gujarat, India' },
        { from: 'Surat', to: 'Mumbai', fare: '₹480', originQuery: 'Surat, Gujarat, India', destQuery: 'Mumbai, Maharashtra, India' },
        { from: 'Ahmedabad', to: 'Surat', fare: '₹390', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Surat, Gujarat, India' },
        { from: 'Rajkot', to: 'Ahmedabad', fare: '₹350', originQuery: 'Rajkot, Gujarat, India', destQuery: 'Ahmedabad, Gujarat, India' },
        { from: 'Vadodara', to: 'Mumbai', fare: '₹550', originQuery: 'Vadodara, Gujarat, India', destQuery: 'Mumbai, Maharashtra, India' },
        { from: 'Ahmedabad', to: 'Udaipur', fare: '₹490', originQuery: 'Ahmedabad, Gujarat, India', destQuery: 'Udaipur, Rajasthan, India' }
      ]
    }
  ];

  return (
    <section style={{ 
      width: '100%', 
      maxWidth: '1360px',
      margin: '0 auto 64px',
      padding: '0 clamp(24px, 4.5vw, 56px)',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <ScrollReveal>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '10px', display: 'inline-block' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              color: '#F59E0B',
              padding: '5px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <Navigation size={14} />
              <ShinyText text="All-India Regional Corridor Directory" speed={3} />
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '0 0 10px'
          }}>
            Explore Daily Highway Rides by Region
          </h2>
          <p style={{
            fontSize: '14.5px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            maxWidth: '720px',
            lineHeight: 1.55
          }}>
            Select any popular route to instantly browse verified EV and executive carpool seats with zero booking commission and automated FASTag split.
          </p>
        </div>

        {/* State-Wise Route Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {regions.map((region) => (
            <div key={region.id}>
              {/* Region Heading */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                    letterSpacing: '-0.02em'
                  }}>
                    {region.title}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    ● {region.badge}
                  </span>
                </div>

                <span style={{ fontSize: '12.5px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                  {region.subtitle}
                </span>
              </div>

              {/* 3-Column Clean Card Grid matching reference image */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '14px'
              }}>
                {region.routes.map((route, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectRoute && onSelectRoute(route.originQuery, route.destQuery)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '16px',
                      background: isDark ? 'var(--color-bg-surface)' : '#FFFFFF',
                      border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
                      boxShadow: isDark 
                        ? '0 4px 14px rgba(0, 0, 0, 0.25)' 
                        : '0 2px 8px rgba(15, 23, 42, 0.04)',
                      color: 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                      outline: 'none',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#F59E0B';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = isDark
                        ? '0 8px 24px rgba(245, 158, 11, 0.18)'
                        : '0 8px 20px rgba(245, 158, 11, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isDark ? 'var(--color-border)' : '#E2E8F0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isDark
                        ? '0 4px 14px rgba(0, 0, 0, 0.25)'
                        : '0 2px 8px rgba(15, 23, 42, 0.04)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                      <span style={{
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--color-text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        Rides from <strong>{route.from}</strong> to <strong>{route.to}</strong>
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flexShrink: 0,
                      marginLeft: '12px'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '900',
                        color: '#10B981',
                        background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.1)',
                        padding: '3px 9px',
                        borderRadius: '8px',
                        border: '1px solid rgba(16, 185, 129, 0.25)'
                      }}>
                        from {route.fare}
                      </span>
                      <ArrowRight size={14} color="var(--color-text-tertiary)" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
