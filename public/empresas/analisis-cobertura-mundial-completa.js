// Análisis de Cobertura Mundial Completa - Sistema Empresarial LIBERT.IA
// Análisis actual y estrategia para alcanzar 100 empresas por categoría

const analisisCoberturaMundial = async () => {
  console.log('🌎 ANÁLISIS COBERTURA MUNDIAL COMPLETA - LIBERT.IA');
  console.log('='.repeat(65));

  // Obtener datos actuales
  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const empresas = data.companies;

  console.log('\n📊 ESTADO ACTUAL DEL SISTEMA:');
  console.log(`• Total empresas verificadas: ${empresas.length}`);

  // Análisis por tipo de empresa
  const tiposEmpresa = empresas.reduce((acc, emp) => {
    const tipo = emp.type;
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📈 DISTRIBUCIÓN ACTUAL POR TIPO:');
  Object.entries(tiposEmpresa)
    .sort(([,a], [,b]) => b - a)
    .forEach(([tipo, cantidad]) => {
      const porcentaje = ((cantidad / empresas.length) * 100).toFixed(1);
      console.log(`• ${getTipoEmpresaNombre(tipo)}: ${cantidad} empresas (${porcentaje}%)`);
    });

  // Análisis detallado por categorías comerciales
  console.log('\n🏢 ANÁLISIS DETALLADO POR CATEGORÍAS:');
  
  // DIRECTAS - Empresas con operaciones comerciales directas
  const directas = empresas.filter(e => e.type === 'directa');
  console.log(`\n1. EMPRESAS DIRECTAS: ${directas.length}`);
  console.log('   • Definición: Empresas con capacidades comerciales directas internacionales');
  console.log('   • Capacidades: Import/Export directo, distribución internacional');
  console.log('   • Fortalezas: Control total de la cadena comercial');

  // INDIRECTAS (exportadoras, importadoras, both)
  const indirectas = empresas.filter(e => ['exporter', 'importer', 'both'].includes(e.type));
  console.log(`\n2. EMPRESAS INDIRECTAS: ${indirectas.length}`);
  console.log('   • Exportadoras: ' + empresas.filter(e => e.type === 'exporter').length);
  console.log('   • Importadoras: ' + empresas.filter(e => e.type === 'importer').length);
  console.log('   • Import/Export: ' + empresas.filter(e => e.type === 'both').length);
  console.log('   • Definición: Empresas especializadas en comercio específico');

  // Identificar PYMEs por tamaño de empleados
  const pymes = empresas.filter(e => e.employeeCount && e.employeeCount <= 250);
  console.log(`\n3. PYMEs (≤250 empleados): ${pymes.length}`);
  console.log('   • Definición: Pequeñas y medianas empresas con potencial internacional');
  console.log('   • Ventaja: Flexibilidad y adaptabilidad al mercado');

  // Identificar COOPERATIVAS por nombre y businessType
  const cooperativas = empresas.filter(e => 
    e.name.toLowerCase().includes('cooperative') ||
    e.name.toLowerCase().includes('coop') ||
    e.name.toLowerCase().includes('cooperativa') ||
    e.businessType === 'cooperative'
  );
  console.log(`\n4. COOPERATIVAS: ${cooperativas.length}`);
  console.log('   • Definición: Organizaciones de productores y comerciantes');
  console.log('   • Ventaja: Economías de escala y representación sectorial');

  // Identificar ESTATALES por nombre
  const estatales = empresas.filter(e => 
    e.name.toLowerCase().includes('national') ||
    e.name.toLowerCase().includes('state') ||
    e.name.toLowerCase().includes('central bank') ||
    e.name.toLowerCase().includes('government') ||
    e.name.toLowerCase().includes('público') ||
    e.name.toLowerCase().includes('estatal') ||
    e.businessType === 'state-owned'
  );
  console.log(`\n5. EMPRESAS ESTATALES: ${estatales.length}`);
  console.log('   • Definición: Empresas controladas por gobiernos');
  console.log('   • Ventaja: Respaldo gubernamental y acceso a mercados oficiales');

  // Análisis por continentes
  const distribuciones = {
    'América del Norte': ['US', 'CA', 'MX'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL', 'CZ', 'PT', 'GR'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN', 'KH', 'MM', 'LA'],
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO', 'ET', 'TZ', 'UG', 'RW']
  };

  console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL DETALLADA:');
  Object.entries(distribuciones).forEach(([continente, paises]) => {
    const empresasContinente = empresas.filter(e => paises.includes(e.country));
    const directasCont = empresasContinente.filter(e => e.type === 'directa');
    
    if (empresasContinente.length > 0) {
      console.log(`\n${getContinenteIcon(continente)} ${continente}:`);
      console.log(`  Total: ${empresasContinente.length} empresas`);
      console.log(`  Directas: ${directasCont.length}`);
      console.log(`  PYMEs: ${empresasContinente.filter(e => e.employeeCount <= 250).length}`);
      console.log(`  Cooperativas: ${empresasContinente.filter(e => 
        e.name.toLowerCase().includes('coop') || 
        e.businessType === 'cooperative'
      ).length}`);
      console.log(`  Estatales: ${empresasContinente.filter(e => 
        e.name.toLowerCase().includes('national') || 
        e.name.toLowerCase().includes('central bank')
      ).length}`);
    }
  });

  // ESTRATEGIA PARA ALCANZAR 100 EN CADA CATEGORÍA
  console.log('\n🎯 ESTRATEGIA PARA ALCANZAR 100 EN CADA CATEGORÍA:');
  console.log('='.repeat(60));

  const objetivo = 100;
  const deficit = {
    directas: Math.max(0, objetivo - directas.length),
    indirectas: Math.max(0, objetivo - indirectas.length),
    pymes: Math.max(0, objetivo - pymes.length),
    cooperativas: Math.max(0, objetivo - cooperativas.length),
    estatales: Math.max(0, objetivo - estatales.length)
  };

  console.log('\n📋 ANÁLISIS DE DÉFICIT PARA OBJETIVO 100:');
  console.log(`• Directas: ${directas.length}/100 (faltan ${deficit.directas})`);
  console.log(`• Indirectas: ${indirectas.length}/100 (faltan ${deficit.indirectas})`);
  console.log(`• PYMEs: ${pymes.length}/100 (faltan ${deficit.pymes})`);
  console.log(`• Cooperativas: ${cooperativas.length}/100 (faltan ${deficit.cooperativas})`);
  console.log(`• Estatales: ${estatales.length}/100 (faltan ${deficit.estatales})`);

  const totalFaltante = Object.values(deficit).reduce((a, b) => a + b, 0);
  console.log(`\n• TOTAL A AGREGAR: ${totalFaltante} empresas adicionales`);

  // Propuesta de distribución por continentes para completar
  console.log('\n🌎 ESTRATEGIA DE EXPANSIÓN PROPUESTA:');
  
  console.log('\n📈 FASE 1 - COMPLETAR DIRECTAS (faltan ' + deficit.directas + '):');
  if (deficit.directas > 0) {
    console.log('• Asia: +15 (fintech, e-commerce, tecnología)');
    console.log('• Europa: +10 (servicios financieros, manufactura)');
    console.log('• América del Norte: +8 (tecnología, servicios)');
    console.log('• África: +5 (telecomunicaciones, banca)');
    console.log('• Oceanía: +3 (servicios, minería)');
    console.log('• América del Sur: +2 (fintech, retail)');
  } else {
    console.log('✅ Meta de directas YA ALCANZADA');
  }

  console.log('\n📈 FASE 2 - COMPLETAR PYMEs (faltan ' + deficit.pymes + '):');
  if (deficit.pymes > 0) {
    console.log('• Europa: +20 (startups tecnológicas, manufactura especializada)');
    console.log('• Asia: +15 (manufactura, servicios)');
    console.log('• América del Norte: +10 (tech startups, servicios especializados)');
    console.log('• América del Sur: +8 (agroexportadoras, servicios)');
    console.log('• África: +5 (comercio, servicios)');
    console.log('• Oceanía: +2 (servicios especializados)');
  } else {
    console.log('✅ Meta de PYMEs YA ALCANZADA');
  }

  console.log('\n📈 FASE 3 - COMPLETAR COOPERATIVAS (faltan ' + deficit.cooperativas + '):');
  if (deficit.cooperativas > 0) {
    console.log('• América del Sur: +15 (agrícolas, cafeteras)');
    console.log('• África: +10 (agrícolas, mineras)');
    console.log('• Asia: +8 (agrícolas, pesqueras)');
    console.log('• Europa: +5 (agrícolas, lácteas)');
    console.log('• América del Norte: +3 (agrícolas especializadas)');
    console.log('• Oceanía: +2 (lácteas, agrícolas)');
  } else {
    console.log('✅ Meta de cooperativas CERCANA - solo faltan ' + deficit.cooperativas);
  }

  console.log('\n📈 FASE 4 - COMPLETAR ESTATALES (faltan ' + deficit.estatales + '):');
  if (deficit.estatales > 0) {
    console.log('• África: +12 (bancos centrales, petroleras estatales)');
    console.log('• Asia: +10 (bancos centrales, empresas estatales)');
    console.log('• América del Sur: +8 (petroleras, mineras estatales)');
    console.log('• Europa: +5 (empresas estatales EU)');
    console.log('• Oceanía: +3 (empresas estatales Australia/NZ)');
    console.log('• América del Norte: +2 (empresas estatales específicas)');
  } else {
    console.log('✅ Meta de estatales ALCANZADA');
  }

  console.log('\n📈 FASE 5 - COMPLETAR INDIRECTAS (faltan ' + deficit.indirectas + '):');
  if (deficit.indirectas > 0) {
    console.log('• Asia: +10 (exportadoras manufactureras)');
    console.log('• Europa: +8 (importadoras especializadas)');
    console.log('• América del Norte: +5 (trading companies)');
    console.log('• África: +4 (exportadoras mineras)');
    console.log('• América del Sur: +3 (exportadoras agrícolas)');
    console.log('• Oceanía: +2 (exportadoras mineras)');
  } else {
    console.log('✅ Meta de indirectas YA ALCANZADA');
  }

  // Resumen de implementación
  console.log('\n🚀 CRONOGRAMA DE IMPLEMENTACIÓN:');
  console.log('• Semana 1-2: Completar empresas directas (prioridad máxima)');
  console.log('• Semana 3-4: Agregar PYMEs especializadas por continente');
  console.log('• Semana 5-6: Incorporar cooperativas agrícolas y sectoriales');
  console.log('• Semana 7-8: Integrar empresas estatales estratégicas');
  console.log('• Semana 9-10: Completar empresas indirectas especializadas');

  console.log('\n🏆 RESULTADO ESPERADO AL COMPLETAR ESTRATEGIA:');
  console.log('• 100 Empresas Directas: Máxima capacidad comercial directa');
  console.log('• 100 PYMEs: Flexibilidad y adaptabilidad al mercado');
  console.log('• 100 Cooperativas: Representación sectorial sólida');
  console.log('• 100 Empresas Estatales: Acceso a mercados gubernamentales');
  console.log('• 100 Empresas Indirectas: Especialización comercial avanzada');
  console.log('• TOTAL: 500 empresas de clase mundial');
  console.log('• COBERTURA: 70+ países, 6 continentes');
  console.log('• CAPACIDAD: Análisis comercial 360° completo');

  return {
    estadoActual: {
      total: empresas.length,
      directas: directas.length,
      indirectas: indirectas.length,
      pymes: pymes.length,
      cooperativas: cooperativas.length,
      estatales: estatales.length
    },
    deficit,
    totalFaltante,
    estrategiaImplementada: true
  };
};

// Funciones auxiliares
function getTipoEmpresaNombre(tipo) {
  const nombres = {
    'directa': 'Empresas Directas',
    'exporter': 'Exportadoras',
    'importer': 'Importadoras',
    'both': 'Import/Export',
    'cooperative': 'Cooperativas',
    'state-owned': 'Estatales'
  };
  return nombres[tipo] || tipo;
}

function getContinenteIcon(continente) {
  const icons = {
    'América del Norte': '🇺🇸',
    'Europa': '🇪🇺', 
    'Asia': '🌏',
    'América del Sur': '🇧🇷',
    'Oceanía': '🇦🇺',
    'África': '🌍'
  };
  return icons[continente] || '🌍';
}

// Ejecutar análisis
if (import.meta.url === `file://${process.argv[1]}`) {
  analisisCoberturaMundial();
}

export { analisisCoberturaMundial };