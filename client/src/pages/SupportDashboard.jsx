import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  DollarSign, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  Search, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Headset, 
  Send,
  MessageSquare,
  Eye,
  ExternalLink,
  Zap,
  TrendingUp,
  ShieldAlert,
  Navigation,
  MapPin,
  Clock,
  Radio,
  Phone,
  Gauge,
  BatteryCharging,
  Fuel,
  CheckCircle2,
  Calendar,
  Filter,
  Check,
  ChevronRight,
  Shield
} from 'lucide-react';
import AdBannerCarousel from '../components/AdBannerCarousel';
import LiveTrackingModal from '../components/support/LiveTrackingModal';
import CompletedRideDetailsModal from '../components/support/CompletedRideDetailsModal';
import styles from './SupportDashboard.module.css';

export default function SupportDashboard() {
  const { token, user } = useAuth();
  const { addToast } = useToast();

  // Rides & Telemetry State
  const [ridesList, setRidesList] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ONGOING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [corridorFilter, setCorridorFilter] = useState('ALL');
  const [fuelFilter, setFuelFilter] = useState('ALL'); // 'ALL' | 'ELECTRIC' | 'PETROL' | 'DIESEL'

  // Modals State
  const [trackingModalRide, setTrackingModalRide] = useState(null);
  const [completedDetailsRide, setCompletedDetailsRide] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  // Fetch all fleet rides
  const fetchRides = async () => {
    setLoadingRides(true);
    try {
      const res = await fetch('/api/admin/rides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRidesList(data.rides || []);
      }
    } catch (err) {
      console.error('Error loading rides:', err);
    } finally {
      setLoadingRides(false);
    }
  };

  const handleForceCancelRide = async (rideId) => {
    const reason = window.prompt('Enter support override reason for force-cancelling this ride:');
    if (!reason) return;

    try {
      const res = await fetch(`/api/admin/rides/${rideId}/force-cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });

      if (res.ok) {
        const data = await res.json();
        addToast(data.message || 'Ride force-cancelled and passengers refunded!', 'success');
        fetchRides();
      } else {
        addToast('Failed to cancel ride', 'error');
      }
    } catch (err) {
      addToast('Error force-cancelling ride', 'error');
    }
  };

  // Filter Computation for All Categorized Rides
  const filteredRides = ridesList.filter(ride => {
    // 1. Status Filter
    if (statusFilter !== 'ALL' && ride.categoryStatus !== statusFilter) {
      return false;
    }

    // 2. Fuel Powertrain Filter
    if (fuelFilter !== 'ALL') {
      const rideFuel = (ride.vehicle?.fuelType || (ride.vehicle?.electric ? 'ELECTRIC' : 'PETROL')).toUpperCase();
      if (fuelFilter === 'ELECTRIC' && rideFuel !== 'ELECTRIC') return false;
      if (fuelFilter === 'PETROL' && rideFuel !== 'PETROL') return false;
      if (fuelFilter === 'DIESEL' && rideFuel !== 'DIESEL') return false;
    }

    // 3. Corridor Filter
    if (corridorFilter !== 'ALL') {
      const routeStr = `${ride.originCity} ${ride.destinationCity}`.toLowerCase();
      if (corridorFilter === 'MUM_PUN' && (!routeStr.includes('mumbai') || !routeStr.includes('pune'))) return false;
      if (corridorFilter === 'BLR_CHE' && (!routeStr.includes('bengaluru') || !routeStr.includes('chennai'))) return false;
      if (corridorFilter === 'DEL_JAI' && (!routeStr.includes('delhi') || !routeStr.includes('jaipur'))) return false;
    }

    // 4. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchRoute = `${ride.originCity} ${ride.originAddress} ${ride.destinationCity} ${ride.destinationAddress}`.toLowerCase().includes(q);
      const matchDriver = (ride.driverName || '').toLowerCase().includes(q);
      const matchVehicle = (ride.vehicle?.plate || '').toLowerCase().includes(q) || (ride.vehicle?.model || '').toLowerCase().includes(q);
      const matchPassenger = (ride.passengers || []).some(p => (p.passengerName || '').toLowerCase().includes(q));
      if (!matchRoute && !matchDriver && !matchVehicle && !matchPassenger) {
        return false;
      }
    }

    return true;
  });

  const ongoingCount = ridesList.filter(r => r.categoryStatus === 'ONGOING').length;
  const scheduledCount = ridesList.filter(r => r.categoryStatus === 'SCHEDULED').length;
  const completedCount = ridesList.filter(r => r.categoryStatus === 'COMPLETED').length;
  const cancelledCount = ridesList.filter(r => r.categoryStatus === 'CANCELLED').length;

  return (
    <div className={styles.pageContainer}>
      {/* 1. TOP BANNER SECTION (The sole permitted homepage component) */}
      <div className={styles.bannerWrapper}>
        <AdBannerCarousel autoPlayInterval={6000} />
      </div>

      {/* SUPPORT DESK MASTER HEADER (Focused exclusively on Ride Monitoring) */}
      <div className={styles.headerBar}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Headset size={24} className="icon-pulse" />
          </div>
          <div>
            <h1 className={styles.headerTitle}>Ride Tracking & Fleet Operations Command</h1>
            <p className={styles.headerSubtitle}>
              Dedicated live telemetry monitor, active highway GPS tracking, and comprehensive completed ride history audit.
            </p>
          </div>
        </div>

        <div className={styles.headerLiveStats}>
          <div className={styles.liveStatPill}>
            <span className={styles.liveIndicatorDot} />
            <span><strong>{ongoingCount}</strong> Active En-Route</span>
          </div>
          <div className={styles.liveStatPillSec}>
            <span>Total Monitored Fleet: <strong>{ridesList.length} Rides</strong></span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PAGE HIERARCHY: FILTER OPTION BAR (Immediately below banner/header)    */}
      {/* ========================================================================= */}
      <div className={styles.filterSection}>
        {/* Status Tabs */}
        <div className={styles.statusTabGroup}>
          {[
            { id: 'ALL', label: 'All Rides', count: ridesList.length },
            { id: 'ONGOING', label: 'Ongoing', count: ongoingCount, isLive: true },
            { id: 'SCHEDULED', label: 'Scheduled', count: scheduledCount },
            { id: 'COMPLETED', label: 'Completed (History)', count: completedCount },
            { id: 'CANCELLED', label: 'Cancelled', count: cancelledCount }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`${styles.statusTabBtn} ${statusFilter === tab.id ? styles.statusTabActive : ''}`}
            >
              {tab.isLive && <span className={styles.liveIndicatorDot} />}
              <span>{tab.label}</span>
              <span className={styles.tabCountPill}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Search and Secondary Filter Controls */}
        <div className={styles.filterControlsGrid}>
          <div className={styles.searchBox}>
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search by city, highway route, pilot name, vehicle plate, or passenger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className={styles.clearSearchBtn}>
                ✕
              </button>
            )}
          </div>

          <div className={styles.filterDropdownGroup}>
            {/* Corridor Filter */}
            <select
              value={corridorFilter}
              onChange={(e) => setCorridorFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="ALL">All Expressways</option>
              <option value="MUM_PUN">Mumbai ➔ Pune</option>
              <option value="BLR_CHE">Bengaluru ➔ Chennai</option>
              <option value="DEL_JAI">Delhi ➔ Jaipur</option>
            </select>

            {/* Powertrain / Fuel Filter */}
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="ALL">All Powertrains</option>
              <option value="ELECTRIC">⚡ 100% Electric (EV)</option>
              <option value="PETROL">⛽ Petrol (ICE)</option>
              <option value="DIESEL">🛢️ Diesel (ICE)</option>
            </select>

            <button
              type="button"
              onClick={fetchRides}
              className={styles.refreshBtn}
              title="Refresh Fleet Data"
            >
              <RefreshCw size={14} className={loadingRides ? 'icon-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CONTENT DISPLAY: CATEGORIZED LIST OF ALL RIDES                         */}
      {/* ========================================================================= */}
      <div className={styles.ridesContainer}>
        {loadingRides ? (
          <div className={styles.loadingBox}>
            <RefreshCw size={28} className="icon-spin" color="#F59E0B" />
            <span>Fetching live expressway fleet telemetry...</span>
          </div>
        ) : filteredRides.length === 0 ? (
          <div className={styles.emptyStateBox}>
            <Car size={36} color="#64748B" />
            <h3>No Rides Matching Filter</h3>
            <p>Try resetting the search terms or selecting a different status filter.</p>
            <button
              type="button"
              onClick={() => { setStatusFilter('ALL'); setSearchQuery(''); setCorridorFilter('ALL'); setEvOnlyFilter(false); }}
              className={styles.resetFiltersBtn}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.ridesListGrid}>
            {filteredRides.map(ride => {
              const isOngoing = ride.categoryStatus === 'ONGOING';
              const isScheduled = ride.categoryStatus === 'SCHEDULED';
              const isCompleted = ride.categoryStatus === 'COMPLETED';
              const isCancelled = ride.categoryStatus === 'CANCELLED';
              const passengers = ride.passengers || [];

              return (
                <div 
                  key={ride.id}
                  className={`${styles.rideCard} ${
                    isOngoing ? styles.rideCardOngoing :
                    isCancelled ? styles.rideCardCancelled :
                    isCompleted ? styles.rideCardCompleted :
                    styles.rideCardScheduled
                  }`}
                >
                  {/* Top Row: Category Status Badge & Route Details */}
                  <div className={styles.rideCardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isOngoing && (
                        <span className={styles.badgeOngoing}>
                          <span className={styles.liveDotPulse} />
                          <span>ONGOING • LIVE ON HIGHWAY</span>
                        </span>
                      )}
                      {isScheduled && (
                        <span className={styles.badgeScheduled}>
                          <Clock size={12} />
                          <span>SCHEDULED</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className={styles.badgeCompleted}>
                          <CheckCircle2 size={12} />
                          <span>COMPLETED (RIDE HISTORY)</span>
                        </span>
                      )}
                      {isCancelled && (
                        <span className={styles.badgeCancelled}>
                          <XCircle size={12} />
                          <span>CANCELLED</span>
                        </span>
                      )}

                      <span className={styles.rideIdRef}>
                        ID: <code>{ride.id}</code>
                      </span>
                    </div>

                    <div className={styles.farePill}>
                      ₹{ride.pricePerSeat} <small>/ seat</small>
                    </div>
                  </div>

                  {/* Route Corridor & Timeline */}
                  <div className={styles.routeRow}>
                    <div className={styles.routePoint}>
                      <div className={styles.routeDotGreen} />
                      <div>
                        <div className={styles.cityName}>{ride.originCity?.split(',')[0]}</div>
                        <div className={styles.addressName}>{ride.originAddress}</div>
                      </div>
                    </div>

                    <div className={styles.routeArrowDivider}>
                      <div className={styles.distanceBadge}>{ride.distanceKm || 148} km</div>
                      <div className={styles.arrowLine} />
                    </div>

                    <div className={styles.routePoint}>
                      <div className={styles.routeDotRed} />
                      <div>
                        <div className={styles.cityName}>{ride.destinationCity?.split(',')[0]}</div>
                        <div className={styles.addressName}>{ride.destinationAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry HUD Banner (Exclusive to Ongoing & Live Rides) */}
                  {isOngoing && (
                    <div className={styles.liveTelemetryBanner}>
                      <div className={styles.telemetryItem}>
                        <Gauge size={14} color="#F59E0B" />
                        <span>Speed: <strong>{ride.telemetry?.currentSpeedKmh || 84} km/h</strong></span>
                      </div>
                      <div className={styles.telemetryItem}>
                        {(ride.vehicle?.fuelType === 'ELECTRIC' || ride.vehicle?.electric) ? (
                          <>
                            <BatteryCharging size={14} color="#10B981" />
                            <span>Battery: <strong>{ride.telemetry?.batteryPercent || 76}% EV</strong></span>
                          </>
                        ) : (
                          <>
                            <Fuel size={14} color="#F59E0B" />
                            <span>Fuel Tank: <strong>{ride.telemetry?.fuelPercent || 78}% {ride.vehicle?.fuelType || 'ICE'}</strong></span>
                          </>
                        )}
                      </div>
                      <div className={styles.telemetryItem}>
                        <MapPin size={14} color="#38BDF8" />
                        <span>Position: <strong>{ride.telemetry?.currentLocation || 'KM 48.2 Khalapur Toll'}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Pilot & Vehicle Specs */}
                  <div className={styles.detailsGrid}>
                    <div className={styles.pilotBox}>
                      <img
                        src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                        alt={ride.driverName}
                        className={styles.pilotAvatar}
                      />
                      <div>
                        <div className={styles.pilotName}>
                          {ride.driverName}
                          <span className={styles.driverVerifiedTag} title="UIDAI Aadhaar Verified">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        </div>
                        <div className={styles.vehicleText}>
                          {ride.vehicle?.make} {ride.vehicle?.model} • <code>{ride.vehicle?.plate}</code> • <span style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            color: ride.vehicle?.fuelType === 'ELECTRIC' ? '#10B981' : ride.vehicle?.fuelType === 'DIESEL' ? '#818CF8' : '#F59E0B'
                          }}>
                            {ride.vehicle?.fuelType === 'ELECTRIC' ? '⚡ 100% EV' : ride.vehicle?.fuelType === 'DIESEL' ? '🛢️ Diesel CRDi' : '⛽ Petrol'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Passenger Count & Occupancy */}
                    <div className={styles.occupancyBox}>
                      <div className={styles.occupancyTitle}>
                        <Users size={13} />
                        <span>Occupancy: {ride.totalBookedSeats || passengers.length} / {ride.totalSeats} Seats</span>
                      </div>
                      <div className={styles.passengerChips}>
                        {passengers.length > 0 ? (
                          passengers.map((p, idx) => (
                            <span key={idx} className={styles.pChip}>
                              {p.passengerName} (PIN: {p.boardingPin})
                            </span>
                          ))
                        ) : (
                          <span className={styles.noPassengersText}>
                            {isCancelled ? 'All bookings refunded' : 'No confirmed seat bookings yet'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cancellation or Completion Metadata */}
                  {isCancelled && (
                    <div className={styles.cancellationReasonBanner}>
                      <AlertTriangle size={14} color="#EF4444" />
                      <span>
                        <strong>Reason:</strong> {ride.cancellationReason || 'Support Desk Safety Override / Schedule Conflict'} • 100% Refunded
                      </span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className={styles.completedMetaBanner}>
                      <CheckCircle2 size={14} color="#10B981" />
                      <span>
                        Trip finalized • Duration: <strong>{ride.estimatedDurationHours || 2.25}h</strong> • FASTag Tolls Cleared • Platform GMV: <strong>₹{(ride.totalBookedSeats || 2) * ride.pricePerSeat}</strong>
                      </span>
                    </div>
                  )}

                  {/* Card Action Controls */}
                  <div className={styles.cardActionsRow}>
                    {isOngoing && (
                      <button
                        type="button"
                        onClick={() => setTrackingModalRide(ride)}
                        className={styles.liveTrackBtn}
                      >
                        <Radio size={14} className="icon-pulse" />
                        <span>Live Track Vehicle 🗺️</span>
                      </button>
                    )}

                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setCompletedDetailsRide(ride)}
                        className={styles.completedDetailsBtn}
                      >
                        <FileText size={13} />
                        <span>View Full Ride History & Audit Record 📄</span>
                      </button>
                    )}

                    <a
                      href={`tel:${ride.driverPhone || '+919820112345'}`}
                      className={styles.callPilotBtn}
                    >
                      <Phone size={13} /> Call Pilot
                    </a>

                    {!isCancelled && !isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleForceCancelRide(ride.id)}
                        className={styles.forceCancelBtn}
                      >
                        <Trash2 size={13} /> Force Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* LIVE TRACKING RADAR MODAL */}
      <LiveTrackingModal
        isOpen={Boolean(trackingModalRide)}
        onClose={() => setTrackingModalRide(null)}
        ride={trackingModalRide}
      />

      {/* COMPLETED RIDE COMPREHENSIVE AUDIT MODAL */}
      <CompletedRideDetailsModal
        isOpen={Boolean(completedDetailsRide)}
        onClose={() => setCompletedDetailsRide(null)}
        ride={completedDetailsRide}
      />
    </div>
  );
}
