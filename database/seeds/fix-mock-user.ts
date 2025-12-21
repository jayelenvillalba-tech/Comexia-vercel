import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { users, companies } from '../../shared/shared/schema-sqlite.js';
import { eq } from 'drizzle-orm';

async function fixMockUser() {
  console.log('🔧 Fixing Mock User...');
  await initDatabase();

  const mockId = 'mock-user-1';
  
  // Check if exists
  const existing = await db.select().from(users).where(eq(users.id, mockId));
  
  if (existing.length === 0) {
      console.log('Creating mock-user-1...');
      
      // Get any company to attach to
      const company = await db.select().from(companies).limit(1);
      const companyId = company[0]?.id;

      if (!companyId) {
          console.error('No companies found! Cannot create user.');
          return;
      }

      await db.insert(users).values({
          id: mockId,
          companyId: companyId,
          name: 'Demo User (Comprador)',
          email: 'demo@user.com',
          role: 'Manager',
          verified: true
      });
      console.log('✅ Mock User Created');
  } else {
      console.log('✅ Mock User already exists');
  }

  saveDatabase();
}

fixMockUser().catch(console.error);
