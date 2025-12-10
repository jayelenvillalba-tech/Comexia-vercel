import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEEDING DEMO COMPANY PROFILES ===');

async function main() {
  try {
    await initDatabase();
    console.log('✅ Database initialized');

    // Delete existing demo companies if they exist
    console.log('\n🗑️  Removing existing demo companies...');
    sqliteDb.run(`DELETE FROM companies WHERE id IN ('demo-frigorifico-very', 'demo-global-meats', 'demo-logitrans')`);
    
    // 1. Frigoríficos Very (Exportador - Argentina)
    console.log('\n📦 Creating Frigoríficos Very profile...');
    sqliteDb.run(`
      INSERT INTO companies (
        id, name, legal_name, country, type, 
        business_type, established_year, employee_count, annual_revenue,
        products, verified, 
        contact_email, website, phone, address,
        contact_person, tax_id,
        certifications, 
        credit_rating, risk_score, payment_terms,
        total_transactions, average_order_value, on_time_delivery_rate,
        sanctions, coordinates,
        created_at, last_updated
      ) VALUES (
        'demo-frigorifico-very',
        'Frigoríficos Very',
        'Frigoríficos Very S.A.',
        'AR',
        'exporter',
        'Frigorífico Exportador',
        1985,
        50,
        15000000.00,
        '["0201.30.00 - Carne bovina deshuesada fresca", "0202.30.00 - Carne bovina deshuesada congelada", "0206.10.00 - Despojos comestibles bovinos"]',
        1,
        'export@frigorificovery.com.ar',
        'https://www.frigorificovery.com',
        '+54 11 4567-8900',
        'Ruta Nacional 5 Km 200, Buenos Aires, Argentina',
        'Juan Carlos Pérez - Director de Exportaciones',
        '30-12345678-9',
        '["SENASA", "HACCP", "BRC", "Halal", "Kosher", "Organic", "ISO 9001"]',
        'AAA',
        0.15,
        'Net 60 days, LC at sight accepted',
        888,
        68500.00,
        0.97,
        0,
        '{"lat": -34.6037, "lng": -58.3816}',
        ${Date.now()},
        ${Date.now()}
      )
    `);
    console.log('✅ Frigoríficos Very created');

    // 2. Global Meats Distributors (Importador - EEUU)
    console.log('\n📦 Creating Global Meats Distributors profile...');
    sqliteDb.run(`
      INSERT INTO companies (
        id, name, legal_name, country, type,
        business_type, established_year, employee_count, annual_revenue,
        products, verified,
        contact_email, website, phone, address,
        contact_person, tax_id,
        certifications,
        credit_rating, risk_score, payment_terms,
        total_transactions, average_order_value, on_time_delivery_rate,
        sanctions, coordinates,
        created_at, last_updated
      ) VALUES (
        'demo-global-meats',
        'Global Meats Distributors',
        'Global Meats Distributors LLC',
        'US',
        'importer',
        'Cadena de Distribución Alimentaria',
        2010,
        200,
        45000000.00,
        '["0201 - Carne bovina fresca", "0202 - Carne bovina congelada", "0203 - Carne porcina", "0207 - Carne de aves"]',
        1,
        'procurement@globalmeats.com',
        'https://www.globalmeats.com',
        '+1 305 555-0123',
        '1200 Brickell Avenue, Suite 1800, Miami, FL 33131, USA',
        'Sarah Johnson - Head of International Procurement',
        '65-1234567',
        '["FDA Registered", "USDA Approved", "HACCP", "SQF Level 2", "Organic Certified"]',
        'AA+',
        0.22,
        'Net 45 days, LC/DP accepted',
        342,
        125000.00,
        0.94,
        0,
        '{"lat": 25.7617, "lng": -80.1918}',
        ${Date.now()},
        ${Date.now()}
      )
    `);
    console.log('✅ Global Meats Distributors created');

    // 3. LogiTrans International (Transportista)
    console.log('\n📦 Creating LogiTrans International profile...');
    sqliteDb.run(`
      INSERT INTO companies (
        id, name, legal_name, country, type,
        business_type, established_year, employee_count, annual_revenue,
        products, verified,
        contact_email, website, phone, address,
        contact_person, tax_id,
        certifications,
        credit_rating, risk_score, payment_terms,
        total_transactions, average_order_value, on_time_delivery_rate,
        sanctions, coordinates,
        created_at, last_updated
      ) VALUES (
        'demo-logitrans',
        'LogiTrans International',
        'LogiTrans International Freight Forwarders S.A.',
        'AR',
        'both',
        'Agencia Logística Global',
        2005,
        100,
        8000000.00,
        '["Transporte marítimo refrigerado", "Transporte aéreo perecederos", "Despacho aduanal", "Almacenamiento cadena fría", "Seguro de carga"]',
        1,
        'operations@logitrans-intl.com',
        'https://www.logitrans-intl.com',
        '+54 11 5555-7890',
        'Av. Corrientes 1234, Piso 8, Buenos Aires, Argentina',
        'Carlos Mendoza - Operations Manager',
        '30-98765432-1',
        '["IATA Cargo Agent", "FIATA Member", "ISO 9001", "C-TPAT Certified", "AEO Authorized"]',
        'A+',
        0.18,
        'Net 30 days',
        1245,
        4200.00,
        0.96,
        0,
        '{"lat": -34.6037, "lng": -58.3816}',
        ${Date.now()},
        ${Date.now()}
      )
    `);
    console.log('✅ LogiTrans International created');

    // Verify insertion
    console.log('\n🔍 Verifying created companies...');
    const results = sqliteDb.exec(`
      SELECT id, name, country, type, verified, employee_count, total_transactions
      FROM companies 
      WHERE id IN ('demo-frigorifico-very', 'demo-global-meats', 'demo-logitrans')
    `);

    if (results.length > 0 && results[0].values) {
      console.log('\n✅ Successfully created companies:');
      const columns = results[0].columns;
      results[0].values.forEach((row: any[]) => {
        const company: any = {};
        columns.forEach((col, idx) => {
          company[col] = row[idx];
        });
        console.log(`   - ${company.name} (${company.country}) - ${company.type} - ${company.employee_count} employees - ${company.total_transactions} transactions`);
      });
    }

    saveDatabase();
    console.log('\n💾 Database saved successfully');
    console.log('\n🎉 Demo company profiles created successfully!');
    console.log('\n📝 Summary:');
    console.log('   1. Frigoríficos Very (AR) - Exporter - 888 transactions - AAA rating');
    console.log('   2. Global Meats Distributors (US) - Importer - 342 transactions - AA+ rating');
    console.log('   3. LogiTrans International (AR) - Logistics - 1,245 shipments - A+ rating');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    saveDatabase();
  } finally {
    process.exit(0);
  }
}

main();
