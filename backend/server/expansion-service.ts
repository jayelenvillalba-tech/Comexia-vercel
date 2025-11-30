// SERVICIO DE EXPANSIÓN AUTOMÁTICA - K.O.R.A
// Automatiza la carga de nuevos países y empresas al sistema

import { storage } from './storage.js';

export interface ExpansionData {
  paisCodigo: string;
  nombrePais: string;
  coordenadas: [number, number];
  empresas: Array<{
    name: string;
    type: 'exporter' | 'importer' | 'both';
    sector: string;
    products: string[];
    verified: boolean;
    legalName: string;
    businessType: string;
    establishedYear: number;
    employeeCount: number;
    creditRating: string;
    contactEmail: string;
    website: string;
    phone: string;
    address: string;
    registrySource: string;
    businessRegistration: string;
    rating: number;
    riskScore: string;
  }>;
}

export class ExpansionService {
  
  /**
   * Carga múltiples países con sus empresas al sistema
   */
  async cargarPaisesAlSistema(paisesData: Record<string, ExpansionData>): Promise<{
    success: boolean;
    empresasCargadas: number;
    paisesCargados: number;
    errores: string[];
  }> {
    const errores: string[] = [];
    let empresasCargadas = 0;
    let paisesCargados = 0;

    try {
      for (const [paisCodigo, paisData] of Object.entries(paisesData)) {
        try {
          // Cargar cada empresa del país
          for (const empresaData of paisData.empresas) {
            const empresaCompleta = {
              ...empresaData,
              country: paisCodigo,
              countryName: paisData.nombrePais,
              coordinates: paisData.coordenadas
            };

            // Crear empresa en el storage
            await storage.createCompany(empresaCompleta);
            empresasCargadas++;
          }
          
          paisesCargados++;
          console.log(`✅ País cargado: ${paisData.nombrePais} (${empresaData.empresas.length} empresas)`);
          
        } catch (error) {
          const errorMsg = `Error cargando país ${paisCodigo}: ${error.message}`;
          errores.push(errorMsg);
          console.error(`❌ ${errorMsg}`);
        }
      }

      return {
        success: errores.length === 0,
        empresasCargadas,
        paisesCargados,
        errores
      };

    } catch (error) {
      console.error('Error general en carga de países:', error);
      return {
        success: false,
        empresasCargadas,
        paisesCargados,
        errores: [...errores, `Error general: ${error.message}`]
      };
    }
  }

  /**
   * Verifica si un país ya existe en el sistema
   */
  async verificarPaisExiste(paisCodigo: string): Promise<boolean> {
    try {
      const companies = await storage.searchCompanies({
        country: paisCodigo,
        limit: 1
      });
      return companies.companies.length > 0;
    } catch (error) {
      console.error(`Error verificando país ${paisCodigo}:`, error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas del sistema después de la expansión
   */
  async obtenerEstadisticasPost(): Promise<{
    totalEmpresas: number;
    totalPaises: number;
    empresasPorContinente: Record<string, number>;
    ultimaActualizacion: string;
  }> {
    try {
      // Obtener todas las empresas
      const searchResult = await storage.searchCompanies({ limit: 1000 });
      const companies = searchResult.companies;

      // Contar países únicos
      const paisesUnicos = new Set(companies.map(c => c.country));
      
      // Mapear países a continentes (simplificado)
      const continentMapping: Record<string, string> = {
        'US': 'americas', 'CA': 'americas', 'MX': 'americas', 'BR': 'americas', 'AR': 'americas',
        'CL': 'americas', 'PE': 'americas', 'CO': 'americas', 'EC': 'americas', 'UY': 'americas',
        'VE': 'americas', 'BO': 'americas', 'PY': 'americas', 'GT': 'americas', 'CR': 'americas',
        'DO': 'americas', 'HN': 'americas', 'PA': 'americas', 'NI': 'americas', 'SV': 'americas',
        'JM': 'americas', 'TT': 'americas', 'BB': 'americas', 'BS': 'americas', 'BZ': 'americas',
        
        'DE': 'europe', 'FR': 'europe', 'IT': 'europe', 'ES': 'europe', 'NL': 'europe',
        'BE': 'europe', 'GB': 'europe', 'CH': 'europe', 'SE': 'europe', 'NO': 'europe',
        'DK': 'europe', 'FI': 'europe', 'AT': 'europe', 'PL': 'europe', 'CZ': 'europe',
        'HU': 'europe', 'RO': 'europe', 'RU': 'europe', 'TR': 'europe', 'UA': 'europe',
        'HR': 'europe', 'RS': 'europe', 'BG': 'europe', 'SK': 'europe', 'SI': 'europe',
        'EE': 'europe', 'LV': 'europe', 'LT': 'europe', 'BY': 'europe', 'MD': 'europe',
        
        'CN': 'asia', 'JP': 'asia', 'KR': 'asia', 'IN': 'asia', 'SG': 'asia',
        'TH': 'asia', 'MY': 'asia', 'ID': 'asia', 'VN': 'asia', 'BD': 'asia',
        'PK': 'asia', 'KZ': 'asia', 'AE': 'asia', 'SA': 'asia', 'IR': 'asia',
        'IL': 'asia', 'JO': 'asia', 'LB': 'asia', 'QA': 'asia', 'KW': 'asia',
        'BH': 'asia', 'OM': 'asia', 'MM': 'asia', 'KH': 'asia', 'LA': 'asia',
        'MN': 'asia', 'LK': 'asia',
        
        'EG': 'africa', 'MA': 'africa', 'NG': 'africa', 'GH': 'africa',
        'KE': 'africa', 'ZA': 'africa', 'ET': 'africa', 'UG': 'africa',
        'TZ': 'africa', 'SN': 'africa', 'CI': 'africa', 'DZ': 'africa',
        'AO': 'africa', 'TN': 'africa',
        
        'AU': 'oceania', 'NZ': 'oceania', 'FJ': 'oceania', 'PG': 'oceania',
        'NC': 'oceania', 'PF': 'oceania',
        
        'FK': 'falklands'
      };

      // Contar empresas por continente
      const empresasPorContinente: Record<string, number> = {};
      companies.forEach(company => {
        const continente = continentMapping[company.country] || 'otros';
        empresasPorContinente[continente] = (empresasPorContinente[continente] || 0) + 1;
      });

      return {
        totalEmpresas: companies.length,
        totalPaises: paisesUnicos.size,
        empresasPorContinente,
        ultimaActualizacion: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalEmpresas: 0,
        totalPaises: 0,
        empresasPorContinente: {},
        ultimaActualizacion: new Date().toISOString()
      };
    }
  }

  /**
   * Genera reporte de progreso de expansión
   */
  async generarReporteProgreso(): Promise<{
    estadoActual: any;
    metaGlobal: any;
    progreso: number;
    siguientesFases: string[];
  }> {
    const stats = await this.obtenerEstadisticasPost();
    
    return {
      estadoActual: {
        empresas: stats.totalEmpresas,
        paises: stats.totalPaises,
        continentes: Object.keys(stats.empresasPorContinente).length,
        distribucion: stats.empresasPorContinente
      },
      metaGlobal: {
        paisesObjetivo: 195,
        empresasObjetivo: 600, // ~3 empresas por país
        coberturaCompleta: "100%"
      },
      progreso: Math.round((stats.totalPaises / 195) * 100),
      siguientesFases: [
        "Fase 2: Mercados Medianos (30 países)",
        "Fase 3: Países Pequeños (82 países)",
        "Optimización y validación global",
        "Deployment de cobertura completa"
      ]
    };
  }

  /**
   * Valida datos de empresa antes de cargar
   */
  private validarEmpresa(empresa: any): { valida: boolean; errores: string[] } {
    const errores: string[] = [];

    if (!empresa.name || empresa.name.trim().length === 0) {
      errores.push("Nombre de empresa requerido");
    }

    if (!empresa.country || empresa.country.length !== 2) {
      errores.push("Código de país inválido");
    }

    if (!['exporter', 'importer', 'both'].includes(empresa.type)) {
      errores.push("Tipo de empresa inválido");
    }

    if (!empresa.products || !Array.isArray(empresa.products) || empresa.products.length === 0) {
      errores.push("Productos requeridos");
    }

    if (!empresa.contactEmail || !empresa.contactEmail.includes('@')) {
      errores.push("Email de contacto inválido");
    }

    return {
      valida: errores.length === 0,
      errores
    };
  }
}

// Exportar instancia singleton
export const expansionService = new ExpansionService();