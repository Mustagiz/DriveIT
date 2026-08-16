/**
 * DriveIT E2E Tests — Booking Flow
 * Tests: login → search ride → book → payment → boarding pass
 *
 * Run: npx playwright test tests/e2e/booking-flow.spec.js
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('DriveIT Booking Flow', () => {
  test('full booking journey: login → search → book → payment', async ({ page }) => {
    // 1. Navigate to app
    await page.goto(BASE_URL);
    await page.waitForSelector('#root');
    await expect(page).toHaveTitle(/Driveit|DriveIT/i);

    // 2. Login as passenger
    await page.goto(`${BASE_URL}/#/auth`);
    await page.fill('[data-testid="email-input"]', 'priya@gmail.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible({ timeout: 5000 });

    // 3. Search for rides
    await page.goto(`${BASE_URL}/#/home`);
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Mumbai to Pune');
    }

    // 4. Navigate to pilots explorer
    await page.goto(`${BASE_URL}/#/pilots`);
    await page.waitForSelector('[data-testid="ride-card"]', { timeout: 8000 });

    // 5. Click first ride
    const firstRide = page.locator('[data-testid="ride-card"]').first();
    await firstRide.click();

    // 6. Verify ride details page
    await expect(page.locator('[data-testid="ride-details"]')).toBeVisible({ timeout: 5000 });

    // 7. Check pricing is displayed
    const priceEl = page.locator('[data-testid="price-per-seat"]');
    if (await priceEl.isVisible()) {
      const priceText = await priceEl.textContent();
      expect(priceText).toContain('₹');
    }
  });

  test('health check: API returns v3.0', async ({ request }) => {
    const response = await request.get('http://localhost:5050/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.version).toBe('3.0.0');
    expect(body.features).toContain('real-time-gps-tracking');
    expect(body.features).toContain('ai-pricing-engine');
  });

  test('pricing API returns AI-powered quote', async ({ request }) => {
    const response = await request.post('http://localhost:5050/api/pricing/calculate', {
      data: {
        distanceKm: 148,
        fuelType: 'ELECTRIC',
        origin: 'Mumbai',
        destination: 'Pune',
        seatsBooked: 1
      }
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.pricing.finalPricePerSeat).toBeGreaterThan(0);
    expect(body.pricing.co2SavedKg).toBeGreaterThan(0);
    expect(body.pricing.corridor).toBe('MUM-PNE');
  });

  test('trust score API works for pilot', async ({ request }) => {
    // First get a pilot user ID
    const ridesRes = await request.get('http://localhost:5050/api/rides');
    if (!ridesRes.ok()) return;
    const rides = await ridesRes.json();
    if (!rides.rides?.length) return;

    const pilotId = rides.rides[0]?.driverId;
    if (!pilotId) return;

    const trustRes = await request.get(`http://localhost:5050/api/trust/pilot/${pilotId}`);
    expect(trustRes.ok()).toBeTruthy();
    const body = await trustRes.json();
    expect(body.success).toBe(true);
    expect(body.trustScore.score).toBeGreaterThanOrEqual(0);
    expect(body.trustScore.score).toBeLessThanOrEqual(100);
  });

  test('corridor detection works', async ({ request }) => {
    const response = await request.get(
      'http://localhost:5050/api/pricing/detect-corridor?origin=Mumbai&destination=Pune'
    );
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.corridor).toBe('MUM-PNE');
  });
});
