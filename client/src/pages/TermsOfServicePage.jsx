import React from 'react';
import { Scale, ShieldAlert, Zap, ArrowLeft, Users, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TermsOfServicePage({ onBack }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0B0F19' : '#F8FAFC',
      color: isDark ? '#F1F5F9' : '#0F172A',
      padding: '40px 20px 80px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack || (() => window.history.back())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isDark ? 'rgba(255, 255, 255, 0.05)' : '#E2E8F0',
            border: 'none',
            color: isDark ? '#CBD5E1' : '#334155',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '28px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </button>

        {/* Hero Header */}
        <div style={{
          background: isDark ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '36px 32px',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            <Scale size={14} />
            <span>Non-Commercial Cost-Sharing Transportation Charter</span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            DriveIT Terms of Service & Carpooling Charter
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
            Governing all community pilots, commuters, and highway corridor participants
          </p>
        </div>

        {/* Terms Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={18} color="#84CC16" />
              1. Non-Commercial Carpooling Nature
            </h2>
            <p style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', margin: 0 }}>
              DriveIT is an inter-city ride-sharing platform facilitating <strong>cost-sharing</strong> between verified private car owners (Pilots) and fellow commuters traveling in the same direction. In strict compliance with the Motor Vehicles Act, Pilot listings are restricted to genuine cost contributions (EV charging, highway FASTag tolls, maintenance) with zero commercial taxi surcharges.
            </p>
          </div>

          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldAlert size={18} color="#84CC16" />
              2. One-Active-Trip Integrity Rule
            </h2>
            <p style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', margin: 0 }}>
              To prevent ghost reservations and maintain corridor liquidity, DriveIT enforces a strict <strong>1 Active Trip Rule</strong>. A passenger may only hold one ongoing confirmed booking or route demand at any time. Speculative dual-bookings will be automatically blocked by the platform guard.
            </p>
          </div>

          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={18} color="#84CC16" />
              3. Pilot & Commuter Code of Conduct
            </h2>
            <ul style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Zero Tolerance Safety:</strong> Driving under the influence, reckless overtaking, or harassment results in immediate permanent ban and police escalation.</li>
              <li><strong>FASTag Toll Inclusivity:</strong> Listed seat fares include all highway expressway toll plaza charges unless mutually agreed otherwise.</li>
              <li><strong>OTP Boarding Verification:</strong> Passengers must provide their 4-digit Boarding OTP to the Pilot upon entering the vehicle to initiate the journey.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
