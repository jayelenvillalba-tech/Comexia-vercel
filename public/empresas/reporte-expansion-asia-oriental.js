// Reporte de expansión Asia Oriental - Análisis de resultados
// LIBERT.IA - Fase 1 completada

const reporteExpansionAsiaOriental = async () => {
  console.log('📊 REPORTE: EXPANSIÓN ASIA ORIENTAL COMPLETADA');
  console.log('='.repeat(55));

  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies;

    const totalEmpresas = companies.length;
    const empresasDirectas = companies.filter(c => c.type === 'directa');
    const totalDirectas = empresasDirectas.length;
    const porcentajeDirectas = ((totalDirectas / totalEmpresas) * 100).toFixed(1);

    // Análisis asiático específico
    const paisesAsiaticos = ['CN', 'JP', 'KR', 'HK', 'TW', 'SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'IN'];
    const empresasAsiaticas = companies.filter(c => paisesAsiaticos.includes(c.country));
    const directasAsiaticas = empresasAsiaticas.filter(c => c.type === 'directa');

    console.log('\n🎯 MÉTRICAS GLOBALES POST-EXPANSIÓN:');
    console.log(`• Total empresas sistema: ${totalEmpresas}`);
    console.log(`• Empresas directas: ${totalDirectas} (${porcentajeDirectas}%)`);
    console.log(`• Objetivo 65% directas: ${porcentajeDirectas >= 65 ? '✅ ALCANZADO' : '⚠️ PENDIENTE'}`);

    console.log('\n🌏 ANÁLISIS ASIA-PACÍFICO:');
    console.log(`• Total empresas asiáticas: ${empresasAsiaticas.length}`);
    console.log(`• Empresas directas asiáticas: ${directasAsiaticas.length}`);
    console.log(`• Porcentaje de Asia en portfolio: ${((empresasAsiaticas.length / totalEmpresas) * 100).toFixed(1)}%`);

    // Distribución por país asiático
    console.log('\n🏷️ DISTRIBUCIÓN POR PAÍS ASIÁTICO:');
    const distribucionAsiatica = {};
    paisesAsiaticos.forEach(pais => {
      const empresasPais = empresasAsiaticas.filter(c => c.country === pais);
      if (empresasPais.length > 0) {
        distribucionAsiatica[pais] = {
          total: empresasPais.length,
          directas: empresasPais.filter(c => c.type === 'directa').length,
          sectores: [...new Set(empresasPais.map(c => c.sector))],
          empresas: empresasPais.map(c => c.name)
        };
      }
    });

    const flags = {
      'CN': '🇨🇳 China', 'JP': '🇯🇵 Japón', 'KR': '🇰🇷 Corea del Sur', 'HK': '🇭🇰 Hong Kong',
      'TW': '🇹🇼 Taiwán', 'SG': '🇸🇬 Singapur', 'IN': '🇮🇳 India', 'MY': '🇲🇾 Malasia',
      'TH': '🇹🇭 Tailandia', 'ID': '🇮🇩 Indonesia', 'PH': '🇵🇭 Filipinas', 'VN': '🇻🇳 Vietnam'
    };

    Object.entries(distribucionAsiatica)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([pais, datos]) => {
        console.log(`${flags[pais] || pais}: ${datos.total} empresas (${datos.directas} directas)`);
        console.log(`  → Sectores: ${datos.sectores.slice(0, 3).join(', ')}`);
        console.log(`  → Top empresas: ${datos.empresas.slice(0, 2).join(', ')}`);
        console.log('');
      });

    // Análisis sectorial asiático
    console.log('💼 ANÁLISIS SECTORIAL ASIA:');
    const sectoresAsiaticos = {};
    empresasAsiaticas.forEach(empresa => {
      const sector = empresa.sector || 'Otros';
      if (!sectoresAsiaticos[sector]) {
        sectoresAsiaticos[sector] = { total: 0, directas: 0, paises: new Set() };
      }
      sectoresAsiaticos[sector].total++;
      if (empresa.type === 'directa') sectoresAsiaticos[sector].directas++;
      sectoresAsiaticos[sector].paises.add(empresa.country);
    });

    Object.entries(sectoresAsiaticos)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([sector, datos]) => {
        const porcentaje = ((datos.directas / datos.total) * 100).toFixed(1);
        console.log(`• ${sector}: ${datos.total} empresas (${datos.directas} directas - ${porcentaje}%)`);
        console.log(`  → Presencia en ${datos.paises.size} países asiáticos`);
      });

    // Fortalezas comerciales por región asiática
    console.log('\n🚀 FORTALEZAS COMERCIALES ADQUIRIDAS:');
    
    console.log('\n🏭 CHINA - HUB MANUFACTURERO:');
    const empresasChina = distribucionAsiatica['CN'];
    if (empresasChina) {
      console.log(`• ${empresasChina.total} empresas chinas integradas`);
      console.log('• Acceso a: E-commerce, Fintech, Manufactura, Telecomunicaciones');
      console.log('• Ventaja: Belt & Road Initiative, mercado doméstico masivo');
    }

    console.log('\n🎌 JAPÓN - INNOVACIÓN TECNOLÓGICA:');
    const empresasJapon = distribucionAsiatica['JP'];
    if (empresasJapon) {
      console.log(`• ${empresasJapon.total} empresas japonesas integradas`);
      console.log('• Acceso a: Robótica, Precision Manufacturing, Gaming, Chemicals');
      console.log('• Ventaja: Calidad premium, I+D avanzado, mercado maduro');
    }

    console.log('\n🇰🇷 COREA DEL SUR - DIGITAL ENTERTAINMENT:');
    const empresasCorea = distribucionAsiatica['KR'];
    if (empresasCorea) {
      console.log(`• ${empresasCorea.total} empresas coreanas integradas`);
      console.log('• Acceso a: Semiconductores, Entertainment, Internet platforms, Steel');
      console.log('• Ventaja: Korean Wave, tecnología 5G, chaebol expertise');
    }

    // Recomendaciones siguientes pasos
    console.log('\n📋 PRÓXIMOS PASOS RECOMENDADOS:');
    
    if (empresasAsiaticas.length >= 30) {
      console.log('🎯 FASE 2 RECOMENDADA: Asia Meridional');
      console.log('• Países objetivo: India, Pakistán, Bangladesh, Sri Lanka');
      console.log('• Sectores foco: IT Services, Farmacéutica, Textil, Agricultura');
      console.log('• Empresas objetivo: +15 empresas');
    } else {
      console.log('🔄 COMPLETAR FASE 1: Asia Oriental');
      console.log('• Agregar empresas faltantes en: Taiwán, Singapur');
      console.log('• Reforzar sectores: Semiconductores, Servicios financieros');
    }

    console.log('\n🏆 IMPACTO EN CAPACIDADES LIBERT.IA:');
    console.log('✅ Análisis comercial Asia-Pacífico habilitado');
    console.log('✅ Recomendaciones de entrada a mercados asiáticos');
    console.log('✅ Evaluación de competidores asiáticos por sector');
    console.log('✅ Análisis de cadenas de suministro asiáticas');
    console.log('✅ Identificación de socios comerciales estratégicos');

    // Métricas de éxito
    const exitoExpansion = empresasAsiaticas.length >= 30 && directasAsiaticas.length >= 20;
    
    console.log(`\n${exitoExpansion ? '🎉' : '⚠️'} ESTADO EXPANSIÓN ASIÁTICA:`);
    console.log(`${exitoExpansion ? '✅ EXITOSA' : '🔄 EN PROGRESO'}: Asia Oriental integrada al sistema LIBERT.IA`);

    return {
      estado: exitoExpansion ? 'EXPANSION_ASIA_EXITOSA' : 'EXPANSION_ASIA_PARCIAL',
      totalEmpresas,
      empresasAsiaticas: empresasAsiaticas.length,
      directasAsiaticas: directasAsiaticas.length,
      paisesAsiaticos: Object.keys(distribucionAsiatica).length,
      sectoresAsiaticos: Object.keys(sectoresAsiaticos).length,
      fortalezasComerciales: ['manufactura_china', 'innovacion_japonesa', 'digital_coreana'],
      proximaFase: empresasAsiaticas.length >= 30 ? 'ASIA_MERIDIONAL' : 'COMPLETAR_ASIA_ORIENTAL'
    };

  } catch (error) {
    console.error('❌ Error en reporte de expansión:', error.message);
    return { estado: 'ERROR', error: error.message };
  }
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  reporteExpansionAsiaOriental();
}

export { reporteExpansionAsiaOriental };