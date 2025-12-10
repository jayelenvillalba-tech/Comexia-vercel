import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEEDING MARKETPLACE POSTS ===');

async function main() {
  try {
    await initDatabase();
    console.log('✅ Database initialized');

    // First, create tables if they don't exist
    console.log('\n📋 Creating marketplace tables...');
    
    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT,
        primary_role TEXT DEFAULT 'tecnico',
        verified INTEGER DEFAULT 0,
        phone TEXT,
        created_at INTEGER,
        last_active INTEGER
      )
    `);

    sqliteDb.run(`
      CREATE TABLE IF NOT EXISTS marketplace_posts (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        hs_code TEXT NOT NULL,
        product_name TEXT NOT NULL,
        quantity TEXT,
        origin_country TEXT,
        destination_country TEXT,
        deadline_days INTEGER,
        requirements TEXT,
        certifications TEXT,
        status TEXT DEFAULT 'active',
        created_at INTEGER,
        expires_at INTEGER
      )
    `);

    console.log('✅ Tables created/verified');

    // Delete existing demo data
    console.log('\n🗑️  Removing existing demo data...');
    sqliteDb.run(`DELETE FROM marketplace_posts WHERE user_id IN ('demo-user-very', 'demo-user-global', 'demo-user-logitrans')`);
    sqliteDb.run(`DELETE FROM users WHERE id IN ('demo-user-very', 'demo-user-global', 'demo-user-logitrans')`);

    // Create users for each company
    console.log('\n👤 Creating demo users...');
    
    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);

    // User 1: Frigoríficos Very
    sqliteDb.run(`
      INSERT INTO users (
        id, company_id, name, email, role, primary_role, verified, phone, created_at, last_active
      ) VALUES (
        'demo-user-very',
        'demo-frigorifico-very',
        'Juan Carlos Pérez',
        'jperez@frigorificovery.com.ar',
        'Director de Exportaciones',
        'admin',
        1,
        '+54 11 4567-8900',
        ${now},
        ${now}
      )
    `);

    // User 2: Global Meats
    sqliteDb.run(`
      INSERT INTO users (
        id, company_id, name, email, role, primary_role, verified, phone, created_at, last_active
      ) VALUES (
        'demo-user-global',
        'demo-global-meats',
        'Sarah Johnson',
        'sjohnson@globalmeats.com',
        'Head of International Procurement',
        'compras',
        1,
        '+1 305 555-0123',
        ${now},
        ${now}
      )
    `);

    // User 3: LogiTrans
    sqliteDb.run(`
      INSERT INTO users (
        id, company_id, name, email, role, primary_role, verified, phone, created_at, last_active
      ) VALUES (
        'demo-user-logitrans',
        'demo-logitrans',
        'Carlos Mendoza',
        'cmendoza@logitrans-intl.com',
        'Operations Manager',
        'logistica',
        1,
        '+54 11 5555-7890',
        ${now},
        ${now}
      )
    `);

    console.log('✅ 3 users created');

    // Create marketplace posts
    console.log('\n📦 Creating marketplace posts...');

    // Post 1: Frigoríficos Very - SELL offer (the one from the script)
    sqliteDb.run(`
      INSERT INTO marketplace_posts (
        id, company_id, user_id, type, hs_code, product_name,
        quantity, origin_country, destination_country, deadline_days,
        requirements, certifications, status, created_at, expires_at
      ) VALUES (
        'demo-post-very-1',
        'demo-frigorifico-very',
        'demo-user-very',
        'sell',
        '0201.30.00',
        'Carne vacuna premium deshuesada fresca',
        '5 toneladas',
        'AR',
        'US',
        30,
        '["Incoterms: DAP Miami", "Precio: $12,500 USD/ton", "Embarque en 12-15 días", "Contenedor refrigerado incluido"]',
        '["SENASA", "HACCP", "BRC", "Halal"]',
        'active',
        ${now},
        ${thirtyDaysFromNow}
      )
    `);

    // Post 2: Global Meats - BUY request
    sqliteDb.run(`
      INSERT INTO marketplace_posts (
        id, company_id, user_id, type, hs_code, product_name,
        quantity, origin_country, destination_country, deadline_days,
        requirements, certifications, status, created_at, expires_at
      ) VALUES (
        'demo-post-global-1',
        'demo-global-meats',
        'demo-user-global',
        'buy',
        '0201.30.00',
        'Carne bovina deshuesada fresca - Pedido mensual',
        '50-80 toneladas/mes',
        'AR',
        'US',
        45,
        '["Certificación USDA requerida", "Etiquetado FDA compliant", "Entregas mensuales", "Pago: Net 45 days o LC"]',
        '["FDA", "USDA", "HACCP"]',
        'active',
        ${now - (2 * 24 * 60 * 60 * 1000)},
        ${thirtyDaysFromNow}
      )
    `);

    // Post 3: Frigoríficos Very - Another SELL offer (different product)
    sqliteDb.run(`
      INSERT INTO marketplace_posts (
        id, company_id, user_id, type, hs_code, product_name,
        quantity, origin_country, destination_country, deadline_days,
        requirements, certifications, status, created_at, expires_at
      ) VALUES (
        'demo-post-very-2',
        'demo-frigorifico-very',
        'demo-user-very',
        'sell',
        '0202.30.00',
        'Carne bovina congelada deshuesada',
        '10 toneladas',
        'AR',
        'CN',
        60,
        '["Incoterms: CIF Shanghai", "Precio: $11,200 USD/ton", "Certificación Halal incluida", "Embarque en 20 días"]',
        '["SENASA", "Halal", "BRC", "ISO 9001"]',
        'active',
        ${now - (5 * 24 * 60 * 60 * 1000)},
        ${thirtyDaysFromNow + (30 * 24 * 60 * 60 * 1000)}
      )
    `);

    // Post 4: LogiTrans - Service offer
    sqliteDb.run(`
      INSERT INTO marketplace_posts (
        id, company_id, user_id, type, hs_code, product_name,
        quantity, origin_country, destination_country, deadline_days,
        requirements, certifications, status, created_at, expires_at
      ) VALUES (
        'demo-post-logitrans-1',
        'demo-logitrans',
        'demo-user-logitrans',
        'sell',
        '9999.99.99',
        'Servicio de transporte refrigerado Argentina-EEUU',
        'Contenedores 20\\" y 40\\"',
        'AR',
        'US',
        90,
        '["Ruta: Buenos Aires - Miami", "Tiempo: 7-10 días marítimo", "Precio: desde $3,200 USD", "Cadena fría certificada", "Tracking GPS 24/7"]',
        '["IATA", "FIATA", "ISO 9001", "C-TPAT"]',
        'active',
        ${now - (10 * 24 * 60 * 60 * 1000)},
        ${thirtyDaysFromNow + (60 * 24 * 60 * 60 * 1000)}
      )
    `);

    // Post 5: Global Meats - Another BUY request (different product)
    sqliteDb.run(`
      INSERT INTO marketplace_posts (
        id, company_id, user_id, type, hs_code, product_name,
        quantity, origin_country, destination_country, deadline_days,
        requirements, certifications, status, created_at, expires_at
      ) VALUES (
        'demo-post-global-2',
        'demo-global-meats',
        'demo-user-global',
        'buy',
        '0207.14.00',
        'Carne de pollo congelada - Trozos',
        '20 toneladas',
        'BR',
        'US',
        30,
        '["Certificación USDA/FSIS", "Empaque retail-ready", "Entrega en Miami", "Pago: LC at sight"]',
        '["FDA", "USDA", "SQF"]',
        'active',
        ${now - (7 * 24 * 60 * 60 * 1000)},
        ${thirtyDaysFromNow}
      )
    `);

    console.log('✅ 5 marketplace posts created');

    // Verify insertion
    console.log('\n🔍 Verifying created data...');
    
    const userResults = sqliteDb.exec(`
      SELECT id, name, email, role
      FROM users 
      WHERE id IN ('demo-user-very', 'demo-user-global', 'demo-user-logitrans')
    `);

    if (userResults.length > 0 && userResults[0].values) {
      console.log('\n✅ Users created:');
      const columns = userResults[0].columns;
      userResults[0].values.forEach((row: any[]) => {
        const user: any = {};
        columns.forEach((col, idx) => {
          user[col] = row[idx];
        });
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
      });
    }

    const postResults = sqliteDb.exec(`
      SELECT mp.id, mp.type, mp.product_name, mp.quantity, c.name as company_name
      FROM marketplace_posts mp
      JOIN companies c ON mp.company_id = c.id
      WHERE mp.user_id IN ('demo-user-very', 'demo-user-global', 'demo-user-logitrans')
      ORDER BY mp.created_at DESC
    `);

    if (postResults.length > 0 && postResults[0].values) {
      console.log('\n✅ Marketplace posts created:');
      const columns = postResults[0].columns;
      postResults[0].values.forEach((row: any[]) => {
        const post: any = {};
        columns.forEach((col, idx) => {
          post[col] = row[idx];
        });
        console.log(`   - [${post.type.toUpperCase()}] ${post.product_name} (${post.quantity}) - ${post.company_name}`);
      });
    }

    saveDatabase();
    console.log('\n💾 Database saved successfully');
    console.log('\n🎉 Marketplace demo data created successfully!');
    console.log('\n📝 Summary:');
    console.log('   - 3 users created (one per company)');
    console.log('   - 5 marketplace posts created:');
    console.log('     • 2 SELL offers from Frigoríficos Very');
    console.log('     • 2 BUY requests from Global Meats');
    console.log('     • 1 Logistics service from LogiTrans');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    saveDatabase();
  } finally {
    process.exit(0);
  }
}

main();
