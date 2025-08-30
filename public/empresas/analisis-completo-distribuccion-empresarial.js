// Análisis Completo de Distribución Empresarial Global - LIBERT.IA
// Sistema 875 empresas: Análisis detallado por categorías y distribución continental

const analizarDistribucionEmpresarial = async () => {
  console.log('📊 ANÁLISIS COMPLETO DISTRIBUCIÓN EMPRESARIAL GLOBAL - LIBERT.IA');
  console.log('='.repeat(75));

  try {
    // Obtener todas las empresas del sistema
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    if (!response.ok || !data.companies) {
      throw new Error('Error al obtener datos de empresas');
    }

    const todasEmpresas = data.companies;
    const totalEmpresas = todasEmpresas.length;

    console.log(`\n🏢 TOTAL EMPRESAS EN SISTEMA: ${totalEmpresas.toLocaleString()}`);
    console.log('='.repeat(50));

    // Clasificar empresas por tipo
    const directas = todasEmpresas.filter(e => 
      e.type === 'directa' || 
      e.type === 'direct' || 
      (e.businessType === 'corporation' && !['exporter', 'importer', 'both', 'pyme', 'cooperative', 'state-owned'].includes(e.type))
    );

    const indirectas = todasEmpresas.filter(e => 
      ['exporter', 'importer', 'both'].includes(e.type)
    );

    const pymes = todasEmpresas.filter(e => 
      e.type === 'pyme' || 
      (e.employeeCount && e.employeeCount <= 250 && e.type !== 'cooperative' && e.type !== 'state-owned')
    );

    const cooperativas = todasEmpresas.filter(e => 
      e.type === 'cooperative' || 
      e.businessType === 'cooperative'
    );

    const estatales = todasEmpresas.filter(e => 
      e.type === 'state-owned' || 
      e.businessType === 'state-owned' ||
      e.ownership === 'state_owned'
    );

    // Verificar clasificación completa
    const clasificadas = directas.length + indirectas.length + pymes.length + cooperativas.length + estatales.length;
    const noClasificadas = totalEmpresas - clasificadas;

    console.log('\n📈 DISTRIBUCIÓN POR CATEGORÍAS:');
    console.log('-'.repeat(50));
    console.log(`• Empresas Directas:     ${directas.length.toString().padStart(3)} (${((directas.length/totalEmpresas)*100).toFixed(1)}%)`);
    console.log(`• Empresas Indirectas:   ${indirectas.length.toString().padStart(3)} (${((indirectas.length/totalEmpresas)*100).toFixed(1)}%)`);
    console.log(`• PYMEs:                 ${pymes.length.toString().padStart(3)} (${((pymes.length/totalEmpresas)*100).toFixed(1)}%)`);
    console.log(`• Cooperativas:          ${cooperativas.length.toString().padStart(3)} (${((cooperativas.length/totalEmpresas)*100).toFixed(1)}%)`);
    console.log(`• Empresas Estatales:    ${estatales.length.toString().padStart(3)} (${((estatales.length/totalEmpresas)*100).toFixed(1)}%)`);
    
    if (noClasificadas > 0) {
      console.log(`• No Clasificadas:       ${noClasificadas.toString().padStart(3)} (${((noClasificadas/totalEmpresas)*100).toFixed(1)}%)`);
    }
    
    console.log('-'.repeat(50));
    console.log(`• TOTAL VERIFICADO:      ${clasificadas.toString().padStart(3)} empresas`);

    // Análisis detallado de empresas indirectas
    if (indirectas.length > 0) {
      const exportadoras = indirectas.filter(e => e.type === 'exporter');
      const importadoras = indirectas.filter(e => e.type === 'importer');
      const mixtas = indirectas.filter(e => e.type === 'both');

      console.log('\n🔄 DETALLE EMPRESAS INDIRECTAS:');
      console.log('-'.repeat(40));
      console.log(`• Exportadoras:          ${exportadoras.length} (${((exportadoras.length/indirectas.length)*100).toFixed(1)}%)`);
      console.log(`• Importadoras:          ${importadoras.length} (${((importadoras.length/indirectas.length)*100).toFixed(1)}%)`);
      console.log(`• Mixtas (Export+Import): ${mixtas.length} (${((mixtas.length/indirectas.length)*100).toFixed(1)}%)`);
    }

    // Análisis por continente
    const continentes = {
      'América del Norte': ['US', 'CA', 'MX'],
      'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
      'América Central/Caribe': ['CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'BZ', 'CU', 'DO', 'JM', 'HT', 'TT'],
      'Europa Occidental': ['GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT'],
      'Europa Nórdica': ['SE', 'DK', 'NO', 'FI', 'IS'],
      'Europa Oriental': ['PL', 'CZ', 'HU', 'RO', 'BG', 'SK', 'SI', 'HR', 'EE', 'LV', 'LT'],
      'Asia Oriental': ['CN', 'JP', 'KR', 'TW', 'HK', 'MO'],
      'Asia Meridional': ['IN', 'PK', 'BD', 'LK', 'NP', 'BT', 'MV', 'AF'],
      'Asia Sudoriental': ['ID', 'MY', 'TH', 'PH', 'VN', 'SG', 'MM', 'KH', 'LA', 'BN', 'TL'],
      'Asia Occidental': ['TR', 'SA', 'AE', 'IR', 'IQ', 'IL', 'JO', 'LB', 'SY', 'YE', 'OM', 'QA', 'KW', 'BH'],
      'África Septentrional': ['EG', 'LY', 'TN', 'DZ', 'MA', 'SD'],
      'África Occidental': ['NG', 'GH', 'CI', 'SN', 'ML', 'BF', 'NE', 'GN', 'SL', 'LR', 'GM', 'GW', 'CV'],
      'África Oriental': ['KE', 'ET', 'TZ', 'UG', 'RW', 'BI', 'SO', 'DJ', 'ER', 'SS'],
      'África Central': ['CD', 'CM', 'CF', 'TD', 'CG', 'GA', 'GQ', 'ST'],
      'África Austral': ['ZA', 'ZW', 'BW', 'NA', 'ZM', 'MW', 'MZ', 'SZ', 'LS'],
      'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'NC', 'PF', 'SB', 'VU', 'WS', 'TO', 'KI', 'NR', 'TV', 'PW', 'MH', 'FM']
    };

    console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL DETALLADA:');
    console.log('='.repeat(75));

    Object.entries(continentes).forEach(([region, paises]) => {
      const empresasRegion = todasEmpresas.filter(e => paises.includes(e.country));
      
      if (empresasRegion.length > 0) {
        const directasReg = empresasRegion.filter(e => directas.includes(e));
        const indirectasReg = empresasRegion.filter(e => indirectas.includes(e));
        const pymesReg = empresasRegion.filter(e => pymes.includes(e));
        const cooperativasReg = empresasRegion.filter(e => cooperativas.includes(e));
        const estatalesReg = empresasRegion.filter(e => estatales.includes(e));

        console.log(`\n📍 ${region}:`);
        console.log(`   Total: ${empresasRegion.length} empresas (${((empresasRegion.length/totalEmpresas)*100).toFixed(1)}%)`);
        console.log(`   • Directas: ${directasReg.length} | Indirectas: ${indirectasReg.length} | PYMEs: ${pymesReg.length}`);
        console.log(`   • Cooperativas: ${cooperativasReg.length} | Estatales: ${estatalesReg.length}`);
      }
    });

    // Análisis sectorial
    const sectores = {};
    todasEmpresas.forEach(empresa => {
      const sector = empresa.sector || 'general';
      if (!sectores[sector]) {
        sectores[sector] = {
          total: 0,
          directas: 0,
          indirectas: 0,
          pymes: 0,
          cooperativas: 0,
          estatales: 0
        };
      }
      sectores[sector].total++;
      
      if (directas.includes(empresa)) sectores[sector].directas++;
      else if (indirectas.includes(empresa)) sectores[sector].indirectas++;
      else if (pymes.includes(empresa)) sectores[sector].pymes++;
      else if (cooperativas.includes(empresa)) sectores[sector].cooperativas++;
      else if (estatales.includes(empresa)) sectores[sector].estatales++;
    });

    console.log('\n🏭 DISTRIBUCIÓN SECTORIAL (TOP 15):');
    console.log('='.repeat(75));
    
    const sectoresOrdenados = Object.entries(sectores)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 15);

    sectoresOrdenados.forEach(([sector, data]) => {
      console.log(`\n🔹 ${sector.toUpperCase()}:`);
      console.log(`   Total: ${data.total} empresas (${((data.total/totalEmpresas)*100).toFixed(1)}%)`);
      console.log(`   Dir: ${data.directas} | Ind: ${data.indirectas} | PYMEs: ${data.pymes} | Coop: ${data.cooperativas} | Est: ${data.estatales}`);
    });

    // Análisis de tamaño empresarial
    const companiasPorTamano = {
      'Micro (1-10 empleados)': 0,
      'Pequeña (11-50 empleados)': 0,
      'Mediana (51-250 empleados)': 0,
      'Grande (251-1000 empleados)': 0,
      'Corporación (1001-10000 empleados)': 0,
      'Multinacional (10001+ empleados)': 0,
      'Sin datos': 0
    };

    todasEmpresas.forEach(empresa => {
      const empleados = empresa.employeeCount;
      if (!empleados) {
        companiasPorTamano['Sin datos']++;
      } else if (empleados <= 10) {
        companiasPorTamano['Micro (1-10 empleados)']++;
      } else if (empleados <= 50) {
        companiasPorTamano['Pequeña (11-50 empleados)']++;
      } else if (empleados <= 250) {
        companiasPorTamano['Mediana (51-250 empleados)']++;
      } else if (empleados <= 1000) {
        companiasPorTamano['Grande (251-1000 empleados)']++;
      } else if (empleados <= 10000) {
        companiasPorTamano['Corporación (1001-10000 empleados)']++;
      } else {
        companiasPorTamano['Multinacional (10001+ empleados)']++;
      }
    });

    console.log('\n👥 DISTRIBUCIÓN POR TAMAÑO EMPRESARIAL:');
    console.log('='.repeat(60));
    Object.entries(companiasPorTamano).forEach(([categoria, cantidad]) => {
      if (cantidad > 0) {
        console.log(`• ${categoria}: ${cantidad} (${((cantidad/totalEmpresas)*100).toFixed(1)}%)`);
      }
    });

    // Resumen ejecutivo
    console.log('\n📋 RESUMEN EJECUTIVO LIBERT.IA:');
    console.log('='.repeat(60));
    console.log(`✅ Sistema con ${totalEmpresas.toLocaleString()} empresas verificadas`);
    console.log(`✅ Cobertura en ${Object.keys(continentes).length} regiones globales`);
    console.log(`✅ Diversificación en ${Object.keys(sectores).length} sectores industriales`);
    console.log(`✅ ${((clasificadas/totalEmpresas)*100).toFixed(1)}% empresas correctamente clasificadas`);
    
    const paisesUnicos = [...new Set(todasEmpresas.map(e => e.country))].length;
    console.log(`✅ Presencia en ${paisesUnicos} países diferentes`);
    
    const empresasVerificadas = todasEmpresas.filter(e => e.verified).length;
    console.log(`✅ ${((empresasVerificadas/totalEmpresas)*100).toFixed(1)}% empresas verificadas`);

    return {
      resumen: {
        totalEmpresas,
        directas: directas.length,
        indirectas: indirectas.length,
        pymes: pymes.length,
        cooperativas: cooperativas.length,
        estatales: estatales.length,
        noClasificadas
      },
      porcentajes: {
        directas: ((directas.length/totalEmpresas)*100).toFixed(1),
        indirectas: ((indirectas.length/totalEmpresas)*100).toFixed(1),
        pymes: ((pymes.length/totalEmpresas)*100).toFixed(1),
        cooperativas: ((cooperativas.length/totalEmpresas)*100).toFixed(1),
        estatales: ((estatales.length/totalEmpresas)*100).toFixed(1)
      },
      distribuccionContinental: Object.fromEntries(
        Object.entries(continentes).map(([region, paises]) => [
          region,
          todasEmpresas.filter(e => paises.includes(e.country)).length
        ])
      ),
      estadisticas: {
        paisesUnicos,
        sectoresUnicos: Object.keys(sectores).length,
        empresasVerificadas,
        porcentajeVerificacion: ((empresasVerificadas/totalEmpresas)*100).toFixed(1)
      }
    };

  } catch (error) {
    console.error('❌ Error en análisis:', error.message);
    return null;
  }
};

// Ejecutar análisis
if (import.meta.url === `file://${process.argv[1]}`) {
  analizarDistribucionEmpresarial();
}

export { analizarDistribucionEmpresarial };