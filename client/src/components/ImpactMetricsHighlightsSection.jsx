import React from 'react';
import { Star, ShieldCheck, Heart, Leaf, Car, Users, Sparkles, Navigation, CheckCircle2, Award, IndianRupee } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import ShinyText from './ui/ShinyText';

export default function ImpactMetricsHighlightsSection() {
  const { isDark } = useTheme();

  const topStats = [
    { label: 'Commuter Savings', value: '₹1.8 Cr+', sub: 'Fuel & toll recovery', icon: IndianRupee, color: '#84CC16' },
    { label: 'Green Energy Impact', value: '142 Tons', sub: 'Net CO₂ offset', icon: Leaf, color: '#10B981' },
    { label: 'Verified Community', value: '100% KYC', sub: 'UIDAI Aadhaar audit', icon: ShieldCheck, color: '#38BDF8' },
    { label: 'Interstate Network', value: '18+ Corridors', sub: 'National Expressways', icon: Navigation, color: '#A855F7' }
  ];

  return (
    <section style={{
      width: '100%',
      maxWidth: '1360px',
      margin: '56px auto 72px',
      padding: '0 clamp(24px, 4.5vw, 56px)',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      <ScrollReveal>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ marginBottom: '10px', display: 'inline-block' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981',
              padding: '5px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <Award size={14} />
              <ShinyText text="Verified Highway Benchmarks" speed={3} />
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(26px, 3.8vw, 40px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2,
            margin: '0 0 10px'
          }}>
            Impact Metrics & Highlights
          </h2>
          <p style={{
            fontSize: '15px',
            color: 'var(--color-text-tertiary)',
            margin: 0,
            maxWidth: '640px',
            lineHeight: 1.55,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Driving India towards sustainable, zero-emission highway carpooling with certified safety standards and verified community trust.
          </p>
        </div>

        {/* Big Rounded Outer Card Frame */}
        <div style={{
          background: isDark ? 'var(--color-bg-surface)' : '#FFFFFF',
          border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
          borderRadius: '36px',
          padding: 'clamp(24px, 3.5vw, 44px)',
          boxShadow: isDark
            ? '0 24px 60px -15px rgba(0, 0, 0, 0.5)'
            : '0 20px 50px -15px rgba(15, 23, 42, 0.07)'
        }}>
          {/* Top Quick-Stats Counter Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
            paddingBottom: '28px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
          }}>
            {topStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '18px',
                  background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  transition: 'all 160ms ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                    flexShrink: 0
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '19px',
                      fontWeight: '900',
                      color: 'var(--color-text-primary)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.15
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '11.5px',
                      fontWeight: '800',
                      color: stat.color,
                      marginTop: '2px'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {/* LEFT COLUMN: 2 Stacked Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Top Left: Pinkpool / Women Users */}
              <div style={{
                flex: 1,
                background: isDark ? 'rgba(236, 72, 153, 0.06)' : '#FDF2F8',
                border: isDark ? '1.5px solid rgba(236, 72, 153, 0.3)' : '1.5px solid #FBCFE8',
                borderRadius: '24px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(236, 72, 153, 0.08)',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#DB2777',
                  marginBottom: '8px'
                }}>
                  34% Women Commuters
                </span>
                <h3 style={{
                  fontSize: 'clamp(28px, 3vw, 36px)',
                  fontWeight: '900',
                  color: '#EC4899',
                  margin: '0 0 10px',
                  letterSpacing: '-0.03em'
                }}>
                  Pinkpool
                </h3>
                <p style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: isDark ? '#F472B6' : '#9D174D',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '240px'
                }}>
                  First platform in India to offer certified female-only rides & verified pilots
                </p>
              </div>

              {/* Bottom Left: 4.9/5 Rating */}
              <div style={{
                flex: 1,
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} fill="#84CC16" color="#84CC16" />
                  ))}
                </div>
                <div style={{
                  fontSize: 'clamp(32px, 3.5vw, 42px)',
                  fontWeight: '900',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 6px'
                }}>
                  4.9/5
                </div>
                <div style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: 'var(--color-text-secondary)'
                }}>
                  Average user safety rating
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: Featured Tall Gradient Card with Interactive Phone Mockup */}
            <div style={{
              background: 'linear-gradient(165deg, #84CC16 0%, #10B981 100%)',
              borderRadius: '28px',
              padding: '28px 20px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              color: '#000000',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 16px 40px -10px rgba(16, 185, 129, 0.4)',
              minHeight: '440px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '800',
                color: '#064E3B',
                marginBottom: '4px'
              }}>
                Verified Users
              </span>

              <div style={{
                fontSize: 'clamp(40px, 4.5vw, 56px)',
                fontWeight: '900',
                color: '#042F2E',
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                margin: '0 0 6px'
              }}>
                50k+
              </div>

              <span style={{
                fontSize: '13.5px',
                fontWeight: '800',
                color: '#065F46',
                marginBottom: '20px'
              }}>
                Available across India's Major Expressways
              </span>

              {/* Realistic Mobile Device Frame */}
              <div style={{
                width: '100%',
                maxWidth: '280px',
                background: isDark ? '#0F172A' : '#FFFFFF',
                borderRadius: '24px 24px 0 0',
                border: isDark ? '3px solid #1E293B' : '3px solid #FFFFFF',
                borderBottom: 'none',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                padding: '12px 12px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1
              }}>
                {/* Status Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '2px 8px 8px',
                  fontSize: '10px',
                  fontWeight: '800',
                  color: isDark ? '#94A3B8' : '#64748B',
                  borderBottom: isDark ? '1px solid #1E293B' : '1px solid #F1F5F9'
                }}>
                  <span>9:41</span>
                  <span style={{ fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', fontSize: '11px' }}>
                    Matching Rides
                  </span>
                  <span>5G 🔋</span>
                </div>

                {/* Ride Card 1 inside Mockup (Elevated Floating) */}
                <div style={{
                  background: isDark ? '#1E293B' : '#FFFFFF',
                  borderRadius: '14px',
                  padding: '10px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80" 
                        alt="Pilot" 
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          Samir Deshmukh
                        </div>
                        <div style={{ fontSize: '9px', color: '#10B981', fontWeight: '700' }}>
                          ★ 4.9 · Tata Nexon EV
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#10B981' }}>
                      ₹349.00
                    </div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: isDark ? '#94A3B8' : '#64748B', display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px' }}>
                    <div>🟢 BKC, Mumbai</div>
                    <div>🔴 Wakad Flyover, Pune</div>
                  </div>
                </div>

                {/* Ride Card 2 inside Mockup */}
                <div style={{
                  background: isDark ? '#1E293B' : '#F8FAFC',
                  borderRadius: '14px',
                  padding: '10px',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                  textAlign: 'left',
                  opacity: 0.95
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" 
                        alt="Pilot" 
                        style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          Vikramjit Roy
                        </div>
                        <div style={{ fontSize: '9px', color: '#84CC16', fontWeight: '700' }}>
                          ★ 5.0 · MG ZS EV
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '900', color: '#10B981' }}>
                      ₹449.00
                    </div>
                  </div>
                  <div style={{ fontSize: '9.5px', color: isDark ? '#94A3B8' : '#64748B', display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px' }}>
                    <div>🟢 Dhaula Kuan, Delhi</div>
                    <div>🔴 Mansarovar, Jaipur</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 2 Stacked Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Top Right: Driver Engagement */}
              <div style={{
                flex: 1,
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '8px'
                }}>
                  Pilot Engagement
                </span>
                <div style={{
                  fontSize: 'clamp(32px, 3.5vw, 42px)',
                  fontWeight: '900',
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 8px'
                }}>
                  8000+
                </div>
                <p style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '220px'
                }}>
                  Rides posted last month by verified EV & executive pilots
                </p>
              </div>

              {/* Bottom Right: Eco Impact */}
              <div style={{
                flex: 1,
                background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span style={{
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#10B981',
                  marginBottom: '8px'
                }}>
                  Eco Impact
                </span>
                <div style={{
                  fontSize: 'clamp(32px, 3.5vw, 42px)',
                  fontWeight: '900',
                  color: '#10B981',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 8px'
                }}>
                  500k+
                </div>
                <p style={{
                  fontSize: '13.5px',
                  fontWeight: '700',
                  color: 'var(--color-text-secondary)',
                  margin: 0,
                  lineHeight: 1.45,
                  maxWidth: '220px'
                }}>
                  Kilometres shared & over 140 tons of CO₂ prevented
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
