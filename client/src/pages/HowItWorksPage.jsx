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
  HelpCircle,
  Zap,
  Shield,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import ShinyText from '../components/ui/ShinyText';
import styles from './HowItWorksPage.module.css';

export default function HowItWorksPage({ onNavigate }) {
  const [activeRole, setActiveRole] = useState('PASSENGER');
  const [openFaq, setOpenFaq] = useState(0);

  const passengerSteps = [
    {
      step: '01',
      title: 'Search & Pick Your Corridor',
      desc: 'Enter your origin city, destination, and travel date. Filter by 100% Electric Vehicles, UIDAI Aadhaar-verified pilots, or female-only carpools.',
      icon: Search,
      color: '#84CC16',
      tip: 'Over 1,200+ verified daily expressway departures across India'
    },
    {
      step: '02',
      title: 'Choose Stops & Reserve Seats',
      desc: 'Select designated highway pickup and drop-off hubs. View clear transparent fare breakdowns with automated FASTag electronic toll split included.',
      icon: CreditCard,
      color: '#10B981',
      tip: 'Zero commercial surge pricing & transparent cost-recovery fares'
    },
    {
      step: '03',
      title: 'Show 4-Digit Boarding PIN & Cruise',
      desc: 'Meet your verified corporate co-traveler at the pickup zone. Share your encrypted 4-digit Boarding PIN to start your safe, tracked journey.',
      icon: KeyRound,
      color: '#38BDF8',
      tip: 'Live radar GPS tracking & emergency SOS enabled throughout'
    }
  ];

  const pilotSteps = [
    {
      step: '01',
      title: 'Publish Your Highway Route',
      desc: 'List your daily commute or weekend outstation route in under 60 seconds. Specify available empty seats, vehicle model, and corridor stops.',
      icon: Car,
      color: '#84CC16',
      tip: 'Instant expressway presets for Mumbai-Pune, Delhi-Jaipur, etc.'
    },
    {
      step: '02',
      title: 'Match Verified Commuters',
      desc: 'Receive seat reservations from Aadhaar-verified passengers heading along the same expressway corridor. Accept verified co-riders.',
      icon: ShieldCheck,
      color: '#10B981',
      tip: '100% identity verification via UIDAI Verhoeff algorithm'
    },
    {
      step: '03',
      title: 'Offset 100% Fuel & FASTag Tolls',
      desc: 'Verify passenger 4-digit PINs at pickup. Receive automated cost-recovery payouts to offset fuel, electricity charging, and FASTag toll expenses.',
      icon: TrendingUp,
      color: '#A855F7',
      tip: 'Fully compliant with Section 66(1) Motor Vehicles Act'
    }
  ];

  const faqs = [
    {
      q: 'How does cost-sharing work under the Motor Vehicles Act?',
      a: 'DriveIT operates strictly as a peer-to-peer non-commercial carpooling platform complying with Section 66 of the Motor Vehicles Act. Fares are capped to share direct fuel and NHAI FASTag toll expenses without commercial profit.'
    },
    {
      q: 'How are pilots and passengers verified on the platform?',
      a: 'All pilots and passengers undergo mandatory 3-Tier verification: UIDAI Aadhaar validation via the Verhoeff mathematical algorithm, Driving License audit, and BS-VI / EV Vehicle Registration Certificate (RC) audit.'
    },
    {
      q: 'How is the Boarding Pass PIN used at pickup?',
      a: 'Every confirmed booking generates a unique 4-digit cryptographic Boarding PIN and encrypted QR code. When boarding, the passenger shares their PIN with the pilot to confirm boarding and activate live in-trip telemetry.'
    },
    {
      q: 'What happens if a driver cancels a trip?',
      a: 'Drivers with cancellation rates above 3% receive automated trust score deductions. Passengers are instantly notified and priority-reassigned to alternate verified vehicles on the same corridor with full fare protection.'
    }
  ];

  const currentSteps = activeRole === 'PASSENGER' ? passengerSteps : pilotSteps;

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Page Header */}
      <div className={styles.heroHeader}>
        <div className={styles.badge}>
          <HelpCircle size={14} color="#84CC16" />
          <ShinyText text="Seamless 3-Step Journey" speed={3} />
        </div>

        <h1 className={styles.pageTitle}>
          How Driveit Works
        </h1>

        <p className={styles.pageSubtitle}>
          Smart intercity highway carpooling designed for corporate commuters and expressway pilots with verified trust, zero commission, and automated FASTag cost recovery.
        </p>

        {/* Role Switcher */}
        <div className={styles.roleSwitcher}>
          <button
            type="button"
            onClick={() => setActiveRole('PASSENGER')}
            className={`${styles.roleBtn} ${activeRole === 'PASSENGER' ? styles.roleBtnActive : ''}`}
          >
            <Users size={16} />
            <span>For Passengers</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRole('PILOT')}
            className={`${styles.roleBtn} ${activeRole === 'PILOT' ? styles.roleBtnActive : ''}`}
          >
            <Car size={16} />
            <span>For Car Owners</span>
          </button>
        </div>
      </div>

      {/* 2. Step Cards */}
      <div className={styles.stepsGrid}>
        {currentSteps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={styles.stepCard}>
              <div>
                <div className={styles.stepTopRow}>
                  <div className={styles.iconBox} style={{ background: `${item.color}15`, color: item.color }}>
                    <Icon size={24} />
                  </div>
                  <span className={styles.stepNumber} style={{ color: item.color }}>
                    STEP {item.step}
                  </span>
                </div>

                <h3 className={styles.stepTitle}>
                  {item.title}
                </h3>

                <p className={styles.stepDesc}>
                  {item.desc}
                </p>
              </div>

              <div className={styles.stepTip} style={{ color: item.color }}>
                <CheckCircle2 size={15} />
                <span>{item.tip}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Deep-Dive Security & Cost Features */}
      <div className={styles.deepDiveSection}>
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
            Built on Trust, Telemetry & Fairness
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Every mile is protected with government identity gates, live satellite tracking, and equitable expense splitting.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <ShieldCheck size={26} color="#38BDF8" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>
              100% UIDAI Aadhaar Verification
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Zero unverified drivers. All participants are authenticated via UIDAI Verhoeff mathematical checksums.
            </p>
          </div>

          <div className={styles.featureCard}>
            <CreditCard size={26} color="#84CC16" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>
              Automated FASTag Toll Division
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Expressway toll plazas are split evenly among occupants with zero hidden platform markups.
            </p>
          </div>

          <div className={styles.featureCard}>
            <Zap size={26} color="#10B981" style={{ marginBottom: '12px' }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-primary)' }}>
              10% Green EV Rebate
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
              Electric vehicles receive subsidized ₹3.06/km rates, offsetting 25kg CO₂ on every intercity commute.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Frequently Asked Questions */}
      <div className={styles.faqSection}>
        <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={idx} className={styles.faqItem}>
              <button
                type="button"
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {isOpen && (
                <div className={styles.faqAnswer}>
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Action Bar */}
      <div className={styles.bottomCtaBar}>
        <div>
          <h3 className={styles.bottomCtaTitle} style={{ color: '#FFFFFF' }}>
            Ready to experience smarter highway travel?
          </h3>
          <p className={styles.bottomCtaSubtitle} style={{ color: '#D1E7DD' }}>
            Join thousands of daily commuters saving up to 70% on intercity travel.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate(activeRole === 'PASSENGER' ? 'pilots' : 'post-ride')}
          className={styles.ctaBtnPrimary}
        >
          <span>{activeRole === 'PASSENGER' ? 'Explore Highway Rides' : 'Publish Your Empty Seats'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
