
import { db as sqliteDb_exported, sqliteDb, initDatabase, saveDatabase, closeConnection } from './db-sqlite.js';
import { randomUUID } from 'crypto';

const createTables = [
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        country TEXT,
        industry TEXT,
        website TEXT,
        verified INTEGER DEFAULT 0,
        rating REAL DEFAULT 0.0,
        created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS marketplace_posts (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        post_type TEXT NOT NULL,
        category TEXT,
        status TEXT DEFAULT 'active',
        created_at INTEGER,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );`,
    `CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        post_id TEXT,
        company_1_id TEXT NOT NULL,
        company_2_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at INTEGER,
        last_message_at INTEGER,
        FOREIGN KEY (post_id) REFERENCES marketplace_posts(id),
        FOREIGN KEY (company_1_id) REFERENCES companies(id),
        FOREIGN KEY (company_2_id) REFERENCES companies(id)
    );`,
    `CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        message_type TEXT DEFAULT 'text',
        content TEXT,
        metadata TEXT,
        created_at INTEGER,
        read_at INTEGER,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (sender_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS conversation_participants (
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
    );`,
    `CREATE INDEX IF NOT EXISTS idx_participants_conversation ON conversation_participants(conversation_id);`,
    `CREATE INDEX IF NOT EXISTS idx_participants_user ON conversation_participants(user_id);`,
    `CREATE TABLE IF NOT EXISTS chat_invites (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        created_by TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        access_level TEXT DEFAULT 'limited',
        expires_at INTEGER,
        status TEXT DEFAULT 'pending',
        used_by TEXT,
        used_at INTEGER,
        created_at INTEGER,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (used_by) REFERENCES users(id)
    );`,
    `CREATE INDEX IF NOT EXISTS idx_invites_token ON chat_invites(token);`,
    `CREATE INDEX IF NOT EXISTS idx_invites_conversation ON chat_invites(conversation_id);`,
    `CREATE TABLE IF NOT EXISTS verifications (
        id TEXT PRIMARY KEY,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        verification_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        documents TEXT,
        submitted_at INTEGER,
        reviewed_at INTEGER,
        reviewed_by TEXT,
        notes TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS regulatory_rules (
      id TEXT PRIMARY KEY,
      hs_chapter TEXT,
      country_code TEXT,
      origin_country_code TEXT,
      document_name TEXT NOT NULL,
      issuer TEXT,
      description TEXT,
      requirements TEXT,
      priority INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS sanctions_list (
        id TEXT PRIMARY KEY,
        country_code TEXT,
        hs_chapter TEXT,
        authority TEXT NOT NULL,
        message TEXT NOT NULL,
        severity TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`
];

export async function initializeTables() {
    try {
        await initDatabase();
        for (const sql of createTables) {
            sqliteDb.exec(sql);
        }
        console.log('✅ Database tables initialized successfully');
        saveDatabase();
    } catch (error: any) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}
