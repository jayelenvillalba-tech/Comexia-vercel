// Estrategia de expansión continental para LIBERT.IA
// Análisis y recomendaciones para crecimiento equilibrado por continentes

const analizarEstrategiaExpansion = async () => {
  console.log('🌍 ESTRATEGIA DE EXPANSIÓN CONTINENTAL - LIBERT.IA');
  console.log('='.repeat(60));

  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const companies = data.companies;

    const totalEmpresas = companies.length;
    const empresasDirectas = companies.filter(c => c.type === 'directa');
    const totalDirectas = empresasDirectas.length;

    // Mapeo continental mejorado
    const continentMapping = {
      // América del Norte
      'US': 'América del Norte', 'CA': 'América del Norte', 'MX': 'América del Norte',
      
      // América Central y Caribe
      'GT': 'América Central', 'BZ': 'América Central', 'SV': 'América Central',
      'HN': 'América Central', 'NI': 'América Central', 'CR': 'América Central',
      'PA': 'América Central', 'CU': 'Caribe', 'JM': 'Caribe', 'HT': 'Caribe',
      'DO': 'Caribe', 'TT': 'Caribe', 'BB': 'Caribe',

      // América del Sur
      'BR': 'América del Sur', 'AR': 'América del Sur', 'CL': 'América del Sur',
      'CO': 'América del Sur', 'PE': 'América del Sur', 'VE': 'América del Sur',
      'EC': 'América del Sur', 'UY': 'América del Sur', 'PY': 'América del Sur',
      'BO': 'América del Sur', 'GY': 'América del Sur', 'SR': 'América del Sur',

      // Europa Occidental
      'DE': 'Europa Occidental', 'FR': 'Europa Occidental', 'GB': 'Europa Occidental',
      'IT': 'Europa Occidental', 'ES': 'Europa Occidental', 'NL': 'Europa Occidental',
      'BE': 'Europa Occidental', 'CH': 'Europa Occidental', 'AT': 'Europa Occidental',
      'IE': 'Europa Occidental', 'PT': 'Europa Occidental', 'LU': 'Europa Occidental',

      // Europa Nórdica
      'SE': 'Europa Nórdica', 'NO': 'Europa Nórdica', 'DK': 'Europa Nórdica',
      'FI': 'Europa Nórdica', 'IS': 'Europa Nórdica',

      // Europa Oriental
      'PL': 'Europa Oriental', 'CZ': 'Europa Oriental', 'SK': 'Europa Oriental',
      'HU': 'Europa Oriental', 'RO': 'Europa Oriental', 'BG': 'Europa Oriental',
      'HR': 'Europa Oriental', 'SI': 'Europa Oriental', 'EE': 'Europa Oriental',
      'LV': 'Europa Oriental', 'LT': 'Europa Oriental',

      // Asia Oriental
      'CN': 'Asia Oriental', 'JP': 'Asia Oriental', 'KR': 'Asia Oriental',
      'TW': 'Asia Oriental', 'HK': 'Asia Oriental', 'MO': 'Asia Oriental',
      'MN': 'Asia Oriental', 'KP': 'Asia Oriental',

      // Asia Sudoriental
      'SG': 'Asia Sudoriental', 'MY': 'Asia Sudoriental', 'TH': 'Asia Sudoriental',
      'ID': 'Asia Sudoriental', 'PH': 'Asia Sudoriental', 'VN': 'Asia Sudoriental',
      'LA': 'Asia Sudoriental', 'KH': 'Asia Sudoriental', 'MM': 'Asia Sudoriental',
      'BN': 'Asia Sudoriental', 'TL': 'Asia Sudoriental',

      // Asia Meridional
      'IN': 'Asia Meridional', 'PK': 'Asia Meridional', 'BD': 'Asia Meridional',
      'LK': 'Asia Meridional', 'NP': 'Asia Meridional', 'BT': 'Asia Meridional',
      'MV': 'Asia Meridional', 'AF': 'Asia Meridional',

      // Medio Oriente
      'SA': 'Medio Oriente', 'AE': 'Medio Oriente', 'QA': 'Medio Oriente',
      'KW': 'Medio Oriente', 'BH': 'Medio Oriente', 'OM': 'Medio Oriente',
      'IQ': 'Medio Oriente', 'IR': 'Medio Oriente', 'IL': 'Medio Oriente',
      'JO': 'Medio Oriente', 'LB': 'Medio Oriente', 'SY': 'Medio Oriente',
      'TR': 'Medio Oriente', 'YE': 'Medio Oriente',

      // África del Norte
      'EG': 'África del Norte', 'LY': 'África del Norte', 'TN': 'África del Norte',
      'DZ': 'África del Norte', 'MA': 'África del Norte', 'SD': 'África del Norte',

      // África Occidental
      'NG': 'África Occidental', 'GH': 'África Occidental', 'CI': 'África Occidental',
      'SN': 'África Occidental', 'ML': 'África Occidental', 'BF': 'África Occidental',
      'NE': 'África Occidental', 'GN': 'África Occidental', 'SL': 'África Occidental',
      'LR': 'África Occidental', 'TG': 'África Occidental', 'BJ': 'África Occidental',

      // África Oriental
      'KE': 'África Oriental', 'ET': 'África Oriental', 'UG': 'África Oriental',
      'TZ': 'África Oriental', 'RW': 'África Oriental', 'BI': 'África Oriental',
      'SO': 'África Oriental', 'DJ': 'África Oriental', 'ER': 'África Oriental',
      'SS': 'África Oriental',

      // África Central
      'CD': 'África Central', 'CF': 'África Central', 'TD': 'África Central',
      'CM': 'África Central', 'GA': 'África Central', 'GQ': 'África Central',
      'CG': 'África Central', 'AO': 'África Central',

      // África Austral
      'ZA': 'África Austral', 'BW': 'África Austral', 'NA': 'África Austral',
      'ZM': 'África Austral', 'ZW': 'África Austral', 'MW': 'África Austral',
      'MZ': 'África Austral', 'SZ': 'África Austral', 'LS': 'África Austral',
      'MG': 'África Austral', 'MU': 'África Austral',

      // Oceanía
      'AU': 'Oceanía', 'NZ': 'Oceanía', 'PG': 'Oceanía', 'FJ': 'Oceanía',
      'VU': 'Oceanía', 'SB': 'Oceanía', 'NC': 'Oceanía', 'PF': 'Oceanía'
    };

    // Análisis de distribución continental actual
    const distribucionContinental = empresasDirectas.reduce((acc, empresa) => {
      const continente = continentMapping[empresa.country] || 'Sin Clasificar';
      if (!acc[continente]) {
        acc[continente] = {
          empresas: 0,
          paises: new Set(),
          sectores: new Set(),
          empresasDetalle: [],
          potencial: 0,
          prioridad: 0
        };
      }
      acc[continente].empresas++;
      acc[continente].paises.add(empresa.country);
      acc[continente].sectores.add(empresa.sector || 'Tecnología');
      acc[continente].empresasDetalle.push({
        nombre: empresa.name,
        pais: empresa.country,
        rating: empresa.rating || 4.0,
        sector: empresa.sector || 'Tecnología'
      });
      return acc;
    }, {});

    // Calcular potencial y prioridad por continente
    const metricasExpansion = {
      'América del Norte': { potencial: 95, prioridad: 3, razon: 'Saturado pero crítico' },
      'Europa Occidental': { potencial: 90, prioridad: 4, razon: 'Mercado maduro con alta demanda' },
      'Asia Oriental': { potencial: 98, prioridad: 5, razon: 'Mayor crecimiento económico mundial' },
      'América del Sur': { potencial: 85, prioridad: 4, razon: 'Mercado emergente con recursos' },
      'Asia Sudoriental': { potencial: 92, prioridad: 5, razon: 'Hub comercial en expansión' },
      'Europa Nórdica': { potencial: 88, prioridad: 3, razon: 'Innovación y sustentabilidad' },
      'Medio Oriente': { potencial: 87, prioridad: 4, razon: 'Diversificación económica' },
      'África Austral': { potencial: 82, prioridad: 3, razon: 'Gateway al continente africano' },
      'Asia Meridional': { potencial: 94, prioridad: 5, razon: 'Mercado de consumo masivo' },
      'Oceanía': { potencial: 78, prioridad: 2, razon: 'Estabilidad y recursos naturales' },
      'Europa Oriental': { potencial: 86, prioridad: 3, razon: 'Integración UE en curso' },
      'América Central': { potencial: 75, prioridad: 2, razon: 'Puente comercial estratégico' },
      'África Occidental': { potencial: 80, prioridad: 3, razon: 'Recursos y población joven' },
      'África Oriental': { potencial: 79, prioridad: 3, razon: 'Corredor comercial emergente' },
      'África del Norte': { potencial: 76, prioridad: 2, razon: 'Puente África-Europa-Medio Oriente' }
    };

    // Asignar métricas a distribución
    Object.keys(distribucionContinental).forEach(continente => {
      if (metricasExpansion[continente]) {
        distribucionContinental[continente].potencial = metricasExpansion[continente].potencial;
        distribucionContinental[continente].prioridad = metricasExpansion[continente].prioridad;
        distribucionContinental[continente].razon = metricasExpansion[continente].razon;
      }
    });

    console.log('\n📊 ESTADO ACTUAL POR CONTINENTE:');
    const continentesOrdenados = Object.entries(distribucionContinental)
      .sort((a, b) => b[1].prioridad - a[1].prioridad || b[1].potencial - a[1].potencial);

    continentesOrdenados.forEach(([continente, datos]) => {
      const porcentaje = ((datos.empresas / totalDirectas) * 100).toFixed(1);
      console.log(`\n${continente.toUpperCase()}:`);
      console.log(`  🏢 Empresas: ${datos.empresas} (${porcentaje}%)`);
      console.log(`  🗺️  Países: ${datos.paises.size}`);
      console.log(`  📈 Potencial: ${datos.potencial}/100`);
      console.log(`  ⭐ Prioridad: ${datos.prioridad}/5`);
      console.log(`  💡 Razón: ${datos.razon || 'Análisis pendiente'}`);
      console.log(`  💼 Sectores: ${Array.from(datos.sectores).slice(0, 3).join(', ')}`);
    });

    // Recomendaciones de expansión por prioridad
    console.log('\n🎯 RECOMENDACIONES DE EXPANSIÓN POR PRIORIDAD:');

    // Prioridad 5 (Máxima)
    const prioridad5 = continentesOrdenados.filter(([cont, datos]) => datos.prioridad === 5);
    if (prioridad5.length > 0) {
      console.log('\n🔥 PRIORIDAD MÁXIMA (5/5):');
      prioridad5.forEach(([continente, datos]) => {
        console.log(`• ${continente}: ${datos.empresas} empresas → Expandir +15-20 empresas`);
        console.log(`  → Sectores foco: Tecnología, Fintech, E-commerce, Manufactura`);
      });
    }

    // Prioridad 4 (Alta)
    const prioridad4 = continentesOrdenados.filter(([cont, datos]) => datos.prioridad === 4);
    if (prioridad4.length > 0) {
      console.log('\n🚀 PRIORIDAD ALTA (4/5):');
      prioridad4.forEach(([continente, datos]) => {
        console.log(`• ${continente}: ${datos.empresas} empresas → Expandir +10-15 empresas`);
        console.log(`  → Sectores foco: Energía, Minería, Servicios Financieros, Agricultura`);
      });
    }

    // Prioridad 3 (Media)
    const prioridad3 = continentesOrdenados.filter(([cont, datos]) => datos.prioridad === 3);
    if (prioridad3.length > 0) {
      console.log('\n📈 PRIORIDAD MEDIA (3/5):');
      prioridad3.forEach(([continente, datos]) => {
        console.log(`• ${continente}: ${datos.empresas} empresas → Expandir +5-10 empresas`);
        console.log(`  → Sectores foco: Recursos Naturales, Infraestructura, Telecomunicaciones`);
      });
    }

    // Análisis de gaps y oportunidades
    console.log('\n🔍 ANÁLISIS DE GAPS Y OPORTUNIDADES:');
    
    const continentesFaltantes = Object.keys(metricasExpansion).filter(cont => 
      !Object.keys(distribucionContinental).includes(cont)
    );

    if (continentesFaltantes.length > 0) {
      console.log('\n❌ CONTINENTES SIN COBERTURA:');
      continentesFaltantes.forEach(continente => {
        const metricas = metricasExpansion[continente];
        console.log(`• ${continente}: Potencial ${metricas.potencial}/100, Prioridad ${metricas.prioridad}/5`);
        console.log(`  → ${metricas.razon}`);
      });
    }

    // Plan de expansión recomendado
    console.log('\n📋 PLAN DE EXPANSIÓN RECOMENDADO (PRÓXIMOS 3 MESES):');
    
    console.log('\n🎯 FASE 1 (Mes 1) - Prioridad Máxima:');
    console.log('• Asia Oriental: +20 empresas (China, Japón, Corea del Sur)');
    console.log('• Asia Meridional: +15 empresas (India, Pakistán, Bangladesh)');
    console.log('• Asia Sudoriental: +10 empresas (Indonesia, Tailandia, Vietnam)');

    console.log('\n🚀 FASE 2 (Mes 2) - Prioridad Alta:');
    console.log('• Europa Occidental: +15 empresas (Italia, España, Países Bajos)');
    console.log('• América del Sur: +10 empresas (Perú, Colombia, Chile)');
    console.log('• Medio Oriente: +8 empresas (UAE, Arabia Saudí, Qatar)');

    console.log('\n📈 FASE 3 (Mes 3) - Expansión Continentes Nuevos:');
    console.log('• África Occidental: +5 empresas (Nigeria, Ghana, Costa de Marfil)');
    console.log('• Europa Oriental: +8 empresas (Polonia, República Checa, Hungría)');
    console.log('• América Central: +5 empresas (Costa Rica, Panamá, Guatemala)');

    console.log('\n💼 SECTORES ESTRATÉGICOS POR CONTINENTE:');
    console.log('• Asia: Tecnología, E-commerce, Manufactura, Energía renovable');
    console.log('• Europa: Fintech, Sostenibilidad, Industria 4.0, Servicios financieros');
    console.log('• América: Recursos naturales, Agricultura tech, Energía, Minería');
    console.log('• África: Fintech, Telecomunicaciones, Agricultura, Infraestructura');
    console.log('• Medio Oriente: Energía, Petroquímicos, Construcción, Turismo');

    // Métricas objetivo
    const empresasObjetivo = totalEmpresas + 90; // +90 empresas en 3 meses
    const directasObjetivo = Math.ceil(empresasObjetivo * 0.65);

    console.log('\n🎯 MÉTRICAS OBJETIVO (3 MESES):');
    console.log(`• Total empresas objetivo: ${empresasObjetivo} (+90)`);
    console.log(`• Empresas directas objetivo: ${directasObjetivo} (65%)`);
    console.log(`• Continentes cubiertos objetivo: 15+ continentes`);
    console.log(`• Países cubiertos objetivo: 80+ países`);
    console.log(`• Sectores estratégicos objetivo: 25+ sectores`);

    return {
      estado: 'ESTRATEGIA_CONTINENTAL_COMPLETADA',
      totalActual: totalEmpresas,
      directasActuales: totalDirectas,
      continentesCubiertos: Object.keys(distribucionContinental).length,
      recomendacionExpansion: 'CONTINENTE_POR_CONTINENTE',
      prioridadMaxima: prioridad5.map(([cont]) => cont),
      empresasObjetivo,
      fechaAnalisis: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error en análisis de estrategia:', error.message);
    return { estado: 'ERROR', error: error.message };
  }
};

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  analizarEstrategiaExpansion();
}

export { analizarEstrategiaExpansion };