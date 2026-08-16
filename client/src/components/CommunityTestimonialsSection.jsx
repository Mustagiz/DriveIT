import React from 'react';
import { Star, ShieldCheck, Users, Quote, CheckCircle2, Car, Sparkles } from 'lucide-react';
import SpotlightCard from './ui/SpotlightCard';
import ShinyText from './ui/ShinyText';
import ScrollReveal from './ScrollReveal';

export default function CommunityTestimonialsSection() {
  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Senior Product Manager @ FinTech',
      route: 'Mumbai ⇄ Pune (3x / week)',
      tag: 'Verified EV Pilot',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      saved: '₹14,500/mo saved',
      quote: 'Driveit transformed my weekly Mumbai-Pune commute. I take my Nexon EV, pick up 2 corporate co-travelers from BKC, and my FASTag tolls + electricity are 100% covered. Zero awkwardness with instant cashless payouts.'
    },
    {
      name: 'Sneha Kulkarni',
      role: 'Lead Architect @ Tech Parks',
      route: 'Bengaluru ⇄ Mysuru',
      tag: 'Women-Only Carpooler',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      saved: '720 kg CO2 avoided',
      quote: 'As a woman travelling on state expressways after late client reviews, the UIDAI biometric check and emergency live telemetry give me 100% peace of mind. The verified women-only filter is genuinely unmatched.'
    },
    {
      name: 'Vikramjit Roy',
      role: 'Management Consultant',
      route: 'Delhi NCR ⇄ Agra & Jaipur',
      tag: '5.0 ★ Super Pilot',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      rating: 5,
      saved: '180+ shared journeys',
      quote: 'Surge pricing on highway cabs was bleeding my travel allowance. With Driveit, I ride in premium ventilated EV cabins for ₹400 with intellectual co-riders. The digital boarding pass with FASTag split is pure perfection.'
    }
  ];

  return (
    <section style={{ width: '100%', marginBottom: '56px', position: 'relative' }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '10px', display: 'inline-block' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(56, 189, 248, 0.14)',
              border: '1.5px solid rgba(56, 189, 248, 0.4)',
              color: '#38BDF8',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '900',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              <Users size={14} />
              <ShinyText text="Verified Community & Pilot Stories" speed={3} />
            </span>
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.2vw, 44px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            margin: '0 0 12px'
          }}>
            Trusted by 50,000+ Highway Commuters
          </h2>

          <p style={{
            fontSize: '16px',
            color: 'var(--color-text-tertiary)',
            lineHeight: 1.6,
            margin: '0 auto 24px',
            maxWidth: '780px'
          }}>
            From corporate EV drivers to solo women commuters, see how India's most verified carpool network is redefining intercity mobility.
          </p>
        </div>

        {/* Testimonials 3-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {testimonials.map((t, i) => (
            <SpotlightCard
              key={i}
              spotlightColor="rgba(245, 158, 11, 0.2)"
              style={{
                borderRadius: '26px',
                background: 'var(--color-bg-surface)',
                border: '1.5px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 200ms ease'
              }}
            >
              <div style={{ padding: '30px 32px' }}>
                {/* Rating & Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '3px', color: '#F59E0B' }}>
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} size={16} fill="#F59E0B" />
                    ))}
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#10B981',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '9999px'
                  }}>
                    {t.saved}
                  </span>
                </div>

                {/* Quote */}
                <p style={{
                  fontSize: '14.5px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.65,
                  margin: '0 0 24px',
                  fontStyle: 'italic'
                }}>
                  "{t.quote}"
                </p>

                {/* User Bio */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #F59E0B'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
                        {t.name}
                      </span>
                      <CheckCircle2 size={14} color="#10B981" />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
                      {t.role}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#F59E0B', marginTop: '2px' }}>
                      📍 {t.route}
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
