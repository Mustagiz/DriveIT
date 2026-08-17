import React, { useState, useEffect } from 'react';
import { Calculator, Zap, ShieldCheck, TrendingUp, Sparkles, Check } from 'lucide-react';

export default function DynamicPriceEstimator({ distanceKm = 148, fuelType = 'ELECTRIC', isElectric = true, onApplyPrice }) {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const cleanFuel = (fuelType || (isElectric ? 'ELECTRIC' : 'PETROL')).toUpperCase();

  useEffect(() => {
    fetchEstimate();
  }, [distanceKm, fuelType, isElectric]);

  const fetchEstimate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distanceKm: Number(distanceKm) || 148, fuelType: cleanFuel, isElectric: cleanFuel === 'ELECTRIC' })
      });
      if (res.ok) {
        const data = await res.json();
        setEstimate(data.pricing);
      }
    } catch (err) {
      console.error('Pricing calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const dist = Number(distanceKm) || 148;
  const ratePerKm = cleanFuel === 'ELECTRIC' ? 3.06 : cleanFuel === 'DIESEL' ? 3.50 : 3.75;
  const fare = estimate?.calculatedFarePerSeat || Math.max(50, Math.round(dist * ratePerKm));

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.85))',
      border: '1px solid rgba(132, 204, 22, 0.3)',
      borderRadius: '16px',
      padding: '18px 20px',
      marginBottom: '24px',
      boxShadow: '0 12px 28px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(132, 204, 22, 0.1)',
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(132, 204, 22, 0.15)',
            border: '1px solid rgba(132, 204, 22, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calculator size={18} color="#84CC16" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>AI Dynamic Fair-Fare Recommendation</span>
              <span style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '6px',
                background: cleanFuel === 'ELECTRIC' ? 'rgba(16, 185, 129, 0.15)' : cleanFuel === 'DIESEL' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(132, 204, 22, 0.15)',
                color: cleanFuel === 'ELECTRIC' ? '#10B981' : cleanFuel === 'DIESEL' ? '#818CF8' : '#84CC16',
                border: `1px solid ${cleanFuel === 'ELECTRIC' ? 'rgba(16, 185, 129, 0.3)' : cleanFuel === 'DIESEL' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(132, 204, 22, 0.3)'}`
              }}>
                {cleanFuel === 'ELECTRIC' ? '⚡ EV Eco ₹3.06/km' : cleanFuel === 'DIESEL' ? '🛢️ Diesel ₹3.50/km' : '⛽ Petrol ₹3.75/km'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              Calculated for {dist} km expressway corridor • Estimated vehicle running cost: ~₹{estimate?.estimatedTotalFuelCost || Math.round(dist * (cleanFuel === 'ELECTRIC' ? 1.8 : cleanFuel === 'DIESEL' ? 4.8 : 6.8))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#84CC16',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em'
            }}>
              ₹{fare}
              <span style={{ fontSize: '11px', fontWeight: '600', color: '#94A3B8', marginLeft: '4px' }}>/ seat</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onApplyPrice && onApplyPrice(fare);
              setApplied(true);
              setTimeout(() => setApplied(false), 2000);
            }}
            style={{
              background: applied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(132, 204, 22, 0.15)',
              border: applied ? '1px solid #10B981' : '1px solid rgba(132, 204, 22, 0.4)',
              color: applied ? '#10B981' : '#84CC16',
              borderRadius: '10px',
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 150ms ease'
            }}
          >
            {applied ? <Check size={13} /> : <Sparkles size={13} />}
            <span>{applied ? 'Applied!' : 'Apply Price'}</span>
          </button>
        </div>
      </div>

      {/* Fare Breakdown Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '8px',
        fontSize: '11px',
        color: '#CBD5E1',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div>Per Km Rate: <strong style={{ color: '#84CC16' }}>₹3.4 / km</strong></div>
        <div>Corridor Distance: <strong style={{ color: '#F8FAFC' }}>{dist} km</strong></div>
        <div>FASTag Toll Offset: <strong style={{ color: '#10B981' }}>Included</strong></div>
        <div>EV Green Subsidy: <strong style={{ color: '#10B981' }}>{isElectric ? '−10% Applied' : 'None'}</strong></div>
      </div>
    </div>
  );
}
