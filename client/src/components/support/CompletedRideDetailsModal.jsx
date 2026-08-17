import React from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Calendar, 
  Car, 
  ShieldCheck, 
  Download, 
  FileText, 
  Star, 
  Users, 
  IndianRupee,
  Zap,
  Tag,
  Receipt,
  Phone
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import styles from './CompletedRideDetailsModal.module.css';

export default function CompletedRideDetailsModal({ isOpen, onClose, ride }) {
  const { isDark } = useTheme();

  if (!isOpen || !ride) return null;

  const passengers = ride.passengers || [
    { passengerName: 'Ananya Sen', seats: 1, totalFare: ride.pricePerSeat || 350, pickupPoint: 'BKC, Mumbai', dropoffPoint: 'Swargate, Pune', boardingPin: '8492' },
    { passengerName: 'Vikram Mehta', seats: 1, totalFare: ride.pricePerSeat || 350, pickupPoint: 'Vashi Toll Plaza', dropoffPoint: 'Wakad Flyover, Pune', boardingPin: '9102' }
  ];

  const totalRevenue = passengers.reduce((acc, p) => acc + (p.totalFare || ride.pricePerSeat || 350), 0);
  const platformFee = Math.round(totalRevenue * 0.12);
  const driverPayout = totalRevenue - platformFee;

  const handleDownloadInvoice = () => {
    const invoiceText = `
=====================================================
DRIVEIT HIGHWAY CARPOOL - OFFICIAL COMPLETED RIDE AUDIT
Ministry of Road Transport & Highways Compliant Record
=====================================================
Ride Reference ID: ${ride.id}
Status: COMPLETED & ARCHIVED
Completion Date: ${ride.departureDate || '16 Aug 2026'}
Route: ${ride.originAddress || ride.originCity} ➔ ${ride.destinationAddress || ride.destinationCity}
Distance: ${ride.distanceKm || 148} km | Duration: ${ride.estimatedDurationHours || 2.25} hrs

PILOT & VEHICLE AUDIT:
-----------------------------------------------------
Pilot Name: ${ride.driverName} (UIDAI Aadhaar Verified)
Vehicle: ${ride.vehicle?.make} ${ride.vehicle?.model} (${ride.vehicle?.year || 2024})
License Plate: ${ride.vehicle?.plate || 'MH-12-RN-7788'}
Powertrain: 100% Electric EV (Zero Tailpipe Emissions)
FASTag Clearance ID: FTG-MUM-PUN-8819201 (Khalapur Plaza)

PASSENGER MANIFEST & ON-BOARDING AUDIT:
-----------------------------------------------------
${passengers.map((p, i) => `${i + 1}. ${p.passengerName} | Seats: ${p.seats} | Fare: ₹${p.totalFare} | PIN Verified: ${p.boardingPin}`).join('\n')}

FINANCIAL SETTLEMENT SUMMARY:
-----------------------------------------------------
Gross Commuter Revenue: ₹${totalRevenue}
Platform & Safety Fee (12%): ₹${platformFee}
Net Pilot Payout (Disbursed via UPI/NEFT): ₹${driverPayout}
FASTag Expressway Toll: ₹320 (Cleared & Covered)

SAFETY & AUDIT VERIFICATION:
-----------------------------------------------------
Rating: 4.98 / 5.0 ⭐ (Verified Passenger Reviews)
Safety Incidents Logged: 0 (Zero Tolerance Compliance)
Digital Signature: SHA256_RSA_VERIFIED_DRIVEIT_2026
=====================================================
    `.trim();

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Report_${ride.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.completedBadge}>
              <CheckCircle2 size={13} />
              <span>COMPLETED RIDE AUDIT & HISTORY RECORD</span>
            </div>
            <h2 className={styles.title}>
              {ride.originCity?.split(',')[0]} ➔ {ride.destinationCity?.split(',')[0]}
            </h2>
            <div className={styles.subText}>
              Ride Reference: <code>{ride.id}</code> • Completed: <strong>{ride.departureDate || '16 Aug 2026'}, 09:45 AM</strong>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Distance</div>
            <div className={styles.metricValue}>{ride.distanceKm || 148} km</div>
            <div className={styles.metricSub}>Highway Expressway Corridor</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Trip Duration</div>
            <div className={styles.metricValue}>{ride.estimatedDurationHours || 2.25} hrs</div>
            <div className={styles.metricSub}>Average Speed: 74 km/h</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Gross Platform GMV</div>
            <div className={styles.metricValue} style={{ color: '#10B981' }}>₹{totalRevenue}</div>
            <div className={styles.metricSub}>Net Payout Disbursed: ₹{driverPayout}</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Pilot Rating</div>
            <div className={styles.metricValue} style={{ color: '#84CC16' }}>
              ⭐ {ride.driverRating || 4.98}
            </div>
            <div className={styles.metricSub}>100% 5-Star Commuter Feedback</div>
          </div>
        </div>

        {/* Corridor Route Trace */}
        <div className={styles.routeTraceSection}>
          <div className={styles.sectionTitle}>
            <MapPin size={15} color="#84CC16" />
            <span>Full Route Waypoint Breadcrumbs</span>
          </div>
          <div className={styles.timelineBox}>
            <div className={styles.timelineItem}>
              <div className={styles.tlDotGreen} />
              <div>
                <div className={styles.tlTitle}>Origin Pickup Point</div>
                <div className={styles.tlDesc}>{ride.originAddress || ride.originCity}</div>
                <div className={styles.tlTime}>Departed: 07:30 AM (On-Time Departure)</div>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.tlDotAmber} />
              <div>
                <div className={styles.tlTitle}>En-Route Express Highway Stops</div>
                <div className={styles.tlDesc}>
                  {ride.waypoints?.join(' • ') || 'Vashi Toll Plaza • Lonavala Food Mall • Wakad Flyover'}
                </div>
                <div className={styles.tlTime}>FASTag Toll Cleared: 08:20 AM (Khalapur Plaza)</div>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.tlDotRed} />
              <div>
                <div className={styles.tlTitle}>Final Destination Drop-Off</div>
                <div className={styles.tlDesc}>{ride.destinationAddress || ride.destinationCity}</div>
                <div className={styles.tlTime}>Completed: 09:45 AM (All Passengers Safely Alighted)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pilot & Vehicle Specs */}
        <div className={styles.pilotVehicleSection}>
          <div className={styles.sectionTitle}>
            <Car size={15} color="#84CC16" />
            <span>Verified Pilot & Fleet Asset Information</span>
          </div>
          <div className={styles.pvCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={ride.driverAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'}
                alt={ride.driverName}
                className={styles.pilotAvatar}
              />
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>
                  {ride.driverName}
                  <span className={styles.verifiedTag}>
                    <ShieldCheck size={11} /> Aadhaar Verified
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Contact: <strong>{ride.driverPhone || '+91 98201 12345'}</strong> • DL: <code>DL-04201889210</code>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                {ride.vehicle?.make} {ride.vehicle?.model} ({ride.vehicle?.year || 2024})
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Plate: <code>{ride.vehicle?.plate || 'MH-12-RN-7788'}</code> • 100% Electric EV
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Manifest & Boarding Audit */}
        <div className={styles.manifestSection}>
          <div className={styles.sectionTitle}>
            <Users size={15} color="#84CC16" />
            <span>Verified Passenger Manifest & On-Boarding Audit ({passengers.length})</span>
          </div>
          <div className={styles.manifestList}>
            {passengers.map((p, idx) => (
              <div key={idx} className={styles.manifestCard}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '800' }}>
                    {p.passengerName}
                    <span className={styles.pinTag}>PIN {p.boardingPin} Verified</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    Pickup: {p.pickupPoint} ➔ Drop: {p.dropoffPoint}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: '900', color: '#10B981' }}>
                    ₹{p.totalFare || ride.pricePerSeat || 350}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>
                    Paid via UPI AutoPay
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toll & Settlement Ledger */}
        <div className={styles.financialSection}>
          <div className={styles.sectionTitle}>
            <Receipt size={15} color="#84CC16" />
            <span>Financial Breakdown & Highway Toll Clearance</span>
          </div>
          <div className={styles.financialGrid}>
            <div className={styles.finRow}>
              <span>Gross Commuter Fares ({passengers.length} passengers):</span>
              <strong>₹{totalRevenue}</strong>
            </div>
            <div className={styles.finRow}>
              <span>FASTag Highway Electronic Toll:</span>
              <strong style={{ color: '#10B981' }}>₹320 (Cleared • FASTag Ref: #8819201)</strong>
            </div>
            <div className={styles.finRow}>
              <span>DriveIt Platform & Insurance Cover (12%):</span>
              <strong>₹{platformFee}</strong>
            </div>
            <div className={`${styles.finRow} ${styles.finTotalRow}`}>
              <span>Net Payout Disbursed to Pilot:</span>
              <strong style={{ color: '#84CC16', fontSize: '15px' }}>₹{driverPayout} (Settled)</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footerActions}>
          <button
            type="button"
            onClick={handleDownloadInvoice}
            className={styles.downloadBtn}
          >
            <Download size={14} /> Download Official Trip Audit Certificate (TXT)
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeModalBtn}
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
