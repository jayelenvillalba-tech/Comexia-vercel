
import { db } from '../db';
import { countryRequirements } from '../../shared/shared/schema';
import { sql } from 'drizzle-orm';

const MOCK_REQUIREMENTS = [
  // --- CARNE BOVINA (0201) ---
  // Argentina -> China
  {
    countryCode: 'CN', // Destination: China
    hsCode: '0201', // Meat
    requiredDocuments: JSON.stringify([
      'Certificado Sanitario Internacional (CSI)',
      'Lista de Empaque (Packing List)',
      'Certificado de Origen',
      'Certificado Halal (si aplica)',
      'Certificado COVID-free (según normativa vigente)'
    ]),
    technicalStandards: JSON.stringify([
      'GB 2707-2016 (National Food Safety Standard for Fresh (Frozen) Livestock and Poultry Products)',
      'Registro de planta habilitada en GACC (General Administration of Customs China)'
    ]),
    phytosanitaryReqs: JSON.stringify([
      'Libre de Fiebre Aftosa (con o sin vacunación según zona)',
      'Ausencia de residuos de ractopamina'
    ]),
    labelingReqs: JSON.stringify([
      'Etiqueta en chino e inglés',
      'Número de registro de establecimiento visible',
      'Fecha de producción y vencimiento',
      'Código QR de trazabilidad'
    ]),
    packagingReqs: JSON.stringify([
      'Envase primario: Polietileno de grado alimenticio',
      'Cajas de cartón corrugado de alta resistencia'
    ]),
    estimatedProcessingTime: 45,
    additionalFees: JSON.stringify({
      inspection_fee: '150 USD',
      registration_fee: '500 USD'
    })
  },
  // Argentina -> USA
  {
    countryCode: 'US', // Destination: USA
    hsCode: '0201',
    requiredDocuments: JSON.stringify([
      'FSIS Form 9060-5 (Meat and Poultry Export Certificate of Wholesomeness)',
      'Commercial Invoice',
      'Bill of Lading'
    ]),
    technicalStandards: JSON.stringify([
      'USDA/FSIS equivalence standards',
      'HACCP System Implementation'
    ]),
    phytosanitaryReqs: JSON.stringify([
      'Shiga toxin-producing E. coli (STEC) testing negative',
      'Salmonella testing compliance'
    ]),
    labelingReqs: JSON.stringify([
      'Country of Origin Labeling (COOL)',
      'Net Weight in lbs/oz and kg/g',
      'Handling Instructions'
    ]),
    packagingReqs: JSON.stringify([
      'Vacuum sealed packs',
      'Tamper-evident cartons'
    ]),
    estimatedProcessingTime: 30,
    additionalFees: JSON.stringify({
      fsis_inspection: '200 USD'
    })
  },

  // --- SOJA (1201) ---
  // Brazil -> China
  {
    countryCode: 'CN',
    hsCode: '1201', // Soya beans
    requiredDocuments: JSON.stringify([
      'Phytosanitary Certificate',
      'Certificate of Origin',
      'GMO Safety Certificate',
      'Quality Certificate (Protein/Moisture content)'
    ]),
    technicalStandards: JSON.stringify([
      'GB 1352-2009 (Soybean Standard)',
      'Ministry of Agriculture GMO Safety Assessment'
    ]),
    phytosanitaryReqs: JSON.stringify([
      'Free from quarantine pests (e.g., Sorghum halepense)',
      'Maximum residue limits for pesticides'
    ]),
    labelingReqs: JSON.stringify([
      'GMO declaration clearly marked',
      'Batch number and origin'
    ]),
    packagingReqs: JSON.stringify([
      'Bulk shipment requirements',
      'Fumigation prior to loading'
    ]),
    estimatedProcessingTime: 20,
    additionalFees: JSON.stringify({
      port_inspection: '0.5 USD/ton'
    })
  },

  // --- VINOS (2204) ---
  // Chile -> USA
  {
    countryCode: 'US',
    hsCode: '2204', // Wine
    requiredDocuments: JSON.stringify([
      'TTB COLA (Certificate of Label Approval)',
      'FDA Facility Registration',
      'Certificate of Origin (US-Chile FTA)'
    ]),
    technicalStandards: JSON.stringify([
      '27 CFR Part 4 (Labeling and Advertising of Wine)',
      'Sulfites declaration'
    ]),
    phytosanitaryReqs: JSON.stringify([]),
    labelingReqs: JSON.stringify([
      'Government Warning statement',
      'Alcohol content by volume',
      '"Contains Sulfites" if > 10ppm'
    ]),
    packagingReqs: JSON.stringify([
      'Glass bottle standards',
      'Cork/Screw cap integrity'
    ]),
    estimatedProcessingTime: 15,
    additionalFees: JSON.stringify({
      cola_application: '0 USD (online)'
    })
  }
];

async function seedCountryRequirements() {
  console.log('🌱 Seeding Country Requirements...');
  
  // Note: Using 'any' cast because the schema definition might differ slightly between runtime 
  // environments (Sqlite vs PG imports) but the logic is compatible.
  
  for (const item of MOCK_REQUIREMENTS) {
    try {
      await db.insert(countryRequirements as any).values({
        countryCode: item.countryCode,
        hsCode: item.hsCode,
        requiredDocuments: item.requiredDocuments,
        technicalStandards: item.technicalStandards,
        phytosanitaryReqs: item.phytosanitaryReqs,
        labelingReqs: item.labelingReqs,
        packagingReqs: item.packagingReqs,
        estimatedProcessingTime: item.estimatedProcessingTime,
        additionalFees: item.additionalFees,
      });
      console.log(`✅ Inserted reqs for HS ${item.hsCode} -> ${item.countryCode}`);
    } catch (error) {
      console.error(`❌ Error inserting reqs for ${item.hsCode}:`, error);
    }
  }
  
  console.log('✨ Country Requirements seeding completed!');
}

// Run if called directly
if (process.argv[1] === import.meta.url.replace('file://', '').replace('/', '\\')) {
    seedCountryRequirements()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { seedCountryRequirements };
