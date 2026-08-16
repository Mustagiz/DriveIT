/**
 * Official Verhoeff Algorithm Implementation for Aadhaar 12-digit Checksum Validation
 * Reference: UIDAI Aadhaar Number Validation Standard
 */

// Multiplication table (d)
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

// Permutation table (p)
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

// Inverse table (inv)
const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates whether a 12-digit number satisfies the Verhoeff checksum.
 * @param {string} aadhaarStr 
 * @returns {boolean}
 */
export function validateVerhoeff(aadhaarStr) {
  const clean = String(aadhaarStr).replace(/\D/g, '');
  if (clean.length !== 12) return false;
  if (/^[01]/.test(clean)) return false; // Aadhaar cannot start with 0 or 1

  let c = 0;
  const reversedArray = clean.split('').reverse().map(Number);

  for (let i = 0; i < reversedArray.length; i++) {
    c = d[c][p[i % 8][reversedArray[i]]];
  }

  return c === 0;
}

/**
 * Formats a raw 12-digit string into standard 4-4-4 spaced or masked format.
 * @param {string} str 
 * @param {boolean} maskFirst8 
 * @returns {string}
 */
export function formatAadhaar(str, maskFirst8 = false) {
  const clean = String(str || '').replace(/\D/g, '').slice(0, 12);
  if (!clean) return '';
  
  if (maskFirst8) {
    const last4 = clean.slice(-4);
    return `•••• •••• ${last4 || '••••'}`;
  }

  return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}
