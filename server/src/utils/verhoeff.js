/**
 * Verhoeff Algorithm for 12-digit UIDAI Aadhaar Checksum Validation
 * Provides mathematical validation against transcription and transposition errors.
 */

// Multiplication table d
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Permutation table p
const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

// Inverse table inv
const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a number string using the Verhoeff algorithm.
 * @param {string|number} numStr - The number string (e.g. 12-digit Aadhaar)
 * @returns {boolean} True if checksum passes (equals 0)
 */
export function validateVerhoeff(numStr) {
  if (!numStr) return false;
  const str = String(numStr).replace(/\s|-/g, '');
  if (!/^\d+$/.test(str)) return false;

  let c = 0;
  const digits = str.split('').map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[i % 8][digits[i]]];
  }

  return c === 0;
}

/**
 * Generates the Verhoeff check digit for an 11-digit base string.
 * @param {string|number} numStr - Base number string without checksum digit
 * @returns {number} The calculated single check digit
 */
export function generateVerhoeffCheckDigit(numStr) {
  const str = String(numStr).replace(/\s|-/g, '');
  if (!/^\d+$/.test(str)) throw new Error('Invalid numeric input');

  let c = 0;
  const digits = str.split('').map(Number).reverse();

  for (let i = 0; i < digits.length; i++) {
    c = d[c][p[(i + 1) % 8][digits[i]]];
  }

  return inv[c];
}

/**
 * Specifically validates an Indian UIDAI Aadhaar number (12 digits with valid Verhoeff checksum).
 * Disallows invalid patterns like all repeating digits or starting with 0/1.
 * @param {string} aadhaarStr 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateAadhaar(aadhaarStr) {
  if (!aadhaarStr) {
    return { valid: false, error: 'Aadhaar number is required.' };
  }

  const clean = String(aadhaarStr).replace(/\s|-/g, '');

  if (clean.length !== 12) {
    return { valid: false, error: 'Aadhaar number must be exactly 12 digits.' };
  }

  if (!/^\d{12}$/.test(clean)) {
    return { valid: false, error: 'Aadhaar number must contain only numeric digits.' };
  }

  // Aadhaar cannot start with 0 or 1
  if (clean.startsWith('0') || clean.startsWith('1')) {
    return { valid: false, error: 'Aadhaar cannot begin with 0 or 1.' };
  }

  // Reject obvious dummy sequences (all same digit like 222222222222)
  if (/^(\d)\1{11}$/.test(clean)) {
    return { valid: false, error: 'Invalid Aadhaar sequence.' };
  }

  // Verhoeff checksum validation
  if (!validateVerhoeff(clean)) {
    return { valid: false, error: 'Aadhaar failed UIDAI Verhoeff checksum verification.' };
  }

  return { valid: true };
}
