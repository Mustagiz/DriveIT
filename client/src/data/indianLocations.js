/**
 * Curated Database of Popular Indian Metropolitan Cities, Express Corridors,
 * Key Street Addresses, Metro Stations, Tech Parks, and Airports for Uber-Grade Local & Highway Commutes.
 */

export const POPULAR_INDIAN_CITIES = [
  'All Cities',
  'Pune',
  'Mumbai',
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
  // ===================== PUNE (LOCAL & HIGHWAY) =====================
  {
    id: 'pun-coffea-viman',
    primary: 'Coffea, Viman Nagar',
    street: 'Viman Nagar Main Road, Near Symbiosis & Phoenix Mall',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '☕ DriveIT HQ • Coffea Hub',
    lat: 18.5679,
    lng: 73.9143
  },
  {
    id: 'pun-phoenix-viman',
    primary: 'Phoenix Marketcity Mall, Viman Nagar',
    street: 'Nagar Road, Clover Park, Viman Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🛍️ Phoenix Marketcity Hub',
    lat: 18.5621,
    lng: 73.9168
  },
  {
    id: 'pun-datta-mandir-viman',
    primary: 'Datta Mandir Chowk, Viman Nagar',
    street: 'Datta Mandir Road, Near Ganpati Chowk, Viman Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '📍 Viman Nagar Residential Hub',
    lat: 18.5695,
    lng: 73.9120
  },
  {
    id: 'pun-kp-lane-1-7',
    primary: 'Koregaon Park (Lane 1 to 7)',
    street: 'North Main Road, Near Osho Ashram & German Bakery',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🌳 Koregaon Park North Main Rd',
    lat: 18.5362,
    lng: 73.8940
  },
  {
    id: 'pun-kp-south-main',
    primary: 'South Main Road, Koregaon Park',
    street: 'South Main Road, Near Ragvilas Society, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '📍 Koregaon Park South Main Rd',
    lat: 18.5320,
    lng: 73.8975
  },
  {
    id: 'pun-kalyani-cerebrum',
    primary: 'Kalyani Nagar (Cerebrum IT Park)',
    street: 'Cerebrum IT Park Road, Near Mariplex Mall, Kalyani Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Cerebrum IT SEZ',
    lat: 18.5489,
    lng: 73.9042
  },
  {
    id: 'pun-swargate-metro',
    primary: 'Swargate Metro & Bus Terminal',
    street: 'Jedhe Square, Satara Road, Swargate',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'metro',
    tag: '🚇 Metro & Transit Terminus',
    lat: 18.5018,
    lng: 73.8586
  },
  {
    id: 'pun-hinjewadi-phase-1',
    primary: 'Hinjewadi Phase 1 (Wipro Circle)',
    street: 'Hinjewadi Main Road, Near Infosys Gate 1 & Wipro Circle',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '💻 Prime Pune IT Expressway Hub',
    lat: 18.5913,
    lng: 73.7389
  },
  {
    id: 'pun-hinjewadi-phase-2',
    primary: 'Hinjewadi Phase 2 (Cognizant / Tech Mahindra)',
    street: 'Phase 2 Road, Rajiv Gandhi Infotech Park, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Phase 2 IT Campus',
    lat: 18.5835,
    lng: 73.7172
  },
  {
    id: 'pun-hinjewadi-phase-3',
    primary: 'Hinjewadi Phase 3 (Megapolis & TCS Sahyadri)',
    street: 'Megapolis Circle, Phase 3, Hinjewadi',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Phase 3 Megapolis Township',
    lat: 18.5714,
    lng: 73.6920
  },
  {
    id: 'pun-wakad-dange-chowk',
    primary: 'Dange Chowk & Hinjewadi Flyover',
    street: 'Aundh-Ravet BRTS Road, Dange Chowk, Wakad',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Highway & BRTS Junction',
    lat: 18.6080,
    lng: 73.7745
  },
  {
    id: 'pun-wakad-bhumkar',
    primary: 'Bhumkar Chowk, Wakad',
    street: 'Mumbai-Bangalore Highway (NH 48), Wakad',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Mumbai Expressway Pickup',
    lat: 18.5987,
    lng: 73.7540
  },
  {
    id: 'pun-baner-high-street',
    primary: 'Balewadi High Street, Baner',
    street: 'Balewadi High Street, Near Cummins India & Pancard Club',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🏬 High Street Commercial Hub',
    lat: 18.5590,
    lng: 73.7868
  },
  {
    id: 'pun-pashan-baner',
    primary: 'Pashan-Baner Link Road',
    street: 'Pashan Sus Road, Near Abhinav College, Pashan',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🏡 Pashan Residential Corridor',
    lat: 18.5410,
    lng: 73.7850
  },
  {
    id: 'pun-aundh-parihar',
    primary: 'Aundh (Parihar Chowk & ITI Road)',
    street: 'ITI Road, Near DP Road Junction, Aundh',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '📍 Aundh Central Market',
    lat: 18.5605,
    lng: 73.8078
  },
  {
    id: 'pun-magarpatta-city',
    primary: 'Magarpatta Cybercity (North & South Gate)',
    street: 'Magarpatta City Main Road, Hadapsar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Cybercity Mega IT Campus',
    lat: 18.5158,
    lng: 73.9272
  },
  {
    id: 'pun-amanora-town',
    primary: 'Amanora Park Town & Mall',
    street: 'Amanora Magarpatta Road, Hadapsar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🛍️ Amanora Town Centre',
    lat: 18.5186,
    lng: 73.9348
  },
  {
    id: 'pun-kharadi-eon',
    primary: 'Kharadi EON Free Zone & WTC',
    street: 'Grant Road, EON IT Park Phase 1 & 2, Kharadi',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '💻 East Pune IT SEZ & WTC',
    lat: 18.5516,
    lng: 73.9536
  },
  {
    id: 'pun-kothrud-vanaz',
    primary: 'Kothrud (Vanaz Metro Station)',
    street: 'Paud Road, Near Vanaz Corner, Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'metro',
    tag: '🚇 Metro Line 2 Origin',
    lat: 18.5074,
    lng: 73.8077
  },
  {
    id: 'pun-chandani-chowk',
    primary: 'Chandani Chowk Multi-Level Flyover',
    street: 'Paud Road / Mumbai-Bangalore Highway, Bavdhan Kothrud',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Highway Interchange Hub',
    lat: 18.5070,
    lng: 73.7780
  },
  {
    id: 'pun-fc-road',
    primary: 'FC Road (Fergusson College Road)',
    street: 'Fergusson College Rd, Shivajinagar Deccan',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🎓 Youth & Heritage Street',
    lat: 18.5246,
    lng: 73.8415
  },
  {
    id: 'pun-jm-road',
    primary: 'JM Road (Jangali Maharaj Road)',
    street: 'JM Road, Near Sambhaji Park, Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🏛️ Central Commercial Spine',
    lat: 18.5284,
    lng: 73.8480
  },
  {
    id: 'pun-shivajinagar-station',
    primary: 'Shivajinagar Railway & Metro Station',
    street: 'Old Mumbai-Pune Highway, Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'station',
    tag: '🚆 Railway & Metro Interchange',
    lat: 18.5314,
    lng: 73.8553
  },
  {
    id: 'pun-pimple-saudagar',
    primary: 'Pimple Saudagar (Kunal Icon Road)',
    street: 'Kunal Icon Road, Govind Garden Chowk, Pimple Saudagar',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🏡 PCMC Residential Hub',
    lat: 18.5986,
    lng: 73.7932
  },
  {
    id: 'pun-camp-mg-road',
    primary: 'Camp (MG Road & East Street)',
    street: 'Mahatma Gandhi Road, Pune Cantonment, Camp',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🛍️ Cantonment Commercial Hub',
    lat: 18.5167,
    lng: 73.8790
  },
  {
    id: 'pun-airport-pnq',
    primary: 'Pune International Airport (PNQ)',
    street: 'New Airport Road, Lohegaon',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'airport',
    tag: '✈️ Airport Terminal',
    lat: 18.5822,
    lng: 73.9197
  },

  // ===================== MUMBAI (MMR) =====================
  {
    id: 'mum-bkc-g-block',
    primary: 'Bandra Kurla Complex (BKC)',
    street: 'G Block, BKC Road, Near Maker Maxity & Asian Heart Hospital',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Financial & IT Hub',
    lat: 19.0657,
    lng: 72.8687
  },
  {
    id: 'mum-bandra-west-linking',
    primary: 'Bandra West (Linking Road & Hill Road)',
    street: 'Linking Road, Near Khar Telephone Exchange, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🛍️ Premium Shopping Street',
    lat: 19.0600,
    lng: 72.8360
  },
  {
    id: 'mum-bandra-carter-road',
    primary: 'Carter Road Promenade, Bandra West',
    street: 'Sangeet Samrat Naushad Ali Rd, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🌊 Seafront Promenade Hub',
    lat: 19.0664,
    lng: 72.8256
  },
  {
    id: 'mum-andheri-lokhandwala',
    primary: 'Andheri West (Lokhandwala Complex)',
    street: 'Lokhandwala Complex Market Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🛍️ Lokhandwala Market',
    lat: 19.1415,
    lng: 72.8310
  },
  {
    id: 'mum-andheri-midc-seepz',
    primary: 'Andheri East (MIDC Central Road & SEEPZ)',
    street: 'Central Road, MIDC Industrial Area, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 MIDC IT & Industrial Zone',
    lat: 19.1235,
    lng: 72.8752
  },
  {
    id: 'mum-powai-hiranandani',
    primary: 'Powai (Hiranandani Gardens)',
    street: 'Central Avenue, Near Galleria Shopping Mall, Powai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'residential_hub',
    tag: '🏢 Hiranandani Business Park',
    lat: 19.1176,
    lng: 72.9060
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
    id: 'mum-vashi-toll',
    primary: 'Vashi Toll Plaza (Sion-Panvel Hwy)',
    street: 'Sion-Panvel Expressway, Sector 17, Vashi, Navi Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'expressway_hub',
    tag: '⚡ Mumbai-Pune Expressway Origin',
    lat: 19.0657,
    lng: 72.9986
  },
  {
    id: 'mum-thane-viviana',
    primary: 'Thane West (Viviana Mall & Majiwada)',
    street: 'Eastern Express Highway, Service Rd, Thane West',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🚗 Eastern Corridor Junction',
    lat: 19.2084,
    lng: 72.9712
  },
  {
    id: 'mum-lower-parel-kamala',
    primary: 'Lower Parel (Kamala Mills & High Street Phoenix)',
    street: 'Senapati Bapat Marg, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'tech_park',
    tag: '🏢 Corporate Tower District',
    lat: 18.9953,
    lng: 72.8302
  },
  {
    id: 'mum-dadar-tt',
    primary: 'Dadar TT Circle & Central Junction',
    street: 'Dr. Babasaheb Ambedkar Road, Dadar East',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'station',
    tag: '🚆 Central Railway Interchange',
    lat: 19.0178,
    lng: 72.8478
  },
  {
    id: 'mum-nariman-point',
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
    id: 'mum-colaba-gateway',
    primary: 'Colaba (Gateway of India & Causeway)',
    street: 'Apollo Bandar, Colaba, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🏛️ Iconic Heritage Terminal',
    lat: 18.9220,
    lng: 72.8347
  },
  {
    id: 'mum-navi-seawoods',
    primary: 'Seawoods Grand Central Mall & Station',
    street: 'Sector 40, Seawoods Railway Station, Nerul Navi Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'mall',
    tag: '🛍️ Grand Central Transit Mall',
    lat: 19.0205,
    lng: 73.0185
  },
  {
    id: 'mum-navi-kharghar-utsav',
    primary: 'Kharghar (Utsav Chowk & Central Park)',
    street: 'Sion-Panvel Highway / Pravesh Marg, Sector 7, Kharghar',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'landmark',
    tag: '🏛️ Kharghar Landmark Circle',
    lat: 19.0435,
    lng: 73.0678
  },

  // ===================== BENGALURU =====================
  {
    id: 'blr-indiranagar-100ft',
    primary: 'Indiranagar 100 Feet Road (12th Main)',
    street: '100 Feet Road, Near CMH Road Metro & Toit, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'metro',
    tag: '🚇 Metro & Lifestyle High Street',
    lat: 12.9784,
    lng: 77.6408
  },
  {
    id: 'blr-koramangala-4th',
    primary: 'Koramangala 4th Block (Sony World Signal)',
    street: '80 Feet Road, Near Forum Mall & Maharaja Signal',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'landmark',
    tag: '🚀 Startup Capital Corridor',
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: 'blr-hsr-27th-main',
    primary: 'HSR Layout Sector 1 (27th Main)',
    street: '27th Main Road, Near Agara Lake Junction, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'residential_hub',
    tag: '🚗 Outer Ring Road Connector',
    lat: 12.9116,
    lng: 77.6474
  },
  {
    id: 'blr-whitefield-itpl',
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
    id: 'blr-ecity-infosys',
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
    id: 'blr-bellandur-ecospace',
    primary: 'Bellandur EcoSpace (Outer Ring Road)',
    street: 'Outer Ring Road, Bellandur, Near Central Mall',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'tech_park',
    tag: '🏢 ORR Tech Corridor',
    lat: 12.9260,
    lng: 77.6762
  },
  {
    id: 'blr-manyata-hebbal',
    primary: 'Manyata Tech Park (Hebbal)',
    street: 'Outer Ring Road, Nagawara, Near Hebbal Flyover',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'tech_park',
    tag: '🏢 North Bangalore IT Hub',
    lat: 13.0489,
    lng: 77.6200
  },
  {
    id: 'blr-airport-kempegowda',
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
    id: 'blr-mg-road-trinity',
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
    id: 'blr-marathahalli-bridge',
    primary: 'Marathahalli Bridge & Multiplex',
    street: 'Varthur Main Road / Outer Ring Road, Marathahalli',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'expressway_hub',
    tag: '🚌 Major East Bangalore Transit Node',
    lat: 12.9562,
    lng: 77.7019
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
    id: 'del-aerocity-worldmark',
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
    id: 'del-cyber-hub-dlf',
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
    id: 'del-golf-course-54',
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
    id: 'del-noida-sec-62',
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
    id: 'del-noida-sec-18',
    primary: 'Sector 18 (Atta Market & Mall of India)',
    street: 'Sector 18 Metro Station, Sector 18, Noida',
    city: 'Delhi NCR',
    state: 'Uttar Pradesh',
    type: 'mall',
    tag: '🛍️ DLF Mall of India & Sector 18',
    lat: 28.5708,
    lng: 77.3260
  },
  {
    id: 'del-connaught-place',
    primary: 'Connaught Place (Inner Circle Block A-N)',
    street: 'Block A, Rajiv Chowk Metro Station, New Delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'metro',
    tag: '🚇 Rajiv Chowk Yellow/Blue Interchange',
    lat: 28.6315,
    lng: 77.2167
  },
  {
    id: 'del-hauz-khas-village',
    primary: 'Hauz Khas Village & Metro Station',
    street: 'Aurobindo Marg, Near IIT Delhi Gate, South Delhi',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'metro',
    tag: '🚇 Magenta/Yellow Line Interchange',
    lat: 28.5494,
    lng: 77.2001
  },
  {
    id: 'del-saket-select-city',
    primary: 'Saket (Select CITYWALK Mall)',
    street: 'A-3, District Centre, Sector 6, Pushp Vihar, Saket',
    city: 'Delhi NCR',
    state: 'Delhi',
    type: 'mall',
    tag: '🛍️ Select CITYWALK District Centre',
    lat: 28.5284,
    lng: 77.2193
  },

  // ===================== HYDERABAD =====================
  {
    id: 'hyd-hitec-cyber-towers',
    primary: 'Hitec City (Cyber Towers & Mindspace)',
    street: 'Hitec City Main Road, Patrika Nagar, Madhapur',
    city: 'Hyderabad',
    state: 'Telangana',
    type: 'tech_park',
    tag: '💻 Cyber Towers IT Landmark',
    lat: 17.4504,
    lng: 78.3808
  },
  {
    id: 'hyd-gachibowli-waverock',
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
    id: 'hyd-airport-shamshabad',
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
    id: 'hyd-banjara-road-1',
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
    id: 'hyd-jubilee-check-post',
    primary: 'Jubilee Hills Check Post (Road 36)',
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
    id: 'che-omr-tidel-park',
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
    id: 'che-airport-meenambakkam',
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
    id: 'che-guindy-kathipara',
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
    id: 'che-t-nagar-pondy',
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
    id: 'ccu-salt-lake-sec-v',
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
    id: 'ccu-new-town-eco-space',
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
    id: 'ccu-airport-dum-dum',
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
    id: 'ccu-park-street-camac',
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
    id: 'amd-sg-highway-iscon',
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
    id: 'amd-gift-city-tower',
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
    id: 'amd-airport-svpi',
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
    id: 'amd-prahlad-corporate',
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
    id: 'jai-airport-sanganer',
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
    id: 'jai-c-scheme-statue',
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
    id: 'jai-malviya-wtp',
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
    id: 'chd-sec-17-plaza',
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
    id: 'chd-airport-mohali',
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
    id: 'goa-mopa-gox',
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
    id: 'goa-candolim-coastal',
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
    id: 'goa-panaji-church',
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
    id: 'cok-airport-nedumbassery',
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
    id: 'cok-infopark-kakkanad',
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
    id: 'cok-edappally-lulu',
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
