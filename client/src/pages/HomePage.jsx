import React, { useState, useEffect } from 'react';
import MapVisualizer from '../components/MapVisualizer';
import EVRideCard from '../components/EVRideCard';
import UpcomingTripPanel from '../components/UpcomingTripPanel';
import BoardingPassModal from '../components/BoardingPassModal';
import NeptuneHeroSection from '../components/NeptuneHeroSection';
import SearchConsole from '../components/SearchConsole';
import CinematicStorySection from '../components/CinematicStorySection';
import SavingsCalculatorSection from '../components/SavingsCalculatorSection';
import CommunityTestimonialsSection from '../components/CommunityTestimonialsSection';
import RegionalRoutesDirectorySection from '../components/RegionalRoutesDirectorySection';
import ImpactMetricsHighlightsSection from '../components/ImpactMetricsHighlightsSection';
import { ChevronRight, Sparkles, Search, ArrowRightLeft, X, MapPin, Navigation, Car, Users, Star, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Card, CardBody, Section, Button, SkeletonCard, EmptyState, Badge } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

import { useAuth } from '../context/AuthContext';
import ShinyText from '../components/ui/ShinyText';
import SpotlightCard from '../components/ui/SpotlightCard';
import usePullToRefresh from '../utils/usePullToRefresh';

export default function HomePage({ onSelectRide, onNavigate }) {
  const { user, isAuthenticated } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [activeBoardingPass, setActiveBoardingPass] = useState(null);
  const [hasActiveTrip, setHasActiveTrip] = useState(false);

  const { pullDistance, refreshing, handleTouchStart, handleTouchMove, handleTouchEnd } = usePullToRefresh(async () => {
    await fetchRides(originInput, destinationInput);
  });

  useEffect(() => {
    fetchRides(originInput, destinationInput);
  }, []);

  const fetchRides = async (searchOrigin = originInput, searchDest = destinationInput, searchDate = selectedDateTime ? selectedDateTime.split('T')[0] : '') => {
    setLoading(true);
    try {
      let url = '/api/rides?sort=departure_earliest';
      if (searchOrigin && searchOrigin.trim()) {
        url += `&origin=${encodeURIComponent(searchOrigin.trim())}`;
      }
      if (searchDest && searchDest.trim()) {
        url += `&destination=${encodeURIComponent(searchDest.trim())}`;
      }
      if (searchDate && searchDate.trim()) {
        url += `&date=${encodeURIComponent(searchDate.trim())}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let allRides = data.rides || [];
        try {
          const localDriverRides = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
          for (const lr of localDriverRides) {
            if (!allRides.some(r => r.id === lr.id)) {
              allRides.unshift(lr);
            }
          }
        } catch (e) {
          // pass
        }
        setRides(allRides);
      }
    } catch (err) {
      console.error('Error fetching rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLocations = () => {
    const tempInput = originInput;
    const tempLoc = originLocation;
    setOriginInput(destinationInput);
    setOriginLocation(destinationLocation);
    setDestinationInput(tempInput);
    setDestinationLocation(tempLoc);
    fetchRides(destinationInput, tempInput);
  };

  const handleRollSearch = (searchOrigin = originInput, searchDest = destinationInput, searchDate = selectedDateTime ? selectedDateTime.split('T')[0] : '') => {
    if (onNavigate) {
      onNavigate('pilots', {
        queryParams: {
          origin: searchOrigin,
          destination: searchDest,
          date: searchDate
        }
      });
    } else {
      fetchRides(searchOrigin, searchDest, searchDate);
    }
  };

  const handleSelectPreset = (from, to) => {
    setOriginInput(from);
    setOriginLocation(null);
    setDestinationInput(to);
    setDestinationLocation(null);
    handleRollSearch(from, to);
  };

  const handleClearLocations = () => {
    setOriginInput('');
    setOriginLocation(null);
    setDestinationInput('');
    setDestinationLocation(null);
    fetchRides('', '');
  };

  const handleOpenSampleBoardingPass = () => {
    const sampleTrip = {
      id: 'bk_sample_001',
      bookingRef: 'DRIVE-MUM-PUN-889',
      passengerName: 'Ananya Sen',
      passengerPhone: '+91 98200 12345',
      seatsBooked: 1,
      totalPrice: 385,
      status: 'CONFIRMED',
      pickupLocation: 'Bandra Kurla Complex (BKC), Mumbai',
      dropoffLocation: 'Swargate, Pune',
      driverName: 'Rahul Sharma',
      driverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      ride: {
        originAddress: 'Bandra Kurla Complex, Mumbai',
        destinationAddress: 'Swargate Metro Hub, Pune',
        departureDate: 'Tomorrow, Aug 16',
        departureTime: '07:30 AM',
        vehicle: {
          make: 'Tata',
          model: 'Nexon EV Empowered',
          plate: 'MH12 JK 3456',
          electric: true
        }
      }
    };
    setActiveBoardingPass(sampleTrip);
  };

  return (
    <div 
      className="container container-wide page"
      style={{ 
        position: 'relative',
        background: 'var(--color-bg-surface, #FFFFFF)',
        minHeight: '100vh'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Android Material Pull-to-Refresh Circular Spinner */}
      {pullDistance > 0 && (
        <div style={{
          position: 'fixed',
          top: `${Math.min(pullDistance, 55) + 16}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'var(--color-bg-surface, #FFFFFF)',
          borderRadius: '50%',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.18)',
          border: '1.5px solid rgba(132, 204, 22, 0.45)',
          transition: refreshing ? 'none' : 'top 200ms ease'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2.5px solid #CBD5E1',
            borderTopColor: '#84CC16',
            borderRadius: '50%',
            transform: `rotate(${pullDistance * 4}deg)`,
            animation: refreshing ? 'spin 700ms linear infinite' : 'none'
          }} />
        </div>
      )}

      {/* 1. Neptune Base Hero Section (Geist Typography, Aurora Laser Beam & Highway Sync) */}
      <NeptuneHeroSection 
        onNavigate={onNavigate}
      />


      {/* 2. Standalone 100% Responsive Search Console */}
      <SearchConsole
        originInput={originInput}
        setOriginInput={setOriginInput}
        destinationInput={destinationInput}
        setDestinationInput={setDestinationInput}
        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        onSearch={handleRollSearch}
        onSwap={handleSwapLocations}
        onSelectPreset={handleSelectPreset}
        onSelectOrigin={(place) => setOriginLocation(place)}
        onSelectDestination={(place) => setDestinationLocation(place)}
      />


      {/* 3. Live Telemetry Map & Cockpit View Panel — Desktop only */}
      <div className="hide-on-mobile" style={{
        maxWidth: '1360px',
        margin: '0 auto 64px',
        padding: '0 clamp(16px, 3.5vw, 40px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div className={isAuthenticated ? "responsive-grid-home-radar" : undefined} style={{
          display: 'grid',
          gridTemplateColumns: isAuthenticated ? undefined : '1fr',
          gap: '28px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', minHeight: '36px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Live Expressway Radar</span>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ● Active GPS
                </span>
              </h3>
              <span style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', fontWeight: '600' }}>
                Real-time route telemetry & FASTag
              </span>
            </div>
            <div style={{ flex: 1, minHeight: '480px' }}>
              <MapVisualizer
                origin={originLocation?.fullAddress || originInput || 'Mumbai'}
                destination={destinationLocation?.fullAddress || destinationInput || 'Pune'}
                originCoords={originLocation?.lat ? [originLocation.lat, originLocation.lng] : null}
                destCoords={destinationLocation?.lat ? [destinationLocation.lat, destinationLocation.lng] : null}
                onCorridorSelect={handleSelectPreset}
                showCorridorBar={false}
              />
            </div>
          </div>

          {isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', minHeight: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
                    {hasActiveTrip 
                      ? (user?.roles?.includes('lister') ? 'Cockpit Telemetry' : 'My Active Ride')
                      : 'Expressway Network'}
                  </h3>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '10px',
                    background: hasActiveTrip
                      ? (user?.roles?.includes('lister') ? 'rgba(132, 204, 22, 0.15)' : 'rgba(16, 185, 129, 0.15)')
                      : 'rgba(16, 185, 129, 0.15)',
                    color: hasActiveTrip
                      ? (user?.roles?.includes('lister') ? '#84CC16' : '#10B981')
                      : '#10B981',
                    border: hasActiveTrip
                      ? (user?.roles?.includes('lister') ? '1px solid rgba(132, 204, 22, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)')
                      : '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    {hasActiveTrip
                      ? (user?.roles?.includes('lister') ? '● PILOT' : '● CONFIRMED')
                      : '● LIVE RADAR'}
                  </span>
                </div>
                {hasActiveTrip ? (
                  <button
                    onClick={handleOpenSampleBoardingPass}
                    style={{
                      fontSize: '12px',
                      color: user?.roles?.includes('lister') ? '#84CC16' : '#10B981',
                      background: user?.roles?.includes('lister') ? 'rgba(132, 204, 22, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: user?.roles?.includes('lister') ? '1px solid rgba(132, 204, 22, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '10px',
                      padding: '5px 12px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {user?.roles?.includes('lister') ? 'Pilot Pass →' : 'Boarding Pass →'}
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate ? onNavigate('pilots') : (window.location.hash = '#/pilots')}
                    style={{
                      fontSize: '12px',
                      color: '#84CC16',
                      background: 'rgba(132, 204, 22, 0.1)',
                      border: '1px solid rgba(132, 204, 22, 0.25)',
                      borderRadius: '10px',
                      padding: '5px 12px',
                      cursor: 'pointer',
                      fontWeight: '800',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 150ms ease'
                    }}
                  >
                    Explore Pilots →
                  </button>
                )}
              </div>
              <div style={{ flex: 1, minHeight: '480px' }}>
                <UpcomingTripPanel
                  onOpenBoardingPass={(trip) => setActiveBoardingPass(trip)}
                  onQuickSelectRoute={(from, to) => handleSelectPreset(from, to)}
                  onActiveTripChange={(val) => setHasActiveTrip(val)}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          )}
        </div>
      </div>



      {/* 5. State-Wise Regional Routes Directory — Interactive Corridor Explorer */}
      <RegionalRoutesDirectorySection
        onSelectRoute={(from, to) => handleSelectPreset(from, to)}
      />

      {/* 6. Interactive ROI Fuel & Carbon Savings Calculator Section — Desktop only */}
      <div className="hide-on-mobile">
        <SavingsCalculatorSection
          onFindRide={() => handleRollSearch()}
          onPostRide={() => onNavigate && onNavigate('post-ride')}
        />
      </div>

      {/* 9. Cinematic 3D Automotive Story & Safety Shield — Desktop only */}
      <div className="hide-on-mobile">
        <CinematicStorySection />
      </div>

      {/* 10. Impact Metrics & Platform Highlights Section */}
      <ImpactMetricsHighlightsSection />

      {/* 11. Verified Community Voices & Pilot Testimonials Section */}
      <CommunityTestimonialsSection />

      {/* Boarding Pass Modal */}
      {activeBoardingPass && (
        <BoardingPassModal
          booking={activeBoardingPass}
          onClose={() => setActiveBoardingPass(null)}
        />
      )}
    </div>
  );
}

