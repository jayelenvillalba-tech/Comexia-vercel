// Base de datos de códigos HS prioritarios
// Sistema Armonizado de Designación y Codificación de Mercancías

import { HS_CODES_INDUSTRIAL } from './hs-codes-industrial';
import { HS_CODES_CONSUMER } from './hs-codes-consumer';

export interface HSCode {
  code: string;
  description: string;
  descriptionEn: string;
  section: string;
  chapter: string;
  baseTariff: number; // Arancel base promedio (%)
  specializations: string[]; // Países especializados
  restrictions?: string[];
  keywords: string[];
}

// Sección I: Animales vivos y productos del reino animal
const sectionI: HSCode[] = [
  {
    code: '0102',
    description: 'Animales vivos de la especie bovina',
    descriptionEn: 'Live bovine animals',
    section: 'I',
    chapter: '01',
    baseTariff: 10,
    specializations: ['AR', 'BR', 'UY', 'AU'],
    keywords: ['ganado', 'bovino', 'vaca', 'toro', 'cattle', 'cow']
  },
  {
    code: '0201',
    description: 'Carne de animales de la especie bovina, fresca o refrigerada',
    descriptionEn: 'Meat of bovine animals, fresh or chilled',
    section: 'I',
    chapter: '02',
    baseTariff: 12,
    specializations: ['AR', 'BR', 'UY', 'US', 'AU'],
    keywords: ['carne', 'res', 'beef', 'meat', 'bovina']
  },
  {
    code: '0202',
    description: 'Carne de animales de la especie bovina, congelada',
    descriptionEn: 'Meat of bovine animals, frozen',
    section: 'I',
    chapter: '02',
    baseTariff: 12,
    specializations: ['AR', 'BR', 'UY', 'AU', 'NZ'],
    keywords: ['carne', 'congelada', 'frozen', 'beef']
  },
  {
    code: '0203',
    description: 'Carne de animales de la especie porcina, fresca, refrigerada o congelada',
    descriptionEn: 'Meat of swine, fresh, chilled or frozen',
    section: 'I',
    chapter: '02',
    baseTariff: 10,
    specializations: ['BR', 'US', 'DE', 'ES', 'CN'],
    keywords: ['cerdo', 'pork', 'pig', 'swine']
  },
  {
    code: '0207',
    description: 'Carne y despojos comestibles de aves',
    descriptionEn: 'Meat and edible offal of poultry',
    section: 'I',
    chapter: '02',
    baseTariff: 8,
    specializations: ['BR', 'US', 'TH'],
    keywords: ['pollo', 'chicken', 'ave', 'poultry']
  },
  {
    code: '0301',
    description: 'Peces vivos',
    descriptionEn: 'Live fish',
    section: 'I',
    chapter: '03',
    baseTariff: 5,
    specializations: ['NO', 'CL', 'CN'],
    keywords: ['pez', 'fish', 'pescado']
  },
  {
    code: '0302',
    description: 'Pescado fresco o refrigerado',
    descriptionEn: 'Fish, fresh or chilled',
    section: 'I',
    chapter: '03',
    baseTariff: 6,
    specializations: ['NO', 'CL', 'PE', 'EC'],
    keywords: ['pescado', 'fish', 'fresco']
  },
  {
    code: '0303',
    description: 'Pescado congelado',
    descriptionEn: 'Fish, frozen',
    section: 'I',
    chapter: '03',
    baseTariff: 6,
    specializations: ['NO', 'CL', 'PE', 'CN'],
    keywords: ['pescado', 'congelado', 'frozen', 'fish']
  },
  {
    code: '0306',
    description: 'Crustáceos',
    descriptionEn: 'Crustaceans',
    section: 'I',
    chapter: '03',
    baseTariff: 8,
    specializations: ['EC', 'VN', 'TH', 'IN'],
    keywords: ['camarón', 'langosta', 'shrimp', 'lobster', 'crustacean']
  },
  {
    code: '0401',
    description: 'Leche y nata (crema), sin concentrar',
    descriptionEn: 'Milk and cream, not concentrated',
    section: 'I',
    chapter: '04',
    baseTariff: 15,
    specializations: ['NZ', 'UY', 'AR', 'DE'],
    keywords: ['leche', 'milk', 'dairy', 'lácteo']
  },
  {
    code: '0402',
    description: 'Leche y nata (crema), concentradas o con azúcar',
    descriptionEn: 'Milk and cream, concentrated or sweetened',
    section: 'I',
    chapter: '04',
    baseTariff: 15,
    specializations: ['NZ', 'UY', 'NL'],
    keywords: ['leche', 'condensada', 'milk', 'concentrated']
  },
  {
    code: '0406',
    description: 'Quesos y requesón',
    descriptionEn: 'Cheese and curd',
    section: 'I',
    chapter: '04',
    baseTariff: 18,
    specializations: ['FR', 'IT', 'NL', 'AR'],
    keywords: ['queso', 'cheese', 'dairy']
  },
  {
    code: '0407',
    description: 'Huevos de ave con cáscara, frescos',
    descriptionEn: 'Birds eggs, in shell, fresh',
    section: 'I',
    chapter: '04',
    baseTariff: 10,
    specializations: ['US', 'BR', 'MX'],
    keywords: ['huevo', 'egg']
  },
  {
    code: '0409',
    description: 'Miel natural',
    descriptionEn: 'Natural honey',
    section: 'I',
    chapter: '04',
    baseTariff: 8,
    specializations: ['AR', 'NZ', 'CN'],
    keywords: ['miel', 'honey']
  }
];

// Sección II: Productos del reino vegetal
const sectionII: HSCode[] = [
  {
    code: '0701',
    description: 'Papas (patatas) frescas o refrigeradas',
    descriptionEn: 'Potatoes, fresh or chilled',
    section: 'II',
    chapter: '07',
    baseTariff: 10,
    specializations: ['NL', 'BE', 'FR', 'PE'],
    keywords: ['papa', 'patata', 'potato']
  },
  {
    code: '0703',
    description: 'Cebollas, chalotes, ajos, puerros',
    descriptionEn: 'Onions, shallots, garlic, leeks',
    section: 'II',
    chapter: '07',
    baseTariff: 8,
    specializations: ['CN', 'IN', 'NL'],
    keywords: ['cebolla', 'ajo', 'onion', 'garlic']
  },
  {
    code: '0704',
    description: 'Coles, coliflores, brócoli',
    descriptionEn: 'Cabbages, cauliflowers, broccoli',
    section: 'II',
    chapter: '07',
    baseTariff: 8,
    specializations: ['ES', 'MX', 'CN'],
    keywords: ['col', 'coliflor', 'brócoli', 'cabbage', 'broccoli']
  },
  {
    code: '0707',
    description: 'Pepinos y pepinillos',
    descriptionEn: 'Cucumbers and gherkins',
    section: 'II',
    chapter: '07',
    baseTariff: 8,
    specializations: ['ES', 'MX', 'NL'],
    keywords: ['pepino', 'cucumber']
  },
  {
    code: '0709',
    description: 'Hortalizas frescas o refrigeradas',
    descriptionEn: 'Other vegetables, fresh or chilled',
    section: 'II',
    chapter: '07',
    baseTariff: 8,
    specializations: ['ES', 'MX', 'NL', 'MA'],
    keywords: ['hortaliza', 'vegetal', 'vegetable']
  },
  {
    code: '0801',
    description: 'Cocos, nueces del Brasil y nueces de marañón',
    descriptionEn: 'Coconuts, Brazil nuts and cashew nuts',
    section: 'II',
    chapter: '08',
    baseTariff: 5,
    specializations: ['PH', 'VN', 'IN', 'BR'],
    keywords: ['coco', 'nuez', 'coconut', 'nut', 'cashew']
  },
  {
    code: '0803',
    description: 'Bananas, incluidos los plátanos',
    descriptionEn: 'Bananas, including plantains',
    section: 'II',
    chapter: '08',
    baseTariff: 10,
    specializations: ['EC', 'CR', 'CO', 'PH'],
    keywords: ['banana', 'plátano', 'plantain']
  },
  {
    code: '0804',
    description: 'Dátiles, higos, piñas, aguacates, guayabas, mangos',
    descriptionEn: 'Dates, figs, pineapples, avocados, guavas, mangoes',
    section: 'II',
    chapter: '08',
    baseTariff: 8,
    specializations: ['MX', 'PE', 'TH', 'IN'],
    keywords: ['piña', 'aguacate', 'mango', 'pineapple', 'avocado']
  },
  {
    code: '0805',
    description: 'Cítricos frescos o secos',
    descriptionEn: 'Citrus fruit, fresh or dried',
    section: 'II',
    chapter: '08',
    baseTariff: 8,
    specializations: ['ES', 'BR', 'US', 'ZA'],
    keywords: ['naranja', 'limón', 'mandarina', 'orange', 'lemon', 'citrus']
  },
  {
    code: '0806',
    description: 'Uvas, frescas o secas',
    descriptionEn: 'Grapes, fresh or dried',
    section: 'II',
    chapter: '08',
    baseTariff: 10,
    specializations: ['CL', 'IT', 'ES', 'PE'],
    keywords: ['uva', 'grape', 'pasa', 'raisin']
  },
  {
    code: '0808',
    description: 'Manzanas, peras y membrillos',
    descriptionEn: 'Apples, pears and quinces',
    section: 'II',
    chapter: '08',
    baseTariff: 10,
    specializations: ['CL', 'NZ', 'US', 'PL'],
    keywords: ['manzana', 'pera', 'apple', 'pear']
  },
  {
    code: '0809',
    description: 'Damascos, cerezas, duraznos, ciruelas y endrinas',
    descriptionEn: 'Apricots, cherries, peaches, plums and sloes',
    section: 'II',
    chapter: '08',
    baseTariff: 10,
    specializations: ['CL', 'ES', 'TR', 'US'],
    keywords: ['durazno', 'cereza', 'ciruela', 'peach', 'cherry', 'plum']
  },
  {
    code: '0810',
    description: 'Fresas, frambuesas, moras, grosellas y arándanos',
    descriptionEn: 'Strawberries, raspberries, blackberries, currants and blueberries',
    section: 'II',
    chapter: '08',
    baseTariff: 10,
    specializations: ['CL', 'PE', 'MX', 'ES'],
    keywords: ['fresa', 'frambuesa', 'arándano', 'strawberry', 'blueberry']
  },
  {
    code: '0901',
    description: 'Café, incluso tostado o descafeinado',
    descriptionEn: 'Coffee, whether or not roasted or decaffeinated',
    section: 'II',
    chapter: '09',
    baseTariff: 5,
    specializations: ['BR', 'VN', 'CO', 'ET'],
    keywords: ['café', 'coffee']
  },
  {
    code: '0902',
    description: 'Té, incluso aromatizado',
    descriptionEn: 'Tea, whether or not flavoured',
    section: 'II',
    chapter: '09',
    baseTariff: 5,
    specializations: ['CN', 'IN', 'KE', 'LK'],
    keywords: ['té', 'tea']
  },
  {
    code: '0904',
    description: 'Pimienta del género Piper',
    descriptionEn: 'Pepper of the genus Piper',
    section: 'II',
    chapter: '09',
    baseTariff: 5,
    specializations: ['VN', 'IN', 'BR'],
    keywords: ['pimienta', 'pepper']
  },
  {
    code: '0905',
    description: 'Vainilla',
    descriptionEn: 'Vanilla',
    section: 'II',
    chapter: '09',
    baseTariff: 5,
    specializations: ['MG', 'MX', 'ID'],
    keywords: ['vainilla', 'vanilla']
  },
  {
    code: '0906',
    description: 'Canela y flores de canelero',
    descriptionEn: 'Cinnamon and cinnamon-tree flowers',
    section: 'II',
    chapter: '09',
    baseTariff: 5,
    specializations: ['LK', 'ID', 'VN'],
    keywords: ['canela', 'cinnamon']
  },
  {
    code: '1001',
    description: 'Trigo y morcajo',
    descriptionEn: 'Wheat and meslin',
    section: 'II',
    chapter: '10',
    baseTariff: 10,
    specializations: ['RU', 'US', 'CA', 'FR'],
    keywords: ['trigo', 'wheat']
  },
  {
    code: '1003',
    description: 'Cebada',
    descriptionEn: 'Barley',
    section: 'II',
    chapter: '10',
    baseTariff: 10,
    specializations: ['RU', 'FR', 'DE', 'AU'],
    keywords: ['cebada', 'barley']
  },
  {
    code: '1005',
    description: 'Maíz',
    descriptionEn: 'Maize (corn)',
    section: 'II',
    chapter: '10',
    baseTariff: 10,
    specializations: ['US', 'BR', 'AR', 'UA'],
    keywords: ['maíz', 'corn', 'maize']
  },
  {
    code: '1006',
    description: 'Arroz',
    descriptionEn: 'Rice',
    section: 'II',
    chapter: '10',
    baseTariff: 12,
    specializations: ['IN', 'TH', 'VN', 'PK'],
    keywords: ['arroz', 'rice']
  },
  {
    code: '1201',
    description: 'Habas de soja',
    descriptionEn: 'Soya beans',
    section: 'II',
    chapter: '12',
    baseTariff: 5,
    specializations: ['BR', 'US', 'AR'],
    keywords: ['soja', 'soya', 'soybean']
  },
  {
    code: '1507',
    description: 'Aceite de soja y sus fracciones',
    descriptionEn: 'Soya-bean oil and its fractions',
    section: 'II',
    chapter: '15',
    baseTariff: 8,
    specializations: ['BR', 'AR', 'US'],
    keywords: ['aceite', 'soja', 'oil', 'soybean']
  },
  {
    code: '1511',
    description: 'Aceite de palma y sus fracciones',
    descriptionEn: 'Palm oil and its fractions',
    section: 'II',
    chapter: '15',
    baseTariff: 8,
    specializations: ['ID', 'MY'],
    keywords: ['aceite', 'palma', 'palm', 'oil']
  },
  {
    code: '1512',
    description: 'Aceites de girasol, cártamo o algodón',
    descriptionEn: 'Sunflower-seed, safflower or cotton-seed oil',
    section: 'II',
    chapter: '15',
    baseTariff: 8,
    specializations: ['UA', 'RU', 'AR'],
    keywords: ['aceite', 'girasol', 'sunflower', 'oil']
  },
  {
    code: '1701',
    description: 'Azúcar de caña o de remolacha',
    descriptionEn: 'Cane or beet sugar',
    section: 'II',
    chapter: '17',
    baseTariff: 15,
    specializations: ['BR', 'IN', 'TH'],
    keywords: ['azúcar', 'sugar']
  }
];

export const HS_CODES_DATABASE = [...sectionI, ...sectionII, ...HS_CODES_INDUSTRIAL, ...HS_CODES_CONSUMER];

export function searchHSCodes(query: string): HSCode[] {
  const searchTerm = query.toLowerCase().trim();
  
  return HS_CODES_DATABASE.filter(code => 
    code.code.includes(searchTerm) ||
    code.description.toLowerCase().includes(searchTerm) ||
    code.descriptionEn.toLowerCase().includes(searchTerm) ||
    code.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  );
}

export function getHSCodeByCode(code: string): HSCode | undefined {
  return HS_CODES_DATABASE.find(hs => hs.code === code);
}

export function getHSCodesBySection(section: string): HSCode[] {
  return HS_CODES_DATABASE.filter(hs => hs.section === section);
}
