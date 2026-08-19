import React, { useState } from 'react';
import { Sparkles, QrCode, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';
import ScrollReveal from './ScrollReveal';

export default function AppDownloadCtaSection() {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [showQrModal, setShowQrModal] = useState(false);
  const [activePlatform, setActivePlatform] = useState('iOS');

  const handleDownloadClick = (platform) => {
    setActivePlatform(platform);
    setShowQrModal(true);
    addToast(`Scan QR code with your ${platform === 'iOS' ? 'iPhone' : 'Android phone'} to install Driveit.`, 'info');
  };

  return (
    <section style={{
      width: '100%',
      maxWidth: '1360px',
      margin: '0 auto 56px',
      padding: '0 clamp(24px, 4.5vw, 56px)',
      position: 'relative',
      zIndex: 10,
      boxSizing: 'border-box'
    }}>
      <ScrollReveal>
        <div style={{
          background: isDark ? '#0B1528' : '#F0FDF4',
          border: isDark ? '1.5px solid rgba(132, 204, 22, 0.35)' : '1.5px solid #86EFAC',
          borderRadius: '32px',
          padding: 'clamp(36px, 5vw, 56px) 24px',
          textAlign: 'center',
          boxShadow: isDark
            ? '0 20px 50px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(132, 204, 22, 0.1)'
            : '0 16px 40px -10px rgba(132, 204, 22, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Headline matching reference image */}
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: '900',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.18,
            margin: '0 0 12px'
          }}>
            Ready to ride smarter?
          </h2>

          {/* Subtitle matching reference image */}
          <p style={{
            fontSize: 'clamp(14.5px, 1.8vw, 16.5px)',
            color: 'var(--color-text-secondary)',
            margin: '0 auto 32px',
            maxWidth: '680px',
            lineHeight: 1.55,
            fontWeight: '500'
          }}>
            Join thousands of commuters already saving money and traveling greener across India.
          </p>

          {/* App Store & Google Play Badges matching reference layout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {/* Apple App Store Button */}
            <button
              type="button"
              onClick={() => handleDownloadClick('iOS')}
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '14px',
                padding: '10px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                minWidth: '185px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
              }}
            >
              {/* Official Apple Logo SVG */}
              <svg width="22" height="26" viewBox="0 0 384 512" fill="#FFFFFF" style={{ flexShrink: 0 }}>
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, fontWeight: '600' }}>
                  Download on the
                </div>
                <div style={{ fontSize: '17px', fontWeight: '800', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                  App Store
                </div>
              </div>
            </button>

            {/* Google Play Button */}
            <button
              type="button"
              onClick={() => handleDownloadClick('Android')}
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '14px',
                padding: '10px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                minWidth: '185px',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
              }}
            >
              {/* Official Google Play Store Multi-Color Triangle SVG */}
              <svg width="22" height="24" viewBox="0 0 512 512" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M47.1 27.2c-3.1 3.5-4.8 8.8-4.8 15.6v426.4c0 6.8 1.7 12.1 4.8 15.6l1.3 1.2 238.4-238.4v-5.6L48.4 26l-1.3 1.2z" />
                <path fill="#FBBC04" d="M366.1 306.9l-79.3-79.3v-5.6l79.3-79.3 1.9 1.1 94 53.4c26.8 15.2 26.8 40.2 0 55.4l-94 53.4-1.9.9z" />
                <path fill="#EA4335" d="M286.8 274.6L47.1 484.8c8.8 9.3 23.3 10.4 39.5 1.3l239.7-136.2-39.5-75.3z" />
                <path fill="#34A853" d="M286.8 237.4l39.5-75.3L86.6 26c-16.2-9.1-30.7-8-39.5 1.3L286.8 237.4z" />
              </svg>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85, fontWeight: '600' }}>
                  GET IT ON
                </div>
                <div style={{ fontSize: '17px', fontWeight: '800', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                  Google Play
                </div>
              </div>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Interactive Mobile Install Modal */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #E2E8F0',
            borderRadius: '28px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                border: 'none',
                color: isDark ? '#94A3B8' : '#64748B',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'rgba(132, 204, 22, 0.15)',
              color: '#84CC16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Smartphone size={24} />
            </div>

            <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Download Driveit for {activePlatform}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
              Scan this QR code with your phone camera to download the latest PWA app.
            </p>

            {/* Generated QR Code preview */}
            <div style={{
              background: '#FFFFFF',
              padding: '16px',
              borderRadius: '20px',
              display: 'inline-block',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              marginBottom: '20px'
            }}>
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://driveit.in/install" 
                alt="Driveit Mobile App QR"
                style={{ width: '180px', height: '180px', display: 'block' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: '800' }}>
              <CheckCircle2 size={14} />
              <span>Instant PWA & Native Sync Ready</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
