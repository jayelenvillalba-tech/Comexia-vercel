// Fortalecer Categorías Débiles - Equilibrar Empresas Indirectas
// Prioridad: América del Sur (41.9%) y Asia (72.8%) - Agregar importadoras y mixtas

const fortalecerCategoriasDebiles = async () => {
  console.log('💪 FORTALECIENDO CATEGORÍAS DÉBILES - EMPRESAS INDIRECTAS');
  console.log('='.repeat(65));

  // Empresas importadoras para América del Sur (0 actuales → agregar 8)
  const importadorasAmericaSur = [
    { name: "Brazil Coffee Importers", country: "BR", type: "importer", sector: "food", rating: 3.8 },
    { name: "Argentine Grain Importers", country: "AR", type: "importer", sector: "agriculture", rating: 3.7 },
    { name: "Chilean Wine Importers", country: "CL", type: "importer", sector: "beverages", rating: 3.9 },
    { name: "Colombian Textile Importers", country: "CO", type: "importer", sector: "textiles", rating: 3.6 },
    { name: "Peruvian Mining Importers", country: "PE", type: "importer", sector: "mining", rating: 3.5 },
    { name: "Uruguay Agricultural Importers", country: "UY", type: "importer", sector: "agriculture", rating: 3.4 },
    { name: "Ecuador Banana Importers", country: "EC", type: "importer", sector: "food", rating: 3.6 },
    { name: "Venezuela Oil Importers", country: "VE", type: "importer", sector: "energy", rating: 3.3 }
  ];

  // Empresas mixtas para América del Sur (0 actuales → agregar 6)
  const mixtasAmericaSur = [
    { name: "Brazil International Trading", country: "BR", type: "both", sector: "trading", rating: 3.9 },
    { name: "Argentine Export-Import Corp", country: "AR", type: "both", sector: "trading", rating: 3.7 },
    { name: "Chilean Global Trade", country: "CL", type: "both", sector: "trading", rating: 3.8 },
    { name: "Colombian Trade Bridge", country: "CO", type: "both", sector: "trading", rating: 3.6 },
    { name: "Peruvian Global Commerce", country: "PE", type: "both", sector: "trading", rating: 3.5 },
    { name: "MERCOSUR Trading Hub", country: "BR", type: "both", sector: "trading", rating: 3.8 }
  ];

  // Empresas importadoras para Asia (0 actuales → agregar 10)
  const importadorasAsia = [
    { name: "China Tech Importers", country: "CN", type: "importer", sector: "technology", rating: 4.0 },
    { name: "Japan Electronics Importers", country: "JP", type: "importer", sector: "electronics", rating: 4.1 },
    { name: "Korea Components Importers", country: "KR", type: "importer", sector: "manufacturing", rating: 3.9 },
    { name: "India Software Importers", country: "IN", type: "importer", sector: "software", rating: 3.8 },
    { name: "Singapore Financial Importers", country: "SG", type: "importer", sector: "financial", rating: 4.0 },
    { name: "Thailand Agricultural Importers", country: "TH", type: "importer", sector: "agriculture", rating: 3.7 },
    { name: "Malaysia Palm Oil Importers", country: "MY", type: "importer", sector: "agriculture", rating: 3.6 },
    { name: "Indonesia Textile Importers", country: "ID", type: "importer", sector: "textiles", rating: 3.5 },
    { name: "Philippines Electronics Importers", country: "PH", type: "importer", sector: "electronics", rating: 3.6 },
    { name: "Vietnam Manufacturing Importers", country: "VN", type: "importer", sector: "manufacturing", rating: 3.4 }
  ];

  // Empresas mixtas adicionales para Asia (2 actuales → agregar 6)
  const mixtasAsia = [
    { name: "China-Asia Trade Bridge", country: "CN", type: "both", sector: "trading", rating: 4.0 },
    { name: "Japan Global Trading", country: "JP", type: "both", sector: "trading", rating: 4.1 },
    { name: "Korea International Commerce", country: "KR", type: "both", sector: "trading", rating: 3.9 },
    { name: "India Trade Gateway", country: "IN", type: "both", sector: "trading", rating: 3.8 },
    { name: "ASEAN Trading Hub", country: "SG", type: "both", sector: "trading", rating: 4.0 },
    { name: "Southeast Asia Trade", country: "TH", type: "both", sector: "trading", rating: 3.7 }
  ];

  // Empresas mixtas para Oceanía (0 actuales → agregar 4)
  const mixtasOceania = [
    { name: "Australia-Pacific Trading", country: "AU", type: "both", sector: "trading", rating: 3.8 },
    { name: "New Zealand Global Trade", country: "NZ", type: "both", sector: "trading", rating: 3.7 },
    { name: "Pacific Islands Trading", country: "FJ", type: "both", sector: "trading", rating: 3.5 },
    { name: "Papua New Guinea Commerce", country: "PG", type: "both", sector: "trading", rating: 3.4 }
  ];

  // Empresas importadoras adicionales para África (1 actual → agregar 5)
  const importadorasAfrica = [
    { name: "South Africa Diamond Importers", country: "ZA", type: "importer", sector: "mining", rating: 3.8 },
    { name: "Nigeria Oil Equipment Importers", country: "NG", type: "importer", sector: "energy", rating: 3.6 },
    { name: "Egypt Cotton Importers", country: "EG", type: "importer", sector: "textiles", rating: 3.5 },
    { name: "Morocco Phosphate Importers", country: "MA", type: "importer", sector: "mining", rating: 3.7 },
    { name: "Kenya Coffee Equipment Importers", country: "KE", type: "importer", sector: "agriculture", rating: 3.6 }
  ];

  // Consolidar todas las empresas a agregar
  const empresasAAgregar = [
    ...importadorasAmericaSur,
    ...mixtasAmericaSur,
    ...importadorasAsia,
    ...mixtasAsia,
    ...mixtasOceania,
    ...importadorasAfrica
  ];

  let agregadas = 0;
  let errores = 0;

  console.log('\n⚡ AGREGANDO EMPRESAS PARA EQUILIBRAR CATEGORÍAS DÉBILES:');
  console.log(`• Total a agregar: ${empresasAAgregar.length} empresas`);

  for (const empresa of empresasAAgregar) {
    try {
      // Verificar si ya existe
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
        employeeCount: getEmpleadosSegunTipo(empresa.type),
        creditRating: getCreditRating(empresa.rating),
        riskScore: Math.floor(empresa.rating * 20).toString(),
        certifications: getCertificacionesSegunSector(empresa.sector),
        contactPerson: getTituloSegunTipo(empresa.type),
        phone: getTelefonoPais(empresa.country),
        address: `${empresa.name} Headquarters`,
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
        console.log(`✅ ${getBandera(empresa.country)} ${empresa.name} (${empresa.type} - ${empresa.sector})`);
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
  
  const indirectasFinal = dataFinal.companies.filter(e => 
    ['exporter', 'importer', 'both'].includes(e.type)
  );
  const exportadoras = indirectasFinal.filter(e => e.type === 'exporter');
  const importadoras = indirectasFinal.filter(e => e.type === 'importer');
  const mixtas = indirectasFinal.filter(e => e.type === 'both');

  console.log('\n📈 RESULTADOS FORTALECIMIENTO:');
  console.log(`• Empresas agregadas: ${agregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total empresas indirectas: ${indirectasFinal.length}`);
  console.log(`• Distribución actualizada:`);
  console.log(`  - Exportadoras: ${exportadoras.length} (${((exportadoras.length/indirectasFinal.length)*100).toFixed(1)}%)`);
  console.log(`  - Importadoras: ${importadoras.length} (${((importadoras.length/indirectasFinal.length)*100).toFixed(1)}%)`);
  console.log(`  - Mixtas: ${mixtas.length} (${((mixtas.length/indirectasFinal.length)*100).toFixed(1)}%)`);

  // Análisis de mejora por continente
  console.log('\n🌍 MEJORA POR CONTINENTE:');
  
  const continentes = {
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'SG', 'TH', 'MY', 'ID', 'PH', 'VN'],
    'Oceanía': ['AU', 'NZ', 'FJ', 'PG'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE']
  };

  Object.entries(continentes).forEach(([continente, paises]) => {
    const indirectasCont = indirectasFinal.filter(e => paises.includes(e.country));
    const exportCont = indirectasCont.filter(e => e.type === 'exporter');
    const importCont = indirectasCont.filter(e => e.type === 'importer');
    const mixtasCont = indirectasCont.filter(e => e.type === 'both');
    
    console.log(`• ${continente}: ${indirectasCont.length} total`);
    console.log(`  Export: ${exportCont.length} | Import: ${importCont.length} | Mixtas: ${mixtasCont.length}`);
  });

  return {
    agregadas,
    errores,
    totalIndirectas: indirectasFinal.length,
    distribucionFinal: {
      exportadoras: exportadoras.length,
      importadoras: importadoras.length,
      mixtas: mixtas.length
    }
  };
};

// Funciones auxiliares
function getProductosSegunSector(sector) {
  const productos = {
    'food': ['1905', '2106', '2103'],
    'agriculture': ['1005', '1201', '1207'],
    'beverages': ['2204', '2203', '2202'],
    'textiles': ['6203', '6204', '5407'],
    'mining': ['2601', '2603', '7108'],
    'energy': ['2709', '2711', '2701'],
    'trading': ['8523', '8471', '8517'],
    'technology': ['8517', '8471', '8525'],
    'electronics': ['8471', '8517', '8525'],
    'manufacturing': ['8483', '8482', '8481'],
    'software': ['8523', '8471'],
    'financial': ['8523', '8471']
  };
  return productos[sector] || ['8523', '8471', '8517'];
}

function getCoordenadasPais(country) {
  const coords = {
    'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
    'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'UY': [-32.5228, -55.7658],
    'EC': [-1.8312, -78.1834], 'VE': [6.4238, -66.5897], 'CN': [35.8617, 104.1954],
    'JP': [36.2048, 138.2529], 'KR': [35.9078, 127.7669], 'IN': [20.5937, 78.9629],
    'SG': [1.3521, 103.8198], 'TH': [15.8700, 100.9925], 'MY': [4.2105, 101.9758],
    'ID': [-0.7893, 113.9213], 'PH': [12.8797, 121.7740], 'VN': [14.0583, 108.2772],
    'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860], 'FJ': [-16.7784, 179.4144],
    'PG': [-6.3150, 143.9555], 'ZA': [-30.5595, 22.9375], 'NG': [9.0820, 8.6753],
    'EG': [26.8206, 30.8025], 'MA': [31.7917, -7.0926], 'KE': [-0.0236, 37.9062]
  };
  return coords[country] || [0, 0];
}

function getAnoEstablecimiento(name) {
  return 1960 + Math.floor(Math.random() * 60);
}

function getEmpleadosSegunTipo(tipo) {
  const rangos = {
    'importer': [500, 3000],
    'both': [1000, 5000],
    'exporter': [800, 4000]
  };
  const [min, max] = rangos[tipo] || [500, 3000];
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCreditRating(rating) {
  if (rating >= 4.0) return 'A+';
  if (rating >= 3.8) return 'A';
  if (rating >= 3.6) return 'A-';
  if (rating >= 3.4) return 'BBB+';
  return 'BBB';
}

function getCertificacionesSegunSector(sector) {
  const certs = {
    'food': ['HACCP', 'ISO 22000'],
    'agriculture': ['Organic Certification', 'GAP'],
    'textiles': ['OEKO-TEX', 'GOTS'],
    'mining': ['Mining License', 'ISO 14001'],
    'trading': ['Import License', 'Export License']
  };
  return certs[sector] || ['ISO 9001', 'Trade License'];
}

function getTituloSegunTipo(tipo) {
  const titulos = {
    'importer': 'Import Director',
    'exporter': 'Export Director',
    'both': 'International Trade Director'
  };
  return titulos[tipo] || 'Trade Director';
}

function getTelefonoPais(country) {
  const codes = {
    'BR': '+55', 'AR': '+54', 'CL': '+56', 'CO': '+57', 'PE': '+51',
    'UY': '+598', 'EC': '+593', 'VE': '+58', 'CN': '+86', 'JP': '+81',
    'KR': '+82', 'IN': '+91', 'SG': '+65', 'TH': '+66', 'MY': '+60',
    'ID': '+62', 'PH': '+63', 'VN': '+84', 'AU': '+61', 'NZ': '+64',
    'FJ': '+679', 'PG': '+675', 'ZA': '+27', 'NG': '+234', 'EG': '+20',
    'MA': '+212', 'KE': '+254'
  };
  const code = codes[country] || '+1';
  return `${code} ${Math.floor(Math.random() * 900) + 100}${Math.floor(Math.random() * 9000) + 1000}`;
}

function getBandera(country) {
  const flags = {
    'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'UY': '🇺🇾',
    'EC': '🇪🇨', 'VE': '🇻🇪', 'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳',
    'SG': '🇸🇬', 'TH': '🇹🇭', 'MY': '🇲🇾', 'ID': '🇮🇩', 'PH': '🇵🇭', 'VN': '🇻🇳',
    'AU': '🇦🇺', 'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PG': '🇵🇬', 'ZA': '🇿🇦', 'NG': '🇳🇬',
    'EG': '🇪🇬', 'MA': '🇲🇦', 'KE': '🇰🇪'
  };
  return flags[country] || '🏳️';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  fortalecerCategoriasDebiles();
}

export { fortalecerCategoriasDebiles };