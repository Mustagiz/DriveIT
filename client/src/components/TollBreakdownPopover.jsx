import React from 'react';
import { X, TrendingDown, ShieldCheck, Zap, Fuel, Sparkles, Navigation } from 'lucide-react';
import styles from './TollBreakdownPopover.module.css';

export default function TollBreakdownPopover({ isOpen, onClose, ride, pricingData }) {
  if (!isOpen) return null;

  const totalSeats = ride?.totalSeats || 4;
  const pricePerSeat = ride?.pricePerSeat || pricingData?.finalPricePerSeat || 385;
  const isElectric = (ride?.vehicle?.fuelType || (ride?.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase() === 'ELECTRIC';

  // Fallback calculations if pricingData not fully populated
  const dist = ride?.distanceKm || pricingData?.distanceKm || 148;
  const taxiEstimate = pricingData?.taxiFareEstimate || Math.round(dist * 18);
  const savings = Math.max(0, taxiEstimate - pricePerSeat);
  const savingsPct = taxiEstimate > 0 ? Math.round((savings / taxiEstimate) * 100) : 78;

  const tollGates = Array.isArray(pricingData?.tollGates) && pricingData.tollGates.length > 0
    ? pricingData.tollGates
    : [
        { name: 'Khalapur Toll Plaza', km: 42, amount: 85, perSeat: Math.round(85 / totalSeats) },
        { name: 'Urse Toll Plaza', km: 78, amount: 85, perSeat: Math.round(85 / totalSeats) }
      ];

  const totalTollPerSeat = tollGates.reduce((sum, g) => sum + (g.perSeat || Math.round(g.amount / totalSeats)), 0);
  const baseRate = isElectric ? 2.80 : 3.75;
  const baseFuelShare = Math.round(dist * baseRate / totalSeats) || Math.max(50, pricePerSeat - totalTollPerSeat - 25);
  const greenDeduction = isElectric ? 35 : 0;
  const platformFee = 25;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popoverCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShieldCheck size={18} color="#00AFF5" />
            <span>AI Fair-Fare & Toll Transparency</span>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} title="Close Breakdown">
            <X size={15} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Solo Cab Comparison */}
          <div className={styles.savingsBanner}>
            <div className={styles.savingsHeader}>
              <span className={styles.savingsTag}>🚕 Solo Cab vs 🚘 Driveit</span>
              <span className={styles.savingsPercent}>{savingsPct}% Cheaper</span>
            </div>
            <div className={styles.comparisonRow}>
              <span>Commercial Taxi Estimate:</span>
              <span style={{ textDecoration: 'line-through', opacity: 0.75 }}>₹{taxiEstimate}</span>
            </div>
            <div className={styles.comparisonRow} style={{ marginTop: '4px' }}>
              <span style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Your Driveit Seat Fare:</span>
              <span className={styles.comparisonHighlight}>₹{pricePerSeat}</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#00AFF5', fontWeight: 800, marginTop: '6px' }}>
              💰 You save ₹{savings} on this trip!
            </div>
          </div>

          {/* Itemized Calculation */}
          <div className={styles.breakdownSection}>
            <div className={styles.sectionLabel}>How this seat fare is calculated</div>

            <div className={styles.breakdownItem}>
              <span>Vehicle Mileage Share ({dist} km @ ₹{baseRate}/km split):</span>
              <strong>₹{baseFuelShare}</strong>
            </div>

            <div className={styles.breakdownItem}>
              <span>FASTag Expressway Toll Split ({totalSeats} seats):</span>
              <strong style={{ color: '#00AFF5' }}>+ ₹{totalTollPerSeat}</strong>
            </div>

            {/* Toll Gates Itemized */}
            <div className={styles.tollList}>
              {tollGates.map((gate, i) => (
                <div key={i} className={styles.tollSubItem}>
                  <span>• {gate.name} (KM {gate.km}): ₹{gate.amount}</span>
                  <span>₹{gate.perSeat || Math.round(gate.amount / totalSeats)}/seat</span>
                </div>
              ))}
            </div>

            <div className={styles.breakdownItem}>
              <span>Escrow Protection & Insurance:</span>
              <strong>+ ₹{platformFee}</strong>
            </div>

            {isElectric && (
              <div className={`${styles.breakdownItem} ${styles.greenBonusRow}`}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={12} fill="currentColor" />
                  <span>100% EV Green Energy Discount:</span>
                </span>
                <strong>- ₹{greenDeduction}</strong>
              </div>
            )}

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Fare Per Seat:</span>
              <span className={styles.totalPrice}>₹{pricePerSeat}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              background: '#00AFF5',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '11px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 175, 245, 0.3)'
            }}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
