// Script de migración para consolidar 125+ archivos de empresas
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { InsertCompany } from '../../shared/shared/schema';

interface EmpresaLegacy {
  id?: string;
  name?: string;
  nombre?: string;
  country?: string;
  pais?: string;
  type?: string;
  tipo?: string;
  sector?: string;
  products?: string[];
  productos?: string[];
  contactEmail?: string;
  email?: string;
  website?: string;
  sitioWeb?: string;
  phone?: string;
  telefono?: string;
  address?: string;
  direccion?: string;
  rating?: number;
  calificacion?: number;
  verified?: boolean;
  verificada?: boolean;
  businessType?: string;
  tipoNegocio?: string;
  employeeCount?: number;
  numeroEmpleados?: number;
  annualRevenue?: number;
  ingresoAnual?: number;
  certifications?: string[];
  certificaciones?: string[];
}

class EmpresasMigrator {
  private empresasPath = 'c:\\KoraApp\\ComexIA-Trae-main\\public\\empresas';
  private migratedCompanies: InsertCompany[] = [];
  private duplicateTracker = new Set<string>();
  private stats = {
    totalFiles: 0,
    processedFiles: 0,
    totalCompanies: 0,
    duplicatesSkipped: 0,
    errors: 0
  };

  async migrateAllData(): Promise<void> {
    console.log('🚀 Iniciando migración de datos de empresas...');
    
    try {
      // 1. Procesar archivos JSON de respaldo por continente
      await this.processBackupFiles();
      
      // 2. Procesar archivos JavaScript con datos de empresas
      await this.processJavaScriptFiles();
      
      // 3. Generar archivo consolidado
      await this.generateConsolidatedFile();
      
      // 4. Generar estadísticas finales
      this.generateMigrationReport();
      
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    }
  }

  private async processBackupFiles(): Promise<void> {
    const backupFiles = [
      'africa-complete-final-backup.json',
      'asia-complete-final-backup.json', 
      'europe-complete-final-backup.json',
      'south-america-companies-backup.json',
      'europe-expansion-backup.json'
    ];

    for (const filename of backupFiles) {
      const filePath = path.join(this.empresasPath, filename);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Procesando: ${filename}`);
        await this.processJsonFile(filePath, filename);
        this.stats.processedFiles++;
      }
      this.stats.totalFiles++;
    }
  }

  private async processJavaScriptFiles(): Promise<void> {
    const jsFiles = [
      'carga-empresas-global-completa.js',
      'analisis-completo-distribuccion-empresarial.js',
      'carga-empresas-directas-expansion.js',
      'completar-217-empresas-final.js'
    ];

    for (const filename of jsFiles) {
      const filePath = path.join(this.empresasPath, filename);
      if (fs.existsSync(filePath)) {
        console.log(`📄 Procesando: ${filename}`);
        await this.processJavaScriptFile(filePath, filename);
        this.stats.processedFiles++;
      }
      this.stats.totalFiles++;
    }
  }

  private async processJsonFile(filePath: string, filename: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      if (Array.isArray(data)) {
        for (const empresa of data) {
          this.processEmpresaRecord(empresa, filename);
        }
      } else if (data.empresas && Array.isArray(data.empresas)) {
        for (const empresa of data.empresas) {
          this.processEmpresaRecord(empresa, filename);
        }
      }
    } catch (error) {
      console.error(`❌ Error procesando ${filename}:`, error);
      this.stats.errors++;
    }
  }

  private async processJavaScriptFile(filePath: string, filename: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Extraer arrays de empresas de archivos JavaScript
      const empresasMatch = content.match(/const\s+empresas[\w]*\s*=\s*(\[[\s\S]*?\]);/g);
      
      if (empresasMatch) {
        for (const match of empresasMatch) {
          try {
            // Extraer solo el array JSON
            const arrayMatch = match.match(/\[([\s\S]*?)\]/)?.[0];
            if (arrayMatch) {
              const empresas = eval(`(${arrayMatch})`);
              if (Array.isArray(empresas)) {
                for (const empresa of empresas) {
                  this.processEmpresaRecord(empresa, filename);
                }
              }
            }
          } catch (evalError) {
            console.warn(`⚠️ Error evaluando array en ${filename}:`, evalError);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error procesando ${filename}:`, error);
      this.stats.errors++;
    }
  }

  private processEmpresaRecord(empresa: EmpresaLegacy, source: string): void {
    try {
      // Normalizar datos de empresa
      const normalizedCompany = this.normalizeCompanyData(empresa, source);
      
      // Verificar duplicados
      const companyKey = `${normalizedCompany.name}-${normalizedCompany.country}`;
      if (this.duplicateTracker.has(companyKey)) {
        this.stats.duplicatesSkipped++;
        return;
      }
      
      this.duplicateTracker.add(companyKey);
      this.migratedCompanies.push(normalizedCompany);
      this.stats.totalCompanies++;
      
    } catch (error) {
      console.error(`❌ Error procesando empresa:`, error);
      this.stats.errors++;
    }
  }

  private normalizeCompanyData(empresa: EmpresaLegacy, source: string): InsertCompany {
    // Mapear tipos de empresa
    const typeMapping: Record<string, string> = {
      'directa': 'exporter',
      'indirecta': 'importer', 
      'pyme': 'both',
      'cooperativa': 'both',
      'estatal': 'both',
      'exportadora': 'exporter',
      'importadora': 'importer',
      'mixta': 'both'
    };

    // Mapear países
    const countryMapping: Record<string, string> = {
      'Estados Unidos': 'United States',
      'Reino Unido': 'United Kingdom',
      'Alemania': 'Germany',
      'Francia': 'France',
      'España': 'Spain',
      'Italia': 'Italy',
      'Japón': 'Japan',
      'China': 'China',
      'Brasil': 'Brazil',
      'Argentina': 'Argentina',
      'México': 'Mexico',
      'Canadá': 'Canada',
      'Australia': 'Australia',
      'India': 'India',
      'Sudáfrica': 'South Africa'
    };

    const name = empresa.name || empresa.nombre || 'Unknown Company';
    const country = countryMapping[empresa.country || empresa.pais || ''] || empresa.country || empresa.pais || 'Unknown';
    const type = typeMapping[empresa.type || empresa.tipo || ''] || 'both';
    
    return {
      name,
      country,
      type,
      products: empresa.products || empresa.productos || [],
      verified: empresa.verified || empresa.verificada || false,
      contactEmail: empresa.contactEmail || empresa.email,
      website: empresa.website || empresa.sitioWeb,
      phone: empresa.phone || empresa.telefono,
      address: empresa.address || empresa.direccion,
      businessType: empresa.businessType || empresa.tipoNegocio || 'corporation',
      employeeCount: empresa.employeeCount || empresa.numeroEmpleados,
      annualRevenue: empresa.annualRevenue || empresa.ingresoAnual,
      creditRating: this.calculateCreditRating(empresa.rating || empresa.calificacion),
      riskScore: this.calculateRiskScore(empresa),
      certifications: empresa.certifications || empresa.certificaciones || [],
      sanctions: false,
      contactPerson: `Contact - ${name}`,
      legalName: name,
      establishedYear: this.estimateEstablishedYear(source)
    };
  }

  private calculateCreditRating(rating?: number): string {
    if (!rating) return 'B';
    if (rating >= 9) return 'AAA';
    if (rating >= 8) return 'AA';
    if (rating >= 7) return 'A';
    if (rating >= 6) return 'BBB';
    if (rating >= 5) return 'BB';
    return 'B';
  }

  private calculateRiskScore(empresa: EmpresaLegacy): number {
    let score = 50; // Base score
    
    if (empresa.verified || empresa.verificada) score -= 10;
    if (empresa.rating && empresa.rating > 7) score -= 15;
    if (empresa.certifications?.length || empresa.certificaciones?.length) score -= 10;
    if (empresa.website || empresa.sitioWeb) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private estimateEstablishedYear(source: string): number {
    const currentYear = new Date().getFullYear();
    // Estimar año basado en el tipo de fuente
    if (source.includes('backup')) return currentYear - 5;
    if (source.includes('expansion')) return currentYear - 3;
    return currentYear - 10;
  }

  private async generateConsolidatedFile(): Promise<void> {
    const outputPath = path.join('database', 'seeds', 'consolidated-companies.json');
    
    // Crear directorio si no existe
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const consolidatedData = {
      metadata: {
        migratedAt: new Date().toISOString(),
        totalCompanies: this.stats.totalCompanies,
        sources: this.stats.processedFiles,
        version: '1.0.0'
      },
      companies: this.migratedCompanies
    };

    fs.writeFileSync(outputPath, JSON.stringify(consolidatedData, null, 2));
    console.log(`✅ Archivo consolidado generado: ${outputPath}`);
  }

  private generateMigrationReport(): void {
    console.log('\n📊 REPORTE DE MIGRACIÓN');
    console.log('========================');
    console.log(`📁 Archivos totales: ${this.stats.totalFiles}`);
    console.log(`✅ Archivos procesados: ${this.stats.processedFiles}`);
    console.log(`🏢 Empresas migradas: ${this.stats.totalCompanies}`);
    console.log(`🔄 Duplicados omitidos: ${this.stats.duplicatesSkipped}`);
    console.log(`❌ Errores: ${this.stats.errors}`);
    
    // Estadísticas por tipo
    const typeStats = this.migratedCompanies.reduce((acc, company) => {
      acc[company.type] = (acc[company.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📈 DISTRIBUCIÓN POR TIPO:');
    Object.entries(typeStats).forEach(([type, count]) => {
      const percentage = ((count / this.stats.totalCompanies) * 100).toFixed(1);
      console.log(`   ${type}: ${count} (${percentage}%)`);
    });
    
    // Estadísticas por país
    const countryStats = this.migratedCompanies.reduce((acc, company) => {
      acc[company.country] = (acc[company.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n🌍 TOP 10 PAÍSES:');
    Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([country, count]) => {
        console.log(`   ${country}: ${count}`);
      });
  }
}

export { EmpresasMigrator };

// Ejecutar migración directamente
const migrator = new EmpresasMigrator();
migrator.migrateAllData()
  .then(() => {
    console.log('✅ Migración completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en la migración:', error);
    process.exit(1);
  });