// Sistema completo de coordenadas por continentes para el mapa mundial
// Coordinado con bloques comerciales y nomenclador aduanero HS

export interface CountryCoordinates {
  countryCode: string;
  countryName: string;
  coordinates: [number, number]; // [latitude, longitude]
  continent: string;
  commercialBlocks: string[];
  hsSpecialities: string[]; // Secciones HS donde el país se especializa
}

// Coordenadas organizadas por continentes y bloques comerciales
export const CONTINENTAL_COORDINATES: CountryCoordinates[] = [
  // ========== AMÉRICA DEL SUR - MERCOSUR ==========
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    coordinates: [-38.4161, -63.6167],
    continent: 'South America',
    commercialBlocks: ['MERCOSUR', 'ALADI', 'PROSUR'],
    hsSpecialities: ['I', 'II', 'III', 'IV'] // Animales, vegetales, aceites, alimentos
  },
  {
    countryCode: 'BR', 
    countryName: 'Brasil',
    coordinates: [-14.2350, -51.9253],
    continent: 'South America',
    commercialBlocks: ['MERCOSUR', 'ALADI', 'PROSUR'],
    hsSpecialities: ['II', 'V', 'IV', 'XV'] // Soja, minerales, azúcar, maquinaria
  },
  {
    countryCode: 'UY',
    countryName: 'Uruguay',
    coordinates: [-32.5228, -55.7658],
    continent: 'South America',
    commercialBlocks: ['MERCOSUR', 'ALADI', 'PROSUR'],
    hsSpecialities: ['I', 'II', 'IV'] // Carne, soja, lácteos
  },
  {
    countryCode: 'PY',
    countryName: 'Paraguay',
    coordinates: [-23.4425, -58.4438],
    continent: 'South America', 
    commercialBlocks: ['MERCOSUR', 'ALADI', 'PROSUR'],
    hsSpecialities: ['II', 'I', 'XV'] // Soja, carne, electricidad
  },
  {
    countryCode: 'BO',
    countryName: 'Bolivia',
    coordinates: [-16.2902, -63.5887],
    continent: 'South America',
    commercialBlocks: ['MERCOSUR', 'ALADI', 'CAN', 'UNASUR'],
    hsSpecialities: ['V', 'XIV'] // Gas natural, minerales
  },

  // ========== AMÉRICA DEL SUR - ALIANZA DEL PACÍFICO ==========
  {
    countryCode: 'CL',
    countryName: 'Chile',
    coordinates: [-35.6751, -71.5430],
    continent: 'South America',
    commercialBlocks: ['Pacific Alliance', 'ALADI', 'CPTPP', 'PROSUR'],
    hsSpecialities: ['V', 'II', 'XIV'] // Cobre, frutas, metales
  },
  {
    countryCode: 'CO',
    countryName: 'Colombia',
    coordinates: [4.5709, -74.2973],
    continent: 'South America',
    commercialBlocks: ['Pacific Alliance', 'ALADI', 'CAN', 'PROSUR'],
    hsSpecialities: ['II', 'V', 'XIV'] // Café, petróleo, carbón
  },
  {
    countryCode: 'PE',
    countryName: 'Perú',
    coordinates: [-9.1900, -75.0152],
    continent: 'South America',
    commercialBlocks: ['Pacific Alliance', 'ALADI', 'CPTPP', 'CAN', 'PROSUR'],
    hsSpecialities: ['V', 'XIV', 'III'] // Cobre, oro, harina de pescado
  },
  {
    countryCode: 'EC',
    countryName: 'Ecuador',
    coordinates: [-1.8312, -78.1834],
    continent: 'South America',
    commercialBlocks: ['ALADI', 'CAN', 'PROSUR'],
    hsSpecialities: ['V', 'II', 'III'] // Petróleo, banano, camarón
  },
  {
    countryCode: 'VE',
    countryName: 'Venezuela',
    coordinates: [6.4238, -66.5897],
    continent: 'South America',
    commercialBlocks: ['ALADI', 'UNASUR'],
    hsSpecialities: ['V'] // Petróleo (con restricciones internacionales)
  },
  {
    countryCode: 'GY',
    countryName: 'Guyana',
    coordinates: [4.8604, -58.9302],
    continent: 'South America',
    commercialBlocks: ['CARICOM', 'PROSUR', 'UNASUR'],
    hsSpecialities: ['V', 'XIV', 'II'] // Petróleo, oro, bauxita, arroz
  },
  {
    countryCode: 'SR',
    countryName: 'Suriname',
    coordinates: [3.9193, -56.0278],
    continent: 'South America',
    commercialBlocks: ['CARICOM', 'UNASUR'],
    hsSpecialities: ['V', 'XIV', 'II'] // Petróleo, oro, bauxita, arroz
  },
  {
    countryCode: 'GF',
    countryName: 'Guayana Francesa',
    coordinates: [3.9339, -53.1258],
    continent: 'South America',
    commercialBlocks: ['EU'],
    hsSpecialities: ['V', 'XIV', 'XVI'] // Oro, madera, tecnología espacial
  },

  // ========== AMÉRICA DEL NORTE - USMCA ==========
  {
    countryCode: 'US',
    countryName: 'Estados Unidos',
    coordinates: [37.0902, -95.7129],
    continent: 'North America',
    commercialBlocks: ['USMCA', 'CAFTA-DR'],
    hsSpecialities: ['XV', 'XVI', 'XVII', 'VI'] // Tecnología, transporte, instrumentos, químicos
  },
  {
    countryCode: 'CA',
    countryName: 'Canadá',
    coordinates: [56.1304, -106.3468],
    continent: 'North America',
    commercialBlocks: ['USMCA', 'CPTPP'],
    hsSpecialities: ['V', 'XIV', 'II', 'IX'] // Petróleo, oro, trigo, madera
  },
  {
    countryCode: 'MX',
    countryName: 'México',
    coordinates: [23.6345, -102.5528],
    continent: 'North America',
    commercialBlocks: ['USMCA', 'ALADI', 'CPTPP', 'Pacific Alliance'],
    hsSpecialities: ['XVI', 'XV', 'V', 'X'] // Vehículos, maquinaria, petróleo, textiles
  },

  // ========== EUROPA - UNIÓN EUROPEA ==========
  {
    countryCode: 'DE',
    countryName: 'Alemania',
    coordinates: [51.1657, 10.4515],
    continent: 'Europe',
    commercialBlocks: ['EU', 'EEA'],
    hsSpecialities: ['XV', 'XVI', 'VI', 'XVII'] // Maquinaria, vehículos, químicos, instrumentos
  },
  {
    countryCode: 'FR',
    countryName: 'Francia',
    coordinates: [46.6034, 1.8883],
    continent: 'Europe',
    commercialBlocks: ['EU', 'EEA'],
    hsSpecialities: ['XVI', 'XV', 'VI', 'IV', 'X'] // Aeronaves, maquinaria, químicos, vino, textiles
  },
  {
    countryCode: 'IT',
    countryName: 'Italia',
    coordinates: [41.8719, 12.5674],
    continent: 'Europe',
    commercialBlocks: ['EU', 'EEA'],
    hsSpecialities: ['XV', 'XVI', 'X', 'IV'] // Maquinaria, vehículos, textiles, alimentos
  },
  {
    countryCode: 'ES',
    countryName: 'España',
    coordinates: [40.4637, -3.7492],
    continent: 'Europe',
    commercialBlocks: ['EU', 'EEA'],
    hsSpecialities: ['XV', 'XVI', 'IV', 'X'] // Maquinaria, vehículos, alimentos, textiles
  },
  {
    countryCode: 'NL',
    countryName: 'Países Bajos',
    coordinates: [52.1326, 5.2913],
    continent: 'Europe',
    commercialBlocks: ['EU', 'EEA'],
    hsSpecialities: ['XV', 'VI', 'V', 'IV'] // Maquinaria, químicos, combustibles, alimentos
  },

  // ========== EUROPA - EFTA ==========
  {
    countryCode: 'CH',
    countryName: 'Suiza',
    coordinates: [46.8182, 8.2275],
    continent: 'Europe',
    commercialBlocks: ['EFTA', 'EEA'],
    hsSpecialities: ['XV', 'VI', 'XVII', 'XIII'] // Maquinaria, químicos, relojes, oro
  },
  {
    countryCode: 'NO',
    countryName: 'Noruega',
    coordinates: [60.4720, 8.4689],
    continent: 'Europe',
    commercialBlocks: ['EFTA', 'EEA'],
    hsSpecialities: ['V', 'III', 'XIV'] // Petróleo, gas, pescado, aluminio
  },

  // ========== ASIA - ASEAN ==========
  {
    countryCode: 'SG',
    countryName: 'Singapur',
    coordinates: [1.3521, 103.8198],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'CPTPP', 'RCEP'],
    hsSpecialities: ['XV', 'VI', 'V'] // Electrónicos, químicos, maquinaria, combustibles
  },
  {
    countryCode: 'MY',
    countryName: 'Malasia',
    coordinates: [4.2105, 101.9758],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'CPTPP', 'RCEP'],
    hsSpecialities: ['XV', 'V', 'III'] // Electrónicos, petróleo, aceite de palma
  },
  {
    countryCode: 'TH',
    countryName: 'Tailandia',
    coordinates: [15.8700, 100.9925],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'RCEP'],
    hsSpecialities: ['XV', 'XVI', 'II'] // Electrónicos, vehículos, arroz
  },
  {
    countryCode: 'VN',
    countryName: 'Vietnam',
    coordinates: [14.0583, 108.2772],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'CPTPP', 'RCEP'],
    hsSpecialities: ['XV', 'X', 'II'] // Electrónicos, textiles, café
  },
  {
    countryCode: 'ID',
    countryName: 'Indonesia',
    coordinates: [-0.7893, 113.9213],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'RCEP'],
    hsSpecialities: ['V', 'III', 'X'] // Petróleo, carbón, aceite de palma, textiles
  },
  {
    countryCode: 'PH',
    countryName: 'Filipinas',
    coordinates: [12.8797, 121.7740],
    continent: 'Asia',
    commercialBlocks: ['ASEAN', 'RCEP'],
    hsSpecialities: ['XV', 'II'] // Electrónicos, maquinaria, coco
  },

  // ========== ASIA - RCEP (Otros miembros importantes) ==========
  {
    countryCode: 'CN',
    countryName: 'China',
    coordinates: [35.8617, 104.1954],
    continent: 'Asia',
    commercialBlocks: ['RCEP'],
    hsSpecialities: ['XV', 'X', 'VII', 'XIX'] // Electrónicos, textiles, plásticos, manufacturas
  },
  {
    countryCode: 'JP',
    countryName: 'Japón',
    coordinates: [36.2048, 138.2529],
    continent: 'Asia',
    commercialBlocks: ['CPTPP', 'RCEP'],
    hsSpecialities: ['XVI', 'XV', 'XIV'] // Vehículos, maquinaria, electrónicos, acero
  },
  {
    countryCode: 'KR',
    countryName: 'Corea del Sur',
    coordinates: [35.9078, 127.7669],
    continent: 'Asia',
    commercialBlocks: ['RCEP'],
    hsSpecialities: ['XV', 'XVI', 'XIV'] // Electrónicos, vehículos, acero
  },
  {
    countryCode: 'IN',
    countryName: 'India',
    coordinates: [20.5937, 78.9629],
    continent: 'Asia',
    commercialBlocks: [],
    hsSpecialities: ['X', 'VI', 'XV', 'II'] // Textiles, químicos, maquinaria, arroz
  },

  // ========== OCEANÍA - CPTPP ==========
  {
    countryCode: 'AU',
    countryName: 'Australia',
    coordinates: [-25.2744, 133.7751],
    continent: 'Oceania',
    commercialBlocks: ['CPTPP', 'RCEP'],
    hsSpecialities: ['V', 'I'] // Hierro, carbón, oro, carne
  },
  {
    countryCode: 'NZ',
    countryName: 'Nueva Zelanda',
    coordinates: [-40.9006, 174.8860],
    continent: 'Oceania',
    commercialBlocks: ['CPTPP', 'RCEP'],
    hsSpecialities: ['IV', 'I', 'X'] // Lácteos, carne, lana, vino
  },

  // ========== ÁFRICA - AfCFTA (Principales economías) ==========
  {
    countryCode: 'ZA',
    countryName: 'Sudáfrica',
    coordinates: [-30.5595, 22.9375],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'SADC'],
    hsSpecialities: ['XIII', 'V', 'XIV'] // Oro, diamantes, platino, carbón
  },
  {
    countryCode: 'EG',
    countryName: 'Egipto',
    coordinates: [26.8206, 30.8025],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'COMESA'],
    hsSpecialities: ['V', 'X', 'IV'] // Petróleo, textiles, alimentos
  },
  {
    countryCode: 'NG',
    countryName: 'Nigeria',
    coordinates: [9.0820, 8.6753],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'ECOWAS'],
    hsSpecialities: ['V', 'II'] // Petróleo, cacao, caucho
  },
  {
    countryCode: 'KE',
    countryName: 'Kenia',
    coordinates: [-0.0236, 37.9062],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'COMESA'],
    hsSpecialities: ['II', 'X'] // Té, café, flores, textiles
  },
  {
    countryCode: 'MG',
    countryName: 'Madagascar',
    coordinates: [-18.7669, 46.8691],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'COMESA', 'SADC'],
    hsSpecialities: ['II', 'X'] // Vainilla, textiles
  },
  {
    countryCode: 'MU',
    countryName: 'Mauritius',
    coordinates: [-20.3484, 57.5522],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'COMESA', 'SADC'],
    hsSpecialities: ['X', 'XVII'] // Textiles, azúcar
  },
  {
    countryCode: 'MZ',
    countryName: 'Mozambique',
    coordinates: [-18.2435, 35.5291],
    continent: 'Africa',
    commercialBlocks: ['AfCFTA', 'SADC'],
    hsSpecialities: ['V'] // Carbón, gas
  },

  // ========== CENTROAMÉRICA Y CARIBE ==========
  {
    countryCode: 'CR',
    countryName: 'Costa Rica',
    coordinates: [9.7489, -83.7534],
    continent: 'Central America',
    commercialBlocks: ['CAFTA-DR', 'SICA'],
    hsSpecialities: ['II', 'XV', 'X'] // Banano, café, textiles, electrónicos
  },
  {
    countryCode: 'GT',
    countryName: 'Guatemala',
    coordinates: [15.7835, -90.2308],
    continent: 'Central America',
    commercialBlocks: ['CAFTA-DR', 'SICA'],
    hsSpecialities: ['II', 'XVII', 'X'] // Café, azúcar, textiles, cardamomo
  },
  {
    countryCode: 'PA',
    countryName: 'Panamá',
    coordinates: [8.5380, -80.7821],
    continent: 'Central America',
    commercialBlocks: ['SICA'],
    hsSpecialities: ['II', 'III', 'XIX'] // Banano, camarón, re-exportaciones
  },
  {
    countryCode: 'JM',
    countryName: 'Jamaica',
    coordinates: [18.1096, -77.2975],
    continent: 'Caribbean',
    commercialBlocks: ['CARICOM'],
    hsSpecialities: ['XIV', 'XVII'] // Bauxita, azúcar, banano
  },
  {
    countryCode: 'TT',
    countryName: 'Trinidad y Tobago',
    coordinates: [10.6918, -61.2225],
    continent: 'Caribbean',
    commercialBlocks: ['CARICOM'],
    hsSpecialities: ['V', 'VI'] // Petróleo, gas, químicos
  },

  // ========== MEDIO ORIENTE - GCC ==========
  {
    countryCode: 'SA',
    countryName: 'Arabia Saudí',
    coordinates: [23.8859, 45.0792],
    continent: 'Middle East',
    commercialBlocks: ['GCC'],
    hsSpecialities: ['V', 'VI', 'VII'] // Petróleo, químicos, plásticos
  },
  {
    countryCode: 'AE',
    countryName: 'Emiratos Árabes Unidos',
    coordinates: [23.4241, 53.8478],
    continent: 'Middle East',
    commercialBlocks: ['GCC'],
    hsSpecialities: ['V', 'XIV', 'XIX'] // Petróleo, aluminio, re-exportaciones
  },
  {
    countryCode: 'QA',
    countryName: 'Catar',
    coordinates: [25.3548, 51.1839],
    continent: 'Middle East',
    commercialBlocks: ['GCC'],
    hsSpecialities: ['V', 'VI'] // Gas, petróleo, químicos
  }
];

// Función para obtener coordenadas por código de país
export function getCountryCoordinates(countryCode: string): [number, number] | null {
  const country = CONTINENTAL_COORDINATES.find(c => c.countryCode === countryCode);
  return country?.coordinates || null;
}

// Función para obtener países por continente
export function getCountriesByContinent(continent: string): CountryCoordinates[] {
  return CONTINENTAL_COORDINATES.filter(c => c.continent === continent);
}

// Función para obtener países por bloque comercial
export function getCountriesByCommercialBlock(block: string): CountryCoordinates[] {
  return CONTINENTAL_COORDINATES.filter(c => c.commercialBlocks.includes(block));
}

// Función para obtener especialidades HS de un país
export function getCountryHSSpecialities(countryCode: string): string[] {
  const country = CONTINENTAL_COORDINATES.find(c => c.countryCode === countryCode);
  return country?.hsSpecialities || [];
}

// Centros de continentes para auto-zoom
export const CONTINENTAL_CENTERS: Record<string, [number, number]> = {
  'South America': [-15.0, -60.0],
  'North America': [45.0, -100.0],
  'Europe': [54.0, 15.0],
  'Asia': [30.0, 100.0],
  'Oceania': [-25.0, 140.0],
  'Africa': [0.0, 20.0],
  'Central America': [15.0, -85.0],
  'Caribbean': [18.0, -75.0],
  'Middle East': [25.0, 45.0]
};