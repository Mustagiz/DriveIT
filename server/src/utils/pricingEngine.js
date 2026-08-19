/**
 * DriveIT Algorithmic Pricing Engine
 * Models distance, fuel type (EV vs ICE), time-of-day peak surge, FASTag toll splits, and group through-fare rebates.
 */

export const PRICING_CONFIG = {
  RATES: {
    EV: 3.06,        // ₹3.06/km (10% green rebate over standard baseline)
    PETROL: 3.75,    // ₹3.75/km standard
    DIESEL: 3.60,    // ₹3.60/km standard
    CNG: 3.20        // ₹3.20/km
  },
  MINIMUM_FARE: 50,  // ₹50 minimum fare floor
  SURGE_WINDOWS: [
    { startHour: 7, endHour: 10, multiplier: 1.15, name: 'Morning Highway Peak' },
    { startHour: 17, endHour: 20, multiplier: 1.20, name: 'Evening Highway Peak' },
    { startHour: 23, endHour: 4, multiplier: 1.10, name: 'Late Night Transit' }
  ],
  THROUGH_TICKET_DISCOUNT_PERCENT: 10 // 10% expressway relay transfer rebate
};

/**
 * Computes base distance fare based on vehicle fuel type.
 * @param {number} distanceKm - Trip distance in kilometers
 * @param {string} fuelType - 'EV' | 'PETROL' | 'DIESEL' | 'CNG'
 * @returns {number} Unsurged base fare in ₹ rounded to integer
 */
export function calculateBaseFare(distanceKm, fuelType = 'PETROL') {
  const km = Math.max(0, Number(distanceKm) || 0);
  const normalizedFuel = String(fuelType || '').toUpperCase();
  const rate = PRICING_CONFIG.RATES[normalizedFuel] || PRICING_CONFIG.RATES.PETROL;

  const rawFare = km * rate;
  return Math.max(PRICING_CONFIG.MINIMUM_FARE, Math.round(rawFare));
}

/**
 * Calculates peak time-of-day surge multiplier.
 * @param {Date|string} dateOrTime - Date object or ISO time string
 * @returns {{ multiplier: number, surgeName: string|null }}
 */
export function getSurgeMultiplier(dateOrTime = new Date()) {
  const date = typeof dateOrTime === 'string' ? new Date(dateOrTime) : dateOrTime;
  const hour = date instanceof Date && !isNaN(date) ? date.getHours() : 12;

  for (const window of PRICING_CONFIG.SURGE_WINDOWS) {
    if (window.startHour > window.endHour) {
      // Overnight window (e.g. 23 to 4)
      if (hour >= window.startHour || hour < window.endHour) {
        return { multiplier: window.multiplier, surgeName: window.name };
      }
    } else {
      if (hour >= window.startHour && hour < window.endHour) {
        return { multiplier: window.multiplier, surgeName: window.name };
      }
    }
  }

  return { multiplier: 1.0, surgeName: null };
}

/**
 * Computes equitable FASTag toll split per passenger.
 * @param {number} totalTollAmount - Total FASTag toll in ₹
 * @param {number} totalOccupants - Total persons in vehicle (Driver + Passengers)
 * @returns {number} Toll contribution per person in ₹ rounded to 2 decimals
 */
export function calculateTollSplit(totalTollAmount, totalOccupants = 4) {
  const toll = Math.max(0, Number(totalTollAmount) || 0);
  const occupants = Math.max(1, Number(totalOccupants) || 1);
  return Number((toll / occupants).toFixed(2));
}

/**
 * Computes complete dynamic fare for a booking.
 * @param {Object} params
 * @param {number} params.distanceKm - Distance in km
 * @param {string} params.fuelType - Fuel type ('EV', etc.)
 * @param {number} params.seatsBooked - Seats reserved
 * @param {Date|string} [params.departureTime] - Time of departure
 * @param {number} [params.tollAmount=0] - Total corridor FASTag toll
 * @param {number} [params.totalVehicleSeats=4] - Total capacity
 * @returns {Object} Comprehensive fare breakdown
 */
export function calculateDynamicFare({
  distanceKm,
  fuelType = 'PETROL',
  seatsBooked = 1,
  departureTime = new Date(),
  tollAmount = 0,
  totalVehicleSeats = 4
}) {
  const seats = Math.max(1, Number(seatsBooked) || 1);
  const baseSeatFare = calculateBaseFare(distanceKm, fuelType);
  const { multiplier: surgeMultiplier, surgeName } = getSurgeMultiplier(departureTime);

  const surgedSeatFare = Math.round(baseSeatFare * surgeMultiplier);
  const perPersonToll = calculateTollSplit(tollAmount, totalVehicleSeats);

  const seatSubtotal = surgedSeatFare * seats;
  const tollSubtotal = Math.round(perPersonToll * seats);
  const totalFare = seatSubtotal + tollSubtotal;

  return {
    distanceKm: Number(distanceKm) || 0,
    fuelType: fuelType.toUpperCase(),
    ratePerKm: PRICING_CONFIG.RATES[fuelType.toUpperCase()] || PRICING_CONFIG.RATES.PETROL,
    baseSeatFare,
    surgeMultiplier,
    surgeName,
    surgedSeatFare,
    perPersonToll,
    seatsBooked: seats,
    seatSubtotal,
    tollSubtotal,
    totalFare
  };
}
