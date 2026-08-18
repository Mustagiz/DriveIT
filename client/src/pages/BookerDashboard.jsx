import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import BoardingPassModal from '../components/BoardingPassModal';
import RatingModal from '../components/RatingModal';
import ReportModal from '../components/ReportModal';
import CancelBookingModal from '../components/CancelBookingModal';
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
  Zap
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
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchUserBookings();
    fetchUserRequests();

    const handleSync = () => {
      fetchUserBookings();
      fetchUserRequests();
    };

    window.addEventListener('driveit_sync_bookings', handleSync);
    window.addEventListener('storage', handleSync);

    let bc = null;
    try {
      bc = new BroadcastChannel('driveit_realtime_channel');
      bc.onmessage = (event) => {
        if (event.data?.type === 'BOOKING_CREATED' || event.data?.type === 'SYNC_BOOKINGS') {
          handleSync();
        }
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('driveit_sync_bookings', handleSync);
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
          serverList.forEach(b => mergedMap.set(b.id || b.bookingRef, b));
          localList.forEach(b => {
            const key = b.id || b.bookingRef;
            if (!mergedMap.has(key)) {
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
    try {
      const res = await fetch('/api/rides/requests/my', {
        headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.warn('Error fetching requests:', e);
    }
  };

  // Real-time synchronization for requests and bookings
  useRealtimeRequests({
    onRequestCreated: () => fetchUserRequests(),
    onRequestsUpdated: () => fetchUserRequests()
  });

  useRealtimeRides({
    onRidesUpdated: () => fetchUserBookings()
  });

  const handleConfirmCancel = async (bookingId, reason) => {
    setCancellingId(bookingId);
    const activeToken = token || localStorage.getItem('rideshare_token') || localStorage.getItem('driveit_token');
    try {
      if (activeToken) {
        const res = await fetch(`/api/booker/bookings/${bookingId}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`
          },
          body: JSON.stringify({ reason: reason || 'Passenger requested cancellation' })
        });
      }

      // Update local storage
      try {
        const localList = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
        const updated = localList.map(b => (b.id === bookingId || b.bookingRef === bookingId) ? { ...b, status: 'CANCELLED' } : b);
        localStorage.setItem('rideshare_local_bookings', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('driveit_sync_bookings'));
      } catch (e) {}

      addToast('🎉 Reservation cancelled. Seats restored and refund initiated.', 'info');
      setCancelModalBooking(null);
      fetchUserBookings();
    } catch (err) {
      addToast(err.message || 'Failed to cancel booking', 'error');
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

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {isConfirmed && (
                      <button
                        onClick={() => setCancelModalBooking(booking)}
                        disabled={cancellingId === booking.id}
                        className="btn-danger btn-sm"
                      >
                        <X size={14} />
                        <span>{cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedTicket(booking)}
                      className="btn-primary btn-sm"
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
        gap: '10px'
      }}>
        <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>
          Showing <strong>{requests.length}</strong> active highway route demands broadcasted to verified pilots.
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', borderRadius: '16px', border: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <Zap size={40} color="#0284C7" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
            No Route Demands Broadcasted Yet
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
            When no pilots match your desired time or corridor, submit a highway demand and pilots will notify you.
          </p>
          <button onClick={() => onNavigate('pilots')} className="btn-primary">
            <Compass size={16} /> Search Highway Corridors
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {requests.map((req, idx) => (
            <div
              key={req.id || idx}
              className="glass-panel"
              style={{
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                background: '#FFFFFF',
                padding: '20px 24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
              }}
            >
              {/* Header Status Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '900',
                    background: 'rgba(2, 132, 199, 0.12)',
                    color: '#0284C7',
                    border: '1px solid rgba(2, 132, 199, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0284C7' }} />
                    ● BROADCASTED TO 120+ VERIFIED PILOTS
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                    ID: {req.id}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: '900', color: '#10B981' }}>
                  Max Budget: ₹{req.maxBudget}/seat • {req.seats} {req.seats === 1 ? 'Seat' : 'Seats'}
                </div>
              </div>

              {/* Route Display */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', fontWeight: '900', color: '#0F172A', marginBottom: '6px' }}>
                  <span>📍 {req.origin}</span>
                  <span style={{ color: '#84CC16' }}>➔</span>
                  <span>🏁 {req.destination}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748B', fontWeight: '600', flexWrap: 'wrap' }}>
                  <span>📅 Date: <strong style={{ color: '#0F172A' }}>{formatDate(req.preferredDate)}</strong></span>
                  <span>⏰ Time: <strong style={{ color: '#0F172A' }}>{formatTime(req.preferredTime)}</strong></span>
                  <span>👤 Requester: <strong style={{ color: '#0F172A' }}>{req.passengerName || 'Verified Commuter'}</strong> ({req.contactPhone})</span>
                </div>

                {req.notes && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1' }}>
                    💬 <em>"{req.notes}"</em>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Pilots posting on this expressway will receive instant SMS & Cockpit alerts for your seat request.
                </span>

                <button
                  onClick={() => onNavigate('pilots', {
                    queryParams: {
                      origin: req.origin,
                      destination: req.destination,
                      date: req.preferredDate
                    }
                  })}
                  style={{
                    background: '#84CC16',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Compass size={14} /> Search Pilots for this Route ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
