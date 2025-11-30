import fs from 'fs';
import path from 'path';

interface Company {
  id: string;
  name: string;
  country: string;
  type?: string;
  products?: string;
  verified?: boolean;
  contact_email?: string;
  website?: string;
  legal_name?: string;
  tax_id?: string;
  business_type?: string;
  established_year?: number;
  employee_count?: number;
  annual_revenue?: number;
  credit_rating?: string;
  risk_score?: number;
  payment_terms?: string;
  total_transactions?: number;
  average_order_value?: number;
  on_time_delivery_rate?: number;
  certifications?: string;
  sanctions?: string;
  contact_person?: string;
  phone?: string;
  address?: string;
  last_updated?: string;
  created_at?: string;
}

async function verifyCompanies() {
  try {
    console.log('🔍 Verificando empresas en archivo JSON...');
    
    const jsonPath = path.join(process.cwd(), 'database', 'seeds', 'consolidated-companies.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('❌ No se encontró el archivo consolidated-companies.json');
      console.log('📍 Ruta esperada:', jsonPath);
      process.exit(1);
    }
    
    // Leer y parsear el archivo JSON
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const companies: Company[] = JSON.parse(fileContent);
    
    console.log(`📊 Total de empresas encontradas: ${companies.length}`);
    
    if (companies.length === 0) {
      console.log('⚠️ El archivo está vacío o no contiene empresas válidas');
      process.exit(1);
    }
    
    // Mostrar las primeras 5 empresas
    const firstFive = companies.slice(0, 5);
    console.log('\n📋 Primeras 5 empresas:');
    firstFive.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.name} (${company.country})`);
    });
    
    // Contar por país
    const countryCounts = companies.reduce((acc, company) => {
      const country = company.country || 'Sin país';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🌍 Empresas por país (Top 10):');
    Object.entries(countryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([country, count]) => {
        console.log(`  ${country}: ${count}`);
      });
    
    // Contar por tipo de empresa
    const typeCounts = companies.reduce((acc, company) => {
      const type = company.type || company.business_type || 'Sin tipo';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🏢 Empresas por tipo:');
    Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    
    // Estadísticas adicionales
    const withEmail = companies.filter(c => c.contact_email || c.email).length;
    const withWebsite = companies.filter(c => c.website).length;
    const verified = companies.filter(c => c.verified).length;
    
    console.log('\n📈 Estadísticas adicionales:');
    console.log(`  📧 Con email: ${withEmail} (${((withEmail/companies.length)*100).toFixed(1)}%)`);
    console.log(`  🌐 Con website: ${withWebsite} (${((withWebsite/companies.length)*100).toFixed(1)}%)`);
    console.log(`  ✅ Verificadas: ${verified} (${((verified/companies.length)*100).toFixed(1)}%)`);
    
    console.log('\n✅ Verificación completada exitosamente!');
    console.log(`📁 Archivo verificado: ${jsonPath}`);
    console.log(`📊 Total de empresas: ${companies.length}`);
    
  } catch (error) {
    console.error('❌ Error al verificar empresas:', error);
    console.log('\n💡 Posibles soluciones:');
    console.log('  1. Verifica que el archivo consolidated-companies.json exista');
    console.log('  2. Verifica que el archivo tenga formato JSON válido');
    console.log('  3. Ejecuta: npm run verify:json');
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  verifyCompanies();
}