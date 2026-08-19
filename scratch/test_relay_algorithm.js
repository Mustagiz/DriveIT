import { findExpresswayRelays, HIGHWAY_INTERCHANGE_HUBS } from '../server/src/utils/relayMatcher.js';

console.log('🧪 ========================================================');
console.log('🧪 TEST: Expressway Relay Algorithm & Logic Verification');
console.log('🧪 ========================================================');

// Mock Active Rides
const mockRides = [
  // Pilot A: Nashik to Thane Majiwada Hub (05:30 AM -> 07:45 AM)
  {
    id: 'ride_nsk_mum_001',
    driverId: 'usr_sandeep',
    driverName: 'Sandeep Deshmukh',
    originCity: 'Nashik, Maharashtra',
    originAddress: 'Dwarka Circle, Nashik',
    destinationCity: 'Mumbai / Thane, Maharashtra',
    destinationAddress: 'Thane Majiwada Interchange Hub, Mumbai',
    waypoints: ['Ghoti Toll Plaza', 'Kasara Ghat', 'Padgha Toll Hub'],
    departureDate: '2026-08-20',
    departureTime: '05:30 AM',
    estimatedDurationHours: 2.25,
    distanceKm: 140,
    pricePerSeat: 320,
    totalSeats: 3,
    availableSeats: 3,
    accepting_bookings: true,
    status: 'ACTIVE',
    vehicle: { make: 'Tata', model: 'Punch EV', fuelType: 'ELECTRIC', electric: true }
  },
  // Pilot B: Thane Majiwada Hub to Pune (08:00 AM -> 10:15 AM)
  // Layover at Thane: 08:00 AM - 07:45 AM = 15 mins (Valid!)
  {
    id: 'ride_tha_pun_002',
    driverId: 'usr_rahul',
    driverName: 'Rahul Sharma',
    originCity: 'Mumbai / Thane, Maharashtra',
    originAddress: 'Thane Majiwada Interchange Hub, Mumbai',
    destinationCity: 'Pune, Maharashtra',
    destinationAddress: 'Swargate Metro Hub, Pune',
    waypoints: ['Vashi Toll', 'Lonavala Food Mall', 'Wakad'],
    departureDate: '2026-08-20',
    departureTime: '08:00 AM',
    estimatedDurationHours: 2.25,
    distanceKm: 148,
    pricePerSeat: 340,
    totalSeats: 3,
    availableSeats: 2,
    accepting_bookings: true,
    status: 'ACTIVE',
    vehicle: { make: 'Tata', model: 'Nexon EV', fuelType: 'ELECTRIC', electric: true }
  },
  // Pilot C: Thane Majiwada Hub to Pune (07:48 AM -> Layover only 3 mins, INVALID!)
  {
    id: 'ride_tha_pun_invalid_layover',
    driverId: 'usr_amit',
    driverName: 'Amit Roy',
    originCity: 'Mumbai / Thane, Maharashtra',
    originAddress: 'Thane Majiwada Interchange Hub, Mumbai',
    destinationCity: 'Pune, Maharashtra',
    destinationAddress: 'Swargate Metro Hub, Pune',
    departureDate: '2026-08-20',
    departureTime: '07:48 AM', // Only 3 mins after 07:45 AM arrival (Under min buffer 12m)
    estimatedDurationHours: 2.25,
    distanceKm: 148,
    pricePerSeat: 350,
    totalSeats: 3,
    availableSeats: 3,
    accepting_bookings: true,
    status: 'ACTIVE'
  },
  // Pilot D: Thane Majiwada Hub to Pune with 0 seats available (FULL, INVALID!)
  {
    id: 'ride_tha_pun_full',
    driverId: 'usr_vikram',
    driverName: 'Vikram Joshi',
    originCity: 'Mumbai / Thane, Maharashtra',
    originAddress: 'Thane Majiwada Interchange Hub, Mumbai',
    destinationCity: 'Pune, Maharashtra',
    destinationAddress: 'Swargate Metro Hub, Pune',
    departureDate: '2026-08-20',
    departureTime: '08:15 AM',
    estimatedDurationHours: 2.25,
    distanceKm: 148,
    pricePerSeat: 350,
    totalSeats: 3,
    availableSeats: 0,
    accepting_bookings: true,
    status: 'FULL'
  }
];

// Test 1: Nashik to Pune Relay Matching
console.log('\n🔍 TEST 1: Searching Relay "Nashik" to "Pune"...');
const relays = findExpresswayRelays(mockRides, 'Nashik', 'Pune');
console.log(`Found ${relays.length} viable relay(s)`);

if (relays.length === 1) {
  const r = relays[0];
  console.log('✅ Stitched Relay ID:', r.relayId);
  console.log('✅ Hub Name:', r.interchangeHub.name);
  console.log('✅ Layover Window:', `${r.layoverMinutes} minutes (Safe 12-45 min transfer)`);
  console.log('✅ Total Travel Duration:', `${r.totalDurationHours} hours`);
  console.log('✅ Original Price:', `₹${r.originalPrice} -> Discounted Price: ₹${r.pricePerSeat} (10% Off)`);
  console.log('✅ Leg 1 Pilot:', r.leg1.driverName, `(${r.leg1.departureTime} -> ${r.leg1.estimatedArrivalAtHub})`);
  console.log('✅ Leg 2 Pilot:', r.leg2.driverName, `(${r.leg2.departureFromHub} -> ${r.estimatedArrivalTime})`);
} else {
  console.error('❌ Expected exactly 1 valid relay, got:', relays.length);
  process.exit(1);
}

// Test 2: Incompatible Relay (Invalid Layover & Full seats should be rejected)
console.log('\n🔍 TEST 2: Testing Rejection of Invalid Layover (< 12m) & Full Seats (0 seats)...');
const invalidLayoverExists = relays.some(r => r.leg2.id === 'ride_tha_pun_invalid_layover');
const fullSeatExists = relays.some(r => r.leg2.id === 'ride_tha_pun_full');

if (!invalidLayoverExists && !fullSeatExists) {
  console.log('✅ Successfully rejected 3-minute layover connection (under minimum buffer).');
  console.log('✅ Successfully rejected 0-seat / FULL vehicle from relay options.');
} else {
  console.error('❌ Validation failed! Found invalid connections in relay output.');
  process.exit(1);
}

// Test 3: Date Filtering
console.log('\n🔍 TEST 3: Testing Relay Date Mismatch Filtering...');
const dateMismatchRelays = findExpresswayRelays(mockRides, 'Nashik', 'Pune', { date: '2026-08-25' });
if (dateMismatchRelays.length === 0) {
  console.log('✅ Correctly returned 0 relays when querying a non-matching future date.');
} else {
  console.error('❌ Expected 0 relays for unmatched date.');
  process.exit(1);
}

console.log('\n🎉 ALL EXPRESSWAY RELAY ALGORITHM TESTS PASSED WITH 100% PRECISION!\n');
