import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import BoardingPassModal from '../components/BoardingPassModal';
import RatingModal from '../components/RatingModal';
import ReportModal from '../components/ReportModal';
import CancelBookingModal from '../components/CancelBookingModal';
import RideRequestModal from '../components/RideRequestModal';
import { 
  Ticket, 
  MapPin, 
  Navigation, 
  Calendar, 
  Clock, 
  QrCode, 
  AlertTriangle, 
  X, 
  Car, 
  Phone, 
  CheckCircle2,
  Compass,
  Star,
  ShieldAlert,
  Zap,
  Plus,
  Trash2,
  Share2
} from 'lucide-react';

import { formatDate, formatTime, formatDateTime } from '../utils/dateTime';
import { useRealtimeRequests, useRealtimeRides } from '../utils/useSocket';

export default function BookerDashboard({ onNavigate }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [activeMainTab, setActiveMainTab] = useState('bookings'); // 'bookings' | 'requests'
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [reportingBooking, setReportingBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [showRideRequestModal, setShowRideRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchUserBookings();
    fetchUserRequests();

    const handleSync = () => {
      fetchUserBookings();
      fetchUserRequests();
    };

    window.addEventListener('driveit_sync_bookings', handleSync);
    window.addEventListener('driveit_sync_requests', handleSync);
    window.addEventListener('storage', handleSync);

    let bc = null;
    try {
      bc = new BroadcastChannel('driveit_realtime_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'BOOKING_CREATED' || event.data?.type === 'SYNC_BOOKINGS' || event.data?.type === 'request:created') {
          handleSync();
        }
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('driveit_sync_bookings', handleSync);
      window.removeEventListener('driveit_sync_requests', handleSync);
      window.removeEventListener('storage', handleSync);
      if (bc) bc.close();
    };
  }, [user, token]);

  const fetchUserBookings = async () => {
    setLoading(true);
    const activeToken = token || localStorage.getItem('rideshare_token') || localStorage.getItem('driveit_token');
    
    // 1. First get local bookings
    let localList = [];
    try {
      localList = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
    } catch (e) {}

    try {
      if (activeToken) {
        const res = await fetch('/api/booker/bookings', {
          headers: { Authorization: `Bearer ${activeToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          const serverList = data.bookings || [];
          
          // Merge server bookings with local bookings (server takes precedence, local fills any gaps)
          const mergedMap = new Map();
          localList.forEach(b => mergedMap.set(b.id || b.bookingRef, b));
          serverList.forEach(b => {
            const key = b.id || b.bookingRef;
            const existingLocal = mergedMap.get(key);
            if (existingLocal && existingLocal.status === 'CANCELLED') {
              mergedMap.set(key, { ...b, status: 'CANCELLED', cancellationReason: existingLocal.cancellationReason || 'Passenger cancelled' });
            } else {
              mergedMap.set(key, b);
            }
          });

          setBookings(Array.from(mergedMap.values()));
        } else {
          setBookings(localList);
        }
      } else {
        setBookings(localList);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings(localList);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    const activeToken = token || localStorage.getItem('rideshare_token') || localStorage.getItem('driveit_token');
    let localReqs = [];
    try {
      localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
    } catch (e) {}

    try {
      const res = await fetch('/api/rides/requests/my', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        const serverReqs = data.requests || [];
        const mergedMap = new Map();
        localReqs.forEach(r => mergedMap.set(r.id, r));
        serverReqs.forEach(r => mergedMap.set(r.id, r));
        setRequests(Array.from(mergedMap.values()));
        return;
      }
    } catch (e) {
      console.warn('Error fetching requests:', e);
    }
    setRequests(localReqs);
  };

  const handleCancelRequest = (requestId) => {
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updated = localReqs.filter(r => r.id !== requestId);
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('driveit_sync_requests'));
    } catch (e) {}
    setRequests(prev => prev.filter(r => r.id !== requestId));
    addToast('Route demand request cancelled and removed.', 'info');
  };

  const handleRebroadcastRequest = (requestId) => {
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updated = localReqs.map(r => r.id === requestId ? { ...r, status: 'OPEN', declineReason: null, matchedPilot: null } : r);
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('driveit_sync_requests'));
    } catch (e) {}
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'OPEN', declineReason: null, matchedPilot: null } : r));
    addToast('⚡ Route demand re-broadcasted to verified pilots along corridor!', 'success');
  };

  const handleDeclinePilotOffer = (requestId) => {
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updated = localReqs.map(r => r.id === requestId ? { ...r, status: 'OPEN', matchedPilot: null } : r);
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('driveit_sync_requests'));
    } catch (e) {}
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'OPEN', matchedPilot: null } : r));
    addToast('Pilot offer dismissed. Route remains broadcasted for other pilots.', 'info');
  };

  // Real-time synchronization for requests and bookings
  useRealtimeRequests({
    onRequestCreated: () => fetchUserRequests(),
    onRequestsUpdated: (data) => {
      fetchUserRequests();
      if (data?.action === 'ACCEPT') {
        addToast('🎉 Pilot Accepted Your Commute Demand! Check offer details.', 'success');
      } else if (data?.action === 'DECLINE') {
        addToast('A pilot passed on your route demand.', 'info');
      }
    }
  });

  useRealtimeRides({
    onRidesUpdated: () => fetchUserBookings()
  });

  const handleConfirmCancel = async (bookingId, reason) => {
    setCancellingId(bookingId);
    const activeToken = token || localStorage.getItem('rideshare_token') || localStorage.getItem('driveit_token');

    // 1. Immediately update UI state
    setBookings(prev => prev.map(b => (b.id === bookingId || b.bookingRef === bookingId) 
      ? { ...b, status: 'CANCELLED', cancellationReason: reason || 'Passenger requested cancellation' } 
      : b
    ));

    // 2. Update local storage
    try {
      const localList = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
      const updated = localList.map(b => (b.id === bookingId || b.bookingRef === bookingId) 
        ? { ...b, status: 'CANCELLED', cancellationReason: reason || 'Passenger requested cancellation' } 
        : b
      );
      localStorage.setItem('rideshare_local_bookings', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('driveit_sync_bookings'));
    } catch (e) {}

    try {
      if (activeToken) {
        await fetch(`/api/booker/bookings/${bookingId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`
          },
          body: JSON.stringify({ reason: reason || 'Passenger requested cancellation' })
        });
      }

      addToast('🎉 Reservation cancelled. Seats restored and refund initiated.', 'info');
      setCancelModalBooking(null);
      fetchUserBookings();
    } catch (err) {
      console.warn('Backend cancel notice:', err);
      addToast('Reservation marked as cancelled.', 'info');
      setCancelModalBooking(null);
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 20px', background: '#F8FAFC', minHeight: '100vh' }}>
      {/* Main Header & Dual Tab Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Passenger Flight Deck
              </h1>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#ECFCCB', color: '#166534', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BEF264' }}>
                1 ACTIVE RIDE AT A TIME
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '4px 0 0' }}>
              Manage your confirmed intercity boarding passes and broadcasted highway route demands.
            </p>
          </div>

          <button
            onClick={() => onNavigate('home')}
            style={{
              background: '#84CC16',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)'
            }}
          >
            <Compass size={16} /> Explore Available Rides
          </button>
        </div>

        {/* Top-Level Navigation Switcher: Bookings vs Route Requests */}
        <div style={{
          display: 'flex',
          background: '#E2E8F0',
          padding: '4px',
          borderRadius: '16px',
          gap: '4px',
          maxWidth: '520px'
        }}>
          <button
            type="button"
            onClick={() => setActiveMainTab('bookings')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeMainTab === 'bookings' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'bookings' ? '#0F172A' : '#64748B',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeMainTab === 'bookings' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            <Ticket size={16} color={activeMainTab === 'bookings' ? '#84CC16' : '#64748B'} />
            <span>My Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('requests')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '12px',
              border: 'none',
              background: activeMainTab === 'requests' ? '#FFFFFF' : 'transparent',
              color: activeMainTab === 'requests' ? '#0F172A' : '#64748B',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: activeMainTab === 'requests' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            <Zap size={16} color={activeMainTab === 'requests' ? '#0284C7' : '#64748B'} />
            <span>My Route Requests ({requests.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CONFIRMED BOOKINGS */}
      {activeMainTab === 'bookings' && (
        <div>
          {/* Sub Filter Pills for Bookings */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '18px' }}>
            {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: filterStatus === status ? '1px solid #84CC16' : '1px solid #E2E8F0',
                  background: filterStatus === status ? '#ECFCCB' : '#FFFFFF',
                  color: filterStatus === status ? '#166534' : '#64748B',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'ALL' ? `All (${bookings.length})` : status}
              </button>
            ))}
          </div>

      {/* Bookings List */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>Loading your bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <Ticket size={40} color="#84CC16" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
            No bookings found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
            Search available EV highway carpools and reserve your next trip.
          </p>
          <button onClick={() => onNavigate('home')} className="btn-primary">
            <Compass size={16} /> Explore Available Rides
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div
                key={booking.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  border: isConfirmed ? '1.5px solid #BEF264' : '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Top Row: Ref, Status, Price */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '14px',
                  marginBottom: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>
                      Ref: {booking.bookingRef}
                    </span>
                    <span className={`badge ${isConfirmed ? 'badge-emerald' : isCancelled ? 'badge-rose' : 'badge-yellow'}`}>
                      {booking.status}
                    </span>
                    {booking.ride?.vehicle?.electric && (
                      <span className="badge badge-cyan">
                        <Zap size={11} /> EV
                      </span>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A' }}>
                      ₹{(booking.totalPrice || 0).toFixed(0)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '4px' }}>
                      ({booking.seatsBooked} {booking.seatsBooked === 1 ? 'seat' : 'seats'})
                    </span>
                  </div>
                </div>

                {/* Driver and Vehicle Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  background: '#F8FAFC',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={booking.driverAvatar || booking.driver?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                      alt="Driver"
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFC800' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0F172A' }}>
                        {booking.driverName || 'Driver Partner'} (⭐ {booking.driver?.rating || 4.95})
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        Vehicle: <strong style={{ color: '#0F172A' }}>{booking.ride?.vehicle?.make} {booking.ride?.vehicle?.model}</strong> (Plate: <strong style={{ color: '#0F172A' }}>{booking.ride?.vehicle?.plate || 'MH12 JK 3456'}</strong>)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748B' }}>
                    <Phone size={14} color="#84CC16" />
                    <span>Driver Contact: <strong style={{ color: '#0F172A' }}>{booking.driver?.phone || '+91 98201 12345'}</strong></span>
                  </div>
                </div>

                {/* Route Itinerary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>
                    <span>{booking.ride ? `${booking.ride.originCity} ➔ ${booking.ride.destinationCity}` : 'Intercity Corridor'}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: '600' }}>
                      • {formatDate(booking.ride?.departureDate)} • {formatTime(booking.ride?.departureTime)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Pickup: {booking.pickupLocation} ➔ Dropoff: {booking.dropoffLocation}
                  </div>
                </div>

                {/* Actions Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '14px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* Rate Driver Button */}
                    <button
                      onClick={() => setRatingBooking(booking)}
                      style={{
                        background: '#ECFCCB',
                        border: '1px solid #BEF264',
                        color: '#166534',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Star size={13} fill="#166534" /> Rate Pilot
                    </button>

                    {/* Report Incident */}
                    <button
                      onClick={() => setReportingBooking(booking)}
                      style={{
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <ShieldAlert size={14} />
                      <span>Report Issue</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {isConfirmed && (
                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(booking)}
                        disabled={cancellingId === booking.id}
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1.5px solid rgba(239, 68, 68, 0.25)',
                          color: '#EF4444',
                          padding: '7px 15px',
                          borderRadius: '12px',
                          fontSize: '12.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.16)';
                          e.currentTarget.style.borderColor = '#EF4444';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <X size={14} />
                        <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedTicket(booking)}
                      style={{
                        background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                        border: 'none',
                        color: '#000000',
                        padding: '7px 16px',
                        borderRadius: '12px',
                        fontSize: '12.5px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)',
                        transition: 'all 150ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(132, 204, 22, 0.45)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(132, 204, 22, 0.35)';
                      }}
                    >
                      <QrCode size={14} />
                      <span>Boarding Pass QR</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}

  {/* TAB 2: MY ROUTE REQUESTS */}
  {activeMainTab === 'requests' && (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13.5px', color: '#64748B', fontWeight: '600' }}>
          Showing <strong>{requests.length}</strong> active highway route demands broadcasted to verified pilots.
        </div>

        <button
          type="button"
          onClick={() => setShowRideRequestModal(true)}
          style={{
            background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
            color: '#000000',
            border: 'none',
            borderRadius: '14px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: '900',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)'
          }}
        >
          <Plus size={16} />
          <span>Broadcast New Route Request ⚡</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px 24px', textAlign: 'center', borderRadius: '20px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(2, 132, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: '#0284C7'
          }}>
            <Zap size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
            No Route Demands Broadcasted Yet
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
            Can't find a pilot matching your exact highway schedule? Broadcast your commute demand and verified pilots traveling that route will be notified instantly!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button"
              onClick={() => setShowRideRequestModal(true)} 
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: '900' }}
            >
              <Plus size={16} /> Broadcast Route Request ⚡
            </button>
            <button 
              type="button"
              onClick={() => onNavigate('pilots')} 
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontWeight: '800' }}
            >
              <Compass size={16} /> Explore Available Pilots
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((req, idx) => (
            <div
              key={req.id || idx}
              className="glass-panel"
              style={{
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                padding: '22px 26px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Header Status Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {req.status === 'ACCEPTED' ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '900',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                      <span>🎉 PILOT MATCH FOUND & RIDE OFFERED</span>
                    </span>
                  ) : req.status === 'DECLINED' ? (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '900',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#DC2626',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} />
                      <span>PILOT PASSED ON DEMAND</span>
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '900',
                      background: 'rgba(2, 132, 199, 0.12)',
                      color: '#0284C7',
                      border: '1px solid rgba(2, 132, 199, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284C7', boxShadow: '0 0 6px #0284C7' }} />
                      <span>BROADCASTED TO VERIFIED PILOTS</span>
                    </span>
                  )}

                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '700' }}>
                    ID: {req.id}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981' }}>
                    Budget: ₹{req.maxBudget}/seat • {req.seats} {req.seats === 1 ? 'Seat' : 'Seats'}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(req.id)}
                    title="Cancel route request"
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#DC2626',
                      borderRadius: '10px',
                      padding: '5px 10px',
                      fontSize: '11.5px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Matched Pilot Offer Banner (Shown when Pilot Accepts) */}
              {req.status === 'ACCEPTED' && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(132, 204, 22, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
                  border: '1.5px solid rgba(132, 204, 22, 0.4)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={req.matchedPilot?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                      alt="Pilot"
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #84CC16' }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{req.matchedPilot?.name || 'Verified Highway Pilot'}</span>
                        <span style={{ fontSize: '10px', fontWeight: '900', background: '#10B981', color: '#FFFFFF', padding: '2px 6px', borderRadius: '6px' }}>OFFER ACTIVE</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>🚗 {req.matchedPilot?.vehicle?.make || 'Tata'} {req.matchedPilot?.vehicle?.model || 'Nexon EV'} ({req.matchedPilot?.vehicle?.plate || 'MH-12-RN-7788'})</span>
                        <span>•</span>
                        <span>Offered Fare: <strong style={{ color: '#10B981' }}>₹{req.matchedPilot?.offeredPrice || req.maxBudget} / seat</strong></span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleDeclinePilotOffer(req.id)}
                      style={{
                        background: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      Decline
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate('pilots', {
                          queryParams: {
                            origin: req.origin,
                            destination: req.destination,
                            date: req.preferredDate
                          }
                        });
                        addToast(`Connecting to matched corridor ride with ${req.matchedPilot?.name || 'pilot'}`, 'success');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 18px',
                        fontSize: '12.5px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)'
                      }}
                    >
                      <span>Confirm & Book Pilot Seat</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Route Display */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px 18px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
                  <span>📍 {req.origin}</span>
                  <span style={{ color: '#84CC16' }}>➔</span>
                  <span>🏁 {req.destination}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12.5px', color: '#64748B', fontWeight: '600', flexWrap: 'wrap' }}>
                  <span>📅 Date: <strong style={{ color: '#0F172A' }}>{formatDate(req.preferredDate)}</strong></span>
                  <span>⏰ Time: <strong style={{ color: '#0F172A' }}>{formatTime(req.preferredTime)}</strong></span>
                  <span>👤 Requester: <strong style={{ color: '#0F172A' }}>{req.passengerName || 'Verified Commuter'}</strong> ({req.contactPhone})</span>
                </div>

                {req.notes && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #CBD5E1' }}>
                    💬 <em>"{req.notes}"</em>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>📡</span> Pilots posting on this corridor receive real-time push and cockpit alerts.
                </span>

                {req.status === 'DECLINED' ? (
                  <button
                    type="button"
                    onClick={() => handleRebroadcastRequest(req.id)}
                    style={{
                      background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 18px',
                      fontSize: '12.5px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)'
                    }}
                  >
                    <Zap size={14} />
                    <span>Re-Broadcast Demand ⚡</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('pilots', {
                      queryParams: {
                        origin: req.origin,
                        destination: req.destination,
                        date: req.preferredDate
                      }
                    })}
                    style={{
                      background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 18px',
                      fontSize: '13px',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)'
                    }}
                  >
                    <span>Find Matching Pilots</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}

      {/* Ride Request Modal */}
      {showRideRequestModal && (
        <RideRequestModal
          isOpen={showRideRequestModal}
          onClose={() => {
            setShowRideRequestModal(false);
            fetchUserRequests();
          }}
        />
      )}

      {/* Boarding Pass Modal */}
      {selectedTicket && (
        <BoardingPassModal
          booking={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onCancelBooking={() => {
            setSelectedTicket(null);
            fetchUserBookings();
          }}
        />
      )}

      {/* Rate Driver Modal */}
      {ratingBooking && (
        <RatingModal
          booking={ratingBooking}
          onClose={() => setRatingBooking(null)}
          onSuccess={() => fetchUserBookings()}
        />
      )}

      {/* Report Incident Modal */}
      {reportingBooking && (
        <ReportModal
          booking={reportingBooking}
          onClose={() => setReportingBooking(null)}
          onSuccess={() => fetchUserBookings()}
        />
      )}

      {/* Cancel Booking Confirmation Modal */}
      {cancelModalBooking && (
        <CancelBookingModal
          booking={cancelModalBooking}
          onClose={() => setCancelModalBooking(null)}
          onConfirm={handleConfirmCancel}
          isCancelling={Boolean(cancellingId)}
        />
      )}
    </div>
  );
}
