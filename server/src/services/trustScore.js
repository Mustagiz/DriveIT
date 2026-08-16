/**
 * Trust & Safety Score Engine
 * Calculates pilot trust score and passenger reliability score
 */

// Weights for pilot trust score components
const PILOT_WEIGHTS = {
  tripCompletion: 0.40,    // 40% — completes rides without cancellation
  avgRating: 0.30,         // 30% — overall passenger ratings
  onTimePercent: 0.20,     // 20% — departure punctuality
  zeroSOS: 0.10            // 10% — no SOS incidents triggered
};

// Weights for passenger reliability score components
const PASSENGER_WEIGHTS = {
  onTimeBoarding: 0.50,    // 50% — boards on time
  noShowRate: 0.30,        // 30% — inverse of no-show percentage
  reviewSentiment: 0.20    // 20% — sentiment from pilot reviews
};

/**
 * Calculate Pilot Trust Score (0–100)
 */
export const calculatePilotTrustScore = ({
  totalRides = 0,
  completedRides = 0,
  cancelledRides = 0,
  avgRating = 5.0,
  onTimeRides = 0,
  lateRides = 0,
  sosIncidents = 0
}) => {
  if (totalRides === 0) {
    return {
      score: 72, // Default starting score for new pilots
      tier: 'NEW PILOT',
      breakdown: { tripCompletion: 75, avgRating: 80, onTimePercent: 70, zeroSOS: 100 },
      badge: '🆕',
      label: 'New Pilot',
      totalRides: 0
    };
  }

  // Component scores (0–100 each)
  const tripCompletionScore = Math.round(
    (completedRides / Math.max(totalRides, 1)) * 100
  );

  const ratingScore = Math.round(
    ((avgRating - 1) / 4) * 100 // Map 1–5 to 0–100
  );

  const totalDepartures = onTimeRides + lateRides;
  const onTimeScore = totalDepartures > 0
    ? Math.round((onTimeRides / totalDepartures) * 100)
    : 85;

  const sosScore = sosIncidents === 0 ? 100 : Math.max(0, 100 - sosIncidents * 20);

  // Weighted total
  const totalScore = Math.round(
    tripCompletionScore * PILOT_WEIGHTS.tripCompletion +
    ratingScore * PILOT_WEIGHTS.avgRating +
    onTimeScore * PILOT_WEIGHTS.onTimePercent +
    sosScore * PILOT_WEIGHTS.zeroSOS
  );

  const clampedScore = Math.min(100, Math.max(0, totalScore));

  return {
    score: clampedScore,
    tier: getTier(clampedScore, 'pilot'),
    badge: getTierBadge(clampedScore),
    label: getTierLabel(clampedScore),
    breakdown: {
      tripCompletion: tripCompletionScore,
      avgRating: ratingScore,
      onTimePercent: onTimeScore,
      zeroSOS: sosScore
    },
    totalRides,
    completedRides,
    cancelledRides,
    avgRating: Math.round(avgRating * 10) / 10,
    sosIncidents
  };
};

/**
 * Calculate Passenger Reliability Score (0–100)
 */
export const calculatePassengerReliabilityScore = ({
  totalBookings = 0,
  onTimeBoarding = 0,
  noShows = 0,
  positiveReviews = 0,
  totalReviews = 0
}) => {
  if (totalBookings === 0) {
    return {
      score: 75,
      tier: 'NEW PASSENGER',
      badge: '🆕',
      label: 'New Commuter',
      breakdown: { onTimeBoarding: 75, noShowRate: 100, reviewSentiment: 75 },
      totalBookings: 0
    };
  }

  const onTimeBoardingScore = Math.round(
    (onTimeBoarding / Math.max(totalBookings, 1)) * 100
  );

  const noShowScore = Math.max(0,
    100 - Math.round((noShows / Math.max(totalBookings, 1)) * 100 * 3)
  );

  const sentimentScore = totalReviews > 0
    ? Math.round((positiveReviews / totalReviews) * 100)
    : 75;

  const totalScore = Math.round(
    onTimeBoardingScore * PASSENGER_WEIGHTS.onTimeBoarding +
    noShowScore * PASSENGER_WEIGHTS.noShowRate +
    sentimentScore * PASSENGER_WEIGHTS.reviewSentiment
  );

  const clampedScore = Math.min(100, Math.max(0, totalScore));

  return {
    score: clampedScore,
    tier: getTier(clampedScore, 'passenger'),
    badge: getTierBadge(clampedScore),
    label: getTierLabel(clampedScore),
    breakdown: {
      onTimeBoarding: onTimeBoardingScore,
      noShowRate: noShowScore,
      reviewSentiment: sentimentScore
    },
    totalBookings,
    noShows,
    onTimeBoarding
  };
};

const getTier = (score, type) => {
  if (score >= 90) return type === 'pilot' ? 'PLATINUM PILOT' : 'TRUSTED COMMUTER';
  if (score >= 75) return type === 'pilot' ? 'GOLD PILOT' : 'RELIABLE COMMUTER';
  if (score >= 60) return type === 'pilot' ? 'SILVER PILOT' : 'STANDARD COMMUTER';
  if (score >= 45) return type === 'pilot' ? 'BRONZE PILOT' : 'BUILDING TRUST';
  return 'NEEDS IMPROVEMENT';
};

const getTierBadge = (score) => {
  if (score >= 90) return '🏆';
  if (score >= 75) return '🥇';
  if (score >= 60) return '🥈';
  if (score >= 45) return '🥉';
  return '⚠️';
};

const getTierLabel = (score) => {
  if (score >= 90) return 'Platinum';
  if (score >= 75) return 'Gold';
  if (score >= 60) return 'Silver';
  if (score >= 45) return 'Bronze';
  return 'Needs Improvement';
};

/**
 * Recalculate trust score for a user after a completed trip
 * Call this at the end of every trip
 */
export const recalculateTrustScoreFromHistory = (user, bookingsOrRides) => {
  const isPilot = user.roles?.includes('lister');

  if (isPilot) {
    const pilotRides = bookingsOrRides.filter(r => r.driverId === user.id);
    return calculatePilotTrustScore({
      totalRides: pilotRides.length,
      completedRides: pilotRides.filter(r => r.status === 'COMPLETED').length,
      cancelledRides: pilotRides.filter(r => r.status === 'CANCELLED').length,
      avgRating: user.rating || 5.0,
      onTimeRides: pilotRides.filter(r => r.departedOnTime).length,
      lateRides: pilotRides.filter(r => r.departedLate).length,
      sosIncidents: user.sosIncidents || 0
    });
  } else {
    const passengerBookings = bookingsOrRides.filter(b => b.passengerId === user.id);
    return calculatePassengerReliabilityScore({
      totalBookings: passengerBookings.length,
      onTimeBoarding: passengerBookings.filter(b => b.boardedOnTime).length,
      noShows: passengerBookings.filter(b => b.status === 'NO_SHOW').length,
      positiveReviews: 0,
      totalReviews: 0
    });
  }
};
