import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, X, Search, Building2, Plane, Train, Navigation, Sparkles, Compass, CornerDownRight } from 'lucide-react';
import { POPULAR_INDIAN_CITIES, INDIAN_LOCATIONS_DATABASE } from '../data/indianLocations';
import styles from './LocationAutocompleteInput.module.css';

export default function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search local street address, landmark, society, or city...',
  label = 'Location',
  type = 'origin',
}) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [onlineResults, setOnlineResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 380 });

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
        width: Math.max(rect.width, 360),
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

  // Filter curated database based on query & selected city filter
  const filteredLocalLocations = useMemo(() => {
    let list = INDIAN_LOCATIONS_DATABASE;

    // Filter by city chip
    if (selectedCity && selectedCity !== 'All Cities') {
      list = list.filter(item => item.city.toLowerCase() === selectedCity.toLowerCase());
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return list.slice(0, 18);
    }

    const qWords = trimmed.split(/\s+/).filter(Boolean);

    return list.filter(item => {
      const targetStr = `${item.primary} ${item.street || ''} ${item.city} ${item.state} ${item.tag || ''}`.toLowerCase();
      return qWords.every(word => targetStr.includes(word));
    }).slice(0, 20);
  }, [query, selectedCity]);

  // Custom User-Typed Local Street Item
  const customTypedLocation = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 3) return null;

    // If query matches an existing item exactly, don't show custom duplicate
    const exactMatch = filteredLocalLocations.some(
      l => l.primary.toLowerCase() === trimmed.toLowerCase()
    );
    if (exactMatch) return null;

    return {
      id: `custom_${Date.now()}`,
      primary: trimmed,
      street: `${trimmed}, Local Commuting Point`,
      city: selectedCity !== 'All Cities' ? selectedCity : 'India',
      state: 'India',
      type: 'custom_street',
      tag: '📍 Exact Street Address',
      lat: 0,
      lng: 0,
      isCustom: true
    };
  }, [query, filteredLocalLocations, selectedCity]);

  // Combined suggestions list (Custom Street + Local Curated + Online API results)
  const displaySuggestions = useMemo(() => {
    const list = [];
    if (customTypedLocation) {
      list.push(customTypedLocation);
    }

    // Add local database matches
    list.push(...filteredLocalLocations);

    // Add online results if typed
    if (query.trim().length >= 2 && onlineResults.length > 0) {
      const seenNames = new Set(list.map(l => l.primary.toLowerCase()));
      const filteredOnline = onlineResults.filter(o => !seenNames.has(o.primary.toLowerCase()));
      list.push(...filteredOnline);
    }

    return list;
  }, [customTypedLocation, filteredLocalLocations, onlineResults, query]);

  // Online Geocoding Fallback for specific street addresses
  const fetchOnlineSuggestions = (text) => {
    clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!text || text.trim().length < 2) {
      setOnlineResults([]);
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
            const mapped = results.map(r => ({
              id: r.place_id || `geo_${Math.random()}`,
              primary: r.primary,
              street: r.secondary || r.city || 'India',
              city: r.city || 'India',
              state: 'India',
              type: 'online_result',
              tag: '📍 Live Geocode',
              lat: r.lat,
              lng: r.lng,
              place_id: r.place_id
            }));
            setOnlineResults(mapped);
          } else {
            setOnlineResults([]);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') setOnlineResults([]);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 150);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange && onChange(val);
    setSelectedIndex(0);
    updatePosition();
    setIsOpen(true);
    fetchOnlineSuggestions(val);
  };

  const handleSelect = async (item) => {
    const primaryName = item.primary;
    const fullStreetAddress = item.street 
      ? `${item.primary}, ${item.street}, ${item.city}` 
      : `${item.primary}, ${item.city}`;

    setQuery(primaryName);
    onChange && onChange(primaryName);
    setIsOpen(false);
    setSelectedIndex(0);

    const basePayload = {
      ...item,
      displayText: primaryName,
      fullAddress: fullStreetAddress,
      originAddress: fullStreetAddress,
      destinationAddress: fullStreetAddress,
      lat: item.lat || 0,
      lng: item.lng || 0
    };

    onSelect && onSelect(basePayload);

    // Resolve lat/lng if from place_id
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
              fullAddress: details.address || fullStreetAddress,
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
    setOnlineResults([]);
    setIsSearchingOnline(false);
    inputRef.current?.focus();
    updatePosition();
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, displaySuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (displaySuggestions[selectedIndex]) handleSelect(displaySuggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'airport':
        return <Plane size={16} />;
      case 'metro':
      case 'station':
        return <Train size={16} />;
      case 'tech_park':
        return <Building2 size={16} />;
      case 'expressway_hub':
        return <Navigation size={16} />;
      case 'custom_street':
        return <CornerDownRight size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  const showDropdown = isOpen && displaySuggestions.length > 0;

  // Dropdown portal rendered directly on body so it NEVER gets clipped by any container or stacking context
  const dropdownPortal = isOpen && typeof document !== 'undefined' && createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: `${dropdownPos.width}px`,
      }}
    >
      {/* Top Quick City Filter Chips */}
      <div className={styles.cityFilterStrip}>
        {POPULAR_INDIAN_CITIES.map(city => (
          <button
            key={city}
            type="button"
            className={`${styles.cityChip} ${selectedCity === city ? styles.cityChipActive : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedCity(city);
              setSelectedIndex(0);
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Location Items List */}
      <div className={styles.list}>
        {displaySuggestions.length > 0 ? (
          displaySuggestions.map((item, idx) => (
            <div
              key={`${item.id || item.primary}-${idx}`}
              className={`${styles.uberItem} ${idx === selectedIndex ? styles.uberItemSelected : ''}`}
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
              <div className={styles.uberPinWrapper} style={{
                background: item.isCustom ? 'rgba(59, 130, 246, 0.15)' : undefined,
                color: item.isCustom ? '#3B82F6' : undefined
              }}>
                {getItemIcon(item.type)}
              </div>

              <div className={styles.uberContent}>
                <div className={styles.uberHeaderRow}>
                  <span className={styles.uberPrimary}>
                    {item.primary}
                  </span>
                  {item.tag && (
                    <span className={styles.uberBadge} style={{
                      background: item.isCustom ? 'rgba(59, 130, 246, 0.14)' : undefined,
                      color: item.isCustom ? '#2563EB' : undefined,
                      borderColor: item.isCustom ? 'rgba(59, 130, 246, 0.3)' : undefined
                    }}>
                      {item.tag}
                    </span>
                  )}
                </div>

                {item.street && (
                  <div className={styles.uberStreetAddress}>
                    <MapPin size={11} color="#64748B" style={{ flexShrink: 0 }} />
                    <span>{item.street}</span>
                  </div>
                )}

                <div className={styles.uberCityTag}>
                  <span>📍 {item.city}, {item.state}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            No matching Indian locations found. Try typing a street or landmark name.
          </div>
        )}
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
            updatePosition();
            setIsOpen(true);
          }}
          onClick={() => {
            updatePosition();
            setIsOpen(true);
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
