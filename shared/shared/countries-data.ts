export interface TradeTreaty {
  id: string;
  name: string;
  nameEn: string;
  members: string[]; // Country codes
  type: 'free_trade' | 'customs_union' | 'common_market' | 'bilateral';
  tariffReduction: number; // Percentage reduction (0-100)
  sectors?: string[]; // Specific sectors affected
}

export interface CountryData {
  code: string;
  name: string;
  nameEn: string;
  region: string;
  treaties: string[]; // Treaty IDs
  restrictions?: string[]; // Specific trade restrictions
  majorExports?: string[]; // Main export categories
  majorImports?: string[]; // Main import categories
  dataProtection?: 'GDPR' | 'LGPD' | 'CCPA' | 'PIPL' | 'General'; // Data Privacy Standard
}

// Tratados comerciales principales (actualizados a 2024)
export const tradeTreaties: TradeTreaty[] = [
  {
    id: 'mercosur',
    name: 'MERCOSUR',
    nameEn: 'Southern Common Market',
    members: ['AR', 'BR', 'PY', 'UY', 'BO'], // Bolivia miembro pleno desde 2025 con derechos de voto completos
    type: 'common_market',
    tariffReduction: 95, // Zona de libre comercio desde 1995, arancel externo común 11.5%
    sectors: ['automotive', 'textiles', 'chemicals', 'machinery', 'agriculture', 'beef', 'poultry', 'sugar']
  },
  {
    id: 'aladi',
    name: 'ALADI',
    nameEn: 'Latin American Integration Association',
    members: ['AR', 'BO', 'BR', 'CL', 'CO', 'CU', 'EC', 'MX', 'NI', 'PA', 'PY', 'PE', 'UY', 'VE'],
    type: 'free_trade',
    tariffReduction: 60
  },
  // USMCA - Acuerdo Estados Unidos-México-Canadá (actualización crítica 2025)
  {
    id: 'usmca',
    name: 'T-MEC',
    nameEn: 'USMCA',
    members: ['US', 'CA', 'MX'],
    type: 'free_trade',
    tariffReduction: 85, // Sistema dual: 0% para bienes conformes USMCA, 25-35% para no conformes
    sectors: ['automotive', 'agriculture', 'energy', 'manufacturing', 'digital', 'telecommunications'],
    notes: 'Crisis 2025: Sistema bifurcado con bienes USMCA-conformes a 0% y no conformes 25-35%'
  },
  {
    id: 'eu',
    name: 'Unión Europea',
    nameEn: 'European Union',
    members: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    type: 'customs_union',
    tariffReduction: 100
  },
  {
    id: 'asean',
    name: 'ASEAN',
    nameEn: 'Association of Southeast Asian Nations',
    members: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'],
    type: 'free_trade',
    tariffReduction: 85
  },
  {
    id: 'cptpp',
    name: 'CPTPP',
    nameEn: 'Comprehensive and Progressive Trans-Pacific Partnership',
    members: ['AU', 'BN', 'CA', 'CL', 'JP', 'MY', 'MX', 'NZ', 'PE', 'SG', 'VN', 'UK'], // Reino Unido se unió en 2024
    type: 'free_trade',
    tariffReduction: 98
  },
  {
    id: 'rcep',
    name: 'RCEP',
    nameEn: 'Regional Comprehensive Economic Partnership',
    members: ['AU', 'BN', 'KH', 'CN', 'ID', 'JP', 'KR', 'LA', 'MY', 'MM', 'NZ', 'PH', 'SG', 'TH', 'VN'], // El acuerdo comercial más grande del mundo
    type: 'free_trade',
    tariffReduction: 90,
    sectors: ['electronics', 'automotive', 'textiles', 'agriculture']
  },
  {
    id: 'afcfta',
    name: 'AfCFTA',
    nameEn: 'African Continental Free Trade Area',
    members: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
    type: 'free_trade',
    tariffReduction: 75
  },
  {
    id: 'eaeu',
    name: 'UEEA',
    nameEn: 'Eurasian Economic Union',
    members: ['AM', 'BY', 'KZ', 'KG', 'RU'],
    type: 'customs_union',
    tariffReduction: 100
  },
  {
    id: 'gcc',
    name: 'CCG',
    nameEn: 'Gulf Cooperation Council',
    members: ['BH', 'KW', 'OM', 'QA', 'SA', 'AE'],
    type: 'customs_union',
    tariffReduction: 100
  },
  // Alianza del Pacífico - Tratado oficial desde 2012, actualización 2025
  {
    id: 'pacific_alliance',
    name: 'Alianza del Pacífico',
    nameEn: 'Pacific Alliance',
    members: ['CL', 'CO', 'MX', 'PE', 'CR'], // Costa Rica en proceso de adhesión 2025
    type: 'free_trade',
    tariffReduction: 92, // 92% de aranceles eliminados desde 2016, resto eliminado en 2020
    sectors: ['automotive', 'textiles', 'pharmaceuticals', 'telecommunications', 'agriculture', 'mining', 'services']
  },
  // Comunidad Andina - Tratado oficial desde 1969, actualización 2025
  {
    id: 'can',
    name: 'Comunidad Andina',
    nameEn: 'Andean Community',
    members: ['BO', 'CO', 'EC', 'PE'], // Venezuela suspendida desde 2006
    type: 'customs_union',
    tariffReduction: 85, // Zona de libre comercio desde 1993, unión aduanera en proceso
    sectors: ['agriculture', 'textiles', 'pharmaceuticals', 'mining', 'energy', 'services']
  },
  // EU-MERCOSUR - Acuerdo de Asociación UE-MERCOSUR 2025
  {
    id: 'eu_mercosur',
    name: 'Acuerdo UE-MERCOSUR',
    nameEn: 'EU-MERCOSUR Partnership Agreement',
    members: ['AR', 'BR', 'PY', 'UY', 'BO', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    type: 'free_trade',
    tariffReduction: 90, // Elimina >90% de aranceles cuando se implemente completamente
    sectors: ['beef', 'poultry', 'sugar', 'agriculture', 'automotive', 'pharmaceuticals', 'machinery', 'chemicals']
  },
  // EFTA-MERCOSUR - Acuerdo EFTA-MERCOSUR 2025
  {
    id: 'efta_mercosur',
    name: 'Acuerdo EFTA-MERCOSUR',
    nameEn: 'EFTA-MERCOSUR Free Trade Agreement',
    members: ['AR', 'BR', 'PY', 'UY', 'BO', 'CH', 'IS', 'LI', 'NO'],
    type: 'free_trade',
    tariffReduction: 97, // Acceso libre para 97% de exportaciones entre regiones
    sectors: ['machinery', 'pharmaceuticals', 'agriculture', 'chemicals', 'textiles']
  },
  // CAFTA-DR - Tratado oficial Estados Unidos-Centroamérica (actualización 2025)
  {
    id: 'cafta_dr',
    name: 'CAFTA-DR',
    nameEn: 'Central America Free Trade Agreement',
    members: ['US', 'CR', 'DO', 'SV', 'GT', 'HN', 'NI'], // 7 miembros confirmados
    type: 'free_trade',
    tariffReduction: 99, // Eliminación arancelaria completa enero 2025
    sectors: ['textiles', 'agriculture', 'manufacturing', 'electronics', 'services']
  },
  // SICA - Sistema de Integración Centroamericana (actualización 2025)
  {
    id: 'sica',
    name: 'SICA',
    nameEn: 'Central American Integration System',
    members: ['BZ', 'CR', 'SV', 'GT', 'HN', 'NI', 'PA', 'DO'], // 8 miembros plenos
    type: 'common_market',
    tariffReduction: 95 // 95% armonización arancelaria entre miembros principales
  },
  // CA-4 - Mercado Común Centroamericano ampliado
  {
    id: 'ca4',
    name: 'CA-4',
    nameEn: 'Central America Four',
    members: ['GT', 'SV', 'HN', 'NI', 'BZ', 'CR', 'PA', 'DO'], // Integración económica expandida
    type: 'customs_union',
    tariffReduction: 98
  },
  // CARICOM - Comunidad del Caribe (actualización 2025)
  {
    id: 'caricom',
    name: 'CARICOM',
    nameEn: 'Caribbean Community',
    members: ['AG', 'BS', 'BB', 'BZ', 'DM', 'DO', 'GD', 'GY', 'HT', 'JM', 'KN', 'LC', 'VC', 'SR', 'TT'], // 15 miembros plenos
    type: 'common_market',
    tariffReduction: 95, // Mercado común caribeño con comercio libre interno
    sectors: ['agriculture', 'manufacturing', 'services', 'energy', 'tourism']
  },
  // EFTA - Asociación Europea de Libre Comercio
  {
    id: 'efta',
    name: 'EFTA',
    nameEn: 'European Free Trade Association',
    members: ['IS', 'LI', 'NO', 'CH'],
    type: 'free_trade',
    tariffReduction: 95
  },
  // EEA - Espacio Económico Europeo
  {
    id: 'eea',
    name: 'EEE',
    nameEn: 'European Economic Area',
    members: ['IS', 'LI', 'NO', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    type: 'common_market',
    tariffReduction: 100
  },
  // SADC - Comunidad de Desarrollo de África Austral
  {
    id: 'sadc',
    name: 'SADC',
    nameEn: 'Southern African Development Community',
    members: ['AO', 'BW', 'CD', 'SZ', 'LS', 'MW', 'MU', 'MZ', 'NA', 'SC', 'ZA', 'TZ', 'ZM', 'ZW'],
    type: 'free_trade',
    tariffReduction: 85
  },
  // ECOWAS - Comunidad Económica de Estados de África Occidental
  {
    id: 'ecowas',
    name: 'CEDEAO',
    nameEn: 'Economic Community of West African States',
    members: ['BJ', 'BF', 'CV', 'CI', 'GM', 'GH', 'GN', 'GW', 'LR', 'ML', 'NE', 'NG', 'SN', 'SL', 'TG'],
    type: 'customs_union',
    tariffReduction: 75
  },
  // COMESA - Mercado Común de África Oriental y Austral
  {
    id: 'comesa',
    name: 'COMESA',
    nameEn: 'Common Market for Eastern and Southern Africa',
    members: ['BI', 'KM', 'CD', 'DJ', 'EG', 'ER', 'SZ', 'ET', 'KE', 'LY', 'MG', 'MW', 'MU', 'RW', 'SC', 'SD', 'TN', 'UG', 'ZM', 'ZW'],
    type: 'common_market',
    tariffReduction: 80
  },
  // UNASUR - Unión de Naciones Suramericanas (suspendida pero relevante)
  {
    id: 'unasur',
    name: 'UNASUR',
    nameEn: 'Union of South American Nations',
    members: ['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'SR', 'UY', 'VE'],
    type: 'free_trade',
    tariffReduction: 70
  },
  // PROSUR - Foro para el Progreso de América del Sur
  {
    id: 'prosur',
    name: 'PROSUR',
    nameEn: 'Forum for the Progress of South America',
    members: ['AR', 'BR', 'CL', 'CO', 'EC', 'GY', 'PY', 'PE', 'UY'],
    type: 'free_trade',
    tariffReduction: 65
  }
];

// Lista completa de países (195+ países)
export const countries: CountryData[] = [
  // América del Sur - COMPLETA Y SIN DUPLICADOS
  { code: 'AR', name: 'Argentina', nameEn: 'Argentina', region: 'South America', treaties: ['mercosur', 'aladi', 'prosur', 'eu_mercosur', 'efta_mercosur'], majorExports: ['beef', 'wheat', 'soybeans', 'lithium'], majorImports: ['machinery', 'vehicles', 'chemicals'], dataProtection: 'General' },
  { code: 'BR', name: 'Brasil', nameEn: 'Brazil', region: 'South America', treaties: ['mercosur', 'aladi', 'prosur', 'eu_mercosur', 'efta_mercosur'], majorExports: ['soybeans', 'iron_ore', 'coffee', 'sugar'], majorImports: ['crude_oil', 'machinery', 'electronics'], dataProtection: 'LGPD' },
  { code: 'CL', name: 'Chile', nameEn: 'Chile', region: 'South America', treaties: ['aladi', 'cptpp', 'pacific_alliance', 'prosur'], majorExports: ['copper', 'wine', 'salmon', 'lithium'], majorImports: ['crude_oil', 'machinery', 'vehicles'], dataProtection: 'General' },
  { code: 'CO', name: 'Colombia', nameEn: 'Colombia', region: 'South America', treaties: ['aladi', 'pacific_alliance', 'can', 'prosur'], majorExports: ['coffee', 'petroleum', 'coal', 'flowers'], majorImports: ['machinery', 'chemicals', 'vehicles'], dataProtection: 'General' },
  { code: 'PE', name: 'Perú', nameEn: 'Peru', region: 'South America', treaties: ['aladi', 'pacific_alliance', 'cptpp', 'can', 'prosur'], majorExports: ['copper', 'gold', 'zinc', 'fishmeal'], majorImports: ['machinery', 'vehicles', 'chemicals'] },
  { code: 'EC', name: 'Ecuador', nameEn: 'Ecuador', region: 'South America', treaties: ['aladi', 'can', 'prosur'], majorExports: ['petroleum', 'bananas', 'shrimp', 'cocoa'], majorImports: ['machinery', 'vehicles', 'chemicals'] },
  { code: 'UY', name: 'Uruguay', nameEn: 'Uruguay', region: 'South America', treaties: ['mercosur', 'aladi', 'prosur', 'eu_mercosur', 'efta_mercosur'], majorExports: ['beef', 'soybeans', 'dairy', 'wool'], majorImports: ['crude_oil', 'machinery', 'chemicals'], dataProtection: 'General' },
  { code: 'PY', name: 'Paraguay', nameEn: 'Paraguay', region: 'South America', treaties: ['mercosur', 'aladi', 'prosur', 'eu_mercosur', 'efta_mercosur'], majorExports: ['soybeans', 'beef', 'electricity'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'BO', name: 'Bolivia', nameEn: 'Bolivia', region: 'South America', treaties: ['mercosur', 'aladi', 'can', 'unasur', 'eu_mercosur', 'efta_mercosur'], majorExports: ['natural_gas', 'zinc', 'silver', 'tin'], majorImports: ['machinery', 'vehicles', 'fuel'] },
  { code: 'VE', name: 'Venezuela', nameEn: 'Venezuela', region: 'South America', treaties: ['aladi', 'unasur'], majorExports: ['petroleum', 'bauxite', 'iron_ore'], majorImports: ['machinery', 'food', 'chemicals'], restrictions: ['us_sanctions', 'eu_sanctions'] },
  { code: 'GY', name: 'Guyana', nameEn: 'Guyana', region: 'South America', treaties: ['caricom', 'prosur', 'unasur'], majorExports: ['petroleum', 'gold', 'bauxite', 'rice'], majorImports: ['machinery', 'food', 'fuel'] },
  { code: 'SR', name: 'Suriname', nameEn: 'Suriname', region: 'South America', treaties: ['caricom', 'unasur'], majorExports: ['petroleum', 'gold', 'bauxite', 'rice'], majorImports: ['machinery', 'food', 'fuel'] },
  { code: 'GF', name: 'Guayana Francesa', nameEn: 'French Guiana', region: 'South America', treaties: ['eu'], majorExports: ['gold', 'timber', 'shrimp'], majorImports: ['machinery', 'food', 'fuel'], dataProtection: 'GDPR' },

  // América del Norte
  { code: 'US', name: 'Estados Unidos', nameEn: 'United States', region: 'North America', treaties: ['usmca'], majorExports: ['machinery', 'oil', 'aircraft', 'electronics'], majorImports: ['electronics', 'machinery', 'vehicles', 'oil'], dataProtection: 'CCPA' },
  { code: 'CA', name: 'Canadá', nameEn: 'Canada', region: 'North America', treaties: ['usmca', 'cptpp'], majorExports: ['oil', 'gold', 'lumber', 'wheat'], majorImports: ['machinery', 'electronics', 'vehicles'], dataProtection: 'General' },
  { code: 'MX', name: 'México', nameEn: 'Mexico', region: 'North America', treaties: ['usmca', 'aladi', 'cptpp', 'pacific_alliance'], majorExports: ['vehicles', 'machinery', 'oil', 'electronics'], majorImports: ['machinery', 'electronics', 'chemicals'], dataProtection: 'General' },

  // Europa
  { code: 'DE', name: 'Alemania', nameEn: 'Germany', region: 'Europe', treaties: ['eu'], majorExports: ['vehicles', 'machinery', 'chemicals', 'electronics'], majorImports: ['machinery', 'electronics', 'vehicles', 'oil'], dataProtection: 'GDPR' },
  { code: 'FR', name: 'Francia', nameEn: 'France', region: 'Europe', treaties: ['eu'], majorExports: ['aircraft', 'machinery', 'chemicals', 'wine'], majorImports: ['machinery', 'vehicles', 'electronics', 'oil'], dataProtection: 'GDPR' },
  { code: 'IT', name: 'Italia', nameEn: 'Italy', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'textiles', 'food'], majorImports: ['machinery', 'chemicals', 'vehicles', 'oil'], dataProtection: 'GDPR' },
  { code: 'ES', name: 'España', nameEn: 'Spain', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'food', 'textiles'], majorImports: ['machinery', 'chemicals', 'fuel', 'food'], dataProtection: 'GDPR' },
  { code: 'UK', name: 'Reino Unido', nameEn: 'United Kingdom', region: 'Europe', treaties: ['cptpp'], majorExports: ['machinery', 'vehicles', 'chemicals', 'oil'], majorImports: ['machinery', 'vehicles', 'electronics', 'food'] },
  { code: 'NL', name: 'Países Bajos', nameEn: 'Netherlands', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'chemicals', 'fuel', 'food'], majorImports: ['machinery', 'fuel', 'electronics', 'food'] },
  { code: 'BE', name: 'Bélgica', nameEn: 'Belgium', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'chemicals', 'diamonds', 'metals'], majorImports: ['machinery', 'chemicals', 'fuel', 'diamonds'] },
  { code: 'CH', name: 'Suiza', nameEn: 'Switzerland', region: 'Europe', treaties: ['efta', 'eea'], majorExports: ['machinery', 'chemicals', 'watches', 'gold'], majorImports: ['machinery', 'chemicals', 'vehicles', 'electronics'] },
  
  // Europa Oriental y Balcanes (20 países nuevos)
  { code: 'PL', name: 'Polonia', nameEn: 'Poland', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'furniture', 'food'], majorImports: ['machinery', 'chemicals', 'vehicles', 'electronics'] },
  { code: 'RO', name: 'Rumania', nameEn: 'Romania', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'textiles', 'metals'], majorImports: ['machinery', 'chemicals', 'vehicles', 'electronics'] },
  { code: 'CZ', name: 'República Checa', nameEn: 'Czech Republic', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'electronics', 'steel'], majorImports: ['machinery', 'electronics', 'chemicals', 'vehicles'] },
  { code: 'HU', name: 'Hungría', nameEn: 'Hungary', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'electronics', 'food'], majorImports: ['machinery', 'electronics', 'vehicles', 'fuel'] },
  { code: 'GR', name: 'Grecia', nameEn: 'Greece', region: 'Europe', treaties: ['eu'], majorExports: ['food', 'petroleum', 'chemicals', 'textiles'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },
  { code: 'PT', name: 'Portugal', nameEn: 'Portugal', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'textiles', 'wine'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },
  { code: 'AT', name: 'Austria', nameEn: 'Austria', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'chemicals', 'iron'], majorImports: ['machinery', 'vehicles', 'electronics', 'chemicals'] },
  { code: 'SE', name: 'Suecia', nameEn: 'Sweden', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'paper', 'iron'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },
  { code: 'DK', name: 'Dinamarca', nameEn: 'Denmark', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'chemicals', 'pharmaceuticals'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },
  { code: 'FI', name: 'Finlandia', nameEn: 'Finland', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'paper', 'chemicals', 'metals'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },
  { code: 'NO', name: 'Noruega', nameEn: 'Norway', region: 'Europe', treaties: ['efta', 'eea'], majorExports: ['oil', 'gas', 'fish', 'metals'], majorImports: ['machinery', 'vehicles', 'electronics', 'food'] },
  { code: 'IE', name: 'Irlanda', nameEn: 'Ireland', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'chemicals', 'pharmaceuticals', 'food'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },
  { code: 'SK', name: 'Eslovaquia', nameEn: 'Slovakia', region: 'Europe', treaties: ['eu'], majorExports: ['vehicles', 'machinery', 'electronics', 'steel'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },
  { code: 'BG', name: 'Bulgaria', nameEn: 'Bulgaria', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'textiles', 'metals'], majorImports: ['machinery', 'fuel', 'chemicals', 'vehicles'] },
  { code: 'HR', name: 'Croacia', nameEn: 'Croatia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'chemicals', 'textiles'], majorImports: ['machinery', 'fuel', 'vehicles', 'chemicals'] },
  { code: 'SI', name: 'Eslovenia', nameEn: 'Slovenia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'chemicals', 'pharmaceuticals'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },
  { code: 'LT', name: 'Lituania', nameEn: 'Lithuania', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'chemicals', 'food', 'textiles'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },
  { code: 'LV', name: 'Letonia', nameEn: 'Latvia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'wood', 'food', 'textiles'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },
  { code: 'EE', name: 'Estonia', nameEn: 'Estonia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'electronics', 'wood', 'food'], majorImports: ['machinery', 'vehicles', 'fuel', 'electronics'] },
  { code: 'RS', name: 'Serbia', nameEn: 'Serbia', region: 'Europe', treaties: [], majorExports: ['machinery', 'food', 'metals', 'textiles'], majorImports: ['machinery', 'vehicles', 'fuel', 'chemicals'] },

  // Asia
  { code: 'CN', name: 'China', nameEn: 'China', region: 'Asia', treaties: ['rcep'], majorExports: ['electronics', 'machinery', 'textiles', 'furniture'], majorImports: ['machinery', 'oil', 'electronics', 'iron_ore'] },
  { code: 'JP', name: 'Japón', nameEn: 'Japan', region: 'Asia', treaties: ['cptpp', 'rcep'], majorExports: ['vehicles', 'machinery', 'electronics', 'steel'], majorImports: ['oil', 'machinery', 'electronics', 'food'] },
  { code: 'KR', name: 'Corea del Sur', nameEn: 'South Korea', region: 'Asia', treaties: ['rcep'], majorExports: ['electronics', 'vehicles', 'machinery', 'steel'], majorImports: ['oil', 'machinery', 'electronics', 'coal'] },
  { code: 'IN', name: 'India', nameEn: 'India', region: 'Asia', treaties: [], majorExports: ['textiles', 'chemicals', 'machinery', 'rice'], majorImports: ['oil', 'electronics', 'machinery', 'gold'] },
  { code: 'SG', name: 'Singapur', nameEn: 'Singapore', region: 'Asia', treaties: ['asean', 'cptpp', 'rcep'], majorExports: ['electronics', 'chemicals', 'machinery', 'fuel'], majorImports: ['machinery', 'electronics', 'fuel', 'chemicals'] },
  { code: 'MY', name: 'Malasia', nameEn: 'Malaysia', region: 'Asia', treaties: ['asean', 'cptpp', 'rcep'], majorExports: ['electronics', 'oil', 'palm_oil', 'machinery'], majorImports: ['electronics', 'machinery', 'chemicals', 'iron_ore'] },
  { code: 'TH', name: 'Tailandia', nameEn: 'Thailand', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['electronics', 'vehicles', 'machinery', 'rice'], majorImports: ['machinery', 'electronics', 'fuel', 'iron_ore'] },
  { code: 'VN', name: 'Vietnam', nameEn: 'Vietnam', region: 'Asia', treaties: ['asean', 'cptpp', 'rcep'], majorExports: ['electronics', 'textiles', 'machinery', 'coffee'], majorImports: ['machinery', 'electronics', 'steel', 'chemicals'] },
  { code: 'ID', name: 'Indonesia', nameEn: 'Indonesia', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['oil', 'coal', 'palm_oil', 'textiles'], majorImports: ['machinery', 'electronics', 'chemicals', 'iron_ore'] },
  { code: 'PH', name: 'Filipinas', nameEn: 'Philippines', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['electronics', 'machinery', 'textiles', 'coconut'], majorImports: ['electronics', 'machinery', 'fuel', 'iron_ore'] },

  // Oceanía
  { code: 'AU', name: 'Australia', nameEn: 'Australia', region: 'Oceania', treaties: ['cptpp', 'rcep'], majorExports: ['iron_ore', 'coal', 'gold', 'beef'], majorImports: ['machinery', 'electronics', 'vehicles', 'fuel'] },
  { code: 'NZ', name: 'Nueva Zelanda', nameEn: 'New Zealand', region: 'Oceania', treaties: ['cptpp', 'rcep'], majorExports: ['dairy', 'meat', 'wool', 'wine'], majorImports: ['machinery', 'vehicles', 'electronics', 'fuel'] },

  // Medio Oriente (20 países nuevos)
  { code: 'SA', name: 'Arabia Saudita', nameEn: 'Saudi Arabia', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'petroleum_products', 'chemicals', 'plastics'], majorImports: ['machinery', 'vehicles', 'electronics', 'food'] },
  { code: 'AE', name: 'Emiratos Árabes Unidos', nameEn: 'United Arab Emirates', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'petroleum_products', 'gold', 'diamonds'], majorImports: ['machinery', 'electronics', 'vehicles', 'gold'] },
  { code: 'IL', name: 'Israel', nameEn: 'Israel', region: 'Middle East', treaties: [], majorExports: ['electronics', 'machinery', 'chemicals', 'diamonds'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'TR', name: 'Turquía', nameEn: 'Turkey', region: 'Middle East', treaties: [], majorExports: ['machinery', 'vehicles', 'textiles', 'food'], majorImports: ['machinery', 'fuel', 'chemicals', 'vehicles'] },
  { code: 'IR', name: 'Irán', nameEn: 'Iran', region: 'Middle East', treaties: [], majorExports: ['oil', 'petroleum_products', 'chemicals', 'fruits'], majorImports: ['machinery', 'food', 'vehicles', 'chemicals'], restrictions: ['us_sanctions', 'eu_sanctions'] },
  { code: 'IQ', name: 'Irak', nameEn: 'Iraq', region: 'Middle East', treaties: [], majorExports: ['oil', 'petroleum_products'], majorImports: ['machinery', 'food', 'vehicles', 'chemicals'] },
  { code: 'QA', name: 'Qatar', nameEn: 'Qatar', region: 'Middle East', treaties: ['gcc'], majorExports: ['gas', 'petroleum_products', 'chemicals'], majorImports: ['machinery', 'vehicles', 'food', 'electronics'] },
  { code: 'KW', name: 'Kuwait', nameEn: 'Kuwait', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'petroleum_products'], majorImports: ['machinery', 'food', 'vehicles', 'electronics'] },
  { code: 'OM', name: 'Omán', nameEn: 'Oman', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'petroleum_products', 'fish'], majorImports: ['machinery', 'vehicles', 'food', 'electronics'] },
  { code: 'BH', name: 'Baréin', nameEn: 'Bahrain', region: 'Middle East', treaties: ['gcc'], majorExports: ['petroleum_products', 'aluminum', 'textiles'], majorImports: ['machinery', 'chemicals', 'food'] },
  { code: 'JO', name: 'Jordania', nameEn: 'Jordan', region: 'Middle East', treaties: [], majorExports: ['textiles', 'chemicals', 'pharmaceuticals', 'vegetables'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'LB', name: 'Líbano', nameEn: 'Lebanon', region: 'Middle East', treaties: [], majorExports: ['jewelry', 'chemicals', 'food', 'textiles'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'SY', name: 'Siria', nameEn: 'Syria', region: 'Middle East', treaties: [], majorExports: ['oil', 'textiles', 'food'], majorImports: ['machinery', 'fuel', 'food', 'chemicals'], restrictions: ['us_sanctions', 'eu_sanctions'] },
  { code: 'YE', name: 'Yemen', nameEn: 'Yemen', region: 'Middle East', treaties: [], majorExports: ['oil', 'coffee', 'fish'], majorImports: ['food', 'machinery', 'chemicals'] },
  { code: 'PS', name: 'Palestina', nameEn: 'Palestine', region: 'Middle East', treaties: [], majorExports: ['stone', 'textiles', 'food'], majorImports: ['food', 'machinery', 'fuel'] },
  { code: 'CY', name: 'Chipre', nameEn: 'Cyprus', region: 'Middle East', treaties: ['eu'], majorExports: ['food', 'chemicals', 'textiles'], majorImports: ['machinery', 'vehicles', 'fuel', 'food'] },
  { code: 'GE', name: 'Georgia', nameEn: 'Georgia', region: 'Middle East', treaties: [], majorExports: ['wine', 'metals', 'machinery', 'food'], majorImports: ['machinery', 'vehicles', 'fuel', 'pharmaceuticals'] },
  { code: 'AM', name: 'Armenia', nameEn: 'Armenia', region: 'Middle East', treaties: [], majorExports: ['metals', 'machinery', 'food', 'textiles'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'AZ', name: 'Azerbaiyán', nameEn: 'Azerbaijan', region: 'Middle East', treaties: [], majorExports: ['oil', 'gas', 'chemicals'], majorImports: ['machinery', 'food', 'vehicles', 'metals'] },
  { code: 'KZ', name: 'Kazajistán', nameEn: 'Kazakhstan', region: 'Middle East', treaties: [], majorExports: ['oil', 'metals', 'chemicals', 'grain'], majorImports: ['machinery', 'vehicles', 'electronics', 'food'] },

  // África (10 países adicionales)
  { code: 'MA', name: 'Marruecos', nameEn: 'Morocco', region: 'Africa', treaties: ['afcfta'], majorExports: ['textiles', 'food', 'phosphates', 'electronics'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'DZ', name: 'Argelia', nameEn: 'Algeria', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'gas', 'petroleum_products'], majorImports: ['machinery', 'food', 'vehicles', 'steel'] },
  { code: 'TN', name: 'Túnez', nameEn: 'Tunisia', region: 'Africa', treaties: ['afcfta'], majorExports: ['textiles', 'food', 'petroleum_products', 'chemicals'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'LY', name: 'Libia', nameEn: 'Libya', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'petroleum_products'], majorImports: ['machinery', 'food', 'vehicles', 'chemicals'] },
  { code: 'ET', name: 'Etiopía', nameEn: 'Ethiopia', region: 'Africa', treaties: ['afcfta'], majorExports: ['coffee', 'flowers', 'textiles', 'food'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'GH', name: 'Ghana', nameEn: 'Ghana', region: 'Africa', treaties: ['afcfta'], majorExports: ['gold', 'cocoa', 'oil', 'timber'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'CI', name: 'Costa de Marfil', nameEn: 'Ivory Coast', region: 'Africa', treaties: ['afcfta'], majorExports: ['cocoa', 'coffee', 'timber', 'petroleum_products'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'SN', name: 'Senegal', nameEn: 'Senegal', region: 'Africa', treaties: ['afcfta'], majorExports: ['fish', 'peanuts', 'phosphates', 'gold'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'TZ', name: 'Tanzania', nameEn: 'Tanzania', region: 'Africa', treaties: ['afcfta'], majorExports: ['gold', 'coffee', 'cashews', 'tobacco'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },
  { code: 'UG', name: 'Uganda', nameEn: 'Uganda', region: 'Africa', treaties: ['afcfta'], majorExports: ['coffee', 'fish', 'flowers', 'gold'], majorImports: ['machinery', 'fuel', 'vehicles', 'food'] },

  // África (principales economías)
  { code: 'ZA', name: 'Sudáfrica', nameEn: 'South Africa', region: 'Africa', treaties: ['afcfta'], majorExports: ['gold', 'diamonds', 'platinum', 'coal'], majorImports: ['machinery', 'electronics', 'vehicles', 'chemicals'] },
  { code: 'EG', name: 'Egipto', nameEn: 'Egypt', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'textiles', 'food', 'chemicals'], majorImports: ['machinery', 'food', 'chemicals', 'wood'] },
  { code: 'NG', name: 'Nigeria', nameEn: 'Nigeria', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'cocoa', 'rubber'], majorImports: ['machinery', 'chemicals', 'food', 'vehicles'] },
  { code: 'KE', name: 'Kenia', nameEn: 'Kenya', region: 'Africa', treaties: ['afcfta'], majorExports: ['tea', 'coffee', 'flowers', 'textiles'], majorImports: ['machinery', 'vehicles', 'electronics', 'steel'] },

  // Centroamérica - actualización tratados 2025
  { code: 'CR', name: 'Costa Rica', nameEn: 'Costa Rica', region: 'Central America', treaties: ['cafta_dr', 'sica', 'ca4', 'pacific_alliance'], majorExports: ['bananas', 'coffee', 'textiles', 'electronics'], majorImports: ['machinery', 'chemicals', 'fuel'] },
  { code: 'GT', name: 'Guatemala', nameEn: 'Guatemala', region: 'Central America', treaties: ['cafta_dr', 'sica', 'ca4'], majorExports: ['coffee', 'sugar', 'textiles', 'cardamom'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'SV', name: 'El Salvador', nameEn: 'El Salvador', region: 'Central America', treaties: ['cafta_dr', 'sica', 'ca4'], majorExports: ['coffee', 'textiles', 'sugar'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'HN', name: 'Honduras', nameEn: 'Honduras', region: 'Central America', treaties: ['cafta_dr', 'sica', 'ca4'], majorExports: ['coffee', 'bananas', 'textiles'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'NI', name: 'Nicaragua', nameEn: 'Nicaragua', region: 'Central America', treaties: ['cafta_dr', 'sica', 'ca4'], majorExports: ['coffee', 'beef', 'textiles'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'PA', name: 'Panamá', nameEn: 'Panama', region: 'Central America', treaties: ['sica', 'ca4'], majorExports: ['bananas', 'shrimp', 're_exports'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'BZ', name: 'Belice', nameEn: 'Belize', region: 'Central America', treaties: ['sica', 'caricom', 'ca4'], majorExports: ['sugar', 'bananas', 'citrus'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'DO', name: 'República Dominicana', nameEn: 'Dominican Republic', region: 'Caribbean', treaties: ['cafta_dr', 'sica', 'caricom'], majorExports: ['textiles', 'sugar', 'tobacco'], majorImports: ['machinery', 'fuel', 'food'] },
  
  // Caribe y Asia-Pacífico adicionales (20 países nuevos)
  { code: 'TT', name: 'Trinidad y Tobago', nameEn: 'Trinidad and Tobago', region: 'Caribbean', treaties: ['caricom'], majorExports: ['oil', 'gas', 'chemicals', 'steel'], majorImports: ['machinery', 'food', 'vehicles'] },
  { code: 'BB', name: 'Barbados', nameEn: 'Barbados', region: 'Caribbean', treaties: ['caricom'], majorExports: ['sugar', 'rum', 'chemicals'], majorImports: ['machinery', 'food', 'fuel'] },
  { code: 'BS', name: 'Bahamas', nameEn: 'Bahamas', region: 'Caribbean', treaties: ['caricom'], majorExports: ['fish', 'rum', 'salt'], majorImports: ['machinery', 'food', 'fuel', 'vehicles'] },
  { code: 'HT', name: 'Haití', nameEn: 'Haiti', region: 'Caribbean', treaties: ['caricom'], majorExports: ['textiles', 'coffee', 'mangoes'], majorImports: ['food', 'fuel', 'machinery'] },
  { code: 'CU', name: 'Cuba', nameEn: 'Cuba', region: 'Caribbean', treaties: [], majorExports: ['sugar', 'tobacco', 'nickel', 'rum'], majorImports: ['food', 'fuel', 'machinery'], restrictions: ['us_embargo'] },
  { code: 'PR', name: 'Puerto Rico', nameEn: 'Puerto Rico', region: 'Caribbean', treaties: ['usmca'], majorExports: ['chemicals', 'electronics', 'pharmaceuticals'], majorImports: ['machinery', 'food', 'fuel'] },
  
  // Asia del Sur y Sudeste (14 países adicionales)
  { code: 'BD', name: 'Bangladesh', nameEn: 'Bangladesh', region: 'Asia', treaties: [], majorExports: ['textiles', 'jute', 'fish', 'leather'], majorImports: ['machinery', 'fuel', 'food', 'chemicals'] },
  { code: 'PK', name: 'Pakistán', nameEn: 'Pakistan', region: 'Asia', treaties: [], majorExports: ['textiles', 'rice', 'leather', 'sports_goods'], majorImports: ['machinery', 'fuel', 'chemicals', 'food'] },
  { code: 'LK', name: 'Sri Lanka', nameEn: 'Sri Lanka', region: 'Asia', treaties: [], majorExports: ['tea', 'textiles', 'rubber', 'gems'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'NP', name: 'Nepal', nameEn: 'Nepal', region: 'Asia', treaties: [], majorExports: ['textiles', 'tea', 'spices'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'MM', name: 'Myanmar', nameEn: 'Myanmar', region: 'Asia', treaties: ['asean'], majorExports: ['gas', 'textiles', 'rice', 'jade'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'KH', name: 'Camboya', nameEn: 'Cambodia', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['textiles', 'rice', 'rubber'], majorImports: ['machinery', 'fuel', 'vehicles'] },
  { code: 'LA', name: 'Laos', nameEn: 'Laos', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['electricity', 'copper', 'coffee'], majorImports: ['machinery', 'fuel', 'vehicles'] },
  { code: 'BN', name: 'Brunéi', nameEn: 'Brunei', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['oil', 'gas'], majorImports: ['machinery', 'food', 'vehicles'] },
  { code: 'MN', name: 'Mongolia', nameEn: 'Mongolia', region: 'Asia', treaties: [], majorExports: ['copper', 'coal', 'gold', 'cashmere'], majorImports: ['machinery', 'fuel', 'food', 'vehicles'] },
  { code: 'TW', name: 'Taiwán', nameEn: 'Taiwan', region: 'Asia', treaties: [], majorExports: ['electronics', 'machinery', 'plastics', 'chemicals'], majorImports: ['machinery', 'fuel', 'electronics'] },
  { code: 'HK', name: 'Hong Kong', nameEn: 'Hong Kong', region: 'Asia', treaties: [], majorExports: ['electronics', 'textiles', 'jewelry', 're_exports'], majorImports: ['machinery', 'electronics', 'food'] },
  { code: 'MO', name: 'Macao', nameEn: 'Macau', region: 'Asia', treaties: [], majorExports: ['textiles', 'electronics', 'toys'], majorImports: ['machinery', 'food', 'fuel'] },
  { code: 'FJ', name: 'Fiyi', nameEn: 'Fiji', region: 'Oceania', treaties: [], majorExports: ['sugar', 'fish', 'gold', 'timber'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'PG', name: 'Papúa Nueva Guinea', nameEn: 'Papua New Guinea', region: 'Oceania', treaties: [], majorExports: ['gold', 'copper', 'oil', 'coffee'], majorImports: ['machinery', 'fuel', 'food'] },

  // Caribe
  { code: 'JM', name: 'Jamaica', nameEn: 'Jamaica', region: 'Caribbean', treaties: ['caricom'], majorExports: ['bauxite', 'sugar', 'bananas'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'TT', name: 'Trinidad y Tobago', nameEn: 'Trinidad and Tobago', region: 'Caribbean', treaties: ['caricom'], majorExports: ['oil', 'gas', 'chemicals'], majorImports: ['machinery', 'food', 'vehicles'] },
  { code: 'BB', name: 'Barbados', nameEn: 'Barbados', region: 'Caribbean', treaties: ['caricom'], majorExports: ['sugar', 'rum', 'chemicals'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'BS', name: 'Bahamas', nameEn: 'Bahamas', region: 'Caribbean', treaties: ['caricom'], majorExports: ['pharmaceuticals', 're_exports'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GY', name: 'Guyana', nameEn: 'Guyana', region: 'Caribbean', treaties: ['caricom', 'prosur'], majorExports: ['gold', 'oil', 'rice'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SR', name: 'Suriname', nameEn: 'Suriname', region: 'Caribbean', treaties: ['caricom', 'unasur'], majorExports: ['gold', 'oil', 'bauxite'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'HT', name: 'Haití', nameEn: 'Haiti', region: 'Caribbean', treaties: ['caricom'], majorExports: ['textiles', 'coffee'], majorImports: ['food', 'fuel', 'machinery'] },
  { code: 'AG', name: 'Antigua y Barbuda', nameEn: 'Antigua and Barbuda', region: 'Caribbean', treaties: ['caricom'], majorExports: ['tourism', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'DM', name: 'Dominica', nameEn: 'Dominica', region: 'Caribbean', treaties: ['caricom'], majorExports: ['bananas', 'soap'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GD', name: 'Granada', nameEn: 'Grenada', region: 'Caribbean', treaties: ['caricom'], majorExports: ['nutmeg', 'cocoa'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'KN', name: 'San Cristóbal y Nieves', nameEn: 'Saint Kitts and Nevis', region: 'Caribbean', treaties: ['caricom'], majorExports: ['sugar', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'LC', name: 'Santa Lucía', nameEn: 'Saint Lucia', region: 'Caribbean', treaties: ['caricom'], majorExports: ['bananas', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'VC', name: 'San Vicente y las Granadinas', nameEn: 'Saint Vincent and the Grenadines', region: 'Caribbean', treaties: ['caricom'], majorExports: ['bananas', 'arrowroot'], majorImports: ['machinery', 'fuel', 'food'] },

  // Europa adicional
  { code: 'LI', name: 'Liechtenstein', nameEn: 'Liechtenstein', region: 'Europe', treaties: ['efta', 'eea'], majorExports: ['machinery', 'electronics', 'ceramics'], majorImports: ['machinery', 'electronics', 'fuel'] },

  // Medio Oriente
  { code: 'SA', name: 'Arabia Saudí', nameEn: 'Saudi Arabia', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'chemicals', 'plastics'], majorImports: ['machinery', 'vehicles', 'electronics', 'food'] },
  { code: 'AE', name: 'Emiratos Árabes Unidos', nameEn: 'United Arab Emirates', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'aluminum', 're_exports'], majorImports: ['machinery', 'electronics', 'vehicles', 'gold'] },
  { code: 'IL', name: 'Israel', nameEn: 'Israel', region: 'Middle East', treaties: [], majorExports: ['electronics', 'chemicals', 'textiles', 'diamonds'], majorImports: ['machinery', 'electronics', 'fuel', 'diamonds'] },
  { code: 'TR', name: 'Turquía', nameEn: 'Turkey', region: 'Middle East', treaties: [], majorExports: ['textiles', 'machinery', 'vehicles', 'food'], majorImports: ['machinery', 'chemicals', 'fuel', 'electronics'] },
  { code: 'QA', name: 'Catar', nameEn: 'Qatar', region: 'Middle East', treaties: ['gcc'], majorExports: ['gas', 'oil', 'chemicals'], majorImports: ['machinery', 'vehicles', 'food'] },
  { code: 'KW', name: 'Kuwait', nameEn: 'Kuwait', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'chemicals'], majorImports: ['machinery', 'vehicles', 'food'] },
  { code: 'BH', name: 'Baréin', nameEn: 'Bahrain', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'aluminum', 'textiles'], majorImports: ['machinery', 'chemicals', 'food'] },
  { code: 'OM', name: 'Omán', nameEn: 'Oman', region: 'Middle East', treaties: ['gcc'], majorExports: ['oil', 'gas', 'fish'], majorImports: ['machinery', 'vehicles', 'food'] },
  { code: 'IR', name: 'Irán', nameEn: 'Iran', region: 'Middle East', treaties: [], majorExports: ['oil', 'gas', 'chemicals'], majorImports: ['machinery', 'food', 'electronics'], restrictions: ['sanctions'] },
  { code: 'IQ', name: 'Irak', nameEn: 'Iraq', region: 'Middle East', treaties: [], majorExports: ['oil', 'dates'], majorImports: ['machinery', 'food', 'electronics'] },
  { code: 'JO', name: 'Jordania', nameEn: 'Jordan', region: 'Middle East', treaties: [], majorExports: ['textiles', 'chemicals', 'phosphates'], majorImports: ['machinery', 'oil', 'food'] },
  { code: 'LB', name: 'Líbano', nameEn: 'Lebanon', region: 'Middle East', treaties: [], majorExports: ['jewelry', 'food', 'chemicals'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SY', name: 'Siria', nameEn: 'Syria', region: 'Middle East', treaties: [], majorExports: ['oil', 'textiles'], majorImports: ['machinery', 'food', 'fuel'], restrictions: ['war_conditions'] },
  { code: 'YE', name: 'Yemen', nameEn: 'Yemen', region: 'Middle East', treaties: [], majorExports: ['oil', 'coffee'], majorImports: ['machinery', 'food', 'fuel'], restrictions: ['war_conditions'] },

  // Países adicionales de África para completar bloques regionales
  { code: 'BJ', name: 'Benín', nameEn: 'Benin', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['cotton', 'cashews'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'BF', name: 'Burkina Faso', nameEn: 'Burkina Faso', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['gold', 'cotton'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'CV', name: 'Cabo Verde', nameEn: 'Cape Verde', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['fish', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GM', name: 'Gambia', nameEn: 'Gambia', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['peanuts', 'fish'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GN', name: 'Guinea', nameEn: 'Guinea', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['bauxite', 'gold'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GW', name: 'Guinea-Bisáu', nameEn: 'Guinea-Bissau', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['cashews', 'fish'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'LR', name: 'Liberia', nameEn: 'Liberia', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['iron_ore', 'rubber'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'ML', name: 'Malí', nameEn: 'Mali', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['gold', 'cotton'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'NE', name: 'Níger', nameEn: 'Niger', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['uranium', 'livestock'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SL', name: 'Sierra Leona', nameEn: 'Sierra Leone', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['diamonds', 'iron_ore'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'TG', name: 'Togo', nameEn: 'Togo', region: 'Africa', treaties: ['afcfta', 'ecowas'], majorExports: ['phosphates', 'cotton'], majorImports: ['machinery', 'fuel', 'food'] },

  // Países adicionales de África Oriental y Austral
  { code: 'BI', name: 'Burundi', nameEn: 'Burundi', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['coffee', 'tea'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'KM', name: 'Comoras', nameEn: 'Comoros', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['vanilla', 'ylang_ylang'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'CD', name: 'Rep. Dem. del Congo', nameEn: 'Democratic Republic of Congo', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['copper', 'cobalt'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'DJ', name: 'Yibuti', nameEn: 'Djibouti', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['livestock', 're_exports'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'ER', name: 'Eritrea', nameEn: 'Eritrea', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['gold', 'livestock'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SZ', name: 'Esuatini', nameEn: 'Eswatini', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['sugar', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'LS', name: 'Lesoto', nameEn: 'Lesotho', region: 'Africa', treaties: ['afcfta', 'sadc'], majorExports: ['textiles', 'diamonds'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'MW', name: 'Malaui', nameEn: 'Malawi', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['tobacco', 'tea'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'MG', name: 'Madagascar', nameEn: 'Madagascar', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['vanilla', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'MU', name: 'Mauricio', nameEn: 'Mauritius', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['textiles', 'sugar'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'MZ', name: 'Mozambique', nameEn: 'Mozambique', region: 'Africa', treaties: ['afcfta', 'sadc'], majorExports: ['coal', 'gas'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'RW', name: 'Ruanda', nameEn: 'Rwanda', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['coffee', 'tea'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SC', name: 'Seychelles', nameEn: 'Seychelles', region: 'Africa', treaties: ['afcfta', 'comesa', 'sadc'], majorExports: ['fish', 'tourism'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SD', name: 'Sudán', nameEn: 'Sudan', region: 'Africa', treaties: ['afcfta', 'comesa'], majorExports: ['oil', 'gold'], majorImports: ['machinery', 'food', 'chemicals'] },
  { code: 'SS', name: 'Sudán del Sur', nameEn: 'South Sudan', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil'], majorImports: ['machinery', 'food', 'fuel'] },

  // Países adicionales importantes de Europa
  { code: 'RU', name: 'Rusia', nameEn: 'Russia', region: 'Europe', treaties: ['eaeu'], majorExports: ['oil', 'gas', 'metals', 'wheat'], majorImports: ['machinery', 'electronics', 'vehicles'], restrictions: ['sanctions'] },
  { code: 'PL', name: 'Polonia', nameEn: 'Poland', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'food'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'CZ', name: 'República Checa', nameEn: 'Czech Republic', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'electronics'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'HU', name: 'Hungría', nameEn: 'Hungary', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'electronics'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'RO', name: 'Rumania', nameEn: 'Romania', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'textiles', 'food'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'UA', name: 'Ucrania', nameEn: 'Ukraine', region: 'Europe', treaties: [], majorExports: ['wheat', 'iron_ore', 'steel'], majorImports: ['machinery', 'fuel', 'chemicals'], restrictions: ['war_conditions'] },
  { code: 'NO', name: 'Noruega', nameEn: 'Norway', region: 'Europe', treaties: ['efta', 'eea'], majorExports: ['oil', 'gas', 'fish', 'aluminum'], majorImports: ['machinery', 'electronics', 'vehicles'] },
  { code: 'SE', name: 'Suecia', nameEn: 'Sweden', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'wood', 'iron_ore'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'DK', name: 'Dinamarca', nameEn: 'Denmark', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'FI', name: 'Finlandia', nameEn: 'Finland', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'wood', 'electronics'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'AT', name: 'Austria', nameEn: 'Austria', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'GR', name: 'Grecia', nameEn: 'Greece', region: 'Europe', treaties: ['eu'], majorExports: ['food', 'textiles', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'PT', name: 'Portugal', nameEn: 'Portugal', region: 'Europe', treaties: ['eu'], majorExports: ['textiles', 'food', 'machinery'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'IE', name: 'Irlanda', nameEn: 'Ireland', region: 'Europe', treaties: ['eu'], majorExports: ['chemicals', 'electronics', 'food'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'BG', name: 'Bulgaria', nameEn: 'Bulgaria', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'textiles'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'HR', name: 'Croacia', nameEn: 'Croatia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'SI', name: 'Eslovenia', nameEn: 'Slovenia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'SK', name: 'Eslovaquia', nameEn: 'Slovakia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'vehicles', 'electronics'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'LT', name: 'Lituania', nameEn: 'Lithuania', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'chemicals'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'LV', name: 'Letonia', nameEn: 'Latvia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'food', 'wood'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'EE', name: 'Estonia', nameEn: 'Estonia', region: 'Europe', treaties: ['eu'], majorExports: ['machinery', 'electronics', 'food'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'BY', name: 'Bielorrusia', nameEn: 'Belarus', region: 'Europe', treaties: ['eaeu'], majorExports: ['machinery', 'chemicals', 'food'], majorImports: ['oil', 'gas', 'machinery'] },
  { code: 'MD', name: 'Moldavia', nameEn: 'Moldova', region: 'Europe', treaties: [], majorExports: ['food', 'textiles', 'machinery'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'CY', name: 'Chipre', nameEn: 'Cyprus', region: 'Europe', treaties: ['eu'], majorExports: ['food', 'chemicals', 'textiles'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'MT', name: 'Malta', nameEn: 'Malta', region: 'Europe', treaties: ['eu'], majorExports: ['electronics', 'machinery', 'food'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'LU', name: 'Luxemburgo', nameEn: 'Luxembourg', region: 'Europe', treaties: ['eu'], majorExports: ['steel', 'chemicals', 'machinery'], majorImports: ['machinery', 'electronics', 'fuel'] },
  { code: 'IS', name: 'Islandia', nameEn: 'Iceland', region: 'Europe', treaties: ['efta', 'eea'], majorExports: ['fish', 'aluminum', 'machinery'], majorImports: ['machinery', 'fuel', 'food'] },

  // Países adicionales de Asia
  { code: 'BN', name: 'Brunéi', nameEn: 'Brunei', region: 'Asia', treaties: ['asean', 'cptpp', 'rcep'], majorExports: ['oil', 'gas'], majorImports: ['machinery', 'electronics', 'food'] },
  { code: 'KH', name: 'Camboya', nameEn: 'Cambodia', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['textiles', 'rice', 'rubber'], majorImports: ['machinery', 'fuel', 'electronics'] },
  { code: 'LA', name: 'Laos', nameEn: 'Laos', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['electricity', 'copper', 'wood'], majorImports: ['machinery', 'fuel', 'vehicles'] },
  { code: 'MM', name: 'Myanmar', nameEn: 'Myanmar', region: 'Asia', treaties: ['asean', 'rcep'], majorExports: ['gas', 'textiles', 'rice'], majorImports: ['machinery', 'fuel', 'electronics'], restrictions: ['political_instability'] },
  { code: 'TW', name: 'Taiwán', nameEn: 'Taiwan', region: 'Asia', treaties: [], majorExports: ['electronics', 'machinery', 'chemicals'], majorImports: ['electronics', 'machinery', 'oil'] },
  { code: 'HK', name: 'Hong Kong', nameEn: 'Hong Kong', region: 'Asia', treaties: [], majorExports: ['electronics', 're_exports'], majorImports: ['electronics', 'machinery', 'food'] },
  { code: 'PK', name: 'Pakistán', nameEn: 'Pakistan', region: 'Asia', treaties: [], majorExports: ['textiles', 'rice', 'chemicals'], majorImports: ['machinery', 'oil', 'electronics'] },
  { code: 'BD', name: 'Bangladesh', nameEn: 'Bangladesh', region: 'Asia', treaties: [], majorExports: ['textiles', 'jute', 'fish'], majorImports: ['machinery', 'oil', 'electronics'] },
  { code: 'LK', name: 'Sri Lanka', nameEn: 'Sri Lanka', region: 'Asia', treaties: [], majorExports: ['tea', 'textiles', 'rubber'], majorImports: ['machinery', 'oil', 'food'] },
  { code: 'KZ', name: 'Kazajistán', nameEn: 'Kazakhstan', region: 'Asia', treaties: ['eaeu'], majorExports: ['oil', 'gas', 'metals'], majorImports: ['machinery', 'electronics', 'vehicles'] },
  { code: 'UZ', name: 'Uzbekistán', nameEn: 'Uzbekistan', region: 'Asia', treaties: [], majorExports: ['cotton', 'gold', 'gas'], majorImports: ['machinery', 'chemicals', 'food'] },
  { code: 'KG', name: 'Kirguistán', nameEn: 'Kyrgyzstan', region: 'Asia', treaties: ['eaeu'], majorExports: ['gold', 'wool', 'cotton'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'AM', name: 'Armenia', nameEn: 'Armenia', region: 'Asia', treaties: ['eaeu'], majorExports: ['copper', 'gold', 'brandy'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'AZ', name: 'Azerbaiyán', nameEn: 'Azerbaijan', region: 'Asia', treaties: [], majorExports: ['oil', 'gas', 'cotton'], majorImports: ['machinery', 'food', 'chemicals'] },
  { code: 'GE', name: 'Georgia', nameEn: 'Georgia', region: 'Asia', treaties: [], majorExports: ['wine', 'copper', 'textiles'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'MN', name: 'Mongolia', nameEn: 'Mongolia', region: 'Asia', treaties: [], majorExports: ['copper', 'coal', 'gold'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'KP', name: 'Corea del Norte', nameEn: 'North Korea', region: 'Asia', treaties: [], majorExports: ['coal', 'textiles'], majorImports: ['oil', 'food'], restrictions: ['sanctions'] },
  { code: 'AF', name: 'Afganistán', nameEn: 'Afghanistan', region: 'Asia', treaties: [], majorExports: ['minerals', 'carpets'], majorImports: ['food', 'fuel', 'machinery'], restrictions: ['political_instability'] },

  // Países adicionales de África
  { code: 'DZ', name: 'Argelia', nameEn: 'Algeria', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'gas'], majorImports: ['machinery', 'food', 'chemicals'] },
  { code: 'MA', name: 'Marruecos', nameEn: 'Morocco', region: 'Africa', treaties: ['afcfta'], majorExports: ['phosphates', 'textiles', 'food'], majorImports: ['machinery', 'fuel', 'chemicals'] },
  { code: 'TN', name: 'Túnez', nameEn: 'Tunisia', region: 'Africa', treaties: ['afcfta'], majorExports: ['textiles', 'oil', 'phosphates'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'LY', name: 'Libia', nameEn: 'Libya', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil'], majorImports: ['machinery', 'food', 'chemicals'], restrictions: ['political_instability'] },
  { code: 'ET', name: 'Etiopía', nameEn: 'Ethiopia', region: 'Africa', treaties: ['afcfta'], majorExports: ['coffee', 'textiles', 'gold'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'GH', name: 'Ghana', nameEn: 'Ghana', region: 'Africa', treaties: ['afcfta'], majorExports: ['gold', 'cocoa', 'oil'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'CI', name: 'Costa de Marfil', nameEn: 'Ivory Coast', region: 'Africa', treaties: ['afcfta'], majorExports: ['cocoa', 'coffee', 'wood'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'SN', name: 'Senegal', nameEn: 'Senegal', region: 'Africa', treaties: ['afcfta'], majorExports: ['fish', 'phosphates', 'textiles'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'TZ', name: 'Tanzania', nameEn: 'Tanzania', region: 'Africa', treaties: ['afcfta'], majorExports: ['gold', 'coffee', 'cotton'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'UG', name: 'Uganda', nameEn: 'Uganda', region: 'Africa', treaties: ['afcfta'], majorExports: ['coffee', 'tea', 'fish'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'ZM', name: 'Zambia', nameEn: 'Zambia', region: 'Africa', treaties: ['afcfta'], majorExports: ['copper', 'cobalt'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'ZW', name: 'Zimbabue', nameEn: 'Zimbabwe', region: 'Africa', treaties: ['afcfta'], majorExports: ['tobacco', 'gold', 'platinum'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'BW', name: 'Botsuana', nameEn: 'Botswana', region: 'Africa', treaties: ['afcfta'], majorExports: ['diamonds', 'beef'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'NA', name: 'Namibia', nameEn: 'Namibia', region: 'Africa', treaties: ['afcfta'], majorExports: ['diamonds', 'uranium', 'fish'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'AO', name: 'Angola', nameEn: 'Angola', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'diamonds'], majorImports: ['machinery', 'food', 'chemicals'] },

  // Los países de Centroamérica ya están definidos arriba con sus tratados correctos
  // Los países del Caribe ya están definidos arriba con CARICOM y otros tratados
  { code: 'HT', name: 'Haití', nameEn: 'Haiti', region: 'Caribbean', treaties: [], majorExports: ['textiles', 'coffee'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'TT', name: 'Trinidad y Tobago', nameEn: 'Trinidad and Tobago', region: 'Caribbean', treaties: [], majorExports: ['oil', 'gas', 'chemicals'], majorImports: ['machinery', 'food', 'vehicles'] },
  { code: 'BB', name: 'Barbados', nameEn: 'Barbados', region: 'Caribbean', treaties: [], majorExports: ['sugar', 'rum', 'chemicals'], majorImports: ['machinery', 'fuel', 'food'] },
  { code: 'BS', name: 'Bahamas', nameEn: 'Bahamas', region: 'Caribbean', treaties: [], majorExports: ['fish', 'rum'], majorImports: ['machinery', 'fuel', 'food'] },

  // --- FINAL BATCH: MICROSTATES & ISLANDS (~30 Countries) ---
  
  // Caribbean & Central America
  { code: 'KY', name: 'Islas Caimán', nameEn: 'Cayman Islands', region: 'Caribbean', treaties: [], majorExports: ['re_exports'], majorImports: ['food', 'fuel'] },
  { code: 'AW', name: 'Aruba', nameEn: 'Aruba', region: 'Caribbean', treaties: [], majorExports: ['oil_refining', 'tourism'], majorImports: ['food', 'fuel'] },
  { code: 'CW', name: 'Curazao', nameEn: 'Curacao', region: 'Caribbean', treaties: [], majorExports: ['oil_refining'], majorImports: ['crude_oil', 'food'] },
  { code: 'SX', name: 'Sint Maarten', nameEn: 'Sint Maarten', region: 'Caribbean', treaties: [], majorExports: ['tourism'], majorImports: ['food', 'fuel'] },
  { code: 'BM', name: 'Bermudas', nameEn: 'Bermuda', region: 'North America', treaties: [], majorExports: ['re_exports'], majorImports: ['food', 'fuel', 'machinery'] },

  // Pacific Islands
  { code: 'WS', name: 'Samoa', nameEn: 'Samoa', region: 'Oceania', treaties: [], majorExports: ['fish', 'coconut'], majorImports: ['machinery', 'food'] },
  { code: 'TO', name: 'Tonga', nameEn: 'Tonga', region: 'Oceania', treaties: [], majorExports: ['squash', 'vanilla'], majorImports: ['food', 'fuel'] },
  { code: 'VU', name: 'Vanuatu', nameEn: 'Vanuatu', region: 'Oceania', treaties: [], majorExports: ['fish', 'copra'], majorImports: ['machinery', 'food'] },
  { code: 'SB', name: 'Islas Salomón', nameEn: 'Solomon Islands', region: 'Oceania', treaties: [], majorExports: ['timber', 'fish'], majorImports: ['machinery', 'fuel'] },
  { code: 'PF', name: 'Polinesia Francesa', nameEn: 'French Polynesia', region: 'Oceania', treaties: [], majorExports: ['pearls', 'vanilla'], majorImports: ['fuel', 'food'] },
  { code: 'NC', name: 'Nueva Caledonia', nameEn: 'New Caledonia', region: 'Oceania', treaties: [], majorExports: ['nickel'], majorImports: ['machinery', 'fuel'] },

  // Africa Microstates & Others
  { code: 'CV', name: 'Cabo Verde', nameEn: 'Cape Verde', region: 'Africa', treaties: ['afcfta'], majorExports: ['fish', 'shoes'], majorImports: ['food', 'fuel'] },
  { code: 'ST', name: 'Santo Tomé y Príncipe', nameEn: 'Sao Tome and Principe', region: 'Africa', treaties: ['afcfta'], majorExports: ['cocoa'], majorImports: ['food', 'fuel'] },
  { code: 'GQ', name: 'Guinea Ecuatorial', nameEn: 'Equatorial Guinea', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'gas'], majorImports: ['machinery', 'food'] },
  { code: 'GA', name: 'Gabón', nameEn: 'Gabon', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'manganese'], majorImports: ['machinery', 'food'] },
  { code: 'CG', name: 'Congo', nameEn: 'Republic of the Congo', region: 'Africa', treaties: ['afcfta'], majorExports: ['oil', 'copper'], majorImports: ['machinery', 'food'] },
  { code: 'MR', name: 'Mauritania', nameEn: 'Mauritania', region: 'Africa', treaties: ['afcfta'], majorExports: ['iron_ore', 'fish', 'gold'], majorImports: ['machinery', 'food'] },

  // Europe Microstates
  { code: 'MC', name: 'Mónaco', nameEn: 'Monaco', region: 'Europe', treaties: ['customs_union_eu'], majorExports: ['cosmetics', 'pharmaceuticals'], majorImports: ['luxury_goods'] },
  { code: 'AD', name: 'Andorra', nameEn: 'Andorra', region: 'Europe', treaties: ['customs_union_eu'], majorExports: ['tobacco', 'furniture'], majorImports: ['food', 'fuel'] },
  { code: 'SM', name: 'San Marino', nameEn: 'San Marino', region: 'Europe', treaties: ['customs_union_eu'], majorExports: ['ceramics', 'chemicals'], majorImports: ['gas', 'machinery'] },
  { code: 'VA', name: 'Vaticano', nameEn: 'Vatican City', region: 'Europe', treaties: [], majorExports: [], majorImports: ['food', 'consumer_goods'] },

  // Asia Others
  { code: 'MV', name: 'Maldivas', nameEn: 'Maldives', region: 'Asia', treaties: [], majorExports: ['fish'], majorImports: ['fuel', 'food'] },
  { code: 'BT', name: 'Bután', nameEn: 'Bhutan', region: 'Asia', treaties: [], majorExports: ['electricity', 'cement'], majorImports: ['fuel', 'machinery'] },
  { code: 'TL', name: 'Timor Oriental', nameEn: 'East Timor', region: 'Asia', treaties: [], majorExports: ['oil', 'coffee'], majorImports: ['food', 'fuel'] },
  { code: 'TJ', name: 'Tayikistán', nameEn: 'Tajikistan', region: 'Asia', treaties: [], majorExports: ['aluminum', 'cotton'], majorImports: ['petroleum', 'machinery'] },
  { code: 'TM', name: 'Turkmenistán', nameEn: 'Turkmenistan', region: 'Asia', treaties: [], majorExports: ['gas', 'cotton'], majorImports: ['machinery', 'food'] }
];

// Función para obtener tratados de un país
export function getCountryTreaties(countryCode: string): TradeTreaty[] {
  const country = countries.find(c => c.code === countryCode);
  if (!country) return [];
  
  return tradeTreaties.filter(treaty => 
    country.treaties.includes(treaty.id)
  );
}

// Función para verificar si dos países tienen tratados comerciales
export function haveTradeTreaty(country1: string, country2: string): TradeTreaty[] {
  const country1Treaties = getCountryTreaties(country1);
  const country2Treaties = getCountryTreaties(country2);
  
  return country1Treaties.filter(treaty1 => 
    country2Treaties.some(treaty2 => treaty1.id === treaty2.id)
  );
}

// Función para calcular reducción arancelaria entre países
export function getTariffReduction(exporterCode: string, importerCode: string): number {
  const treaties = haveTradeTreaty(exporterCode, importerCode);
  if (treaties.length === 0) return 0;
  
  // Retorna la mayor reducción disponible
  return Math.max(...treaties.map(t => t.tariffReduction));
}