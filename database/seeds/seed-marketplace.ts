import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { companies, users, marketplacePosts } from '../../shared/shared/schema-sqlite.js';
import { eq } from 'drizzle-orm';

async function seedMarketplace() {
  console.log('🛒 Seeding Marketplace...');
  await initDatabase();

  // 1. Ensure we have some companies (Reuse existing or create new)
  // Let's fetch a few to attach posts to
  const allCompanies = await db.select().from(companies).limit(5);
  
  if (allCompanies.length === 0) {
      console.log('No companies found. Please run basic seeds first.');
      return;
  }

  // 2. Create Users for these companies (if not exist)
  const demoUsers = [];
  for (const company of allCompanies) {
      const email = `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`;
      
      // Check if user exists
      const existing = await db.select().from(users).where(eq(users.email, email));
      
      let userId;
      if (existing.length === 0) {
          const newUser = await db.insert(users).values({
              companyId: company.id,
              name: `Rep. ${company.name}`,
              email: email,
              role: 'Sales Manager',
              verified: true,
              phone: '+1 555 0123'
          }).returning();
          userId = newUser[0].id;
      } else {
          userId = existing[0].id;
      }
      demoUsers.push({ userId, companyId: company.id, companyName: company.name });
  }

  // 3. Create Posts (Offers and Demands)
  const posts = [
      {
          type: 'sell',
          hsCode: '1201',
          productName: 'Soja Premium (Non-GMO)',
          quantity: '50,000 MT',
          originCountry: 'Argentina',
          destinationCountry: 'China',
          title: 'Soja Argentina Calidad Exportación',
          description: 'Soja a granel lista para embarque. Cosecha 2024. Proteína > 35%.',
          price: 'USD 420/MT FOB'
      },
      {
          type: 'buy',
          hsCode: '8542',
          productName: 'Circuitos Integrados (Chips)',
          quantity: '100,000 Units',
          originCountry: 'Taiwan',
          destinationCountry: 'Brazil',
          title: 'Buscamos Proveedor de Microcontroladores ARM',
          description: 'Necesitamos suministro regular de MCUs para industria automotriz. Contrato anual.',
          price: 'Target: USD 2.50/unit'
      },
      {
          type: 'sell',
          hsCode: '0201',
          productName: 'Cortes de Carne Bovina (Hilton)',
          quantity: '5 Containers',
          originCountry: 'Uruguay',
          destinationCountry: 'Europe',
          title: 'Cuota Hilton - Cortes Premium',
          description: 'Lomo, Bife Angosto y Cuadril. Certificación orgánica disponible.',
          price: 'Consultar'
      },
      {
          type: 'sell',
          hsCode: '2204',
          productName: 'Vino Malbec Reserva',
          quantity: '2000 Cajas',
          originCountry: 'Argentina',
          destinationCountry: 'USA',
          title: 'Malbec Mendoza 2020 - 92 Puntos',
          description: 'Vino de altura, Valle de Uco. Ideal para distribución en restaurantes.',
          price: 'USD 45/caja FOB'
      },
      {
          type: 'buy',
          hsCode: '3102',
          productName: 'Fertilizante Urea',
          quantity: '10,000 MT',
          originCountry: 'Global',
          destinationCountry: 'Argentina',
          title: 'Compra de Urea Granulada',
          description: 'Buscamos proveedores para campaña de trigo. Entrega en Puerto Quequén.',
          price: 'Market Price'
      }
  ];

  // Clean existing posts? Maybe not, just append.
  // await db.delete(marketplacePosts);

  for (const [index, post] of posts.entries()) {
      const user = demoUsers[index % demoUsers.length]; // Round robin users
      
      await db.insert(marketplacePosts).values({
          companyId: user.companyId,
          userId: user.userId,
          type: post.type,
          hsCode: post.hsCode,
          productName: post.productName,
          quantity: post.quantity,
          originCountry: post.originCountry,
          destinationCountry: post.destinationCountry,
          requirements: JSON.stringify([{ title: post.title, description: post.description, price: post.price }]), // Storing details in requirements for MVP simplicity or add distinct fields later
          status: 'active',
          deadlineDays: 30
      });
      process.stdout.write('+');
  }

  console.log('\n✅ Marketplace Seeded');
  saveDatabase();
}

seedMarketplace().catch(console.error);
