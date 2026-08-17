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
      boxSizing: 'border-box'
    }}>
      <ScrollReveal>
        <div style={{
          background: isDark ? 'rgba(132, 204, 22, 0.06)' : '#F0FDF4',
          border: isDark ? '1.5px solid rgba(132, 204, 22, 0.3)' : '1.5px solid #86EFAC',
          borderRadius: '32px',
          padding: 'clamp(36px, 5vw, 56px) 24px',
          textAlign: 'center',
          boxShadow: isDark
            ? '0 20px 50px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(132, 204, 22, 0.1)'
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
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '10px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                minWidth: '180px',
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
              {/* Apple SVG Logo */}
              <svg width="24" height="28" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.7-11.72-13.98-6.19-9.5-11.19-20.91-15.01-34.22-3.82-13.31-5.73-25.56-5.73-36.75 0-14.04 3.7-25.77 11.1-35.19 7.4-9.42 16.63-14.24 27.69-14.46 5.01 0 10.51 1.25 16.51 3.76 6 2.5 9.75 3.79 11.25 3.86 1.13 0 5.07-1.39 11.83-4.17 6.76-2.78 12.63-4.04 17.61-3.78 13.06.67 23.36 5.37 30.9 14.1-11.33 6.88-16.89 16.42-16.69 28.62.2 9.61 4.02 17.61 11.45 24 7.43 6.39 16.14 9.94 26.13 10.65-2.22 6.64-4.87 13.7-7.95 21.18zM119.22 33.36c-.03-7.51 2.66-14.46 8.08-20.85 5.42-6.39 12.06-10.56 19.92-12.51.98 7.39-1.47 14.51-7.35 21.36-5.88 6.85-12.76 10.85-20.65 12z" />
              </svg>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
                  Download on the
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', lineHeight: 1.1 }}>
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
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '10px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                minWidth: '180px',
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
              {/* Google Play SVG Logo */}
              <svg width="24" height="26" viewBox="0 0 512 512">
                <path fill="#4285F4" d="M47.1 27.2c-3.1 3.5-4.8 8.8-4.8 15.6v426.4c0 6.8 1.7 12.1 4.8 15.6l1.3 1.2 238.4-238.4v-5.6L48.4 26l-1.3 1.2z"/>
                <path fill="#FBBC04" d="M366.1 306.9l-79.3-79.3v-5.6l79.3-79.3 1.9 1.1 94 53.4c26.8 15.2 26.8 40.2 0 55.4l-94 53.4-1.9.9z"/>
                <path fill="#EA4335" d="M286.8 227.6L47.1 484.8c8.8 9.3 23.3 10.4 39.5 1.3l239.7-136.2-39.5-122.3z"/>
                <path fill="#34A853" d="M286.8 227.6L326.3 350l-239.7 136.1c-16.2 9.1-30.7 8-39.5-1.3L286.8 227.6z" transform="rotate(180 186.7 256)"/>
              </svg>
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
                  GET IT ON
                </div>
                <div style={{ fontSize: '16px', fontWeight: '800', lineHeight: 1.1 }}>
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
