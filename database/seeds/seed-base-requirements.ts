import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: CAPA 1 - REQUISITOS BASE (130 PAÍSES) ===');

async function main() {
  try {
    await initDatabase();
    
    // Ensure table created
    console.log('🏗️ Verificando tabla country_base_requirements...');
    sqliteDb.run(`CREATE TABLE IF NOT EXISTS country_base_requirements (
        id TEXT PRIMARY KEY,
        country_code TEXT NOT NULL UNIQUE,
        trade_bloc TEXT,
        base_documents TEXT,
        general_customs_process TEXT
    )`);
    
    // Clean table
    console.log('🧹 Limpiando tabla country_base_requirements...');
    try { sqliteDb.run('DELETE FROM country_base_requirements'); } catch(e) {}
    
    // DATA DEFINITIONS (SMART LAYERS)
    
    // 1. MERCOSUR (Argentina, Brazil, Uruguay, Paraguay) + Bolivia
    const MERCOSUR_DOCS = JSON.stringify([
        { name: "Factura Comercial", importance: "Mandatory" },
        { name: "Lista de Empaque (Packing List)", importance: "Mandatory" },
        { name: "Certificado de Origen MERCOSUR", importance: "Mandatory for Preference" },
        { name: "Conocimiento de Embarque (CRT/BL)", importance: "Mandatory" },
        { name: "Declaración de Aduana de Importación", importance: "Mandatory" }
    ]);
    const MERCOSUR_PROCESS = "Despacho simplificado intra-zona. Canal verde/naranja/rojo.";
    
    // 2. UNIÓN EUROPEA (27 members)
    const EU_DOCS = JSON.stringify([
        { name: "Commercial Invoice", importance: "Mandatory" },
        { name: "Packing List", importance: "Mandatory" },
        { name: "Single Administrative Document (SAD)", importance: "Mandatory" },
        { name: "EORI Number Registration", importance: "Mandatory" },
        { name: "EUR.1 Movement Certificate", importance: "Conditional (Trade Agreement)" },
        { name: "Bill of Lading / Air Waybill", importance: "Mandatory" }
    ]);
    const EU_PROCESS = "Entry Summary Declaration (ENS) required prior to arrival. Centralized clearance optional.";
    
    // 3. USMCA (USA, Mexico, Canada) / NORTH AMERICA
    const USMCA_DOCS = JSON.stringify([
        { name: "Commercial Invoice", importance: "Mandatory" },
        { name: "Packing List", importance: "Mandatory" },
        { name: "Bill of Lading", importance: "Mandatory" },
        { name: "USMCA Certification of Origin", importance: "Mandatory for Preference" },
        { name: "Arrival Notice", importance: "Mandatory" }
    ]);
    const USMCA_PROCESS = "Pre-arrival processing via AMS/ACE (USA) or PARS (Canada).";
    
    // 4. CHINA (General)
    const CHINA_DOCS = JSON.stringify([
        { name: "Commercial Invoice", importance: "Mandatory" },
        { name: "Packing List", importance: "Mandatory" },
        { name: "Bill of Lading", importance: "Mandatory" },
        { name: "Certificate of Origin (Form A or FTA)", importance: "Mandatory for Preference" },
        { name: "Customs Declaration Form", importance: "Mandatory" },
        { name: "Sales Contract", importance: "Required" }
    ]);
    const CHINA_PROCESS = "Strict documentation matching. 24-hour advance manifest rule.";

    // 5. REST OF WORLD (Generic Base)
    const GENERIC_DOCS = JSON.stringify([
        { name: "Commercial Invoice", importance: "Mandatory" },
        { name: "Packing List", importance: "Mandatory" },
        { name: "Bill of Lading / Air Waybill", importance: "Mandatory" },
        { name: "Certificate of Origin", importance: "Recommended" }
    ]);
    const GENERIC_PROCESS = "Standard customs clearance procedure.";
    
    // MAPPING COUNTRIES TO BLOCS
    const BLOCS: {[key: string]: {countries: string[], docs: string, process: string}} = {
        'MERCOSUR': {
            countries: ['AR', 'BR', 'UY', 'PY', 'BO'],
            docs: MERCOSUR_DOCS,
            process: MERCOSUR_PROCESS
        },
        'EU': {
            countries: ['DE', 'FR', 'IT', 'ES', 'PL', 'RO', 'NL', 'BE', 'SE', 'CZ', 'GR', 'PT', 'HU', 'AT', 'DK', 'FI', 'SK', 'IE', 'BG', 'HR', 'LT', 'SI', 'LV', 'EE', 'CY', 'LU', 'MT'],
            docs: EU_DOCS,
            process: EU_PROCESS
        },
        'USMCA/NAFTA': {
            countries: ['US', 'MX', 'CA'],
            docs: USMCA_DOCS,
            process: USMCA_PROCESS
        },
        'CHINA': {
            countries: ['CN', 'HK', 'MO', 'TW'],
            docs: CHINA_DOCS,
            process: CHINA_PROCESS
        },
        'ASEAN/ASIA': {
            countries: ['JP', 'KR', 'SG', 'MY', 'TH', 'VN', 'ID', 'PH', 'IN', 'BD', 'PK', 'LK', 'MM', 'KH', 'LA', 'BN', 'MN'],
            docs: GENERIC_DOCS, // Using generic for now, ideally specific
            process: GENERIC_PROCESS
        },
        'MIDDLE_EAST': {
            countries: ['SA', 'AE', 'IL', 'TR', 'IR', 'IQ', 'QA', 'KW', 'OM', 'BH', 'JO', 'LB', 'SY', 'YE', 'PS', 'CY', 'GE', 'AM', 'AZ', 'KZ'],
            docs: GENERIC_DOCS,
            process: GENERIC_PROCESS
        },
        'LATAM_REST': {
            countries: ['CL', 'CO', 'PE', 'EC', 'VE', 'GT', 'CR', 'PA', 'DO', 'SV', 'HN', 'NI', 'TT', 'BB', 'BS', 'HT', 'CU', 'PR'],
            docs: GENERIC_DOCS,
            process: GENERIC_PROCESS
        },
        'EUROPE_NON_EU': {
            countries: ['GB', 'CH', 'NO', 'RU', 'UA', 'RS'], // RS added recently
            docs: GENERIC_DOCS,
            process: GENERIC_PROCESS
        },
        'AFRICA': {
            countries: ['ZA', 'EG', 'NG', 'KE', 'MA', 'DZ', 'TN', 'LY', 'ET', 'GH', 'CI', 'SN', 'TZ', 'UG', 'AO'], // AO added? No, previous list was specific.
            docs: GENERIC_DOCS,
            process: GENERIC_PROCESS
        },
         'OCEANIA': {
            countries: ['AU', 'NZ', 'FJ', 'PG'],
            docs: GENERIC_DOCS,
            process: GENERIC_PROCESS
        }
    };

    const insertStmt = sqliteDb.prepare(`
        INSERT OR REPLACE INTO country_base_requirements 
        (id, country_code, trade_bloc, base_documents, general_customs_process)
        VALUES (?, ?, ?, ?, ?)
    `);

    let totalInserted = 0;

    for (const [blocName, data] of Object.entries(BLOCS)) {
        console.log(`Processing Bloc: ${blocName}`);
        for (const country of data.countries) {
            try {
                const id = crypto.randomUUID();
                insertStmt.run([id, country, blocName, data.docs, data.process]);
                totalInserted++;
            } catch (e: any) {
                console.log(`Skipping ${country} (maybe duplicate or API error):`, e.message);
            }
        }
    }

    console.log('');
    saveDatabase();
    console.log(`✅ ${totalInserted} países actualizados con Requisitos Base (Capa 1)`);
    console.log('📦 Arquitectura V2 inicializada correctamente.');
    console.log('💾 Database saved');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
