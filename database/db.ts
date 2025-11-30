import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/shared/schema';
import { config } from 'dotenv';

// Cargar variables de entorno
config();

// Configuración de la conexión
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/comexia';

// Crear conexión SQL
const sql = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Crear instancia de Drizzle
const db = drizzle(sql, { schema });

// Crear conexión SQL para operaciones directas
const sqlConnection = sql;

// Tipo para la base de datos
type Database = typeof db;

// Función para cerrar la conexión
const closeConnection = async () => {
  await sql.end();
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log('✅ Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    return false;
  }
};

// Exportaciones
export { db, sql, sqlConnection, Database, closeConnection, testConnection };
export default db;