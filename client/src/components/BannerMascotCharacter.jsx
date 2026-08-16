import React from 'react';
import styles from './BannerMascotCharacter.module.css';

/**
 * Premium 3D-Illustrated Vector Mascot Characters for DriveIT Banner Ads
 * Types: 'eco_pilot' | 'road_captain' | 'fastag_bot' | 'exec_guard' | 'roadtrip_explorer'
 */
export default function BannerMascotCharacter({ type = 'eco_pilot', color = '#10B981', mood = 'happy' }) {
  return (
    <div className={styles.mascotWrapper} data-type={type}>
      {/* 3D Dynamic Ambient Glow Backdrop */}
      <div 
        className={styles.glowBackdrop} 
        style={{ background: `radial-gradient(circle, ${color}40 0%, ${color}10 50%, transparent 75%)` }}
      />

      {/* Floating Interactive Speech Bubble */}
      <div className={styles.speechBubble} style={{ 
        borderColor: `${color}88`,
        boxShadow: `0 8px 24px ${color}33, 0 4px 12px rgba(0,0,0,0.5)`
      }}>
        {type === 'eco_pilot' && <span>⚡ 100% Zero Emission!</span>}
        {type === 'road_captain' && <span>💰 Keep 100% Fare!</span>}
        {type === 'fastag_bot' && <span>🛣️ 0-Sec Toll Pass!</span>}
        {type === 'exec_guard' && <span>🛡️ ₹5L Free Cover!</span>}
        {type === 'roadtrip_explorer' && <span>🏖️ Weekend Roadtrip!</span>}
      </div>

      {/* ======================================================== */}
      {/* 1. VOLT — 3D CYBER EV PILOT                              */}
      {/* ======================================================== */}
      {type === 'eco_pilot' && (
        <svg viewBox="0 0 220 240" className={styles.characterSvg} aria-label="Volt the EV Pilot">
          <defs>
            <linearGradient id="voltHelmetGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="voltVisorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="40%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="voltSuitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="60%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="voltGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Floating Energy Rings & Eco Leaves */}
          <g className={styles.floatingLeaf1}>
            <circle cx="35" cy="70" r="18" fill="#10B981" opacity="0.15" />
            <path d="M35 80 Q25 60 45 55 Q55 75 35 80 Z" fill="#34D399" filter="url(#softShadow)" />
          </g>
          <g className={styles.floatingLeaf2}>
            <circle cx="185" cy="85" r="16" fill="#34D399" opacity="0.15" />
            <path d="M185 95 Q200 80 185 65 Q170 80 185 95 Z" fill="#10B981" filter="url(#softShadow)" />
          </g>

          {/* Character Body / Cyber Flight Suit */}
          <ellipse cx="110" cy="180" rx="54" ry="44" fill="url(#voltSuitGrad)" filter="url(#softShadow)" />
          
          {/* Cyber Armor Neon Panels */}
          <path d="M85 150 L110 185 L135 150 Z" fill="#047857" stroke="#10B981" strokeWidth="2" />
          <polygon points="110,158 102,172 110,172 106,184 118,168 110,168" fill="url(#voltGold)" />

          {/* Pilot Head */}
          <circle cx="110" cy="100" r="44" fill="#FDE68A" filter="url(#softShadow)" />
          
          {/* 3D Aerodynamic Pilot Helmet */}
          <path d="M66 96 C66 52, 154 52, 154 96 C154 116, 142 112, 110 112 C78 112, 66 116, 66 96 Z" fill="url(#voltHelmetGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
          
          {/* Helmet Top Aero Fin & Badge */}
          <path d="M102 54 L110 42 L118 54 Z" fill="url(#voltGold)" />
          <circle cx="110" cy="72" r="7" fill="url(#voltGold)" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Glossy Curved Visor with Cyber Horizon Reflection */}
          <rect x="78" y="86" width="64" height="24" rx="12" fill="url(#voltVisorGrad)" stroke="#FFFFFF" strokeWidth="1.8" filter="url(#softShadow)" />
          <path d="M84 90 Q110 92 136 90" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <rect x="88" y="98" width="16" height="4" rx="2" fill="#FFFFFF" opacity="0.9" />

          {/* Expressive Warm Smile & Cheeks */}
          <path d="M98 126 Q110 138 122 126" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse cx="88" cy="124" rx="5" ry="3.5" fill="#F87171" opacity="0.6" />
          <ellipse cx="132" cy="124" rx="5" ry="3.5" fill="#F87171" opacity="0.6" />

          {/* Waving High-Tech Pilot Glove (Thumbs Up) */}
          <g className={styles.wavingHand}>
            <circle cx="165" cy="155" r="16" fill="url(#voltHelmetGrad)" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#softShadow)" />
            <rect x="160" y="132" width="10" height="16" rx="5" fill="url(#voltHelmetGrad)" stroke="#FFFFFF" strokeWidth="1.2" transform="rotate(-15 160 132)" />
            <circle cx="163" cy="132" r="4" fill="url(#voltGold)" />
          </g>

          {/* Left Rest Hand */}
          <circle cx="55" cy="165" r="15" fill="url(#voltHelmetGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 2. VIKRAM — 3D SUAVE ROAD CAPTAIN (Earnings Pro)         */}
      {/* ======================================================== */}
      {type === 'road_captain' && (
        <svg viewBox="0 0 220 240" className={styles.characterSvg} aria-label="Vikram Road Captain">
          <defs>
            <linearGradient id="leatherJacket" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="goldCoinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="aviatorGlare" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>

          {/* Floating 3D Golden Rupee Medal */}
          <g className={styles.spinningCoin}>
            <circle cx="180" cy="65" r="22" fill="url(#goldCoinGrad)" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#softShadow)" />
            <circle cx="180" cy="65" r="17" fill="none" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3,2" />
            <text x="180" y="73" textAnchor="middle" fontSize="20" fontWeight="900" fill="#78350F">₹</text>
          </g>

          {/* Body & Pilot Leather Jacket */}
          <ellipse cx="110" cy="182" rx="56" ry="44" fill="url(#leatherJacket)" filter="url(#softShadow)" />
          
          {/* White Shirt & Silk Tie */}
          <polygon points="110,148 95,178 125,178" fill="#F8FAFC" />
          <polygon points="110,158 104,195 110,205 116,195" fill="#DC2626" />

          {/* Head */}
          <circle cx="110" cy="100" r="42" fill="#FED7AA" filter="url(#softShadow)" />
          
          {/* Captain Hat with Golden Winged Crest */}
          <path d="M68 86 C68 50, 152 50, 152 86 L158 92 C158 92, 110 80, 62 92 Z" fill="#0F172A" />
          <rect x="74" y="82" width="72" height="6" rx="3" fill="#FBBF24" />
          <circle cx="110" cy="74" r="6" fill="url(#goldCoinGrad)" stroke="#FFFFFF" strokeWidth="1.2" />

          {/* Aviator Sunglasses with Sunset Horizon Reflection */}
          <g filter="url(#softShadow)">
            <path d="M78 90 Q92 88 104 92 Q104 114 90 114 Q78 114 78 90 Z" fill="url(#aviatorGlare)" stroke="#F59E0B" strokeWidth="2" />
            <path d="M116 92 Q128 88 142 90 Q142 114 130 114 Q116 114 116 92 Z" fill="url(#aviatorGlare)" stroke="#F59E0B" strokeWidth="2" />
            <line x1="102" y1="92" x2="118" y2="92" stroke="#F59E0B" strokeWidth="3" />
            <path d="M84 94 Q94 94 98 100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d="M122 94 Q132 94 136 100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          </g>

          {/* Confident Smile */}
          <path d="M96 128 Q110 140 124 128" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Steering Wheel Holding */}
          <g className={styles.steeringWheel}>
            <circle cx="110" cy="188" r="32" fill="none" stroke="#334155" strokeWidth="7" filter="url(#softShadow)" />
            <circle cx="110" cy="188" r="28" fill="none" stroke="#F59E0B" strokeWidth="2" />
            <line x1="82" y1="188" x2="138" y2="188" stroke="#334155" strokeWidth="4" />
            <circle cx="110" cy="188" r="7" fill="url(#goldCoinGrad)" />
            
            {/* Driving Hands */}
            <circle cx="80" cy="185" r="10" fill="#FED7AA" stroke="#78350F" strokeWidth="1.5" />
            <circle cx="140" cy="185" r="10" fill="#FED7AA" stroke="#78350F" strokeWidth="1.5" />
          </g>
        </svg>
      )}

      {/* ======================================================== */}
      {/* 3. TAGGY — 3D EXPRESS FASTAG AI BOT                      */}
      {/* ======================================================== */}
      {type === 'fastag_bot' && (
        <svg viewBox="0 0 220 240" className={styles.characterSvg} aria-label="Taggy FASTag Bot">
          <defs>
            <linearGradient id="botChassisGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="botVisorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <linearGradient id="botNeon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>

          {/* Holographic RFID Wave Antenna */}
          <g className={styles.botAntenna}>
            <line x1="110" y1="52" x2="110" y2="30" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            <circle cx="110" cy="24" r="9" fill="url(#botNeon)" stroke="#FFFFFF" strokeWidth="2" filter="url(#softShadow)" />
            <circle cx="110" cy="24" r="15" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.6" strokeDasharray="4,3" />
          </g>

          {/* Robot Body / Pod Chassis */}
          <ellipse cx="110" cy="165" rx="48" ry="42" fill="url(#botChassisGrad)" stroke="#FFFFFF" strokeWidth="2" filter="url(#softShadow)" />
          
          {/* Digital Core Chest Meter */}
          <rect x="92" y="150" width="36" height="20" rx="10" fill="url(#botVisorGrad)" stroke="#6366F1" strokeWidth="1.5" />
          <text x="110" y="164" textAnchor="middle" fontSize="10" fontWeight="900" fill="#38BDF8">RFID ⚡</text>

          {/* Robot Head (Curved 3D Sphere) */}
          <circle cx="110" cy="95" r="42" fill="url(#botChassisGrad)" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#softShadow)" />

          {/* Cyber Glossy Visor Screen */}
          <rect x="76" y="78" width="68" height="34" rx="17" fill="url(#botVisorGrad)" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Expressive Glowing Cyan LED Eyes (^‿^) */}
          <path d="M88 95 Q96 85 104 95" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M116 95 Q124 85 132 95" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="96" cy="92" r="1.5" fill="#FFFFFF" />
          <circle cx="124" cy="92" r="1.5" fill="#FFFFFF" />

          {/* Glowing Golden FASTag Pass in Hand */}
          <g className={styles.wavingHand}>
            <rect x="150" y="125" width="40" height="26" rx="6" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="1.8" filter="url(#softShadow)" transform="rotate(-12 150 125)" />
            <rect x="155" y="132" width="12" height="10" rx="2" fill="#FBBF24" transform="rotate(-12 150 125)" />
            <text x="175" y="142" fontSize="7" fontWeight="900" fill="#FFFFFF" transform="rotate(-12 150 125)">FASTag</text>
          </g>

          {/* Left Magnetic Hand */}
          <circle cx="62" cy="155" r="12" fill="url(#botChassisGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 4. ARIA — 3D EXECUTIVE SAFETY GUARDIAN                   */}
      {/* ======================================================== */}
      {type === 'exec_guard' && (
        <svg viewBox="0 0 220 240" className={styles.characterSvg} aria-label="Aria Executive Guardian">
          <defs>
            <linearGradient id="ariaSuitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>

          {/* Floating 3D Multifaceted Crystal Safety Shield */}
          <g className={styles.spinningCoin}>
            <path d="M175 45 L198 56 C198 84, 175 102, 175 102 C175 102, 152 84, 152 56 Z" fill="url(#shieldGrad)" stroke="#FFFFFF" strokeWidth="2" filter="url(#softShadow)" />
            <path d="M165 72 L172 80 L186 64" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Body & Blazer */}
          <ellipse cx="110" cy="180" rx="52" ry="42" fill="url(#ariaSuitGrad)" filter="url(#softShadow)" />
          <polygon points="110,146 96,176 124,176" fill="#F8FAFC" />
          <rect x="106" y="152" width="8" height="24" fill="#0284C7" />

          {/* Head & Stylish Hairstyle */}
          <circle cx="110" cy="98" r="40" fill="#FDE68A" filter="url(#softShadow)" />
          <path d="M68 95 C68 50, 152 50, 152 95 C152 68, 140 60, 110 60 C80 60, 68 68, 68 95 Z" fill="#451A03" />

          {/* Smart Designer Glasses */}
          <rect x="78" y="88" width="28" height="20" rx="6" fill="rgba(56, 189, 248, 0.2)" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="114" y="88" width="28" height="20" rx="6" fill="rgba(56, 189, 248, 0.2)" stroke="#0F172A" strokeWidth="2.5" />
          <line x1="106" y1="96" x2="114" y2="96" stroke="#0F172A" strokeWidth="2.5" />
          
          {/* Eyes & Smile */}
          <circle cx="92" cy="98" r="3" fill="#0F172A" />
          <circle cx="128" cy="98" r="3" fill="#0F172A" />
          <path d="M98 124 Q110 134 122 124" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Holding Shield Hand */}
          <circle cx="158" cy="148" r="12" fill="#FDE68A" stroke="#451A03" strokeWidth="1.5" />
          <circle cx="62" cy="160" r="12" fill="#FDE68A" stroke="#451A03" strokeWidth="1.5" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 5. SUNNY — 3D WEEKEND ROADTRIP EXPLORER                  */}
      {/* ======================================================== */}
      {type === 'roadtrip_explorer' && (
        <svg viewBox="0 0 220 240" className={styles.characterSvg} aria-label="Sunny Roadtrip Explorer">
          <defs>
            <linearGradient id="sunnyHatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="cameraGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>

          {/* Floating Musical Notes */}
          <g className={styles.floatingLeaf1}>
            <text x="180" y="55" fontSize="24" fill="#EC4899" filter="url(#softShadow)">🎵</text>
          </g>
          <g className={styles.floatingLeaf2}>
            <text x="35" y="65" fontSize="20" fill="#F59E0B" filter="url(#softShadow)">✨</text>
          </g>

          {/* Body & Vacation Hawaiian Shirt */}
          <ellipse cx="110" cy="180" rx="52" ry="42" fill="#EC4899" filter="url(#softShadow)" />
          <path d="M85 150 L110 180 L135 150 Z" fill="#FDE047" />

          {/* Retro Neck Camera */}
          <rect x="90" y="162" width="40" height="26" rx="6" fill="url(#cameraGrad)" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#softShadow)" />
          <circle cx="110" cy="175" r="7" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="110" cy="175" r="3" fill="#38BDF8" />

          {/* Head */}
          <circle cx="110" cy="98" r="40" fill="#FED7AA" filter="url(#softShadow)" />

          {/* Explorer Straw Sunhat */}
          <ellipse cx="110" cy="74" rx="62" ry="16" fill="url(#sunnyHatGrad)" stroke="#78350F" strokeWidth="1.5" filter="url(#softShadow)" />
          <path d="M78 72 C78 40, 142 40, 142 72 Z" fill="url(#sunnyHatGrad)" stroke="#78350F" strokeWidth="1.5" />
          <rect x="78" y="68" width="64" height="6" fill="#EC4899" />

          {/* Mirrored Sunglasses with Tropical Glare */}
          <rect x="80" y="90" width="26" height="18" rx="6" fill="#0F172A" stroke="#F43F5E" strokeWidth="2" />
          <rect x="114" y="90" width="26" height="18" rx="6" fill="#0F172A" stroke="#F43F5E" strokeWidth="2" />
          <line x1="106" y1="96" x2="114" y2="96" stroke="#F43F5E" strokeWidth="2.5" />
          <path d="M84 94 Q94 94 96 100" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <path d="M118 94 Q128 94 130 100" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />

          {/* Big Vacation Smile */}
          <path d="M96 124 Q110 138 124 124" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Peace Sign Animated Hand */}
          <g className={styles.wavingHand}>
            <circle cx="165" cy="148" r="14" fill="#FED7AA" stroke="#78350F" strokeWidth="1.2" filter="url(#softShadow)" />
            <line x1="160" y1="135" x2="157" y2="120" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
            <line x1="168" y1="135" x2="173" y2="120" stroke="#FED7AA" strokeWidth="5" strokeLinecap="round" />
          </g>

          {/* Left Rest Hand */}
          <circle cx="58" cy="162" r="13" fill="#FED7AA" stroke="#78350F" strokeWidth="1.2" />
        </svg>
      )}
    </div>
  );
}
