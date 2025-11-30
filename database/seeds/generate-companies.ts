import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { companies } from '../../shared/shared/schema-sqlite.js';
import { sql } from 'drizzle-orm';

// Company name generators by country
const companyPrefixes = {
  AR: ['Agro', 'Pampa', 'Sur', 'Río', 'Andes', 'Plata', 'Austral', 'Continental'],
  BR: ['Brasil', 'Tropical', 'Amazônia', 'Paulista', 'Carioca', 'Sul', 'Verde'],
  CL: ['Andino', 'Pacífico', 'Austral', 'Cordillera', 'Valle', 'Norte'],
  UY: ['Oriental', 'Río', 'Plata', 'Sur', 'Atlántico'],
  PE: ['Inca', 'Pacífico', 'Andino', 'Lima', 'Cusco'],
  MX: ['Azteca', 'Maya', 'Norte', 'Pacífico', 'Golfo'],
  CO: ['Andino', 'Caribe', 'Pacífico', 'Cafetero'],
  EC: ['Ecuatorial', 'Pacífico', 'Andino', 'Amazónico']
};

const companySuffixes = ['S.A.', 'Ltda.', 'S.R.L.', 'Inc.', 'Corp.', 'Group', 'Trading', 'Export', 'Import'];

const industries = [
  { name: 'Alimentos', products: ['0901', '1001', '1005', '1201', '0201', '0203', '0406', '0402'] },
  { name: 'Tecnología', products: ['8517', '8471', '8528', '8443', '8450', '8418'] },
  { name: 'Textil', products: ['6109', '6203', '6402'] },
  { name: 'Automotriz', products: ['8703', '8708', '8711', '4011'] },
  { name: 'Bebidas', products: ['2204', '2203', '0902'] },
  { name: 'Farmacéutico', products: ['3004', '9018'] },
  { name: 'Cosmético', products: ['3303', '3304'] },
  { name: 'Muebles', products: ['9403', '4407'] },
  { name: 'Juguetes', products: ['9503', '9506'] },
  { name: 'Papel', products: ['4901', '4802'] }
];

const countries = ['AR', 'BR', 'CL', 'UY', 'PE', 'MX', 'CO', 'EC', 'PY', 'BO'];

function generateCompanyName(country: string, industry: string): string {
  const prefixes = companyPrefixes[country as keyof typeof companyPrefixes] || ['Global', 'International'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
  
  return `${prefix} ${industry} ${suffix}`;
}

function generateEmail(companyName: string): string {
  const cleanName = companyName.toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  return `contact@${cleanName}.com`;
}

function generatePhone(country: string): string {
  const areaCodes: { [key: string]: string } = {
    AR: '+54 11',
    BR: '+55 11',
    CL: '+56 2',
    UY: '+598 2',
    PE: '+51 1',
    MX: '+52 55',
    CO: '+57 1',
    EC: '+593 2'
  };
  
  const areaCode = areaCodes[country] || '+1 555';
  const number = Math.floor(1000000 + Math.random() * 9000000);
  
  return `${areaCode} ${number}`;
}

function generateCreditRating(): 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' {
  const ratings: ('AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B')[] = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B'];
  const weights = [10, 20, 30, 25, 10, 5]; // Higher probability for better ratings
  
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (let i = 0; i < ratings.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return ratings[i];
    }
  }
  
  return 'A';
}

function generateRiskScore(): number {
  // Lower is better (0-100)
  return Math.floor(Math.random() * 40) + 10; // 10-50 range
}

function generateCompanyCoordinates(country: string): [number, number] {
  // Approximate bounds for countries to generate realistic marker positions
  const bounds: { [key: string]: { lat: [number, number], lng: [number, number] } } = {
    AR: { lat: [-34.0, -38.0], lng: [-58.0, -64.0] }, // Buenos Aires region
    BR: { lat: [-23.0, -24.0], lng: [-46.0, -47.0] }, // Sao Paulo region
    CL: { lat: [-33.0, -34.0], lng: [-70.0, -71.0] }, // Santiago region
    UY: { lat: [-34.0, -35.0], lng: [-56.0, -57.0] }, // Montevideo region
    PE: { lat: [-12.0, -13.0], lng: [-77.0, -78.0] }, // Lima region
    MX: { lat: [19.0, 20.0], lng: [-99.0, -100.0] }, // Mexico City region
    CO: { lat: [4.0, 5.0], lng: [-74.0, -75.0] }, // Bogota region
    EC: { lat: [-0.1, -0.3], lng: [-78.0, -79.0] }, // Quito region
    PY: { lat: [-25.0, -26.0], lng: [-57.0, -58.0] }, // Asuncion region
    BO: { lat: [-16.0, -17.0], lng: [-68.0, -69.0] }, // La Paz region
    US: { lat: [30.0, 45.0], lng: [-75.0, -120.0] }, // USA broad
    CN: { lat: [20.0, 40.0], lng: [100.0, 120.0] }, // China broad
    DE: { lat: [47.0, 55.0], lng: [6.0, 15.0] }, // Germany
    ES: { lat: [36.0, 43.0], lng: [-9.0, 3.0] } // Spain
  };

  const bound = bounds[country] || { lat: [0, 0], lng: [0, 0] };
  const lat = bound.lat[0] + Math.random() * (bound.lat[1] - bound.lat[0]);
  const lng = bound.lng[0] + Math.random() * (bound.lng[1] - bound.lng[0]);
  
  return [lat, lng];
}

async function generateCompanies() {
  try {
    console.log('🏢 Starting company generation...');
    
    await initDatabase();
    console.log('✅ Database initialized');

    const newCompanies = [];
    let generatedCount = 0;

    // Generate 100 companies
    for (let i = 0; i < 100; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const type = Math.random() > 0.5 ? 'exporter' : Math.random() > 0.5 ? 'importer' : 'both';
      
      const companyName = generateCompanyName(country, industry.name);
      const email = generateEmail(companyName);
      const phone = generatePhone(country);
      const creditRating = generateCreditRating();
      const riskScore = generateRiskScore();
      
      // Select 2-4 products from the industry
      const numProducts = Math.floor(Math.random() * 3) + 2;
      const selectedProducts = [];
      for (let j = 0; j < numProducts; j++) {
        const product = industry.products[Math.floor(Math.random() * industry.products.length)];
        if (!selectedProducts.includes(product)) {
          selectedProducts.push(product);
        }
      }
      
      const company = {
        id: `COMP-${Date.now()}-${i}`,
        name: companyName,
        country,
        type: type as 'exporter' | 'importer' | 'both',
        products: selectedProducts.join(', '),
        businessType: industry.name,
        creditRating,
        riskScore,
        email,
        phone,
        address: `${Math.floor(Math.random() * 9999)} Main Street`,
        city: country === 'AR' ? 'Buenos Aires' : 
              country === 'BR' ? 'São Paulo' :
              country === 'CL' ? 'Santiago' :
              country === 'UY' ? 'Montevideo' :
              country === 'PE' ? 'Lima' :
              country === 'MX' ? 'Ciudad de México' :
              country === 'CO' ? 'Bogotá' : 'Quito',
        verified: Math.random() > 0.3, // 70% verified
        certifications: Math.random() > 0.5 ? ['ISO 9001', 'ISO 14001'] : null,
        website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        coordinates: generateCompanyCoordinates(country)
      };
      
      newCompanies.push(company);
    }

    // Insert companies in batches
    console.log(`📦 Inserting ${newCompanies.length} companies...`);
    
    for (const company of newCompanies) {
      try {
        await db.insert(companies).values(company);
        generatedCount++;
        
        if (generatedCount % 10 === 0) {
          console.log(`  ✅ Inserted ${generatedCount}/${newCompanies.length} companies`);
        }
      } catch (error: any) {
        console.error(`  ❌ Error inserting ${company.name}:`, error.message);
      }
    }

    await saveDatabase();
    console.log('💾 Database saved');

    // Get total count
    const totalCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
    
    console.log('\n📊 Summary:');
    console.log(`  ✅ Generated: ${generatedCount} companies`);
    console.log(`  🎯 Total companies in database: ${totalCount[0].count}`);
    
    // Show distribution by country
    console.log('\n🌍 Distribution by country:');
    for (const country of countries) {
      const countryCompanies = newCompanies.filter(c => c.country === country);
      console.log(`  ${country}: ${countryCompanies.length} companies`);
    }
    
    // Show distribution by type
    console.log('\n📈 Distribution by type:');
    const exporters = newCompanies.filter(c => c.type === 'exporter').length;
    const importers = newCompanies.filter(c => c.type === 'importer').length;
    const both = newCompanies.filter(c => c.type === 'both').length;
    console.log(`  Exporters: ${exporters}`);
    console.log(`  Importers: ${importers}`);
    console.log(`  Both: ${both}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  }
}

// Run the generation
generateCompanies()
  .then(() => {
    console.log('\n✨ Company generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Generation failed:', error);
    process.exit(1);
  });
