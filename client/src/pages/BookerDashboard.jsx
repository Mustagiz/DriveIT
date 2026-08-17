import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import BoardingPassModal from '../components/BoardingPassModal';
import RatingModal from '../components/RatingModal';
import ReportModal from '../components/ReportModal';
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

export default function BookerDashboard({ onNavigate }) {
  const { user, token } = useAuth();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);
  const [reportingBooking, setReportingBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const fetchUserBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/booker/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Reserved seats will be released.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const res = await fetch(`/api/booker/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'Passenger requested cancellation' })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      addToast('Booking cancelled. Seats restored to the ride.', 'info');
      fetchUserBookings();
    } catch (err) {
      addToast(err.message, 'error');
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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>
              My Highway Bookings
            </h1>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#ECFCCB', color: '#166534', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BEF264' }}>
              1 ACTIVE RIDE AT A TIME
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748B', marginTop: '2px' }}>
            Manage your intercity boarding passes, driver ratings, and incident reports.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
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
                      • {booking.ride?.departureDate || 'Scheduled'} at {booking.ride?.departureTime || '07:30 AM'}
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
                      <Star size={14} fill="#FACC15" color="#84CC16" />
                      <span>{booking.reviewed ? 'Update Rating ★' : 'Rate Driver ★'}</span>
                    </button>

                    {/* Report Incident Button */}
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
                        onClick={() => handleCancelBooking(booking.id)}
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
    </div>
  );
}
