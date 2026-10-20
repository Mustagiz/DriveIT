# Phase 3: AI Smart Pricing & Toll Transparency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide complete fare transparency for passengers by breaking down exact FASTag toll gate fees, EV green discounts, base mileage costs, and solo cab savings (~80% cheaper) through an interactive popover and enhanced pricing engine.

**Architecture:** Backend enrichment in `pricingEngine.js` providing itemized toll gates and benchmark cab comparisons; frontend component `TollBreakdownPopover` with glassmorphic styling integrated into `EVRideCard` and `RideCorridorTimeline`.

**Tech Stack:** Node.js/Express, React 18, CSS Modules, Lucide React icons, Vite 5.

**Spec:** `docs/superpowers/specs/2026-10-20-pricing-and-toll-transparency-design.md`

## Global Constraints
- Do not modify existing API return structure in ways that break legacy clients (keep `calculatedFarePerSeat`, `finalPricePerSeat` intact).
- Toll gate amounts must divide accurately among `totalSeats` without floating point precision artifacts.
- Popover click triggers must call `e.stopPropagation()` so ride cards do not inadvertently navigate.
- Zero errors in `npm run build` and `test_algorithms.js`.

---

### Task 1: Enhance Backend `pricingEngine.js` and `pricing.js`

**Files:**
- Modify: `server/src/services/pricingEngine.js`
- Modify: `server/src/routes/pricing.js`

**Interfaces:**
- Consumes: `{ distanceKm, fuelType, corridor, totalSeats, seatsBooked, origin, destination }`
- Produces: Enhanced pricing quote with `tollGates` (itemized per-seat amounts), `tollPerSeat`, `taxiFareEstimate`, `savingsVsTaxi`, and `savingsPercent`.

- [ ] **Step 1: Update `server/src/services/pricingEngine.js`**

Add itemized per-seat toll gates calculation and savings metrics in `calculateSmartPrice`.

- [ ] **Step 2: Update `server/src/routes/pricing.js`**

Ensure `/calculate` and `/estimate` endpoints return `tollGates`, `savingsVsTaxi`, `savingsPercent`, and `taxiFareEstimate`.

- [ ] **Step 3: Run algorithm audit**

Run: `node server/test_algorithms.js`
Expected: Passes.

- [ ] **Step 4: Commit**

```bash
git add server/src/services/pricingEngine.js server/src/routes/pricing.js
git commit -m "feat(pricing): add itemized toll breakdown and solo cab comparison to pricing engine"
```

---

### Task 2: Update `server/test_algorithms.js` for New Pricing Metrics

**Files:**
- Modify: `server/test_algorithms.js`

**Interfaces:**
- Asserts that `pricingQuote.tollGates` contains valid entries with `perSeat`, `taxiFareEstimate` is calculated, and `savingsPercent > 50`.

- [ ] **Step 1: Add new pricing engine assertions to `test_algorithms.js`**
- [ ] **Step 2: Execute test suite**

Run: `node server/test_algorithms.js`
Expected: 100% tests pass.

- [ ] **Step 3: Commit**

```bash
git add server/test_algorithms.js
git commit -m "test(pricing): add assertions for itemized toll gates and cab comparison"
```

---

### Task 3: Create `TollBreakdownPopover.jsx` & Scoped CSS

**Files:**
- Create: `client/src/components/TollBreakdownPopover.module.css`
- Create: `client/src/components/TollBreakdownPopover.jsx`

**Interfaces:**
- Consumes: `{ isOpen, onClose, pricingData, ride }`
- Produces: Glassmorphic popover with solo cab comparison banner, itemized toll plaza list, EV green deduction, and total fare per seat.

- [ ] **Step 1: Write `TollBreakdownPopover.module.css`**
- [ ] **Step 2: Write `TollBreakdownPopover.jsx`**
- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/TollBreakdownPopover.jsx client/src/components/TollBreakdownPopover.module.css
git commit -m "feat(ui): add TollBreakdownPopover component for transparent fare breakdown"
```

---

### Task 4: Integrate `TollBreakdownPopover` into `EVRideCard` & `RideCorridorTimeline`

**Files:**
- Modify: `client/src/components/EVRideCard.jsx`
- Modify: `client/src/components/RideCorridorTimeline.jsx`

**Interfaces:**
- Connects the popover to the toll note in `EVRideCard` and the FASTag pill in `RideCorridorTimeline`.

- [ ] **Step 1: Add popover state and trigger button to `EVRideCard.jsx`**
- [ ] **Step 2: Update FASTag pill in `RideCorridorTimeline.jsx` to open the popover**
- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/EVRideCard.jsx client/src/components/RideCorridorTimeline.jsx
git commit -m "feat(ui): connect TollBreakdownPopover trigger to EVRideCard and timeline drawer"
```

---

### Task 5: End-to-End Build & Algorithmic Audit Verification

**Files:**
- None (Verification task)

- [ ] **Step 1: Run full production build**

Run: `cd client && npm run build`
Expected: Zero compilation errors.

- [ ] **Step 2: Run full server test suite**

Run: `node server/test_algorithms.js`
Expected: All tests pass.
