# Specification: BlaBlaCar India UI Transformation for DriveIT

## 1. Overview & Objective
Transform the DriveIT intercity carpooling platform frontend to mirror the signature look and feel of **BlaBlaCar India (`blablacar.in`)**:
- Clean, airy **white light-mode palette** with BlaBlaCar Sky Blue (`#00AFF5`) and Deep Navy (`#054752`).
- **Capsule Search Bar:** Iconic floating segmented search pill (Leaving from | Going to | Date | Passengers | Search CTA).
- **Vertical Timeline Ride Cards:** Classic BlaBlaCar route timeline (departure time, origin, duration connector, arrival time, destination) with driver avatar, rating, and bold fare display.
- **DriveIT Superpowers Preservation:** Seamlessly retain FASTag toll transparency popovers, 100% EV badges, UIDAI Aadhaar verification badges, digital boarding passes, and live tracking cockpits.

---

## 2. Design System Tokens (`client/src/styles/design-tokens.css`)
- **Brand Colors:**
  - `--color-primary-500: #00AFF5;` (BlaBlaCar Sky Blue)
  - `--color-primary-600: #008CCC;` (Primary Hover)
  - `--color-primary-700: #0076B0;`
  - `--color-navy-900: #054752;` (Deep Navy / Header / Price text)
  - `--color-navy-800: #0B5865;`
  - `--color-slate-500: #708797;` (BlaBlaCar Subtitle / Timestamp gray)
  - `--color-slate-100: #F4F6F8;` (Soft section contrast background)
- **Surfaces:**
  - `--color-bg-primary: #FFFFFF;` (Primary clean white background)
  - `--color-bg-surface: #FFFFFF;` (Card background)
  - `--color-bg-secondary: #F4F6F8;` (Off-white section container)
  - `--color-border: #EDEDED;` (Subtle card & input borders)
  - `--color-border-hover: #D1D5DB;`
- **Text:**
  - `--color-text-primary: #054752;` (BlaBlaCar Deep Navy)
  - `--color-text-secondary: #708797;` (Slate Gray)
  - `--color-text-muted: #9BAAB5;`
- **Shadows:**
  - `--shadow-capsule: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);`
  - `--shadow-card: 0 2px 10px rgba(0, 0, 0, 0.05);`
  - `--shadow-card-hover: 0 8px 24px rgba(0, 0, 0, 0.09);`

---

## 3. Component Architecture & UI Mapping

### A. Top Navigation (`client/src/components/TopNavbar.jsx` & CSS)
- **Background:** Crisp White (`#FFFFFF`), `border-bottom: 1px solid #EDEDED`.
- **Brand Logo:** Driveit styled in BlaBlaCar Cyan (`#00AFF5`) and Deep Navy (`#054752`).
- **Main Actions:**
  - `Search` icon button
  - `+ Publish a ride` pill button with border/hover
  - User profile capsule showing avatar circle + name + chevron
- Sticky top positioning with high z-index and clean backdrop filter.

### B. Hero Section (`client/src/components/NeptuneHeroSection.jsx` & CSS)
- Clean, bright, airy background (subtle light-blue tint gradient `#F0F8FF` ➔ `#FFFFFF`).
- BlaBlaCar-style bold headline:
  `"Your pick of expressway rides at low prices"`
- Subheading:
  `"Trusted intercity carpooling across Mumbai-Pune, Delhi-Agra, and major Indian highway corridors."`

### C. Unified Capsule Search Console (`client/src/components/SearchConsole.jsx` & CSS)
- Floating elevated capsule (`border-radius: 20px`, `--shadow-capsule`, pure white background).
- 4 segmented sections separated by thin vertical dividers:
  1. `[ ◯ Leaving from... ]` with autocomplete
  2. `[ ◯ Going to... ]` with autocomplete & middle swap button
  3. `[ 📅 Date / Today ]` with quick date dropdown
  4. `[ 👤 1 passenger ]` seat selector
  5. `[ Search ]` CTA button in solid `#00AFF5` with bold white text.
- Quick expressway corridor chips beneath in clean light pill styling (`Mumbai ⇄ Pune`, `Delhi ⇄ Agra`, `BLR ⇄ Mysuru`).

### D. BlaBlaCar Timeline Ride Card (`client/src/components/EVRideCard.jsx` & CSS)
- Pure white container with `border: 1px solid #EDEDED`, `border-radius: 16px`, soft shadow on hover.
- **Top Row (Route Timeline):**
  - Left column:
    - Departure time (`07:30`) with circle marker and origin name
    - Vertical connector bar with duration badge (`2h 45m`)
    - Arrival time (`10:15`) with circle marker and destination name
  - Right column:
    - Bold price display in `#054752` (`₹385`)
    - `Toll Split Incl. ⓘ` chip opening `TollBreakdownPopover`
- **Bottom Row (Driver & Amenities):**
  - Left: Circular driver avatar, driver name, `★ 4.9` rating star, and `🛡️ Verified` badge.
  - Right: `⚡ 100% EV` tag, segmented seat gauge, and `Reserve Seat ➔` button.
- Expandable route drawer with milestone timeline and FASTag toll information.

---

## 4. Verification & Testing Criteria
1. **Visual Consistency:**
   - Backgrounds are light, clean, and high-contrast (#FFFFFF / #F4F6F8).
   - All text uses readable navy (#054752) and slate (#708797) instead of dark-mode glowing neon.
   - Interactive hover states feel smooth and native to BlaBlaCar.
2. **Build Verification:**
   - `npm run build` in `client` passes with zero errors.
3. **Algorithm & Functional Integrity:**
   - `node server/test_algorithms.js` remains 100% green (25/25 passing).
   - Search filtering, toll breakdown popovers, and seat reservation triggers work seamlessly.
