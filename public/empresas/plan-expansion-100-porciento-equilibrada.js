// Plan de Expansión 100% Equilibrada - 5 Categorías × 100 Empresas = 500 Total
// Objetivo: Distribución perfecta 20% cada categoría

const planExpansion100PorCiento = async () => {
  console.log('🎯 PLAN EXPANSIÓN 100% EQUILIBRADA - LIBERT.IA');
  console.log('='.repeat(60));

  // Analizar estado actual
  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const empresas = data.companies;

  console.log('\n📊 ESTADO ACTUAL:');
  console.log(`• Total empresas: ${empresas.length}`);

  // Categorización actual
  const directas = empresas.filter(e => e.type === 'directa');
  const indirectas = empresas.filter(e => ['exporter', 'importer', 'both'].includes(e.type));
  const pymes = empresas.filter(e => e.employeeCount && e.employeeCount <= 250);
  const cooperativas = empresas.filter(e => 
    e.name.toLowerCase().includes('cooperative') ||
    e.name.toLowerCase().includes('coop') ||
    e.businessType === 'cooperative'
  );
  const estatales = empresas.filter(e => 
    e.name.toLowerCase().includes('national') ||
    e.name.toLowerCase().includes('central bank') ||
    e.name.toLowerCase().includes('state') ||
    e.businessType === 'state-owned'
  );

  console.log('\n📈 DISTRIBUCIÓN ACTUAL:');
  console.log(`• Directas: ${directas.length} (${((directas.length/empresas.length)*100).toFixed(1)}%)`);
  console.log(`• Indirectas: ${indirectas.length} (${((indirectas.length/empresas.length)*100).toFixed(1)}%)`);
  console.log(`• PYMEs: ${pymes.length} (${((pymes.length/empresas.length)*100).toFixed(1)}%)`);
  console.log(`• Cooperativas: ${cooperativas.length} (${((cooperativas.length/empresas.length)*100).toFixed(1)}%)`);
  console.log(`• Estatales: ${estatales.length} (${((estatales.length/empresas.length)*100).toFixed(1)}%)`);

  // OBJETIVO: 100 empresas por categoría (500 total)
  const objetivo = 100;
  
  console.log('\n🎯 OBJETIVO 100% EQUILIBRADO:');
  console.log('• 100 Empresas Directas (20%)');
  console.log('• 100 Empresas Indirectas (20%)');
  console.log('• 100 PYMEs (20%)');
  console.log('• 100 Cooperativas (20%)');
  console.log('• 100 Empresas Estatales (20%)');
  console.log('• TOTAL: 500 empresas perfectamente balanceadas');

  // Estrategia de rebalanceo
  console.log('\n⚖️ ESTRATEGIA DE REBALANCEO:');
  
  // 1. Mantener 100 mejores directas
  console.log('\n1️⃣ DIRECTAS - Optimizar a 100 mejores:');
  if (directas.length > 100) {
    console.log(`• Actual: ${directas.length} → Objetivo: 100`);
    console.log('• Estrategia: Mantener las 100 empresas directas más estratégicas');
    console.log('• Criterios: Rating, tamaño, cobertura geográfica, sectores clave');
    console.log('• Acción: Reclasificar excedentes como especializadas');
  } else {
    console.log(`• Actual: ${directas.length} → Faltan: ${100 - directas.length}`);
    console.log('• Estrategia: Promover mejores indirectas a directas');
  }

  // 2. Optimizar indirectas a 100
  console.log('\n2️⃣ INDIRECTAS - Balancear a 100:');
  if (indirectas.length > 100) {
    console.log(`• Actual: ${indirectas.length} → Objetivo: 100`);
    console.log('• Mantener: 50 exportadoras + 30 importadoras + 20 import/export');
    console.log('• Criterios: Especialización sectorial, volumen comercial');
  } else {
    console.log(`• Actual: ${indirectas.length} → Objetivo: 100`);
    console.log('• Agregar: Empresas especializadas en comercio específico');
  }

  // 3. Crear categoría PYMEs (100 nuevas)
  console.log('\n3️⃣ PYMEs - Crear 100 empresas:');
  console.log('• Estrategia: Reclasificar empresas pequeñas existentes + agregar nuevas');
  console.log('• Distribución continental propuesta:');
  console.log('  - Europa: 25 PYMEs (tech, manufactura especializada)');
  console.log('  - Asia: 25 PYMEs (manufactura, servicios)');
  console.log('  - América del Norte: 20 PYMEs (tech startups, servicios)');
  console.log('  - América del Sur: 15 PYMEs (agroexportadoras, fintech)');
  console.log('  - África: 10 PYMEs (comercio, servicios)');
  console.log('  - Oceanía: 5 PYMEs (servicios especializados)');

  // 4. Crear categoría Cooperativas (99 nuevas)
  console.log('\n4️⃣ COOPERATIVAS - Crear 100 organizaciones:');
  console.log('• Estrategia: Agregar cooperativas sectoriales globales');
  console.log('• Distribución sectorial propuesta:');
  console.log('  - Agrícolas: 40 cooperativas (café, cacao, frutas, granos)');
  console.log('  - Lácteas: 15 cooperativas (leche, quesos, derivados)');
  console.log('  - Pesqueras: 15 cooperativas (pesca, acuicultura)');
  console.log('  - Mineras: 10 cooperativas (oro, carbón, metales)');
  console.log('  - Artesanales: 10 cooperativas (textiles, artesanías)');
  console.log('  - Servicios: 10 cooperativas (crédito, transporte)');

  // 5. Expandir estatales (85 nuevas)
  console.log('\n5️⃣ ESTATALES - Crear 100 empresas:');
  console.log('• Estrategia: Bancos centrales + empresas estatales estratégicas');
  console.log('• Distribución por tipo:');
  console.log('  - Bancos Centrales: 50 (uno por país estratégico)');
  console.log('  - Petroleras Estatales: 20 (OPEP + grandes productores)');
  console.log('  - Mineras Estatales: 15 (cobre, litio, oro)');
  console.log('  - Telecomunicaciones: 10 (operadores estatales)');
  console.log('  - Energéticas: 5 (hidroeléctricas, nucleares)');

  // Cronograma de implementación
  console.log('\n📅 CRONOGRAMA DE IMPLEMENTACIÓN (10 SEMANAS):');
  
  console.log('\n🔄 SEMANAS 1-2: Rebalanceo Directas/Indirectas');
  console.log('• Optimizar empresas directas a las 100 mejores');
  console.log('• Reclasificar excedentes como especializadas');
  console.log('• Balancear indirectas: 50 export + 30 import + 20 both');

  console.log('\n🏭 SEMANAS 3-4: Creación categoría PYMEs');
  console.log('• Agregar 25 PYMEs Europa (tech, manufactura)');
  console.log('• Agregar 25 PYMEs Asia (manufactura, servicios)');
  console.log('• Agregar 20 PYMEs América del Norte (startups)');

  console.log('\n🤝 SEMANAS 5-6: Creación categoría Cooperativas');
  console.log('• Agregar 40 cooperativas agrícolas globales');
  console.log('• Agregar 30 cooperativas lácteas/pesqueras');
  console.log('• Agregar 30 cooperativas mineras/artesanales');

  console.log('\n🏛️ SEMANAS 7-8: Expansión Empresas Estatales');
  console.log('• Agregar 50 bancos centrales estratégicos');
  console.log('• Agregar 35 empresas estatales (petróleo, minería)');

  console.log('\n✅ SEMANAS 9-10: Ajustes finales y verificación');
  console.log('• Completar PYMEs restantes (30 empresas)');
  console.log('• Verificar distribución 100% equilibrada');
  console.log('• Optimización de calidad y coverage');

  // Distribución continental final
  console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL FINAL (500 empresas):');
  console.log('• América del Norte: 85 empresas (17%)');
  console.log('• Europa: 105 empresas (21%)');
  console.log('• Asia: 110 empresas (22%)');
  console.log('• América del Sur: 85 empresas (17%)');
  console.log('• África: 70 empresas (14%)');
  console.log('• Oceanía: 45 empresas (9%)');

  console.log('\n🎯 BENEFICIOS DEL SISTEMA 100% EQUILIBRADO:');
  console.log('✅ Distribución perfecta: 20% cada categoría');
  console.log('✅ Cobertura sectorial completa: Todos los tipos de empresa');
  console.log('✅ Balance geográfico: 6 continentes representados');
  console.log('✅ Capacidades comerciales 360°: Directas + Indirectas + PYMEs');
  console.log('✅ Acceso gubernamental: Empresas estatales estratégicas');
  console.log('✅ Representación sectorial: Cooperativas especializadas');
  console.log('✅ Flexibilidad de mercado: PYMEs ágiles');
  console.log('✅ Plataforma clase mundial: 500 empresas verificadas');

  console.log('\n🏆 RESULTADO FINAL ESPERADO:');
  console.log('• 500 empresas totales en distribución perfecta');
  console.log('• 70+ países con cobertura completa');
  console.log('• 25+ sectores económicos representados');
  console.log('• Sistema de inteligencia comercial más completo del mundo');
  console.log('• Base para análisis de flujos comerciales globales');
  console.log('• Capacidad de identificar oportunidades en cualquier mercado');

  return {
    estadoActual: {
      total: empresas.length,
      directas: directas.length,
      indirectas: indirectas.length,
      pymes: pymes.length,
      cooperativas: cooperativas.length,
      estatales: estatales.length
    },
    objetivo: {
      total: 500,
      directas: 100,
      indirectas: 100,
      pymes: 100,
      cooperativas: 100,
      estatales: 100
    },
    estrategia: 'Rebalanceo + Expansión Estratégica',
    cronograma: '10 semanas',
    distribucionFinal: 'Perfectamente equilibrada 20% cada categoría'
  };
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  planExpansion100PorCiento();
}

export { planExpansion100PorCiento };