import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin, X, Search, Building2, Plane, Train, Navigation,
  CornerDownRight, LocateFixed, Loader2, Edit3, CheckCircle, AlertCircle
} from 'lucide-react';
import { POPULAR_INDIAN_CITIES, INDIAN_LOCATIONS_DATABASE } from '../data/indianLocations';
import styles from './LocationAutocompleteInput.module.css';

// ── Reverse-geocode lat/lng → human-readable address ──────────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
      { headers: { 'User-Agent': 'DriveIt-Rideshare-Platform/2.0' }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error('Reverse geocode failed');
    const data = await res.json();
    const parts = (data.display_name || '').split(',');
    const primary = [
      data.address?.road || data.address?.suburb || parts[0],
      data.address?.suburb || data.address?.neighbourhood || parts[1]
    ].filter(Boolean).join(', ').trim() || parts[0]?.trim() || 'Current Location';
    const city =
      data.address?.city || data.address?.town || data.address?.village ||
      data.address?.state_district || data.address?.state || 'India';
    const state = data.address?.state || 'India';
    const street = parts.slice(0, 4).join(', ').trim();
    return { primary, street, city, state, lat, lng, displayName: data.display_name };
  } catch {
    return {
      primary: 'Current Location',
      street: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      city: 'India', state: 'India', lat, lng,
      displayName: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    };
  }
}

export default function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search local street address, landmark, society, or city...',
  label = 'Location',
  type = 'origin',
}) {
  const [query, setQuery]               = useState(value || '');
  const [isOpen, setIsOpen]             = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [onlineResults, setOnlineResults]   = useState([]);
  const [selectedIndex, setSelectedIndex]   = useState(0);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [dropdownPos, setDropdownPos]   = useState({ top: 0, left: 0, width: 380 });

  // GPS state
  const [gpsState, setGpsState] = useState('idle'); // idle | loading | success | error
  const [gpsItem, setGpsItem]   = useState(null);
  const [gpsError, setGpsError] = useState('');

  // Custom location modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput]         = useState('');
  const [customCity, setCustomCity]           = useState('Pune');

  const wrapperRef   = useRef(null);
  const inputRef     = useRef(null);
  const dropdownRef  = useRef(null);
  const debounceRef  = useRef(null);
  const abortRef     = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

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

  useEffect(() => {
    const handleOutside = (e) => {
      const inWrapper  = wrapperRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inWrapper && !inDropdown) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  // ── GPS: fetch present location ──────────────────────────────────────────────
  const handleGpsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      setGpsState('error');
      return;
    }
    setGpsState('loading');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const info = await reverseGeocode(lat, lng);
        const item = {
          id: 'gps_current',
          primary: info.primary,
          street: info.street,
          city: info.city,
          state: info.state,
          type: 'gps',
          tag: '📍 Present Location (GPS)',
          lat,
          lng,
          isGps: true
        };
        setGpsItem(item);
        setGpsState('success');
        // Auto-select GPS location immediately
        applySelection(item);
        setIsOpen(false);
      },
      (err) => {
        const msg = err.code === 1
          ? 'Location permission denied. Please allow location access.'
          : err.code === 2
          ? 'Location unavailable. Check your GPS signal.'
          : 'Location request timed out. Please try again.';
        setGpsError(msg);
        setGpsState('error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // ── Apply selection (shared logic) ──────────────────────────────────────────
  const applySelection = async (item) => {
    const primaryName      = item.primary;
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

    // Resolve precise lat/lng via place_id
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

  // ── Custom location modal submit ─────────────────────────────────────────────
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const item = {
      id: `custom_${Date.now()}`,
      primary: trimmed,
      street: `${trimmed}, ${customCity}`,
      city: customCity,
      state: 'India',
      type: 'custom_street',
      tag: '✏️ Custom Location',
      lat: 0,
      lng: 0
    };
    applySelection(item);
    setShowCustomModal(false);
    setCustomInput('');
  };

  // ── Curated + online suggestions ─────────────────────────────────────────────
  const filteredLocalLocations = useMemo(() => {
    let list = INDIAN_LOCATIONS_DATABASE;
    if (selectedCity && selectedCity !== 'All Cities') {
      list = list.filter(i => i.city.toLowerCase() === selectedCity.toLowerCase());
    }
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return list.slice(0, 18);
    const words = trimmed.split(/\s+/);
    return list.filter(i => {
      const t = `${i.primary} ${i.street || ''} ${i.city} ${i.state} ${i.tag || ''}`.toLowerCase();
      return words.every(w => t.includes(w));
    }).slice(0, 20);
  }, [query, selectedCity]);

  const displaySuggestions = useMemo(() => {
    const list = [...filteredLocalLocations];
    if (query.trim().length >= 2 && onlineResults.length > 0) {
      const seen = new Set(list.map(l => l.primary.toLowerCase()));
      list.push(...onlineResults.filter(o => !seen.has(o.primary.toLowerCase())));
    }
    return list;
  }, [filteredLocalLocations, onlineResults, query]);

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
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(text.trim())}`,
          { signal: abortRef.current.signal });
        if (res.ok) {
          const results = await res.json();
          if (results?.length > 0) {
            setOnlineResults(results.map(r => ({
              id: r.place_id || `geo_${Math.random()}`,
              primary: r.primary,
              street: r.secondary || r.city || 'India',
              city: r.city || 'India',
              state: 'India',
              type: 'online_result',
              tag: '📡 Live Search',
              lat: r.lat, lng: r.lng, place_id: r.place_id
            })));
          } else setOnlineResults([]);
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

  const handleClear = (e) => {
    e?.stopPropagation();
    clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setQuery('');
    onChange && onChange('');
    setOnlineResults([]);
    setIsSearchingOnline(false);
    setGpsState('idle');
    setGpsItem(null);
    inputRef.current?.focus();
    updatePosition();
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || displaySuggestions.length === 0) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelectedIndex(p => Math.min(p + 1, displaySuggestions.length - 1)); }
    else if (e.key === 'ArrowUp')  { e.preventDefault(); setSelectedIndex(p => Math.max(p - 1, 0)); }
    else if (e.key === 'Enter')    { e.preventDefault(); if (displaySuggestions[selectedIndex]) applySelection(displaySuggestions[selectedIndex]); }
    else if (e.key === 'Escape')   { setIsOpen(false); }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'airport':      return <Plane size={16} />;
      case 'metro':
      case 'station':      return <Train size={16} />;
      case 'tech_park':    return <Building2 size={16} />;
      case 'expressway_hub': return <Navigation size={16} />;
      case 'gps':          return <LocateFixed size={16} />;
      case 'custom_street':  return <Edit3 size={16} />;
      default:             return <MapPin size={16} />;
    }
  };

  const showDropdown = isOpen && displaySuggestions.length > 0;

  // ── Dropdown portal ──────────────────────────────────────────────────────────
  const dropdownPortal = isOpen && typeof document !== 'undefined' && createPortal(
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{ top: `${dropdownPos.top}px`, left: `${dropdownPos.left}px`, width: `${dropdownPos.width}px` }}
    >
      {/* GPS + Custom location action row */}
      <div className={styles.actionRow}>
        {/* Use Present Location */}
        <button
          type="button"
          className={`${styles.actionBtn} ${gpsState === 'loading' ? styles.actionBtnLoading : ''} ${gpsState === 'success' ? styles.actionBtnSuccess : ''} ${gpsState === 'error' ? styles.actionBtnError : ''}`}
          onClick={handleGpsClick}
          disabled={gpsState === 'loading'}
        >
          {gpsState === 'loading' ? <Loader2 size={15} className={styles.spinIcon} />
            : gpsState === 'success' ? <CheckCircle size={15} />
            : gpsState === 'error'   ? <AlertCircle size={15} />
            : <LocateFixed size={15} />}
          <span>
            {gpsState === 'loading' ? 'Fetching GPS...'
              : gpsState === 'success' ? 'Using Present Location'
              : gpsState === 'error'   ? 'Location Denied'
              : 'Use Present Location'}
          </span>
        </button>


      </div>

      {/* GPS error toast */}
      {gpsState === 'error' && gpsError && (
        <div className={styles.gpsErrorBar}>
          <AlertCircle size={13} />
          <span>{gpsError}</span>
        </div>
      )}

      {/* City filter chips */}
      <div className={styles.cityFilterStrip}>
        {POPULAR_INDIAN_CITIES.map(city => (
          <button
            key={city}
            type="button"
            className={`${styles.cityChip} ${selectedCity === city ? styles.cityChipActive : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCity(city); setSelectedIndex(0); }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Location list */}
      <div className={styles.list}>
        {displaySuggestions.length > 0 ? displaySuggestions.map((item, idx) => (
          <div
            key={`${item.id || item.primary}-${idx}`}
            className={`${styles.uberItem} ${idx === selectedIndex ? styles.uberItemSelected : ''}`}
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); applySelection(item); }}
            onClick={(e)     => { e.preventDefault(); e.stopPropagation(); applySelection(item); }}
            onMouseEnter={() => setSelectedIndex(idx)}
          >
            <div className={styles.uberPinWrapper}
              style={{
                background: item.isGps ? 'rgba(16, 185, 129, 0.15)' : undefined,
                color:      item.isGps ? '#10B981' : undefined,
              }}
            >
              {getItemIcon(item.type)}
            </div>
            <div className={styles.uberContent}>
              <div className={styles.uberHeaderRow}>
                <span className={styles.uberPrimary}>{item.primary}</span>
                {item.tag && (
                  <span className={styles.uberBadge}
                    style={{
                      background:   item.isGps ? 'rgba(16, 185, 129, 0.14)' : undefined,
                      color:        item.isGps ? '#059669' : undefined,
                      borderColor:  item.isGps ? 'rgba(16, 185, 129, 0.4)' : undefined,
                    }}
                  >
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
        )) : (
          <div className={styles.emptyState}>
            No matching Indian locations. Try a street name or use Custom Location.
          </div>
        )}
      </div>
    </div>,
    document.body
  );

  // ── Custom location modal portal ─────────────────────────────────────────────
  const customModalPortal = showCustomModal && typeof document !== 'undefined' && createPortal(
    <div className={styles.modalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) setShowCustomModal(false); }}>
      <div className={styles.customModal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleRow}>
            <Edit3 size={18} color="#84CC16" />
            <h3 className={styles.modalTitle}>Set Custom Location</h3>
          </div>
          <button type="button" className={styles.modalClose} onClick={() => setShowCustomModal(false)}>
            <X size={16} />
          </button>
        </div>

        <p className={styles.modalSubtitle}>
          Enter any street address, society name, landmark, or GPS coordinates — even if it's not in our list.
        </p>

        <form onSubmit={handleCustomSubmit} className={styles.customForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <MapPin size={13} /> Street / Area / Landmark *
            </label>
            <input
              type="text"
              autoFocus
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="e.g. Koregaon Park Lane 7, Banjara Hills Road 12, Sector 18 Noida..."
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <Building2 size={13} /> City
            </label>
            <select
              value={customCity}
              onChange={e => setCustomCity(e.target.value)}
              className={styles.formSelect}
            >
              {POPULAR_INDIAN_CITIES.filter(c => c !== 'All Cities').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowCustomModal(false)}>
              Cancel
            </button>
            <button type="submit" className={styles.confirmBtn} disabled={!customInput.trim()}>
              <CheckCircle size={15} />
              Use This Location
            </button>
          </div>
        </form>
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

          {/* GPS quick-access button beside label */}
          <button
            type="button"
            title="Use Present Location"
            className={styles.gpsLabelBtn}
            onClick={handleGpsClick}
            disabled={gpsState === 'loading'}
          >
            {gpsState === 'loading' ? <Loader2 size={12} className={styles.spinIcon} /> : <LocateFixed size={12} />}
            <span>{gpsState === 'loading' ? 'Locating...' : 'Use My Location'}</span>
          </button>
        </div>
      )}

      <div className={`${styles.inputContainer} ${showDropdown ? styles.inputFocused : ''}`}>
        <div className={styles.leadIcon}>
          {gpsState === 'loading'
            ? <Loader2 size={15} color="#84CC16" className={styles.spinIcon} />
            : <Search size={15} color={isSearchingOnline ? '#84CC16' : '#94A3B8'} />
          }
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { updatePosition(); setIsOpen(true); }}
          onClick={() => { updatePosition(); setIsOpen(true); }}
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
      {customModalPortal}
    </div>
  );
}
