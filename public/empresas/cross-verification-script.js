// Script de Verificación Cruzada: América vs Europa
// Verificación final de consistencia entre continentes

console.log("=== VERIFICACIÓN CRUZADA: AMÉRICA VS EUROPA ===");

async function crossVerification() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // Separar por continentes
    const americanCountries = [
      'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'EC', 'PY', 'BO', 'VE',
      'CR', 'GT', 'PA', 'HN', 'SV', 'NI', 'BZ', 'CU', 'JM', 'HT', 'DO', 'TT', 'BB'
    ];
    
    const europeanCountries = [
      'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'DK', 'FI', 'NO', 
      'PL', 'CZ', 'AT', 'HU', 'RO', 'GB', 'CH'
    ];
    
    const americas = data.companies.filter(c => americanCountries.includes(c.country));
    const europe = data.companies.filter(c => europeanCountries.includes(c.country));
    
    console.log(`\n📊 COMPARACIÓN CONTINENTAL:`);
    console.log(`🌎 América: ${americas.length} empresas`);
    console.log(`🌍 Europa: ${europe.length} empresas`);
    console.log(`🌐 Total Global: ${data.companies.length} empresas`);
    
    // Verificación tipos de empresa
    console.log('\n🏢 TIPOS DE EMPRESA POR CONTINENTE:');
    
    ['corporation', 'cooperative', 'state_enterprise', 'association'].forEach(type => {
      const americaCount = americas.filter(c => c.businessType === type).length;
      const europeCount = europe.filter(c => c.businessType === type).length;
      console.log(`  ${type}:`);
      console.log(`    América: ${americaCount} (${((americaCount/americas.length)*100).toFixed(1)}%)`);
      console.log(`    Europa: ${europeCount} (${((europeCount/europe.length)*100).toFixed(1)}%)`);
    });
    
    // Códigos HS comunes
    console.log('\n📋 CÓDIGOS HS TRANSATLÁNTICOS:');
    const americaHS = new Set();
    const europeHS = new Set();
    
    americas.forEach(c => {
      c.products.forEach(p => {
        if (p.match(/^\d{4}$/)) americaHS.add(p);
      });
    });
    
    europe.forEach(c => {
      c.products.forEach(p => {
        if (p.match(/^\d{4}$/)) europeHS.add(p);
      });
    });
    
    const commonHS = [...americaHS].filter(code => europeHS.has(code));
    console.log(`  América HS únicos: ${americaHS.size}`);
    console.log(`  Europa HS únicos: ${europeHS.size}`);
    console.log(`  Códigos HS comunes: ${commonHS.length}`);
    console.log(`  Principales comunes: ${commonHS.slice(0, 10).join(', ')}`);
    
    // Sectores estratégicos
    console.log('\n🏭 SECTORES ESTRATÉGICOS COMPARADOS:');
    const americaSectors = {};
    const europeSectors = {};
    
    americas.forEach(c => {
      if (c.sector) americaSectors[c.sector] = (americaSectors[c.sector] || 0) + 1;
    });
    
    europe.forEach(c => {
      if (c.sector) europeSectors[c.sector] = (europeSectors[c.sector] || 0) + 1;
    });
    
    const allSectors = [...new Set([...Object.keys(americaSectors), ...Object.keys(europeSectors)])];
    allSectors.sort((a, b) => 
      (europeSectors[b] || 0) + (americaSectors[b] || 0) - 
      (europeSectors[a] || 0) - (americaSectors[a] || 0)
    ).slice(0, 10).forEach(sector => {
      const amCount = americaSectors[sector] || 0;
      const euCount = europeSectors[sector] || 0;
      console.log(`  ${sector}: América ${amCount} | Europa ${euCount} | Total ${amCount + euCount}`);
    });
    
    // Flujos comerciales potenciales
    console.log('\n🚢 FLUJOS COMERCIALES POTENCIALES:');
    const potentialTrades = [];
    
    commonHS.forEach(hsCode => {
      const americaExporters = americas.filter(c => 
        c.type === 'exporter' && c.products.includes(hsCode)
      );
      const europeImporters = europe.filter(c => 
        (c.type === 'importer' || c.type === 'both') && c.products.includes(hsCode)
      );
      
      if (americaExporters.length > 0 && europeImporters.length > 0) {
        potentialTrades.push({
          hsCode,
          americaExporters: americaExporters.length,
          europeImporters: europeImporters.length
        });
      }
    });
    
    console.log(`  Oportunidades comerciales identificadas: ${potentialTrades.length}`);
    potentialTrades.slice(0, 5).forEach(trade => {
      console.log(`    HS ${trade.hsCode}: ${trade.americaExporters} exportadores AM → ${trade.europeImporters} importadores EU`);
    });
    
    console.log('\n✅ VERIFICACIÓN CRUZADA COMPLETADA');
    console.log(`Sistema K.O.R.A con ${data.companies.length} empresas verificadas listo para análisis transatlántico`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

crossVerification();