import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
config();

// Ruta al archivo de datos JSON
const dataPath = process.env.DATA_PATH || path.join(__dirname, '../data.json');

console.log(`📁 Using JSON data storage at: ${dataPath}`);

// Estructura de datos inicial
const initialData = {
  companies: [],
  hsSections: [],
  hsChapters: [],
  hsPartidas: [],
  hsSubpartidas: [],
  marketData: [],
  countryOpportunities: [],
  countryRequirements: [],
  shipments: [],
  customsProcedures: [],
  tradeAlerts: [],
  tradeOpportunities: [],
  marketIntelligence: []
};

// Cargar o crear datos
function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(rawData);
      console.log('✅ Loaded existing data');
      return data;
    } else {
      console.log('✅ Created new data file');
      saveData(initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    return initialData;
  }
}

// Guardar datos
function saveData(data: any) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('💾 Data saved');
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Simular una base de datos con operaciones CRUD
class JsonDatabase {
  private data: any;

  constructor() {
    this.data = loadData();
  }

  // Ejecutar query SQL simulada (solo para compatibilidad)
  async execute(query: any) {
    // Para queries de conteo simple
    if (query.sql && query.sql.includes('SELECT count(*)')) {
      return [{ count: this.data.companies?.length || 0 }];
    }
    return [];
  }

  // Obtener tabla
  getTable(tableName: string) {
    return this.data[tableName] || [];
  }

  // Insertar registro
  insert(tableName: string, record: any) {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    const id = crypto.randomUUID();
    const newRecord = { id, ...record };
    this.data[tableName].push(newRecord);
    saveData(this.data);
    return newRecord;
  }

  // Actualizar registro
  update(tableName: string, id: string, updates: any) {
    if (!this.data[tableName]) return null;
    const index = this.data[tableName].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      this.data[tableName][index] = { ...this.data[tableName][index], ...updates };
      saveData(this.data);
      return this.data[tableName][index];
    }
    return null;
  }

  // Eliminar registro
  delete(tableName: string, id: string) {
    if (!this.data[tableName]) return false;
    const index = this.data[tableName].findIndex((item: any) => item.id === id);
    if (index !== -1) {
      this.data[tableName].splice(index, 1);
      saveData(this.data);
      return true;
    }
    return false;
  }

  // Buscar registros
  find(tableName: string, filter: any = {}) {
    if (!this.data[tableName]) return [];
    
    if (Object.keys(filter).length === 0) {
      return this.data[tableName];
    }

    return this.data[tableName].filter((item: any) => {
      return Object.entries(filter).every(([key, value]) => item[key] === value);
    });
  }

  // Buscar un registro
  findOne(tableName: string, filter: any) {
    const results = this.find(tableName, filter);
    return results.length > 0 ? results[0] : null;
  }

  // Guardar datos manualmente
  save() {
    saveData(this.data);
  }
}

// Crear instancia de base de datos
const db = new JsonDatabase();

// Función para probar la conexión
async function testConnection() {
  try {
    console.log('✅ Conexión a almacenamiento JSON exitosa');
    console.log(`📊 Companies: ${db.getTable('companies').length}`);
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    return false;
  }
}

// Función para cerrar la conexión
async function closeConnection() {
  db.save();
  console.log('💾 Data saved on close');
}

// Exportaciones
export { db, testConnection, closeConnection };
export default db;
