/**
 * AI-Powered Smart Pricing Engine
 * Factors: distance, fuel type, time-of-day surge, corridor tolls, EV discount
 */

// NHAI Toll Data for major corridors (₹ per vehicle per direction)
export const CORRIDOR_TOLLS = {
  'MUM-PNE': {
    name: 'Mumbai–Pune Expressway (NH48)',
    tollGates: [
      { name: 'Khalapur Toll', km: 42, amount: 85 },
      { name: 'Urse Toll', km: 78, amount: 85 }
    ],
    totalToll: 170,
    distanceKm: 148,
    waypoints: ['Vashi', 'Khopoli', 'Khalapur', 'Khandala', 'Lonavala', 'Urse', 'Wakad']
  },
  'DEL-JAI': {
    name: 'Delhi–Jaipur (NH48)',
    tollGates: [
      { name: 'Manesar Toll', km: 30, amount: 65 },
      { name: 'Dharuhera Toll', km: 68, amount: 65 },
      { name: 'Kotputli Toll', km: 158, amount: 65 }
    ],
    totalToll: 195,
    distanceKm: 270,
    waypoints: ['Gurgaon', 'Manesar', 'Dharuhera', 'Bhiwadi', 'Shahjahanpur', 'Kotputli']
  },
  'BLR-MYS': {
    name: 'Bangalore–Mysore (NH275)',
    tollGates: [
      { name: 'Kengeri Toll', km: 12, amount: 50 },
      { name: 'Maddur Toll', km: 88, amount: 50 }
    ],
    totalToll: 100,
    distanceKm: 145,
    waypoints: ['Mysore Road', 'Ramnagar', 'Channapatna', 'Maddur', 'Mandya']
  },
  'HYD-BLR': {
    name: 'Hyderabad–Bangalore (NH44)',
    tollGates: [
      { name: 'Shamshabad Toll', km: 22, amount: 70 },
      { name: 'Kurnool Toll', km: 190, amount: 70 },
      { name: 'Gooty Toll', km: 260, amount: 70 }
    ],
    totalToll: 210,
    distanceKm: 570,
    waypoints: ['Jadcherla', 'Kurnool', 'Gooty', 'Anantapur', 'Penukonda', 'Hindupur']
  },
  'MUM-GOA': {
    name: 'Mumbai–Goa (NH66)',
    tollGates: [
      { name: 'Palaspe Toll', km: 40, amount: 75 },
      { name: 'Indapur Toll', km: 120, amount: 75 },
      { name: 'Kasheli Toll', km: 320, amount: 75 }
    ],
    totalToll: 225,
    distanceKm: 590,
    waypoints: ['Panvel', 'Pen', 'Mahad', 'Chiplun', 'Ratnagiri', 'Kundapur', 'Udupi']
  },
  'GENERAL': {
    name: 'General Route',
    tollGates: [],
    totalToll: 0,
    distanceKm: 100,
    waypoints: []
  }
};

// Rate table per km by fuel type (₹/km/seat after pilot cost share)
const FUEL_RATES = {
  ELECTRIC: { ratePerKm: 2.80, label: 'EV Green', greenBonus: 15 },
  PETROL:   { ratePerKm: 3.75, label: 'Petrol', greenBonus: 0 },
  DIESEL:   { ratePerKm: 3.50, label: 'Diesel', greenBonus: 0 },
  CNG:      { ratePerKm: 2.90, label: 'CNG', greenBonus: 8 },
  HYBRID:   { ratePerKm: 3.10, label: 'Hybrid', greenBonus: 5 }
};

// Time-of-day surge multiplier
const getSurgeMultiplier = (hour = new Date().getHours()) => {
  if (hour >= 7 && hour <= 10) return { multiplier: 1.30, label: 'Morning Peak 🔺' };
  if (hour >= 17 && hour <= 20) return { multiplier: 1.25, label: 'Evening Peak 🔺' };
  if (hour >= 23 || hour <= 5) return { multiplier: 0.90, label: 'Night Saver 🌙' };
  return { multiplier: 1.00, label: 'Standard' };
};

// Day-of-week bonus
const getDayMultiplier = (day = new Date().getDay()) => {
  if (day === 5) return { multiplier: 1.15, label: 'Friday Surge' };
  if (day === 0) return { multiplier: 1.10, label: 'Sunday Rush' };
  return { multiplier: 1.00, label: 'Weekday' };
};

// Detect corridor from city pair
export const detectCorridor = (origin = '', dest = '') => {
  const o = origin.toLowerCase();
  const d = dest.toLowerCase();

  if ((o.includes('mum') || o.includes('bombay')) && (d.includes('pune') || d.includes('pun')))
    return 'MUM-PNE';
  if ((o.includes('del') || o.includes('delhi')) && (d.includes('jai') || d.includes('jaipur')))
    return 'DEL-JAI';
  if ((o.includes('bang') || o.includes('blr')) && d.includes('mys'))
    return 'BLR-MYS';
  if ((o.includes('hyd') || o.includes('hyderabad')) && (d.includes('bang') || d.includes('blr')))
    return 'HYD-BLR';
  if ((o.includes('mum') || o.includes('bombay')) && (d.includes('goa') || d.includes('panaji')))
    return 'MUM-GOA';

  return 'GENERAL';
};

/**
 * Main pricing calculator
 */
export const calculateSmartPrice = ({
  distanceKm,
  fuelType = 'PETROL',
  corridor = 'GENERAL',
  totalSeats = 4,
  seatsBooked = 1,
  departureHour = new Date().getHours(),
  departureDay = new Date().getDay(),
  origin = '',
  destination = ''
}) => {
  const detectedCorridor = corridor === 'GENERAL' ? detectCorridor(origin, destination) : corridor;
  const corridorData = CORRIDOR_TOLLS[detectedCorridor] || CORRIDOR_TOLLS.GENERAL;
  const fuelData = FUEL_RATES[fuelType.toUpperCase()] || FUEL_RATES.PETROL;
  const surge = getSurgeMultiplier(departureHour);
  const dayBonus = getDayMultiplier(departureDay);

  // Base fare = rate per km × distance
  const baseFarePerSeat = Math.round(distanceKm * fuelData.ratePerKm);

  // Toll passthrough split equally across seats
  const tollPassthrough = Math.round(corridorData.totalToll / Math.max(totalSeats, 1));

  // Platform service fee (5%)
  const platformFee = Math.round(baseFarePerSeat * 0.05);

  // Apply surge
  const surgedFare = Math.round(baseFarePerSeat * surge.multiplier * dayBonus.multiplier);

  // Green EV bonus deduction
  const greenDeduction = Math.round(surgedFare * (fuelData.greenBonus / 100));

  // Final price per seat
  const finalPricePerSeat = Math.max(50, surgedFare - greenDeduction + platformFee + tollPassthrough);

  // CO2 savings vs taxi (g/km)
  const taxiEmissionRate = 180; // gCO2/km
  const evEmissionRate = 35;
  const petrolEmissionRate = 130;
  const vehicleEmission = fuelType === 'ELECTRIC' ? evEmissionRate : petrolEmissionRate;
  const co2SavedKg = Math.round(((taxiEmissionRate - vehicleEmission / totalSeats) * distanceKm) / 1000 * 10) / 10;

  return {
    corridor: detectedCorridor,
    corridorName: corridorData.name,
    distanceKm,
    fuelType: fuelData.label,
    greenBonus: fuelData.greenBonus,

    // Price breakdown
    baseFarePerSeat,
    surgeMultiplier: surge.multiplier,
    surgeLabel: surge.label,
    dayLabel: dayBonus.label,
    greenDeductionPerSeat: greenDeduction,
    tollPassthroughPerSeat: tollPassthrough,
    platformFeePerSeat: platformFee,
    finalPricePerSeat,

    // Toll details
    tollGates: corridorData.tollGates,
    totalTollVehicle: corridorData.totalToll,

    // Eco impact
    co2SavedKg,
    carbonOffsetTrees: Math.round(co2SavedKg / 21 * 10) / 10,

    // Savings vs private taxi
    taxiFareEstimate: Math.round(distanceKm * 18), // ₹18/km taxi estimate
    savingsVsTaxi: Math.round(distanceKm * 18) - finalPricePerSeat,

    // Booking totals
    totalForBooking: finalPricePerSeat * seatsBooked,
    seatsBooked,

    // Rate card
    ratePerKm: fuelData.ratePerKm
  };
};
