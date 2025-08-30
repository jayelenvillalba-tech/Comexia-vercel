// SCRIPT DE COMPLETAR AMÉRICA DEL NORTE - K.O.R.A (Enero 8, 2025)
// Agregando los 8 países faltantes para 100% de cobertura continental

const PAISES_FALTANTES_NORTEAMERICA = [
  // ISLAS DEL CARIBE ORIENTAL
  {
    code: 'AG',
    name: 'Antigua and Barbuda',
    nameEs: 'Antigua y Barbuda',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 17.0608, lng: -61.7964 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'Antigua Commercial Bank',
        type: 'financial',
        category: 'bank',
        classification: 'direct',
        hsCodes: ['7108.11', '7108.12'],
        rating: 4.2,
        coordinates: { lat: 17.1175, lng: -61.8456 }
      }
    ]
  },
  
  {
    code: 'CU',
    name: 'Cuba',
    nameEs: 'Cuba',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 21.5218, lng: -77.7812 },
    currency: 'CUP',
    languages: ['es'],
    tradeAgreements: ['ALBA', 'CELAC'],
    companies: [
      {
        name: 'Cuba Ron Corporation',
        type: 'export',
        category: 'beverages',
        classification: 'state',
        hsCodes: ['2208.40'],
        rating: 4.5,
        coordinates: { lat: 23.1136, lng: -82.3666 }
      },
      {
        name: 'Cubatabaco',
        type: 'export',
        category: 'tobacco',
        classification: 'state',
        hsCodes: ['2402.10'],
        rating: 4.8,
        coordinates: { lat: 23.1136, lng: -82.3666 }
      }
    ]
  },

  {
    code: 'DM',
    name: 'Dominica',
    nameEs: 'Dominica',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 15.4140, lng: -61.3710 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'Dominica Export Import Agency',
        type: 'both',
        category: 'trading',
        classification: 'state',
        hsCodes: ['0603.11', '1211.90'],
        rating: 4.0,
        coordinates: { lat: 15.2976, lng: -61.3900 }
      }
    ]
  },

  {
    code: 'GD',
    name: 'Grenada',
    nameEs: 'Granada',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 12.1165, lng: -61.6790 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'Grenada Nutmeg Cooperative',
        type: 'export',
        category: 'spices',
        classification: 'cooperative',
        hsCodes: ['0908.11', '0908.12'],
        rating: 4.3,
        coordinates: { lat: 12.0561, lng: -61.7486 }
      }
    ]
  },

  {
    code: 'HT',
    name: 'Haiti',
    nameEs: 'Haití',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 18.9712, lng: -72.2852 },
    currency: 'HTG',
    languages: ['fr', 'ht'],
    tradeAgreements: ['CARICOM', 'HOPE', 'HELP'],
    companies: [
      {
        name: 'Société Nationale des Parcs Industriels',
        type: 'export',
        category: 'textiles',
        classification: 'state',
        hsCodes: ['6109.10', '6110.20'],
        rating: 3.8,
        coordinates: { lat: 18.5392, lng: -72.3370 }
      },
      {
        name: 'FHAC - Fédération Haïtienne des Associations Caféières',
        type: 'export',
        category: 'coffee',
        classification: 'cooperative',
        hsCodes: ['0901.11'],
        rating: 4.1,
        coordinates: { lat: 18.9712, lng: -72.2852 }
      }
    ]
  },

  {
    code: 'KN',
    name: 'Saint Kitts and Nevis',
    nameEs: 'San Cristóbal y Nieves',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 17.3578, lng: -62.7830 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'St. Kitts Sugar Manufacturing Corporation',
        type: 'export',
        category: 'sugar',
        classification: 'state',
        hsCodes: ['1701.14'],
        rating: 3.9,
        coordinates: { lat: 17.3026, lng: -62.7177 }
      }
    ]
  },

  {
    code: 'LC',
    name: 'Saint Lucia',
    nameEs: 'Santa Lucía',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 13.9094, lng: -60.9789 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'Saint Lucia Banana Corporation',
        type: 'export',
        category: 'agriculture',
        classification: 'cooperative',
        hsCodes: ['0803.10'],
        rating: 4.0,
        coordinates: { lat: 14.0101, lng: -60.9875 }
      }
    ]
  },

  {
    code: 'VC',
    name: 'Saint Vincent and the Grenadines',
    nameEs: 'San Vicente y las Granadinas',
    continent: 'North America',
    subregion: 'Caribbean',
    coordinates: { lat: 12.9843, lng: -61.2872 },
    currency: 'XCD',
    languages: ['en'],
    tradeAgreements: ['CARICOM', 'CARIFORUM-EU'],
    companies: [
      {
        name: 'VINCY Fresh',
        type: 'export',
        category: 'agriculture',
        classification: 'cooperative',
        hsCodes: ['0804.10', '0805.10'],
        rating: 4.2,
        coordinates: { lat: 13.1579, lng: -61.2248 }
      }
    ]
  }
];

const OCEANIA_FALTANTES = [
  {
    code: 'KI',
    name: 'Kiribati',
    nameEs: 'Kiribati',
    continent: 'Oceania',
    subregion: 'Micronesia',
    coordinates: { lat: -3.3704, lng: -168.7340 },
    currency: 'AUD',
    languages: ['en', 'gil'],
    tradeAgreements: ['PACER Plus', 'Pacific Islands Forum'],
    companies: [
      {
        name: 'Kiribati Copra Cooperative Society',
        type: 'export',
        category: 'agriculture',
        classification: 'cooperative',
        hsCodes: ['1513.21'],
        rating: 3.7,
        coordinates: { lat: 1.4518, lng: 172.9719 }
      }
    ]
  },

  {
    code: 'MH',
    name: 'Marshall Islands',
    nameEs: 'Islas Marshall',
    continent: 'Oceania',
    subregion: 'Micronesia',
    coordinates: { lat: 7.1315, lng: 171.1845 },
    currency: 'USD',
    languages: ['en', 'mh'],
    tradeAgreements: ['PACER Plus', 'Compact of Free Association'],
    companies: [
      {
        name: 'Marshall Islands Marine Resources Authority',
        type: 'export',
        category: 'fishing',
        classification: 'state',
        hsCodes: ['0302.13', '1604.14'],
        rating: 4.1,
        coordinates: { lat: 7.0897, lng: 171.2735 }
      }
    ]
  },

  {
    code: 'FM',
    name: 'Micronesia',
    nameEs: 'Micronesia',
    continent: 'Oceania',
    subregion: 'Micronesia',
    coordinates: { lat: 7.4256, lng: 150.5508 },
    currency: 'USD',
    languages: ['en'],
    tradeAgreements: ['PACER Plus', 'Compact of Free Association'],
    companies: [
      {
        name: 'FSM Development Bank',
        type: 'both',
        category: 'financial',
        classification: 'state',
        hsCodes: ['0603.11', '1404.90'],
        rating: 3.8,
        coordinates: { lat: 6.9248, lng: 158.1610 }
      }
    ]
  },

  {
    code: 'NR',
    name: 'Nauru',
    nameEs: 'Nauru',
    continent: 'Oceania',
    subregion: 'Micronesia',
    coordinates: { lat: -0.5228, lng: 166.9315 },
    currency: 'AUD',
    languages: ['en', 'na'],
    tradeAgreements: ['PACER Plus'],
    companies: [
      {
        name: 'Nauru Phosphate Corporation',
        type: 'export',
        category: 'mining',
        classification: 'state',
        hsCodes: ['2510.20'],
        rating: 3.5,
        coordinates: { lat: -0.5228, lng: 166.9315 }
      }
    ]
  },

  {
    code: 'PW',
    name: 'Palau',
    nameEs: 'Palau',
    continent: 'Oceania',
    subregion: 'Micronesia',
    coordinates: { lat: 7.5150, lng: 134.5825 },
    currency: 'USD',
    languages: ['en', 'pau'],
    tradeAgreements: ['PACER Plus', 'Compact of Free Association'],
    companies: [
      {
        name: 'Palau Conservation Society',
        type: 'export',
        category: 'marine',
        classification: 'cooperative',
        hsCodes: ['0511.91'],
        rating: 4.3,
        coordinates: { lat: 7.3400, lng: 134.4700 }
      }
    ]
  },

  {
    code: 'WS',
    name: 'Samoa',
    nameEs: 'Samoa',
    continent: 'Oceania',
    subregion: 'Polynesia',
    coordinates: { lat: -13.7590, lng: -172.1046 },
    currency: 'WST',
    languages: ['sm', 'en'],
    tradeAgreements: ['PACER Plus', 'Pacific Islands Forum'],
    companies: [
      {
        name: 'Samoa Commercial Bank',
        type: 'both',
        category: 'financial',
        classification: 'direct',
        hsCodes: ['0901.11', '1513.21'],
        rating: 4.0,
        coordinates: { lat: -13.8506, lng: -171.7513 }
      },
      {
        name: 'Women in Business Development Inc',
        type: 'export',
        category: 'agriculture',
        classification: 'cooperative',
        hsCodes: ['1515.50'],
        rating: 4.4,
        coordinates: { lat: -13.8506, lng: -171.7513 }
      }
    ]
  },

  {
    code: 'SB',
    name: 'Solomon Islands',
    nameEs: 'Islas Salomón',
    continent: 'Oceania',
    subregion: 'Melanesia',
    coordinates: { lat: -9.6457, lng: 160.1562 },
    currency: 'SBD',
    languages: ['en'],
    tradeAgreements: ['PACER Plus', 'MSG Trade Agreement'],
    companies: [
      {
        name: 'Solomon Islands Plantation Limited',
        type: 'export',
        category: 'agriculture',
        classification: 'direct',
        hsCodes: ['1513.21', '4403.20'],
        rating: 4.1,
        coordinates: { lat: -9.4280, lng: 159.9550 }
      }
    ]
  },

  {
    code: 'TO',
    name: 'Tonga',
    nameEs: 'Tonga',
    continent: 'Oceania',
    subregion: 'Polynesia',
    coordinates: { lat: -21.1789, lng: -175.1982 },
    currency: 'TOP',
    languages: ['to', 'en'],
    tradeAgreements: ['PACER Plus', 'Pacific Islands Forum'],
    companies: [
      {
        name: 'Tonga Development Bank',
        type: 'both',
        category: 'financial',
        classification: 'state',
        hsCodes: ['0801.11', '1404.90'],
        rating: 3.9,
        coordinates: { lat: -21.1350, lng: -175.2018 }
      }
    ]
  },

  {
    code: 'TV',
    name: 'Tuvalu',
    nameEs: 'Tuvalu',
    continent: 'Oceania',
    subregion: 'Polynesia',
    coordinates: { lat: -7.1095, lng: 177.6493 },
    currency: 'AUD',
    languages: ['tvl', 'en'],
    tradeAgreements: ['PACER Plus'],
    companies: [
      {
        name: 'Tuvalu Fisheries Department',
        type: 'export',
        category: 'fishing',
        classification: 'state',
        hsCodes: ['0302.13'],
        rating: 3.6,
        coordinates: { lat: -8.5211, lng: 179.1962 }
      }
    ]
  },

  {
    code: 'VU',
    name: 'Vanuatu',
    nameEs: 'Vanuatu',
    continent: 'Oceania',
    subregion: 'Melanesia',
    coordinates: { lat: -15.3767, lng: 166.9592 },
    currency: 'VUV',
    languages: ['bi', 'en', 'fr'],
    tradeAgreements: ['PACER Plus', 'MSG Trade Agreement'],
    companies: [
      {
        name: 'Vanuatu Agricultural Development Bank',
        type: 'both',
        category: 'agriculture',
        classification: 'state',
        hsCodes: ['0901.11', '1513.21'],
        rating: 4.0,
        coordinates: { lat: -17.7334, lng: 168.3273 }
      },
      {
        name: 'Vanuatu Kava Store',
        type: 'export',
        category: 'beverages',
        classification: 'cooperative',
        hsCodes: ['1211.90'],
        rating: 4.2,
        coordinates: { lat: -17.7334, lng: 168.3273 }
      }
    ]
  }
];

// Función para cargar América del Norte
function cargarNorteAmericaCompleto() {
  console.log("=".repeat(60));
  console.log("CARGANDO AMÉRICA DEL NORTE - COMPLETAR A 100%");
  console.log("=".repeat(60));
  
  PAISES_FALTANTES_NORTEAMERICA.forEach(pais => {
    console.log(`✓ ${pais.name} (${pais.code}) - ${pais.companies.length} empresas`);
    pais.companies.forEach(empresa => {
      console.log(`  - ${empresa.name} [${empresa.classification}]`);
    });
  });
  
  const totalEmpresas = PAISES_FALTANTES_NORTEAMERICA.reduce((sum, pais) => sum + pais.companies.length, 0);
  console.log(`\nTOTAL: ${PAISES_FALTANTES_NORTEAMERICA.length} países, ${totalEmpresas} empresas`);
  console.log("América del Norte pasará de 15/23 (65%) a 23/23 (100%)");
  
  return {
    paises: PAISES_FALTANTES_NORTEAMERICA,
    totalPaises: PAISES_FALTANTES_NORTEAMERICA.length,
    totalEmpresas: totalEmpresas
  };
}

// Función para cargar Oceanía
function cargarOceaniaCompleto() {
  console.log("=".repeat(60));
  console.log("CARGANDO OCEANÍA - COMPLETAR A 100%");
  console.log("=".repeat(60));
  
  OCEANIA_FALTANTES.forEach(pais => {
    console.log(`✓ ${pais.name} (${pais.code}) - ${pais.companies.length} empresas`);
    pais.companies.forEach(empresa => {
      console.log(`  - ${empresa.name} [${empresa.classification}]`);
    });
  });
  
  const totalEmpresas = OCEANIA_FALTANTES.reduce((sum, pais) => sum + pais.companies.length, 0);
  console.log(`\nTOTAL: ${OCEANIA_FALTANTES.length} países, ${totalEmpresas} empresas`);
  console.log("Oceanía pasará de 4/14 (29%) a 14/14 (100%)");
  
  return {
    paises: OCEANIA_FALTANTES,
    totalPaises: OCEANIA_FALTANTES.length,
    totalEmpresas: totalEmpresas
  };
}

module.exports = {
  PAISES_FALTANTES_NORTEAMERICA,
  OCEANIA_FALTANTES,
  cargarNorteAmericaCompleto,
  cargarOceaniaCompleto
};