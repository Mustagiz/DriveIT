import React from 'react';
import { ArrowRightLeft, Sparkles } from 'lucide-react';
import { useToast } from './Toast';
import LocationAutocompleteInput from './LocationAutocompleteInput';
import ScheduleDropdownPicker from './ScheduleDropdownPicker';
import { SpotlightCard } from './ui';
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

  return (
    <SpotlightCard 
      spotlightColor="rgba(132, 204, 22, 0.16)" 
      className={styles.searchCard}
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
                const label = place.primary || place.name || place.fullAddress || place;
                setOriginInput(label);
                if (onSelectOrigin) onSelectOrigin(place);
                else if (onSelectPreset && onSelectPreset.onSelectOrigin) onSelectPreset.onSelectOrigin(place);
              }}
              placeholder="Pickup city or hub..."
              iconColor="#10B981"
            />
          </div>

          {/* 2. Central Direction Swap Button */}
          <div className={styles.swapCol}>
            <button
              type="button"
              onClick={onSwap}
              className={styles.swapBtn}
              title="Swap pickup and destination"
              aria-label="Swap pickup and destination"
            >
              <ArrowRightLeft size={15} />
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
                const label = place.primary || place.name || place.fullAddress || place;
                setDestinationInput(label);
                if (onSelectDestination) onSelectDestination(place);
                else if (onSelectPreset && onSelectPreset.onSelectDestination) onSelectPreset.onSelectDestination(place);
              }}
              placeholder="Drop-off city or hub..."
              iconColor="#84CC16"
            />
          </div>

          {/* 4. Schedule Date & Time Picker */}
          <div className={styles.scheduleCol}>
            <ScheduleDropdownPicker
              value={selectedDateTime}
              onChange={(val) => {
                setSelectedDateTime(val);
              }}
              onApply={(val) => {
                if (val) setSelectedDateTime(val);
              }}
            />
          </div>

          {/* 5. Search Action Button */}
          <div className={styles.actionCol}>
            <button type="submit" className={styles.searchSubmitBtn} aria-label="Search available rides">
              <Sparkles size={16} />
              <span>Roll ⚡</span>
            </button>
          </div>
        </div>
      </form>
    </SpotlightCard>
  );
}
