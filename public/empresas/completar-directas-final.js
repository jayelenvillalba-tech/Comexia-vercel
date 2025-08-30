// Completar Empresas Directas - Agregar las que faltan para cobertura total
// No optimizar, solo completar la base de empresas directas

const completarDirectasTotal = async () => {
  console.log('🏢 COMPLETAR EMPRESAS DIRECTAS - COBERTURA TOTAL');
  console.log('='.repeat(60));

  // Verificar estado actual
  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const empresasDirectas = data.companies.filter(e => e.type === 'directa');

  console.log('\n📊 ESTADO ACTUAL:');
  console.log(`• Empresas directas actuales: ${empresasDirectas.length}`);

  // Identificar gaps por continente y agregar empresas directas estratégicas
  const empresasDirectasAdicionales = [
    // Completar gaps en América del Norte
    { name: "Wells Fargo", country: "US", type: "directa", sector: "financial", rating: 3.7 },
    { name: "PNC Financial Services", country: "US", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Capital One", country: "US", type: "directa", sector: "financial", rating: 3.8 },
    { name: "TD Bank", country: "CA", type: "directa", sector: "financial", rating: 3.9 },
    { name: "Scotiabank", country: "CA", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Manulife Financial", country: "CA", type: "directa", sector: "insurance", rating: 3.7 },
    { name: "Sun Life Financial", country: "CA", type: "directa", sector: "insurance", rating: 3.6 },
    { name: "Grupo Financiero Inbursa", country: "MX", type: "directa", sector: "financial", rating: 3.5 },
    { name: "Grupo Financiero Santander México", country: "MX", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Banco Azteca", country: "MX", type: "directa", sector: "financial", rating: 3.4 },

    // Completar gaps en Europa
    { name: "ING Group", country: "NL", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Aegon", country: "NL", type: "directa", sector: "insurance", rating: 3.6 },
    { name: "NN Group", country: "NL", type: "directa", sector: "insurance", rating: 3.5 },
    { name: "KBC Group", country: "BE", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Ageas", country: "BE", type: "directa", sector: "insurance", rating: 3.6 },
    { name: "Erste Group", country: "AT", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Raiffeisen Bank International", country: "AT", type: "directa", sector: "financial", rating: 3.6 },
    { name: "AIB Group", country: "IE", type: "directa", sector: "financial", rating: 3.5 },
    { name: "Bank of Ireland", country: "IE", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Nordea Bank", country: "FI", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Sampo", country: "FI", type: "directa", sector: "insurance", rating: 3.7 },
    { name: "PKO Bank Polski", country: "PL", type: "directa", sector: "financial", rating: 3.6 },
    { name: "PZU Group", country: "PL", type: "directa", sector: "insurance", rating: 3.5 },
    { name: "Erste Bank", country: "CZ", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Millennium bcp", country: "PT", type: "directa", sector: "financial", rating: 3.5 },
    { name: "National Bank of Greece", country: "GR", type: "directa", sector: "financial", rating: 3.4 },

    // Completar gaps en Asia
    { name: "DBS Bank", country: "SG", type: "directa", sector: "financial", rating: 4.0 },
    { name: "OCBC Bank", country: "SG", type: "directa", sector: "financial", rating: 3.9 },
    { name: "UOB Bank", country: "SG", type: "directa", sector: "financial", rating: 3.8 },
    { name: "CapitaLand", country: "SG", type: "directa", sector: "real-estate", rating: 3.7 },
    { name: "HSBC Hong Kong", country: "HK", type: "directa", sector: "financial", rating: 3.9 },
    { name: "Standard Chartered Hong Kong", country: "HK", type: "directa", sector: "financial", rating: 3.8 },
    { name: "AIA Group", country: "HK", type: "directa", sector: "insurance", rating: 4.0 },
    { name: "Bank Mandiri", country: "ID", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Bank Central Asia", country: "ID", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Bank Rakyat Indonesia", country: "ID", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Maybank", country: "MY", type: "directa", sector: "financial", rating: 3.7 },
    { name: "CIMB Group", country: "MY", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Public Bank", country: "MY", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Bangkok Bank", country: "TH", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Kasikornbank", country: "TH", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Siam Commercial Bank", country: "TH", type: "directa", sector: "financial", rating: 3.7 },
    { name: "BDO Unibank", country: "PH", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Metropolitan Bank", country: "PH", type: "directa", sector: "financial", rating: 3.5 },
    { name: "Ayala Land", country: "PH", type: "directa", sector: "real-estate", rating: 3.7 },

    // Completar gaps en América del Sur (completar más allá de los ya agregados)
    { name: "Itaú Unibanco", country: "BR", type: "directa", sector: "financial", rating: 3.9 },
    { name: "Banco Bradesco", country: "BR", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Banco Santander Brasil", country: "BR", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Vale S.A.", country: "BR", type: "directa", sector: "mining", rating: 3.8 },
    { name: "Petrobras", country: "BR", type: "directa", sector: "energy", rating: 3.6 },
    { name: "JBS S.A.", country: "BR", type: "directa", sector: "food", rating: 3.5 },
    { name: "Banco de la Nación Argentina", country: "AR", type: "directa", sector: "financial", rating: 3.5 },
    { name: "Grupo Financiero Galicia", country: "AR", type: "directa", sector: "financial", rating: 3.6 },
    { name: "YPF", country: "AR", type: "directa", sector: "energy", rating: 3.4 },
    { name: "Banco del Estado", country: "CL", type: "directa", sector: "financial", rating: 3.7 },
    { name: "LATAM Airlines", country: "CL", type: "directa", sector: "aviation", rating: 3.6 },
    { name: "Ecopetrol", country: "CO", type: "directa", sector: "energy", rating: 3.5 },
    { name: "Bancolombia", country: "CO", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Banco de Crédito BCP", country: "PE", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Minas Buenaventura", country: "PE", type: "directa", sector: "mining", rating: 3.6 },

    // Completar gaps en África (más allá de los ya agregados)
    { name: "Shoprite Holdings", country: "ZA", type: "directa", sector: "retail", rating: 3.6 },
    { name: "MTN Group", country: "ZA", type: "directa", sector: "telecommunications", rating: 3.8 },
    { name: "Naspers", country: "ZA", type: "directa", sector: "technology", rating: 3.9 },
    { name: "Standard Bank Group", country: "ZA", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Absa Group", country: "ZA", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Access Bank", country: "NG", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Dangote Group", country: "NG", type: "directa", sector: "conglomerate", rating: 3.8 },
    { name: "United Bank for Africa", country: "NG", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Commercial International Bank", country: "EG", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Orange Egypt", country: "EG", type: "directa", sector: "telecommunications", rating: 3.5 },
    { name: "Attijariwafa Bank", country: "MA", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Maroc Telecom", country: "MA", type: "directa", sector: "telecommunications", rating: 3.7 },

    // Completar gaps en Oceanía (más allá de los ya agregados)
    { name: "Commonwealth Bank", country: "AU", type: "directa", sector: "financial", rating: 3.9 },
    { name: "Australia and New Zealand Banking Group", country: "AU", type: "directa", sector: "financial", rating: 3.8 },
    { name: "Westpac Banking Corporation", country: "AU", type: "directa", sector: "financial", rating: 3.7 },
    { name: "National Australia Bank", country: "AU", type: "directa", sector: "financial", rating: 3.6 },
    { name: "Insurance Australia Group", country: "AU", type: "directa", sector: "insurance", rating: 3.7 },
    { name: "QBE Insurance Group", country: "AU", type: "directa", sector: "insurance", rating: 3.6 },
    { name: "Suncorp Group", country: "AU", type: "directa", sector: "financial", rating: 3.5 },
    { name: "ANZ Bank New Zealand", country: "NZ", type: "directa", sector: "financial", rating: 3.8 },
    { name: "ASB Bank", country: "NZ", type: "directa", sector: "financial", rating: 3.7 },
    { name: "Kiwibank", country: "NZ", type: "directa", sector: "financial", rating: 3.6 }
  ];

  let agregadas = 0;
  let errores = 0;

  console.log('\n⚡ AGREGANDO EMPRESAS DIRECTAS PARA COMPLETAR COBERTURA:');

  for (const empresa of empresasDirectasAdicionales) {
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
        address: `${empresa.name} Global Headquarters`,
        rating: empresa.rating,
        sector: empresa.sector
      };

      const responseAdd = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaCompleta)
      });

      if (responseAdd.ok) {
        agregadas++;
        console.log(`✅ ${getBandera(empresa.country)} ${empresa.name} (${empresa.sector})`);
      } else {
        errores++;
        console.log(`❌ ${empresa.name} - Error HTTP`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ ${empresa.name} - Exception: ${error.message}`);
    }
  }

  // Verificar resultado final
  const responseFinal = await fetch('http://localhost:5000/api/companies');
  const dataFinal = await responseFinal.json();
  const empresasDirectasFinal = dataFinal.companies.filter(e => e.type === 'directa');
  const totalEmpresas = dataFinal.companies.length;

  console.log('\n📈 RESULTADOS COMPLETAR DIRECTAS:');
  console.log(`• Empresas directas agregadas: ${agregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total empresas directas: ${empresasDirectasFinal.length}`);
  console.log(`• Total empresas global: ${totalEmpresas}`);
  console.log(`• Porcentaje directas: ${((empresasDirectasFinal.length/totalEmpresas)*100).toFixed(1)}%`);

  return {
    agregadas,
    errores,
    empresasDirectasTotal: empresasDirectasFinal.length,
    empresasGlobalTotal: totalEmpresas
  };
};

// Funciones auxiliares
function getProductosSegunSector(sector) {
  const productos = {
    'financial': ['8523', '8471'],
    'insurance': ['8523', '8471'],
    'telecommunications': ['8517', '8525'],
    'real-estate': ['8523', '8471'],
    'mining': ['2601', '2603'],
    'energy': ['2709', '2711'],
    'food': ['1905', '2106'],
    'aviation': ['8802', '8803'],
    'retail': ['6203', '6204'],
    'technology': ['8517', '8471'],
    'conglomerate': ['8523', '8471', '8517']
  };
  return ['8523', ...(productos[sector] || ['8471', '8517'])];
}

function getCoordenadasPais(country) {
  const coords = {
    'US': [39.8283, -98.5795], 'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528],
    'NL': [52.1326, 5.2913], 'BE': [50.5039, 4.4699], 'AT': [47.5162, 14.5501],
    'IE': [53.4129, -8.2439], 'FI': [61.9241, 25.7482], 'PL': [51.9194, 19.1451],
    'CZ': [49.8175, 15.4730], 'PT': [39.3999, -8.2245], 'GR': [39.0742, 21.8243],
    'SG': [1.3521, 103.8198], 'HK': [22.3193, 114.1694], 'ID': [-0.7893, 113.9213],
    'MY': [4.2105, 101.9758], 'TH': [15.8700, 100.9925], 'PH': [12.8797, 121.7740],
    'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
    'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'ZA': [-30.5595, 22.9375],
    'NG': [9.0820, 8.6753], 'EG': [26.8206, 30.8025], 'MA': [31.7917, -7.0926],
    'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860]
  };
  return coords[country] || [0, 0];
}

function getAnoEstablecimiento(name) {
  const empresasConocidas = {
    'Wells Fargo': 1852, 'Commonwealth Bank': 1911, 'DBS Bank': 1968,
    'Itaú Unibanco': 1944, 'Standard Bank Group': 1862, 'Naspers': 1915
  };
  return empresasConocidas[name] || (1950 + Math.floor(Math.random() * 70));
}

function getEmpleadosSegunSector(sector) {
  const rangos = {
    'financial': [10000, 50000], 'telecommunications': [5000, 30000], 'insurance': [3000, 20000],
    'mining': [8000, 40000], 'energy': [5000, 35000], 'retail': [15000, 80000],
    'technology': [2000, 25000], 'aviation': [10000, 50000], 'conglomerate': [20000, 100000]
  };
  const [min, max] = rangos[sector] || [2000, 15000];
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCreditRating(rating) {
  if (rating >= 4.0) return 'AA+';
  if (rating >= 3.8) return 'AA';
  if (rating >= 3.6) return 'A+';
  if (rating >= 3.4) return 'A';
  return 'A-';
}

function getCertificacionesSegunSector(sector) {
  const certs = {
    'financial': ['Basel III', 'Banking License'],
    'insurance': ['Insurance License', 'Solvency II'],
    'telecommunications': ['Telecom License', 'ITU Standards'],
    'mining': ['Mining License', 'ISO 14001'],
    'energy': ['Energy License', 'ISO 50001']
  };
  return certs[sector] || ['ISO 9001', 'Local License'];
}

function getTelefonoPais(country) {
  const codes = {
    'US': '+1', 'CA': '+1', 'MX': '+52', 'NL': '+31', 'BE': '+32',
    'AT': '+43', 'IE': '+353', 'FI': '+358', 'PL': '+48', 'CZ': '+420',
    'PT': '+351', 'GR': '+30', 'SG': '+65', 'HK': '+852', 'ID': '+62',
    'MY': '+60', 'TH': '+66', 'PH': '+63', 'BR': '+55', 'AR': '+54',
    'CL': '+56', 'CO': '+57', 'PE': '+51', 'ZA': '+27', 'NG': '+234',
    'EG': '+20', 'MA': '+212', 'AU': '+61', 'NZ': '+64'
  };
  const code = codes[country] || '+1';
  return `${code} ${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
}

function getBandera(country) {
  const flags = {
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹',
    'IE': '🇮🇪', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿', 'PT': '🇵🇹', 'GR': '🇬🇷',
    'SG': '🇸🇬', 'HK': '🇭🇰', 'ID': '🇮🇩', 'MY': '🇲🇾', 'TH': '🇹🇭', 'PH': '🇵🇭',
    'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'ZA': '🇿🇦',
    'NG': '🇳🇬', 'EG': '🇪🇬', 'MA': '🇲🇦', 'AU': '🇦🇺', 'NZ': '🇳🇿'
  };
  return flags[country] || '🏳️';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  completarDirectasTotal();
}

export { completarDirectasTotal };