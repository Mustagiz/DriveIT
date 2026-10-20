import React, { useState, useEffect } from 'react';
import BlaBlaCarHeroSection from '../components/BlaBlaCarHeroSection';
import BlaBlaCarPopularRoutes from '../components/BlaBlaCarPopularRoutes';
import BlaBlaCarValueProps from '../components/BlaBlaCarValueProps';
import BlaBlaCarDriverCta from '../components/BlaBlaCarDriverCta';
import SearchConsole from '../components/SearchConsole';
import CommunityTestimonialsSection from '../components/CommunityTestimonialsSection';
import CityLandmarksShowcase from '../components/CityLandmarksShowcase';
import CitySelectionModal from '../components/CitySelectionModal';
import usePullToRefresh from '../utils/usePullToRefresh';

export default function HomePage({ onNavigate }) {
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [originLocation, setOriginLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [evOnly, setEvOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showAllCitiesModal, setShowAllCitiesModal] = useState(false);

  const { pullDistance, refreshing, handleTouchStart, handleTouchMove, handleTouchEnd } = usePullToRefresh(async () => {
    // Refresh handler
  });

  const handleSwapLocations = () => {
    const tempInput = originInput;
    const tempLoc = originLocation;
    setOriginInput(destinationInput);
    setOriginLocation(destinationLocation);
    setDestinationInput(tempInput);
    setDestinationLocation(tempLoc);
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
      handleRollSearch(cityName, destinationInput);
    } else if (originInput.toLowerCase().trim() === cityName.toLowerCase().trim()) {
      handleRollSearch(cityName, destinationInput);
    } else {
      setDestinationInput(cityName);
      handleRollSearch(originInput, cityName);
    }
  };

  useEffect(() => {
    const handleCityChanged = (e) => {
      const city = e.detail;
      if (city) {
        setOriginInput(city);
      }
    };
    window.addEventListener('rideshare_city_changed', handleCityChanged);
    return () => window.removeEventListener('rideshare_city_changed', handleCityChanged);
  }, []);

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
          zIndex: 9999,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
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

      {/* 5. Verified Community Voices & Pilot Testimonials Section */}
      <CommunityTestimonialsSection />

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
