// Test de Verificación Europa
console.log("=== VERIFICANDO EMPRESAS EUROPEAS ===");

const testCountries = ["DE", "FR", "IT", "ES", "NL"];

async function testEuropeanCompanies() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    console.log(`Total empresas en sistema: ${data.companies.length}`);
    
    testCountries.forEach(country => {
      const companies = data.companies.filter(c => c.country === country);
      console.log(`${country}: ${companies.length} empresas`);
      
      if (companies.length > 0) {
        console.log(`  Ejemplo: ${companies[0].name} - ${companies[0].products.slice(0, 3).join(', ')}`);
      }
    });
    
    // Buscar empresas específicas
    const specificCompanies = ["BMW Group", "BASF SE", "LVMH", "Ferrari N.V.", "Barilla"];
    specificCompanies.forEach(name => {
      const found = data.companies.find(c => c.name.includes(name.split(' ')[0]));
      console.log(`${name}: ${found ? 'ENCONTRADA' : 'NO ENCONTRADA'}`);
    });
    
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testEuropeanCompanies();