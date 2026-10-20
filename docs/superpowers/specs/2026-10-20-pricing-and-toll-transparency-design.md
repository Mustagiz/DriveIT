# Phase 3: AI Smart Pricing & Toll Transparency Design Specification

**Status:** Approved  
**Date:** 2026-10-20  
**Domain:** Full-Stack / Pricing Engine / Toll Transparency / Cost Sharing  
**Target Components:**
- `server/src/services/pricingEngine.js`
- `server/src/routes/pricing.js`
- `client/src/components/TollBreakdownPopover.jsx` (New)
- `client/src/components/TollBreakdownPopover.module.css` (New)
- `client/src/components/EVRideCard.jsx`
- `client/src/components/RideCorridorTimeline.jsx`
- `server/test_algorithms.js`

---

## 1. Problem Statement & Motivation
Intercity carpooling passengers frequently encounter confusing fares without clarity on why a trip costs a specific amount. Furthermore, they are often unaware of how much cheaper Driveit is compared to commercial taxi cabs:
1. **Opaque Toll Splitting:** FASTag tolls on expressways (e.g. Mumbai-Pune, Yamuna, Bangalore-Mysore) can exceed ₹150–₹250 per car. Passengers want to see which exact toll plazas are included.
2. **Missing Solo Cab Savings Context:** Solo taxis charge ₹18–₹24/km (often ₹2,000+ for 150 km). Visualizing this contrast creates an immediate "aha!" value realization.
3. **EV Green Incentives:** Electric vehicle drivers consume significantly cheaper energy; displaying the eco-subsidy deduction reinforces the platform's green mission.

---

## 2. Architecture & Design

### 2.1 Component Structure
```
server/
└── src/
    ├── services/pricingEngine.js     # Calculates distance rate, itemized tolls, cab savings & EV bonus
    └── routes/pricing.js             # Exposes itemized breakdown via /api/pricing/calculate

client/
└── src/
    └── components/
        ├── TollBreakdownPopover.jsx        # Popover/modal breaking down tolls, cab savings & fare
        ├── TollBreakdownPopover.module.css # Scoped glassmorphic popover styles
        ├── EVRideCard.jsx                  # Integrates interactive toll info chip trigger
        └── RideCorridorTimeline.jsx        # Interactive FASTag toll pill opening the breakdown
```

### 2.2 Specifications

#### A. Backend Pricing Engine (`pricingEngine.js`)
- Returns `tollGates` array with `{ name, km, amount, perSeat }`.
- Computes:
  - `taxiFareEstimate`: `Math.round(distanceKm * 18)` (benchmark solo cab fare).
  - `savingsVsTaxi`: `taxiFareEstimate - finalPricePerSeat`.
  - `savingsPercent`: `Math.round((savingsVsTaxi / taxiFareEstimate) * 100)`.
  - `tollPerSeat`: `Math.round(totalToll / totalSeats)`.
  - `greenDeduction`: Subsidized discount for EV propulsion.

#### B. `<TollBreakdownPopover />`
- **Solo Cab Comparison Banner:**
  - High-impact contrast badge: `₹2,100 Solo Cab ➔ ₹385 on Driveit (Save ₹1,715 • 81% Off)`.
- **Itemized Toll Gates:**
  - Each plaza named along with its kilometer marker and individual fee share.
- **Fare Breakdown Row:**
  - Base Distance Running Cost (`X km @ ₹Y/km`).
  - FASTag Toll Split (`+ ₹Z/seat`).
  - EV Green Eco Bonus (`- ₹E`).
  - Platform Escrow Fee (`+ ₹P`).
  - Net Fare Per Seat.

#### C. Frontend In-Card Triggers
- `EVRideCard.jsx`: `Toll Note` becomes a clickable interactive chip with info icon `ⓘ`.
- `RideCorridorTimeline.jsx`: The FASTag pill triggers the popover.

---

## 3. Verification Plan
1. **Algorithmic Tests:** Run `node server/test_algorithms.js` to verify:
   - Itemized toll gate amounts and per-seat calculations.
   - Solo cab comparison and savings percentage.
   - EV green bonus deductions.
2. **UI & Build Compilation:** Run `npm run build` in `client` to verify zero errors.
3. **Interactive Popover Verification:** Confirm opening/closing popovers doesn't trigger ride booking or card selection.
