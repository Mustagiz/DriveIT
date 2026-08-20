import React, { useState, useMemo } from 'react';
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
  FileText,
  Sliders,
  Calculator,
  QrCode,
  PhoneCall,
  Fuel,
  Leaf,
  Check,
  X,
  ChevronRight,
  Navigation,
  Award,
  AlertCircle,
  DollarSign,
  Lock,
  Compass,
  Radio
} from 'lucide-react';
import ShinyText from '../components/ui/ShinyText';
import { useTheme } from '../context/ThemeContext';
import styles from './HowItWorksPage.module.css';

export default function HowItWorksPage({ onNavigate }) {
  const [activeRole, setActiveRole] = useState('PASSENGER'); // 'PASSENGER' | 'PILOT'
  const [activeSimStep, setActiveSimStep] = useState(0); // 0, 1, 2
  const [openFaq, setOpenFaq] = useState(0);
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [faqSearch, setFaqSearch] = useState('');
  const { isDark } = useTheme();

  // Calculator State
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [isEvVehicle, setIsEvVehicle] = useState(true);
  const [customDistance, setCustomDistance] = useState(150);

  const POPULAR_ROUTES = [
    {
      name: 'Mumbai ⇄ Pune',
      highway: 'Yashwantrao Chavan Expressway',
      distance: 150,
      driveitFare: 350,
      soloCabFare: 2800,
      busFare: 450,
      travelTime: '2h 30m',
      busTime: '5h 15m',
      tollCost: 320,
      co2Saved: 18.4,
      plazas: 'Khalapur & Talegaon'
    },
    {
      name: 'Delhi ⇄ Jaipur',
      highway: 'Delhi-Mumbai Expressway (NE4)',
      distance: 280,
      driveitFare: 580,
      soloCabFare: 4900,
      busFare: 650,
      travelTime: '3h 45m',
      busTime: '6h 30m',
      tollCost: 540,
      co2Saved: 34.2,
      plazas: 'Sohna & Dausa'
    },
    {
      name: 'Bengaluru ⇄ Chennai',
      highway: 'NE7 Expressway Corridor',
      distance: 350,
      driveitFare: 690,
      soloCabFare: 6200,
      busFare: 750,
      travelTime: '4h 30m',
      busTime: '7h 45m',
      tollCost: 620,
      co2Saved: 42.8,
      plazas: 'Attibele & Sriperumbudur'
    },
    {
      name: 'Hyderabad ⇄ Vijayawada',
      highway: 'NH65 Expressway Corridor',
      distance: 275,
      driveitFare: 540,
      soloCabFare: 4800,
      busFare: 600,
      travelTime: '4h 00m',
      busTime: '6h 45m',
      tollCost: 490,
      co2Saved: 33.6,
      plazas: 'Pantangi & Keesara'
    },
    {
      name: 'Samruddhi Mahamarg (Mumbai ⇄ Nagpur)',
      highway: 'Hindu Hrudaysamrat Balasaheb Thackeray Expy',
      distance: 701,
      driveitFare: 1350,
      soloCabFare: 12500,
      busFare: 1400,
      travelTime: '7h 45m',
      busTime: '14h 00m',
      tollCost: 1215,
      co2Saved: 86.0,
      plazas: 'Shirdi & Nagpur Hub'
    }
  ];

  const currentRoute = POPULAR_ROUTES[selectedRouteIdx] || POPULAR_ROUTES[0];
  const effectiveDistance = currentRoute.distance;
  const effectiveDriveitFare = isEvVehicle 
    ? Math.round(currentRoute.driveitFare * 0.9) 
    : currentRoute.driveitFare;
  const totalSavings = currentRoute.soloCabFare - effectiveDriveitFare;
  const savingsPct = Math.round((totalSavings / currentRoute.soloCabFare) * 100);

  // 3-Step Simulator Data for Passengers
  const passengerSimData = [
    {
      step: '01',
      title: 'Search & Pick Corridor',
      sub: 'Filter by Electric Vehicles, Aadhaar verified, or female-only',
      desc: 'Enter your origin city, destination, and departure time. Filter through 1,200+ daily expressway departures with verified corporate commuters.',
      icon: Search,
      color: '#84CC16',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#84CC16', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EXPRESSWAY MATCH
            </span>
            <span style={{ background: '#10B98118', color: '#10B981', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
              ⚡ 100% EV Green Ride
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            <span>Mumbai BKC</span>
            <ArrowRight size={14} color="#84CC16" />
            <span>Pune Hinjawadi</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', background: isDark ? '#1E293B' : '#E2E8F0', padding: '4px 8px', borderRadius: '6px', color: 'var(--color-text-secondary)' }}>
              🛡️ UIDAI Verified Pilot
            </span>
            <span style={{ fontSize: '11px', background: isDark ? '#1E293B' : '#E2E8F0', padding: '4px 8px', borderRadius: '6px', color: 'var(--color-text-secondary)' }}>
              🏢 Tech Corporate Co-riders
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Departure</span>
              <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>Today, 06:30 PM</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Per Seat</span>
              <strong style={{ fontSize: '16px', color: '#84CC16' }}>₹315</strong>
            </div>
          </div>
        </div>
      )
    },
    {
      step: '02',
      title: 'Transparent FASTag Split',
      sub: 'Zero commercial surge pricing. Direct fuel & toll cost-recovery',
      desc: 'View transparent cost-recovery splits compliant with Section 66(1) of the Motor Vehicles Act. Toll plazas and fuel are split proportionally among co-travelers.',
      icon: CreditCard,
      color: '#10B981',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', paddingBottom: '8px' }}>
            🧾 Fare & FASTag Breakdown (Per Seat)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <span>Base Energy / Fuel Share</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>₹195</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            <span>NHAI FASTag Electronic Toll Split</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>₹120</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#10B981' }}>
            <span>⚡ 10% EV Green Subsidy</span>
            <span style={{ fontWeight: 700 }}>- ₹35</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dashed rgba(148, 163, 184, 0.3)', marginTop: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Total Cost Recovery</span>
            <strong style={{ fontSize: '18px', color: '#10B981' }}>₹280</strong>
          </div>
        </div>
      )
    },
    {
      step: '03',
      title: 'Boarding PIN & Radar',
      sub: 'Encrypted 4-digit code and live satellite in-trip telemetry',
      desc: 'Meet your verified driver at designated highway hubs. Hand over your encrypted 4-digit PIN to authenticate boarding and activate 24/7 radar telemetry.',
      icon: KeyRound,
      color: '#38BDF8',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#38BDF818', color: '#38BDF8', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, margin: '0 auto' }}>
            <Radio size={13} />
            <span>LIVE HIGHWAY RADAR ACTIVE</span>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
              Your 4-Digit Boarding PIN
            </span>
            <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '8px', color: '#38BDF8', margin: '4px 0' }}>
              7824
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
              Share with pilot at pickup to begin route telemetry
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', background: isDark ? '#1E293B' : '#F1F5F9', padding: '10px', borderRadius: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>Vehicle</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>Tata Nexon EV</strong>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block' }}>RC Number</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>MH-12-RN-7788</strong>
            </div>
          </div>
        </div>
      )
    }
  ];

  // 3-Step Simulator Data for Pilots
  const pilotSimData = [
    {
      step: '01',
      title: 'Publish Highway Route',
      sub: 'Set your commute in 45 seconds with instant expressway presets',
      desc: 'Driving solo outstation? List your route, departure time, and available empty seats. Pre-filled with expressway exit waypoints and toll plazas.',
      icon: Car,
      color: '#84CC16',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#84CC16', textTransform: 'uppercase' }}>
            INSTANT ROUTE PRESET
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Mumbai BKC ➔ Pune Hinjawadi (150 km)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: isDark ? '#1E293B' : '#F1F5F9', padding: '10px 14px', borderRadius: '12px', fontSize: '13px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Seats Available</span>
            <strong style={{ color: '#84CC16' }}>3 Empty Seats</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', background: isDark ? '#1E293B' : '#F1F5F9', padding: '10px 14px', borderRadius: '12px', fontSize: '13px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Auto-Calculated Payout</span>
            <strong style={{ color: '#10B981' }}>₹1,050 Total Offset</strong>
          </div>
        </div>
      )
    },
    {
      step: '02',
      title: 'Accept Verified Commuters',
      sub: '100% Aadhaar & corporate company verified passenger requests',
      desc: 'Receive seat requests from verified commuters along your path. Review their Verhoeff verification badges, ratings, and corporate employer.',
      icon: ShieldCheck,
      color: '#10B981',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase' }}>
              SEAT RESERVATION REQUEST
            </span>
            <span style={{ fontSize: '11px', background: '#10B98120', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
              4.96 ★ (34 rides)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#84CC16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#062103' }}>
              AS
            </div>
            <div>
              <strong style={{ fontSize: '13.5px', color: 'var(--color-text-primary)', display: 'block' }}>Ananya Sen</strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>Aadhaar Verified • Senior Consultant @ Deloitte</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button type="button" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#84CC16', color: '#062103', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
              Accept Co-Rider
            </button>
            <button type="button" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'transparent', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
              Decline
            </button>
          </div>
        </div>
      )
    },
    {
      step: '03',
      title: 'Automated 100% Payouts',
      sub: 'Recover fuel & electronic FASTag expenses under MVA Sec 66(1)',
      desc: 'Verify passenger 4-digit PINs at pickup. Payouts are automatically routed to your bank account or UPI within 2 hours of trip completion.',
      icon: TrendingUp,
      color: '#A855F7',
      mockup: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase' }}>
            AUTOMATED WALLET SETTLEMENT
          </div>
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>Total Highway Expense Recovered</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#10B981' }}>+ ₹1,050</div>
            <span style={{ fontSize: '11px', color: '#84CC16', fontWeight: 700 }}>⚡ 100% Fuel + FASTag Toll Offset</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '8px' }}>
            <span>Settlement Destination</span>
            <strong style={{ color: 'var(--color-text-primary)' }}>rahul.sharma@okaxis (UPI)</strong>
          </div>
        </div>
      )
    }
  ];

  const currentSimSteps = activeRole === 'PASSENGER' ? passengerSimData : pilotSimData;
  const activeStepData = currentSimSteps[activeSimStep] || currentSimSteps[0];

  // 4-Tier Security Architecture
  const securityTiers = [
    {
      tier: 'Tier 01',
      name: 'UIDAI Aadhaar Checksum',
      tag: 'Mathematical Verhoeff Gate',
      color: '#38BDF8',
      desc: 'Zero fake accounts. 12-digit Aadhaar credentials undergo real-time Verhoeff checksum calculation and photo match validation before route publishing.'
    },
    {
      tier: 'Tier 02',
      name: 'MoRTH Driving License',
      tag: 'Ministry Registry Audit',
      color: '#84CC16',
      desc: 'Pilot driving licenses are validated against national transport databases to confirm clean records, active validity, and commercial vehicle exclusion.'
    },
    {
      tier: 'Tier 03',
      name: 'VAHAN & FASTag RC Audit',
      tag: 'BS-VI & EV Standards',
      color: '#10B981',
      desc: 'Only private passenger vehicles (white registration plates) with active FASTag electronic toll accounts and valid insurance are certified.'
    },
    {
      tier: 'Tier 04',
      name: '24/7 Radar & SOS Desk',
      tag: 'Live Highway Telemetry',
      color: '#F59E0B',
      desc: 'Trips feature continuous GPS coordinate telemetry. 1-tap SOS connection instantly dispatches coordinates to emergency contacts and highway patrol.'
    }
  ];

  // Comparison Matrix Rows
  const comparisonRows = [
    {
      metric: 'Average Cost per Seat (e.g. Mumbai-Pune)',
      driveit: '₹350 (Cost-Recovery Split)',
      cab: '₹2,800 - ₹3,500 (100% Solo)',
      bus: '₹450 - ₹650 (State/Private)'
    },
    {
      metric: 'Expressway FASTag Toll Cost',
      driveit: 'Included & Split Evenly',
      cab: 'Added on top as surcharge',
      bus: 'Built into slow tickets'
    },
    {
      metric: 'Travel Time & Transit Speed',
      driveit: '⚡ 2h 30m (Non-stop express)',
      cab: '2h 45m',
      bus: '🐢 5h 15m (Multiple depot stops)'
    },
    {
      metric: 'Identity & Security Verification',
      driveit: '✅ 100% UIDAI Aadhaar + DL',
      cab: '⚠️ Variable driver audits',
      bus: '❌ Zero passenger verification'
    },
    {
      metric: 'Co-Traveler Demographics',
      driveit: 'Verified Corporate Professionals',
      cab: 'Solo / Unknown driver',
      bus: '50+ Unverified public crowd'
    },
    {
      metric: 'Green Electric Vehicle (EV) Rebate',
      driveit: '🌱 10% Subsidized EV Rate',
      cab: 'None (Commercial surge)',
      bus: 'None'
    },
    {
      metric: 'Safety Gates & Live Telemetry',
      driveit: '4-Digit Boarding PIN + Radar',
      cab: 'Basic in-app GPS',
      bus: 'No telemetry or PIN gate'
    }
  ];

  // FAQ Database
  const allFaqs = [
    {
      cat: 'LEGAL',
      q: 'How does cost-sharing work under the Motor Vehicles Act?',
      a: 'DriveIT operates strictly as a peer-to-peer non-commercial carpooling platform complying with Section 66(1) of the Indian Motor Vehicles Act. Fares are mathematically capped to share direct fuel and NHAI FASTag toll expenses without commercial profit.'
    },
    {
      cat: 'SAFETY',
      q: 'How are pilots and passengers verified on the platform?',
      a: 'All pilots and passengers undergo mandatory 3-Tier verification: UIDAI Aadhaar validation via the Verhoeff mathematical algorithm, Driving License audit, and BS-VI / EV Vehicle Registration Certificate (RC) audit.'
    },
    {
      cat: 'PIN',
      q: 'How is the Boarding Pass PIN used at pickup?',
      a: 'Every confirmed booking generates a unique 4-digit cryptographic Boarding PIN and encrypted QR code. When boarding, the passenger shares their PIN with the pilot to confirm boarding and activate live in-trip telemetry.'
    },
    {
      cat: 'PRICING',
      q: 'How are FASTag tolls calculated and divided?',
      a: 'Expressway toll plaza charges are automatically looked up from our national toll database and divided equally among all occupied seats. Passengers pay their fair share directly within their cost-recovery seat fare with zero hidden charges.'
    },
    {
      cat: 'SAFETY',
      q: 'What safety features exist for women and solo travelers?',
      a: 'DriveIT provides Female-Only carpool filters, allowing women passengers to match exclusively with verified women pilots or women co-travelers. Every trip also features 24/7 SOS telemetry and live trip sharing.'
    },
    {
      cat: 'PRICING',
      q: 'What is the 10% Green EV Rebate?',
      a: 'To accelerate sustainable zero-emission transit, all trips taken in verified Electric Vehicles (e.g. Tata Nexon EV, MG ZS EV, BYD) receive an automatic 10% fare discount, keeping EV seat fares under ₹2.30/km.'
    },
    {
      cat: 'LEGAL',
      q: 'What happens if a driver cancels a trip?',
      a: 'Drivers with cancellation rates above 3% receive automated trust score deductions. Passengers are instantly notified and priority-reassigned to alternate verified vehicles on the same corridor with full fare protection.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(faq => {
      const matchCat = faqCategory === 'ALL' || faq.cat === faqCategory;
      const matchSearch = !faqSearch || 
        faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
        faq.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allFaqs, faqCategory, faqSearch]);

  return (
    <div className={styles.pageWrapper}>
      {/* 1. Page Hero Header */}
      <div className={styles.heroHeader}>
        <div className={styles.badge}>
          <ShieldCheck size={14} color="#84CC16" />
          <ShinyText text="Verified Highway Architecture" speed={3} />
        </div>

        <h1 className={styles.pageTitle}>
          How Driveit Works
        </h1>

        <p className={styles.pageSubtitle}>
          India's premier intercity carpooling platform built on 100% UIDAI Aadhaar verification, real-time FASTag electronic toll splitting, and peer-to-peer trust.
        </p>

        {/* Role Switcher */}
        <div className={styles.roleSwitcher}>
          <button
            type="button"
            onClick={() => { setActiveRole('PASSENGER'); setActiveSimStep(0); }}
            className={`${styles.roleBtn} ${activeRole === 'PASSENGER' ? styles.roleBtnActive : ''}`}
          >
            <Users size={16} />
            <span>For Passengers</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('PILOT'); setActiveSimStep(0); }}
            className={`${styles.roleBtn} ${activeRole === 'PILOT' ? styles.roleBtnActive : ''}`}
          >
            <Car size={16} />
            <span>For Car Owners</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive 3-Step Simulator */}
      <div className={styles.simulatorContainer}>
        {/* Step Navigation Tabs */}
        <div className={styles.simNavRow}>
          {currentSimSteps.map((s, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSimStep(idx)}
              className={`${styles.simStepTab} ${activeSimStep === idx ? styles.simStepTabActive : ''}`}
            >
              <div className={styles.simTabNumber}>
                {s.step}
              </div>
              <div>
                <div className={styles.simTabTitle}>{s.title}</div>
                <div className={styles.simTabSub}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulator Stage */}
        <div className={styles.simStageGrid}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: activeStepData.color, fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Sparkles size={14} />
              <span>STEP {activeStepData.step} OF 03</span>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 14px', letterSpacing: '-0.02em' }}>
              {activeStepData.title}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 24px' }}>
              {activeStepData.desc}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => onNavigate(activeRole === 'PASSENGER' ? 'pilots' : 'post-ride')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#062103',
                  padding: '12px 22px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                <span>{activeRole === 'PASSENGER' ? 'Book a Corridor Ride' : 'Publish Highway Route'}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          <div className={styles.simMockupCard}>
            {activeStepData.mockup}
          </div>
        </div>
      </div>

      {/* 3. Interactive Route & Cost-Split Calculator */}
      <div className={styles.calculatorSection}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#84CC16', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Calculator size={15} />
            <span>Interactive Fare Calculator</span>
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Calculate Real Highway Savings
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Compare DriveIT's verified cost-recovery fares against solo commercial taxis and public buses across India's top expressways.
          </p>
        </div>

        {/* Route Selector Pills */}
        <div className={styles.routePillsRow}>
          {POPULAR_ROUTES.map((route, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedRouteIdx(idx)}
              className={`${styles.routePill} ${selectedRouteIdx === idx ? styles.routePillActive : ''}`}
            >
              {route.name}
            </button>
          ))}
        </div>

        {/* EV Toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 700 }}>
            Vehicle Drive Mode:
          </span>
          <button
            type="button"
            onClick={() => setIsEvVehicle(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: isEvVehicle ? '1.5px solid #10B981' : '1px solid #CBD5E1',
              background: isEvVehicle ? '#10B98118' : 'transparent',
              color: isEvVehicle ? '#10B981' : 'var(--color-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Leaf size={14} />
            <span>Electric Vehicle (10% Green Rebate)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEvVehicle(false)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: !isEvVehicle ? '1.5px solid #84CC16' : '1px solid #CBD5E1',
              background: !isEvVehicle ? '#84CC1618' : 'transparent',
              color: !isEvVehicle ? '#84CC16' : 'var(--color-text-secondary)',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Fuel size={14} />
            <span>Standard BS-VI Petrol/Diesel</span>
          </button>
        </div>

        {/* 3-Way Comparison Cards */}
        <div className={styles.calcComparisonGrid}>
          {/* DriveIT Verified Carpool */}
          <div className={`${styles.calcCard} ${styles.calcCardFeatured}`}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: '#84CC16', color: '#062103', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '9999px', letterSpacing: '0.05em' }}>
              RECOMMENDED
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={18} color="#84CC16" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>DriveIT Verified Carpool</span>
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#84CC16', margin: '8px 0 4px' }}>
                ₹{effectiveDriveitFare}
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}> / seat</span>
              </div>
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 800 }}>
                ⚡ You Save ₹{totalSavings} ({savingsPct}%)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0 16px', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Travel Time:</span>
                <strong style={{ color: 'var(--color-text-primary)' }}>{currentRoute.travelTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>FASTag Toll:</span>
                <strong style={{ color: '#10B981' }}>Split Included</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CO₂ Offset:</span>
                <strong style={{ color: '#10B981' }}>🌱 {currentRoute.co2Saved} kg</strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('pilots')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#062103',
                fontWeight: 900,
                fontSize: '13.5px',
                cursor: 'pointer'
              }}
            >
              Find Rides on this Corridor
            </button>
          </div>

          {/* Commercial Solo Taxi */}
          <div className={styles.calcCard}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Car size={18} color="#EF4444" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Commercial Solo Taxi</span>
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#EF4444', margin: '8px 0 4px' }}>
                ₹{currentRoute.soloCabFare}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                100% Cost borne by one rider
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0 16px', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Travel Time:</span>
                <strong style={{ color: 'var(--color-text-primary)' }}>{currentRoute.travelTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>FASTag Toll:</span>
                <span style={{ color: '#EF4444' }}>Extra (+₹{currentRoute.tollCost})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Surge Pricing:</span>
                <span style={{ color: '#EF4444' }}>Frequent 1.5x - 2.5x</span>
              </div>
            </div>

            <div style={{ padding: '10px', borderRadius: '10px', background: '#EF444410', color: '#EF4444', fontSize: '11.5px', fontWeight: 700, textAlign: 'center' }}>
              Costs ~{Math.round(currentRoute.soloCabFare / effectiveDriveitFare)}x more than DriveIT
            </div>
          </div>

          {/* State / Private Bus */}
          <div className={styles.calcCard}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Clock size={18} color="#F59E0B" />
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-primary)' }}>Intercity Public Bus</span>
              </div>
              <div style={{ fontSize: '34px', fontWeight: 900, color: '#F59E0B', margin: '8px 0 4px' }}>
                ₹{currentRoute.busFare}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Cheap but 2x - 3x slower travel
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0 16px', fontSize: '12.5px', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Travel Time:</span>
                <strong style={{ color: '#EF4444' }}>🐢 {currentRoute.busTime}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Depot Stops:</span>
                <span style={{ color: 'var(--color-text-primary)' }}>8 - 14 Halts</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Passenger Gates:</span>
                <span style={{ color: '#EF4444' }}>Zero Aadhaar verification</span>
              </div>
            </div>

            <div style={{ padding: '10px', borderRadius: '10px', background: '#F59E0B10', color: '#D97706', fontSize: '11.5px', fontWeight: 700, textAlign: 'center' }}>
              Takes ~2.5x longer travel duration
            </div>
          </div>
        </div>
      </div>

      {/* 4. UIDAI 4-Tier Security Architecture */}
      <div className={styles.securitySection}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38BDF8', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <ShieldCheck size={15} />
            <span>Government-Grade Trust Architecture</span>
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            4-Tier Safety & Verification Gates
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Every participant, vehicle, and corridor mile is validated against mathematical checksums and real-time highway radar telemetry.
          </p>
        </div>

        <div className={styles.securityGrid}>
          {securityTiers.map((tier, idx) => (
            <div key={idx} className={styles.securityCard}>
              <div className={styles.securityBadge} style={{ background: `${tier.color}15`, color: tier.color }}>
                {tier.tier} • {tier.tag}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 10px' }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {tier.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Comprehensive Comparison Matrix */}
      <div className={styles.matrixSection}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#84CC16', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Sparkles size={15} />
            <span>Side-by-Side Comparison</span>
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Why Commuters Choose Driveit
          </h2>
        </div>

        <div className={styles.matrixTableWrapper}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th style={{ width: '34%' }}>Feature / Highway Metric</th>
                <th style={{ width: '22%', color: '#84CC16', background: isDark ? 'rgba(132, 204, 22, 0.12)' : '#F0FDF4' }}>
                  🚗 DriveIT Verified Carpool
                </th>
                <th style={{ width: '22%' }}>🚖 Commercial Solo Cab</th>
                <th style={{ width: '22%' }}>🚌 State / Private Bus</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {row.metric}
                  </td>
                  <td style={{ fontWeight: 800, color: '#16A34A', background: isDark ? 'rgba(132, 204, 22, 0.05)' : '#F0FDF4' }}>
                    {row.driveit}
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {row.cab}
                  </td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>
                    {row.bus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Top Expressway Corridor Fast-Cards */}
      <div className={styles.corridorsSection}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Navigation size={15} />
            <span>National Corridor Network</span>
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Popular Expressway Routes
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Connect with verified pilots across India's busiest executive and industrial travel arteries.
          </p>
        </div>

        <div className={styles.corridorsGrid}>
          {POPULAR_ROUTES.map((route, idx) => (
            <div
              key={idx}
              className={styles.corridorCard}
              onClick={() => onNavigate('pilots')}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#84CC16', textTransform: 'uppercase' }}>
                    {route.distance} KM CORRIDOR
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)' }}>
                    ⏱️ {route.travelTime}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
                  {route.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 14px' }}>
                  {route.highway}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block' }}>Verified Fare</span>
                  <strong style={{ fontSize: '16px', color: '#10B981' }}>₹{route.driveitFare}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#84CC16', fontSize: '12px', fontWeight: 800 }}>
                  <span>Book Seat</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Searchable FAQ Section */}
      <div className={styles.faqSection}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#84CC16', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <HelpCircle size={15} />
            <span>Knowledge Base</span>
          </div>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'var(--color-text-primary)', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Everything you need to know about cost-sharing compliance, Aadhaar identity gates, and FASTag toll divisions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className={styles.faqControls}>
          <div className={styles.faqSearchBox}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter FAQs by keyword (e.g. Aadhaar, FASTag, MVA, PIN)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className={styles.faqSearchInput}
            />
          </div>

          <div className={styles.faqCategoryPills}>
            {[
              { id: 'ALL', label: 'All FAQs' },
              { id: 'LEGAL', label: 'MVA Sec 66' },
              { id: 'SAFETY', label: 'Aadhaar & Safety' },
              { id: 'PRICING', label: 'FASTag & Fares' },
              { id: 'PIN', label: 'Boarding PIN' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFaqCategory(cat.id)}
                className={`${styles.faqCatPill} ${faqCategory === cat.id ? styles.faqCatPillActive : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={styles.faqItem}>
                  <button
                    type="button"
                    className={styles.faqQuestion}
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="#84CC16" /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              No matching questions found for "{faqSearch}". Try searching for "Aadhaar", "FASTag", or "Toll".
            </div>
          )}
        </div>
      </div>

      {/* 8. Bottom Action Bar */}
      <div className={styles.bottomCtaBar}>
        <div>
          <h3 className={styles.bottomCtaTitle}>
            Ready to experience smarter highway transit?
          </h3>
          <p className={styles.bottomCtaSubtitle}>
            Join over 24,000+ verified commuters saving up to 70% on intercity travel with zero surge pricing.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onNavigate(activeRole === 'PASSENGER' ? 'pilots' : 'post-ride')}
            className={styles.ctaBtnPrimary}
          >
            <span>{activeRole === 'PASSENGER' ? 'Explore Corridor Rides' : 'Publish Highway Seats'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
