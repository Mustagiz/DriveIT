import React, { useState, useEffect, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import { ThemeProvider } from './context/ThemeContext';
import { RegionalProvider } from './context/RegionalContext';
import ErrorBoundary from './components/ErrorBoundary';
import DemoToolbar from './components/DemoToolbar';
import TopNavbar from './components/TopNavbar';
import MobileNavDock from './components/MobileNavDock';
import SupportChatDrawer from './components/SupportChatDrawer';
import Footer from './components/Footer';
import RoleGuard from './components/auth/RoleGuard';

const HomePage = React.lazy(() => import('./pages/HomePage'));




const RideDetailsPage = React.lazy(() => import('./pages/RideDetailsPage'));
const ListerDashboard = React.lazy(() => import('./pages/ListerDashboard'));
const BookerDashboard = React.lazy(() => import('./pages/BookerDashboard'));
const SupportDashboard = React.lazy(() => import('./pages/SupportDashboard'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const PilotsExplorerPage = React.lazy(() => import('./pages/PilotsExplorerPage'));
const AnalyticsDashboard = React.lazy(() => import('./pages/AnalyticsDashboard'));

const parseCurrentRoute = () => {
  const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
  if (hash && hash !== 'home' && hash !== '') {
    if (hash.startsWith('ride/')) {
      return { page: 'ride-details', rideId: hash.replace('ride/', ''), queryParams: {} };
    }
    const [pagePart, queryPart] = hash.split('?');
    const queryParams = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        queryParams[key] = val;
      });
    }
    return { page: pagePart || 'home', rideId: null, queryParams };
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
        borderTopColor: '#CA8A04',
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


  const handleNavigate = (page, params = {}) => {
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
    setSelectedRideId(ride.id);
    localStorage.setItem('driveit_saved_ride_id', ride.id);
    localStorage.setItem('driveit_saved_page', 'ride-details');
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
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'admin']} onNavigate={handleNavigate}>
            <PilotsExplorerPage
              initialFilters={routeParams}
              onSelectRide={handleSelectRide}
              onNavigate={handleNavigate}
            />
          </RoleGuard>
        );
      case 'ride-details':
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'admin']} onNavigate={handleNavigate}>
            {selectedRideId ? (
              <RideDetailsPage
                rideId={selectedRideId}
                onBack={() => handleNavigate('home')}
                onNavigate={handleNavigate}
              />
            ) : null}
          </RoleGuard>
        );
      case 'lister-hub':
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
        return (
          <RoleGuard allowedRoles={['booker', 'admin']} onNavigate={handleNavigate}>
            <BookerDashboard onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'support-portal':
        return (
          <RoleGuard allowedRoles={['support', 'admin']} onNavigate={handleNavigate}>
            <SupportDashboard />
          </RoleGuard>
        );
      case 'settings':
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'admin']} requireAuth={true} onNavigate={handleNavigate}>
            <SettingsPage onNavigate={handleNavigate} />
          </RoleGuard>
        );
      case 'analytics':
        return (
          <RoleGuard allowedRoles={['booker', 'lister', 'admin']} requireAuth={true} onNavigate={handleNavigate}>
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
      default:
        return <HomePage onSelectRide={handleSelectRide} onNavigate={handleNavigate} />;

    }
  };

  const isSupportView = currentPage === 'support-portal' || user?.roles?.includes('support');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
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
      {!isSupportView && <MobileNavDock currentPage={currentPage} onNavigate={handleNavigate} />}
      {!isSupportView && <Footer onNavigate={handleNavigate} />}
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
