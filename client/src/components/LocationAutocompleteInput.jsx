import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Search } from 'lucide-react';
import styles from './LocationAutocompleteInput.module.css';

export default function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter pickup location',
  label = 'Location',
  type = 'origin',
}) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 360 });

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  // Sync external value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Recalculate dropdown screen position
  const updatePosition = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 6,
        left: rect.left,
        width: Math.max(rect.width, 340),
      });
    }
  }, []);

  // Update position on open, scroll, or resize
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

  // Global click/touch outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const isInsideWrapper = wrapperRef.current && wrapperRef.current.contains(e.target);
      const isInsideDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);

      if (!isInsideWrapper && !isInsideDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

const POPULAR_HUBS = [
  { primary: 'Bandra Kurla Complex (BKC), Mumbai', secondary: 'Mumbai, Maharashtra', lat: 19.0657, lng: 72.8687 },
  { primary: 'Swargate Metro Hub, Pune', secondary: 'Pune, Maharashtra', lat: 18.5018, lng: 73.8586 },
  { primary: 'Hinjewadi Phase 1, Pune', secondary: 'Pune, Maharashtra', lat: 18.5913, lng: 73.7389 },
  { primary: 'Vashi Toll Plaza, Navi Mumbai', secondary: 'Navi Mumbai, Maharashtra', lat: 19.0657, lng: 72.9986 },
  { primary: 'Aerocity Metro Station, New Delhi', secondary: 'New Delhi, Delhi NCR', lat: 28.5494, lng: 77.1212 },
  { primary: 'Cyber Hub DLF Phase 2, Gurgaon', secondary: 'Gurgaon, Haryana', lat: 28.4950, lng: 77.0895 },
  { primary: 'Sector 62 IT Hub, Noida', secondary: 'Noida, Uttar Pradesh', lat: 28.6280, lng: 77.3649 },
  { primary: 'Electronic City Phase 1, Bengaluru', secondary: 'Bengaluru, Karnataka', lat: 12.8399, lng: 77.6770 },
  { primary: 'Whitefield ITPL, Bengaluru', secondary: 'Bengaluru, Karnataka', lat: 12.9863, lng: 77.7344 },
  { primary: 'Hitec City Cyber Towers, Hyderabad', secondary: 'Hyderabad, Telangana', lat: 17.4504, lng: 78.3808 }
];

  const fetchSuggestions = (text) => {
    clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!text || text.trim().length === 0) {
      setSuggestions(POPULAR_HUBS);
      updatePosition();
      setIsOpen(true);
      setIsSearchingOnline(false);
      return;
    }

    setIsSearchingOnline(true);

    debounceRef.current = setTimeout(async () => {
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(text.trim())}`,
          { signal: abortRef.current.signal }
        );

        if (res.ok) {
          const results = await res.json();
          if (results && results.length > 0) {
            setSuggestions(results);
            updatePosition();
            setIsOpen(true);
          } else {
            const filteredLocal = POPULAR_HUBS.filter(h => 
              h.primary.toLowerCase().includes(text.toLowerCase()) || 
              h.secondary.toLowerCase().includes(text.toLowerCase())
            );
            setSuggestions(filteredLocal.length > 0 ? filteredLocal : POPULAR_HUBS);
            updatePosition();
            setIsOpen(true);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          const filteredLocal = POPULAR_HUBS.filter(h => 
            h.primary.toLowerCase().includes(text.toLowerCase()) || 
            h.secondary.toLowerCase().includes(text.toLowerCase())
          );
          setSuggestions(filteredLocal.length > 0 ? filteredLocal : POPULAR_HUBS);
          updatePosition();
          setIsOpen(true);
        }
      } finally {
        setIsSearchingOnline(false);
      }
    }, 120);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange && onChange(val);
    setSelectedIndex(0);
    fetchSuggestions(val);
  };

  const handleSelect = async (item) => {
    const fullAddr = item.secondary
      ? `${item.primary}, ${item.secondary}`
      : item.primary;

    setQuery(item.primary);
    onChange && onChange(item.primary);
    setIsOpen(false);
    setSuggestions([]);
    setSelectedIndex(0);

    const basePayload = {
      ...item,
      displayText: item.primary,
      fullAddress: fullAddr,
    };

    // Immediately notify parent
    onSelect && onSelect(basePayload);

    // Asynchronously resolve exact lat/lng for map
    if (item.place_id && (!item.lat || item.lat === 0)) {
      try {
        const res = await fetch(`/api/geocode/resolve?place_id=${encodeURIComponent(item.place_id)}`);
        if (res.ok) {
          const details = await res.json();
          if (details.lat && details.lng) {
            onSelect && onSelect({
              ...basePayload,
              lat: details.lat,
              lng: details.lng,
              fullAddress: details.address || fullAddr,
            });
          }
        }
      } catch (_) {}
    }
  };

  const handleClear = (e) => {
    e && e.stopPropagation();
    clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setQuery('');
    onChange && onChange('');
    setIsOpen(false);
    setSuggestions([]);
    setIsSearchingOnline(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[selectedIndex]) handleSelect(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && suggestions.length > 0;

  // Dropdown portal rendered directly on body so it NEVER gets clipped by any container or stacking context
  const dropdownPortal = showDropdown && typeof document !== 'undefined' && createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        position: 'fixed',
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: `${dropdownPos.width}px`,
        zIndex: 999999,
        pointerEvents: 'auto',
      }}
    >
      <div className={styles.list}>
        {suggestions.map((item, idx) => (
          <div
            key={`${item.place_id || item.primary}-${idx}`}
            className={`${styles.olaItem} ${idx === selectedIndex ? styles.olaItemSelected : ''}`}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelect(item);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelect(item);
            }}
            onMouseEnter={() => setSelectedIndex(idx)}
          >
            <div className={styles.olaPinWrapper}>
              <MapPin size={18} color="#94A3B8" />
            </div>
            <div className={styles.olaContent}>
              <div className={styles.olaPrimary}>{item.primary}</div>
              <div className={styles.olaSecondary}>{item.secondary}</div>
            </div>
            <button
              type="button"
              className={styles.olaMapBtn}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(item);
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(item);
              }}
            >
              MAP
            </button>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {label && (
        <div className={styles.labelRow}>
          <label className={styles.label}>
            {type === 'origin'
              ? <span className={styles.uberDotPickup} />
              : <span className={styles.uberDotDropoff} />
            }
            <span>{label}</span>
          </label>
        </div>
      )}

      <div className={`${styles.inputContainer} ${showDropdown ? styles.inputFocused : ''}`}>
        <div className={styles.leadIcon}>
          <Search size={15} color={isSearchingOnline ? '#84CC16' : '#94A3B8'} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            fetchSuggestions(query);
            updatePosition();
            setIsOpen(true);
          }}
          onClick={() => {
            if (!isOpen) {
              fetchSuggestions(query);
              updatePosition();
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          autoComplete="off"
          spellCheck="false"
        />

        <div className={styles.actionButtons}>
          {query && (
            <button type="button" onClick={handleClear} className={styles.clearBtn} aria-label="Clear">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {dropdownPortal}
    </div>
  );
}
