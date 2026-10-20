# BlaBlaCar India UI Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the DriveIT frontend into BlaBlaCar India's (`blablacar.in`) iconic clean light-mode UI, featuring the floating segmented search capsule, vertical-timeline ride cards, white navbar, and signature cyan/navy palette while preserving all DriveIT features (FASTag toll split, EV metrics, Aadhaar badge, boarding pass).

**Architecture:** Update design tokens to BlaBlaCar cyan (`#00AFF5`), deep navy (`#054752`), and crisp white surfaces. Redesign `TopNavbar`, `SearchConsole`, and `EVRideCard` to follow BlaBlaCar India's layout conventions with high visual fidelity.

**Tech Stack:** React 18, CSS Modules, Lucide React, Vite, Node.js/Express.

**Spec:** `docs/superpowers/specs/2026-10-20-blablacar-ui-redesign-design.md`

## Global Constraints
- Primary Brand Color: `#00AFF5` (BlaBlaCar Sky Blue), `#008CCC` (Hover).
- Deep Navy: `#054752` (Headers, titles, prices).
- Crisp White Surface: `#FFFFFF` and soft light background `#F4F6F8`.
- Slate Gray: `#708797` (Subtitles, duration, timestamps).
- Preserve existing functional props and events (`onSelect`, `onNavigate`, `onSearch`, `onSwap`, `onOpenToll`).
- All 25/25 server algorithmic tests in `server/test_algorithms.js` must remain green.
- Client build `npm run build` must succeed cleanly with zero errors.

---

### Task 1: BlaBlaCar Light Theme Design Tokens

**Files:**
- Modify: `client/src/styles/design-tokens.css`

- [ ] **Step 1: Update design tokens with BlaBlaCar colors and light surfaces**
  Set `--color-primary-500: #00AFF5`, `--color-primary-600: #008CCC`, `--color-text-primary: #054752`, `--color-text-secondary: #708797`, `--color-bg-primary: #FFFFFF`, `--color-bg-surface: #FFFFFF`, `--color-border: #EDEDED`. Add `--shadow-capsule` and `--shadow-card`.
- [ ] **Step 2: Verify Vite compilation**
  Run `npm run build` in `client`.
- [ ] **Step 3: Commit**
  `git commit -m "style(tokens): update design tokens for BlaBlaCar light theme"`

---

### Task 2: BlaBlaCar Top Navbar Clean White Header

**Files:**
- Modify: `client/src/components/TopNavbar.jsx`
- Modify: `client/src/components/TopNavbar.module.css`

- [ ] **Step 1: Update TopNavbar styling and structure**
  Convert header background to crisp white (`#FFFFFF`) with bottom border (`#EDEDED`). Style DriveIT logo with BlaBlaCar sky blue and deep navy. Add pill-style "+ Publish a ride" button and user profile capsule.
- [ ] **Step 2: Verify Vite compilation**
  Run `npm run build` in `client`.
- [ ] **Step 3: Commit**
  `git commit -m "feat(ui): update TopNavbar with BlaBlaCar clean white styling"`

---

### Task 3: BlaBlaCar Segmented Floating Capsule Search Console

**Files:**
- Modify: `client/src/components/SearchConsole.jsx`
- Modify: `client/src/components/SearchConsole.module.css`

- [ ] **Step 1: Implement multi-segmented capsule layout**
  Restyle the search bar into a single floating capsule (`border-radius: 20px`, pure white, elevated shadow) containing:
  `[ ◯ Leaving from... ]` | `[ ◯ Going to... ]` | `[ 📅 Today / Date ]` | `[ 👤 1 passenger ]` | `[ Search CTA ]` (#00AFF5).
  Keep quick expressway corridor chips beneath in clean pill style.
- [ ] **Step 2: Verify Vite compilation and user interaction**
  Run `npm run build` in `client`.
- [ ] **Step 3: Commit**
  `git commit -m "feat(ui): create BlaBlaCar floating capsule SearchConsole"`

---

### Task 4: BlaBlaCar Vertical Timeline Ride Card

**Files:**
- Modify: `client/src/components/EVRideCard.jsx`
- Modify: `client/src/components/EVRideCard.module.css`

- [ ] **Step 1: Implement BlaBlaCar vertical route timeline**
  Create classic BlaBlaCar route view:
  - Left: Departure time with dot, vertical connecting line with travel duration, arrival time with dot.
  - Right: Bold fare in `#054752` (`₹385`) with `Toll Split Incl. ⓘ` popover trigger.
  - Bottom strip: Circular driver avatar, pilot name, `★ 4.9` rating star, `🛡️ Verified` tag, `⚡ 100% EV` pill, and `Reserve Seat ➔` button.
- [ ] **Step 2: Verify Vite compilation and tests**
  Run `npm run build` in `client`.
- [ ] **Step 3: Commit**
  `git commit -m "feat(ui): style EVRideCard into BlaBlaCar vertical timeline card"`

---

### Task 5: Hero Section & Landing Page Light Refresh

**Files:**
- Modify: `client/src/components/NeptuneHeroSection.jsx`
- Modify: `client/src/components/NeptuneHeroSection.module.css`
- Modify: `client/src/pages/HomePage.jsx`

- [ ] **Step 1: Refresh Hero typography and background**
  Bright, airy hero background with BlaBlaCar headline:
  `"Your pick of expressway rides at low prices"`
  Ensure smooth transition into the floating capsule search bar.
- [ ] **Step 2: Verify Vite compilation**
  Run `npm run build` in `client`.
- [ ] **Step 3: Commit**
  `git commit -m "feat(ui): refresh Hero section and HomePage with BlaBlaCar light aesthetics"`

---

### Task 6: End-to-End Verification & Merge

**Files:**
- Test: `server/test_algorithms.js`
- Build: `client`

- [ ] **Step 1: Run server test suite**
  `node server/test_algorithms.js` (Verify 25/25 tests pass).
- [ ] **Step 2: Run client production build**
  `npm run build` in `client`.
- [ ] **Step 3: Final branch integration**
  Commit all changes and integrate into `main`.
