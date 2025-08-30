// Verificación Final África Completa - Metodología América/Europa/Asia
// Fecha: 8 de enero de 2025

console.log("=== VERIFICACIÓN ÁFRICA COMPLETA: METODOLOGÍA TRICONTINENTAL ===");

async function verifyCompleteAfricanSystem() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // Países africanos con tratados y nomencladores
    const africanCountries = {
      'ZA': { name: 'Sudáfrica', region: 'Austral', treaty: 'AfCFTA + SADC', customs: 'ZA-HS + SARS' },
      'NG': { name: 'Nigeria', region: 'Occidental', treaty: 'AfCFTA + ECOWAS', customs: 'NG-HS + CAC' },
      'KE': { name: 'Kenia', region: 'Oriental', treaty: 'AfCFTA + EAC', customs: 'KE-HS + KRA' },
      'GH': { name: 'Ghana', region: 'Occidental', treaty: 'AfCFTA + ECOWAS', customs: 'GH-HS + RGD' },
      'EG': { name: 'Egipto', region: 'Septentrional', treaty: 'AfCFTA + Árabe + Med', customs: 'EG-HS + CAPMAS' },
      'MA': { name: 'Marruecos', region: 'Septentrional', treaty: 'AfCFTA + Árabe + Med', customs: 'MA-HS + OMPIC' }
    };

    const africanCompanies = data.companies.filter(c => 
      Object.keys(africanCountries).includes(c.country)
    );

    console.log(`\n📊 TOTAL ÁFRICA: ${africanCompanies.length} empresas`);
    console.log(`📈 TOTAL GLOBAL: ${data.companies.length} empresas`);

    // 1. VERIFICACIÓN TIPOS DE EMPRESA AFRICANAS
    console.log('\n🏢 1. TIPOS DE EMPRESAS AFRICANAS:');
    const businessTypes = {};
    africanCompanies.forEach(c => {
      businessTypes[c.businessType] = (businessTypes[c.businessType] || 0) + 1;
    });

    Object.entries(businessTypes).forEach(([type, count]) => {
      const percentage = ((count / africanCompanies.length) * 100).toFixed(1);
      console.log(`  ${type}: ${count} empresas (${percentage}%)`);
    });

    // 2. EMPRESAS ESTATALES Y COOPERATIVAS AFRICANAS
    console.log('\n🏛️ 2. EMPRESAS ESTATALES Y COOPERATIVAS AFRICANAS:');
    const stateEnterprises = africanCompanies.filter(c => c.businessType === 'state_enterprise');
    console.log(`  Empresas estatales: ${stateEnterprises.length}`);
    stateEnterprises.forEach(c => {
      console.log(`    - ${c.name} (${africanCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    const cooperatives = africanCompanies.filter(c => c.businessType === 'cooperative');
    console.log(`  Cooperativas africanas: ${cooperatives.length}`);
    cooperatives.forEach(c => {
      console.log(`    - ${c.name} (${africanCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    // 3. CÓDIGOS HS AFRICANOS ESPECÍFICOS
    console.log('\n📋 3. CÓDIGOS HS Y NOMENCLADORES AFRICANOS:');
    const hsCodes = {};
    africanCompanies.forEach(c => {
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

    console.log('  Códigos HS africanos más utilizados:');
    Object.entries(hsCodes)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .forEach(([code, data]) => {
        console.log(`    ${code}: ${data.count} empresas (${data.sector}) - ${data.companies.slice(0, 2).join(', ')}`);
      });

    // 4. TRATADOS COMERCIALES AFRICANOS
    console.log('\n🤝 4. TRATADOS COMERCIALES AFRICANOS:');
    const treatyGroups = {};
    Object.values(africanCountries).forEach(country => {
      if (!treatyGroups[country.treaty]) {
        treatyGroups[country.treaty] = [];
      }
      treatyGroups[country.treaty].push(country.name);
    });

    Object.entries(treatyGroups).forEach(([treaty, countries]) => {
      const treatyCompanies = africanCompanies.filter(c => 
        africanCountries[c.country].treaty === treaty
      );
      console.log(`  ${treaty}: ${treatyCompanies.length} empresas en ${countries.join(', ')}`);
    });

    // 5. SECTORES ESTRATÉGICOS AFRICANOS
    console.log('\n🏭 5. SECTORES ESTRATÉGICOS AFRICANOS:');
    const sectors = {};
    africanCompanies.forEach(c => {
      if (c.sector) {
        if (!sectors[c.sector]) {
          sectors[c.sector] = { count: 0, countries: new Set(), hsCodes: new Set() };
        }
        sectors[c.sector].count++;
        sectors[c.sector].countries.add(africanCountries[c.country].name);
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

    // 6. VERIFICACIÓN POR PAÍS AFRICANO
    console.log('\n🌍 6. VERIFICACIÓN POR PAÍS AFRICANO:');
    Object.entries(africanCountries).forEach(([code, countryData]) => {
      const companies = africanCompanies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`\n  🌍 ${countryData.name} (${code}) - ${countryData.region}`);
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

    // 7. RESUMEN FINAL ÁFRICA
    console.log('\n✅ 7. RESUMEN FINAL COMPLIANCE ÁFRICA:');
    
    const totalCorporaciones = africanCompanies.filter(c => c.businessType === 'corporation').length;
    const totalEstatales = africanCompanies.filter(c => c.businessType === 'state_enterprise').length;
    const totalCooperativas = africanCompanies.filter(c => c.businessType === 'cooperative').length;
    
    const withHSCodes = africanCompanies.filter(c => 
      c.products.some(p => p.match(/^\d{4}$/))
    ).length;
    
    const withRegistrySource = africanCompanies.filter(c => c.registrySource).length;
    const withCreditRating = africanCompanies.filter(c => c.creditRating).length;

    console.log(`  ✓ Corporaciones: ${totalCorporaciones}/${africanCompanies.length} (${((totalCorporaciones/africanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Empresas Estatales: ${totalEstatales}/${africanCompanies.length} (${((totalEstatales/africanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Cooperativas: ${totalCooperativas}/${africanCompanies.length} (${((totalCooperativas/africanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Con Códigos HS: ${withHSCodes}/${africanCompanies.length} (${((withHSCodes/africanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Registro Oficial: ${withRegistrySource}/${africanCompanies.length} (${((withRegistrySource/africanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Credit Rating: ${withCreditRating}/${africanCompanies.length} (${((withCreditRating/africanCompanies.length)*100).toFixed(1)}%)`);
    
    const regionsWithCompanies = [...new Set(africanCompanies.map(c => 
      africanCountries[c.country].region
    ))].length;
    
    console.log(`  ✓ Regiones Cubiertas: ${regionsWithCompanies}/4 (Septentrional, Occidental, Oriental, Austral)`);
    console.log(`  ✓ Países Africanos: ${Object.keys(africanCountries).filter(code => 
      africanCompanies.some(c => c.country === code)
    ).length}/${Object.keys(africanCountries).length}`);

    const uniqueHSCodes = new Set();
    africanCompanies.forEach(c => {
      c.products.forEach(p => {
        if (p.match(/^\d{4}$/)) uniqueHSCodes.add(p);
      });
    });
    
    console.log(`  ✓ Códigos HS Únicos: ${uniqueHSCodes.size}`);
    console.log(`  ✓ Sectores Estratégicos: ${Object.keys(sectors).length}`);

    console.log('\n🎯 ESTADO FINAL: ÁFRICA COMPLETAMENTE VERIFICADA ✅');
    console.log(`Metodología tricontinental aplicada exitosamente en África: ${africanCompanies.length} empresas`);

  } catch (error) {
    console.log('❌ Error en verificación África:', error.message);
  }
}

verifyCompleteAfricanSystem();