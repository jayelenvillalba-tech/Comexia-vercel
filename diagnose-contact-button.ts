import { db, initDatabase } from './database/db-sqlite';
import { users, companies, marketplacePosts, conversations } from './shared/shared/schema-sqlite';
import { eq } from 'drizzle-orm';

async function diagnose() {
  console.log('\n🔍 === CONTACT BUTTON DIAGNOSTIC ===\n');
  
  try {
    await initDatabase();
    console.log('✅ Database initialized\n');

    // 1. Check mock-user-1
    console.log('👤 Checking mock-user-1:');
    const user = await db.select().from(users).where(eq(users.id, 'mock-user-1'));
    if (user.length === 0) {
      console.log('❌ mock-user-1 NOT FOUND');
    } else {
      console.log('✅ mock-user-1 exists:');
      console.log(`   - ID: ${user[0].id}`);
      console.log(`   - Name: ${user[0].name}`);
      console.log(`   - Email: ${user[0].email}`);
      console.log(`   - CompanyId: ${user[0].companyId}`);
      console.log(`   - Role: ${user[0].role}`);
      
      // Check if company exists
      if (user[0].companyId) {
        const company = await db.select().from(companies).where(eq(companies.id, user[0].companyId));
        if (company.length === 0) {
          console.log(`   ❌ Company ${user[0].companyId} NOT FOUND`);
        } else {
          console.log(`   ✅ Company exists: ${company[0].name}`);
        }
      }
    }

    // 2. Check mock posts
    console.log('\n📦 Checking mock posts:');
    for (const postId of ['mock-1', 'mock-2', 'mock-3']) {
      const post = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, postId));
      if (post.length === 0) {
        console.log(`❌ ${postId} NOT FOUND`);
      } else {
        console.log(`✅ ${postId} exists:`);
        console.log(`   - Product: ${post[0].productName}`);
        console.log(`   - CompanyId: ${post[0].companyId}`);
        console.log(`   - UserId: ${post[0].userId}`);
        
        // Check if company exists
        const company = await db.select().from(companies).where(eq(companies.id, post[0].companyId));
        if (company.length === 0) {
          console.log(`   ❌ Company ${post[0].companyId} NOT FOUND`);
        } else {
          console.log(`   ✅ Company: ${company[0].name}`);
        }
        
        // Check if user exists
        const postUser = await db.select().from(users).where(eq(users.id, post[0].userId));
        if (postUser.length === 0) {
          console.log(`   ❌ User ${post[0].userId} NOT FOUND`);
        } else {
          console.log(`   ✅ User: ${postUser[0].name}`);
        }
      }
    }

    // 3. Check demo companies
    console.log('\n🏢 Checking demo companies:');
    for (const companyId of ['demo-frigorifico-very', 'demo-global-meats', 'demo-logitrans']) {
      const company = await db.select().from(companies).where(eq(companies.id, companyId));
      if (company.length === 0) {
        console.log(`❌ ${companyId} NOT FOUND`);
      } else {
        console.log(`✅ ${companyId}: ${company[0].name}`);
      }
    }

    // 4. Check existing conversations
    console.log('\n💬 Existing conversations:');
    const allConvs = await db.select().from(conversations);
    console.log(`   Total: ${allConvs.length}`);
    if (allConvs.length > 0) {
      allConvs.forEach(conv => {
        console.log(`   - ${conv.id}: ${conv.company1Id} <-> ${conv.company2Id} (Post: ${conv.postId})`);
      });
    }

    console.log('\n✅ Diagnostic complete\n');

  } catch (error: any) {
    console.error('❌ Error during diagnostic:', error.message);
    console.error(error.stack);
  } finally {
    process.exit(0);
  }
}

diagnose();
