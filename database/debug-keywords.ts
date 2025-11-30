import { initDatabase, sqliteDb } from './db-sqlite';

async function main() {
  await initDatabase();
  
  // Query directly using SQL
  const results = sqliteDb.exec('SELECT code, description, keywords FROM hs_partidas WHERE code = "9401" LIMIT 1');
  
  console.log('=== Checking code 9401 (silla) ===');
  console.log(JSON.stringify(results, null, 2));
  
  // Also check if keywords column exists
  const schema = sqliteDb.exec('PRAGMA table_info(hs_partidas)');
  console.log('\n=== hs_partidas schema ===');
  console.log(JSON.stringify(schema, null, 2));
  
  process.exit(0);
}

main();
