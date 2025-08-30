// Reporte Final - Análisis Continental y Estrategia 100x5
const reporteFinalAnalisisContinental = async () => {
  console.log('📊 REPORTE FINAL - ANÁLISIS CONTINENTAL LIBERT.IA');
  console.log('='.repeat(60));

  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const empresas = data.companies;

  // Calcular métricas avanzadas
  const sectores = {};
  const paises = {};
  const ratings = [];

  empresas.forEach(emp => {
    // Sectores
    const sector = emp.sector || 'general';
    sectores[sector] = (sectores[sector] || 0) + 1;
    
    // Países
    paises[emp.country] = (paises[emp.country] || 0) + 1;
    
    // Ratings
    if (emp.rating) ratings.push(emp.rating);
  });

  const ratingPromedio = ratings.length > 0 ? 
    (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : 0;

  console.log('\n🌟 MÉTRICAS DE CALIDAD:');
  console.log(`• Rating promedio global: ${ratingPromedio}/5.0`);
  console.log(`• Empresas con rating ≥4.0: ${empresas.filter(e => e.rating >= 4.0).length}`);
  console.log(`• Cobertura de países: ${Object.keys(paises).length} países`);
  console.log(`• Diversificación sectorial: ${Object.keys(sectores).length} sectores`);

  console.log('\n🏅 TOP 10 SECTORES:');
  Object.entries(sectores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([sector, cantidad], i) => {
      console.log(`${i+1}. ${sector}: ${cantidad} empresas`);
    });

  console.log('\n🌍 TOP 15 PAÍSES POR EMPRESAS:');
  Object.entries(paises)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .forEach(([pais, cantidad], i) => {
      console.log(`${i+1}. ${pais}: ${cantidad} empresas`);
    });

  // Análisis de capacidades comerciales
  const directas = empresas.filter(e => e.type === 'directa');
  const exportadoras = empresas.filter(e => e.type === 'exporter');
  const importadoras = empresas.filter(e => e.type === 'importer');
  const ambas = empresas.filter(e => e.type === 'both');

  console.log('\n💼 CAPACIDADES COMERCIALES:');
  console.log(`• Capacidad de exportación directa: ${directas.length + exportadoras.length + ambas.length} empresas`);
  console.log(`• Capacidad de importación directa: ${directas.length + importadoras.length + ambas.length} empresas`);
  console.log(`• Operaciones bidireccionales: ${directas.length + ambas.length} empresas`);

  // Potencial de mercado
  const empresasGrandes = empresas.filter(e => e.employeeCount > 10000);
  const empresasMedianas = empresas.filter(e => e.employeeCount >= 1000 && e.employeeCount <= 10000);
  const empresasPequenas = empresas.filter(e => e.employeeCount < 1000);

  console.log('\n📈 SEGMENTACIÓN POR TAMAÑO:');
  console.log(`• Grandes corporaciones (>10k empleados): ${empresasGrandes.length}`);
  console.log(`• Empresas medianas (1k-10k empleados): ${empresasMedianas.length}`);
  console.log(`• Empresas pequeñas (<1k empleados): ${empresasPequenas.length}`);

  // Proyección de impacto comercial
  const volumenComercialEstimado = empresas.reduce((total, emp) => {
    let factor = 1;
    if (emp.type === 'directa') factor = 3;
    else if (emp.type === 'both') factor = 2.5;
    else if (emp.type === 'exporter' || emp.type === 'importer') factor = 2;
    
    return total + (emp.employeeCount || 1000) * factor;
  }, 0);

  console.log('\n💰 PROYECCIÓN DE IMPACTO COMERCIAL:');
  console.log(`• Índice de volumen comercial estimado: ${(volumenComercialEstimado / 1000000).toFixed(2)}M`);
  console.log(`• Promedio de empleados por empresa: ${Math.round(empresas.reduce((a, b) => a + (b.employeeCount || 0), 0) / empresas.length)}`);

  console.log('\n🎯 SIGUIENTE NIVEL - ESTRATEGIA PREMIUM:');
  console.log('Para llevar LIBERT.IA al nivel más alto, recomendamos:');
  console.log('1. Implementar la estrategia 100x5 (100 empresas por categoría)');
  console.log('2. Agregar empresas Fortune 500 y Global 2000');
  console.log('3. Incluir unicornios y scale-ups estratégicos');
  console.log('4. Integrar bolsas de valores y mercados financieros');
  console.log('5. Incorporar organismos internacionales y multilaterales');

  return {
    metricas: {
      total: empresas.length,
      ratingPromedio: parseFloat(ratingPromedio),
      paises: Object.keys(paises).length,
      sectores: Object.keys(sectores).length,
      volumenComercial: volumenComercialEstimado
    },
    capacidades: {
      exportacion: directas.length + exportadoras.length + ambas.length,
      importacion: directas.length + importadoras.length + ambas.length,
      bidireccional: directas.length + ambas.length
    },
    segmentacion: {
      grandes: empresasGrandes.length,
      medianas: empresasMedianas.length,
      pequenas: empresasPequenas.length
    }
  };
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  reporteFinalAnalisisContinental();
}

export { reporteFinalAnalisisContinental };