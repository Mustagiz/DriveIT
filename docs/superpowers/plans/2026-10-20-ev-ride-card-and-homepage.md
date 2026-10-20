# Phase 1: EV Ride Card & Home Page Visual Craft Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the Driveit discovery experience by transforming `EVRideCard` into an aviation/expressway-grade ticket with an interactive milestone drawer, seat gauge, and one-tap corridor filters in `SearchConsole`.

**Architecture:** Modular React architecture where `EVRideCard` composes two focused sub-components (`RideSeatGauge` and `RideCorridorTimeline`) with CSS module transitions. `SearchConsole` is extended with a sticky corridor filter ribbon that drives reactive filtering in `HomePage`.

**Tech Stack:** React 18, CSS Modules, Lucide React icons, Vite 5.

**Spec:** `docs/superpowers/specs/2026-10-20-ev-ride-card-and-homepage-design.md`

## Global Constraints
- Retain existing `onSelect(ride)` contract in `EVRideCard` so downstream booking modals function without alteration.
- Use CSS variables from `client/src/styles/design-tokens.css` and `global.css` (e.g. `--color-primary-500`, `--font-display`, `--radius-xl`).
- Prevent event bubbling when clicking drawer toggle so cards do not accidentally trigger reservation.
- Ensure strict zero-error build in `npm run build`.

---

### Task 1: Create `RideSeatGauge` Visual Indicator

**Files:**
- Create: `client/src/components/RideSeatGauge.jsx`
- Create: `client/src/components/RideSeatGauge.module.css`

**Interfaces:**
- Consumes: `{ totalSeats = 4, availableSeats = 2, size = 'md' }`
- Produces: Visual segmented pill/seat diagram with accessible count label and tooltip.

- [ ] **Step 1: Write `RideSeatGauge.module.css`**

```css
.container {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid var(--color-border);
  padding: 4px 8px;
  border-radius: var(--radius-full);
}

.seatRow {
  display: flex;
  align-items: center;
  gap: 3px;
}

.seatPill {
  width: 7px;
  height: 12px;
  border-radius: 3px;
  transition: all 0.2s ease;
}

.seatAvailable {
  background: #10B981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}

.seatBooked {
  background: rgba(148, 163, 184, 0.25);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
}

.highlight {
  color: #10B981;
  font-weight: 800;
}
```

- [ ] **Step 2: Write `RideSeatGauge.jsx`**

```jsx
import React from 'react';
import styles from './RideSeatGauge.module.css';

export default function RideSeatGauge({ totalSeats = 4, availableSeats = 2 }) {
  const total = Math.max(1, Number(totalSeats) || 4);
  const available = Math.max(0, Math.min(total, Number(availableSeats) || 0));
  const booked = total - available;

  const seats = [];
  for (let i = 0; i < total; i++) {
    // Left pills represent available seats, right pills represent booked
    const isAvail = i < available;
    seats.push({ id: i, available: isAvail });
  }

  return (
    <div className={styles.container} title={`${available} of ${total} seats available`}>
      <div className={styles.seatRow}>
        {seats.map((seat) => (
          <span
            key={seat.id}
            className={`${styles.seatPill} ${seat.available ? styles.seatAvailable : styles.seatBooked}`}
          />
        ))}
      </div>
      <span className={styles.label}>
        <span className={styles.highlight}>{available}</span>/{total} seats open
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Build passes with no syntax or bundling errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/RideSeatGauge.jsx client/src/components/RideSeatGauge.module.css
git commit -m "feat(ui): add RideSeatGauge visual seat availability indicator"
```

---

### Task 2: Create `RideCorridorTimeline` Expandable Drawer

**Files:**
- Create: `client/src/components/RideCorridorTimeline.jsx`
- Create: `client/src/components/RideCorridorTimeline.module.css`

**Interfaces:**
- Consumes: `{ ride, isExpanded }`
- Produces: Collapsible milestone stops timeline, toll split chip, and travel amenities.

- [ ] **Step 1: Write `RideCorridorTimeline.module.css`**

```css
.drawer {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
  margin-top: 12px;
}

.drawerExpanded {
  max-height: 380px;
  opacity: 1;
  padding-top: 14px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
  padding-left: 6px;
}

.milestone {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
}

.node {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.nodeGreen {
  background: #10B981;
  box-shadow: 0 0 6px #10B981;
}

.nodeYellow {
  background: #F59E0B;
  box-shadow: 0 0 6px #F59E0B;
}

.nodeRed {
  background: #EF4444;
  box-shadow: 0 0 6px #EF4444;
}

.milestoneContent {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.milestoneTitle {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.milestoneSub {
  font-size: 11px;
  color: var(--color-text-muted);
}

.amenitiesGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid var(--color-border);
  padding: 10px 12px;
  border-radius: var(--radius-lg);
}

.amenityItem {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.tollPill {
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(132, 204, 22, 0.12);
  border: 1px solid rgba(132, 204, 22, 0.3);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #84CC16;
}
```

- [ ] **Step 2: Write `RideCorridorTimeline.jsx`**

```jsx
import React from 'react';
import { ShieldCheck, Luggage, Wind, Zap, Fuel, Sparkles, Navigation } from 'lucide-react';
import styles from './RideCorridorTimeline.module.css';

export default function RideCorridorTimeline({ ride, isExpanded }) {
  if (!ride) return null;

  const originName = ride.originCity?.split(',')[0] || 'Origin';
  const destName = ride.destinationCity?.split(',')[0] || 'Destination';
  const fuelType = (ride.vehicle?.fuelType || (ride.vehicle?.electric !== false ? 'ELECTRIC' : 'PETROL')).toUpperCase();
  const isElectric = fuelType === 'ELECTRIC';

  // Extract or synthesize corridor waypoints
  const waypoints = Array.isArray(ride.waypoints) && ride.waypoints.length > 0
    ? ride.waypoints
    : [
        { name: `${originName} Hub Plaza`, time: ride.departureTime || '07:00 AM', status: 'pickup' },
        { name: 'Expressway FASTag Gate & Rest Stop', time: 'Midway', status: 'stop' },
        { name: `${destName} Terminal Drop`, time: 'Estimated Arrival', status: 'dropoff' }
      ];

  const co2Saved = isElectric ? '16.4 kg' : '8.2 kg';
  const tollIncluded = ride.tollFee || 140;

  return (
    <div className={`${styles.drawer} ${isExpanded ? styles.drawerExpanded : ''}`}>
      <div className={styles.timeline}>
        {waypoints.map((wp, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === waypoints.length - 1;
          const nodeClass = isFirst ? styles.nodeGreen : isLast ? styles.nodeRed : styles.nodeYellow;

          return (
            <div key={idx} className={styles.milestone}>
              <div className={`${styles.node} ${nodeClass}`} />
              <div className={styles.milestoneContent}>
                <span className={styles.milestoneTitle}>{wp.name || wp.stopName || 'Waypoint'}</span>
                <span className={styles.milestoneSub}>{wp.time ? `Schedule: ${wp.time}` : 'Scheduled corridor stop'}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.amenitiesGrid}>
        <div className={styles.tollPill}>
          <span>🛣️ FASTag Toll Included:</span>
          <span>₹{tollIncluded} split</span>
        </div>

        <div className={styles.amenityItem}>
          <Luggage size={13} color="#10B981" />
          <span>Max 2 Bags / Passenger</span>
        </div>

        <div className={styles.amenityItem}>
          <Wind size={13} color="#38BDF8" />
          <span>Dual Climate AC</span>
        </div>

        <div className={styles.amenityItem}>
          <Sparkles size={13} color="#F59E0B" />
          <span>🌱 {co2Saved} CO₂ Offset</span>
        </div>

        <div className={styles.amenityItem}>
          {isElectric ? <Zap size={13} color="#10B981" /> : <Fuel size={13} color="#F97316" />}
          <span>{isElectric ? '100% Green EV Drive' : 'Express Highway Cruising'}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Passes with no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/RideCorridorTimeline.jsx client/src/components/RideCorridorTimeline.module.css
git commit -m "feat(ui): add RideCorridorTimeline expandable route and amenity drawer"
```

---

### Task 3: Upgrade `EVRideCard` with Aviation-HUD Layout & Actions

**Files:**
- Modify: `client/src/components/EVRideCard.jsx`
- Modify: `client/src/components/EVRideCard.module.css`

**Interfaces:**
- Consumes: `{ ride, onSelect }`
- Produces: Aviation-HUD ride card with route code header, `<RideSeatGauge />`, toggleable `<RideCorridorTimeline />`, and distinct "Reserve Seat" CTA.

- [ ] **Step 1: Update `EVRideCard.module.css` with aviation styling**

```css
.card {
  position: relative;
  border-radius: 22px;
  padding: 16px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-2px);
  border-color: rgba(132, 204, 22, 0.4);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.flightHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 14px;
}

.routeCodeBlock {
  display: flex;
  align-items: center;
  gap: 8px;
}

.routeCityCode {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.03em;
  color: var(--color-text-primary);
}

.routeArrow {
  color: var(--color-text-muted);
  font-size: 12px;
}

.timeTag {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 8px;
  border-radius: 6px;
}

.mainBody {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 14px;
}

.thumbWrapper {
  position: relative;
  width: 90px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  background: #1E293B;
}

.thumbImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fuelTagBadge {
  position: absolute;
  bottom: 3px;
  left: 3px;
  font-size: 8.5px;
  font-weight: 900;
  padding: 2px 5px;
  border-radius: 4px;
  color: #FFFFFF;
}

.detailsCol {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicleTitle {
  font-size: 14.5px;
  font-weight: 800;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pilotMeta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.priceCol {
  text-align: right;
  flex-shrink: 0;
}

.fareAmount {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 900;
  color: var(--color-text-primary);
  line-height: 1;
}

.tollNote {
  font-size: 9.5px;
  font-weight: 700;
  color: #84CC16;
  margin-top: 3px;
}

.actionBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.drawerToggleBtn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.drawerToggleBtn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-text-primary);
}

.reserveBtn {
  background: linear-gradient(135deg, #84CC16 0%, #65A30D 100%);
  border: none;
  color: #0E240B;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 12.5px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(132, 204, 22, 0.3);
  transition: all 0.15s ease;
}

.reserveBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(132, 204, 22, 0.45);
}
```

- [ ] **Step 2: Update `EVRideCard.jsx`**

Replace implementation in `client/src/components/EVRideCard.jsx`:
- Import `useState`
- Import `RideSeatGauge` and `RideCorridorTimeline`
- Maintain `isDrawerOpen` toggle state
- Add `ChevronDown` and `ChevronUp` icons
- Wire `e.stopPropagation()` on drawer toggle so card click doesn't trigger unexpectedly.

- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Passes with no errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/EVRideCard.jsx client/src/components/EVRideCard.module.css
git commit -m "feat(ui): upgrade EVRideCard with aviation HUD, seat gauge and timeline drawer"
```

---

### Task 4: Upgrade `SearchConsole` with Expressway Corridors & Quick Filters

**Files:**
- Modify: `client/src/components/SearchConsole.jsx`
- Modify: `client/src/components/SearchConsole.module.css`

**Interfaces:**
- Consumes: `{ ..., onSelectPreset, activeFilters, onToggleFilter }`
- Produces: Corridor shortcut buttons and feature toggle pills (`⚡ EV Only`, `🛡️ Aadhaar Verified`).

- [ ] **Step 1: Update `SearchConsole.module.css` with chip ribbon styling**

Add styles for `.chipRibbon`, `.corridorChip`, `.filterToggleChip`, and `.activeFilterChip`.

- [ ] **Step 2: Update `SearchConsole.jsx`**

Add predefined corridors:
1. `Mumbai ⇄ Pune (Expressway)`
2. `Delhi ⇄ Agra (Yamuna)`
3. `Bengaluru ⇄ Mysuru (NH-275)`
Add quick filter buttons:
1. `⚡ 100% EV Only`
2. `🛡️ UIDAI Verified Only`

- [ ] **Step 3: Verify build compilation**

Run: `cd client && npm run build`
Expected: Passes with zero errors.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/SearchConsole.jsx client/src/components/SearchConsole.module.css
git commit -m "feat(ui): add expressway corridor shortcuts and filter toggles to SearchConsole"
```

---

### Task 5: Integrate Filter State in `HomePage.jsx` & End-to-End Verification

**Files:**
- Modify: `client/src/pages/HomePage.jsx`

**Interfaces:**
- Connects corridor presets and toggles to filtered rides state.

- [ ] **Step 1: Wire filter state in `HomePage.jsx`**

Add `evOnly`, `verifiedOnly` state and filter the `rides` array before rendering `<EVRideCard />`.

- [ ] **Step 2: Run full build and test**

Run: `cd client && npm run build`
Expected: Clean compilation, assets generated in `dist/`.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/HomePage.jsx
git commit -m "feat(ui): connect corridor shortcuts and quick filters on HomePage"
```
