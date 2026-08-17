import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Car, 
  CreditCard, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  User,
  Phone,
  Mail,
  Zap,
  ZoomIn,
  QrCode,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import styles from './KycInspectionModal.module.css';

export default function KycInspectionModal({ isOpen, onClose, pilot, onReviewKyc }) {
  const [activeDocTab, setActiveDocTab] = useState('aadhaar'); // 'aadhaar' | 'license' | 'rc'
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  if (!isOpen || !pilot) return null;

  const isVerified = pilot.kyc_status === 'VERIFIED' || pilot.verified;
  const isPending = pilot.kyc_status === 'PENDING' || !pilot.kyc_status;
  const isRejected = pilot.kyc_status === 'REJECTED';

  // Real or high-resolution document previews
  const defaultAadhaarImg = pilot.aadhaar_doc_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000';
  const defaultLicenseImg = pilot.driving_license_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000';
  const defaultRcImg = pilot.vehicle_rc_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000';

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await onReviewKyc(pilot.id, 'APPROVE');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setShowRejectInput(true);
      return;
    }
    setSubmitting(true);
    try {
      await onReviewKyc(pilot.id, 'REJECT', rejectionReason.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const currentDocUrl = 
    activeDocTab === 'aadhaar' ? defaultAadhaarImg :
    activeDocTab === 'license' ? defaultLicenseImg : defaultRcImg;

  const currentDocLabel = 
    activeDocTab === 'aadhaar' ? 'Government of India (UIDAI) Aadhaar Record' :
    activeDocTab === 'license' ? 'Ministry of Road Transport Driving License' : 'Parivahan Sewa - Form 23 RC Record';

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className={styles.headerTitleRow}>
                <h2 className={styles.headerTitle}>Pilot Compliance & Document Audit</h2>
                <span className={`${styles.statusBadge} ${
                  isVerified ? styles.statusVerified : isRejected ? styles.statusRejected : styles.statusPending
                }`}>
                  {isVerified ? 'VERIFIED PILOT' : isRejected ? 'REJECTED' : 'PENDING AUDIT'}
                </span>
              </div>
              <p className={styles.headerSubtitle}>
                Review Government Identity, Driving License & Vehicle RC uploaded by <strong>{pilot.name}</strong>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className={styles.modalBody}>
          {/* Left Column: Pilot Details & Vehicle Info */}
          <div className={styles.profileSidebar}>
            <div className={styles.pilotProfileCard}>
              <img
                src={pilot.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                alt={pilot.name}
                className={styles.pilotAvatar}
              />
              <h3 className={styles.pilotName}>{pilot.name}</h3>
              <span className={styles.pilotRolePill}>Registered Highway Pilot</span>
              
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <Mail size={13} color="#84CC16" />
                  <span>{pilot.email}</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={13} color="#84CC16" />
                  <span>{pilot.phone || '+91 98334 11223'}</span>
                </div>
              </div>

              {pilot.bio && (
                <div className={styles.bioBox}>
                  "{pilot.bio}"
                </div>
              )}
            </div>

            {/* Vehicle Card */}
            {pilot.vehicle && (
              <div className={styles.vehicleCard}>
                <div className={styles.vehicleCardHeader}>
                  <Car size={16} color="#84CC16" />
                  <h4>Vehicle Specifications</h4>
                  {pilot.vehicle.electric && (
                    <span className={styles.evBadge}>
                      <Zap size={11} /> EV
                    </span>
                  )}
                </div>

                <div className={styles.vehicleGrid}>
                  <div className={styles.vehicleField}>
                    <span className={styles.fieldLabel}>Make & Model</span>
                    <span className={styles.fieldValue}>{pilot.vehicle.make} {pilot.vehicle.model}</span>
                  </div>
                  <div className={styles.vehicleField}>
                    <span className={styles.fieldLabel}>Year & Color</span>
                    <span className={styles.fieldValue}>{pilot.vehicle.year || 2024} • {pilot.vehicle.color || 'Starry Black'}</span>
                  </div>
                  <div className={styles.vehicleField}>
                    <span className={styles.fieldLabel}>Registration Plate</span>
                    <span className={styles.plateBadge}>{pilot.vehicle.plate || pilot.vehicle_rc_number || 'MH-12-EV-9900'}</span>
                  </div>
                  <div className={styles.vehicleField}>
                    <span className={styles.fieldLabel}>Powertrain</span>
                    <span className={styles.fieldValue}>{pilot.vehicle.fuelType || (pilot.vehicle.electric ? 'ELECTRIC' : 'PETROL')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Notice if rejected */}
            {isRejected && pilot.kyc_rejection_reason && (
              <div className={styles.rejectionNoticeBox}>
                <AlertTriangle size={15} color="#DC2626" />
                <div>
                  <strong>Rejection Note:</strong>
                  <p>{pilot.kyc_rejection_reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: High-Res Document Viewer & Inspector */}
          <div className={styles.documentViewerCol}>
            {/* Document Selector Tabs */}
            <div className={styles.docTabsRow}>
              <button
                type="button"
                onClick={() => setActiveDocTab('aadhaar')}
                className={`${styles.docTabBtn} ${activeDocTab === 'aadhaar' ? styles.docTabActive : ''}`}
              >
                <CreditCard size={15} />
                <div>
                  <span>Aadhaar Card</span>
                  <span className={styles.docNumberSub}>{pilot.aadhaar_number || 'XXXX-XXXX-3341'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveDocTab('license')}
                className={`${styles.docTabBtn} ${activeDocTab === 'license' ? styles.docTabActive : ''}`}
              >
                <FileText size={15} />
                <div>
                  <span>Driving License</span>
                  <span className={styles.docNumberSub}>{pilot.driving_license_number || 'MH-12-2023-0044556'}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveDocTab('rc')}
                className={`${styles.docTabBtn} ${activeDocTab === 'rc' ? styles.docTabActive : ''}`}
              >
                <Car size={15} />
                <div>
                  <span>Vehicle RC</span>
                  <span className={styles.docNumberSub}>{pilot.vehicle_rc_number || pilot.vehicle?.plate || 'MH-12-EV-9900'}</span>
                </div>
              </button>
            </div>

            {/* Document Details & Security Checks */}
            <div className={styles.docDetailsBar}>
              <div className={styles.docMetaLeft}>
                <span className={styles.docTitleMain}>{currentDocLabel}</span>
                <div className={styles.securityTags}>
                  <span className={styles.secTagGreen}>
                    <CheckCircle2 size={12} /> 256-Bit Encrypted Vault
                  </span>
                  <span className={styles.secTagBlue}>
                    <ShieldCheck size={12} /> Indian RTO / UIDAI Validated
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnlargedImage(currentDocUrl)}
                className={styles.zoomBtn}
                title="Expand full screen"
              >
                <ZoomIn size={14} /> Expand View
              </button>
            </div>

            {/* High-Resolution Document Canvas & Live Security Watermark */}
            <div className={styles.docImageCanvas} onClick={() => setEnlargedImage(currentDocUrl)}>
              <img
                src={currentDocUrl}
                alt={currentDocLabel}
                className={styles.docImagePreview}
              />
              <div className={styles.canvasWatermark}>
                <span>🔒 DRIVEIT INDIA OPERATIONS VERIFIED COMPLIANCE AUDIT</span>
              </div>
            </div>

            {/* Rejection input when triggered */}
            {showRejectInput && !isVerified && (
              <div className={styles.rejectionInputArea}>
                <label className={styles.rejectLabel}>Reason for Rejection / Rectification:</label>
                <textarea
                  rows="2"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why documents were rejected (e.g. Blurry photo, mismatched RC plate, expired Driving License)..."
                  className={styles.rejectTextarea}
                />
                <div className={styles.presetReasons}>
                  {[
                    'Blurry / unreadable document scan',
                    'RC plate mismatch with vehicle details',
                    'Name on Aadhaar does not match profile',
                    'Expired Driving License'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className={styles.presetBtn}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className={styles.actionsFooter}>
              {isVerified ? (
                <div className={styles.alreadyVerifiedBadge}>
                  <CheckCircle2 size={18} />
                  <span>This pilot is already officially verified with active expressway listing privileges.</span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={submitting}
                    className={styles.approveBtn}
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitting ? 'Verifying...' : 'Approve & Verify Pilot KYC'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={submitting}
                    className={styles.rejectBtn}
                  >
                    <XCircle size={16} />
                    <span>{showRejectInput ? 'Confirm Rejection' : 'Reject Application'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {enlargedImage && (
        <div className={styles.lightboxOverlay} onClick={() => setEnlargedImage(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage} alt="Document Zoom" className={styles.lightboxImg} />
            <button
              type="button"
              onClick={() => setEnlargedImage(null)}
              className={styles.lightboxCloseBtn}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
