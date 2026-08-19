/**
 * Cockpit Real-Time Telemetry & Waypoint Announcement Handler
 */

// Major Indian Highway Waypoints & Geofence Database
const HIGHWAY_WAYPOINTS = [
  // Mumbai - Pune Expressway (NH-48)
  {
    id: 'wp_mum_vashi_toll',
    corridor: 'mumbai_pune',
    name: 'Vashi Toll Plaza (Mumbai Entry)',
    lat: 19.0645,
    lng: 72.9967,
    type: 'TOLL_PLAZA',
    tollAmount: 45,
    announcement: 'Approaching Vashi Toll Plaza. Automatic FASTag electronic lane active.'
  },
  {
    id: 'wp_mum_khalapur_toll',
    corridor: 'mumbai_pune',
    name: 'Khalapur Toll Plaza (Expressway Start)',
    lat: 18.8354,
    lng: 73.2842,
    type: 'TOLL_PLAZA',
    tollAmount: 85,
    announcement: 'Approaching Khalapur Toll Plaza in 1.2 kilometers. NHAI FASTag ₹85 deducted.'
  },
  {
    id: 'wp_mum_lonavala_food',
    corridor: 'mumbai_pune',
    name: 'Lonavala Expressway Food Mall & EV Supercharger',
    lat: 18.7557,
    lng: 73.4091,
    type: 'REST_STOP',
    hasEVCharger: true,
    announcement: 'Lonavala Food Mall ahead. EV Fast Chargers (60kW CCS2) and rest areas available.'
  },
  {
    id: 'wp_mum_khandala_ghat',
    corridor: 'mumbai_pune',
    name: 'Khandala Ghat Descent (Speed Limit 50 km/h)',
    lat: 18.7610,
    lng: 73.3750,
    type: 'SPEED_ZONE',
    speedLimitKmh: 50,
    announcement: 'Entering Khandala Ghat descent. Strict 50 km/h speed zone. Maintain safe vehicle distance.'
  },
  {
    id: 'wp_mum_talegaon_toll',
    corridor: 'mumbai_pune',
    name: 'Talegaon Toll Plaza (Pune Approach)',
    lat: 18.7214,
    lng: 73.6738,
    type: 'TOLL_PLAZA',
    tollAmount: 85,
    announcement: 'Approaching Talegaon Toll Plaza. 18 kilometers to Pune Hinjewadi IT Hub.'
  },

  // Delhi - Jaipur Expressway (NH-48)
  {
    id: 'wp_del_kherki_daula',
    corridor: 'delhi_jaipur',
    name: 'Kherki Daula Toll Plaza (Gurugram)',
    lat: 28.3986,
    lng: 76.9820,
    type: 'TOLL_PLAZA',
    tollAmount: 80,
    announcement: 'Approaching Kherki Daula Toll Plaza. FASTag lane ready.'
  },
  {
    id: 'wp_del_behror_midway',
    corridor: 'delhi_jaipur',
    name: 'Behror Highway Midway & Supercharger',
    lat: 27.8864,
    lng: 76.2842,
    type: 'REST_STOP',
    hasEVCharger: true,
    announcement: 'Behror Midway ahead. Clean washrooms and EV DC Fast Charging.'
  },

  // Bengaluru - Chennai Expressway
  {
    id: 'wp_blr_hosur_toll',
    corridor: 'bengaluru_chennai',
    name: 'Hosur Attibele Toll Plaza',
    lat: 12.7845,
    lng: 77.7812,
    type: 'TOLL_PLAZA',
    tollAmount: 60,
    announcement: 'Approaching Attibele Interstate Toll Plaza. Karnataka to Tamil Nadu border crossing.'
  }
];

// Distance calculation using Haversine formula (returns meters)
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function registerCockpitHandlers(io, socket) {
  // ─── 1. Commuter / Pilot Joins Live Cockpit Room ─────────────────────────
  socket.on('cockpit:join_trip', ({ tripId, role, userId }) => {
    socket.join(`cockpit:${tripId}`);
    console.log(`[Cockpit] User ${userId} (${role}) joined live cockpit: ${tripId}`);

    // Acknowledge join
    socket.emit('cockpit:joined', {
      tripId,
      connectedAt: Date.now(),
      status: 'STREAMING'
    });
  });

  // ─── 2. Pilot Real-Time GPS / Telemetry Push ────────────────────────────
  socket.on('cockpit:telemetry:push', (telemetryData) => {
    const { tripId, lat, lng, speedKmh, bearing, altitude, isEV, batteryPct } = telemetryData;
    if (!tripId || !lat || !lng) return;

    // Check for nearby highway waypoints within 2.5 km
    let upcomingWaypoint = null;
    for (const wp of HIGHWAY_WAYPOINTS) {
      const dist = getDistanceMeters(lat, lng, wp.lat, wp.lng);
      if (dist <= 2500) {
        upcomingWaypoint = {
          ...wp,
          distanceMeters: Math.round(dist)
        };
        break;
      }
    }

    const broadcastPayload = {
      tripId,
      ts: Date.now(),
      location: {
        lat,
        lng,
        speedKmh: speedKmh || 0,
        bearing: bearing || 0,
        altitude: altitude || 0
      },
      upcomingWaypoint,
      telemetry: {
        isEV: !!isEV,
        batteryPct: batteryPct || null,
        status: speedKmh > 5 ? 'CRUISING' : 'IDLE'
      }
    };

    // Broadcast to everyone watching this trip cockpit
    io.to(`cockpit:${tripId}`).emit('cockpit:telemetry:broadcast', broadcastPayload);
  });

  // ─── 3. Emergency SOS Broadcast from Cockpit ─────────────────────────────
  socket.on('cockpit:sos:trigger', (sosData) => {
    const { tripId, senderId, senderName, lat, lng, vehiclePlate, emergencyContacts } = sosData;
    const payload = {
      tripId,
      senderId,
      senderName,
      location: { lat, lng },
      vehiclePlate,
      timestamp: Date.now(),
      nhaiHelpline: '1033',
      alertStatus: 'CRITICAL_HIGHWAY_EMERGENCY'
    };

    // Broadcast to everyone in cockpit and global emergency feed
    io.to(`cockpit:${tripId}`).emit('cockpit:sos:alert', payload);
    io.to('admin:room').emit('cockpit:sos:alert', payload);

    console.warn(`[Cockpit SOS] Emergency Beacon Activated for trip ${tripId} at lat:${lat}, lng:${lng}`);
  });
}
