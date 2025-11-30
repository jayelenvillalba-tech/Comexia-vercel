import { initDatabase, saveDatabase, sqliteDb } from './db-sqlite';

console.log('=== INICIALIZANDO BASE DE DATOS SQLITE ===');

const createTables = [
    `CREATE TABLE IF NOT EXISTS hs_sections (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        number INTEGER NOT NULL,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        chapter_range TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS hs_chapters (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        section_code TEXT NOT NULL,
        notes TEXT,
        notes_en TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS hs_partidas (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        chapter_code TEXT NOT NULL,
        tariff_rate REAL,
        units TEXT,
        notes TEXT,
        notes_en TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS hs_subpartidas (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        description_en TEXT NOT NULL,
        partida_code TEXT NOT NULL,
        chapter_code TEXT NOT NULL,
        tariff_rate REAL,
        special_tariff_rate REAL,
        units TEXT,
        restrictions TEXT,
        notes TEXT,
        notes_en TEXT,
        is_active INTEGER DEFAULT 1
    );`,
    `CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        type TEXT NOT NULL,
        products TEXT,
        verified INTEGER DEFAULT 0,
        contact_email TEXT,
        website TEXT,
        legal_name TEXT,
        tax_id TEXT,
        business_type TEXT,
        established_year INTEGER,
        employee_count INTEGER,
        annual_revenue REAL,
        credit_rating TEXT,
        risk_score REAL,
        payment_terms TEXT,
        total_transactions INTEGER,
        average_order_value REAL,
        on_time_delivery_rate REAL,
        certifications TEXT,
        sanctions INTEGER DEFAULT 0,
        contact_person TEXT,
        phone TEXT,
        address TEXT,
        coordinates TEXT,
        last_updated INTEGER,
        created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS country_opportunities (
        id TEXT PRIMARY KEY,
        hs_code TEXT NOT NULL,
        country_code TEXT NOT NULL,
        country_name TEXT NOT NULL,
        opportunity_score REAL,
        demand_score REAL,
        tariff_score REAL,
        logistics_score REAL,
        risk_score REAL,
        trade_agreements TEXT,
        avg_tariff_rate REAL,
        import_volume_growth REAL,
        market_size_usd REAL,
        competition_level TEXT,
        logistics_complexity TEXT
    );`,
    // ========== MARKETPLACE TABLES ==========
    `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        company_id TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        role TEXT,
        verified INTEGER DEFAULT 0,
        phone TEXT,
        created_at INTEGER,
        last_active INTEGER,
        FOREIGN KEY (company_id) REFERENCES companies(id)
    );`,
    `CREATE TABLE IF NOT EXISTS marketplace_posts (
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
        expires_at INTEGER,
        FOREIGN KEY (company_id) REFERENCES companies(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`,
    `CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        company_id TEXT NOT NULL,
        plan_type TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        max_employees INTEGER NOT NULL,
        current_employees INTEGER DEFAULT 0,
        monthly_price REAL NOT NULL,
        start_date INTEGER,
        end_date INTEGER,
        next_billing_date INTEGER,
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
    );`
];

async function main() {
    try {
        await initDatabase();
        for (const sql of createTables) {
            sqliteDb.exec(sql);
        }
        console.log('✅ Tablas creadas exitosamente.');
        saveDatabase();
    } catch (error: any) {
        console.error('❌ Error creando tablas:', error.message);
    }
}

main();
