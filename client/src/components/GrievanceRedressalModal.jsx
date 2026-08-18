import React from 'react';
import { ShieldCheck, Mail, Building, Clock, X, PhoneCall, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function GrievanceRedressalModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderRadius: '24px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        animation: 'modalSlideUp 200ms ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '22px 24px',
          background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#F8FAFC',
          borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(132, 204, 22, 0.15)',
              border: '1px solid rgba(132, 204, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#84CC16'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                Statutory Grievance Redressal
              </h3>
              <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Rule 3(2) of Information Technology Rules, 2021
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#94A3B8' : '#64748B',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: isDark ? '#CBD5E1' : '#475569' }}>
            In accordance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the details of the designated Grievance Redressal Officer for DriveIT Technologies India are as follows:
          </p>

          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F1F5F9',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700' }}>
                Designated Officer
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: isDark ? '#F8FAFC' : '#0F172A', marginTop: '2px' }}>
                Aman Verma (Lead Trust & Safety Operations)
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: isDark ? '#E2E8F0' : '#1E293B' }}>
              <Mail size={16} color="#84CC16" />
              <span>Direct Email: <strong>grievance@driveit.in</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: isDark ? '#94A3B8' : '#475569' }}>
              <Building size={16} color="#84CC16" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>DriveIT Technologies India Pvt. Ltd., Level 4, Platina Tower, MG Road, Pune, Maharashtra 411001, India</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: isDark ? '#94A3B8' : '#475569' }}>
              <Clock size={16} color="#84CC16" />
              <span>Hours: Monday to Friday (09:30 AM – 06:30 PM IST)</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(132, 204, 22, 0.08)',
            border: '1px solid rgba(132, 204, 22, 0.25)',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12px',
            color: isDark ? '#D9F99D' : '#365314',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}>
            <ShieldCheck size={18} color="#84CC16" style={{ flexShrink: 0 }} />
            <span><strong>Turnaround Commitment:</strong> We acknowledge complaints within <strong>24 hours</strong> and provide complete redressal resolution within <strong>15 business days</strong>.</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#FFFFFF',
          borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: '#84CC16',
              color: '#000000',
              border: 'none',
              fontWeight: '900',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
