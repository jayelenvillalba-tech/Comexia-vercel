import { initDatabase, sqliteDb } from '../db-sqlite';

console.log('=== MARKETPLACE DIAGNOSTIC ===\n');

async function main() {
  try {
    await initDatabase();
    console.log('✅ Database initialized\n');

    // Check if tables exist
    console.log('📋 Checking tables...');
    const tables = sqliteDb.exec(`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `);
    
    if (tables.length > 0 && tables[0].values) {
      console.log('Tables found:', tables[0].values.map(v => v[0]).join(', '));
    }

    // Check companies
    console.log('\n👥 COMPANIES:');
    const companiesResult = sqliteDb.exec(`
      SELECT id, name, country, type, verified 
      FROM companies 
      WHERE id IN ('demo-frigorifico-very', 'demo-global-meats', 'demo-logitrans')
    `);
    
    if (companiesResult.length > 0 && companiesResult[0].values) {
      console.log(`Found ${companiesResult[0].values.length} demo companies:`);
      companiesResult[0].values.forEach((row: any[]) => {
        console.log(`  - ${row[1]} (${row[0]}) - ${row[2]} - ${row[3]} - Verified: ${row[4]}`);
      });
    } else {
      console.log('❌ No demo companies found!');
    }

    // Check users
    console.log('\n👤 USERS:');
    const usersResult = sqliteDb.exec(`
      SELECT id, name, email, company_id 
      FROM users 
      WHERE id IN ('demo-user-very', 'demo-user-global', 'demo-user-logitrans')
    `);
    
    if (usersResult.length > 0 && usersResult[0].values) {
      console.log(`Found ${usersResult[0].values.length} demo users:`);
      usersResult[0].values.forEach((row: any[]) => {
        console.log(`  - ${row[1]} (${row[0]}) - ${row[2]} - Company: ${row[3]}`);
      });
    } else {
      console.log('❌ No demo users found!');
    }

    // Check marketplace posts
    console.log('\n📦 MARKETPLACE POSTS:');
    const postsResult = sqliteDb.exec(`
      SELECT id, type, product_name, quantity, status, company_id, user_id
      FROM marketplace_posts
    `);
    
    if (postsResult.length > 0 && postsResult[0].values) {
      console.log(`Found ${postsResult[0].values.length} total posts:`);
      postsResult[0].values.forEach((row: any[]) => {
        console.log(`  - [${row[1].toUpperCase()}] ${row[2]} (${row[3]}) - Status: ${row[4]}`);
        console.log(`    Company: ${row[5]}, User: ${row[6]}`);
      });
    } else {
      console.log('❌ No marketplace posts found!');
    }

    // Check if marketplace_posts table structure is correct
    console.log('\n🔍 MARKETPLACE_POSTS TABLE STRUCTURE:');
    const structure = sqliteDb.exec(`
      PRAGMA table_info(marketplace_posts)
    `);
    
    if (structure.length > 0 && structure[0].values) {
      console.log('Columns:');
      structure[0].values.forEach((row: any[]) => {
        console.log(`  - ${row[1]} (${row[2]})`);
      });
    }

    console.log('\n✅ Diagnostic complete');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

main();
