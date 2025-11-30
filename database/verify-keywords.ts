import { db, initDatabase } from './db-sqlite';
import { hsSubpartidas } from '../shared/shared/schema-sqlite';

async function main() {
  await initDatabase();
  
  const results = await db.select().from(hsSubpartidas).limit(5);
  
  console.log('=== First 5 HS Codes ===');
  results.forEach(r => {
    console.log(`Code: ${r.code}`);
    console.log(`Description: ${r.description}`);
    console.log(`Keywords: ${r.keywords}`);
    console.log('---');
  });
  
  process.exit(0);
}

main();
