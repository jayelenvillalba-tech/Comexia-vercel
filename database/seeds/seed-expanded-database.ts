
import { db } from '../db';
import { hsPartidas, hsSubpartidas } from '../schema';
import { sql } from 'drizzle-orm';

// Expanded HS Code Data
const EXPANDED_HS_DATA = [
  // --- TECNOLOGÍA (Capítulo 84, 85) ---
  {
    code: '8471.30',
    description: 'Máquinas automáticas para tratamiento o procesamiento de datos, portátiles (Laptops, Tablets)',
    descriptionEn: 'Portable automatic data processing machines (Laptops, Tablets)',
    section: 'XVI',
    chapter: '84',
    keywords: ['laptop', 'notebook', 'tablet', 'computadora', 'pc', 'ordenador']
  },
  {
    code: '8517.13',
    description: 'Teléfonos inteligentes (Smartphones)',
    descriptionEn: 'Smartphones',
    section: 'XVI',
    chapter: '85',
    keywords: ['celular', 'smartphone', 'iphone', 'android', 'móvil', 'telefono']
  },
  {
    code: '8517.62',
    description: 'Aparatos para la recepción, conversión y transmisión o regeneración de voz, imagen u otros datos (Routers, Modems)',
    descriptionEn: 'Machines for the reception, conversion and transmission or regeneration of voice, images or other data',
    section: 'XVI',
    chapter: '85',
    keywords: ['router', 'modem', 'wifi', 'switch', 'red']
  },
  {
    code: '8528.59',
    description: 'Los demás monitores y proyectores, que no incorporen aparato receptor de televisión',
    descriptionEn: 'Other monitors and projectors, not incorporating television reception apparatus',
    section: 'XVI',
    chapter: '85',
    keywords: ['monitor', 'pantalla', 'display', 'proyector']
  },

  // --- AUTOMOTRIZ (Capítulo 87) ---
  {
    code: '8703.23',
    description: 'Automóviles de turismo con motor de émbolo alternativo de encendido por chispa > 1500 cm3 pero <= 3000 cm3',
    descriptionEn: 'Motor cars with spark-ignition internal combustion reciprocating piston engine > 1500 cc but <= 3000 cc',
    section: 'XVII',
    chapter: '87',
    keywords: ['auto', 'coche', 'automóvil', 'car', 'vehículo', 'sedan']
  },
  {
    code: '8704.21',
    description: 'Vehículos para transporte de mercancías (Camiones, Pickups) peso total <= 5 toneladas',
    descriptionEn: 'Motor vehicles for the transport of goods, g.v.w. <= 5 tonnes',
    section: 'XVII',
    chapter: '87',
    keywords: ['camioneta', 'pickup', 'camión', 'furgoneta', 'transporte']
  },
  {
    code: '8708.30',
    description: 'Frenos y servofrenos; sus partes (Repuestos automotrices)',
    descriptionEn: 'Brakes and servo-brakes; parts thereof',
    section: 'XVII',
    chapter: '87',
    keywords: ['freno', 'pastilla', 'disco', 'repuesto', 'autoparte']
  },

  // --- AGROINDUSTRIA (Capítulo 10, 12, 15) ---
  {
    code: '1001.99',
    description: 'Trigo y morcajo (tranquillón), excepto para siembra',
    descriptionEn: 'Wheat and meslin, other than seed',
    section: 'II',
    chapter: '10',
    keywords: ['trigo', 'cereal', 'grano', 'wheat']
  },
  {
    code: '1201.90',
    description: 'Habas (porotos, frijoles) de soja, excepto para siembra',
    descriptionEn: 'Soya beans, other than seed',
    section: 'II',
    chapter: '12',
    keywords: ['soja', 'soya', 'poroto', 'frijol', 'bean']
  },
  {
    code: '1507.10',
    description: 'Aceite de soja (soya) en bruto, incluso desgomado',
    descriptionEn: 'Crude soya-bean oil, whether or not degummed',
    section: 'III',
    chapter: '15',
    keywords: ['aceite', 'soja', 'oil', 'crudo']
  },
  {
    code: '0201.30',
    description: 'Carne de animales de la especie bovina, deshuesada, fresca o refrigerada',
    descriptionEn: 'Meat of bovine animals, boneless, fresh or chilled',
    section: 'I',
    chapter: '02',
    keywords: ['carne', 'bife', 'lomo', 'vacuno', 'bovina', 'meat', 'beef']
  },

  // --- QUÍMICOS Y FARMACÉUTICOS (Capítulo 30, 31) ---
  {
    code: '3004.90',
    description: 'Medicamentos constituidos por productos mezclados o sin mezclar, para usos terapéuticos o profilácticos',
    descriptionEn: 'Medicaments consisting of mixed or unmixed products for therapeutic or prophylactic uses',
    section: 'VI',
    chapter: '30',
    keywords: ['medicamento', 'fármaco', 'medicina', 'pastilla', 'jarabe']
  },
  {
    code: '3105.20',
    description: 'Abonos minerales o químicos con los tres elementos fertilizantes: nitrógeno, fósforo y potasio',
    descriptionEn: 'Mineral or chemical fertilizers containing the three fertilizing elements nitrogen, phosphorus and potassium',
    section: 'VI',
    chapter: '31',
    keywords: ['fertilizante', 'abono', 'npk', 'agro']
  },

  // --- CONSTRUCCIÓN (Capítulo 25, 69, 72) ---
  {
    code: '2523.29',
    description: 'Cemento Portland, excepto el blanco',
    descriptionEn: 'Portland cement, other than white cement',
    section: 'V',
    chapter: '25',
    keywords: ['cemento', 'construcción', 'hormigón']
  },
  {
    code: '6907.21',
    description: 'Plaquitas y baldosas de cerámica, con un coeficiente de absorción de agua <= 0,5%',
    descriptionEn: 'Ceramic flags and paving, hearth or wall tiles, water absorption coefficient <= 0.5%',
    section: 'XIII',
    chapter: '69',
    keywords: ['cerámica', 'piso', 'baldosa', 'porcelanato', 'azulejo']
  }
];

async function seedExpandedHsCodes() {
  console.log('🌱 Seeding Expanded HS Codes...');
  
  // Use SQLite specific implementation if needed, but here we use Drizzle
  // We will insert into hs_subpartidas as these are mostly 6-digit codes
  
  for (const item of EXPANDED_HS_DATA) {
    try {
      // Check if exists
      const existing = await db.select().from(hsSubpartidas).where(sql`code = ${item.code}`).get();
      
      if (!existing) {
        await db.insert(hsSubpartidas).values({
          code: item.code,
          description: item.description,
          descriptionEn: item.descriptionEn,
          section: item.section,
          chapter: item.chapter,
          keywords: JSON.stringify(item.keywords)
        });
        console.log(`✅ Inserted: ${item.code} - ${item.description.substring(0, 30)}...`);
      } else {
        console.log(`⚠️ Skipped (Exists): ${item.code}`);
      }
    } catch (error) {
      console.error(`❌ Error inserting ${item.code}:`, error);
    }
  }
  
  console.log('✨ Expanded HS Codes seeding completed!');
}

// Run if called directly
if (process.argv[1] === import.meta.url.replace('file://', '').replace('/', '\\')) {
    seedExpandedHsCodes()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { seedExpandedHsCodes };
