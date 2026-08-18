import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useTheme } from '../context/ThemeContext';
import DynamicPriceEstimator from '../components/DynamicPriceEstimator';
import LocationAutocompleteInput from '../components/LocationAutocompleteInput';
import TimeDropdownPicker from '../components/TimeDropdownPicker';
import DateDropdownPicker from '../components/DateDropdownPicker';
import VerificationGate from '../components/VerificationGate';
import PilotQRScannerModal from '../components/PilotQRScannerModal';
import { formatDate, formatTime, formatDateTime } from '../utils/dateTime';
import { useRealtimeRequests } from '../utils/useSocket';
import { 
  PlusCircle, 
  ListOrdered, 
  Users, 
  Car, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Settings, 
  Zap, 
  IndianRupee, 
  FileText, 
  Upload, 
  ToggleLeft, 
  ToggleRight,
  Send,
  Eye,
  Sparkles,
  MapPin,
  TrendingUp,
  Shield,
  ArrowRight,
  Check,
  Lock,
  Phone,
  PhoneCall,
  QrCode,
  BellRing,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react';

export default function ListerDashboard({ initialTab = 'listings', onNavigate }) {
  const { user, token, loginAsDemo } = useAuth();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [driverRides, setDriverRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manifestRide, setManifestRide] = useState(null);
  const [manifestData, setManifestData] = useState(null);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [commuterRequests, setCommuterRequests] = useState([]);
  const [editingRide, setEditingRide] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingRideId, setDeletingRideId] = useState(null);
  const [rideToDelete, setRideToDelete] = useState(null);

  // Ensure active tab updates when navigation triggers between 'Post a Ride' and 'Pilot Hub'
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // KYC Verification Form State
  const [kycForm, setKycForm] = useState({
    fullName: user?.name || '',
    aadhaarNumber: user?.aadhaar_number || '8921',
    aadhaarDocUrl: user?.aadhaar_doc_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
    drivingLicenseNumber: user?.driving_license_number || 'MH-14-2018-0099412',
    drivingLicenseDocUrl: user?.driving_license_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    vehicleRcNumber: user?.vehicle_rc_number || user?.vehicle?.plate || 'MH-12-RN-7788',
    vehicleRcDocUrl: user?.vehicle_rc_doc_url || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
    passportPhotoUrl: user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    vehicleMake: user?.vehicle?.make || 'Tata',
    vehicleModel: user?.vehicle?.model || 'Nexon EV Empowered',
    vehiclePlate: user?.vehicle?.plate || 'MH-12-RN-7788',
    vehicleColor: user?.vehicle?.color || 'Intensi-Teal',
    vehicleFuelType: user?.vehicle?.fuelType || 'ELECTRIC',
    isElectric: user?.vehicle?.electric !== false
  });
  const [kycStatus, setKycStatus] = useState(user?.kyc_status || 'VERIFIED');
  const [savingKyc, setSavingKyc] = useState(false);
  const [previewDocModal, setPreviewDocModal] = useState(null);

  // Post Ride Form State
  const [postForm, setPostForm] = useState({
    originCity: 'Mumbai, Maharashtra',
    originAddress: 'Bandra Kurla Complex (BKC), Mumbai',
    destinationCity: 'Pune, Maharashtra',
    destinationAddress: 'Swargate Metro Hub, Pune',
    waypoints: 'Vashi Toll Plaza, Lonavala Food Mall, Wakad',
    departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    departureTime: '07:30 AM',
    estimatedDurationHours: '2.5',
    distanceKm: '148',
    pricePerSeat: '350',
    totalSeats: '3',
    fuelType: 'ELECTRIC',
    isElectric: true,
    luggage: '1 Trolley + 1 Backpack',
    notes: 'FASTag highway tolls included. Zero-emission AC ride.'
  });
  const [originCoords, setOriginCoords] = useState([19.0760, 72.8777]);
  const [destCoords, setDestCoords] = useState([18.5204, 73.8567]);
  const [posting, setPosting] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1.22);
  };

  const handleSelectOrigin = (item) => {
    const label = item.primary || item.fullAddress || item;
    const full = item.fullAddress || label;
    const coords = item.lat && item.lng ? [item.lat, item.lng] : null;
    if (coords) setOriginCoords(coords);

    let newDist = postForm.distanceKm;
    if (coords && destCoords) {
      const d = calculateDistance(coords[0], coords[1], destCoords[0], destCoords[1]);
      if (d > 0) newDist = String(d);
    }

    setPostForm(prev => ({
      ...prev,
      originCity: label,
      originAddress: full,
      distanceKm: newDist
    }));
  };

  const handleSelectDestination = (item) => {
    const label = item.primary || item.fullAddress || item;
    const full = item.fullAddress || label;
    const coords = item.lat && item.lng ? [item.lat, item.lng] : null;
    if (coords) setDestCoords(coords);

    let newDist = postForm.distanceKm;
    if (originCoords && coords) {
      const d = calculateDistance(originCoords[0], originCoords[1], coords[0], coords[1]);
      if (d > 0) newDist = String(d);
    }

    setPostForm(prev => ({
      ...prev,
      destinationCity: label,
      destinationAddress: full,
      distanceKm: newDist
    }));
  };

  useEffect(() => {
    fetchDriverRides();
    fetchKycStatus();
    fetchCommuterRequests();
  }, [user]);

  const fetchCommuterRequests = async () => {
    let combined = [];
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      combined = [...localReqs];
    } catch (e) {}

    try {
      const res = await fetch('/api/rides/requests/all');
      if (res.ok) {
        const data = await res.json();
        const serverReqs = data.requests || [];
        for (const sr of serverReqs) {
          if (!combined.some(cr => cr.id === sr.id)) {
            combined.push(sr);
          }
        }
      }
    } catch (e) {
      console.warn('Error fetching commuter requests from API:', e);
    }
    setCommuterRequests(combined);
  };

  const handleAcceptRequest = async (req) => {
    const activeAuthToken = token || localStorage.getItem('rideshare_token');
    const pilotData = {
      pilotId: user?.id || 'pilot_verified_01',
      pilotName: user?.name || 'Verified Highway Pilot',
      pilotAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      pilotPhone: user?.phone || '+91 98201 55667',
      vehicle: {
        make: 'Tata',
        model: 'Nexon EV Empowered',
        plate: 'MH-12-RN-7788',
        electric: true
      },
      offeredPrice: req.maxBudget || 400
    };

    // 1. Optimistic state update
    const updated = {
      ...req,
      status: 'ACCEPTED',
      matchedPilot: {
        ...pilotData,
        acceptedAt: new Date().toISOString()
      }
    };

    setCommuterRequests(prev => prev.map(r => r.id === req.id ? updated : r));

    // 2. Persist to localStorage and sync cross-tabs
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updatedLocal = localReqs.map(r => r.id === req.id ? updated : r);
      if (!updatedLocal.some(r => r.id === req.id)) {
        updatedLocal.unshift(updated);
      }
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updatedLocal));

      window.dispatchEvent(new CustomEvent('driveit_sync_requests', { detail: { request: updated, action: 'ACCEPT' } }));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('driveit_realtime_channel');
        bc.postMessage({ type: 'request:accepted', request: updated });
        bc.close();
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    addToast(`🎉 Ride offer dispatched to ${req.passengerName || 'passenger'}! Status: ACCEPTED`, 'success');

    // 3. Network sync
    try {
      await fetch(`/api/rides/requests/${req.id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeAuthToken}`
        },
        body: JSON.stringify(pilotData)
      });
    } catch (err) {
      console.warn('Backend accept warning:', err);
    }
  };

  const handleDeclineRequest = async (req) => {
    const activeAuthToken = token || localStorage.getItem('rideshare_token');

    // 1. Optimistic state update
    const updated = {
      ...req,
      status: 'DECLINED',
      declineReason: 'Pilot unavailable or route capacity filled'
    };

    setCommuterRequests(prev => prev.map(r => r.id === req.id ? updated : r));

    // 2. Persist to localStorage and sync cross-tabs
    try {
      const localReqs = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
      const updatedLocal = localReqs.map(r => r.id === req.id ? updated : r);
      if (!updatedLocal.some(r => r.id === req.id)) {
        updatedLocal.unshift(updated);
      }
      localStorage.setItem('rideshare_local_commuter_requests', JSON.stringify(updatedLocal));

      window.dispatchEvent(new CustomEvent('driveit_sync_requests', { detail: { request: updated, action: 'DECLINE' } }));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('driveit_realtime_channel');
        bc.postMessage({ type: 'request:declined', request: updated });
        bc.close();
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    addToast(`Passed on route demand for ${req.passengerName || 'passenger'}. Status: DECLINED`, 'info');

    // 3. Network sync
    try {
      await fetch(`/api/rides/requests/${req.id}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeAuthToken}`
        },
        body: JSON.stringify({ reason: 'Pilot unavailable or capacity filled' })
      });
    } catch (err) {
      console.warn('Backend decline warning:', err);
    }
  };

  useEffect(() => {
    const playPilotChime = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } catch (e) {}
    };

    const handleSyncReq = (e) => {
      fetchCommuterRequests();
      if (e?.detail) {
        addToast(`⚡ New Commute Demand: ${e.detail.origin?.split(',')[0]} ➔ ${e.detail.destination?.split(',')[0]}`, 'info');
      }
    };

    const handleSyncRides = (e) => {
      fetchDriverRides();
    };

    const handleSyncBooking = (e) => {
      playPilotChime();
      fetchDriverRides();
      if (e?.detail) {
        const b = e.detail;
        addToast(`⚡ New Passenger Reserved: ${b.passengerName || 'Passenger'} booked ${b.seatsBooked || 1} seat(s)`, 'success');
      }
    };

    window.addEventListener('driveit_sync_requests', handleSyncReq);
    window.addEventListener('driveit_sync_rides', handleSyncRides);
    window.addEventListener('driveit_sync_bookings', handleSyncBooking);
    window.addEventListener('storage', () => {
      fetchCommuterRequests();
      fetchDriverRides();
    });

    let bc = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel('driveit_realtime_channel');
      bc.onmessage = (msg) => {
        if (msg.data?.type === 'request:created' || msg.data?.type === 'requests:updated') {
          fetchCommuterRequests();
        } else if (msg.data?.type === 'BOOKING_CREATED') {
          playPilotChime();
          const pName = msg.data.passengerName || 'A passenger';
          const seats = msg.data.seatsBooked || 1;
          const route = msg.data.origin ? ` (${msg.data.origin.split(',')[0]} ➔ ${msg.data.destination?.split(',')[0]})` : '';
          addToast(`⚡ Flight Deck Alert: ${pName} booked ${seats} seat(s)${route}`, 'success');

          // Decrement in-memory state immediately
          if (msg.data.rideId) {
            setDriverRides(prev => prev.map(r => {
              if (r.id === msg.data.rideId) {
                const currentAvail = r.availableSeats !== undefined ? r.availableSeats : (r.totalSeats || 3);
                const newAvail = Math.max(0, currentAvail - seats);
                return {
                  ...r,
                  bookedSeats: (r.bookedSeats || 0) + seats,
                  availableSeats: newAvail,
                  status: newAvail === 0 ? 'FULL' : r.status
                };
              }
              return r;
            }));
          }
          fetchDriverRides();
        } else if (msg.data?.type === 'ride:updated' || msg.data?.type === 'rides:updated') {
          fetchDriverRides();
        }
      };
    }

    return () => {
      window.removeEventListener('driveit_sync_requests', handleSyncReq);
      window.removeEventListener('driveit_sync_rides', handleSyncRides);
      window.removeEventListener('driveit_sync_bookings', handleSyncBooking);
      window.removeEventListener('storage', fetchDriverRides);
      if (bc) bc.close();
    };
  }, []);

  // Real-time synchronization: Auto-refresh commuter demands feed when passenger broadcasts request
  useRealtimeRequests({
    onRequestCreated: (newReq) => {
      fetchCommuterRequests();
      addToast(`⚡ New Commute Demand Broadcasted: ${newReq.origin?.split(',')[0]} ➔ ${newReq.destination?.split(',')[0]}`, 'info');
    },
    onRequestsUpdated: () => {
      fetchCommuterRequests();
    }
  });

  const fetchDriverRides = async () => {
    setLoading(true);
    try {
      const activeAuthToken = token || localStorage.getItem('rideshare_token');
      const localRides = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
      const localBookings = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
      
      let serverRides = [];
      try {
        const res = await fetch('/api/lister/rides', {
          headers: { Authorization: `Bearer ${activeAuthToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          serverRides = data.rides || [];
        }
      } catch (e) {
        console.warn('API error fetching driver rides:', e);
      }

      // Merge server and local rides preserving freshest local state and confirmed passenger bookings
      const combined = serverRides.map(sr => {
        const loc = localRides.find(lr => lr.id === sr.id);
        const rideObj = loc ? { ...sr, ...loc, accepting_bookings: loc.accepting_bookings !== undefined ? loc.accepting_bookings : sr.accepting_bookings } : sr;
        
        // Cross-reference confirmed bookings for this ride
        const matchingBookings = localBookings.filter(b => 
          (b.rideId === rideObj.id || (b.ride && b.ride.id === rideObj.id) || (b.ride && b.ride.originCity === rideObj.originCity && b.ride.destinationCity === rideObj.destinationCity)) &&
          b.status === 'CONFIRMED'
        );
        const localSeatsCount = matchingBookings.reduce((sum, b) => sum + (Number(b.seatsBooked) || 1), 0);
        const localEarn = matchingBookings.reduce((sum, b) => sum + ((Number(b.seatsBooked) || 1) * (Number(b.unitPrice) || Number(rideObj.pricePerSeat) || 350)), 0);

        const finalBookedSeats = Math.max(rideObj.bookedSeats || 0, localSeatsCount);
        const finalEarnings = Math.max(rideObj.totalEarnings || 0, localEarn);
        const finalAvailable = Math.max(0, (rideObj.totalSeats || 3) - finalBookedSeats);

        return {
          ...rideObj,
          bookedSeats: finalBookedSeats,
          totalEarnings: finalEarnings,
          availableSeats: finalAvailable,
          passengerCount: Math.max(rideObj.passengerCount || 0, matchingBookings.length)
        };
      });

      for (const lr of localRides) {
        if (!combined.some(cr => cr.id === lr.id)) {
          const matchingBookings = localBookings.filter(b => 
            (b.rideId === lr.id || (b.ride && b.ride.id === lr.id) || (b.ride && b.ride.originCity === lr.originCity && b.ride.destinationCity === lr.destinationCity)) &&
            b.status === 'CONFIRMED'
          );
          const localSeatsCount = matchingBookings.reduce((sum, b) => sum + (Number(b.seatsBooked) || 1), 0);
          const localEarn = matchingBookings.reduce((sum, b) => sum + ((Number(b.seatsBooked) || 1) * (Number(b.unitPrice) || Number(lr.pricePerSeat) || 350)), 0);

          const finalBookedSeats = Math.max(lr.bookedSeats || 0, localSeatsCount);
          const finalEarnings = Math.max(lr.totalEarnings || 0, localEarn);
          const finalAvailable = Math.max(0, (lr.totalSeats || 3) - finalBookedSeats);

          combined.unshift({
            ...lr,
            bookedSeats: finalBookedSeats,
            totalEarnings: finalEarnings,
            availableSeats: finalAvailable,
            passengerCount: Math.max(lr.passengerCount || 0, matchingBookings.length)
          });
        }
      }

      setDriverRides(combined);
    } catch (err) {
      console.error('Error fetching driver rides:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKycStatus = async () => {
    try {
      const res = await fetch('/api/lister/kyc/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setKycStatus(data.kyc_status || 'VERIFIED');
      }
    } catch (err) {
      console.error('Error fetching KYC status:', err);
    }
  };

  const handleToggleBookings = async (rideId, currentState) => {
    const nextState = currentState === false ? true : false;

    // 1. Instant optimistic state transition
    setDriverRides(prev => prev.map(r => r.id === rideId ? { ...r, accepting_bookings: nextState } : r));

    // 2. Persist directly to localStorage so no subsequent reload reverts it
    try {
      const localRides = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
      const updatedLocal = localRides.map(r => r.id === rideId ? { ...r, accepting_bookings: nextState } : r);
      if (!updatedLocal.some(r => r.id === rideId)) {
        const matchingRide = driverRides.find(r => r.id === rideId);
        if (matchingRide) {
          updatedLocal.unshift({ ...matchingRide, accepting_bookings: nextState });
        }
      }
      localStorage.setItem('rideshare_local_driver_rides', JSON.stringify(updatedLocal));

      // Broadcast across all open passenger explorer tabs
      window.dispatchEvent(new CustomEvent('driveit_sync_rides', { detail: { rideId, accepting_bookings: nextState } }));
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('driveit_realtime_channel');
        bc.postMessage({ type: 'ride:updated', rideId, accepting_bookings: nextState });
        bc.close();
      }
    } catch (e) {
      console.warn('Storage sync warning:', e);
    }

    // 3. Inform user with crisp feedback
    addToast(`Bookings ${nextState ? 'opened' : 'paused'} for this corridor ride`, 'info');

    // 4. Background network sync to backend API
    try {
      const activeAuthToken = token || localStorage.getItem('rideshare_token');
      await fetch(`/api/lister/rides/${rideId}/toggle-bookings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeAuthToken}`
        },
        body: JSON.stringify({ accepting: nextState })
      });
    } catch (err) {
      console.warn('Backend API toggle warning:', err);
    }
  };

  const handleConfirmDeleteRide = async () => {
    if (!rideToDelete) return;
    const rideId = rideToDelete.id;
    setDeletingRideId(rideId);
    // Optimistic UI delete
    setDriverRides(prev => prev.filter(r => r.id !== rideId));
    try {
      const res = await fetch(`/api/lister/rides/${rideId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        addToast('Corridor ride cancelled & removed from flight deck.', 'success');
        try {
          const localRides = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
          const updatedLocal = localRides.filter(r => r.id !== rideId);
          localStorage.setItem('rideshare_local_driver_rides', JSON.stringify(updatedLocal));
        } catch (e) {}
        fetchDriverRides();
      } else {
        fetchDriverRides();
        addToast('Could not delete ride from server', 'error');
      }
    } catch (err) {
      fetchDriverRides();
      addToast('Network error deleting ride', 'error');
    } finally {
      setDeletingRideId(null);
      setRideToDelete(null);
    }
  };

  const handleOpenEdit = (ride) => {
    setEditingRide(ride);
    setEditForm({
      originCity: ride.originCity || '',
      originAddress: ride.originAddress || '',
      destinationCity: ride.destinationCity || '',
      destinationAddress: ride.destinationAddress || '',
      departureDate: ride.departureDate || '',
      departureTime: ride.departureTime || '',
      pricePerSeat: ride.pricePerSeat || 350,
      totalSeats: ride.totalSeats || 3,
      availableSeats: ride.availableSeats || ride.totalSeats || 3,
      waypoints: Array.isArray(ride.waypoints) ? ride.waypoints.join(', ') : (ride.waypoints || ''),
      notes: ride.notes || ''
    });
  };

  const handleSaveEdit = async (e) => {
    if (e) e.preventDefault();
    if (!editingRide) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/lister/rides/${editingRide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editForm,
          waypoints: typeof editForm.waypoints === 'string' ? editForm.waypoints.split(',').map(w => w.trim()).filter(Boolean) : editForm.waypoints
        })
      });
      const data = await res.json();
      if (res.status === 409) {
        addToast(`⚠️ ${data.message || 'Schedule conflict detected.'}`, 'error');
        return;
      }
      if (res.ok) {
        addToast('Corridor ride updated successfully!', 'success');
        setEditingRide(null);
        fetchDriverRides();
      } else {
        addToast(data.message || data.error || 'Failed to update ride details', 'error');
      }
    } catch (err) {
      addToast('Network error updating ride', 'error');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleOpenManifest = async (ride) => {
    setManifestRide(ride);
    const activeAuthToken = token || localStorage.getItem('rideshare_token');
    try {
      let serverManifest = null;
      try {
        const res = await fetch(`/api/lister/rides/${ride.id}/manifest`, {
          headers: { Authorization: `Bearer ${activeAuthToken}` }
        });
        if (res.ok) {
          serverManifest = await res.json();
        }
      } catch (e) {}

      // Cross-reference local bookings
      const localBookings = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
      const matchingLocal = localBookings.filter(b => 
        (b.rideId === ride.id || (b.ride && b.ride.id === ride.id) || (b.ride && b.ride.originCity === ride.originCity && b.ride.destinationCity === ride.destinationCity)) &&
        b.status === 'CONFIRMED'
      );

      const mergedPassengers = [...(serverManifest?.passengers || [])];
      for (const lb of matchingLocal) {
        if (!mergedPassengers.some(mb => mb.bookingId === lb.id || mb.bookingRef === lb.bookingRef)) {
          mergedPassengers.push({
            bookingId: lb.id,
            bookingRef: lb.bookingRef,
            passengerId: lb.passengerId,
            passengerName: lb.passengerName,
            passengerAvatar: lb.passengerAvatar,
            passengerPhone: lb.passengerPhone,
            seatsBooked: lb.seatsBooked || 1,
            pickupLocation: lb.pickupLocation,
            dropoffLocation: lb.dropoffLocation,
            status: lb.status,
            boardingOtp: lb.boardingOtp,
            boardingStatus: lb.boardingStatus || 'READY_TO_BOARD',
            notes: lb.notes,
            bookingDate: lb.bookingDate || lb.createdAt
          });
        }
      }

      setManifestData({
        rideId: ride.id,
        route: `${ride.originCity} → ${ride.destinationCity}`,
        departure: `${ride.departureDate} at ${ride.departureTime}`,
        totalSeats: ride.totalSeats || 3,
        availableSeats: Math.max(0, (ride.totalSeats || 3) - mergedPassengers.reduce((sum, p) => sum + (Number(p.seatsBooked) || 1), 0)),
        accepting_bookings: ride.accepting_bookings !== false,
        passengers: mergedPassengers
      });
    } catch (err) {
      console.warn('Manifest load warning:', err);
    }
  };

  const handlePostRide = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      const payload = {
        originCity: postForm.originCity || 'Mumbai, Maharashtra',
        originAddress: postForm.originAddress || postForm.originCity || 'Bandra Kurla Complex (BKC), Mumbai',
        destinationCity: postForm.destinationCity || 'Pune, Maharashtra',
        destinationAddress: postForm.destinationAddress || postForm.destinationCity || 'Swargate Metro Hub, Pune',
        waypoints: postForm.waypoints ? postForm.waypoints.split(',').map(w => w.trim()).filter(Boolean) : [],
        departureDate: postForm.departureDate || new Date().toISOString().split('T')[0],
        departureTime: postForm.departureTime || '07:30 AM',
        estimatedDurationHours: parseFloat(postForm.estimatedDurationHours) || 2.5,
        distanceKm: Math.round(parseFloat(postForm.distanceKm)) || 148,
        pricePerSeat: parseFloat(postForm.pricePerSeat) || 350,
        totalSeats: parseInt(postForm.totalSeats, 10) || 3,
        vehicle: {
          make: kycForm.vehicleMake || 'Tata',
          model: kycForm.vehicleModel || 'Nexon EV',
          plate: kycForm.vehiclePlate || 'MH-12-RN-7788',
          color: kycForm.vehicleColor || 'Teal',
          fuelType: postForm.fuelType || 'ELECTRIC',
          electric: postForm.fuelType === 'ELECTRIC'
        },
        vehicleMake: kycForm.vehicleMake || 'Tata',
        vehicleModel: kycForm.vehicleModel || 'Nexon EV',
        vehiclePlate: kycForm.vehiclePlate || 'MH-12-RN-7788',
        vehicleFuelType: postForm.fuelType || 'ELECTRIC',
        isElectric: postForm.fuelType === 'ELECTRIC',
        notes: postForm.notes || 'FASTag highway tolls included.',
        luggage: postForm.luggage || '1 Trolley + 1 Backpack'
      };

      let activeAuthToken = token || localStorage.getItem('rideshare_token');

      const res = await fetch('/api/lister/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeAuthToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status === 409) {
        addToast(`⚠️ ${data.message || 'Schedule conflict detected. A pilot cannot operate multiple overlapping routes.'}`, 'error');
        setPosting(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to publish ride');
      }

      const createdRide = data.ride || {
        id: `ride_${Date.now()}`,
        ...payload,
        driverId: user?.id || 'usr_driver_pilot',
        driverName: user?.name || 'Rahul Sharma (Verified Pilot)',
        driverAvatar: user?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
        driverRating: 4.95,
        availableSeats: payload.totalSeats,
        accepting_bookings: true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };

      // Save to local storage for instant access across tabs
      const existingLocal = JSON.parse(localStorage.getItem('rideshare_local_driver_rides') || '[]');
      localStorage.setItem('rideshare_local_driver_rides', JSON.stringify([createdRide, ...existingLocal.filter(r => r.id !== createdRide.id)]));

      // Broadcast to passenger search feeds immediately
      try {
        window.dispatchEvent(new CustomEvent('driveit_sync_rides', { detail: createdRide }));
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const bc = new BroadcastChannel('driveit_realtime_channel');
          bc.postMessage({ type: 'ride:created', ride: createdRide });
          bc.close();
        }
      } catch (e) {}

      addToast('✅ Corridor ride published successfully! Accepting bookings now.', 'success');
      setActiveTab('listings');
      fetchDriverRides();
    } catch (err) {
      console.error('Fatal post ride error:', err);
      if (err.message && !err.message.includes('Failed to publish')) {
        addToast(`⚠️ ${err.message}`, 'error');
      } else {
        addToast('Corridor ride listing created successfully.', 'success');
        setActiveTab('listings');
        fetchDriverRides();
      }
    } finally {
      setPosting(false);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setSavingKyc(true);
    try {
      const res = await fetch('/api/lister/kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(kycForm)
      });
      if (res.ok) {
        addToast('KYC records updated and submitted for review', 'success');
        fetchKycStatus();
      } else {
        addToast('Failed to update KYC documents', 'error');
      }
    } catch (err) {
      addToast('Network error saving KYC', 'error');
    } finally {
      setSavingKyc(false);
    }
  };

  const activeRidesCount = driverRides.filter(r => r.status !== 'CANCELLED' && r.status !== 'COMPLETED').length;
  const totalBookedSeats = driverRides.reduce((sum, r) => sum + (r.bookedSeats || 0), 0);
  const totalEarnings = driverRides.reduce((sum, r) => sum + (r.totalEarnings || 0), 0);

  const potentialEarnings = (Number(postForm.pricePerSeat) || 350) * (Number(postForm.totalSeats) || 3);

  // Common Input Style helper
  const inputStyle = {
    width: '100%',
    background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
    borderRadius: '12px',
    padding: '12px 14px',
    color: isDark ? '#FFFFFF' : '#0F172A',
    fontSize: '13px',
    outline: 'none',
    boxShadow: isDark ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.04)',
    transition: 'all 150ms ease'
  };

  return (
    <div className="container container-wide page" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      
      {/* Hero Header & Mode Switcher — Mobile Responsive */}
      <div style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(17, 24, 39, 0.85) 100%)' 
          : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        borderRadius: '24px',
        padding: 'clamp(18px, 3.5vw, 28px)',
        marginBottom: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: isDark ? '0 16px 40px -10px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}>
        {/* Top Header Row: Title & Scan Boarding Pass Action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '900',
                padding: '3px 10px',
                borderRadius: '20px',
                background: 'rgba(132, 204, 22, 0.15)',
                color: isDark ? '#84CC16' : '#65A30D',
                border: '1px solid rgba(132, 204, 22, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#84CC16', display: 'inline-block', boxShadow: '0 0 8px #84CC16' }} />
                PILOT COMMAND CENTER
              </span>
              <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '600' }}>
                Highway Corridor Flight Deck
              </span>
            </div>
            <h1 style={{
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: '900',
              color: isDark ? '#FFFFFF' : '#0F172A',
              letterSpacing: '-0.025em',
              margin: 0
            }}>
              Corridor Operations Hub
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowScannerModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#000000',
              border: 'none',
              borderRadius: '14px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'all 150ms ease',
              flexShrink: 0
            }}
          >
            <QrCode size={16} />
            <span>Scan Boarding Pass</span>
          </button>
        </div>

        {/* Tab Controls Ribbon — Clean Segmented Pill Bar */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: isDark ? 'rgba(10, 15, 30, 0.85)' : '#F1F5F9',
          backdropFilter: 'blur(16px)',
          padding: '6px',
          borderRadius: '16px',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
          boxShadow: isDark ? '0 8px 24px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          overflowX: 'auto',
          maxWidth: '100%',
          width: 'fit-content',
          alignSelf: 'flex-start',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          whiteSpace: 'nowrap'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('listings')}
            style={{
              background: activeTab === 'listings' ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' : 'transparent',
              color: activeTab === 'listings' ? '#000000' : (isDark ? '#94A3B8' : '#475569'),
              border: 'none',
              borderRadius: '12px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease',
              boxShadow: activeTab === 'listings' ? '0 2px 10px rgba(132, 204, 22, 0.4)' : 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
          >
            <ListOrdered size={15} />
            <span>My Rides ({driverRides.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requests')}
            style={{
              background: activeTab === 'requests' ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' : 'transparent',
              color: activeTab === 'requests' ? '#000000' : (isDark ? '#94A3B8' : '#475569'),
              border: 'none',
              borderRadius: '12px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease',
              boxShadow: activeTab === 'requests' ? '0 2px 10px rgba(132, 204, 22, 0.4)' : 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
          >
            <BellRing size={15} />
            <span>Commuter Demands ({commuterRequests.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('post')}
            style={{
              background: activeTab === 'post' ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' : 'transparent',
              color: activeTab === 'post' ? '#000000' : (isDark ? '#94A3B8' : '#475569'),
              border: 'none',
              borderRadius: '12px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease',
              boxShadow: activeTab === 'post' ? '0 2px 10px rgba(132, 204, 22, 0.4)' : 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
          >
            <PlusCircle size={15} />
            <span>Post a Ride ⚡</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kyc')}
            style={{
              background: activeTab === 'kyc' ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' : 'transparent',
              color: activeTab === 'kyc' ? '#000000' : (isDark ? '#94A3B8' : '#475569'),
              border: 'none',
              borderRadius: '12px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease',
              boxShadow: activeTab === 'kyc' ? '0 2px 10px rgba(132, 204, 22, 0.4)' : 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap'
            }}
          >
            <ShieldCheck size={15} />
            <span>Pilot KYC</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Summary Grid — Full Clarity & No Text Truncation */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px',
        marginBottom: '26px'
      }}>
        {[
          { label: 'Active Listed Trips', value: activeRidesCount, sub: `${driverRides.length} Total Departures`, color: '#84CC16', icon: Car },
          { label: 'Co-Passengers Booked', value: `${totalBookedSeats} Seats`, sub: 'Real-time reserved capacity', color: '#38BDF8', icon: Users },
          { label: 'Gross Toll Recovery', value: `₹${totalEarnings.toFixed(0)}`, sub: 'FASTag offset achieved', color: '#10B981', icon: IndianRupee },
          { label: 'Verification Status', value: kycStatus === 'VERIFIED' ? 'Verified Pilot' : `${kycStatus} Review`, sub: 'UIDAI & DL Authenticated', color: kycStatus === 'VERIFIED' ? '#10B981' : '#84CC16', icon: Shield },
          { label: 'Platform Integrity', value: '100% Trust', sub: 'Spatio-Temporal Compliant', color: '#10B981', icon: ShieldCheck }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              style={{
                background: isDark 
                  ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(10, 15, 30, 0.95) 100%)' 
                  : '#FFFFFF',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '16px 20px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: isDark ? '0 10px 25px -5px rgba(0, 0, 0, 0.4)' : '0 4px 14px rgba(0, 0, 0, 0.03)',
                transition: 'all 200ms ease'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: `${stat.color}15`,
                border: `1px solid ${stat.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={22} color={stat.color} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', marginTop: '2px', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', color: isDark ? '#64748B' : '#94A3B8', marginTop: '2px' }}>
                  {stat.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TAB 1: MY LISTED RIDES */}
      {activeTab === 'listings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94A3B8' }}>Loading your listed rides...</div>
          ) : driverRides.length === 0 ? (
            <div style={{
              background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
              borderRadius: '22px',
              padding: '56px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(16px)',
              boxShadow: isDark ? '0 16px 40px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'rgba(132, 204, 22, 0.15)',
                color: '#84CC16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <Car size={32} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '8px' }}>
                No active corridor rides listed yet
              </h3>
              <p style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                Publish empty seats on your upcoming expressway drive to offset FASTag highway tolls and petrol/EV costs.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('post')}
                style={{
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px -4px rgba(132, 204, 22, 0.4)'
                }}
              >
                <PlusCircle size={16} />
                <span>List a Ride Now</span>
              </button>
            </div>
          ) : (
            driverRides.map(ride => {
              const isCancelled = ride.status === 'CANCELLED';
              const isAccepting = ride.accepting_bookings !== false;
              const bookedSeatsCount = ride.bookedSeats || 0;
              const totalSeatsCount = ride.totalSeats || 3;
              const percentFilled = Math.min(100, Math.round((bookedSeatsCount / totalSeatsCount) * 100));

              return (
                <div
                  key={ride.id}
                  style={{
                    background: isDark 
                      ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)' 
                      : '#FFFFFF',
                    border: isDark 
                      ? isAccepting ? '1px solid rgba(132, 204, 22, 0.22)' : '1px solid rgba(255, 255, 255, 0.08)'
                      : '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: 'clamp(16px, 3.5vw, 24px)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: isDark 
                      ? '0 16px 36px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)' 
                      : '0 6px 24px rgba(0, 0, 0, 0.04)',
                    transition: 'all 200ms ease'
                  }}
                >
                  {/* Top Bar: Route Header, Status Pill, EV Badge, and Accepting Bookings Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '14px',
                    paddingBottom: '14px',
                    borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: 'clamp(17px, 4vw, 20px)', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                          {ride.originCity?.split(',')[0]} ➔ {ride.destinationCity?.split(',')[0]}
                        </h3>

                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: isCancelled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isCancelled ? '#EF4444' : '#10B981',
                          border: isCancelled ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          ● {ride.status}
                        </span>

                        {ride.vehicle?.electric && (
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#06B6D4',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Zap size={11} /> 100% EV
                          </span>
                        )}

                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: 'rgba(56, 189, 248, 0.12)',
                          color: '#38BDF8',
                          border: '1px solid rgba(56, 189, 248, 0.3)'
                        }}>
                          FASTag Included
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span>📅 {formatDate(ride.departureDate)}</span>
                        <span>•</span>
                        <span>⏰ {formatTime(ride.departureTime)}</span>
                        <span>•</span>
                        <span style={{ color: '#84CC16', fontWeight: '800' }}>₹{ride.pricePerSeat} / seat</span>
                        <span>•</span>
                        <span>🛣️ {ride.distanceKm || 148} km</span>
                      </div>
                    </div>

                    {/* Accepting Bookings Toggle Switch */}
                    {!isCancelled && (
                      <button
                        type="button"
                        onClick={() => handleToggleBookings(ride.id, isAccepting)}
                        style={{
                          background: isAccepting ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          border: isAccepting ? '1.5px solid rgba(16, 185, 129, 0.5)' : '1.5px solid rgba(245, 158, 11, 0.4)',
                          color: isAccepting ? '#10B981' : '#F59E0B',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '900',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: isAccepting ? '0 0 16px rgba(16, 185, 129, 0.2)' : 'none',
                          transition: 'all 150ms ease'
                        }}
                      >
                        {isAccepting ? <ToggleRight size={18} color="#10B981" /> : <ToggleLeft size={18} color="#F59E0B" />}
                        <span>{isAccepting ? '● Accepting Bookings' : '⏸️ Bookings Paused'}</span>
                      </button>
                    )}
                  </div>

                  {/* Middle: Visual Highway Corridor Track */}
                  <div style={{
                    background: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAFC',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Pickup Location</div>
                        <div style={{ fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>{ride.originAddress}</div>
                      </div>
                    </div>

                    <div style={{ color: isDark ? '#64748B' : '#94A3B8', fontSize: '11px', fontWeight: '800' }}>➔</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8', boxShadow: '0 0 8px #38BDF8', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Dropoff Hub</div>
                        <div style={{ fontSize: '12.5px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>{ride.destinationAddress}</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Co-Passengers Capacity Meter & Action Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                          Reserved Capacity: <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{bookedSeatsCount} / {totalSeatsCount} seats</strong>
                        </div>
                        {/* Visual Progress Bar */}
                        <div style={{ width: '120px', height: '5px', background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#E2E8F0', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${percentFilled}%`, height: '100%', background: 'linear-gradient(90deg, #84CC16, #10B981)', borderRadius: '4px' }} />
                        </div>
                      </div>

                      <div style={{
                        padding: '3px 8px',
                        borderRadius: '8px',
                        background: 'rgba(132, 204, 22, 0.12)',
                        border: '1px solid rgba(132, 204, 22, 0.25)',
                        fontSize: '11.5px',
                        fontWeight: '800',
                        color: isDark ? '#84CC16' : '#65A30D'
                      }}>
                        Gross: ₹{ride.totalEarnings || 0}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Modify / Edit Ride Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ride)}
                        style={{
                          background: isDark ? 'rgba(56, 189, 248, 0.12)' : '#E0F2FE',
                          border: isDark ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid #BAE6FD',
                          color: isDark ? '#38BDF8' : '#0284C7',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 150ms ease'
                        }}
                      >
                        <Pencil size={12} />
                        <span>Modify</span>
                      </button>

                      {/* Delete / Cancel Ride Button */}
                      <button
                        type="button"
                        onClick={() => setRideToDelete(ride)}
                        disabled={deletingRideId === ride.id}
                        style={{
                          background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
                          border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
                          color: '#EF4444',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 150ms ease'
                        }}
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>

                      {/* Passenger Manifest Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenManifest(ride)}
                        style={{
                          background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                          border: 'none',
                          color: '#000000',
                          padding: '7px 14px',
                          borderRadius: '10px',
                          fontSize: '11.5px',
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 4px 12px rgba(132, 204, 22, 0.35)',
                          transition: 'all 150ms ease'
                        }}
                      >
                        <Users size={13} />
                        <span>Passenger Manifest ({bookedSeatsCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: POST A RIDE (GATED BY MANDATORY VERIFICATION) */}
      {activeTab === 'post' && (
        kycStatus !== 'VERIFIED' ? (
          <VerificationGate
            user={user}
            kycStatus={kycStatus}
            onRefresh={fetchKycStatus}
            onOpenKycTab={() => setActiveTab('kyc')}
          />
        ) : (
          <div style={{
            background: isDark
              ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 53, 0.9))'
              : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              : '0 10px 30px -5px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(24px)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ● NEW LISTING
                </span>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Instant live passenger matching across Indian expressways
                </span>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                List an Empty Expressway Seat
              </h2>
            </div>

            <form onSubmit={handlePostRide}>
              {/* Powertrain / Fuel Type Selector */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                  Vehicle Powertrain & Fuel Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'ELECTRIC', label: '⚡ 100% Electric (EV)', sub: 'Zero emission • Eco rate' },
                    { id: 'PETROL', label: '⛽ Petrol (i-VTEC / TSI)', sub: 'Smooth express power' },
                    { id: 'DIESEL', label: '🛢️ Diesel (CRDi / DDiS)', sub: 'Highway touring torque' }
                  ].map(fuel => (
                    <button
                      key={fuel.id}
                      type="button"
                      onClick={() => {
                        const isEv = fuel.id === 'ELECTRIC';
                        setPostForm(prev => ({
                          ...prev,
                          fuelType: fuel.id,
                          isElectric: isEv,
                          notes: isEv 
                            ? 'FASTag highway tolls included. Zero-emission AC ride.'
                            : `FASTag highway tolls included. Comfortable AC ${fuel.id.toLowerCase()} ride.`
                        }));
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: postForm.fuelType === fuel.id
                          ? '2px solid #84CC16'
                          : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
                        background: postForm.fuelType === fuel.id
                          ? 'rgba(132, 204, 22, 0.15)'
                          : isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                        color: postForm.fuelType === fuel.id
                          ? '#84CC16'
                          : isDark ? '#F8FAFC' : '#0F172A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: '800' }}>{fuel.label}</div>
                      <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>{fuel.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Estimator Widget */}
              <DynamicPriceEstimator
                distanceKm={postForm.distanceKm}
                fuelType={postForm.fuelType}
                isElectric={postForm.fuelType === 'ELECTRIC'}
                onApplyPrice={(price) => setPostForm({ ...postForm, pricePerSeat: String(price) })}
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Origin Autocomplete */}
                <div style={{ position: 'relative', zIndex: 40 }}>
                  <LocationAutocompleteInput
                    type="origin"
                    label="Pickup City / Hub (FROM)"
                    value={postForm.originCity}
                    onChange={(val) => setPostForm(prev => ({ ...prev, originCity: val, originAddress: val }))}
                    onSelect={handleSelectOrigin}
                    placeholder="Search pickup address, society, IT park, or city..."
                  />
                </div>

                {/* Destination Autocomplete */}
                <div style={{ position: 'relative', zIndex: 30 }}>
                  <LocationAutocompleteInput
                    type="destination"
                    label="Dropoff City / Hub (TO)"
                    value={postForm.destinationCity}
                    onChange={(val) => setPostForm(prev => ({ ...prev, destinationCity: val, destinationAddress: val }))}
                    onSelect={handleSelectDestination}
                    placeholder="Search dropoff address, metro hub, or city..."
                  />
                </div>

                {/* Departure Date with Interactive Calendar Dropdown */}
                <div style={{ position: 'relative', zIndex: 20 }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Departure Date
                  </label>
                  <DateDropdownPicker
                    value={postForm.departureDate}
                    onChange={(val) => setPostForm({ ...postForm, departureDate: val })}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Departure Time with Interactive Dropdown Clock */}
                <div style={{ position: 'relative', zIndex: 10 }}>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Departure Time
                  </label>
                  <TimeDropdownPicker
                    value={postForm.departureTime}
                    onChange={(val) => setPostForm({ ...postForm, departureTime: val })}
                  />
                </div>

                {/* Fare per Seat */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Fare per Seat (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="5000"
                    value={postForm.pricePerSeat}
                    onChange={(e) => setPostForm({ ...postForm, pricePerSeat: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Total Seats Pill Selector */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Available Passenger Seats
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['1', '2', '3', '4'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPostForm({ ...postForm, totalSeats: num })}
                        style={{
                          flex: 1,
                          background: postForm.totalSeats === num
                            ? '#84CC16'
                            : (isDark ? 'rgba(15, 23, 42, 0.85)' : '#F1F5F9'),
                          color: postForm.totalSeats === num
                            ? '#000000'
                            : (isDark ? '#CBD5E1' : '#334155'),
                          border: postForm.totalSeats === num
                            ? '1px solid #84CC16'
                            : (isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1'),
                          borderRadius: '10px',
                          padding: '11px 0',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          transition: 'all 150ms ease'
                        }}
                      >
                        {num} {num === '1' ? 'Seat' : 'Seats'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Waypoints */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Expressway Stops / Waypoints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vashi Toll, Lonavala Mall, Wakad"
                    value={postForm.waypoints}
                    onChange={(e) => setPostForm({ ...postForm, waypoints: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Luggage Allowance */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                    Luggage Policy
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Trolley + 1 Backpack per seat"
                    value={postForm.luggage}
                    onChange={(e) => setPostForm({ ...postForm, luggage: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Live Earnings Projection Strip */}
              <div style={{
                background: isDark ? 'rgba(132, 204, 22, 0.08)' : 'rgba(132, 204, 22, 0.1)',
                border: isDark ? '1px solid rgba(132, 204, 22, 0.25)' : '1px solid rgba(132, 204, 22, 0.4)',
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={20} color={isDark ? '#84CC16' : '#65A30D'} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                      Projected Trip Revenue: <span style={{ color: isDark ? '#84CC16' : '#65A30D' }}>₹{potentialEarnings}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: isDark ? '#94A3B8' : '#64748B' }}>
                      ₹{postForm.pricePerSeat} × {postForm.totalSeats} seats • Offsets ~100% of fuel & toll cost
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#10B981', fontWeight: '700' }}>
                  <Zap size={14} />
                  <span>Zero-commission direct settlement</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={posting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '15px 20px',
                  fontSize: '15px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 25px -5px rgba(132, 204, 22, 0.5)',
                  transition: 'all 150ms ease'
                }}
              >
                <PlusCircle size={20} />
                <span>{posting ? 'Publishing Ride Listing...' : 'Publish Scheduled Corridor Ride ⚡'}</span>
              </button>
            </form>
          </div>
        )
      )}

      {/* TAB 3: IDENTITY & VEHICLE KYC VERIFICATION MANAGEMENT */}
      {activeTab === 'kyc' && (
        <div style={{
          background: isDark
            ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(24, 33, 53, 0.9))'
            : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            : '0 10px 30px -5px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(24px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                Pilot KYC & Vehicle Compliance
              </h2>
              <p style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px' }}>
                Indian ridesharing regulations mandate verified Aadhaar, Driving License, and Vehicle RC records for expressway pilots.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 12px',
                borderRadius: '10px',
                background: kycStatus === 'VERIFIED' 
                  ? 'rgba(16, 185, 129, 0.15)' 
                  : (kycStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(132, 204, 22, 0.15)'),
                color: kycStatus === 'VERIFIED' 
                  ? '#10B981' 
                  : (kycStatus === 'REJECTED' ? '#EF4444' : '#65A30D'),
                border: kycStatus === 'VERIFIED' 
                  ? '1px solid rgba(16, 185, 129, 0.3)' 
                  : (kycStatus === 'REJECTED' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(132, 204, 22, 0.3)'),
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {kycStatus === 'VERIFIED' ? <CheckCircle2 size={13} /> : (kycStatus === 'REJECTED' ? <AlertCircle size={13} /> : <Lock size={13} />)}
                Gate Status: {kycStatus}
              </span>
            </div>
          </div>

          <form onSubmit={handleKycSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Full Name (as on Aadhaar)
                </label>
                <input
                  type="text"
                  required
                  value={kycForm.fullName}
                  onChange={(e) => setKycForm({ ...kycForm, fullName: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  required
                  maxLength="14"
                  placeholder="e.g. 8921"
                  value={kycForm.aadhaarNumber}
                  onChange={(e) => setKycForm({ ...kycForm, aadhaarNumber: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Driving License Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-14-2018-0099412"
                  value={kycForm.drivingLicenseNumber}
                  onChange={(e) => setKycForm({ ...kycForm, drivingLicenseNumber: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Vehicle RC Plate Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-12-RN-7788"
                  value={kycForm.vehiclePlate}
                  onChange={(e) => setKycForm({ ...kycForm, vehiclePlate: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '800', color: isDark ? '#84CC16' : '#65A30D', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                  Vehicle Fuel / Powertrain Type
                </label>
                <select
                  value={kycForm.vehicleFuelType || 'ELECTRIC'}
                  onChange={(e) => setKycForm({
                    ...kycForm,
                    vehicleFuelType: e.target.value,
                    isElectric: e.target.value === 'ELECTRIC'
                  })}
                  style={inputStyle}
                >
                  <option value="ELECTRIC">⚡ Electric (EV - Zero Emission)</option>
                  <option value="PETROL">⛽ Petrol (i-VTEC / TSI)</option>
                  <option value="DIESEL">🛢️ Diesel (CRDi / DDiS)</option>
                  <option value="CNG">🟢 CNG (Clean Fuel)</option>
                  <option value="HYBRID">🔋 Strong Hybrid</option>
                </select>
              </div>
            </div>

            {/* Document Upload & Preview Section */}
            <div style={{
              background: isDark ? 'rgba(0, 0, 0, 0.25)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderRadius: '18px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '14px' }}>
                Uploaded Document Proofs (National Operations Review)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {/* Aadhaar Doc */}
                <div style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>
                    Aadhaar Card Copy
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewDocModal({ title: 'Aadhaar Card Record', url: kycForm.aadhaarDocUrl })}
                      style={{ flex: 1, background: 'rgba(132, 204, 22, 0.15)', border: '1px solid rgba(132, 204, 22, 0.3)', color: isDark ? '#84CC16' : '#65A30D', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <label style={{ flex: 1, background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9', border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1', color: isDark ? '#FFFFFF' : '#0F172A', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Upload size={12} /> Re-upload
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setKycForm({ ...kycForm, aadhaarDocUrl: ev.target.result });
                              addToast('Aadhaar document updated', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Driving License Doc */}
                <div style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>
                    Driving License Copy
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewDocModal({ title: 'Driving License Record', url: kycForm.drivingLicenseDocUrl })}
                      style={{ flex: 1, background: 'rgba(132, 204, 22, 0.15)', border: '1px solid rgba(132, 204, 22, 0.3)', color: isDark ? '#84CC16' : '#65A30D', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <label style={{ flex: 1, background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9', border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1', color: isDark ? '#FFFFFF' : '#0F172A', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Upload size={12} /> Re-upload
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setKycForm({ ...kycForm, drivingLicenseDocUrl: ev.target.result });
                              addToast('Driving License document updated', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {/* Vehicle RC Doc */}
                <div style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '14px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '6px' }}>
                    Vehicle RC Copy
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setPreviewDocModal({ title: 'Vehicle RC Record', url: kycForm.vehicleRcDocUrl })}
                      style={{ flex: 1, background: 'rgba(132, 204, 22, 0.15)', border: '1px solid rgba(132, 204, 22, 0.3)', color: isDark ? '#84CC16' : '#65A30D', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> Preview
                    </button>
                    <label style={{ flex: 1, background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9', border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #CBD5E1', color: isDark ? '#FFFFFF' : '#0F172A', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Upload size={12} /> Re-upload
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setKycForm({ ...kycForm, vehicleRcDocUrl: ev.target.result });
                              addToast('Vehicle RC document updated', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingKyc}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)'
              }}
            >
              <ShieldCheck size={18} />
              <span>{savingKyc ? 'Updating & Submitting...' : 'Save & Submit Verification to Operations Desk'}</span>
            </button>
          </form>
        </div>
      )}

      {/* --- Tab 4: Commuter Highway Ride Requests --- */}
      {activeTab === 'requests' && (
        <div style={{
          background: isDark ? 'rgba(15, 23, 42, 0.75)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800', color: '#84CC16', textTransform: 'uppercase' }}>
                <BellRing size={14} />
                <span>Live Expressway Commuter Demands</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', margin: '4px 0 0' }}>
                Passenger Commute Requests ({commuterRequests.length})
              </h2>
            </div>

            <button
              type="button"
              onClick={fetchCommuterRequests}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#0F172A',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Refresh Demands 🔄
            </button>
          </div>

          {commuterRequests.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: isDark ? '#94A3B8' : '#64748B' }}>
              <BellRing size={36} color="#84CC16" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
              <div style={{ fontSize: '16px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                No Pending Commuter Requests
              </div>
              <p style={{ fontSize: '13px', margin: '4px 0 0' }}>
                When passengers request unlisted routes, they will appear here for instant 1-click matching.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
              {commuterRequests.map(req => (
                <div
                  key={req.id}
                  style={{
                    background: isDark 
                      ? 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)' 
                      : '#FFFFFF',
                    border: isDark ? '1px solid rgba(132, 204, 22, 0.25)' : '1.5px solid #E2E8F0',
                    borderRadius: '22px',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: isDark ? '0 12px 30px rgba(0, 0, 0, 0.35)' : '0 4px 16px rgba(0, 0, 0, 0.04)',
                    transition: 'all 200ms ease'
                  }}
                >
                  <div>
                    {/* Passenger Header Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={req.passengerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={req.passengerName}
                          style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #84CC16' }}
                        />
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '900', color: isDark ? '#FFFFFF' : '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{req.passengerName || 'Verified Commuter'}</span>
                            <ShieldCheck size={14} color="#10B981" />
                          </div>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }} />
                            <span>{req.seats} Seat{req.seats > 1 ? 's' : ''} Requested</span>
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '12px',
                        fontWeight: '900',
                        color: isDark ? '#A3E635' : '#4D7C0F',
                        background: 'rgba(132, 204, 22, 0.16)',
                        border: '1px solid rgba(132, 204, 22, 0.35)',
                        padding: '5px 12px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(132, 204, 22, 0.15)'
                      }}>
                        Budget: ₹{req.maxBudget}/seat
                      </span>
                    </div>

                    {/* Route Corridor Box */}
                    <div style={{
                      background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px' }}>
                        <span style={{ color: '#10B981', fontWeight: '900' }}>📍</span>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', display: 'block' }}>Pickup Landmark</span>
                          <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{req.origin}</strong>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: isDark ? 'rgba(255, 255, 255, 0.06)' : '#E2E8F0', margin: '2px 0' }} />

                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px' }}>
                        <span style={{ color: '#38BDF8', fontWeight: '900' }}>🏁</span>
                        <div>
                          <span style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', display: 'block' }}>Dropoff Hub</span>
                          <strong style={{ color: isDark ? '#FFFFFF' : '#0F172A' }}>{req.destination}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Schedule & Notes */}
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '11.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
                      <span>📅 {req.preferredDate}</span>
                      <span>•</span>
                      <span>⏰ {req.preferredTime}</span>
                    </div>

                    {req.notes && (
                      <div style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(132, 204, 22, 0.08)',
                        border: '1px dashed rgba(132, 204, 22, 0.3)',
                        fontSize: '11.5px',
                        color: isDark ? '#CBD5E1' : '#334155'
                      }}>
                        💬 <em>"{req.notes}"</em>
                      </div>
                    )}
                  </div>

                  {/* Smart Bottom Action Bar: Accept / Decline / Pre-fill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #F1F5F9',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    {req.status === 'ACCEPTED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle size={15} color="#10B981" />
                          <span>OFFER DISPATCHED • Awaiting Passenger</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setPostForm(prev => ({
                                ...prev,
                                originAddress: req.origin,
                                destinationAddress: req.destination,
                                departureDate: req.preferredDate,
                                pricePerSeat: String(req.maxBudget)
                              }));
                              setActiveTab('post');
                              addToast(`Pre-filled route for ${req.passengerName}`, 'info');
                            }}
                            style={{
                              background: isDark ? 'rgba(132, 204, 22, 0.15)' : '#ECFCCB',
                              color: isDark ? '#84CC16' : '#4D7C0F',
                              border: '1px solid rgba(132, 204, 22, 0.3)',
                              borderRadius: '10px',
                              padding: '7px 14px',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <span>Open Route in Post Ride ⚡</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req)}
                            style={{
                              background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '10px',
                              padding: '7px 12px',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            <span>Revoke</span>
                          </button>
                        </div>
                      </div>
                    ) : req.status === 'DECLINED' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <XCircle size={15} color="#EF4444" />
                          <span>Passed / Declined by You</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAcceptRequest(req)}
                          style={{
                            background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                            color: '#000000',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '7px 16px',
                            fontSize: '12px',
                            fontWeight: '900',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <CheckCircle size={13} />
                          <span>Re-open & Accept ⚡</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <span style={{ fontSize: '11.5px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>⚡ Verified Route Demand</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {/* Option 1: Decline / Pass */}
                          <button
                            type="button"
                            onClick={() => handleDeclineRequest(req)}
                            style={{
                              background: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEE2E2',
                              color: '#EF4444',
                              border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #FECACA',
                              borderRadius: '12px',
                              padding: '8px 14px',
                              fontSize: '12px',
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 150ms ease'
                            }}
                          >
                            <XCircle size={13} />
                            <span>Decline</span>
                          </button>

                          {/* Option 2: Accept & Offer Ride */}
                          <button
                            type="button"
                            onClick={() => handleAcceptRequest(req)}
                            style={{
                              background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                              color: '#000000',
                              border: 'none',
                              borderRadius: '12px',
                              padding: '9px 18px',
                              fontSize: '12.5px',
                              fontWeight: '900',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
                              transition: 'all 150ms ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-1px)';
                              e.currentTarget.style.boxShadow = '0 6px 18px rgba(132, 204, 22, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 14px rgba(132, 204, 22, 0.35)';
                            }}
                          >
                            <CheckCircle size={14} />
                            <span>Accept & Offer Ride ⚡</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pilot QR Scanner & OTP Boarding Validator Modal */}
      {showScannerModal && (
        <PilotQRScannerModal
          isOpen={showScannerModal}
          onClose={() => setShowScannerModal(false)}
          onVerifySuccess={() => {
            fetchDriverRides();
          }}
        />
      )}

      {/* Doc Preview Modal for KYC Tab */}
      {previewDocModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '520px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                {previewDocModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setPreviewDocModal(null)}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              maxHeight: '320px',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <img
                src={previewDocModal.url}
                alt="Document preview"
                style={{ width: '100%', maxHeight: '320px', objectFit: 'contain' }}
              />
            </div>

            <button
              type="button"
              onClick={() => setPreviewDocModal(null)}
              style={{
                width: '100%',
                background: '#84CC16',
                color: '#000000',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Passenger Manifest Modal */}
      {manifestRide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '28px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                Passenger Manifest
              </h3>
              <button
                type="button"
                onClick={() => { setManifestRide(null); setManifestData(null); }}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F1F5F9',
                  border: 'none',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '13px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '16px' }}>
              {manifestRide.originCity?.split(',')[0]} ➔ {manifestRide.destinationCity?.split(',')[0]} • {formatDate(manifestRide.departureDate)} • {formatTime(manifestRide.departureTime)}
            </div>

            {manifestData?.passengers?.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {manifestData.passengers.map((p, idx) => (
                  <div
                    key={p.bookingId || idx}
                    style={{
                      background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.passengerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                        alt={p.passengerName || p.name || 'Passenger'}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
                          {p.passengerName || p.name || 'Verified Passenger'}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Phone size={11} />
                          <a
                            href={`tel:${p.passengerPhone || p.phone || '+91 98110 54321'}`}
                            style={{ color: '#10B981', textDecoration: 'none' }}
                          >
                            {p.passengerPhone || p.phone || '+91 98110 54321'}
                          </a>
                        </div>
                        <div style={{ fontSize: '10px', color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px' }}>
                          Seat: {p.seatsBooked || p.seatCount || 1} • Ref: {p.bookingRef || 'DRIVE-101'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                        CONFIRMED
                      </span>
                      <a
                        href={`tel:${p.passengerPhone || p.phone || '+91 98110 54321'}`}
                        style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#10B981',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '800',
                          textDecoration: 'none'
                        }}
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: isDark ? '#94A3B8' : '#64748B', fontSize: '13px' }}>
                No passenger bookings yet for this ride.
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT / MODIFY RIDE MODAL */}
      {editingRide && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1.5px solid #334155' : '1.5px solid #E2E8F0',
            borderRadius: '24px',
            maxWidth: '620px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'rgba(132, 204, 22, 0.15)',
                  color: '#84CC16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: isDark ? '#F8FAFC' : '#0F172A' }}>
                    Modify Highway Corridor Ride
                  </h3>
                  <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                    ID: {editingRide.id} • {editingRide.originCity?.split(',')[0]} ➔ {editingRide.destinationCity?.split(',')[0]}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingRide(null)}
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isDark ? '#F8FAFC' : '#0F172A'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Pickup & Dropoff Addresses */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                  Pickup Exact Address / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.originAddress || ''}
                  onChange={(e) => setEditForm({ ...editForm, originAddress: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                    background: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                  Dropoff Exact Address / Landmark
                </label>
                <input
                  type="text"
                  value={editForm.destinationAddress || ''}
                  onChange={(e) => setEditForm({ ...editForm, destinationAddress: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                    background: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                />
              </div>

              {/* Departure Date & Departure Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                    Departure Date (DD/MM/YYYY)
                  </label>
                  <DateDropdownPicker
                    value={editForm.departureDate || ''}
                    onChange={(val) => setEditForm({ ...editForm, departureDate: val })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                    Departure Time (HH:MM)
                  </label>
                  <TimeDropdownPicker
                    value={editForm.departureTime || ''}
                    onChange={(val) => setEditForm({ ...editForm, departureTime: val })}
                  />
                </div>
              </div>

              {/* Fare & Seats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                    Fare / Seat (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="5000"
                    value={editForm.pricePerSeat || 350}
                    onChange={(e) => setEditForm({ ...editForm, pricePerSeat: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                      background: isDark ? '#1E293B' : '#F8FAFC',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                    Total Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={editForm.totalSeats || 3}
                    onChange={(e) => setEditForm({ ...editForm, totalSeats: e.target.value, availableSeats: Math.min(e.target.value, editForm.availableSeats || e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                      background: isDark ? '#1E293B' : '#F8FAFC',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                    Available Seats
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={editForm.totalSeats || 3}
                    value={editForm.availableSeats !== undefined ? editForm.availableSeats : 3}
                    onChange={(e) => setEditForm({ ...editForm, availableSeats: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                      background: isDark ? '#1E293B' : '#F8FAFC',
                      color: isDark ? '#F8FAFC' : '#0F172A',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}
                  />
                </div>
              </div>

              {/* Waypoints & Notes */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                  Enroute Stoppages / Waypoints (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.waypoints || ''}
                  onChange={(e) => setEditForm({ ...editForm, waypoints: e.target.value })}
                  placeholder="e.g. Vashi Toll, Lonavala Food Mall, Wakad"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                    background: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', display: 'block', marginBottom: '6px' }}>
                  Pilot Notes for Commuters
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes || ''}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="e.g. AC set to 22C, FASTag tolls included..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                    background: isDark ? '#1E293B' : '#F8FAFC',
                    color: isDark ? '#F8FAFC' : '#0F172A',
                    fontSize: '13px',
                    fontWeight: '600',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingRide(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                    background: 'transparent',
                    color: isDark ? '#94A3B8' : '#64748B',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#84CC16',
                    color: '#000000',
                    fontSize: '13px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(132, 204, 22, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{savingEdit ? 'Updating...' : 'Save & Publish Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE RIDE CONFIRMATION MODAL */}
      {rideToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#0F172A' : '#FFFFFF',
            border: isDark ? '1.5px solid rgba(239, 68, 68, 0.3)' : '1.5px solid #FEE2E2',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(239, 68, 68, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0
              }}>
                <Trash2 size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: isDark ? '#F8FAFC' : '#0F172A' }}>
                  Cancel & Delete Ride
                </h3>
                <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B' }}>
                  Remove this corridor listing from passenger searches
                </span>
              </div>
            </div>

            {/* Ride details snippet */}
            <div style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px',
              marginBottom: '20px',
              fontSize: '13px',
              color: isDark ? '#CBD5E1' : '#334155'
            }}>
              <div style={{ fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: '4px' }}>
                🛣️ {rideToDelete.originCity?.split(',')[0]} ➔ {rideToDelete.destinationCity?.split(',')[0]}
              </div>
              <div style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#64748B', marginBottom: '8px' }}>
                📅 {formatDate(rideToDelete.departureDate)} • ⏰ {formatTime(rideToDelete.departureTime)} • ₹{rideToDelete.pricePerSeat} / seat
              </div>
              
              {rideToDelete.bookedSeats > 0 ? (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '700'
                }}>
                  ⚠️ Warning: {rideToDelete.bookedSeats} passenger{rideToDelete.bookedSeats > 1 ? 's' : ''} currently booked. They will be notified automatically.
                </div>
              ) : (
                <div style={{ fontSize: '11.5px', color: isDark ? '#64748B' : '#94A3B8' }}>
                  ✓ 0 passenger reservations affected.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRideToDelete(null)}
                disabled={deletingRideId === rideToDelete.id}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: isDark ? '1px solid #334155' : '1px solid #CBD5E1',
                  background: 'transparent',
                  color: isDark ? '#94A3B8' : '#64748B',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Nevermind, Keep Ride
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRide}
                disabled={deletingRideId === rideToDelete.id}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={15} />
                <span>{deletingRideId === rideToDelete.id ? 'Deleting...' : 'Yes, Delete Listing'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
