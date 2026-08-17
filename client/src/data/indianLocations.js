/**
 * Curated Database of Popular Indian Metropolitan Cities, Express Corridors,
 * Key Street Addresses, Metro Stations, Tech Parks, and Airports for Uber-Grade Local & Highway Commutes.
 */

export const POPULAR_INDIAN_CITIES = [
  'All Cities',
  'Mumbai',
  'Pune',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Chandigarh',
  'Goa',
  'Kochi'
];

export const INDIAN_LOCATIONS_DATABASE = [
  // ===================== MUMBAI (MMR) =====================
  {
    id: 'mum-bkc',
    primary: 'Bandra Kurla Complex (BKC)',
    street: 'G Block, BKC Road, Bandra East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Financial & IT Hub',
    lat: 19.0657,
    lng: 72.8687
  },
  {
    id: 'mum-t2-airport',
    primary: 'CSMIA International Airport (T2)',
    street: 'Terminal 2, Sahar Elevated Access Road, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'airport',
    tag: '✈️ Airport Terminal 2',
    lat: 19.0886,
    lng: 72.8679
  },
  {
    id: 'mum-t1-airport',
    primary: 'CSMIA Domestic Airport (T1)',
    street: 'Terminal 1B, Western Express Highway, Vile Parle East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'airport',
    tag: '✈️ Domestic Airport',
    lat: 19.0968,
    lng: 72.8528
  },
  {
    id: 'mum-vashi',
    primary: 'Vashi Toll Plaza & Highway Junction',
    street: 'Sion-Panvel Expressway, Sector 17, Vashi',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Mumbai-Pune Expressway Origin',
    lat: 19.0657,
    lng: 72.9986
  },
  {
    id: 'mum-nariman',
    primary: 'Nariman Point & Marine Drive',
    street: 'Free Press Journal Marg, Churchgate',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🌊 South Mumbai Business District',
    lat: 18.9260,
    lng: 72.8236
  },
  {
    id: 'mum-powai',
    primary: 'Powai Hiranandani Gardens',
    street: 'Central Avenue, Near Galleria Mall, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🏢 Tech & Residential Hub',
    lat: 19.1176,
    lng: 72.9060
  },
  {
    id: 'mum-andheri-lokhandwala',
    primary: 'Lokhandwala Complex & Infinity Mall',
    street: 'Link Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'metro',
    tag: '🚇 Metro Line 2A Hub',
    lat: 19.1415,
    lng: 72.8310
  },
  {
    id: 'mum-thane-viviana',
    primary: 'Thane Viviana Mall & Majiwada',
    street: 'Eastern Express Highway, Service Rd, Thane West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🚗 Eastern Corridor Junction',
    lat: 19.2084,
    lng: 72.9712
  },
  {
    id: 'mum-dadar-tt',
    primary: 'Dadar TT Circle & Central Hub',
    street: 'Dr. Babasaheb Ambedkar Road, Dadar East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'station',
    tag: '🚆 Central Railway Interchange',
    lat: 19.0178,
    lng: 72.8478
  },
  {
    id: 'mum-lower-parel',
    primary: 'Lower Parel One International Centre',
    street: 'Senapati Bapat Marg, High Street Phoenix, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Corporate Tower Hub',
    lat: 18.9953,
    lng: 72.8302
  },

  // ===================== PUNE =====================
  {
    id: 'pun-swargate',
    primary: 'Swargate Metro & Bus Terminal',
    street: 'Jedhe Square, Satara Road, Swargate',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'metro',
    tag: '🚇 Metro & Inter-City Transit Hub',
    lat: 18.5018,
    lng: 73.8586
  },
  {
    id: 'pun-hinjewadi',
    primary: 'Hinjewadi Phase 1 (Rajiv Gandhi Infotech Park)',
    street: 'Hinjewadi Main Rd, Near Wipro Circle & Infosys Gate',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '💻 Prime Pune IT Expressway Hub',
    lat: 18.5913,
    lng: 73.7389
  },
  {
    id: 'pun-viman-nagar',
    primary: 'Viman Nagar (Coffea / Phoenix Marketcity)',
    street: 'Viman Nagar Main Road, Near Symbiosis & Phoenix Mall',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '📍 Coffea Hub & Airport Access',
    lat: 18.5679,
    lng: 73.9143
  },
  {
    id: 'pun-kalyani-nagar',
    primary: 'Kalyani Nagar & Koregaon Park',
    street: 'North Main Road, Near ABC Farms & Cerebrum IT Park',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '☕ Lifestyle & Corporate Corridor',
    lat: 18.5463,
    lng: 73.9022
  },
  {
    id: 'pun-magarpatta',
    primary: 'Magarpatta Cybercity & Seasons Mall',
    street: 'Magarpatta City, Hadapsar, Kharadi Bypass',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Cybercity Mega IT Campus',
    lat: 18.5158,
    lng: 73.9272
  },
  {
    id: 'pun-wakad',
    primary: 'Wakad & Dange Chowk Flyover',
    street: 'Mumbai-Pune Expressway Link Road, Wakad',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Mumbai-Pune Highway Pickup',
    lat: 18.5987,
    lng: 73.7686
  },
  {
    id: 'pun-baner-balewadi',
    primary: 'Baner High Street & Balewadi Stadium',
    street: 'Baner Road, Near Balewadi High Street',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏬 High Street Commercial Hub',
    lat: 18.5590,
    lng: 73.7868
  },
  {
    id: 'pun-airport',
    primary: 'Pune International Airport (PNQ)',
    street: 'New Airport Road, Lohegaon',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'airport',
    tag: '✈️ Airport Terminal',
    lat: 18.5822,
    lng: 73.9197
  },
  {
    id: 'pun-kothrud',
    primary: 'Kothrud & Chandani Chowk Flyover',
    street: 'Paud Road, Near Vanaz Metro Station',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'metro',
    tag: '🚇 Metro Line 2 Origin',
    lat: 18.5074,
    lng: 73.8077
  },
  {
    id: 'pun-kharadi-eon',
    primary: 'Kharadi EON Free Zone',
    street: 'Grant Road, EON IT Park, Kharadi',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '💻 East Pune IT SEZ Campus',
    lat: 18.5516,
    lng: 73.9536
  },

  // ===================== BENGALURU =====================
  {
    id: 'blr-ecity',
    primary: 'Electronic City Phase 1 (Infosys Gate)',
    street: 'Hosur Road Elevated Expressway, Electronic City',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'tech_park',
    tag: '🏢 Mega IT & Tech Campus',
    lat: 12.8399,
    lng: 77.6770
  },
  {
    id: 'blr-whitefield',
    primary: 'Whitefield (ITPL Main Road)',
    street: 'International Tech Park, Pattandur Agrahara, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'tech_park',
    tag: '🚇 Purple Line Metro ITPL',
    lat: 12.9863,
    lng: 77.7344
  },
  {
    id: 'blr-indiranagar',
    primary: 'Indiranagar 100 Feet Road',
    street: '100 Feet Rd, Near CMH Road Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'metro',
    tag: '🚇 Metro & Lifestyle Hub',
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: 'blr-koramangala',
    primary: 'Koramangala 4th Block (Sony World Signal)',
    street: '80 Feet Road, Near Forum Mall, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'landmark',
    tag: '🚀 Startup Corridor & Food Street',
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: 'blr-airport',
    primary: 'Kempegowda International Airport (BLR T1/T2)',
    street: 'Airport Toll Road, Devanahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'airport',
    tag: '✈️ Terminal 1 & Garden Terminal 2',
    lat: 13.1986,
    lng: 77.7066
  },
  {
    id: 'blr-mg-road',
    primary: 'MG Road & Brigade Road Interchange',
    street: 'Mahatma Gandhi Road, Near Trinity Metro Station',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'metro',
    tag: '🚇 Central Bengaluru Metro CBD',
    lat: 12.9756,
    lng: 77.6094
  },
  {
    id: 'blr-manyata',
    primary: 'Manyata Tech Park (Hebbal)',
    street: 'Outer Ring Road, Nagawara, Hebbal',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'tech_park',
    tag: '🏢 North Bangalore IT Corridor',
    lat: 13.0489,
    lng: 77.6200
  },
  {
    id: 'blr-hsr',
    primary: 'HSR Layout Sector 1 (27th Main)',
    street: '27th Main Road, Near Agara Lake Junction',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'residential_hub',
    tag: '🚗 Outer Ring Road Connector',
    lat: 12.9116,
    lng: 77.6474
  },

  // ===================== DELHI NCR =====================
  {
    id: 'del-t3-airport',
    primary: 'Indira Gandhi International Airport (T3)',
    street: 'Terminal 3, Airport Expressway, Palam, New Delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'airport',
    tag: '✈️ IGI Airport Terminal 3',
    lat: 28.5562,
    lng: 77.1000
  },
  {
    id: 'del-aerocity',
    primary: 'Aerocity Worldmark & Hospitality District',
    street: 'Asset Area 4, Hospitality District, Aerocity Metro',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'metro',
    tag: '🚇 Airport Express Metro Hub',
    lat: 28.5494,
    lng: 77.1212
  },
  {
    id: 'del-cyber-hub',
    primary: 'DLF Cyber Hub (Phase 2 Gurgaon)',
    street: 'Cyber City, DLF Phase 2, Sector 24, Gurugram',
    city: 'Delhi NCR',
    state: 'Haryana',
    type: 'tech_park',
    tag: '🏢 Cyber City Corporate Hub',
    lat: 28.4950,
    lng: 77.0895
  },
  {
    id: 'del-noida-62',
    primary: 'Sector 62 IT Park (Noida Electronic City)',
    street: 'Block B, Industrial Area, Sector 62, Noida',
    city: 'Delhi NCR',
    state: 'Uttar Pradesh',
    type: 'metro',
    tag: '🚇 Blue Line Metro Terminal',
    lat: 28.6280,
    lng: 77.3649
  },
  {
    id: 'del-connaught-place',
    primary: 'Connaught Place (Inner Circle)',
    street: 'Block A, Rajiv Chowk Metro Station, New Delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'metro',
    tag: '🚇 Rajiv Chowk Yellow/Blue Interchange',
    lat: 28.6315,
    lng: 77.2167
  },
  {
    id: 'del-golf-course',
    primary: 'Golf Course Road (Sector 54 Gurgaon)',
    street: 'Golf Course Extension Rd, Sector 54 Rapid Metro',
    city: 'Delhi NCR',
    state: 'Haryana',
    type: 'metro',
    tag: '🏢 Luxury High-Rise Corridor',
    lat: 28.4352,
    lng: 77.1039
  },
  {
    id: 'del-hauz-khas',
    primary: 'Hauz Khas Village & Metro Station',
    street: 'Aurobindo Marg, Near IIT Delhi Gate',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'metro',
    tag: '🚇 Magenta/Yellow Line Interchange',
    lat: 28.5494,
    lng: 77.2001
  },

  // ===================== HYDERABAD =====================
  {
    id: 'hyd-hitec-city',
    primary: 'Hitec City (Cyber Towers)',
    street: 'Hitec City Main Road, Patrika Nagar, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'tech_park',
    tag: '💻 Cyber Towers IT Landmark',
    lat: 17.4504,
    lng: 78.3808
  },
  {
    id: 'hyd-gachibowli',
    primary: 'Gachibowli Financial District (WaveRock)',
    street: 'Financial District, Nanakramguda, Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'tech_park',
    tag: '🏢 WaveRock & US Tech Hub',
    lat: 17.4165,
    lng: 78.3489
  },
  {
    id: 'hyd-airport',
    primary: 'Rajiv Gandhi International Airport (HYD)',
    street: 'PVNR Elevated Expressway, Shamshabad',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'airport',
    tag: '✈️ Airport Terminal',
    lat: 17.2403,
    lng: 78.4294
  },
  {
    id: 'hyd-banjara-hills',
    primary: 'Banjara Hills (Road No. 1 / 12)',
    street: 'Road Number 1, Near Taj Krishna & City Centre Mall',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'landmark',
    tag: '🏬 Premium City Centre Corridor',
    lat: 17.4156,
    lng: 78.4487
  },
  {
    id: 'hyd-jubilee-hills',
    primary: 'Jubilee Hills Check Post',
    street: 'Road Number 36, Near Jubilee Hills Metro Station',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'metro',
    tag: '🚇 Blue Line Metro Hub',
    lat: 17.4325,
    lng: 78.4070
  },

  // ===================== CHENNAI =====================
  {
    id: 'che-omr-tidel',
    primary: 'OMR IT Corridor (Tidel Park)',
    street: 'Old Mahabalipuram Road, Tharamani, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'tech_park',
    tag: '💻 Prime Tamil Nadu IT Expressway',
    lat: 12.9897,
    lng: 80.2486
  },
  {
    id: 'che-airport',
    primary: 'Chennai International Airport (MAA)',
    street: 'GST Road, Meenambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'airport',
    tag: '✈️ Domestic & International Terminals',
    lat: 12.9941,
    lng: 80.1709
  },
  {
    id: 'che-guindy',
    primary: 'Guindy (Kathipara Flyover Cloverleaf)',
    street: 'Grand Southern Trunk Rd, Guindy Metro Station',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'metro',
    tag: '🚇 Major Highway Transit Node',
    lat: 13.0067,
    lng: 80.2025
  },
  {
    id: 'che-t-nagar',
    primary: 'T Nagar (Pondy Bazaar)',
    street: 'Sir Thyagaraya Road, Near Panagal Park',
    city: 'Chennai',
    state: 'Tamil Nadu',
    type: 'mall',
    tag: '🛍️ Commercial Retail Capital',
    lat: 13.0418,
    lng: 80.2341
  },

  // ===================== KOLKATA =====================
  {
    id: 'ccu-salt-lake',
    primary: 'Salt Lake Sector V (Webel More)',
    street: 'Ring Road, Sector V, Bidhannagar',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'tech_park',
    tag: '💻 East India Major IT SEZ',
    lat: 22.5726,
    lng: 88.4331
  },
  {
    id: 'ccu-new-town',
    primary: 'New Town (Eco Space Business Park)',
    street: 'Major Arterial Road, Action Area II, New Town',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'tech_park',
    tag: '🏢 Modern Financial Action Area',
    lat: 22.5936,
    lng: 88.4831
  },
  {
    id: 'ccu-airport',
    primary: 'Netaji Subhash Chandra Bose Airport (CCU)',
    street: 'Jessore Road, Dum Dum',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'airport',
    tag: '✈️ Integrated Airport Terminal',
    lat: 22.6547,
    lng: 88.4467
  },
  {
    id: 'ccu-park-street',
    primary: 'Park Street & Camac Street',
    street: 'Mother Teresa Sarani, Near Park Street Metro',
    city: 'Kolkata',
    state: 'West Bengal',
    type: 'metro',
    tag: '🚇 Heritage Central CBD',
    lat: 22.5513,
    lng: 88.3524
  },

  // ===================== AHMEDABAD / GANDHINAGAR =====================
  {
    id: 'amd-sg-highway',
    primary: 'SG Highway (Iscon Cross Road)',
    street: 'Sarkhej - Gandhinagar Hwy, Satellite, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'expressway_hub',
    tag: '⚡ Prime Commercial Expressway Axis',
    lat: 23.0287,
    lng: 72.5074
  },
  {
    id: 'amd-gift-city',
    primary: 'GIFT City (Gujarat International Finance Tec-City)',
    street: 'GIFT City Tower 1, Gandhinagar Bypass',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'tech_park',
    tag: '🏢 India’s 1st Operational Smart City',
    lat: 23.1614,
    lng: 72.6841
  },
  {
    id: 'amd-airport',
    primary: 'Sardar Vallabhbhai Patel Airport (AMD)',
    street: 'Hansol, Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'airport',
    tag: '✈️ International Airport Terminal',
    lat: 23.0772,
    lng: 72.6347
  },
  {
    id: 'amd-prahlad-nagar',
    primary: 'Prahlad Nagar Corporate Road',
    street: '100 Feet Anand Nagar Rd, Prahlad Nagar',
    city: 'Ahmedabad',
    state: 'Gujarat',
    type: 'tech_park',
    tag: '🏢 Corporate Garden Corridor',
    lat: 23.0118,
    lng: 72.5113
  },

  // ===================== JAIPUR =====================
  {
    id: 'jai-airport',
    primary: 'Jaipur International Airport (JAI)',
    street: 'Airport Road, Sanganer, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'airport',
    tag: '✈️ Terminal 2 Airport',
    lat: 26.8242,
    lng: 75.8122
  },
  {
    id: 'jai-c-scheme',
    primary: 'C-Scheme (Statue Circle & Ashok Nagar)',
    street: 'Bhagwan Das Road, C-Scheme, Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'landmark',
    tag: '🏛️ Central Government & Business Hub',
    lat: 26.9075,
    lng: 75.8056
  },
  {
    id: 'jai-malviya-nagar',
    primary: 'Malviya Nagar (Gaurav Tower / WTP)',
    street: 'Jawahar Lal Nehru Marg, Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    type: 'mall',
    tag: '🛍️ World Trade Park Hub',
    lat: 26.8532,
    lng: 75.8050
  },

  // ===================== CHANDIGARH =====================
  {
    id: 'chd-sec-17',
    primary: 'Sector 17 Plaza Commercial Center',
    street: 'Sector 17, Jan Marg, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    type: 'landmark',
    tag: '🏛️ Capital City Center',
    lat: 30.7398,
    lng: 76.7827
  },
  {
    id: 'chd-airport',
    primary: 'Shaheed Bhagat Singh Airport (Mohali)',
    street: 'Airport Road, New Civil Air Terminal, Jheorheri',
    city: 'Chandigarh',
    state: 'Punjab',
    type: 'airport',
    tag: '✈️ International Airport Terminal',
    lat: 30.6735,
    lng: 76.7885
  },

  // ===================== GOA =====================
  {
    id: 'goa-mopa',
    primary: 'Manohar International Airport (Mopa GOX)',
    street: 'Mopa Airport Expressway, Pernem, North Goa',
    city: 'Goa',
    state: 'Goa',
    type: 'airport',
    tag: '✈️ North Goa International Airport',
    lat: 15.7663,
    lng: 73.8687
  },
  {
    id: 'goa-candolim',
    primary: 'Candolim - Calangute Main Coastal Road',
    street: 'Fort Aguada Road, Candolim Beach Corridor',
    city: 'Goa',
    state: 'Goa',
    type: 'landmark',
    tag: '🏖️ Coastal Highway Commute',
    lat: 15.5178,
    lng: 73.7634
  },
  {
    id: 'goa-panaji',
    primary: 'Panaji Church Square & Miramar',
    street: 'Dayanand Bandodkar Marg, Panaji',
    city: 'Goa',
    state: 'Goa',
    type: 'landmark',
    tag: '📍 Capital Transit Hub',
    lat: 15.4989,
    lng: 73.8278
  },

  // ===================== KOCHI =====================
  {
    id: 'cok-airport',
    primary: 'Cochin International Airport (COK)',
    street: 'Airport Road, Nedumbassery, Kochi',
    city: 'Kochi',
    state: 'Kerala',
    type: 'airport',
    tag: '✈️ Solar-Powered Airport Terminal',
    lat: 10.1518,
    lng: 76.3930
  },
  {
    id: 'cok-infopark',
    primary: 'Infopark Phase 1 & SmartCity',
    street: 'Infopark Expressway, Kakkanad, Kochi',
    city: 'Kochi',
    state: 'Kerala',
    type: 'tech_park',
    tag: '💻 Kerala Major IT SEZ',
    lat: 10.0104,
    lng: 76.3637
  },
  {
    id: 'cok-edappally',
    primary: 'Edappally Toll & Lulu International Mall',
    street: 'NH 544 / NH 66 Junction, Edappally',
    city: 'Kochi',
    state: 'Kerala',
    type: 'mall',
    tag: '🚇 Metro Interchange & Mega Mall',
    lat: 10.0279,
    lng: 76.3082
  }
];
