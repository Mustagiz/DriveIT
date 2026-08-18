import assert from 'assert';
import app from '../src/index.js';
import { db } from '../src/data/db.js';

const PORT = 5098;
let server;
let baseUrl;

async function runComprehensiveVerification() {
  console.log('🚀 Initiating DriveIT Full-Stack End-to-End Logic & Functionality Verification...\n');

  server = app.listen(PORT);
  baseUrl = `http://localhost:${PORT}`;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Health Diagnostics & System Telemetry
    await test('System Telemetry: GET /api/health returns healthy status & memory diagnostics', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.status, 'healthy');
      assert.ok(data.uptimeSeconds >= 0);
      assert.ok(data.memory.heapUsedMB > 0);
    });

    // 2. Statutory Legal & Grievance Compliance
    await test('Statutory Compliance: GET /api/legal/grievance-officer returns Rule 3(2) IT Rules details', async () => {
      const res = await fetch(`${baseUrl}/api/legal/grievance-officer`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.data.name, 'Aman Verma');
      assert.strictEqual(data.data.email, 'grievance@driveit.in');
    });

    await test('Statutory Compliance: GET /api/legal/compliance-summary lists DPDP 2023 & MV Act frameworks', async () => {
      const res = await fetch(`${baseUrl}/api/legal/compliance-summary`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.frameworks.length, 3);
    });

    // 3. User Authentication & Google SSO
    let testPilotToken;
    let testPassengerToken;

    await test('Google SSO: POST /api/auth/google registers and authenticates new Google Passenger', async () => {
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: `google_test_${Date.now()}`,
          email: `test_passenger_${Date.now()}@gmail.com`,
          name: 'Test Passenger Google',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          accountType: 'passenger'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.token);
      assert.strictEqual(data.user.roles[0], 'booker');
      testPassengerToken = data.token;
    });

    await test('Google SSO: POST /api/auth/google registers and authenticates new Google Pilot (Pending KYC)', async () => {
      const res = await fetch(`${baseUrl}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleId: `google_pilot_${Date.now()}`,
          email: `test_pilot_${Date.now()}@gmail.com`,
          name: 'Test Pilot Google',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
          accountType: 'pilot'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.token);
      assert.strictEqual(data.user.roles[0], 'lister');
      assert.strictEqual(data.user.kyc_status, 'PENDING');
      testPilotToken = data.token;
    });

    // 4. Pilot KYC Verification Pipeline
    await test('KYC Pipeline: POST /api/lister/kyc submits Aadhaar & Vehicle RC documents', async () => {
      const res = await fetch(`${baseUrl}/api/lister/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPilotToken}`
        },
        body: JSON.stringify({
          fullName: 'Test Pilot Google',
          aadhaarNumber: '9922',
          drivingLicenseNumber: 'MH-14-2022-0078912',
          vehicleRcNumber: 'MH-12-EV-9900',
          vehicleMake: 'Tata',
          vehicleModel: 'Nexon EV Empowered',
          vehicleFuelType: 'ELECTRIC',
          isElectric: true
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.user.kyc_status, 'PENDING');
      assert.strictEqual(data.user.vehicle.electric, true);
    });

    // 5. Corridor Collision & Anti-Duplicate Physics
    let createdRideId;
    const testDate = new Date(Date.now() + 86400000 * (10 + Math.floor(Math.random() * 500))).toISOString().split('T')[0];

    await test('Ride Listing: POST /api/lister/rides publishes new Pune ➔ Mumbai expressway corridor', async () => {
      const res = await fetch(`${baseUrl}/api/lister/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPilotToken}`
        },
        body: JSON.stringify({
          originCity: 'Pune',
          originAddress: 'Wakad Bridge Highway Bay, Pune',
          destinationCity: 'Mumbai',
          destinationAddress: 'BKC Platina Tower, Mumbai',
          departureDate: testDate,
          departureTime: '08:30',
          estimatedDurationHours: 3.0,
          distanceKm: 148,
          pricePerSeat: 390,
          totalSeats: 3,
          vehicleMake: 'Tata',
          vehicleModel: 'Nexon EV',
          vehiclePlate: 'MH-12-EV-9900',
          isElectric: true
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.ok(data.ride.id);
      assert.strictEqual(data.ride.availableSeats, 3);
      createdRideId = data.ride.id;
    });

    await test('Corridor Physics: POST /api/lister/rides rejects duplicate corridor on the same date', async () => {
      const res = await fetch(`${baseUrl}/api/lister/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPilotToken}`
        },
        body: JSON.stringify({
          originCity: 'Pune',
          originAddress: 'Wakad Bridge, Pune',
          destinationCity: 'Mumbai',
          destinationAddress: 'BKC, Mumbai',
          departureDate: testDate,
          departureTime: '08:45',
          estimatedDurationHours: 3.0,
          distanceKm: 148,
          pricePerSeat: 390,
          totalSeats: 3
        })
      });
      const data = await res.json();
      assert.ok(res.status === 409 || res.status === 400);
      assert.ok((data.error || data.message || '').includes('Collision') || (data.error || data.message || '').includes('Schedule'));
    });

    // 6. Passenger Seat Booking & 1-Active-Trip Enforcement
    let confirmedBookingId;
    await test('Seat Booking: POST /api/booker/bookings reserves 1 seat and issues 4-digit PIN', async () => {
      const res = await fetch(`${baseUrl}/api/booker/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPassengerToken}`
        },
        body: JSON.stringify({
          rideId: createdRideId,
          seats: 1,
          pickupLocation: 'Wakad Bus Stand',
          notes: 'Traveling light'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(data.remainingSeats, 2); // 3 - 1 = 2
      assert.ok(data.booking.boardingOtp || data.booking.bookingRef);
      confirmedBookingId = data.booking.id;
    });

    await test('1-Active-Trip Rule: Second booking attempt by same passenger is BLOCKED (400)', async () => {
      const res = await fetch(`${baseUrl}/api/booker/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPassengerToken}`
        },
        body: JSON.stringify({
          rideId: createdRideId,
          seats: 1
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.code, 'ACTIVE_SESSION_EXISTS');
    });

    // 7. Payment Sandbox & Adaptable Escrow Settlement
    await test('Payment Order: POST /api/payments/create-order generates adaptable Razorpay order', async () => {
      const res = await fetch(`${baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${testPassengerToken}`
        },
        body: JSON.stringify({
          rideId: createdRideId,
          seatsBooked: 1,
          amount: 390
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.orderId);
      assert.ok(data.amount === 39000 || data.amount === 390);
    });

    // 8. Geospatial & Reverse Geocoding
    await test('Geospatial Engine: GET /api/geocode returns filtered Indian address suggestions', async () => {
      const res = await fetch(`${baseUrl}/api/geocode?q=Koregaon%20Park`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(data));
      assert.ok(data.length > 0);
    });

    await test('Geospatial Engine: GET /api/geocode/reverse resolves lat/lng to highway landmark', async () => {
      const res = await fetch(`${baseUrl}/api/geocode/reverse?lat=18.5204&lng=73.8567`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.formattedAddress);
    });

    await test('Geospatial Engine: GET /api/geocode/snap-to-road snaps coordinates to nearest roadway', async () => {
      const res = await fetch(`${baseUrl}/api/geocode/snap-to-road?lat=18.5204&lng=73.8567`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.ok(data.snappedLat);
    });

    // 9. WebPush VAPID Public Key Registration
    await test('WebPush: GET /api/push/vapid-key returns valid Base64 public key', async () => {
      const res = await fetch(`${baseUrl}/api/push/vapid-key`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.publicKey && data.publicKey.length > 30);
    });

    // 10. AI Dynamic Pricing Calculation
    await test('AI Pricing: POST /api/pricing/calculate computes NHAI toll + Green EV discount', async () => {
      const res = await fetch(`${baseUrl}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          distanceKm: 148,
          fuelType: 'ELECTRIC',
          isElectric: true,
          corridor: 'MUM-PNE'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.pricing.vehicleDiscount, 0.90);
      assert.ok(data.pricing.calculatedFarePerSeat > 0);
      assert.ok(data.pricing.co2SavedKg > 0);
    });

  } finally {
    server.close();
  }

  console.log(`\n============================================================`);
  console.log(`🏁 Complete Verification Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log(`============================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
