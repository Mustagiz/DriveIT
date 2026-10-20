import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, MapPin, Navigation, X, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import styles from './CitySelectionModal.module.css';
import CityLandmarkIcon from './CityLandmarkIcons';
import soundEffects from '../utils/soundEffects';

// Top popular hub cities with architectural landmarks matching the user's reference design
export const POPULAR_CITIES = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', fare: '₹350', rides: '140+' },
  { id: 'delhi-ncr', name: 'Delhi-NCR', state: 'Delhi NCR', fare: '₹450', rides: '210+' },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', fare: '₹400', rides: '180+' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', fare: '₹380', rides: '115+' },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab/Haryana', fare: '₹280', rides: '75+' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', fare: '₹320', rides: '90+' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', fare: '₹350', rides: '160+' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', fare: '₹420', rides: '85+' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', fare: '₹360', rides: '60+' },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', fare: '₹290', rides: '45+' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', fare: '₹450', rides: '95+' },
  { id: 'goa', name: 'Goa', state: 'Goa', fare: '₹550', rides: '40+' }
];

// Comprehensive alphabetical Indian cities list matching the screenshot
export const OTHER_CITIES = [
  'Aalo', 'Abohar', 'Abu Road', 'Achampet', 'Acharapakkam',
  'Addanki', 'Adilabad', 'Adimali', 'Adipur', 'Adoni',
  'Agar Malwa', 'Agartala', 'Agiripalli', 'Agra', 'Ahilyanagar (Ahmednagar)',
  'Ahmedgarh', 'Ahore', 'Aizawl', 'Ajmer', 'Akaltara',
  'Akbarpur', 'Akividu', 'Akluj', 'Akola', 'Akot',
  'Alakode', 'Alangudi', 'Alangulam', 'Alappuzha', 'Alathur',
  'Alibaug', 'Aligarh', 'Alipurduar', 'Allagadda', 'Almora',
  'Alwar', 'Amalner', 'Ambala', 'Ambikapur', 'Amravati',
  'Amritsar', 'Anand', 'Anantapur', 'Angul', 'Ankleshwar',
  'Asansol', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Ayodhya', 'Azamgarh',
  'Baddi', 'Badlapur', 'Bagalkot', 'Bahadurgarh', 'Bahraich',
  'Balaghat', 'Balasore', 'Ballia', 'Banda', 'Baramati',
  'Baramulla', 'Baran', 'Barasat', 'Bardhaman', 'Bareilly',
  'Barmer', 'Barnala', 'Baroda (Vadodara)', 'Barshi', 'Basirhat',
  'Basti', 'Batala', 'Bathinda', 'Beawar', 'Beed',
  'Belagavi (Belgaum)', 'Bellary', 'Berhampur', 'Betul', 'Bhadrak',
  'Bhagalpur', 'Bharatpur', 'Bharuch', 'Bhavnagar', 'Bhilai',
  'Bhilwara', 'Bhimavaram', 'Bhind', 'Bhiwadi', 'Bhiwani',
  'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bhusawal', 'Bidar',
  'Bijapur', 'Bikaner', 'Bilaspur', 'Bokaro', 'Bulandshahr',
  'Chamba', 'Chandrapur', 'Chhapra', 'Chhindwara', 'Chikkamagaluru',
  'Coimbatore', 'Cooch Behar', 'Cuddalore', 'Cuttack',
  'Dahod', 'Daltonganj', 'Daman', 'Darbhanga', 'Darjeeling',
  'Davanagere', 'Dehradun', 'Deoghar', 'Dewas', 'Dhanbad',
  'Dharamsala', 'Dharapuram', 'Dharmapuri', 'Dharwad', 'Dhule',
  'Dibrugarh', 'Dimapur', 'Dindigul', 'Diu', 'Durg',
  'Durgapur', 'Dwarka', 'Eluru', 'Erode', 'Etah',
  'Etawah', 'Faizabad', 'Faridabad', 'Faridkot', 'Fatehabad',
  'Fatehpur', 'Firozabad', 'Firozpur', 'Gadag', 'Gadchiroli',
  'Gandhidham', 'Gandhinagar', 'Gaya', 'Ghaziabad', 'Ghazipur',
  'Giridih', 'Godhra', 'Gonda', 'Gondia', 'Gorakhpur',
  'Greater Noida', 'Gudivada', 'Gulbarga (Kalaburagi)', 'Guna', 'Guntur',
  'Gurdaspur', 'Guwahati', 'Gwalior', 'Haldia', 'Haldwani',
  'Hamirpur', 'Hansi', 'Hapur', 'Hardoi', 'Haridwar',
  'Hassan', 'Hathras', 'Haveri', 'Himmatnagar', 'Hisar',
  'Hoshiarpur', 'Hospet', 'Hosur', 'Hubballi (Hubli)', 'Indore',
  'Itanagar', 'Jabalpur', 'Jagdalpur', 'Jagraon', 'Jalandhar',
  'Jalgaon', 'Jalna', 'Jalpaiguri', 'Jammu', 'Jamnagar',
  'Jamshedpur', 'Jaunpur', 'Jhansi', 'Jharsuguda', 'Jind',
  'Jodhpur', 'Jorhat', 'Junagadh', 'Kadapa', 'Kaithal',
  'Kakinada', 'Kanchipuram', 'Kannur', 'Kanpur', 'Kapurthala',
  'Kargil', 'Karimnagar', 'Karnal', 'Karur', 'Kasaragod',
  'Kashipur', 'Katihar', 'Katni', 'Kawardha', 'Khammam',
  'Khandwa', 'Khanna', 'Kharagpur', 'Kishangarh', 'Kolhapur',
  'Kollam', 'Korba', 'Kota', 'Kothagudem', 'Kottayam',
  'Kozhikode', 'Kullu', 'Kumbakonam', 'Kurnool', 'Kurukshetra',
  'Latur', 'Leh', 'Lonavala', 'Lucknow', 'Ludhiana',
  'Machilipatnam', 'Madgaon', 'Madurai', 'Mahabaleshwar', 'Mahbubnagar',
  'Malappuram', 'Malda', 'Malegaon', 'Manali', 'Mandi',
  'Mandya', 'Mangaluru (Mangalore)', 'Mansa', 'Mathura', 'Mau',
  'Meerut', 'Mehsana', 'Mirzapur', 'Moga', 'Mohali',
  'Moradabad', 'Morena', 'Morbi', 'Motihari', 'Mount Abu',
  'Muktsar', 'Munger', 'Murshidabad', 'Muzaffarnagar', 'Muzaffarpur',
  'Mysuru (Mysore)', 'Nadiad', 'Nagaon', 'Nagapattinam', 'Nagaur',
  'Nagercoil', 'Nagpur', 'Nainital', 'Nanded', 'Nandurbar',
  'Nandyal', 'Narasaraopet', 'Nashik', 'Navsari', 'Neemuch',
  'Nellore', 'Nizamabad', 'Ongole', 'Ooty', 'Osmanabad (Dharashiv)',
  'Palakkad', 'Palanpur', 'Pali', 'Palwal', 'Panaji',
  'Panchkula', 'Panipat', 'Parbhani', 'Pathankot', 'Patiala',
  'Patna', 'Pithoragarh', 'Pollachi', 'Pondicherry (Puducherry)', 'Porbandar',
  'Prayagraj (Allahabad)', 'Puri', 'Purnia', 'Rae Bareli', 'Raichur',
  'Raiganj', 'Raigarh', 'Raipur', 'Rajahmundry', 'Rajapalayam',
  'Rajkot', 'Rajnandgaon', 'Ramanathapuram', 'Rampur', 'Ranchi',
  'Raniganj', 'Ratlam', 'Ratnagiri', 'Rewa', 'Rewari',
  'Rishikesh', 'Rohtak', 'Roorkee', 'Rourkela', 'Rudrapur',
  'Sagar', 'Saharanpur', 'Salem', 'Samastipur', 'Sambalpur',
  'Sangli', 'Satara', 'Satna', 'Secunderabad', 'Sehore',
  'Shahjahanpur', 'Shillong', 'Shimla', 'Shivamogga (Shimoga)', 'Shivpuri',
  'Sikar', 'Silchar', 'Siliguri', 'Singrauli', 'Sirsa',
  'Sitapur', 'Solan', 'Solapur', 'Sonipat', 'Srikakulam',
  'Srinagar', 'Surat', 'Surendranagar', 'Tenali', 'Tezpur',
  'Thanjavur', 'Theni', 'Thiruvananthapuram', 'Thoothukudi', 'Thrissur',
  'Tiruchirappalli (Trichy)', 'Tirunelveli', 'Tirupati', 'Tirupur', 'Tiruvannamalai',
  'Udaipur', 'Udupi', 'Ujjain', 'Ulhasnagar', 'Unnao',
  'Vadodara', 'Valsad', 'Vapi', 'Varanasi', 'Vellore',
  'Vidisha', 'Vijayawada', 'Viluppuram', 'Virudhunagar', 'Visakhapatnam',
  'Vizianagaram', 'Warangal', 'Wardha', 'Yamunanagar', 'Yavatmal'
];

export default function CitySelectionModal({
  isOpen,
  onClose,
  selectedCity = 'Mumbai',
  onSelectCity,
  title = 'Select Your City'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const inputRef = useRef(null);

  // Focus input upon opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered popular cities
  const filteredPopular = useMemo(() => {
    if (!searchQuery.trim()) return POPULAR_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_CITIES.filter(
      c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered other cities
  const filteredOther = useMemo(() => {
    if (!searchQuery.trim()) return OTHER_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return OTHER_CITIES.filter(c => c.toLowerCase().includes(q));
  }, [searchQuery]);

  // Detect location via Browser Geolocation API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocode using OpenStreetMap / BigDataCloud public free endpoint
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          if (res.ok) {
            const data = await res.json();
            const detectedCity = data.city || data.locality || data.principalSubdivision || 'Mumbai';
            handleCityChoose(detectedCity);
          } else {
            handleCityChoose('Mumbai');
          }
        } catch (err) {
          handleCityChoose('Mumbai');
        } finally {
          setDetecting(false);
        }
      },
      () => {
        // Geolocation denied or unavailable -> fallback to Mumbai
        setDetecting(false);
        handleCityChoose('Mumbai');
      },
      { timeout: 7000 }
    );
  };

  const handleCityChoose = (cityName) => {
    try {
      soundEffects.playSuccess();
    } catch (e) {}

    // Persist to localStorage
    try {
      localStorage.setItem('rideshare_selected_city', cityName);
    } catch (e) {}

    if (typeof onSelectCity === 'function') {
      onSelectCity(cityName);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header & Search */}
        <div className={styles.headerArea}>
          <div className={styles.topBarRow}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button type="button" onClick={onClose} className={styles.closeBtn} title="Close">
              <X size={18} />
            </button>
          </div>

          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchBtn}
                title="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Location Detection Bar */}
          <div className={styles.locationBarRow}>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={detecting}
              className={styles.detectLocationBtn}
            >
              <Navigation
                size={15}
                className={detecting ? styles.detectLocationSpinner : ''}
              />
              <span>{detecting ? 'Detecting coordinates...' : 'Detect my location'}</span>
            </button>

            {selectedCity && (
              <div className={styles.selectedCityIndicator}>
                <span>Current Hub:</span>
                <span className={styles.selectedCityBadge}>{selectedCity}</span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.scrollableBody}>
          {/* 1. Popular Cities with Creative Vector Landmarks */}
          {filteredPopular.length > 0 && (
            <div>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Popular Cities</h3>
              </div>

              <div className={styles.popularGrid}>
                {filteredPopular.map((city) => {
                  const isSelected = String(selectedCity || '').toLowerCase() === city.name.toLowerCase();
                  return (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCityChoose(city.name)}
                      className={`${styles.cityCard} ${isSelected ? styles.cityCardActive : ''}`}
                      title={`${city.name} (${city.state}) — ${city.rides} active rides`}
                    >
                      <div className={styles.iconWrapper}>
                        <CityLandmarkIcon
                          cityKey={city.id}
                          size={54}
                          color={isSelected ? '#00AFF5' : 'currentColor'}
                          accent="#00AFF5"
                        />
                      </div>
                      <span className={styles.cityName}>{city.name}</span>
                      <span className={styles.cityMetric}>
                        <span>{city.fare}</span>
                        <span>•</span>
                        <span>{city.rides}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Other Cities Directory */}
          {filteredOther.length > 0 && (
            <div className={styles.otherCitiesContainer}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Other Cities</h3>
              </div>

              <div className={styles.otherCitiesGrid}>
                {(showAllCities || searchQuery ? filteredOther : filteredOther.slice(0, 35)).map((cityName) => {
                  const isSelected = String(selectedCity || '').toLowerCase() === cityName.toLowerCase();
                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => handleCityChoose(cityName)}
                      className={`${styles.otherCityBtn} ${isSelected ? styles.otherCityBtnActive : ''}`}
                    >
                      {cityName}
                    </button>
                  );
                })}
              </div>

              {!searchQuery && filteredOther.length > 35 && (
                <div className={styles.viewAllToggleRow}>
                  <button
                    type="button"
                    onClick={() => setShowAllCities(!showAllCities)}
                    className={styles.viewAllToggleBtn}
                  >
                    <span>{showAllCities ? 'Hide all cities' : `View all ${filteredOther.length} cities`}</span>
                    {showAllCities ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty search state */}
          {filteredPopular.length === 0 && filteredOther.length === 0 && (
            <div className={styles.emptySearchResult}>
              <MapPin size={36} style={{ opacity: 0.3, margin: '0 auto' }} />
              <div className={styles.emptySearchText}>
                No city found matching "{searchQuery}"
              </div>
              <button
                type="button"
                onClick={() => handleCityChoose(searchQuery.trim())}
                style={{
                  marginTop: '12px',
                  background: '#00AFF5',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Use "{searchQuery}" anyway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
