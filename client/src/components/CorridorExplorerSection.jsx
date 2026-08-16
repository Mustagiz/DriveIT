import React, { useState } from 'react';
import { Navigation, MapPin, Zap, ShieldCheck, Clock, IndianRupee, ArrowRight, Sparkles, Filter } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import ScrollReveal from './ScrollReveal';

export default function CorridorExplorerSection({ onSelectCorridor }) {
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const corridors = [
    {
      id: 'mum-pun',
      name: 'Mumbai ⇄ Pune Expressway',
      tag: 'Yashwantrao Chavan Expressway',
      region: 'WEST',
      origin: 'Mumbai',
      destination: 'Pune',
      distance: '148 km',
      duration: '2h 15m',
      startingPrice: '₹349',
      soloCost: '₹1,850',
      activeDailyRides: '480+ Rides Daily',
      isEV: true,
      tollShared: '100% FASTag Shared',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.04))',
      accentColor: '#F59E0B',
      rating: '4.95 ★'
    },
    {
      id: 'del-agr',
      name: 'Delhi ⇄ Agra Expressway',
      tag: 'Yamuna 6-Lane Super Highway',
      region: 'NORTH',
      origin: 'Delhi NCR',
      destination: 'Agra',
      distance: '210 km',
      duration: '2h 45m',
      startingPrice: '₹449',
      soloCost: '₹2,400',
      activeDailyRides: '360+ Rides Daily',
      isEV: true,
      tollShared: 'Automatic Toll Split',
      bgGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(2, 132, 199, 0.04))',
      accentColor: '#38BDF8',
      rating: '4.92 ★'
    },
    {
      id: 'blr-mys',
      name: 'Bengaluru ⇄ Mysuru Highway',
      tag: 'NH-275 10-Lane Expressway',
      region: 'SOUTH',
      origin: 'Bengaluru',
      destination: 'Mysuru',
      distance: '143 km',
      duration: '1h 35m',
      startingPrice: '₹299',
      soloCost: '₹1,600',
      activeDailyRides: '420+ Rides Daily',
      isEV: true,
      tollShared: '100% FASTag Shared',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.04))',
      accentColor: '#10B981',
      rating: '4.97 ★'
    },
    {
      id: 'ahm-vad',
      name: 'Ahmedabad ⇄ Vadodara',
      tag: 'National Expressway 1 (NE-1)',
      region: 'WEST',
      origin: 'Ahmedabad',
      destination: 'Vadodara',
      distance: '110 km',
      duration: '1h 20m',
      startingPrice: '₹249',
      soloCost: '₹1,400',
      activeDailyRides: '290+ Rides Daily',
      isEV: true,
      tollShared: 'Zero Toll Markups',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(109, 40, 217, 0.04))',
      accentColor: '#8B5CF6',
      rating: '4.91 ★'
    },
    {
      id: 'hyd-vij',
      name: 'Hyderabad ⇄ Vijayawada',
      tag: 'NH-65 High-Speed Corridor',
      region: 'SOUTH',
      origin: 'Hyderabad',
      destination: 'Vijayawada',
      distance: '274 km',
      duration: '4h 10m',
      startingPrice: '₹549',
      soloCost: '₹3,200',
      activeDailyRides: '210+ Rides Daily',
      isEV: false,
      tollShared: 'FASTag Toll Shared',
      bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(190, 24, 93, 0.04))',
      accentColor: '#EC4899',
      rating: '4.88 ★'
    },
    {
      id: 'del-jai',
      name: 'Delhi ⇄ Jaipur Expressway',
      tag: 'Delhi-Mumbai Expressway Spur',
      region: 'NORTH',
      origin: 'Delhi NCR',
      destination: 'Jaipur',
      distance: '280 km',
      duration: '3h 30m',
      startingPrice: '₹499',
      soloCost: '₹2,900',
      activeDailyRides: '340+ Rides Daily',
      isEV: true,
      tollShared: 'Automatic Toll Split',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.04))',
      accentColor: '#F59E0B',
      rating: '4.93 ★'
    }
  ];

  const filteredCorridors = selectedRegion === 'ALL'
    ? corridors
    : corridors.filter(c => c.region === selectedRegion || (selectedRegion === 'EV' && c.isEV));

  return (
    <section style={{ 
      width: '100%', 
      maxWidth: '1360px',
      margin: '0 auto 64px',
      padding: '0 clamp(16px, 3.5vw, 40px)',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ marginBottom: '12px', display: 'inline-block' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(245, 158, 11, 0.14)',
              border: '1.5px solid rgba(245, 158, 11, 0.4)',
              color: '#F59E0B',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <Navigation size={14} />
              <ShinyText text="High-Frequency Highway Corridors" speed={3} />
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(26px, 3.8vw, 42px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            margin: '0 0 12px'
          }}>
            India’s Most Popular Carpool Corridors
          </h2>

          <p style={{
            fontSize: '15.5px',
            color: 'var(--color-text-tertiary)',
            lineHeight: 1.6,
            margin: '0 auto 24px',
            maxWidth: '760px'
          }}>
            Instant departures on India's premier 6-lane and 10-lane expressways with verified corporate pilots and 100% automated FASTag toll sharing.
          </p>

          {/* Region Tabs */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--color-bg-surface)',
            padding: '6px',
            borderRadius: '18px',
            border: '1.5px solid var(--color-border)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
            maxWidth: '100%',
            overflowX: 'auto'
          }}>
            {[
              { id: 'ALL', label: 'All Corridors' },
              { id: 'WEST', label: 'Western Expressways 🌊' },
              { id: 'NORTH', label: 'Northern Corridors 🏛️' },
              { id: 'SOUTH', label: 'Southern Highways 🌴' },
              { id: 'EV', label: '100% Green EV ⚡' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                style={{
                  background: selectedRegion === tab.id
                    ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                    : 'transparent',
                  color: selectedRegion === tab.id ? '#000000' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: '13px',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: selectedRegion === tab.id ? '900' : '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 160ms ease',
                  boxShadow: selectedRegion === tab.id ? '0 4px 14px rgba(245, 158, 11, 0.35)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Corridor Cards Grid with Balanced Spacing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          width: '100%'
        }}>
          {filteredCorridors.map((c) => (
            <SpotlightCard
              key={c.id}
              spotlightColor={`${c.accentColor}25`}
              style={{
                borderRadius: '24px',
                background: 'var(--color-bg-surface)',
                border: '1.5px solid var(--color-border)',
                transition: 'all 200ms ease',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                {/* Card Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '8px' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `${c.accentColor}18`,
                    border: `1px solid ${c.accentColor}40`,
                    color: c.accentColor,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '240px'
                  }}>
                    {c.isEV && <Zap size={12} />}
                    <span>{c.tag}</span>
                  </div>

                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#F59E0B', whiteSpace: 'nowrap' }}>
                    {c.rating}
                  </span>
                </div>

                {/* Corridor Name */}
                <h3 style={{
                  fontSize: '19px',
                  fontWeight: '900',
                  color: 'var(--color-text-primary)',
                  margin: '0 0 14px',
                  lineHeight: 1.25
                }}>
                  {c.name}
                </h3>

                {/* Metrics Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  background: 'var(--color-bg-secondary)',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Distance</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)', marginTop: '2px' }}>{c.distance}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Avg Time</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--color-text-primary)', marginTop: '2px' }}>{c.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>Daily Fleet</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>{c.activeDailyRides.split(' ')[0]}</div>
                  </div>
                </div>

                {/* Price & Savings Comparison */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-border)'
                }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                      Seats from <span style={{ textDecoration: 'line-through', color: '#EF4444', fontWeight: '700' }}>{c.soloCost}</span>
                    </div>
                    <div style={{ fontSize: '23px', fontWeight: '900', color: '#10B981', lineHeight: 1.1, marginTop: '2px' }}>
                      {c.startingPrice} <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--color-text-tertiary)' }}>/ seat</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCorridor && onSelectCorridor(c.origin, c.destination)}
                    style={{
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      color: '#000000',
                      borderRadius: '13px',
                      padding: '11px 18px',
                      fontSize: '13px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      transition: 'all 160ms ease',
                      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(245, 158, 11, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(245, 158, 11, 0.35)';
                    }}
                  >
                    <span>Find Rides</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

