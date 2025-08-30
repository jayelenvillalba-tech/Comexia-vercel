// Análisis de Empresas Indirectas por Continente - De más completa a menos completa

const analisisIndirectasPorContinente = async () => {
  console.log('🌍 ANÁLISIS EMPRESAS INDIRECTAS POR CONTINENTE - LIBERT.IA');
  console.log('='.repeat(65));

  // Obtener datos actuales
  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const todasEmpresas = data.companies;

  // Filtrar empresas indirectas (exporter, importer, both)
  const empresasIndirectas = todasEmpresas.filter(e => 
    ['exporter', 'importer', 'both'].includes(e.type)
  );

  console.log('\n📊 ESTADO ACTUAL EMPRESAS INDIRECTAS:');
  console.log(`• Total empresas globales: ${todasEmpresas.length}`);
  console.log(`• Total empresas indirectas: ${empresasIndirectas.length}`);
  console.log(`• Porcentaje indirectas del total: ${((empresasIndirectas.length/todasEmpresas.length)*100).toFixed(2)}%`);

  // Análisis por tipo de empresa indirecta
  const exportadoras = empresasIndirectas.filter(e => e.type === 'exporter');
  const importadoras = empresasIndirectas.filter(e => e.type === 'importer');
  const mixtas = empresasIndirectas.filter(e => e.type === 'both');

  console.log('\n📈 DISTRIBUCIÓN POR TIPO DE EMPRESA INDIRECTA:');
  console.log(`• Exportadoras: ${exportadoras.length} (${((exportadoras.length/empresasIndirectas.length)*100).toFixed(1)}%)`);
  console.log(`• Importadoras: ${importadoras.length} (${((importadoras.length/empresasIndirectas.length)*100).toFixed(1)}%)`);
  console.log(`• Import/Export (mixtas): ${mixtas.length} (${((mixtas.length/empresasIndirectas.length)*100).toFixed(1)}%)`);

  // Definir continentes
  const continentes = {
    'América del Norte': ['US', 'CA', 'MX'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL', 'CZ', 'PT', 'GR', 'HU', 'RO'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN', 'KH', 'MM', 'LA'],
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO', 'PW', 'NR'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO', 'ET', 'TZ', 'UG', 'RW', 'SN', 'CI', 'BW']
  };

  // Analizar por continente y calcular completitud
  const analisisContinental = [];

  Object.entries(continentes).forEach(([continente, paises]) => {
    const indirectasContinente = empresasIndirectas.filter(e => paises.includes(e.country));
    const exportadorasCont = indirectasContinente.filter(e => e.type === 'exporter');
    const importadorasCont = indirectasContinente.filter(e => e.type === 'importer');
    const mixtasCont = indirectasContinente.filter(e => e.type === 'both');

    // Calcular índice de completitud (diversidad de tipos + cantidad)
    let indiceDiversidad = 0;
    if (exportadorasCont.length > 0) indiceDiversidad += 1;
    if (importadorasCont.length > 0) indiceDiversidad += 1;
    if (mixtasCont.length > 0) indiceDiversidad += 1;
    
    const porcentajeDelTotal = ((indirectasContinente.length / empresasIndirectas.length) * 100);
    const indiceCompletitud = (indiceDiversidad * 33.33) + (porcentajeDelTotal * 0.5);

    // Agrupar por país
    const porPais = {};
    indirectasContinente.forEach(emp => {
      porPais[emp.country] = (porPais[emp.country] || 0) + 1;
    });

    // Análisis sectorial
    const sectores = {};
    indirectasContinente.forEach(emp => {
      const sector = emp.sector || 'general';
      sectores[sector] = (sectores[sector] || 0) + 1;
    });

    analisisContinental.push({
      continente,
      total: indirectasContinente.length,
      exportadoras: exportadorasCont.length,
      importadoras: importadorasCont.length,
      mixtas: mixtasCont.length,
      porcentajeDelTotal: porcentajeDelTotal.toFixed(1),
      diversidad: indiceDiversidad,
      completitud: indiceCompletitud.toFixed(1),
      paises: Object.keys(porPais).length,
      distribuccionPaises: porPais,
      sectores: Object.keys(sectores).length,
      topSectores: Object.entries(sectores).sort(([,a], [,b]) => b - a).slice(0, 3)
    });
  });

  // Ordenar por completitud (de más completa a menos completa)
  analisisContinental.sort((a, b) => parseFloat(b.completitud) - parseFloat(a.completitud));

  console.log('\n🏆 RANKING CONTINENTAL - DE MÁS COMPLETA A MENOS COMPLETA:');
  console.log('='.repeat(65));

  analisisContinental.forEach((cont, index) => {
    console.log(`\n${index + 1}. ${getContinenteIcon(cont.continente)} ${cont.continente.toUpperCase()}`);
    console.log(`   📊 Completitud: ${cont.completitud}% | Total: ${cont.total} empresas (${cont.porcentajeDelTotal}%)`);
    console.log(`   🏭 Tipos: ${cont.exportadoras} Export + ${cont.importadoras} Import + ${cont.mixtas} Mixtas`);
    console.log(`   🌍 Cobertura: ${cont.paises} países | ${cont.sectores} sectores`);
    
    // Mostrar distribución por países
    console.log('   📍 Por países:');
    Object.entries(cont.distribuccionPaises)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([pais, cantidad]) => {
        console.log(`      ${getBandera(pais)} ${pais}: ${cantidad} empresas`);
      });

    // Mostrar top sectores
    if (cont.topSectores.length > 0) {
      console.log('   🔧 Top sectores:');
      cont.topSectores.forEach(([sector, cantidad]) => {
        console.log(`      • ${sector}: ${cantidad} empresas`);
      });
    }

    // Análisis de fortalezas y oportunidades
    console.log('   💪 Fortalezas:');
    if (cont.exportadoras > cont.importadoras + cont.mixtas) {
      console.log('      • Fuerte capacidad exportadora');
    }
    if (cont.mixtas > 0) {
      console.log('      • Empresas con operaciones bidireccionales');
    }
    if (cont.paises >= 3) {
      console.log('      • Buena diversificación geográfica');
    }
    
    console.log('   🎯 Oportunidades:');
    if (cont.importadoras < 2) {
      console.log('      • Agregar más empresas importadoras especializadas');
    }
    if (cont.mixtas < 2) {
      console.log('      • Incorporar más empresas con operaciones mixtas');
    }
    if (cont.sectores < 3) {
      console.log('      • Diversificar sectores representados');
    }
  });

  // Resumen ejecutivo
  console.log('\n📋 RESUMEN EJECUTIVO - EMPRESAS INDIRECTAS:');
  console.log('='.repeat(50));
  
  const continenteMasCompleto = analisisContinental[0];
  const continenteMenosCompleto = analisisContinental[analisisContinental.length - 1];
  
  console.log(`🥇 Continente más completo: ${continenteMasCompleto.continente}`);
  console.log(`   • ${continenteMasCompleto.total} empresas indirectas (${continenteMasCompleto.porcentajeDelTotal}%)`);
  console.log(`   • Completitud: ${continenteMasCompleto.completitud}%`);
  
  console.log(`🥉 Continente menos completo: ${continenteMenosCompleto.continente}`);
  console.log(`   • ${continenteMenosCompleto.total} empresas indirectas (${continenteMenosCompleto.porcentajeDelTotal}%)`);
  console.log(`   • Completitud: ${continenteMenosCompleto.completitud}%`);

  // Estadísticas globales
  const totalPaises = new Set(empresasIndirectas.map(e => e.country)).size;
  const promedioCompletitud = analisisContinental.reduce((sum, cont) => sum + parseFloat(cont.completitud), 0) / analisisContinental.length;

  console.log('\n📊 ESTADÍSTICAS GLOBALES:');
  console.log(`• Cobertura total: ${totalPaises} países`);
  console.log(`• Promedio completitud continental: ${promedioCompletitud.toFixed(1)}%`);
  console.log(`• Distribución exportadoras/importadoras/mixtas: ${exportadoras.length}/${importadoras.length}/${mixtas.length}`);

  // Recomendaciones estratégicas
  console.log('\n🎯 RECOMENDACIONES ESTRATÉGICAS:');
  console.log('1. Fortalecer continentes con baja completitud');
  console.log('2. Equilibrar tipos de empresas (export/import/mixtas)');
  console.log('3. Ampliar cobertura sectorial en continentes débiles');
  console.log('4. Mantener la fortaleza de continentes líderes');

  return {
    totalIndirectas: empresasIndirectas.length,
    porcentajeDelTotal: ((empresasIndirectas.length/todasEmpresas.length)*100).toFixed(2),
    distribuccion: {
      exportadoras: exportadoras.length,
      importadoras: importadoras.length,
      mixtas: mixtas.length
    },
    rankingContinental: analisisContinental,
    estadisticas: {
      continenteMasCompleto: continenteMasCompleto.continente,
      continenteMenosCompleto: continenteMenosCompleto.continente,
      promedioCompletitud: promedioCompletitud.toFixed(1),
      coberturaTotal: totalPaises
    }
  };
};

// Funciones auxiliares
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

function getBandera(country) {
  const flags = {
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'DE': '🇩🇪', 'GB': '🇬🇧', 'FR': '🇫🇷',
    'CH': '🇨🇭', 'SE': '🇸🇪', 'DK': '🇩🇰', 'NO': '🇳🇴', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'NL': '🇳🇱', 'BE': '🇧🇪', 'AT': '🇦🇹', 'IE': '🇮🇪', 'FI': '🇫🇮', 'PL': '🇵🇱',
    'CZ': '🇨🇿', 'PT': '🇵🇹', 'GR': '🇬🇷', 'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷',
    'IN': '🇮🇳', 'TW': '🇹🇼', 'SG': '🇸🇬', 'HK': '🇭🇰', 'ID': '🇮🇩', 'MY': '🇲🇾',
    'TH': '🇹🇭', 'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪',
    'AU': '🇦🇺', 'NZ': '🇳🇿', 'ZA': '🇿🇦', 'NG': '🇳🇬', 'EG': '🇪🇬', 'MA': '🇲🇦',
    'KE': '🇰🇪', 'GH': '🇬🇭'
  };
  return flags[country] || '🏳️';
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  analisisIndirectasPorContinente();
}

export { analisisIndirectasPorContinente };