import { db, initDatabase } from '../db-sqlite';
import { users, marketplacePosts, companies } from '../../shared/shared/schema-sqlite';
import { eq } from 'drizzle-orm';

async function seedMockDataFix() {
  console.log('🌱 Seeding mock data fix...');
  await initDatabase();

  try {
    // 1. Ensure mock-user-1 exists (The user clicking "Contact")
    const existingUser = await db.select().from(users).where(eq(users.id, 'mock-user-1'));
    if (existingUser.length === 0) {
      console.log('Creating mock-user-1...');
      await db.insert(users).values({
        id: 'mock-user-1',
        email: 'demo@example.com',
        name: 'Usuario Demo',
        companyId: 'demo-global-meats', // Assign to Global Meats (buyer)
        role: 'Gerente de Compras',
        verified: true,
        createdAt: new Date()
      });
      console.log('✅ Created mock-user-1 with companyId: demo-global-meats');
    } else {
      console.log('mock-user-1 already exists.');
      // Update if companyId is missing
      if (!existingUser[0].companyId) {
        console.log('Updating mock-user-1 to add companyId...');
        await db.update(users)
          .set({ companyId: 'demo-global-meats' })
          .where(eq(users.id, 'mock-user-1'));
        console.log('✅ Updated mock-user-1 with companyId');
      }
    }

    // 2. Ensure the companies exist (should be there from previous seeds, but good to check)
    // We assume they exist: demo-frigorifico-very, demo-global-meats, demo-logitrans

    // 3. Insert the mock posts that are hardcoded in marketplace.tsx
    // Post 1: Sell from Frigoríficos Very
    const post1 = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, 'mock-1'));
    if (post1.length === 0) {
      console.log('Creating post mock-1...');
      await db.insert(marketplacePosts).values({
        id: 'mock-1',
        companyId: 'demo-frigorifico-very',
        userId: 'demo-user-very',
        type: 'sell',
        hsCode: '0201.30.00',
        productName: 'Carne vacuna premium deshuesada fresca',
        quantity: '5 toneladas',
        originCountry: 'AR',
        destinationCountry: 'US',
        deadlineDays: 30,
        requirements: JSON.stringify(['Incoterms: DAP Miami', 'Precio: $12,500 USD/ton', 'Embarque en 12-15 días']),
        certifications: JSON.stringify(['SENASA', 'HACCP', 'BRC', 'Halal']),
        status: 'active',
        createdAt: new Date()
      });
    }

    // Post 2: Buy from Global Meats
    const post2 = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, 'mock-2'));
    if (post2.length === 0) {
      console.log('Creating post mock-2...');
      await db.insert(marketplacePosts).values({
        id: 'mock-2',
        companyId: 'demo-global-meats',
        userId: 'demo-user-global',
        type: 'buy',
        hsCode: '0201.30.00',
        productName: 'Carne bovina deshuesada fresca - Pedido mensual',
        quantity: '50-80 toneladas/mes',
        originCountry: 'AR',
        destinationCountry: 'US',
        deadlineDays: 45,
        requirements: JSON.stringify(['Certificación USDA requerida', 'Etiquetado FDA compliant', 'Entregas mensuales']),
        certifications: JSON.stringify(['FDA', 'USDA', 'HACCP']),
        status: 'active',
        createdAt: new Date()
      });
    }

    // Post 3: Service from LogiTrans
    const post3 = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, 'mock-3'));
    if (post3.length === 0) {
      console.log('Creating post mock-3...');
      await db.insert(marketplacePosts).values({
        id: 'mock-3',
        companyId: 'demo-logitrans',
        userId: 'demo-user-logitrans',
        type: 'sell',
        hsCode: '9999.99.99',
        productName: 'Servicio de transporte refrigerado Argentina-EEUU',
        quantity: 'Contenedores 20" y 40"',
        originCountry: 'AR',
        destinationCountry: 'US',
        deadlineDays: 90,
        requirements: JSON.stringify(['Ruta: Buenos Aires - Miami', 'Tiempo: 7-10 días marítimo', 'Precio: desde $3,200 USD']),
        certifications: JSON.stringify(['IATA', 'FIATA', 'ISO 9001', 'C-TPAT']),
        status: 'active',
        createdAt: new Date()
      });
    }

    console.log('✅ Mock data fix seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding mock data fix:', error);
  } finally {
    process.exit(0);
  }
}

seedMockDataFix();
