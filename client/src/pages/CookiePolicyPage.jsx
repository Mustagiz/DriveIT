import React, { useState } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Database, 
  Sliders, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  HardDrive,
  Check
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/Toast';

export default function CookiePolicyPage({ onNavigate, onBack }) {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    telemetry: true,
    marketing: false
  });
  const [saved, setSaved] = useState(false);

  const handleSavePreferences = () => {
    localStorage.setItem('driveit_cookie_consent', JSON.stringify(preferences));
    setSaved(true);
    addToast('Cookie & Data preferences updated successfully', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('home');
    } else if (onBack) {
      onBack();
    } else {
      window.location.hash = '#/home';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-primary, #F8FAFC)',
      color: 'var(--color-text-primary, #0F172A)',
      padding: '40px 20px 80px',
      fontFamily: 'var(--font-body, Inter, system-ui, sans-serif)'
    }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        
        {/* Back Navigation Button */}
        <button
          type="button"
          onClick={handleBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #CBD5E1',
            color: isDark ? '#E2E8F0' : '#1E293B',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '28px',
            transition: 'all 150ms ease'
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Home</span>
        </button>

        {/* Hero Header */}
        <div style={{
          background: isDark 
            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)' 
            : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
          border: isDark ? '1.5px solid rgba(255, 255, 255, 0.1)' : '1.5px solid #E2E8F0',
          borderRadius: '28px',
          padding: '40px clamp(20px, 4vw, 36px)',
          marginBottom: '32px',
          boxShadow: isDark ? '0 20px 40px -15px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F59E0B',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            <Cookie size={15} />
            <span>Browser Storage & Telemetry Policy</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(26px, 3.5vw, 34px)',
            fontWeight: '900',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em',
            color: isDark ? '#FFFFFF' : '#0F172A'
          }}>
            Cookie & Local Data Storage Policy
          </h1>

          <p style={{
            fontSize: '14.5px',
            color: isDark ? '#94A3B8' : '#64748B',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Last Updated: August 19, 2026 • Learn how DriveIT stores essential session tokens, real-time GPS telemetry cache, and local preferences to ensure fast and secure intercity carpooling.
          </p>
        </div>

        {/* Section 1: Overview */}
        <div style={{
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '30px clamp(18px, 3vw, 28px)',
          marginBottom: '24px',
          lineHeight: '1.7'
        }}>
          <h2 style={{
            fontSize: '19px',
            fontWeight: '800',
            margin: '0 0 14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isDark ? '#FFFFFF' : '#0F172A'
          }}>
            <Database size={20} color="#84CC16" />
            1. What Are Cookies and Local Storage?
          </h2>
          <p style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 14px' }}>
            Cookies and browser storage mechanisms (such as <code>localStorage</code> and <code>sessionStorage</code>) are small data files placed on your device. DriveIT uses these strictly to keep you securely signed in, cache active route navigation, store your display theme preferences, and sync real-time GPS coordinates during an active highway trip.
          </p>
          <p style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#475569', margin: 0 }}>
            <strong>Zero Third-Party Ad Trackers:</strong> DriveIT does not utilize cross-site tracking cookies, third-party advertising pixels, or data-brokering beacons.
          </p>
        </div>

        {/* Section 2: Data Storage Breakdown */}
        <div style={{
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '30px clamp(18px, 3vw, 28px)',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '19px',
            fontWeight: '800',
            margin: '0 0 18px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isDark ? '#FFFFFF' : '#0F172A'
          }}>
            <HardDrive size={20} color="#3B82F6" />
            2. Categories of Data Stored on Your Device
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Essential Category */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  🔑 Strictly Essential Storage (Always Required)
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 10px', lineHeight: '1.5' }}>
                Required for core security, user authentication, and boarding pass PIN delivery. Without these, the application cannot maintain your session.
              </p>
              <div style={{ fontSize: '12px', color: isDark ? '#A7CBB4' : '#4D7C0F', fontFamily: 'monospace' }}>
                Keys: <code>rideshare_token</code> (Encrypted JWT), <code>rideshare_user</code> (Profile), <code>driveit_active_trip</code>
              </div>
            </div>

            {/* Functional Category */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  ⚙️ Functional & UI Preferences
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 10px', lineHeight: '1.5' }}>
                Remembers your chosen display theme (Dark/Light mode), preferred language, highway search filters, and quick dashboard views.
              </p>
              <div style={{ fontSize: '12px', color: isDark ? '#A7CBB4' : '#4D7C0F', fontFamily: 'monospace' }}>
                Keys: <code>driveit_theme</code>, <code>driveit_lang</code>, <code>driveit_saved_corridor</code>
              </div>
            </div>

            {/* Telemetry Category */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  🛰️ In-Trip Live Radar & GPS Telemetry
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', background: 'rgba(132, 204, 22, 0.15)', color: '#84CC16' }}>
                  ACTIVE
                </span>
              </div>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 10px', lineHeight: '1.5' }}>
                Caches high-frequency Socket.io telemetry packet streams (Speed, Bearing, Distance to Destination, Collision Anti-Crash vector) for zero-latency radar updates.
              </p>
              <div style={{ fontSize: '12px', color: isDark ? '#A7CBB4' : '#4D7C0F', fontFamily: 'monospace' }}>
                Keys: <code>driveit_telemetry_cache</code>, <code>driveit_corridor_bbox</code>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Consent Controls */}
        <div style={{
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '30px clamp(18px, 3vw, 28px)',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '19px',
            fontWeight: '800',
            margin: '0 0 14px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: isDark ? '#FFFFFF' : '#0F172A'
          }}>
            <Sliders size={20} color="#F59E0B" />
            3. Manage Your Local Storage Consent
          </h2>
          
          <p style={{ fontSize: '13.5px', color: isDark ? '#94A3B8' : '#64748B', margin: '0 0 20px', lineHeight: '1.6' }}>
            You can customize non-essential storage preferences below. Essential authentication and safety tokens cannot be disabled as they are required for verified passenger and pilot safety gates.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'not-allowed', opacity: 0.8 }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Essential Security & Authentication Tokens
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#64748B' : '#94A3B8' }}>
                  Required for account login, KYC tokenization, and boarding PINs
                </div>
              </div>
              <input type="checkbox" checked={true} disabled={true} style={{ width: '18px', height: '18px', accentColor: '#84CC16' }} />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  UI & Theme State Persistence
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#64748B' : '#94A3B8' }}>
                  Saves Dark/Light mode and highway corridor dropdown filters
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.functional} 
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#84CC16', cursor: 'pointer' }} 
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  Real-Time Live Radar GPS Caching
                </div>
                <div style={{ fontSize: '12px', color: isDark ? '#64748B' : '#94A3B8' }}>
                  Accelerates in-trip telemetry calculations and map polyline rendering
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.telemetry} 
                onChange={(e) => setPreferences({ ...preferences, telemetry: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#84CC16', cursor: 'pointer' }} 
              />
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handleSavePreferences}
              style={{
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#062103',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(132, 204, 22, 0.4)',
                transition: 'all 160ms ease'
              }}
            >
              <Check size={16} />
              <span>{saved ? 'Preferences Saved!' : 'Save Consent Preferences'}</span>
            </button>
          </div>
        </div>

        {/* Section 4: Contact Grievance Officer */}
        <div style={{
          background: isDark ? 'rgba(132, 204, 22, 0.08)' : '#F0FDF4',
          border: '1px solid rgba(132, 204, 22, 0.25)',
          borderRadius: '20px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Questions about our Data & Cookie Governance?
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#A7CBB4' : '#475569' }}>
              Reach our Data Protection Officer directly at <strong>privacy@driveit.in</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('privacy-policy')}
            style={{
              background: 'transparent',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CBD5E1',
              color: isDark ? '#FFFFFF' : '#0F172A',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Read Privacy Charter ➔
          </button>
        </div>

      </div>
    </div>
  );
}
