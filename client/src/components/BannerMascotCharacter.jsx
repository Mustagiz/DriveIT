import React from 'react';
import styles from './BannerMascotCharacter.module.css';

/**
 * Animated Vector/SVG Mascot Characters for DriveIT Banner Ads
 * Types: 'eco_pilot' | 'road_captain' | 'fastag_bot' | 'exec_guard' | 'roadtrip_explorer'
 */
export default function BannerMascotCharacter({ type = 'eco_pilot', color = '#10B981', mood = 'happy' }) {
  return (
    <div className={styles.mascotWrapper} data-type={type}>
      {/* Dynamic Ambient Glow Backdrop */}
      <div 
        className={styles.glowBackdrop} 
        style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }}
      />

      {/* Floating Interactive Speech Bubble */}
      <div className={styles.speechBubble} style={{ borderColor: `${color}66` }}>
        {type === 'eco_pilot' && <span>⚡ Zero Emissions!</span>}
        {type === 'road_captain' && <span>💰 100% Fuel Offset!</span>}
        {type === 'fastag_bot' && <span>🛣️ 0-Sec Toll Halt!</span>}
        {type === 'exec_guard' && <span>🛡️ ₹5L Protected!</span>}
        {type === 'roadtrip_explorer' && <span>🏖️ Weekend Vibes!</span>}
      </div>

      {/* ======================================================== */}
      {/* 1. ECO PILOT CHARACTER (Tata Nexon EV & Green Hero)       */}
      {/* ======================================================== */}
      {type === 'eco_pilot' && (
        <svg viewBox="0 0 200 220" className={styles.characterSvg} aria-label="Eco Pilot Character">
          <defs>
            <linearGradient id="ecoSuitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="ecoVisorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Floating Eco Leaves */}
          <g className={styles.floatingLeaf1}>
            <path d="M40 70 Q30 50 50 45 Q60 65 40 70 Z" fill="#34D399" opacity="0.85" />
          </g>
          <g className={styles.floatingLeaf2}>
            <path d="M165 90 Q180 75 165 60 Q150 75 165 90 Z" fill="#10B981" opacity="0.85" />
          </g>

          {/* Body & Pilot Jacket */}
          <ellipse cx="100" cy="170" rx="46" ry="38" fill="url(#ecoSuitGrad)" />
          <path d="M82 145 L100 178 L118 145 Z" fill="#F8FAFC" opacity="0.9" />
          
          {/* EV Charging Lightning Badge */}
          <polygon points="100,152 94,164 100,164 96,174 106,161 100,161" fill="#FBBF24" />

          {/* Pilot Head */}
          <circle cx="100" cy="100" r="38" fill="#FBBF24" />
          
          {/* Pilot Cap / Helmet */}
          <path d="M62 95 Q100 55 138 95 L144 102 Q100 88 56 102 Z" fill="#065F46" />
          <circle cx="100" cy="74" r="6" fill="#34D399" />

          {/* Futuristic Visor / Sunglasses */}
          <rect x="74" y="90" width="52" height="18" rx="9" fill="url(#ecoVisorGrad)" opacity="0.95" />
          <rect x="79" y="93" width="18" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />

          {/* Happy Smile */}
          <path d="M90 120 Q100 130 110 120" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="82" cy="118" r="4" fill="#F87171" opacity="0.6" />
          <circle cx="118" cy="118" r="4" fill="#F87171" opacity="0.6" />

          {/* Waving Animated Hand (Thumbs Up) */}
          <g className={styles.wavingHand}>
            <circle cx="145" cy="150" r="14" fill="#FBBF24" />
            <rect x="142" y="132" width="7" height="12" rx="3.5" fill="#FBBF24" transform="rotate(-15 142 132)" />
            <circle cx="144" cy="132" r="3.5" fill="#F59E0B" />
          </g>

          {/* Left Driving Hand */}
          <circle cx="55" cy="160" r="13" fill="#FBBF24" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 2. ROAD CAPTAIN CHARACTER (Earnings & Car Owner)         */}
      {/* ======================================================== */}
      {type === 'road_captain' && (
        <svg viewBox="0 0 200 220" className={styles.characterSvg} aria-label="Road Captain Character">
          <defs>
            <linearGradient id="captainJacket" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>

          {/* Spinning Golden Coin */}
          <g className={styles.spinningCoin}>
            <circle cx="160" cy="65" r="18" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="160" y="72" textAnchor="middle" fontSize="16" fontWeight="900" fill="#78350F">₹</text>
          </g>

          {/* Body & Leather Jacket */}
          <ellipse cx="100" cy="172" rx="48" ry="38" fill="url(#captainJacket)" />
          <rect x="88" y="148" width="24" height="36" fill="#1E293B" rx="4" />
          
          {/* Captain Head */}
          <circle cx="100" cy="98" r="38" fill="#FED7AA" />
          
          {/* Aviator Sunglasses */}
          <path d="M72 88 Q85 86 96 90 Q96 108 83 108 Q72 108 72 88 Z" fill="#0F172A" />
          <path d="M104 90 Q115 86 128 88 Q128 108 117 108 Q104 108 104 90 Z" fill="#0F172A" />
          <line x1="94" y1="91" x2="106" y2="91" stroke="#F59E0B" strokeWidth="2.5" />
          <line x1="78" y1="93" x2="88" y2="93" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />

          {/* Cool Smile */}
          <path d="M88 120 Q100 132 112 120" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Steering Wheel Holding */}
          <g className={styles.steeringWheel}>
            <circle cx="60" cy="155" r="22" fill="none" stroke="#334155" strokeWidth="6" />
            <circle cx="60" cy="155" r="7" fill="#F59E0B" />
            <line x1="42" y1="155" x2="78" y2="155" stroke="#334155" strokeWidth="4" />
          </g>

          {/* Thumbs Up Hand */}
          <circle cx="140" cy="150" r="14" fill="#FED7AA" />
          <rect x="138" y="132" width="7" height="12" rx="3.5" fill="#FED7AA" transform="rotate(-15 138 132)" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 3. FASTAG ROBOT / SPEEDY BOT (RFID Clearance)            */}
      {/* ======================================================== */}
      {type === 'fastag_bot' && (
        <svg viewBox="0 0 200 220" className={styles.characterSvg} aria-label="FASTag Bot Character">
          <defs>
            <linearGradient id="botMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
            <linearGradient id="rfidScreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Pulsing RFID Waves */}
          <g className={styles.rfidWaves}>
            <path d="M140 45 A 25 25 0 0 1 175 75" fill="none" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d="M148 55 A 15 15 0 0 1 168 75" fill="none" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Robot Body */}
          <rect x="62" y="135" width="76" height="54" rx="20" fill="url(#botMetal)" />
          
          {/* FASTag Chest Badge */}
          <rect x="76" y="148" width="48" height="24" rx="8" fill="#F8FAFC" />
          <text x="100" y="164" textAnchor="middle" fontSize="10" fontWeight="900" fill="#7C3AED">FASTag</text>

          {/* Robot Head */}
          <rect x="64" y="66" width="72" height="60" rx="24" fill="url(#botMetal)" />
          
          {/* Antenna */}
          <line x1="100" y1="66" x2="100" y2="44" stroke="#A78BFA" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="40" r="7" fill="#34D399" className={styles.antennaBlink} />

          {/* Screen Visor */}
          <rect x="72" y="78" width="56" height="36" rx="14" fill="url(#rfidScreen)" />
          
          {/* Glowing Green Express Eyes */}
          <ellipse cx="88" cy="94" rx="6" ry="8" fill="#34D399" className={styles.botEye} />
          <ellipse cx="112" cy="94" rx="6" ry="8" fill="#34D399" className={styles.botEye} />

          {/* Robot Floating Wheels / Thrusters */}
          <ellipse cx="80" cy="194" rx="12" ry="6" fill="#38BDF8" opacity="0.8" />
          <ellipse cx="120" cy="194" rx="12" ry="6" fill="#38BDF8" opacity="0.8" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 4. CORPORATE EXEC & SHIELD GUARD (₹5L Insurance)          */}
      {/* ======================================================== */}
      {type === 'exec_guard' && (
        <svg viewBox="0 0 200 220" className={styles.characterSvg} aria-label="Executive Shield Character">
          <defs>
            <linearGradient id="suitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="shieldGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Glowing Shield on Left */}
          <g className={styles.glowingShield}>
            <path d="M42 90 Q65 85 65 110 Q65 145 42 160 Q20 145 20 110 Q20 85 42 90 Z" fill="url(#shieldGold)" stroke="#93C5FD" strokeWidth="2.5" />
            <path d="M35 125 L40 132 L52 115" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>

          {/* Body in Executive Suit */}
          <ellipse cx="110" cy="172" rx="44" ry="38" fill="url(#suitGrad)" />
          <polygon points="110,148 103,176 110,184 117,176" fill="#EF4444" />
          <polygon points="104,146 110,154 116,146" fill="#F8FAFC" />

          {/* Executive Head */}
          <circle cx="110" cy="96" r="36" fill="#FDE68A" />

          {/* Hair */}
          <path d="M80 92 Q110 60 140 82 Q140 68 110 65 Q80 68 80 92 Z" fill="#1E293B" />

          {/* Smart Glasses */}
          <rect x="90" y="88" width="18" height="14" rx="4" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <rect x="114" y="88" width="18" height="14" rx="4" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <line x1="108" y1="94" x2="114" y2="94" stroke="#1E293B" strokeWidth="2" />
          <circle cx="99" cy="95" r="2.5" fill="#1E293B" />
          <circle cx="123" cy="95" r="2.5" fill="#1E293B" />

          {/* Confident Smile */}
          <path d="M102 118 Q110 126 118 118" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {/* ======================================================== */}
      {/* 5. ROADTRIP EXPLORER (Weekend Vibes & Escapes)           */}
      {/* ======================================================== */}
      {type === 'roadtrip_explorer' && (
        <svg viewBox="0 0 200 220" className={styles.characterSvg} aria-label="Roadtrip Explorer Character">
          <defs>
            <linearGradient id="explorerShirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#DB2777" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>

          {/* Floating Music Notes */}
          <g className={styles.floatingNote1}>
            <text x="35" y="70" fontSize="20" fill="#F472B6">🎵</text>
          </g>
          <g className={styles.floatingNote2}>
            <text x="165" y="60" fontSize="22" fill="#FBBF24">☀️</text>
          </g>

          {/* Explorer Body */}
          <ellipse cx="100" cy="172" rx="46" ry="38" fill="url(#explorerShirt)" />
          
          {/* Camera around Neck */}
          <rect x="88" y="152" width="24" height="16" rx="4" fill="#0F172A" />
          <circle cx="100" cy="160" r="5" fill="#38BDF8" />
          <path d="M84 140 Q100 152 116 140" stroke="#475569" strokeWidth="2" fill="none" />

          {/* Explorer Head */}
          <circle cx="100" cy="96" r="38" fill="#FCD34D" />

          {/* Funky Straw Hat / Cap */}
          <ellipse cx="100" cy="74" rx="48" ry="12" fill="#F59E0B" />
          <ellipse cx="100" cy="68" rx="26" ry="16" fill="#D97706" />

          {/* Retro Sunglasses */}
          <rect x="74" y="88" width="22" height="16" rx="6" fill="#EC4899" />
          <rect x="104" y="88" width="22" height="16" rx="6" fill="#EC4899" />
          <line x1="96" y1="94" x2="104" y2="94" stroke="#F472B6" strokeWidth="2.5" />
          <line x1="77" y1="92" x2="88" y2="92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

          {/* Big Happy Grin */}
          <path d="M86 116 Q100 134 114 116 Z" fill="#78350F" />
          <path d="M90 118 Q100 126 110 118" fill="#F87171" />

          {/* Peace Sign Hand */}
          <g className={styles.wavingHand}>
            <circle cx="145" cy="140" r="12" fill="#FCD34D" />
            <rect x="140" y="120" width="5" height="14" rx="2.5" fill="#FCD34D" transform="rotate(-15 140 120)" />
            <rect x="148" y="122" width="5" height="14" rx="2.5" fill="#FCD34D" transform="rotate(15 148 122)" />
          </g>
        </svg>
      )}
    </div>
  );
}
