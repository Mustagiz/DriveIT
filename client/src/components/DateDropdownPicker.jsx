import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DateDropdownPicker({ value, onChange, minDate }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Initialize selected date (YYYY-MM-DD)
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth() || 0); // 0-indexed

  // Format YYYY-MM-DD
  const formatIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = formatIsoDate(new Date());
  const minIso = minDate || todayIso;

  // Format user-friendly date for display: e.g. "Sun, 16 Aug 2026"
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    try {
      const parts = dateStr.split('-');
      const d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
      if (isNaN(d.getTime())) return dateStr;
      
      const isToday = dateStr === todayIso;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = dateStr === formatIsoDate(tomorrow);

      const formatted = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      if (isToday) return `Today (${formatted})`;
      if (isTomorrow) return `Tomorrow (${formatted})`;
      return formatted;
    } catch (e) {
      return dateStr;
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateSelect = (dayNum) => {
    const selected = new Date(viewYear, viewMonth, dayNum);
    const iso = formatIsoDate(selected);
    onChange && onChange(iso);
    setIsOpen(false);
  };

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday

  // Quick preset dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);
  const nextWeekend = new Date();
  const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
  nextWeekend.setDate(today.getDate() + daysUntilSat);

  const presets = [
    { label: 'Today', date: formatIsoDate(today), icon: '⚡' },
    { label: 'Tomorrow', date: formatIsoDate(tomorrow), icon: '🌅' },
    { label: 'In 2 Days', date: formatIsoDate(dayAfter), icon: '🚗' },
    { label: 'Weekend', date: formatIsoDate(nextWeekend), icon: '🏖️' }
  ];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 9999 : 10 }}>
      {/* Trigger Input Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
          border: isOpen
            ? '1.5px solid #84CC16'
            : (isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1'),
          borderRadius: '12px',
          padding: '12px 14px',
          color: isDark ? '#FFFFFF' : '#0F172A',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 0 0 3px rgba(132, 204, 22, 0.2)'
            : (isDark ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.04)'),
          transition: 'all 150ms ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <CalendarIcon size={16} color="#84CC16" />
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {formatDisplayDate(value)}
          </span>
        </div>
        <ChevronDown
          size={16}
          color={isDark ? '#94A3B8' : '#64748B'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Floating Dropdown Calendar */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '320px',
            maxWidth: '90vw',
            background: isDark ? 'rgba(15, 23, 42, 0.98)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
              : '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            zIndex: 99999,
            pointerEvents: 'auto',
            animation: 'fadeIn 180ms ease'
          }}
        >
          {/* Quick Presets Strip */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              Quick Departures
            </div>
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              {presets.map((preset) => {
                const isSelected = value === preset.date;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChange && onChange(preset.date);
                      const p = new Date(preset.date);
                      setViewYear(p.getFullYear());
                      setViewMonth(p.getMonth());
                      setIsOpen(false);
                    }}
                    style={{
                      flexShrink: 0,
                      background: isSelected
                        ? '#84CC16'
                        : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'),
                      color: isSelected
                        ? '#000000'
                        : (isDark ? '#E2E8F0' : '#334155'),
                      border: isSelected
                        ? '1px solid #84CC16'
                        : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: isSelected ? '800' : '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 120ms ease'
                    }}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month Navigation Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
          }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? '#94A3B8' : '#64748B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ fontSize: '13px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A' }}>
              {monthNames[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                background: 'transparent',
                border: 'none',
                color: isDark ? '#94A3B8' : '#64748B',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of Week Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            textAlign: 'center',
            marginBottom: '6px'
          }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <div
                key={d}
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  color: i === 0 || i === 6 ? '#84CC16' : (isDark ? '#64748B' : '#94A3B8'),
                  padding: '2px 0'
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '16px'
          }}>
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} />
            ))}

            {/* Calendar Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(viewYear, viewMonth, dayNum);
              const iso = formatIsoDate(dateObj);
              const isSelected = value === iso;
              const isPast = iso < minIso;
              const isToday = iso === todayIso;

              return (
                <button
                  key={`day-${dayNum}`}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateSelect(dayNum)}
                  style={{
                    height: '32px',
                    width: '100%',
                    background: isSelected
                      ? '#84CC16'
                      : (isToday && !isSelected ? 'rgba(132, 204, 22, 0.15)' : 'transparent'),
                    color: isSelected
                      ? '#000000'
                      : (isPast ? (isDark ? '#334155' : '#CBD5E1') : (isDark ? '#F8FAFC' : '#0F172A')),
                    border: isToday && !isSelected ? '1px dashed #84CC16' : 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '900' : (isToday ? '800' : '500'),
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 100ms ease'
                  }}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            style={{
              width: '100%',
              background: '#84CC16',
              color: '#000000',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(132, 204, 22, 0.25)',
              transition: 'all 150ms ease'
            }}
          >
            <Check size={14} />
            <span>Set Date ({formatDisplayDate(value)})</span>
          </button>
        </div>
      )}
    </div>
  );
}
