import React from 'react';
import { Users, User, Shield, Check, Info, Car, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SeatSelector({ 
  totalSeats = 3, 
  availableSeats = 3, 
  selectedSeats = 1, 
  onSelectSeats, 
  pricePerSeat = 350,
  pilotName = 'Rahul Sharma'
}) {
  const { isDark } = useTheme();
  const bookedSeats = Math.max(0, totalSeats - availableSeats);

  const handleSeatClick = (seatNumber) => {
    if (seatNumber <= bookedSeats) return; // Occupied seat
    const targetCount = seatNumber - bookedSeats;
    if (targetCount > 0 && targetCount <= availableSeats) {
      onSelectSeats(targetCount);
    }
  };

  const handleIncrement = () => {
    if (selectedSeats < availableSeats) {
      onSelectSeats(selectedSeats + 1);
    }
  };

  const handleDecrement = () => {
    if (selectedSeats > 1) {
      onSelectSeats(selectedSeats - 1);
    }
  };

  return (
    <div style={{
      padding: '24px',
      borderRadius: '24px',
      marginBottom: '24px',
      border: '1.5px solid var(--color-border)',
      background: 'var(--color-bg-surface)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'rgba(132, 204, 22, 0.15)',
            color: '#84CC16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={18} />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#84CC16', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Cabin Capacity
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              Select Passenger Seats
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: '900',
          background: 'rgba(16, 185, 129, 0.14)',
          color: '#10B981',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          {availableSeats} seat{availableSeats > 1 ? 's' : ''} available
        </span>
      </div>

      {/* LUXURY CAR CABIN VISUALIZER */}
      <div style={{
        background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
        borderRadius: '22px',
        border: isDark ? '1.5px solid rgba(255, 255, 255, 0.08)' : '1.5px solid #E2E8F0',
        padding: '20px',
        maxWidth: '360px',
        margin: '0 auto 20px auto',
        position: 'relative'
      }}>
        {/* Windshield Arc Top */}
        <div style={{
          height: '26px',
          borderTop: '2px solid rgba(132, 204, 22, 0.4)',
          borderLeft: '1.5px solid rgba(132, 204, 22, 0.2)',
          borderRight: '1.5px solid rgba(132, 204, 22, 0.2)',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          background: isDark ? 'rgba(132, 204, 22, 0.04)' : 'rgba(132, 204, 22, 0.08)'
        }}>
          <span style={{
            fontSize: '10px',
            color: '#84CC16',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: '900'
          }}>
            ▲ WINDSHIELD / CABIN COCKPIT ▲
          </span>
        </div>

        {/* FRONT ROW: Driver Cockpit (Subdued) + Co-Passenger Seat 1 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '14px'
        }}>
          {/* Driver Cockpit Seat (Subdued & Non-Clickable) */}
          <div style={{
            background: isDark ? 'rgba(255, 255, 255, 0.04)' : '#F1F5F9',
            border: isDark ? '1.5px dashed rgba(255, 255, 255, 0.15)' : '1.5px dashed #CBD5E1',
            borderRadius: '16px',
            padding: '14px 10px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.75
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(132, 204, 22, 0.14)',
              color: '#84CC16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <Car size={15} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
              Pilot
            </div>
            <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '800' }}>
              ✓ Verified Driver
            </div>
          </div>

          {/* Seat 1 (Front Co-Passenger) */}
          {(() => {
            const seatNum = 1;
            const isBooked = seatNum <= bookedSeats;
            const isSelected = !isBooked && (seatNum - bookedSeats) <= selectedSeats;

            return (
              <button
                type="button"
                disabled={isBooked}
                onClick={() => handleSeatClick(seatNum)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)'
                    : (isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF'),
                  border: isSelected
                    ? '2px solid #84CC16'
                    : isBooked
                      ? (isDark ? '1.5px solid rgba(239, 68, 68, 0.2)' : '1.5px solid #FECACA')
                      : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1'),
                  borderRadius: '16px',
                  padding: '14px 10px',
                  textAlign: 'center',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: isSelected ? '0 4px 14px rgba(132, 204, 22, 0.4)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isSelected ? '#000000' : (isBooked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)'),
                  color: isSelected ? '#84CC16' : (isBooked ? '#EF4444' : '#38BDF8'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  {isSelected ? <Check size={16} strokeWidth={3} /> : <User size={15} />}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '900', color: isSelected ? '#000000' : (isBooked ? '#EF4444' : 'var(--color-text-primary)') }}>
                  {isBooked ? 'Occupied' : isSelected ? 'Selected' : 'Front Seat'}
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: '800', color: isSelected ? '#000000' : 'var(--color-text-secondary)' }}>
                  ₹{pricePerSeat}
                </div>
              </button>
            );
          })()}
        </div>

        {/* REAR ROW: Seats 2 & 3 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          {[2, 3].map((seatNum) => {
            const isBooked = seatNum <= bookedSeats;
            const isSelected = !isBooked && (seatNum - bookedSeats) <= selectedSeats;

            return (
              <button
                key={seatNum}
                type="button"
                disabled={isBooked}
                onClick={() => handleSeatClick(seatNum)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)'
                    : (isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF'),
                  border: isSelected
                    ? '2px solid #84CC16'
                    : isBooked
                      ? (isDark ? '1.5px solid rgba(239, 68, 68, 0.2)' : '1.5px solid #FECACA')
                      : (isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1'),
                  borderRadius: '16px',
                  padding: '14px 10px',
                  textAlign: 'center',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: isSelected ? '0 4px 14px rgba(132, 204, 22, 0.4)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isSelected ? '#000000' : (isBooked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)'),
                  color: isSelected ? '#84CC16' : (isBooked ? '#EF4444' : '#38BDF8'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  {isSelected ? <Check size={16} strokeWidth={3} /> : <User size={15} />}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '900', color: isSelected ? '#000000' : (isBooked ? '#EF4444' : 'var(--color-text-primary)') }}>
                  {isBooked ? 'Occupied' : isSelected ? 'Selected' : `Rear Seat ${seatNum - 1}`}
                </div>
                <div style={{ fontSize: '10.5px', fontWeight: '800', color: isSelected ? '#000000' : 'var(--color-text-secondary)' }}>
                  ₹{pricePerSeat}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          marginTop: '16px',
          fontSize: '11px',
          fontWeight: '800',
          color: 'var(--color-text-secondary)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#84CC16' }} />
            <span>Selected</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isDark ? '#475569' : '#CBD5E1' }} />
            <span>Available</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
            <span>Occupied</span>
          </span>
        </div>
      </div>

      {/* Seat Quantity Counter & Total Price Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 18px',
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px'
      }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
            Seats Selected
          </div>
          <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--color-text-primary)' }}>
            {selectedSeats} {selectedSeats === 1 ? 'Seat' : 'Seats'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={selectedSeats <= 1}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              color: selectedSeats <= 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
              cursor: selectedSeats <= 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900'
            }}
          >
            <Minus size={15} />
          </button>

          <span style={{ fontSize: '18px', fontWeight: '900', color: '#84CC16', minWidth: '20px', textAlign: 'center' }}>
            {selectedSeats}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={selectedSeats >= availableSeats}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              color: selectedSeats >= availableSeats ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
              cursor: selectedSeats >= availableSeats ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900'
            }}
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
