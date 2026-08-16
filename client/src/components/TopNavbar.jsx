import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Car, 
  Search,
  PlusCircle, 
  ShieldAlert, 
  Settings, 
  Bell, 
  ChevronDown, 
  Zap, 
  User, 
  Sun, 
  Moon,
  Leaf,
  QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegional } from '../context/RegionalContext';
import { useTheme } from '../context/ThemeContext';
import EcoScoreModal from './EcoScoreModal';
import EmergencySOSModal from './EmergencySOSModal';
import PilotQRScannerModal from './PilotQRScannerModal';
import styles from './TopNavbar.module.css';

export default function TopNavbar({ currentPage, onNavigate, searchQuery, onSearchChange }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useRegional();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const dropdownRef = useRef(null);

  const isHomePage = currentPage === 'home';
  const isAuthPage = currentPage === 'auth' || currentPage === 'auth-pilot';

  const userRoles = user?.roles || [];
  const isPilot = userRoles.includes('lister');
  const isPassenger = userRoles.includes('booker');
  const isSupport = userRoles.includes('support');
  const isAdmin = userRoles.includes('admin');

  // Role-Specific Navigation Generator
  const getRoleSpecificNavLinks = () => {
    if (isSupport || currentPage === 'support-portal') {
      return [
        { id: 'support-portal', label: 'Operations Desk', icon: ShieldAlert, isSpecial: true }
      ];
    }

    if (isAuthPage) {
      return [];
    }


    if (!isAuthenticated) {
      return [];
    }

    if (isAdmin) {
      return [
        { id: 'booker-trips', label: 'My Bookings', icon: Car },
        { id: 'post-ride', label: t('postRide'), icon: PlusCircle, isAction: true },
        { id: 'lister-hub', label: 'Pilot Hub', icon: Car },
        { id: 'support-portal', label: t('opsDesk'), icon: ShieldAlert, isSpecial: true },
        { id: 'settings', label: t('settings'), icon: Settings }
      ];
    }

    if (isPilot && !isPassenger) {
      return [
        { id: 'post-ride', label: 'Post a Ride', icon: PlusCircle, isAction: true },
        { id: 'lister-hub', label: 'Pilot Hub', icon: Car },
        { id: 'settings', label: t('settings'), icon: Settings }
      ];
    }

    return [
      { id: 'booker-trips', label: 'My Bookings', icon: Car }
    ];
  };


  const navLinks = getRoleSpecificNavLinks();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.brand} onClick={() => onNavigate('home')}>
          <Logo size="md" showTagline={false} />
        </div>

        <nav className={styles.nav}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`${styles.navLink} ${
                  isActive ? styles.active : ''
                } ${
                  item.isAction ? styles.action : ''
                } ${
                  item.isSpecial ? styles.special : ''
                }`}
              >
                <Icon size={16} className={item.isAction ? 'icon-pulse' : ''} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.actions}>
          {/* Eco-Score Pill Trigger */}
          <button
            type="button"
            onClick={() => setShowEcoModal(true)}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 150ms ease'
            }}
            title="View Your Carbon Offset Impact"
          >
            <Leaf size={13} />
            <span>142 kg CO₂</span>
          </button>

          {/* Emergency SOS Highway Beacon Trigger */}
          <button
            type="button"
            onClick={() => setShowSOSModal(true)}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#EF4444',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
            }}
            title="Instant Highway SOS Emergency Beacon"
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span>SOS</span>
          </button>

          {/* Pilot QR Scanner Quick Button */}
          {isPilot && (
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              style={{
                background: 'rgba(245, 158, 11, 0.14)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#F59E0B',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Scan Passenger Boarding Pass"
            >
              <QrCode size={13} />
              <span>Scan Pass</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={styles.iconButton}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Moon size={16} className="icon-pulse" /> : <Sun size={16} className="icon-spin" style={{ animationDuration: '10s' }} />}
          </button>

          {isAuthenticated && !isAuthPage && !isSupport && (
            <button
              onClick={() => onNavigate('booker-trips')}
              className={styles.iconButton}
              aria-label="Notifications"
            >
              <Bell size={16} className="icon-ring" />
              <span className={styles.badge}>1</span>
            </button>
          )}

          {isAuthenticated ? (
            <div 
              className={styles.profile} 
              ref={dropdownRef}
              onClick={() => setProfileDropdownOpen(prev => !prev)}
            >
              <div>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user?.name}
                  className={styles.profileAvatar}
                />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{user?.name || 'User'}</span>
                <span className={styles.profileRole}>
                  {user?.roles?.includes('support') ? 'Support Agent' : user?.roles?.includes('lister') ? 'Pilot' : 'Passenger'}
                </span>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }} />

              {profileDropdownOpen && (
                <div 
                  className={styles.dropdown}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.dropdownHeader}>
                    <div className={styles.dropdownName}>{user?.name}</div>
                    <div className={styles.dropdownEmail}>{user?.email}</div>
                  </div>
                  <div>
                    {!isSupport && currentPage !== 'support-portal' && (
                      <button
                        type="button"
                        onClick={() => { onNavigate('booker-trips'); setProfileDropdownOpen(false); }}
                        className={styles.dropdownItem}
                      >
                        My Bookings
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { onNavigate('settings'); setProfileDropdownOpen(false); }}
                      className={styles.dropdownItem}
                    >
                      Settings
                    </button>
                  </div>
                  <div className={styles.dropdownDivider}>
                    <button
                      type="button"
                      onClick={() => { 
                        logout(); 
                        setProfileDropdownOpen(false); 
                        onNavigate && onNavigate('home');
                      }}
                      className={styles.dropdownDanger}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => onNavigate('auth')} className={`${styles.iconButton} ${styles.loginButton}`}>
              <User size={16} />
              <span className={styles.loginText}>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Modals */}
      {showEcoModal && (
        <EcoScoreModal
          isOpen={showEcoModal}
          onClose={() => setShowEcoModal(false)}
          co2SavedKg={142}
        />
      )}

      {showSOSModal && (
        <EmergencySOSModal
          isOpen={showSOSModal}
          onClose={() => setShowSOSModal(false)}
          tripDetails={{
            vehiclePlate: 'MH-12-RN-7788',
            vehicleModel: 'Tata Nexon EV',
            pilotName: 'Rahul Sharma (UIDAI Verified)'
          }}
        />
      )}

      {showScannerModal && (
        <PilotQRScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onVerifySuccess={() => {
            onNavigate && onNavigate('lister-hub');
          }}
        />
      )}
    </>
  );
}
