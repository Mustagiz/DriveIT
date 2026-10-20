import React from 'react';

/**
 * Creative Architectural Landmark Illustrations for Indian Cities
 * Style: Clean line-art with dual-tone accents, responsive viewBox (0 0 80 80)
 */

export function MumbaiLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Gateway of India with sea waves & subtle Sea Link cables
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base platform */}
      <rect x="8" y="66" width="64" height="4" rx="1.5" fill={color} opacity="0.85" />
      <rect x="12" y="62" width="56" height="4" rx="1" fill={color} opacity="0.6" />
      {/* Left pillar & tower */}
      <rect x="14" y="28" width="12" height="34" rx="1" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="17" y="32" width="6" height="10" rx="1" stroke={color} strokeWidth="1.6" />
      <path d="M12 28H28L25 22H15L12 28Z" fill={accent} opacity="0.25" stroke={color} strokeWidth="2" />
      <path d="M16 22L20 16L24 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right pillar & tower */}
      <rect x="54" y="28" width="12" height="34" rx="1" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="57" y="32" width="6" height="10" rx="1" stroke={color} strokeWidth="1.6" />
      <path d="M52 28H68L65 22H55L52 28Z" fill={accent} opacity="0.25" stroke={color} strokeWidth="2" />
      <path d="M56 22L60 16L64 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Central Grand Arch */}
      <path d="M26 62V38C26 30 32 24 40 24C48 24 54 30 54 38V62" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M31 62V41C31 36 35 32 40 32C45 32 49 36 49 41V62" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {/* Central Attic Dome */}
      <path d="M24 24H56V18H24V24Z" fill={accent} opacity="0.3" stroke={color} strokeWidth="2" />
      <path d="M32 18C32 13 36 9 40 9C44 9 48 13 48 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M40 9V5" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      {/* Sea waves underneath */}
      <path d="M10 74C13 72.5 16 75.5 19 74C22 72.5 25 75.5 28 74C31 72.5 34 75.5 37 74C40 72.5 43 75.5 46 74C49 72.5 52 75.5 55 74C58 72.5 61 75.5 64 74C67 72.5 70 75.5 73 74" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function DelhiLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // India Gate triumphal arch with Amar Jawan Jyoti flame
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Plinth */}
      <rect x="10" y="68" width="60" height="4" rx="1.5" fill={color} opacity="0.85" />
      <rect x="14" y="64" width="52" height="4" rx="1" fill={color} opacity="0.6" />
      {/* Left pylon */}
      <path d="M16 64L20 24H32L30 64H16Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <line x1="22" y1="34" x2="28" y2="34" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="21" y1="46" x2="29" y2="46" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      {/* Right pylon */}
      <path d="M50 64L48 24H60L64 64H50Z" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      <line x1="52" y1="34" x2="58" y2="34" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="51" y1="46" x2="59" y2="46" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      {/* Central Arch */}
      <path d="M30 64V42C30 36 34.5 31 40 31C45.5 31 50 36 50 42V64" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Top cornice & stepped pediment */}
      <rect x="16" y="19" width="48" height="5" rx="1" fill={accent} opacity="0.25" stroke={color} strokeWidth="2" />
      <rect x="22" y="14" width="36" height="5" rx="1" stroke={color} strokeWidth="2" />
      <rect x="28" y="10" width="24" height="4" rx="1" fill={accent} opacity="0.4" stroke={color} strokeWidth="1.8" />
      {/* Amar Jawan flame */}
      <circle cx="40" cy="55" r="3.5" fill={accent} opacity="0.4" />
      <path d="M40 50C38 52 38 54 40 56C42 54 42 52 40 50Z" fill={accent} />
    </svg>
  );
}

export function BengaluruLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Vidhana Soudha central dome & colonnade
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Plinth stairs */}
      <rect x="6" y="68" width="68" height="4" rx="1.5" fill={color} opacity="0.8" />
      <rect x="12" y="64" width="56" height="4" rx="1" fill={color} opacity="0.6" />
      {/* Ground Colonnade */}
      <rect x="16" y="44" width="48" height="20" rx="1" stroke={color} strokeWidth="2" />
      {/* Pillars */}
      <line x1="22" y1="44" x2="22" y2="64" stroke={color} strokeWidth="1.8" />
      <line x1="28" y1="44" x2="28" y2="64" stroke={color} strokeWidth="1.8" />
      <line x1="34" y1="44" x2="34" y2="64" stroke={color} strokeWidth="1.8" />
      <line x1="46" y1="44" x2="46" y2="64" stroke={color} strokeWidth="1.8" />
      <line x1="52" y1="44" x2="52" y2="64" stroke={color} strokeWidth="1.8" />
      <line x1="58" y1="44" x2="58" y2="64" stroke={color} strokeWidth="1.8" />
      {/* Central grand entrance */}
      <path d="M36 64V50C36 48 38 46 40 46C42 46 44 48 44 50V64" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      {/* Second Tier */}
      <rect x="22" y="34" width="36" height="10" rx="1" fill={accent} opacity="0.2" stroke={color} strokeWidth="2" />
      {/* Side Chhatris */}
      <path d="M16 44V36L20 32L24 36V44" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M56 44V36L60 32L64 36V44" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      {/* Grand Central Dome */}
      <path d="M28 34C28 22 33 16 40 16C47 16 52 22 52 34" fill={accent} opacity="0.25" stroke={color} strokeWidth="2.2" />
      {/* Finial / Stambha */}
      <line x1="40" y1="16" x2="40" y2="8" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="40" cy="8" r="2.5" fill={accent} />
    </svg>
  );
}

export function HyderabadLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Charminar with 4 grand minarets and central arch
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base */}
      <rect x="14" y="68" width="52" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Central Body */}
      <rect x="24" y="32" width="32" height="36" rx="1" stroke={color} strokeWidth="2.2" />
      {/* Grand Arches */}
      <path d="M30 68V48C30 42 35 38 40 38C45 38 50 42 50 48V68" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Upper Gallery */}
      <rect x="22" y="24" width="36" height="8" rx="1" fill={accent} opacity="0.3" stroke={color} strokeWidth="2" />
      <circle cx="40" cy="28" r="2" fill={accent} />
      {/* Left Outer Minaret */}
      <rect x="14" y="16" width="10" height="52" rx="1" stroke={color} strokeWidth="2" />
      <path d="M12 16H26L23 10H15L12 16Z" fill={accent} opacity="0.4" stroke={color} strokeWidth="1.8" />
      <line x1="19" y1="10" x2="19" y2="5" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {/* Right Outer Minaret */}
      <rect x="56" y="16" width="10" height="52" rx="1" stroke={color} strokeWidth="2" />
      <path d="M54 16H68L65 10H57L54 16Z" fill={accent} opacity="0.4" stroke={color} strokeWidth="1.8" />
      <line x1="61" y1="10" x2="61" y2="5" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {/* Minaret fluting bands */}
      <line x1="14" y1="36" x2="24" y2="36" stroke={accent} strokeWidth="1.5" />
      <line x1="56" y1="36" x2="66" y2="36" stroke={accent} strokeWidth="1.5" />
      <line x1="14" y1="52" x2="24" y2="52" stroke={accent} strokeWidth="1.5" />
      <line x1="56" y1="52" x2="66" y2="52" stroke={accent} strokeWidth="1.5" />
    </svg>
  );
}

export function ChandigarhLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Le Corbusier's Open Hand Monument
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Geometric base trench */}
      <rect x="12" y="68" width="56" height="4" rx="1.5" fill={color} opacity="0.8" />
      <polygon points="26,68 54,68 48,54 32,54" fill={accent} opacity="0.25" stroke={color} strokeWidth="2" />
      {/* Rotating Pylon shaft */}
      <rect x="37" y="38" width="6" height="16" rx="1" fill={color} />
      <circle cx="40" cy="38" r="4.5" fill={accent} opacity="0.4" stroke={color} strokeWidth="1.8" />
      {/* The Iconic Open Hand Silhouette */}
      <path
        d="M40 36 C34 36 26 30 24 24 C22 18 26 14 30 18 C31 15 35 12 38 15 C40 12 44 11 46 14 C48 11 54 13 54 18 C54 22 58 24 60 27 C62 30 58 35 50 35 C46 35 44 36 40 36 Z"
        fill={accent}
        opacity="0.3"
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {/* Palm crease detail */}
      <path d="M34 26C38 28 44 28 48 24" stroke={accent} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function AhmedabadLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Sidi Saiyyed Jali Arch / Teen Darwaza
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ground plinth */}
      <rect x="10" y="68" width="60" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Wall surround */}
      <path d="M14 68V26H66V68" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
      {/* Semi-circular Jali Arch */}
      <path d="M22 68V42C22 30 30 22 40 22C50 22 58 30 58 42V68" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill={accent} opacity="0.15" />
      {/* Intricate Tree of Life Lattice Lines */}
      <path d="M40 68V36" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M40 50C34 46 30 40 28 34" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 50C46 46 50 40 52 34" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 42C35 38 34 32 36 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 42C45 38 46 32 44 28" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      {/* Ornamental roof battlements */}
      <path d="M12 26L16 20L20 26L24 20L28 26L32 20L36 26L40 20L44 26L48 20L52 26L56 20L60 26L64 20L68 26" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PuneLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Shaniwar Wada Delhi Darwaza stone fort gate
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base */}
      <rect x="8" y="68" width="64" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Left Bastion */}
      <path d="M12 68V28L24 28V68" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill={color} opacity="0.08" />
      <path d="M10 28L18 20L26 28" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Right Bastion */}
      <path d="M56 68V28L68 28V68" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill={color} opacity="0.08" />
      <path d="M54 28L62 20L70 28" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* Fort Curtain Wall & Arch */}
      <rect x="24" y="32" width="32" height="36" stroke={color} strokeWidth="2" />
      <path d="M30 68V48C30 42 35 38 40 38C45 38 50 42 50 48V68" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill={accent} opacity="0.25" />
      {/* Wooden Spike gate iron rivets */}
      <circle cx="34" cy="52" r="1.2" fill={accent} />
      <circle cx="34" cy="60" r="1.2" fill={accent} />
      <circle cx="46" cy="52" r="1.2" fill={accent} />
      <circle cx="46" cy="60" r="1.2" fill={accent} />
      {/* Maratha flag on bastion */}
      <line x1="62" y1="20" x2="62" y2="8" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M62 8L74 12L62 16Z" fill={accent} />
    </svg>
  );
}

export function ChennaiLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Kapaleeshwarar Temple Gopuram
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base */}
      <rect x="12" y="68" width="56" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Gopuram Gateway Base */}
      <rect x="20" y="54" width="40" height="14" rx="1" stroke={color} strokeWidth="2" />
      <path d="M34 68V58C34 56 36 54 40 54C44 54 46 56 46 58V68" stroke={accent} strokeWidth="2.2" strokeLinecap="round" />
      {/* Tier 1 */}
      <polygon points="22,54 58,54 55,44 25,44" fill={accent} opacity="0.2" stroke={color} strokeWidth="2" />
      {/* Tier 2 */}
      <polygon points="26,44 54,44 51,34 29,34" stroke={color} strokeWidth="2" />
      {/* Tier 3 */}
      <polygon points="30,34 50,34 47,24 33,24" fill={accent} opacity="0.3" stroke={color} strokeWidth="2" />
      {/* Tier 4 */}
      <polygon points="34,24 46,24 44,16 36,16" stroke={color} strokeWidth="2" />
      {/* Kalasam Finials */}
      <line x1="40" y1="16" x2="40" y2="8" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="8" r="2" fill={accent} />
      <line x1="36" y1="16" x2="36" y2="10" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="44" y1="16" x2="44" y2="10" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function KolkataLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Victoria Memorial & Howrah Bridge truss
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Plinth */}
      <rect x="8" y="68" width="64" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Main Palace Body */}
      <rect x="14" y="46" width="52" height="22" rx="1" stroke={color} strokeWidth="2" />
      <line x1="14" y1="56" x2="66" y2="56" stroke={accent} strokeWidth="1.6" />
      {/* Left Wing Dome */}
      <path d="M16 46C16 38 20 34 24 34C28 34 32 38 32 46" fill={accent} opacity="0.25" stroke={color} strokeWidth="1.8" />
      {/* Right Wing Dome */}
      <path d="M48 46C48 38 52 34 56 34C60 34 64 38 64 46" fill={accent} opacity="0.25" stroke={color} strokeWidth="1.8" />
      {/* Grand Central Dome */}
      <rect x="28" y="34" width="24" height="12" fill={accent} opacity="0.3" stroke={color} strokeWidth="2" />
      <path d="M30 34C30 20 34 14 40 14C46 14 50 20 50 34" fill={accent} opacity="0.4" stroke={color} strokeWidth="2.2" />
      {/* Angel of Victory */}
      <line x1="40" y1="14" x2="40" y2="6" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="6" r="2" fill={accent} />
    </svg>
  );
}

export function KochiLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Chinese Fishing Nets over Arabian sea waves with palm tree
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sea waves */}
      <path d="M6 72C10 70 14 74 18 72C22 70 26 74 30 72C34 70 38 74 42 72C46 70 50 74 54 72C58 70 62 74 66 72C70 70 74 74 78 72" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 76C14 74.5 18 77.5 22 76C26 74.5 30 77.5 34 76C38 74.5 42 77.5 46 76C50 74.5 54 77.5 58 76C62 74.5 66 77.5 70 76" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      {/* Shore Pier */}
      <rect x="8" y="58" width="20" height="6" rx="1" fill={color} opacity="0.8" />
      <line x1="12" y1="64" x2="12" y2="72" stroke={color} strokeWidth="2" />
      <line x1="22" y1="64" x2="22" y2="72" stroke={color} strokeWidth="2" />
      {/* Teakwood Cantilever Main Beam */}
      <line x1="16" y1="58" x2="48" y2="24" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      {/* Balance counterweights */}
      <line x1="16" y1="58" x2="10" y2="40" stroke={accent} strokeWidth="2" />
      <circle cx="10" cy="40" r="3.5" fill={accent} />
      {/* Suspended Net Arms */}
      <line x1="48" y1="24" x2="68" y2="38" stroke={color} strokeWidth="2" />
      <line x1="48" y1="24" x2="62" y2="60" stroke={color} strokeWidth="2" />
      <line x1="48" y1="24" x2="38" y2="56" stroke={color} strokeWidth="2" />
      {/* Sagging Net mesh */}
      <path d="M68 38C66 52 58 64 38 56" stroke={accent} strokeWidth="2" strokeDasharray="3 3" fill={accent} opacity="0.2" />
      {/* Coconut Palm on Shore */}
      <path d="M72 70C70 56 64 48 56 46" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M56 46C50 42 46 44 44 48" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M56 46C60 40 66 40 70 42" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M56 46C56 38 52 36 48 36" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function JaipurLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Hawa Mahal (Palace of Winds) honeycomb facade
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="68" width="56" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Pyramidal tiers of casements */}
      <rect x="16" y="56" width="48" height="12" rx="1" stroke={color} strokeWidth="2" />
      <rect x="22" y="44" width="36" height="12" rx="1" stroke={color} strokeWidth="2" />
      <rect x="28" y="32" width="24" height="12" rx="1" stroke={color} strokeWidth="2" fill={accent} opacity="0.2" />
      <rect x="34" y="20" width="12" height="12" rx="1" stroke={color} strokeWidth="2" />
      {/* Top crown chhatri */}
      <path d="M34 20C34 14 37 10 40 10C43 10 46 14 46 20" fill={accent} stroke={color} strokeWidth="2" />
      {/* Honeycomb Jharokhas */}
      <path d="M22 64C22 60 26 60 26 64" stroke={accent} strokeWidth="1.8" />
      <path d="M34 64C34 60 38 60 38 64" stroke={accent} strokeWidth="1.8" />
      <path d="M46 64C46 60 50 60 50 64" stroke={accent} strokeWidth="1.8" />
      <path d="M58 64C58 60 62 60 62 64" stroke={accent} strokeWidth="1.8" />
      <path d="M28 52C28 48 32 48 32 52" stroke={accent} strokeWidth="1.8" />
      <path d="M40 52C40 48 44 48 44 52" stroke={accent} strokeWidth="1.8" />
      <path d="M52 52C52 48 56 48 56 52" stroke={accent} strokeWidth="1.8" />
    </svg>
  );
}

export function GoaLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Goa colonial chapel & twin coastal palms
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="68" width="60" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Portuguese Church facade */}
      <rect x="24" y="38" width="32" height="30" rx="1" stroke={color} strokeWidth="2" fill={accent} opacity="0.15" />
      <path d="M34 68V54C34 50 37 48 40 48C43 48 46 50 46 54V68" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Triangular pediment & belfry */}
      <polygon points="24,38 56,38 40,24" stroke={color} strokeWidth="2" strokeLinejoin="round" fill={color} opacity="0.1" />
      <rect x="36" y="14" width="8" height="10" rx="1" stroke={color} strokeWidth="1.8" />
      <circle cx="40" cy="19" r="1.5" fill={accent} />
      <line x1="40" y1="14" x2="40" y2="8" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <line x1="37" y1="10" x2="43" y2="10" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      {/* Twin Swaying Coconut Palms */}
      <path d="M16 68C14 54 18 40 22 32" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 32C16 30 12 34 10 38" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 32C24 24 20 22 16 22" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 32C28 28 32 32 34 36" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M68 68C66 54 62 42 58 34" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M58 34C62 26 68 28 72 32" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GenericCityLandmark({ size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  // Modern urban skyline with expressway ribbon
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="10" y="68" width="60" height="4" rx="1.5" fill={color} opacity="0.8" />
      {/* Building 1 */}
      <rect x="14" y="38" width="12" height="30" rx="1" stroke={color} strokeWidth="2" />
      <circle cx="20" cy="46" r="1.2" fill={accent} />
      <circle cx="20" cy="54" r="1.2" fill={accent} />
      {/* Building 2 - Skyscraper */}
      <rect x="28" y="18" width="16" height="50" rx="1" stroke={color} strokeWidth="2.2" fill={accent} opacity="0.15" />
      <line x1="36" y1="18" x2="36" y2="8" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <rect x="32" y="26" width="8" height="6" stroke={color} strokeWidth="1.5" />
      <rect x="32" y="38" width="8" height="6" stroke={color} strokeWidth="1.5" />
      <rect x="32" y="50" width="8" height="6" stroke={color} strokeWidth="1.5" />
      {/* Building 3 */}
      <rect x="46" y="28" width="12" height="40" rx="1" stroke={color} strokeWidth="2" />
      <line x1="52" y1="28" x2="52" y2="68" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Building 4 */}
      <polygon points="60,68 68,68 64,48" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// Map city identifiers to their landmark components
export const CITY_LANDMARKS = {
  mumbai: MumbaiLandmark,
  bombay: MumbaiLandmark,
  'delhi-ncr': DelhiLandmark,
  delhi: DelhiLandmark,
  ncr: DelhiLandmark,
  gurgaon: DelhiLandmark,
  noida: DelhiLandmark,
  bengaluru: BengaluruLandmark,
  bangalore: BengaluruLandmark,
  hyderabad: HyderabadLandmark,
  chandigarh: ChandigarhLandmark,
  ahmedabad: AhmedabadLandmark,
  pune: PuneLandmark,
  chennai: ChennaiLandmark,
  kolkata: KolkataLandmark,
  calcutta: KolkataLandmark,
  kochi: KochiLandmark,
  cochin: KochiLandmark,
  jaipur: JaipurLandmark,
  goa: GoaLandmark
};

export default function CityLandmarkIcon({ cityKey, size = 56, color = 'currentColor', accent = '#00AFF5', className = '' }) {
  const normalized = String(cityKey || '').toLowerCase().trim().replace(/\s+/g, '-');
  const Component = CITY_LANDMARKS[normalized] || GenericCityLandmark;
  return <Component size={size} color={color} accent={accent} className={className} />;
}
