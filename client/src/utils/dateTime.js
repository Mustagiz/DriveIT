/**
 * Universal Date & Time Formatting Utilities for DriveIT
 * 
 * Standard Website Formats:
 * - Date: DD/MM/YYYY (e.g. "18/08/2026")
 * - Time: HH:MM (e.g. "07:30", "14:30", "19:45")
 * - DateTime: DD/MM/YYYY, HH:MM
 */

/**
 * Formats any date input (ISO string, Date object, timestamp) into DD/MM/YYYY
 * @param {string|Date|number} val 
 * @returns {string} e.g. "18/08/2026"
 */
export function formatDate(val) {
  if (!val) return '';
  
  try {
    // If string like "2026-08-18" or "2026-08-18T14:30:00"
    if (typeof val === 'string') {
      const trimmed = val.trim();
      
      // Match already formatted DD/MM/YYYY
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
        return trimmed;
      }
      
      // Match YYYY-MM-DD
      const ymdMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (ymdMatch) {
        const year = ymdMatch[1];
        const month = ymdMatch[2].padStart(2, '0');
        const day = ymdMatch[3].padStart(2, '0');
        return `${day}/${month}/${year}`;
      }

      // Match DD-MM-YYYY
      const dmyMatch = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
      if (dmyMatch) {
        const day = dmyMatch[1].padStart(2, '0');
        const month = dmyMatch[2].padStart(2, '0');
        const year = dmyMatch[3];
        return `${day}/${month}/${year}`;
      }
    }

    const d = new Date(val);
    if (isNaN(d.getTime())) {
      return String(val);
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(val || '');
  }
}

/**
 * Formats any time input (e.g. "07:30 AM", "07:30 PM", "19:30", Date, ISO) into HH:MM
 * @param {string|Date|number} val 
 * @returns {string} e.g. "07:30", "19:30"
 */
export function formatTime(val) {
  if (!val) return '';

  try {
    if (typeof val === 'string') {
      const trimmed = val.trim();

      // Match "HH:MM AM/PM" or "H:MM AM/PM"
      const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (ampmMatch) {
        let hour = parseInt(ampmMatch[1], 10);
        const minute = ampmMatch[2].padStart(2, '0');
        const period = ampmMatch[3] ? ampmMatch[3].toUpperCase() : null;

        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        return `${String(hour).padStart(2, '0')}:${minute}`;
      }

      // Match "HH:MM:SS" or "HH:MM"
      const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2].padStart(2, '0')}`;
      }

      // Check if it's an ISO date string
      if (trimmed.includes('T')) {
        const d = new Date(trimmed);
        if (!isNaN(d.getTime())) {
          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        }
      }
    }

    if (val instanceof Date || typeof val === 'number') {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      }
    }

    return String(val);
  } catch {
    return String(val || '');
  }
}

/**
 * Formats date and time into DD/MM/YYYY, HH:MM
 * @param {string|Date} dateVal 
 * @param {string} [timeVal] 
 * @returns {string} e.g. "18/08/2026, 07:30"
 */
export function formatDateTime(dateVal, timeVal) {
  if (!dateVal && !timeVal) return '';
  
  if (timeVal) {
    const d = formatDate(dateVal);
    const t = formatTime(timeVal);
    if (d && t) return `${d}, ${t}`;
    return d || t;
  }

  // Single parameter (e.g. ISO string "2026-08-18T07:30:00")
  if (typeof dateVal === 'string' && dateVal.includes('T')) {
    const [dStr, tStr] = dateVal.split('T');
    return `${formatDate(dStr)}, ${formatTime(tStr)}`;
  }

  const d = formatDate(dateVal);
  const t = formatTime(dateVal);
  if (d && t && t !== '00:00') return `${d}, ${t}`;
  return d;
}

export default {
  formatDate,
  formatTime,
  formatDateTime
};
