import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, PhoneCall, Radio, CheckCircle2, AlertTriangle, 
  X, MapPin, Car, UserCheck, Volume2, VolumeX, Shield, Navigation 
} from 'lucide-react';
import { useToast } from './Toast';

export default function EmergencySOSModal({ isOpen, onClose, tripDetails = {} }) {
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let timer;
    if (isOpen && !isTriggered && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsTriggered(true);
            addToast('🚨 LIVE HIGHWAY SOS BROADCAST DISPATCHED', 'error');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isTriggered, countdown]);

  if (!isOpen) return null;

  const handleCancel = () => {
    setCountdown(5);
    setIsTriggered(false);
    onClose();
  };

  const handleInstantTrigger = () => {
    setCountdown(0);
    setIsTriggered(true);
    addToast('🚨 SOS BROADCAST TRANSMITTED IMMEDIATELY', 'error');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 13, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0B0F19',
        border: '2px solid #EF4444',
        borderRadius: '28px',
        width: '520px',
        maxWidth: '100%',
        padding: '36px 32px',
        boxShadow: '0 0 80px rgba(239, 68, 68, 0.5), 0 20px 40px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        color: '#FFFFFF'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCancel}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 150ms ease'
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        {/* SOS Animated Radar Beacon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Concentric Pulse Rings */}
            <div style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.25)',
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />

            <div style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 35px rgba(239, 68, 68, 0.8)',
              border: '3px solid #FFFFFF'
            }}>
              <ShieldAlert size={36} />
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.18)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#FCA5A5',
            fontSize: '11px',
            fontWeight: '900',
            padding: '4px 12px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '8px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} className="animate-pulse" />
            <span>{isTriggered ? 'Emergency Broadcast Active' : 'Live Highway Distress Beacon'}</span>
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: '900',
            color: '#FFFFFF',
            margin: '4px 0 8px',
            letterSpacing: '-0.02em'
          }}>
            {isTriggered ? 'EMERGENCY BEACON ACTIVE' : 'HIGHWAY SOS BEACON'}
          </h2>

          <p style={{
            fontSize: '13.5px',
            color: '#94A3B8',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: '420px',
            marginInline: 'auto'
          }}>
            {isTriggered
              ? 'Live GPS telematics and passenger manifest have been transmitted to NHAI Expressway Patrol & your Emergency Contacts.'
              : 'Dispatching emergency telemetry to Highway Patrol in:'}
          </p>

          {!isTriggered && (
            <div style={{
              fontSize: '44px',
              fontWeight: '900',
              color: '#EF4444',
              margin: '12px 0 0',
              fontFamily: 'monospace',
              letterSpacing: '0.05em'
            }}>
              00:0{countdown}
            </div>
          )}
        </div>

        {/* High-Contrast Transmitted Telemetry Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '20px',
          padding: '18px 20px',
          marginBottom: '24px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '900',
            color: '#FCA5A5',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={14} color="#EF4444" className="animate-pulse" />
              <span>Transmitted Highway Telemetry</span>
            </div>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '800' }}>● GPS 2.5s Synced</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
            fontSize: '13px'
          }}>
            <div>
              <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>
                Vehicle Plate
              </div>
              <div style={{
                color: '#FFFFFF',
                fontWeight: '900',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-block',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontFamily: 'monospace'
              }}>
                {tripDetails.vehiclePlate || 'MH-12-RN-7788'}
              </div>
            </div>

            <div>
              <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>
                Vehicle Model
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: '800' }}>
                {tripDetails.vehicleModel || 'Tata Nexon EV (Teal)'}
              </div>
            </div>

            <div>
              <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>
                Pilot In Command
              </div>
              <div style={{ color: '#FFFFFF', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{tripDetails.pilotName || 'Rahul Sharma'}</span>
                <span style={{ color: '#10B981', fontSize: '10.5px' }}>✓</span>
              </div>
            </div>

            <div>
              <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', marginBottom: '2px', textTransform: 'uppercase' }}>
                Expressway Corridor
              </div>
              <div style={{ color: '#BEF264', fontWeight: '800' }}>
                Mumbai-Pune (KM 42.5)
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Helpline Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <a
            href="tel:1033"
            style={{
              background: 'linear-gradient(135deg, #EF4444, #DC2626)',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: '900',
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 6px 20px rgba(239, 68, 68, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <PhoneCall size={16} />
            <span>NHAI Patrol (1033)</span>
          </a>

          <a
            href="tel:112"
            style={{
              background: '#1E293B',
              color: '#FFFFFF',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '14px',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: '900',
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <PhoneCall size={16} />
            <span>Police / EMS (112)</span>
          </a>
        </div>

        {/* Action Controls */}
        {!isTriggered ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleInstantTrigger}
              style={{
                flex: 1,
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '13.5px',
                fontWeight: '900',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
              }}
            >
              Broadcast Now ⚡
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#CBD5E1',
                border: '1.5px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '13.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Cancel (False Alarm)
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#F1F5F9',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '13px',
              fontSize: '13.5px',
              fontWeight: '800',
              cursor: 'pointer',
              transition: 'background 150ms ease'
            }}
          >
            Dismiss Beacon Overlay
          </button>
        )}
      </div>
    </div>
  );
}
