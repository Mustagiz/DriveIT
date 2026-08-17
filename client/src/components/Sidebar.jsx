import React from 'react';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Bell, 
  Settings, 
  Car, 
  Search, 
  Ticket, 
  ShieldAlert, 
  PlusCircle,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ currentPage, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    ...(isAuthenticated ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
    { id: 'booker-trips', label: 'Ride', icon: Car }
  ];

  return (
    <aside style={{
      width: '240px',
      background: '#FFFFFF',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexShrink: 0
    }}>
      {/* Top Logo & Brand */}
      <div>
        <div 
          onClick={() => onNavigate('home')} 
          style={{ cursor: 'pointer', paddingLeft: '8px', marginBottom: '36px' }}
        >
          <Logo size="md" showTagline={false} light={true} />
        </div>

        {/* Main Nav Items matching screenshot */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'search-modal') {
                    onNavigate('home');
                  } else if (item.id === 'notifications') {
                    onNavigate('booker-trips');
                  } else if (item.id === 'settings') {
                    onNavigate('settings');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#ECFCCB' : 'transparent',
                  color: isActive ? '#166534' : '#64748B',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 2px 8px rgba(132, 204, 22, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color={isActive ? '#84CC16' : '#64748B'} />
                  <span>{item.label}</span>
                </div>

                {item.pill && (
                  <span style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {item.pill}
                  </span>
                )}

                {item.badge && (
                  <span style={{
                    background: '#ECFCCB',
                    color: '#166534',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Driver Hub & Support Links at Bottom */}
      <div style={{
        paddingTop: '20px',
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {(user?.roles?.includes('lister') || user?.roles?.includes('admin')) && (
          <button
            onClick={() => onNavigate('post-ride')}
            className="btn-primary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '9px 12px' }}
          >
            <PlusCircle size={15} />
            <span>Post a Ride</span>
          </button>
        )}

        {(user?.roles?.includes('support') || user?.roles?.includes('admin')) && (
          <button
            onClick={() => onNavigate('support-portal')}
            style={{
              background: '#F3E8FF',
              border: '1px solid #D8B4FE',
              color: '#7E22CE',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldAlert size={14} />
            <span>Operations Desk</span>
          </button>
        )}

        {isAuthenticated && (
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#EF4444',
              padding: '8px 12px',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px'
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
