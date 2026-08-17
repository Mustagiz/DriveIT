import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronDown, Check, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { formatTime } from '../utils/dateTime';

export default function TimeDropdownPicker({ value, onChange }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial time e.g. "07:30 AM", "14:30", "07:30"
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '07', minute: '30', period: 'AM' };
    
    // Check if 24-hr format "HH:MM"
    const match24 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      let h = parseInt(match24[1], 10);
      const m = match24[2];
      const p = h >= 12 ? 'PM' : 'AM';
      let h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
      return {
        hour: String(h12).padStart(2, '0'),
        minute: m,
        period: p
      };
    }

    // Check if AM/PM format
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = match[2];
      let p = match[3] ? match[3].toUpperCase() : 'AM';
      
      if (!match[3] && h >= 12) {
        p = 'PM';
        if (h > 12) h -= 12;
      }
      return {
        hour: String(h).padStart(2, '0'),
        minute: m,
        period: p
      };
    }
    return { hour: '07', minute: '30', period: 'AM' };
  };

  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  useEffect(() => {
    const p = parseTime(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

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

  const updateTime = (h, m, p) => {
    const formatted = formatTime(`${h}:${m} ${p}`);
    onChange && onChange(formatted);
  };

  const handleHourSelect = (h) => {
    const padH = String(h).padStart(2, '0');
    setSelectedHour(padH);
    updateTime(padH, selectedMinute, selectedPeriod);
  };

  const handleMinuteSelect = (m) => {
    const padM = String(m).padStart(2, '0');
    setSelectedMinute(padM);
    updateTime(selectedHour, padM, selectedPeriod);
  };

  const handlePeriodSelect = (p) => {
    setSelectedPeriod(p);
    updateTime(selectedHour, selectedMinute, p);
  };

  const quickPresets = [
    { label: 'Early Express', time: '06:00', icon: '🌅' },
    { label: 'Morning Peak', time: '07:30', icon: '⚡' },
    { label: 'Business Rush', time: '09:00', icon: '💼' },
    { label: 'Afternoon Cruise', time: '14:00', icon: '☀️' },
    { label: 'Evening Peak', time: '17:30', icon: '🌆' },
    { label: 'Night Highway', time: '20:00', icon: '🌙' },
    { label: 'Late Night', time: '22:30', icon: '✨' }
  ];

  const hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 9999 : 10 }}>
      {/* Trigger Button */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} color="#84CC16" />
          <span>{formatTime(value || '07:30')}</span>
        </div>
        <ChevronDown
          size={16}
          color={isDark ? '#94A3B8' : '#64748B'}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease'
          }}
        />
      </button>

      {/* Floating Clock Picker Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            width: '340px',
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
          {/* Header & Digital Preview */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            paddingBottom: '12px',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#84CC16" />
              <span style={{ fontSize: '12px', fontWeight: '800', color: isDark ? '#FFFFFF' : '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Departure
              </span>
            </div>

            <div style={{
              background: 'rgba(132, 204, 22, 0.15)',
              border: '1px solid rgba(132, 204, 22, 0.3)',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '13px',
              fontWeight: '900',
              color: isDark ? '#84CC16' : '#65A30D'
            }}>
              {selectedHour}:{selectedMinute} {selectedPeriod}
            </div>
          </div>

          {/* Quick Commute Presets Strip */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
              Popular Expressway Timings
            </div>
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none'
            }}>
              {quickPresets.map((preset) => {
                const isSelected = value === preset.time;
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => {
                      const p = parseTime(preset.time);
                      setSelectedHour(p.hour);
                      setSelectedMinute(p.minute);
                      setSelectedPeriod(p.period);
                      onChange && onChange(preset.time);
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
                    <span>{preset.time}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Picker Columns (Hour, Minute, Period) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 68px',
            gap: '10px',
            marginBottom: '16px'
          }}>
            {/* Hours Column */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
                Hour
              </div>
              <div style={{
                maxHeight: '150px',
                overflowY: 'auto',
                background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '4px'
              }}>
                {hours.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHourSelect(h)}
                      style={{
                        width: '100%',
                        background: isSelected ? '#84CC16' : 'transparent',
                        color: isSelected ? '#000000' : (isDark ? '#F8FAFC' : '#0F172A'),
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        fontSize: '12px',
                        fontWeight: isSelected ? '800' : '500',
                        cursor: 'pointer',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
                Minute
              </div>
              <div style={{
                maxHeight: '150px',
                overflowY: 'auto',
                background: isDark ? 'rgba(0, 0, 0, 0.3)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '4px'
              }}>
                {minutes.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMinuteSelect(m)}
                      style={{
                        width: '100%',
                        background: isSelected ? '#84CC16' : 'transparent',
                        color: isSelected ? '#000000' : (isDark ? '#F8FAFC' : '#0F172A'),
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px',
                        fontSize: '12px',
                        fontWeight: isSelected ? '800' : '500',
                        cursor: 'pointer',
                        marginBottom: '2px',
                        transition: 'all 100ms ease'
                      }}
                    >
                      :{m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AM / PM Toggle Column */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: isDark ? '#94A3B8' : '#64748B', textTransform: 'uppercase', marginBottom: '6px', textAlign: 'center' }}>
                Period
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => handlePeriodSelect('AM')}
                  style={{
                    background: selectedPeriod === 'AM' ? '#84CC16' : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'),
                    color: selectedPeriod === 'AM' ? '#000000' : (isDark ? '#F8FAFC' : '#0F172A'),
                    border: selectedPeriod === 'AM' ? '1px solid #84CC16' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                    borderRadius: '8px',
                    padding: '12px 6px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 120ms ease'
                  }}
                >
                  <Sun size={14} />
                  <span>AM</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePeriodSelect('PM')}
                  style={{
                    background: selectedPeriod === 'PM' ? '#84CC16' : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFC'),
                    color: selectedPeriod === 'PM' ? '#000000' : (isDark ? '#F8FAFC' : '#0F172A'),
                    border: selectedPeriod === 'PM' ? '1px solid #84CC16' : (isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #E2E8F0'),
                    borderRadius: '8px',
                    padding: '12px 6px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 120ms ease'
                  }}
                >
                  <Moon size={14} />
                  <span>PM</span>
                </button>
              </div>
            </div>
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
            <span>Set Departure ({selectedHour}:{selectedMinute} {selectedPeriod})</span>
          </button>
        </div>
      )}
    </div>
  );
}
