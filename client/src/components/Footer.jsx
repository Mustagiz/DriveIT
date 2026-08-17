import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  FileText,
  Lock,
  ExternalLink,
  Copy,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Send,
  Radio,
  Clock,
  Shield
} from 'lucide-react';
import { SpotlightCard } from './ui';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import LegalComplianceModal from './LegalComplianceModal';
import styles from './Footer.module.css';

export default function Footer({ onNavigate }) {
  const { isDark } = useTheme();
  const { addToast } = useToast();

  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'cookies' | 'safety' | 'help' | 'contact' | null
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Subscribed to Expressway Fare Alerts & Green Highway corridors!', 'success');
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast(`Copied ${text} to clipboard!`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const faqs = [
    {
      q: 'How are passenger seat fares calculated on Driveit?',
      a: 'Driveit uses calibrated cost-sharing models complying with Section 66 of the Motor Vehicles Act. Fares are capped strictly to share direct fuel and FASTag expressway toll expenses (₹3.06/km for EVs, ₹3.50/km for Diesel CRDi, ₹3.75/km for Petrol). Drivers cannot earn commercial profits, ensuring non-commercial carpool compliance.'
    },
    {
      q: 'What is the 3-Tier Document Audit Gate for Expressway Pilots?',
      a: 'Before any vehicle owner can post empty seats, our Operations Desk audits: (1) UIDAI Aadhaar identity with Verhoeff checksum validation, (2) Valid Driving License with active transport endorsement, and (3) Vehicle Registration Certificate (RC) verifying BS-VI or EV compliance.'
    },
    {
      q: 'How does the FASTag & Boarding Pass safety system work?',
      a: 'Every confirmed ride generates an encrypted digital Boarding Pass with a 4-digit safety PIN and encrypted QR code. When meeting at highway pickup points, the passenger shows their PIN, preventing unauthorized pickups.'
    },
    {
      q: 'What happens if a pilot cancels a scheduled trip?',
      a: 'Pilots with cancellation rates above 3% receive automated trust penalty deductions. Commuters are instantly notified and priority-reassigned to alternate verified vehicles on the same corridor with full fare protection.'
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className="container container-wide">
        {/* PROMINENT "BECOME A PILOT" CALL-TO-ACTION BANNER */}
        <div style={{ marginBottom: '32px' }}>
          <SpotlightCard
            spotlightColor={isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)'}
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)'
                : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
              border: isDark ? '1.5px solid rgba(16, 185, 129, 0.35)' : '1.5px solid #86EFAC',
              borderRadius: '24px',
              padding: '24px 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: isDark ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 10px 30px -5px rgba(16, 185, 129, 0.12)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flex: 1, minWidth: '280px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
              }}>
                <Car size={26} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '900',
                    color: '#059669',
                    background: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Car Owners & Commuters
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <CheckCircle2 size={12} /> 100% Tolls Recovered
                  </span>
                </div>
                <h3 style={{ fontSize: 'clamp(17px, 2.3vw, 22px)', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                  Become an Expressway Pilot on Driveit
                </h3>
                <p style={{ fontSize: '12.5px', color: isDark ? '#94A3B8' : '#475569', margin: '4px 0 0 0', maxWidth: '640px' }}>
                  Drive your regular intercity highway routes, list empty car seats, and offset fuel & FASTag toll expenses with verified corporate passengers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('auth-pilot')}
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 22px',
                fontSize: '13px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)',
                transition: 'all 150ms ease',
                flexShrink: 0
              }}
            >
              <span>Register as a Pilot</span>
              <ArrowRight size={16} />
            </button>
          </SpotlightCard>
        </div>

        {/* MAIN FOOTER NAVIGATION GRID */}
        <div className={styles.grid}>
          {/* Brand & Newsletter Column */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className={styles.brandTitle}>Driveit</span>
                <span style={{ fontSize: '10px', fontWeight: '900', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '2px 6px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  Live Radar
                </span>
              </div>
              <p className={styles.brandDescription}>
                India's trusted intercity carpool platform. Safe, affordable, and sustainable travel across national expressways.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div style={{ marginTop: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#F59E0B' : '#D97706', textTransform: 'uppercase', marginBottom: '6px' }}>
                Expressway Fare Alerts
              </div>
              {subscribed ? (
                <div style={{ fontSize: '12px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Subscribed with {newsletterEmail}</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      color: isDark ? '#FFFFFF' : '#0F172A',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Subscribe"
                  >
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>

            {/* Trust Icons */}
            <div className={styles.trustIcons} style={{ marginTop: '16px' }}>
              {[
                { icon: ShieldCheck, title: '100% ID Verified (UIDAI + RTO)', onClick: () => setActiveModal('safety') },
                { icon: Zap, title: 'EV Fastag Automated Matching', onClick: () => setActiveModal('help') },
                { icon: Users, title: '24,000+ Verified Highway Commuters', onClick: () => onNavigate && onNavigate('home') }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={item.onClick}
                    className={styles.trustIcon}
                    title={item.title}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commuter Services Column */}
          <div>
            <h4 className={styles.columnTitle}>Commuter Services</h4>
            <ul className={styles.linkList}>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('home')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Find Verified Highway Rides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('auth-pilot')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Post a Ride & Offset Tolls
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate && onNavigate('home');
                    addToast('Filtered for Verified Women-Only Carpools', 'info');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Women-Only Carpools
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('help')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Dynamic Pricing & Fare Rules
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('terms')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  FASTag Expense Sharing Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Links Column */}
          <div>
            <h4 className={styles.columnTitle}>Platform & Safety</h4>
            <ul className={styles.linkList}>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('home')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Find Highway Rides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('auth-pilot')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#D97706', fontWeight: '800', cursor: 'pointer', textAlign: 'left' }}
                >
                  Become an Expressway Pilot ➔
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('safety')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Safety Shield & 3-Tier Gate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('help')}
                  style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'inherit', cursor: 'pointer', textAlign: 'left' }}
                >
                  Help Center & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Column */}
          <div>
            <h4 className={styles.columnTitle}>24/7 Operations Desk</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPin size={14} className={styles.contactIcon} />
                <span>Expressway Ops, Mumbai, India</span>
              </li>

              <li className={styles.contactItem}>
                <Phone size={14} className={styles.contactIcon} />
                <span 
                  onClick={() => handleCopy('+91 98201 12345', 'phone')}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Click to copy emergency line"
                >
                  <span>+91 98201 12345</span>
                  {copiedKey === 'phone' ? <Check size={12} color="#10B981" /> : <Copy size={12} color="#94A3B8" />}
                </span>
              </li>

              <li className={styles.contactItem}>
                <Mail size={14} className={styles.contactIcon} />
                <span 
                  onClick={() => handleCopy('hello@driveit.in', 'email')}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  title="Click to copy support email"
                >
                  <span>hello@driveit.in</span>
                  {copiedKey === 'email' ? <Check size={12} color="#10B981" /> : <Copy size={12} color="#94A3B8" />}
                </span>
              </li>

              <li style={{ marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveModal('contact')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    color: '#3B82F6',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Shield size={12} />
                  <span>Report Safety Incident</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & LEGAL COMPLIANCE LINKS */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2026 Driveit Intercity Carpool Platform. Non-commercial cost-sharing compliant under Indian Motor Vehicles Act.
          </p>
          <div className={styles.bottomLinks}>
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              Terms of Service
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('cookies')}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '13px', cursor: 'pointer', padding: 0 }}
            >
              Cookie & Data Policy
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* INTERACTIVE LEGAL & HELP MODALS                                       */}
      {/* ===================================================================== */}

      {/* 1. UNIFIED LEGAL & TRUST CENTER MODAL */}
      {(activeModal === 'privacy' || activeModal === 'terms' || activeModal === 'cookies' || activeModal === 'safety') && (
        <LegalComplianceModal
          initialTab={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* 5. HELP CENTER & FAQS MODAL */}
      {activeModal === 'help' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle size={20} color="#F59E0B" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Help Center & FAQs
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    style={{
                      borderRadius: '14px',
                      background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                      style={{
                        width: '100%',
                        padding: '14px 18px',
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: isDark ? '#FFFFFF' : '#0F172A',
                        fontSize: '13px',
                        fontWeight: '800'
                      }}
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp size={16} color="#F59E0B" /> : <ChevronDown size={16} color="#94A3B8" />}
                    </button>
                    {openFaq === idx && (
                      <div style={{ padding: '0 18px 16px', fontSize: '12.5px', color: isDark ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9', textAlign: 'right' }}>
              <button onClick={() => setActiveModal(null)} style={{ background: '#F59E0B', color: '#000000', border: 'none', borderRadius: '10px', padding: '8px 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                Close FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONTACT & REPORT ISSUE MODAL */}
      {activeModal === 'contact' && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#1E293B' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '20px 24px', borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#EF4444" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  24/7 Incident & Support Desk
                </h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              addToast('Incident ticket dispatched to Operations Desk #7741. Response ETA < 5 mins.', 'success');
              setActiveModal(null);
            }} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Issue Type
                </label>
                <select style={{ width: '100%', padding: '10px', borderRadius: '10px', background: isDark ? '#0F172A' : '#F1F5F9', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1', color: isDark ? '#FFF' : '#000', fontSize: '13px' }}>
                  <option>Highway Trip Delay / Reroute</option>
                  <option>Pilot / Passenger Verification Query</option>
                  <option>FASTag Toll Dispute</option>
                  <option>Emergency SOS Assistance</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Incident Description
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Describe your highway journey issue or feedback..." 
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', background: isDark ? '#0F172A' : '#F1F5F9', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #CBD5E1', color: isDark ? '#FFF' : '#000', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#EF4444', color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
                Submit to Safety Dispatch
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
