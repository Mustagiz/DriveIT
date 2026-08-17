import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Singleton socket instance
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true
    });
  }
  return socketInstance;
};

// ─── Base Socket Hook ─────────────────────────────────────────────────────────
export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (msg) => setMessages(prev => [...prev, msg]);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('newMessage', onMessage);

    if (socket.connected) setConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('newMessage', onMessage);
    };
  }, []);

  const sendMessage = useCallback((data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('sendMessage', data);
      return true;
    }
    return false;
  }, []);

  const joinRoom = useCallback((userId) => {
    socketRef.current?.emit('join', userId);
  }, []);

  return { messages, connected, sendMessage, joinRoom, socket: socketRef };
}

// ─── Pilot GPS Broadcast Hook ─────────────────────────────────────────────────
// Used by the PILOT to broadcast their real device location
export function usePilotBroadcast(rideId, pilotId, { enabled = false } = {}) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [error, setError] = useState(null);
  const watchRef = useRef(null);
  const socketRef = useRef(null);

  const startBroadcast = useCallback(() => {
    if (!rideId || !pilotId || !navigator.geolocation) {
      setError('Geolocation not available');
      return;
    }

    const socket = getSocket();
    socketRef.current = socket;

    // Join the pilot ride room
    socket.emit('pilot:joinRide', { rideId, pilotId });
    setBroadcasting(true);

    // Watch real GPS position and broadcast every position change
    watchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng, speed, heading: bearing, accuracy } = position.coords;
        socket.emit('pilot:location', {
          rideId,
          lat,
          lng,
          speed: speed ? Math.round(speed * 3.6) : null, // m/s to km/h
          bearing: bearing || 0,
          accuracy: Math.round(accuracy),
          battery: null, // Would need Battery API
          timestamp: Date.now()
        });
      },
      (err) => {
        console.error('GPS error:', err);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 10000
      }
    );
  }, [rideId, pilotId]);

  const stopBroadcast = useCallback(() => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
    setBroadcasting(false);
  }, []);

  useEffect(() => {
    if (enabled) startBroadcast();
    return () => stopBroadcast();
  }, [enabled, startBroadcast, stopBroadcast]);

  return { broadcasting, startBroadcast, stopBroadcast, error };
}

// ─── Passenger GPS Tracking Hook ─────────────────────────────────────────────
// Used by PASSENGERS to receive live pilot location
export function useGpsTracking(rideId, passengerId) {
  const [position, setPosition] = useState(null);
  const [pilotOnline, setPilotOnline] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!rideId) return;

    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      socket.emit('passenger:trackRide', { rideId, passengerId });
    };

    const onGpsUpdate = (data) => {
      if (data.rideId === rideId) {
        setPosition({
          lat: data.lat,
          lng: data.lng,
          speed: data.speed,
          bearing: data.bearing,
          battery: data.battery,
          timestamp: data.timestamp
        });
        setPilotOnline(true);
      }
    };

    const onPilotOnline = ({ rideId: rid }) => {
      if (rid === rideId) setPilotOnline(true);
    };

    const onPilotOffline = ({ rideId: rid }) => {
      if (rid === rideId) setPilotOnline(false);
    };

    socket.on('connect', onConnect);
    socket.on('gps:update', onGpsUpdate);
    socket.on('pilot:online', onPilotOnline);
    socket.on('pilot:offline', onPilotOffline);

    if (socket.connected) {
      setConnected(true);
      socket.emit('passenger:trackRide', { rideId, passengerId });
    }

    return () => {
      socket.emit('passenger:stopTracking', { rideId });
      socket.off('connect', onConnect);
      socket.off('gps:update', onGpsUpdate);
      socket.off('pilot:online', onPilotOnline);
      socket.off('pilot:offline', onPilotOffline);
    };
  }, [rideId, passengerId]);

  return { position, pilotOnline, connected };
}

// ─── Booking Notifications Hook ───────────────────────────────────────────────
export function useBookingNotifications(userId, { onConfirmed, onCancelled } = {}) {
  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();
    socket.emit('join', userId);

    const handleConfirmed = (data) => onConfirmed?.(data);
    const handleCancelled = (data) => onCancelled?.(data);

    socket.on('booking:confirmed', handleConfirmed);
    socket.on('booking:cancelled', handleCancelled);

    return () => {
      socket.off('booking:confirmed', handleConfirmed);
      socket.off('booking:cancelled', handleCancelled);
    };
  }, [userId, onConfirmed, onCancelled]);
}

// ─── SOS Alert Hook ───────────────────────────────────────────────────────────
export function useSosAlerts({ onAlert } = {}) {
  useEffect(() => {
    const socket = getSocket();

    const handleSos = (data) => onAlert?.(data);
    socket.on('sos:alert', handleSos);

    return () => socket.off('sos:alert', handleSos);
  }, [onAlert]);
}

// ─── Realtime Rides Synchronization Hook ──────────────────────────────────────
export function useRealtimeRides({ onRideCreated, onRidesUpdated } = {}) {
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (data) => {
      onRideCreated?.(data);
      onRidesUpdated?.(data);
    };

    const handleUpdated = (data) => {
      onRidesUpdated?.(data);
    };

    socket.on('ride:created', handleCreated);
    socket.on('rides:updated', handleUpdated);

    // Cross-tab broadcast listener (for immediate multi-tab sync)
    const handleStorageEvent = (e) => {
      if (e.key === 'driveit_driver_rides' || e.key === 'rideshare_sync_event') {
        onRidesUpdated?.();
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('driveit_sync_rides', handleCreated);

    return () => {
      socket.off('ride:created', handleCreated);
      socket.off('rides:updated', handleUpdated);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('driveit_sync_rides', handleCreated);
    };
  }, [onRideCreated, onRidesUpdated]);
}

// ─── Realtime Passenger Requests Synchronization Hook ─────────────────────────
export function useRealtimeRequests({ onRequestCreated, onRequestsUpdated } = {}) {
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (data) => {
      onRequestCreated?.(data);
      onRequestsUpdated?.(data);
    };

    const handleUpdated = (data) => {
      onRequestsUpdated?.(data);
    };

    socket.on('request:created', handleCreated);
    socket.on('requests:updated', handleUpdated);

    // Cross-tab broadcast listener
    const handleStorageEvent = (e) => {
      if (e.key === 'driveit_sync_request_event') {
        onRequestsUpdated?.();
      }
    };
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('driveit_sync_requests', handleCreated);

    return () => {
      socket.off('request:created', handleCreated);
      socket.off('requests:updated', handleUpdated);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('driveit_sync_requests', handleCreated);
    };
  }, [onRequestCreated, onRequestsUpdated]);
}

export { getSocket };
