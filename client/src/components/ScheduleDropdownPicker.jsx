import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, 
  ChevronDown, Check, Sparkles, Sun, Moon, AlertTriangle, ArrowRight, X 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ScheduleDropdownPicker({ value, onChange, onApply }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 360 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const formatIsoDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayIso = formatIsoDate(new Date());

  // Calculates realistic next future departure slot based on current time
  const getSmartInitialSlot = (val) => {
    const now = new Date();
    const currentHour = now.getHours(); // 0-23
    const currentMin = now.getMinutes(); // 0-59

    if (val && val.includes('T')) {
      const [d, t] = val.split('T');
      const [hStr, mStr] = (t || '08:00').split(':');
      let h = parseInt(hStr, 10) || 8;
      let p = h >= 12 ? 'PM' : 'AM';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;

      // If selected date is today and the time is already in past, advance to next valid future slot
      if (d === todayIso) {
        let h24 = parseInt(hStr, 10);
        let m = parseInt(mStr, 10);
        if (h24 < currentHour || (h24 === currentHour && m <= currentMin)) {
          return calculateNextFutureSlot(now);
        }
      }

      return {
        date: d < todayIso ? todayIso : d,
        hour: String(h).padStart(2, '0'),
        minute: (mStr || '00').slice(0, 2),
        period: p
      };
    }

    if (val && !val.includes('T')) {
      const isPastDate = val < todayIso;
      const effectiveDate = isPastDate ? todayIso : val;
      const isToday = effectiveDate === todayIso;

      if (!isToday) {
        return {
          date: effectiveDate,
          hour: '08',
          minute: '00',
          period: 'AM'
        };
      }
    }

    return calculateNextFutureSlot(now);
  };

  const calculateNextFutureSlot = (now = new Date()) => {
    const currentHour = now.getHours(); // 0-23
    const currentMin = now.getMinutes(); // 0-59

    // If late evening (> 9:30 PM), default to tomorrow morning 8:00 AM
    if (currentHour >= 21 && currentMin >= 30) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        date: formatIsoDate(tomorrow),
        hour: '08',
        minute: '00',
        period: 'AM'
      };
    }

    // Advance to next 30-min slot
    let nextHour = currentHour;
    let nextMin = currentMin < 30 ? '30' : '00';
    if (currentMin >= 30) nextHour += 1;

    let period = nextHour >= 12 ? 'PM' : 'AM';
    let displayHour = nextHour > 12 ? nextHour - 12 : (nextHour === 0 ? 12 : nextHour);

    return {
      date: formatIsoDate(now),
      hour: String(displayHour).padStart(2, '0'),
      minute: nextMin,
      period
    };
  };

  const initial = getSmartInitialSlot(value);
  const [selectedDate, setSelectedDate] = useState(initial.date);
  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(initial.period);

  const initialD = new Date(initial.date || todayIso);
  const [viewYear, setViewYear] = useState(initialD.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState(initialD.getMonth() || 0);

  useEffect(() => {
    const p = getSmartInitialSlot(value);
    setSelectedDate(p.date);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

  // Recalculate dropdown screen position
  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const popupWidth = 360;
      let leftPos = rect.left + (rect.width / 2) - (popupWidth / 2);

      // Keep within screen viewport bounds
      if (leftPos + popupWidth > window.innerWidth - 16) {
        leftPos = window.innerWidth - popupWidth - 16;
      }
      if (leftPos < 16) {
        leftPos = 16;
      }

      setDropdownPos({
        top: rect.bottom + 8,
        left: leftPos,
        width: popupWidth
      });
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isInsideTrigger = containerRef.current && containerRef.current.contains(e.target);
      const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!isInsideTrigger && !isInsideDropdown) {
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

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const isPastMonth = viewYear < currentYear || (viewYear === currentYear && viewMonth <= currentMonth);

  const handlePrevMonth = () => {
    if (isPastMonth) return;
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

  // Checks if a given time on a given date is strictly in the past
  const isTimeInPast = (dateIso, hour, minute, period) => {
    if (!dateIso) return false;
    if (dateIso < todayIso) return true;
    if (dateIso > todayIso) return false;

    const clock = new Date();
    const currentH24 = clock.getHours();
    const currentMin = clock.getMinutes();

    let h24 = parseInt(hour, 10);
    if (period === 'PM' && h24 < 12) h24 += 12;
    if (period === 'AM' && h24 === 12) h24 = 0;
    const m = parseInt(minute, 10);

    if (h24 < currentH24) return true;
    if (h24 === currentH24 && m <= currentMin) return true;
    return false;
  };

  const handleDateSelect = (dayNum) => {
    const selected = new Date(viewYear, viewMonth, dayNum);
    const iso = formatIsoDate(selected);
    if (iso < todayIso) return; // Prevent past dates

    let finalHour = selectedHour;
    let finalMinute = selectedMinute;
    let finalPeriod = selectedPeriod;

    // If selecting today, ensure time is not in past
    if (iso === todayIso && isTimeInPast(iso, selectedHour, selectedMinute, selectedPeriod)) {
      const nextSlot = calculateNextFutureSlot(new Date());
      finalHour = nextSlot.hour;
      finalMinute = nextSlot.minute;
      finalPeriod = nextSlot.period;
      setSelectedHour(finalHour);
      setSelectedMinute(finalMinute);
      setSelectedPeriod(finalPeriod);
    }

    setSelectedDate(iso);
    emitChange(iso, finalHour, finalMinute, finalPeriod);
  };

  const emitChange = (date, hour, minute, period) => {
    let h24 = parseInt(hour, 10);
    if (period === 'PM' && h24 < 12) h24 += 12;
    if (period === 'AM' && h24 === 12) h24 = 0;
    const h24Str = String(h24).padStart(2, '0');
    const fullIso = `${date}T${h24Str}:${minute}`;
    onChange && onChange(fullIso);
  };

  const hasPastConflict = isTimeInPast(selectedDate, selectedHour, selectedMinute, selectedPeriod);

  const handleSwitchToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tIso = formatIsoDate(tomorrow);
    setSelectedDate(tIso);
    setSelectedHour('08');
    setSelectedMinute('00');
    setSelectedPeriod('AM');
    emitChange(tIso, '08', '00', 'AM');
    const p = new Date(tIso);
    setViewYear(p.getFullYear());
    setViewMonth(p.getMonth());
  };

  const formatDisplay = () => {
    if (!selectedDate) return 'Select Schedule';
    try {
      const parts = selectedDate.split('-');
      const d = new Date(parts[0], parseInt(parts[1], 10) - 1, parts[2]);
      if (isNaN(d.getTime())) return selectedDate;

      const isToday = selectedDate === todayIso;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const isTomorrow = selectedDate === formatIsoDate(tomorrow);

      const dayStr = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });

      const prefix = isToday ? 'Today' : (isTomorrow ? 'Tomorrow' : dayStr);
      return `${prefix}, ${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    } catch (e) {
      return selectedDate;
    }
  };

  // Quick Post-Dating Presets
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(today.getDate() + 2);
  const nextWeekend = new Date();
  const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
  nextWeekend.setDate(today.getDate() + daysUntilSat);

  const postDatePresets = [
    { label: 'Today', date: formatIsoDate(today), icon: '⚡' },
    { label: 'Tomorrow', date: formatIsoDate(tomorrow), icon: '🌅' },
    { label: 'In 2 Days', date: formatIsoDate(dayAfter), icon: '🚗' },
    { label: 'This Weekend', date: formatIsoDate(nextWeekend), icon: '🏖️' }
  ];

  // Highway Commute Time Bands
  const timeBands = [
    { label: '🌅 Early (06:00 AM)', hour: '06', minute: '00', period: 'AM' },
    { label: '🏢 Morning (08:30 AM)', hour: '08', minute: '30', period: 'AM' },
    { label: '☀️ Afternoon (01:30 PM)', hour: '01', minute: '30', period: 'PM' },
    { label: '🌆 Evening (06:00 PM)', hour: '06', minute: '00', period: 'PM' },
    { label: '🌙 Night (09:00 PM)', hour: '09', minute: '00', period: 'PM' }
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Helper to check if an individual hour option is in past for today
  const isHourOptionPast = (hStr) => {
    if (selectedDate !== todayIso) return false;
    let h24 = parseInt(hStr, 10);
    if (selectedPeriod === 'PM' && h24 < 12) h24 += 12;
    if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;
    return h24 < now.getHours();
  };

  // Helper to check if AM period is completely in past today
  const isAmPeriodPast = selectedDate === todayIso && now.getHours() >= 12;

  // Floating Dropdown Portal to ensure it never gets clipped or overlapped
  const floatingDropdown = isOpen && typeof document !== 'undefined' ? createPortal(
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: `${dropdownPos.width}px`,
        maxWidth: '94vw',
        background: isDark ? 'rgba(15, 23, 42, 0.98)' : '#FFFFFF',
        border: isDark ? '1.5px solid rgba(255, 255, 255, 0.15)' : '1.5px solid #CBD5E1',
        borderRadius: '24px',
        padding: '18px',
        boxShadow: isDark
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(24px)',
        zIndex: 999999,
        pointerEvents: 'auto',
        animation: 'fadeIn 160ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header with Title & Close Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '900', color: '#84CC16', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <CalendarIcon size={14} />
          <span>Select Highway Departure</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#94A3B8' : '#64748B',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Past Time Conflict Warning Banner */}
      {hasPastConflict && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1.5px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '12px',
          padding: '9px 12px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={14} color="#EF4444" />
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#EF4444' }}>
              Past time selected. Please choose upcoming slot.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSwitchToTomorrow}
            style={{
              background: '#84CC16',
              color: '#0E240B',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Tomorrow ➔
          </button>
        </div>
      )}

      {/* 1. Quick Post-Dating Date Presets */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px'
        }}>
          {postDatePresets.map((preset) => {
            const isSelected = selectedDate === preset.date;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  let finalHour = selectedHour;
                  let finalMinute = selectedMinute;
                  let finalPeriod = selectedPeriod;

                  // If selecting today, make sure time is valid upcoming
                  if (preset.date === todayIso && isTimeInPast(todayIso, selectedHour, selectedMinute, selectedPeriod)) {
                    const nextSlot = calculateNextFutureSlot(new Date());
                    finalHour = nextSlot.hour;
                    finalMinute = nextSlot.minute;
                    finalPeriod = nextSlot.period;
                    setSelectedHour(finalHour);
                    setSelectedMinute(finalMinute);
                    setSelectedPeriod(finalPeriod);
                  }

                  setSelectedDate(preset.date);
                  emitChange(preset.date, finalHour, finalMinute, finalPeriod);
                  const p = new Date(preset.date);
                  setViewYear(p.getFullYear());
                  setViewMonth(p.getMonth());
                }}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #84CC16, #65A30D)'
                    : (isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC'),
                  color: isSelected
                    ? '#0E240B'
                    : (isDark ? '#E2E8F0' : '#334155'),
                  border: isSelected
                    ? '1px solid #84CC16'
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                  borderRadius: '10px',
                  padding: '7px 4px',
                  fontSize: '11px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  transition: 'all 120ms ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(132, 204, 22, 0.3)' : 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Month Calendar Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px',
        paddingBottom: '6px',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
      }}>
        <button
          type="button"
          disabled={isPastMonth}
          onClick={handlePrevMonth}
          style={{
            background: 'transparent',
            border: 'none',
            color: isPastMonth ? (isDark ? '#334155' : '#CBD5E1') : (isDark ? '#94A3B8' : '#64748B'),
            cursor: isPastMonth ? 'not-allowed' : 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={16} />
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
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Days of Week Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        textAlign: 'center',
        marginBottom: '4px'
      }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
          <div
            key={d}
            style={{
              fontSize: '10.5px',
              fontWeight: '800',
              color: i === 0 || i === 6 ? '#84CC16' : (isDark ? '#64748B' : '#94A3B8'),
              padding: '2px 0'
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '3px',
        marginBottom: '14px'
      }}>
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} style={{ height: '28px' }} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const dateObj = new Date(viewYear, viewMonth, dayNum);
          const iso = formatIsoDate(dateObj);
          const isSelected = selectedDate === iso;
          const isPast = iso < todayIso;
          const isToday = iso === todayIso;

          return (
            <button
              key={`day-${dayNum}`}
              type="button"
              disabled={isPast}
              onClick={() => handleDateSelect(dayNum)}
              style={{
                height: '28px',
                width: '100%',
                background: isSelected
                  ? 'linear-gradient(135deg, #84CC16, #65A30D)'
                  : (isToday && !isSelected ? 'rgba(132, 204, 22, 0.15)' : 'transparent'),
                color: isSelected
                  ? '#0E240B'
                  : (isPast ? (isDark ? '#334155' : '#CBD5E1') : (isDark ? '#F8FAFC' : '#0F172A')),
                border: isToday && !isSelected ? '1px dashed #84CC16' : 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: isSelected ? '900' : (isToday ? '800' : '500'),
                cursor: isPast ? 'not-allowed' : 'pointer',
                opacity: isPast ? 0.35 : 1,
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

      {/* 3. Highway Departure Time Bands & Custom Hour/Minute Selector */}
      <div style={{
        padding: '10px 12px',
        background: isDark ? 'rgba(0, 0, 0, 0.4)' : '#F8FAFC',
        borderRadius: '14px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: '800', color: '#84CC16', textTransform: 'uppercase' }}>
            <Clock size={13} />
            <span>Departure Time</span>
          </div>

          {/* Exact Time Selectors with Past Options Disabled */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <select
              value={selectedHour}
              onChange={(e) => {
                const newHour = e.target.value;
                setSelectedHour(newHour);
                emitChange(selectedDate, newHour, selectedMinute, selectedPeriod);
              }}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: isDark ? '#FFFFFF' : '#0F172A',
                borderRadius: '6px',
                padding: '2px 4px',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(h => {
                const isPastOption = isHourOptionPast(h);
                return (
                  <option key={h} value={h} disabled={isPastOption}>
                    {h} {isPastOption ? '(Past)' : ''}
                  </option>
                );
              })}
            </select>
            <span style={{ fontWeight: '800', color: 'var(--color-text-secondary)' }}>:</span>
            <select
              value={selectedMinute}
              onChange={(e) => {
                const newMin = e.target.value;
                setSelectedMinute(newMin);
                emitChange(selectedDate, selectedHour, newMin, selectedPeriod);
              }}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: isDark ? '#FFFFFF' : '#0F172A',
                borderRadius: '6px',
                padding: '2px 4px',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => {
                const newP = e.target.value;
                setSelectedPeriod(newP);
                emitChange(selectedDate, selectedHour, selectedMinute, newP);
              }}
              style={{
                background: isDark ? '#1E293B' : '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: isDark ? '#FFFFFF' : '#0F172A',
                borderRadius: '6px',
                padding: '2px 4px',
                fontSize: '11.5px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              <option value="AM" disabled={isAmPeriodPast}>
                AM {isAmPeriodPast ? '(Past)' : ''}
              </option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        {/* Highway Commute Time Band Chips (Disabled if Past) */}
        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}>
          {timeBands.map((tb) => {
            const isSelected = selectedHour === tb.hour && selectedMinute === tb.minute && selectedPeriod === tb.period;
            const isBandPast = isTimeInPast(selectedDate, tb.hour, tb.minute, tb.period);

            return (
              <button
                key={tb.label}
                type="button"
                disabled={isBandPast}
                onClick={() => {
                  if (isBandPast) return;
                  setSelectedHour(tb.hour);
                  setSelectedMinute(tb.minute);
                  setSelectedPeriod(tb.period);
                  emitChange(selectedDate, tb.hour, tb.minute, tb.period);
                }}
                style={{
                  flexShrink: 0,
                  background: isSelected 
                    ? 'linear-gradient(135deg, #84CC16, #65A30D)' 
                    : (isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF'),
                  color: isSelected 
                    ? '#0E240B' 
                    : (isBandPast ? (isDark ? '#475569' : '#94A3B8') : (isDark ? '#E2E8F0' : '#334155')),
                  border: isSelected 
                    ? '1px solid #84CC16' 
                    : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '10.5px',
                  fontWeight: isSelected ? '900' : '700',
                  cursor: isBandPast ? 'not-allowed' : 'pointer',
                  opacity: isBandPast ? 0.38 : 1,
                  textDecoration: isBandPast ? 'line-through' : 'none',
                  transition: 'all 100ms ease'
                }}
              >
                {tb.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Apply Action Button */}
      <button
        type="button"
        disabled={hasPastConflict}
        onClick={() => {
          if (hasPastConflict) return;
          setIsOpen(false);
          onApply && onApply();
        }}
        style={{
          width: '100%',
          background: hasPastConflict 
            ? 'var(--color-bg-secondary)' 
            : 'linear-gradient(135deg, #84CC16, #65A30D)',
          color: hasPastConflict ? 'var(--color-text-tertiary)' : '#0E240B',
          border: 'none',
          borderRadius: '9999px',
          padding: '11px',
          fontSize: '13.5px',
          fontWeight: '900',
          cursor: hasPastConflict ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: hasPastConflict ? 'none' : '0 4px 14px rgba(132, 204, 22, 0.35)',
          opacity: hasPastConflict ? 0.5 : 1,
          transition: 'all 150ms ease'
        }}
      >
        <Check size={16} />
        <span>{hasPastConflict ? 'Select Valid Future Time' : `Apply Schedule (${formatDisplay()})`}</span>
      </button>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          updatePosition();
          setIsOpen(!isOpen);
        }}
        style={{
          width: '100%',
          padding: '12px 14px',
          borderRadius: '14px',
          background: isDark ? 'rgba(15, 23, 42, 0.9)' : '#FFFFFF',
          border: isOpen
            ? '1.5px solid #84CC16'
            : hasPastConflict
              ? '1.5px solid #EF4444'
              : (isDark ? '1px solid rgba(255, 255, 255, 0.18)' : '1.5px solid #CBD5E1'),
          color: isDark ? '#FFFFFF' : '#0F172A',
          fontSize: '13.5px',
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
          <CalendarIcon size={16} color={hasPastConflict ? '#EF4444' : '#16A34A'} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {formatDisplay()}
          </span>
          {hasPastConflict && (
            <span style={{
              fontSize: '10px',
              fontWeight: '800',
              color: '#EF4444',
              background: 'rgba(239, 68, 68, 0.12)',
              padding: '2px 6px',
              borderRadius: '6px'
            }}>
              Past Time
            </span>
          )}
        </div>
        <ChevronDown
          size={15}
          color={isDark ? '#94A3B8' : '#64748B'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
            flexShrink: 0
          }}
        />
      </button>

      {floatingDropdown}
    </div>
  );
}
