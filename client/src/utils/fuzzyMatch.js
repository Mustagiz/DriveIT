/**
 * Fuzzy Matching & Phonetic Algorithms for Client-Side Location & Address Resolution
 * Includes:
 * 1. Soundex (Phonetic matching for transliteration variations)
 * 2. Levenshtein Distance & Similarity Ratio (Edit-distance tolerance)
 * 3. Jaro-Winkler Metric (Prefix-weighted typo tolerance)
 * 4. Indian Highway & Metro Alias Normalization
 */

export function soundex(str) {
  if (!str || typeof str !== 'string') return '';
  const clean = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) return '';

  const mapping = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6'
  };

  const firstLetter = clean[0];
  let encoded = firstLetter;
  let prevCode = mapping[firstLetter] || '0';

  for (let i = 1; i < clean.length; i++) {
    const char = clean[i];
    const code = mapping[char] || '0';

    if (code !== '0' && code !== prevCode) {
      encoded += code;
    }
    prevCode = code;
    if (encoded.length === 4) break;
  }

  return encoded.padEnd(4, '0');
}

export function levenshteinDistance(a, b) {
  if (!a || !b) return (a || b || '').length;
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  
  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const matrix = Array.from({ length: s2.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= s1.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      const cost = s1[j - 1] === s2[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[s2.length][s1.length];
}

export function levenshteinSimilarity(a, b) {
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - (distance / maxLen);
}

export function jaroWinkler(s1, s2) {
  if (!s1 || !s2) return 0;
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1.0;

  const matchWindow = Math.floor(Math.max(a.length, b.length) / 2) - 1;
  const aMatches = new Array(a.length).fill(false);
  const bMatches = new Array(b.length).fill(false);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, b.length);

    for (let j = start; j < end; j++) {
      if (bMatches[j] || a[i] !== b[j]) continue;
      aMatches[i] = true;
      bMatches[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!aMatches[i]) continue;
    while (!bMatches[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }

  const jaro = (
    (matches / a.length) +
    (matches / b.length) +
    ((matches - transpositions / 2) / matches)
  ) / 3;

  let prefix = 0;
  for (let i = 0; i < Math.min(4, a.length, b.length); i++) {
    if (a[i] === b[i]) prefix++;
    else break;
  }

  return jaro + prefix * 0.1 * (1 - jaro);
}

export const INDIAN_METRO_ALIASES = {
  mumbai: ['bkc', 'bandra', 'andheri', 'thane', 'dadar', 'borivali', 'navi mumbai', 'vashi', 'chembur', 'mumbai', 'bombay'],
  pune: ['hinjewadi', 'hinjawadi', 'swargate', 'wakad', 'baner', 'kothrud', 'viman nagar', 'pimpri', 'chinchwad', 'pune', 'poona'],
  bengaluru: ['indiranagar', 'koramangala', 'whitefield', 'electronic city', 'hsr', 'hebbal', 'bangalore', 'bengaluru'],
  chennai: ['guindy', 'omr', 'adyar', 'tambaram', 't nagar', 'chennai', 'madras'],
  delhi: ['gurgaon', 'gurugram', 'noida', 'saket', 'cp', 'connaught place', 'aerocity', 'delhi', 'ncr', 'ghaziabad', 'faridabad'],
  jaipur: ['mansarovar', 'vaishali nagar', 'mi road', 'jaipur', 'pink city'],
  hyderabad: ['hitec city', 'gachibowli', 'jubilee hills', 'madhapur', 'hyderabad', 'secunderabad', 'cyberabad'],
  ahmedabad: ['sg highway', 'vastrapur', 'prahlad nagar', 'maninagar', 'ahmedabad', 'amdavad'],
  vadodara: ['alkapuri', 'sayajigunj', 'vadodara', 'baroda'],
  surat: ['vesu', 'adajan', 'varachha', 'surat'],
  goa: ['panaji', 'margao', 'candolim', 'calangute', 'vasco', 'goa'],
  chandigarh: ['mohali', 'panchkula', 'sector 17', 'chandigarh'],
  lucknow: ['gomti nagar', 'hazratganj', 'alambagh', 'lucknow'],
  kolkata: ['salt lake', 'new town', 'park street', 'howrah', 'kolkata', 'calcutta']
};

export function matchLocationFuzzy(query, targetLocation, threshold = 0.78) {
  if (!query || !targetLocation) return false;
  const q = query.toLowerCase().trim();
  const t = targetLocation.toLowerCase().trim();

  // 1. Direct exact or substring match
  if (q === t || t.includes(q) || q.includes(t)) return true;

  // 2. Tokenized word-level match
  const qTokens = q.split(/[\s,–—\-_/]+/).filter(tok => tok.length >= 2);
  const tTokens = t.split(/[\s,–—\-_/]+/).filter(tok => tok.length >= 2);

  for (const qTok of qTokens) {
    if (tTokens.some(tTok => tTok.includes(qTok) || qTok.includes(tTok))) {
      return true;
    }

    const qSoundex = soundex(qTok);
    if (qSoundex && tTokens.some(tTok => soundex(tTok) === qSoundex)) {
      return true;
    }

    for (const tTok of tTokens) {
      if (jaroWinkler(qTok, tTok) >= threshold || levenshteinSimilarity(qTok, tTok) >= threshold) {
        return true;
      }
    }
  }

  for (const [metro, subList] of Object.entries(INDIAN_METRO_ALIASES)) {
    const qInMetro = qTokens.some(tok => subList.some(alias => alias === tok || jaroWinkler(tok, alias) >= 0.82));
    const tInMetro = tTokens.some(tok => subList.some(alias => alias === tok || jaroWinkler(tok, alias) >= 0.82));
    if (qInMetro && tInMetro) return true;
  }

  return jaroWinkler(q, t) >= 0.82 || levenshteinSimilarity(q, t) >= 0.80;
}
