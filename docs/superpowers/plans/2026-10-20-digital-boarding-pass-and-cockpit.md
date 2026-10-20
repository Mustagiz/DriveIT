# Phase 2: Digital Boarding Pass & Live Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the passenger boarding pass into an authentic aviation ticket with physical notch cutouts, dynamic 30s TOTP countdown bar, interactive "Boarded" stamp animation with audio chime, embedded telemetry strip, and enhanced Cockpit HUD with 1-tap NHAI 1033 emergency helplines.

**Architecture:** Component modularization adding `BoardingPassModal.module.css` for notched ticket geometry and keyframe animations; Web Audio synthesis in `soundEffects.js`; dual-surface cockpit navigation connecting embedded telemetry to the fullscreen Leaflet cockpit.

**Tech Stack:** React 18, CSS Modules, Lucide React icons, Web Audio API, Leaflet 1.9, Vite 5.

**Spec:** `docs/superpowers/specs/2026-10-20-digital-boarding-pass-and-cockpit-design.md`

## Global Constraints
- Do not break existing booking/boarding props contract in `BoardingPassModal`.
- Ensure TOTP regenerates every 30 seconds cleanly without memory leaks.
- Ensure all telephone links (`tel:1033` and `tel:112`) are formatted properly.
- Zero errors in `npm run build` and `test_algorithms.js`.

---

### Task 1: Add Aviation Boarding Chime to `soundEffects.js`

**Files:**
- Modify: `client/src/utils/soundEffects.js`

**Interfaces:**
- Produces: `sounds.playBoardingChime()`

- [ ] **Step 1: Add `playBoardingChime()` to `SoundEffectsManager`**

```javascript
  // Authentic two-tone aviation boarding chime (Ding-Dong: F5 -> C5)
  playBoardingChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      // First Ding (F5: 698.46 Hz)
      osc1.frequency.setValueAtTime(698.46, now);
      osc2.frequency.setValueAtTime(349.23, now);

      // Second Dong (C5: 523.25 Hz) after 220ms
      osc1.frequency.setValueAtTime(523.25, now + 0.22);
      osc2.frequency.setValueAtTime(261.63, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.20);
      gain.gain.setValueAtTime(0.16, now + 0.22);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);
    } catch (e) {}
  }
```

- [ ] **Step 2: Verify compilation**

Run: `cd client && npm run build`
Expected: Build passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/utils/soundEffects.js
git commit -m "feat(audio): add aviation boarding chime to SoundEffectsManager"
```

---

### Task 2: Create `BoardingPassModal.module.css` with Notched Ticket Styling

**Files:**
- Create: `client/src/components/BoardingPassModal.module.css`

**Interfaces:**
- Produces: Scoped styles for ticket notch cutouts, perforated dividing line, animated TOTP countdown meter, and rubber stamp animations.

- [ ] **Step 1: Write `BoardingPassModal.module.css`**

```css
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(12px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  animation: fadeIn 200ms ease-out;
}

.ticketContainer {
  background: var(--color-bg-surface, #FFFFFF);
  border: 1.5px solid var(--color-border);
  border-radius: 28px;
  width: 100%;
  maxWidth: 520px;
  maxHeight: 92vh;
  overflow-y: auto;
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.45);
  position: relative;
}

.ticketHeader {
  background: linear-gradient(135deg, #84CC16 0%, #65A30D 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #0E240B;
  border-top-left-radius: 26px;
  border-top-right-radius: 26px;
}

.ticketHeaderCancelled {
  background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%);
  color: #FFFFFF;
}

.perforatedLineContainer {
  position: relative;
  margin: 18px 0;
  display: flex;
  align-items: center;
}

.notchLeft {
  position: absolute;
  left: -24px;
  width: 20px;
  height: 24px;
  background: rgba(15, 23, 42, 0.88);
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  border: 1.5px solid var(--color-border);
  border-left: none;
}

.notchRight {
  position: absolute;
  right: -24px;
  width: 20px;
  height: 24px;
  background: rgba(15, 23, 42, 0.88);
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
  border: 1.5px solid var(--color-border);
  border-right: none;
}

.dashedDivider {
  flex: 1;
  border-top: 2px dashed rgba(255, 255, 255, 0.15);
  height: 0;
}

:global([data-theme="light"]) .dashedDivider {
  border-top-color: rgba(0, 0, 0, 0.15);
}

.totpBarContainer {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.totpBarFill {
  height: 100%;
  background: linear-gradient(90deg, #10B981, #84CC16);
  transition: width 1s linear;
}

.stampBadge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2.5px solid #10B981;
  color: #10B981;
  background: rgba(16, 185, 129, 0.12);
  border-radius: 12px;
  padding: 6px 14px;
  transform: rotate(-6deg);
  animation: stampPop 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@keyframes stampPop {
  0% { transform: scale(1.6) rotate(-15deg); opacity: 0; }
  100% { transform: scale(1) rotate(-6deg); opacity: 1; }
}

.telemetryStrip {
  background: rgba(15, 23, 42, 0.55);
  border: 1.5px solid var(--color-border);
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.telemetryMetrics {
  display: flex;
  align-items: center;
  gap: 14px;
}

.telemetryItem {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
}
```

- [ ] **Step 2: Verify compilation**

Run: `cd client && npm run build`
Expected: Build passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/BoardingPassModal.module.css
git commit -m "feat(ui): add BoardingPassModal styles with ticket notches and stamp animations"
```

---

### Task 3: Upgrade `BoardingPassModal.jsx` with TOTP Barcode, Boarding Stamp & Telemetry Strip

**Files:**
- Modify: `client/src/components/BoardingPassModal.jsx`

**Interfaces:**
- Consumes: `{ booking, onClose, onCancelBooking }`
- Produces: Notched physical ticket layout, animated TOTP countdown meter, "Verify & Board" action trigger with chime and stamp, native share, and embedded telemetry strip.

- [ ] **Step 1: Update `BoardingPassModal.jsx`**

- Import `sounds` from `../utils/soundEffects`
- Import styles from `./BoardingPassModal.module.css`
- Add `isBoardedLocally` state defaulting to `booking.boardingStatus === 'BOARDED'`
- Add `handleSimulateBoarding()` playing `sounds.playBoardingChime()` and setting `isBoardedLocally(true)`
- Add `handleSharePass()` calling `navigator.share` or copying link to clipboard with toast
- Render Ticket Notches, dashed perforation line, TOTP countdown bar, and Quick-Telemetry Strip

- [ ] **Step 2: Verify compilation**

Run: `cd client && npm run build`
Expected: Passes with no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/BoardingPassModal.jsx
git commit -m "feat(ui): upgrade BoardingPassModal with dynamic TOTP, boarding stamp and telemetry strip"
```

---

### Task 4: Upgrade `LiveRideTrackingCockpit.jsx` with Speedometer Gauge & Helpline Speed Dials

**Files:**
- Modify: `client/src/components/LiveRideTrackingCockpit.jsx`

**Interfaces:**
- Consumes: `{ ride, onClose }`
- Produces: Speedometer velocity dial, toll milestone ETA, and NHAI 1033 & Police 112 direct links.

- [ ] **Step 1: Add Helpline speed dials to Cockpit HUD**

Add direct action buttons:
- `tel:1033` (NHAI National Highway Emergency)
- `tel:112` (Police & Medical First Responder)

- [ ] **Step 2: Verify compilation**

Run: `cd client && npm run build`
Expected: Clean build.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/LiveRideTrackingCockpit.jsx
git commit -m "feat(ui): add emergency helpline speed dials to LiveRideTrackingCockpit"
```

---

### Task 5: Upgrade `EmergencySOSModal.jsx` & End-to-End Verification

**Files:**
- Modify: `client/src/components/EmergencySOSModal.jsx`

**Interfaces:**
- Quick-call buttons for 1033 & 112, plus automated emergency WhatsApp / SMS pre-populated dispatch.

- [ ] **Step 1: Add quick-dial helplines to EmergencySOSModal**
- [ ] **Step 2: Run full build and test suites**

Run: `cd client && npm run build && node ../server/test_algorithms.js`
Expected: 100% test passes and clean build.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/EmergencySOSModal.jsx
git commit -m "feat(safety): add 1-tap NHAI 1033 & Police 112 emergency speed dials to SOS modal"
```
