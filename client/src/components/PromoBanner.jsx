import React, { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Leaf, Tag, Zap } from 'lucide-react';

export default function PromoBanner({ onApplyFilter, onNavigate }) {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        if (data.banners && data.banners.length > 0) {
          setBanners(data.banners);
        }
      }
    } catch (err) {
      console.warn('Error fetching banners:', err);
    }
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex];

  const handleCta = () => {
    if (current.ctaAction === 'post-ride') {
      onNavigate('post-ride');
    } else if (current.ctaFilter) {
      onApplyFilter(current.ctaFilter);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '32px' }}>
      <div 
        className="glass-panel"
        style={{
          overflow: 'hidden',
          position: 'relative',
          borderRadius: '20px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Glow ambient background with subtle yellow theme */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'rgba(254, 240, 138, 0.3)',
          filter: 'blur(75px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-yellow">
                <Zap size={12} fill="#84CC16" />
                {current.badge || 'Driveit India Special'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Promotion Slide {currentIndex + 1} of {banners.length}
              </span>
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: '800',
              marginBottom: '6px',
              color: '#0F172A',
              lineHeight: 1.2
            }}>
              {current.title}
            </h2>

            <div style={{
              fontSize: '1.05rem',
              color: '#84CC16',
              fontWeight: '800',
              marginBottom: '8px'
            }}>
              {current.tagline}
            </div>

            <p style={{
              fontSize: '0.9rem',
              color: '#64748B',
              lineHeight: 1.5,
              marginBottom: '16px'
            }}>
              {current.description}
            </p>

            <button
              onClick={handleCta}
              className="btn-primary btn-sm"
            >
              <span>{current.ctaText || 'Explore Highway Rides'}</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Feature Badge Grid / Micro Stats */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '16px',
            borderRadius: '14px',
            minWidth: '230px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#84CC16" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Aadhaar & License Verified</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>100% Indian KYC Checked</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Leaf size={20} color="#16A34A" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Green Bharat EV Fleet</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Tata Nexon & MG ZS EVs</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={20} color="#0284C7" />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>Fastag & Tolls Included</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Zero toll surprise charges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 24px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === currentIndex ? '#84CC16' : 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#fff',
                borderRadius: '6px',
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
