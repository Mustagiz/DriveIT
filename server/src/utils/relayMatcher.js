/**
 * Expressway Relay (Multi-Hop Corridor Transfer) Routing Engine
 * Finds verified multi-leg connecting journeys across designated highway interchange hubs
 */

import { matchLocationFuzzy } from './fuzzyMatch.js';

// Designated Safe Highway Interchange Transfer Hubs in India
export const HIGHWAY_INTERCHANGE_HUBS = [
  {
    id: 'hub_thane_majiwada',
    name: 'Thane Majiwada Interchange Hub',
    city: 'Mumbai / Thane',
    landmarks: ['Majiwada Flyover', 'Viviana Mall Bay', 'Thane Toll Plaza', 'Bhiwandi Bypass'],
    amenities: ['24/7 CCTV Safe Zone', 'HPCL Food Court', 'EV Superchargers'],
    minTransferBufferMins: 12,
    maxTransferBufferMins: 45
  },
  {
    id: 'hub_lonavala_foodmall',
    name: 'Lonavala Expressway Food Mall Hub',
    city: 'Lonavala',
    landmarks: ['Lonavala Food Mall', 'Expressway McDonald', '60kW CCS2 EV Station'],
    amenities: ['Air-Conditioned Waiting Lounge', 'Washrooms', 'EV Fast Charging'],
    minTransferBufferMins: 10,
    maxTransferBufferMins: 40
  },
  {
    id: 'hub_blr_silkboard',
    name: 'Silk Board / Electronic City Hub',
    city: 'Bengaluru',
    landmarks: ['Silk Board Junction', 'Electronic City Toll', 'HSR Layout Hub'],
    amenities: ['Metro Feeder Bay', '24/7 Security', 'Coffee Day Hub'],
    minTransferBufferMins: 15,
    maxTransferBufferMins: 50
  },
  {
    id: 'hub_del_gurugram_kherki',
    name: 'Gurugram Kherki Daula Interchange Hub',
    city: 'Delhi NCR (Gurugram)',
    landmarks: ['Kherki Daula Toll', 'Cyber City Feeder', 'IFFCO Chowk'],
    amenities: ['Highway Patrol Station', 'Rest Areas', 'FASTag RFID Bay'],
    minTransferBufferMins: 15,
    maxTransferBufferMins: 45
  }
];

// Helper to parse "07:30 AM" into minutes from midnight
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = (match[3] || '').toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMins) {
  const normalized = (totalMins % 1440 + 1440) % 1440;
  let hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
}

/**
 * Searches for viable Expressway Relay multi-hop journeys
 * @param {Array} allActiveRides List of all active rides from database
 * @param {string} originQuery Commuter origin (e.g. "Nashik")
 * @param {string} destinationQuery Commuter destination (e.g. "Pune")
 * @param {object} options Filter options
 * @returns {Array} List of stitched multi-leg relay options
 */
export function findExpresswayRelays(allActiveRides = [], originQuery = '', destinationQuery = '', options = {}) {
  if (!originQuery || !destinationQuery || allActiveRides.length < 2) {
    return [];
  }

  const origQ = originQuery.toLowerCase().trim();
  const destQ = destinationQuery.toLowerCase().trim();
  const relays = [];

  for (const hub of HIGHWAY_INTERCHANGE_HUBS) {
    // 1. Find candidate Leg 1 rides (Origin -> Hub) with available seats
    const leg1Candidates = allActiveRides.filter((ride) => {
      if (ride.status === 'FULL' || (ride.availableSeats !== undefined && ride.availableSeats <= 0) || ride.accepting_bookings === false) return false;
      const origMatch = matchLocationFuzzy(origQ, ride.originCity) || matchLocationFuzzy(origQ, ride.originAddress);
      if (!origMatch) return false;

      const hubMatch = matchLocationFuzzy(hub.city, ride.destinationCity) ||
                       matchLocationFuzzy(hub.name, ride.destinationAddress) ||
                       (ride.waypoints && ride.waypoints.some(wp => hub.landmarks.some(lm => matchLocationFuzzy(lm, wp))));
      return hubMatch;
    });

    // 2. Find candidate Leg 2 rides (Hub -> Destination) with available seats
    const leg2Candidates = allActiveRides.filter((ride) => {
      if (ride.status === 'FULL' || (ride.availableSeats !== undefined && ride.availableSeats <= 0) || ride.accepting_bookings === false) return false;
      const destMatch = matchLocationFuzzy(destQ, ride.destinationCity) || matchLocationFuzzy(destQ, ride.destinationAddress);
      if (!destMatch) return false;

      const hubMatch = matchLocationFuzzy(hub.city, ride.originCity) ||
                       matchLocationFuzzy(hub.name, ride.originAddress) ||
                       (ride.waypoints && ride.waypoints.some(wp => hub.landmarks.some(lm => matchLocationFuzzy(lm, wp))));
      return hubMatch;
    });

    // 3. Stitch viable Leg 1 + Leg 2 pairs with valid layover buffer
    for (const leg1 of leg1Candidates) {
      const leg1DepMins = parseTimeToMinutes(leg1.departureTime);
      const leg1DurationMins = Math.round((leg1.estimatedDurationHours || 2) * 60);
      const leg1ArrMins = leg1DepMins + leg1DurationMins;

      for (const leg2 of leg2Candidates) {
        if (leg1.id === leg2.id || leg1.driverId === leg2.driverId) continue;

        const leg2DepMins = parseTimeToMinutes(leg2.departureTime);
        const layoverMinutes = leg2DepMins - leg1ArrMins;

        // Ensure layover buffer is within safe transfer window (10 to 60 mins)
        if (layoverMinutes >= hub.minTransferBufferMins && layoverMinutes <= hub.maxTransferBufferMins) {
          const leg2DurationMins = Math.round((leg2.estimatedDurationHours || 2) * 60);
          const totalTripMins = leg1DurationMins + layoverMinutes + leg2DurationMins;
          const totalDistanceKm = (leg1.distanceKm || 100) + (leg2.distanceKm || 100);

          // 10% Multi-Hop Relay Discount
          const combinedPrice = (leg1.pricePerSeat || 300) + (leg2.pricePerSeat || 300);
          const discountedPrice = Math.round(combinedPrice * 0.90);

          relays.push({
            relayId: `relay_${leg1.id}_${leg2.id}`,
            isRelay: true,
            interchangeHub: hub,
            originCity: leg1.originCity,
            destinationCity: leg2.destinationCity,
            departureTime: leg1.departureTime,
            estimatedArrivalTime: formatMinutesToTime(leg1DepMins + totalTripMins),
            totalDurationHours: Number((totalTripMins / 60).toFixed(1)),
            totalDistanceKm,
            originalPrice: combinedPrice,
            pricePerSeat: discountedPrice,
            discountPercent: 10,
            layoverMinutes,
            transferWarranty: 'Guaranteed On-Time Connection Shield • Free Re-booking Protection',
            leg1: {
              ...leg1,
              role: 'FEEDER_LEG',
              estimatedArrivalAtHub: formatMinutesToTime(leg1ArrMins)
            },
            leg2: {
              ...leg2,
              role: 'CONNECTING_LEG',
              departureFromHub: leg2.departureTime
            }
          });
        }
      }
    }
  }

  // Sort by lowest total travel duration
  return relays.sort((a, b) => a.totalDurationHours - b.totalDurationHours);
}
