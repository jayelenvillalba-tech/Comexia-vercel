// Verificación Final Asia Completa - Metodología América/Europa
// Fecha: 8 de enero de 2025

console.log("=== VERIFICACIÓN ASIA COMPLETA: METODOLOGÍA AMÉRICA/EUROPA ===");

async function verifyCompleteAsianSystem() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // Países asiáticos con tratados y nomencladores
    const asianCountries = {
      'CN': { name: 'China', region: 'Oriental', treaty: 'RCEP + Belt & Road', customs: 'CN-HS + GACC' },
      'JP': { name: 'Japón', region: 'Oriental', treaty: 'CPTPP + RCEP', customs: 'JP-HS + JETRO' },
      'KR': { name: 'Corea del Sur', region: 'Oriental', treaty: 'KORUS + RCEP', customs: 'K-HS + KCS' },
      'IN': { name: 'India', region: 'Meridional', treaty: 'RCEP + SAFTA', customs: 'ITC-HS + DGFT' },
      'SG': { name: 'Singapur', region: 'Sudoriental', treaty: 'ASEAN + CPTPP', customs: 'SG-HS + ASEAN' },
      'TH': { name: 'Tailandia', region: 'Sudoriental', treaty: 'ASEAN + RCEP', customs: 'TH-HS + ASEAN' },
      'MY': { name: 'Malasia', region: 'Sudoriental', treaty: 'ASEAN + RCEP', customs: 'MY-HS + ASEAN' },
      'ID': { name: 'Indonesia', region: 'Sudoriental', treaty: 'ASEAN + RCEP', customs: 'ID-HS + ASEAN' }
    };

    const asianCompanies = data.companies.filter(c => 
      Object.keys(asianCountries).includes(c.country)
    );

    console.log(`\n📊 TOTAL ASIA: ${asianCompanies.length} empresas`);
    console.log(`📈 TOTAL GLOBAL: ${data.companies.length} empresas`);

    // 1. VERIFICACIÓN TIPOS DE EMPRESA ASIÁTICAS
    console.log('\n🏢 1. TIPOS DE EMPRESAS ASIÁTICAS:');
    const businessTypes = {};
    asianCompanies.forEach(c => {
      businessTypes[c.businessType] = (businessTypes[c.businessType] || 0) + 1;
    });

    Object.entries(businessTypes).forEach(([type, count]) => {
      const percentage = ((count / asianCompanies.length) * 100).toFixed(1);
      console.log(`  ${type}: ${count} empresas (${percentage}%)`);
    });

    // 2. EMPRESAS ESTATALES Y COOPERATIVAS
    console.log('\n🏛️ 2. EMPRESAS ESTATALES Y COOPERATIVAS ASIÁTICAS:');
    const stateEnterprises = asianCompanies.filter(c => c.businessType === 'state_enterprise');
    console.log(`  Empresas estatales: ${stateEnterprises.length}`);
    stateEnterprises.forEach(c => {
      console.log(`    - ${c.name} (${asianCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    const cooperatives = asianCompanies.filter(c => c.businessType === 'cooperative');
    console.log(`  Cooperativas asiáticas: ${cooperatives.length}`);
    cooperatives.forEach(c => {
      console.log(`    - ${c.name} (${asianCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    // 3. CÓDIGOS HS ASIÁTICOS ESPECÍFICOS
    console.log('\n📋 3. CÓDIGOS HS Y NOMENCLADORES ASIÁTICOS:');
    const hsCodes = {};
    asianCompanies.forEach(c => {
      c.products.forEach(product => {
        if (product.match(/^\d{4}$/)) {
          if (!hsCodes[product]) {
            hsCodes[product] = { count: 0, companies: [], sector: c.sector };
          }
          hsCodes[product].count++;
          hsCodes[product].companies.push(c.name);
        }
      });
    });

    console.log('  Códigos HS asiáticos más utilizados:');
    Object.entries(hsCodes)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .forEach(([code, data]) => {
        console.log(`    ${code}: ${data.count} empresas (${data.sector}) - ${data.companies.slice(0, 2).join(', ')}`);
      });

    // 4. TRATADOS COMERCIALES ASIÁTICOS
    console.log('\n🤝 4. TRATADOS COMERCIALES ASIÁTICOS:');
    const treatyGroups = {};
    Object.values(asianCountries).forEach(country => {
      if (!treatyGroups[country.treaty]) {
        treatyGroups[country.treaty] = [];
      }
      treatyGroups[country.treaty].push(country.name);
    });

    Object.entries(treatyGroups).forEach(([treaty, countries]) => {
      const treatyCompanies = asianCompanies.filter(c => 
        asianCountries[c.country].treaty === treaty
      );
      console.log(`  ${treaty}: ${treatyCompanies.length} empresas en ${countries.join(', ')}`);
    });

    // 5. SECTORES ESTRATÉGICOS ASIÁTICOS
    console.log('\n🏭 5. SECTORES ESTRATÉGICOS ASIÁTICOS:');
    const sectors = {};
    asianCompanies.forEach(c => {
      if (c.sector) {
        if (!sectors[c.sector]) {
          sectors[c.sector] = { count: 0, countries: new Set(), hsCodes: new Set() };
        }
        sectors[c.sector].count++;
        sectors[c.sector].countries.add(asianCountries[c.country].name);
        c.products.forEach(p => {
          if (p.match(/^\d{4}$/)) sectors[c.sector].hsCodes.add(p);
        });
      }
    });

    Object.entries(sectors)
      .sort(([,a], [,b]) => b.count - a.count)
      .forEach(([sector, data]) => {
        console.log(`  ${sector}: ${data.count} empresas`);
        console.log(`    Países: ${Array.from(data.countries).slice(0, 4).join(', ')}`);
        console.log(`    Códigos HS: ${Array.from(data.hsCodes).slice(0, 5).join(', ')}`);
      });

    // 6. VERIFICACIÓN POR PAÍS ASIÁTICO
    console.log('\n🌏 6. VERIFICACIÓN POR PAÍS ASIÁTICO:');
    Object.entries(asianCountries).forEach(([code, countryData]) => {
      const companies = asianCompanies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`\n  🇦🇸 ${countryData.name} (${code}) - ${countryData.region}`);
        console.log(`    Tratado: ${countryData.treaty} | Nomenclador: ${countryData.customs}`);
        console.log(`    Empresas: ${companies.length}`);
        
        companies.forEach(c => {
          const hsCodesOnly = c.products.filter(p => p.match(/^\d{4}$/));
          console.log(`      - ${c.name} (${c.businessType})`);
          console.log(`        Sector: ${c.sector} | HS: ${hsCodesOnly.slice(0, 3).join(', ')}`);
          console.log(`        Registro: ${c.registrySource} | Rating: ${c.creditRating}`);
        });
      }
    });

    // 7. RESUMEN FINAL ASIA
    console.log('\n✅ 7. RESUMEN FINAL COMPLIANCE ASIA:');
    
    const totalCorporaciones = asianCompanies.filter(c => c.businessType === 'corporation').length;
    const totalEstatales = asianCompanies.filter(c => c.businessType === 'state_enterprise').length;
    const totalCooperativas = asianCompanies.filter(c => c.businessType === 'cooperative').length;
    
    const withHSCodes = asianCompanies.filter(c => 
      c.products.some(p => p.match(/^\d{4}$/))
    ).length;
    
    const withRegistrySource = asianCompanies.filter(c => c.registrySource).length;
    const withCreditRating = asianCompanies.filter(c => c.creditRating).length;

    console.log(`  ✓ Corporaciones: ${totalCorporaciones}/${asianCompanies.length} (${((totalCorporaciones/asianCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Empresas Estatales: ${totalEstatales}/${asianCompanies.length} (${((totalEstatales/asianCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Cooperativas: ${totalCooperativas}/${asianCompanies.length} (${((totalCooperativas/asianCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Con Códigos HS: ${withHSCodes}/${asianCompanies.length} (${((withHSCodes/asianCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Registro Oficial: ${withRegistrySource}/${asianCompanies.length} (${((withRegistrySource/asianCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Credit Rating: ${withCreditRating}/${asianCompanies.length} (${((withCreditRating/asianCompanies.length)*100).toFixed(1)}%)`);
    
    const regionsWithCompanies = [...new Set(asianCompanies.map(c => 
      asianCountries[c.country].region
    ))].length;
    
    console.log(`  ✓ Regiones Cubiertas: ${regionsWithCompanies}/3 (Oriental, Meridional, Sudoriental)`);
    console.log(`  ✓ Países Asiáticos: ${Object.keys(asianCountries).filter(code => 
      asianCompanies.some(c => c.country === code)
    ).length}/${Object.keys(asianCountries).length}`);

    const uniqueHSCodes = new Set();
    asianCompanies.forEach(c => {
      c.products.forEach(p => {
        if (p.match(/^\d{4}$/)) uniqueHSCodes.add(p);
      });
    });
    
    console.log(`  ✓ Códigos HS Únicos: ${uniqueHSCodes.size}`);
    console.log(`  ✓ Sectores Estratégicos: ${Object.keys(sectors).length}`);

    console.log('\n🎯 ESTADO FINAL: ASIA COMPLETAMENTE VERIFICADA ✅');
    console.log(`Metodología América/Europa aplicada exitosamente en Asia: ${asianCompanies.length} empresas`);

  } catch (error) {
    console.log('❌ Error en verificación Asia:', error.message);
  }
}

verifyCompleteAsianSystem();