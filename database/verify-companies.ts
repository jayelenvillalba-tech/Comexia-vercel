import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { companies } from '../shared/shared/schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/comexia';
const sql = postgres(connectionString);
const db = drizzle(sql);

async function verifyCompanies() {
  try {
    console.log('🔍 Verificando empresas en la base de datos...');
    
    // Contar total de empresas
    const allCompanies = await db.select().from(companies);
    console.log(`📊 Total de empresas cargadas: ${allCompanies.length}`);
    
    if (allCompanies.length === 0) {
      console.log('⚠️ No se encontraron empresas. Ejecuta: npm run seed:companies');
      process.exit(1);
    }
    
    // Mostrar las primeras 5 empresas
    const firstFive = allCompanies.slice(0, 5);
    console.log('\n📋 Primeras 5 empresas:');
    firstFive.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (${company.country})`);
    });
    
    // Contar por país
    const countryCounts = allCompanies.reduce((acc, company) => {
      acc[company.country] = (acc[company.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🌍 Top 10 países con más empresas:');
    Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([country, count]) => {
        console.log(`  ${country}: ${count} empresas`);
      });
    
    // Mostrar estadísticas por tipo
    const typeCounts = allCompanies.reduce((acc, company) => {
      const type = company.type || 'Sin especificar';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🏢 Empresas por tipo:');
    Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count} empresas`);
      });
    
    console.log('\n✅ Verificación completada exitosamente!');
    console.log('🚀 Las empresas están listas para ser utilizadas por el backend.');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al verificar empresas:', error);
    console.log('\n💡 Posibles soluciones:');
    console.log('  1. Verifica que la base de datos esté ejecutándose');
    console.log('  2. Ejecuta: npm run seed:companies');
    console.log('  3. Revisa la configuración de DATABASE_URL');
    process.exit(1);
  }
}

verifyCompanies();