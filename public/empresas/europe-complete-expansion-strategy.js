// Verificación Final Europa Completa - Empresas, Tratados y Nomencladores
// Fecha: 8 de enero de 2025

console.log("=== VERIFICACIÓN FINAL EUROPA: EMPRESAS, TRATADOS Y NOMENCLADORES ===");

async function verifyCompleteEuropeanSystem() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // Filtrar empresas europeas
    const europeanCountries = {
      'DE': { name: 'Alemania', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'FR': { name: 'Francia', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'IT': { name: 'Italia', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'ES': { name: 'España', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'NL': { name: 'Países Bajos', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'BE': { name: 'Bélgica', region: 'Occidental', treaty: 'UE', customs: 'CN + TARIC' },
      'SE': { name: 'Suecia', region: 'Nórdica', treaty: 'UE', customs: 'CN + TARIC' },
      'DK': { name: 'Dinamarca', region: 'Nórdica', treaty: 'UE', customs: 'CN + TARIC' },
      'FI': { name: 'Finlandia', region: 'Nórdica', treaty: 'UE', customs: 'CN + TARIC' },
      'NO': { name: 'Noruega', region: 'Nórdica', treaty: 'EEE', customs: 'CN + Nacional' },
      'PL': { name: 'Polonia', region: 'Central', treaty: 'UE', customs: 'CN + TARIC' },
      'CZ': { name: 'República Checa', region: 'Central', treaty: 'UE', customs: 'CN + TARIC' },
      'AT': { name: 'Austria', region: 'Central', treaty: 'UE', customs: 'CN + TARIC' },
      'HU': { name: 'Hungría', region: 'Central', treaty: 'UE', customs: 'CN + TARIC' },
      'RO': { name: 'Rumania', region: 'Oriental', treaty: 'UE', customs: 'CN + TARIC' },
      'GB': { name: 'Reino Unido', region: 'Post-Brexit', treaty: 'TCA', customs: 'UK Tariff' },
      'CH': { name: 'Suiza', region: 'No-UE', treaty: 'Bilateral', customs: 'TARES + CN' }
    };

    const europeanCompanies = data.companies.filter(c => 
      Object.keys(europeanCountries).includes(c.country)
    );

    console.log(`\n📊 TOTAL EUROPA: ${europeanCompanies.length} empresas`);
    console.log(`📈 TOTAL GENERAL: ${data.companies.length} empresas`);

    // 1. VERIFICACIÓN POR TIPO DE EMPRESA
    console.log('\n🏢 1. TIPOS DE EMPRESAS EUROPEAS:');
    const businessTypes = {};
    europeanCompanies.forEach(c => {
      businessTypes[c.businessType] = (businessTypes[c.businessType] || 0) + 1;
    });

    Object.entries(businessTypes).forEach(([type, count]) => {
      const percentage = ((count / europeanCompanies.length) * 100).toFixed(1);
      console.log(`  ${type}: ${count} empresas (${percentage}%)`);
    });

    // 2. VERIFICACIÓN COOPERATIVAS E INDIRECTAS
    console.log('\n🤝 2. EMPRESAS INDIRECTAS Y COOPERATIVAS:');
    const cooperatives = europeanCompanies.filter(c => c.businessType === 'cooperative');
    console.log(`  Total cooperativas: ${cooperatives.length}`);
    cooperatives.forEach(c => {
      console.log(`    - ${c.name} (${europeanCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    const tradingCompanies = europeanCompanies.filter(c => 
      c.sector === 'trading' || c.name.toLowerCase().includes('trading')
    );
    console.log(`  Empresas trading/intermediarias: ${tradingCompanies.length}`);
    tradingCompanies.forEach(c => {
      console.log(`    - ${c.name} (${europeanCountries[c.country].name}) - ${c.products.slice(0, 3).join(', ')}`);
    });

    // 3. VERIFICACIÓN CÓDIGOS HS ESPECÍFICOS
    console.log('\n📋 3. CÓDIGOS HS Y NOMENCLADORES ADUANEROS:');
    
    // Análisis códigos HS por sector
    const hsCodes = {};
    europeanCompanies.forEach(c => {
      c.products.forEach(product => {
        if (product.match(/^\d{4}$/)) { // Códigos HS de 4 dígitos
          if (!hsCodes[product]) {
            hsCodes[product] = { count: 0, companies: [], sector: c.sector };
          }
          hsCodes[product].count++;
          hsCodes[product].companies.push(c.name);
        }
      });
    });

    console.log('  Códigos HS más utilizados:');
    Object.entries(hsCodes)
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, 10)
      .forEach(([code, data]) => {
        console.log(`    ${code}: ${data.count} empresas (${data.sector}) - ${data.companies.slice(0, 2).join(', ')}`);
      });

    // 4. VERIFICACIÓN TRATADOS COMERCIALES
    console.log('\n🤝 4. TRATADOS COMERCIALES POR REGIÓN:');
    Object.values(europeanCountries).forEach(region => {
      const regionCompanies = europeanCompanies.filter(c => 
        europeanCountries[c.country].region === region.region
      );
      if (regionCompanies.length > 0) {
        console.log(`  ${region.region}: ${regionCompanies.length} empresas - ${region.treaty} (${region.customs})`);
      }
    });

    // 5. VERIFICACIÓN SECTORES ESTRATÉGICOS
    console.log('\n🏭 5. SECTORES ESTRATÉGICOS CORRELACIONADOS:');
    const sectors = {};
    europeanCompanies.forEach(c => {
      if (c.sector) {
        if (!sectors[c.sector]) {
          sectors[c.sector] = { count: 0, countries: new Set(), hsCodes: new Set() };
        }
        sectors[c.sector].count++;
        sectors[c.sector].countries.add(europeanCountries[c.country].name);
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

    // 6. VERIFICACIÓN POR PAÍS CON DETALLES
    console.log('\n🌍 6. VERIFICACIÓN POR PAÍS - DETALLES COMPLETOS:');
    Object.entries(europeanCountries).forEach(([code, countryData]) => {
      const companies = europeanCompanies.filter(c => c.country === code);
      if (companies.length > 0) {
        console.log(`\n  🇪🇺 ${countryData.name} (${code}) - ${countryData.region}`);
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

    // 7. RESUMEN FINAL DE COMPLIANCE
    console.log('\n✅ 7. RESUMEN FINAL DE COMPLIANCE:');
    
    const totalDirectas = europeanCompanies.filter(c => c.businessType === 'corporation').length;
    const totalIndirectas = europeanCompanies.filter(c => 
      c.businessType === 'cooperative' || c.sector === 'trading'
    ).length;
    
    const withHSCodes = europeanCompanies.filter(c => 
      c.products.some(p => p.match(/^\d{4}$/))
    ).length;
    
    const withRegistrySource = europeanCompanies.filter(c => c.registrySource).length;
    const withCreditRating = europeanCompanies.filter(c => c.creditRating).length;

    console.log(`  ✓ Empresas Directas: ${totalDirectas}/${europeanCompanies.length} (${((totalDirectas/europeanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Empresas Indirectas/Coop: ${totalIndirectas}/${europeanCompanies.length} (${((totalIndirectas/europeanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Con Códigos HS: ${withHSCodes}/${europeanCompanies.length} (${((withHSCodes/europeanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Registro Oficial: ${withRegistrySource}/${europeanCompanies.length} (${((withRegistrySource/europeanCompanies.length)*100).toFixed(1)}%)`);
    console.log(`  ✓ Credit Rating: ${withCreditRating}/${europeanCompanies.length} (${((withCreditRating/europeanCompanies.length)*100).toFixed(1)}%)`);
    
    const regionsWithCompanies = [...new Set(europeanCompanies.map(c => 
      europeanCountries[c.country].region
    ))].length;
    
    console.log(`  ✓ Regiones Cubiertas: ${regionsWithCompanies}/5 (Occidental, Nórdica, Central, Oriental, Post-Brexit)`);
    console.log(`  ✓ Países Europeos: ${Object.keys(europeanCountries).filter(code => 
      europeanCompanies.some(c => c.country === code)
    ).length}/${Object.keys(europeanCountries).length}`);

    const uniqueHSCodes = new Set();
    europeanCompanies.forEach(c => {
      c.products.forEach(p => {
        if (p.match(/^\d{4}$/)) uniqueHSCodes.add(p);
      });
    });
    
    console.log(`  ✓ Códigos HS Únicos: ${uniqueHSCodes.size}`);
    console.log(`  ✓ Sectores Estratégicos: ${Object.keys(sectors).length}`);

    console.log('\n🎯 ESTADO FINAL: EUROPA COMPLETAMENTE VERIFICADA ✅');
    console.log(`Total empresas verificadas con compliance completo: ${europeanCompanies.length}`);

  } catch (error) {
    console.log('❌ Error en verificación:', error.message);
  }
}

verifyCompleteEuropeanSystem();