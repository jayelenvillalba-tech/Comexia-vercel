import { db, initDatabase, saveDatabase } from '../db-sqlite.js';
import { tradeAlerts } from '../../shared/shared/schema-sqlite.js';

const mockAlerts = [
  {
    title: 'Nueva Regulación de Deforestación de la UE (EUDR)',
    titleEn: 'New EU Deforestation Regulation (EUDR)',
    description: 'A partir de 2025, no se podrán exportar a la UE productos de zonas deforestadas (soja, carne, madera, café, cacao).',
    descriptionEn: 'Starting 2025, products from deforested areas (soy, beef, wood, coffee, cocoa) cannot be exported to the EU.',
    type: 'regulation',
    severity: 'critical', // critical, high, medium, low
    category: 'environment',
    affectedCountries: JSON.stringify(['UE', 'AR', 'BR', 'PY', 'CO']),
    affectedProducts: JSON.stringify(['1201', '0201', '4403', '0901', '1801']),
    impactLevel: 10,
    source: 'European Commission',
    actionRecommendation: 'Geolocalizar parcelas de producción y preparar declaración de debida diligencia.',
    actionRecommendationEn: 'Geolocate production plots and prepare due diligence statement.',
    isActive: true
  },
  {
    title: 'Aumento de Aranceles a Vehículos Eléctricos en EEUU',
    titleEn: 'Increased Tariffs on EVs in USA',
    description: 'EEUU incrementa aranceles a la importación de vehículos eléctricos y baterías de origen asiático.',
    descriptionEn: 'USA raises tariffs on imports of electric vehicles and batteries from Asian origin.',
    type: 'tariff',
    severity: 'high',
    category: 'trade_policy',
    affectedCountries: JSON.stringify(['US', 'CN', 'VN']),
    affectedProducts: JSON.stringify(['8703', '8507']),
    impactLevel: 8,
    source: 'USTR',
    actionRecommendation: 'Revisar cadena de suministro y origen de componentes.',
    actionRecommendationEn: 'Review supply chain and component origin.',
    isActive: true
  },
  {
    title: 'Nuevos Requisitos de Etiquetado de Alimentos en China',
    titleEn: 'New Food Labeling Requirements in China',
    description: 'La aduana china exige registro GACC actualizado y nuevo formato de fecha en etiquetas de productos procesados.',
    descriptionEn: 'Chinese customs require updated GACC registration and new date format on processed food labels.',
    type: 'compliance',
    severity: 'medium',
    category: 'sanitary',
    affectedCountries: JSON.stringify(['CN', 'global']),
    affectedProducts: JSON.stringify(['1602', '0406', '1905']),
    impactLevel: 6,
    source: 'GACC China',
    actionRecommendation: 'Actualizar registro en sistema CIFER antes del próximo embarque.',
    actionRecommendationEn: 'Update registration in CIFER system before next shipment.',
    isActive: true
  },
  {
    title: 'India reduce arancel a la importación de Smartphone Parts',
    titleEn: 'India cuts import duty on Smartphone Parts',
    description: 'India reduce el arancel de importación del 15% al 10% para componentes móviles para impulsar la fabricación local.',
    descriptionEn: 'India cuts import duty from 15% to 10% on mobile components to boost local manufacturing.',
    type: 'tariff_reduction',
    severity: 'low', // Actually positive
    category: 'opportunity',
    affectedCountries: JSON.stringify(['IN', 'global']),
    affectedProducts: JSON.stringify(['8517', '8542']),
    impactLevel: 5,
    source: 'Ministry of Finance India',
    actionRecommendation: 'Aprovechar reducción de costos para envíos de partes.',
    actionRecommendationEn: 'Leverage cost reduction for parts shipments.',
    isActive: true
  }
];

async function seedAlerts() {
  console.log('🔔 Seeding Regulatory Alerts...');
  const db = await initDatabase();
  
  // Clean existing
  // await db.delete(tradeAlerts);

  for (const alert of mockAlerts) {
     await db.insert(tradeAlerts).values(alert);
     process.stdout.write('.');
  }
  
  console.log('\n✅ Alerts Seeded');
  saveDatabase();
}

seedAlerts().catch(console.error);
