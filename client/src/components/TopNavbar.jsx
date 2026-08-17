import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';
import { 
  Home,
  Compass,
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
  QrCode,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegional } from '../context/RegionalContext';
import { useTheme } from '../context/ThemeContext';
import EcoLeaderboardModal from './eco/EcoLeaderboardModal';
import EmergencySOSModal from './EmergencySOSModal';
import PilotQRScannerModal from './PilotQRScannerModal';
import styles from './TopNavbar.module.css';

export default function TopNavbar({ currentPage, onNavigate, searchQuery, onSearchChange }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useRegional();
  const { theme, toggleTheme, isDark } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isHomePage = currentPage === 'home';
  const isAuthPage = currentPage === 'auth' || currentPage === 'auth-pilot';

  const userRoles = user?.roles || [];
  const isPilot = userRoles.includes('lister');
  const isPassenger = userRoles.includes('booker');
  const isSupport = userRoles.includes('support');
  const isAdmin = userRoles.includes('admin');

  // Role-Specific Navigation Generator
  const getRoleSpecificNavLinks = () => {
    if (isAuthPage) {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'how-it-works', label: 'How It Works', icon: HelpCircle }
      ];
    }

    if (isSupport || currentPage === 'support-portal') {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'pilots', label: 'Explore Pilots', icon: Compass },
        { id: 'support-portal', label: 'Operations Desk', icon: ShieldAlert, isSpecial: true }
      ];
    }

    if (!isAuthenticated) {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
        { id: 'pilots', label: 'Explore Pilots', icon: Compass }
      ];
    }

    if (isAdmin) {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'pilots', label: 'Explore Pilots', icon: Compass },
        { id: 'lister-hub', label: 'Pilot Hub', icon: Car },
        { id: 'booker-trips', label: 'My Bookings', icon: Car },
        { id: 'support-portal', label: 'Operations Desk', icon: ShieldAlert, isSpecial: true },
        { id: 'post-ride', label: 'Post a Ride', icon: PlusCircle, isAction: true }
      ];
    }

    if (isPilot && !isPassenger) {
      return [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'pilots', label: 'Explore Pilots', icon: Compass },
        { id: 'lister-hub', label: 'Pilot Hub', icon: Car },
        { id: 'post-ride', label: 'Post a Ride', icon: PlusCircle, isAction: true }
      ];
    }

    return [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
      { id: 'pilots', label: 'Explore Pilots', icon: Compass },
      { id: 'booker-trips', label: 'My Bookings', icon: Car }
    ];
  };

  const navLinks = getRoleSpecificNavLinks();

  const handleNavLinkClick = (id) => {
    setMobileMenuOpen(false);
    if (id === 'how-it-works') {
      if (currentPage === 'home') {
        const el = document.getElementById('how-it-works');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }, 180);
      return;
    }
    onNavigate(id);
  };

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.brand} onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
          <Logo size="md" showTagline={false} />
        </div>

        {/* Desktop Segmented Navigation (Hidden on Mobile) */}
        <nav className={styles.nav}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavLinkClick(item.id)}
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

        {/* Desktop & Mobile Actions */}
        <div className={styles.actions}>
          {/* Eco-Score Pill Trigger (Desktop) */}
          <button
            type="button"
            onClick={() => setShowEcoModal(true)}
            className={styles.desktopOnlyBtn}
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#10B981',
              borderRadius: '9999px',
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)'
            }}
            title="Instant Highway SOS Emergency Beacon"
          >
            <ShieldAlert size={14} className="animate-pulse" />
            <span>SOS</span>
          </button>

          {/* Pilot QR Scanner Quick Button (Desktop) */}
          {isPilot && (
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className={styles.desktopOnlyBtn}
              style={{
                background: 'rgba(132, 204, 22, 0.15)',
                border: '1px solid rgba(132, 204, 22, 0.45)',
                color: '#4D7C0F',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 150ms ease'
              }}
              title="Scan Passenger Boarding Pass"
            >
              <QrCode size={13} />
              <span>Scan Pass</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={styles.iconButton}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Moon size={16} className="icon-pulse" /> : <Sun size={16} className="icon-spin" style={{ animationDuration: '10s' }} />}
          </button>

          {/* Notifications Icon (Desktop) */}
          {isAuthenticated && !isAuthPage && !isSupport && (
            <button
              onClick={() => onNavigate('booker-trips')}
              className={`${styles.iconButton} ${styles.desktopOnlyBtn}`}
              aria-label="Notifications"
            >
              <Bell size={16} className="icon-ring" />
              <span className={styles.badge}>1</span>
            </button>
          )}

          {/* User Profile Dropdown (Desktop) */}
          {isAuthenticated ? (
            <div 
              className={`${styles.profile} ${styles.desktopOnlyProfile}`} 
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
            <div className={styles.desktopOnlyAuth} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                type="button"
                onClick={() => onNavigate('auth')} 
                style={{
                  background: 'transparent',
                  border: isDark ? '1.5px solid rgba(255, 255, 255, 0.25)' : '1.5px solid #CBD5E1',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => onNavigate('auth')} 
                style={{
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#0E240B',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)',
                  transition: 'all 150ms ease'
                }}
              >
                Sign up
              </button>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className={styles.hamburgerBtn}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu & Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileMenuOpen(false)}>
          <div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
            
            {/* User Profile Card or Auth CTA in Mobile Drawer */}
            {isAuthenticated ? (
              <div className={styles.mobileUserCard}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user?.name}
                  className={styles.mobileUserAvatar}
                />
                <div className={styles.mobileUserInfo}>
                  <div className={styles.mobileUserName}>{user?.name || 'User'}</div>
                  <div className={styles.mobileUserRole}>
                    {user?.roles?.includes('support') ? '🛡️ Support Desk' : user?.roles?.includes('lister') ? '🚗 Verified Pilot' : '🎒 Verified Commuter'}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.mobileAuthRow}>
                <button
                  type="button"
                  onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                  className={styles.mobileLoginBtn}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                  className={styles.mobileSignupBtn}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Quick Actions Strip (Eco & QR Scanner) */}
            <div className={styles.mobileQuickStrip}>
              <button
                type="button"
                onClick={() => { setShowEcoModal(true); setMobileMenuOpen(false); }}
                className={styles.mobileEcoPill}
              >
                <Leaf size={14} />
                <span>142 kg CO₂ Saved</span>
              </button>

              {isPilot && (
                <button
                  type="button"
                  onClick={() => { setShowScannerModal(true); setMobileMenuOpen(false); }}
                  className={styles.mobileScanPill}
                >
                  <QrCode size={14} />
                  <span>Scan Pass</span>
                </button>
              )}
            </div>

            {/* Navigation Links List */}
            <div className={styles.mobileNavList}>
              <div className={styles.mobileNavSectionLabel}>Navigation</div>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavLinkClick(item.id)}
                    className={`${styles.mobileNavLink} ${
                      isActive ? styles.mobileNavLinkActive : ''
                    } ${
                      item.isAction ? styles.mobileNavLinkAction : ''
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {isAuthenticated && (
                <>
                  <div className={styles.mobileNavSectionLabel} style={{ marginTop: '8px' }}>Account & Settings</div>
                  <button
                    type="button"
                    onClick={() => { onNavigate('settings'); setMobileMenuOpen(false); }}
                    className={`${styles.mobileNavLink} ${currentPage === 'settings' ? styles.mobileNavLinkActive : ''}`}
                  >
                    <Settings size={18} />
                    <span>Account & KYC Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                      onNavigate('home');
                    }}
                    className={styles.mobileLogoutBtn}
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showEcoModal && (
        <EcoLeaderboardModal
          isOpen={showEcoModal}
          onClose={() => setShowEcoModal(false)}
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
