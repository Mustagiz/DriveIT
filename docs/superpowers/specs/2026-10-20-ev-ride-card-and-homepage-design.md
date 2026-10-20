# Phase 1: EV Ride Card & Home Page Visual Craft Specification

**Status:** Approved  
**Date:** 2026-10-20  
**Domain:** Frontend / UI Design System / Intercity Carpooling  
**Target Components:**
- `client/src/components/EVRideCard.jsx`
- `client/src/components/EVRideCard.module.css`
- `client/src/components/RideSeatGauge.jsx`
- `client/src/components/RideCorridorTimeline.jsx`
- `client/src/components/SearchConsole.jsx`
- `client/src/components/SearchConsole.module.css`
- `client/src/pages/HomePage.jsx`

---

## 1. Problem Statement & Motivation
The current `EVRideCard` presents essential ride information (vehicle model, driver name, price, basic EV badge) but lacks deep visual hierarchy and context needed for intercity highway carpooling:
1. **Lack of Highway Context:** Passengers booking long-distance rides need to know intermediate toll gates, rest stops, and expressway waypoints before clicking into checkout.
2. **Static Seat Information:** A simple text string `X seats left` does not give clear, immediate visual feedback on cabin capacity.
3. **No In-Card Exploration:** Users have to leave the search feed or open full dialogs just to see amenities (luggage, AC, EV charging stops, toll inclusion).
4. **Search Friction:** Fast-growing high-frequency intercity corridors (Mumbai–Pune, Delhi–Agra, Bengaluru–Mysuru) lack quick-tap shortcut filters.

---

## 2. Architecture & Design

### 2.1 Component Structure
```
client/src/
├── components/
│   ├── EVRideCard.jsx                # Core Aviation-HUD Ride Card
│   ├── EVRideCard.module.css         # Scoped animations, layout & drawer transitions
│   ├── RideSeatGauge.jsx             # Visual seat map/pill gauge (booked vs available)
│   ├── RideCorridorTimeline.jsx      # Expandable milestone drawer with toll & amenities
│   ├── SearchConsole.jsx             # Search bar + corridor chips & feature toggles
│   └── SearchConsole.module.css      # Quick-chip ribbon styling & responsive layout
└── pages/
    └── HomePage.jsx                  # Feeds quick filter states into ride query
```

### 2.2 Component Specifications

#### A. `EVRideCard.jsx` & `EVRideCard.module.css`
- **Header HUD Banner:**
  - Route code badges (e.g. `BOM ➔ PNQ` with airport/city abbreviations).
  - Departure timestamp and countdown label.
  - Fuel / Propulsion pill badge:
    - Electric: Glowing emerald badge `⚡ 100% EV` with green spotlight glow.
    - Petrol: Lime accent `⛽ Petrol`.
    - Diesel: Indigo accent `🛢️ Diesel CRDi`.
- **Card Body:**
  - Vehicle thumbnail with smooth zoom on card hover.
  - Pilot profile row: avatar, UIDAI Aadhaar verification badge, rating star with count.
  - Visual seat gauge via `<RideSeatGauge />`.
  - Pricing box: `₹[price] / seat` accompanied by `FASTag Toll Split Included`.
- **Action Bar:**
  - Left button: `[▼ Route & Milestones]` toggling `<RideCorridorTimeline />`.
  - Right button: `[Reserve Seat ➔]` triggering `onSelect(ride)` to launch the booking flow.

#### B. `RideSeatGauge.jsx`
- Renders an aviation-inspired row of seat indicators (e.g., total 4 seats: 2 booked in filled emerald, 2 open in soft translucent grey with border).
- Includes tooltip/label clarifying: `2 of 4 seats available`.

#### C. `RideCorridorTimeline.jsx`
- Collapsible lower container animated with CSS transition.
- **Milestone Timeline:**
  - Step 1: Origin pickup point + time.
  - Step 2: Intermediate expressway hubs & toll plazas (e.g., Khalapur Food Plaza / FASTag Toll Gate).
  - Step 3: Destination dropoff point + estimated arrival time.
- **Corridor Amenities Grid:**
  - 🧳 Luggage capacity (e.g. "Up to 2 cabin bags per passenger").
  - ❄️ Climate control (Dual-zone AC).
  - 🌱 Environmental impact ("14.2 kg CO₂ saved vs. solo driving").
  - ⚡ Battery / Range indicator (for electric vehicles).

#### D. `SearchConsole.jsx`
- **Corridor Shortcut Ribbon:**
  - Quick-select pills for major expressways:
    - `🛣️ Mumbai ⇄ Pune (Expressway)`
    - `🛣️ Delhi ⇄ Agra (Yamuna Expressway)`
    - `🛣️ Bengaluru ⇄ Mysuru (NH-275)`
- **Toggle Filter Chips:**
  - `⚡ 100% EV Only`
  - `🛡️ Aadhaar Verified Only`
  - `💺 2+ Seats Available`
- Clicking corridor shortcuts auto-populates Origin and Destination and filters the feed immediately.

---

## 3. Data Flow & State Management
1. `HomePage.jsx` manages active filters:
   - `corridorFilter` (string or null)
   - `evOnlyFilter` (boolean)
   - `verifiedOnlyFilter` (boolean)
2. `fetchRides` or client-side filtering refines the ride array displayed in the list.
3. Each `EVRideCard` maintains local state `isDrawerOpen` for expanding its specific route milestones.
4. Clicking "Reserve Seat" invokes the parent `onSelect(ride)` callback to open the booking modal seamlessly.

---

## 4. Testing & Verification Plan
1. **Visual Consistency:** Verify typography (`Outfit` and `Inter`), color contrast, and dark mode responsiveness.
2. **Interactive Drawer Behavior:** Confirm opening the drawer does not trigger `onSelect(ride)`. Ensure drawer collapse and expansion is smooth with no layout shifts.
3. **Seat Gauge Accuracy:** Test with rides having 1, 2, 3, or 4 available seats to verify proper icon/pill rendering.
4. **Corridor Quick-Filters:** Verify clicking preset expressway chips updates both inputs and filters the displayed ride cards appropriately.
5. **Mobile Viewport Test:** Verify cards on screens <= 480px width maintain touch-friendly button targets and avoid horizontal overflow.
