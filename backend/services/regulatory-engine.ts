
import { db as exportedDb, initDatabase } from '../../database/db-sqlite.js';
import { regulatoryRules } from '../../shared/shared/schema-sqlite.js';
import { countries } from '../../shared/shared/countries-data.js';
import { eq, or, and, isNull, inArray } from 'drizzle-orm';
import { SanctionsService } from './sanctions-service.js';


export class RegulatoryEngine {

  static async determineRequiredDocuments(hsCode: string, country: string, originCountry?: string): Promise<any[]> {
    // Ensure database is initialized
    const db = await initDatabase();
    
    const commonDocs: any[] = [
      {
        name: 'Factura Comercial',
        issuer: 'Exportador',
        description: 'Documento comercial que detalla la transacción.',
        requirements: 'Debe incluir Incoterms, descripción detallada, valor unitario y total.'
      },
      {
        name: 'Lista de Empaque (Packing List)',
        issuer: 'Exportador',
        description: 'Detalle del contenido de cada bulto.',
        requirements: 'Debe coincidir exactamente con la factura comercial.'
      },
      {
        name: 'Certificado de Origen',
        issuer: 'Cámara de Comercio / Entidad Autorizada',
        description: 'Acredita el origen de la mercancía para preferencias arancelarias.',
        requirements: 'Formato específico según el acuerdo comercial aplicable.'
      },
      {
        name: 'Documento de Transporte',
        issuer: 'Transportista / Agente de Carga',
        description: 'Bill of Lading (marítimo), Air Waybill (aéreo) o CRT (terrestre).',
        requirements: 'Debe estar consignado según instrucciones del importador.'
      }
    ];

    const chapter = hsCode ? hsCode.substring(0, 2) : null;
    const euCountries = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'SE', 'PL', 'AT', 'DK', 'FI', 'IE', 'PT', 'GR', 'CZ', 'HU', 'RO', 'BG', 'SK', 'HR', 'LT', 'SI', 'LV', 'EE', 'CY', 'LU', 'MT'];
    const mercosurCountries = ['AR', 'BR', 'PY', 'UY', 'BO'];
    const alianzaPacifico = ['MX', 'CL', 'CO', 'PE'];
    const comunidadAndina = ['BO', 'CO', 'EC', 'PE'];
    const caftaCountries = ['CR', 'SV', 'GT', 'HN', 'NI', 'DO'];
    const usmcaCountries = ['US', 'CA', 'MX'];
    const eftaCountries = ['CH', 'IS', 'LI', 'NO'];
    const aseanCountries = ['ID', 'MY', 'TH', 'VN', 'PH', 'SG', 'BN', 'KH', 'LA', 'MM'];
    const rcepCountries = [...aseanCountries, 'CN', 'JP', 'KR', 'AU', 'NZ'];
    const cptppCountries = ['JP', 'MX', 'CA', 'AU', 'NZ', 'CL', 'PE', 'VN', 'MY', 'BN', 'GB'];
    const ecowasCountries = ['NG', 'GH', 'SN', 'CI', 'LR', 'SL', 'GM', 'CV', 'GW', 'ML', 'BF', 'NE', 'BJ', 'TG'];
    const sadcCountries = ['ZA', 'AO', 'BW', 'KM', 'CD', 'SZ', 'LS', 'MG', 'MW', 'MU', 'MZ', 'NA', 'SC', 'TZ', 'ZM', 'ZW'];
    const eacCountries = ['KE', 'UG', 'TZ', 'RW', 'BI', 'SS', 'CD'];
    const comesaCountries = ['EG', 'ET', 'LY', 'SD', 'DJ', 'ER'];
    const africaCountries = [...ecowasCountries, ...sadcCountries, ...eacCountries, ...comesaCountries, 'MA', 'DZ', 'TN', 'LY', 'EG', 'SD', 'ER', 'DJ', 'SO', 'ET', 'SS', 'CF', 'TD', 'GA', 'GQ', 'ST', 'CG'];
    const gccCountries = ['SA', 'AE', 'QA', 'KW', 'OM', 'BH'];
    const pacificIslands = ['FJ', 'PG', 'SB', 'VU', 'WS', 'TO', 'KI', 'MH', 'PW', 'FM', 'NR', 'TV'];

    // Helper to get relevant regions for a country
    const getRelevantRegions = (c: string | undefined) => {
      if (!c) return [];
      const regions = [c];
      
      // Regions mapping
      if (euCountries.includes(c)) {
        regions.push('EU', 'EEA');
      }
      if (eftaCountries.includes(c)) {
        regions.push('EFTA');
        if (c !== 'CH') regions.push('EEA');
      }
      if (aseanCountries.includes(c)) regions.push('ASEAN');
      if (rcepCountries.includes(c)) regions.push('RCEP');
      if (cptppCountries.includes(c)) regions.push('CPTPP');
      if (ecowasCountries.includes(c)) regions.push('ECOWAS');
      if (sadcCountries.includes(c)) regions.push('SADC');
      if (eacCountries.includes(c)) regions.push('EAC');
      if (comesaCountries.includes(c)) regions.push('COMESA');
      if (africaCountries.includes(c)) regions.push('AfCFTA');
      if (gccCountries.includes(c)) regions.push('GCC');
      if (pacificIslands.includes(c)) regions.push('PACIFIC_ISLANDS');
      
      if (['IL', 'JO', 'LB', 'IQ', 'YE'].includes(c) || gccCountries.includes(c)) regions.push('MIDDLE_EAST');

      if (c === 'IN') regions.push('INDIA_CEPA');
      if (c === 'GB') regions.push('UK', 'UK_EU_TCA');
      if (c === 'TR') regions.push('TURKEY_CU');
      if (mercosurCountries.includes(c)) regions.push('MERCOSUR');
      if (alianzaPacifico.includes(c)) regions.push('ALIANZA_PACIFICO');
      if (comunidadAndina.includes(c)) regions.push('CAN', 'ALADI');
      if (caftaCountries.includes(c)) regions.push('CAFTA_DR');
      if (usmcaCountries.includes(c)) regions.push('USMCA');
      if (['AR', 'BR', 'MX', 'CL', 'CO', 'PE', 'UY', 'PY', 'BO', 'EC'].includes(c)) regions.push('ALADI');
      if (c === 'PA') regions.push('PANAMA_US_FTA');
      return regions;
    };

    const destRegions = getRelevantRegions(country);
    const originRegions = getRelevantRegions(originCountry);

    try {
      // Fetch rules from database
      const dbRules = await db.select().from(regulatoryRules).where(
        or(
          // 1. Global Rules (no country/origin required)
          and(isNull(regulatoryRules.countryCode), isNull(regulatoryRules.originCountryCode), or(isNull(regulatoryRules.hsChapter), eq(regulatoryRules.hsChapter, chapter))),
          
          // 2. Destination Specific (matches dest country/region)
          and(inArray(regulatoryRules.countryCode, destRegions), isNull(regulatoryRules.originCountryCode), or(isNull(regulatoryRules.hsChapter), eq(regulatoryRules.hsChapter, chapter))),
          
          // 3. Origin Specific (matches origin country/region)
          and(isNull(regulatoryRules.countryCode), inArray(regulatoryRules.originCountryCode, originRegions), or(isNull(regulatoryRules.hsChapter), eq(regulatoryRules.hsChapter, chapter))),
          
          // 4. Bilateral Specific (both match)
          and(inArray(regulatoryRules.countryCode, destRegions), inArray(regulatoryRules.originCountryCode, originRegions), or(isNull(regulatoryRules.hsChapter), eq(regulatoryRules.hsChapter, chapter)))
        )
      );

      // Map DB rules to the document format
      const mappedRules = dbRules.map(rule => ({
        name: rule.documentName,
        issuer: rule.issuer,
        description: rule.description,
        requirements: rule.requirements
      }));

      // Fetch sanctions (The Danger Layer)
      const sanctionHits = await SanctionsService.checkSanctions(country, hsCode);
      
      const sanctions = sanctionHits.map(s => ({
        name: `⚠️ ALERTA DE SANCIÓN: ${s.authority}`,
        issuer: s.authority,
        description: s.message,
        requirements: `Sanción de nivel ${s.severity}. Riesgo legal alto en 2025.`,
        isSanction: true,
        severity: s.severity
      }));

      // Combine and return
      return [...sanctions, ...commonDocs, ...mappedRules];
    } catch (error) {
      console.error('Error fetching regulatory rules:', error);
      return commonDocs; // Fallback to base docs on error
    }
  }
}
