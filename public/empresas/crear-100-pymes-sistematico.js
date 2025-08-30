// Crear 100 PYMEs Sistemático - Primera Fase hacia el Objetivo 500 Empresas Equilibradas
// Distribución: América (25), Europa (25), Asia (20), África (15), Oceanía (10), América del Norte (5)

const crear100PymesSistematico = async () => {
  console.log('🏢 CREANDO 100 PYMEs SISTEMÁTICAMENTE - LIBERT.IA');
  console.log('='.repeat(60));

  // PYMEs América del Sur (25 empresas)
  const pymesAmericaSur = [
    { name: "São Paulo Textiles LTDA", country: "BR", sector: "textiles", employees: 180 },
    { name: "Buenos Aires Grain Traders", country: "AR", sector: "agriculture", employees: 120 },
    { name: "Santiago Wine Exporters", country: "CL", sector: "beverages", employees: 95 },
    { name: "Bogotá Coffee Roasters", country: "CO", sector: "food", employees: 85 },
    { name: "Lima Marine Products", country: "PE", sector: "food", employees: 110 },
    { name: "Montevideo Leather Goods", country: "UY", sector: "manufacturing", employees: 75 },
    { name: "Quito Flower Exports", country: "EC", sector: "agriculture", employees: 90 },
    { name: "Caracas Oil Services", country: "VE", sector: "energy", employees: 160 },
    { name: "Rio Coffee Trading", country: "BR", sector: "food", employees: 105 },
    { name: "Córdoba Soy Processors", country: "AR", sector: "agriculture", employees: 140 },
    { name: "Valparaíso Seafood", country: "CL", sector: "food", employees: 80 },
    { name: "Medellín Flower Power", country: "CO", sector: "agriculture", employees: 70 },
    { name: "Cusco Textile Artisans", country: "PE", sector: "textiles", employees: 65 },
    { name: "Punta del Este Tourism", country: "UY", sector: "services", employees: 55 },
    { name: "Guayaquil Banana Co", country: "EC", sector: "food", employees: 125 },
    { name: "Maracaibo Industrial", country: "VE", sector: "manufacturing", employees: 150 },
    { name: "Brasília Tech Solutions", country: "BR", sector: "technology", employees: 95 },
    { name: "Rosario Wheat Mills", country: "AR", sector: "food", employees: 115 },
    { name: "Concepción Forestry", country: "CL", sector: "forestry", employees: 130 },
    { name: "Cartagena Ports", country: "CO", sector: "logistics", employees: 145 },
    { name: "Arequipa Alpaca Wool", country: "PE", sector: "textiles", employees: 85 },
    { name: "La Paz Mining Supply", country: "BO", sector: "mining", employees: 100 },
    { name: "Asunción Cotton", country: "PY", sector: "agriculture", employees: 90 },
    { name: "Georgetown Rice Mills", country: "GY", sector: "food", employees: 75 },
    { name: "Paramaribo Gold Trading", country: "SR", sector: "mining", employees: 60 }
  ];

  // PYMEs Europa (25 empresas)
  const pymesEuropa = [
    { name: "Munich Precision Tools", country: "DE", sector: "manufacturing", employees: 180 },
    { name: "London Financial Services", country: "GB", sector: "financial", employees: 220 },
    { name: "Paris Fashion House", country: "FR", sector: "textiles", employees: 150 },
    { name: "Zurich Watch Components", country: "CH", sector: "manufacturing", employees: 90 },
    { name: "Stockholm Tech Hub", country: "SE", sector: "technology", employees: 120 },
    { name: "Copenhagen Design Studio", country: "DK", sector: "design", employees: 85 },
    { name: "Oslo Marine Equipment", country: "NO", sector: "marine", employees: 110 },
    { name: "Milan Leather Goods", country: "IT", sector: "luxury", employees: 95 },
    { name: "Barcelona Wine Cellars", country: "ES", sector: "beverages", employees: 105 },
    { name: "Amsterdam Flower Trade", country: "NL", sector: "agriculture", employees: 130 },
    { name: "Brussels Chocolate", country: "BE", sector: "food", employees: 75 },
    { name: "Vienna Classical Music", country: "AT", sector: "entertainment", employees: 65 },
    { name: "Dublin Software", country: "IE", sector: "technology", employees: 140 },
    { name: "Helsinki Game Studio", country: "FI", sector: "technology", employees: 95 },
    { name: "Warsaw Electronics", country: "PL", sector: "electronics", employees: 160 },
    { name: "Prague Crystal Glass", country: "CZ", sector: "manufacturing", employees: 80 },
    { name: "Lisbon Cork Products", country: "PT", sector: "manufacturing", employees: 70 },
    { name: "Athens Olive Oil", country: "GR", sector: "food", employees: 85 },
    { name: "Budapest Thermal Spas", country: "HU", sector: "tourism", employees: 120 },
    { name: "Bucharest IT Services", country: "RO", sector: "technology", employees: 115 },
    { name: "Hamburg Port Services", country: "DE", sector: "logistics", employees: 200 },
    { name: "Lyon Silk Fabrics", country: "FR", sector: "textiles", employees: 90 },
    { name: "Turin Auto Parts", country: "IT", sector: "automotive", employees: 175 },
    { name: "Seville Ceramics", country: "ES", sector: "manufacturing", employees: 100 },
    { name: "Rotterdam Chemical", country: "NL", sector: "chemicals", employees: 145 }
  ];

  // PYMEs Asia (20 empresas)
  const pymesAsia = [
    { name: "Shanghai Electronics", country: "CN", sector: "electronics", employees: 240 },
    { name: "Tokyo Precision Instruments", country: "JP", sector: "manufacturing", employees: 185 },
    { name: "Seoul Software Solutions", country: "KR", sector: "technology", employees: 160 },
    { name: "Mumbai Textile Mills", country: "IN", sector: "textiles", employees: 220 },
    { name: "Singapore Logistics Hub", country: "SG", sector: "logistics", employees: 130 },
    { name: "Bangkok Rice Trading", country: "TH", sector: "food", employees: 95 },
    { name: "Kuala Lumpur Palm Oil", country: "MY", sector: "agriculture", employees: 110 },
    { name: "Jakarta Furniture Export", country: "ID", sector: "furniture", employees: 150 },
    { name: "Manila Electronics Assembly", country: "PH", sector: "electronics", employees: 180 },
    { name: "Ho Chi Minh Garments", country: "VN", sector: "textiles", employees: 200 },
    { name: "Beijing Green Tech", country: "CN", sector: "technology", employees: 140 },
    { name: "Osaka Machine Tools", country: "JP", sector: "manufacturing", employees: 120 },
    { name: "Busan Shipbuilding", country: "KR", sector: "marine", employees: 190 },
    { name: "Chennai Auto Components", country: "IN", sector: "automotive", employees: 170 },
    { name: "Hong Kong Trading", country: "HK", sector: "trading", employees: 85 },
    { name: "Taipei Semiconductor", country: "TW", sector: "electronics", employees: 155 },
    { name: "Chiang Mai Handicrafts", country: "TH", sector: "crafts", employees: 70 },
    { name: "Penang Electronics", country: "MY", sector: "electronics", employees: 125 },
    { name: "Surabaya Textiles", country: "ID", sector: "textiles", employees: 135 },
    { name: "Cebu IT Outsourcing", country: "PH", sector: "technology", employees: 165 }
  ];

  // PYMEs África (15 empresas)
  const pymesAfrica = [
    { name: "Cape Town Wine Estate", country: "ZA", sector: "beverages", employees: 120 },
    { name: "Lagos Technology Hub", country: "NG", sector: "technology", employees: 150 },
    { name: "Cairo Cotton Mills", country: "EG", sector: "textiles", employees: 180 },
    { name: "Casablanca Argan Oil", country: "MA", sector: "cosmetics", employees: 85 },
    { name: "Nairobi Coffee Roasters", country: "KE", sector: "food", employees: 95 },
    { name: "Accra Cocoa Processing", country: "GH", sector: "food", employees: 140 },
    { name: "Tunis Olive Oil", country: "TN", sector: "food", employees: 75 },
    { name: "Johannesburg Mining Equipment", country: "ZA", sector: "mining", employees: 160 },
    { name: "Port Harcourt Oil Services", country: "NG", sector: "energy", employees: 135 },
    { name: "Alexandria Textiles", country: "EG", sector: "textiles", employees: 110 },
    { name: "Marrakech Handicrafts", country: "MA", sector: "crafts", employees: 65 },
    { name: "Mombasa Port Services", country: "KE", sector: "logistics", employees: 125 },
    { name: "Kumasi Gold Processing", country: "GH", sector: "mining", employees: 90 },
    { name: "Algiers Petrochemicals", country: "DZ", sector: "chemicals", employees: 170 },
    { name: "Luanda Diamond Cutting", country: "AO", sector: "luxury", employees: 80 }
  ];

  // PYMEs Oceanía (10 empresas)
  const pymesOceania = [
    { name: "Sydney Harbor Trading", country: "AU", sector: "trading", employees: 145 },
    { name: "Melbourne Wine Exporters", country: "AU", sector: "beverages", employees: 110 },
    { name: "Auckland Dairy Products", country: "NZ", sector: "food", employees: 125 },
    { name: "Brisbane Mining Services", country: "AU", sector: "mining", employees: 180 },
    { name: "Wellington Software", country: "NZ", sector: "technology", employees: 95 },
    { name: "Perth Mineral Trading", country: "AU", sector: "mining", employees: 160 },
    { name: "Christchurch Agriculture", country: "NZ", sector: "agriculture", employees: 85 },
    { name: "Port Moresby Timber", country: "PG", sector: "forestry", employees: 120 },
    { name: "Suva Tourism Services", country: "FJ", sector: "tourism", employees: 75 },
    { name: "Adelaide Electronics", country: "AU", sector: "electronics", employees: 135 }
  ];

  // PYMEs América del Norte (15 empresas)
  const pymesAmericaNorte = [
    { name: "Portland Organic Foods", country: "US", sector: "food", employees: 95 },
    { name: "Vancouver Tech Startup", country: "CA", sector: "technology", employees: 85 },
    { name: "Guadalajara Electronics", country: "MX", sector: "electronics", employees: 140 },
    { name: "Seattle Coffee Roasters", country: "US", sector: "food", employees: 70 },
    { name: "Toronto Financial Tech", country: "CA", sector: "financial", employees: 120 },
    { name: "Tijuana Manufacturing", country: "MX", sector: "manufacturing", employees: 180 },
    { name: "Austin Software House", country: "US", sector: "technology", employees: 110 },
    { name: "Montreal Design Studio", country: "CA", sector: "design", employees: 65 },
    { name: "Monterrey Auto Parts", country: "MX", sector: "automotive", employees: 160 },
    { name: "Denver Outdoor Gear", country: "US", sector: "sports", employees: 90 },
    { name: "Calgary Energy Services", country: "CA", sector: "energy", employees: 145 },
    { name: "León Leather Goods", country: "MX", sector: "textiles", employees: 105 },
    { name: "Nashville Music Tech", country: "US", sector: "entertainment", employees: 80 },
    { name: "Winnipeg Agricultural", country: "CA", sector: "agriculture", employees: 100 },
    { name: "Puebla Textiles", country: "MX", sector: "textiles", employees: 125 }
  ];

  // Consolidar todas las PYMEs
  const todasPymes = [
    ...pymesAmericaSur,
    ...pymesEuropa,
    ...pymesAsia,
    ...pymesAfrica,
    ...pymesOceania,
    ...pymesAmericaNorte
  ];

  let agregadas = 0;
  let errores = 0;

  console.log('\n🏢 CREANDO 100 PYMEs DISTRIBUIDAS GLOBALMENTE:');
  console.log(`• América del Sur: ${pymesAmericaSur.length} PYMEs`);
  console.log(`• Europa: ${pymesEuropa.length} PYMEs`);
  console.log(`• Asia: ${pymesAsia.length} PYMEs`);
  console.log(`• África: ${pymesAfrica.length} PYMEs`);
  console.log(`• Oceanía: ${pymesOceania.length} PYMEs`);
  console.log(`• América del Norte: ${pymesAmericaNorte.length} PYMEs`);
  console.log(`• Total a crear: ${todasPymes.length} PYMEs`);

  for (const pyme of todasPymes) {
    try {
      // Verificar si ya existe
      const responseCheck = await fetch('http://localhost:5000/api/companies');
      const dataCheck = await responseCheck.json();
      const yaExiste = dataCheck.companies.some(e => e.name === pyme.name);

      if (yaExiste) {
        console.log(`⚠️ ${pyme.name} ya existe, omitiendo`);
        continue;
      }

      const pymeCompleta = {
        name: pyme.name,
        country: pyme.country,
        type: 'pyme',
        products: getProductosSegunSector(pyme.sector),
        verified: true,
        coordinates: getCoordenadasPais(pyme.country),
        website: `https://www.${pyme.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        contactEmail: `info@${pyme.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        legalName: pyme.name,
        businessType: getBusinessTypePyme(pyme.sector),
        establishedYear: getAnoEstablecimientoPyme(),
        employeeCount: pyme.employees,
        creditRating: getCreditRatingPyme(pyme.employees),
        riskScore: Math.floor((pyme.employees / 250) * 100).toString(),
        certifications: getCertificacionesPyme(pyme.sector),
        contactPerson: `${getTituloPyme(pyme.sector)} Director`,
        phone: getTelefonoPais(pyme.country),
        address: `${pyme.name} Office, ${getCiudadPais(pyme.country)}`,
        rating: Math.min(4.0, 3.0 + (pyme.employees / 500)),
        sector: pyme.sector,
        size: getClassificacionTamano(pyme.employees)
      };

      const responseAdd = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pymeCompleta)
      });

      if (responseAdd.ok) {
        agregadas++;
        console.log(`✅ ${getBandera(pyme.country)} ${pyme.name} (${pyme.employees} empleados - ${pyme.sector})`);
      } else {
        errores++;
        console.log(`❌ ${pyme.name} - Error HTTP`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ ${pyme.name} - Exception: ${error.message}`);
    }
  }

  // Verificar resultado final
  const responseFinal = await fetch('http://localhost:5000/api/companies');
  const dataFinal = await responseFinal.json();
  
  const pymesFinal = dataFinal.companies.filter(e => 
    e.type === 'pyme' || (e.employeeCount && e.employeeCount <= 250)
  );

  console.log('\n📈 RESULTADOS CREACIÓN PYMES:');
  console.log(`• PYMEs creadas exitosamente: ${agregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total PYMEs en sistema: ${pymesFinal.length}`);

  // Análisis por continente
  const continentes = {
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL', 'CZ', 'PT', 'GR', 'HU', 'RO'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ'],
    'América del Norte': ['US', 'CA', 'MX']
  };

  console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL PYMES:');
  Object.entries(continentes).forEach(([continente, paises]) => {
    const pymesCont = pymesFinal.filter(e => paises.includes(e.country));
    console.log(`• ${continente}: ${pymesCont.length} PYMEs`);
  });

  // Análisis sectorial
  const sectores = {};
  pymesFinal.forEach(pyme => {
    const sector = pyme.sector || 'general';
    sectores[sector] = (sectores[sector] || 0) + 1;
  });

  console.log('\n🏭 DISTRIBUCIÓN SECTORIAL:');
  Object.entries(sectores)
    .sort(([,a], [,b]) => b - a)
    .forEach(([sector, cantidad]) => {
      console.log(`• ${sector}: ${cantidad} PYMEs`);
    });

  // Estado del objetivo 500 empresas
  console.log('\n🎯 PROGRESO HACIA OBJETIVO 500 EMPRESAS:');
  console.log(`• Total empresas actuales: ${dataFinal.companies.length}`);
  console.log(`• PYMEs completadas: ${pymesFinal.length}/100`);
  console.log(`• Siguiente fase: Cooperativas (meta: 100)`);
  console.log(`• Última fase: Estatales (meta: 100)`);

  return {
    pymesCreadasExitosamente: agregadas,
    errores,
    totalPymesEnSistema: pymesFinal.length,
    distribuccionContinental: Object.fromEntries(
      Object.entries(continentes).map(([cont, paises]) => [
        cont, 
        pymesFinal.filter(e => paises.includes(e.country)).length
      ])
    ),
    distribuccionSectorial: sectores
  };
};

// Funciones auxiliares
function getProductosSegunSector(sector) {
  const productos = {
    'textiles': ['6203', '6204', '5407', '5208'],
    'agriculture': ['1005', '1201', '1207', '0713'],
    'food': ['1905', '2106', '2103', '1704'],
    'beverages': ['2204', '2203', '2202', '2009'],
    'technology': ['8517', '8471', '8525', '8523'],
    'electronics': ['8471', '8517', '8525', '8542'],
    'manufacturing': ['8483', '8482', '8481', '8479'],
    'energy': ['2709', '2711', '2701', '8501'],
    'automotive': ['8703', '8708', '8704', '8407'],
    'mining': ['2601', '2603', '7108', '2616'],
    'forestry': ['4403', '4407', '4409', '4412'],
    'luxury': ['7113', '4202', '6403', '9101'],
    'chemicals': ['2804', '2902', '3004', '3808'],
    'financial': ['8523', '8471'],
    'logistics': ['8701', '8704', '8609'],
    'marine': ['8901', '8905', '8483'],
    'furniture': ['9403', '9401', '4418', '9404'],
    'crafts': ['9701', '4420', '6307', '9505'],
    'cosmetics': ['3304', '3305', '3307', '1515'],
    'design': ['8523', '4911', '9003'],
    'entertainment': ['9208', '8519', '8521'],
    'tourism': ['8523', '4911'],
    'sports': ['9506', '6211', '6403']
  };
  return productos[sector] || ['8523', '8471', '8517'];
}

function getCoordenadasPais(country) {
  const coords = {
    'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
    'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'VE': [6.4238, -66.5897],
    'UY': [-32.5228, -55.7658], 'BO': [-16.2902, -63.5887], 'EC': [-1.8312, -78.1834],
    'PY': [-23.4425, -58.4438], 'GY': [4.8604, -58.9302], 'SR': [3.9193, -56.0278],
    'DE': [51.1657, 10.4515], 'GB': [55.3781, -3.4360], 'FR': [46.6034, 1.8883],
    'CH': [46.8182, 8.2275], 'SE': [60.1282, 18.6435], 'DK': [56.2639, 9.5018],
    'NO': [60.4720, 8.4689], 'IT': [41.8719, 12.5674], 'ES': [40.4637, -3.7492],
    'NL': [52.1326, 5.2913], 'BE': [50.5039, 4.4699], 'AT': [47.5162, 14.5501],
    'IE': [53.4129, -8.2439], 'FI': [61.9241, 25.7482], 'PL': [51.9194, 19.1451],
    'CZ': [49.8175, 15.4730], 'PT': [39.3999, -8.2245], 'GR': [39.0742, 21.8243],
    'HU': [47.1625, 19.5033], 'RO': [45.9432, 24.9668], 'CN': [35.8617, 104.1954],
    'JP': [36.2048, 138.2529], 'KR': [35.9078, 127.7669], 'IN': [20.5937, 78.9629],
    'TW': [23.6978, 120.9605], 'SG': [1.3521, 103.8198], 'HK': [22.3193, 114.1694],
    'ID': [-0.7893, 113.9213], 'MY': [4.2105, 101.9758], 'TH': [15.8700, 100.9925],
    'PH': [12.8797, 121.7740], 'VN': [14.0583, 108.2772], 'ZA': [-30.5595, 22.9375],
    'NG': [9.0820, 8.6753], 'EG': [26.8206, 30.8025], 'MA': [31.7917, -7.0926],
    'KE': [-0.0236, 37.9062], 'GH': [7.9465, -1.0232], 'TN': [33.8869, 9.5375],
    'DZ': [28.0339, 1.6596], 'AO': [-11.2027, 17.8739], 'AU': [-25.2744, 133.7751],
    'NZ': [-40.9006, 174.8860], 'PG': [-6.3150, 143.9555], 'FJ': [-16.7784, 179.4144],
    'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528]
  };
  return coords[country] || [0, 0];
}

function getBusinessTypePyme(sector) {
  const types = {
    'technology': 'private_limited',
    'manufacturing': 'corporation',
    'food': 'limited_liability',
    'textiles': 'corporation',
    'services': 'private_limited'
  };
  return types[sector] || 'private_limited';
}

function getAnoEstablecimientoPyme() {
  return 1980 + Math.floor(Math.random() * 40);
}

function getCreditRatingPyme(employees) {
  if (employees >= 200) return 'BBB+';
  if (employees >= 150) return 'BBB';
  if (employees >= 100) return 'BBB-';
  return 'BB+';
}

function getCertificacionesPyme(sector) {
  const certs = {
    'food': ['HACCP', 'ISO 22000', 'BRC'],
    'textiles': ['OEKO-TEX', 'ISO 9001'],
    'technology': ['ISO 27001', 'CMMI'],
    'manufacturing': ['ISO 9001', 'ISO 14001'],
    'automotive': ['TS 16949', 'ISO 9001']
  };
  return certs[sector] || ['ISO 9001'];
}

function getTituloPyme(sector) {
  const titulos = {
    'technology': 'Technical',
    'manufacturing': 'Operations',
    'food': 'Production',
    'textiles': 'Manufacturing',
    'services': 'General'
  };
  return titulos[sector] || 'General';
}

function getTelefonoPais(country) {
  const codes = {
    'BR': '+55', 'AR': '+54', 'CL': '+56', 'CO': '+57', 'PE': '+51',
    'DE': '+49', 'GB': '+44', 'FR': '+33', 'CN': '+86', 'JP': '+81',
    'US': '+1', 'CA': '+1', 'MX': '+52', 'AU': '+61', 'ZA': '+27'
  };
  const code = codes[country] || '+1';
  return `${code} ${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
}

function getCiudadPais(country) {
  const ciudades = {
    'BR': 'São Paulo', 'AR': 'Buenos Aires', 'CL': 'Santiago', 'CO': 'Bogotá',
    'DE': 'Berlin', 'GB': 'London', 'FR': 'Paris', 'CN': 'Shanghai', 'JP': 'Tokyo',
    'US': 'New York', 'CA': 'Toronto', 'MX': 'Mexico City', 'AU': 'Sydney'
  };
  return ciudades[country] || 'Main City';
}

function getClassificacionTamano(employees) {
  if (employees <= 50) return 'small';
  if (employees <= 150) return 'medium';
  return 'medium-large';
}

function getBandera(country) {
  const flags = {
    'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪',
    'UY': '🇺🇾', 'BO': '🇧🇴', 'EC': '🇪🇨', 'PY': '🇵🇾', 'GY': '🇬🇾', 'SR': '🇸🇷',
    'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷', 'CH': '🇨🇭', 'SE': '🇸🇪', 'DK': '🇩🇰',
    'NO': '🇳🇴', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹',
    'IE': '🇮🇪', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'PT': '🇵🇹', 'GR': '🇬🇷',
    'HU': '🇭🇺', 'RO': '🇷🇴', 'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳',
    'TW': '🇹🇼', 'SG': '🇸🇬', 'HK': '🇭🇰', 'ID': '🇮🇩', 'MY': '🇲🇾', 'TH': '🇹🇭',
    'PH': '🇵🇭', 'VN': '🇻🇳', 'ZA': '🇿🇦', 'NG': '🇳🇬', 'EG': '🇪🇬', 'MA': '🇲🇦',
    'KE': '🇰🇪', 'GH': '🇬🇭', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'AO': '🇦🇴', 'AU': '🇦🇺',
    'NZ': '🇳🇿', 'PG': '🇵🇬', 'FJ': '🇫🇯', 'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽'
  };
  return flags[country] || '🏳️';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  crear100PymesSistematico();
}

export { crear100PymesSistematico };