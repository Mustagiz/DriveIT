/**
 * Pilot Schedule & Fleet Collision Protection Engine v3.0
 * Comprehensive Spatio-Temporal Physics, Teleportation Detection,
 * Vehicle Plate Exclusivity, and Velocity Throttling.
 */

// City coordinates registry for spatial teleportation impossibility detection
const KNOWN_CITY_COORDINATES = {
  'mumbai': [19.0760, 72.8777],
  'pune': [18.5204, 73.8567],
  'bengaluru': [12.9716, 77.5946],
  'bangalore': [12.9716, 77.5946],
  'chennai': [13.0827, 80.2707],
  'delhi': [28.6139, 77.2090],
  'gurugram': [28.4595, 77.0266],
  'noida': [28.5355, 77.3910],
  'jaipur': [26.9124, 75.7873],
  'hyderabad': [17.3850, 78.4867],
  'vijayawada': [16.5062, 80.6480],
  'chandigarh': [30.7333, 76.7794],
  'goa': [15.2993, 74.1240],
  'mysore': [12.2958, 76.6394],
  'ahmedabad': [23.0225, 72.5714],
  'surat': [21.1702, 72.8311]
};

function getCityCoords(cityName = '') {
  const clean = cityName.toLowerCase();
  for (const [key, coords] of Object.entries(KNOWN_CITY_COORDINATES)) {
    if (clean.includes(key)) return coords;
  }
  return null;
}

function calculateGeoDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1.25); // Road winding multiplier
}

export function parseRideDateTimeToEpoch(dateStr, timeStr = '00:00') {
  if (!dateStr) return Date.now();
  
  let year, month, day;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? Date.now() : d.getTime();
  }

  // Parse time (handles 24h '14:30' and 12h '02:30 PM')
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const cleanTime = String(timeStr).trim().toUpperCase();
    const isPM = cleanTime.includes('PM');
    const isAM = cleanTime.includes('AM');
    const timeDigits = cleanTime.replace(/[^\d:]/g, '');
    const [hStr, mStr] = timeDigits.split(':');
    hours = parseInt(hStr || '0', 10);
    minutes = parseInt(mStr || '0', 10);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
  }

  return new Date(year, month, day, hours, minutes, 0).getTime();
}

/**
 * Comprehensive Multi-Layer Pilot Schedule Integrity Check:
 * 1. Direct Time Window Overlap
 * 2. Spatial Teleportation Anomaly (Physics Speed Limit > 110 km/h)
 * 3. Vehicle License Plate Exclusivity
 * 4. Velocity Limiting (Max 3 active departures / day)
 */
export function checkPilotScheduleConflict({
  driverId,
  driverName,
  vehiclePlate,
  originCity = '',
  destinationCity = '',
  departureDate,
  departureTime,
  estimatedDurationHours = 2.5,
  existingRides = [],
  excludeRideId = null
}) {
  const BUFFER_HOURS = 1.0; // 1-hour buffer for turnaround / traffic delays
  const MAX_SPEED_KMH = 110; // Max permissible legal highway transit speed
  const MAX_ACTIVE_DAILY_RIDES = 3; // Velocity throttle per pilot/vehicle per day

  const durationMs = (parseFloat(estimatedDurationHours) || 2.5) * 3600 * 1000;
  const bufferMs = BUFFER_HOURS * 3600 * 1000;

  const newStart = parseRideDateTimeToEpoch(departureDate, departureTime);
  const newEnd = newStart + durationMs + bufferMs;

  const cleanNewPlate = vehiclePlate ? vehiclePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
  const newPickupCoords = getCityCoords(originCity);

  let pilotDailyCount = 0;

  for (const existing of existingRides) {
    if (excludeRideId && existing.id === excludeRideId) continue;
    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') continue;

    // Check identity conflict: Same Driver OR Same Vehicle License Plate
    const sameDriver = (driverId && existing.driverId === driverId) || 
                       (driverName && existing.driverName && existing.driverName.toLowerCase().includes(driverName.toLowerCase()));
    
    const cleanExistPlate = existing.vehicle?.plate ? existing.vehicle.plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
    const sameVehicle = cleanNewPlate && cleanExistPlate && cleanNewPlate === cleanExistPlate;

    if (!sameDriver && !sameVehicle) continue;

    // Count active trips on the same date for velocity throttling
    if (existing.departureDate === departureDate) {
      pilotDailyCount++;
      if (pilotDailyCount >= MAX_ACTIVE_DAILY_RIDES) {
        return {
          hasConflict: true,
          conflictType: 'VELOCITY_LIMIT_EXCEEDED',
          conflictingRide: existing,
          message: `Velocity Limit Exceeded: You have already listed ${MAX_ACTIVE_DAILY_RIDES} active departures for ${departureDate}. To maintain platform liquidity and prevent speculative listing, complete or cancel earlier trips before posting new corridors.`
        };
      }
    }

    const existStart = parseRideDateTimeToEpoch(existing.departureDate, existing.departureTime);
    const existDurationMs = (parseFloat(existing.estimatedDurationHours) || 2.5) * 3600 * 1000;
    const existEnd = existStart + existDurationMs + bufferMs;

    // 1. Direct Time Interval Overlap
    const isDirectOverlap = newStart < existEnd && newEnd > existStart;
    if (isDirectOverlap) {
      const existRoute = `${existing.originCity?.split(',')[0] || 'Origin'} ➔ ${existing.destinationCity?.split(',')[0] || 'Destination'}`;
      return {
        hasConflict: true,
        conflictType: 'TIME_OVERLAP',
        conflictingRide: existing,
        message: sameVehicle && !sameDriver
          ? `Vehicle License Plate (${existing.vehicle?.plate || vehiclePlate}) is already bound to active trip ${existRoute} departing on ${existing.departureDate} at ${existing.departureTime}.`
          : `Schedule Collision Detected: You already have an active corridor trip scheduled for ${existRoute} on ${existing.departureDate} at ${existing.departureTime} (~${existing.estimatedDurationHours || 2.5}h duration). A single pilot cannot operate multiple overlapping routes simultaneously.`
      };
    }

    // 2. Spatial Teleportation Anomaly (Physics Check)
    // If Ride A ends and Ride B starts, can the pilot physically reposition between Dropoff(A) and Pickup(B)?
    const existDropoffCoords = getCityCoords(existing.destinationCity);
    if (newPickupCoords && existDropoffCoords) {
      const repositionDistKm = calculateGeoDistanceKm(
        existDropoffCoords[0], existDropoffCoords[1],
        newPickupCoords[0], newPickupCoords[1]
      );

      // Case A: Existing ride departs BEFORE new ride
      if (newStart >= existEnd) {
        const availableRepositionHours = (newStart - existEnd) / (3600 * 1000);
        const requiredSpeed = repositionDistKm / Math.max(availableRepositionHours, 0.1);
        if (requiredSpeed > MAX_SPEED_KMH && repositionDistKm > 80) {
          return {
            hasConflict: true,
            conflictType: 'TELEPORTATION_IMPOSSIBLE',
            conflictingRide: existing,
            message: `Spatial Transit Impossibility: Your previous trip ends in ${existing.destinationCity?.split(',')[0]} at ${new Date(existEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, which is ${repositionDistKm} km away from ${originCity?.split(',')[0]}. Traveling this distance in ${availableRepositionHours.toFixed(1)} hours would require an impossible average speed of ${Math.round(requiredSpeed)} km/h.`
          };
        }
      }
    }
  }

  return { hasConflict: false };
}
