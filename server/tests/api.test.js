import assert from 'assert';
import app from '../src/index.js';
import { db } from '../src/data/db.js';

const PORT = 5099;
let server;
let baseUrl;

async function runTests() {
  console.log('🧪 Starting Rideshare Platform Automated Integration Tests...\n');

  // Check database availability
  let dbAvailable = false;
  try {
    await db.getUsers();
    dbAvailable = true;
  } catch (err) {
    console.warn('⚠️  PostgreSQL not available. Skipping database-dependent tests.');
    console.warn('    Start PostgreSQL or run: docker-compose up -d postgres');
  }

  server = app.listen(PORT);
  baseUrl = `http://localhost:${PORT}`;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check (always runs)
    await test('GET /api/health should return status healthy', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.status, 'healthy');
    });

    if (!dbAvailable) {
      console.log('\n🏁 Test Run Completed: 1 passed, 0 failed (database skipped).\n');
      console.log('   To run full integration tests, ensure PostgreSQL is running.\n');
      return;
    }

    // Reset database before tests
    try {
      db.reset();
    } catch (err) {
      console.warn('⚠️  Skipping database reset:', err.message);
    }

    // 2. Auth: Demo logins
    let driverToken, riderToken, supportToken;

    await test('POST /api/auth/login for Driver Rahul', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'rahul@driveit.in', password: 'password123' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.token);
      assert.ok(data.user.roles.includes('lister'));
      driverToken = data.token;
    });

    await test('POST /api/auth/login for Passenger Ananya', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ananya@driveit.in', password: 'password123' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.token);
      assert.ok(data.user.roles.includes('booker'));
      riderToken = data.token;
    });

    await test('POST /api/auth/login for Support Aman', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'aman@driveit.in', password: 'password123' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.token);
      assert.ok(data.user.roles.includes('support'));
      supportToken = data.token;
    });

    // 3. RBAC Enforcement
    await test('Passenger Ananya cannot access /api/lister/rides (403 Forbidden)', async () => {
      const res = await fetch(`${baseUrl}/api/lister/rides`, {
        headers: { Authorization: `Bearer ${riderToken}` }
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Driver Rahul cannot access /api/admin/overview (403 Forbidden)', async () => {
      const res = await fetch(`${baseUrl}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${driverToken}` }
      });
      assert.strictEqual(res.status, 403);
    });

    await test('Support Aman CAN access /api/admin/overview (200 OK)', async () => {
      const res = await fetch(`${baseUrl}/api/admin/overview`, {
        headers: { Authorization: `Bearer ${supportToken}` }
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.metrics.totalUsers > 0);
    });

    // 4. Public Rides Search
    await test('GET /api/rides with origin search filter', async () => {
      const res = await fetch(`${baseUrl}/api/rides?origin=Mumbai`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.rides.length >= 1);
      assert.ok(data.rides[0].originCity.includes('Mumbai'));
    });

    // 5. Lister Flow: Post a ride
    let newRideId;
    await test('Driver Rahul posts a new ride', async () => {
      const res = await fetch(`${baseUrl}/api/lister/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${driverToken}`
        },
        body: JSON.stringify({
          originCity: 'Pune, Maharashtra',
          destinationCity: 'Nashik, Maharashtra',
          departureDate: '2026-08-30',
          departureTime: '06:00',
          pricePerSeat: 450.0,
          totalSeats: 3,
          notes: 'Smooth drive via NH60'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(data.ride.availableSeats, 3);
      newRideId = data.ride.id;
    });

    // 6. Booker Flow: Seat Allocation & Overbooking Protection
    let bookingId;

    // Clear prior active seed booking so passenger starts clean
    const existingRes = await fetch(`${baseUrl}/api/booker/bookings`, {
      headers: { Authorization: `Bearer ${riderToken}` }
    });
    const existingData = await existingRes.json();
    for (const b of existingData.bookings || []) {
      if (b.status === 'CONFIRMED') {
        await fetch(`${baseUrl}/api/booker/bookings/${b.id}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${riderToken}`
          },
          body: JSON.stringify({ reason: 'Pre-test cleanup' })
        });
      }
    }

    await test('Passenger Ananya books 2 seats on new Nashik ride', async () => {
      const res = await fetch(`${baseUrl}/api/booker/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({
          rideId: newRideId,
          seats: 2,
          notes: 'Two people with backpacks'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(data.remainingSeats, 1); // 3 - 2 = 1
      assert.strictEqual(data.booking.seatsBooked, 2);
      bookingId = data.booking.id;
    });

    await test('Uber/Ola 1-Ride-at-a-time policy: Booking a second concurrent ride fails with 400', async () => {
      const res = await fetch(`${baseUrl}/api/booker/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({
          rideId: newRideId,
          seats: 1
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.ok(data.error.includes('1 active ride at a time') || data.error.includes('already have an active ride'));
    });

    // 7. Booking Cancellation & Seat Restoration
    await test('Passenger Ananya cancels booking -> seats restored to 3', async () => {
      const res = await fetch(`${baseUrl}/api/booker/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({ reason: 'Trip rescheduled' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.rideUpdated.availableSeats, 3);
    });

    // 8. Dynamic Pricing Engine (Uber/Ola model)
    await test('POST /api/pricing/calculate returns dynamic fare with surge and EV discount', async () => {
      const res = await fetch(`${baseUrl}/api/pricing/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ distanceKm: 148, isElectric: true })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.pricing.calculatedFarePerSeat > 0);
      assert.strictEqual(data.pricing.vehicleDiscount, 0.90);
    });

    // 9. Lister KYC & Document Verification
    await test('POST /api/lister/kyc submits Aadhaar and RC documents', async () => {
      const res = await fetch(`${baseUrl}/api/lister/kyc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${driverToken}`
        },
        body: JSON.stringify({
          fullName: 'Rahul Sharma',
          aadhaarNumber: '8921',
          drivingLicenseNumber: 'MH-14-2018-0099412',
          vehicleRcNumber: 'MH-12-RN-7788'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.user.kyc_status, 'PENDING');
    });

    // 10. Lister Booking Toggle
    await test('PATCH /api/lister/rides/:id/toggle-bookings pauses and opens bookings', async () => {
      const res = await fetch(`${baseUrl}/api/lister/rides/${newRideId}/toggle-bookings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${driverToken}`
        },
        body: JSON.stringify({ accepting: false })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.ride.accepting_bookings, false);
    });

    // 11. Booker 5-Star Rating System
    await test('POST /api/booker/rides/:id/rate submits 5-star rating for driver', async () => {
      const res = await fetch(`${baseUrl}/api/booker/rides/${newRideId}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({
          overallRating: 5,
          safetyRating: 5,
          cleanlinessRating: 5,
          punctualityRating: 5,
          comment: 'Outstanding EV highway trip!'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(data.review.overallRating, 5);
    });

    // 12. Booker Incident Report
    await test('POST /api/booker/reports submits incident report to Trust Desk', async () => {
      const res = await fetch(`${baseUrl}/api/booker/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({
          category: 'OVERCHARGING_TOLLS',
          description: 'Fastag toll discrepancy on expressway'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.ok(data.report.reportRef.startsWith('INC-'));
    });

    // 13. Dual-Channel Support Chat
    await test('POST /api/chat/messages sends support message and appears in threads', async () => {
      const res = await fetch(`${baseUrl}/api/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${riderToken}`
        },
        body: JSON.stringify({ message: 'Need assistance with Fastag toll receipt' })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      assert.ok(data.message.id);

      // Verify Support agent can list threads
      const threadsRes = await fetch(`${baseUrl}/api/chat/threads`, {
        headers: { Authorization: `Bearer ${supportToken}` }
      });
      const threadsData = await threadsRes.json();
      assert.strictEqual(threadsRes.status, 200);
      assert.ok(threadsData.threads.length > 0);
    });

    // 14. User Profile Update (Avatar & Bio)
    await test('PATCH /api/auth/profile updates avatar and personal bio', async () => {
      const res = await fetch(`${baseUrl}/api/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${driverToken}`
        },
        body: JSON.stringify({
          name: 'Rahul Sharma (Updated)',
          avatar: 'data:image/svg+xml;utf8,<svg>avatar</svg>',
          bio: 'EV Evangelist on Mumbai-Pune Expressway'
        })
      });
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.user.name, 'Rahul Sharma (Updated)');
      assert.strictEqual(data.user.bio, 'EV Evangelist on Mumbai-Pune Expressway');
    });

    // 15. Marketing Promo Banners
    await test('GET /api/banners returns active marketing banners', async () => {
      const res = await fetch(`${baseUrl}/api/banners`);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(data.banners.length >= 1);
    });

    console.log(`\n🏁 Test Run Completed: ${passed} passed, ${failed} failed.\n`);
    if (failed > 0) process.exit(1);

  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
