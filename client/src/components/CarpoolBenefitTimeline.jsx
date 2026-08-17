import React, { useState, useEffect } from 'react';
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
  ChevronRight, 
  TrendingDown, 
  Clock, 
  Shield, 
  Award, 
  Lock, 
  PhoneCall, 
  CheckCircle2, 
  HeartHandshake, 
  AlertTriangle, 
  FileCheck, 
  Radio,
  QrCode,
  KeyRound,
  ArrowUpRight,
  Route,
  Activity,
  Trees
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SpotlightCard, ShinyText, DecryptedText } from './ui';

export default function CarpoolBenefitTimeline() {
  const { isDark } = useTheme();

  // Active timeline step
  const [activeStep, setActiveStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState('ALL'); // 'ALL', 'SAFETY', 'COST', 'ECO', 'SPEED'
  const [isAutoPlay, setIsAutoPlay] = useState(false);

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
        { label: 'FASTag Expressway Speed', value: '100%', subtext: 'Automated toll lane transit', icon: Zap, accent: '#10B981' }
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
        { label: 'Monthly Commuter Savings', value: '₹8,200', subtext: 'Based on 4 weekend return trips', icon: TrendingDown, accent: '#34D399' },
        { label: 'Pilot Toll Recovery', value: '100%', subtext: 'Highway FASTag tolls fully offset', icon: CheckCircle2, accent: '#059669' }
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
      description: 'Every Driveit carpool replaces up to 3 individual vehicles on congested expressways. Prioritizing electric sedans like Tata Nexon EV and MG ZS EV cuts net tailpipe emissions to zero along key highway corridors.',
      comparison: {
        solo: { label: '3 Solo Petrol Sedans', cost: '79.2 kg CO₂ Emitted', emission: 'Heavy Expressway Smog', emptySeats: '3 Toll Booth Queues' },
        driveit: { label: '1 Shared Electric Carpool', cost: '0 kg Tailpipe CO₂', emission: '-78% Net Footprint', emptySeats: '1 Streamlined Car' }
      },
      stats: [
        { label: 'Net CO₂ Reduction', value: '-78%', subtext: 'Lower emissions per passenger-km', icon: Leaf, accent: '#06B6D4' },
        { label: 'Toll Congestion Relief', value: '-3 Cars', subtext: 'Removed from expressway lanes', icon: Car, accent: '#22D3EE' },
        { label: 'EV Fleet Priority', value: '100% Zero', subtext: 'Tailpipe emissions on EV corridors', icon: Zap, accent: '#0891B2' }
      ],
      insight: 'Sharing just 2 round-trips a month prevents over 600 kg of greenhouse gas emissions each year—equivalent to planting 28 mature trees.'
    },
    {
      id: 5,
      stepNumber: '06',
      category: 'SPEED',
      badge: 'THE NATIONWIDE GREEN NETWORK',
      badgeColor: '#8B5CF6',
      glowColor: 'rgba(139, 92, 246, 0.25)',
      icon: Globe2,
      title: 'Building India’s Sustainable Expressway Grid',
      tagline: 'A connected community of conscious professionals traveling across India.',
      description: 'From Mumbai-Pune and Delhi-Jaipur to Bengaluru-Chennai and Hyderabad-Vijayawada, Driveit is creating the gold standard for reliable, high-trust, low-emission intercity carpooling.',
      comparison: {
        solo: { label: 'Fragmented Solo Highway Travel', cost: '₹14,000/yr Toll Loss', emission: 'Tons of CO₂ Waste', emptySeats: 'Disconnected Network' },
        driveit: { label: 'Connected Driveit Network', cost: '₹1.4 Cr Saved', emission: '48+ Tons CO₂ Offset', emptySeats: '156+ Active Corridors' }
      },
      stats: [
        { label: 'Active Express Corridors', value: '156+', subtext: 'Connecting major Indian metro hubs', icon: Globe2, accent: '#8B5CF6' },
        { label: 'Verified EV & Hybrid Pilots', value: '2,800+', subtext: 'Trained executive drivers', icon: Users, accent: '#A78BFA' },
        { label: 'Community Trust Score', value: '4.92 ★', subtext: 'Verified rider satisfaction', icon: Award, accent: '#C084FC' }
      ],
      insight: 'Together, our verified rider community has saved over 48 tons of CO₂ and ₹1.4 Crore in highway travel costs.'
    }
  ];

  const filteredSteps = activeCategory === 'ALL'
    ? timelineSteps
    : timelineSteps.filter(s => s.category === activeCategory);

  const activeStepData = timelineSteps[activeStep] || timelineSteps[0];

  const safetyPillars = [
    {
      icon: FileCheck,
      color: '#38BDF8',
      title: 'Mandatory 3-Tier Verification Gate',
      desc: '100% of pilots submit government-issued Aadhaar, Driving License, and Vehicle RC. Our operations desk audits and verifies each document before any ride can be published.'
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
      desc: 'Instant in-app SOS with direct 1-tap connection to national emergency services (112) and our dedicated 24/7 Driveit Highway Ops Desk.'
    },
    {
      icon: Shield,
      color: '#84CC16',
      title: '₹5 Lakh Complimentary Trip Cover',
      desc: 'Every confirmed seat includes comprehensive complimentary accidental & medical cover from boarding to drop-off powered by trusted insurance partners.'
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
      desc: 'Continuous two-way community review system. Drivers falling below our 4.7★ safety standard are automatically de-listed from the platform.'
    },
    {
      icon: QrCode,
      color: '#10B981',
      title: 'Contactless QR Boarding Pass & OTP Verification',
      desc: 'Every booking produces an encrypted digital boarding pass with unique QR verification. Pilots confirm passenger credentials at pickup before vehicle departure.'
    },
    {
      icon: KeyRound,
      color: '#6366F1',
      title: 'Secure Contact Privacy & Number Protection',
      desc: 'Passenger and driver contact details are protected with secure in-app direct coordination, preventing unwanted communication outside scheduled ride windows.'
    }
  ];

  return (
    <section style={{
      marginTop: '32px',
      marginBottom: '60px',
      position: 'relative'
    }}>
      {/* Background Ambient Radial Glows */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: isDark 
          ? 'radial-gradient(circle, rgba(132, 204, 22, 0.08) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(132, 204, 22, 0.08) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* 1. SECTION HERO HEADER */}
      <div style={{
        textAlign: 'center',
        maxWidth: '820px',
        margin: '0 auto 40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Top Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: isDark ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#10B981',
          padding: '6px 16px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '800',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '16px',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
          backdropFilter: 'blur(12px)'
        }}>
          <Sparkles size={14} />
          <span>Why India Chooses Driveit Carpooling</span>
        </div>

        {/* Main Section Heading with Dual Gradient */}
        <h2 style={{
          fontSize: 'clamp(26px, 3.8vw, 40px)',
          fontWeight: '900',
          color: isDark ? '#FFFFFF' : '#0F172A',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 16px'
        }}>
          The Intelligent Journey:{' '}
          <span style={{
            background: 'linear-gradient(135deg, #84CC16 0%, #10B981 50%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Economics, Ecology & Verified Safety
          </span>
        </h2>

        <p style={{
          fontSize: '15px',
          color: isDark ? '#94A3B8' : '#64748B',
          lineHeight: 1.65,
          margin: '0 auto 24px',
          maxWidth: '680px'
        }}>
          How Driveit converts empty highway seats into luxurious, ₹350 shared EV rides—slashing travel costs by 70% while taking thousands of cars off Indian expressways.
        </p>

        {/* Interactive Category Filter Pills */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          padding: '5px',
          borderRadius: '16px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1.5px solid #CBD5E1',
          boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.06)',
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
                    ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)'
                    : 'transparent',
                  color: isSelected ? '#000000' : (isDark ? '#CBD5E1' : '#475569'),
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 180ms ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(132, 204, 22, 0.35)' : 'none'
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HIGHWAY MILESTONE PROGRESS TRACK */}
      <div style={{
        background: isDark ? 'rgba(15, 23, 42, 0.8)' : '#FFFFFF',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: '24px 20px',
        marginBottom: '32px',
        boxShadow: isDark ? '0 25px 50px -15px rgba(0,0,0,0.6)' : '0 10px 30px -5px rgba(0,0,0,0.06)',
        backdropFilter: 'blur(20px)',
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${timelineSteps.length}, minmax(0, 1fr))`,
          gap: '12px'
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
                    ? '2px solid #84CC16'
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
                  borderRadius: '18px',
                  padding: '14px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: isActive ? '0 8px 24px -4px rgba(132, 204, 22, 0.3)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                {/* Step Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '11px',
                    background: isActive ? '#84CC16' : (isPassed ? 'rgba(16, 185, 129, 0.2)' : `${step.badgeColor}18`),
                    color: isActive ? '#000000' : (isPassed ? '#10B981' : step.badgeColor),
                    border: `1px solid ${isActive ? '#84CC16' : `${step.badgeColor}35`}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '13px',
                    boxShadow: isActive ? '0 0 14px rgba(132, 204, 22, 0.5)' : 'none'
                  }}>
                    <Icon size={16} />
                  </div>
                  
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '900',
                    color: isActive ? '#84CC16' : (isDark ? '#64748B' : '#94A3B8'),
                    background: isActive ? 'rgba(132, 204, 22, 0.15)' : 'transparent',
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}>
                    STEP {step.stepNumber}
                  </span>
                </div>

                {/* Step Titles */}
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: isActive ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#CBD5E1' : '#475569'),
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {step.title.split(' ').slice(0, 3).join(' ')}
                  </div>
                  <div style={{
                    fontSize: '9px',
                    color: step.badgeColor,
                    fontWeight: '800',
                    marginTop: '3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textTransform: 'uppercase'
                  }}>
                    {step.badge}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. HERO ACTIVE MILESTONE DEEP-DIVE CARD */}
      <div style={{
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(24, 33, 53, 0.92))'
          : '#FFFFFF',
        border: isDark ? `1.5px solid ${activeStepData.badgeColor}40` : `1.5px solid ${activeStepData.badgeColor}50`,
        borderRadius: '28px',
        padding: '38px',
        marginBottom: '36px',
        boxShadow: isDark
          ? `0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px ${activeStepData.glowColor}`
          : '0 20px 45px -10px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(24px)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 300ms ease'
      }}>
        {/* Luminous Ambient Glow in Corner */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '260px',
          height: '260px',
          background: `radial-gradient(circle, ${activeStepData.badgeColor}30 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Top Header Badge Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '900',
              padding: '6px 16px',
              borderRadius: '12px',
              background: `${activeStepData.badgeColor}20`,
              color: activeStepData.badgeColor,
              border: `1.5px solid ${activeStepData.badgeColor}50`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textTransform: 'uppercase',
              boxShadow: `0 4px 16px ${activeStepData.glowColor}`
            }}>
              ● STAGE {activeStepData.stepNumber} • {activeStepData.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700' }}>
              Milestone {activeStep + 1} of {timelineSteps.length}
            </span>
            <div style={{
              width: '80px',
              height: '6px',
              background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${((activeStep + 1) / timelineSteps.length) * 100}%`,
                height: '100%',
                background: activeStepData.badgeColor,
                transition: 'width 300ms ease'
              }} />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h3 style={{
          fontSize: 'clamp(24px, 3.2vw, 32px)',
          fontWeight: '900',
          color: isDark ? '#FFFFFF' : '#0F172A',
          lineHeight: 1.22,
          margin: '0 0 10px',
          letterSpacing: '-0.02em'
        }}>
          {activeStepData.title}
        </h3>

        <p style={{
          fontSize: '16px',
          fontWeight: '700',
          color: activeStepData.badgeColor,
          margin: '0 0 16px'
        }}>
          {activeStepData.tagline}
        </p>

        <p style={{
          fontSize: '15px',
          color: isDark ? '#CBD5E1' : '#475569',
          lineHeight: 1.7,
          margin: '0 0 28px',
          maxWidth: '920px'
        }}>
          {activeStepData.description}
        </p>

        {/* BEFORE VS AFTER HIGHWAY COMPARISON BOX */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {/* Solo Commute Reality */}
          <div style={{
            background: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.06)',
            border: isDark ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '18px',
            padding: '18px 20px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ❌ SOLO COMMUTE / PRIVATE TAXI
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#EF4444' : '#DC2626', fontWeight: '800' }}>
                Inefficient
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>
              {activeStepData.comparison.solo.label}
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#FCA5A5' : '#7F1D1D', display: 'flex', gap: '12px', marginTop: '6px' }}>
              <span>💸 {activeStepData.comparison.solo.cost}</span>
              <span>•</span>
              <span>💨 {activeStepData.comparison.solo.emission}</span>
            </div>
          </div>

          {/* Driveit Shared EV Reality */}
          <div style={{
            background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
            border: isDark ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '18px',
            padding: '18px 20px',
            boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚡ DRIVEIT SHARED EV CARPOOL
              </span>
              <span style={{ fontSize: '11px', fontWeight: '900', background: '#10B981', color: '#000000', padding: '2px 8px', borderRadius: '6px' }}>
                -70% SAVINGS
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>
              {activeStepData.comparison.driveit.label}
            </div>
            <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '700', display: 'flex', gap: '12px', marginTop: '6px' }}>
              <span>💰 {activeStepData.comparison.driveit.cost}</span>
              <span>•</span>
              <span>🌿 {activeStepData.comparison.driveit.emission}</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '28px'
        }}>
          {activeStepData.stats.map((st, i) => {
            const StatIcon = st.icon;
            return (
              <div
                key={i}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                  borderRadius: '18px',
                  padding: '20px 22px',
                  transition: 'all 180ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                  <StatIcon size={14} color={st.accent} />
                  <span>{st.label}</span>
                </div>
                <div style={{
                  fontSize: '26px',
                  fontWeight: '900',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  margin: '8px 0 3px'
                }}>
                  <DecryptedText 
                    text={st.value} 
                    animateOn="hover" 
                    speed={35} 
                    characters="0123456789₹+%★<->" 
                  />
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8', lineHeight: 1.35 }}>
                  {st.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Insight Quote & Prev/Next Controls */}
        <div style={{
          background: isDark ? 'rgba(132, 204, 22, 0.08)' : 'rgba(132, 204, 22, 0.1)',
          border: isDark ? '1px solid rgba(132, 204, 22, 0.28)' : '1px solid rgba(132, 204, 22, 0.38)',
          borderRadius: '18px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
            <Sparkles size={20} color="#84CC16" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: isDark ? '#F1F5F9' : '#1E293B', fontWeight: '600', lineHeight: 1.45 }}>
              <strong style={{ color: '#84CC16' }}>Highway Commute Fact:</strong> {activeStepData.insight}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid #CBD5E1',
                color: isDark ? '#FFFFFF' : '#0F172A',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                opacity: activeStep === 0 ? 0.35 : 1,
                transition: 'all 150ms ease'
              }}
            >
              ← Prev Stage
            </button>
            <button
              type="button"
              disabled={activeStep === timelineSteps.length - 1}
              onClick={() => setActiveStep(prev => Math.min(timelineSteps.length - 1, prev + 1))}
              style={{
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                border: 'none',
                color: '#000000',
                borderRadius: '12px',
                padding: '8px 20px',
                fontSize: '12px',
                fontWeight: '900',
                cursor: activeStep === timelineSteps.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeStep === timelineSteps.length - 1 ? 0.35 : 1,
                transition: 'all 150ms ease',
                boxShadow: '0 6px 18px rgba(132, 204, 22, 0.35)'
              }}
            >
              Next Stage →
            </button>
          </div>
        </div>
      </div>

      {/* 4. DRIVEIT VERIFIED SAFETY SHIELD: 8-LAYER HIGHWAY STANDARD */}
      <div style={{
        marginTop: '44px',
        background: isDark
          ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92))'
          : '#FFFFFF',
        border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1.5px solid rgba(56, 189, 248, 0.4)',
        borderRadius: '28px',
        padding: '40px 36px',
        boxShadow: isDark
          ? '0 30px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.12)'
          : '0 15px 35px -5px rgba(56, 189, 248, 0.15)',
        backdropFilter: 'blur(24px)'
      }}>
        {/* Safety Header Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38BDF8',
              padding: '5px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '800',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              <ShieldCheck size={14} />
              <span>Driveit Verified Safety Shield</span>
            </div>

            <h3 style={{
              fontSize: 'clamp(22px, 3vw, 28px)',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              How Safe is Driveit? <span style={{ color: '#38BDF8' }}>Our 8-Layer Highway Security Standard</span>
            </h3>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: isDark ? 'rgba(0, 0, 0, 0.4)' : '#F8FAFC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
            padding: '10px 18px',
            borderRadius: '16px'
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                100% ID Verified Fleet
              </div>
              <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Audited by Operations Desk
              </div>
            </div>
          </div>
        </div>

        {/* 8 Safety Pillar Cards Grid */}
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
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  transition: 'all 180ms ease'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: `${sp.color}18`,
                  border: `1.5px solid ${sp.color}35`,
                  color: sp.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  boxShadow: `0 4px 14px ${sp.color}20`
                }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '800',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    margin: '0 0 6px'
                  }}>
                    {sp.title}
                  </h4>
                  <p style={{
                    fontSize: '12px',
                    color: isDark ? '#94A3B8' : '#64748B',
                    lineHeight: 1.55,
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
    </section>
  );
}
