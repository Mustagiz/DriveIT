import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  MapPin, X, Search, Building2, Plane, Train, Navigation,
  CornerDownRight, LocateFixed, Loader2, Edit3, CheckCircle, AlertCircle,
  Clock, History
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
  corridor = 'mumbai_pune',
}) {
  const [query, setQuery]               = useState(value || '');
  const [isOpen, setIsOpen]             = useState(false);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [onlineResults, setOnlineResults]   = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
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

  const wrapperRef      = useRef(null);
  const inputRef        = useRef(null);
  const dropdownRef     = useRef(null);
  const debounceRef     = useRef(null);
  const abortRef        = useRef(null);
  const sessionTokenRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('driveit_recent_locations');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {}
  }, []);

  const getOrCreateSessionToken = () => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `st_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return sessionTokenRef.current;
  };

  const clearSessionToken = () => {
    sessionTokenRef.current = null;
  };

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
      if (!inWrapper && !inDropdown) {
        setIsOpen(false);
        clearSessionToken();
      }
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
        let info;
        try {
          const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const data = await res.json();
            info = {
              primary: data.primary || 'Present Location',
              street: data.formattedAddress,
              city: data.city || 'India',
              state: 'India',
              lat,
              lng
            };
          }
        } catch (_) {}

        if (!info) {
          info = await reverseGeocode(lat, lng);
        }

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

    const currentToken = sessionTokenRef.current;
    clearSessionToken();

    setQuery(primaryName);
    onChange && onChange(primaryName);
    setIsOpen(false);
    setSelectedIndex(0);

    // Save to Recent Searches in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('driveit_recent_locations') || '[]');
      const filtered = existing.filter(e => e.primary?.toLowerCase() !== item.primary?.toLowerCase());
      const updated = [{
        id: `recent_${Date.now()}`,
        primary: item.primary,
        street: item.street || item.city,
        city: item.city || 'India',
        state: item.state || 'India',
        type: 'recent',
        tag: '🕒 Recent Search',
        lat: item.lat || 0,
        lng: item.lng || 0,
        place_id: item.place_id
      }, ...filtered].slice(0, 5);
      localStorage.setItem('driveit_recent_locations', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch (e) {}

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

    // Resolve precise lat/lng via place_id with Session Token
    if (item.place_id && (!item.lat || item.lat === 0)) {
      try {
        const tokenQuery = currentToken ? `&sessionToken=${encodeURIComponent(currentToken)}` : '';
        const res = await fetch(`/api/geocode/resolve?place_id=${encodeURIComponent(item.place_id)}${tokenQuery}`);
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
  const CITY_CENTROIDS = useMemo(() => ({
    mumbai: { lat: 19.0760, lng: 72.8777, city: 'Mumbai', state: 'Maharashtra' },
    pune: { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
    bengaluru: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
    bangalore: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
    delhi: { lat: 28.6139, lng: 77.2090, city: 'Delhi', state: 'Delhi' },
    gurgaon: { lat: 28.4595, lng: 77.0266, city: 'Gurgaon', state: 'Haryana' },
    noida: { lat: 28.5355, lng: 77.3910, city: 'Noida', state: 'Uttar Pradesh' },
    chennai: { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
    hyderabad: { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
    jaipur: { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
    ahmedabad: { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
    kolkata: { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
    goa: { lat: 15.2993, lng: 74.1240, city: 'Goa', state: 'Goa' },
    chandigarh: { lat: 30.7333, lng: 76.7794, city: 'Chandigarh', state: 'Punjab' },
    kochi: { lat: 9.9312, lng: 76.2673, city: 'Kochi', state: 'Kerala' },
    lonavala: { lat: 18.7557, lng: 73.4091, city: 'Lonavala', state: 'Maharashtra' },
    agra: { lat: 27.1767, lng: 78.0081, city: 'Agra', state: 'Uttar Pradesh' },
    mysore: { lat: 12.2958, lng: 76.6394, city: 'Mysore', state: 'Karnataka' }
  }), []);

  const filteredLocalLocations = useMemo(() => {
    let list = INDIAN_LOCATIONS_DATABASE;
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      if (selectedCity && selectedCity !== 'All Cities') {
        list = list.filter(i => i.city.toLowerCase() === selectedCity.toLowerCase());
      }
      return list.slice(0, 18);
    }

    // Smart relevance scoring
    const scored = [];
    for (const item of list) {
      const p = (item.primary || '').toLowerCase();
      const s = (item.street || '').toLowerCase();
      const c = (item.city || '').toLowerCase();
      const tag = (item.tag || '').toLowerCase();

      let score = 0;
      if (p === trimmed) score += 100;
      else if (p.startsWith(trimmed)) score += 60;
      else if (p.includes(trimmed)) score += 40;
      else if (s.includes(trimmed)) score += 25;
      else if (c.startsWith(trimmed)) score += 30;
      else if (c.includes(trimmed)) score += 15;
      else if (tag.includes(trimmed)) score += 10;

      // Bonus if matches selected city
      if (selectedCity && selectedCity !== 'All Cities' && c === selectedCity.toLowerCase()) {
        score += 20;
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.item).slice(0, 20);
  }, [query, selectedCity]);

  const displaySuggestions = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      const list = [];
      if (recentSearches.length > 0) {
        list.push(...recentSearches);
      }
      list.push(...filteredLocalLocations.slice(0, 12));
      return list;
    }

    const list = [];
    const seen = new Set();

    // 1. High-confidence local matches first (verified lat/lng)
    for (const loc of filteredLocalLocations) {
      const key = (loc.primary || '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(loc);
      }
    }

    // 2. Real-time online geocoding results
    for (const onl of onlineResults) {
      const key = (onl.primary || '').toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(onl);
      }
    }

    // 3. Fallback: offer exact typed address at the end if user wants a custom point
    if (trimmed.length >= 2) {
      // Find fallback coordinates from city centroids or online result
      const lowerTrimmed = trimmed.toLowerCase();
      let matchedCoord = { lat: 18.5204, lng: 73.8567 }; // default Pune
      for (const [cityName, coord] of Object.entries(CITY_CENTROIDS)) {
        if (lowerTrimmed.includes(cityName)) {
          matchedCoord = coord;
          break;
        }
      }

      const exactLat = onlineResults[0]?.lat || list[0]?.lat || matchedCoord.lat;
      const exactLng = onlineResults[0]?.lng || list[0]?.lng || matchedCoord.lng;

      list.push({
        id: `exact_typed_${trimmed}`,
        primary: trimmed,
        street: 'Use this address as exact pickup / drop point',
        city: selectedCity !== 'All Cities' ? selectedCity : (matchedCoord.city || 'India'),
        state: matchedCoord.state || 'India',
        type: 'custom_street',
        tag: '🏠 Custom Address',
        lat: exactLat,
        lng: exactLng,
      });
    }

    return list;
  }, [filteredLocalLocations, onlineResults, query, recentSearches, selectedCity, CITY_CENTROIDS]);

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
        const token = getOrCreateSessionToken();
        const res = await fetch(
          `/api/geocode?q=${encodeURIComponent(text.trim())}&sessionToken=${encodeURIComponent(token)}&corridor=${encodeURIComponent(corridor)}`,
          { signal: abortRef.current.signal }
        );
        if (res.ok) {
          const results = await res.json();
          if (Array.isArray(results) && results.length > 0) {
            setOnlineResults(results.map(r => ({
              id: r.place_id || `geo_${Math.random()}`,
              primary: r.primary,
              street: r.secondary || r.city || 'India',
              city: r.city || 'India',
              state: 'India',
              type: 'online_result',
              tag: '⚡ Live Search Result',
              lat: r.lat || 0,
              lng: r.lng || 0,
              place_id: r.place_id
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
    clearSessionToken();
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
    else if (e.key === 'Escape')   { setIsOpen(false); clearSessionToken(); }
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'recent':       return <Clock size={16} />;
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
