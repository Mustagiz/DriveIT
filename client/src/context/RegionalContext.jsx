import React, { createContext, useContext, useState, useEffect } from 'react';

const RegionalContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    ride: 'Ride',
    postRide: 'Post a Ride',
    opsDesk: 'Operations Desk',
    settings: 'Settings',
    searchPlaceholder: 'Search Mumbai, Pune, EV rides, highway routes...',
    liveHud: 'Live Windshield & Highway HUD',
    availableRides: 'Available EV & Intercity Rides',
    fastEasyEveryday: 'Fast. Easy. Everyday.',
    bookSeat: 'Book Seat',
    verifiedDriver: 'Verified Driver',
    passengerSeats: 'Select Passenger Seats',
    saveChanges: 'Save Changes',
    languageChanged: 'Language updated to English'
  },
  hi: {
    dashboard: 'डैशबोर्ड (Dashboard)',
    ride: 'सवारी (Rides)',
    postRide: 'सवारी पोस्ट करें',
    opsDesk: 'सुरक्षा डेस्क',
    settings: 'सेटिंग्स',
    searchPlaceholder: 'मुंबई, पुणे, इलेक्ट्रिक सवारी खोजें...',
    liveHud: 'लाइव विंडशील्ड और हाईवे HUD',
    availableRides: 'उपलब्ध एक्सप्रेसवे कारपूल',
    fastEasyEveryday: 'तेज़. आसान. रोज़ाना.',
    bookSeat: 'सीट बुक करें',
    verifiedDriver: 'सत्यापित चालक (Verified)',
    passengerSeats: 'यात्री सीटें चुनें',
    saveChanges: 'सेव करें',
    languageChanged: 'भाषा हिंदी में बदल दी गई है'
  },
  mr: {
    dashboard: 'डॅशबोर्ड (Dashboard)',
    ride: 'प्रवास (Rides)',
    postRide: 'राइड पोस्ट करा',
    opsDesk: 'ऑपरेशन्स डेस्क',
    settings: 'सेटिंग्ज',
    searchPlaceholder: 'मुंबई, पुणे एक्सप्रेसवे शोधा...',
    liveHud: 'थेट विंडशील्ड आणि महामार्ग HUD',
    availableRides: 'उपलब्ध ईव्ही कारपूल',
    fastEasyEveryday: 'वेगवान. सोपे. दररोज.',
    bookSeat: 'सीट बुक करा',
    verifiedDriver: 'प्रमाणित ड्रायव्हर',
    passengerSeats: 'प्रवासी जागा निवडा',
    saveChanges: 'जतन करा',
    languageChanged: 'भाषा मराठीत बदलली आहे'
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    ride: 'பயணம்',
    postRide: 'பயணத்தை பதிவு செய்க',
    opsDesk: 'செயல்பாட்டு மையம்',
    settings: 'அமைப்புகள்',
    searchPlaceholder: 'பெங்களூரு, சென்னை நெடுஞ்சாலை தேடுங்கள்...',
    liveHud: 'நேரலை நெடுஞ்சாலை HUD',
    availableRides: 'கிடைக்கும் ஈவி பயணங்கள்',
    fastEasyEveryday: 'விரைவான. எளிதான. தினசரி.',
    bookSeat: 'சீட் முன்பதிவு செய்க',
    verifiedDriver: 'சரிபார்க்கப்பட்ட ஓட்டுநர்',
    passengerSeats: 'பயணிகள் இருக்கைகளைத் தேர்ந்தெடுக்கவும்',
    saveChanges: 'சேமிக்கவும்',
    languageChanged: 'மொழி தமிழில் புதுப்பிக்கப்பட்டது'
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    ride: 'ಪ್ರಯಾಣ',
    postRide: 'ಪ್ರಯಾಣ ಪೋಸ್ಟ್ ಮಾಡಿ',
    opsDesk: 'ಕಾರ್ಯಾಚರಣೆ ಡೆಸ್ಕ್',
    settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
    searchPlaceholder: 'ಬೆಂಗಳೂರು, ಚೆನ್ನೈ ಹೆದ್ದಾರಿ ಹುಡುಕಿ...',
    liveHud: 'ಲೈವ್ ಹೆದ್ದಾರಿ HUD',
    availableRides: 'ಲಭ್ಯವಿರುವ ಇವಿ ರೈಡ್‌ಗಳು',
    fastEasyEveryday: 'ವೇಗವಾದ. ಸುಲಭ. ಪ್ರತಿದಿನ.',
    bookSeat: 'ಸೀಟ್ ಬುಕ್ ಮಾಡಿ',
    verifiedDriver: 'ಪರಿಶೀಲಿಸಿದ ಚಾಲಕ',
    passengerSeats: 'ಪ್ರಯಾಣಿಕರ ಸೀಟುಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    saveChanges: 'ಉಳಿಸಿ',
    languageChanged: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ನವೀಕರಿಸಲಾಗಿದೆ'
  }
};

export const RegionalProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('driveit_regional_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      language: 'en',
      languageLabel: 'English (India)',
      currency: 'INR',
      currencySymbol: '₹',
      currencyRate: 1.0,
      distanceUnit: 'km',
      timeFormat: '12h',
      primaryHub: 'mumbai-pune'
    };
  });

  useEffect(() => {
    localStorage.setItem('driveit_regional_settings', JSON.stringify(settings));
  }, [settings]);

  const updateRegionalSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings
    }));
  };

  const t = (key) => {
    const lang = settings.language || 'en';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const formatPrice = (amountInInr) => {
    if (settings.currency === 'USD') {
      return `$${(amountInInr * 0.012).toFixed(2)}`;
    }
    if (settings.currency === 'EUR') {
      return `€${(amountInInr * 0.011).toFixed(2)}`;
    }
    return `₹${Math.round(amountInInr)}`;
  };

  const formatDistance = (distInKm) => {
    if (settings.distanceUnit === 'mi') {
      return `${(distInKm * 0.621371).toFixed(0)} mi`;
    }
    return `${distInKm} km`;
  };

  return (
    <RegionalContext.Provider
      value={{
        settings,
        updateRegionalSettings,
        t,
        formatPrice,
        formatDistance,
        CORRIDORS,
        detectCorridor
      }}
    >
      {children}
    </RegionalContext.Provider>
  );
};

export const useRegional = () => useContext(RegionalContext);

// ─── Multi-City Corridors Configuration ────────────────────────────────────────
export const CORRIDORS = {
  'MUM-PNE': {
    key: 'MUM-PNE',
    name: 'Mumbai → Pune',
    nameLocal: 'मुंबई → पुणे',
    emoji: '🛣️',
    highway: 'NH48',
    distanceKm: 148,
    totalToll: 170,
    durationHours: 2.5,
    origin: { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    destination: { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    waypoints: [
      { name: 'Khopoli', lat: 18.7851, lng: 73.3256 },
      { name: 'Lonavala', lat: 18.7537, lng: 73.4041 },
      { name: 'Wakad', lat: 18.5989, lng: 73.7600 }
    ],
    tollGates: [
      { name: 'Khalapur Toll', km: 42, amount: 85 },
      { name: 'Urse Toll', km: 78, amount: 85 }
    ],
    languages: ['en', 'hi', 'mr']
  },
  'DEL-JAI': {
    key: 'DEL-JAI',
    name: 'Delhi → Jaipur',
    nameLocal: 'दिल्ली → जयपुर',
    emoji: '🏜️',
    highway: 'NH48',
    distanceKm: 270,
    totalToll: 195,
    durationHours: 4.5,
    origin: { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    destination: { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    waypoints: [
      { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
      { name: 'Dharuhera', lat: 28.2030, lng: 76.7888 },
      { name: 'Shahjahanpur', lat: 27.9166, lng: 76.5139 },
      { name: 'Kotputli', lat: 27.7023, lng: 76.1949 }
    ],
    tollGates: [
      { name: 'Manesar Toll', km: 30, amount: 65 },
      { name: 'Dharuhera Toll', km: 68, amount: 65 },
      { name: 'Kotputli Toll', km: 158, amount: 65 }
    ],
    languages: ['en', 'hi']
  },
  'BLR-MYS': {
    key: 'BLR-MYS',
    name: 'Bangalore → Mysore',
    nameLocal: 'ಬೆಂಗಳೂರು → ಮೈಸೂರು',
    emoji: '🌿',
    highway: 'NH275',
    distanceKm: 145,
    totalToll: 100,
    durationHours: 3.0,
    origin: { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    destination: { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
    waypoints: [
      { name: 'Ramnagar', lat: 12.7252, lng: 77.2821 },
      { name: 'Channapatna', lat: 12.6484, lng: 77.2073 },
      { name: 'Maddur', lat: 12.5833, lng: 77.0484 },
      { name: 'Mandya', lat: 12.5247, lng: 76.8971 }
    ],
    tollGates: [
      { name: 'Kengeri Toll', km: 12, amount: 50 },
      { name: 'Maddur Toll', km: 88, amount: 50 }
    ],
    languages: ['en', 'kn']
  },
  'HYD-BLR': {
    key: 'HYD-BLR',
    name: 'Hyderabad → Bangalore',
    nameLocal: 'హైదరాబాద్ → బెంగళూరు',
    emoji: '⚡',
    highway: 'NH44',
    distanceKm: 570,
    totalToll: 210,
    durationHours: 9.0,
    origin: { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    destination: { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    waypoints: [
      { name: 'Jadcherla', lat: 16.7700, lng: 77.9900 },
      { name: 'Kurnool', lat: 15.8281, lng: 78.0373 },
      { name: 'Anantapur', lat: 14.6819, lng: 77.6006 },
      { name: 'Hindupur', lat: 13.8288, lng: 77.4926 }
    ],
    tollGates: [
      { name: 'Shamshabad Toll', km: 22, amount: 70 },
      { name: 'Kurnool Toll', km: 190, amount: 70 },
      { name: 'Gooty Toll', km: 260, amount: 70 }
    ],
    languages: ['en', 'hi', 'kn', 'ta']
  },
  'MUM-GOA': {
    key: 'MUM-GOA',
    name: 'Mumbai → Goa',
    nameLocal: 'मुंबई → गोवा',
    emoji: '🏖️',
    highway: 'NH66',
    distanceKm: 590,
    totalToll: 225,
    durationHours: 9.5,
    origin: { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    destination: { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    waypoints: [
      { name: 'Panvel', lat: 18.9908, lng: 73.1175 },
      { name: 'Pen', lat: 18.7348, lng: 73.0967 },
      { name: 'Mahad', lat: 18.0816, lng: 73.4155 },
      { name: 'Chiplun', lat: 17.5310, lng: 73.5250 },
      { name: 'Ratnagiri', lat: 16.9902, lng: 73.3120 },
      { name: 'Kundapur', lat: 13.6279, lng: 74.6944 }
    ],
    tollGates: [
      { name: 'Palaspe Toll', km: 40, amount: 75 },
      { name: 'Indapur Toll', km: 120, amount: 75 },
      { name: 'Kasheli Toll', km: 320, amount: 75 }
    ],
    languages: ['en', 'hi', 'mr']
  },
  'DEL-AGR': {
    key: 'DEL-AGR',
    name: 'Delhi → Agra',
    nameLocal: 'दिल्ली → आगरा',
    emoji: '🕌',
    highway: 'Yamuna Expressway',
    distanceKm: 200,
    totalToll: 120,
    durationHours: 2.5,
    origin: { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    destination: { name: 'Agra', lat: 27.1767, lng: 78.0081 },
    waypoints: [
      { name: 'Faridabad', lat: 28.4089, lng: 77.3178 },
      { name: 'Palwal', lat: 28.1434, lng: 77.3249 },
      { name: 'Mathura', lat: 27.4924, lng: 77.6737 }
    ],
    tollGates: [
      { name: 'Jewar Toll', km: 80, amount: 60 },
      { name: 'Mathura Toll', km: 150, amount: 60 }
    ],
    languages: ['en', 'hi']
  }
};

// ─── Detect Corridor from typed city names ─────────────────────────────────────
export const detectCorridor = (origin = '', destination = '') => {
  const o = origin.toLowerCase().trim();
  const d = destination.toLowerCase().trim();

  const matches = [
    { key: 'MUM-PNE', oTerms: ['mum', 'bombay', 'bandra', 'andheri', 'thane', 'navi'], dTerms: ['pune', 'pun', 'wakad', 'baner', 'hinjewadi'] },
    { key: 'DEL-JAI', oTerms: ['del', 'delhi', 'gurgaon', 'gurugram', 'noida', 'faridabad'], dTerms: ['jai', 'jaipur', 'rajasthan'] },
    { key: 'BLR-MYS', oTerms: ['bang', 'blr', 'bengaluru', 'bengalore', 'bangalore'], dTerms: ['mys', 'mysore', 'mysuru'] },
    { key: 'HYD-BLR', oTerms: ['hyd', 'hyderabad', 'secunderabad', 'cyberabad'], dTerms: ['bang', 'blr', 'bengaluru', 'bangalore'] },
    { key: 'MUM-GOA', oTerms: ['mum', 'bombay', 'panvel', 'thane'], dTerms: ['goa', 'panaji', 'mapusa', 'margao', 'panjim'] },
    { key: 'DEL-AGR', oTerms: ['del', 'delhi', 'gurgaon', 'faridabad', 'noida'], dTerms: ['agr', 'agra', 'taj mahal'] },
  ];

  for (const { key, oTerms, dTerms } of matches) {
    const oMatch = oTerms.some(t => o.includes(t));
    const dMatch = dTerms.some(t => d.includes(t));
    if (oMatch && dMatch) return key;
  }

  return null; // No match — general route
};

