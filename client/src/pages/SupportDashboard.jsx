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
  Shield,
  CreditCard,
  UserCheck,
  UserX
} from 'lucide-react';
import AdBannerCarousel from '../components/AdBannerCarousel';
import LiveTrackingModal from '../components/support/LiveTrackingModal';
import CompletedRideDetailsModal from '../components/support/CompletedRideDetailsModal';
import KycInspectionModal from '../components/support/KycInspectionModal';
import styles from './SupportDashboard.module.css';

export default function SupportDashboard() {
  const { token, user } = useAuth();
  const { addToast } = useToast();

  // Top-Level Active Workspace Tab: 'telemetry' | 'kyc'
  const [activeWorkspace, setActiveWorkspace] = useState('kyc');

  // Rides & Telemetry State
  const [ridesList, setRidesList] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ONGOING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');
  const [corridorFilter, setCorridorFilter] = useState('ALL');
  const [fuelFilter, setFuelFilter] = useState('ALL'); // 'ALL' | 'ELECTRIC' | 'PETROL' | 'DIESEL'

  // KYC Verification Desk State
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [kycFilter, setKycFilter] = useState('PENDING'); // 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  const [kycSearchQuery, setKycSearchQuery] = useState('');
  const [inspectingPilot, setInspectingPilot] = useState(null);

  // Modals State
  const [trackingModalRide, setTrackingModalRide] = useState(null);
  const [completedDetailsRide, setCompletedDetailsRide] = useState(null);

  useEffect(() => {
    fetchRides();
    fetchUsers();
  }, [token]);

  // Fetch all fleet rides
  const fetchRides = async () => {
    if (!token) return;
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

  // Fetch all users for KYC verification
  const fetchUsers = async () => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (err) {
      console.error('Error loading users for KYC:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handle KYC Review Approval / Rejection
  const handleReviewKyc = async (userId, decision, reason = '') => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/kyc-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decision, reason })
      });
      const data = await res.json();
      if (res.ok) {
        addToast(data.message || `KYC application ${decision === 'APPROVE' ? 'verified' : 'rejected'} successfully!`, 'success');
        fetchUsers();
      } else {
        addToast(data.error || 'Failed to update KYC status', 'error');
      }
    } catch (err) {
      addToast('Network error updating KYC status', 'error');
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

  // Filter Pilots for KYC Verification Desk
  const pilotsList = usersList.filter(u => u.roles?.includes('lister') || u.vehicle || u.driving_license_number !== 'N/A');
  
  const filteredPilots = pilotsList.filter(pilot => {
    // KYC Status Filter
    if (kycFilter === 'PENDING' && pilot.kyc_status !== 'PENDING' && pilot.verified) return false;
    if (kycFilter === 'VERIFIED' && pilot.kyc_status !== 'VERIFIED' && !pilot.verified) return false;
    if (kycFilter === 'REJECTED' && pilot.kyc_status !== 'REJECTED') return false;

    // Search Query
    if (kycSearchQuery.trim()) {
      const q = kycSearchQuery.toLowerCase().trim();
      const matchName = (pilot.name || '').toLowerCase().includes(q);
      const matchEmail = (pilot.email || '').toLowerCase().includes(q);
      const matchPhone = (pilot.phone || '').toLowerCase().includes(q);
      const matchAadhaar = (pilot.aadhaar_number || '').toLowerCase().includes(q);
      const matchLicense = (pilot.driving_license_number || '').toLowerCase().includes(q);
      const matchPlate = (pilot.vehicle_rc_number || pilot.vehicle?.plate || '').toLowerCase().includes(q);
      const matchVehicle = `${pilot.vehicle?.make || ''} ${pilot.vehicle?.model || ''}`.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchAadhaar && !matchLicense && !matchPlate && !matchVehicle) {
        return false;
      }
    }

    return true;
  });

  const ongoingCount = ridesList.filter(r => r.categoryStatus === 'ONGOING').length;
  const scheduledCount = ridesList.filter(r => r.categoryStatus === 'SCHEDULED').length;
  const completedCount = ridesList.filter(r => r.categoryStatus === 'COMPLETED').length;
  const cancelledCount = ridesList.filter(r => r.categoryStatus === 'CANCELLED').length;

  const pendingKycCount = pilotsList.filter(p => p.kyc_status === 'PENDING' || (!p.verified && p.kyc_status !== 'REJECTED')).length;
  const verifiedKycCount = pilotsList.filter(p => p.kyc_status === 'VERIFIED' || p.verified).length;
  const rejectedKycCount = pilotsList.filter(p => p.kyc_status === 'REJECTED').length;

  return (
    <div className={styles.pageContainer}>
      {/* 1. TOP BANNER SECTION */}
      <div className={styles.bannerWrapper}>
        <AdBannerCarousel autoPlayInterval={6000} />
      </div>

      {/* WORKSPACE SWITCH TABS */}
      <div className={styles.workspaceSwitchBar}>
        <button
          type="button"
          onClick={() => setActiveWorkspace('kyc')}
          className={`${styles.workspaceTabBtn} ${activeWorkspace === 'kyc' ? styles.workspaceTabActive : ''}`}
        >
          <ShieldCheck size={18} />
          <span>Pilot KYC & Document Verification Desk</span>
          {pendingKycCount > 0 && (
            <span className={styles.workspaceBadgePulse}>{pendingKycCount} Pending</span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveWorkspace('telemetry')}
          className={`${styles.workspaceTabBtn} ${activeWorkspace === 'telemetry' ? styles.workspaceTabActive : ''}`}
        >
          <Radio size={18} />
          <span>Live Fleet & Ride Telemetry Command</span>
          {ongoingCount > 0 && (
            <span className={styles.workspaceBadgeLive}>{ongoingCount} Active</span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* WORKSPACE 1: PILOT KYC & DOCUMENT VERIFICATION AUDIT DESK                 */}
      {/* ========================================================================= */}
      {activeWorkspace === 'kyc' && (
        <>
          {/* KYC Header */}
          <div className={styles.headerBar}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h1 className={styles.headerTitle}>Pilot Compliance & Document Verification Vault</h1>
                <p className={styles.headerSubtitle}>
                  Inspect Government Aadhaar, RTO Driving Licenses, and Parivahan Vehicle RC documents uploaded by new pilots.
                </p>
              </div>
            </div>

            <div className={styles.headerLiveStats}>
              <div className={styles.kycStatPillPending}>
                <span className={styles.liveIndicatorAmber} />
                <span><strong>{pendingKycCount}</strong> Pending Audit</span>
              </div>
              <div className={styles.kycStatPillVerified}>
                <CheckCircle2 size={14} color="#059669" />
                <span><strong>{verifiedKycCount}</strong> Verified Highway Pilots</span>
              </div>
            </div>
          </div>

          {/* KYC Filters & Search */}
          <div className={styles.filterSection}>
            <div className={styles.statusTabGroup}>
              {[
                { id: 'PENDING', label: 'Pending Audits', count: pendingKycCount, isPending: true },
                { id: 'VERIFIED', label: 'Verified Pilots', count: verifiedKycCount },
                { id: 'REJECTED', label: 'Action Required / Rejected', count: rejectedKycCount },
                { id: 'ALL', label: 'All Registered Pilots', count: pilotsList.length }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setKycFilter(tab.id)}
                  className={`${styles.statusTabBtn} ${kycFilter === tab.id ? styles.statusTabActive : ''}`}
                >
                  {tab.isPending && pendingKycCount > 0 && <span className={styles.liveIndicatorAmber} />}
                  <span>{tab.label}</span>
                  <span className={styles.tabCountPill}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className={styles.filterControlsGrid}>
              <div className={styles.searchBox}>
                <Search size={16} color="#64748B" />
                <input
                  type="text"
                  placeholder="Search pilot name, email, phone, Aadhaar, Driving License, or vehicle plate..."
                  value={kycSearchQuery}
                  onChange={(e) => setKycSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {kycSearchQuery && (
                  <button type="button" onClick={() => setKycSearchQuery('')} className={styles.clearSearchBtn}>
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={fetchUsers}
                className={styles.refreshBtn}
                title="Refresh verification queue"
              >
                <RefreshCw size={14} /> Refresh Queue
              </button>
            </div>
          </div>

          {/* KYC Pilots Grid */}
          {loadingUsers ? (
            <div className={styles.loadingBox}>
              <RefreshCw size={28} className="icon-spin" color="#84CC16" />
              <p>Loading compliance verification queue...</p>
            </div>
          ) : filteredPilots.length === 0 ? (
            <div className={styles.emptyBox}>
              <CheckCircle2 size={40} color="#10B981" />
              <h3>All Pilot Verification Audits Cleared!</h3>
              <p>No pilot applications match the current filter criteria.</p>
            </div>
          ) : (
            <div className={styles.kycCardsGrid}>
              {filteredPilots.map(pilot => {
                const isPilotVerified = pilot.kyc_status === 'VERIFIED' || pilot.verified;
                const isPilotPending = pilot.kyc_status === 'PENDING' || (!pilot.verified && pilot.kyc_status !== 'REJECTED');
                const isPilotRejected = pilot.kyc_status === 'REJECTED';

                return (
                  <div key={pilot.id} className={styles.kycCard}>
                    {/* Pilot Top Bar */}
                    <div className={styles.kycCardTop}>
                      <div className={styles.kycPilotInfo}>
                        <img
                          src={pilot.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                          alt={pilot.name}
                          className={styles.kycAvatar}
                        />
                        <div>
                          <div className={styles.kycNameRow}>
                            <h3 className={styles.kycName}>{pilot.name}</h3>
                            <span className={`${styles.statusBadge} ${
                              isPilotVerified ? styles.statusVerified : isPilotRejected ? styles.statusRejected : styles.statusPending
                            }`}>
                              {isPilotVerified ? 'VERIFIED' : isPilotRejected ? 'REJECTED' : 'PENDING REVIEW'}
                            </span>
                          </div>
                          <span className={styles.kycContact}>{pilot.email} • {pilot.phone || '+91 98201 12345'}</span>
                        </div>
                      </div>

                      {pilot.vehicle && (
                        <div className={styles.kycVehicleBadge}>
                          <Car size={14} color="#84CC16" />
                          <span>{pilot.vehicle.make} {pilot.vehicle.model}</span>
                          <span className={styles.kycPlatePill}>{pilot.vehicle.plate || pilot.vehicle_rc_number || 'MH-12-RN-7788'}</span>
                          {pilot.vehicle.electric && <span className={styles.evMiniPill}>⚡ EV</span>}
                        </div>
                      )}
                    </div>

                    {/* Documents Showcase Strip */}
                    <div className={styles.docShowcaseStrip}>
                      <div className={styles.docItemPill} onClick={() => setInspectingPilot(pilot)}>
                        <CreditCard size={14} color="#0284C7" />
                        <div>
                          <span className={styles.docItemLabel}>UIDAI Aadhaar</span>
                          <span className={styles.docItemVal}>{pilot.aadhaar_number || 'XXXX-XXXX-8921'}</span>
                        </div>
                      </div>

                      <div className={styles.docItemPill} onClick={() => setInspectingPilot(pilot)}>
                        <FileText size={14} color="#84CC16" />
                        <div>
                          <span className={styles.docItemLabel}>Driving License</span>
                          <span className={styles.docItemVal}>{pilot.driving_license_number || 'MH-14-2018-0099412'}</span>
                        </div>
                      </div>

                      <div className={styles.docItemPill} onClick={() => setInspectingPilot(pilot)}>
                        <Car size={14} color="#F59E0B" />
                        <div>
                          <span className={styles.docItemLabel}>Vehicle RC</span>
                          <span className={styles.docItemVal}>{pilot.vehicle_rc_number || pilot.vehicle?.plate || 'MH-12-RN-7788'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Notice if rejected */}
                    {isPilotRejected && pilot.kyc_rejection_reason && (
                      <div className={styles.rejectionBannerMini}>
                        <AlertTriangle size={13} color="#DC2626" />
                        <span><strong>Reason:</strong> {pilot.kyc_rejection_reason}</span>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className={styles.kycActionsRow}>
                      <button
                        type="button"
                        onClick={() => setInspectingPilot(pilot)}
                        className={styles.inspectBtn}
                      >
                        <Eye size={14} />
                        <span>Inspect Uploaded Documents 📄</span>
                      </button>

                      {!isPilotVerified && (
                        <button
                          type="button"
                          onClick={() => handleReviewKyc(pilot.id, 'APPROVE')}
                          className={styles.quickApproveBtn}
                          title="Grant Instant Highway Pilot License"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve KYC</span>
                        </button>
                      )}

                      {!isPilotRejected && (
                        <button
                          type="button"
                          onClick={() => {
                            const reason = window.prompt(`Enter rejection reason for ${pilot.name}'s KYC application:`, 'Uploaded documentation was unclear or mismatched vehicle RC.');
                            if (reason) handleReviewKyc(pilot.id, 'REJECT', reason);
                          }}
                          className={styles.quickRejectBtn}
                          title="Reject KYC Application with Feedback"
                        >
                          <XCircle size={14} />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 2: LIVE FLEET & TELEMETRY MONITORING                            */}
      {/* ========================================================================= */}
      {activeWorkspace === 'telemetry' && (
        <>
          {/* Header Bar */}
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
              {pendingKycCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveWorkspace('kyc')}
                  className={styles.kycStatPillPending}
                  style={{ cursor: 'pointer' }}
                  title="Switch to KYC verification desk"
                >
                  <span className={styles.liveIndicatorAmber} />
                  <span><strong>{pendingKycCount}</strong> Pilot KYC Pending ➔</span>
                </button>
              )}
              <div className={styles.liveStatPill}>
                <span className={styles.liveIndicatorDot} />
                <span><strong>{ongoingCount}</strong> Active En-Route</span>
              </div>
              <div className={styles.liveStatPillSec}>
                <span>Total Monitored Fleet: <strong>{ridesList.length} Rides</strong></span>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className={styles.filterSection}>
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
                  title="Reload fleet status"
                >
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Fleet Grid */}
          {loadingRides ? (
            <div className={styles.loadingBox}>
              <RefreshCw size={28} className="icon-spin" color="#84CC16" />
              <p>Polling National Highway fleet radar...</p>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className={styles.emptyBox}>
              <Car size={40} color="#94A3B8" />
              <h3>No Rides Matching Filters</h3>
              <p>Adjust your status, expressway corridor, or search keywords to view fleet telemetry.</p>
            </div>
          ) : (
            <div className={styles.ridesGrid}>
              {filteredRides.map(ride => {
                const isOngoing = ride.categoryStatus === 'ONGOING';
                const isCompleted = ride.categoryStatus === 'COMPLETED';
                const isScheduled = ride.categoryStatus === 'SCHEDULED';
                const isCancelled = ride.categoryStatus === 'CANCELLED';

                return (
                  <div 
                    key={ride.id} 
                    className={`${styles.rideCard} ${isOngoing ? styles.rideCardOngoing : ''} ${isCompleted ? styles.rideCardCompleted : ''}`}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.cardHeaderLeft}>
                        <span className={`${styles.statusBadge} ${
                          isOngoing ? styles.statusOngoing :
                          isScheduled ? styles.statusScheduled :
                          isCompleted ? styles.statusCompleted : styles.statusCancelled
                        }`}>
                          {isOngoing && <span className={styles.liveIndicatorDot} />}
                          {ride.categoryStatus}
                        </span>
                        <span className={styles.rideIdTag}>#{ride.id.slice(-6)}</span>
                      </div>

                      <div className={styles.priceTag}>
                        <span>₹{ride.pricePerSeat}</span>
                        <small>/ seat</small>
                      </div>
                    </div>

                    <div className={styles.routeBox}>
                      <div className={styles.routeLine}>
                        <div className={styles.routeDotOrigin} />
                        <div className={styles.routeDashedLine} />
                        <div className={styles.routeDotDest} />
                      </div>
                      <div className={styles.routeDetails}>
                        <div className={styles.routePoint}>
                          <span className={styles.routeCity}>{ride.originCity}</span>
                          <span className={styles.routeAddress}>{ride.originAddress}</span>
                        </div>
                        <div className={styles.routePoint}>
                          <span className={styles.routeCity}>{ride.destinationCity}</span>
                          <span className={styles.routeAddress}>{ride.destinationAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.driverVehicleStrip}>
                      <div className={styles.driverInfo}>
                        <img 
                          src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'} 
                          alt={ride.driverName}
                          className={styles.driverAvatar}
                        />
                        <div>
                          <span className={styles.driverName}>{ride.driverName}</span>
                          <span className={styles.driverRating}>★ {ride.driverRating || 5.0} Verified Pilot</span>
                        </div>
                      </div>

                      <div className={styles.vehicleInfo}>
                        <Car size={14} color="#84CC16" />
                        <span>{ride.vehicle?.make} {ride.vehicle?.model}</span>
                        <span className={styles.plateNumber}>{ride.vehicle?.plate || 'MH-12-RN-7788'}</span>
                      </div>
                    </div>

                    {isOngoing && (
                      <div className={styles.liveTelemetryBanner}>
                        <Radio size={14} color="#10B981" className="icon-pulse" />
                        <span>
                          Live GPS Beacon: <strong>{ride.telemetry?.distanceCoveredKm || 45} km</strong> of {ride.telemetry?.totalDistanceKm || 148} km cleared • <strong>{ride.telemetry?.etaMinutesRemaining || 65} mins</strong> to Destination
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
        </>
      )}

      {/* PILOT KYC DOCUMENT INSPECTION MODAL */}
      <KycInspectionModal
        isOpen={Boolean(inspectingPilot)}
        onClose={() => setInspectingPilot(null)}
        pilot={inspectingPilot}
        onReviewKyc={handleReviewKyc}
      />

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
