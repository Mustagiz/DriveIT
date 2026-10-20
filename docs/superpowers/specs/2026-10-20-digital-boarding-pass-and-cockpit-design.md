# Phase 2: Digital Boarding Pass & Live Expressway Cockpit Design Specification

**Status:** Approved  
**Date:** 2026-10-20  
**Domain:** Frontend / Passenger Experience / Real-Time Telematics & Safety  
**Target Components:**
- `client/src/components/BoardingPassModal.jsx`
- `client/src/components/BoardingPassModal.module.css` (New scoped styling)
- `client/src/components/LiveRideTrackingCockpit.jsx`
- `client/src/components/EmergencySOSModal.jsx`
- `client/src/utils/soundEffects.js`

---

## 1. Problem Statement & Motivation
The current digital boarding pass displays basic booking details (passenger name, booking reference, static OTP code) but lacks the physical authenticity, fraud prevention, and real-time highway reassurance that modern commuters demand:
1. **Static Boarding Verification:** Screenshots can be shared or reused; dynamic rolling TOTP with an animated countdown ensures real-time security.
2. **Missing Boarding Stamp Feedback:** Passengers and pilots need immediate, celebratory confirmation when clearance is validated.
3. **Disjointed Highway Telematics:** Accessing the cockpit currently requires opening a secondary modal without any continuous telemetry visible on the ticket itself.
4. **Emergency Escalation Friction:** Intercity highway travelers need instant 1-tap access to official helplines (NHAI 1033 & Police 112) with pre-filled vehicle details.

---

## 2. Architecture & Design

### 2.1 Component Structure
```
client/src/
├── components/
│   ├── BoardingPassModal.jsx          # Dual-surface aviation ticket with perforation & notches
│   ├── BoardingPassModal.module.css   # Perforated ticket styling, notch masks, stamp animations
│   ├── LiveRideTrackingCockpit.jsx    # Fullscreen radar HUD with speedometer, toll ETA & helplines
│   ├── EmergencySOSModal.jsx          # SOS modal with NHAI 1033 & Police 112 quick dials
│   └── common/
│       └── QRCodeDisplay.jsx          # Scannable QR canvas generator
└── utils/
    └── soundEffects.js                # Web Audio API synthesized boarding chime
```

### 2.2 Component Specifications

#### A. `BoardingPassModal.jsx` & `BoardingPassModal.module.css`
- **Perforated Ticket Body:**
  - Distinct ticket notches (`mask-image` or radial background notches on left and right borders).
  - Dashed dividing line separating flight itinerary from the validation stub.
- **Dynamic 30-Second Rolling TOTP:**
  - 30-second timer generating a fresh rolling 4-digit code and scannable QR payload.
  - Linear SVG/CSS progress countdown bar showing remaining seconds.
- **Interactive Boarding Stamp:**
  - "Verify & Board" button triggers an authentic green stamp:
    - Text: `★ BOARDED & VERIFIED ✓`
    - Rotation: `-7deg`, bordered grunge box with timestamp (`07:32 AM • Gate Cleared`).
    - Triggers synthesized Web Audio boarding chime (`playBoardingChime()`).
- **Embedded Telemetry Ribbon:**
  - Speed indicator (`88 km/h`), battery SoC (`76%`), distance to next upcoming toll gate (`12 km to Urse Toll`).
  - Button to expand into the fullscreen highway cockpit.
- **Native Share / Copy Link:**
  - Uses `navigator.share` if available, otherwise copies link to clipboard with toast confirmation.

#### B. `LiveRideTrackingCockpit.jsx`
- **Fullscreen Aviation Dashboard:**
  - Top header: Vehicle make/model, registration plate, Pilot UIDAI verification badge, and live GPS signal status.
  - Interactive Leaflet map with bearing-oriented car marker, highway toll gates, and emerald polyline.
  - Speedometer HUD showing current speed, speed limit alert (`100 km/h`), and elevation/weather status.
  - Milestone progress meter tracking distance covered vs. remaining.
  - Quick emergency helpline links:
    - NHAI Expressway Helpline (`tel:1033`)
    - National Emergency Helpline (`tel:112`)

#### C. `EmergencySOSModal.jsx`
- 5-second countdown with instant broadcast trigger.
- Direct dial buttons for NHAI 1033 and Police 112.
- Pre-populated emergency SMS/WhatsApp dispatch containing current GPS latitude/longitude and pilot plate.

---

## 3. Data Flow & State Lifecycle
1. `BoardingPassModal` accepts `booking` prop.
2. Initializes 30s interval for `tokenCounter` and regenerates rolling dynamic OTP.
3. Clicking "Verify & Board" updates local `isBoarded` state and calls `playBoardingChime()`.
4. Embedded telemetry displays live simulated or ride-specific speeds and battery levels.
5. Clicking "Track Live" expands `showCockpit` state, revealing `LiveRideTrackingCockpit`.
6. Clicking "SOS" opens `EmergencySOSModal` with pre-filled vehicle context.

---

## 4. Verification Plan
1. **Visual Ticket Styling:** Verify ticket notch cutouts, perforated dividing line, and responsive layout on mobile (<= 480px).
2. **TOTP Countdown:** Verify progress bar smoothly decreases and resets every 30 seconds with a newly generated code.
3. **Boarding Stamp & Audio:** Verify clicking "Verify & Board" triggers the stamp animation and audio chime without errors.
4. **Cockpit Launch:** Verify "Track Live" seamlessly presents the interactive radar map and speedometer.
5. **SOS Escalation:** Verify 1033 and 112 helpline buttons trigger correct `tel:` actions.
6. **Vite Production Build:** Run `npm run build` in `client` to ensure zero compilation or bundling issues.
