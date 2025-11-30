
import { db, initDatabase, saveDatabase } from "../db-sqlite";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Running migration: add-roles-and-participants...");

  try {
    // Initialize DB
    await initDatabase();
    
    // 1. Add primary_role column to users table if it doesn't exist
    // SQLite doesn't support IF NOT EXISTS for ADD COLUMN, so we catch the error
    try {
      await db.run(sql`ALTER TABLE users ADD COLUMN primary_role TEXT DEFAULT 'tecnico'`);
      console.log("✅ Added primary_role column to users table");
    } catch (error: any) {
      if (error.message.includes("duplicate column name")) {
        console.log("ℹ️ primary_role column already exists in users table");
      } else {
        // Ignore other errors for now as column might exist
        console.log("ℹ️ Could not add column (might exist):", error.message);
      }
    }

    // 2. Create conversation_participants table
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS conversation_participants (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        access_level TEXT DEFAULT 'full',
        added_by TEXT,
        added_at INTEGER,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (added_by) REFERENCES users(id)
      )
    `);
    console.log("✅ Created conversation_participants table");

    // 3. Create indexes
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_participants_conversation ON conversation_participants(conversation_id)`);
    await db.run(sql`CREATE INDEX IF NOT EXISTS idx_participants_user ON conversation_participants(user_id)`);
    console.log("✅ Created indexes for conversation_participants");

    // Save changes
    saveDatabase();
    console.log("🎉 Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
