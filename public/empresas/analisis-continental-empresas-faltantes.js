// Análisis continental de empresas directas y cálculo de empresas faltantes
// LIBERT.IA - Distribución equilibrada por continentes

const analisisContinentalCompleto = async () => {
  console.log('🌍 ANÁLISIS CONTINENTAL: DISTRIBUCIÓN Y EMPRESAS FALTANTES');
  console.log('='.repeat(70));

  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies || data; // Manejo de diferentes formatos de respuesta

    const totalEmpresas = companies.length;
    const empresasDirectas = companies.filter(c => c.type === 'directa');
    const totalDirectas = empresasDirectas.length;

    // Mapeo de países a continentes
    const continentMapping = {
      // América del Norte
      'US': 'América del Norte', 'CA': 'América del Norte', 'MX': 'América del Norte',
      'GT': 'América del Norte', 'BZ': 'América del Norte', 'SV': 'América del Norte',
      'HN': 'América del Norte', 'NI': 'América del Norte', 'CR': 'América del Norte', 'PA': 'América del Norte',
      
      // América del Sur
      'BR': 'América del Sur', 'AR': 'América del Sur', 'CL': 'América del Sur', 'CO': 'América del Sur',
      'PE': 'América del Sur', 'VE': 'América del Sur', 'EC': 'América del Sur', 'UY': 'América del Sur',
      'PY': 'América del Sur', 'BO': 'América del Sur', 'GY': 'América del Sur', 'SR': 'América del Sur', 'GF': 'América del Sur',
      
      // Caribe
      'CU': 'Caribe', 'DO': 'Caribe', 'HT': 'Caribe', 'JM': 'Caribe', 'PR': 'Caribe', 'TT': 'Caribe',
      'BB': 'Caribe', 'BS': 'Caribe', 'BM': 'Caribe', 'KY': 'Caribe', 'VG': 'Caribe', 'VI': 'Caribe',
      
      // Europa Occidental
      'GB': 'Europa Occidental', 'FR': 'Europa Occidental', 'DE': 'Europa Occidental', 'IT': 'Europa Occidental',
      'ES': 'Europa Occidental', 'PT': 'Europa Occidental', 'NL': 'Europa Occidental', 'BE': 'Europa Occidental',
      'CH': 'Europa Occidental', 'AT': 'Europa Occidental', 'IE': 'Europa Occidental', 'LU': 'Europa Occidental',
      
      // Europa Nórdica
      'SE': 'Europa Nórdica', 'NO': 'Europa Nórdica', 'DK': 'Europa Nórdica', 'FI': 'Europa Nórdica',
      'IS': 'Europa Nórdica',
      
      // Europa Oriental
      'RU': 'Europa Oriental', 'PL': 'Europa Oriental', 'CZ': 'Europa Oriental', 'HU': 'Europa Oriental',
      'SK': 'Europa Oriental', 'RO': 'Europa Oriental', 'BG': 'Europa Oriental', 'HR': 'Europa Oriental',
      'SI': 'Europa Oriental', 'EE': 'Europa Oriental', 'LV': 'Europa Oriental', 'LT': 'Europa Oriental',
      
      // Asia Oriental
      'CN': 'Asia Oriental', 'JP': 'Asia Oriental', 'KR': 'Asia Oriental', 'TW': 'Asia Oriental',
      'HK': 'Asia Oriental', 'MO': 'Asia Oriental', 'MN': 'Asia Oriental',
      
      // Asia Meridional
      'IN': 'Asia Meridional', 'PK': 'Asia Meridional', 'BD': 'Asia Meridional', 'LK': 'Asia Meridional',
      'NP': 'Asia Meridional', 'BT': 'Asia Meridional', 'MV': 'Asia Meridional', 'AF': 'Asia Meridional',
      
      // Asia Sudoriental
      'ID': 'Asia Sudoriental', 'MY': 'Asia Sudoriental', 'TH': 'Asia Sudoriental', 'VN': 'Asia Sudoriental',
      'SG': 'Asia Sudoriental', 'PH': 'Asia Sudoriental', 'MM': 'Asia Sudoriental', 'KH': 'Asia Sudoriental',
      'LA': 'Asia Sudoriental', 'BN': 'Asia Sudoriental', 'TL': 'Asia Sudoriental',
      
      // Medio Oriente
      'SA': 'Medio Oriente', 'AE': 'Medio Oriente', 'IR': 'Medio Oriente', 'IQ': 'Medio Oriente',
      'IL': 'Medio Oriente', 'JO': 'Medio Oriente', 'LB': 'Medio Oriente', 'SY': 'Medio Oriente',
      'TR': 'Medio Oriente', 'YE': 'Medio Oriente', 'OM': 'Medio Oriente', 'QA': 'Medio Oriente',
      'KW': 'Medio Oriente', 'BH': 'Medio Oriente',
      
      // África Septentrional
      'EG': 'África Septentrional', 'LY': 'África Septentrional', 'DZ': 'África Septentrional', 
      'MA': 'África Septentrional', 'TN': 'África Septentrional', 'SD': 'África Septentrional',
      
      // África Occidental
      'NG': 'África Occidental', 'GH': 'África Occidental', 'CI': 'África Occidental', 'SN': 'África Occidental',
      'ML': 'África Occidental', 'BF': 'África Occidental', 'NE': 'África Occidental', 'SL': 'África Occidental',
      'LR': 'África Occidental', 'GN': 'África Occidental', 'GW': 'África Occidental', 'GM': 'África Occidental',
      'CV': 'África Occidental', 'MR': 'África Occidental', 'BJ': 'África Occidental', 'TG': 'África Occidental',
      
      // África Oriental
      'KE': 'África Oriental', 'ET': 'África Oriental', 'UG': 'África Oriental', 'TZ': 'África Oriental',
      'RW': 'África Oriental', 'BI': 'África Oriental', 'SO': 'África Oriental', 'DJ': 'África Oriental',
      'ER': 'África Oriental', 'SS': 'África Oriental', 'MG': 'África Oriental', 'MU': 'África Oriental',
      'SC': 'África Oriental', 'KM': 'África Oriental',
      
      // África Austral
      'ZA': 'África Austral', 'ZW': 'África Austral', 'BW': 'África Austral', 'ZM': 'África Austral',
      'MW': 'África Austral', 'MZ': 'África Austral', 'AO': 'África Austral', 'NA': 'África Austral',
      'LS': 'África Austral', 'SZ': 'África Austral',
      
      // África Central
      'CD': 'África Central', 'CF': 'África Central', 'CG': 'África Central', 'CM': 'África Central',
      'GA': 'África Central', 'GQ': 'África Central', 'TD': 'África Central', 'ST': 'África Central',
      
      // Oceanía
      'AU': 'Oceanía', 'NZ': 'Oceanía', 'FJ': 'Oceanía', 'PG': 'Oceanía', 'VU': 'Oceanía',
      'SB': 'Oceanía', 'NC': 'Oceanía', 'PF': 'Oceanía', 'CK': 'Oceanía', 'WS': 'Oceanía',
      'TO': 'Oceanía', 'KI': 'Oceanía', 'TV': 'Oceanía', 'NR': 'Oceanía', 'PW': 'Oceanía',
      'FM': 'Oceanía', 'MH': 'Oceanía'
    };

    // Análisis de distribución actual
    const distribucionActual = empresasDirectas.reduce((acc, empresa) => {
      const continente = continentMapping[empresa.country] || 'Sin Clasificar';
      if (!acc[continente]) {
        acc[continente] = {
          empresas: 0,
          paises: new Set(),
          empresasDetalle: []
        };
      }
      acc[continente].empresas++;
      acc[continente].paises.add(empresa.country);
      acc[continente].empresasDetalle.push({
        nombre: empresa.name,
        pais: empresa.country,
        sector: empresa.products?.[0] || 'No especificado'
      });
      return acc;
    }, {});

    // Análisis de todas las empresas por continente
    const distribucionTotal = companies.reduce((acc, empresa) => {
      const continente = continentMapping[empresa.country] || 'Sin Clasificar';
      if (!acc[continente]) {
        acc[continente] = {
          total: 0,
          directas: 0,
          exportadoras: 0,
          importadoras: 0,
          ambas: 0,
          paises: new Set()
        };
      }
      acc[continente].total++;
      acc[continente].paises.add(empresa.country);
      
      if (empresa.type === 'directa') acc[continente].directas++;
      else if (empresa.type === 'exporter') acc[continente].exportadoras++;
      else if (empresa.type === 'importer') acc[continente].importadoras++;
      else if (empresa.type === 'both') acc[continente].ambas++;
      
      return acc;
    }, {});

    console.log('\n📊 DISTRIBUCIÓN ACTUAL DE EMPRESAS DIRECTAS:');
    const continentesOrdenados = Object.entries(distribucionActual)
      .sort((a, b) => b[1].empresas - a[1].empresas);

    continentesOrdenados.forEach(([continente, datos]) => {
      const porcentaje = ((datos.empresas / totalDirectas) * 100).toFixed(1);
      console.log(`\n${continente.toUpperCase()}:`);
      console.log(`  • Empresas directas: ${datos.empresas} (${porcentaje}%)`);
      console.log(`  • Países representados: ${datos.paises.size}`);
      console.log(`  • Empresas: ${datos.empresasDetalle.map(e => `${e.nombre} (${e.pais})`).join(', ')}`);
    });

    console.log('\n📈 DISTRIBUCIÓN TOTAL POR CONTINENTE:');
    Object.entries(distribucionTotal)
      .sort((a, b) => b[1].total - a[1].total)
      .forEach(([continente, datos]) => {
        const porcentajeDirectas = datos.total > 0 ? ((datos.directas / datos.total) * 100).toFixed(1) : '0.0';
        console.log(`\n${continente.toUpperCase()}:`);
        console.log(`  • Total empresas: ${datos.total}`);
        console.log(`  • Directas: ${datos.directas} (${porcentajeDirectas}%)`);
        console.log(`  • Exportadoras: ${datos.exportadoras}`);
        console.log(`  • Importadoras: ${datos.importadoras}`);
        console.log(`  • Ambas: ${datos.ambas}`);
        console.log(`  • Países: ${datos.paises.size}`);
      });

    // Cálculo de distribución ideal
    const metaDistribucionIdeal = {
      'América del Norte': 0.25,      // 25% - Mercado desarrollado
      'América del Sur': 0.15,        // 15% - Mercados emergentes importantes
      'Europa Occidental': 0.20,      // 20% - Mercado desarrollado
      'Europa Oriental': 0.05,        // 5%  - Mercados en desarrollo
      'Asia Oriental': 0.15,          // 15% - Potencias económicas
      'Asia Meridional': 0.08,        // 8%  - Mercados emergentes
      'Asia Sudoriental': 0.07,       // 7%  - ASEAN
      'Medio Oriente': 0.03,          // 3%  - Economías petroleras
      'África Septentrional': 0.01,   // 1%  - Norte de África
      'África Occidental': 0.005,     // 0.5% - África Occidental
      'África Oriental': 0.005,       // 0.5% - África Oriental
      'África Austral': 0.01,         // 1%  - Sudáfrica principalmente
      'Oceanía': 0.02                 // 2%  - Australia y región
    };

    console.log('\n🎯 ANÁLISIS DE EMPRESAS FALTANTES POR CONTINENTE:');
    console.log('(Basado en distribución ideal para comercio internacional)');

    let totalFaltantes = 0;
    const planExpansion = {};

    Object.entries(metaDistribucionIdeal).forEach(([continente, porcentajeIdeal]) => {
      const empresasIdeales = Math.round(totalDirectas * porcentajeIdeal);
      const empresasActuales = distribucionActual[continente]?.empresas || 0;
      const empresasFaltantes = Math.max(0, empresasIdeales - empresasActuales);
      const diferencia = empresasActuales - empresasIdeales;

      planExpansion[continente] = {
        actual: empresasActuales,
        ideal: empresasIdeales,
        faltantes: empresasFaltantes,
        superavit: diferencia > 0 ? diferencia : 0,
        porcentajeIdeal: (porcentajeIdeal * 100).toFixed(1),
        porcentajeActual: empresasActuales > 0 ? ((empresasActuales / totalDirectas) * 100).toFixed(1) : '0.0'
      };

      totalFaltantes += empresasFaltantes;

      const estado = empresasFaltantes > 0 ? '🔴 DÉFICIT' : 
                   diferencia > 0 ? '🟢 SUPERÁVIT' : '🟡 EQUILIBRADO';

      console.log(`\n${continente.toUpperCase()}: ${estado}`);
      console.log(`  • Actual: ${empresasActuales} empresas (${planExpansion[continente].porcentajeActual}%)`);
      console.log(`  • Ideal: ${empresasIdeales} empresas (${planExpansion[continente].porcentajeIdeal}%)`);
      
      if (empresasFaltantes > 0) {
        console.log(`  • FALTAN: ${empresasFaltantes} empresas`);
      } else if (diferencia > 0) {
        console.log(`  • SUPERÁVIT: +${diferencia} empresas`);
      } else {
        console.log(`  • ✅ EQUILIBRADO`);
      }
    });

    // Recomendaciones específicas
    console.log('\n🚀 PLAN DE EXPANSIÓN RECOMENDADO:');
    console.log(`• Total empresas faltantes: ${totalFaltantes}`);
    console.log('• Prioridades de expansión:');

    const prioridades = Object.entries(planExpansion)
      .filter(([_, datos]) => datos.faltantes > 0)
      .sort((a, b) => b[1].faltantes - a[1].faltantes);

    prioridades.forEach(([continente, datos], index) => {
      console.log(`  ${index + 1}. ${continente}: +${datos.faltantes} empresas`);
    });

    // Sectores recomendados por continente
    console.log('\n💼 SECTORES ESTRATÉGICOS RECOMENDADOS POR CONTINENTE:');
    
    const sectoresPorContinente = {
      'América del Sur': ['Minería', 'Agricultura', 'Energía', 'Fintech'],
      'Europa Oriental': ['Tecnología', 'Manufactura', 'Energía'],
      'Asia Oriental': ['Tecnología', 'Manufactura', 'Comercio electrónico'],
      'Asia Meridional': ['IT Services', 'Farmacéutica', 'Textil'],
      'Asia Sudoriental': ['Palm Oil', 'Electrónicos', 'Turismo'],
      'Medio Oriente': ['Energía', 'Petroquímicos', 'Construcción'],
      'África Septentrional': ['Energía', 'Agricultura', 'Textil'],
      'África Occidental': ['Recursos naturales', 'Agricultura'],
      'África Oriental': ['Agricultura', 'Servicios financieros'],
      'África Austral': ['Minería', 'Vino', 'Servicios financieros'],
      'Oceanía': ['Minería', 'Agricultura', 'Servicios financieros']
    };

    Object.entries(sectoresPorContinente).forEach(([continente, sectores]) => {
      if (planExpansion[continente]?.faltantes > 0) {
        console.log(`\n${continente.toUpperCase()}:`);
        console.log(`  • Sectores objetivo: ${sectores.join(', ')}`);
        console.log(`  • Empresas a agregar: ${planExpansion[continente].faltantes}`);
      }
    });

    console.log('\n📊 RESUMEN EJECUTIVO:');
    console.log(`• Empresas directas actuales: ${totalDirectas}`);
    console.log(`• Distribución más equilibrada requiere: +${totalFaltantes} empresas`);
    console.log(`• Continentes con mayor déficit: ${prioridades.slice(0, 3).map(([cont, _]) => cont).join(', ')}`);
    console.log(`• Objetivo: Mejorar representación global para análisis comercial más preciso`);

    return {
      distribucionActual,
      distribucionTotal,
      planExpansion,
      totalFaltantes,
      prioridades: prioridades.map(([cont, datos]) => ({ continente: cont, faltantes: datos.faltantes })),
      sectoresRecomendados: sectoresPorContinente
    };

  } catch (error) {
    console.error('❌ Error en análisis continental:', error.message);
    return null;
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  analisisContinentalCompleto();
}

export { analisisContinentalCompleto };