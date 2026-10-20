import React from 'react';
import { Search, ArrowRightLeft, Calendar, Sparkles, ShieldCheck, Zap, Award, Compass, Route } from 'lucide-react';
import { useToast } from './Toast';
import LocationAutocompleteInput from './LocationAutocompleteInput';
import ScheduleDropdownPicker from './ScheduleDropdownPicker';
import { SpotlightCard, ShinyText } from './ui';
import styles from './SearchConsole.module.css';

export default function SearchConsole({
  originInput,
  setOriginInput,
  destinationInput,
  setDestinationInput,
  selectedDateTime,
  setSelectedDateTime,
  onSearch,
  onSwap,
  onSelectPreset,
  onSelectOrigin,
  onSelectDestination,
  evOnly = false,
  onToggleEvOnly,
  verifiedOnly = false,
  onToggleVerifiedOnly
}) {
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanOrigin = (originInput || '').trim();
    const cleanDest = (destinationInput || '').trim();

    if (!cleanOrigin && !cleanDest) {
      showToast('Please enter both pickup and destination cities.', 'warning');
      return;
    }

    if (cleanOrigin && cleanDest && cleanOrigin.toLowerCase() === cleanDest.toLowerCase()) {
      showToast('Origin and destination cannot be the same city.', 'error');
      return;
    }

    onSearch && onSearch(cleanOrigin, cleanDest, selectedDateTime ? selectedDateTime.split('T')[0] : '');
  };

  const handleCorridorClick = (from, to) => {
    setOriginInput(from);
    setDestinationInput(to);
    if (typeof onSelectPreset === 'function') {
      onSelectPreset(from, to);
    } else if (typeof onSearch === 'function') {
      onSearch(from, to);
    }
  };

  return (
    <SpotlightCard 
      spotlightColor="rgba(0, 175, 245, 0.14)" 
      className={styles.searchCard}
      style={{ padding: '24px 30px', borderRadius: '24px' }}
    >
      <form onSubmit={handleSubmit}>
        {/* 1. Expressway Corridors & Quick Filter Ribbon */}
        <div className={styles.ribbonRow}>
          <div className={styles.corridorGroup}>
            <span className={styles.corridorLabel}>
              <Route size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Corridors:
            </span>
            <button
              type="button"
              onClick={() => handleCorridorClick('Mumbai', 'Pune')}
              className={styles.corridorChip}
            >
              <span>🛣️ Mumbai ⇄ Pune</span>
            </button>
            <button
              type="button"
              onClick={() => handleCorridorClick('Delhi', 'Agra')}
              className={styles.corridorChip}
            >
              <span>🛣️ Delhi ⇄ Agra</span>
            </button>
            <button
              type="button"
              onClick={() => handleCorridorClick('Bengaluru', 'Mysuru')}
              className={styles.corridorChip}
            >
              <span>🛣️ BLR ⇄ Mysuru</span>
            </button>
          </div>

          <div className={styles.toggleGroup}>
            {typeof onToggleEvOnly === 'function' && (
              <button
                type="button"
                onClick={onToggleEvOnly}
                className={`${styles.toggleChip} ${evOnly ? styles.toggleChipActive : ''}`}
                title="Filter 100% Electric Vehicles"
              >
                <Zap size={12} fill={evOnly ? 'currentColor' : 'none'} />
                <span>⚡ 100% EV Only</span>
              </button>
            )}

            {typeof onToggleVerifiedOnly === 'function' && (
              <button
                type="button"
                onClick={onToggleVerifiedOnly}
                className={`${styles.toggleChip} ${verifiedOnly ? styles.toggleChipActiveLime : ''}`}
                title="Filter UIDAI Aadhaar Verified Pilots"
              >
                <ShieldCheck size={12} />
                <span>🛡️ Verified Pilots</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Main Search Input Grid */}
        <div className={styles.inputGrid}>
          {/* FROM Location Input */}
          <div className={styles.inputCol}>
            <LocationAutocompleteInput
              label="FROM"
              type="origin"
              value={originInput}
              onChange={(val) => setOriginInput(val)}
              onSelect={(place) => {
                const label = place.primary || place.name || place.fullAddress || place;
                setOriginInput(label);
                if (onSelectOrigin) onSelectOrigin(place);
                else if (onSelectPreset && onSelectPreset.onSelectOrigin) onSelectPreset.onSelectOrigin(place);
              }}
              placeholder="Pickup address, city or airport..."
              iconColor="#10B981"
            />
          </div>

          {/* Direction Swap Button */}
          <div className={styles.swapCol}>
            <button
              type="button"
              onClick={onSwap}
              className={styles.swapBtn}
              title="Swap From and To destinations"
              aria-label="Swap departure and destination"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* TO Location Input */}
          <div className={styles.inputCol}>
            <LocationAutocompleteInput
              label="TO"
              type="destination"
              value={destinationInput}
              onChange={(val) => setDestinationInput(val)}
              onSelect={(place) => {
                const label = place.primary || place.name || place.fullAddress || place;
                setDestinationInput(label);
                if (onSelectDestination) onSelectDestination(place);
                else if (onSelectPreset && onSelectPreset.onSelectDestination) onSelectPreset.onSelectDestination(place);
              }}
              placeholder="Dropoff address, city or hub..."
              iconColor="#EF4444"
            />
          </div>

          {/* Departure Date/Time Selector */}
          <div className={`${styles.inputCol} ${styles.scheduleCol}`}>
            <ScheduleDropdownPicker
              value={selectedDateTime}
              onChange={(val) => setSelectedDateTime(val)}
              onQuickSelect={(val) => {
                setSelectedDateTime(val);
                onSearch && onSearch(originInput, destinationInput, val ? val.split('T')[0] : '');
              }}
            />
          </div>

          {/* Search Button */}
          <div className={`${styles.inputCol} ${styles.actionCol}`}>
            <button
              type="submit"
              className={styles.searchSubmitBtn}
              id="search-rides-btn"
            >
              <Search size={18} strokeWidth={2.5} />
              <span>Search Rides</span>
            </button>
          </div>
        </div>

        {/* 3. Footer Bar with Clear & Live Metrics */}
        <div className={styles.footerRow}>
          <div className={styles.presetsWrapper}>
            <span className={styles.presetLabel}>Quick Fares:</span>
            <button
              type="button"
              onClick={() => handleCorridorClick('Mumbai', 'Pune')}
              className={styles.presetChip}
            >
              <span>Mumbai ➔ Pune</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹350</strong>
            </button>
            <button
              type="button"
              onClick={() => handleCorridorClick('Bengaluru', 'Chennai')}
              className={styles.presetChip}
            >
              <span>Bengaluru ➔ Chennai</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹400</strong>
            </button>
            <button
              type="button"
              onClick={() => handleCorridorClick('Delhi', 'Jaipur')}
              className={styles.presetChip}
            >
              <span>Delhi ➔ Jaipur</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹450</strong>
            </button>
            {(originInput || destinationInput) && (
              <button
                type="button"
                onClick={() => {
                  setOriginInput('');
                  setDestinationInput('');
                  onSearch && onSearch('', '');
                }}
                className={styles.clearChip}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Live Trust Safety Indicators */}
          <div className={styles.trustPills}>
            <span className={styles.trustItem}>
              <span className={styles.greenDot} />
              <ShieldCheck size={13} color="#10B981" />
              <span>100% UIDAI Verified</span>
            </span>
            <span className={styles.trustItem}>
              <span className={styles.greenDot} />
              <Award size={13} color="#10B981" />
              <span>4.92 ★ Score</span>
            </span>
            <span className={styles.trustItem}>
              <span className={styles.blueDot} />
              <Zap size={13} color="#38BDF8" />
              <span>FASTag Express</span>
            </span>
          </div>
        </div>
      </form>
    </SpotlightCard>
  );
}
