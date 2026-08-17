import React, { useState } from 'react';
import { IndianRupee, Leaf, Zap, ShieldCheck, ArrowRight, Car, TrendingUp, Sparkles } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import ScrollReveal from './ScrollReveal';

export default function SavingsCalculatorSection({ onFindRide, onPostRide }) {
  const [commuteKmPerMonth, setCommuteKmPerMonth] = useState(1200);
  const [commuteType, setCommuteType] = useState('PASSENGER'); // 'PASSENGER' or 'DRIVER'

  // Calculations
  // Driving solo cost: ~₹8.5/km (fuel + wear + FASTag tolls)
  // Shared Driveit cost: ~₹2.4/km
  // Net savings: ~₹6.1/km
  const annualSoloCost = Math.round(commuteKmPerMonth * 12 * 8.5);
  const annualDriveitCost = Math.round(commuteKmPerMonth * 12 * 2.4);
  const annualSavings = annualSoloCost - annualDriveitCost;
  const annualCO2Tons = ((commuteKmPerMonth * 12 * 0.000185)).toFixed(1);
  const annualTreesEquivalent = Math.round(annualCO2Tons * 45);
  const driverAnnualOffset = Math.round(commuteKmPerMonth * 12 * 4.8);

  return (
    <section style={{ width: '100%', marginBottom: '56px', position: 'relative' }}>
      <ScrollReveal>
        <SpotlightCard
          spotlightColor="rgba(16, 185, 129, 0.25)"
          style={{
            borderRadius: '32px',
            background: 'var(--color-bg-surface)',
            border: '1.5px solid var(--color-border)',
            padding: '40px 48px',
            boxShadow: '0 24px 50px -15px rgba(0, 0, 0, 0.12)'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Column: Interactive Slider & Mode Switcher */}
            <div>
              <div style={{ marginBottom: '10px', display: 'inline-block' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.14)',
                  border: '1.5px solid rgba(16, 185, 129, 0.4)',
                  color: '#10B981',
                  padding: '5px 16px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '900',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  <IndianRupee size={14} />
                  <ShinyText text="Interactive Commute ROI Calculator" speed={3} />
                </span>
              </div>

              <h2 style={{
                fontSize: 'clamp(26px, 3.8vw, 38px)',
                fontWeight: '900',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1.18,
                margin: '0 0 12px'
              }}>
                Calculate Your Highway Fuel, Toll & Carbon Savings
              </h2>

              <p style={{
                fontSize: '15px',
                color: 'var(--color-text-tertiary)',
                lineHeight: 1.6,
                margin: '0 0 24px'
              }}>
                See how much you save every year by sharing seats instead of solo driving or booking expensive surge cabs on Indian expressways.
              </p>

              {/* Commuter Mode Switcher */}
              <div style={{
                display: 'inline-flex',
                gap: '8px',
                background: 'var(--color-bg-secondary)',
                padding: '5px',
                borderRadius: '16px',
                marginBottom: '28px'
              }}>
                <button
                  type="button"
                  onClick={() => setCommuteType('PASSENGER')}
                  style={{
                    background: commuteType === 'PASSENGER' ? '#10B981' : 'transparent',
                    color: commuteType === 'PASSENGER' ? '#000000' : 'var(--color-text-secondary)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  I'm a Passenger (Need Rides)
                </button>
                <button
                  type="button"
                  onClick={() => setCommuteType('DRIVER')}
                  style={{
                    background: commuteType === 'DRIVER' ? '#F59E0B' : 'transparent',
                    color: commuteType === 'DRIVER' ? '#000000' : 'var(--color-text-secondary)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                >
                  I'm a Car Owner (Offer Seats)
                </button>
              </div>

              {/* Monthly Distance Range Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                    Monthly Highway Commute Distance:
                  </span>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: '900',
                    color: commuteType === 'PASSENGER' ? '#10B981' : '#F59E0B',
                    fontFamily: 'var(--font-heading)'
                  }}>
                    {commuteKmPerMonth.toLocaleString('en-IN')} km / mo
                  </span>
                </div>

                <input
                  type="range"
                  min="200"
                  max="4000"
                  step="100"
                  value={commuteKmPerMonth}
                  onChange={(e) => setCommuteKmPerMonth(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '8px',
                    accentColor: commuteType === 'PASSENGER' ? '#10B981' : '#F59E0B',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                  <span>200 km (Occasional Trips)</span>
                  <span>1,500 km (Weekly Commuter)</span>
                  <span>4,000 km (Daily Expressway Fleet)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Live Calculation Cards */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              border: '1.5px solid var(--color-border)',
              borderRadius: '24px',
              padding: '30px 32px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                Estimated Annual Impact & Wallet Retained
              </div>

              {/* Main Net Savings Number */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{
                  fontSize: 'clamp(36px, 4.5vw, 48px)',
                  fontWeight: '900',
                  color: commuteType === 'PASSENGER' ? '#10B981' : '#F59E0B',
                  fontFamily: 'var(--font-heading)',
                  lineHeight: 1.1
                }}>
                  ₹{(commuteType === 'PASSENGER' ? annualSavings : driverAnnualOffset).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: '600', marginTop: '4px' }}>
                  {commuteType === 'PASSENGER' ? 'Saved annually compared to solo driving / surge cabs' : 'Fuel & toll expenses recovered annually by sharing empty seats'}
                </div>
              </div>

              {/* 3 Metric Tiles */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#10B981', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                    <Leaf size={20} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                    {annualCO2Tons} Tons
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', marginTop: '2px' }}>
                    CO2 Avoided
                  </div>
                </div>

                <div style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#38BDF8', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                    <Zap size={20} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                    {annualTreesEquivalent} Trees
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', marginTop: '2px' }}>
                    Plantation Eq.
                  </div>
                </div>

                <div style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '14px 12px',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#84CC16', display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
                    100%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: '600', marginTop: '2px' }}>
                    FASTag Audited
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => commuteType === 'PASSENGER' ? (onFindRide && onFindRide()) : (onPostRide && onPostRide())}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#0E240B',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)',
                  transition: 'all 160ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(132, 204, 22, 0.45)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(132, 204, 22, 0.35)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
                }}
              >
                <span>{commuteType === 'PASSENGER' ? 'Find Verified Highway Rides' : 'Offer Empty Seats & Offset Tolls'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </SpotlightCard>
      </ScrollReveal>
    </section>
  );
}
