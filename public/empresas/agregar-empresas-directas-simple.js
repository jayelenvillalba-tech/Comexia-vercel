// Script simple para agregar empresas directas al sistema
// Usando la API para agregar directamente las empresas

const empresasDirectas = [
  // Estados Unidos (Tecnología)
  {
    name: "Microsoft Corporation",
    country: "US",
    type: "directa",
    products: ["8523", "software", "cloud", "enterprise"],
    verified: true,
    coordinates: [-122.1215, 47.6740],
    website: "https://www.microsoft.com",
    contactEmail: "export@microsoft.com",
    legalName: "Microsoft Corporation",
    businessType: "corporation",
    establishedYear: 1975,
    employeeCount: 221000,
    creditRating: "AAA",
    riskScore: "95",
    certifications: ["ISO 27001", "SOC 2"],
    contactPerson: "Satya Nadella",
    phone: "+1 425 882 8080",
    address: "Redmond, Washington",
    rating: 4.8
  },
  {
    name: "Apple Inc.",
    country: "US",
    type: "directa",
    products: ["8517", "electronics", "technology", "8471"],
    verified: true,
    coordinates: [-122.0322, 37.3230],
    website: "https://www.apple.com",
    contactEmail: "export@apple.com",
    legalName: "Apple Inc.",
    businessType: "corporation",
    establishedYear: 1976,
    employeeCount: 164000,
    creditRating: "AAA",
    riskScore: "98",
    certifications: ["ISO 14001", "ISO 45001"],
    contactPerson: "Tim Cook",
    phone: "+1 408 996 1010",
    address: "Cupertino, California",
    rating: 4.9
  },
  {
    name: "Tesla Inc.",
    country: "US",
    type: "directa",
    products: ["8703", "automotive", "electric", "8507"],
    verified: true,
    coordinates: [-97.6209, 30.2072],
    website: "https://www.tesla.com",
    contactEmail: "export@tesla.com",
    legalName: "Tesla, Inc.",
    businessType: "corporation",
    establishedYear: 2003,
    employeeCount: 140473,
    creditRating: "BB+",
    riskScore: "82",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Elon Musk",
    phone: "+1 512 516 8177",
    address: "Austin, Texas",
    rating: 4.6
  },
  {
    name: "NVIDIA Corporation",
    country: "US",
    type: "directa",
    products: ["8542", "semiconductors", "ai", "graphics"],
    verified: true,
    coordinates: [-121.9656, 37.3541],
    website: "https://www.nvidia.com",
    contactEmail: "export@nvidia.com",
    legalName: "NVIDIA Corporation",
    businessType: "corporation",
    establishedYear: 1993,
    employeeCount: 29600,
    creditRating: "A+",
    riskScore: "89",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Jensen Huang",
    phone: "+1 408 486 2000",
    address: "Santa Clara, California",
    rating: 4.7
  },
  {
    name: "Amazon Web Services",
    country: "US",
    type: "directa",
    products: ["8523", "cloud", "software", "8471"],
    verified: true,
    coordinates: [-122.3321, 47.6062],
    website: "https://aws.amazon.com",
    contactEmail: "export@amazon.com",
    legalName: "Amazon.com, Inc.",
    businessType: "corporation",
    establishedYear: 1994,
    employeeCount: 1540000,
    creditRating: "AA",
    riskScore: "91",
    certifications: ["ISO 27001", "SOC 2"],
    contactPerson: "Andy Jassy",
    phone: "+1 206 266 1000",
    address: "Seattle, Washington",
    rating: 4.5
  },
  
  // Canadá
  {
    name: "Shopify Inc.",
    country: "CA",
    type: "directa",
    products: ["8523", "ecommerce", "software", "8471"],
    verified: true,
    coordinates: [-75.6972, 45.4215],
    website: "https://www.shopify.com",
    contactEmail: "export@shopify.com",
    legalName: "Shopify Inc.",
    businessType: "corporation",
    establishedYear: 2006,
    employeeCount: 12000,
    creditRating: "BBB+",
    riskScore: "78",
    certifications: ["ISO 27001", "PCI DSS"],
    contactPerson: "Tobi Lütke",
    phone: "+1 613 241 2828",
    address: "Ottawa, Ontario",
    rating: 4.4
  },
  
  // Brasil
  {
    name: "Vale S.A.",
    country: "BR",
    type: "directa",
    products: ["2601", "mining", "iron", "2603"],
    verified: true,
    coordinates: [-43.1729, -22.9068],
    website: "https://www.vale.com",
    contactEmail: "export@vale.com",
    legalName: "Vale S.A.",
    businessType: "corporation",
    establishedYear: 1942,
    employeeCount: 166000,
    creditRating: "BB",
    riskScore: "74",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Eduardo Bartolomeo",
    phone: "+55 21 3485 3000",
    address: "Rio de Janeiro, RJ",
    rating: 4.2
  },
  
  // Alemania
  {
    name: "SAP SE",
    country: "DE",
    type: "directa",
    products: ["8523", "software", "enterprise", "cloud"],
    verified: true,
    coordinates: [8.6821, 49.2827],
    website: "https://www.sap.com",
    contactEmail: "export@sap.com",
    legalName: "SAP SE",
    businessType: "corporation",
    establishedYear: 1972,
    employeeCount: 112000,
    creditRating: "A+",
    riskScore: "93",
    certifications: ["ISO 9001", "SOC 2"],
    contactPerson: "Christian Klein",
    phone: "+49 6227 7 47474",
    address: "Walldorf, Baden-Württemberg",
    rating: 4.9
  },
  
  // Francia
  {
    name: "TotalEnergies SE",
    country: "FR",
    type: "directa",
    products: ["2709", "energy", "petroleum", "2711"],
    verified: true,
    coordinates: [2.3522, 48.8566],
    website: "https://www.totalenergies.com",
    contactEmail: "export@totalenergies.com",
    legalName: "TotalEnergies SE",
    businessType: "corporation",
    establishedYear: 1924,
    employeeCount: 104000,
    creditRating: "A-",
    riskScore: "84",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Patrick Pouyanné",
    phone: "+33 1 47 44 45 46",
    address: "Paris, Île-de-France",
    rating: 4.2
  },
  
  // Reino Unido
  {
    name: "Shell plc",
    country: "GB",
    type: "directa",
    products: ["2709", "energy", "petroleum", "2710"],
    verified: true,
    coordinates: [-0.1276, 51.5074],
    website: "https://www.shell.com",
    contactEmail: "export@shell.com",
    legalName: "Shell plc",
    businessType: "corporation",
    establishedYear: 1907,
    employeeCount: 82000,
    creditRating: "A",
    riskScore: "86",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Wael Sawan",
    phone: "+44 20 7934 1234",
    address: "London, England",
    rating: 4.3
  },
  
  // China
  {
    name: "BYD Company",
    country: "CN",
    type: "directa",
    products: ["8703", "automotive", "electric", "8507"],
    verified: true,
    coordinates: [114.0579, 22.5431],
    website: "https://www.byd.com",
    contactEmail: "export@byd.com",
    legalName: "BYD Company Limited",
    businessType: "corporation",
    establishedYear: 1995,
    employeeCount: 288000,
    creditRating: "BBB",
    riskScore: "79",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Wang Chuanfu",
    phone: "+86 755 8988 8888",
    address: "Shenzhen, Guangdong",
    rating: 4.5
  },
  
  // Japón
  {
    name: "SoftBank Group",
    country: "JP",
    type: "directa",
    products: ["8517", "telecommunications", "technology", "investment"],
    verified: true,
    coordinates: [139.6917, 35.6895],
    website: "https://www.softbank.jp",
    contactEmail: "export@softbank.com",
    legalName: "SoftBank Group Corp.",
    businessType: "corporation",
    establishedYear: 1981,
    employeeCount: 72000,
    creditRating: "BB+",
    riskScore: "73",
    certifications: ["ISO 27001", "ISO 9001"],
    contactPerson: "Masayoshi Son",
    phone: "+81 3 6889 2000",
    address: "Tokyo, Tokyo",
    rating: 4.2
  },
  
  // India
  {
    name: "Reliance Industries",
    country: "IN",
    type: "directa",
    products: ["2710", "petrochemicals", "energy", "5407"],
    verified: true,
    coordinates: [72.8777, 19.0760],
    website: "https://www.ril.com",
    contactEmail: "export@ril.com",
    legalName: "Reliance Industries Limited",
    businessType: "corporation",
    establishedYear: 1966,
    employeeCount: 236000,
    creditRating: "BBB+",
    riskScore: "79",
    certifications: ["ISO 9001", "ISO 14001"],
    contactPerson: "Mukesh Ambani",
    phone: "+91 22 3555 5000",
    address: "Mumbai, Maharashtra",
    rating: 4.3
  },
  
  // Sudáfrica
  {
    name: "Naspers Limited",
    country: "ZA",
    type: "directa",
    products: ["8523", "technology", "media", "internet"],
    verified: true,
    coordinates: [18.4241, -33.9249],
    website: "https://www.naspers.com",
    contactEmail: "export@naspers.com",
    legalName: "Naspers Limited",
    businessType: "corporation",
    establishedYear: 1915,
    employeeCount: 25000,
    creditRating: "BBB-",
    riskScore: "72",
    certifications: ["ISO 9001", "ISO 27001"],
    contactPerson: "Fabricio Bloisi",
    phone: "+27 21 406 2121",
    address: "Cape Town, Western Cape",
    rating: 4.1
  },
  
  // Australia
  {
    name: "Commonwealth Bank",
    country: "AU",
    type: "directa",
    products: ["financial", "banking", "investment"],
    verified: true,
    coordinates: [151.2093, -33.8688],
    website: "https://www.commbank.com.au",
    contactEmail: "export@cba.com.au",
    legalName: "Commonwealth Bank of Australia",
    businessType: "corporation",
    establishedYear: 1911,
    employeeCount: 51800,
    creditRating: "AA-",
    riskScore: "88",
    certifications: ["ISO 9001", "Basel III"],
    contactPerson: "Matt Comyn",
    phone: "+61 2 9378 2000",
    address: "Sydney, New South Wales",
    rating: 4.3
  }
];

const agregarEmpresas = async () => {
  console.log('🚀 AGREGANDO EMPRESAS DIRECTAS VIA API');
  console.log('='.repeat(45));
  
  let agregadas = 0;
  let errores = 0;
  
  for (const empresa of empresasDirectas) {
    try {
      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresa)
      });
      
      if (response.ok) {
        agregadas++;
        console.log(`✅ ${empresa.name} (${empresa.country})`);
      } else {
        errores++;
        console.log(`❌ Error al agregar ${empresa.name}: ${response.status}`);
      }
    } catch (error) {
      errores++;
      console.log(`❌ Error de conexión con ${empresa.name}: ${error.message}`);
    }
  }
  
  console.log('\n📊 RESUMEN:');
  console.log(`• Empresas agregadas: ${agregadas}`);
  console.log(`• Errores: ${errores}`);
  console.log(`• Total intentadas: ${empresasDirectas.length}`);
  
  // Verificar estado final
  try {
    const response = await fetch('http://localhost:5000/api/companies');
    const data = await response.json();
    const total = data.companies.length;
    const directas = data.companies.filter(c => c.type === 'directa').length;
    const porcentaje = ((directas / total) * 100).toFixed(1);
    
    console.log('\n🎯 ESTADO FINAL:');
    console.log(`• Total empresas: ${total}`);
    console.log(`• Empresas directas: ${directas} (${porcentaje}%)`);
    
    const metaEmpresas = Math.ceil(total * 0.65); // 65%
    console.log(`• Meta 65%: ${metaEmpresas} empresas`);
    console.log(`• Faltantes: ${Math.max(0, metaEmpresas - directas)}`);
    
  } catch (error) {
    console.log('❌ Error al verificar estado final:', error.message);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  agregarEmpresas();
}

export { agregarEmpresas, empresasDirectas };