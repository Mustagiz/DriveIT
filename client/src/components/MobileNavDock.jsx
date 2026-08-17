import React from 'react';
import { LayoutDashboard, Car, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRegional } from '../context/RegionalContext';
import styles from './MobileNavDock.module.css';

export default function MobileNavDock({ currentPage, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useRegional();

  const isHomePage = currentPage === 'home';
  const isAuthPage = currentPage === 'auth' || currentPage === 'auth-pilot';

  if (isAuthPage) {
    return null;
  }

  const rawNavItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'booker-trips', label: 'My Trips', icon: Car },
    ...(user?.roles?.includes('lister') || user?.roles?.includes('admin')
      ? [{ id: 'post-ride', label: 'Post Ride', icon: PlusCircle, isSpecial: true }]
      : [])
  ];

  const navItems = isHomePage
    ? rawNavItems.filter(item => !['home', 'booker-trips', 'post-ride'].includes(item.id))
    : rawNavItems;

  if (isHomePage && navItems.length === 0) {
    return null;
  }

  return (
    <nav className={styles.dock}>
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
