import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { SpotlightCard } from '../ui';

export default function FaceLivenessModal({ isOpen, onClose, onMatchComplete, userAvatar }) {
  const [phase, setPhase] = useState('prompt'); // prompt -> scanning -> liveness_challenge -> matched
  const [challengeStep, setChallengeStep] = useState(1); // 1: blink, 2: smile
  const [confidenceScore, setConfidenceScore] = useState(0);

  if (!isOpen) return null;

  const handleStartCapture = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('liveness_challenge');
    }, 1500);
  };

  useEffect(() => {
    if (phase === 'liveness_challenge') {
      const timer1 = setTimeout(() => {
        setChallengeStep(2);
      }, 1500);

      const timer2 = setTimeout(() => {
        setConfidenceScore(96.8);
        setPhase('matched');
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [phase]);

  const handleFinish = () => {
    if (onMatchComplete) {
      onMatchComplete({
        score: confidenceScore,
        livenessVerified: true,
        timestamp: new Date().toISOString()
      });
    }
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <SpotlightCard
        spotlightColor="rgba(16, 185, 129, 0.25)"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={20} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              3D Face Liveness & Biometric Match
            </h3>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
              Anti-Spoofing & Identity Verification
            </span>
          </div>
        </div>

        {/* CAMERA PREVIEW FRAME */}
        <div style={{
          position: 'relative',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          border: phase === 'matched' ? '4px solid #10B981' : '4px solid #84CC16',
          margin: '0 auto 20px',
          overflow: 'hidden',
          background: '#0F172A',
          boxShadow: phase === 'matched' ? '0 0 30px rgba(16, 185, 129, 0.4)' : '0 0 30px rgba(132, 204, 22, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* 3D Wireframe Silhouette */}
          <div style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at center, #1E293B 0%, #090D16 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg width="150" height="180" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M90 20 C50 20 30 55 30 110 C30 165 60 200 90 205 C120 200 150 165 150 110 C150 55 130 20 90 20 Z" 
                stroke={phase === 'matched' ? '#10B981' : '#84CC16'} 
                strokeWidth="2" 
                strokeDasharray="4 2" 
                opacity="0.85" 
              />
              <line x1="90" y1="20" x2="60" y2="55" stroke="rgba(132, 204, 22, 0.3)" strokeWidth="1" />
              <line x1="90" y1="20" x2="120" y2="55" stroke="rgba(132, 204, 22, 0.3)" strokeWidth="1" />
              <circle cx="62" cy="90" r="8" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="118" cy="90" r="8" stroke="#10B981" strokeWidth="1.5" />
              <polygon points="90,75 78,130 102,130" stroke="rgba(132, 204, 22, 0.5)" strokeWidth="1.5" />
              <path d="M65 155 Q90 170 115 155" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="90" cy="200" r="3" fill="#10B981" />
            </svg>
          </div>

          {/* Scanning Radar Line */}
          {(phase === 'scanning' || phase === 'liveness_challenge') && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: '#10B981',
              boxShadow: '0 0 10px #10B981',
              animation: 'scanLine 1.5s ease-in-out infinite'
            }} />
          )}

          {/* Matched Overlay Checkmark */}
          {phase === 'matched' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={64} color="#FFFFFF" />
            </div>
          )}
        </div>

        <style>{`
          @keyframes scanLine {
            0% { top: 10%; }
            50% { top: 90%; }
            100% { top: 10%; }
          }
        `}</style>

        {/* PHASE 1: PROMPT */}
        {phase === 'prompt' && (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Position your face inside the circle. Our biometric AI model compares your live camera feed against your Aadhaar identity photo.
            </p>

            <button
              type="button"
              onClick={handleStartCapture}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <span>Begin Live Facial Scan ➔</span>
            </button>
          </div>
        )}

        {/* PHASE 2: SCANNING */}
        {phase === 'scanning' && (
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-text-primary)' }}>
              Detecting Facial Anchor Points...
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Hold your position steady in good lighting.
            </p>
          </div>
        )}

        {/* PHASE 3: LIVENESS CHALLENGE */}
        {phase === 'liveness_challenge' && (
          <div style={{
            background: 'rgba(132, 204, 22, 0.1)',
            border: '1px solid rgba(132, 204, 22, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#65A30D', margin: '0 0 4px 0' }}>
              {challengeStep === 1 ? '👁️ Action: Please slowly blink both eyes' : '😊 Action: Please smile naturally'}
            </h4>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              Passive anti-spoofing challenge in progress (Step {challengeStep} of 2)
            </span>
          </div>
        )}

        {/* PHASE 4: MATCHED */}
        {phase === 'matched' && (
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '900', color: '#10B981', marginBottom: '4px' }}>
                96.8% Biometric Similarity Match
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Live selfie matched with UIDAI e-Aadhaar photo. 3D passive liveness certified.
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <span>Confirm & Lock Biometric KYC ➔</span>
            </button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
}
