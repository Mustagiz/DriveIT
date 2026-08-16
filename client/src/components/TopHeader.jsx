import React, { useState } from 'react';
import { Search, SlidersHorizontal, Bell, Settings, ChevronDown, User, ShieldAlert, Car, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopHeader({ onSearchChange, searchQuery, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header style={{
      height: '70px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Search Bar matching mockup */}
      <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
        <Search 
          size={16} 
          color="#94A3B8" 
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
        />
        <input
          type="text"
          placeholder="Search Mumbai, Pune, EV rides, highway routes..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 40px 9px 38px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            background: '#F8FAFC',
            fontSize: '0.88rem',
            color: '#0F172A',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#FACC15';
            e.target.style.background = '#FFFFFF';
            e.target.style.boxShadow = '0 0 0 3px rgba(234, 179, 8, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#E2E8F0';
            e.target.style.background = '#F8FAFC';
            e.target.style.boxShadow = 'none';
          }}
        />
        <SlidersHorizontal 
          size={14} 
          color="#64748B" 
          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
        />
      </div>

      {/* Right Controls: Bell, Settings, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell with red dot */}
        <button
          onClick={() => onNavigate('booker-trips')}
          style={{
            position: 'relative',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            transition: 'all 0.15s'
          }}
          title="Notifications"
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.6rem',
            fontWeight: '700',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #FFFFFF'
          }}>
            1
          </span>
        </button>

        {/* Settings Icon - Only visible when logged in */}
        {isAuthenticated && (
          <button
            onClick={() => onNavigate('settings')}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              transition: 'all 0.15s'
            }}
            title="Settings"
          >
            <Settings size={17} />
          </button>
        )}

        {/* User Profile Pill matching mockup */}
        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '4px 12px 4px 6px',
                borderRadius: '30px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s'
              }}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                alt={user?.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid #FFC800'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0F172A', lineHeight: 1.1 }}>
                  {user?.name || 'User Profile'}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '500' }}>
                  {user?.roles?.includes('lister') ? 'Verified Pilot' : 'Passenger Member'}
                </div>
              </div>
              <ChevronDown size={14} color="#94A3B8" />
            </div>

            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '210px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{user?.email}</div>
                </div>

                <div style={{ padding: '4px 0' }}>
                  <button
                    onClick={() => {
                      onNavigate('booker-trips');
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      color: '#334155',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                  >
                    My Bookings
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('lister-hub');
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      color: '#334155',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                  >
                    Driver Listings
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      color: '#334155',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                  >
                    Settings & Profile
                  </button>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '4px' }}>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.82rem',
                      color: '#EF4444',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      fontWeight: '600'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('auth')}
            className="btn-primary btn-sm"
          >
            <User size={14} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
