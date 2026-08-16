import React, { useState } from 'react';
import { Star, X, ShieldCheck, Heart, ThumbsUp, Send } from 'lucide-react';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';

export default function RatingModal({ booking, onClose, onSuccess }) {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [overallRating, setOverallRating] = useState(5);
  const [safetyRating, setSafetyRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/booker/rides/${booking.rideId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          overallRating,
          safetyRating,
          cleanlinessRating,
          punctualityRating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit rating');
      }

      addToast('Thank you! Driver rating and feedback submitted.', 'success');
      onSuccess && onSuccess(data.review);
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarPicker = (value, onChange, label) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>{label}</span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              transition: 'transform 0.1s'
            }}
          >
            <Star
              size={20}
              fill={star <= value ? '#FACC15' : '#E2E8F0'}
              color={star <= value ? '#CA8A04' : '#CBD5E1'}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 2000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '480px',
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#FEF9C3',
          borderBottom: '1px solid #FDE047',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>
              Rate Your Driver
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#854D0E', fontWeight: '600' }}>
              Trip Ref: {booking.bookingRef}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #FDE047',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#854D0E'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Driver Mini Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#F8FAFC',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px'
          }}>
            <img
              src={booking.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
              alt={booking.driverName}
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFC800' }}
            />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>
                {booking.driverName || 'Driver Partner'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                {booking.ride ? `${booking.ride.originCity.split(',')[0]} ➔ ${booking.ride.destinationCity.split(',')[0]}` : 'Highway Ride'}
              </div>
            </div>
          </div>

          {/* Detailed Star Criteria */}
          {renderStarPicker(overallRating, setOverallRating, 'Overall Trip Experience ★')}
          {renderStarPicker(safetyRating, setSafetyRating, 'Driving Safety & Speed')}
          {renderStarPicker(cleanlinessRating, setCleanlinessRating, 'Vehicle Cleanliness & AC')}
          {renderStarPicker(punctualityRating, setPunctualityRating, 'Punctuality at Pickup')}

          {/* Feedback Comment */}
          <div style={{ marginTop: '16px', marginBottom: '20px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#CA8A04', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Written Feedback (Optional)
            </label>
            <textarea
              rows="3"
              className="glass-input"
              placeholder="e.g. Smooth driving on expressway, polite demeanor, clean EV cabin..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Send size={15} />
            <span>{submitting ? 'Submitting Review...' : 'Submit 5-Star Rating'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
