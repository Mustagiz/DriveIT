/**
 * Pilot Schedule & Fleet Collision Protection Engine
 * Prevents pilots from scheduling overlapping rides across different routes simultaneously,
 * and prevents the same vehicle registration plate from being duplicated on simultaneous departures.
 */

export function parseRideDateTimeToEpoch(dateStr, timeStr = '00:00') {
  if (!dateStr) return Date.now();
  
  let year, month, day;
  if (dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  } else if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    year = parseInt(parts[2], 10);
  } else {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? Date.now() : d.getTime();
  }

  // Parse time (handles 24h '14:30' and 12h '02:30 PM')
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const cleanTime = String(timeStr).trim().toUpperCase();
    const isPM = cleanTime.includes('PM');
    const isAM = cleanTime.includes('AM');
    const timeDigits = cleanTime.replace(/[^\d:]/g, '');
    const [hStr, mStr] = timeDigits.split(':');
    hours = parseInt(hStr || '0', 10);
    minutes = parseInt(mStr || '0', 10);
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
  }

  return new Date(year, month, day, hours, minutes, 0).getTime();
}

/**
 * Checks for temporal overlap / conflict between an incoming ride and existing active rides.
 * Mandatory turnaround & transit buffer = 1.0 hour.
 */
export function checkPilotScheduleConflict({
  driverId,
  driverName,
  vehiclePlate,
  departureDate,
  departureTime,
  estimatedDurationHours = 2.5,
  existingRides = [],
  excludeRideId = null
}) {
  const BUFFER_HOURS = 1.0; // 1-hour buffer for turnaround / traffic delays
  const durationMs = (parseFloat(estimatedDurationHours) || 2.5) * 3600 * 1000;
  const bufferMs = BUFFER_HOURS * 3600 * 1000;

  const newStart = parseRideDateTimeToEpoch(departureDate, departureTime);
  const newEnd = newStart + durationMs + bufferMs;

  for (const existing of existingRides) {
    if (excludeRideId && existing.id === excludeRideId) continue;
    if (existing.status === 'CANCELLED' || existing.status === 'COMPLETED') continue;

    // Check identity conflict: Same Driver OR Same Vehicle License Plate
    const sameDriver = (driverId && existing.driverId === driverId) || 
                       (driverName && existing.driverName && existing.driverName.toLowerCase().includes(driverName.toLowerCase()));
    
    const cleanNewPlate = vehiclePlate ? vehiclePlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
    const cleanExistPlate = existing.vehicle?.plate ? existing.vehicle.plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : '';
    const sameVehicle = cleanNewPlate && cleanExistPlate && cleanNewPlate === cleanExistPlate;

    if (!sameDriver && !sameVehicle) continue;

    const existStart = parseRideDateTimeToEpoch(existing.departureDate, existing.departureTime);
    const existDurationMs = (parseFloat(existing.estimatedDurationHours) || 2.5) * 3600 * 1000;
    const existEnd = existStart + existDurationMs + bufferMs;

    // Check interval overlap: [newStart, newEnd] intersects [existStart, existEnd]
    const isOverlapping = newStart < existEnd && newEnd > existStart;

    if (isOverlapping) {
      const existRoute = `${existing.originCity?.split(',')[0] || 'Origin'} ➔ ${existing.destinationCity?.split(',')[0] || 'Destination'}`;
      return {
        hasConflict: true,
        conflictingRide: existing,
        message: sameVehicle && !sameDriver
          ? `Vehicle (${existing.vehicle?.plate || vehiclePlate}) is already assigned to active corridor trip ${existRoute} departing on ${existing.departureDate} at ${existing.departureTime}.`
          : `Schedule Conflict: You already have an active corridor trip scheduled for ${existRoute} on ${existing.departureDate} at ${existing.departureTime} (~${existing.estimatedDurationHours || 2.5}h duration). A single pilot cannot operate multiple overlapping routes simultaneously.`
      };
    }
  }

  return { hasConflict: false };
}
