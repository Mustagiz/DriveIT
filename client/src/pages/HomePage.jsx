import React, { useState, useEffect } from 'react';
import MapVisualizer from '../components/MapVisualizer';
import EVRideCard from '../components/EVRideCard';
import UpcomingTripPanel from '../components/UpcomingTripPanel';
import BoardingPassModal from '../components/BoardingPassModal';
import AdBannerCarousel from '../components/AdBannerCarousel';
import SearchConsole from '../components/SearchConsole';
import CinematicStorySection from '../components/CinematicStorySection';
import CorridorExplorerSection from '../components/CorridorExplorerSection';
import SavingsCalculatorSection from '../components/SavingsCalculatorSection';
import CommunityTestimonialsSection from '../components/CommunityTestimonialsSection';
import { ChevronRight, Sparkles, Search, ArrowRightLeft, X, MapPin, Navigation, Car, Users, Star, TrendingUp, Calendar, Clock } from 'lucide-react';
import { Card, CardBody, Section, Button, SkeletonCard, EmptyState, Badge } from '../components/ui';
import ScrollReveal from '../components/ScrollReveal';

import { useAuth } from '../context/AuthContext';
import ShinyText from '../components/ui/ShinyText';
import SpotlightCard from '../components/ui/SpotlightCard';

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
        setRides(data.rides || []);
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
    <div className="container container-wide page">
      {/* 1. Dynamic Ad & Promo Banner Carousel (5 Interactive Rotating Ad Banners) */}
      <AdBannerCarousel 
        onSelectPreset={handleSelectPreset}
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


      {/* 3. Live Telemetry Map & Cockpit View Panel */}
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto 64px',
        padding: '0 clamp(16px, 3.5vw, 40px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isAuthenticated ? 'minmax(0, 1.45fr) minmax(0, 1fr)' : '1fr',
          gap: '30px',
          width: '100%',
          alignItems: 'stretch'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', minHeight: '32px' }}>
              <h3 style={{ fontSize: '21px', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Live Expressway Radar</span>
                <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ● Active
                </span>
              </h3>
              <span style={{ fontSize: '14px', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>
                Real-time route telemetry & FASTag corridors
              </span>
            </div>
            <div style={{ flex: 1, minHeight: '480px' }}>
              <MapVisualizer
                origin={originLocation?.fullAddress || originInput || 'Mumbai'}
                destination={destinationLocation?.fullAddress || destinationInput || 'Pune'}
                originCoords={originLocation?.lat ? [originLocation.lat, originLocation.lng] : null}
                destCoords={destinationLocation?.lat ? [destinationLocation.lat, destinationLocation.lng] : null}
                onCorridorSelect={handleSelectPreset}
              />
            </div>
          </div>

          {isAuthenticated && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', minHeight: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-text-primary)', margin: 0 }}>
                    {user?.roles?.includes('lister') ? 'Cockpit View' : 'My Rides'}
                  </h3>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: user?.roles?.includes('lister') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: user?.roles?.includes('lister') ? '#F59E0B' : '#10B981',
                    border: user?.roles?.includes('lister') ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    {user?.roles?.includes('lister') ? 'PILOT TELEMETRY' : 'CONFIRMED PASSENGER'}
                  </span>
                </div>
                <button
                  onClick={handleOpenSampleBoardingPass}
                  style={{
                    fontSize: '11px',
                    color: user?.roles?.includes('lister') ? '#F59E0B' : '#10B981',
                    background: user?.roles?.includes('lister') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: user?.roles?.includes('lister') ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 150ms ease'
                  }}
                >
                  {user?.roles?.includes('lister') ? 'Pilot Pass →' : 'Boarding Pass →'}
                </button>
              </div>
              <div style={{ flex: 1, minHeight: '380px' }}>
                <UpcomingTripPanel
                  onOpenBoardingPass={(trip) => setActiveBoardingPass(trip)}
                  onQuickSelectRoute={(from, to) => handleSelectPreset(from, to)}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          )}
        </div>
      </div>


      {/* 5. Popular Highway Expressway Corridors Section */}
      <CorridorExplorerSection
        onSelectCorridor={(from, to) => handleSelectPreset(from, to)}
      />

      {/* 6. Interactive ROI Fuel & Carbon Savings Calculator Section */}
      <SavingsCalculatorSection
        onFindRide={() => handleRollSearch()}
        onPostRide={() => onNavigate && onNavigate('post-ride')}
      />

      {/* 7. Cinematic 3D Automotive Story & Safety Shield */}
      <CinematicStorySection />

      {/* 8. Verified Community Voices & Pilot Testimonials Section */}
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

