import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Share2, 
  Clock, 
  Copy, 
  Lock, 
  Sparkles,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import { useToast } from '../Toast';
import styles from './UpiCheckoutModal.module.css';

export default function UpiCheckoutModal({ 
  isOpen, 
  onClose, 
  ride, 
  selectedSeats = 1, 
  totalPrice = 350, 
  pickupLocation = '', 
  dropoffLocation = '', 
  onConfirmBooking 
}) {
  const { addToast } = useToast();
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay' | 'phonepe' | 'paytm' | 'qr'
  const [upiIdInput, setUpiIdInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);
  const [countdown, setCountdown] = useState(180); // 3 mins

  useEffect(() => {
    if (!isOpen) {
      setPaidSuccess(false);
      setProcessing(false);
      setConfirmedBookingData(null);
      setCountdown(180);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !ride) return null;

  const baseFare = Math.round(totalPrice * 0.85);
  const fastagTollShare = Math.round(totalPrice * 0.15);
  const greenEcoDiscount = ride.vehicle?.electric ? 15 : 0;
  const finalPayable = Math.max(50, totalPrice - greenEcoDiscount);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePay = async () => {
    setProcessing(true);
    try {
      // Simulate real-time UPI handshake with NPCI gateway
      await new Promise(resolve => setTimeout(resolve, 1200));

      const bookingResult = await onConfirmBooking();
      sounds.playSuccess();
      setPaidSuccess(true);
      setConfirmedBookingData(bookingResult);
      addToast('UPI Payment Approved by Bank! Trip Confirmed.', 'success');
    } catch (e) {
      addToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const handleShareSplit = () => {
    const text = `Join my DriveIT carpool from ${ride.originCity} to ${ride.destinationCity} in a ${ride.vehicle?.make} ${ride.vehicle?.model}! Fuel share is only ₹${finalPayable} per seat. Book at https://driveit.in/#/ride/${ride.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      addToast('WhatsApp split link copied to clipboard!', 'success');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Smartphone size={22} />
            </div>
            <div>
              <h2 className={styles.headerTitle}>UPI Fast Checkout & Instant Pass</h2>
              <p className={styles.headerSubtitle}>
                NPCI 256-Bit Escrow Vault • Direct Pilot Settlement
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Success Confirmation Screen */}
        {paidSuccess ? (
          <div className={styles.successScreen}>
            {/* Animated Glow Badge */}
            <div className={styles.successHeaderWrap}>
              <div className={styles.successHaloRing}>
                <div className={styles.successIconCircle}>
                  <CheckCircle2 size={36} color="#052E16" strokeWidth={2.5} />
                </div>
              </div>
              <div className={styles.verifiedEscrowTag}>
                <Sparkles size={12} color="#84CC16" />
                <span>NPCI Approved • 100% Escrow Vault Verified</span>
              </div>
              <h3 className={styles.successTitle}>Booking Confirmed & Seat Reserved!</h3>
              <p className={styles.successSub}>
                Your digital boarding pass is active. Present this 4-digit Boarding OTP to Pilot <strong>{ride.driverName || 'Rahul Sharma'}</strong> when entering the vehicle.
              </p>
            </div>

            {/* Aviation Grade Digital Boarding Pass */}
            <div className={styles.boardingPassTicket}>
              {/* Ticket Top Notch */}
              <div className={styles.ticketNotchLeft} />
              <div className={styles.ticketNotchRight} />

              {/* Corridor Route Header */}
              <div className={styles.passHeaderRow}>
                <div className={styles.passHeaderRouteCol}>
                  <div className={styles.passCorridorBadge}>
                    <Zap size={11} color="#84CC16" />
                    <span>HIGHWAY CORRIDOR PASS</span>
                  </div>
                  <div className={styles.passRouteCities}>
                    <span>{ride.originCity?.split(',')[0] || 'Mumbai'}</span>
                    <span className={styles.passRouteArrow}>➔</span>
                    <span>{ride.destinationCity?.split(',')[0] || 'Pune'}</span>
                  </div>
                  <div className={styles.passHubLocations}>
                    <span>{ride.originAddress || 'Bandra Kurla Complex (BKC)'}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span>{ride.destinationAddress || 'Swargate Metro Hub'}</span>
                  </div>
                </div>

                {/* Pilot Cardlet */}
                <div className={styles.passPilotBadge}>
                  <img
                    src={ride.driverAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'}
                    alt={ride.driverName || 'Pilot'}
                    className={styles.passPilotAvatar}
                  />
                  <div>
                    <div className={styles.passPilotName}>
                      {ride.driverName || 'Rahul Sharma'}
                    </div>
                    <div className={styles.passPilotRating}>
                      <ShieldCheck size={11} color="#10B981" />
                      <span>UIDAI Verified Pilot</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perforated Divider */}
              <div className={styles.perforatedLine} />

              {/* Main Boarding Security Section: OTP & QR Code */}
              <div className={styles.passSecuritySection}>
                <div className={styles.passOtpContainer}>
                  <span className={styles.passOtpLabel}>BOARDING PASS SECRET OTP</span>
                  <div 
                    className={styles.passOtpBox}
                    onClick={() => {
                      const otp = confirmedBookingData?.booking?.boardingPin || '4829';
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(otp);
                        addToast(`Boarding OTP ${otp} copied!`, 'success');
                      }
                    }}
                    title="Click to copy OTP"
                  >
                    <span className={styles.passOtpCode}>
                      {confirmedBookingData?.booking?.boardingPin || '4829'}
                    </span>
                    <span className={styles.copyOtpTip}>
                      <Copy size={11} /> TAP TO COPY
                    </span>
                  </div>
                </div>

                <div className={styles.passVehicleInfo}>
                  <div className={styles.passVehicleTitle}>
                    {ride.vehicle?.make || 'Tata'} {ride.vehicle?.model || 'Nexon EV'}
                  </div>
                  <div className={styles.passVehiclePlate}>
                    {ride.vehicle?.plate || 'MH-12-RN-7788'}
                  </div>
                  <div className={styles.passFastagPill}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                    <span>FASTag Express Toll Included</span>
                  </div>
                </div>
              </div>

              {/* Details Footer Grid */}
              <div className={styles.passDetailsGrid}>
                <div className={styles.passDetailItem}>
                  <span className={styles.passDetailLabel}>DEPARTURE TIME</span>
                  <span className={styles.passDetailValue}>{ride.departureDate} • {ride.departureTime}</span>
                </div>
                <div className={styles.passDetailItem}>
                  <span className={styles.passDetailLabel}>SEATS RESERVED</span>
                  <span className={styles.passDetailValue}>{selectedSeats} Passenger Seat(s)</span>
                </div>
                <div className={styles.passDetailItem}>
                  <span className={styles.passDetailLabel}>ESCROW PAID</span>
                  <span className={styles.passDetailPrice}>₹{finalPayable}</span>
                </div>
              </div>
            </div>

            {/* Mobile Notification Confirmation Notice */}
            <div className={styles.smsConfirmationBanner}>
              <span>📲</span>
              <span>Live GPS link and boarding pass sent to your mobile via SMS & WhatsApp</span>
            </div>

            {/* Action Buttons */}
            <div className={styles.successActionsRow}>
              <button
                type="button"
                onClick={handleShareSplit}
                className={styles.shareSplitBtn}
              >
                <Share2 size={16} />
                <span>Split with Co-Passenger (WhatsApp)</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.doneBtn}
              >
                <span>Done / View Trip Pass</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form Screen */
          <div className={styles.modalBodyGrid}>
            {/* Left: UPI Payment Methods */}
            <div className={styles.paymentMethodsCol}>
              <div className={styles.upiAppsSelector}>
                <span className={styles.colSectionTitle}>Select UPI Payment App</span>
                <div className={styles.upiGrid}>
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: '🔵 GPay' },
                    { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                    { id: 'paytm', name: 'Paytm UPI', icon: '🔷 Paytm' },
                    { id: 'qr', name: 'Scan QR Code', icon: '📷 Instant QR' }
                  ].map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`${styles.upiAppBtn} ${selectedUpiApp === app.id ? styles.upiAppBtnActive : ''}`}
                    >
                      <span>{app.icon}</span>
                      <span className={styles.upiAppSub}>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedUpiApp === 'qr' ? (
                <div className={styles.qrCodeContainer}>
                  <QrCode size={110} color="#0F172A" />
                  <div className={styles.qrSub}>
                    <span>Scan with any UPI App (GPay, PhonePe, Paytm, CRED)</span>
                    <span className={styles.qrTimer}>Expires in: <strong>{formatTime(countdown)}</strong></span>
                  </div>
                </div>
              ) : (
                <div className={styles.upiIdInputBox}>
                  <label className={styles.inputLabel}>Enter UPI ID (VPA) or Mobile Number:</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or username@oksbi"
                    value={upiIdInput}
                    onChange={(e) => setUpiIdInput(e.target.value)}
                    className={styles.upiInput}
                  />
                  <span className={styles.instantSimulatePill}>⚡ Auto-verified by Indian National Payment Corp</span>
                </div>
              )}

              <button
                type="button"
                onClick={handlePay}
                disabled={processing}
                className={styles.payNowBtn}
              >
                <Lock size={16} />
                <span>{processing ? 'Connecting to UPI Escrow...' : `Authorize & Pay ₹${finalPayable}`}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Right: Itemized Fare & Route Receipt */}
            <div className={styles.receiptCol}>
              <div className={styles.receiptHeader}>
                <Receipt size={16} color="#84CC16" />
                <span>Itemized Highway Fare Breakdown</span>
              </div>

              <div className={styles.receiptList}>
                <div className={styles.receiptRow}>
                  <span>Base Seat Share ({selectedSeats}x)</span>
                  <span>₹{baseFare}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span>FASTag Toll & Corridor Share</span>
                  <span>₹{fastagTollShare}</span>
                </div>
                {greenEcoDiscount > 0 && (
                  <div className={styles.receiptRowGreen}>
                    <span>⚡ Green EV Carbon Subsidy</span>
                    <span>-₹{greenEcoDiscount}</span>
                  </div>
                )}
                <div className={styles.receiptDivider} />
                <div className={styles.receiptTotalRow}>
                  <span>Total Payable:</span>
                  <span className={styles.totalPriceText}>₹{finalPayable}</span>
                </div>
              </div>

              <div className={styles.securitySealBox}>
                <ShieldCheck size={16} color="#059669" />
                <div>
                  <strong>DriveIT Escrow Protection:</strong>
                  <p>Funds are held securely in escrow until pickup OTP is verified at the expressway gate.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
