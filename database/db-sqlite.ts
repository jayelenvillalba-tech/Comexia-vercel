import { drizzle } from 'drizzle-orm/sql-js';
import initSqlJs from 'sql.js';
import * as schema from '../shared/shared/schema-sqlite';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
config();

// Ruta al archivo de base de datos SQLite
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../comexia_v2.db');

console.log(`📁 Using SQLite database at: ${dbPath}`);

let db: any;
let sqliteDb: any;

// Función para inicializar la base de datos
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Intentar cargar base de datos existente
  console.log(`Checking if database exists at: ${dbPath}`);
  if (fs.existsSync(dbPath)) {
    console.log('File exists on disk.');
    const buffer = fs.readFileSync(dbPath);
    sqliteDb = new SQL.Database(buffer);
    console.log('✅ Loaded existing database');
  } else {
    console.log('File does NOT exist on disk.');
    sqliteDb = new SQL.Database();
    console.log('✅ Created new database');
  }
  
  db = drizzle(sqliteDb, { schema });
  return db;
}

// Función para guardar la base de datos
function saveDatabase() {
  if (sqliteDb) {
    const data = sqliteDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log('💾 Database saved');
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  saveDatabase();
  if (sqliteDb) {
    sqliteDb.close();
  }
};

// Función para probar la conexión
async function testConnection() {
  try {
    if (!db) {
      await initDatabase();
    }
    // Simple query to test connection
    const result = sqliteDb.exec('SELECT 1 as test');
    console.log('✅ Conexión a la base de datos SQLite exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    return false;
  }
};

// Exportaciones
export { db, sqliteDb, initDatabase, saveDatabase, closeConnection, testConnection };
