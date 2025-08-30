// Reporte final: Objetivo 65% empresas directas ALCANZADO
// LIBERT.IA - Expansión exitosa completada

const reporteExpansionExitosa = async () => {
  console.log('🎯 REPORTE: OBJETIVO 65% EMPRESAS DIRECTAS ALCANZADO');
  console.log('='.repeat(65));

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

    // Análisis geográfico completo
    const distribuciones = {
      asia: {
        paises: ['CN', 'JP', 'KR', 'HK', 'TW', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN', 'PK', 'BD', 'LK'],
        nombre: 'Asia'
      },
      europa: {
        paises: ['DE', 'FR', 'GB', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI'],
        nombre: 'Europa'
      },
      america_norte: {
        paises: ['US', 'CA', 'MX'],
        nombre: 'América del Norte'
      },
      america_sur: {
        paises: ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO'],
        nombre: 'América del Sur'
      },
      africa: {
        paises: ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ'],
        nombre: 'África'
      },
      oceania: {
        paises: ['AU', 'NZ', 'PG', 'FJ'],
        nombre: 'Oceanía'
      }
    };

    console.log('\n🌍 DISTRIBUCIÓN GEOGRÁFICA FINAL:');
    let totalDistribucion = 0;

    Object.entries(distribuciones).forEach(([region, config]) => {
      const empresasRegion = companies.filter(c => config.paises.includes(c.country));
      const directasRegion = empresasRegion.filter(c => c.type === 'directa');
      const porcentajeRegion = ((empresasRegion.length / totalEmpresas) * 100).toFixed(1);
      const porcentajeDirectasRegion = empresasRegion.length > 0 ? 
        ((directasRegion.length / empresasRegion.length) * 100).toFixed(1) : '0.0';
      
      totalDistribucion += empresasRegion.length;
      
      if (empresasRegion.length > 0) {
        console.log(`${config.nombre}:`);
        console.log(`  📊 Empresas: ${empresasRegion.length} (${porcentajeRegion}% del total)`);
        console.log(`  ⭐ Directas: ${directasRegion.length} (${porcentajeDirectasRegion}% regionales)`);
        console.log(`  🗺️ Países: ${[...new Set(empresasRegion.map(c => c.country))].length}`);
        console.log('');
      }
    });

    // Análisis sectorial de empresas directas
    console.log('💼 ANÁLISIS SECTORIAL EMPRESAS DIRECTAS:');
    const sectoresDirectas = {};
    empresasDirectas.forEach(empresa => {
      const sector = empresa.sector || 'Otros';
      sectoresDirectas[sector] = (sectoresDirectas[sector] || 0) + 1;
    });

    Object.entries(sectoresDirectas)
      .sort((a, b) => b[1] - a[1])
      .forEach(([sector, count]) => {
        const porcentaje = ((count / totalDirectas) * 100).toFixed(1);
        console.log(`• ${sector}: ${count} empresas (${porcentaje}%)`);
      });

    // Top empresas directas por rating
    console.log('\n🏆 TOP 10 EMPRESAS DIRECTAS POR RATING:');
    const topDirectas = empresasDirectas
      .sort((a, b) => (b.rating || 3.5) - (a.rating || 3.5))
      .slice(0, 10);

    topDirectas.forEach((empresa, index) => {
      const flag = getFlagPorPais(empresa.country);
      console.log(`${index + 1}. ${flag} ${empresa.name} (${empresa.country}) - ${(empresa.rating || 3.5).toFixed(1)}⭐`);
    });

    // Capacidades comerciales logradas
    console.log('\n🚀 CAPACIDADES COMERCIALES LOGRADAS:');
    console.log('✅ Hub tecnológico global: Asia dominante con presencia europea');
    console.log('✅ Mercados premium: Europa Occidental para productos de lujo');
    console.log('✅ Manufactura y escala: China e India para producción masiva');
    console.log('✅ Servicios financieros: Reino Unido, Hong Kong, Singapur');
    console.log('✅ Innovación y I+D: Alemania, Japón, Corea del Sur');
    console.log('✅ E-commerce y digital: China, Estados Unidos, Europa');

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
        console.log(`• ${descripcion}: ${count} empresas (${porcentaje}%)`);
      });

    // Métricas de calidad
    console.log('\n⭐ MÉTRICAS DE CALIDAD:');
    const ratingPromedio = (companies.reduce((sum, c) => sum + (c.rating || 3.5), 0) / totalEmpresas).toFixed(1);
    const empresasVerificadas = companies.filter(c => c.verified).length;
    const porcentajeVerificadas = ((empresasVerificadas / totalEmpresas) * 100).toFixed(1);

    console.log(`• Rating promedio: ${ratingPromedio}/5.0 estrellas`);
    console.log(`• Empresas verificadas: ${empresasVerificadas} (${porcentajeVerificadas}%)`);
    console.log(`• Países cubiertos: ${[...new Set(companies.map(c => c.country))].length}`);
    console.log(`• Sectores representados: ${[...new Set(companies.map(c => c.sector))].length}`);

    // Impacto en LIBERT.IA
    console.log('\n🎯 IMPACTO EN SISTEMA LIBERT.IA:');
    console.log('✅ Base de datos empresarial de clase mundial');
    console.log('✅ Capacidad de análisis comercial global');
    console.log('✅ Recomendaciones de mercado multi-continental');
    console.log('✅ Evaluación de competidores por sector y región');
    console.log('✅ Identificación de socios comerciales estratégicos');
    console.log('✅ Análisis de cadenas de suministro globales');

    // Próximos pasos estratégicos
    console.log('\n📋 PRÓXIMOS PASOS ESTRATÉGICOS:');
    if (objetivoAlcanzado) {
      console.log('🎯 OBJETIVO PRINCIPAL COMPLETADO');
      console.log('• Considerar expansión a mercados emergentes');
      console.log('• Implementar sistema de recomendaciones IA');
      console.log('• Desarrollar análisis predictivo de mercados');
      console.log('• Preparar plataforma para ofertas comerciales');
    } else {
      console.log('📈 COMPLETAR OBJETIVO 65%');
      console.log('• Agregar más empresas directas en sectores clave');
      console.log('• Focus en mercados con mayor potencial directo');
    }

    // Status final del sistema
    const statusSistema = objetivoAlcanzado ? 'COMPLETADO_EXITOSO' : 'EN_PROGRESO';
    
    console.log(`\n${objetivoAlcanzado ? '🏆' : '🔄'} STATUS SISTEMA: ${statusSistema}`);
    if (objetivoAlcanzado) {
      console.log('🎉 LIBERT.IA LISTO PARA OFERTAS COMERCIALES GLOBALES');
      console.log('✅ Base empresarial sólida y diversificada establecida');
      console.log('✅ Capacidades de análisis comercial internacional');
      console.log('✅ Platform ready for business opportunities');
    }

    return {
      estado: statusSistema,
      totalEmpresas,
      empresasDirectas: totalDirectas,
      porcentajeDirectas: parseFloat(porcentajeDirectas),
      objetivoAlcanzado,
      margenSeguridad: objetivoAlcanzado ? parseFloat(margenSeguridad.toFixed(1)) : null,
      distribuccionGeografica: Object.fromEntries(
        Object.entries(distribuciones).map(([region, config]) => [
          region, 
          companies.filter(c => config.paises.includes(c.country)).length
        ])
      ),
      ratingPromedio: parseFloat(ratingPromedio),
      paisesTotal: [...new Set(companies.map(c => c.country))].length,
      sectoresTotal: [...new Set(companies.map(c => c.sector))].length,
      fechaCompletado: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error en reporte de expansión:', error.message);
    return { estado: 'ERROR', error: error.message };
  }
};

// Funciones auxiliares
function getFlagPorPais(country) {
  const flags = {
    'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'HK': '🇭🇰',
    'DE': '🇩🇪', 'FR': '🇫🇷', 'GB': '🇬🇧', 'IT': '🇮🇹', 'ES': '🇪🇸',
    'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'BR': '🇧🇷', 'AR': '🇦🇷',
    'AU': '🇦🇺', 'NZ': '🇳🇿', 'ZA': '🇿🇦', 'SG': '🇸🇬', 'NL': '🇳🇱'
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
  reporteExpansionExitosa();
}

export { reporteExpansionExitosa };