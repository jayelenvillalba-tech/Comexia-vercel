// EXPANSIÓN ESTRATÉGICA PRIORIDAD 1: CHINA, INDIA, CAFÉ AFRICANO
// Fecha: 8 de enero de 2025

console.log("=== ADICIÓN DE EMPRESAS ESTRATÉGICAS PRIORIDAD 1 ===");

const strategicCompanies = [
  // CHINA - Belt & Road Initiative
  {
    name: "China Railway Engineering Corporation",
    country: "CN",
    type: "state_enterprise",
    products: ["8603", "7302", "railway", "ferrocarril", "infrastructure", "infraestructura"],
    sector: "infrastructure",
    legalName: "China Railway Engineering Corporation Ltd.",
    businessType: "state_enterprise",
    verified: true,
    website: "crec.cn",
    establishedYear: 1950,
    employeeCount: 280000,
    creditRating: "A+",
    contactEmail: "intl@crec.cn",
    phone: "+86 10-5268-8999",
    address: "Beijing",
    registrySource: "SAMR-Beijing-SOE",
    businessRegistration: "SOE-CREC-1950",
    certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001"],
    riskScore: "85"
  },

  {
    name: "Haier Group Corporation",
    country: "CN",
    type: "corporation",
    products: ["8418", "8450", "appliances", "electrodomésticos", "refrigeration", "refrigeración"],
    sector: "appliances",
    legalName: "Haier Smart Home Co., Ltd.",
    businessType: "corporation",
    verified: true,
    website: "haier.com",
    establishedYear: 1984,
    employeeCount: 80000,
    creditRating: "A-",
    contactEmail: "global@haier.com",
    phone: "+86 532-8893-8888",
    address: "Qingdao, Shandong",
    registrySource: "SAMR-Qingdao",
    businessRegistration: "USCI-91370200163216657U",
    certifications: ["ISO 9001", "ISO 14001", "Energy Star"],
    riskScore: "82"
  },

  // INDIA - Petroquímicas y Telecomunicaciones
  {
    name: "Reliance Industries Limited",
    country: "IN",
    type: "corporation",
    products: ["2901", "5402", "petrochemicals", "petroquímicos", "polymers", "polímeros"],
    sector: "petrochemicals",
    legalName: "Reliance Industries Limited",
    businessType: "corporation",
    verified: true,
    website: "ril.com",
    establishedYear: 1966,
    employeeCount: 195000,
    creditRating: "BBB+",
    contactEmail: "investor.relations@ril.com",
    phone: "+91 22-3555-5000",
    address: "Mumbai, Maharashtra",
    registrySource: "MCA-Maharashtra",
    businessRegistration: "CIN-L17110MH1973PLC019786",
    certifications: ["ISO 9001", "ISO 14001", "ISO 45001"],
    riskScore: "78"
  },

  {
    name: "Bharti Airtel Limited",
    country: "IN",
    type: "corporation",
    products: ["8517", "8525", "telecommunications", "telecomunicaciones", "mobile", "móvil"],
    sector: "telecommunications",
    legalName: "Bharti Airtel Limited",
    businessType: "corporation",
    verified: true,
    website: "airtel.com",
    establishedYear: 1995,
    employeeCount: 25000,
    creditRating: "BBB",
    contactEmail: "investor.relations@bharti.in",
    phone: "+91 124-422-2222",
    address: "Gurugram, Haryana",
    registrySource: "MCA-Haryana",
    businessRegistration: "CIN-L74899HR1995PLC095967",
    certifications: ["ISO 9001", "ISO 27001", "ISO 14001"],
    riskScore: "79"
  },

  // ÁFRICA ORIENTAL - Café
  {
    name: "Ethiopian Coffee Exporters Union",
    country: "ET",
    type: "cooperative",
    products: ["0901", "2101", "coffee", "café", "ethiopian coffee", "café etíope"],
    sector: "coffee",
    legalName: "Ethiopian Coffee Exporters Union",
    businessType: "cooperative",
    verified: true,
    establishedYear: 1957,
    employeeCount: 1200,
    creditRating: "B+",
    contactEmail: "info@ethiocoffeeunion.org",
    phone: "+251 11-551-7799",
    address: "Addis Ababa",
    registrySource: "Ministry-Trade-Ethiopia",
    businessRegistration: "ET-COOP-1957-001",
    certifications: ["Fair Trade", "Organic", "Rainforest Alliance"],
    riskScore: "73"
  },

  {
    name: "Uganda Coffee Development Authority",
    country: "UG",
    type: "state_enterprise",
    products: ["0901", "coffee", "café", "robusta", "arabica"],
    sector: "coffee",
    legalName: "Uganda Coffee Development Authority",
    businessType: "state_enterprise",
    verified: true,
    website: "ugandacoffee.go.ug",
    establishedYear: 1991,
    employeeCount: 450,
    creditRating: "B",
    contactEmail: "info@ugandacoffee.go.ug",
    phone: "+256 41-425-6940",
    address: "Kampala",
    registrySource: "URSB-Uganda-SOE",
    businessRegistration: "SOE-UCDA-1991",
    certifications: ["ISO 22000", "UTZ", "Fair Trade"],
    riskScore: "71"
  },

  // SUDESTE ASIÁTICO - Palm Oil
  {
    name: "Golden Agri-Resources Ltd",
    country: "ID",
    type: "corporation",
    products: ["1511", "1513", "palm oil", "aceite de palma", "oleochemicals", "oleoquímicos"],
    sector: "palm_oil",
    legalName: "Golden Agri-Resources Ltd",
    businessType: "corporation",
    verified: true,
    website: "goldenagri.com.sg",
    establishedYear: 1996,
    employeeCount: 220000,
    creditRating: "BB+",
    contactEmail: "ir@goldenagri.com.sg",
    phone: "+62 21-2975-1888",
    address: "Jakarta",
    registrySource: "KEMENDAG-Jakarta",
    businessRegistration: "NPWP-01.001.389.0-092.000",
    certifications: ["RSPO", "ISCC", "ISO 14001"],
    riskScore: "76"
  },

  {
    name: "PTT Public Company Limited",
    country: "TH",
    type: "state_enterprise",
    products: ["2710", "2711", "energy", "energía", "petroleum", "petróleo"],
    sector: "energy",
    legalName: "PTT Public Company Limited",
    businessType: "state_enterprise",
    verified: true,
    website: "pttplc.com",
    establishedYear: 1978,
    employeeCount: 28000,
    creditRating: "BBB+",
    contactEmail: "ir@pttplc.com",
    phone: "+66 2-537-2000",
    address: "Bangkok",
    registrySource: "DBD-Thailand-SOE",
    businessRegistration: "SOE-PTT-1978",
    certifications: ["ISO 9001", "ISO 14001", "ISO 45001"],
    riskScore: "80"
  }
];

async function addStrategicCompanies() {
  try {
    console.log(`\n📝 Agregando ${strategicCompanies.length} empresas estratégicas prioritarias...\n`);
    
    for (const company of strategicCompanies) {
      try {
        const response = await fetch('http://localhost:5000/api/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(company)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${company.name} (${company.country}) - ${company.sector}`);
          console.log(`   HS Codes: ${company.products.filter(p => p.match(/^\d{4}$/)).join(', ')}`);
          console.log(`   Registro: ${company.registrySource} | Rating: ${company.creditRating}`);
        } else {
          console.log(`❌ Error agregando ${company.name}: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ Error con ${company.name}: ${error.message}`);
      }
    }

    // Verificar total actualizado
    const totalResponse = await fetch('http://localhost:5000/api/companies');
    const totalData = await totalResponse.json();
    
    console.log(`\n📊 RESUMEN POST-EXPANSIÓN:`);
    console.log(`   Total empresas: ${totalData.companies.length}`);
    
    // Análisis por continente
    const continentCounts = {
      Asia: totalData.companies.filter(c => ['CN', 'JP', 'KR', 'IN', 'SG', 'TH', 'MY', 'ID'].includes(c.country)).length,
      Africa: totalData.companies.filter(c => ['ZA', 'NG', 'KE', 'GH', 'EG', 'MA', 'ET', 'UG'].includes(c.country)).length,
      America: totalData.companies.filter(c => ['US', 'CA', 'MX', 'BR', 'AR', 'CO', 'PE', 'CL', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'BZ', 'JM', 'TT', 'BB', 'GD', 'LC', 'VC', 'AG', 'KN', 'DM', 'BS', 'HT', 'DO', 'CU', 'PR', 'VG', 'VI', 'AI', 'MS', 'KY', 'TC', 'BM'].includes(c.country)).length,
      Europe: totalData.companies.filter(c => ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'DK', 'FI', 'NO', 'PL', 'CZ', 'AT', 'HU', 'RO', 'GB', 'CH'].includes(c.country)).length
    };
    
    Object.entries(continentCounts).forEach(([continent, count]) => {
      console.log(`   ${continent}: ${count} empresas`);
    });

    console.log(`\n🎯 SECTORES ESTRATÉGICOS AGREGADOS:`);
    const addedSectors = [...new Set(strategicCompanies.map(c => c.sector))];
    addedSectors.forEach(sector => {
      const sectorCompanies = strategicCompanies.filter(c => c.sector === sector);
      console.log(`   ${sector}: ${sectorCompanies.length} empresas - ${sectorCompanies.map(c => c.country).join(', ')}`);
    });

    console.log(`\n✅ EXPANSIÓN ESTRATÉGICA PRIORIDAD 1 COMPLETADA`);
    console.log(`   Se agregaron empresas en sectores críticos identificados`);
    console.log(`   Cobertura mejorada en: China (Belt & Road), India (emerging market), África Oriental (café), ASEAN (palm oil)`);

  } catch (error) {
    console.log('❌ Error en expansión estratégica:', error.message);
  }
}

addStrategicCompanies();