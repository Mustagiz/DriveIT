import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { UserCheck, Shield, Car, Compass, RefreshCw, Sparkles, Layers, Zap, LogOut } from 'lucide-react';

export default function DemoToolbar({ onNavigate }) {
  const { user, loginAsDemo, switchActiveRole, activeRole, logout } = useAuth();
  const { addToast } = useToast();

  const handleDemoSelect = async (userId, roleName) => {
    try {
      const switchedUser = await loginAsDemo(userId);
      addToast(`Switched account to ${roleName}`, 'success');

      if (switchedUser?.roles?.includes('support') || switchedUser?.roles?.includes('admin')) {
        if (onNavigate) onNavigate('support-portal');
        else window.location.hash = '#/support-portal';
      } else if (switchedUser?.roles?.includes('lister')) {
        if (onNavigate) onNavigate('lister-hub');
        else window.location.hash = '#/lister-hub';
      } else {
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

  return (
    <div style={{
      background: '#FEF9C3',
      borderBottom: '1px solid #FDE047',
      padding: '6px 20px',
      fontSize: '0.82rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      zIndex: 100,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: '#854D0E',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <Zap size={14} fill="#854D0E" color="#854D0E" />
          <span>Demo Role Tester:</span>
        </div>
        <span style={{ color: '#A16207', fontWeight: '500' }}>Select a verified Indian user account:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleDemoSelect('usr_rahul_driver', 'Rahul Sharma (Verified Pilot)')}
          style={{
            background: user?.id === 'usr_rahul_driver' ? '#FACC15' : '#FFFFFF',
            borderColor: user?.id === 'usr_rahul_driver' ? '#CA8A04' : '#E2E8F0',
            color: user?.id === 'usr_rahul_driver' ? '#713F12' : '#334155',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: user?.id === 'usr_rahul_driver' ? '800' : '500',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <Car size={13} />
          <span>Rahul Sharma</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(Verified Pilot)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_vikram_pending', 'Vikram Joshi (Pending Gate Pilot)')}
          style={{
            background: user?.id === 'usr_vikram_pending' ? '#FED7AA' : '#FFFFFF',
            borderColor: user?.id === 'usr_vikram_pending' ? '#F97316' : '#E2E8F0',
            color: user?.id === 'usr_vikram_pending' ? '#9A3412' : '#334155',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: user?.id === 'usr_vikram_pending' ? '800' : '500',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <Car size={13} />
          <span>Vikram Joshi</span>
          <span style={{ fontSize: '0.68rem', color: '#EA580C', fontWeight: '700' }}>(Pending Gate)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_ananya_rider', 'Ananya Sen (Passenger)')}
          style={{
            background: user?.id === 'usr_ananya_rider' ? '#BAE6FD' : '#FFFFFF',
            borderColor: user?.id === 'usr_ananya_rider' ? '#0284C7' : '#E2E8F0',
            color: user?.id === 'usr_ananya_rider' ? '#0369A1' : '#334155',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: user?.id === 'usr_ananya_rider' ? '800' : '500',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <Compass size={13} />
          <span>Ananya Sen</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(Passenger)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_aman_support', 'Aman Verma (Support)')}
          style={{
            background: user?.id === 'usr_aman_support' ? '#E9D5FF' : '#FFFFFF',
            borderColor: user?.id === 'usr_aman_support' ? '#9333EA' : '#E2E8F0',
            color: user?.id === 'usr_aman_support' ? '#6B21A8' : '#334155',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: user?.id === 'usr_aman_support' ? '800' : '500',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <Shield size={13} />
          <span>Aman Verma</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(Support)</span>
        </button>

        <button
          onClick={() => handleDemoSelect('usr_rohan_dual', 'Rohan Kapoor (Dual Role)')}
          style={{
            background: user?.id === 'usr_rohan_dual' ? '#FED7AA' : '#FFFFFF',
            borderColor: user?.id === 'usr_rohan_dual' ? '#EA580C' : '#E2E8F0',
            color: user?.id === 'usr_rohan_dual' ? '#9A3412' : '#334155',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontWeight: user?.id === 'usr_rohan_dual' ? '800' : '500',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.15s ease'
          }}
        >
          <Layers size={13} />
          <span>Rohan Kapoor</span>
          <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>(Dual)</span>
        </button>

        {user?.roles?.length > 1 && (
          <button
            onClick={() => {
              const nextRole = activeRole === 'lister' ? 'booker' : 'lister';
              switchActiveRole(nextRole);
              addToast(`Active view switched to ${nextRole.toUpperCase()}`, 'info');
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CA8A04',
              color: '#854D0E',
              borderRadius: '6px',
              padding: '3px 8px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700'
            }}
          >
            <RefreshCw size={11} />
            <span>Active: {activeRole === 'lister' ? 'PILOT' : activeRole.toUpperCase()}</span>
          </button>
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
            color: '#854D0E',
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
      </div>
    </div>
  );
}
