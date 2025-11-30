import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { hsSubpartidas } from '../../shared/shared/schema-sqlite.js';
import { sql } from 'drizzle-orm';
const additionalHSCodes = [
  // Technology & Electronics (Chapter 85)
  {
    code: '8517',
    description: 'Teléfonos móviles (smartphones)',
    descriptionEn: 'Mobile phones (smartphones)',
    chapterCode: '85',
    partidaCode: '8517',
    tariffRate: 16,
    restrictions: ['Homologación ENACOM', 'Certificación de calidad']
  },
  {
    code: '8471',
    description: 'Computadoras portátiles y tablets',
    descriptionEn: 'Laptops and tablets',
    chapterCode: '84',
    partidaCode: '8471',
    tariffRate: 14,
    restrictions: ['Certificación energética']
  },
  {
    code: '8528',
    description: 'Monitores y televisores',
    descriptionEn: 'Monitors and televisions',
    chapterCode: '85',
    partidaCode: '8528',
    tariffRate: 18,
    restrictions: []
  },
  
  // Agricultural Products (Chapters 01-10)
  {
    code: '1201',
    description: 'Habas de soja',
    descriptionEn: 'Soybeans',
    chapterCode: '12',
    partidaCode: '1201',
    tariffRate: 5,
    restrictions: ['Certificado fitosanitario']
  },
  {
    code: '1005',
    description: 'Maíz',
    descriptionEn: 'Corn (maize)',
    chapterCode: '10',
    partidaCode: '1005',
    tariffRate: 8,
    restrictions: ['Certificado fitosanitario', 'Análisis de transgénicos']
  },
  {
    code: '1001',
    description: 'Trigo',
    descriptionEn: 'Wheat',
    chapterCode: '10',
    partidaCode: '1001',
    tariffRate: 10,
    restrictions: ['Certificado fitosanitario']
  },
  {
    code: '0201',
    description: 'Carne de bovino fresca o refrigerada',
    descriptionEn: 'Fresh or chilled beef',
    chapterCode: '02',
    partidaCode: '0201',
    tariffRate: 12,
    restrictions: ['Certificado sanitario SENASA', 'Trazabilidad', 'Cuota Hilton']
  },
  {
    code: '0203',
    description: 'Carne de porcino',
    descriptionEn: 'Pork meat',
    chapterCode: '02',
    partidaCode: '0203',
    tariffRate: 10,
    restrictions: ['Certificado sanitario']
  },
  {
    code: '0304',
    description: 'Filetes de pescado',
    descriptionEn: 'Fish fillets',
    chapterCode: '03',
    partidaCode: '0304',
    tariffRate: 11,
    restrictions: ['Certificado sanitario', 'Trazabilidad pesquera']
  },
  {
    code: '0805',
    description: 'Cítricos (naranjas, limones)',
    descriptionEn: 'Citrus fruits (oranges, lemons)',
    chapterCode: '08',
    partidaCode: '0805',
    tariffRate: 8,
    restrictions: ['Certificado fitosanitario', 'Tratamiento de frío']
  },
  
  // Textiles & Apparel (Chapters 61-62)
  {
    code: '6109',
    description: 'Camisetas y remeras de algodón',
    descriptionEn: 'T-shirts and cotton shirts',
    chapterCode: '61',
    partidaCode: '6109',
    tariffRate: 20,
    restrictions: []
  },
  {
    code: '6203',
    description: 'Pantalones y jeans',
    descriptionEn: 'Trousers and jeans',
    chapterCode: '62',
    partidaCode: '6203',
    tariffRate: 22,
    restrictions: []
  },
  {
    code: '6402',
    description: 'Calzado deportivo',
    descriptionEn: 'Sports footwear',
    chapterCode: '64',
    partidaCode: '6402',
    tariffRate: 24,
    restrictions: []
  },
  
  // Automotive (Chapter 87)
  {
    code: '8703',
    description: 'Automóviles de turismo',
    descriptionEn: 'Passenger cars',
    chapterCode: '87',
    partidaCode: '8703',
    tariffRate: 35,
    restrictions: ['Homologación vehicular', 'Normas de emisión', 'Cupo de importación']
  },
  {
    code: '8708',
    description: 'Partes y accesorios de vehículos',
    descriptionEn: 'Vehicle parts and accessories',
    chapterCode: '87',
    partidaCode: '8708',
    tariffRate: 18,
    restrictions: ['Certificación de origen']
  },
  {
    code: '8711',
    description: 'Motocicletas',
    descriptionEn: 'Motorcycles',
    chapterCode: '87',
    partidaCode: '8711',
    tariffRate: 28,
    restrictions: ['Homologación']
  },
  
  // Chemicals & Pharmaceuticals (Chapter 30)
  {
    code: '3004',
    description: 'Medicamentos',
    descriptionEn: 'Pharmaceutical products',
    chapterCode: '30',
    partidaCode: '3004',
    tariffRate: 0,
    restrictions: ['Registro ANMAT', 'Buenas prácticas de manufactura']
  },
  {
    code: '3303',
    description: 'Perfumes y aguas de tocador',
    descriptionEn: 'Perfumes and toilet waters',
    chapterCode: '33',
    partidaCode: '3303',
    tariffRate: 16,
    restrictions: []
  },
  
  // Beverages (Chapter 22)
  {
    code: '2204',
    description: 'Vino',
    descriptionEn: 'Wine',
    chapterCode: '22',
    partidaCode: '2204',
    tariffRate: 20,
    restrictions: ['Certificado enológico', 'Análisis bromatológico']
  },
  {
    code: '2203',
    description: 'Cerveza',
    descriptionEn: 'Beer',
    chapterCode: '22',
    partidaCode: '2203',
    tariffRate: 18,
    restrictions: []
  },
  
  // Oils & Fats (Chapter 15)
  {
    code: '1507',
    description: 'Aceite de soja',
    descriptionEn: 'Soybean oil',
    chapterCode: '15',
    partidaCode: '1507',
    tariffRate: 6,
    restrictions: []
  },
  {
    code: '1509',
    description: 'Aceite de oliva',
    descriptionEn: 'Olive oil',
    chapterCode: '15',
    partidaCode: '1509',
    tariffRate: 8,
    restrictions: ['Certificado de origen', 'Análisis de calidad']
  },
  
  // Furniture (Chapter 94)
  {
    code: '9403',
    description: 'Muebles de madera',
    descriptionEn: 'Wooden furniture',
    chapterCode: '94',
    partidaCode: '9403',
    tariffRate: 16,
    restrictions: []
  },
  
  // Toys & Sports (Chapters 95)
  {
    code: '9503',
    description: 'Juguetes',
    descriptionEn: 'Toys',
    chapterCode: '95',
    partidaCode: '9503',
    tariffRate: 20,
    restrictions: ['Certificación de seguridad']
  },
  {
    code: '9506',
    description: 'Artículos deportivos',
    descriptionEn: 'Sports equipment',
    chapterCode: '95',
    partidaCode: '9506',
    tariffRate: 14,
    restrictions: []
  },
  
  // Paper & Books (Chapter 48-49)
  {
    code: '4901',
    description: 'Libros impresos',
    descriptionEn: 'Printed books',
    chapterCode: '49',
    partidaCode: '4901',
    tariffRate: 0,
    restrictions: []
  },
  {
    code: '4802',
    description: 'Papel para impresión',
    descriptionEn: 'Printing paper',
    chapterCode: '48',
    partidaCode: '4802',
    tariffRate: 12,
    restrictions: []
  },
  
  // Plastics (Chapter 39)
  {
    code: '3923',
    description: 'Envases de plástico',
    descriptionEn: 'Plastic containers',
    chapterCode: '39',
    partidaCode: '3923',
    tariffRate: 14,
    restrictions: []
  },
  
  // Machinery (Chapter 84)
  {
    code: '8443',
    description: 'Impresoras y equipos de impresión',
    descriptionEn: 'Printers and printing equipment',
    chapterCode: '84',
    partidaCode: '8443',
    tariffRate: 12,
    restrictions: []
  },
  {
    code: '8450',
    description: 'Máquinas lavadoras',
    descriptionEn: 'Washing machines',
    chapterCode: '84',
    partidaCode: '8450',
    tariffRate: 16,
    restrictions: ['Certificación energética']
  },
  {
    code: '8418',
    description: 'Refrigeradores y congeladores',
    descriptionEn: 'Refrigerators and freezers',
    chapterCode: '84',
    partidaCode: '8418',
    tariffRate: 18,
    restrictions: ['Certificación energética', 'Gases refrigerantes']
  },
  
  // Optical & Medical (Chapter 90)
  {
    code: '9018',
    description: 'Instrumentos médicos',
    descriptionEn: 'Medical instruments',
    chapterCode: '90',
    partidaCode: '9018',
    tariffRate: 0,
    restrictions: ['Registro ANMAT']
  },
  {
    code: '9004',
    description: 'Anteojos y gafas',
    descriptionEn: 'Eyeglasses and spectacles',
    chapterCode: '90',
    partidaCode: '9004',
    tariffRate: 14,
    restrictions: []
  },
  
  // Jewelry (Chapter 71)
  {
    code: '7113',
    description: 'Joyería de metales preciosos',
    descriptionEn: 'Jewelry of precious metals',
    chapterCode: '71',
    partidaCode: '7113',
    tariffRate: 20,
    restrictions: ['Certificación de quilates']
  },
  
  // Cosmetics (Chapter 33)
  {
    code: '3304',
    description: 'Productos de belleza y maquillaje',
    descriptionEn: 'Beauty and makeup products',
    chapterCode: '33',
    partidaCode: '3304',
    tariffRate: 16,
    restrictions: []
  },
  
  // Coffee & Tea (Chapter 09)
  {
    code: '0902',
    description: 'Té',
    descriptionEn: 'Tea',
    chapterCode: '09',
    partidaCode: '0902',
    tariffRate: 10,
    restrictions: []
  },
  {
    code: '1801',
    description: 'Cacao en grano',
    descriptionEn: 'Cocoa beans',
    chapterCode: '18',
    partidaCode: '1801',
    tariffRate: 8,
    restrictions: ['Certificado fitosanitario']
  },
  {
    code: '1806',
    description: 'Chocolate y preparaciones con cacao',
    descriptionEn: 'Chocolate and cocoa preparations',
    chapterCode: '18',
    partidaCode: '1806',
    tariffRate: 14,
    restrictions: []
  },
  
  // Dairy (Chapter 04)
  {
    code: '0406',
    description: 'Quesos',
    descriptionEn: 'Cheese',
    chapterCode: '04',
    partidaCode: '0406',
    tariffRate: 16,
    restrictions: ['Certificado sanitario', 'Registro de establecimiento']
  },
  {
    code: '0402',
    description: 'Leche en polvo',
    descriptionEn: 'Milk powder',
    chapterCode: '04',
    partidaCode: '0402',
    tariffRate: 12,
    restrictions: ['Certificado sanitario']
  },
  
  // Tobacco (Chapter 24)
  {
    code: '2402',
    description: 'Cigarrillos',
    descriptionEn: 'Cigarettes',
    chapterCode: '24',
    partidaCode: '2402',
    tariffRate: 16,
    restrictions: ['Impuestos internos', 'Advertencias sanitarias']
  },
  
  // Rubber (Chapter 40)
  {
    code: '4011',
    description: 'Neumáticos nuevos',
    descriptionEn: 'New pneumatic tires',
    chapterCode: '40',
    partidaCode: '4011',
    tariffRate: 18,
    restrictions: []
  },
  
  // Wood (Chapter 44)
  {
    code: '4407',
    description: 'Madera aserrada',
    descriptionEn: 'Sawn wood',
    chapterCode: '44',
    partidaCode: '4407',
    tariffRate: 10,
    restrictions: ['Certificado fitosanitario', 'Tratamiento térmico']
  },
  
  // Ceramics (Chapter 69)
  {
    code: '6911',
    description: 'Vajilla de porcelana',
    descriptionEn: 'Porcelain tableware',
    chapterCode: '69',
    partidaCode: '6911',
    tariffRate: 16,
    restrictions: []
  },
  
  // Glass (Chapter 70)
  {
    code: '7013',
    description: 'Artículos de vidrio para mesa',
    descriptionEn: 'Glassware for table',
    chapterCode: '70',
    partidaCode: '7013',
    tariffRate: 14,
    restrictions: []
  },
  
  // Iron & Steel (Chapter 72-73)
  {
    code: '7308',
    description: 'Estructuras de hierro o acero',
    descriptionEn: 'Iron or steel structures',
    chapterCode: '73',
    partidaCode: '7308',
    tariffRate: 12,
    restrictions: []
  },
  
  // Copper (Chapter 74)
  {
    code: '7408',
    description: 'Alambre de cobre',
    descriptionEn: 'Copper wire',
    chapterCode: '74',
    partidaCode: '7408',
    tariffRate: 10,
    restrictions: []
  },
  
  // Aluminum (Chapter 76)
  {
    code: '7606',
    description: 'Chapas de aluminio',
    descriptionEn: 'Aluminum plates',
    chapterCode: '76',
    partidaCode: '7606',
    tariffRate: 12,
    restrictions: []
  }
];

async function seedAdditionalHSCodes() {
  try {
    console.log('🌱 Starting additional HS codes seeding...');
    
    await initDatabase();
    console.log('✅ Database initialized');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const hsCode of additionalHSCodes) {
      try {
        // Check if code already exists
        const existing = await db.query.hsSubpartidas.findFirst({
          where: (subpartidas, { eq }) => eq(subpartidas.code, hsCode.code)
        });

        if (existing) {
          console.log(`⏭️  Skipping ${hsCode.code} - already exists`);
          skippedCount++;
          continue;
        }

        // Insert the HS code
        await db.insert(hsSubpartidas).values({
          code: hsCode.code,
          description: hsCode.description,
          descriptionEn: hsCode.descriptionEn,
          chapterCode: hsCode.chapterCode,
          partidaCode: hsCode.partidaCode,
          tariffRate: hsCode.tariffRate,
          restrictions: hsCode.restrictions,
          isActive: true
        });

        insertedCount++;
        console.log(`✅ Inserted ${hsCode.code} - ${hsCode.description}`);
      } catch (error: any) {
        console.error(`❌ Error inserting ${hsCode.code}:`, error.message);
      }
    }

    await saveDatabase();
    console.log('💾 Database saved');

    console.log('\n📊 Summary:');
    console.log(`  ✅ Inserted: ${insertedCount} HS codes`);
    console.log(`  ⏭️  Skipped: ${skippedCount} HS codes (already exist)`);
    console.log(`  📦 Total attempted: ${additionalHSCodes.length}`);
    
    // Get total count
    const totalCount = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    console.log(`  🎯 Total HS codes in database: ${totalCount[0].count}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  }
}

// Run the seeding
seedAdditionalHSCodes()
  .then(() => {
    console.log('\n✨ Additional HS codes seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
