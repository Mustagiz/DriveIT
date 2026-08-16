import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, LogIn } from 'lucide-react';
import { SpotlightCard } from '../ui';

export default function UnauthorizedFallback({ reason = 'FORBIDDEN', requiredRoles = [], onNavigate }) {
  const isUnauthenticated = reason === 'UNAUTHENTICATED';

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <SpotlightCard
        spotlightColor={isUnauthenticated ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: '36px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: isUnauthenticated ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isUnauthenticated ? '#3B82F6' : '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          border: isUnauthenticated ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)'
        }}>
          {isUnauthenticated ? <Lock size={26} /> : <ShieldAlert size={26} />}
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-primary)', margin: '0 0 8px 0' }}>
          {isUnauthenticated ? 'Authentication Required' : 'Access Restricted (403)'}
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
          {isUnauthenticated
            ? 'You must be signed in with an active Driveit account to view this secure portal.'
            : `This section requires [${requiredRoles.join(', ').toUpperCase()}] credentials. Your current account role does not have permission to view this task.`}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isUnauthenticated ? (
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('auth')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '900', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <LogIn size={16} />
              <span>Sign In to Continue ➔</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('home')}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px', fontWeight: '900', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} />
              <span>Return to Permitted View</span>
            </button>
          )}
        </div>
      </SpotlightCard>
    </div>
  );
}
