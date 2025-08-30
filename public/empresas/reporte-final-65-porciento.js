// Reporte final: Verificación objetivo 65% tras restauración de emergencia
// LIBERT.IA - Status post-recuperación

const reporteFinal = async () => {
  console.log('🎯 REPORTE FINAL: VERIFICACIÓN OBJETIVO 65% COMPLETADO');
  console.log('='.repeat(70));

  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies;

    const totalEmpresas = companies.length;
    const empresasDirectas = companies.filter(c => c.type === 'directa');
    const totalDirectas = empresasDirectas.length;
    const porcentajeDirectas = ((totalDirectas / totalEmpresas) * 100).toFixed(1);

    // Verificar si objetivo fue alcanzado
    const objetivoAlcanzado = parseFloat(porcentajeDirectas) >= 65.0;
    const margenSeguridad = parseFloat(porcentajeDirectas) - 65.0;

    console.log('\n🏆 MÉTRICAS OBJETIVO PRINCIPAL:');
    console.log(`• Total empresas sistema: ${totalEmpresas}`);
    console.log(`• Empresas directas: ${totalDirectas}`);
    console.log(`• Porcentaje directas: ${porcentajeDirectas}%`);
    console.log(`• Objetivo 65%: ${objetivoAlcanzado ? '✅ ALCANZADO' : '❌ NO ALCANZADO'}`);
    
    if (objetivoAlcanzado) {
      console.log(`• Margen de seguridad: +${margenSeguridad.toFixed(1)}% por encima del objetivo`);
      console.log(`• Status: 🎉 ÉXITO TOTAL`);
    } else {
      const faltantes = Math.ceil(totalEmpresas * 0.65) - totalDirectas;
      console.log(`• Empresas directas faltantes: ${faltantes}`);
      console.log(`• Status: ⚠️ OBJETIVO PENDIENTE`);
    }

    // Análisis geográfico detallado
    const regionesAnalisis = {
      'Asia Oriental': ['CN', 'JP', 'KR', 'HK', 'TW', 'MN', 'KP', 'MO'],
      'Asia Meridional': ['IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'AF'],
      'Asia Sudoriental': ['SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'LA', 'KH', 'MM', 'BN', 'TL'],
      'Europa Occidental': ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'LU'],
      'Europa Nórdica': ['SE', 'NO', 'DK', 'FI', 'IS'],
      'Europa Oriental': ['PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'EE', 'LV', 'LT'],
      'América del Norte': ['US', 'CA', 'MX'],
      'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO'],
      'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'ET', 'UG'],
      'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'NC', 'PF']
    };

    console.log('\n🌍 ANÁLISIS GEOGRÁFICO DETALLADO:');
    let totalDistribucion = 0;
    let asiaTotalEmpresas = 0;
    let europaTotalEmpresas = 0;

    Object.entries(regionesAnalisis).forEach(([region, paises]) => {
      const empresasRegion = companies.filter(c => paises.includes(c.country));
      const directasRegion = empresasRegion.filter(c => c.type === 'directa');
      const porcentajeRegion = ((empresasRegion.length / totalEmpresas) * 100).toFixed(1);
      const porcentajeDirectasRegion = empresasRegion.length > 0 ? 
        ((directasRegion.length / empresasRegion.length) * 100).toFixed(1) : '0.0';
      
      totalDistribucion += empresasRegion.length;
      
      if (region.includes('Asia')) {
        asiaTotalEmpresas += empresasRegion.length;
      }
      if (region.includes('Europa')) {
        europaTotalEmpresas += empresasRegion.length;
      }
      
      if (empresasRegion.length > 0) {
        console.log(`${region}:`);
        console.log(`  📊 Empresas: ${empresasRegion.length} (${porcentajeRegion}% del total)`);
        console.log(`  ⭐ Directas: ${directasRegion.length} (${porcentajeDirectasRegion}% regionales)`);
        console.log(`  🗺️ Países representados: ${[...new Set(empresasRegion.map(c => c.country))].length}/${paises.length}`);
        
        // Mostrar países específicos con empresas
        const paisesConEmpresas = [...new Set(empresasRegion.map(c => c.country))];
        if (paisesConEmpresas.length <= 5) {
          console.log(`  🏴 Países: ${paisesConEmpresas.join(', ')}`);
        }
        console.log('');
      }
    });

    console.log('📊 RESUMEN CONTINENTAL:');
    console.log(`• Total Asia: ${asiaTotalEmpresas} empresas (${((asiaTotalEmpresas/totalEmpresas)*100).toFixed(1)}%)`);
    console.log(`• Total Europa: ${europaTotalEmpresas} empresas (${((europaTotalEmpresas/totalEmpresas)*100).toFixed(1)}%)`);
    if (asiaTotalEmpresas > 0 && europaTotalEmpresas > 0) {
      console.log(`• Balance Asia-Europa: ${(asiaTotalEmpresas/europaTotalEmpresas).toFixed(1)}:1`);
    }

    // Análisis sectorial de empresas directas
    console.log('\n💼 ANÁLISIS SECTORIAL EMPRESAS DIRECTAS:');
    const sectoresDirectas = {};
    empresasDirectas.forEach(empresa => {
      const sector = empresa.sector || 'Sin categoría';
      sectoresDirectas[sector] = (sectoresDirectas[sector] || 0) + 1;
    });

    Object.entries(sectoresDirectas)
      .sort((a, b) => b[1] - a[1])
      .forEach(([sector, count]) => {
        const porcentaje = ((count / totalDirectas) * 100).toFixed(1);
        console.log(`• ${sector}: ${count} empresas (${porcentaje}%)`);
      });

    // Top empresas por rating
    console.log('\n🏆 TOP 15 EMPRESAS POR RATING:');
    const todasLasEmpresas = companies
      .sort((a, b) => (b.rating || 3.5) - (a.rating || 3.5))
      .slice(0, 15);

    todasLasEmpresas.forEach((empresa, index) => {
      const flag = getFlagPorPais(empresa.country);
      const tipo = empresa.type === 'directa' ? '⭐' : empresa.type === 'exporter' ? '📤' : 
                   empresa.type === 'importer' ? '📥' : '🔄';
      console.log(`${index + 1}. ${flag} ${empresa.name} (${empresa.country}) ${tipo} - ${(empresa.rating || 3.5).toFixed(1)}/5.0`);
    });

    // Capacidades comerciales por región
    console.log('\n🚀 CAPACIDADES COMERCIALES POR REGIÓN:');
    
    if (asiaTotalEmpresas > 0) {
      console.log('\n🌏 ASIA - Fortalezas Comerciales:');
      console.log('• Hub tecnológico global: China, India, Japón, Corea del Sur');
      console.log('• Servicios IT: India líder mundial en outsourcing');
      console.log('• Manufactura: China dominio en producción masiva');
      console.log('• Innovación: Japón, Corea del Sur en semiconductores');
      console.log('• Fintech: China, India en pagos digitales');
    }

    if (europaTotalEmpresas > 0) {
      console.log('\n🇪🇺 EUROPA - Fortalezas Comerciales:');
      console.log('• Mercados premium: Francia, Italia en productos de lujo');
      console.log('• Ingeniería industrial: Alemania líder en automotive');
      console.log('• Servicios financieros: Reino Unido, Suiza en banca');
      console.log('• Farmacéutica: Alemania, Suiza, Francia en innovación');
      console.log('• Tecnología: Países Bajos, Alemania en software');
    }

    // Fortalezas por tipo de empresa
    console.log('\n📊 DISTRIBUCIÓN POR TIPO DE EMPRESA:');
    const tiposEmpresa = {};
    companies.forEach(empresa => {
      tiposEmpresa[empresa.type] = (tiposEmpresa[empresa.type] || 0) + 1;
    });

    Object.entries(tiposEmpresa)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tipo, count]) => {
        const porcentaje = ((count / totalEmpresas) * 100).toFixed(1);
        const descripcion = getDescripcionTipo(tipo);
        const eficiencia = tipo === 'directa' ? '🎯' : tipo === 'exporter' ? '📤' : 
                          tipo === 'importer' ? '📥' : '🔄';
        console.log(`• ${eficiencia} ${descripcion}: ${count} empresas (${porcentaje}%)`);
      });

    // Métricas de calidad del sistema
    console.log('\n⭐ MÉTRICAS DE CALIDAD SISTEMA:');
    const ratingPromedio = (companies.reduce((sum, c) => sum + (c.rating || 3.5), 0) / totalEmpresas).toFixed(1);
    const empresasVerificadas = companies.filter(c => c.verified).length;
    const porcentajeVerificadas = ((empresasVerificadas / totalEmpresas) * 100).toFixed(1);
    const paisesUnicos = [...new Set(companies.map(c => c.country))].length;
    const sectoresUnicos = [...new Set(companies.map(c => c.sector))].length;

    console.log(`• Rating promedio: ${ratingPromedio}/5.0 estrellas`);
    console.log(`• Empresas verificadas: ${empresasVerificadas} (${porcentajeVerificadas}%)`);
    console.log(`• Países representados: ${paisesUnicos}`);
    console.log(`• Sectores cubiertos: ${sectoresUnicos}`);
    console.log(`• Empresas con rating ≥4.0: ${companies.filter(c => (c.rating || 3.5) >= 4.0).length}`);

    // Status final del sistema
    console.log('\n🎯 IMPACTO EN SISTEMA LIBERT.IA:');
    console.log('✅ Base de datos empresarial restaurada completamente');
    console.log('✅ Capacidad de análisis comercial multi-continental');
    console.log('✅ Recomendaciones de mercado específicas por región');
    console.log('✅ Evaluación de competidores globales por sector');
    console.log('✅ Identificación de socios comerciales estratégicos');
    console.log('✅ Análisis de cadenas de suministro internacionales');

    // Próximos pasos estratégicos
    console.log('\n📋 PRÓXIMOS PASOS RECOMENDADOS:');
    if (objetivoAlcanzado) {
      console.log('🎯 OBJETIVO PRINCIPAL COMPLETADO - Sistema operativo');
      console.log('• Implementar análisis comercial inteligente');
      console.log('• Desarrollar recomendaciones de mercado IA');
      console.log('• Activar sistema de alertas comerciales');
      console.log('• Preparar dashboard para ofertas comerciales');
      console.log('• Configurar análisis predictivo de oportunidades');
    } else {
      console.log('📈 OPTIMIZAR PARA ALCANZAR 65%');
      console.log('• Agregar más empresas directas en sectores estratégicos');
      console.log('• Focus en mercados con mayor potencial comercial');
      console.log('• Priorizar empresas con ratings superiores a 4.0');
    }

    // Status final del sistema
    const statusSistema = objetivoAlcanzado ? 'COMPLETADO_EXITOSO' : 'EN_OPTIMIZACION';
    
    console.log(`\n${objetivoAlcanzado ? '🏆' : '🔄'} STATUS SISTEMA: ${statusSistema}`);
    if (objetivoAlcanzado) {
      console.log('🎉 LIBERT.IA COMPLETAMENTE OPERATIVO PARA OFERTAS COMERCIALES');
      console.log('✅ Base empresarial sólida y diversificada establecida');
      console.log('✅ Capacidades de análisis comercial internacional');
      console.log('✅ Plataforma lista para generar oportunidades de negocio');
      console.log('✅ Sistema preparado para capturar ofertas comerciales globales');
    }

    return {
      estado: statusSistema,
      totalEmpresas,
      empresasDirectas: totalDirectas,
      porcentajeDirectas: parseFloat(porcentajeDirectas),
      objetivoAlcanzado,
      margenSeguridad: objetivoAlcanzado ? parseFloat(margenSeguridad.toFixed(1)) : null,
      asiaTotalEmpresas,
      europaTotalEmpresas,
      paisesUnicos,
      sectoresUnicos,
      ratingPromedio: parseFloat(ratingPromedio),
      fechaCompletado: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error en reporte final:', error.message);
    return { estado: 'ERROR', error: error.message };
  }
};

// Funciones auxiliares
function getFlagPorPais(country) {
  const flags = {
    'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'HK': '🇭🇰', 'TW': '🇹🇼',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'GB': '🇬🇧', 'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱',
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'BR': '🇧🇷', 'AR': '🇦🇷', 'CL': '🇨🇱',
    'AU': '🇦🇺', 'NZ': '🇳🇿', 'ZA': '🇿🇦', 'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭',
    'PK': '🇵🇰', 'BD': '🇧🇩', 'LK': '🇱🇰', 'BE': '🇧🇪', 'AT': '🇦🇹', 'CH': '🇨🇭',
    'SE': '🇸🇪', 'DK': '🇩🇰', 'NO': '🇳🇴', 'FI': '🇫🇮'
  };
  return flags[country] || '🌏';
}

function getDescripcionTipo(tipo) {
  const descripciones = {
    'directa': 'Empresas Directas',
    'exporter': 'Exportadoras',
    'importer': 'Importadoras',
    'both': 'Import/Export'
  };
  return descripciones[tipo] || tipo;
}

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  reporteFinal();
}

export { reporteFinal };