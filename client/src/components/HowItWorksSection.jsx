import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CreditCard, 
  Car, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  KeyRound, 
  TrendingUp, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ScrollReveal from './ScrollReveal';
import ShinyText from './ui/ShinyText';
import styles from './HowItWorksSection.module.css';

export default function HowItWorksSection({ onFindRide, onPostRide }) {
  const [activeRole, setActiveRole] = useState('PASSENGER');
  const { isDark } = useTheme();

  const passengerSteps = [
    {
      step: '01',
      title: 'Search & Pick Corridor',
      desc: 'Enter your departure city, destination, and travel date. Filter by 100% Electric Vehicles, UIDAI-verified pilots, or women-only rides.',
      icon: Search,
      color: '#84CC16',
      tip: 'Over 1,200+ verified daily expressway departures'
    },
    {
      step: '02',
      title: 'Choose Stops & Reserve',
      desc: 'Select exact highway pickup points and drop-offs. Review fare breakdown with automated FASTag electronic toll split included.',
      icon: CreditCard,
      color: '#10B981',
      tip: 'Zero surge pricing & transparent cost-recovery fares'
    },
    {
      step: '03',
      title: 'Show Boarding PIN & Ride',
      desc: 'Meet your verified corporate co-traveler at the designated highway pickup zone. Share your 4-digit Boarding PIN to start your safe ride.',
      icon: KeyRound,
      color: '#38BDF8',
      tip: 'Live radar GPS tracking & emergency SOS enabled'
    }
  ];

  const pilotSteps = [
    {
      step: '01',
      title: 'Publish Your Highway Route',
      desc: 'List your daily commute or weekend outstation route. Specify empty seats, departure time, vehicle model, and highway toll stops.',
      icon: Car,
      color: '#84CC16',
      tip: 'Takes under 60 seconds with smart expressway presets'
    },
    {
      step: '02',
      title: 'Match Verified Passengers',
      desc: 'Receive instant bookings from Aadhaar-verified commuters traveling along the same expressway corridor. Accept corporate co-riders.',
      icon: ShieldCheck,
      color: '#10B981',
      tip: 'Identity checked via UIDAI Verhoeff algorithm'
    },
    {
      step: '03',
      title: 'Offset 100% Fuel & Toll Costs',
      desc: 'Verify passenger 4-digit PINs at pickup. Receive automated payouts to offset fuel, electricity charging, and FASTag toll expenses.',
      icon: TrendingUp,
      color: '#A855F7',
      tip: 'Compliant with Section 66(1) Motor Vehicles Act'
    }
  ];

  const currentSteps = activeRole === 'PASSENGER' ? passengerSteps : pilotSteps;

  return (
    <section id="how-it-works" className={styles.section}>
      <ScrollReveal>
        <div
          className={styles.card}
          style={{
            background: isDark ? 'var(--color-bg-surface)' : '#FFFFFF',
            border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
            boxShadow: isDark
              ? '0 24px 50px -15px rgba(0, 0, 0, 0.4)'
              : '0 20px 45px -15px rgba(15, 23, 42, 0.08)'
          }}
        >
          {/* Header & Role Switcher */}
          <div className={styles.header}>
            <div>
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
                  <HelpCircle size={14} />
                  <ShinyText text="Seamless 3-Step Journey" speed={3} />
                </span>
              </div>

              <h2 style={{
                fontSize: 'clamp(22px, 3.8vw, 38px)',
                fontWeight: '900',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
                margin: '0 0 10px'
              }}>
                How Driveit Works
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text-tertiary)',
                margin: 0,
                maxWidth: '620px',
                lineHeight: 1.55
              }}>
                Smart highway carpooling designed for corporate commuters and expressway pilots with verified trust, zero commission, and instant FASTag cost recovery.
              </p>
            </div>

            {/* Role Switcher Pills */}
            <div className={styles.roleSwitcher}>
              <button
                type="button"
                onClick={() => setActiveRole('PASSENGER')}
                style={{
                  background: activeRole === 'PASSENGER'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : 'transparent',
                  color: activeRole === 'PASSENGER' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flex: 1,
                  boxShadow: activeRole === 'PASSENGER' ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Users size={14} />
                <span>For Passengers</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveRole('PILOT')}
                style={{
                  background: activeRole === 'PILOT'
                    ? 'linear-gradient(135deg, #10B981, #059669)'
                    : 'transparent',
                  color: activeRole === 'PILOT' ? '#000000' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  flex: 1,
                  boxShadow: activeRole === 'PILOT' ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Car size={14} />
                <span>For Car Owners</span>
              </button>
            </div>
          </div>

          {/* 3 Steps Grid */}
          <div className={styles.stepsGrid}>
            {currentSteps.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className={styles.stepCard}
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                    border: isDark ? '1.5px solid var(--color-border)' : '1.5px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isDark ? 'var(--color-border)' : '#E2E8F0';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    {/* Top Step Pill & Icon */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '13px',
                        background: isDark ? `${item.color}18` : `${item.color}15`,
                        border: `1.5px solid ${item.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color
                      }}>
                        <Icon size={20} />
                      </div>

                      <span style={{
                        fontSize: '16px',
                        fontWeight: '900',
                        color: item.color,
                        fontFamily: 'monospace',
                        letterSpacing: '-0.02em',
                        opacity: 0.85
                      }}>
                        STEP {item.step}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: '900',
                      color: 'var(--color-text-primary)',
                      margin: '0 0 8px',
                      letterSpacing: '-0.02em'
                    }}>
                      {item.title}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Highlight Tip */}
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '7px',
                    fontSize: '12px',
                    color: item.color,
                    fontWeight: '800'
                  }}>
                    <CheckCircle2 size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
                    <span>{item.tip}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Row */}
          <div className={styles.bottomRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
              <Sparkles size={16} color="#10B981" />
              <span>Ready to start saving on your daily expressway highway trips?</span>
            </div>

            <button
              type="button"
              onClick={activeRole === 'PASSENGER' ? onFindRide : onPostRide}
              className={styles.ctaBtn}
            >
              <span>{activeRole === 'PASSENGER' ? 'Find Your Ride Now' : 'Post a Ride & Offset Fuel'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
