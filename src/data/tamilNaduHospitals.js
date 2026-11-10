// 30 Tamil Nadu Hospitals - Real locations near Krishnan Koil, Srivilliputhur, Madurai, Virudhunagar
// Each hospital has simulated bed vacancy data that updates in real-time

const hospitalsList = [
  // === MADURAI HOSPITALS (8) ===
  {
    id: 'h1',
    name: 'Government Rajaji Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9195,
    lng: 78.1190,
    type: 'Government',
    specialties: ['General', 'Emergency', 'Cardiology', 'Neurology', 'Orthopedics'],
    totalBeds: 250,
    icuBeds: 30,
    contact: '+91 452 253 2535',
    rating: 4.2,
  },
  {
    id: 'h2',
    name: 'Meenakshi Mission Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9410,
    lng: 78.1270,
    type: 'Private',
    specialties: ['Cardiology', 'Oncology', 'Neurosurgery', 'Transplant'],
    totalBeds: 200,
    icuBeds: 40,
    contact: '+91 452 258 8800',
    rating: 4.6,
  },
  {
    id: 'h3',
    name: 'Apollo Specialty Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9350,
    lng: 78.1450,
    type: 'Private',
    specialties: ['Multi-Specialty', 'Cardiac Sciences', 'Orthopedics'],
    totalBeds: 180,
    icuBeds: 35,
    contact: '+91 452 430 5000',
    rating: 4.5,
  },
  {
    id: 'h4',
    name: 'Vadamalayan Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9255,
    lng: 78.1365,
    type: 'Private',
    specialties: ['General Medicine', 'Surgery', 'Pediatrics'],
    totalBeds: 120,
    icuBeds: 15,
    contact: '+91 452 252 7272',
    rating: 4.1,
  },
  {
    id: 'h5',
    name: 'Devadoss Multi Speciality Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9100,
    lng: 78.1220,
    type: 'Private',
    specialties: ['Orthopedics', 'Trauma', 'General Surgery'],
    totalBeds: 100,
    icuBeds: 12,
    contact: '+91 452 262 0099',
    rating: 4.0,
  },
  {
    id: 'h6',
    name: 'K.G. Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9320,
    lng: 78.1150,
    type: 'Private',
    specialties: ['Gastroenterology', 'Urology', 'General Medicine'],
    totalBeds: 90,
    icuBeds: 10,
    contact: '+91 452 254 5454',
    rating: 3.9,
  },
  {
    id: 'h7',
    name: 'Fenwick Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9275,
    lng: 78.1320,
    type: 'Private',
    specialties: ['General Medicine', 'Obstetrics', 'Pediatrics'],
    totalBeds: 80,
    icuBeds: 8,
    contact: '+91 452 253 1551',
    rating: 3.8,
  },
  {
    id: 'h8',
    name: 'Grace Kennett Foundation Hospital',
    city: 'Madurai',
    district: 'Madurai',
    lat: 9.9160,
    lng: 78.1100,
    type: 'Trust',
    specialties: ['General Medicine', 'Surgery', 'ENT'],
    totalBeds: 70,
    icuBeds: 6,
    contact: '+91 452 258 2100',
    rating: 3.7,
  },

  // === VIRUDHUNAGAR HOSPITALS (7) ===
  {
    id: 'h9',
    name: 'Government Hospital Virudhunagar',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5850,
    lng: 77.9570,
    type: 'Government',
    specialties: ['General Medicine', 'Emergency', 'Obstetrics'],
    totalBeds: 150,
    icuBeds: 15,
    contact: '+91 4562 243 243',
    rating: 3.8,
  },
  {
    id: 'h10',
    name: 'Sri Narayani Hospital',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5880,
    lng: 77.9610,
    type: 'Private',
    specialties: ['Multi-Specialty', 'Cardiology', 'Orthopedics'],
    totalBeds: 120,
    icuBeds: 18,
    contact: '+91 4562 256 256',
    rating: 4.3,
  },
  {
    id: 'h11',
    name: 'Ganga Hospital',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5810,
    lng: 77.9530,
    type: 'Private',
    specialties: ['General Surgery', 'Gynecology', 'Pediatrics'],
    totalBeds: 80,
    icuBeds: 10,
    contact: '+91 4562 248 248',
    rating: 4.0,
  },
  {
    id: 'h12',
    name: 'Arasan Eye Hospital',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5900,
    lng: 77.9650,
    type: 'Private',
    specialties: ['Ophthalmology', 'Eye Surgery'],
    totalBeds: 50,
    icuBeds: 4,
    contact: '+91 4562 252 252',
    rating: 4.4,
  },
  {
    id: 'h13',
    name: 'Sundaram Hospital',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5830,
    lng: 77.9590,
    type: 'Private',
    specialties: ['General Medicine', 'Diabetology', 'Dermatology'],
    totalBeds: 60,
    icuBeds: 6,
    contact: '+91 4562 255 255',
    rating: 3.9,
  },
  {
    id: 'h14',
    name: 'Meenakshi Nursing Home',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5870,
    lng: 77.9500,
    type: 'Private',
    specialties: ['Obstetrics', 'Gynecology', 'Neonatology'],
    totalBeds: 40,
    icuBeds: 5,
    contact: '+91 4562 245 245',
    rating: 3.7,
  },
  {
    id: 'h15',
    name: 'Virudhunagar Medical Centre',
    city: 'Virudhunagar',
    district: 'Virudhunagar',
    lat: 9.5860,
    lng: 77.9480,
    type: 'Private',
    specialties: ['General Medicine', 'Emergency', 'Orthopedics'],
    totalBeds: 70,
    icuBeds: 8,
    contact: '+91 4562 260 260',
    rating: 3.8,
  },

  // === SRIVILLIPUTHUR HOSPITALS (8) ===
  {
    id: 'h16',
    name: 'Government Hospital Srivilliputhur',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5120,
    lng: 77.6340,
    type: 'Government',
    specialties: ['General Medicine', 'Emergency', 'Surgery'],
    totalBeds: 130,
    icuBeds: 12,
    contact: '+91 4563 260 260',
    rating: 3.6,
  },
  {
    id: 'h17',
    name: 'Sri Meenakshi Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5100,
    lng: 77.6310,
    type: 'Private',
    specialties: ['Multi-Specialty', 'Cardiology', 'General Medicine'],
    totalBeds: 90,
    icuBeds: 10,
    contact: '+91 4563 265 265',
    rating: 4.1,
  },
  {
    id: 'h18',
    name: 'Andal Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5150,
    lng: 77.6380,
    type: 'Private',
    specialties: ['Obstetrics', 'Pediatrics', 'General Surgery'],
    totalBeds: 60,
    icuBeds: 6,
    contact: '+91 4563 268 268',
    rating: 3.9,
  },
  {
    id: 'h19',
    name: 'Lakshmi Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5080,
    lng: 77.6290,
    type: 'Private',
    specialties: ['General Medicine', 'Surgery', 'ENT'],
    totalBeds: 50,
    icuBeds: 5,
    contact: '+91 4563 270 270',
    rating: 3.8,
  },
  {
    id: 'h20',
    name: 'RVS Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5170,
    lng: 77.6400,
    type: 'Trust',
    specialties: ['General Medicine', 'Orthopedics', 'Physiotherapy'],
    totalBeds: 75,
    icuBeds: 8,
    contact: '+91 4563 272 272',
    rating: 4.0,
  },
  {
    id: 'h21',
    name: 'Srivilliputhur Primary Health Centre',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5060,
    lng: 77.6270,
    type: 'Government',
    specialties: ['Primary Care', 'Vaccinations', 'Maternal Health'],
    totalBeds: 30,
    icuBeds: 2,
    contact: '+91 4563 275 275',
    rating: 3.5,
  },
  {
    id: 'h22',
    name: 'Saravana Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5130,
    lng: 77.6360,
    type: 'Private',
    specialties: ['General Medicine', 'Diabetology', 'Urology'],
    totalBeds: 55,
    icuBeds: 6,
    contact: '+91 4563 278 278',
    rating: 3.7,
  },
  {
    id: 'h23',
    name: 'Venkateswara Hospital',
    city: 'Srivilliputhur',
    district: 'Virudhunagar',
    lat: 9.5140,
    lng: 77.6320,
    type: 'Private',
    specialties: ['Cardiology', 'General Surgery', 'Pulmonology'],
    totalBeds: 65,
    icuBeds: 7,
    contact: '+91 4563 280 280',
    rating: 4.0,
  },

  // === KRISHNANKOIL HOSPITALS (7) ===
  {
    id: 'h24',
    name: 'Government Hospital Krishnankoil',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5500,
    lng: 77.8200,
    type: 'Government',
    specialties: ['General Medicine', 'Emergency', 'Surgery'],
    totalBeds: 100,
    icuBeds: 10,
    contact: '+91 4563 290 290',
    rating: 3.6,
  },
  {
    id: 'h25',
    name: 'Muthulakshmi Hospital',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5530,
    lng: 77.8230,
    type: 'Private',
    specialties: ['Multi-Specialty', 'Gynecology', 'Pediatrics'],
    totalBeds: 80,
    icuBeds: 10,
    contact: '+91 4563 292 292',
    rating: 4.1,
  },
  {
    id: 'h26',
    name: 'Sakthi Nursing Home',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5480,
    lng: 77.8170,
    type: 'Private',
    specialties: ['Obstetrics', 'General Medicine'],
    totalBeds: 35,
    icuBeds: 4,
    contact: '+91 4563 294 294',
    rating: 3.7,
  },
  {
    id: 'h27',
    name: 'Thirumurugan Hospital',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5510,
    lng: 77.8250,
    type: 'Private',
    specialties: ['Orthopedics', 'Trauma', 'Physiotherapy'],
    totalBeds: 60,
    icuBeds: 6,
    contact: '+91 4563 296 296',
    rating: 3.9,
  },
  {
    id: 'h28',
    name: 'Krishnankoil PHC',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5470,
    lng: 77.8150,
    type: 'Government',
    specialties: ['Primary Care', 'Vaccinations'],
    totalBeds: 25,
    icuBeds: 2,
    contact: '+91 4563 298 298',
    rating: 3.4,
  },
  {
    id: 'h29',
    name: 'Sri Balaji Hospital',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5550,
    lng: 77.8270,
    type: 'Private',
    specialties: ['General Medicine', 'Cardiology', 'Nephrology'],
    totalBeds: 70,
    icuBeds: 8,
    contact: '+91 4563 300 300',
    rating: 4.2,
  },
  {
    id: 'h30',
    name: 'Aravind Eye Hospital',
    city: 'Krishnankoil',
    district: 'Virudhunagar',
    lat: 9.5520,
    lng: 77.8190,
    type: 'Trust',
    specialties: ['Ophthalmology', 'Eye Surgery', 'Retina'],
    totalBeds: 45,
    icuBeds: 3,
    contact: '+91 4563 302 302',
    rating: 4.5,
  },
];

// Simulate real-time bed vacancies based on Indian Standard Time (IST)
function generateBedVacancies(hospital) {
  // Get current hour in IST
  const now = new Date();
  const utcHour = now.getUTCHours();
  const istHour = (utcHour + 5) % 24 + (now.getUTCMinutes() >= 30 ? 1 : 0); // Rough IST conversion
  
  // Occupancy Model: 
  // 08:00 - 12:00: Rising (Morning shift/admissions)
  // 12:00 - 18:00: Peak (Full operation)
  // 18:00 - 22:00: High but stable (Emergency peak)
  // 22:00 - 06:00: Lower (Night baseline)
  
  let baseOccupancy = 0.70; // 70% baseline
  
  if (istHour >= 10 && istHour <= 18) {
    baseOccupancy = 0.85 + Math.random() * 0.10; // 85-95% (Peak)
  } else if (istHour >= 18 && istHour <= 22) {
    baseOccupancy = 0.80 + Math.random() * 0.10; // 80-90% (Evening)
  } else if (istHour >= 6 && istHour < 10) {
    baseOccupancy = 0.65 + Math.random() * 0.15; // 65-80% (Morning rise)
  } else {
    baseOccupancy = 0.50 + Math.random() * 0.20; // 50-70% (Late night)
  }

  const occupiedBeds = Math.floor(hospital.totalBeds * baseOccupancy);
  const availableBeds = hospital.totalBeds - occupiedBeds;

  const icuOccupancyRate = 0.75 + Math.random() * 0.20; // ICU is usually higher
  const icuOccupied = Math.floor(hospital.icuBeds * icuOccupancyRate);
  
  const emergencyBeds = Math.floor(hospital.totalBeds * 0.10); // 10% of total
  const emergencyOccupied = Math.floor(emergencyBeds * (0.4 + Math.random() * 0.5));

  const ventilators = Math.floor(hospital.icuBeds * 0.7);
  const ventilatorsInUse = Math.floor(ventilators * (0.5 + Math.random() * 0.4));

  return {
    ...hospital,
    occupancyPercent: Math.round(baseOccupancy * 100),
    generalBeds: {
      total: hospital.totalBeds,
      occupied: occupiedBeds,
      available: availableBeds,
    },
    icuStatus: {
      total: hospital.icuBeds,
      occupied: icuOccupied,
      available: hospital.icuBeds - icuOccupied,
    },
    emergencyBeds: {
      total: emergencyBeds,
      occupied: emergencyOccupied,
      available: emergencyBeds - emergencyOccupied,
    },
    ventilators: {
      total: ventilators,
      inUse: ventilatorsInUse,
      available: ventilators - ventilatorsInUse,
    },
    waitTime: Math.floor(10 + Math.random() * 50),
    lastUpdated: new Date().toISOString(),
  };
}

// Calculate distance between two coordinates using Haversine formula (in km)
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Generate initial data for all hospitals
export function generateAllHospitalData() {
  return hospitalsList.map(generateBedVacancies);
}

// Simulate real-time update for a single hospital
export function simulateUpdate(hospital) {
  const now = new Date();
  const istHour = (now.getUTCHours() + 5) % 24;

  // Trend adjustment based on current hour
  let trend = 0;
  if (istHour >= 8 && istHour <= 12) trend = 1; // Increasing
  if (istHour >= 20 || istHour <= 4) trend = -1; // Decreasing

  const bedChange = (Math.floor(Math.random() * 3) - 1) + trend; // -1 to +2 during morning, -2 to +1 during night
  const icuChange = Math.floor(Math.random() * 2) - (trend < 0 ? 1 : 0);

  const newOccupied = Math.max(Math.floor(hospital.generalBeds.total * 0.4), 
                               Math.min(hospital.generalBeds.total, hospital.generalBeds.occupied + bedChange));
  const newIcuOccupied = Math.max(Math.floor(hospital.icuStatus.total * 0.5), 
                                  Math.min(hospital.icuStatus.total, hospital.icuStatus.occupied + icuChange));

  return {
    ...hospital,
    occupancyPercent: Math.round((newOccupied / hospital.generalBeds.total) * 100),
    generalBeds: {
      ...hospital.generalBeds,
      occupied: newOccupied,
      available: hospital.generalBeds.total - newOccupied,
    },
    icuStatus: {
      ...hospital.icuStatus,
      occupied: newIcuOccupied,
      available: hospital.icuStatus.total - newIcuOccupied,
    },
    waitTime: Math.max(5, Math.min(120, hospital.waitTime + Math.floor(Math.random() * 7) - 3)),
    lastUpdated: new Date().toISOString(),
  };
}

// Get nearby hospitals sorted by distance
export function getNearbyHospitals(userLat, userLng, hospitals, maxDistance = 100) {
  return hospitals
    .map((h) => ({
      ...h,
      distance: calculateDistance(userLat, userLng, h.lat, h.lng),
    }))
    .filter((h) => h.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
}

// Smart suggestions engine
export function getSmartSuggestions(userLat, userLng, hospitals, scenario = 'general') {
  const nearby = getNearbyHospitals(userLat, userLng, hospitals);

  switch (scenario) {
    case 'emergency': {
      // Prioritize: low wait time + available emergency beds + close distance
      return nearby
        .filter((h) => h.emergencyBeds.available > 0)
        .sort((a, b) => {
          const scoreA = a.waitTime * 0.4 + a.distance * 0.4 - a.emergencyBeds.available * 2;
          const scoreB = b.waitTime * 0.4 + b.distance * 0.4 - b.emergencyBeds.available * 2;
          return scoreA - scoreB;
        })
        .slice(0, 5);
    }
    case 'icu': {
      // Prioritize: ICU availability + distance
      return nearby
        .filter((h) => h.icuStatus.available > 0)
        .sort((a, b) => {
          const scoreA = a.distance * 0.3 - a.icuStatus.available * 3 + a.waitTime * 0.2;
          const scoreB = b.distance * 0.3 - b.icuStatus.available * 3 + b.waitTime * 0.2;
          return scoreA - scoreB;
        })
        .slice(0, 5);
    }
    case 'general': {
      // Balanced: beds available + low occupancy + close + good rating
      return nearby
        .filter((h) => h.generalBeds.available > 5)
        .sort((a, b) => {
          const scoreA = a.distance * 0.3 + a.occupancyPercent * 0.3 - a.rating * 5 + a.waitTime * 0.1;
          const scoreB = b.distance * 0.3 + b.occupancyPercent * 0.3 - b.rating * 5 + b.waitTime * 0.1;
          return scoreA - scoreB;
        })
        .slice(0, 5);
    }
    case 'pediatric': {
      return nearby
        .filter((h) => h.specialties.some(s => s.toLowerCase().includes('pediatric') || s.toLowerCase().includes('neonat')))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    }
    case 'cardiac': {
      return nearby
        .filter((h) => h.specialties.some(s => s.toLowerCase().includes('cardio') || s.toLowerCase().includes('cardiac')))
        .sort((a, b) => {
          const scoreA = a.distance * 0.4 - a.rating * 5;
          const scoreB = b.distance * 0.4 - b.rating * 5;
          return scoreA - scoreB;
        })
        .slice(0, 5);
    }
    case 'eye': {
      return nearby
        .filter((h) => h.specialties.some(s => s.toLowerCase().includes('ophthalm') || s.toLowerCase().includes('eye')))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
    }
    default:
      return nearby.slice(0, 5);
  }
}

// Region centers for quick navigation
export const regionCenters = {
  'Madurai': { lat: 9.9252, lng: 78.1198, zoom: 13 },
  'Virudhunagar': { lat: 9.5850, lng: 77.9570, zoom: 14 },
  'Srivilliputhur': { lat: 9.5120, lng: 77.6340, zoom: 14 },
  'Krishnankoil': { lat: 9.5500, lng: 77.8200, zoom: 14 },
  'All Regions': { lat: 9.7200, lng: 77.9000, zoom: 10 },
};

export default hospitalsList;
