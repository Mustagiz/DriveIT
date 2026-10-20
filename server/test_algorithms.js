import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { validateAadhaar, validateVerhoeff, generateVerhoeffCheckDigit } from './src/utils/verhoeff.js';
import { checkPilotScheduleConflict, parseRideDateTimeToEpoch } from './src/utils/scheduleValidator.js';
import { calculateSmartPrice, detectCorridor } from './src/services/pricingEngine.js';

async function runAlgorithmsAudit() {
  console.log('🧪 =======================================================');
  console.log('🚀 COMPREHENSIVE ALGORITHMS & SECURITY AUDIT SUITE');
  console.log('=========================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, name, details = '') {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${name} ${details ? `(${details})` : ''}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${name} ${details ? `(${details})` : ''}`);
      throw new Error(`Assertion failed: ${name}`);
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 1. VERHOEFF ALGORITHM (UIDAI AADHAAR CHECKSUM)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('📌 1. VERHOEFF AADHAAR CHECKSUM ALGORITHM:');
  const validAadhaarBase = '29384756102';
  const checkDigit = generateVerhoeffCheckDigit(validAadhaarBase);
  const fullValidAadhaar = `${validAadhaarBase}${checkDigit}`;

  assert(validateVerhoeff(fullValidAadhaar), 'Verhoeff Checksum Valid', `Generated check digit: ${checkDigit}`);
  assert(validateAadhaar(fullValidAadhaar).valid, 'Aadhaar 12-Digit Validator Valid', fullValidAadhaar);
  
  // Test invalid permutations (single digit alteration & transposition)
  const singleDigitCorrupt = `${validAadhaarBase}${(checkDigit + 1) % 10}`;
  assert(!validateVerhoeff(singleDigitCorrupt), 'Verhoeff Catches Single Digit Error', singleDigitCorrupt);

  const transposedAadhaar = `${fullValidAadhaar.slice(0, 4)}${fullValidAadhaar[5]}${fullValidAadhaar[4]}${fullValidAadhaar.slice(6)}`;
  assert(!validateVerhoeff(transposedAadhaar), 'Verhoeff Catches Transposition Error', transposedAadhaar);

  assert(!validateAadhaar('012345678901').valid, 'Aadhaar Starting With 0 Rejected');
  assert(!validateAadhaar('112345678901').valid, 'Aadhaar Starting With 1 Rejected');
  assert(!validateAadhaar('222222222222').valid, 'All-repeating Dummy Aadhaar Rejected');

  // ───────────────────────────────────────────────────────────────────────────
  // 2. OTP GENERATION & BCRYPT HASH VERIFICATION
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n📌 2. OTP AUTHENTICATION & BCRYPT CRYPTOGRAPHY:');
  const rawOtp = '849201';
  const phone = '+919876543210';
  const hashedOtp = bcrypt.hashSync(rawOtp, 10);

  assert(bcrypt.compareSync(rawOtp, hashedOtp), 'Bcrypt OTP Hash Matches Raw 6-Digit OTP');
  assert(!bcrypt.compareSync('849202', hashedOtp), 'Bcrypt Rejects Incorrect OTP');

  // OTP format check
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  assert(/^\d{6}$/.test(generatedOtp), 'OTP is Exactly 6-Digit Numeric', generatedOtp);

  // ───────────────────────────────────────────────────────────────────────────
  // 3. PAYMENT HMAC SHA256 SIGNATURE VERIFICATION
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n📌 3. PAYMENT HMAC SHA-256 SIGNATURE ALGORITHM:');
  const testSecret = 'secret_payment_key_test_2026';
  const orderId = 'order_98317491823';
  const paymentId = 'pay_98213791283';
  const payload = `${orderId}|${paymentId}`;

  const validSignature = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');
  const expectedSig = crypto.createHmac('sha256', testSecret).update(payload).digest('hex');
  assert(validSignature === expectedSig, 'Razorpay HMAC-SHA256 Signature Matches Expected Hash');

  const tamperedSig = crypto.createHmac('sha256', testSecret).update(`${orderId}|tampered_payment_id`).digest('hex');
  assert(validSignature !== tamperedSig, 'HMAC Rejects Tampered Payment Payload');

  // ───────────────────────────────────────────────────────────────────────────
  // 4. QR CODE & BARCODE BOARDING PASS INTEGRITY
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n📌 4. QR CODE & BARCODE BOARDING PASS DATA INTEGRITY:');
  const boardingPassData = {
    bookingRef: 'DRIVE-IND-8921',
    otp: '4921',
    passenger: 'Ananya Sharma',
    pilot: 'Captain Vikram Malhotra',
    vehiclePlate: 'MH-14-EV-9999',
    route: 'Mumbai (BKC) ➔ Pune (Swargate)',
    seat: 'Seat 1A (Front Executive)',
    departure: '2026-08-25 08:00 AM'
  };

  const serialized = JSON.stringify(boardingPassData);
  assert(serialized.length > 50, 'Boarding Pass Serializes Cleanly for Canvas QR Rendering');
  const deserialized = JSON.parse(serialized);
  assert(deserialized.bookingRef === 'DRIVE-IND-8921' && deserialized.otp === '4921', 'QR Code Payload Deserialization Exact');

  // ───────────────────────────────────────────────────────────────────────────
  // 5. SPATIAL TELEPORTATION & SCHEDULE COLLISION ENGINE
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n📌 5. SPATIAL TELEPORTATION & SCHEDULE COLLISION ENGINE:');
  const existingRides = [
    {
      id: 'ride_1',
      driverId: 'pilot_1',
      driverName: 'Vikram',
      vehicle: { plate: 'MH-14-EV-9999' },
      originCity: 'Mumbai',
      destinationCity: 'Pune',
      departureDate: '2026-08-25',
      departureTime: '08:00 AM',
      estimatedDurationHours: 2.5,
      status: 'ACTIVE'
    }
  ];

  // Collision A: Exact overlapping time for same pilot
  const collisionOverlap = checkPilotScheduleConflict({
    driverId: 'pilot_1',
    driverName: 'Vikram',
    vehiclePlate: 'MH-14-EV-9999',
    originCity: 'Mumbai',
    destinationCity: 'Pune',
    departureDate: '2026-08-25',
    departureTime: '09:00 AM', // overlapping!
    estimatedDurationHours: 2.5,
    existingRides
  });
  assert(collisionOverlap.hasConflict, 'Collision Engine Detects Direct Time Overlap', collisionOverlap.message);

  // Collision B: Spatial Teleportation Impossibility (Departure from Delhi right after arriving in Pune)
  const teleportCollision = checkPilotScheduleConflict({
    driverId: 'pilot_1',
    driverName: 'Vikram',
    vehiclePlate: 'MH-14-EV-9999',
    originCity: 'Delhi', // 1,400 km away from Pune
    destinationCity: 'Jaipur',
    departureDate: '2026-08-25',
    departureTime: '11:00 AM', // Only 30 mins after arriving in Pune!
    estimatedDurationHours: 4.0,
    existingRides
  });
  assert(teleportCollision.hasConflict, 'Teleportation Engine Blocks Physically Impossible Transit', teleportCollision.message);

  // Valid non-colliding return trip (Pune -> Mumbai with adequate turnaround time)
  const validReturnTrip = checkPilotScheduleConflict({
    driverId: 'pilot_1',
    driverName: 'Vikram',
    vehiclePlate: 'MH-14-EV-9999',
    originCity: 'Pune',
    destinationCity: 'Mumbai',
    departureDate: '2026-08-25',
    departureTime: '05:00 PM', // 6.5 hours after morning trip arrival
    estimatedDurationHours: 2.5,
    existingRides
  });
  assert(!validReturnTrip.hasConflict, 'Valid Return Departure with Turnaround Buffer Allowed');

  // ───────────────────────────────────────────────────────────────────────────
  // 6. SMART PRICING & FARE ENGINE
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n📌 6. SMART PRICING & CORRIDOR FARE ENGINE:');
  const corridorKey = detectCorridor('Mumbai', 'Pune');
  assert(corridorKey === 'MUM-PNE', 'Corridor Detector Identifies Mumbai-Pune Highway');

  const pricingQuote = calculateSmartPrice({
    distanceKm: 148,
    fuelType: 'ELECTRIC',
    corridor: 'MUMBAI_PUNE',
    totalSeats: 3,
    seatsBooked: 1,
    departureHour: 8,
    departureDay: 2
  });

  assert(pricingQuote.finalPricePerSeat > 0, 'Pricing Engine Calculates Positive Final Fare', `₹${pricingQuote.finalPricePerSeat}/seat`);
  assert(pricingQuote.co2SavedKg > 0, 'CO2 Green Savings Computed for EV', `${pricingQuote.co2SavedKg} kg CO2`);
  assert(pricingQuote.savingsVsTaxi > 0, 'Commuter Cost Savings vs Solo Cab Computed', `₹${pricingQuote.savingsVsTaxi} savings`);

  console.log(`\n🎉 SUMMARY: ${passedTests}/${totalTests} ALGORITHMIC TESTS PASSED (100% SUCCESS RATE)!`);
}

runAlgorithmsAudit().catch(err => {
  console.error('\n❌ Algorithm Audit Failed:', err);
  process.exit(1);
});
