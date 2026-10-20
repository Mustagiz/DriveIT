import React from 'react';
import styles from './RideSeatGauge.module.css';

export default function RideSeatGauge({ totalSeats = 4, availableSeats = 2 }) {
  const total = Math.max(1, Number(totalSeats) || 4);
  const available = Math.max(0, Math.min(total, Number(availableSeats) || 0));

  const seats = [];
  for (let i = 0; i < total; i++) {
    const isAvail = i < available;
    seats.push({ id: i, available: isAvail });
  }

  return (
    <div className={styles.container} title={`${available} of ${total} seats available`}>
      <div className={styles.seatRow}>
        {seats.map((seat) => (
          <span
            key={seat.id}
            className={`${styles.seatPill} ${seat.available ? styles.seatAvailable : styles.seatBooked}`}
          />
        ))}
      </div>
      <span className={styles.label}>
        <span className={styles.highlight}>{available}</span>/{total} seats open
      </span>
    </div>
  );
}
