import { db, initDatabase, sqliteDb } from './database/db-sqlite';

async function testSearch() {
  console.log('🔍 Testing HS Search...');
  await initDatabase();

  const query = 'carne';
  const searchPattern = `%${query.toLowerCase()}%`;

  try {
    const results = sqliteDb.exec(`
      SELECT * FROM hs_partidas 
      WHERE 
        code LIKE '${query}' OR
        lower(description) LIKE '${searchPattern}' OR
        lower(description_en) LIKE '${searchPattern}' OR
        lower(keywords) LIKE '${searchPattern}'
      LIMIT 10
    `);

    console.log(`Found ${results.length > 0 ? results[0].values.length : 0} results.`);
    if (results.length > 0 && results[0].values) {
      console.log(results[0].values);
    }
  } catch (error) {
    console.error('❌ Error testing search:', error);
  } finally {
    process.exit(0);
  }
}

testSearch();
