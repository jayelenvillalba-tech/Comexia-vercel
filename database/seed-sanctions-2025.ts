
import { db as exportedDb, initDatabase, saveDatabase } from './db-sqlite.js';
import { sanctionsList } from '../shared/shared/schema-sqlite.js';
import crypto from 'crypto';

const SANCTIONS_2025 = [
  // --- COMPREHENSIVE EMBARGOES ---
  {
    countryCode: 'KP', // North Korea
    authority: 'UN/OFAC',
    message: 'TOTAL EMBARGO: Prohibición total de comercio. Sanciones severas por programas nucleares y ciber-fraude IT.',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'IR', // Iran
    authority: 'OFAC/EU',
    message: 'EMBARGO SECTORAL: Prohibición casi total. Foco en petróleo, metales y sector financiero.',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'CU', // Cuba
    authority: 'OFAC',
    message: 'EMBARGO COMERCIAL: Restricciones integrales bajo el Reglamento de Control de Activos Cubanos.',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'SY', // Syria
    authority: 'OFAC/EU',
    message: 'EMBARGO TOTAL: Sanciones por represión y uso de armas químicas.',
    severity: 'CRITICAL'
  },

  // --- SECTORAL SANCTIONS (RUSSIA 2025) ---
  {
    countryCode: 'RU', // Russia
    hsChapter: '27', // Mineral fuels/Oil
    authority: 'EU/G7',
    message: 'OIL PRICE CAP 2025: El tope de precio para crudo ruso se ha fijado en USD 47.60 (Sept 2025). Prohibición de servicios de transporte si el precio supera el tope.',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'RU', // Russia
    hsChapter: '84', // Machinery
    authority: 'EU/OFAC',
    message: 'SECTORAL BAN: Prohibición de exportación de maquinaria industrial y componentes de doble uso (civil/militar).',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'RU', // Russia
    hsChapter: '85', // Electronics
    authority: 'EU/OFAC',
    message: 'HIGH-TECH BAN: Restricciones totales a la exportación de semiconductores, microelectrónica y sensores avanzados.',
    severity: 'CRITICAL'
  },
  {
    countryCode: 'RU', // Russia
    authority: 'EU 18th Package',
    message: 'SWIFT BAN: Restricción de transacciones financieras con bancos rusos designados.',
    severity: 'CRITICAL'
  },

  // --- VENEZUELA 2025 ---
  {
    countryCode: 'VE', // Venezuela
    hsChapter: '27', // Oil
    authority: 'OFAC',
    message: 'SHADOW FLEET BAN: Sanciones a buques y empresas que faciliten la exportación ilícita de crudo venezolano.',
    severity: 'CRITICAL'
  },

  // --- BELARUS 2025 ---
  {
    countryCode: 'BY', // Belarus
    authority: 'OFAC/EU',
    message: 'DEFENSE SECTOR BAN: Sanciones por apoyo logístico y militar a la invasión de Ucrania.',
    severity: 'CRITICAL'
  },

  // --- GLOBAL TECHNOLOGY BANS ---
  {
    countryCode: 'GLOBAL',
    hsChapter: '93', // Weapons/Ammo
    authority: 'UN',
    message: 'ARMS EMBARGO: Embargo de armas vigente para destinos conflictivos bajo resolución ONU.',
    severity: 'CRITICAL'
  }
];

async function seedSanctions() {
  console.log('🚀 Seeding Global Sanctions (2025) Danger Layer...');
  
  const db = await initDatabase();
  console.log(`Array length: ${SANCTIONS_2025.length}`);
  
  let added = 0;
  for (const sanction of SANCTIONS_2025) {
    try {
      console.log(`Adding sanction for: ${sanction.countryCode}`);
      await db.insert(sanctionsList).values({
        id: crypto.randomUUID(),
        ...sanction
      });
      added++;
    } catch (e) {
      console.error(`Error adding sanction for ${sanction.countryCode}:`, e);
    }
  }

  saveDatabase();
  console.log(`✅ Seeded ${added} global sanctions.`);
}

seedSanctions().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
