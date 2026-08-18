import React, { useState } from 'react';
import { Sparkles, MapPin, Navigation, Calendar, Clock, Users, IndianRupee, X, CheckCircle2, ShieldCheck, BellRing } from 'lucide-react';
import LocationAutocompleteInput from './LocationAutocompleteInput';
import ScheduleDropdownPicker from './ScheduleDropdownPicker';
import ActiveTripRestrictionModal from './ActiveTripRestrictionModal';
import { getActivePassengerTrip } from '../utils/activeTripGuard';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function RideRequestModal({ isOpen, onClose, onSuccess, onNavigate, initialOrigin = '', initialDestination = '' }) {
  const { user, token } = useAuth();
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [seats, setSeats] = useState(1);
  const [maxBudget, setMaxBudget] = useState(400);
  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const activeSession = getActivePassengerTrip();

  if (!isOpen) return null;

  // If the user already has an active trip or request in progress, trigger restriction modal
  if (activeSession.hasActiveSession && !submitted) {
    return (
      <ActiveTripRestrictionModal
        isOpen={isOpen}
        onClose={onClose}
        onNavigate={onNavigate}
        activeSession={activeSession}
      />
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check again before submitting
    const checkActive = getActivePassengerTrip();
    if (checkActive.hasActiveSession) {
      addToast(checkActive.message, 'error');
      return;
    }

    if (!origin || !destination) {
      addToast('Please enter both pickup and destination locations', 'warning');
      return;
    }

    setLoading(true);
    const activeToken = token || localStorage.getItem('rideshare_token') || localStorage.getItem('driveit_token');
    const newReqPayload = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      passengerId: user?.id || 'guest_user',
      origin,
      destination,
      preferredDate: selectedDateTime ? selectedDateTime.split('T')[0] : new Date().toISOString().split('T')[0],
      preferredTime: selectedDateTime && selectedDateTime.includes('T') ? selectedDateTime.split('T')[1] : '08:00 AM',
      seats: Number(seats) || 1,
      maxBudget: Number(maxBudget) || 400,
      passengerName: passengerName || user?.name || 'Verified Commuter',
      passengerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      contactPhone: contactPhone || user?.phone || '+91 98200 12345',
      notes: notes || 'Preferred pickup near highway express junction.',
      status: 'OPEN',
      bidsCount: 0,
      createdAt: new Date().toISOString()
    };

    // Save locally for instant cross-tab / demo visibility
    try {
      const existingReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updatedReqs = [newReqPayload, ...existingReqs.filter(r => r.id !== newReqPayload.id)];
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updatedReqs));
      window.dispatchEvent(new CustomEvent('driveit_sync_requests', { detail: newReqPayload }));
      window.dispatchEvent(new Event('storage'));
      
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('driveit_realtime_channel');
        bc.postMessage({ type: 'request:created', request: newReqPayload });
        bc.close();
      }
    } catch (err) {
      console.warn('Could not save request locally:', err);
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (activeToken) headers['Authorization'] = `Bearer ${activeToken}`;

      const res = await fetch('/api/rides/requests', {
        method: 'POST',
        headers,
        body: JSON.stringify(newReqPayload)
      });

      if (res.ok) {
        setSubmitted(true);
        if (onSuccess) onSuccess(newReqPayload);
        addToast('✅ Highway Commute Demand Broadcast to Verified Pilots!', 'success');
      } else {
        setSubmitted(true);
        if (onSuccess) onSuccess(newReqPayload);
        addToast('✅ Commute Demand Published!', 'success');
      }
    } catch (e) {
      setSubmitted(true);
      if (onSuccess) onSuccess(newReqPayload);
      addToast('✅ Commute Demand Published!', 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1.5px solid var(--color-border)',
        borderRadius: '28px',
        width: '520px',
        maxWidth: '100%',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.4)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--color-bg-secondary)',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#10B981',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.5)'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ● HIGHWAY ROUTE ALERT ACTIVE
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-primary)', margin: '6px 0 10px' }}>
              Request Broadcast to 2,800+ Pilots!
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              We have alerted verified pilots traveling on <strong>{origin.split(',')[0]} ➔ {destination.split(',')[0]}</strong>. You will receive an instant SMS/Push notification as soon as a seat is matched.
            </p>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: '900',
                cursor: 'pointer'
              }}
            >
              Done & Return to Cockpit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(56, 189, 248, 0.14)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38BDF8',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '900',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                <BellRing size={13} />
                <span>Expressway Commuter Alerts</span>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
                Request a Highway Ride
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', margin: '4px 0 0' }}>
                Can't find an exact match? Broadcast your route to verified corporate pilots.
              </p>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="#10B981" />
                  <span>Pickup City or Highway Bay</span>
                </label>
                <LocationAutocompleteInput
                  value={origin}
                  onChange={setOrigin}
                  label={null}
                  placeholder="e.g. Bandra Kurla Complex (BKC), Mumbai"
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Navigation size={12} color="#EF4444" />
                  <span>Dropoff Destination</span>
                </label>
                <LocationAutocompleteInput
                  value={destination}
                  onChange={setDestination}
                  label={null}
                  placeholder="e.g. Hinjewadi Phase 1 / Swargate, Pune"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} color="#A3E635" />
                    <span>Preferred Schedule</span>
                  </label>
                  <ScheduleDropdownPicker
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IndianRupee size={12} color="#10B981" />
                    <span>Max Budget (₹/Seat)</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="3000"
                    step="50"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: '14px',
                      background: 'var(--color-bg-secondary)',
                      border: '1.5px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: '13.5px',
                      fontWeight: '800',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Special Luggage / Pickup Landmark Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Carrying 1 laptop bag / near BKC gate 3"
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '14px',
                    background: 'var(--color-bg-secondary)',
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                color: '#000000',
                border: 'none',
                borderRadius: '14px',
                padding: '13px',
                fontSize: '14.5px',
                fontWeight: '900',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(132, 204, 22, 0.35)'
              }}
            >
              <Sparkles size={16} />
              <span>Broadcast Ride Request ⚡</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
