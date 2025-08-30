// Análisis completo del dominio asiático alcanzado
// LIBERT.IA - Evaluación post Fase 1 y Fase 2

const analizarDominioAsiatico = async () => {
  console.log('🌏 ANÁLISIS: DOMINIO ASIÁTICO COMPLETO - LIBERT.IA');
  console.log('='.repeat(65));

  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies;

    const totalEmpresas = companies.length;
    const empresasDirectas = companies.filter(c => c.type === 'directa');
    const totalDirectas = empresasDirectas.length;
    const porcentajeDirectas = ((totalDirectas / totalEmpresas) * 100).toFixed(1);

    // Definir todos los países asiáticos
    const paisesAsiaticos = {
      'oriental': ['CN', 'JP', 'KR', 'HK', 'TW', 'MN', 'KP', 'MO'],
      'meridional': ['IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'AF'],
      'sudoriental': ['SG', 'MY', 'TH', 'ID', 'PH', 'VN', 'LA', 'KH', 'MM', 'BN', 'TL'],
      'occidental': ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'IQ', 'IR', 'IL', 'JO', 'LB', 'SY', 'TR', 'YE', 'PS'],
      'central': ['KZ', 'UZ', 'TM', 'TJ', 'KG']
    };

    const todosLosAsiaticos = Object.values(paisesAsiaticos).flat();
    const empresasAsiaticas = companies.filter(c => todosLosAsiaticos.includes(c.country));
    const directasAsiaticas = empresasAsiaticas.filter(c => c.type === 'directa');

    console.log('\n📊 MÉTRICAS GLOBALES SISTEMA:');
    console.log(`• Total empresas: ${totalEmpresas}`);
    console.log(`• Empresas directas: ${totalDirectas} (${porcentajeDirectas}%)`);
    console.log(`• Objetivo 65%: ${porcentajeDirectas >= 65 ? '✅ ALCANZADO' : `⚠️ Faltan ${Math.ceil(totalEmpresas * 0.65) - totalDirectas}`}`);

    console.log('\n🌏 DOMINIO ASIÁTICO ALCANZADO:');
    console.log(`• Total empresas asiáticas: ${empresasAsiaticas.length}`);
    console.log(`• Empresas directas asiáticas: ${directasAsiaticas.length}`);
    console.log(`• Dominación asiática: ${((empresasAsiaticas.length / totalEmpresas) * 100).toFixed(1)}%`);
    console.log(`• Eficiencia directas Asia: ${((directasAsiaticas.length / empresasAsiaticas.length) * 100).toFixed(1)}%`);

    // Análisis por subregión asiática
    console.log('\n🗺️ ANÁLISIS POR SUBREGIÓN ASIÁTICA:');
    
    Object.entries(paisesAsiaticos).forEach(([subregion, paises]) => {
      const empresasSubregion = empresasAsiaticas.filter(c => paises.includes(c.country));
      const directasSubregion = empresasSubregion.filter(c => c.type === 'directa');
      
      if (empresasSubregion.length > 0) {
        console.log(`\n${subregion.toUpperCase()}:`);
        console.log(`  🏢 Empresas: ${empresasSubregion.length}`);
        console.log(`  ⭐ Directas: ${directasSubregion.length} (${((directasSubregion.length / empresasSubregion.length) * 100).toFixed(1)}%)`);
        console.log(`  🗺️ Países cubiertos: ${[...new Set(empresasSubregion.map(c => c.country))].length}/${paises.length}`);
        
        // Top países por subregión
        const topPaises = {};
        empresasSubregion.forEach(e => {
          topPaises[e.country] = (topPaises[e.country] || 0) + 1;
        });
        const topPaisesOrdenados = Object.entries(topPaises)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);
        
        console.log(`  🏆 Top países: ${topPaisesOrdenados.map(([pais, num]) => `${pais}(${num})`).join(', ')}`);
        
        // Sectores dominantes
        const sectores = {};
        empresasSubregion.forEach(e => {
          const sector = e.sector || 'Otros';
          sectores[sector] = (sectores[sector] || 0) + 1;
        });
        const topSectores = Object.entries(sectores)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([sector, num]) => `${sector}(${num})`)
          .join(', ');
        console.log(`  💼 Sectores dominantes: ${topSectores}`);
      }
    });

    // Análisis de fortalezas comerciales por país líder
    console.log('\n🚀 FORTALEZAS COMERCIALES POR PAÍS LÍDER:');
    
    const paisesLideres = {};
    empresasAsiaticas.forEach(e => {
      if (!paisesLideres[e.country]) {
        paisesLideres[e.country] = {
          total: 0,
          directas: 0,
          sectores: new Set(),
          empresasTop: [],
          rating: 0
        };
      }
      paisesLideres[e.country].total++;
      if (e.type === 'directa') paisesLideres[e.country].directas++;
      paisesLideres[e.country].sectores.add(e.sector || 'Otros');
      paisesLideres[e.country].empresasTop.push({ name: e.name, rating: e.rating || 3.5 });
      paisesLideres[e.country].rating += (e.rating || 3.5);
    });

    // Calcular rating promedio y ordenar por total de empresas
    Object.keys(paisesLideres).forEach(pais => {
      paisesLideres[pais].rating = (paisesLideres[pais].rating / paisesLideres[pais].total).toFixed(1);
      paisesLideres[pais].empresasTop.sort((a, b) => b.rating - a.rating);
    });

    const paisesOrdenados = Object.entries(paisesLideres)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8);

    const flags = {
      'CN': '🇨🇳 China', 'JP': '🇯🇵 Japón', 'KR': '🇰🇷 Corea del Sur', 'IN': '🇮🇳 India',
      'HK': '🇭🇰 Hong Kong', 'SG': '🇸🇬 Singapur', 'TW': '🇹🇼 Taiwán', 'MY': '🇲🇾 Malasia',
      'TH': '🇹🇭 Tailandia', 'ID': '🇮🇩 Indonesia', 'PH': '🇵🇭 Filipinas', 'VN': '🇻🇳 Vietnam',
      'PK': '🇵🇰 Pakistán', 'BD': '🇧🇩 Bangladesh', 'LK': '🇱🇰 Sri Lanka'
    };

    paisesOrdenados.forEach(([pais, datos], index) => {
      const flag = flags[pais] || `🌏 ${pais}`;
      console.log(`\n${index + 1}. ${flag}:`);
      console.log(`   📊 Empresas: ${datos.total} (${datos.directas} directas)`);
      console.log(`   ⭐ Rating promedio: ${datos.rating}/5.0`);
      console.log(`   💼 Sectores: ${Array.from(datos.sectores).slice(0, 3).join(', ')}`);
      console.log(`   🏆 Top empresa: ${datos.empresasTop[0]?.name || 'N/A'}`);
    });

    // Análisis de gaps y oportunidades
    console.log('\n🔍 GAPS Y OPORTUNIDADES ASIÁTICAS:');
    
    const paisesAsiaticosCompletos = todosLosAsiaticos;
    const paisesConEmpresas = [...new Set(empresasAsiaticas.map(c => c.country))];
    const paisesSinCobertura = paisesAsiaticosCompletos.filter(p => !paisesConEmpresas.includes(p));

    if (paisesSinCobertura.length > 0) {
      console.log('\n❌ PAÍSES ASIÁTICOS SIN COBERTURA:');
      const regionesSinCobertura = {};
      
      Object.entries(paisesAsiaticos).forEach(([region, paises]) => {
        const faltantes = paises.filter(p => paisesSinCobertura.includes(p));
        if (faltantes.length > 0) {
          regionesSinCobertura[region] = faltantes;
        }
      });

      Object.entries(regionesSinCobertura).forEach(([region, paises]) => {
        console.log(`• ${region.toUpperCase()}: ${paises.join(', ')} (${paises.length} países)`);
      });
    } else {
      console.log('✅ COBERTURA ASIÁTICA COMPLETA: Todos los países asiáticos estratégicos cubiertos');
    }

    // Impacto en capacidades LIBERT.IA
    console.log('\n🎯 IMPACTO EN CAPACIDADES LIBERT.IA:');
    console.log('✅ Hub tecnológico global: China, Japón, Corea del Sur, India');
    console.log('✅ Servicios IT y outsourcing: India líder mundial');
    console.log('✅ Manufactura y cadena de suministro: China dominio absoluto');
    console.log('✅ Innovación y semiconductores: Japón, Corea del Sur, Taiwán');
    console.log('✅ Fintech y pagos digitales: China, Corea del Sur, India');
    console.log('✅ E-commerce y plataformas: China, Japón, Corea del Sur');
    console.log('✅ Farmacéutica y genéricos: India, Bangladesh');

    // Métricas de dominio asiático
    const dominioAsiatico = (empresasAsiaticas.length / totalEmpresas) * 100;
    const eficienciaDirectas = (directasAsiaticas.length / empresasAsiaticas.length) * 100;
    const paisesAsiaticosCubiertos = paisesConEmpresas.length;
    const sectoresAsiaticos = [...new Set(empresasAsiaticas.map(c => c.sector))].length;

    console.log('\n📈 MÉTRICAS DE DOMINIO ASIÁTICO:');
    console.log(`• Dominación asiática: ${dominioAsiatico.toFixed(1)}%`);
    console.log(`• Eficiencia empresas directas: ${eficienciaDirectas.toFixed(1)}%`);
    console.log(`• Países asiáticos cubiertos: ${paisesAsiaticosCubiertos}`);
    console.log(`• Sectores asiáticos: ${sectoresAsiaticos}`);
    console.log(`• Rating promedio asiático: ${(empresasAsiaticas.reduce((sum, e) => sum + (e.rating || 3.5), 0) / empresasAsiaticas.length).toFixed(1)}/5.0`);

    // Recomendación estratégica
    console.log('\n🚀 RECOMENDACIÓN ESTRATÉGICA:');
    
    if (dominioAsiatico >= 70) {
      console.log('🎯 DOMINIO ASIÁTICO ALCANZADO - Cambiar a otros continentes');
      console.log('• Prioridad 1: Europa Occidental (mercados maduros)');
      console.log('• Prioridad 2: América del Sur (recursos naturales)');
      console.log('• Prioridad 3: África (mercados emergentes)');
    } else if (dominioAsiatico >= 50) {
      console.log('🔄 COMPLETAR DOMINIO ASIÁTICO - Fase 3');
      console.log('• Asia Sudoriental: Indonesia, Tailandia, Vietnam, Malasia');
      console.log('• Asia Occidental: Arabia Saudí, UAE, Qatar, Israel');
    } else {
      console.log('📈 FORTALECER ASIA - Continuar expansión');
      console.log('• Agregar más empresas en países líderes');
      console.log('• Expandir a países asiáticos sin cobertura');
    }

    const estadoDominio = dominioAsiatico >= 70 ? 'DOMINIO_COMPLETO' : 
                         dominioAsiatico >= 50 ? 'DOMINIO_AVANZADO' : 'DOMINIO_INICIAL';

    console.log(`\n${dominioAsiatico >= 70 ? '🏆' : dominioAsiatico >= 50 ? '🎯' : '📊'} ESTADO: ${estadoDominio}`);
    console.log(`${dominioAsiatico >= 70 ? '🌏 ASIA CONQUISTADA' : '🚀 EXPANSIÓN ASIÁTICA EN CURSO'}: LIBERT.IA`);

    return {
      estado: 'ANALISIS_DOMINIO_ASIATICO_COMPLETADO',
      totalEmpresas,
      empresasAsiaticas: empresasAsiaticas.length,
      directasAsiaticas: directasAsiaticas.length,
      dominioAsiatico: parseFloat(dominioAsiatico.toFixed(1)),
      paisesAsiaticosCubiertos,
      estadoDominio,
      proximaRecomendacion: dominioAsiatico >= 70 ? 'EUROPA_OCCIDENTAL' : 'ASIA_SUDORIENTAL',
      fechaAnalisis: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error en análisis de dominio asiático:', error.message);
    return { estado: 'ERROR', error: error.message };
  }
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  analizarDominioAsiatico();
}

export { analizarDominioAsiatico };