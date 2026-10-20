import React, { useState } from 'react';
import { Zap, Fuel, Gauge, Star, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Clock, Info } from 'lucide-react';
import { SpotlightCard } from './ui';
import RideSeatGauge from './RideSeatGauge';
import RideCorridorTimeline from './RideCorridorTimeline';
import TollBreakdownPopover from './TollBreakdownPopover';
import styles from './EVRideCard.module.css';

export default function EVRideCard({ ride, onSelect }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTollPopover, setShowTollPopover] = useState(false);

  const fuelType = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
  const isElectric = fuelType === 'ELECTRIC';
  const isDiesel = fuelType === 'DIESEL';
  const isPetrol = fuelType === 'PETROL';

  const getCarImage = () => {
    if (isElectric || ride.vehicle?.model?.includes('Nexon') || ride.vehicle?.model?.includes('ZS')) {
      return 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=500';
    }
    if (isDiesel || ride.vehicle?.model?.includes('XUV700') || ride.vehicle?.model?.includes('Harrier')) {
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=500';
    }
    if (isPetrol || ride.vehicle?.model?.includes('City') || ride.vehicle?.model?.includes('Slavia')) {
      return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=500';
    }
    return 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=500';
  };

  const isFull = ride.availableSeats === 0 || ride.status === 'FULL';
  const isCancelled = ride.status === 'CANCELLED';

  const isPartialMatch = ride.matchedSegment?.isPartial;
  const originClean = ride.originCity?.split(',')[0]?.trim() || 'Origin';
  const destClean = ride.destinationCity?.split(',')[0]?.trim() || 'Destination';

  // Compute 3-letter uppercase pseudo-airport/city abbreviation code
  const getCityCode = (name) => {
    if (!name) return 'HUB';
    const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (clean.startsWith('MUMBAI')) return 'BOM';
    if (clean.startsWith('PUNE')) return 'PNQ';
    if (clean.startsWith('DELHI')) return 'DEL';
    if (clean.startsWith('AGRA')) return 'AGR';
    if (clean.startsWith('BENGALURU') || clean.startsWith('BANGALORE')) return 'BLR';
    if (clean.startsWith('MYSURU') || clean.startsWith('MYSORE')) return 'MYQ';
    if (clean.startsWith('HYDERABAD')) return 'HYD';
    if (clean.startsWith('JAIPUR')) return 'JAI';
    return clean.slice(0, 3) || 'HUB';
  };

  const originCode = getCityCode(originClean);
  const destCode = getCityCode(destClean);

  const handleDrawerToggle = (e) => {
    e.stopPropagation();
    setIsDrawerOpen((prev) => !prev);
  };

  const handleReserve = (e) => {
    e.stopPropagation();
    if (!isCancelled && !isFull && typeof onSelect === 'function') {
      onSelect(ride);
    }
  };

  const handleOpenToll = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setShowTollPopover(true);
  };

  return (
    <div
      onClick={() => !isCancelled && onSelect && onSelect(ride)}
      className={styles.card}
      style={{
        opacity: isCancelled ? 0.6 : 1,
        cursor: isCancelled ? 'not-allowed' : 'pointer'
      }}
    >
      {/* 1. Main BlaBlaCar Route Timeline & Fare Row */}
      <div className={styles.timelineRow}>
        <div className={styles.timelineCol}>
          {/* Departure Point */}
          <div className={styles.stopPoint}>
            <div className={styles.timeLabel}>{ride.departureTime || '07:30 AM'}</div>
            <div className={styles.circleMarker} />
            <div className={styles.stopDetails}>
              <span className={styles.cityName}>{originClean}</span>
              <span className={styles.stopAddress}>{ride.originAddress || `${originClean} Pickup Hub`}</span>
            </div>
          </div>

          {/* Connector Track */}
          <div className={styles.connectorTrack}>
            <div className={styles.connectorLine} />
            <span className={styles.durationBadge}>
              <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
              {ride.estimatedDuration || '2h 45m'}
            </span>
          </div>

          {/* Arrival Point */}
          <div className={styles.stopPoint}>
            <div className={styles.timeLabel}>{ride.arrivalTime || '10:15 AM'}</div>
            <div className={`${styles.circleMarker} ${styles.circleMarkerSolid}`} />
            <div className={styles.stopDetails}>
              <span className={styles.cityName}>{destClean}</span>
              <span className={styles.stopAddress}>{ride.destinationAddress || `${destClean} Dropoff Hub`}</span>
            </div>
          </div>
        </div>

        {/* Fare Price Block */}
        <div className={styles.priceCol}>
          {isPartialMatch && ride.originalPricePerSeat && (
            <div className={styles.priceOriginal}>₹{ride.originalPricePerSeat}</div>
          )}
          <div className={styles.fareAmount}>₹{ride.pricePerSeat}</div>
          <span className={styles.perSeatLabel}>per seat</span>
          <button
            type="button"
            onClick={handleOpenToll}
            className={styles.tollNoteBtn}
            title="Click to view AI Fair-Fare & FASTag Toll Breakdown"
          >
            <span>Toll Split Incl.</span>
            <Info size={10} />
          </button>
        </div>
      </div>

      {isPartialMatch && (
        <div className={styles.partialWaypointAlert}>
          <span>⚡ Waypoint Leg: {ride.matchedSegment.pickupStop?.name || originClean} ➔ {ride.matchedSegment.dropoffStop?.name || destClean} ({ride.matchedSegment.segmentDistanceKm} km)</span>
        </div>
      )}

      {/* 2. Driver & Amenities Footer */}
      <div className={styles.driverAmenityRow}>
        <div className={styles.driverInfo}>
          <img
            src={ride.driverAvatar || getCarImage()}
            alt={ride.driverName || 'Pilot'}
            className={styles.driverAvatar}
          />
          <div className={styles.driverMeta}>
            <div className={styles.driverNameRow}>
              <span className={styles.driverName}>{ride.driverName || 'Pilot'}</span>
              <span className={styles.ratingBadge}>
                <Star size={11} fill="#F59E0B" color="#F59E0B" />
                <span>{ride.driverRating || '4.9'}</span>
              </span>
            </div>
            <span className={styles.verifiedTag}>
              <ShieldCheck size={11} /> Verified Pilot
            </span>
          </div>
        </div>

        <div className={styles.amenityControls}>
          {isElectric && <span className={styles.evBadge}>⚡ 100% EV</span>}
          {isPetrol && <span className={styles.petrolBadge}>⛽ Petrol</span>}
          {isDiesel && <span className={styles.dieselBadge}>🛢️ CRDi Diesel</span>}
          <RideSeatGauge totalSeats={ride.totalSeats || 4} availableSeats={ride.availableSeats ?? 2} />
        </div>
      </div>

      {/* 3. Action Bar */}
      <div className={styles.actionBar}>
        <button
          type="button"
          onClick={handleDrawerToggle}
          className={styles.drawerToggleBtn}
          aria-expanded={isDrawerOpen}
        >
          <span>{isDrawerOpen ? 'Hide Waypoints' : 'Route & Amenities'}</span>
          {isDrawerOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          type="button"
          onClick={handleReserve}
          className={styles.reserveBtn}
          disabled={isCancelled || isFull}
        >
          <span>{isFull ? 'Sold Out' : 'Reserve Seat'}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 4. Expandable Corridor Milestones Drawer */}
      <RideCorridorTimeline
        ride={ride}
        isExpanded={isDrawerOpen}
        onOpenToll={handleOpenToll}
      />

      {/* 5. AI Smart Pricing & Toll Transparency Popover */}
      <TollBreakdownPopover
        isOpen={showTollPopover}
        onClose={() => setShowTollPopover(false)}
        ride={ride}
        pricingData={ride.pricingData}
      />
    </div>
  );
}
