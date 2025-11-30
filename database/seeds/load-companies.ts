import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { companies } from '../../shared/shared/schema-sqlite.js';

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== INICIO DEL SCRIPT DE CARGA ===');

async function main() {
  try {
    await initDatabase();
    console.log('1. Verificando archivo consolidated-companies.json...');
    
    const possiblePaths = [
      join(process.cwd(), 'database', 'seeds', 'consolidated-companies.json'),
      join(process.cwd(), 'consolidated-companies.json'),
      join(__dirname, 'consolidated-companies.json'),
      join(process.cwd(), 'database', 'consolidated-companies.json')
    ];
    
    let foundFile = null;
    console.log('Buscando archivo en:');
    
    for (const filePath of possiblePaths) {
      const exists = existsSync(filePath);
      console.log(`  📁 ${filePath} - ${exists ? '✅ EXISTE' : '❌ NO EXISTE'}`);
      if (exists && !foundFile) {
        foundFile = filePath;
      }
    }
    
    if (!foundFile) {
      console.log('\n❌ No se encontró consolidated-companies.json');
      return;
    }
    
    console.log(`\n📁 Archivo encontrado: ${foundFile}`);
    
    // Leer archivo
    const fileContent = readFileSync(foundFile, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (!data.companies || !Array.isArray(data.companies)) {
        console.error('❌ El archivo no contiene un array de empresas válido.');
        return;
    }

    console.log(`\n📊 Total empresas a cargar: ${data.companies.length}`);

    console.log('\n2. Insertando datos en la base de datos...');

    let insertedCount = 0;
    let errorCount = 0;

    for (const company of data.companies) {
        try {
            await db.insert(companies).values(company);
            insertedCount++;
            if (insertedCount % 10 === 0) {
                process.stdout.write(`.`);
            }
        } catch (error: any) {
            errorCount++;
            console.error(`\n❌ Error insertando empresa ${company.name}:`, error.message);
        }
    }

    console.log(`\n\n✅ Carga completada.`);
    console.log(`   Insertados: ${insertedCount}`);
    console.log(`   Errores (posibles duplicados): ${errorCount}`);
    
    saveDatabase();

  } catch (error: any) {
    console.error('❌ Error general:', error.message);
    console.error('Stack:', error.stack);
  } finally {
      process.exit(0);
  }
}

// Ejecutar función principal
main();