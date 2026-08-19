import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Car, 
  User, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Zap,
  Clock,
  HelpCircle,
  Camera,
  Mail,
  KeyRound,
  Phone,
  Award,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import { SpotlightCard, ShinyText } from '../components/ui';
import styles from './AuthPage.module.css';

export default function AuthPage({ onNavigate, initialAccountType = 'passenger' }) {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState(initialAccountType || 'passenger'); // 'passenger' or 'pilot'
  const [pilotStep, setPilotStep] = useState(1); // 1: Personal, 2: Aadhaar, 3: License, 4: Vehicle RC
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Common Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  // Pilot Specific Verification Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('8921');
  const [aadhaarDocUrl, setAadhaarDocUrl] = useState('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600');
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('MH-14-2018-0099412');
  const [drivingLicenseDocUrl, setDrivingLicenseDocUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600');
  const [vehicleRcNumber, setVehicleRcNumber] = useState('MH-12-RN-7788');
  const [vehicleRcDocUrl, setVehicleRcDocUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600');
  const [vehicleMake, setVehicleMake] = useState('Tata');
  const [vehicleModel, setVehicleModel] = useState('Nexon EV Empowered');
  const [vehicleColor, setVehicleColor] = useState('Intensi-Teal');
  const [isElectric, setIsElectric] = useState(true);

  const [previewModalDoc, setPreviewModalDoc] = useState(null);

  // File upload helper for document simulations
  const handleFileUpload = (e, setDocState) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setDocState(uploadEvent.target.result);
        addToast(`${file.name} uploaded successfully`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGoogleAuth = async (googleUser) => {
    setLoading(true);
    try {
      const isPilot = accountType === 'pilot';
      const result = await loginWithGoogle({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
        accountType: isPilot ? 'pilot' : 'passenger',
        phone: googleUser.phone || ''
      });

      if (result.autoLinked) {
        addToast(`Linked Google account and logged in as ${result.user.name}!`, 'success');
      } else if (result.isNewUser) {
        addToast(`Welcome to Driveit, ${result.user.name}! Google account created.`, 'success');
      } else {
        addToast(`Welcome back, ${result.user.name}! Signed in with Google.`, 'success');
      }

      // If new pilot, keep on page to fill out vehicle RC & License
      if (isPilot && result.isNewUser) {
        setName(result.user.name);
        setEmail(result.user.email);
        setPilotStep(2);
        addToast('Please complete mandatory UIDAI Aadhaar verification to unlock pilot routes.', 'info');
        return;
      }

      // Check if user was in the middle of booking a ride
      const pendingRaw = sessionStorage.getItem('driveit_pending_booking');
      if (pendingRaw) {
        try {
          const { rideId } = JSON.parse(pendingRaw);
          if (rideId) {
            addToast('Resuming your trip booking...', 'info');
            if (onNavigate) onNavigate('ride-details', { rideId });
            return;
          }
        } catch (e) {
          sessionStorage.removeItem('driveit_pending_booking');
        }
      }

      if (result.user.roles?.includes('lister')) {
        if (onNavigate) onNavigate('lister-hub');
      } else {
        if (onNavigate) onNavigate('home');
      }
    } catch (err) {
      addToast(err.message || 'Google authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Real Google OAuth Popup Trigger
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const googleUser = await res.json();
        
        if (!googleUser?.email) {
          throw new Error('Could not retrieve email from your Google account.');
        }

        await handleGoogleAuth({
          googleId: googleUser.sub || `google_${googleUser.email.replace(/[@.]/g, '_')}`,
          email: googleUser.email,
          name: googleUser.name || googleUser.given_name || 'Google User',
          avatar: googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          accountType: accountType === 'pilot' ? 'pilot' : 'passenger'
        });
      } catch (err) {
        console.error('Google profile fetch error:', err);
        addToast(err.message || 'Failed to authenticate with Google', 'error');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google login failed or popup closed:', errorResponse);
      addToast('Google Sign-In was cancelled or popup closed.', 'info');
    }
  });

  const performDirectLogin = async (emailToLogin, passToLogin, roleType = 'passenger') => {
    setLoginEmail(emailToLogin);
    setLoginPassword(passToLogin);
    setIsLogin(true);
    if (roleType) setAccountType(roleType);
    setLoading(true);

    try {
      const loggedUser = await login(emailToLogin, passToLogin);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');

      // Check if user was in the middle of booking a ride
      const pendingRaw = sessionStorage.getItem('driveit_pending_booking');
      if (pendingRaw) {
        try {
          const { rideId } = JSON.parse(pendingRaw);
          if (rideId) {
            addToast('Resuming your trip booking...', 'info');
            if (onNavigate) onNavigate('ride-details', { rideId });
            return;
          }
        } catch (e) {
          sessionStorage.removeItem('driveit_pending_booking');
        }
      }

      if (loggedUser.roles?.includes('support') || loggedUser.roles?.includes('admin')) {
        if (onNavigate) onNavigate('support-portal');
      } else if (loggedUser.roles?.includes('lister')) {
        if (onNavigate) onNavigate('lister-hub');
      } else {
        if (onNavigate) onNavigate('home');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPassword);
      addToast(`Welcome back, ${user.name}!`, 'success');

      // Check if user was in the middle of booking a ride
      const pendingRaw = sessionStorage.getItem('driveit_pending_booking');
      if (pendingRaw) {
        try {
          const { rideId } = JSON.parse(pendingRaw);
          if (rideId) {
            addToast('Resuming your trip booking...', 'info');
            if (onNavigate) onNavigate('ride-details', { rideId });
            return;
          }
        } catch (e) {
          sessionStorage.removeItem('driveit_pending_booking');
        }
      }

      if (user.roles?.includes('support') || user.roles?.includes('admin')) {
        if (onNavigate) onNavigate('support-portal');
      } else if (user.roles?.includes('lister')) {
        if (onNavigate) onNavigate('lister-hub');
      } else {
        if (onNavigate) onNavigate('home');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please verify credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (accountType === 'pilot') {
        if (!aadhaarDocUrl || !drivingLicenseDocUrl || !vehicleRcDocUrl) {
          throw new Error('All 3 compliance verification documents (Aadhaar, License, RC) are strictly required.');
        }

        const pilotPayload = {
          name,
          email,
          password,
          phone,
          bio,
          role: 'lister',
          aadhaar: {
            number: aadhaarNumber,
            docUrl: aadhaarDocUrl,
            status: 'PENDING'
          },
          drivingLicense: {
            number: drivingLicenseNumber,
            docUrl: drivingLicenseDocUrl,
            status: 'PENDING'
          },
          vehicle: {
            rcNumber: vehicleRcNumber,
            rcDocUrl: vehicleRcDocUrl,
            make: vehicleMake,
            model: vehicleModel,
            color: vehicleColor,
            electric: isElectric,
            status: 'PENDING'
          }
        };

        const res = await register(pilotPayload);
        addToast('Pilot KYC submitted! Operations Desk is reviewing your documents.', 'success');
        if (onNavigate) onNavigate('lister-hub');
      } else {
        const passengerPayload = {
          name,
          email,
          password,
          phone,
          bio,
          role: 'booker'
        };

        await register(passengerPayload);
        addToast('Passenger account created! Welcome to Driveit.', 'success');

        // Check if user was in the middle of booking a ride
        const pendingRaw = sessionStorage.getItem('driveit_pending_booking');
        if (pendingRaw) {
          try {
            const { rideId } = JSON.parse(pendingRaw);
            if (rideId) {
              addToast('Resuming your trip booking...', 'info');
              if (onNavigate) onNavigate('ride-details', { rideId });
              return;
            }
          } catch (e) {
            sessionStorage.removeItem('driveit_pending_booking');
          }
        }

        if (onNavigate) onNavigate('home');
      }
    } catch (err) {
      addToast(err.message || 'Registration failed. Please check fields.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px 12px 40px',
    borderRadius: '12px',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #CBD5E1',
    background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
    color: isDark ? '#FFFFFF' : '#0F172A',
    fontSize: '13px',
    outline: 'none',
    boxShadow: isDark ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'all 150ms ease'
  };

  const isPilotView = accountType === 'pilot';

  return (
    <div className={styles.authContainer}>
      <div className={isPilotView ? styles.pilotWrapper : styles.authWrapper}>
        
        {/* LEFT COLUMN: EXECUTIVE BRAND SHOWCASE (Desktop only for passenger view) */}
        {!isPilotView && (
          <div className={styles.showcaseCol}>
            <div className={styles.brandPill}>
              <Sparkles size={13} color="#84CC16" />
              <span className={styles.brandPillText}>Fast • Easy • Everyday</span>
            </div>

            <h1 className={styles.showcaseHeading}>
              India's Premier Intercity <span style={{ color: '#84CC16' }}>Expressway</span> Carpool Network
            </h1>

            <p className={styles.showcaseSubheading}>
              Join thousands of verified commuters across Mumbai-Pune, Delhi-Jaipur, Bengaluru-Chennai, and Hyderabad. Experience seamless, executive rides with verified drivers.
            </p>

            <div className={styles.trustList}>
              <div className={styles.trustItem}>
                <div className={styles.trustIconBox} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className={styles.trustTitle}>100% UIDAI & RTO Verified Profiles</div>
                  <div className={styles.trustDesc}>Every pilot undergoes mandatory Aadhaar and government driving license verification.</div>
                </div>
              </div>

              <div className={styles.trustItem}>
                <div className={styles.trustIconBox} style={{ background: 'rgba(132, 204, 22, 0.15)', color: '#84CC16' }}>
                  <Zap size={18} />
                </div>
                <div>
                  <div className={styles.trustTitle}>FASTag Express Corridor Transit</div>
                  <div className={styles.trustDesc}>Save up to 70% on highway fares with automated zero-halt tollway clearance.</div>
                </div>
              </div>

              <div className={styles.trustItem}>
                <div className={styles.trustIconBox} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
                  <Shield size={18} />
                </div>
                <div>
                  <div className={styles.trustTitle}>24/7 Operations Desk & SOS Protection</div>
                  <div className={styles.trustDesc}>Live GPS telemetry radar and instant helpline connection during every highway mile.</div>
                </div>
              </div>
            </div>

            <div className={styles.statBanner}>
              <div>
                <div className={styles.statNumber}>4.92 ★</div>
                <div className={styles.statLabel}>Pilot Rating</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div className={styles.statNumber}>₹350</div>
                <div className={styles.statLabel}>Avg Seat Fare</div>
              </div>
              <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div className={styles.statNumber}>24,000+</div>
                <div className={styles.statLabel}>Completed Trips</div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: AUTHENTICATION COCKPIT CARD */}
        <div className={styles.authCardCol}>
          <SpotlightCard
            spotlightColor={isPilotView ? 'rgba(132, 204, 22, 0.2)' : 'rgba(16, 185, 129, 0.15)'}
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 53, 0.95))'
                : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: isDark
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                : '0 15px 35px -5px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header / Brand Icon */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #84CC16, #65A30D)',
                color: '#0E240B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
                boxShadow: '0 8px 20px rgba(132, 204, 22, 0.35)'
              }}>
                {isPilotView ? <Car size={26} /> : (isLogin ? <LogIn size={26} /> : <UserPlus size={26} />)}
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: '0 0 4px 0' }}>
                {isPilotView 
                  ? 'Expressway Pilot Onboarding' 
                  : (isLogin ? 'Welcome Back to Driveit' : 'Create Passenger Account')}
              </h2>

              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', margin: 0 }}>
                {isPilotView
                  ? 'Mandatory 3-Tier KYC Compliance Gate for Drivers'
                  : (isLogin ? 'Enter your registered credentials to access your trips' : 'Fast, everyday intercity seat sharing across India')}
              </p>
            </div>

            {/* New User Experience: Direct Ride Option without Login */}
            {!isPilotView && (
              <div style={{
                background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
                border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #A7F3D0',
                borderRadius: '14px',
                padding: '10px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#10B981', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Car size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#A7F3D0' : '#065F46' }}>
                      Just want to book a ride?
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                      Browse express routes first, sign in at checkout.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('home')}
                  style={{
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <span>Ride ➔</span>
                </button>
              </div>
            )}

            {/* Mode Switcher: Sign In vs Sign Up (Passenger View Only) */}
            {!isPilotView && (
              <div className={styles.tabSwitcher}>
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`${styles.tabBtn} ${isLogin ? styles.tabBtnActive : styles.tabBtnInactive}`}
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`${styles.tabBtn} ${!isLogin ? styles.tabBtnActive : styles.tabBtnInactive}`}
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* If Pilot: Display Pilot Onboarding Switch Banner */}
            {isPilotView && (
              <div style={{
                background: 'rgba(132, 204, 22, 0.1)',
                border: '1px solid rgba(132, 204, 22, 0.3)',
                borderRadius: '14px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="#84CC16" />
                  <span style={{ fontSize: '12px', color: isDark ? '#BBF7D0' : '#166534', fontWeight: '700' }}>
                    UIDAI, DL & Vehicle RC Audit Required
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setAccountType('passenger')}
                  style={{
                    background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#FFFFFF',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #CBD5E1',
                    color: isDark ? '#FFFFFF' : '#0F172A',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  ← Passenger Sign In
                </button>
              </div>
            )}

            {/* Google Fast Authentication Button */}
            <div style={{ marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => triggerGoogleLogin()}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1',
                  color: isDark ? '#FFFFFF' : '#1E293B',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 150ms ease'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }} />
                <span style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  or continue with password
                </span>
                <div style={{ flex: 1, height: '1px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0' }} />
              </div>
            </div>

            {/* 1. LOGIN FORM */}
            {isLogin && !isPilotView && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@driveit.in"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase' }}>
                      Password
                    </label>
                    <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', cursor: 'pointer' }}>
                      Forgot?
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter account password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                    color: '#0E240B',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '14px 20px',
                    fontSize: '14px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px -4px rgba(132, 204, 22, 0.4)',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(132, 204, 22, 0.5)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(132, 204, 22, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
                  }}
                >
                  <LogIn size={16} />
                  <span>{loading ? 'Authenticating...' : 'Sign In to Driveit'}</span>
                </button>
              </form>
            )}

            {/* 2. REGISTRATION FORM */}
            {(!isLogin || isPilotView) && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Account Basic Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                      Full Legal Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                      Mobile Number
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Create Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Pilot 4-Step KYC Verification Module */}
                {isPilotView && (
                  <div style={{
                    marginTop: '8px',
                    padding: '16px',
                    background: isDark ? 'rgba(0, 0, 0, 0.4)' : '#F8FAFC',
                    border: '1px solid rgba(132, 204, 22, 0.3)',
                    borderRadius: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: '#84CC16', textTransform: 'uppercase' }}>
                        Compliance Document Uploads:
                      </span>
                      <span style={{ fontSize: '11px', color: '#10B981', fontWeight: '800' }}>
                        100% Encrypted
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                      {/* Aadhaar */}
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>1. Aadhaar Card</div>
                        <input
                          type="text"
                          placeholder="Last 4 Digits"
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value)}
                          style={{ ...inputStyle, padding: '6px 10px', fontSize: '11px', marginBottom: '8px' }}
                        />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0284C7', cursor: 'pointer', fontWeight: '700' }}>
                          <Upload size={12} /> Upload Photo
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setAadhaarDocUrl)} />
                        </label>
                      </div>

                      {/* Driving License */}
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>2. Driving License</div>
                        <input
                          type="text"
                          placeholder="DL Number"
                          value={drivingLicenseNumber}
                          onChange={(e) => setDrivingLicenseNumber(e.target.value)}
                          style={{ ...inputStyle, padding: '6px 10px', fontSize: '11px', marginBottom: '8px' }}
                        />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0284C7', cursor: 'pointer', fontWeight: '700' }}>
                          <Upload size={12} /> Upload DL
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setDrivingLicenseDocUrl)} />
                        </label>
                      </div>

                      {/* Vehicle RC */}
                      <div style={{ background: isDark ? '#0F172A' : '#FFFFFF', padding: '12px', borderRadius: '12px', border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0', boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.03)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>3. Vehicle RC & Model</div>
                        <input
                          type="text"
                          placeholder="RC Number"
                          value={vehicleRcNumber}
                          onChange={(e) => setVehicleRcNumber(e.target.value)}
                          style={{ ...inputStyle, padding: '6px 10px', fontSize: '11px', marginBottom: '8px' }}
                        />
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0284C7', cursor: 'pointer', fontWeight: '700' }}>
                          <Upload size={12} /> Upload RC
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setVehicleRcDocUrl)} />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                    color: '#0E240B',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '14px 20px',
                    fontSize: '14px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 8px 24px -4px rgba(132, 204, 22, 0.4)',
                    marginTop: '8px',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(132, 204, 22, 0.5)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(132, 204, 22, 0.4)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)';
                  }}
                >
                  <UserPlus size={16} />
                  <span>{loading ? 'Creating Driveit Account...' : (isPilotView ? 'Register as Verified Highway Pilot ⚡' : 'Create Driveit Account')}</span>
                </button>
              </form>
            )}

            {/* Bottom Referral Link to Become a Pilot */}
            {!isPilotView && (
              <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0' }}>
                <button
                  type="button"
                  onClick={() => setAccountType('pilot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isDark ? '#84CC16' : '#16A34A',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Car size={15} />
                  <span>Car owner heading outstation? Become an Expressway Pilot & Offset Tolls ➔</span>
                </button>
              </div>
            )}
          </SpotlightCard>

          {/* Quick Demo Credentials Bar */}
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
            borderRadius: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              fontSize: '11px',
              fontWeight: '700',
              color: isDark ? '#94A3B8' : '#64748B'
            }}>
              <span>⚡ 1-Click Quick Fill & Sign In:</span>
              <span style={{ fontSize: '10px', color: '#84CC16' }}>Tap any profile</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              <button
                type="button"
                onClick={() => performDirectLogin('ananya@driveit.in', 'password123', 'passenger')}
                style={{
                  background: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#34D399' : '#059669',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🟢 Passenger</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>ananya@driveit.in</span>
              </button>

              <button
                type="button"
                onClick={() => performDirectLogin('rahul@driveit.in', 'password123', 'pilot')}
                style={{
                  background: isDark ? 'rgba(132, 204, 22, 0.1)' : 'rgba(132, 204, 22, 0.08)',
                  border: '1px solid rgba(132, 204, 22, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#A3E635' : '#166534',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>⚡ EV Pilot (Rahul)</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>rahul@driveit.in</span>
              </button>

              <button
                type="button"
                onClick={() => performDirectLogin('priya@driveit.in', 'password123', 'pilot')}
                style={{
                  background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#818CF8' : '#4F46E5',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🚗 Pilot (Priya)</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>priya@driveit.in</span>
              </button>

              <button
                type="button"
                onClick={() => performDirectLogin('vikram@driveit.in', 'password123', 'pilot')}
                style={{
                  background: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#FB923C' : '#C2410C',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🚙 Pilot (Vikram)</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>vikram@driveit.in</span>
              </button>

              <button
                type="button"
                onClick={() => performDirectLogin('aman@driveit.in', 'password123', 'passenger')}
                style={{
                  background: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#C084FC' : '#7E22CE',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🛡️ Safety Desk</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>aman@driveit.in</span>
              </button>

              <button
                type="button"
                onClick={() => performDirectLogin('rohan@driveit.in', 'password123', 'pilot')}
                style={{
                  background: isDark ? 'rgba(56, 189, 248, 0.1)' : 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: isDark ? '#38BDF8' : '#0284C7',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>🔄 Dual Role (Rohan)</span>
                <span style={{ fontSize: '10px', fontWeight: '500', opacity: 0.85 }}>rohan@driveit.in</span>
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
