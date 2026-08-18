/**
 * Active Trip Restriction Guard
 * Enforces the DriveIT 1-active-trip policy per passenger.
 * Checks for any active confirmed bookings or open/accepted commute requests.
 */

export function getActivePassengerTrip() {
  try {
    // 1. Check for Active Confirmed Bookings
    const localBookings = JSON.parse(localStorage.getItem('rideshare_local_bookings') || '[]');
    const activeBooking = localBookings.find(b => 
      b.status === 'CONFIRMED' || b.status === 'IN_TRANSIT' || b.status === 'ARRIVED' || b.status === 'PENDING'
    );

    if (activeBooking) {
      const originName = activeBooking.ride?.originCity || activeBooking.origin?.split(',')[0] || 'Origin';
      const destName = activeBooking.ride?.destinationCity || activeBooking.destination?.split(',')[0] || 'Destination';
      return {
        hasActiveSession: true,
        type: 'BOOKING',
        title: 'Active Trip Booking in Progress',
        ref: activeBooking.bookingRef || activeBooking.id,
        route: `${originName} ➔ ${destName}`,
        departureDate: activeBooking.ride?.departureDate || activeBooking.departureDate,
        departureTime: activeBooking.ride?.departureTime || activeBooking.departureTime,
        session: activeBooking,
        message: `You currently have an active confirmed trip booking (${activeBooking.bookingRef || 'Confirmed Booking'}) from ${originName} to ${destName}. DriveIT restricts passengers to only one active trip or booking at a time. Please cancel your existing trip in the Passenger Flight Deck before initiating a new one.`
      };
    }

    // 2. Check for Active Broadcast Route Demands
    const localRequests = JSON.parse(localStorage.getItem('rideshare_local_commuter_requests') || '[]');
    const activeRequest = localRequests.find(r => 
      r.status === 'OPEN' || r.status === 'ACCEPTED'
    );

    if (activeRequest) {
      const originName = activeRequest.origin?.split(',')[0] || 'Origin';
      const destName = activeRequest.destination?.split(',')[0] || 'Destination';
      return {
        hasActiveSession: true,
        type: 'REQUEST',
        title: 'Active Route Request in Progress',
        ref: activeRequest.id,
        route: `${originName} ➔ ${destName}`,
        departureDate: activeRequest.preferredDate,
        departureTime: activeRequest.preferredTime,
        session: activeRequest,
        message: `You currently have an ongoing commute route request broadcasted from ${originName} to ${destName}. DriveIT restricts passengers to only one active trip or booking at a time. Please cancel your existing request in the Passenger Flight Deck before initiating a new one.`
      };
    }
  } catch (e) {
    console.warn('Error checking active passenger trip:', e);
  }

  return { hasActiveSession: false };
}
