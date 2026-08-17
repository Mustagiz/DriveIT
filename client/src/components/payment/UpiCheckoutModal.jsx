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
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={44} color="#166534" />
            </div>
            <h3 className={styles.successTitle}>Booking Confirmed & Seat Reserved!</h3>
            <p className={styles.successSub}>
              Your OTP Boarding Pass has been generated. Show this 4-digit PIN to Pilot <strong>{ride.driverName}</strong> upon boarding.
            </p>

            {/* Boarding Pass Ticket */}
            <div className={styles.passCard}>
              <div className={styles.passTop}>
                <div>
                  <span className={styles.passRoute}>{ride.originCity?.split(',')[0]} ➔ {ride.destinationCity?.split(',')[0]}</span>
                  <span className={styles.passVehicle}>{ride.vehicle?.make} {ride.vehicle?.model} • {ride.vehicle?.plate}</span>
                </div>
                <div className={styles.passPinBox}>
                  <span className={styles.passPinLabel}>BOARDING OTP</span>
                  <span className={styles.passPinDigits}>{confirmedBookingData?.booking?.boardingPin || '4829'}</span>
                </div>
              </div>

              <div className={styles.passMetaRow}>
                <div>
                  <span className={styles.passMetaLabel}>Departure:</span>
                  <span className={styles.passMetaVal}>{ride.departureDate} at {ride.departureTime}</span>
                </div>
                <div>
                  <span className={styles.passMetaLabel}>Seats:</span>
                  <span className={styles.passMetaVal}>{selectedSeats} Seat(s)</span>
                </div>
                <div>
                  <span className={styles.passMetaLabel}>Total Paid:</span>
                  <span className={styles.passMetaValGreen}>₹{finalPayable}</span>
                </div>
              </div>
            </div>

            <div className={styles.successActionsRow}>
              <button
                type="button"
                onClick={handleShareSplit}
                className={styles.shareSplitBtn}
              >
                <Share2 size={15} /> Split with Friend (WhatsApp)
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.doneBtn}
              >
                Done / View Trip Pass
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
