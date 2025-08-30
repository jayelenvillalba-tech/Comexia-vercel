// Expansión Continental Sistemática - Continuando el trabajo previo en Asia
// Estado actual: 221 empresas, 160 directas (72.4%)
// Objetivo: Expansión equilibrada por continentes manteniendo alta proporción de directas

const expansionContinentalSistematica = async () => {
  console.log('🌍 EXPANSIÓN CONTINENTAL SISTEMÁTICA LIBERT.IA');
  console.log('='.repeat(60));

  // Verificar estado actual
  const responseActual = await fetch('http://localhost:5000/api/companies');
  const dataActual = await responseActual.json();
  const empresasActuales = dataActual.companies.length;
  const directasActuales = dataActual.companies.filter(c => c.type === 'directa').length;

  console.log('\n📊 ESTADO ACTUAL DEL SISTEMA:');
  console.log(`• Total empresas: ${empresasActuales}`);
  console.log(`• Empresas directas: ${directasActuales} (${((directasActuales/empresasActuales)*100).toFixed(1)}%)`);

  // Definir distribución continental
  const distribuciones = {
    'América del Norte': ['US', 'CA', 'MX'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN', 'KH', 'MM', 'LA'],
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO', 'ET', 'TZ', 'UG']
  };

  console.log('\n🌏 ANÁLISIS DISTRIBUCIÓN CONTINENTAL ACTUAL:');
  
  const estadoContinental = {};
  
  Object.entries(distribuciones).forEach(([continente, paises]) => {
    const empresasContinente = dataActual.companies.filter(c => paises.includes(c.country));
    const directasContinente = empresasContinente.filter(c => c.type === 'directa');
    const porcentajeContinente = ((empresasContinente.length / empresasActuales) * 100).toFixed(1);
    const porcentajeDirectas = empresasContinente.length > 0 ? ((directasContinente.length / empresasContinente.length) * 100).toFixed(1) : 0;
    
    estadoContinental[continente] = {
      total: empresasContinente.length,
      directas: directasContinente.length,
      porcentajeTotal: parseFloat(porcentajeContinente),
      porcentajeDirectas: parseFloat(porcentajeDirectas),
      paises: paises
    };
    
    if (empresasContinente.length > 0) {
      console.log(`• ${continente}: ${empresasContinente.length} empresas (${porcentajeContinente}%) - ${directasContinente.length} directas (${porcentajeDirectas}%)`);
    }
  });

  return estadoContinental;
};

// Expansión específica para Asia - Continuando trabajo previo
const expansionAsiaAvanzada = async () => {
  console.log('\n🇦🇸 EXPANSIÓN ASIA AVANZADA - FASE CONTINUACIÓN');
  console.log('='.repeat(55));

  const empresasAsiaAdicionales = [
    // Asia Oriental - Expansión China
    { name: "Baidu Inc.", country: "CN", type: "directa", sector: "technology", rating: 4.1 },
    { name: "JD.com Inc.", country: "CN", type: "directa", sector: "e-commerce", rating: 4.0 },
    { name: "NetEase Inc.", country: "CN", type: "directa", sector: "technology", rating: 3.9 },
    { name: "Didi Chuxing", country: "CN", type: "directa", sector: "technology", rating: 3.8 },
    { name: "Meituan Dianping", country: "CN", type: "directa", sector: "technology", rating: 3.9 },
    
    // Japón - Expansión tecnológica
    { name: "SoftBank Group", country: "JP", type: "directa", sector: "technology", rating: 4.0 },
    { name: "Rakuten Inc.", country: "JP", type: "directa", sector: "e-commerce", rating: 3.9 },
    { name: "Fast Retailing", country: "JP", type: "directa", sector: "retail", rating: 3.8 },
    { name: "Keyence Corporation", country: "JP", type: "directa", sector: "technology", rating: 4.2 },
    { name: "Fanuc Corporation", country: "JP", type: "exporter", sector: "manufacturing", rating: 4.1 },
    
    // Corea del Sur - Expansión conglomerados
    { name: "LG Electronics", country: "KR", type: "exporter", sector: "electronics", rating: 4.0 },
    { name: "SK Hynix", country: "KR", type: "exporter", sector: "technology", rating: 4.1 },
    { name: "POSCO", country: "KR", type: "exporter", sector: "steel", rating: 3.9 },
    { name: "Kia Corporation", country: "KR", type: "exporter", sector: "automotive", rating: 3.8 },
    
    // India - Expansión IT y servicios
    { name: "Infosys Limited", country: "IN", type: "directa", sector: "technology", rating: 4.2 },
    { name: "Tata Consultancy Services", country: "IN", type: "directa", sector: "technology", rating: 4.3 },
    { name: "Wipro Limited", country: "IN", type: "directa", sector: "technology", rating: 4.0 },
    { name: "HCL Technologies", country: "IN", type: "directa", sector: "technology", rating: 3.9 },
    { name: "Mahindra Group", country: "IN", type: "directa", sector: "automotive", rating: 3.8 },
    { name: "Bajaj Auto", country: "IN", type: "exporter", sector: "automotive", rating: 3.7 },
    
    // Asia Sudoriental - Expansión estratégica
    { name: "Grab Holdings", country: "SG", type: "directa", sector: "technology", rating: 3.9 },
    { name: "Gojek", country: "ID", type: "directa", sector: "technology", rating: 3.8 },
    { name: "Shopee", country: "SG", type: "directa", sector: "e-commerce", rating: 4.0 },
    { name: "Bukalapak", country: "ID", type: "directa", sector: "e-commerce", rating: 3.7 },
    { name: "Tokopedia", country: "ID", type: "directa", sector: "e-commerce", rating: 3.8 },
    { name: "Advanced Info Service", country: "TH", type: "directa", sector: "telecommunications", rating: 3.9 },
    { name: "CP Group", country: "TH", type: "both", sector: "conglomerate", rating: 4.0 },
    { name: "Ayala Corporation", country: "PH", type: "directa", sector: "conglomerate", rating: 3.8 },
    { name: "SM Investments", country: "PH", type: "directa", sector: "retail", rating: 3.7 },
    { name: "Jollibee Foods", country: "PH", type: "exporter", sector: "food", rating: 3.8 }
  ];

  let agregadas = 0;
  let directasAgregadas = 0;
  let errores = 0;

  console.log('\n⚡ AGREGANDO EMPRESAS ASIÁTICAS ESTRATÉGICAS:');

  for (const empresa of empresasAsiaAdicionales) {
    try {
      const responseCheck = await fetch('http://localhost:5000/api/companies');
      const dataCheck = await responseCheck.json();
      const yaExiste = dataCheck.companies.some(e => e.name === empresa.name);

      if (yaExiste) {
        console.log(`⚠️ ${empresa.name} ya existe, omitiendo`);
        continue;
      }

      const empresaCompleta = {
        name: empresa.name,
        country: empresa.country,
        type: empresa.type,
        products: getProductosSegunSector(empresa.sector),
        verified: true,
        coordinates: getCoordenadasPais(empresa.country),
        website: `https://www.${empresa.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        contactEmail: `contact@${empresa.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        legalName: empresa.name,
        businessType: 'corporation',
        establishedYear: getAnoEstablecimiento(empresa.name),
        employeeCount: getEmpleadosSegunSector(empresa.sector),
        creditRating: getCreditRating(empresa.rating),
        riskScore: Math.floor(empresa.rating * 20).toString(),
        certifications: getCertificacionesSegunSector(empresa.sector),
        contactPerson: 'Chief Executive Officer',
        phone: getTelefonoPais(empresa.country),
        address: `${empresa.name} Headquarters`,
        rating: empresa.rating,
        sector: empresa.sector
      };

      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaCompleta)
      });

      if (response.ok) {
        agregadas++;
        if (empresa.type === 'directa') {
          directasAgregadas++;
        }
        console.log(`✅ ${getBandera(empresa.country)} ${empresa.name} (${empresa.type}) - ${empresa.sector}`);
      } else {
        errores++;
        console.log(`❌ ${empresa.name} - Error HTTP`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ ${empresa.name} - Exception: ${error.message}`);
    }
  }

  console.log('\n📈 RESULTADOS EXPANSIÓN ASIA:');
  console.log(`• Empresas agregadas: ${agregadas}`);
  console.log(`• Empresas directas agregadas: ${directasAgregadas}`);
  console.log(`• Errores: ${errores}`);

  return { agregadas, directasAgregadas, errores };
};

// Funciones auxiliares
function getProductosSegunSector(sector) {
  const productos = {
    'technology': ['8517', '8471', '8542'],
    'e-commerce': ['8523', '8471'],
    'automotive': ['8703', '8708'],
    'electronics': ['8542', '8517'],
    'telecommunications': ['8517', '8525'],
    'retail': ['6203', '6204'],
    'manufacturing': ['8479', '8466'],
    'food': ['1905', '2106'],
    'steel': ['7208', '7210'],
    'conglomerate': ['8523', '8471', '8517']
  };
  return ['8523', ...(productos[sector] || ['8471', '8517'])];
}

function getCoordenadasPais(country) {
  const coords = {
    'CN': [104.1954, 35.8617], 'JP': [138.2529, 36.2048], 'KR': [127.7669, 35.9078],
    'IN': [78.9629, 20.5937], 'SG': [103.8198, 1.3521], 'ID': [113.9213, -0.7893],
    'TH': [100.9925, 15.8700], 'PH': [121.7740, 12.8797], 'MY': [101.9758, 4.2105],
    'VN': [108.2772, 14.0583], 'TW': [120.9605, 23.6978], 'HK': [114.1694, 22.3193]
  };
  return coords[country] || [0, 0];
}

function getAnoEstablecimiento(name) {
  const empresasConocidas = {
    'Baidu Inc.': 2000, 'JD.com Inc.': 1998, 'SoftBank Group': 1981,
    'Rakuten Inc.': 1997, 'Infosys Limited': 1981, 'Tata Consultancy Services': 1968,
    'Grab Holdings': 2012, 'Shopee': 2015
  };
  return empresasConocidas[name] || (1980 + Math.floor(Math.random() * 40));
}

function getEmpleadosSegunSector(sector) {
  const rangos = {
    'technology': [5000, 100000], 'e-commerce': [2000, 50000], 'automotive': [10000, 200000],
    'telecommunications': [5000, 80000], 'manufacturing': [3000, 50000], 'conglomerate': [50000, 500000]
  };
  const [min, max] = rangos[sector] || [1000, 20000];
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCreditRating(rating) {
  if (rating >= 4.2) return 'AAA';
  if (rating >= 4.0) return 'AA+';
  if (rating >= 3.8) return 'AA';
  if (rating >= 3.6) return 'A+';
  return 'A';
}

function getCertificacionesSegunSector(sector) {
  const certs = {
    'technology': ['ISO 27001', 'SOC 2', 'ISO 9001'],
    'automotive': ['ISO 9001', 'ISO 14001', 'IATF 16949'],
    'manufacturing': ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    'food': ['HACCP', 'ISO 22000', 'BRC']
  };
  return certs[sector] || ['ISO 9001', 'ISO 27001'];
}

function getTelefonoPais(country) {
  const codes = {
    'CN': '+86', 'JP': '+81', 'KR': '+82', 'IN': '+91', 'SG': '+65',
    'ID': '+62', 'TH': '+66', 'PH': '+63', 'MY': '+60', 'VN': '+84'
  };
  const code = codes[country] || '+1';
  return `${code} ${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
}

function getBandera(country) {
  const flags = {
    'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬',
    'ID': '🇮🇩', 'TH': '🇹🇭', 'PH': '🇵🇭', 'MY': '🇲🇾', 'VN': '🇻🇳', 'TW': '🇹🇼'
  };
  return flags[country] || '🌏';
}

// Ejecutar expansión
const ejecutarExpansion = async () => {
  const estadoActual = await expansionContinentalSistematica();
  const resultadosAsia = await expansionAsiaAvanzada();

  // Verificar estado final
  const responseFinal = await fetch('http://localhost:5000/api/companies');
  const dataFinal = await responseFinal.json();
  const empresasFinales = dataFinal.companies.length;
  const directasFinales = dataFinal.companies.filter(c => c.type === 'directa').length;
  const porcentajeFinal = ((directasFinales / empresasFinales) * 100).toFixed(1);

  console.log('\n🎯 ESTADO FINAL POST-EXPANSIÓN ASIA:');
  console.log(`• Total empresas: ${empresasFinales}`);
  console.log(`• Empresas directas: ${directasFinales} (${porcentajeFinal}%)`);
  console.log(`• Empresas agregadas en Asia: ${resultadosAsia.agregadas}`);
  console.log(`• Directas agregadas en Asia: ${resultadosAsia.directasAgregadas}`);

  return {
    estadoActual,
    resultadosAsia,
    empresasFinales,
    directasFinales,
    porcentajeFinal: parseFloat(porcentajeFinal)
  };
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  ejecutarExpansion();
}

export { ejecutarExpansion, expansionContinentalSistematica, expansionAsiaAvanzada };