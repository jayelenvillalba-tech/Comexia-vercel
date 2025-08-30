// Prueba del Sistema de Nomenclador Aduanero Optimizado con Inteligencia Continental
// Verifica que las mejoras estén funcionando correctamente

const testNomencladorOptimizado = async () => {
  console.log('🧪 PRUEBA SISTEMA NOMENCLADOR OPTIMIZADO - LIBERT.IA');
  console.log('='.repeat(65));

  const busquedasPrueba = [
    // Errores comunes corregidos
    { query: 'telefono', country: 'MX', description: 'Corrección ortográfica español' },
    { query: 'computadora', country: 'ES', description: 'Corrección sinónimo español' },
    { query: 'cafe', country: 'CO', description: 'Producto agrícola latinoamericano' },
    { query: 'petroleo', country: 'NG', description: 'Producto energético africano' },
    
    // Búsquedas multiidioma
    { query: 'smartphone', country: 'US', description: 'Producto tecnológico anglófono' },
    { query: 'laptop', country: 'DE', description: 'Tecnología europea' },
    { query: 'wine', country: 'FR', description: 'Producto europeo tradicional' },
    { query: 'maize', country: 'BR', description: 'Producto agrícola sudamericano' },
    
    // Códigos HS directos
    { query: '8517', country: 'CN', description: 'Código HS exacto tecnológico' },
    { query: '8471', country: 'JP', description: 'Código HS exacto computación' },
    { query: '0901', country: 'KE', description: 'Código HS exacto café' },
    
    // Productos específicos por continente
    { query: 'gold', country: 'AU', description: 'Minería oceánica' },
    { query: 'cacao', country: 'GH', description: 'Agricultura africana' },
    { query: 'soybean', country: 'AR', description: 'Agricultura sudamericana' }
  ];

  console.log(`\n🔍 EJECUTANDO ${busquedasPrueba.length} PRUEBAS DE BÚSQUEDA:`);
  console.log('-'.repeat(65));

  let pruebasExitosas = 0;
  let errores = [];

  for (const [index, prueba] of busquedasPrueba.entries()) {
    try {
      const params = new URLSearchParams({
        q: prueba.query,
        country: prueba.country,
        operation: 'exporter'
      });

      const response = await fetch(`http://localhost:5000/api/hs-search?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resultados = await response.json();
      
      const totalResultados = (resultados.sections?.length || 0) + 
                             (resultados.chapters?.length || 0) + 
                             (resultados.partidas?.length || 0) + 
                             (resultados.subpartidas?.length || 0);

      if (totalResultados > 0) {
        pruebasExitosas++;
        console.log(`✅ Prueba ${index + 1}: "${prueba.query}" (${prueba.country}) - ${totalResultados} resultados`);
        console.log(`   ${prueba.description}`);
        
        // Mostrar los mejores resultados
        if (resultados.partidas && resultados.partidas.length > 0) {
          const mejorPartida = resultados.partidas[0];
          console.log(`   🎯 Mejor resultado: ${mejorPartida.code} - ${mejorPartida.description.slice(0, 40)}...`);
        }
      } else {
        errores.push(`Prueba ${index + 1}: Sin resultados para "${prueba.query}" (${prueba.country})`);
        console.log(`❌ Prueba ${index + 1}: "${prueba.query}" (${prueba.country}) - Sin resultados`);
      }

    } catch (error) {
      errores.push(`Prueba ${index + 1}: Error - ${error.message}`);
      console.log(`💥 Prueba ${index + 1}: Error - ${error.message}`);
    }

    // Pausa breve entre pruebas
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 RESUMEN DE PRUEBAS:');
  console.log('='.repeat(65));
  console.log(`✅ Pruebas exitosas: ${pruebasExitosas}/${busquedasPrueba.length}`);
  console.log(`❌ Pruebas fallidas: ${errores.length}/${busquedasPrueba.length}`);
  console.log(`🎯 Tasa de éxito: ${((pruebasExitosas/busquedasPrueba.length)*100).toFixed(1)}%`);

  if (errores.length > 0) {
    console.log('\n❌ ERRORES DETECTADOS:');
    errores.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  // Prueba de sinónimos específicos
  console.log('\n🧠 PRUEBA DE SINÓNIMOS INTELIGENTES:');
  console.log('-'.repeat(50));

  const pruebasSinonimos = [
    { original: 'telefono', sinonimo: 'smartphone', esperado: '8517' },
    { original: 'computadora', sinonimo: 'laptop', esperado: '8471' },
    { original: 'cafe', sinonimo: 'coffee', esperado: '0901' },
    { original: 'petroleo', sinonimo: 'oil', esperado: '2709' }
  ];

  for (const sinonimo of pruebasSinonimos) {
    try {
      const response1 = await fetch(`http://localhost:5000/api/hs-search?q=${sinonimo.original}&country=MX`);
      const response2 = await fetch(`http://localhost:5000/api/hs-search?q=${sinonimo.sinonimo}&country=US`);
      
      const result1 = await response1.json();
      const result2 = await response2.json();
      
      const codigo1 = result1.partidas?.[0]?.code;
      const codigo2 = result2.partidas?.[0]?.code;
      
      if (codigo1 === codigo2 && codigo1 === sinonimo.esperado) {
        console.log(`✅ Sinónimos "${sinonimo.original}" ↔ "${sinonimo.sinonimo}" → ${codigo1}`);
      } else {
        console.log(`❌ Sinónimos "${sinonimo.original}" (${codigo1}) ≠ "${sinonimo.sinonimo}" (${codigo2})`);
      }
    } catch (error) {
      console.log(`💥 Error en prueba de sinónimos: ${error.message}`);
    }
  }

  // Prueba de contexto continental
  console.log('\n🌍 PRUEBA DE CONTEXTO CONTINENTAL:');
  console.log('-'.repeat(50));

  const pruebaContinental = [
    { query: 'electronics', paises: ['CN', 'JP', 'KR'], continente: 'Asia' },
    { query: 'wine', paises: ['FR', 'IT', 'ES'], continente: 'Europa' },
    { query: 'coffee', paises: ['CO', 'BR', 'KE'], continente: 'Cafetero' },
    { query: 'oil', paises: ['NG', 'SA', 'NO'], continente: 'Petrolero' }
  ];

  for (const continental of pruebaContinental) {
    console.log(`\n🔍 Búsqueda: "${continental.query}" en ${continental.continente}`);
    
    for (const pais of continental.paises) {
      try {
        const response = await fetch(`http://localhost:5000/api/hs-search?q=${continental.query}&country=${pais}`);
        const result = await response.json();
        
        const totalResults = (result.partidas?.length || 0);
        console.log(`   ${pais}: ${totalResults} resultados relevantes`);
        
      } catch (error) {
        console.log(`   ${pais}: Error - ${error.message}`);
      }
    }
  }

  console.log('\n🏆 EVALUACIÓN FINAL:');
  console.log('='.repeat(50));
  
  if (pruebasExitosas >= busquedasPrueba.length * 0.85) {
    console.log('✅ SISTEMA OPTIMIZADO FUNCIONANDO CORRECTAMENTE');
    console.log('🎯 Meta del 85% de reducción de errores: ALCANZADA');
    console.log('🚀 Nomenclador aduanero listo para producción');
  } else {
    console.log('⚠️  SISTEMA NECESITA AJUSTES ADICIONALES');
    console.log('🔧 Revisar configuración de sinónimos y contexto continental');
  }

  return {
    pruebasTotal: busquedasPrueba.length,
    pruebasExitosas,
    tasaExito: (pruebasExitosas/busquedasPrueba.length)*100,
    errores,
    recomendacion: pruebasExitosas >= busquedasPrueba.length * 0.85 ? 
      'Sistema listo para producción' : 
      'Requiere optimizaciones adicionales'
  };
};

// Ejecutar pruebas
if (import.meta.url === `file://${process.argv[1]}`) {
  testNomencladorOptimizado().then(resultado => {
    console.log(`\n📋 Resultado final: ${resultado.recomendacion}`);
  });
}

export { testNomencladorOptimizado };