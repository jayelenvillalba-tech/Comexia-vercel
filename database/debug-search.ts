import { initDatabase, sqliteDb } from './db-sqlite';

async function main() {
  await initDatabase();
  
  const query = 'camiset';
  const searchPattern = `%${query.toLowerCase()}%`;
  
  console.log(`Searching for "${query}"...`);
  
  const partidas = sqliteDb.exec(`
    SELECT code, description FROM hs_partidas 
    WHERE lower(description) LIKE '${searchPattern}'
  `);
  
  console.log('Partidas found:', partidas.length > 0 ? partidas[0].values : 0);
  
  const subpartidas = sqliteDb.exec(`
    SELECT code, description FROM hs_subpartidas 
    WHERE lower(description) LIKE '${searchPattern}'
  `);
  
  console.log('Subpartidas found:', subpartidas.length > 0 ? subpartidas[0].values : 0);
}

main();
