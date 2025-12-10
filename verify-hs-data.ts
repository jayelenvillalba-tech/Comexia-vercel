import { db, initDatabase } from './database/db-sqlite';
import { hsPartidas, hsSubpartidas } from './shared/shared/schema-sqlite';
import { sql } from 'drizzle-orm';

async function verifyHsData() {
  console.log('🔍 Verifying HS Code Data...');
  await initDatabase();

  try {
    const partidasCount = await db.select({ count: sql<number>`count(*)` }).from(hsPartidas);
    console.log(`📦 Partidas count: ${partidasCount[0].count}`);

    const subpartidasCount = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    console.log(`📦 Subpartidas count: ${subpartidasCount[0].count}`);

    if (partidasCount[0].count === 0 && subpartidasCount[0].count === 0) {
      console.log('❌ Database is empty!');
    } else {
      console.log('✅ Database has data.');
    }
  } catch (error) {
    console.error('❌ Error verifying data:', error);
  } finally {
    process.exit(0);
  }
}

verifyHsData();
