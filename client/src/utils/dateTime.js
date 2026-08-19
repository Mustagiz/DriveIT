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

/**
 * Checks if a scheduled session is strictly upcoming (future or today with unelapsed departure time)
 * @param {string} dateVal e.g. "2026-08-20", "20/08/2026", Date
 * @param {string} [timeVal] e.g. "07:30 AM", "14:30"
 * @param {number} [bufferMinutes=30] Grace buffer in minutes for ongoing departures
 * @returns {boolean} true if ride is upcoming/active, false if completed/past
 */
export function isUpcomingSession(dateVal, timeVal, bufferMinutes = 30) {
  if (!dateVal) return true;
  try {
    const now = new Date();
    
    let year, month, day;
    const dateStr = String(dateVal).trim();
    const ymdMatch = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    const dmyMatch = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    
    if (ymdMatch) {
      year = parseInt(ymdMatch[1], 10);
      month = parseInt(ymdMatch[2], 10) - 1;
      day = parseInt(ymdMatch[3], 10);
    } else if (dmyMatch) {
      day = parseInt(dmyMatch[1], 10);
      month = parseInt(dmyMatch[2], 10) - 1;
      year = parseInt(dmyMatch[3], 10);
    } else {
      const parsed = new Date(dateVal);
      if (isNaN(parsed.getTime())) return true;
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }

    let hours = 23;
    let minutes = 59;

    if (timeVal) {
      const ampmMatch = String(timeVal).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (ampmMatch) {
        let h = parseInt(ampmMatch[1], 10);
        const m = parseInt(ampmMatch[2], 10);
        const period = (ampmMatch[3] || '').toUpperCase();
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        hours = h;
        minutes = m;
      } else {
        const timeMatch = String(timeVal).match(/^(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          hours = parseInt(timeMatch[1], 10);
          minutes = parseInt(timeMatch[2], 10);
        }
      }
    }

    const sessionDate = new Date(year, month, day, hours, minutes, 0, 0);
    const diffMs = sessionDate.getTime() - now.getTime();
    
    // Only return true if session is in the future or within bufferMinutes of scheduled departure
    return diffMs >= -(bufferMinutes * 60 * 1000);
  } catch {
    return true;
  }
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  isUpcomingSession
};
