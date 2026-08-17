import React from 'react';
import { 
  Clock, 
  MapPin, 
  Navigation, 
  Star, 
  ShieldCheck, 
  Zap, 
  Users, 
  Briefcase, 
  Dog, 
  ArrowRight,
  Tag
} from 'lucide-react';

export default function RideCard({ ride, onSelect }) {
  const isFull = ride.availableSeats === 0 || ride.status === 'FULL';
  const isCancelled = ride.status === 'CANCELLED';

  const formatTime = (timeStr, durationHours) => {
    try {
      const [h, m] = timeStr.split(':').map(Number);
      const totalMinutes = h * 60 + m + Math.round(durationHours * 60);
      const endH = Math.floor(totalMinutes / 60) % 24;
      const endM = totalMinutes % 60;
      return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  const arrivalTime = formatTime(ride.departureTime, ride.estimatedDurationHours || 3);
  const distance = ride.distanceKm || (ride.distanceMiles ? Math.round(ride.distanceMiles * 1.609) : 150);

  return (
    <div
      onClick={() => !isCancelled && onSelect(ride)}
      className="glass-panel"
      style={{
        padding: '20px',
        cursor: isCancelled ? 'not-allowed' : 'pointer',
        opacity: isCancelled ? 0.6 : 1,
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-md)'
      }}
      onMouseEnter={(e) => {
        if (!isCancelled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = '#FACC15';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(132, 204, 22, 0.2)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isCancelled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
    >
      {/* Top Bar: Driver Profile & Price */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        borderBottom: '1px solid #F1F5F9',
        paddingBottom: '12px'
      }}>
        {/* Driver snippet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
              alt={ride.driverName}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFC800'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              background: '#10B981',
              borderRadius: '50%',
              width: '15px',
              height: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFFFFF'
            }}>
              <ShieldCheck size={10} color="#FFFFFF" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                {ride.driverName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748B' }}>
              <Star size={12} fill="#FACC15" color="#FACC15" />
              <span style={{ color: '#84CC16', fontWeight: '800' }}>{ride.driverRating || 4.9}</span>
              <span>• {ride.vehicle?.make} {ride.vehicle?.model}</span>
            </div>
          </div>
        </div>

        {/* Rupee Price per seat */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: '900',
            fontFamily: 'var(--font-heading)',
            color: '#0F172A',
            lineHeight: 1
          }}>
            ₹{ride.pricePerSeat}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', fontWeight: '600' }}>
            per seat
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '14px', marginBottom: '16px' }}>
        {/* Visual route line with Driveit Yellow & Cyan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 0'
        }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#22C55E',
            boxShadow: '0 0 8px #22C55E'
          }} />
          <div style={{
            width: '2px',
            flex: 1,
            background: 'linear-gradient(to bottom, #22C55E, #06B6D4)',
            margin: '4px 0'
          }} />
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#06B6D4',
            boxShadow: '0 0 8px #06B6D4'
          }} />
        </div>

        {/* Origin & Destination Stops */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                {ride.departureTime} • {ride.originCity}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600' }}>
                {ride.departureDate}
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '1px' }}>
              {ride.originAddress}
            </div>
          </div>

          {ride.waypoints && ride.waypoints.length > 0 && (
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontStyle: 'italic' }}>
              Via Highway Stops: {ride.waypoints.join(', ')}
            </div>
          )}

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                {arrivalTime} • {ride.destinationCity}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: '700' }}>
                ~{ride.estimatedDurationHours} hrs ({distance} km)
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '1px' }}>
              {ride.destinationAddress}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer: Amenities & Seat Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {/* Feature Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {ride.vehicle?.electric && (
            <span className="badge badge-yellow">
              <Zap size={10} fill="#84CC16" /> 100% Electric
            </span>
          )}
          {ride.amenities?.fastagIncluded && (
            <span className="badge badge-emerald">
              <Tag size={10} /> Fastag Toll Incl.
            </span>
          )}
          {ride.amenities?.luggage && (
            <span className="badge badge-slate" title={ride.amenities.luggage}>
              <Briefcase size={10} /> Luggage OK
            </span>
          )}
          {ride.amenities?.petsAllowed && (
            <span className="badge badge-cyan">
              <Dog size={10} /> Pets
            </span>
          )}
        </div>

        {/* Seat Count Pill & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: '700',
            color: isFull ? '#FB7185' : ride.availableSeats === 1 ? '#84CC16' : '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Users size={14} />
            <span>
              {isCancelled ? 'CANCELLED' : isFull ? 'Housefull' : `${ride.availableSeats} of ${ride.totalSeats} seats left`}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(ride);
            }}
            disabled={isFull || isCancelled}
            className="btn-primary btn-sm"
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              opacity: isFull || isCancelled ? 0.4 : 1
            }}
          >
            <span>{isFull ? 'Full' : 'Book Seat'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
