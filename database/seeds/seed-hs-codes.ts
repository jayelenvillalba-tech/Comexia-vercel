import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';
import { HS_CODES_DATABASE } from '../../shared/shared/hs-codes-database';

console.log('=== INICIO DEL SCRIPT DE SEMILLAS DE CÓDIGOS HS ===');

async function main() {
  try {
    await initDatabase();
    console.log(`📊 Total de códigos HS en base de datos estática: ${HS_CODES_DATABASE.length}`);

    // 0. Crear tablas usando SQL directo
    console.log('0. Creando tablas...');
    
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS hs_sections (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        number INTEGER NOT NULL,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        chapter_range TEXT NOT NULL
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS hs_chapters (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        section_code TEXT NOT NULL,
        notes TEXT,
        notes_en TEXT
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS hs_partidas (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        chapter_code TEXT NOT NULL,
        tariff_rate REAL,
        units TEXT,
        keywords TEXT,
        notes TEXT,
        notes_en TEXT
      )
    `);

    sqliteDb.run(`DROP TABLE IF EXISTS hs_subpartidas`);
    
    sqliteDb.run(`
      CREATE TABLE hs_subpartidas (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        partida_code TEXT NOT NULL,
        chapter_code TEXT NOT NULL,
        tariff_rate REAL,
        special_tariff_rate REAL,
        units TEXT,
        restrictions TEXT,
        keywords TEXT,
        notes TEXT,
        notes_en TEXT,
        is_active INTEGER DEFAULT 1
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        type TEXT NOT NULL,
        products TEXT,
        verified INTEGER DEFAULT 0,
        contact_email TEXT,
        website TEXT,
        legal_name TEXT,
        tax_id TEXT,
        business_type TEXT,
        established_year INTEGER,
        employee_count INTEGER,
        annual_revenue REAL,
        credit_rating TEXT,
        risk_score REAL,
        payment_terms TEXT,
        total_transactions INTEGER,
        average_order_value REAL,
        on_time_delivery_rate REAL,
        certifications TEXT,
        sanctions INTEGER DEFAULT 0,
        contact_person TEXT,
        phone TEXT,
        address TEXT,
        last_updated INTEGER,
        created_at INTEGER
      )
    `);

    console.log('✅ Tablas creadas.');

    // 1. Insertar Secciones
    const uniqueSections = new Set(HS_CODES_DATABASE.map(hs => hs.section));
    console.log(`\n1. Insertando ${uniqueSections.size} Secciones...`);
    
    for (const sectionCode of uniqueSections) {
      const sample = HS_CODES_DATABASE.find(hs => hs.section === sectionCode);
      if (sample) {
        try {
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_sections (id, code, number, description, description_en, chapter_range) VALUES (?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), sectionCode, romanToInt(sectionCode), `Sección ${sectionCode}`, `Section ${sectionCode}`, "01-99"]
          );
          process.stdout.write('.');
        } catch (e) {}
      }
    }
    console.log('\n✅ Secciones insertadas.');

    // 2. Insertar Capítulos
    const uniqueChapters = new Set(HS_CODES_DATABASE.map(hs => hs.chapter));
    console.log(`\n2. Insertando ${uniqueChapters.size} Capítulos...`);

    for (const chapterCode of uniqueChapters) {
      const sample = HS_CODES_DATABASE.find(hs => hs.chapter === chapterCode);
      if (sample) {
        try {
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_chapters (id, code, description, description_en, section_code) VALUES (?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), chapterCode, `Capítulo ${chapterCode}`, `Chapter ${chapterCode}`, sample.section]
          );
          process.stdout.write('.');
        } catch (e) {}
      }
    }
    console.log('\n✅ Capítulos insertados.');

    // 3. Insertar Códigos HS
    console.log(`\n3. Insertando Códigos HS...`);
    
    let insertedCount = 0;
    for (const hs of HS_CODES_DATABASE) {
      try {
        if (hs.code.length === 4) {
          // Partida
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_partidas (id, code, description, description_en, chapter_code, tariff_rate, units, keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), hs.code, hs.description, hs.descriptionEn, hs.chapter, hs.baseTariff, JSON.stringify(['kg', 'u']), JSON.stringify(hs.keywords || [])]
          );
        } else {
          // Subpartida
          const partidaCode = hs.code.substring(0, 4);
          
          // Insertar partida padre si no existe
          try {
            sqliteDb.run(
              `INSERT OR IGNORE INTO hs_partidas (id, code, description, description_en, chapter_code) VALUES (?, ?, ?, ?, ?)`,
              [crypto.randomUUID(), partidaCode, `Partida ${partidaCode}`, `Heading ${partidaCode}`, hs.chapter]
            );
          } catch (e) {}

          // Insertar subpartida con keywords
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_subpartidas (id, code, description, description_en, partida_code, chapter_code, tariff_rate, keywords, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), hs.code, hs.description, hs.descriptionEn, partidaCode, hs.chapter, hs.baseTariff, JSON.stringify(hs.keywords || []), 1]
          );
        }
        insertedCount++;
        if (insertedCount % 10 === 0) process.stdout.write('.');
      } catch (error: any) {
        console.error(`Error insertando ${hs.code}:`, error.message);
      }
    }

    console.log(`\n\n✅ Proceso completado. ${insertedCount} códigos procesados.`);
    saveDatabase();

  } catch (error: any) {
    console.error('❌ Error general:', error.message);
    console.error(error.stack);
    saveDatabase();
  } finally {
    process.exit(0);
  }
}

function romanToInt(s: string): number {
  const map: {[key: string]: number} = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000};
  let res = 0;
  s.split('').forEach((char, i) => {
    const curr = map[char];
    const next = map[s[i + 1]];
    if (next > curr) res -= curr;
    else res += curr;
  });
  return res || 0;
}

main();
