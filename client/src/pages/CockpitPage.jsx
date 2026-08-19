import React from 'react';
import LiveInTripCockpit from '../components/cockpit/LiveInTripCockpit';
import { ArrowLeft } from 'lucide-react';

export default function CockpitPage({ onNavigate, rideId = 'ride_mum_pun_001' }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px 40px' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          style={{
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(71, 85, 105, 0.8)',
            color: '#F8FAFC',
            borderRadius: '9999px',
            padding: '8px 16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit Cockpit</span>
        </button>

        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '600' }}>
          Real-Time GPS Telemetry Stream • NHAI Electronic Pass
        </div>
      </div>

      {/* Live In-Trip Cockpit HUD */}
      <LiveInTripCockpit tripId={rideId} onClose={() => onNavigate('home')} />
    </div>
  );
}
