import { initDatabase, sqliteDb } from './db-sqlite';

async function main() {
  await initDatabase();
  
  // Test the search query
  const searchPattern = '%silla%';
  const results = sqliteDb.exec(`
    SELECT code, description, keywords 
    FROM hs_partidas 
    WHERE lower(keywords) LIKE '${searchPattern}'
    LIMIT 5
  `);
  
  console.log('=== Search results for "silla" ===');
  console.log(JSON.stringify(results, null, 2));
  
  process.exit(0);
}

main();
