import { initDatabase, saveDatabase, db } from '../db-sqlite';
import { users, marketplacePosts, subscriptions, companies } from '../../shared/shared/schema-sqlite';

console.log('=== SEEDING MARKETPLACE DATA ===');

const mockUsers = [
  {
    id: crypto.randomUUID(),
    companyId: null, // Will be set after finding companies
    name: 'María López',
    email: 'maria.lopez@importadoraabc.com',
    role: 'Directora de Compras',
    verified: true,
    phone: '+54 11 1234-5679',
    createdAt: new Date(2020, 5, 15),
    lastActive: new Date()
  },
  {
    id: crypto.randomUUID(),
    companyId: null,
    name: 'João Silva',
    email: 'joao.silva@exportadoraxyz.com',
    role: 'Gerente Comercial',
    verified: true,
    phone: '+55 11 98765-4321',
    createdAt: new Date(2019, 2, 10),
    lastActive: new Date()
  },
  {
    id: crypto.randomUUID(),
    companyId: null,
    name: 'John Smith',
    email: 'john.smith@techimports.com',
    role: 'Procurement Manager',
    verified: false,
    phone: '+1 555-0123',
    createdAt: new Date(2023, 8, 1),
    lastActive: new Date()
  }
];

async function seedMarketplace() {
  try {
    await initDatabase();
    
    // Get some existing companies
    const existingCompanies = await db.select().from(companies).limit(10);
    
    if (existingCompanies.length === 0) {
      console.log('⚠️  No companies found. Please run company seeds first.');
      return;
    }
    
    console.log(`Found ${existingCompanies.length} companies`);
    
    // Assign companies to users
    mockUsers[0].companyId = existingexistingCompanies[0].id;
    mockUsers[1].companyId = existingexistingCompanies[1] ? existingexistingCompanies[1].id : existingexistingCompanies[0].id;
    mockUsers[2].companyId = existingexistingCompanies[2] ? existingexistingCompanies[2].id : existingexistingCompanies[0].id;
    
    // Insert users
    console.log('Inserting users...');
    for (const user of mockUsers) {
      await db.insert(users).values(user);
    }
    console.log(`✅ Inserted ${mockUsers.length} users`);
    
    // Create marketplace posts
    const posts = [
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[0].id,
        userId: mockUsers[0].id,
        type: 'buy',
        hsCode: '1001',
        productName: 'Trigo',
        quantity: '500 toneladas',
        destinationCountry: 'AR',
        deadlineDays: 30,
        requirements: JSON.stringify(['Certificación orgánica', 'Entrega CIF Buenos Aires']),
        certifications: null,
        status: 'active',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[1] ? existingCompanies[1].id : existingCompanies[0].id,
        userId: mockUsers[1].id,
        type: 'sell',
        hsCode: '0901',
        productName: 'Café',
        quantity: '1000 sacos de 60kg',
        originCountry: 'BR',
        deadlineDays: null,
        requirements: null,
        certifications: JSON.stringify(['Orgánico', 'Fair Trade']),
        status: 'active',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        expiresAt: null
      },
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[2] ? existingCompanies[2].id : existingCompanies[0].id,
        userId: mockUsers[2].id,
        type: 'buy',
        hsCode: '8517',
        productName: 'Smartphones',
        quantity: '5000 units',
        destinationCountry: 'US',
        deadlineDays: 45,
        requirements: JSON.stringify(['FCC certified', 'Warranty included']),
        certifications: null,
        status: 'active',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[0].id,
        userId: mockUsers[0].id,
        type: 'sell',
        hsCode: '1005',
        productName: 'Maíz',
        quantity: '300 toneladas',
        originCountry: 'AR',
        deadlineDays: null,
        requirements: null,
        certifications: JSON.stringify(['No GMO', 'Grado 1']),
        status: 'active',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        expiresAt: null
      }
    ];
    
    console.log('Inserting marketplace posts...');
    for (const post of posts) {
      await db.insert(marketplacePosts).values(post);
    }
    console.log(`✅ Inserted ${posts.length} marketplace posts`);
    
    // Create subscriptions
    const subs = [
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[0].id,
        planType: 'multinacional',
        status: 'active',
        maxEmployees: 100,
        currentEmployees: 45,
        monthlyPrice: 499,
        startDate: new Date(2024, 0, 15),
        endDate: new Date(2025, 0, 15),
        nextBillingDate: new Date(2025, 0, 15)
      },
      {
        id: crypto.randomUUID(),
        companyId: existingCompanies[1] ? existingCompanies[1].id : existingCompanies[0].id,
        planType: 'pyme',
        status: 'active',
        maxEmployees: 5,
        currentEmployees: 3,
        monthlyPrice: 99,
        startDate: new Date(2024, 10, 1),
        endDate: new Date(2025, 10, 1),
        nextBillingDate: new Date(2024, 11, 1)
      }
    ];
    
    console.log('Inserting subscriptions...');
    for (const sub of subs) {
      await db.insert(subscriptions).values(sub);
    }
    console.log(`✅ Inserted ${subs.length} subscriptions`);
    
    saveDatabase();
    console.log('✅ Marketplace data seeded successfully!');
  } catch (error: any) {
    console.error('❌ Error seeding marketplace:', error.message);
    console.error(error);
  }
}

seedMarketplace();
