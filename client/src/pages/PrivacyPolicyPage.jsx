import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import GrievanceRedressalModal from '../components/GrievanceRedressalModal';

export default function PrivacyPolicyPage({ onNavigate, onBack }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [grievanceOpen, setGrievanceOpen] = useState(false);

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
      background: isDark ? '#0B0F19' : '#F8FAFC',
      color: isDark ? '#F1F5F9' : '#0F172A',
      padding: '40px 20px 80px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Back navigation */}
        <button
          type="button"
          onClick={handleBack}
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
          <span>Return to Home</span>
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
            background: 'rgba(132, 204, 22, 0.15)',
            border: '1px solid rgba(132, 204, 22, 0.3)',
            color: '#84CC16',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: '800',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={14} />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            DriveIT Privacy Policy & Data Charter
          </h1>
          <p style={{ fontSize: '14px', color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
            Last Updated: August 18, 2026 • Effective across all Indian Highway Corridor services
          </p>
        </div>

        {/* Policy Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section 1 */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={18} color="#84CC16" />
              1. Principles of Data Collection
            </h2>
            <p style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', margin: 0 }}>
              DriveIT strictly operates on the principle of <strong>Data Minimization</strong>. We collect only the information required to facilitate safe, non-commercial inter-city carpooling and statutory KYC verification under Indian transportation laws. We <strong>never sell, lease, or monetize</strong> your personal data to third-party ad brokers.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={18} color="#84CC16" />
              2. Information We Process
            </h2>
            <ul style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Identity & KYC:</strong> Aadhaar XML metadata via DigiLocker / Surepass Sub-AUA (Aadhaar numbers are masked; raw biometric data is NEVER stored).</li>
              <li><strong>Vehicle Registration:</strong> VAHAN database registration numbers and RC metadata to verify electric/hybrid vehicle credentials.</li>
              <li><strong>Trip Telemetry:</strong> Live GPS location during active corridors for safety tracking, SOS dispatch, and OTP boarding pass matching.</li>
              <li><strong>Financial Transactions:</strong> UPI / Razorpay payment references for verified toll cost-sharing escrow.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            lineHeight: '1.7'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle size={18} color="#84CC16" />
              3. Your Rights Under DPDP Act 2023
            </h2>
            <p style={{ fontSize: '13.5px', color: isDark ? '#CBD5E1' : '#475569', margin: '0 0 14px 0' }}>
              As a Data Principal, you have the right to access your summary profile, request permanent erasure of past trips, and revoke telemetry consent at any time from your Account Settings.
            </p>
            <button
              type="button"
              onClick={() => setGrievanceOpen(true)}
              style={{
                background: '#84CC16',
                border: 'none',
                color: '#000000',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mail size={14} />
              <span>Contact Grievance Officer</span>
            </button>
          </div>

        </div>

      </div>

      <GrievanceRedressalModal isOpen={grievanceOpen} onClose={() => setGrievanceOpen(false)} />
    </div>
  );
}
