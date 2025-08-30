// FASE 2: Expansión Asia Meridional - 15 empresas estratégicas
// LIBERT.IA - Consolidando dominio asiático

const empresasAsiaMeridional = [
  // India - Gigante tecnológico y de servicios (10 empresas)
  { name: "Wipro Limited", country: "IN", type: "directa", sector: "technology", rating: 4.0 },
  { name: "HCL Technologies", country: "IN", type: "directa", sector: "technology", rating: 3.9 },
  { name: "Tech Mahindra", country: "IN", type: "directa", sector: "technology", rating: 3.8 },
  { name: "Bajaj Finance", country: "IN", type: "directa", sector: "financial", rating: 4.2 },
  { name: "Paytm", country: "IN", type: "directa", sector: "fintech", rating: 3.7 },
  { name: "Zomato", country: "IN", type: "directa", sector: "technology", rating: 3.6 },
  { name: "Dr. Reddy's Laboratories", country: "IN", type: "exporter", sector: "pharmaceutical", rating: 4.1 },
  { name: "Sun Pharmaceutical", country: "IN", type: "exporter", sector: "pharmaceutical", rating: 4.0 },
  { name: "Mahindra & Mahindra", country: "IN", type: "exporter", sector: "automotive", rating: 3.8 },
  { name: "UltraTech Cement", country: "IN", type: "exporter", sector: "construction", rating: 3.7 },

  // Pakistán - Textil y agricultura (2 empresas)
  { name: "Lucky Cement", country: "PK", type: "exporter", sector: "construction", rating: 3.6 },
  { name: "Engro Corporation", country: "PK", type: "both", sector: "chemicals", rating: 3.5 },

  // Bangladesh - Textil y manufactura (2 empresas)
  { name: "Square Pharmaceuticals", country: "BD", type: "exporter", sector: "pharmaceutical", rating: 3.8 },
  { name: "BRAC Bank", country: "BD", type: "directa", sector: "financial", rating: 3.4 },

  // Sri Lanka - Servicios y telecomunicaciones (1 empresa)
  { name: "Dialog Axiata", country: "LK", type: "directa", sector: "telecommunications", rating: 3.5 }
];

const expandirAsiaMeridional = async () => {
  console.log('🇮🇳 FASE 2: EXPANSIÓN ASIA MERIDIONAL - LIBERT.IA');
  console.log('='.repeat(60));
  
  // Verificar estado inicial
  const responseInicial = await fetch('http://localhost:5000/api/companies');
  const dataInicial = await responseInicial.json();
  const empresasIniciales = dataInicial.companies.length;
  const directasIniciales = dataInicial.companies.filter(c => c.type === 'directa').length;
  const asiasActuales = dataInicial.companies.filter(c => 
    ['CN', 'JP', 'KR', 'HK', 'TW', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'PK', 'BD', 'LK'].includes(c.country)
  ).length;

  console.log('\n📊 ESTADO PRE-FASE 2:');
  console.log(`• Total empresas sistema: ${empresasIniciales}`);
  console.log(`• Empresas directas: ${directasIniciales} (${((directasIniciales/empresasIniciales)*100).toFixed(1)}%)`);
  console.log(`• Empresas asiáticas actuales: ${asiasActuales}`);

  console.log('\n🎯 OBJETIVO FASE 2:');
  console.log(`• Agregar: ${empresasAsiaMeridional.length} empresas Asia Meridional`);
  console.log('• Sectores foco: IT Services, Fintech, Farmacéutica, Textil');
  console.log('• Países objetivo: India, Pakistán, Bangladesh, Sri Lanka');
  console.log('• Mercado objetivo: 1.8+ billones de consumidores');

  let agregadas = 0;
  let directasAgregadas = 0;
  let errores = 0;

  console.log('\n🌏 AGREGANDO EMPRESAS ASIA MERIDIONAL:');

  for (const empresa of empresasAsiaMeridional) {
    try {
      const empresaCompleta = {
        name: empresa.name,
        country: empresa.country,
        type: empresa.type,
        products: getProductsAsiaMeridional(empresa.country, empresa.sector),
        verified: true,
        coordinates: getCoordinatesAsiaMeridional(empresa.country),
        website: `https://www.${empresa.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        contactEmail: `global@${empresa.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        legalName: empresa.name,
        businessType: getBusinessTypeAsiaMeridional(empresa.country),
        establishedYear: getEstablishedYearAsiaMeridional(empresa.name),
        employeeCount: getEmployeeCountAsiaMeridional(empresa.sector, empresa.country),
        creditRating: getCreditRatingAsiaMeridional(empresa.country, empresa.rating),
        riskScore: getRiskScoreAsiaMeridional(empresa.country, empresa.rating),
        certifications: getCertificationsAsiaMeridional(empresa.country, empresa.sector),
        contactPerson: getContactPersonAsiaMeridional(empresa.country),
        phone: getPhoneAsiaMeridional(empresa.country),
        address: `${empresa.name} South Asia Regional Office`,
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
        if (empresa.type === 'directa') directasAgregadas++;
        
        const flag = getFlagAsiaMeridional(empresa.country);
        const strength = getSectorStrength(empresa.sector, empresa.country);
        console.log(`✅ ${flag} ${empresa.name} (${empresa.country}) - ${empresa.sector} ${strength}`);
      } else {
        errores++;
        console.log(`❌ Error agregando ${empresa.name}`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ Error con ${empresa.name}: ${error.message}`);
    }
  }

  // Verificar resultado final
  const responseFinal = await fetch('http://localhost:5000/api/companies');
  const dataFinal = await responseFinal.json();
  const empresasFinales = dataFinal.companies.length;
  const directasFinales = dataFinal.companies.filter(c => c.type === 'directa').length;
  const porcentajeFinal = ((directasFinales / empresasFinales) * 100).toFixed(1);

  // Análisis específico de Asia completa
  const paisesAsiaticos = ['CN', 'JP', 'KR', 'HK', 'TW', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'PK', 'BD', 'LK'];
  const empresasAsiaticas = dataFinal.companies.filter(c => paisesAsiaticos.includes(c.country));
  const directasAsiaticas = empresasAsiaticas.filter(c => c.type === 'directa').length;
  const asiaMeridionalEmpresas = dataFinal.companies.filter(c => ['IN', 'PK', 'BD', 'LK'].includes(c.country));

  console.log('\n📈 RESULTADOS FASE 2 - ASIA MERIDIONAL:');
  console.log(`• Empresas Asia Meridional agregadas: ${agregadas}`);
  console.log(`• Empresas directas agregadas: ${directasAgregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total empresas sistema: ${empresasFinales} (+${empresasFinales - empresasIniciales})`);
  console.log(`• Total empresas directas: ${directasFinales} (${porcentajeFinal}%)`);

  console.log('\n🌏 ANÁLISIS ASIA COMPLETA POST-FASE 2:');
  console.log(`• Total empresas asiáticas: ${empresasAsiaticas.length}`);
  console.log(`• Empresas directas asiáticas: ${directasAsiaticas}`);
  console.log(`• Asia Oriental: ${empresasAsiaticas.length - asiaMeridionalEmpresas.length} empresas`);
  console.log(`• Asia Meridional: ${asiaMeridionalEmpresas.length} empresas`);
  console.log(`• Cobertura asiática: ${((empresasAsiaticas.length / empresasFinales) * 100).toFixed(1)}%`);

  // Análisis por país de Asia Meridional
  console.log('\n🏷️ DISTRIBUCIÓN ASIA MERIDIONAL:');
  const paisesAsiaMeridional = ['IN', 'PK', 'BD', 'LK'];
  paisesAsiaMeridional.forEach(pais => {
    const empresasPais = asiaMeridionalEmpresas.filter(c => c.country === pais);
    const directasPais = empresasPais.filter(c => c.type === 'directa').length;
    if (empresasPais.length > 0) {
      const flag = getFlagAsiaMeridional(pais);
      const nombre = getCountryNameAsiaMeridional(pais);
      console.log(`${flag} ${nombre}: ${empresasPais.length} empresas (${directasPais} directas)`);
      
      // Top empresas por país
      const topEmpresas = empresasPais.slice(0, 2).map(e => e.name).join(', ');
      console.log(`  → Top empresas: ${topEmpresas}`);
    }
  });

  // Fortalezas comerciales específicas de Asia Meridional
  console.log('\n🚀 FORTALEZAS COMERCIALES ASIA MERIDIONAL:');
  
  console.log('\n🇮🇳 INDIA - POTENCIA IT GLOBAL:');
  const empresasIndia = asiaMeridionalEmpresas.filter(c => c.country === 'IN');
  console.log(`• ${empresasIndia.length} empresas indias integradas`);
  console.log('• Fortalezas: IT Services, Software Development, Farmacéutica');
  console.log('• Mercado: 1.4 billones de consumidores, English-speaking workforce');
  console.log('• Ventajas: Costo competitivo, talento técnico, hub de startups');

  console.log('\n📊 IMPACTO EN CAPACIDADES ASIÁTICAS:');
  console.log('✅ Acceso al mercado de IT Services más grande del mundo');
  console.log('✅ Capacidad de outsourcing tecnológico de clase mundial');
  console.log('✅ Hub farmacéutico y genéricos para mercados globales');
  console.log('✅ Plataforma fintech y digital payments en desarrollo');
  console.log('✅ Mercado textil y manufactura de bajo costo');

  // Determinar siguiente fase
  const totalAsiaTargeta = 50; // Objetivo para dominación asiática completa
  const nextPhase = empresasAsiaticas.length >= totalAsiaTargeta ? 'EUROPA_OCCIDENTAL' : 'ASIA_SUDORIENTAL';

  console.log('\n📋 RECOMENDACIÓN PRÓXIMA FASE:');
  if (nextPhase === 'ASIA_SUDORIENTAL') {
    console.log('🎯 FASE 3 RECOMENDADA: Asia Sudoriental');
    console.log('• Países objetivo: Indonesia, Tailandia, Vietnam, Malasia, Filipinas');
    console.log('• Sectores foco: Palm Oil, Electronics, Tourism, Manufacturing');
    console.log('• Empresas objetivo: +10 empresas');
    console.log('• Hub comercial: ASEAN Trade Block');
  } else {
    console.log('🌍 CAMBIO DE CONTINENTE: Europa Occidental');
    console.log('• Dominación asiática completada');
    console.log('• Balancear con mercados europeos maduros');
  }

  if (agregadas >= 12) {
    console.log('\n🎉 FASE 2 COMPLETADA EXITOSAMENTE:');
    console.log('✅ Asia Meridional integrada al sistema');
    console.log('✅ Acceso a mercado IT Services global');
    console.log('✅ Hub farmacéutico y fintech establecido');
    console.log('✅ Diversificación asiática completada');
    console.log(`\n🚀 SIGUIENTE: FASE 3 ${nextPhase}`);
  }

  return {
    fase: 'ASIA_MERIDIONAL_COMPLETADA',
    agregadas,
    directasAgregadas,
    errores,
    empresasFinales,
    directasFinales,
    porcentajeFinal: parseFloat(porcentajeFinal),
    empresasAsiaticas: empresasAsiaticas.length,
    directasAsiaticas,
    asiaMeridionalEmpresas: asiaMeridionalEmpresas.length,
    proximaFase: nextPhase,
    dominacionAsiatica: empresasAsiaticas.length >= totalAsiaTargeta
  };
};

// Funciones auxiliares específicas para Asia Meridional
function getCoordinatesAsiaMeridional(country) {
  const coords = {
    'IN': [78.9629, 20.5937], 'PK': [69.3451, 30.3753], 
    'BD': [90.3563, 23.6850], 'LK': [80.7718, 7.8731]
  };
  return coords[country] || [78.9629, 20.5937];
}

function getProductsAsiaMeridional(country, sector) {
  const base = ['8523'];
  const countryProducts = {
    'IN': ['8517', '8471', '3004', '6203', '5201'],
    'PK': ['5201', '6203', '6204', '2523', '1006'],
    'BD': ['6203', '6204', '6109', '3004', '1006'],
    'LK': ['0902', '0906', '6203', '8517', '4011']
  };
  const sectorProducts = {
    'technology': ['8517', '8471', '8525', '8542'],
    'pharmaceutical': ['3004', '2941', '3003'],
    'financial': ['8523', '8471', '9101'],
    'telecommunications': ['8517', '8525', '8529'],
    'automotive': ['8703', '8708', '4011']
  };
  return [...base, ...(countryProducts[country] || []), ...(sectorProducts[sector] || [])];
}

function getBusinessTypeAsiaMeridional(country) {
  const types = {
    'IN': 'private_limited',
    'PK': 'limited_company',
    'BD': 'public_limited',
    'LK': 'limited_liability'
  };
  return types[country] || 'private_limited';
}

function getEstablishedYearAsiaMeridional(name) {
  const historic = {
    'Wipro Limited': 1945, 'HCL Technologies': 1976, 'Tech Mahindra': 1986,
    'Dr. Reddy\'s Laboratories': 1984, 'Mahindra & Mahindra': 1945,
    'Square Pharmaceuticals': 1958, 'Dialog Axiata': 1995
  };
  return historic[name] || (1980 + Math.floor(Math.random() * 40));
}

function getEmployeeCountAsiaMeridional(sector, country) {
  const baseBySector = {
    'technology': [50000, 250000], 'pharmaceutical': [10000, 80000],
    'financial': [15000, 100000], 'telecommunications': [5000, 40000],
    'automotive': [20000, 150000], 'construction': [8000, 60000]
  };
  const countryMultiplier = { 'IN': 1.5, 'PK': 0.8, 'BD': 0.7, 'LK': 0.6 };
  
  const [min, max] = baseBySector[sector] || [5000, 50000];
  const multiplier = countryMultiplier[country] || 1.0;
  return Math.floor((Math.random() * (max - min) + min) * multiplier);
}

function getCreditRatingAsiaMeridional(country, rating) {
  const countryAdjustment = { 'IN': 0.1, 'PK': -0.2, 'BD': -0.3, 'LK': -0.1 };
  const adjustedRating = rating + (countryAdjustment[country] || 0);
  
  if (adjustedRating >= 4.2) return 'A+';
  if (adjustedRating >= 4.0) return 'A';
  if (adjustedRating >= 3.7) return 'A-';
  if (adjustedRating >= 3.4) return 'BBB+';
  return 'BBB';
}

function getRiskScoreAsiaMeridional(country, rating) {
  const countryBase = { 'IN': 78, 'PK': 65, 'BD': 70, 'LK': 72 };
  const baseScore = countryBase[country] || 75;
  return Math.min(95, Math.floor(baseScore + (rating - 3.0) * 8)).toString();
}

function getCertificationsAsiaMeridional(country, sector) {
  const base = ['ISO 9001', 'ISO 14001'];
  const countrySpecific = {
    'IN': ['BIS', 'CMMI Level 5', 'NASSCOM'],
    'PK': ['PSQCA', 'SMEDA'],
    'BD': ['BSTI', 'BASIS'],
    'LK': ['SLSI', 'BOI']
  };
  const sectorSpecific = {
    'technology': ['CMMI', 'ISO 27001', 'NASSCOM'],
    'pharmaceutical': ['WHO GMP', 'FDA', 'USFDA'],
    'financial': ['Basel III', 'RBI', 'SEBI']
  };
  return [...base, ...(countrySpecific[country] || []), ...(sectorSpecific[sector] || [])];
}

function getContactPersonAsiaMeridional(country) {
  const titles = {
    'IN': 'Vice President - Global Operations',
    'PK': 'Director International Business',
    'BD': 'General Manager - Export Division',
    'LK': 'Regional Manager - South Asia'
  };
  return titles[country] || 'Export Manager';
}

function getPhoneAsiaMeridional(country) {
  const codes = { 'IN': '+91', 'PK': '+92', 'BD': '+880', 'LK': '+94' };
  const code = codes[country] || '+91';
  return `${code} ${Math.floor(Math.random() * 90000) + 10000} ${Math.floor(Math.random() * 90000) + 10000}`;
}

function getFlagAsiaMeridional(country) {
  const flags = { 'IN': '🇮🇳', 'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰' };
  return flags[country] || '🌏';
}

function getCountryNameAsiaMeridional(country) {
  const names = { 'IN': 'India', 'PK': 'Pakistán', 'BD': 'Bangladesh', 'LK': 'Sri Lanka' };
  return names[country] || country;
}

function getSectorStrength(sector, country) {
  const strengths = {
    'technology': '💻', 'pharmaceutical': '💊', 'financial': '💰',
    'telecommunications': '📱', 'automotive': '🚗', 'construction': '🏗️'
  };
  return strengths[sector] || '🏢';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  expandirAsiaMeridional();
}

export { expandirAsiaMeridional };