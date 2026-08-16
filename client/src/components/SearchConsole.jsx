import React from 'react';
import { Search, ArrowRightLeft, Calendar, Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';
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
  onSelectDestination
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch();
  };

  const handlePresetClick = (from, to) => {
    setOriginInput(from);
    setDestinationInput(to);
    if (typeof onSelectPreset === 'function') {
      onSelectPreset(from, to);
    } else if (onSelectPreset && typeof onSelectPreset.handleSelectPreset === 'function') {
      onSelectPreset.handleSelectPreset(from, to);
    } else if (onSearch) {
      onSearch(from, to);
    }
  };

  return (
    <SpotlightCard 
      spotlightColor="rgba(245, 158, 11, 0.14)" 
      className={styles.searchCard}
      style={{ padding: '24px', borderRadius: '24px' }}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGrid}>
          {/* 1. FROM Location Input */}
          <div className={styles.inputCol}>
            <LocationAutocompleteInput
              label="FROM"
              type="origin"
              value={originInput}
              onChange={(val) => setOriginInput(val)}
              onSelect={(place) => {
                const label = place.primary || place.name || place;
                setOriginInput(label);
                if (onSelectOrigin) onSelectOrigin(place);
                else if (onSelectPreset && onSelectPreset.onSelectOrigin) onSelectPreset.onSelectOrigin(place);
                onSearch && onSearch(label, destinationInput);
              }}
              placeholder="Pickup address, city or airport..."
              iconColor="#10B981"
            />
          </div>

          {/* 2. Direction Swap Button */}
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

          {/* 3. TO Location Input */}
          <div className={styles.inputCol}>
            <LocationAutocompleteInput
              label="TO"
              type="destination"
              value={destinationInput}
              onChange={(val) => setDestinationInput(val)}
              onSelect={(place) => {
                const label = place.primary || place.name || place;
                setDestinationInput(label);
                if (onSelectDestination) onSelectDestination(place);
                else if (onSelectPreset && onSelectPreset.onSelectDestination) onSelectPreset.onSelectDestination(place);
                onSearch && onSearch(originInput, label);
              }}
              placeholder="Drop-off address, tech park or city..."
              iconColor="#F59E0B"
            />
          </div>

          {/* 4. Interactive Dropdown Calendar & Time Picker */}
          <div className={styles.scheduleCol}>
            <label className={styles.scheduleLabel}>
              <Calendar size={12} color="#FBBF24" />
              <span>SCHEDULE</span>
            </label>
            <ScheduleDropdownPicker
              value={selectedDateTime}
              onChange={(val) => {
                setSelectedDateTime(val);
                onSearch && onSearch(originInput, destinationInput, val ? val.split('T')[0] : '');
              }}
              onApply={() => onSearch && onSearch(originInput, destinationInput, selectedDateTime ? selectedDateTime.split('T')[0] : '')}
            />
          </div>

          {/* 5. Search Action Button */}
          <div className={styles.actionCol}>
            <button type="submit" className={styles.searchSubmitBtn} aria-label="Search available carpools">
              <Sparkles size={16} />
              <span>Roll ⚡</span>
            </button>
          </div>
        </div>

        {/* Bottom Presets & Safety Trust Ribbon */}
        <div className={styles.footerRow}>
          <div className={styles.presetsWrapper}>
            <span className={styles.presetLabel}>Corridors:</span>
            <button
              type="button"
              onClick={() => handlePresetClick('Mumbai', 'Pune')}
              className={styles.presetChip}
            >
              <span>Mumbai ➔ Pune</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹350</strong>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick('Bengaluru', 'Chennai')}
              className={styles.presetChip}
            >
              <span>Bengaluru ➔ Chennai</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹400</strong>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick('Delhi', 'Jaipur')}
              className={styles.presetChip}
            >
              <span>Delhi ➔ Jaipur</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹450</strong>
            </button>
            <button
              type="button"
              onClick={() => handlePresetClick('Hyderabad', 'Vijayawada')}
              className={styles.presetChip}
            >
              <span>Hyd ➔ Vijayawada</span>
              <strong style={{ color: '#10B981', marginLeft: '4px' }}>₹420</strong>
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
                Clear
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
              <span className={styles.amberDot} />
              <Award size={13} color="#F59E0B" />
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
