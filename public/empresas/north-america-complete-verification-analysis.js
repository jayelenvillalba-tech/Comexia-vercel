// Análisis Final Completo - Verificación América del Norte + Europa
// Fecha: 8 de enero de 2025

console.log("=== ANÁLISIS FINAL COMPLETO: AMÉRICA + EUROPA ===");

async function analyzeCompleteSystem() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    console.log(`\n📊 ESTADÍSTICAS GENERALES:`);
    console.log(`Total empresas: ${data.companies.length}`);
    
    // Análisis por continente
    const americas = data.companies.filter(c => 
      ['US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'EC', 'PY', 'BO', 'VE', 'GY', 'SR', 'FK',
       'CR', 'GT', 'PA', 'HN', 'SV', 'NI', 'BZ', 'CU', 'JM', 'HT', 'DO', 'TT', 'BB', 'GD', 'LC', 
       'VC', 'AG', 'DM', 'KN', 'BS'].includes(c.country)
    );
    
    const europe = data.companies.filter(c => 
      ['DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'DK', 'GB', 'CH', 'AT', 'BE', 'FI', 'NO', 'PL', 'CZ', 'HU'].includes(c.country)
    );
    
    console.log(`\n🌎 AMÉRICA: ${americas.length} empresas`);
    console.log(`🌍 EUROPA: ${europe.length} empresas`);
    
    // Análisis América del Norte específico
    const northAmerica = data.companies.filter(c => ['US', 'CA', 'MX'].includes(c.country));
    console.log(`\n🇺🇸🇨🇦🇲🇽 AMÉRICA DEL NORTE: ${northAmerica.length} empresas`);
    
    ['US', 'CA', 'MX'].forEach(country => {
      const companies = data.companies.filter(c => c.country === country);
      console.log(`  ${country}: ${companies.length} empresas`);
      
      // Tipos de empresas por país
      const types = {};
      companies.forEach(c => {
        types[c.businessType] = (types[c.businessType] || 0) + 1;
      });
      
      Object.entries(types).forEach(([type, count]) => {
        console.log(`    ${type}: ${count}`);
      });
    });
    
    // Análisis Europa específico
    console.log(`\n🌍 EUROPA DETALLADA:`);
    ['DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'DK', 'GB', 'CH'].forEach(country => {
      const companies = data.companies.filter(c => c.country === country);
      if (companies.length > 0) {
        console.log(`  ${country}: ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
      }
    });
    
    // Verificación por tipo de empresa
    console.log(`\n📋 TIPOS DE EMPRESAS GLOBALES:`);
    const businessTypes = {};
    data.companies.forEach(c => {
      businessTypes[c.businessType] = (businessTypes[c.businessType] || 0) + 1;
    });
    
    Object.entries(businessTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} empresas`);
      });
    
    // Verificación sectores estratégicos
    console.log(`\n🏭 SECTORES ESTRATÉGICOS:`);
    const sectors = {};
    data.companies.forEach(c => {
      if (c.sector) {
        sectors[c.sector] = (sectors[c.sector] || 0) + 1;
      }
    });
    
    Object.entries(sectors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([sector, count]) => {
        console.log(`  ${sector}: ${count} empresas`);
      });
    
    // Estado final
    console.log(`\n✅ ESTADO FINAL:`);
    console.log(`- América del Norte: ${northAmerica.length >= 20 ? 'COMPLETADO ✅' : 'PENDIENTE ❌'}`);
    console.log(`- Europa: ${europe.length >= 10 ? 'EN PROGRESO 🔄' : 'INICIADO 🚀'}`);
    console.log(`- Total global: ${data.companies.length} empresas verificadas`);
    
  } catch (error) {
    console.log('❌ Error en análisis:', error.message);
  }
}

analyzeCompleteSystem();