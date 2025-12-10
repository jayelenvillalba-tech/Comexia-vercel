import { db, initDatabase } from './database/db-sqlite';
import { hsPartidas } from './shared/shared/schema-sqlite';
import { sql } from 'drizzle-orm';

async function dumpHsData() {
  console.log('🔍 Dumping HS Code Data...');
  await initDatabase();

  try {
    const partidas = await db.select().from(hsPartidas).limit(10);
    console.log(JSON.stringify(partidas, null, 2));
  } catch (error) {
    console.error('❌ Error dumping data:', error);
  } finally {
    process.exit(0);
  }
}

dumpHsData();
