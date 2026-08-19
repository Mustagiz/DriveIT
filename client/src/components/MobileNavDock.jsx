import React from 'react';
import { LayoutDashboard, Search, Car, PlusCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegional } from '../context/RegionalContext';
import styles from './MobileNavDock.module.css';

export default function MobileNavDock({ currentPage, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useRegional();

  const isAuthPage = currentPage === 'auth' || currentPage === 'auth-pilot';

  if (isAuthPage) {
    return null;
  }

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'pilots', label: 'Find Rides', icon: Search },
    { id: 'post-ride', label: 'Post Ride', icon: PlusCircle, isSpecial: true },
    { id: 'booker-trips', label: 'My Trips', icon: Car },
    { id: 'settings', label: isAuthenticated ? 'Profile' : 'Sign In', icon: User }
  ];

  return (
    <nav className={styles.dock} aria-label="Mobile Navigation Dock">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`${styles.dockItem} ${isActive ? styles.active : ''} ${item.isSpecial ? styles.special : ''}`}
            aria-label={item.label}
          >
            <div className={styles.iconWrapper}>
              <Icon size={20} />
              {isActive && <span className={styles.activeDot} />}
            </div>
            <span className={styles.label}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
