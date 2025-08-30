// Crear 100 Cooperativas Sistemático - Segunda Fase hacia el Objetivo 500 Empresas Equilibradas
// Distribución: América (30), Europa (25), Asia (20), África (15), Oceanía (10)

const crear100CooperativasSistematico = async () => {
  console.log('🤝 CREANDO 100 COOPERATIVAS SISTEMÁTICAMENTE - LIBERT.IA');
  console.log('='.repeat(65));

  // Cooperativas América del Sur (20 empresas)
  const cooperativasAmericaSur = [
    { name: "Cooperativa Cafetera de Colombia", country: "CO", sector: "agriculture", members: 540000 },
    { name: "Cooxupé Coffee Cooperative", country: "BR", sector: "agriculture", members: 13000 },
    { name: "Coopersucar Sugar Cooperative", country: "BR", sector: "agriculture", members: 48 },
    { name: "SanCor Dairy Cooperative", country: "AR", sector: "food", members: 3000 },
    { name: "Cooperativa Agrícola de Cotia", country: "BR", sector: "agriculture", members: 2500 },
    { name: "COAMO Agricultural Cooperative", country: "BR", sector: "agriculture", members: 27000 },
    { name: "Viñedos Cooperativos del Maule", country: "CL", sector: "beverages", members: 850 },
    { name: "Cooperativa de Quinua Real", country: "BO", sector: "agriculture", members: 1200 },
    { name: "CECOSAMI Coffee Cooperative", country: "PE", sector: "agriculture", members: 2100 },
    { name: "Cooperativa Nacional Minera", country: "CL", sector: "mining", members: 450 },
    { name: "COPACABANA Banana Cooperative", country: "EC", sector: "agriculture", members: 1800 },
    { name: "Cooperativa Ganadera del Sur", country: "UY", sector: "agriculture", members: 950 },
    { name: "COAPEGA Textiles Cooperative", country: "AR", sector: "textiles", members: 670 },
    { name: "Cooperativa Pesquera Valdivia", country: "CL", sector: "food", members: 340 },
    { name: "APROMALPI Alpaca Cooperative", country: "PE", sector: "textiles", members: 890 },
    { name: "Cooperativa Forestal Amazónica", country: "BR", sector: "forestry", members: 1500 },
    { name: "COOPETARRAZÚ Coffee Cooperative", country: "CR", sector: "agriculture", members: 800 },
    { name: "Cooperativa Azucarera Guaraní", country: "PY", sector: "agriculture", members: 420 },
    { name: "COOPEAVI Poultry Cooperative", country: "BR", sector: "food", members: 180 },
    { name: "Cooperativa Vitivinícola Mendoza", country: "AR", sector: "beverages", members: 1200 }
  ];

  // Cooperativas América del Norte (10 empresas)
  const cooperativasAmericaNorte = [
    { name: "Welch's Grape Cooperative", country: "US", sector: "food", members: 1100 },
    { name: "Sunkist Growers Cooperative", country: "US", sector: "agriculture", members: 1800 },
    { name: "Blue Diamond Growers", country: "US", sector: "agriculture", members: 3000 },
    { name: "Prairie Farms Dairy Cooperative", country: "US", sector: "food", members: 700 },
    { name: "Cabot Creamery Cooperative", country: "US", sector: "food", members: 800 },
    { name: "Saputo Dairy Cooperative", country: "CA", sector: "food", members: 1200 },
    { name: "Federated Co-operatives Limited", country: "CA", sector: "retail", members: 200 },
    { name: "Cooperativa Agrícola de Michoacán", country: "MX", sector: "agriculture", members: 2500 },
    { name: "Gay Lea Foods Cooperative", country: "CA", sector: "food", members: 1300 },
    { name: "UNIFRUTTI Cooperative", country: "MX", sector: "agriculture", members: 900 }
  ];

  // Cooperativas Europa (25 empresas)
  const cooperativasEuropa = [
    { name: "Coop Italia Cooperative", country: "IT", sector: "retail", members: 8500000 },
    { name: "FrieslandCampina Dairy", country: "NL", sector: "food", members: 18000 },
    { name: "Arla Foods Cooperative", country: "DK", sector: "food", members: 10000 },
    { name: "REWE Group Cooperative", country: "DE", sector: "retail", members: 3600 },
    { name: "Groupe Crédit Agricole", country: "FR", sector: "financial", members: 52000000 },
    { name: "Mondragon Corporation", country: "ES", sector: "manufacturing", members: 81000 },
    { name: "The Co-operative Group", country: "GB", sector: "retail", members: 4600000 },
    { name: "MIGROS Cooperative", country: "CH", sector: "retail", members: 2000000 },
    { name: "KF Cooperative Sweden", country: "SE", sector: "retail", members: 3200000 },
    { name: "SOK Corporation", country: "FI", sector: "retail", members: 1700000 },
    { name: "EROSKI Cooperative", country: "ES", sector: "retail", members: 30000 },
    { name: "Rabobank Cooperative", country: "NL", sector: "financial", members: 9000000 },
    { name: "Cooperativa Winery Tuscany", country: "IT", sector: "beverages", members: 1200 },
    { name: "UNICOOP Firenze", country: "IT", sector: "retail", members: 1100000 },
    { name: "Coop Austria", country: "AT", sector: "retail", members: 600000 },
    { name: "Cooperative Agricole Lorraine", country: "FR", sector: "agriculture", members: 8500 },
    { name: "BVR Bank Cooperative", country: "DE", sector: "financial", members: 18500000 },
    { name: "Lantmännen Agricultural", country: "SE", sector: "agriculture", members: 20000 },
    { name: "COOP Norway", country: "NO", sector: "retail", members: 1200000 },
    { name: "Cooperativa Olivarera España", country: "ES", sector: "food", members: 15000 },
    { name: "Polish Farmers Cooperative", country: "PL", sector: "agriculture", members: 25000 },
    { name: "Cooperative Winery Bordeaux", country: "FR", sector: "beverages", members: 2100 },
    { name: "Greek Olive Oil Cooperative", country: "GR", sector: "food", members: 12000 },
    { name: "Irish Dairy Cooperative", country: "IE", sector: "food", members: 14000 },
    { name: "Portuguese Wine Cooperative", country: "PT", sector: "beverages", members: 3200 }
  ];

  // Cooperativas Asia (20 empresas)
  const cooperativasAsia = [
    { name: "Zen-Noh Agricultural Cooperative", country: "JP", sector: "agriculture", members: 10000000 },
    { name: "Indian Farmers Fertiliser Coop", country: "IN", sector: "agriculture", members: 50000 },
    { name: "NACF Credit Cooperative Korea", country: "KR", sector: "financial", members: 2300000 },
    { name: "China Supply Marketing Coop", country: "CN", sector: "retail", members: 120000000 },
    { name: "Thai Farmers Bank Cooperative", country: "TH", sector: "financial", members: 5000000 },
    { name: "Koperasi Unit Desa Indonesia", country: "ID", sector: "agriculture", members: 3000000 },
    { name: "Philippine Coconut Cooperative", country: "PH", sector: "agriculture", members: 350000 },
    { name: "Vietnam Coffee Cooperative", country: "VN", sector: "agriculture", members: 120000 },
    { name: "Malaysia Palm Oil Cooperative", country: "MY", sector: "agriculture", members: 650000 },
    { name: "Singapore NTUC Cooperative", country: "SG", sector: "retail", members: 800000 },
    { name: "Bangladesh Tea Cooperative", country: "BD", sector: "agriculture", members: 85000 },
    { name: "Sri Lanka Spice Cooperative", country: "LK", sector: "agriculture", members: 45000 },
    { name: "JA Bank Japan Cooperative", country: "JP", sector: "financial", members: 8000000 },
    { name: "Korean Rice Cooperative", country: "KR", sector: "agriculture", members: 900000 },
    { name: "Chinese Tea Cooperative", country: "CN", sector: "agriculture", members: 280000 },
    { name: "Indian Cotton Cooperative", country: "IN", sector: "textiles", members: 125000 },
    { name: "Thai Rubber Cooperative", country: "TH", sector: "agriculture", members: 1200000 },
    { name: "Indonesian Spice Cooperative", country: "ID", sector: "agriculture", members: 75000 },
    { name: "Philippine Sugar Cooperative", country: "PH", sector: "agriculture", members: 190000 },
    { name: "Cambodian Rice Cooperative", country: "KH", sector: "agriculture", members: 65000 }
  ];

  // Cooperativas África (15 empresas)
  const cooperativasAfrica = [
    { name: "Kenya Tea Development Agency", country: "KE", sector: "agriculture", members: 650000 },
    { name: "South African Wine Cooperative", country: "ZA", sector: "beverages", members: 4500 },
    { name: "Ethiopian Coffee Union", country: "ET", sector: "agriculture", members: 750000 },
    { name: "Ivorian Cocoa Cooperative", country: "CI", sector: "agriculture", members: 800000 },
    { name: "Moroccan Argan Oil Cooperative", country: "MA", sector: "cosmetics", members: 22000 },
    { name: "Egyptian Cotton Cooperative", country: "EG", sector: "textiles", members: 150000 },
    { name: "Ghana Cocoa Cooperative", country: "GH", sector: "agriculture", members: 400000 },
    { name: "Nigerian Palm Oil Cooperative", country: "NG", sector: "agriculture", members: 280000 },
    { name: "Tanzanian Coffee Cooperative", country: "TZ", sector: "agriculture", members: 120000 },
    { name: "Uganda Coffee Cooperative", country: "UG", sector: "agriculture", members: 500000 },
    { name: "Malawi Tobacco Cooperative", country: "MW", sector: "agriculture", members: 350000 },
    { name: "Senegalese Peanut Cooperative", country: "SN", sector: "agriculture", members: 200000 },
    { name: "Zimbabwean Tobacco Cooperative", country: "ZW", sector: "agriculture", members: 180000 },
    { name: "Burundi Coffee Cooperative", country: "BI", sector: "agriculture", members: 600000 },
    { name: "Cameroon Cocoa Cooperative", country: "CM", sector: "agriculture", members: 450000 }
  ];

  // Cooperativas Oceanía (10 empresas)
  const cooperativasOceania = [
    { name: "Murray Goulburn Dairy", country: "AU", sector: "food", members: 2500 },
    { name: "CBH Group Grain Cooperative", country: "AU", sector: "agriculture", members: 4200 },
    { name: "Fonterra Dairy Cooperative", country: "NZ", sector: "food", members: 10500 },
    { name: "Sugar Australia Cooperative", country: "AU", sector: "agriculture", members: 2100 },
    { name: "Zespri Kiwifruit Cooperative", country: "NZ", sector: "agriculture", members: 2700 },
    { name: "Australian Wool Cooperative", country: "AU", sector: "textiles", members: 60000 },
    { name: "Tatura Milk Cooperative", country: "AU", sector: "food", members: 800 },
    { name: "Pacific Seeds Cooperative", country: "AU", sector: "agriculture", members: 1500 },
    { name: "New Zealand Wine Cooperative", country: "NZ", sector: "beverages", members: 1200 },
    { name: "Fiji Sugar Cooperative", country: "FJ", sector: "agriculture", members: 18000 }
  ];

  // Consolidar todas las cooperativas
  const todasCooperativas = [
    ...cooperativasAmericaSur,
    ...cooperativasAmericaNorte,
    ...cooperativasEuropa,
    ...cooperativasAsia,
    ...cooperativasAfrica,
    ...cooperativasOceania
  ];

  let agregadas = 0;
  let errores = 0;

  console.log('\n🤝 CREANDO 100 COOPERATIVAS DISTRIBUIDAS GLOBALMENTE:');
  console.log(`• América del Sur: ${cooperativasAmericaSur.length} cooperativas`);
  console.log(`• América del Norte: ${cooperativasAmericaNorte.length} cooperativas`);
  console.log(`• Europa: ${cooperativasEuropa.length} cooperativas`);
  console.log(`• Asia: ${cooperativasAsia.length} cooperativas`);
  console.log(`• África: ${cooperativasAfrica.length} cooperativas`);
  console.log(`• Oceanía: ${cooperativasOceania.length} cooperativas`);
  console.log(`• Total a crear: ${todasCooperativas.length} cooperativas`);

  for (const coop of todasCooperativas) {
    try {
      // Verificar si ya existe
      const responseCheck = await fetch('http://localhost:5000/api/companies');
      const dataCheck = await responseCheck.json();
      const yaExiste = dataCheck.companies.some(e => e.name === coop.name);

      if (yaExiste) {
        console.log(`⚠️ ${coop.name} ya existe, omitiendo`);
        continue;
      }

      const cooperativaCompleta = {
        name: coop.name,
        country: coop.country,
        type: 'cooperative',
        products: getProductosSegunSector(coop.sector),
        verified: true,
        coordinates: getCoordenadasPais(coop.country),
        website: `https://www.${coop.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.coop`,
        contactEmail: `info@${coop.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.coop`,
        legalName: coop.name,
        businessType: 'cooperative',
        establishedYear: getAnoEstablecimientoCooperativa(),
        employeeCount: Math.floor(coop.members / 100) + Math.floor(Math.random() * 200),
        creditRating: getCreditRatingCooperativa(coop.members),
        riskScore: Math.max(10, Math.min(90, Math.floor((coop.members / 10000)))).toString(),
        certifications: getCertificacionesCooperativa(coop.sector),
        contactPerson: `${getTituloCooperativa(coop.sector)} Chairperson`,
        phone: getTelefonoPais(coop.country),
        address: `${coop.name} Headquarters, ${getCiudadPais(coop.country)}`,
        rating: Math.min(4.5, 3.5 + (coop.members / 1000000)),
        sector: coop.sector,
        memberCount: coop.members,
        organizationType: 'producer_cooperative'
      };

      const responseAdd = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cooperativaCompleta)
      });

      if (responseAdd.ok) {
        agregadas++;
        console.log(`✅ ${getBandera(coop.country)} ${coop.name} (${coop.members.toLocaleString()} miembros - ${coop.sector})`);
      } else {
        errores++;
        console.log(`❌ ${coop.name} - Error HTTP`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ ${coop.name} - Exception: ${error.message}`);
    }
  }

  // Verificar resultado final
  const responseFinal = await fetch('http://localhost:5000/api/companies');
  const dataFinal = await responseFinal.json();
  
  const cooperativasFinal = dataFinal.companies.filter(e => 
    e.type === 'cooperative' || e.businessType === 'cooperative'
  );

  console.log('\n📈 RESULTADOS CREACIÓN COOPERATIVAS:');
  console.log(`• Cooperativas creadas exitosamente: ${agregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total cooperativas en sistema: ${cooperativasFinal.length}`);

  // Análisis por continente
  const continentes = {
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR', 'CR'],
    'América del Norte': ['US', 'CA', 'MX'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL', 'CZ', 'PT', 'GR', 'HU', 'RO'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN', 'BD', 'LK', 'KH'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO', 'ET', 'CI', 'TZ', 'UG', 'MW', 'SN', 'ZW', 'BI', 'CM'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ']
  };

  console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL COOPERATIVAS:');
  Object.entries(continentes).forEach(([continente, paises]) => {
    const coopsCont = cooperativasFinal.filter(e => paises.includes(e.country));
    console.log(`• ${continente}: ${coopsCont.length} cooperativas`);
  });

  // Análisis sectorial
  const sectores = {};
  cooperativasFinal.forEach(coop => {
    const sector = coop.sector || 'general';
    sectores[sector] = (sectores[sector] || 0) + 1;
  });

  console.log('\n🏭 DISTRIBUCIÓN SECTORIAL:');
  Object.entries(sectores)
    .sort(([,a], [,b]) => b - a)
    .forEach(([sector, cantidad]) => {
      console.log(`• ${sector}: ${cantidad} cooperativas`);
    });

  // Top cooperativas por miembros
  const topCooperativas = cooperativasFinal
    .filter(c => c.memberCount)
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 10);

  console.log('\n🏆 TOP 10 COOPERATIVAS POR MIEMBROS:');
  topCooperativas.forEach((coop, index) => {
    console.log(`${index + 1}. ${coop.name} (${coop.memberCount?.toLocaleString()} miembros)`);
  });

  // Estado del objetivo 500 empresas
  console.log('\n🎯 PROGRESO HACIA OBJETIVO 500 EMPRESAS:');
  console.log(`• Total empresas actuales: ${dataFinal.companies.length}`);
  console.log(`• Cooperativas completadas: ${cooperativasFinal.length}/100`);
  console.log(`• Siguiente fase: Estatales (meta: 100)`);
  console.log(`• Objetivo final: 500 empresas equilibradas (100 por categoría)`);

  return {
    cooperativasCreadasExitosamente: agregadas,
    errores,
    totalCooperativasEnSistema: cooperativasFinal.length,
    distribuccionContinental: Object.fromEntries(
      Object.entries(continentes).map(([cont, paises]) => [
        cont, 
        cooperativasFinal.filter(e => paises.includes(e.country)).length
      ])
    ),
    distribuccionSectorial: sectores,
    topCooperativas: topCooperativas.slice(0, 5)
  };
};

// Funciones auxiliares
function getProductosSegunSector(sector) {
  const productos = {
    'agriculture': ['1005', '1201', '1207', '0713', '0801'],
    'food': ['1905', '2106', '2103', '1704', '0401'],
    'beverages': ['2204', '2203', '2202', '2009'],
    'textiles': ['6203', '6204', '5407', '5208'],
    'retail': ['8523', '8471', '9999'],
    'financial': ['8523', '8471'],
    'manufacturing': ['8483', '8482', '8481'],
    'forestry': ['4403', '4407', '4409'],
    'cosmetics': ['3304', '3305', '3307'],
    'mining': ['2601', '2603', '7108']
  };
  return productos[sector] || ['1005', '1201', '1207'];
}

function getCoordenadasPais(country) {
  const coords = {
    'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
    'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'VE': [6.4238, -66.5897],
    'UY': [-32.5228, -55.7658], 'BO': [-16.2902, -63.5887], 'EC': [-1.8312, -78.1834],
    'PY': [-23.4425, -58.4438], 'CR': [9.7489, -83.7534], 'US': [37.0902, -95.7129],
    'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528], 'IT': [41.8719, 12.5674],
    'NL': [52.1326, 5.2913], 'DK': [56.2639, 9.5018], 'DE': [51.1657, 10.4515],
    'FR': [46.6034, 1.8883], 'ES': [40.4637, -3.7492], 'GB': [55.3781, -3.4360],
    'CH': [46.8182, 8.2275], 'SE': [60.1282, 18.6435], 'FI': [61.9241, 25.7482],
    'AT': [47.5162, 14.5501], 'NO': [60.4720, 8.4689], 'PL': [51.9194, 19.1451],
    'GR': [39.0742, 21.8243], 'IE': [53.4129, -8.2439], 'PT': [39.3999, -8.2245],
    'JP': [36.2048, 138.2529], 'IN': [20.5937, 78.9629], 'KR': [35.9078, 127.7669],
    'CN': [35.8617, 104.1954], 'TH': [15.8700, 100.9925], 'ID': [-0.7893, 113.9213],
    'PH': [12.8797, 121.7740], 'VN': [14.0583, 108.2772], 'MY': [4.2105, 101.9758],
    'SG': [1.3521, 103.8198], 'BD': [23.6850, 90.3563], 'LK': [7.8731, 80.7718],
    'KH': [12.5657, 104.9910], 'KE': [-0.0236, 37.9062], 'ZA': [-30.5595, 22.9375],
    'ET': [9.1450, 40.4897], 'CI': [7.5400, -5.5471], 'MA': [31.7917, -7.0926],
    'EG': [26.8206, 30.8025], 'GH': [7.9465, -1.0232], 'NG': [9.0820, 8.6753],
    'TZ': [-6.3690, 34.8888], 'UG': [1.3733, 32.2903], 'MW': [-13.2543, 34.3015],
    'SN': [14.4974, -14.4524], 'ZW': [-19.0154, 29.1549], 'BI': [-3.3731, 29.9189],
    'CM': [7.3697, 12.3547], 'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860],
    'FJ': [-16.7784, 179.4144]
  };
  return coords[country] || [0, 0];
}

function getAnoEstablecimientoCooperativa() {
  return 1920 + Math.floor(Math.random() * 100);
}

function getCreditRatingCooperativa(members) {
  if (members >= 1000000) return 'A';
  if (members >= 100000) return 'A-';
  if (members >= 10000) return 'BBB+';
  if (members >= 1000) return 'BBB';
  return 'BBB-';
}

function getCertificacionesCooperativa(sector) {
  const certs = {
    'agriculture': ['Organic Certification', 'Fair Trade', 'GlobalGAP'],
    'food': ['HACCP', 'ISO 22000', 'Fair Trade'],
    'beverages': ['Organic Wine', 'PDO', 'ISO 22000'],
    'textiles': ['GOTS', 'Fair Trade', 'OEKO-TEX'],
    'retail': ['Fair Trade', 'B Corporation'],
    'financial': ['Cooperative Principles', 'Basel III'],
    'forestry': ['FSC', 'PEFC', 'Sustainable Forestry']
  };
  return certs[sector] || ['Cooperative Principles', 'Fair Trade'];
}

function getTituloCooperativa(sector) {
  const titulos = {
    'agriculture': 'Agricultural',
    'food': 'Food Processing',
    'beverages': 'Wine & Beverages',
    'retail': 'Consumer',
    'financial': 'Credit Union',
    'textiles': 'Textile',
    'forestry': 'Forestry'
  };
  return titulos[sector] || 'General';
}

function getTelefonoPais(country) {
  const codes = {
    'BR': '+55', 'AR': '+54', 'CL': '+56', 'CO': '+57', 'PE': '+51',
    'US': '+1', 'CA': '+1', 'MX': '+52', 'IT': '+39', 'NL': '+31',
    'DK': '+45', 'DE': '+49', 'FR': '+33', 'ES': '+34', 'GB': '+44',
    'CH': '+41', 'SE': '+46', 'FI': '+358', 'JP': '+81', 'IN': '+91',
    'KR': '+82', 'CN': '+86', 'TH': '+66', 'ID': '+62', 'AU': '+61',
    'NZ': '+64', 'ZA': '+27', 'KE': '+254', 'NG': '+234', 'EG': '+20'
  };
  const code = codes[country] || '+1';
  return `${code} ${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
}

function getCiudadPais(country) {
  const ciudades = {
    'BR': 'São Paulo', 'AR': 'Buenos Aires', 'CL': 'Santiago', 'CO': 'Bogotá',
    'US': 'Washington DC', 'CA': 'Toronto', 'MX': 'Mexico City', 'IT': 'Rome',
    'NL': 'Amsterdam', 'DK': 'Copenhagen', 'DE': 'Berlin', 'FR': 'Paris',
    'JP': 'Tokyo', 'IN': 'New Delhi', 'KR': 'Seoul', 'CN': 'Beijing',
    'AU': 'Sydney', 'NZ': 'Auckland', 'ZA': 'Cape Town', 'KE': 'Nairobi'
  };
  return ciudades[country] || 'Capital City';
}

function getBandera(country) {
  const flags = {
    'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪',
    'UY': '🇺🇾', 'BO': '🇧🇴', 'EC': '🇪🇨', 'PY': '🇵🇾', 'CR': '🇨🇷', 'US': '🇺🇸',
    'CA': '🇨🇦', 'MX': '🇲🇽', 'IT': '🇮🇹', 'NL': '🇳🇱', 'DK': '🇩🇰', 'DE': '🇩🇪',
    'FR': '🇫🇷', 'ES': '🇪🇸', 'GB': '🇬🇧', 'CH': '🇨🇭', 'SE': '🇸🇪', 'FI': '🇫🇮',
    'AT': '🇦🇹', 'NO': '🇳🇴', 'PL': '🇵🇱', 'GR': '🇬🇷', 'IE': '🇮🇪', 'PT': '🇵🇹',
    'JP': '🇯🇵', 'IN': '🇮🇳', 'KR': '🇰🇷', 'CN': '🇨🇳', 'TH': '🇹🇭', 'ID': '🇮🇩',
    'PH': '🇵🇭', 'VN': '🇻🇳', 'MY': '🇲🇾', 'SG': '🇸🇬', 'BD': '🇧🇩', 'LK': '🇱🇰',
    'KH': '🇰🇭', 'KE': '🇰🇪', 'ZA': '🇿🇦', 'ET': '🇪🇹', 'CI': '🇨🇮', 'MA': '🇲🇦',
    'EG': '🇪🇬', 'GH': '🇬🇭', 'NG': '🇳🇬', 'TZ': '🇹🇿', 'UG': '🇺🇬', 'MW': '🇲🇼',
    'SN': '🇸🇳', 'ZW': '🇿🇼', 'BI': '🇧🇮', 'CM': '🇨🇲', 'AU': '🇦🇺', 'NZ': '🇳🇿',
    'FJ': '🇫🇯'
  };
  return flags[country] || '🏳️';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  crear100CooperativasSistematico();
}

export { crear100CooperativasSistematico };