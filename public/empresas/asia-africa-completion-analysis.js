// ANÁLISIS DE COMPLETUD ASIA-ÁFRICA: IDENTIFICAR GAPS ESTRATÉGICOS
// Fecha: 8 de enero de 2025

console.log("=== ANÁLISIS DE GAPS ESTRATÉGICOS ASIA-ÁFRICA ===");

async function analyzeAsiaAfricaCompleteness() {
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    
    // DEFINICIÓN DE EMPRESAS ESTRATÉGICAS FALTANTES
    const strategicGaps = {
      asia: {
        // CHINA - Faltan PYMEs y cooperativas agrícolas
        CN: {
          missing: [
            { name: "China Railway Engineering Corporation", type: "state_enterprise", sector: "infrastructure", hsCodes: ["8603", "7302"] },
            { name: "Haier Group", type: "corporation", sector: "appliances", hsCodes: ["8418", "8450"] },
            { name: "China National Cereals", type: "cooperative", sector: "agriculture", hsCodes: ["1001", "1005"] }
          ],
          treatyGaps: ["Belt & Road Initiative expansion", "ASEAN+3"]
        },
        
        // JAPÓN - Faltan empresas pesqueras y marítimas  
        JP: {
          missing: [
            { name: "Mitsubishi Heavy Industries", type: "corporation", sector: "shipbuilding", hsCodes: ["8901", "8902"] },
            { name: "JF Zengyoren (漁協)", type: "cooperative", sector: "fisheries", hsCodes: ["0302", "0304"] },
            { name: "Itochu Corporation", type: "corporation", sector: "trading", hsCodes: ["5201", "5208"] }
          ],
          treatyGaps: ["Japan-UK EPA", "TPP-11 expansion"]
        },
        
        // INDIA - Faltan textiles y farmacéuticas
        IN: {
          missing: [
            { name: "Reliance Industries", type: "corporation", sector: "petrochemicals", hsCodes: ["2901", "5402"] },
            { name: "Bharti Airtel", type: "corporation", sector: "telecommunications", hsCodes: ["8517", "8525"] },
            { name: "National Agricultural Cooperative", type: "cooperative", sector: "agriculture", hsCodes: ["1006", "0713"] }
          ],
          treatyGaps: ["RCEP participation", "India-EU FTA negotiations"]
        },
        
        // SUDESTE ASIÁTICO - Faltan palm oil y textiles
        ASEAN: {
          missing: [
            { name: "Golden Agri-Resources (ID)", type: "corporation", sector: "palm_oil", hsCodes: ["1511", "1513"] },
            { name: "PTT Public Company (TH)", type: "state_enterprise", sector: "energy", hsCodes: ["2710", "2711"] },
            { name: "Vietnam National Oil (VN)", type: "state_enterprise", sector: "energy", hsCodes: ["2709", "2710"] },
            { name: "Philippine Coconut Authority (PH)", type: "cooperative", sector: "agriculture", hsCodes: ["1513", "0801"] }
          ],
          treatyGaps: ["ASEAN Digital Economy Framework", "ASEAN Green Deal"]
        }
      },
      
      africa: {
        // NORTE DE ÁFRICA - Faltan textiles y manufactura
        NORTH: {
          missing: [
            { name: "Oriental Weavers (EG)", type: "corporation", sector: "textiles", hsCodes: ["5701", "5702"] },
            { name: "Sonelgaz (DZ)", type: "state_enterprise", sector: "energy", hsCodes: ["2711", "8504"] },
            { name: "Libya National Oil Corporation", type: "state_enterprise", sector: "energy", hsCodes: ["2709", "2710"] }
          ],
          treatyGaps: ["EU-Africa Green Energy Partnership", "Mediterranean Union"]
        },
        
        // ÁFRICA OCCIDENTAL - Faltan cacao y textiles
        WEST: {
          missing: [
            { name: "COCOBOD Ghana Cooperative", type: "cooperative", sector: "cocoa", hsCodes: ["1801", "1805"] },
            { name: "Société Ivoirienne de Cacao", type: "state_enterprise", sector: "cocoa", hsCodes: ["1801", "1803"] },
            { name: "Lagos State Textile Mills", type: "corporation", sector: "textiles", hsCodes: ["5208", "5209"] }
          ],
          treatyGaps: ["ECOWAS-EU Economic Partnership", "West Africa Monetary Union"]
        },
        
        // ÁFRICA ORIENTAL - Faltan café y horticultura
        EAST: {
          missing: [
            { name: "Ethiopian Coffee Exporters Union", type: "cooperative", sector: "coffee", hsCodes: ["0901", "2101"] },
            { name: "Uganda Coffee Development Authority", type: "state_enterprise", sector: "coffee", hsCodes: ["0901"] },
            { name: "Tanzania Coffee Board", type: "state_enterprise", sector: "coffee", hsCodes: ["0901"] },
            { name: "Horticultural Crops Development Authority (KE)", type: "state_enterprise", sector: "horticulture", hsCodes: ["0702", "0703"] }
          ],
          treatyGaps: ["EAC-EU Economic Partnership", "East Africa Coffee Protocol"]
        },
        
        // ÁFRICA AUSTRAL - Faltan diamantes y vinos
        SOUTH: {
          missing: [
            { name: "De Beers Group", type: "corporation", sector: "diamonds", hsCodes: ["7102", "7103"] },
            { name: "Botswana Diamond Trading Company", type: "state_enterprise", sector: "mining", hsCodes: ["7102"] },
            { name: "Namibian Grape Growers Union", type: "cooperative", sector: "agriculture", hsCodes: ["0806", "2204"] },
            { name: "Zimbabwe Tobacco Association", type: "cooperative", sector: "tobacco", hsCodes: ["2401", "2402"] }
          ],
          treatyGaps: ["SADC-EU Economic Partnership", "Southern Africa Customs Union"]
        }
      }
    };

    console.log("\n🔍 ANÁLISIS DE GAPS POR REGIÓN:");
    
    // ANÁLISIS ASIA
    console.log("\n🌏 ASIA - EMPRESAS ESTRATÉGICAS FALTANTES:");
    Object.entries(strategicGaps.asia).forEach(([region, data]) => {
      console.log(`\n  📍 ${region}:`);
      data.missing.forEach(company => {
        console.log(`    ❌ FALTA: ${company.name}`);
        console.log(`       Tipo: ${company.type} | Sector: ${company.sector}`);
        console.log(`       HS Codes: ${company.hsCodes.join(', ')}`);
      });
      if (data.treatyGaps) {
        console.log(`    🤝 Tratados pendientes: ${data.treatyGaps.join(', ')}`);
      }
    });

    // ANÁLISIS ÁFRICA  
    console.log("\n🌍 ÁFRICA - EMPRESAS ESTRATÉGICAS FALTANTES:");
    Object.entries(strategicGaps.africa).forEach(([region, data]) => {
      console.log(`\n  📍 ${region}:`);
      data.missing.forEach(company => {
        console.log(`    ❌ FALTA: ${company.name}`);
        console.log(`       Tipo: ${company.type} | Sector: ${company.sector}`);
        console.log(`       HS Codes: ${company.hsCodes.join(', ')}`);
      });
      if (data.treatyGaps) {
        console.log(`    🤝 Tratados pendientes: ${data.treatyGaps.join(', ')}`);
      }
    });

    // ANÁLISIS DE SECTORES CRÍTICOS FALTANTES
    console.log("\n🏭 SECTORES CRÍTICOS CON GAPS:");
    
    const criticalSectors = {
      "Textiles y Confección": {
        hsCodes: ["5201", "5208", "5701", "6109", "6203"],
        missingCountries: ["IN", "BD", "VN", "EG", "MA"],
        impact: "Alto - Sector manufacturero estratégico"
      },
      "Energías Renovables": {
        hsCodes: ["8501", "8504", "8541", "8542"],
        missingCountries: ["CN", "IN", "ZA", "MA"],
        impact: "Crítico - Transición energética global"
      },
      "Agricultura de Exportación": {
        hsCodes: ["0901", "1801", "0806", "0702"],
        missingCountries: ["ET", "CI", "UG", "GH"],
        impact: "Alto - Seguridad alimentaria global"
      },
      "Infraestructura y Transporte": {
        hsCodes: ["8603", "8901", "7302", "8704"],
        missingCountries: ["CN", "JP", "KR", "ZA"],
        impact: "Estratégico - Conectividad regional"
      }
    };

    Object.entries(criticalSectors).forEach(([sector, data]) => {
      console.log(`\n  🎯 ${sector}:`);
      console.log(`     HS Codes: ${data.hsCodes.join(', ')}`);
      console.log(`     Países faltantes: ${data.missingCountries.join(', ')}`);
      console.log(`     Impacto: ${data.impact}`);
    });

    // PRIORIDADES DE EXPANSIÓN
    console.log("\n⚡ PRIORIDADES DE EXPANSIÓN INMEDIATA:");
    
    const expansionPriorities = [
      {
        priority: 1,
        region: "China - Belt & Road",
        companies: 3,
        sectors: ["infrastructure", "appliances", "agriculture"],
        impact: "Crítico - Mayor economía asiática"
      },
      {
        priority: 2,
        region: "India - Farmacéuticas y Textiles",
        companies: 3,
        sectors: ["petrochemicals", "telecommunications", "agriculture"],
        impact: "Alto - Mercado emergente estratégico"
      },
      {
        priority: 3,
        region: "África Oriental - Café",
        companies: 4,
        sectors: ["coffee", "horticulture"],
        impact: "Alto - Commodities críticos"
      },
      {
        priority: 4,
        region: "ASEAN - Palm Oil y Energía",
        companies: 4,
        sectors: ["palm_oil", "energy"],
        impact: "Medio-Alto - Recursos estratégicos"
      }
    ];

    expansionPriorities.forEach(item => {
      console.log(`\n  ${item.priority}. ${item.region}:`);
      console.log(`     Empresas a agregar: ${item.companies}`);
      console.log(`     Sectores: ${item.sectors.join(', ')}`);
      console.log(`     Impacto: ${item.impact}`);
    });

    // RESUMEN FINAL
    console.log("\n📊 RESUMEN FINAL DE GAPS:");
    
    const totalMissingAsia = Object.values(strategicGaps.asia).reduce((sum, region) => sum + region.missing.length, 0);
    const totalMissingAfrica = Object.values(strategicGaps.africa).reduce((sum, region) => sum + region.missing.length, 0);
    
    console.log(`  🌏 Asia: ${totalMissingAsia} empresas estratégicas faltantes`);
    console.log(`  🌍 África: ${totalMissingAfrica} empresas estratégicas faltantes`);
    console.log(`  📈 Total gaps identificados: ${totalMissingAsia + totalMissingAfrica} empresas`);
    console.log(`  🎯 Sectores críticos con gaps: ${Object.keys(criticalSectors).length}`);
    console.log(`  ⚡ Prioridades de expansión: ${expansionPriorities.length} regiones`);

    console.log("\n✅ RECOMENDACIÓN ESTRATÉGICA:");
    console.log("  Para lograr completud total en Asia y África, se requiere:");
    console.log("  1. Agregar 13+ empresas asiáticas en sectores estratégicos");
    console.log("  2. Agregar 17+ empresas africanas en commodities críticos");
    console.log("  3. Fortalecer cobertura en textiles, energía renovable y agricultura");
    console.log("  4. Incluir más PYMEs y cooperativas regionales");

  } catch (error) {
    console.log('❌ Error en análisis:', error.message);
  }
}

analyzeAsiaAfricaCompleteness();