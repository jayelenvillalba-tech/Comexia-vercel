
import { db } from './db-sqlite';
import { hsSections, hsChapters, hsPartidas, hsSubpartidas, companies } from '../shared/shared/schema-sqlite';
import { sql } from 'drizzle-orm';

async function checkData() {
  try {
    const sectionsCount = await db.select({ count: sql<number>`count(*)` }).from(hsSections);
    const chaptersCount = await db.select({ count: sql<number>`count(*)` }).from(hsChapters);
    const partidasCount = await db.select({ count: sql<number>`count(*)` }).from(hsPartidas);
    const subpartidasCount = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    const companiesCount = await db.select({ count: sql<number>`count(*)` }).from(companies);

    console.log('📊 Database Status:');
    console.log(`  - HS Sections: ${sectionsCount[0].count}`);
    console.log(`  - HS Chapters: ${chaptersCount[0].count}`);
    console.log(`  - HS Partidas: ${partidasCount[0].count}`);
    console.log(`  - HS Subpartidas: ${subpartidasCount[0].count}`);
    console.log(`  - Companies: ${companiesCount[0].count}`);
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkData();
