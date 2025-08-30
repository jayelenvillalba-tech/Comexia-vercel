// Verificación sistemática de América del Sur - Sistema de testing
// Prueba todos los países de América del Sur para asegurar alineación completa

const SOUTH_AMERICA_COUNTRIES = [
  { code: 'AR', name: 'Argentina', testProduct: 'carne', expectedSection: 'I' },
  { code: 'BR', name: 'Brasil', testProduct: 'soja', expectedSection: 'II' },
  { code: 'CL', name: 'Chile', testProduct: 'cobre', expectedSection: 'V' },
  { code: 'CO', name: 'Colombia', testProduct: 'cafe', expectedSection: 'II' },
  { code: 'PE', name: 'Perú', testProduct: 'oro', expectedSection: 'XIV' },
  { code: 'EC', name: 'Ecuador', testProduct: 'banano', expectedSection: 'II' },
  { code: 'UY', name: 'Uruguay', testProduct: 'carne', expectedSection: 'I' },
  { code: 'PY', name: 'Paraguay', testProduct: 'soja', expectedSection: 'II' },
  { code: 'BO', name: 'Bolivia', testProduct: 'gas', expectedSection: 'V' },
  { code: 'VE', name: 'Venezuela', testProduct: 'petroleo', expectedSection: 'V' },
  { code: 'GY', name: 'Guyana', testProduct: 'oro', expectedSection: 'XIV' },
  { code: 'SR', name: 'Suriname', testProduct: 'oro', expectedSection: 'XIV' },
  { code: 'GF', name: 'Guayana Francesa', testProduct: 'oro', expectedSection: 'XIV' }
];

async function testCountry(country) {
  try {
    const response = await fetch(`http://localhost:5000/api/hs-search?q=${country.testProduct}&country=${country.code}&operation=export`);
    const data = await response.json();
    
    const hasResults = data.partidas && data.partidas.length > 0;
    const hasWarnings = data.warnings && data.warnings.length > 0;
    const restrictionWarnings = data.warnings ? data.warnings.filter(w => w.severity === 'blocked' || w.severity === 'warning') : [];
    
    return {
      country: country.name,
      code: country.code,
      product: country.testProduct,
      success: hasResults,
      partidas: data.partidas?.length || 0,
      warnings: restrictionWarnings.length,
      restrictions: restrictionWarnings.map(w => w.message),
      status: hasResults ? 'FUNCIONANDO' : 'ERROR'
    };
  } catch (error) {
    return {
      country: country.name,
      code: country.code,
      product: country.testProduct,
      success: false,
      error: error.message,
      status: 'ERROR DE CONEXIÓN'
    };
  }
}

async function runFullSouthAmericaVerification() {
  console.log('🌎 VERIFICACIÓN SISTEMÁTICA DE AMÉRICA DEL SUR');
  console.log('==================================================');
  
  const results = [];
  
  for (const country of SOUTH_AMERICA_COUNTRIES) {
    const result = await testCountry(country);
    results.push(result);
    
    console.log(`${result.status === 'FUNCIONANDO' ? '✅' : '❌'} ${result.country} (${result.code})`);
    console.log(`   Producto: ${result.product} | Partidas: ${result.partidas} | Restricciones: ${result.warnings}`);
    if (result.restrictions && result.restrictions.length > 0) {
      console.log(`   ⚠️  Restricciones: ${result.restrictions.join(', ')}`);
    }
    console.log('');
  }
  
  // Resumen final
  const working = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('📊 RESUMEN FINAL');
  console.log('================');
  console.log(`✅ Países funcionando: ${working}/${total}`);
  console.log(`❌ Países con errores: ${total - working}/${total}`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n🔧 PAÍSES QUE REQUIEREN CORRECCIÓN:');
    failed.forEach(f => console.log(`   - ${f.country} (${f.code}): ${f.status}`));
  }
  
  return results;
}

// Ejecutar verificación
if (typeof window === 'undefined') {
  // Node.js environment
  runFullSouthAmericaVerification().then(results => {
    process.exit(results.every(r => r.success) ? 0 : 1);
  });
}