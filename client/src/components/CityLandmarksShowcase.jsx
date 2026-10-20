import React from 'react';
import { Compass, Sparkles, ChevronRight, MapPin } from 'lucide-react';
import styles from './CityLandmarksShowcase.module.css';
import CityLandmarkIcon from './CityLandmarkIcons';
import { POPULAR_CITIES } from './CitySelectionModal';
import soundEffects from '../utils/soundEffects';

export default function CityLandmarksShowcase({ onSelectCity, onOpenAllCities }) {
  const handleCityClick = (city) => {
    try {
      soundEffects.playSuccess();
    } catch (e) {}
    if (typeof onSelectCity === 'function') {
      onSelectCity(city.name);
    }
  };

  return (
    <section className={styles.sectionWrapper} aria-label="Explore Intercity Hubs">
      <div className={styles.cardContainer}>
        <div className={styles.headerRow}>
          <div>
            <div className={styles.tagBadge}>
              <Sparkles size={12} />
              <span>Iconic Expressway Hubs</span>
            </div>
            <h2 className={styles.title}>Explore India by Iconic Landmarks</h2>
            <p className={styles.subtitle}>
              Tap any city hub to discover daily carpools, verified pilots, and FASTag shared routes
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAllCities}
            className={styles.exploreAllBtn}
            id="explore-all-cities-btn"
          >
            <Compass size={15} />
            <span>View All 80+ Cities</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className={styles.landmarksGrid}>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => handleCityClick(city)}
              className={styles.landmarkCard}
              title={`Explore carpools from ${city.name} (${city.state})`}
            >
              <div className={styles.landmarkIconBox}>
                <CityLandmarkIcon
                  cityKey={city.id}
                  size={58}
                  color="currentColor"
                  accent="#00AFF5"
                />
              </div>
              <span className={styles.cityName}>{city.name}</span>
              <span className={styles.cityFares}>
                <span>From {city.fare}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
