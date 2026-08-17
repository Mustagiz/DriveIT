import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { 
  Car, 
  Search, 
  PlusCircle, 
  Ticket, 
  ShieldAlert, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { user, isAuthenticated, logout, activeRole } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getRoleBadge = () => {
    if (!user) return null;
    const isSupport = user.roles.includes('support') || user.roles.includes('admin');
    const isLister = user.roles.includes('lister');

    if (isSupport) {
      return <span className="badge badge-purple"><ShieldAlert size={10} /> Support Admin</span>;
    }
    if (isLister && user.roles.includes('booker')) {
      return <span className="badge badge-yellow"><Sparkles size={10} /> Dual Member</span>;
    }
    if (isLister) {
      return <span className="badge badge-yellow"><Car size={10} /> Verified Driver</span>;
    }
    return <span className="badge badge-cyan"><User size={10} /> Passenger</span>;
  };

  const navTo = (page, params = {}) => {
    onNavigate(page, params);
    setMobileOpen(false);
    setProfileOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      background: 'rgba(8, 12, 20, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 200, 0, 0.12)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo with Driveit Symbol & Tagline */}
        <div 
          onClick={() => navTo('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Logo size="md" showTagline={true} />
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-nav">
          <button
            onClick={() => navTo('home')}
            style={{
              background: currentPage === 'home' ? 'rgba(255, 200, 0, 0.12)' : 'transparent',
              color: currentPage === 'home' ? '#84CC16' : '#CBD5E1',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            <Search size={16} />
            <span>Find Rides</span>
          </button>

          {/* Lister / Driver Links */}
          {(user?.roles?.includes('lister') || user?.roles?.includes('admin')) && (
            <>
              <button
                onClick={() => navTo('lister-hub')}
                style={{
                  background: currentPage === 'lister-hub' ? 'rgba(255, 200, 0, 0.15)' : 'transparent',
                  color: currentPage === 'lister-hub' ? '#84CC16' : '#CBD5E1',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Car size={16} />
                <span>Driver Hub</span>
              </button>

              <button
                onClick={() => navTo('post-ride')}
                className="btn-primary btn-sm"
                style={{ marginLeft: '4px' }}
              >
                <PlusCircle size={15} />
                <span>Post a Ride</span>
              </button>
            </>
          )}

          {/* Booker / Passenger Links */}
          {user?.roles?.includes('booker') && (
            <button
              onClick={() => navTo('booker-trips')}
              style={{
                background: currentPage === 'booker-trips' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: currentPage === 'booker-trips' ? '#38BDF8' : '#CBD5E1',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Ticket size={16} />
              <span>My Trips</span>
            </button>
          )}

          {/* Support / Admin Portal */}
          {(user?.roles?.includes('support') || user?.roles?.includes('admin')) && (
            <button
              onClick={() => navTo('support-portal')}
              style={{
                background: currentPage === 'support-portal' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.1)',
                color: '#C084FC',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldAlert size={15} />
              <span>Support Portal</span>
            </button>
          )}
        </nav>

        {/* User Profile / Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 200, 0, 0.3)',
                  borderRadius: '30px',
                  padding: '4px 10px 4px 5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <img
                  src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                  alt={user.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1.5px solid #FFC800'
                  }}
                />
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', lineHeight: 1.1 }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#84CC16', textTransform: 'capitalize', fontWeight: '700' }}>
                    {user.roles?.join(' & ')}
                  </span>
                </div>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="glass-panel animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    padding: '8px',
                    zIndex: 1000,
                    boxShadow: 'var(--shadow-lg)',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0'
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</div>
                    <div style={{ marginTop: '6px' }}>{getRoleBadge()}</div>
                  </div>

                  <div style={{ padding: '6px 0' }}>
                    {user.roles.includes('booker') && (
                      <button
                        onClick={() => navTo('booker-trips')}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          color: '#CBD5E1',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Ticket size={14} /> My Bookings
                      </button>
                    )}

                    {(user.roles.includes('lister') || user.roles.includes('admin')) && (
                      <button
                        onClick={() => navTo('lister-hub')}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          color: '#CBD5E1',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Car size={14} /> My Listed Rides
                      </button>
                    )}

                    {(user.roles.includes('support') || user.roles.includes('admin')) && (
                      <button
                        onClick={() => navTo('support-portal')}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'transparent',
                          border: 'none',
                          padding: '8px 12px',
                          color: '#C084FC',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <ShieldAlert size={14} /> Support & Moderation
                      </button>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '4px' }}>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'transparent',
                        border: 'none',
                        padding: '8px 12px',
                        color: '#FB7185',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navTo('auth')}
              className="btn-primary btn-sm"
            >
              <User size={15} />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFC800',
              cursor: 'pointer',
              display: 'none',
              padding: '6px'
            }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          padding: '16px 20px',
          background: '#080C14',
          borderTop: '1px solid rgba(255,200,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <button
            onClick={() => navTo('home')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Search size={16} /> Find Rides
          </button>
          <button
            onClick={() => navTo('post-ride')}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <PlusCircle size={16} /> Post a Ride
          </button>
          <button
            onClick={() => navTo('booker-trips')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Ticket size={16} /> My Bookings
          </button>
          <button
            onClick={() => navTo('support-portal')}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#C084FC' }}
          >
            <ShieldAlert size={16} /> Support Portal
          </button>
        </div>
      )}
    </header>
  );
}
