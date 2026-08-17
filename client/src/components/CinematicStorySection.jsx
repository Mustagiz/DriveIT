import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  IndianRupee, 
  Leaf, 
  Car, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Users, 
  Globe2, 
  ArrowRight, 
  Clock, 
  Shield, 
  Award, 
  PhoneCall, 
  CheckCircle2, 
  FileCheck, 
  Radio,
  QrCode,
  KeyRound,
  Route
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SpotlightCard, ShinyText, DecryptedText } from './ui';

export default function CinematicStorySection() {
  const { isDark } = useTheme();
  const sectionRef = useRef(null);

  // Active milestone state
  const [activeStep, setActiveStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL');

  const timelineSteps = [
    {
      id: 0,
      stepNumber: '01',
      category: 'COST',
      badge: 'THE HIGHWAY COMMUTE DILEMMA',
      badgeColor: '#EF4444',
      glowColor: 'rgba(239, 68, 68, 0.25)',
      icon: Car,
      title: 'The High Cost & Heavy Footprint of Solo Highway Travel',
      tagline: 'Single-occupancy driving is expensive, congested, and high-emission.',
      description: 'Hiring a private outstation cab or driving alone across Indian expressways burns up to ₹3,000 in fuel and tolls per 150 km trip while releasing over 26 kg of tailpipe CO₂ into suburban air corridors.',
      comparison: {
        solo: { label: 'Private Taxi / Solo Fuel', cost: '₹2,400+', emission: '26.4 kg CO₂', emptySeats: '3 Seats Wasted' },
        driveit: { label: 'Driveit Shared EV Seat', cost: '₹350 flat', emission: '0 kg Tailpipe CO₂', emptySeats: '100% Utilized' }
      },
      stats: [
        { label: 'Solo Cab Expense', value: '₹2,400+', subtext: 'Per one-way 150km corridor', icon: IndianRupee, accent: '#EF4444' },
        { label: 'Tailpipe CO₂ Emitted', value: '26.4 kg', subtext: 'Per solo passenger vehicle', icon: Leaf, accent: '#F97316' },
        { label: 'Highway Seat Wastage', value: '75%', subtext: '3 empty seats per car on road', icon: Users, accent: '#EAB308' }
      ],
      insight: 'Over 82% of passenger cars traveling between Mumbai-Pune, Delhi-Jaipur, and Bengaluru-Chennai run with 3 empty seats.'
    },
    {
      id: 1,
      stepNumber: '02',
      category: 'SAFETY',
      badge: 'MANDATORY VERIFICATION GATE',
      badgeColor: '#38BDF8',
      glowColor: 'rgba(56, 189, 248, 0.25)',
      icon: ShieldCheck,
      title: '100% UIDAI & RTO Audited Driver Community',
      tagline: 'Zero unverified drivers. Mandatory 3-tier government credential audit.',
      description: 'Before any pilot can list empty seats, their Aadhaar, Driving License, and Vehicle Registration Certificate are officially reviewed and approved by the Driveit Operations Desk. Identity is 100% verified before boarding.',
      comparison: {
        solo: { label: 'Unregulated Highway Rides', cost: 'Unknown Drivers', emission: 'No Telemetry', emptySeats: 'Zero Audit Gate' },
        driveit: { label: 'Driveit Verified Fleet', cost: '100% ID Verified', emission: 'Live Radar GPS', emptySeats: '3-Tier Gov Audited' }
      },
      stats: [
        { label: 'Identity Verification', value: '100%', subtext: 'UIDAI Aadhaar government verified', icon: ShieldCheck, accent: '#38BDF8' },
        { label: 'Document Gate', value: '3-Tier', subtext: 'Aadhaar + DL + Vehicle RC check', icon: FileCheck, accent: '#60A5FA' },
        { label: 'Minimum Safety Rating', value: '4.70 ★', subtext: 'Strict automated de-listing threshold', icon: Award, accent: '#818CF8' }
      ],
      insight: 'Driveit enforces a strict digital verification gate that physically restricts ride publishing until documents are officially accepted.'
    },
    {
      id: 2,
      stepNumber: '03',
      category: 'SPEED',
      badge: 'INTELLIGENT TELEMETRY PAIRING',
      badgeColor: '#84CC16',
      glowColor: 'rgba(132, 204, 22, 0.25)',
      icon: Zap,
      title: 'Corridor Route Telemetry & FASTag Automated Matching',
      tagline: 'Match with executive EV pilots already traveling your expressway in minutes.',
      description: 'Driveit matches passengers with verified corporate drivers heading along the same highway with zero route deviations, automated expressway FASTag lane clearance, and instant pickup at major urban hubs.',
      comparison: {
        solo: { label: 'Bus Stands / Street Hailing', cost: '45m+ Wait Time', emission: 'Multiple Stops', emptySeats: 'Unpredictable Timing' },
        driveit: { label: 'Instant Corridor Match', cost: '< 2m Match Time', emission: 'Direct Expressway', emptySeats: 'Reserved Boarding Pass' }
      },
      stats: [
        { label: 'Average Match Time', value: '< 2 Mins', subtext: 'Instant corridor seat confirmation', icon: Clock, accent: '#84CC16' },
        { label: 'Corridor Route Detours', value: '0 km', subtext: 'Direct expressway route alignment', icon: Route, accent: '#A3E635' },
        { label: 'FASTag Expressway Speed', value: '100%', subtext: 'Automated toll lane transit', icon: Zap, accent: '#16A34A' }
      ],
      insight: 'Every booking produces an encrypted digital boarding pass with unique security ref codes and verified passenger contacts.'
    },
    {
      id: 3,
      stepNumber: '04',
      category: 'COST',
      badge: '70% COMMUTE COST SLASH',
      badgeColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      icon: IndianRupee,
      title: 'Executive Comfort for Bus-Level Prices (Up to 70% Off)',
      tagline: 'A luxurious EV seat for ₹350 instead of a ₹2,500 private cab.',
      description: 'By sharing fuel and highway tolls among verified co-passengers, travel costs drop dramatically. Drivers recover FASTag tolls while commuters save up to ₹8,200 every month on intercity trips.',
      comparison: {
        solo: { label: 'Private Intercity Cab', cost: '₹2,400 - ₹3,200', emission: '₹800 Highway Tolls', emptySeats: 'Full Driver Cost' },
        driveit: { label: 'Driveit Shared Carpool', cost: '₹350 - ₹550', emission: 'Toll Shared Equitably', emptySeats: '70% Cash Savings' }
      },
      stats: [
        { label: 'Executive Seat Fare', value: '₹350', subtext: 'vs ₹2,400+ for private taxi', icon: IndianRupee, accent: '#10B981' },
        { label: 'Monthly Commuter Savings', value: '₹8,200', subtext: 'Based on 4 weekend return trips', icon: CheckCircle2, accent: '#34D399' },
        { label: 'Pilot Toll Recovery', value: '100%', subtext: 'Highway FASTag tolls fully offset', icon: Zap, accent: '#059669' }
      ],
      insight: 'Regular weekend intercity travelers save over ₹98,000 annually by choosing shared EV carpools over private outstation taxis.'
    },
    {
      id: 4,
      stepNumber: '05',
      category: 'ECO',
      badge: 'PLANETARY IMPACT & GREEN SKIES',
      badgeColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.25)',
      icon: Leaf,
      title: 'Taking 3 Cars Off the Highway & Slashing CO₂ by 78%',
      tagline: 'Clean expressway air powered by electric vehicles & full seat utilization.',
      description: 'Every Driveit carpool replaces up to 3 individual vehicles on congested expressways. Prioritizing electric sedans cuts net tailpipe emissions to zero along key highway corridors.',
      comparison: {
        solo: { label: '3 Solo Petrol Sedans', cost: '79.2 kg CO₂ Emitted', emission: 'Heavy Expressway Smog', emptySeats: '3 Toll Queues' },
        driveit: { label: '1 Shared Electric Carpool', cost: '0 kg Tailpipe CO₂', emission: '-78% Net Footprint', emptySeats: '1 Streamlined Car' }
      },
      stats: [
        { label: 'Net CO₂ Reduction', value: '-78%', subtext: 'Lower emissions per passenger-km', icon: Leaf, accent: '#06B6D4' },
        { label: 'Toll Congestion Relief', value: '-3 Cars', subtext: 'Removed from expressway lanes', icon: Car, accent: '#22D3EE' },
        { label: 'EV Fleet Priority', value: '100% Zero', subtext: 'Tailpipe emissions on EV corridors', icon: Zap, accent: '#0891B2' }
      ],
      insight: 'Sharing just 2 round-trips a month prevents over 600 kg of greenhouse gas emissions each year—equivalent to planting 28 mature trees.'
    }
  ];

  const activeStepData = timelineSteps[activeStep] || timelineSteps[0];

  const safetyPillars = [
    {
      icon: FileCheck,
      color: '#38BDF8',
      title: 'Mandatory 3-Tier Verification Gate',
      desc: '100% of pilots submit government-issued Aadhaar, Driving License, and Vehicle RC. Our operations desk audits each document before rides go live.'
    },
    {
      icon: Radio,
      color: '#10B981',
      title: 'Live Expressway Telemetry & Tracking',
      desc: 'Every trip is monitored in real-time on our Live Expressway Radar with instantaneous route deviation alerts and live speed telemetry.'
    },
    {
      icon: PhoneCall,
      color: '#EF4444',
      title: '24/7 Operations Desk & SOS Emergency Beacon',
      desc: 'Instant in-app SOS with direct connection to national emergency services (112) and our dedicated 24/7 Driveit Highway Ops Desk.'
    },
    {
      icon: Shield,
      color: '#84CC16',
      title: '₹5 Lakh Complimentary Trip Cover',
      desc: 'Every confirmed seat includes complimentary accidental & medical cover from boarding to drop-off powered by trusted insurance partners.'
    },
    {
      icon: Users,
      color: '#EC4899',
      title: 'Women-Only Commute Preferences',
      desc: 'Female commuters can choose exclusive Women-Only carpools for verified female-to-female intercity travel.'
    },
    {
      icon: Award,
      color: '#8B5CF6',
      title: 'Strict 4.7★ Rating & Trust Threshold',
      desc: 'Continuous two-way community review system. Drivers falling below 4.7★ are automatically de-listed from the platform.'
    },
    {
      icon: QrCode,
      color: '#10B981',
      title: 'Contactless QR Boarding Pass & OTP Verification',
      desc: 'Every booking produces an encrypted digital boarding pass with unique QR code. Pilots confirm passenger credentials at pickup.'
    },
    {
      icon: KeyRound,
      color: '#6366F1',
      title: 'Secure Contact Privacy & Number Masking',
      desc: 'Passenger and driver contact details are protected with secure coordination, preventing unwanted communication outside ride windows.'
    }
  ];

  // GSAP Smooth Scroll Interaction
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from('.cinematic-hero-text', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out'
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 90px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '48px',
        marginBottom: '72px',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Dynamic Animated Ambient Radial Highway Glows & Floating Orbs */}
      <style>{`
        @keyframes textGradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(-50%, -20%) scale(1); opacity: 0.6; }
          50% { transform: translate(-45%, -15%) scale(1.15); opacity: 0.85; }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
      `}</style>

      {/* Floating Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '50%',
        width: '600px',
        height: '280px',
        background: isDark 
          ? 'radial-gradient(circle, rgba(132, 204, 22, 0.12) 0%, rgba(16, 185, 129, 0.07) 45%, transparent 70%)'
          : 'radial-gradient(circle, rgba(132, 204, 22, 0.1) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 70%)',
        filter: 'blur(35px)',
        animation: 'orbFloat1 8s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 1. SECTION HERO HEADER */}
      <div 
        className="cinematic-hero-text"
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 20px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Top Floating Animated Pill Badge with StarBorder */}
        <div style={{ marginBottom: '10px', display: 'inline-block', animation: 'floatBadge 4s ease-in-out infinite' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(16, 185, 129, 0.12)',
            border: isDark ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1.5px solid #6EE7B7',
            color: '#10B981',
            padding: '5px 16px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '900',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            boxShadow: isDark ? '0 4px 16px rgba(16, 185, 129, 0.25)' : '0 4px 12px rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(12px)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px #10B981',
              animation: 'pulseDot 2s infinite'
            }} />
            <Sparkles size={13} />
            <ShinyText text="Why India Chooses Driveit Carpooling" speed={3} />
          </span>
        </div>

        {/* Main Section Heading with Living Flowing Gradient */}
        <h2 style={{
          fontSize: 'clamp(34px, 5vw, 50px)',
          fontWeight: '900',
          color: isDark ? '#FFFFFF' : '#0F172A',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          margin: '0 0 16px'
        }}>
          The Intelligent Journey:{' '}
          <span style={{
            background: 'linear-gradient(90deg, #84CC16, #10B981, #38BDF8, #84CC16)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'textGradientFlow 6s linear infinite',
            filter: 'drop-shadow(0 4px 16px rgba(132, 204, 22, 0.25))'
          }}>
            Economics, Ecology & Verified Safety
          </span>
        </h2>

        <p style={{
          fontSize: '17px',
          color: isDark ? '#94A3B8' : '#64748B',
          lineHeight: 1.7,
          margin: '0 auto 28px',
          maxWidth: '900px'
        }}>
          Converting empty highway seats into luxurious, ₹350 shared EV rides—slashing travel costs by 70% while taking thousands of cars off Indian expressways.
        </p>

        {/* Category Pill Filters with Rich Interactive Spring Animations */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          borderRadius: '22px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1.5px solid #CBD5E1',
          boxShadow: isDark ? '0 18px 40px rgba(0, 0, 0, 0.55)' : '0 12px 32px rgba(0, 0, 0, 0.09)',
          backdropFilter: 'blur(16px)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { id: 'ALL', label: 'Full Narrative', icon: Globe2 },
            { id: 'SAFETY', label: 'Safety & Trust 🛡️', icon: ShieldCheck },
            { id: 'COST', label: '70% Cost Savings 💰', icon: IndianRupee },
            { id: 'ECO', label: 'Green Impact 🌿', icon: Leaf },
            { id: 'SPEED', label: 'Speed & Network ⚡', icon: Zap }
          ].map(cat => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #84CC16, #65A30D)'
                    : 'transparent',
                  color: isSelected ? '#0E240B' : (isDark ? '#CBD5E1' : '#475569'),
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '13px 24px',
                  fontSize: '14.5px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  transition: 'all 180ms ease',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 18px rgba(132, 204, 22, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';
                    e.currentTarget.style.color = isDark ? '#FFFFFF' : '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = isDark ? '#CBD5E1' : '#475569';
                  }
                }}
              >
                <Icon size={17} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC SINGLE-SCREEN VIEWPORT CONTENT */}
      {activeCategory === 'SAFETY' ? (
        /* VIEW MODE A: 8-LAYER HIGHWAY SAFETY SHIELD (GRAND SCALE) */
        <div style={{
          background: isDark
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92))'
            : '#FFFFFF',
          border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1.5px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '28px',
          padding: '36px 44px',
          boxShadow: isDark
            ? '0 32px 65px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(56, 189, 248, 0.16)'
            : '0 20px 45px -5px rgba(56, 189, 248, 0.18)',
          backdropFilter: 'blur(24px)'
        }}>
          {/* Safety Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '30px',
            flexWrap: 'wrap',
            gap: '18px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                color: '#38BDF8',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: '800',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                <ShieldCheck size={16} />
                <span>Driveit Verified Safety Shield</span>
              </div>

              <h3 style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: '900',
                color: isDark ? '#FFFFFF' : '#0F172A',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                8-Layer Highway Security & Zero-Trust Protocol
              </h3>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: isDark ? 'rgba(0, 0, 0, 0.4)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
              padding: '12px 22px',
              borderRadius: '18px'
            }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 14px #10B981' }} />
              <div style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                100% ID Verified Fleet (UIDAI Audited)
              </div>
            </div>
          </div>

          {/* 8 Spotlight Safety Pillar Cards - Grand Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '18px'
          }}>
            {safetyPillars.map((sp, idx) => {
              const Icon = sp.icon;
              return (
                <SpotlightCard
                  key={idx}
                  spotlightColor={`${sp.color}25`}
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.035)' : '#F8FAFC',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                    borderRadius: '22px',
                    padding: '24px 26px',
                    display: 'flex',
                    gap: '18px',
                    alignItems: 'flex-start',
                    transition: 'all 180ms ease'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '16px',
                    background: `${sp.color}18`,
                    border: `1.5px solid ${sp.color}35`,
                    color: sp.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 14px ${sp.color}20`
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      margin: '0 0 6px'
                    }}>
                      {sp.title}
                    </h4>
                    <p style={{
                      fontSize: '13.5px',
                      color: isDark ? '#94A3B8' : '#64748B',
                      lineHeight: 1.6,
                      margin: 0
                    }}>
                      {sp.desc}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE B: HIGHWAY MILESTONE NARRATIVE (GRAND SCALE) */
        <div>
          {/* Grand Stepper Track */}
          <div style={{
            background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '18px 24px',
            marginBottom: '28px',
            boxShadow: isDark ? '0 20px 45px -10px rgba(0,0,0,0.6)' : '0 10px 28px -5px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${timelineSteps.length}, minmax(0, 1fr))`,
              gap: '14px'
            }}>
              {timelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                const isPassed = activeStep > idx;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    style={{
                      background: isActive
                        ? (isDark ? 'rgba(132, 204, 22, 0.16)' : 'rgba(132, 204, 22, 0.12)')
                        : (isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC'),
                      border: isActive
                        ? '2.5px solid #84CC16'
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                      borderRadius: '18px',
                      padding: '16px 14px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: isActive ? '0 8px 24px -2px rgba(132, 204, 22, 0.35)' : 'none',
                      transform: isActive ? 'translateY(-2px)' : 'none',
                      transition: 'all 180ms ease'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: isActive ? 'linear-gradient(135deg, #84CC16, #65A30D)' : (isPassed ? 'rgba(132, 204, 22, 0.2)' : `${step.badgeColor}18`),
                      color: isActive ? '#0E240B' : (isPassed ? '#84CC16' : step.badgeColor),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '900',
                      flexShrink: 0
                    }}>
                      <Icon size={20} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '800',
                        color: isActive ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#CBD5E1' : '#475569'),
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {step.title.split(' ').slice(0, 2).join(' ')}
                      </div>
                      <div style={{ fontSize: '11px', color: step.badgeColor, fontWeight: '800', textTransform: 'uppercase', marginTop: '3px' }}>
                        {step.badge.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Deep-Dive Card (Grand Scale) */}
          <div style={{
            background: isDark
              ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(24, 33, 53, 0.92))'
              : '#FFFFFF',
            border: isDark ? `1.5px solid ${activeStepData.badgeColor}40` : `1.5px solid ${activeStepData.badgeColor}50`,
            borderRadius: '28px',
            padding: '40px 48px',
            boxShadow: isDark
              ? `0 32px 65px -15px rgba(0, 0, 0, 0.8), 0 0 45px ${activeStepData.glowColor}`
              : `0 18px 40px -5px rgba(0, 0, 0, 0.12)`,
            backdropFilter: 'blur(24px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
              gap: '36px',
              alignItems: 'center'
            }}>
              {/* Left Column: Narrative & Comparison */}
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: `${activeStepData.badgeColor}18`,
                  border: `1.5px solid ${activeStepData.badgeColor}40`,
                  color: activeStepData.badgeColor,
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  <span>STEP {activeStepData.stepNumber} • {activeStepData.badge}</span>
                </div>

                <h3 style={{
                  fontSize: 'clamp(22px, 2.8vw, 28px)',
                  fontWeight: '900',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  margin: '0 0 10px 0',
                  lineHeight: 1.25
                }}>
                  {activeStepData.title}
                </h3>

                <p style={{
                  fontSize: '15.5px',
                  color: isDark ? '#94A3B8' : '#64748B',
                  lineHeight: 1.65,
                  margin: '0 0 24px'
                }}>
                  {activeStepData.description}
                </p>

                {/* Side-by-Side Comparison Box */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  background: isDark ? 'rgba(0, 0, 0, 0.35)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '18px 24px'
                }}>
                  <div style={{ borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', paddingRight: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ✖ {activeStepData.comparison.solo.label}
                    </div>
                    <div style={{ fontSize: '19px', fontWeight: '900', color: isDark ? '#FCA5A5' : '#DC2626' }}>
                      {activeStepData.comparison.solo.cost}
                    </div>
                    <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px' }}>
                      {activeStepData.comparison.solo.emission}
                    </div>
                  </div>

                  <div style={{ paddingLeft: '14px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ✓ {activeStepData.comparison.driveit.label}
                    </div>
                    <div style={{ fontSize: '19px', fontWeight: '900', color: '#10B981' }}>
                      {activeStepData.comparison.driveit.cost}
                    </div>
                    <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px' }}>
                      {activeStepData.comparison.driveit.emission}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 3 Metric Cards + Navigation Arrows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {activeStepData.stats.map((stat, i) => {
                    const SIcon = stat.icon;
                    return (
                      <div
                        key={i}
                        style={{
                          background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                          borderRadius: '20px',
                          padding: '18px 14px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: `${stat.accent}18`,
                          color: stat.accent,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px'
                        }}>
                          <SIcon size={19} />
                        </div>
                        <div style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', lineHeight: 1.1 }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '12.5px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '5px', fontWeight: '600' }}>
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Insight Quote & Stepper Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F1F5F9',
                  borderRadius: '18px',
                  padding: '16px 24px',
                  gap: '18px'
                }}>
                  <div style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', fontStyle: 'italic', flex: 1, lineHeight: 1.5 }}>
                    💡 "{activeStepData.insight}"
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                    <button
                      type="button"
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                      style={{
                        background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                        borderRadius: '14px',
                        padding: '10px 20px',
                        fontSize: '13.5px',
                        fontWeight: '800',
                        cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeStep === 0 ? 0.35 : 1,
                        transition: 'all 150ms ease'
                      }}
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      disabled={activeStep === timelineSteps.length - 1}
                      onClick={() => setActiveStep(prev => Math.min(timelineSteps.length - 1, prev + 1))}
                      style={{
                        background: 'linear-gradient(135deg, #84CC16, #65A30D)',
                        border: 'none',
                        color: '#0E240B',
                        borderRadius: '9999px',
                        padding: '10px 24px',
                        fontSize: '13.5px',
                        fontWeight: '900',
                        cursor: activeStep === timelineSteps.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeStep === timelineSteps.length - 1 ? 0.35 : 1,
                        transition: 'all 150ms ease',
                        boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)'
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
