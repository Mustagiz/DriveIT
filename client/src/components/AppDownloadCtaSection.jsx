import React, { useState } from 'react';
import { Apple, Play, ArrowLeft } from 'lucide-react';
import { useToast } from './Toast';

export default function AppDownloadCtaSection() {
  const { addToast } = useToast();

  const handleDownloadClick = (platform) => {
    addToast(`Scan the QR code with your ${platform === 'iOS' ? 'iPhone' : 'Android phone'} to install the app.`, 'info');
  };

  return (
    <section style={{
      width: '100%',
      background: '#0084F0',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      marginTop: '40px'
    }} aria-label="BlaBlaCar App Download">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '56px 24px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '40px',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Left Column: Heading, Subtitle & Store Badges */}
        <div style={{ paddingBottom: '56px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 3.8vw, 42px)',
            fontWeight: '900',
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            margin: '0 0 16px'
          }}>
            Enjoy a better travel experience with the BlaBlaCar app
          </h2>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 17px)',
            color: 'rgba(255, 255, 255, 0.95)',
            lineHeight: 1.55,
            margin: '0 0 36px',
            maxWidth: '520px',
            fontWeight: 500
          }}>
            All your rides and tickets in one place, up-to-date info and exclusive mobile-only features.
          </p>

          {/* Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            {/* Apple App Store */}
            <button
              type="button"
              onClick={() => handleDownloadClick('iOS')}
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Apple size={28} color="#FFFFFF" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85 }}>Download on the</div>
                <div style={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.15 }}>App Store</div>
              </div>
            </button>

            {/* Google Play */}
            <button
              type="button"
              onClick={() => handleDownloadClick('Android')}
              style={{
                background: '#000000',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Play size={26} color="#FFFFFF" fill="#FFFFFF" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85 }}>GET IT ON</div>
                <div style={{ fontSize: '17px', fontWeight: 800, lineHeight: 1.15 }}>Google Play</div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Smartphone Mockup with QR Code */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          <div style={{
            width: '280px',
            background: '#05333D',
            border: '8px solid #05333D',
            borderBottom: 'none',
            borderRadius: '40px 40px 0 0',
            padding: '12px 14px 28px',
            boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box'
          }}>
            {/* Phone Screen */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '30px 30px 0 0',
              padding: '16px 16px 36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Top Notch Speaker */}
              <div style={{
                width: '60px',
                height: '5px',
                background: '#05333D',
                borderRadius: '3px',
                marginBottom: '16px'
              }} />

              {/* Back Arrow in Screen Header */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <ArrowLeft size={18} color="#0084F0" />
              </div>

              {/* QR Code Container */}
              <div style={{
                background: '#FFFFFF',
                padding: '12px',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://blablacar.in/app&color=054752&bgcolor=FFFFFF"
                  alt="Scan to install BlaBlaCar App"
                  style={{ width: '160px', height: '160px', display: 'block' }}
                />
              </div>

              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#708797',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                Scan to download app
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
