import React from 'react';
import { 
  Compass, 
  Search, 
  Car, 
  Ticket, 
  User, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Haptics } from '../../utils/haptics';
import useMaterialRipple from '../../utils/useMaterialRipple';
import styles from './MobileBottomNavigation.module.css';

export default function MobileBottomNavigation({ currentPage, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const triggerRipple = useMaterialRipple();

  const navItems = [
    {
      id: 'home',
      label: 'Explore',
      icon: <Compass size={20} />,
      activeMatch: ['home']
    },
    {
      id: 'pilots',
      label: 'Find Rides',
      icon: <Search size={20} />,
      activeMatch: ['pilots', 'available-rides', 'explore-pilots', 'rides']
    },
    {
      id: 'post-ride',
      label: 'Post Ride',
      icon: <Car size={20} />,
      activeMatch: ['post-ride', 'lister-hub', 'lister']
    },
    {
      id: 'booker-trips',
      label: 'My Trips',
      icon: <Ticket size={20} />,
      activeMatch: ['booker-trips', 'trips', 'my-bookings'],
      hasBadge: isAuthenticated
    },
    {
      id: 'profile',
      label: isAuthenticated ? 'Profile' : 'Sign In',
      icon: <User size={20} />,
      activeMatch: ['profile', 'auth', 'settings']
    }
  ];

  const handleItemClick = (e, item) => {
    triggerRipple(e, true);
    if (onNavigate) {
      if (item.id === 'profile') {
        if (isAuthenticated) {
          onNavigate('profile');
        } else {
          onNavigate('auth');
        }
      } else {
        onNavigate(item.id);
      }
    }
  };

  return (
    <nav className={`${styles.bottomNavWrapper} md-bottom-nav-bar`} aria-label="Mobile Bottom Navigation">
      <ul className={styles.navItemsList}>
        {navItems.map((item) => {
          const isActive = item.activeMatch.includes(currentPage);
          return (
            <li key={item.id} className={styles.navItem}>
              <button
                type="button"
                className={`${styles.navButton} md-ripple-container`}
                onClick={(e) => handleItemClick(e, item)}
                aria-selected={isActive}
              >
                <div className={`${styles.iconContainer} ${isActive ? styles.iconContainerActive : ''}`}>
                  {item.icon}
                  {item.hasBadge && <span className={styles.badgeDot} />}
                </div>
                <span className={`${styles.navLabel} ${isActive ? styles.navLabelActive : ''}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
