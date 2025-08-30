// Expansión de empresas directas al 50% del total
// Plan estratégico para agregar 49 empresas directas adicionales

const expansionEmpresasDirectas50Porciento = () => {
  console.log('🎯 PLAN DE EXPANSIÓN: EMPRESAS DIRECTAS AL 50%');
  console.log('='.repeat(55));
  
  const estadoActual = {
    empresasTotales: 284,
    empresasDirectasActuales: 93,
    porcentajeActual: 33,
    metaEmpresasDirectas: 142, // 50% de 284
    empresasAgregar: 49
  };

  console.log('📊 ESTADO ACTUAL:');
  console.log(`• Total empresas: ${estadoActual.empresasTotales}`);
  console.log(`• Empresas directas actuales: ${estadoActual.empresasDirectasActuales} (${estadoActual.porcentajeActual}%)`);
  console.log(`• Meta empresas directas: ${estadoActual.metaEmpresasDirectas} (50%)`);
  console.log(`• Empresas directas a agregar: ${estadoActual.empresasAgregar}`);
  console.log('');

  // Distribución estratégica por continente
  const planExpansion = {
    americas: {
      actual: 45,
      agregar: 15,
      nuevo: 60,
      sectores: ['Fintech', 'E-commerce', 'AgTech', 'Energías renovables', 'Logistics 4.0'],
      paises: ['México', 'Brasil', 'Colombia', 'Chile', 'Argentina', 'Perú', 'Costa Rica']
    },
    europa: {
      actual: 18,
      agregar: 12,
      nuevo: 30,
      sectores: ['Digital Banking', 'Sustainable Tech', 'Pharmaceutical', 'Aerospace', 'Automotive'],
      paises: ['Alemania', 'Francia', 'Países Bajos', 'Suecia', 'Dinamarca', 'Finlandia']
    },
    asia: {
      actual: 15,
      agregar: 12,
      nuevo: 27,
      sectores: ['Semiconductor', 'E-commerce', 'Manufacturing', 'Robotics', 'Green Energy'],
      paises: ['China', 'Japón', 'Corea del Sur', 'Singapur', 'Tailandia', 'Malasia', 'India']
    },
    africa: {
      actual: 8,
      agregar: 6,
      nuevo: 14,
      sectores: ['Mining Tech', 'Agricultural Processing', 'Mobile Banking', 'Solar Energy'],
      paises: ['Sudáfrica', 'Nigeria', 'Kenia', 'Ghana', 'Marruecos', 'Egipto']
    },
    oceania: {
      actual: 7,
      agregar: 4,
      nuevo: 11,
      sectores: ['Mining Services', 'Agricultural Export', 'Tourism Tech', 'Marine Technology'],
      paises: ['Australia', 'Nueva Zelanda', 'Fiji', 'Papua Nueva Guinea']
    }
  };

  console.log('🌍 PLAN DE EXPANSIÓN POR CONTINENTE:');
  Object.entries(planExpansion).forEach(([continente, plan]) => {
    console.log(`\n${continente.toUpperCase()}:`);
    console.log(`  • Actual: ${plan.actual} → Nuevo: ${plan.nuevo} (+${plan.agregar})`);
    console.log(`  • Sectores estratégicos: ${plan.sectores.join(', ')}`);
    console.log(`  • Países objetivo: ${plan.paises.join(', ')}`);
  });

  // Criterios de selección
  const criteriosSeleccion = [
    'Facturación anual superior a $100M USD',
    'Presencia en múltiples mercados internacionales',
    'Actividad de importación/exportación documentada',
    'Registro en bolsas de valores o certificaciones internacionales',
    'Participación en tratados comerciales relevantes',
    'Innovación tecnológica en su sector',
    'Sostenibilidad y responsabilidad corporativa'
  ];

  console.log('\n✅ CRITERIOS DE SELECCIÓN:');
  criteriosSeleccion.forEach((criterio, index) => {
    console.log(`${index + 1}. ${criterio}`);
  });

  // Fuentes de verificación
  const fuentesVerificacion = [
    'Registros mercantiles oficiales',
    'Bases de datos de aduanas',
    'Bolsas de valores internacionales',
    'Cámaras de comercio bilaterales',
    'Organizaciones sectoriales',
    'Reportes anuales corporativos',
    'Bases de datos comerciales especializadas'
  ];

  console.log('\n📋 FUENTES DE VERIFICACIÓN:');
  fuentesVerificacion.forEach(fuente => console.log(`  ✓ ${fuente}`));

  // Timeline de implementación
  console.log('\n⏰ TIMELINE DE IMPLEMENTACIÓN:');
  console.log('• Fase 1 (Semana 1): Américas - 15 empresas');
  console.log('• Fase 2 (Semana 2): Europa - 12 empresas');
  console.log('• Fase 3 (Semana 3): Asia - 12 empresas');
  console.log('• Fase 4 (Semana 4): África - 6 empresas');
  console.log('• Fase 5 (Semana 5): Oceanía - 4 empresas');
  console.log('• Total: 5 semanas para completar expansión');

  console.log('\n🎯 RESULTADO FINAL ESPERADO:');
  console.log(`• Empresas directas: 142 (50% del total)`);
  console.log(`• Empresas indirectas: 50 (18% del total)`);
  console.log(`• PYMEs: 52 (18% del total)`);
  console.log(`• Cooperativas: 43 (15% del total)`);
  console.log(`• Estatales: 46 (16% del total)`);
  console.log(`• TOTAL: 333 empresas verificadas`);

  return {
    estadoActual,
    planExpansion,
    criteriosSeleccion,
    fuentesVerificacion,
    timelineImplementacion: '5 semanas',
    resultadoFinal: '142 empresas directas (50%)'
  };
};

// Ejecutar plan
const planExpansion = expansionEmpresasDirectas50Porciento();

// Empresas directas específicas para agregar
const nuevasEmpresasDirectas = {
  americas: [
    // México
    { nombre: 'Cemex', sector: 'Construcción', pais: 'México', hsCode: '2523', tipo: 'directa' },
    { nombre: 'América Móvil', sector: 'Telecomunicaciones', pais: 'México', hsCode: '8517', tipo: 'directa' },
    { nombre: 'Grupo Modelo', sector: 'Bebidas', pais: 'México', hsCode: '2203', tipo: 'directa' },
    
    // Brasil
    { nombre: 'Petrobras', sector: 'Energía', pais: 'Brasil', hsCode: '2709', tipo: 'directa' },
    { nombre: 'Embraer', sector: 'Aeroespacial', pais: 'Brasil', hsCode: '8802', tipo: 'directa' },
    { nombre: 'JBS', sector: 'Alimentos', pais: 'Brasil', hsCode: '0201', tipo: 'directa' },
    
    // Colombia
    { nombre: 'Ecopetrol', sector: 'Energía', pais: 'Colombia', hsCode: '2709', tipo: 'directa' },
    { nombre: 'Grupo Nutresa', sector: 'Alimentos', pais: 'Colombia', hsCode: '1806', tipo: 'directa' },
    
    // Chile
    { nombre: 'Codelco', sector: 'Minería', pais: 'Chile', hsCode: '7403', tipo: 'directa' },
    { nombre: 'Falabella', sector: 'Retail', pais: 'Chile', hsCode: '6204', tipo: 'directa' },
    
    // Argentina
    { nombre: 'YPF', sector: 'Energía', pais: 'Argentina', hsCode: '2709', tipo: 'directa' },
    { nombre: 'Techint', sector: 'Construcción', pais: 'Argentina', hsCode: '7304', tipo: 'directa' },
    
    // Perú
    { nombre: 'Southern Copper', sector: 'Minería', pais: 'Perú', hsCode: '7403', tipo: 'directa' },
    
    // Costa Rica
    { nombre: 'Intel Costa Rica', sector: 'Tecnología', pais: 'Costa Rica', hsCode: '8542', tipo: 'directa' },
    
    // Canadá
    { nombre: 'Shopify', sector: 'E-commerce', pais: 'Canadá', hsCode: '8471', tipo: 'directa' }
  ],
  
  europa: [
    // Alemania
    { nombre: 'SAP', sector: 'Software', pais: 'Alemania', hsCode: '8523', tipo: 'directa' },
    { nombre: 'Siemens', sector: 'Tecnología', pais: 'Alemania', hsCode: '8501', tipo: 'directa' },
    { nombre: 'Adidas', sector: 'Deportes', pais: 'Alemania', hsCode: '6404', tipo: 'directa' },
    
    // Francia
    { nombre: 'Airbus', sector: 'Aeroespacial', pais: 'Francia', hsCode: '8802', tipo: 'directa' },
    { nombre: 'Danone', sector: 'Alimentos', pais: 'Francia', hsCode: '0401', tipo: 'directa' },
    { nombre: 'L\'Oréal', sector: 'Cosméticos', pais: 'Francia', hsCode: '3304', tipo: 'directa' },
    
    // Países Bajos
    { nombre: 'ASML', sector: 'Semiconductores', pais: 'Países Bajos', hsCode: '8486', tipo: 'directa' },
    { nombre: 'Royal Dutch Shell', sector: 'Energía', pais: 'Países Bajos', hsCode: '2709', tipo: 'directa' },
    
    // Suecia
    { nombre: 'Spotify', sector: 'Tecnología', pais: 'Suecia', hsCode: '8523', tipo: 'directa' },
    { nombre: 'H&M', sector: 'Textil', pais: 'Suecia', hsCode: '6204', tipo: 'directa' },
    
    // Dinamarca
    { nombre: 'Novo Nordisk', sector: 'Farmacéutica', pais: 'Dinamarca', hsCode: '3004', tipo: 'directa' },
    
    // Finlandia
    { nombre: 'Nokia', sector: 'Telecomunicaciones', pais: 'Finlandia', hsCode: '8517', tipo: 'directa' }
  ],
  
  asia: [
    // China
    { nombre: 'Alibaba', sector: 'E-commerce', pais: 'China', hsCode: '8471', tipo: 'directa' },
    { nombre: 'Tencent', sector: 'Tecnología', pais: 'China', hsCode: '8523', tipo: 'directa' },
    { nombre: 'BYD', sector: 'Automotriz', pais: 'China', hsCode: '8703', tipo: 'directa' },
    
    // Japón
    { nombre: 'SoftBank', sector: 'Telecomunicaciones', pais: 'Japón', hsCode: '8517', tipo: 'directa' },
    { nombre: 'Nintendo', sector: 'Videojuegos', pais: 'Japón', hsCode: '9504', tipo: 'directa' },
    { nombre: 'Fast Retailing (Uniqlo)', sector: 'Textil', pais: 'Japón', hsCode: '6204', tipo: 'directa' },
    
    // Corea del Sur
    { nombre: 'TSMC', sector: 'Semiconductores', pais: 'Corea del Sur', hsCode: '8542', tipo: 'directa' },
    { nombre: 'Naver', sector: 'Tecnología', pais: 'Corea del Sur', hsCode: '8523', tipo: 'directa' },
    
    // Singapur
    { nombre: 'Sea Limited', sector: 'E-commerce', pais: 'Singapur', hsCode: '8471', tipo: 'directa' },
    
    // Tailandia
    { nombre: 'CP Group', sector: 'Alimentos', pais: 'Tailandia', hsCode: '0207', tipo: 'directa' },
    
    // India
    { nombre: 'Infosys', sector: 'Software', pais: 'India', hsCode: '8523', tipo: 'directa' },
    
    // Malasia
    { nombre: 'Genting', sector: 'Servicios', pais: 'Malasia', hsCode: '9504', tipo: 'directa' }
  ],
  
  africa: [
    // Sudáfrica
    { nombre: 'MTN Group', sector: 'Telecomunicaciones', pais: 'Sudáfrica', hsCode: '8517', tipo: 'directa' },
    { nombre: 'Shoprite', sector: 'Retail', pais: 'Sudáfrica', hsCode: '1905', tipo: 'directa' },
    
    // Nigeria
    { nombre: 'Dangote Group', sector: 'Cemento', pais: 'Nigeria', hsCode: '2523', tipo: 'directa' },
    
    // Kenia
    { nombre: 'Safaricom', sector: 'Telecomunicaciones', pais: 'Kenia', hsCode: '8517', tipo: 'directa' },
    
    // Marruecos
    { nombre: 'OCP Group', sector: 'Química', pais: 'Marruecos', hsCode: '3103', tipo: 'directa' },
    
    // Egipto
    { nombre: 'Orascom Construction', sector: 'Construcción', pais: 'Egipto', hsCode: '2523', tipo: 'directa' }
  ],
  
  oceania: [
    // Australia
    { nombre: 'Atlassian', sector: 'Software', pais: 'Australia', hsCode: '8523', tipo: 'directa' },
    { nombre: 'Canva', sector: 'Tecnología', pais: 'Australia', hsCode: '8523', tipo: 'directa' },
    
    // Nueva Zelanda
    { nombre: 'Xero', sector: 'Software', pais: 'Nueva Zelanda', hsCode: '8523', tipo: 'directa' },
    
    // Fiji
    { nombre: 'Fiji Water', sector: 'Bebidas', pais: 'Fiji', hsCode: '2201', tipo: 'directa' }
  ]
};

console.log('\n🏢 NUEVAS EMPRESAS DIRECTAS SELECCIONADAS:');
console.log(`Total empresas a agregar: ${Object.values(nuevasEmpresasDirectas).flat().length}`);

export { expansionEmpresasDirectas50Porciento, nuevasEmpresasDirectas };