import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { UserCheck, Shield, Car, Compass, RefreshCw, Sparkles, Layers, Zap, LogOut, X, Eye } from 'lucide-react';

export default function DemoToolbar({ onNavigate }) {
  const { user, loginAsDemo, switchActiveRole, activeRole, logout } = useAuth();
  const { addToast } = useToast();
  const [isVisible, setIsVisible] = useState(() => localStorage.getItem('driveit_hide_demo_toolbar') !== 'true');

  const handleToggleVisibility = (hide) => {
    setIsVisible(!hide);
    if (hide) {
      localStorage.setItem('driveit_hide_demo_toolbar', 'true');
      addToast('Demo role tester hidden. Click bottom-left pill to restore anytime.', 'info');
    } else {
      localStorage.removeItem('driveit_hide_demo_toolbar');
    }
  };

  const handleDemoSelect = async (userId, roleName) => {
    try {
      const switchedUser = await loginAsDemo(userId);
      addToast(`Logged in as ${switchedUser?.name || roleName}`, 'success');

      // Intelligently route user to their primary operational hub
      const userRoles = switchedUser?.roles || [];
      const isSupport = userRoles.includes('support') || userRoles.includes('admin');
      const isPilot = userRoles.includes('lister') && !isSupport;
      
      const currentHash = window.location.hash.replace('#/', '').replace('#', '').trim();
      if (isSupport) {
        if (onNavigate) onNavigate('support-portal');
        else window.location.hash = '#/support-portal';
      } else if (currentHash === 'support-portal' && !isSupport) {
        if (isPilot) {
          if (onNavigate) onNavigate('lister-hub');
          else window.location.hash = '#/lister-hub';
        } else {
          if (onNavigate) onNavigate('home');
          else window.location.hash = '#/home';
        }
      } else if ((currentHash === 'lister-hub' || currentHash === 'post-ride') && !isPilot) {
        if (onNavigate) onNavigate('home');
        else window.location.hash = '#/home';
      }
    } catch (err) {
      addToast('Could not switch account', 'error');
    }
  };

  const handleResetDb = async () => {
    try {
      const res = await fetch('/api/admin/reset-db', { method: 'POST' });
      if (res.ok) {
        addToast('Driveit database reset to sample Indian routes', 'info');
        setTimeout(() => window.location.reload(), 600);
      }
    } catch (err) {
      addToast('Reset failed', 'error');
    }
  };

  const activeBtnStyle = {
    background: '#84CC16',
    borderColor: '#65A30D',
    color: '#0E240B',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '4px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '800',
    boxShadow: '0 2px 8px rgba(132, 204, 22, 0.4)',
    transition: 'all 0.15s ease'
  };

  const defaultBtnStyle = {
    background: '#FFFFFF',
    borderColor: '#E2E8F0',
    color: '#334155',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '4px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontWeight: '600',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.15s ease'
  };

  // If minimized, render a sleek floating toggle pill
  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => handleToggleVisibility(false)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 9999,
          background: '#84CC16',
          border: '1.5px solid #65A30D',
          color: '#0E240B',
          borderRadius: '9999px',
          padding: '6px 14px',
          fontSize: '12px',
          fontWeight: '900',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 6px 18px rgba(132, 204, 22, 0.45)',
          transition: 'all 150ms ease'
        }}
        title="Show Demo Role Switcher"
      >
        <Zap size={14} fill="#0E240B" />
        <span>⚡ Demo Roles</span>
      </button>
    );
  }

  return (
    <div style={{
      background: '#ECFCCB',
      borderBottom: '1px solid #BEF264',
      padding: '6px 16px',
      fontSize: '0.82rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      zIndex: 100,
      position: 'relative',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#166534',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <Zap size={14} fill="#166534" color="#166534" />
          <span>Demo Role:</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={() => handleDemoSelect('usr_rahul_driver', 'Rahul Sharma (Verified Pilot)')}
          style={user?.id === 'usr_rahul_driver' ? activeBtnStyle : defaultBtnStyle}
        >
          <Car size={13} />
          <span>Rahul Sharma</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Verified Pilot)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_vikram_pending', 'Vikram Joshi (Pending Gate Pilot)')}
          style={user?.id === 'usr_vikram_pending' ? activeBtnStyle : defaultBtnStyle}
        >
          <Car size={13} />
          <span>Vikram Joshi</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Pending Gate)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_ananya_rider', 'Ananya Sen (Passenger)')}
          style={user?.id === 'usr_ananya_rider' ? activeBtnStyle : defaultBtnStyle}
        >
          <Compass size={13} />
          <span>Ananya Sen</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Passenger)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_priya_driver', 'Priya Menon (Pilot)')}
          style={user?.id === 'usr_priya_driver' ? activeBtnStyle : defaultBtnStyle}
        >
          <Car size={13} />
          <span>Priya Menon</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Pilot)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_aman_support', 'Aman Verma (Support Desk)')}
          style={user?.id === 'usr_aman_support' ? activeBtnStyle : defaultBtnStyle}
        >
          <Shield size={13} />
          <span>Aman Verma</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Support Desk)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_rohan_dual', 'Rohan Kapoor (Dual Role)')}
          style={user?.id === 'usr_rohan_dual' ? activeBtnStyle : defaultBtnStyle}
        >
          <Layers size={13} />
          <span>Rohan Kapoor</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>(Dual Role)</span>
        </button>

        {user && (
          <div style={{
            background: '#D97706',
            color: '#FFFFFF',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: '4px'
          }}>
            <RefreshCw size={11} />
            <span>Active: {user?.roles?.includes('support') ? 'SUPPORT' : user?.roles?.includes('lister') ? 'PILOT' : 'PASSENGER'}</span>
          </div>
        )}

        {user && (
          <button
            type="button"
            onClick={() => {
              logout();
              addToast('Signed out of demo session', 'info');
            }}
            title="Sign out of current account"
            style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              borderRadius: '6px',
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700',
              marginLeft: '4px'
            }}
          >
            <LogOut size={11} />
            <span>Sign Out</span>
          </button>
        )}

        <button
          onClick={handleResetDb}
          title="Reset database"
          style={{
            background: 'none',
            border: 'none',
            color: '#166534',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          <RefreshCw size={12} />
          <span>Reset DB</span>
        </button>

        {/* Hide Toolbar Button */}
        <button
          type="button"
          onClick={() => handleToggleVisibility(true)}
          title="Hide demo role toolbar"
          style={{
            background: 'rgba(22, 101, 52, 0.12)',
            border: '1px solid rgba(22, 101, 52, 0.25)',
            color: '#166534',
            borderRadius: '6px',
            padding: '3px 8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '800',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginLeft: '6px',
            transition: 'all 120ms ease'
          }}
        >
          <X size={12} />
          <span>Hide</span>
        </button>
      </div>
    </div>
  );
}
