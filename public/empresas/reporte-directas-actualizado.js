// Reporte de Empresas Directas Actualizado - Porcentaje de Totalidad Global

const reporteDirectasActualizado = async () => {
  console.log('📊 REPORTE EMPRESAS DIRECTAS ACTUALIZADO - LIBERT.IA');
  console.log('='.repeat(60));

  // Obtener datos actualizados
  const response = await fetch('http://localhost:5000/api/companies');
  const data = await response.json();
  const todasEmpresas = data.companies;

  // Categorizar empresas
  const directas = todasEmpresas.filter(e => e.type === 'directa');
  const indirectas = todasEmpresas.filter(e => ['exporter', 'importer', 'both'].includes(e.type));
  const pymes = todasEmpresas.filter(e => e.employeeCount && e.employeeCount <= 250);
  const cooperativas = todasEmpresas.filter(e => 
    e.name.toLowerCase().includes('cooperative') ||
    e.name.toLowerCase().includes('coop') ||
    e.businessType === 'cooperative'
  );
  const estatales = todasEmpresas.filter(e => 
    e.name.toLowerCase().includes('national') ||
    e.name.toLowerCase().includes('central bank') ||
    e.name.toLowerCase().includes('state') ||
    e.businessType === 'state-owned'
  );

  console.log('\n📈 ESTADO ACTUAL DEL SISTEMA:');
  console.log(`• Total empresas globales: ${todasEmpresas.length}`);
  console.log(`• Empresas directas: ${directas.length}`);
  console.log(`• Empresas indirectas: ${indirectas.length}`);
  console.log(`• PYMEs: ${pymes.length}`);
  console.log(`• Cooperativas: ${cooperativas.length}`);
  console.log(`• Estatales: ${estatales.length}`);

  // Calcular porcentajes actuales
  const porcentajeDirectas = ((directas.length / todasEmpresas.length) * 100).toFixed(2);
  const porcentajeIndirectas = ((indirectas.length / todasEmpresas.length) * 100).toFixed(2);
  const porcentajePymes = ((pymes.length / todasEmpresas.length) * 100).toFixed(2);
  const porcentajeCooperativas = ((cooperativas.length / todasEmpresas.length) * 100).toFixed(2);
  const porcentajeEstatales = ((estatales.length / todasEmpresas.length) * 100).toFixed(2);

  console.log('\n📊 DISTRIBUCIÓN PORCENTUAL ACTUAL:');
  console.log(`• Directas: ${porcentajeDirectas}% (${directas.length} empresas)`);
  console.log(`• Indirectas: ${porcentajeIndirectas}% (${indirectas.length} empresas)`);
  console.log(`• PYMEs: ${porcentajePymes}% (${pymes.length} empresas)`);
  console.log(`• Cooperativas: ${porcentajeCooperativas}% (${cooperativas.length} empresas)`);
  console.log(`• Estatales: ${porcentajeEstatales}% (${estatales.length} empresas)`);

  // Análisis del objetivo 100% equilibrado (20% cada categoría)
  console.log('\n🎯 ANÁLISIS VS OBJETIVO 100% EQUILIBRADO (20% cada categoría):');
  
  const objetivoPorcentaje = 20.0;
  const diferenciaDirectas = parseFloat(porcentajeDirectas) - objetivoPorcentaje;
  const diferenciaIndirectas = parseFloat(porcentajeIndirectas) - objetivoPorcentaje;
  const diferenciaPymes = parseFloat(porcentajePymes) - objetivoPorcentaje;
  const diferenciaCooperativas = parseFloat(porcentajeCooperativas) - objetivoPorcentaje;
  const diferenciaEstatales = parseFloat(porcentajeEstatales) - objetivoPorcentaje;

  console.log(`• Directas: ${porcentajeDirectas}% vs 20% objetivo → ${diferenciaDirectas > 0 ? '+' : ''}${diferenciaDirectas.toFixed(2)} puntos`);
  console.log(`• Indirectas: ${porcentajeIndirectas}% vs 20% objetivo → ${diferenciaIndirectas > 0 ? '+' : ''}${diferenciaIndirectas.toFixed(2)} puntos`);
  console.log(`• PYMEs: ${porcentajePymes}% vs 20% objetivo → ${diferenciaPymes > 0 ? '+' : ''}${diferenciaPymes.toFixed(2)} puntos`);
  console.log(`• Cooperativas: ${porcentajeCooperativas}% vs 20% objetivo → ${diferenciaCooperativas > 0 ? '+' : ''}${diferenciaCooperativas.toFixed(2)} puntos`);
  console.log(`• Estatales: ${porcentajeEstatales}% vs 20% objetivo → ${diferenciaEstatales > 0 ? '+' : ''}${diferenciaEstatales.toFixed(2)} puntos`);

  // Distribución continental de empresas directas
  const continentes = {
    'América del Norte': ['US', 'CA', 'MX'],
    'Europa': ['DE', 'GB', 'FR', 'CH', 'SE', 'DK', 'NO', 'IT', 'ES', 'NL', 'BE', 'AT', 'IE', 'FI', 'PL', 'CZ', 'PT', 'GR', 'HU', 'RO'],
    'Asia': ['CN', 'JP', 'KR', 'IN', 'TW', 'SG', 'HK', 'ID', 'MY', 'TH', 'PH', 'VN', 'KH', 'MM', 'LA'],
    'América del Sur': ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'UY', 'BO', 'EC', 'PY', 'GY', 'SR'],
    'Oceanía': ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'WS', 'TO', 'PW', 'NR'],
    'África': ['ZA', 'NG', 'EG', 'MA', 'KE', 'GH', 'TN', 'DZ', 'AO', 'ET', 'TZ', 'UG', 'RW', 'SN', 'CI', 'BW']
  };

  console.log('\n🌍 DISTRIBUCIÓN CONTINENTAL EMPRESAS DIRECTAS:');
  let totalDirectasContabilizadas = 0;
  
  Object.entries(continentes).forEach(([continente, paises]) => {
    const directasContinente = directas.filter(e => paises.includes(e.country));
    const porcentajeContinente = ((directasContinente.length / directas.length) * 100).toFixed(1);
    totalDirectasContabilizadas += directasContinente.length;
    
    console.log(`• ${getContinenteIcon(continente)} ${continente}: ${directasContinente.length} empresas (${porcentajeContinente}%)`);
  });

  console.log(`• Total contabilizadas: ${totalDirectasContabilizadas}/${directas.length}`);

  // Análisis de crecimiento
  console.log('\n📈 ANÁLISIS DE CRECIMIENTO:');
  console.log('• Empresas directas anteriores: 359');
  console.log(`• Empresas directas actuales: ${directas.length}`);
  console.log(`• Incremento neto: +${directas.length - 359} empresas directas`);
  console.log(`• Crecimiento porcentual: +${(((directas.length - 359) / 359) * 100).toFixed(1)}%`);

  // Proyección hacia el objetivo 500 empresas
  console.log('\n🚀 PROYECCIÓN HACIA OBJETIVO 500 EMPRESAS:');
  const empresasFaltantes = 500 - todasEmpresas.length;
  const directasObjetivo = 100;
  const directasExcedentes = directas.length - directasObjetivo;
  
  console.log(`• Empresas faltantes para 500 total: ${empresasFaltantes}`);
  console.log(`• Directas objetivo: ${directasObjetivo}`);
  console.log(`• Directas actuales: ${directas.length}`);
  console.log(`• Directas excedentes: ${directasExcedentes}`);
  console.log(`• Estrategia: Reclasificar ${directasExcedentes} directas como especializadas`);

  return {
    estadoActual: {
      totalEmpresas: todasEmpresas.length,
      directas: directas.length,
      indirectas: indirectas.length,
      pymes: pymes.length,
      cooperativas: cooperativas.length,
      estatales: estatales.length
    },
    porcentajes: {
      directas: parseFloat(porcentajeDirectas),
      indirectas: parseFloat(porcentajeIndirectas),
      pymes: parseFloat(porcentajePymes),
      cooperativas: parseFloat(porcentajeCooperativas),
      estatales: parseFloat(porcentajeEstatales)
    },
    objetivo500: {
      faltantes: empresasFaltantes,
      directasExcedentes: directasExcedentes
    }
  };
};

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

// Ejecutar
if (import.meta.url === `file://${process.argv[1]}`) {
  reporteDirectasActualizado();
}

export { reporteDirectasActualizado };