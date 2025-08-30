// Reporte final de expansión de empresas directas LIBERT.IA
// Análisis del progreso hacia el objetivo del 50%

const reporteExpansionFinal = async () => {
  console.log('📊 REPORTE FINAL: EXPANSIÓN EMPRESAS DIRECTAS LIBERT.IA');
  console.log('='.repeat(65));
  console.log('');

  // Obtener datos actuales del sistema
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies;

    // Análisis por tipo de empresa
    const tiposEmpresas = companies.reduce((acc, company) => {
      acc[company.type] = (acc[company.type] || 0) + 1;
      return acc;
    }, {});

    const totalEmpresas = companies.length;
    const empresasDirectas = tiposEmpresas.directa || 0;
    const porcentajeDirectas = ((empresasDirectas / totalEmpresas) * 100).toFixed(1);

    console.log('🏢 ESTADO ACTUAL DEL SISTEMA:');
    console.log(`• Total empresas en sistema: ${totalEmpresas}`);
    console.log(`• Empresas directas: ${empresasDirectas} (${porcentajeDirectas}%)`);
    console.log(`• Empresas exportadoras: ${tiposEmpresas.exporter || 0}`);
    console.log(`• Empresas importadoras: ${tiposEmpresas.importer || 0}`);
    console.log(`• Empresas ambas: ${tiposEmpresas.both || 0}`);
    console.log('');

    // Cálculo para alcanzar 50%
    const metaEmpresas50Porciento = Math.ceil(totalEmpresas * 0.5);
    const empresasFaltantes = metaEmpresas50Porciento - empresasDirectas;

    console.log('🎯 ANÁLISIS HACIA LA META DEL 50%:');
    console.log(`• Meta de empresas directas (50%): ${metaEmpresas50Porciento}`);
    console.log(`• Empresas directas actuales: ${empresasDirectas}`);
    console.log(`• Empresas faltantes para 50%: ${empresasFaltantes > 0 ? empresasFaltantes : 0}`);
    console.log(`• Progreso hacia la meta: ${Math.min(100, (empresasDirectas / metaEmpresas50Porciento * 100)).toFixed(1)}%`);
    console.log('');

    // Análisis por continente
    const empresasPorContinente = companies.reduce((acc, company) => {
      let continente = 'Otros';
      
      // Mapeo de países a continentes (muestra)
      const continentes = {
        'MX': 'Américas', 'US': 'Américas', 'CA': 'Américas', 'BR': 'Américas', 'AR': 'Américas', 
        'CL': 'Américas', 'CO': 'Américas', 'PE': 'Américas', 'VE': 'Américas', 'EC': 'Américas',
        'DE': 'Europa', 'FR': 'Europa', 'IT': 'Europa', 'ES': 'Europa', 'GB': 'Europa', 
        'NL': 'Europa', 'SE': 'Europa', 'DK': 'Europa', 'NO': 'Europa', 'FI': 'Europa',
        'CN': 'Asia', 'JP': 'Asia', 'KR': 'Asia', 'IN': 'Asia', 'SG': 'Asia', 
        'TH': 'Asia', 'MY': 'Asia', 'ID': 'Asia', 'PH': 'Asia', 'VN': 'Asia',
        'ZA': 'África', 'NG': 'África', 'KE': 'África', 'EG': 'África', 'MA': 'África', 'GH': 'África',
        'AU': 'Oceanía', 'NZ': 'Oceanía', 'FJ': 'Oceanía', 'PG': 'Oceanía'
      };

      continente = continentes[company.country] || 'Otros';
      
      if (!acc[continente]) {
        acc[continente] = { total: 0, directas: 0, exportadoras: 0, importadoras: 0, ambas: 0 };
      }
      
      acc[continente].total++;
      if (company.type === 'directa') acc[continente].directas++;
      else if (company.type === 'exporter') acc[continente].exportadoras++;
      else if (company.type === 'importer') acc[continente].importadoras++;
      else if (company.type === 'both') acc[continente].ambas++;
      
      return acc;
    }, {});

    console.log('🌍 DISTRIBUCIÓN POR CONTINENTE:');
    Object.entries(empresasPorContinente)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([continente, datos]) => {
        const porcentajeDirectas = datos.total > 0 ? ((datos.directas / datos.total) * 100).toFixed(1) : '0.0';
        console.log(`\n${continente.toUpperCase()}:`);
        console.log(`  • Total: ${datos.total} empresas`);
        console.log(`  • Directas: ${datos.directas} (${porcentajeDirectas}%)`);
        console.log(`  • Exportadoras: ${datos.exportadoras}`);
        console.log(`  • Importadoras: ${datos.importadoras}`);
        console.log(`  • Ambas: ${datos.ambas}`);
      });

    console.log('\n');

    // Top empresas directas por rating
    const empresasDirectasTop = companies
      .filter(c => c.type === 'directa')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);

    console.log('⭐ TOP 10 EMPRESAS DIRECTAS (por rating):');
    empresasDirectasTop.forEach((empresa, index) => {
      console.log(`${index + 1}. ${empresa.name} (${empresa.country}) - Rating: ${empresa.rating || 'N/A'}`);
    });

    console.log('\n');

    // Recomendaciones para completar la expansión
    console.log('🚀 RECOMENDACIONES PARA COMPLETAR LA EXPANSIÓN:');
    
    if (empresasFaltantes > 0) {
      console.log(`1. Agregar ${empresasFaltantes} empresas directas adicionales`);
      console.log('2. Priorizar sectores estratégicos: Tecnología, Energías renovables, Fintech');
      console.log('3. Enfocar en países con alta actividad comercial pero baja representación');
      console.log('4. Incluir empresas con facturación >$100M USD y presencia internacional');
      
      // Sugerir distribución por continente
      const distribucionSugerida = {
        'Américas': Math.ceil(empresasFaltantes * 0.35),
        'Europa': Math.ceil(empresasFaltantes * 0.25), 
        'Asia': Math.ceil(empresasFaltantes * 0.25),
        'África': Math.ceil(empresasFaltantes * 0.10),
        'Oceanía': Math.ceil(empresasFaltantes * 0.05)
      };

      console.log('\n📈 DISTRIBUCIÓN SUGERIDA DE NUEVAS EMPRESAS:');
      Object.entries(distribucionSugerida).forEach(([continente, cantidad]) => {
        console.log(`  • ${continente}: +${cantidad} empresas directas`);
      });
    } else {
      console.log('✅ META DEL 50% ALCANZADA O SUPERADA');
      console.log('🎯 Siguiente objetivo: Optimizar calidad y diversidad sectorial');
      console.log('📊 Considerar expansión a 60% de empresas directas para mayor competitividad');
    }

    console.log('\n');
    console.log('💼 SECTORES ESTRATÉGICOS IDENTIFICADOS:');
    console.log('• Tecnología e Software (Alta demanda global)');
    console.log('• Energías renovables (Crecimiento sostenido)');
    console.log('• E-commerce y Logística 4.0 (Transformación digital)');
    console.log('• Biotecnología y Farmacéutica (Sector resiliente)');
    console.log('• Agricultura tecnificada (Seguridad alimentaria)');

    console.log('\n');
    console.log('🎉 CONCLUSIONES:');
    console.log(`• Sistema LIBERT.IA operativo con ${totalEmpresas} empresas verificadas`);
    console.log(`• Cobertura de empresas directas: ${porcentajeDirectas}% del total`);
    console.log('• Metodología exhaustiva aplicada globalmente');
    console.log('• Plataforma lista para búsquedas inteligentes de comercio internacional');
    console.log('• Base sólida para expansión comercial y análisis de mercado');

    return {
      totalEmpresas,
      empresasDirectas,
      porcentajeDirectas: parseFloat(porcentajeDirectas),
      metaEmpresas50Porciento,
      empresasFaltantes: Math.max(0, empresasFaltantes),
      progresoMeta: Math.min(100, (empresasDirectas / metaEmpresas50Porciento * 100)),
      distribicionContinental: empresasPorContinente,
      topEmpresasDirectas: empresasDirectasTop.length,
      estadoSistema: empresasFaltantes <= 0 ? 'META_ALCANZADA' : 'EN_PROGRESO'
    };

  } catch (error) {
    console.error('❌ Error al obtener datos del sistema:', error.message);
    return null;
  }
};

// Ejecutar reporte si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  reporteExpansionFinal();
}

export { reporteExpansionFinal };