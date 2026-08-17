// 2D Marvel Superheroes & 2D Urban Character Avatars for Driveit Studio

const createSvgDataUrl = (svgContent) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

// ==========================================
// 1. 2D MARVEL SUPERHEROES (Vector SVG)
// ==========================================

const spidermanSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#E11D48" stroke="#9F1239" stroke-width="4"/>
  <path d="M60 20 L60 100 M20 60 L100 60 M30 30 L90 90 M30 90 L90 30" stroke="#000000" stroke-width="2.5" opacity="0.3"/>
  <ellipse cx="60" cy="60" rx="30" ry="30" fill="none" stroke="#000000" stroke-width="2" opacity="0.3"/>
  <path d="M36 48 C36 48 48 44 54 58 C46 64 36 56 36 48 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4.5"/>
  <path d="M84 48 C84 48 72 44 66 58 C74 64 84 56 84 48 Z" fill="#FFFFFF" stroke="#000000" stroke-width="4.5"/>
</svg>
`);

const ironmanSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#991B1B" stroke="#7F1D1D" stroke-width="4"/>
  <path d="M38 32 H82 L88 64 L74 94 H46 L32 64 Z" fill="#A3E635" stroke="#65A30D" stroke-width="3"/>
  <path d="M48 32 L44 54 H76 L72 32 Z" fill="#84CC16"/>
  <rect x="42" y="58" width="14" height="6" rx="2" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
  <rect x="64" y="58" width="14" height="6" rx="2" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5"/>
  <line x1="50" y1="78" x2="70" y2="78" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

const captainAmericaSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#1D4ED8" stroke="#1E40AF" stroke-width="4"/>
  <path d="M34 40 C34 26 86 26 86 40 L86 70 L60 88 L34 70 Z" fill="#2563EB" stroke="#1E3A8A" stroke-width="3"/>
  <text x="60" y="52" font-family="Arial Black, Impact, sans-serif" font-size="22" font-weight="900" text-anchor="middle" fill="#FFFFFF">A</text>
  <ellipse cx="48" cy="64" rx="7" ry="4" fill="#F8FAFC" stroke="#1E3A8A" stroke-width="2"/>
  <ellipse cx="72" cy="64" rx="7" ry="4" fill="#F8FAFC" stroke="#1E3A8A" stroke-width="2"/>
</svg>
`);

const blackPantherSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#0F172A" stroke="#334155" stroke-width="4"/>
  <polygon points="32,24 44,42 26,42" fill="#1E293B"/>
  <polygon points="88,24 94,42 76,42" fill="#1E293B"/>
  <path d="M34 38 C34 38 60 30 86 38 L86 76 L60 98 L34 76 Z" fill="#1E293B" stroke="#475569" stroke-width="3"/>
  <polygon points="40,54 54,58 44,66" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
  <polygon points="80,54 66,58 76,66" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1.5"/>
  <path d="M48 76 L60 88 L72 76" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`);

const thorSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#0284C7" stroke="#0369A1" stroke-width="4"/>
  <polygon points="20,30 36,48 24,56" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <polygon points="100,30 84,48 96,56" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <path d="M36 36 H84 L80 66 L60 82 L40 66 Z" fill="#94A3B8" stroke="#475569" stroke-width="3"/>
  <circle cx="48" cy="58" r="5" fill="#38BDF8"/>
  <circle cx="72" cy="58" r="5" fill="#38BDF8"/>
  <path d="M46 72 L60 90 L74 72" fill="#84CC16" stroke="#65A30D" stroke-width="2"/>
</svg>
`);

const wolverineSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#EAB308" stroke="#84CC16" stroke-width="4"/>
  <path d="M22 18 C32 40 40 50 46 64 L30 76 C20 54 18 32 22 18 Z" fill="#0F172A"/>
  <path d="M98 18 C88 40 80 50 74 64 L90 76 C100 54 102 32 98 18 Z" fill="#0F172A"/>
  <path d="M44 42 H76 L70 78 L60 88 L50 78 Z" fill="#FACC15" stroke="#84CC16" stroke-width="2"/>
  <polygon points="46,58 56,62 48,68" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
  <polygon points="74,58 64,62 72,68" fill="#FFFFFF" stroke="#000000" stroke-width="2"/>
</svg>
`);

const deadpoolSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#DC2626" stroke="#991B1B" stroke-width="4"/>
  <ellipse cx="44" cy="60" rx="16" ry="20" fill="#0F172A"/>
  <ellipse cx="76" cy="60" rx="16" ry="20" fill="#0F172A"/>
  <ellipse cx="44" cy="58" rx="7" ry="5" fill="#FFFFFF" transform="rotate(-10 44 58)"/>
  <ellipse cx="76" cy="58" rx="7" ry="5" fill="#FFFFFF" transform="rotate(10 76 58)"/>
</svg>
`);

const doctorStrangeSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#4338CA" stroke="#312E81" stroke-width="4"/>
  <polygon points="26,30 46,74 30,86" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
  <polygon points="94,30 74,74 90,86" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
  <circle cx="60" cy="56" r="22" fill="#FED7AA"/>
  <path d="M38 52 C42 40 50 36 60 36 C70 36 78 40 82 52 C76 44 68 40 60 40 C52 40 44 44 38 52 Z" fill="#1E293B"/>
  <path d="M38 52 L42 46 M82 52 L78 46" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="60" cy="88" rx="9" ry="6" fill="#84CC16" stroke="#65A30D" stroke-width="2"/>
  <circle cx="60" cy="88" r="3" fill="#10B981"/>
</svg>
`);

const hulkSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#15803D" stroke="#166534" stroke-width="4"/>
  <path d="M34 44 C38 26 50 24 60 24 C70 24 82 26 86 44 C80 34 70 30 60 30 C50 30 40 34 34 44 Z" fill="#0F172A"/>
  <path d="M40 54 L54 58 M80 54 L66 58" stroke="#052E16" stroke-width="4" stroke-linecap="round"/>
  <circle cx="48" cy="64" r="4" fill="#86EFAC" stroke="#052E16" stroke-width="2"/>
  <circle cx="72" cy="64" r="4" fill="#86EFAC" stroke="#052E16" stroke-width="2"/>
  <path d="M44 80 Q60 76 76 80 Q60 92 44 80 Z" fill="#052E16"/>
  <line x1="48" y1="80" x2="72" y2="80" stroke="#FFFFFF" stroke-width="2"/>
</svg>
`);

const lokiSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#047857" stroke="#065F46" stroke-width="4"/>
  <path d="M34 44 C24 16 16 10 10 14 C12 24 24 38 32 50 Z" fill="#A3E635" stroke="#65A30D" stroke-width="2"/>
  <path d="M86 44 C96 16 104 10 110 14 C108 24 96 38 88 50 Z" fill="#A3E635" stroke="#65A30D" stroke-width="2"/>
  <path d="M34 44 H86 L78 60 H42 Z" fill="#84CC16" stroke="#65A30D" stroke-width="2"/>
  <circle cx="48" cy="68" r="4" fill="#10B981"/>
  <circle cx="72" cy="68" r="4" fill="#10B981"/>
  <path d="M50 82 Q60 88 74 78" fill="none" stroke="#064E3B" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

// ==========================================
// 2. 2D URBAN CHARACTERS (Vector SVG)
// ==========================================

// Urban 1: Pilot Aviator with Sunglasses
const urbanPilotSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#84CC16" stroke="#65A30D" stroke-width="4"/>
  <!-- Head & Hair -->
  <path d="M34 42 C34 26 86 26 86 42 L86 64 C86 78 74 90 60 90 C46 90 34 78 34 64 Z" fill="#FFEDD5"/>
  <path d="M30 40 C34 22 52 18 60 18 C68 18 86 22 90 40 C84 32 74 30 60 30 C46 30 36 32 30 40 Z" fill="#1E293B"/>
  <!-- Cool Aviator Sunglasses -->
  <path d="M36 50 H56 L54 68 C54 74 42 74 38 68 Z" fill="#0F172A" stroke="#84CC16" stroke-width="2"/>
  <path d="M64 50 H84 L82 68 C82 74 70 74 66 68 Z" fill="#0F172A" stroke="#84CC16" stroke-width="2"/>
  <line x1="56" y1="53" x2="64" y2="53" stroke="#84CC16" stroke-width="2"/>
  <!-- Smile -->
  <path d="M52 78 Q60 84 68 78" fill="none" stroke="#78350F" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`);

// Urban 2: Tech Nomad with Headphones
const urbanTechNomadSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#6366F1" stroke="#4F46E5" stroke-width="4"/>
  <!-- Headphone Band -->
  <path d="M26 56 C26 28 94 28 94 56" fill="none" stroke="#0F172A" stroke-width="5" stroke-linecap="round"/>
  <!-- Head & Glasses -->
  <circle cx="60" cy="60" r="28" fill="#FED7AA"/>
  <path d="M32 46 C36 28 50 26 60 26 C70 26 84 28 88 46 C80 36 68 34 60 34 C52 34 40 36 32 46 Z" fill="#475569"/>
  <!-- Round Glasses -->
  <circle cx="48" cy="58" r="8" fill="none" stroke="#1E293B" stroke-width="2.5"/>
  <circle cx="72" cy="58" r="8" fill="none" stroke="#1E293B" stroke-width="2.5"/>
  <line x1="56" y1="58" x2="64" y2="58" stroke="#1E293B" stroke-width="2.5"/>
  <!-- Headphone Cups -->
  <rect x="20" y="48" width="10" height="20" rx="5" fill="#10B981"/>
  <rect x="90" y="48" width="10" height="20" rx="5" fill="#10B981"/>
</svg>
`);

// Urban 3: Executive Leader with Tie
const urbanExecutiveSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#0EA5E9" stroke="#0284C7" stroke-width="4"/>
  <!-- Head & Clean Haircut -->
  <circle cx="60" cy="52" r="26" fill="#BBF7D0"/>
  <path d="M34 44 C38 24 54 22 66 22 C78 22 86 28 86 44 C82 34 72 30 62 30 C50 30 40 34 34 44 Z" fill="#1E293B"/>
  <!-- Eyes & Smile -->
  <circle cx="50" cy="52" r="3" fill="#1E293B"/>
  <circle cx="70" cy="52" r="3" fill="#1E293B"/>
  <path d="M52 64 Q60 70 68 64" fill="none" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
  <!-- White Collar & Red Tie -->
  <polygon points="46,80 60,98 74,80" fill="#FFFFFF"/>
  <polygon points="56,84 64,84 62,112 58,112" fill="#EF4444"/>
</svg>
`);

// Urban 4: Metro Designer with Bob Cut
const urbanDesignerSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#EC4899" stroke="#DB2777" stroke-width="4"/>
  <!-- Bob Haircut Back -->
  <path d="M30 40 C30 20 90 20 90 40 L94 76 L82 82 L80 60 L40 60 L38 82 L26 76 Z" fill="#1E293B"/>
  <!-- Face -->
  <circle cx="60" cy="58" r="24" fill="#FFEDD5"/>
  <!-- Chic Glasses -->
  <rect x="40" y="52" width="16" height="10" rx="3" fill="none" stroke="#9333EA" stroke-width="2.5"/>
  <rect x="64" y="52" width="16" height="10" rx="3" fill="none" stroke="#9333EA" stroke-width="2.5"/>
  <line x1="56" y1="57" x2="64" y2="57" stroke="#9333EA" stroke-width="2.5"/>
  <!-- Smile -->
  <path d="M53 74 Q60 80 67 74" fill="none" stroke="#9F1239" stroke-width="2" stroke-linecap="round"/>
</svg>
`);

// Urban 5: Highway Cruiser with Beanie
const urbanCruiserSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#14B8A6" stroke="#0D9488" stroke-width="4"/>
  <!-- Head -->
  <circle cx="60" cy="62" r="26" fill="#FED7AA"/>
  <!-- Knit Beanie -->
  <path d="M32 50 C32 26 88 26 88 50 Z" fill="#84CC16"/>
  <rect x="30" y="46" width="60" height="8" rx="4" fill="#65A30D"/>
  <!-- Eyes & Stubble Beard -->
  <circle cx="48" cy="64" r="3" fill="#1E293B"/>
  <circle cx="72" cy="64" r="3" fill="#1E293B"/>
  <path d="M46 76 Q60 92 74 76" fill="none" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
</svg>
`);

// Urban 6: Eco Commuter with Green Cap
const urbanEcoSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#10B981" stroke="#059669" stroke-width="4"/>
  <!-- Head -->
  <circle cx="60" cy="60" r="26" fill="#FFEDD5"/>
  <!-- Green Baseball Cap Forward -->
  <path d="M32 48 C32 30 88 30 88 48 Z" fill="#047857"/>
  <path d="M30 46 C45 42 75 42 98 46 L94 52 L32 52 Z" fill="#065F46"/>
  <!-- Leaf Badge on Cap -->
  <circle cx="60" cy="38" r="4" fill="#86EFAC"/>
  <!-- Eyes & Smile -->
  <circle cx="50" cy="62" r="3" fill="#1E293B"/>
  <circle cx="70" cy="62" r="3" fill="#1E293B"/>
  <path d="M52 74 Q60 80 68 74" fill="none" stroke="#065F46" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`);

// Urban 7: Curly Hair Tech Explorer
const urbanExplorerSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#8B5CF6" stroke="#7C3AED" stroke-width="4"/>
  <!-- Curly Afro Hair -->
  <circle cx="44" cy="40" r="16" fill="#1E293B"/>
  <circle cx="76" cy="40" r="16" fill="#1E293B"/>
  <circle cx="60" cy="32" r="18" fill="#1E293B"/>
  <circle cx="34" cy="54" r="12" fill="#1E293B"/>
  <circle cx="86" cy="54" r="12" fill="#1E293B"/>
  <!-- Face -->
  <circle cx="60" cy="62" r="24" fill="#65A30D"/>
  <!-- Bright Eyes & Smile -->
  <circle cx="50" cy="60" r="3" fill="#FFFFFF"/>
  <circle cx="70" cy="60" r="3" fill="#FFFFFF"/>
  <path d="M52 72 Q60 80 68 72" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
</svg>
`);

// Urban 8: Cyber Nomad with Futuristic Visor
const urbanCyberSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="58" fill="#0F172A" stroke="#38BDF8" stroke-width="4"/>
  <!-- Head & Cyber Haircut -->
  <circle cx="60" cy="60" r="26" fill="#F8FAFC"/>
  <path d="M34 44 C40 24 56 22 70 24 C82 28 86 38 86 44 Z" fill="#06B6D4"/>
  <!-- Glowing Neon Cyber Visor -->
  <rect x="36" y="52" width="48" height="12" rx="3" fill="#06B6D4" stroke="#38BDF8" stroke-width="2"/>
  <line x1="42" y1="58" x2="78" y2="58" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  <!-- Chin Line -->
  <line x1="54" y1="76" x2="66" y2="76" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
</svg>
`);

// 2D Marvel Superhero Roster
export const MARVEL_2D_AVATARS = [
  { id: 'marvel_spiderman', name: 'Spider-Man', badge: 'City Navigator', url: spidermanSvg },
  { id: 'marvel_ironman', name: 'Iron Man', badge: 'Tech Pilot', url: ironmanSvg },
  { id: 'marvel_captain', name: 'Captain America', badge: 'Trust Guardian', url: captainAmericaSvg },
  { id: 'marvel_panther', name: 'Black Panther', badge: 'Vibranium EV', url: blackPantherSvg },
  { id: 'marvel_thor', name: 'Thor', badge: 'Expressway Pilot', url: thorSvg },
  { id: 'marvel_wolverine', name: 'Wolverine', badge: 'Highway Veteran', url: wolverineSvg },
  { id: 'marvel_deadpool', name: 'Deadpool', badge: 'Fast Lane Rider', url: deadpoolSvg },
  { id: 'marvel_strange', name: 'Doctor Strange', badge: 'Route Mystic', url: doctorStrangeSvg },
  { id: 'marvel_hulk', name: 'Hulk', badge: 'Heavy Commute', url: hulkSvg },
  { id: 'marvel_loki', name: 'Loki', badge: 'Mischief Transit', url: lokiSvg }
];

// 2D Urban Characters Roster
export const URBAN_2D_AVATARS = [
  { id: 'urban_pilot', name: 'Aviator Pilot', badge: 'Highway Specialist', url: urbanPilotSvg },
  { id: 'urban_tech', name: 'Tech Nomad', badge: 'Daily Commuter', url: urbanTechNomadSvg },
  { id: 'urban_exec', name: 'Corporate Lead', badge: 'Business Class', url: urbanExecutiveSvg },
  { id: 'urban_designer', name: 'Metro Designer', badge: 'Creative Hub', url: urbanDesignerSvg },
  { id: 'urban_cruiser', name: 'Highway Cruiser', badge: 'Night Rider', url: urbanCruiserSvg },
  { id: 'urban_eco', name: 'Eco Specialist', badge: 'Zero Emission', url: urbanEcoSvg },
  { id: 'urban_explorer', name: 'Urban Explorer', badge: 'Weekend Trips', url: urbanExplorerSvg },
  { id: 'urban_cyber', name: 'Cyber Nomad', badge: 'Fast Lane Pilot', url: urbanCyberSvg }
];

// Aliases & Backwards Compatibility
export const MARVEL_AVATARS = MARVEL_2D_AVATARS;
export const MARVEL_3D_AVATARS = MARVEL_2D_AVATARS;
export const URBAN_RANDOM_AVATARS = URBAN_2D_AVATARS;
export const PROFESSIONAL_AVATARS = MARVEL_2D_AVATARS;

export const getAvatarByName = (name) => {
  const all = [...MARVEL_2D_AVATARS, ...URBAN_2D_AVATARS];
  const found = all.find(a => a.name.toLowerCase().includes((name || '').toLowerCase()));
  if (found) return found.url;
  return MARVEL_2D_AVATARS[0].url;
};

export const getAvatarById = (id) => {
  const all = [...MARVEL_2D_AVATARS, ...URBAN_2D_AVATARS];
  const found = all.find(a => a.id === id);
  if (found) return found.url;
  return MARVEL_2D_AVATARS[0].url;
};
