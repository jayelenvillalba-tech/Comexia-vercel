import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';
import crypto from 'crypto';

console.log('=== SEED: CAPA 2 - REQUISITOS ESPECÍFICOS (PRODUCT OVERLAYS) ===');

async function main() {
  try {
    await initDatabase();
    
    // We are appending to 'country_requirements' which acts as the specific layer
    // We don't delete everything, we just add/update specific overlays
    
    console.log('📊 Insertando Reglas de Categoría (Smart Layers)...');
    
    // DEFINICIÓN DE REGLAS POR CAPÍTULO/SECTOR
    
    // 1. CARNES (Capítulo 02) - Regla Global para China
    const MEAT_CN_DOCS = JSON.stringify([
        { name: "Certificado Veterinario Oficial", importance: "Mandatory", issuer: "Autoridad Sanitaria (ej. SENASA/SAG)" },
        { name: "Lista de Empaque Detallada (Cortes)", importance: "Mandatory" },
        { name: "Certificado de Planta Habilitada", importance: "Mandatory" }
    ]);
    const MEAT_CN_PHYTO = JSON.stringify(["Libre de Fiebre Aftosa", "Libre de Ractopamina", "Cadena de Frío -18°C"]);
    
    // 2. FRUTAS (Capítulo 08) - Regla Global para USA
    const FRUIT_US_DOCS = JSON.stringify([
        { name: "Phytosanitary Certificate", importance: "Mandatory", issuer: "National Plant Protection Org" },
        { name: "USDA Import Permit (if applicable)", importance: "Conditional" }
    ]);
    const FRUIT_US_PHYTO = JSON.stringify(["Treatment Certificate (Cold/Heat)", "Free from Fruit Fly"]);
    
    // 3. QUÍMICOS (Capítulo 28/29) - Regla Global para UE
    const CHEM_EU_DOCS = JSON.stringify([
        { name: "Safety Data Sheet (SDS) - REACH Compliant", importance: "Mandatory" },
        { name: "REACH Registration Number", importance: "Mandatory" }
    ]);
    const CHEM_EU_LABELS = JSON.stringify(["CLP Regulation Labeling", "Hazard Pictograms"]);

    // 4. TEXTILES (Capítulo 50-63) - Regla Global para USA
    const TEXTILE_US_DOCS = JSON.stringify([
        { name: "Certificate of Origin (Textile Declaration)", importance: "Mandatory" },
        { name: "Care Labeling Form", importance: "Mandatory" }
    ]);
    const TEXTILE_US_LABELS = JSON.stringify(["Fiber Content", "Country of Origin", "Manufacturer ID (RN Number)"]);

    // DATASET TO INSERT
    const OVERLAYS = [
        // CHINA RULES
        { country: 'CN', hs: '02', docs: MEAT_CN_DOCS, phyto: MEAT_CN_PHYTO, label: '[]' }, // Meat
        { country: 'CN', hs: '08', docs: FRUIT_US_DOCS, phyto: FRUIT_US_PHYTO, label: '[]' }, // Fruits (using generic fruit logic)
        
        // USA RULES
        { country: 'US', hs: '08', docs: FRUIT_US_DOCS, phyto: FRUIT_US_PHYTO, label: '[]' }, // Fruits
        { country: 'US', hs: '50', docs: TEXTILE_US_DOCS, phyto: '[]', label: TEXTILE_US_LABELS }, // Silk
        { country: 'US', hs: '52', docs: TEXTILE_US_DOCS, phyto: '[]', label: TEXTILE_US_LABELS }, // Cotton
        { country: 'US', hs: '61', docs: TEXTILE_US_DOCS, phyto: '[]', label: TEXTILE_US_LABELS }, // Apparel Knitted
        { country: 'US', hs: '62', docs: TEXTILE_US_DOCS, phyto: '[]', label: TEXTILE_US_LABELS }, // Apparel Not Knitted
        
        // EU RULES
        { country: 'DE', hs: '28', docs: CHEM_EU_DOCS, phyto: '[]', label: CHEM_EU_LABELS }, // Chemicals
        { country: 'FR', hs: '28', docs: CHEM_EU_DOCS, phyto: '[]', label: CHEM_EU_LABELS },
        { country: 'ES', hs: '28', docs: CHEM_EU_DOCS, phyto: '[]', label: CHEM_EU_LABELS },
        { country: 'IT', hs: '29', docs: CHEM_EU_DOCS, phyto: '[]', label: CHEM_EU_LABELS }, // Organic Chems
    ];

    const insertStmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO country_requirements 
      (id, country_code, hs_code, required_documents, technical_standards, phytosanitary_reqs, labeling_reqs, packaging_reqs, estimated_processing_time, additional_fees)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let inserted = 0;
    for (const rule of OVERLAYS) {
        const id = crypto.randomUUID();
        // Using array binding for sql.js compatibility
        insertStmt.run([
            id, 
            rule.country, 
            rule.hs, 
            rule.docs, 
            '[]', // Tech standards
            rule.phyto, 
            rule.label, 
            '[]', // Packaging
            15,   // Default time
            '{}'  // Default fees
        ]);
        inserted++;
        process.stdout.write('.');
    }

    console.log('');
    saveDatabase();
    console.log(`✅ ${inserted} Reglas de Capa Específica insertadas.`);
    console.log('🧠 El sistema ahora entiende categorías completas (ej. "Toda la carne a China").');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
