// Verificación Final Europa Completa
// Fecha: 8 de enero de 2025

console.log("=== VERIFICACIÓN EUROPA COMPLETA ===");

async function verifyCompleteEurope() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // Países europeos completos
    const europeanCountries = {
      'DE': 'Alemania',
      'FR': 'Francia', 
      'IT': 'Italia',
      'ES': 'España',
      'NL': 'Países Bajos',
      'SE': 'Suecia',
      'DK': 'Dinamarca',
      'GB': 'Reino Unido',
      'CH': 'Suiza',
      'PL': 'Polonia',
      'CZ': 'República Checa',
      'AT': 'Austria',
      'HU': 'Hungría',
      'RO': 'Rumania',
      'FI': 'Finlandia',
      'NO': 'Noruega',
      'BE': 'Bélgica'
    };
    
    console.log(`\n📊 TOTAL GENERAL: ${data.companies.length} empresas`);
    
    let totalEurope = 0;
    console.log('\n🌍 EUROPA POR REGIÓN:');
    
    // Europa Occidental
    const occidental = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE'];
    let occidentalTotal = 0;
    console.log('\n🏛️ EUROPA OCCIDENTAL:');
    occidental.forEach(code => {
      const companies = data.companies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`  ${europeanCountries[code]} (${code}): ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
        occidentalTotal += companies.length;
      }
    });
    
    // Europa Nórdica
    const nordic = ['SE', 'DK', 'FI', 'NO'];
    let nordicTotal = 0;
    console.log('\n❄️ EUROPA NÓRDICA:');
    nordic.forEach(code => {
      const companies = data.companies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`  ${europeanCountries[code]} (${code}): ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
        nordicTotal += companies.length;
      }
    });
    
    // Europa Central
    const central = ['PL', 'CZ', 'AT', 'HU'];
    let centralTotal = 0;
    console.log('\n🏰 EUROPA CENTRAL:');
    central.forEach(code => {
      const companies = data.companies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`  ${europeanCountries[code]} (${code}): ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
        centralTotal += companies.length;
      }
    });
    
    // Europa Oriental
    const oriental = ['RO'];
    let orientalTotal = 0;
    console.log('\n🌅 EUROPA ORIENTAL:');
    oriental.forEach(code => {
      const companies = data.companies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`  ${europeanCountries[code]} (${code}): ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
        orientalTotal += companies.length;
      }
    });
    
    // Post-Brexit / No-UE
    const postBrexit = ['GB', 'CH'];
    let postBrexitTotal = 0;
    console.log('\n🇬🇧 POST-BREXIT / NO-UE:');
    postBrexit.forEach(code => {
      const companies = data.companies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`  ${europeanCountries[code]} (${code}): ${companies.length} empresas`);
        companies.forEach(c => console.log(`    - ${c.name} (${c.sector})`));
        postBrexitTotal += companies.length;
      }
    });
    
    totalEurope = occidentalTotal + nordicTotal + centralTotal + orientalTotal + postBrexitTotal;
    
    console.log('\n📈 RESUMEN REGIONAL:');
    console.log(`Europa Occidental: ${occidentalTotal} empresas`);
    console.log(`Europa Nórdica: ${nordicTotal} empresas`);
    console.log(`Europa Central: ${centralTotal} empresas`);
    console.log(`Europa Oriental: ${orientalTotal} empresas`);
    console.log(`Post-Brexit/No-UE: ${postBrexitTotal} empresas`);
    console.log(`\n🌍 TOTAL EUROPA: ${totalEurope} empresas`);
    
    // Sectores estratégicos europeos
    console.log('\n🏭 SECTORES ESTRATÉGICOS EUROPA:');
    const europeanCompanies = data.companies.filter(c => 
      Object.keys(europeanCountries).includes(c.country)
    );
    
    const sectors = {};
    europeanCompanies.forEach(c => {
      if (c.sector) {
        sectors[c.sector] = (sectors[c.sector] || 0) + 1;
      }
    });
    
    Object.entries(sectors)
      .sort(([,a], [,b]) => b - a)
      .forEach(([sector, count]) => {
        console.log(`  ${sector}: ${count} empresas`);
      });
    
    // Tipos de empresas europeas
    console.log('\n📋 TIPOS EMPRESAS EUROPA:');
    const types = {};
    europeanCompanies.forEach(c => {
      types[c.businessType] = (types[c.businessType] || 0) + 1;
    });
    
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} empresas`);
    });
    
    console.log(`\n✅ ESTADO: Europa ${totalEurope >= 30 ? 'COMPLETADA' : 'EN EXPANSIÓN'}`);
    console.log(`Países cubiertos: ${Object.keys(europeanCountries).filter(code => 
      data.companies.some(c => c.country === code)
    ).length}/${Object.keys(europeanCountries).length}`);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

verifyCompleteEurope();