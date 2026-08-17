import React, { useState } from 'react';
import { User, Calendar, MapPin, X, Save, ShieldCheck } from 'lucide-react';
import { SpotlightCard } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';

export default function EditAadhaarModal({ isOpen, onClose, aadhaarState, onSave }) {
  const { token, updateUserState } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    nameOnCard: aadhaarState.nameOnCard || 'RAHUL SHARMA',
    dob: aadhaarState.dob || '14/08/1994',
    gender: aadhaarState.gender || 'MALE',
    address: aadhaarState.address || 'Flat 402, Lotus Heights, Sector 62, Noida, Uttar Pradesh - 201309'
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/kyc/card-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        if (updateUserState && data.user) {
          updateUserState(data.user);
        }
        if (onSave) {
          onSave(formData);
        }
        addToast('Aadhaar Card details updated successfully!', 'success');
        onClose();
      } else {
        throw new Error(data.error || 'Failed to update details');
      }
    } catch (err) {
      // Local update fallback
      if (onSave) {
        onSave(formData);
      }
      addToast('Aadhaar Card details updated locally', 'success');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <SpotlightCard
        spotlightColor="rgba(132, 204, 22, 0.25)"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '24px',
          padding: '28px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(132, 204, 22, 0.15)',
            color: '#65A30D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              Edit Digital Aadhaar Card
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Updates the legal details rendered on your digital card front & back
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
              Full Name (As on UIDAI Record)
            </label>
            <input
              type="text"
              required
              value={formData.nameOnCard}
              onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value.toUpperCase() })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-neutral-50)',
                color: 'var(--color-text-primary)',
                fontWeight: '700',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
                Date of Birth
              </label>
              <input
                type="text"
                required
                placeholder="DD/MM/YYYY"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-neutral-50)',
                  color: 'var(--color-text-primary)',
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  background: 'var(--color-neutral-50)',
                  color: 'var(--color-text-primary)',
                  fontWeight: '700',
                  fontSize: '13px'
                }}
              >
                <option value="MALE">MALE / पुरुष</option>
                <option value="FEMALE">FEMALE / महिला</option>
                <option value="TRANSGENDER">OTHER / अन्य</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-primary)', display: 'block', marginBottom: '6px' }}>
              Residential Address (Rendered on Card Back)
            </label>
            <textarea
              rows={3}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border)',
                background: 'var(--color-neutral-50)',
                color: 'var(--color-text-primary)',
                fontWeight: '500',
                fontSize: '13px',
                lineHeight: 1.4
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ flex: 1, padding: '11px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ flex: 1, padding: '11px' }}
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Details ➔'}</span>
            </button>
          </div>
        </form>
      </SpotlightCard>
    </div>
  );
}
