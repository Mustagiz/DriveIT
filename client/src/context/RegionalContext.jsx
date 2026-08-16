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
        formatDistance
      }}
    >
      {children}
    </RegionalContext.Provider>
  );
};

export const useRegional = () => useContext(RegionalContext);
