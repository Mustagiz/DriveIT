import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Eye, 
  Upload, 
  Lock, 
  HelpCircle, 
  ChevronRight, 
  Sparkles, 
  Car, 
  BadgeCheck,
  Headphones
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from './Toast';

export default function VerificationGate({ 
  user, 
  kycStatus = 'PENDING', 
  onRefresh, 
  onOpenKycTab, 
  onContactSupport 
}) {
  const { isDark } = useTheme();
  const { addToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const isPending = kycStatus === 'PENDING' || !kycStatus;
  const isRejected = kycStatus === 'REJECTED';
  const isVerified = kycStatus === 'VERIFIED';

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      addToast('Verification status synchronized with National Operations Desk', 'info');
    } catch (e) {
      addToast('Failed to refresh status', 'error');
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const documents = [
    {
      id: 'aadhaar',
      name: 'Aadhaar / National Identity Card',
      number: user?.aadhaar_number || 'XXXX-XXXX-8921',
      docUrl: user?.aadhaar_doc_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
      description: 'UIDAI government verified identity record',
      status: isVerified ? 'VERIFIED' : (isRejected ? 'ATTENTION NEEDED' : 'UNDER REVIEW')
    },
    {
      id: 'license',
      name: 'Commercial / Driver License',
      number: user?.driving_license_number || 'MH-14-2018-0099412',
      docUrl: user?.driving_license_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      description: 'Indian Regional Transport Office (RTO) valid driving credential',
      status: isVerified ? 'VERIFIED' : (isRejected ? 'ATTENTION NEEDED' : 'UNDER REVIEW')
    },
    {
      id: 'rc',
      name: 'Vehicle Registration Certificate (RC)',
      number: user?.vehicle_rc_number || user?.vehicle?.plate || 'MH-12-RN-7788',
      docUrl: user?.vehicle_rc_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      description: `RTO fitness & highway roadworthiness for ${user?.vehicle?.make || 'Tata'} ${user?.vehicle?.model || 'EV'}`,
      status: isVerified ? 'VERIFIED' : (isRejected ? 'ATTENTION NEEDED' : 'UNDER REVIEW')
    }
  ];

  return (
    <div style={{
      background: isDark
        ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 53, 0.95))'
        : '#FFFFFF',
      border: isDark
        ? (isRejected ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1.5px solid rgba(132, 204, 22, 0.35)')
        : (isRejected ? '1.5px solid #FCA5A5' : '1.5px solid #BBF7D0'),
      borderRadius: '24px',
      padding: '32px',
      boxShadow: isDark
        ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
        : '0 20px 40px -10px rgba(0, 0, 0, 0.08)',
      backdropFilter: 'blur(24px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Glow Backdrop */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: isRejected 
          ? 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(132, 204, 22, 0.15) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Main Header Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: isRejected 
              ? 'rgba(239, 68, 68, 0.15)' 
              : 'rgba(132, 204, 22, 0.15)',
            border: isRejected 
              ? '1px solid rgba(239, 68, 68, 0.3)' 
              : '1px solid rgba(132, 204, 22, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isRejected ? (
              <ShieldAlert size={28} color="#EF4444" />
            ) : isVerified ? (
              <ShieldCheck size={28} color="#10B981" />
            ) : (
              <Lock size={28} color="#84CC16" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '4px 10px',
                borderRadius: '8px',
                background: isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(132, 204, 22, 0.15)',
                color: isRejected ? '#EF4444' : (isDark ? '#84CC16' : '#65A30D'),
                border: isRejected ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(132, 204, 22, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Lock size={12} />
                MANDATORY VERIFICATION GATE ACTIVE
              </span>

              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '8px',
                background: isRejected ? '#FEE2E2' : '#F0FDF4',
                color: isRejected ? '#991B1B' : '#166534'
              }}>
                STATUS: {kycStatus}
              </span>
            </div>

            <h2 style={{
              fontSize: '22px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              margin: '0 0 6px 0',
              letterSpacing: '-0.01em'
            }}>
              {isRejected 
                ? 'Pilot Verification Requires Attention' 
                : 'Pilot Account Under Operations Review'}
            </h2>

            <p style={{
              fontSize: '13px',
              color: isDark ? '#94A3B8' : '#64748B',
              margin: 0,
              maxWidth: '650px',
              lineHeight: 1.5
            }}>
              To maintain 100% passenger safety and comply with Indian Motor Vehicle & Expressway ridesharing norms, 
              <strong> your ability to post rides remains restricted</strong> until our 24/7 National Operations Desk officially reviews and accepts your uploaded documentation.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
              color: isDark ? '#FFFFFF' : '#0F172A',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease'
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Checking Desk...' : 'Sync Status'}</span>
          </button>
        </div>
      </div>

      {/* Rejection Alert Strip if applicable */}
      {isRejected && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#EF4444' }}>
              Operations Compliance Feedback:
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#FECACA' : '#991B1B', marginTop: '2px' }}>
              {user?.kyc_rejection_reason || 'Uploaded documentation was unclear or did not match Regional Transport Office (RTO) vehicle records. Please re-upload clean photo copies to proceed.'}
            </div>
            <button
              type="button"
              onClick={onOpenKycTab}
              style={{
                marginTop: '10px',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Upload size={13} />
              <span>Resubmit Updated Documents Now</span>
            </button>
          </div>
        </div>
      )}

      {/* 3-Step Verification Pipeline Tracker */}
      <div style={{
        background: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAFC',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        borderRadius: '18px',
        padding: '20px 24px',
        marginBottom: '28px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '800',
          color: isDark ? '#94A3B8' : '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Pilot Verification Pipeline</span>
          <span style={{ color: '#84CC16', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> SLA Turnaround: 2–4 Hours (24/7 Operations Desk)
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {/* Step 1 */}
          <div style={{
            background: isDark ? 'rgba(16, 185, 129, 0.1)' : '#ECFDF5',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#10B981' }}>STAGE 1</span>
              <CheckCircle2 size={16} color="#10B981" />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Documents Uploaded
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
              Aadhaar, DL & RC documents submitted during registration.
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            background: isRejected 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(132, 204, 22, 0.12)',
            border: isRejected 
              ? '1px solid rgba(239, 68, 68, 0.3)' 
              : '1px solid rgba(132, 204, 22, 0.4)',
            borderRadius: '14px',
            padding: '14px 16px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: isRejected ? '#EF4444' : '#84CC16' }}>
                STAGE 2 • CURRENT
              </span>
              {isRejected ? (
                <AlertCircle size={16} color="#EF4444" />
              ) : (
                <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#84CC16' }} />
              )}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              {isRejected ? 'Compliance Rejected' : 'Operations Desk Review'}
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
              {isRejected 
                ? 'Action needed: update invalid docs.'
                : 'Trust & Safety agent is verifying UIDAI & RTO authenticity.'}
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F1F5F9',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '14px 16px',
            opacity: 0.7
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B' }}>
                STAGE 3
              </span>
              <Lock size={15} color={isDark ? '#94A3B8' : '#64748B'} />
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              Expressway Publishing Access
            </div>
            <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
              Locked until operations team officially approves verification.
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Documents Inspection Grid */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
            Submitted Pilot Credentials & Documentation
          </div>
          <button
            type="button"
            onClick={onOpenKycTab}
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#84CC16' : '#65A30D',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>Manage / Re-upload</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 150ms ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase' }}>
                    {doc.id}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(132, 204, 22, 0.15)',
                    color: isRejected ? '#EF4444' : (isDark ? '#84CC16' : '#65A30D')
                  }}>
                    {doc.status}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                  {doc.name}
                </div>
                <div style={{ fontSize: '12px', fontFamily: 'monospace', color: isDark ? '#CBD5E1' : '#334155', marginTop: '2px' }}>
                  Record: <strong>{doc.number}</strong>
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px' }}>
                  {doc.description}
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  style={{
                    flex: 1,
                    background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={13} />
                  <span>Preview Uploaded File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '20px',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Headphones size={16} color={isDark ? '#94A3B8' : '#64748B'} />
          <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
            Need expedited verification for an upcoming corridor route?
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onOpenKycTab}
            style={{
              background: 'transparent',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CBD5E1',
              color: isDark ? '#FFFFFF' : '#0F172A',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Update Credentials
          </button>

          <button
            type="button"
            onClick={onContactSupport || (() => addToast('Opening Support Desk chat drawer...', 'info'))}
            style={{
              background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(132, 204, 22, 0.3)'
            }}
          >
            <Headphones size={14} />
            <span>Connect to Trust Desk</span>
          </button>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '28px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                  {previewDoc.name}
                </h3>
                <p style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', margin: '2px 0 0 0' }}>
                  Document Reference: <strong>{previewDoc.number}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F9',
                  border: 'none',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
              maxHeight: '340px',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px'
            }}>
              <img
                src={previewDoc.docUrl}
                alt={previewDoc.name}
                style={{
                  width: '100%',
                  maxHeight: '340px',
                  objectFit: 'contain'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                Secure encrypted document storage
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{
                  background: '#84CC16',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
