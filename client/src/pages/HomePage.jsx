import React, { useState, useEffect } from 'react';
import MapVisualizer from '../components/MapVisualizer';
import EVRideCard from '../components/EVRideCard';
import UpcomingTripPanel from '../components/UpcomingTripPanel';
import BoardingPassModal from '../components/BoardingPassModal';
import BlaBlaCarHeroSection from '../components/BlaBlaCarHeroSection';
import BlaBlaCarPopularRoutes from '../components/BlaBlaCarPopularRoutes';
import BlaBlaCarValueProps from '../components/BlaBlaCarValueProps';
import BlaBlaCarDriverCta from '../components/BlaBlaCarDriverCta';
import SearchConsole from '../components/SearchConsole';
import CommunityTestimonialsSection from '../components/CommunityTestimonialsSection';
import CityLandmarksShowcase from '../components/CityLandmarksShowcase';
import CitySelectionModal from '../components/CitySelectionModal';
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
  const [evOnly, setEvOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showAllCitiesModal, setShowAllCitiesModal] = useState(false);

  const filteredRides = rides.filter((ride) => {
    if (evOnly) {
      const fuel = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
      if (fuel !== 'ELECTRIC' && fuel !== 'EV') return false;
    }
    if (verifiedOnly) {
      if (ride.driverRating && Number(ride.driverRating) < 4.5) return false;
    }
    return true;
  });

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

  const handleSelectCityFromLandmark = (cityName) => {
    if (!originInput || originInput.trim() === '') {
      setOriginInput(cityName);
      fetchRides(cityName, destinationInput);
    } else if (originInput.toLowerCase().trim() === cityName.toLowerCase().trim()) {
      fetchRides(cityName, destinationInput);
    } else {
      setDestinationInput(cityName);
      fetchRides(originInput, cityName);
    }
    const el = document.getElementById('available-rides-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleCityChanged = (e) => {
      const city = e.detail;
      if (city) {
        setOriginInput(city);
        fetchRides(city, destinationInput);
      }
    };
    window.addEventListener('rideshare_city_changed', handleCityChanged);
    return () => window.removeEventListener('rideshare_city_changed', handleCityChanged);
  }, [destinationInput]);

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
          border: '1.5px solid rgba(0, 175, 245, 0.45)',
          transition: refreshing ? 'none' : 'top 200ms ease'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2.5px solid #CBD5E1',
            borderTopColor: '#00AFF5',
            borderRadius: '50%',
            transform: `rotate(${pullDistance * 4}deg)`,
            animation: refreshing ? 'spin 700ms linear infinite' : 'none'
          }} />
        </div>
      )}

      {/* 1. BlaBlaCar Hero Banner with Seamless Floating Search Capsule */}
      <BlaBlaCarHeroSection>
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
          evOnly={evOnly}
          onToggleEvOnly={() => setEvOnly((prev) => !prev)}
          verifiedOnly={verifiedOnly}
          onToggleVerifiedOnly={() => setVerifiedOnly((prev) => !prev)}
        />
      </BlaBlaCarHeroSection>

      {/* Creative Architectural City Landmarks Showcase */}
      <CityLandmarksShowcase
        onSelectCity={handleSelectCityFromLandmark}
        onOpenAllCities={() => setShowAllCitiesModal(true)}
      />

      {/* 2. BlaBlaCar Popular Routes "Where do you want to go?" */}
      <BlaBlaCarPopularRoutes
        onSelectRoute={(from, to) => handleSelectPreset(from, to)}
      />

      {/* 3. BlaBlaCar 3-Column Trust & Safety Grid */}
      <BlaBlaCarValueProps />

      {/* 4. BlaBlaCar "Driving in your car soon?" Callout Banner */}
      <BlaBlaCarDriverCta
        onPublishClick={() => onNavigate ? onNavigate('post-ride') : (window.location.hash = '#/post-ride')}
      />

      {/* 2.5 Live Available Expressway Rides Showcase */}
      <section id="available-rides-section" style={{
        maxWidth: '1360px',
        margin: '0 auto 48px',
        padding: '0 clamp(16px, 3.5vw, 40px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{
                fontSize: '22px',
                fontWeight: '900',
                color: 'var(--color-text-primary)',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Available Expressway Rides
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                background: '#EBF8FF',
                color: '#00AFF5',
                padding: '3px 10px',
                borderRadius: '12px',
                border: '1px solid rgba(0, 175, 245, 0.3)'
              }}>
                {filteredRides.length} Live
              </span>
            </div>
            <p style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              margin: '4px 0 0 0'
            }}>
              Verified pilots • FASTag toll split included • Instant seat reservation
            </p>
          </div>

          <button
            onClick={() => onNavigate ? onNavigate('pilots') : (window.location.hash = '#/pilots')}
            style={{
              fontSize: '12.5px',
              fontWeight: '800',
              color: '#00AFF5',
              background: '#EBF8FF',
              border: '1px solid rgba(0, 175, 245, 0.3)',
              borderRadius: '12px',
              padding: '7px 14px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease'
            }}
          >
            <span>Explore All Pilots</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
          </div>
        ) : filteredRides.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
            gap: '20px'
          }}>
            {filteredRides.slice(0, 6).map((ride) => (
              <EVRideCard
                key={ride.id}
                ride={ride}
                onSelect={(selectedRide) => {
                  if (typeof onSelectRide === 'function') {
                    onSelectRide(selectedRide);
                  } else if (onNavigate) {
                    onNavigate('ride-details', { rideId: selectedRide.id, ride: selectedRide });
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching expressway rides"
            description="Try switching corridor presets or clearing filter toggles to explore available trips."
            actionLabel="Reset Search Filters"
            onAction={handleClearLocations}
          />
        )}
      </section>


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
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '10px', background: 'rgba(0, 175, 245, 0.15)', color: '#00AFF5', border: '1px solid rgba(0, 175, 245, 0.3)' }}>
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
                      ? (user?.roles?.includes('lister') ? 'rgba(0, 175, 245, 0.15)' : 'rgba(0, 175, 245, 0.15)')
                      : 'rgba(0, 175, 245, 0.15)',
                    color: hasActiveTrip
                      ? (user?.roles?.includes('lister') ? '#00AFF5' : '#00AFF5')
                      : '#00AFF5',
                    border: hasActiveTrip
                      ? (user?.roles?.includes('lister') ? '1px solid rgba(0, 175, 245, 0.3)' : '1px solid rgba(0, 175, 245, 0.3)')
                      : '1px solid rgba(0, 175, 245, 0.3)'
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
                      color: user?.roles?.includes('lister') ? '#00AFF5' : '#00AFF5',
                      background: user?.roles?.includes('lister') ? 'rgba(0, 175, 245, 0.1)' : 'rgba(0, 175, 245, 0.1)',
                      border: user?.roles?.includes('lister') ? '1px solid rgba(0, 175, 245, 0.25)' : '1px solid rgba(0, 175, 245, 0.25)',
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
                      color: '#00AFF5',
                      background: 'rgba(0, 175, 245, 0.1)',
                      border: '1px solid rgba(0, 175, 245, 0.25)',
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



      {/* 5. Verified Community Voices & Pilot Testimonials Section */}
      <CommunityTestimonialsSection />

      {/* Boarding Pass Modal */}
      {activeBoardingPass && (
        <BoardingPassModal
          booking={activeBoardingPass}
          onClose={() => setActiveBoardingPass(null)}
        />
      )}

      {/* City Selection Modal */}
      <CitySelectionModal
        isOpen={showAllCitiesModal}
        onClose={() => setShowAllCitiesModal(false)}
        selectedCity={originInput || 'Mumbai'}
        onSelectCity={(city) => {
          handleSelectCityFromLandmark(city);
        }}
      />
    </div>
  );
}

