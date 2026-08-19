import React, { useState, useEffect, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { RegionalProvider } from './context/RegionalContext';
import ErrorBoundary from './components/ErrorBoundary';
import DemoToolbar from './components/DemoToolbar';
import TopNavbar from './components/TopNavbar';
import MobileBottomNavigation from './components/mobile/MobileBottomNavigation';
import MobileNavDock from './components/MobileNavDock';
import SupportChatDrawer from './components/SupportChatDrawer';
import Footer from './components/Footer';
import AppDownloadCtaSection from './components/AppDownloadCtaSection';
import RoleGuard from './components/auth/RoleGuard';
import ActiveTripRestrictionModal from './components/ActiveTripRestrictionModal';
import SEOHead from './components/SEOHead';
import { getActivePassengerTrip } from './utils/activeTripGuard';

function lazyRetry(componentImport) {
  return React.lazy(async () => {
    try {
      return await componentImport();
    } catch (error) {
      console.warn('Dynamic import chunk error, reloading with fresh assets:', error);
      const isReloaded = sessionStorage.getItem('driveit_lazy_reload');
      if (!isReloaded) {
        sessionStorage.setItem('driveit_lazy_reload', 'true');
        window.location.reload();
      }
      throw error;
    }
  });
}

const HomePage = lazyRetry(() => import('./pages/HomePage'));
const RideDetailsPage = lazyRetry(() => import('./pages/RideDetailsPage'));
const ListerDashboard = lazyRetry(() => import('./pages/ListerDashboard'));
const BookerDashboard = lazyRetry(() => import('./pages/BookerDashboard'));
const SupportDashboard = lazyRetry(() => import('./pages/SupportDashboard'));
const SettingsPage = lazyRetry(() => import('./pages/SettingsPage'));
const AuthPage = lazyRetry(() => import('./pages/AuthPage'));
const PilotsExplorerPage = lazyRetry(() => import('./pages/PilotsExplorerPage'));
const AnalyticsDashboard = lazyRetry(() => import('./pages/AnalyticsDashboard'));
const PrivacyPolicyPage = lazyRetry(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazyRetry(() => import('./pages/TermsOfServicePage'));
const CockpitPage = lazyRetry(() => import('./pages/CockpitPage'));

const parseCurrentRoute = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
  if (hash && hash !== 'home' && hash !== '') {
    if (hash.startsWith('ride/')) {
      return { page: 'ride-details', rideId: hash.replace('ride/', ''), queryParams: {} };
    }
    const [page, queryStr] = hash.split('?');
    const queryParams = {};
    if (queryStr) {
      new URLSearchParams(queryStr).forEach((val, key) => {
        queryParams[key] = val;
      });
    }
    return { page, rideId: null, queryParams };
  }
  // Default first landing page is ALWAYS the main HomePage
  return { page: 'home', rideId: null, queryParams: {} };
};


function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#64748B'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #E2E8F0',
        borderTopColor: '#84CC16',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppContent() {
  const initialRoute = parseCurrentRoute();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [selectedRideId, setSelectedRideId] = useState(initialRoute.rideId);
  const [routeParams, setRouteParams] = useState(initialRoute.queryParams || {});
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Mobile Keyboard Detection (Auto-hide bottom dock on typing)
  useEffect(() => {
    const handleFocusIn = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        document.body.classList.add('keyboard-visible');
      }
    };
    const handleFocusOut = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        document.body.classList.remove('keyboard-visible');
      }
    };
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const route = parseCurrentRoute();
      setCurrentPage(route.page);
      if (route.rideId) {
        setSelectedRideId(route.rideId);
      }
      if (route.queryParams) {
        setRouteParams(route.queryParams);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Gracefully redirect user if their active role doesn't permit viewing currentPage
  useEffect(() => {
    if (!user) return;
    const userRoles = user.roles || [];
    const isAdmin = userRoles.includes('admin');
    const isSupport = userRoles.includes('support') || isAdmin;
    const isPilot = userRoles.includes('lister') || isAdmin;

    if (currentPage === 'support-portal' && !isSupport) {
      handleNavigate('home');
    } else if ((currentPage === 'lister-hub' || currentPage === 'post-ride') && !isPilot) {
      handleNavigate('home');
    }
  }, [user, currentPage]);


  const [activeRestrictionModalOpen, setActiveRestrictionModalOpen] = useState(false);
  const [activeRestrictionSession, setActiveRestrictionSession] = useState(null);

  const handleNavigate = (page, params = {}) => {
    // Intercept navigation to ride details if user has active session
    if (page === 'ride-details' || page.startsWith('ride/') || params.rideId) {
      const activeCheck = getActivePassengerTrip();
      if (activeCheck.hasActiveSession) {
        setActiveRestrictionSession(activeCheck);
        setActiveRestrictionModalOpen(true);
        return;
      }
    }

    if (params.rideId) {
      setSelectedRideId(params.rideId);
      localStorage.setItem('driveit_saved_ride_id', params.rideId);
      window.location.hash = `#/ride/${params.rideId}`;
    } else if (params.queryParams && Object.keys(params.queryParams).length > 0) {
      setRouteParams(params.queryParams);
      const qs = new URLSearchParams(params.queryParams).toString();
      window.location.hash = `#/${page}?${qs}`;
    } else {
      setRouteParams({});
      window.location.hash = `#/${page}`;
    }
    setCurrentPage(page);
    localStorage.setItem('driveit_saved_page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRide = (ride) => {
    // Enforce 1 active trip policy
    const activeCheck = getActivePassengerTrip();
    if (activeCheck.hasActiveSession) {
      setActiveRestrictionSession(activeCheck);
      setActiveRestrictionModalOpen(true);
      return;
    }
    setSelectedRideId(ride.id);
    localStorage.setItem('driveit_saved_ride_id', ride.id);
    localStorage.setItem('driveit_saved_page', 'ride-details');
    try {
      sessionStorage.setItem('driveit_selected_ride', JSON.stringify(ride));
    } catch (e) {}
    window.location.hash = `#/ride/${ride.id}`;
    setCurrentPage('ride-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSelectRide={handleSelectRide} onNavigate={handleNavigate} />;

      case 'pilots':
      case 'available-rides':
      case 'explore-pilots':
      case 'corridors':
      case 'corridor':
      case 'rides':
      case 'find-rides':
      case 'explore':
      case 'search':
        return (
          <PilotsExplorerPage
            initialFilters={routeParams}
            onSelectRide={handleSelectRide}
            onNavigate={handleNavigate}
          />
        );
      case 'ride-details':
      case 'ride':
        return selectedRideId ? (
          <RideDetailsPage
            rideId={selectedRideId}
            onBack={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        ) : (
          <PilotsExplorerPage
            initialFilters={routeParams}
            onSelectRide={handleSelectRide}
            onNavigate={handleNavigate}
          />
        );

      case 'lister-hub':
      case 'lister':
        return (
          <RoleGuard allowedRoles={['lister', 'admin']} onNavigate={handleNavigate}>
            <ListerDashboard key="lister-hub" initialTab="listings" onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'post-ride':
        return (
          <RoleGuard allowedRoles={['lister', 'admin']} onNavigate={handleNavigate}>
            <ListerDashboard key="post-ride" initialTab="post" onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'booker-trips':
      case 'booker':
      case 'trips':
      case 'my-bookings':
      case 'bookings':
      case 'my-trips':
        return (
          <RoleGuard allowedRoles={['booker', 'passenger', 'lister', 'pilot', 'admin', 'support']} onNavigate={handleNavigate}>
            <BookerDashboard onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'support-portal':
      case 'support':
        return (
          <RoleGuard allowedRoles={['support', 'admin']} onNavigate={handleNavigate}>
            <SupportDashboard />
          </RoleGuard>
        );
      case 'settings':
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'support', 'admin']} requireAuth={true} onNavigate={handleNavigate}>
            <SettingsPage onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'analytics':
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'support', 'admin']} requireAuth={true} onNavigate={handleNavigate}>
            <AnalyticsDashboard
              token={user?.token || localStorage.getItem('driveit_token')}
              userType={user?.roles?.includes('lister') ? 'pilot' : 'passenger'}
            />
          </RoleGuard>
        );
      case 'auth':
        return <AuthPage initialAccountType="passenger" onNavigate={handleNavigate} />;
      case 'auth-pilot':
        return <AuthPage initialAccountType="pilot" onNavigate={handleNavigate} />;
      case 'privacy-policy':
      case 'privacy':
        return <PrivacyPolicyPage onBack={() => handleNavigate('home')} />;
      case 'terms-of-service':
      case 'terms':
        return <TermsOfServicePage onBack={() => handleNavigate('home')} />;
      case 'cockpit':
      case 'live-radar':
      case 'in-trip':
        return <CockpitPage onNavigate={handleNavigate} rideId={selectedRideId || routeParams?.tripId || 'ride_mum_pun_001'} />;
      default:
        return <HomePage onSelectRide={handleSelectRide} onNavigate={handleNavigate} />;

    }
  };

  const isSupportView = currentPage === 'support-portal' || user?.roles?.includes('support');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
      <SEOHead currentPage={currentPage} />
      <DemoToolbar onNavigate={handleNavigate} />
      <TopNavbar

        currentPage={currentPage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main style={{ flex: 1, background: 'var(--color-bg-primary)', width: '100%', maxWidth: isSupportView ? '100%' : '1440px', margin: '0 auto', padding: isSupportView ? '0 16px' : undefined }}>
        <Suspense fallback={<LoadingSpinner />}>
          {renderPage()}
        </Suspense>
      </main>
      {!isSupportView && <SupportChatDrawer />}
      {!isSupportView && <MobileBottomNavigation currentPage={currentPage} onNavigate={handleNavigate} />}
      {!isSupportView && <AppDownloadCtaSection />}
      {!isSupportView && <Footer onNavigate={handleNavigate} />}

      {/* Global 1 Active Trip Policy Modal */}
      <ActiveTripRestrictionModal
        isOpen={activeRestrictionModalOpen}
        onClose={() => setActiveRestrictionModalOpen(false)}
        onNavigate={handleNavigate}
        activeSession={activeRestrictionSession}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <RegionalProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </RegionalProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
