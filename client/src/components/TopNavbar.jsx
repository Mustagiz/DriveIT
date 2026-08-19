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
  Sparkles,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  Headset,
  Check,
  CheckCircle2,
  CreditCard,
  ArrowRight
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedNotifModal, setSelectedNotifModal] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Active Boarding Pass Ready',
      message: 'Your Mumbai ➔ Pune EV departure is confirmed with Pilot Karan Mehra. Boarding PIN #4819 generated.',
      time: '5m ago',
      type: 'trip',
      unread: true,
      category: 'Expressway Ride'
    },
    {
      id: 'notif_2',
      title: 'FASTag Toll Escrow Cleared',
      message: '₹350 FASTag electronic toll payment verified in secure escrow ledger.',
      time: '45m ago',
      type: 'payment',
      unread: true,
      category: 'FASTag Payment'
    },
    {
      id: 'notif_3',
      title: 'UIDAI Security Verified',
      message: 'Aadhaar identity & emergency contact verified with DigiLocker and Verhoeff mathematical checksum.',
      time: '1d ago',
      type: 'security',
      unread: false,
      category: 'Trust & Safety'
    }
  ]);
  const dropdownRef = useRef(null);
  const notifDropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleNotificationClick = (n) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
    setNotificationsOpen(false);
    setSelectedNotifModal(n);
  };

  const handleToggleReadStatus = (e, notifId) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(item => item.id === notifId ? { ...item, unread: !item.unread } : item));
  };

  const handleDeleteNotification = (e, notifId) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(item => item.id !== notifId));
  };

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

    if (user?.activeRole === 'lister' || (isPilot && !isPassenger)) {
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
    setMobileDrawerOpen(false);
    onNavigate(id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    if (profileDropdownOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, notificationsOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  return (
    <>
      <header className={styles.navbar}>
        {/* Brand Logo */}
        <div className={styles.brand} onClick={() => { onNavigate('home'); setMobileDrawerOpen(false); }}>
          <Logo size="md" showTagline={false} />
        </div>

        {/* Desktop Segmented Island Navigation */}
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

        {/* Actions Row */}
        <div className={styles.actions}>
          {/* Eco-Score Pill (Desktop) */}
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

          {/* Emergency SOS Highway Beacon - ONLY for Authenticated / Logged-in Users */}
          {isAuthenticated && (
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
          )}

          {/* QR Scanner (Desktop) */}
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

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={styles.iconButton}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Moon size={16} className="icon-pulse" /> : <Sun size={16} className="icon-spin" style={{ animationDuration: '10s' }} />}
          </button>

          {/* Notifications Center Dropdown */}
          {isAuthenticated && !isAuthPage && !isSupport && (
            <div style={{ position: 'relative' }} ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(prev => !prev)}
                className={`${styles.iconButton} ${styles.desktopOnlyBtn}`}
                aria-label="Notifications"
                style={{ position: 'relative' }}
              >
                <Bell size={16} className={unreadCount > 0 ? "icon-ring" : ""} />
                {unreadCount > 0 && (
                  <span className={styles.badge}>{unreadCount}</span>
                )}
              </button>

              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: '-60px',
                  width: '360px',
                  maxWidth: '90vw',
                  background: 'var(--color-bg-surface, #FFFFFF)',
                  border: '1.5px solid var(--color-border, #E2E8F0)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
                  zIndex: 9999,
                  overflow: 'hidden',
                  backdropFilter: 'blur(16px)'
                }}>
                  {/* Header */}
                  <div style={{
                    padding: '14px 18px',
                    background: 'var(--color-bg-secondary, #F8FAFC)',
                    borderBottom: '1px solid var(--color-border, #E2E8F0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '900', color: 'var(--color-text-primary, #0F172A)' }}>
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span style={{
                          background: 'rgba(132, 204, 22, 0.15)',
                          color: '#4D7C0F',
                          border: '1px solid rgba(132, 204, 22, 0.3)',
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '2px 7px',
                          borderRadius: '9999px'
                        }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#84CC16',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          padding: '2px 6px'
                        }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--color-text-tertiary, #94A3B8)', fontSize: '13px' }}>
                        <Bell size={24} style={{ opacity: 0.3, margin: '0 auto 8px', display: 'block' }} />
                        No unread notifications
                      </div>
                    ) : (
                      notifications.map(n => {
                        const IconComponent = n.type === 'trip' ? Car : n.type === 'payment' ? CreditCard : n.type === 'security' ? ShieldCheck : Bell;
                        const iconColor = n.type === 'trip' ? '#84CC16' : n.type === 'payment' ? '#3B82F6' : n.type === 'security' ? '#10B981' : '#F59E0B';
                        const iconBg = n.type === 'trip' ? 'rgba(132, 204, 22, 0.15)' : n.type === 'payment' ? 'rgba(59, 130, 246, 0.15)' : n.type === 'security' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)';

                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: '12px 16px',
                              borderBottom: '1px solid var(--color-border, #F1F5F9)',
                              background: n.unread ? 'rgba(132, 204, 22, 0.06)' : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 120ms ease',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start',
                              position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary, #F8FAFC)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = n.unread ? 'rgba(132, 204, 22, 0.06)' : 'transparent'}
                          >
                            {/* Category Icon Badge */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '10px',
                              background: iconBg,
                              color: iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px'
                            }}>
                              <IconComponent size={16} />
                            </div>

                            {/* Notification Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                <span style={{ fontSize: '12.5px', fontWeight: n.unread ? '900' : '700', color: 'var(--color-text-primary, #0F172A)' }}>
                                  {n.title}
                                </span>
                                <span style={{ fontSize: '10.5px', color: 'var(--color-text-tertiary, #94A3B8)', fontWeight: '600', marginLeft: '6px' }}>
                                  {n.time}
                                </span>
                              </div>
                              <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--color-text-secondary, #64748B)', lineHeight: '1.45' }}>
                                {n.message}
                              </p>

                              {/* Quick Action Badges */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  color: iconColor,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em'
                                }}>
                                  {n.category || 'Notification'}
                                </span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <button
                                    type="button"
                                    onClick={(e) => handleToggleReadStatus(e, n.id)}
                                    title={n.unread ? "Mark as read" : "Mark as unread"}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      padding: '3px',
                                      borderRadius: '4px',
                                      color: n.unread ? '#84CC16' : '#94A3B8',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <Check size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteNotification(e, n.id)}
                                    title="Dismiss notification"
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      padding: '3px',
                                      borderRadius: '4px',
                                      color: '#94A3B8',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            className={`${styles.hamburgerBtn} ${mobileDrawerOpen ? styles.hamburgerBtnActive : ''}`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileDrawerOpen}
          >
            {mobileDrawerOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Modern Slide-In Mobile Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className={styles.drawerBackdrop} onClick={() => setMobileDrawerOpen(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Top Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerBrand}>
                <Logo size="sm" showTagline={false} />
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className={styles.drawerCloseBtn}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Profile Card / Auth Status */}
            {isAuthenticated ? (
              <div className={styles.drawerUserCard}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={user?.name}
                  className={styles.drawerAvatar}
                />
                <div className={styles.drawerUserInfo}>
                  <div className={styles.drawerUserName}>{user?.name || 'User'}</div>
                  <div className={styles.drawerUserRole}>
                    {user?.roles?.includes('support') ? '🛡️ Support Desk' : user?.roles?.includes('lister') ? '🚗 Verified Pilot' : '🎒 Passenger'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { onNavigate('settings'); setMobileDrawerOpen(false); }}
                  className={styles.drawerSettingsIconBtn}
                  title="Settings"
                >
                  <Settings size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.drawerAuthRow}>
                <button
                  type="button"
                  onClick={() => { onNavigate('auth'); setMobileDrawerOpen(false); }}
                  className={styles.drawerLoginBtn}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { onNavigate('auth'); setMobileDrawerOpen(false); }}
                  className={styles.drawerSignupBtn}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Primary Navigation Links */}
            <div className={styles.drawerNavSection}>
              <div className={styles.drawerSectionTitle}>Main Menu</div>
              <div className={styles.drawerNavList}>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavLinkClick(item.id)}
                      className={`${styles.drawerNavItem} ${
                        isActive ? styles.drawerNavItemActive : ''
                      } ${
                        item.isAction ? styles.drawerNavItemAction : ''
                      }`}
                    >
                      <div className={styles.drawerNavLeft}>
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={15} opacity={0.6} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account & Settings Links */}
            {isAuthenticated && (
              <div className={styles.drawerNavSection}>
                <div className={styles.drawerSectionTitle}>Account & Safety</div>
                <div className={styles.drawerNavList}>

                  {/* Settings — visible to all authenticated users */}
                  <button
                    type="button"
                    onClick={() => { onNavigate('settings'); setMobileDrawerOpen(false); }}
                    className={`${styles.drawerNavItem} ${currentPage === 'settings' ? styles.drawerNavItemActive : ''}`}
                  >
                    <div className={styles.drawerNavLeft}>
                      <Settings size={18} />
                      <span>Account & KYC Settings</span>
                    </div>
                    <ChevronRight size={15} opacity={0.6} />
                  </button>

                  {/* Support Portal — visible to support/admin only */}
                  {(isAdmin || isSupport) && (
                    <button
                      type="button"
                      onClick={() => { onNavigate('support-portal'); setMobileDrawerOpen(false); }}
                      className={`${styles.drawerNavItem} ${currentPage === 'support-portal' ? styles.drawerNavItemActive : ''}`}
                    >
                      <div className={styles.drawerNavLeft}>
                        <ShieldAlert size={18} />
                        <span>DriveIT Support Desk</span>
                      </div>
                      <ChevronRight size={15} opacity={0.6} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileDrawerOpen(false);
                      onNavigate('home');
                    }}
                    className={styles.drawerLogoutBtn}
                  >
                    <LogOut size={18} />
                    <span>Sign Out of Session</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Badges — Shifted to Bottom of Hamburger */}
            <div className={styles.drawerQuickPills}>
              <button
                type="button"
                onClick={() => { setShowEcoModal(true); setMobileDrawerOpen(false); }}
                className={styles.drawerEcoPill}
              >
                <Leaf size={14} color="#10B981" />
                <span>142 kg CO₂ Saved</span>
              </button>

              {isPilot && (
                <button
                  type="button"
                  onClick={() => { setShowScannerModal(true); setMobileDrawerOpen(false); }}
                  className={styles.drawerScanPill}
                >
                  <QrCode size={14} color="#4D7C0F" />
                  <span>Scan Pass</span>
                </button>
              )}

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => { setShowSOSModal(true); setMobileDrawerOpen(false); }}
                  className={styles.drawerSosPill}
                >
                  <ShieldAlert size={14} color="#EF4444" />
                  <span>SOS Alert</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  window.dispatchEvent(new CustomEvent('open-support-chat'));
                }}
                className={styles.drawerEcoPill}
                style={{ background: 'rgba(132, 204, 22, 0.12)', borderColor: 'rgba(132, 204, 22, 0.35)', color: '#65A30D' }}
              >
                <Headset size={14} color="#65A30D" />
                <span>Driveit Support</span>
              </button>
            </div>

            {/* Drawer Footer */}
            <div className={styles.drawerFooter}>
              <div className={styles.themeToggleRow}>
                <span>Display Theme:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={styles.drawerThemeBtn}
                >
                  {isDark ? <Moon size={14} /> : <Sun size={14} />}
                  <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
              </div>
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

      {/* Interactive Notification Details Action Modal */}
      {selectedNotifModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #E2E8F0',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '460px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)'
          }}>
            <button
              type="button"
              onClick={() => setSelectedNotifModal(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                border: 'none',
                color: isDark ? '#94A3B8' : '#64748B',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            {/* Modal Icon & Category */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: selectedNotifModal.type === 'trip' 
                  ? 'rgba(132, 204, 22, 0.15)' 
                  : selectedNotifModal.type === 'payment' 
                  ? 'rgba(59, 130, 246, 0.15)' 
                  : 'rgba(16, 185, 129, 0.15)',
                color: selectedNotifModal.type === 'trip' 
                  ? '#84CC16' 
                  : selectedNotifModal.type === 'payment' 
                  ? '#3B82F6' 
                  : '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {selectedNotifModal.type === 'trip' ? <Car size={22} /> : selectedNotifModal.type === 'payment' ? <CreditCard size={22} /> : <ShieldCheck size={22} />}
              </div>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isDark ? '#A7CBB4' : '#4D7C0F'
                }}>
                  {selectedNotifModal.category || 'Notification'}
                </span>
                <div style={{ fontSize: '11.5px', color: 'var(--color-text-tertiary, #94A3B8)' }}>
                  Received {selectedNotifModal.time}
                </div>
              </div>
            </div>

            <h3 style={{
              margin: '0 0 10px',
              fontSize: '19px',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              letterSpacing: '-0.02em'
            }}>
              {selectedNotifModal.title}
            </h3>

            <p style={{
              margin: '0 0 24px',
              fontSize: '14px',
              color: isDark ? '#94A3B8' : '#475569',
              lineHeight: '1.6'
            }}>
              {selectedNotifModal.message}
            </p>

            {/* Context-Aware Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  const target = selectedNotifModal.type === 'trip'
                    ? (isPilot ? 'lister-hub' : 'booker-trips')
                    : selectedNotifModal.type === 'payment'
                    ? (isPilot ? 'lister-hub' : 'booker-trips')
                    : 'settings';
                  setSelectedNotifModal(null);
                  onNavigate(target);
                }}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#062103',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  fontSize: '13.5px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)'
                }}
              >
                <span>
                  {selectedNotifModal.type === 'trip'
                    ? (isPilot ? 'Open Pilot Flight Deck' : 'View My Trips & Boarding Pass')
                    : selectedNotifModal.type === 'payment'
                    ? (isPilot ? 'View Toll Offsets' : 'View Payment Details')
                    : 'Review Security Profile'}
                </span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedNotifModal(null)}
                style={{
                  background: 'transparent',
                  border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
                  color: isDark ? '#F1F5F9' : '#334155',
                  borderRadius: '12px',
                  padding: '12px 18px',
                  fontSize: '13.5px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Stay on Page
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
