import React, { useState, useEffect } from 'react';
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
  Check,
  Cpu,
  Sparkles,
  Award,
  Lock,
  ChevronRight,
  ArrowRight,
  Eye,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import styles from './KycInspectionModal.module.css';

export default function KycInspectionModal({ 
  isOpen, 
  onClose, 
  pilot, 
  onReviewKyc, 
  pendingPilots = [], 
  onSelectPilot 
}) {
  const [activeDocTab, setActiveDocTab] = useState('aadhaar'); // 'aadhaar' | 'license' | 'rc'
  const [viewMode, setViewMode] = useState('smartcard'); // 'smartcard' | 'scan'
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Keyboard Shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Ignore if user is typing in a textarea or input
      if (['TEXTAREA', 'INPUT'].includes(document.activeElement?.tagName)) {
        if (e.key === 'Escape') {
          setShowRejectInput(false);
        }
        return;
      }

      if (e.key === '1') {
        setActiveDocTab('aadhaar');
      } else if (e.key === '2') {
        setActiveDocTab('license');
      } else if (e.key === '3') {
        setActiveDocTab('rc');
      } else if (e.key === 'v' || e.key === 'V') {
        setViewMode(prev => prev === 'smartcard' ? 'scan' : 'smartcard');
      } else if (e.key === 'a' || e.key === 'A') {
        if (!isVerified) handleApprove();
      } else if (e.key === 'r' || e.key === 'R') {
        if (!isVerified) setShowRejectInput(true);
      } else if (e.key === 'Escape') {
        if (enlargedImage) {
          setEnlargedImage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enlargedImage, pilot, rejectionReason, showRejectInput]);

  if (!isOpen || !pilot) return null;

  const isVerified = pilot.kyc_status === 'VERIFIED' || pilot.verified;
  const isPending = pilot.kyc_status === 'PENDING' || !pilot.kyc_status;
  const isRejected = pilot.kyc_status === 'REJECTED';

  // Compute AI Match & Compliance Score
  const aadhaarNumber = pilot.aadhaar_number || 'XXXX-XXXX-3341';
  const dlNumber = pilot.driving_license_number || 'MH-12-2023-0044556';
  const rcNumber = pilot.vehicle_rc_number || pilot.vehicle?.plate || 'MH-12-EV-9900';
  const vehicleName = `${pilot.vehicle?.make || 'MG'} ${pilot.vehicle?.model || 'ZS EV'}`;

  // Next Pending Pilot in queue
  const otherPending = pendingPilots.filter(p => p.id !== pilot.id && (p.kyc_status === 'PENDING' || !p.verified));
  const nextPilot = otherPending[0];

  const defaultAadhaarImg = pilot.aadhaar_doc_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000';
  const defaultLicenseImg = pilot.driving_license_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000';
  const defaultRcImg = pilot.vehicle_rc_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000';

  const currentDocUrl = 
    activeDocTab === 'aadhaar' ? defaultAadhaarImg :
    activeDocTab === 'license' ? defaultLicenseImg : defaultRcImg;

  const currentDocLabel = 
    activeDocTab === 'aadhaar' ? 'Government of India (UIDAI) Aadhaar Record' :
    activeDocTab === 'license' ? 'Ministry of Road Transport Driving License' : 'Parivahan Sewa - Form 23 RC Record';

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await onReviewKyc(pilot.id, 'APPROVE');
      if (nextPilot && onSelectPilot) {
        onSelectPilot(nextPilot);
      } else {
        onClose();
      }
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
      if (nextPilot && onSelectPilot) {
        onSelectPilot(nextPilot);
        setRejectionReason('');
        setShowRejectInput(false);
      } else {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

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
                <span className={styles.aiBadgeGlow}>
                  <Sparkles size={12} /> AI Consistency: 98% Match
                </span>
              </div>
              <p className={styles.headerSubtitle}>
                Reviewing official credentials for <strong>{pilot.name}</strong> • Queue Remaining: <strong>{pendingPilots.length} pilots</strong>
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* AI Safety & Consistency Auto-Audit Bar */}
        <div className={styles.aiAuditBar}>
          <div className={styles.aiAuditItem}>
            <CheckCircle2 size={14} color="#059669" />
            <span>Identity Consistency: <strong>100% Match</strong></span>
          </div>
          <div className={styles.aiAuditItem}>
            <CheckCircle2 size={14} color="#059669" />
            <span>RTO Driving License: <strong>Active (LMV-NT / EV)</strong></span>
          </div>
          <div className={styles.aiAuditItem}>
            <CheckCircle2 size={14} color="#059669" />
            <span>Parivahan RC Cross-Check: <strong>{rcNumber} Match</strong></span>
          </div>
          <div className={styles.aiAuditItemScore}>
            <span>Safety Score:</span>
            <span className={styles.scorePill}>98/100 HIGH TRUST</span>
          </div>
        </div>

        {/* Modal Body Grid */}
        <div className={styles.modalBody}>
          {/* Left Column: Pilot Details & Vehicle Specs */}
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
                    <span className={styles.plateBadge}>{rcNumber}</span>
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
            {/* Top Toolbar: Document Selector Tabs & View Mode Switcher */}
            <div className={styles.viewerToolbar}>
              <div className={styles.docTabsRow}>
                <button
                  type="button"
                  onClick={() => setActiveDocTab('aadhaar')}
                  className={`${styles.docTabBtn} ${activeDocTab === 'aadhaar' ? styles.docTabActive : ''}`}
                >
                  <CreditCard size={15} />
                  <div>
                    <span>1. Aadhaar Card</span>
                    <span className={styles.docNumberSub}>{aadhaarNumber}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('license')}
                  className={`${styles.docTabBtn} ${activeDocTab === 'license' ? styles.docTabActive : ''}`}
                >
                  <FileText size={15} />
                  <div>
                    <span>2. Driving License</span>
                    <span className={styles.docNumberSub}>{dlNumber}</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDocTab('rc')}
                  className={`${styles.docTabBtn} ${activeDocTab === 'rc' ? styles.docTabActive : ''}`}
                >
                  <Car size={15} />
                  <div>
                    <span>3. Vehicle RC</span>
                    <span className={styles.docNumberSub}>{rcNumber}</span>
                  </div>
                </button>
              </div>

              {/* View Mode Switcher (Smart Card vs Raw Scan) */}
              <div className={styles.viewModeSwitch}>
                <button
                  type="button"
                  onClick={() => setViewMode('smartcard')}
                  className={`${styles.viewModeBtn} ${viewMode === 'smartcard' ? styles.viewModeBtnActive : ''}`}
                  title="View DigiLocker / Parivahan Verified Smart Certificate"
                >
                  <Award size={13} />
                  <span>DigiLocker Smart Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('scan')}
                  className={`${styles.viewModeBtn} ${viewMode === 'scan' ? styles.viewModeBtnActive : ''}`}
                  title="View Raw Uploaded Photo Scan"
                >
                  <ImageIcon size={13} />
                  <span>Uploaded Scan</span>
                </button>
              </div>
            </div>

            {/* Document Details & Security Checks */}
            <div className={styles.docDetailsBar}>
              <div className={styles.docMetaLeft}>
                <span className={styles.docTitleMain}>{currentDocLabel}</span>
                <div className={styles.securityTags}>
                  <span className={styles.secTagGreen}>
                    <CheckCircle2 size={12} /> 256-Bit DigiLocker Vault
                  </span>
                  <span className={styles.secTagBlue}>
                    <ShieldCheck size={12} /> Government of India Validated
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

            {/* VIEW 1: DIGILOCKER DIGITAL SMART CERTIFICATE CARD */}
            {viewMode === 'smartcard' && (
              <div className={styles.smartCardContainer}>
                {/* 1. AADHAAR SMART CARD */}
                {activeDocTab === 'aadhaar' && (
                  <div className={styles.aadhaarCard}>
                    <div className={styles.aadhaarHeader}>
                      <div className={styles.emblemStrip}>
                        <div className={styles.emblemIcon}>🇮🇳</div>
                        <div>
                          <div className={styles.govIndiaTitle}>भारत सरकार • GOVERNMENT OF INDIA</div>
                          <div className={styles.uidaiTitle}>Unique Identification Authority of India</div>
                        </div>
                      </div>
                      <div className={styles.aadhaarLogoPill}>
                        <span className={styles.aadhaarSun}>☀️</span> आधार
                      </div>
                    </div>

                    <div className={styles.aadhaarBody}>
                      <img
                        src={pilot.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                        alt={pilot.name}
                        className={styles.aadhaarPhoto}
                      />

                      <div className={styles.aadhaarDetails}>
                        <div className={styles.aadhaarField}>
                          <span className={styles.aadhaarLabel}>Name / नाम:</span>
                          <span className={styles.aadhaarVal}>{pilot.name}</span>
                        </div>
                        <div className={styles.aadhaarField}>
                          <span className={styles.aadhaarLabel}>DOB / जन्म तिथि:</span>
                          <span className={styles.aadhaarVal}>14/08/1992</span>
                        </div>
                        <div className={styles.aadhaarField}>
                          <span className={styles.aadhaarLabel}>Gender / लिंग:</span>
                          <span className={styles.aadhaarVal}>MALE / पुरुष</span>
                        </div>
                        <div className={styles.aadhaarField}>
                          <span className={styles.aadhaarLabel}>Digital Signature:</span>
                          <span className={styles.signatureBadge}>✓ Verified by UIDAI Auth Hub</span>
                        </div>
                      </div>

                      <div className={styles.qrCodeBox}>
                        <QrCode size={64} color="#0F172A" />
                        <span className={styles.qrCodeSub}>Scan to Verify</span>
                      </div>
                    </div>

                    <div className={styles.aadhaarFooter}>
                      <span className={styles.aadhaarBigNumber}>{aadhaarNumber}</span>
                      <span className={styles.aadhaarMotto}>मेरा आधार, मेरी पहचान</span>
                    </div>
                  </div>
                )}

                {/* 2. DRIVING LICENSE SMART CARD */}
                {activeDocTab === 'license' && (
                  <div className={styles.licenseCard}>
                    <div className={styles.licenseHeader}>
                      <div className={styles.emblemStrip}>
                        <div className={styles.emblemIcon}>🇮🇳</div>
                        <div>
                          <div className={styles.govIndiaTitle}>UNION OF INDIA • DRIVING LICENCE</div>
                          <div className={styles.uidaiTitle}>Maharashtra Motor Vehicles Dept (RTO MH-12)</div>
                        </div>
                      </div>
                      <div className={styles.chipGold}>
                        <Cpu size={24} color="#B45309" />
                      </div>
                    </div>

                    <div className={styles.licenseBody}>
                      <img
                        src={pilot.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                        alt={pilot.name}
                        className={styles.licensePhoto}
                      />

                      <div className={styles.licenseDetails}>
                        <div className={styles.licenseNumberRow}>
                          <span className={styles.licenseLabel}>Licence No:</span>
                          <span className={styles.licenseNumberVal}>{dlNumber}</span>
                        </div>
                        <div className={styles.licenseGrid2}>
                          <div>
                            <span className={styles.licenseLabel}>Name:</span>
                            <span className={styles.licenseValBold}>{pilot.name}</span>
                          </div>
                          <div>
                            <span className={styles.licenseLabel}>Blood Group:</span>
                            <span className={styles.licenseValBold}>O+ve</span>
                          </div>
                          <div>
                            <span className={styles.licenseLabel}>Vehicle Class:</span>
                            <span className={styles.classBadge}>LMV-NT / MCWG (EV Authorized)</span>
                          </div>
                          <div>
                            <span className={styles.licenseLabel}>Validity (NT):</span>
                            <span className={styles.licenseValBold}>13/08/2038 (Active)</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.licenseSeal}>
                        <Award size={36} color="#0284C7" />
                        <span>RTO SEAL</span>
                      </div>
                    </div>

                    <div className={styles.licenseFooter}>
                      <span>AUTHORISED TO DRIVE COMMERCIAL EXPRESSWAY CARPOOLS NATIONWIDE</span>
                    </div>
                  </div>
                )}

                {/* 3. PARIVAHAN FORM 23 VEHICLE RC SMART CARD */}
                {activeDocTab === 'rc' && (
                  <div className={styles.rcCard}>
                    <div className={styles.rcHeader}>
                      <div className={styles.emblemStrip}>
                        <div className={styles.emblemIcon}>🚗</div>
                        <div>
                          <div className={styles.govIndiaTitle}>PARIVAHAN SEWA • FORM 23 RC SMART CARD</div>
                          <div className={styles.uidaiTitle}>Ministry of Road Transport & Highways, Govt. of India</div>
                        </div>
                      </div>
                      <span className={styles.evChipGreen}>⚡ 100% ZERO EMISSION EV</span>
                    </div>

                    <div className={styles.rcBody}>
                      <div className={styles.rcPlateHeader}>
                        <span className={styles.rcPlateText}>{rcNumber}</span>
                        <span className={styles.fitnessPill}>Fitness Valid: 2039</span>
                      </div>

                      <div className={styles.rcSpecsGrid}>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>Registered Owner:</span>
                          <span className={styles.rcVal}>{pilot.name}</span>
                        </div>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>Maker / Model:</span>
                          <span className={styles.rcVal}>{vehicleName}</span>
                        </div>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>Vehicle Class / Color:</span>
                          <span className={styles.rcVal}>Motor Car (LMV) • {pilot.vehicle?.color || 'Starry Black'}</span>
                        </div>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>Fuel / Emission Norm:</span>
                          <span className={styles.rcVal}>Battery Electric Vehicle (Zero Emission)</span>
                        </div>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>Chassis / Engine Number:</span>
                          <span className={styles.rcValMono}>MA1ZSEV****9821 / EV990088</span>
                        </div>
                        <div className={styles.rcSpecItem}>
                          <span className={styles.rcLabel}>FASTag Insurance Status:</span>
                          <span className={styles.rcValGreen}>✓ Active Highway Comprehensive Cover</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.rcFooter}>
                      <span>CERTIFIED ROADWORTHY FOR INTERCITY NATIONAL HIGHWAY TRANSIT</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: RAW UPLOADED SCAN IMAGE */}
            {viewMode === 'scan' && (
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
            )}

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
              <div className={styles.hotkeysHelper}>
                <span>Hotkeys:</span>
                <kbd>A</kbd> Approve • <kbd>R</kbd> Reject • <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> Tabs • <kbd>V</kbd> Toggle Scan • <kbd>Esc</kbd> Close
              </div>

              <div className={styles.actionsRight}>
                {isVerified ? (
                  <div className={styles.alreadyVerifiedBadge}>
                    <CheckCircle2 size={16} />
                    <span>Pilot Already Verified & Active</span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={submitting}
                      className={styles.approveBtn}
                      title="Press [A] to Approve"
                    >
                      <CheckCircle2 size={16} />
                      <span>{submitting ? 'Verifying...' : 'Approve & Verify Pilot KYC (A)'}</span>
                      {nextPilot && <ArrowRight size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={submitting}
                      className={styles.rejectBtn}
                      title="Press [R] to Reject"
                    >
                      <XCircle size={16} />
                      <span>{showRejectInput ? 'Confirm Rejection' : 'Reject (R)'}</span>
                    </button>
                  </>
                )}
              </div>
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
