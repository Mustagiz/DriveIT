import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Send } from 'lucide-react';
import { useToast } from './Toast';
import { useAuth } from '../context/AuthContext';

export default function ReportModal({ booking, onClose, onSuccess }) {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [category, setCategory] = useState('DANGEROUS_DRIVING');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'DANGEROUS_DRIVING', label: 'Dangerous Driving / Overspeeding' },
    { id: 'OVERCHARGING_TOLLS', label: 'Requested Cash / Toll Overcharging' },
    { id: 'VEHICLE_MISMATCH', label: 'Vehicle / Driver Mismatch' },
    { id: 'NO_SHOW', label: 'Driver No-show / Late Cancellation' },
    { id: 'UNPROFESSIONAL_BEHAVIOR', label: 'Unprofessional Conduct' },
    { id: 'HARASSMENT', label: 'Safety / Harassment Concern' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      addToast('Please provide a description of the incident', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/booker/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: booking.id,
          reportedUserId: booking.driverId,
          category,
          description,
          evidenceUrl
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      addToast('Incident reported to Driveit Trust & Safety Desk', 'info');
      onSuccess && onSuccess(data.report);
      onClose();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

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
        maxWidth: '500px',
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #FECACA',
        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: '#FEF2F2',
          borderBottom: '1px solid #FECACA',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="#DC2626" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#991B1B' }}>
                Report Incident to Support Desk
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#B91C1C' }}>
                Trip Ref: {booking.bookingRef}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #FECACA',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#DC2626'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Incident Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-input"
              style={{ fontSize: '0.88rem', fontWeight: '600' }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Describe what occurred
            </label>
            <textarea
              rows="4"
              required
              className="glass-input"
              placeholder="Please provide details about the location, route, and driver conduct..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
              Evidence Link / Screenshot URL (Optional)
            </label>
            <input
              type="url"
              className="glass-input"
              placeholder="https://..."
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-danger"
              style={{ flex: 2, justifyContent: 'center' }}
            >
              <ShieldAlert size={15} />
              <span>{submitting ? 'Submitting Report...' : 'File Safety Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
