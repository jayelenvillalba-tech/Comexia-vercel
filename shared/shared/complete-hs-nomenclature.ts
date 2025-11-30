// Sistema completo de nomenclador aduanero HS (Harmonized System)
// Basado en el sistema internacional de clasificación de mercancías

import type { HsSection, HsChapter, HsPartida, HsSubpartida } from './schema';

// 21 Secciones principales del nomenclador HS
export const HS_SECTIONS: HsSection[] = [
  {
    id: '01',
    code: 'I',
    number: 1,
    description: 'Animales vivos y productos del reino animal',
    descriptionEn: 'Live animals; animal products',
    chapterRange: '01-05'
  },
  {
    id: '02', 
    code: 'II',
    number: 2,
    description: 'Productos del reino vegetal',
    descriptionEn: 'Vegetable products',
    chapterRange: '06-14'
  },
  {
    id: '03',
    code: 'III',
    number: 3,
    description: 'Grasas y aceites animales o vegetales',
    descriptionEn: 'Animal or vegetable fats and oils',
    chapterRange: '15'
  },
  {
    id: '04',
    code: 'IV',
    number: 4,
    description: 'Productos de las industrias alimentarias',
    descriptionEn: 'Prepared foodstuffs',
    chapterRange: '16-24'
  },
  {
    id: '05',
    code: 'V',
    number: 5,
    description: 'Productos minerales',
    descriptionEn: 'Mineral products',
    chapterRange: '25-27'
  },
  {
    id: '06',
    code: 'VI',
    number: 6,
    description: 'Productos de las industrias químicas',
    descriptionEn: 'Products of chemical industries',
    chapterRange: '28-38'
  },
  {
    id: '07',
    code: 'VII',
    number: 7,
    description: 'Materias plásticas y sus manufacturas; caucho',
    descriptionEn: 'Plastics and articles thereof; rubber',
    chapterRange: '39-40'
  },
  {
    id: '08',
    code: 'VIII',
    number: 8,
    description: 'Pieles, cueros, peletería y sus manufacturas',
    descriptionEn: 'Raw hides and skins, leather, furskins',
    chapterRange: '41-43'
  },
  {
    id: '09',
    code: 'IX',
    number: 9,
    description: 'Madera, carbón vegetal y sus manufacturas',
    descriptionEn: 'Wood and articles of wood; wood charcoal',
    chapterRange: '44-46'
  },
  {
    id: '10',
    code: 'X',
    number: 10,
    description: 'Materias textiles y sus manufacturas',
    descriptionEn: 'Textiles and textile articles',
    chapterRange: '50-63'
  },
  {
    id: '11',
    code: 'XI',
    number: 11,
    description: 'Calzado, sombrererías, paraguas',
    descriptionEn: 'Footwear, headgear, umbrellas',
    chapterRange: '64-67'
  },
  {
    id: '12',
    code: 'XII',
    number: 12,
    description: 'Manufacturas de piedra, yeso, cemento',
    descriptionEn: 'Articles of stone, plaster, cement',
    chapterRange: '68-70'
  },
  {
    id: '13',
    code: 'XIII',
    number: 13,
    description: 'Perlas finas, piedras preciosas, metales preciosos',
    descriptionEn: 'Natural pearls, precious stones, precious metals',
    chapterRange: '71'
  },
  {
    id: '14',
    code: 'XIV',
    number: 14,
    description: 'Metales comunes y sus manufacturas',
    descriptionEn: 'Base metals and articles of base metal',
    chapterRange: '72-83'
  },
  {
    id: '15',
    code: 'XV',
    number: 15,
    description: 'Máquinas y aparatos, material eléctrico',
    descriptionEn: 'Machinery and mechanical appliances; electrical equipment',
    chapterRange: '84-85'
  },
  {
    id: '16',
    code: 'XVI',
    number: 16,
    description: 'Material de transporte',
    descriptionEn: 'Vehicles, aircraft, vessels',
    chapterRange: '86-89'
  },
  {
    id: '17',
    code: 'XVII',
    number: 17,
    description: 'Instrumentos y aparatos de óptica, fotografía',
    descriptionEn: 'Optical, photographic, cinematographic instruments',
    chapterRange: '90-92'
  },
  {
    id: '18',
    code: 'XVIII',
    number: 18,
    description: 'Armas, municiones, y sus partes y accesorios',
    descriptionEn: 'Arms and ammunition; parts and accessories',
    chapterRange: '93'
  },
  {
    id: '19',
    code: 'XIX',
    number: 19,
    description: 'Mercancías y productos diversos',
    descriptionEn: 'Miscellaneous manufactured articles',
    chapterRange: '94-96'
  },
  {
    id: '20',
    code: 'XX',
    number: 20,
    description: 'Objetos de arte o colección y antigüedades',
    descriptionEn: 'Works of art, collectors pieces and antiques',
    chapterRange: '97'
  },
  {
    id: '21',
    code: 'XXI',
    number: 21,
    description: 'Mercancías en tránsito y otros usos especiales',
    descriptionEn: 'Special classification provisions',
    chapterRange: '98-99'
  }
];

// Capítulos principales del nomenclador HS (96+ capítulos)
export const HS_CHAPTERS: HsChapter[] = [
  // Sección I: Animales vivos y productos del reino animal
  { id: '01', sectionCode: 'I', code: '01', description: 'Animales vivos', descriptionEn: 'Live animals', notes: 'Caballos, asnos, mulos, bueyes, cerdos, ovejas, cabras, aves de corral', notesEn: 'Horses, asses, mules, cattle, swine, sheep, goats, poultry' },
  { id: '02', sectionCode: 'I', code: '02', description: 'Carne y despojos comestibles', descriptionEn: 'Meat and edible meat offal', notes: 'Carne de bovino, porcino, ovino, caprino, equino, aves', notesEn: 'Meat of bovine, swine, sheep, goats, horses, poultry' },
  { id: '03', sectionCode: 'I', code: '03', description: 'Pescados y crustáceos, moluscos', descriptionEn: 'Fish, crustaceans, molluscs', notes: 'Pescados vivos, frescos, congelados, crustáceos, moluscos', notesEn: 'Live, fresh, frozen fish, crustaceans, molluscs' },
  { id: '04', sectionCode: 'I', code: '04', description: 'Leche y productos lácteos; huevos; miel', descriptionEn: 'Dairy products; birds eggs; natural honey', notes: 'Leche, nata, yogur, quesos, huevos, miel natural', notesEn: 'Milk, cream, yogurt, cheese, eggs, natural honey' },
  { id: '05', sectionCode: 'I', code: '05', description: 'Los demás productos de origen animal', descriptionEn: 'Other products of animal origin', notes: 'Tripas, vejigas, cabellos, lanas, plumas, coral', notesEn: 'Gut, bladders, hair, wool, feathers, coral' },

  // Sección II: Productos del reino vegetal
  { id: '06', sectionCode: 'II', code: '06', description: 'Plantas vivas y productos de la floricultura', descriptionEn: 'Live trees and plants; bulbs; cut flowers', notes: 'Árboles, arbustos, plantas vivas, bulbos, flores cortadas', notesEn: 'Trees, shrubs, live plants, bulbs, cut flowers' },
  { id: '07', sectionCode: 'II', code: '07', description: 'Hortalizas, plantas, raíces y tubérculos', descriptionEn: 'Edible vegetables, roots and tubers', notes: 'Patatas, tomates, cebollas, coles, zanahorias, legumbres', notesEn: 'Potatoes, tomatoes, onions, cabbages, carrots, legumes' },
  { id: '08', sectionCode: 'II', code: '08', description: 'Frutas y frutos comestibles', descriptionEn: 'Edible fruit and nuts', notes: 'Cítricos, plátanos, dátiles, higos, piñas, uvas, melones', notesEn: 'Citrus fruits, bananas, dates, figs, pineapples, grapes, melons' },
  { id: '09', sectionCode: 'II', code: '09', description: 'Café, té, yerba mate y especias', descriptionEn: 'Coffee, tea, mate and spices', notes: 'Café, té, yerba mate, pimienta, vainilla, canela, clavo', notesEn: 'Coffee, tea, mate, pepper, vanilla, cinnamon, cloves' },
  { id: '10', sectionCode: 'II', code: '10', description: 'Cereales', descriptionEn: 'Cereals', notes: 'Trigo, centeno, cebada, avena, maíz, arroz, sorgo', notesEn: 'Wheat, rye, barley, oats, maize, rice, grain sorghum' },
  { id: '11', sectionCode: 'II', code: '11', description: 'Productos de la molinería; malta; almidón', descriptionEn: 'Products of milling industry; malt; starches', notes: 'Harinas, sémolas, copos, germen de cereales, malta', notesEn: 'Flours, meals, flakes, cereal germs, malt' },
  { id: '12', sectionCode: 'II', code: '12', description: 'Semillas oleaginosas; plantas industriales', descriptionEn: 'Oil seeds; miscellaneous grains; industrial plants', notes: 'Soja, cacahuetes, copra, lino, colza, girasol, algodón', notesEn: 'Soybeans, groundnuts, copra, flax, rapeseed, sunflower, cotton' },
  { id: '13', sectionCode: 'II', code: '13', description: 'Gomas, resinas y demás jugos vegetales', descriptionEn: 'Lac; gums, resins; vegetable saps and extracts', notes: 'Laca, gomas, resinas, jugos y extractos vegetales', notesEn: 'Lac, gums, resins, vegetable saps and extracts' },
  { id: '14', sectionCode: 'II', code: '14', description: 'Materias trenzables y productos vegetales', descriptionEn: 'Vegetable plaiting materials; vegetable products', notes: 'Bambú, ratán, junco, materias trenzables vegetales', notesEn: 'Bamboo, rattan, reed, vegetable plaiting materials' },

  // Sección III: Grasas y aceites
  { id: '15', sectionCode: 'III', code: '15', description: 'Grasas y aceites animales o vegetales', descriptionEn: 'Animal or vegetable fats and oils', notes: 'Aceite de oliva, aceites vegetales, margarina, grasas', notesEn: 'Olive oil, vegetable oils, margarine, animal fats' },

  // Sección IV: Productos de las industrias alimentarias
  { id: '16', sectionCode: 'IV', code: '16', description: 'Preparaciones de carne, pescado o crustáceos', descriptionEn: 'Preparations of meat, fish or crustaceans', notes: 'Embutidos, conservas de carne, pescado y mariscos', notesEn: 'Sausages, preserved meat, fish and seafood' },
  { id: '17', sectionCode: 'IV', code: '17', description: 'Azúcares y artículos de confitería', descriptionEn: 'Sugars and sugar confectionery', notes: 'Azúcar de caña, remolacha, caramelos, chocolate', notesEn: 'Cane sugar, beet sugar, candies, chocolate' },
  { id: '18', sectionCode: 'IV', code: '18', description: 'Cacao y sus preparaciones', descriptionEn: 'Cocoa and cocoa preparations', notes: 'Cacao en grano, pasta, polvo, manteca, chocolate', notesEn: 'Cocoa beans, paste, powder, butter, chocolate' },
  { id: '19', sectionCode: 'IV', code: '19', description: 'Preparaciones a base de cereales, harina', descriptionEn: 'Preparations of cereals, flour, starch', notes: 'Pan, galletas, pastas alimenticias, productos de panadería', notesEn: 'Bread, biscuits, pasta, bakery products' },
  { id: '20', sectionCode: 'IV', code: '20', description: 'Preparaciones de hortalizas, frutas', descriptionEn: 'Preparations of vegetables, fruits', notes: 'Conservas vegetales, mermeladas, jugos de frutas', notesEn: 'Preserved vegetables, jams, fruit juices' },
  { id: '21', sectionCode: 'IV', code: '21', description: 'Preparaciones alimenticias diversas', descriptionEn: 'Miscellaneous edible preparations', notes: 'Extractos, salsas, condimentos, preparados alimentarios', notesEn: 'Extracts, sauces, seasonings, food preparations' },
  { id: '22', sectionCode: 'IV', code: '22', description: 'Bebidas, líquidos alcohólicos y vinagre', descriptionEn: 'Beverages, spirits and vinegar', notes: 'Agua, bebidas, vinos, alcoholes, vinagre', notesEn: 'Water, beverages, wines, spirits, vinegar' },
  { id: '23', sectionCode: 'IV', code: '23', description: 'Residuos de las industrias alimentarias', descriptionEn: 'Residues from food industries; animal feed', notes: 'Residuos, desperdicios, alimentos para animales', notesEn: 'Residues, waste, animal feed' },
  { id: '24', sectionCode: 'IV', code: '24', description: 'Tabaco y sucedáneos del tabaco', descriptionEn: 'Tobacco and manufactured tobacco substitutes', notes: 'Tabaco en rama, elaborado, cigarrillos, puros', notesEn: 'Unmanufactured tobacco, cigarettes, cigars' },

  // Sección V: Productos minerales
  { id: '25', sectionCode: 'V', code: '25', description: 'Sal; azufre; tierras y piedras', descriptionEn: 'Salt; sulphur; earths and stone', notes: 'Sal común, azufre, tierras, piedras, yesos, cales', notesEn: 'Common salt, sulphur, earth, stone, plaster, lime' },
  { id: '26', sectionCode: 'V', code: '26', description: 'Minerales metalíferos, escorias y cenizas', descriptionEn: 'Ores, slag and ash', notes: 'Minerales de hierro, cobre, níquel, aluminio, plomo', notesEn: 'Iron, copper, nickel, aluminum, lead, zinc ores' },
  { id: '27', sectionCode: 'V', code: '27', description: 'Combustibles minerales, aceites minerales', descriptionEn: 'Mineral fuels, oils, distillation products', notes: 'Carbón, petróleo, gas, productos de destilación', notesEn: 'Coal, petroleum, gas, distillation products' },

  // Sección VI: Productos químicos
  { id: '28', sectionCode: 'VI', code: '28', description: 'Productos químicos inorgánicos', descriptionEn: 'Inorganic chemicals', notes: 'Elementos químicos, ácidos, bases, sales inorgánicas', notesEn: 'Chemical elements, acids, bases, inorganic salts' },
  { id: '29', sectionCode: 'VI', code: '29', description: 'Productos químicos orgánicos', descriptionEn: 'Organic chemicals', notes: 'Compuestos orgánicos, hidrocarburos, alcoholes', notesEn: 'Organic compounds, hydrocarbons, alcohols, acids' },
  { id: '30', sectionCode: 'VI', code: '30', description: 'Productos farmacéuticos', descriptionEn: 'Pharmaceutical products', notes: 'Medicamentos, productos farmacéuticos, botiquines', notesEn: 'Medicines, pharmaceutical products, first aid kits' },

  // Sección X: Materias textiles y sus manufacturas
  { id: '50', sectionCode: 'X', code: '50', description: 'Seda', descriptionEn: 'Silk', notes: 'Capullos de seda, seda cruda, hilados de seda', notesEn: 'Silk-worm cocoons, raw silk, silk yarn' },
  { id: '51', sectionCode: 'X', code: '51', description: 'Lana y pelo fino u ordinario', descriptionEn: 'Wool, fine or coarse animal hair', notes: 'Lana, pelos finos, hilados de lana', notesEn: 'Wool, fine animal hair, horsehair yarn' },
  { id: '52', sectionCode: 'X', code: '52', description: 'Algodón', descriptionEn: 'Cotton', notes: 'Algodón en rama, cardado, peinado, hilados', notesEn: 'Raw cotton, carded, combed cotton, cotton yarn' },
  { id: '53', sectionCode: 'X', code: '53', description: 'Las demás fibras textiles vegetales', descriptionEn: 'Other vegetable textile fibres', notes: 'Lino, cáñamo, yute, otras fibras vegetales', notesEn: 'Flax, hemp, jute, other vegetable textile fibres' },
  { id: '54', sectionCode: 'X', code: '54', description: 'Filamentos sintéticos o artificiales', descriptionEn: 'Man-made filaments', notes: 'Hilados de filamentos sintéticos, artificiales', notesEn: 'Synthetic filament yarn, artificial filament yarn' },
  { id: '55', sectionCode: 'X', code: '55', description: 'Fibras sintéticas o artificiales discontinuas', descriptionEn: 'Man-made staple fibres', notes: 'Fibras sintéticas discontinuas, hilados', notesEn: 'Synthetic staple fibres, artificial staple fibres' },
  { id: '56', sectionCode: 'X', code: '56', description: 'Guata, fieltro y telas sin tejer', descriptionEn: 'Wadding, felt and nonwovens', notes: 'Guata, fieltro, telas sin tejer, cuerdas', notesEn: 'Wadding, felt, nonwoven fabrics, twine, cordage' },
  { id: '57', sectionCode: 'X', code: '57', description: 'Alfombras y demás revestimientos del suelo', descriptionEn: 'Carpets and other textile floor coverings', notes: 'Alfombras, tapices, revestimientos textiles', notesEn: 'Carpets, rugs, mats, textile floor coverings' },
  { id: '58', sectionCode: 'X', code: '58', description: 'Tejidos especiales; superficies textiles', descriptionEn: 'Special woven fabrics; tufted textile fabrics', notes: 'Tejidos de terciopelo, rizo, etiquetas, bordados', notesEn: 'Woven pile fabrics, terry fabrics, labels, embroidery' },
  { id: '59', sectionCode: 'X', code: '59', description: 'Telas impregnadas, recubiertas, revestidas', descriptionEn: 'Impregnated, coated, covered textile fabrics', notes: 'Telas plastificadas, cauchotadas, enceradas', notesEn: 'Plastic-coated fabrics, rubberised fabrics' },
  { id: '60', sectionCode: 'X', code: '60', description: 'Tejidos de punto', descriptionEn: 'Knitted or crocheted fabrics', notes: 'Tejidos de punto de urdimbre, trama', notesEn: 'Knitted or crocheted fabrics, elastic or rubberised' },
  { id: '61', sectionCode: 'X', code: '61', description: 'Prendas y complementos de vestir, de punto', descriptionEn: 'Articles of apparel and clothing accessories, knitted', notes: 'Abrigos, vestidos, camisas, ropa interior de punto', notesEn: 'Overcoats, dresses, shirts, underwear, knitted' },
  { id: '62', sectionCode: 'X', code: '62', description: 'Prendas y complementos de vestir, excepto de punto', descriptionEn: 'Articles of apparel and clothing accessories, not knitted', notes: 'Abrigos, trajes, vestidos, camisas, pantalones', notesEn: 'Overcoats, suits, dresses, shirts, trousers, woven' },
  { id: '63', sectionCode: 'X', code: '63', description: 'Los demás artículos textiles confeccionados', descriptionEn: 'Other made-up textile articles', notes: 'Mantas, ropa de cama, cortinas, sacos, lonas', notesEn: 'Blankets, bed linen, curtains, sacks, tarpaulins' },

  // Secciones importantes para comercio internacional
  { id: '84', sectionCode: 'XV', code: '84', description: 'Reactores nucleares, calderas, máquinas', descriptionEn: 'Nuclear reactors, boilers, machinery', notes: 'Motores, bombas, compresores, máquinas industriales', notesEn: 'Engines, pumps, compressors, industrial machinery' },
  { id: '85', sectionCode: 'XV', code: '85', description: 'Máquinas, aparatos y material eléctrico', descriptionEn: 'Electrical machinery and equipment', notes: 'Generadores, transformadores, equipos eléctricos', notesEn: 'Generators, transformers, electrical, electronic equipment' },
  { id: '87', sectionCode: 'XVI', code: '87', description: 'Vehículos automóviles, tractores', descriptionEn: 'Vehicles other than railway', notes: 'Automóviles, camiones, motocicletas, tractores', notesEn: 'Motor cars, trucks, motorcycles, tractors' },
  { id: '88', sectionCode: 'XVI', code: '88', description: 'Aeronaves, vehículos espaciales', descriptionEn: 'Aircraft, spacecraft', notes: 'Aviones, helicópteros, vehículos espaciales', notesEn: 'Airplanes, helicopters, spacecraft' }
];

// Matrices de disponibilidad por país
// Define qué tipos de productos puede importar/exportar cada país efectivamente
export interface CountryProductMatrix {
  countryCode: string;
  capabilities: {
    canExport: string[]; // Secciones HS que el país puede exportar efectivamente
    canImport: string[]; // Secciones HS que el país puede importar
    restrictions: {
      sectionId: string;
      reason: string;
      reasonEn: string;
    }[];
    specialities: string[]; // Secciones donde el país es especialmente competitivo
  };
}

export const COUNTRY_PRODUCT_MATRICES: CountryProductMatrix[] = [
  // Argentina - Economía agrícola-ganadera con industria
  {
    countryCode: 'AR',
    capabilities: {
      canExport: ['I', 'II', 'III', 'IV', 'V', 'XIV'], // Animales, vegetales, aceites, alimentos, minerales, metales
      canImport: ['XV', 'XVI', 'VI', 'X', 'VII'], // Maquinaria, transporte, químicos, textiles, plásticos
      restrictions: [
        { sectionId: 'XVIII', reason: 'Restricciones en armas y municiones', reasonEn: 'Restrictions on arms and ammunition' }
      ],
      specialities: ['I', 'II', 'III', 'IV'] // Líder en carne, soja, trigo, lácteos
    }
  },
  // Brasil - Economía diversificada, líder agrícola y industrial
  {
    countryCode: 'BR', 
    capabilities: {
      canExport: ['I', 'II', 'III', 'IV', 'V', 'XIV', 'XV', 'XVI'], // Completa capacidad agroindustrial y manufacturera
      canImport: ['XV', 'XVI', 'VI', 'XVII'], // Tecnología, maquinaria, instrumentos ópticos
      restrictions: [],
      specialities: ['II', 'V', 'IV', 'XV'] // Soja, minerales, azúcar, maquinaria
    }
  },
  // Chile - Minería, frutas, vinos, salmón
  {
    countryCode: 'CL',
    capabilities: {
      canExport: ['V', 'II', 'IV', 'I', 'XIV'], // Minerales, frutas, vinos, salmón, metales
      canImport: ['XV', 'XVI', 'VI', 'X', 'VII'], // Maquinaria, vehículos, químicos, textiles
      restrictions: [],
      specialities: ['V', 'II', 'XIV'] // Cobre, frutas, metales
    }
  },
  // AMÉRICA DEL NORTE - MATRIZ DE CAPACIDADES COMERCIALES

  // Estados Unidos - Economía completamente diversificada
  {
    countryCode: 'US',
    capabilities: {
      canExport: ['XV', 'XVI', 'XVII', 'VI', 'V', 'IV', 'II', 'VIII'], // Tecnología, vehículos, instrumentos, químicos, aviación, energía
      canImport: ['XV', 'XVI', 'X', 'VI', 'I', 'II', 'V'], // Importa de todo globalmente
      restrictions: [
        { sectionId: 'XVIII', reason: 'Regulaciones estrictas en armas y municiones', reasonEn: 'Strict arms and ammunition regulations' }
      ],
      specialities: ['XV', 'XVI', 'XVII', 'VI'] // Tecnología, aeroespacial, instrumentos, químicos
    }
  },
  // Canadá - Recursos naturales, energía, tecnología
  {
    countryCode: 'CA',
    capabilities: {
      canExport: ['VIII', 'XIII', 'XIV', 'II', 'IV', 'XV'], // Energía (petróleo), oro, metales, cereales, alimentos, maquinaria
      canImport: ['XV', 'XVI', 'VI', 'X', 'XVII'], // Maquinaria, vehículos, químicos, textiles, instrumentos
      restrictions: [
        { sectionId: 'XVIII', reason: 'Regulaciones en armas y municiones', reasonEn: 'Arms and ammunition regulations' }
      ],
      specialities: ['VIII', 'XIII', 'II', 'XIV'] // Energía, oro, cereales, metales
    }
  },
  // México - Manufactura, automotriz, energía, agricultura
  {
    countryCode: 'MX',
    capabilities: {
      canExport: ['XVI', 'XV', 'VIII', 'II', 'X', 'V'], // Vehículos, maquinaria, petróleo, vegetales, textiles, minerales
      canImport: ['XV', 'XVI', 'VI', 'XVII', 'XIV'], // Maquinaria, vehículos, químicos, instrumentos, metales
      restrictions: [],
      specialities: ['XVI', 'XV', 'VIII'] // Automotriz, maquinaria, energía
    }
  },
  // China - Manufactura masiva, tecnología
  {
    countryCode: 'CN',
    capabilities: {
      canExport: ['XV', 'XVI', 'X', 'VII', 'XI', 'XII', 'XIX'], // Maquinaria, vehículos, textiles, plásticos, calzado, manufacturas
      canImport: ['V', 'IV', 'I', 'II'], // Materias primas, alimentos
      restrictions: [],
      specialities: ['XV', 'X', 'VII', 'XIX'] // Maquinaria, textiles, plásticos, manufacturas diversas
    }
  },
  // Alemania - Tecnología avanzada, maquinaria, automóviles
  {
    countryCode: 'DE',
    capabilities: {
      canExport: ['XV', 'XVI', 'XVII', 'VI'], // Maquinaria, vehículos, instrumentos, químicos
      canImport: ['V', 'IV', 'I', 'II'], // Materias primas, alimentos, productos vegetales
      restrictions: [
        { sectionId: 'XVIII', reason: 'Regulaciones UE en armas', reasonEn: 'EU arms regulations' }
      ],
      specialities: ['XV', 'XVI', 'VI'] // Maquinaria, automóviles, químicos
    }
  },
  // Perú - Minería, metales preciosos, productos agrícolas (CORRECCIÓN CRÍTICA PARA ORO)
  {
    countryCode: 'PE',
    capabilities: {
      canExport: ['V', 'XIII', 'XIV', 'II', 'I'], // Minerales, metales preciosos, metales comunes, vegetales, animales
      canImport: ['XV', 'XVI', 'VI', 'X'], // Maquinaria, vehículos, químicos, textiles
      restrictions: [],
      specialities: ['V', 'XIII'] // Minerales y metales preciosos (oro, plata)
    }
  },
  // Guyana - Oro, bauxita, azúcar, arroz (CORRECCIÓN CRÍTICA PARA ORO)
  {
    countryCode: 'GY',
    capabilities: {
      canExport: ['V', 'XIII', 'XIV', 'II'], // Minerales, metales preciosos, metales comunes, vegetales
      canImport: ['XV', 'XVI', 'VI', 'X', 'IV'], // Maquinaria, vehículos, químicos, textiles, alimentos
      restrictions: [],
      specialities: ['V', 'XIII'] // Minerales y metales preciosos (oro)
    }
  },
  // Suriname - Oro, bauxita, petróleo (CORRECCIÓN CRÍTICA PARA ORO)
  {
    countryCode: 'SR',
    capabilities: {
      canExport: ['V', 'XIII', 'XIV', 'VIII'], // Minerales, metales preciosos, metales comunes, combustibles
      canImport: ['XV', 'XVI', 'VI', 'X', 'IV'], // Maquinaria, vehículos, químicos, textiles, alimentos
      restrictions: [],
      specialities: ['V', 'XIII'] // Minerales y metales preciosos (oro)
    }
  },
  // Guayana Francesa - Oro, silvicultura (CORRECCIÓN CRÍTICA PARA ORO)
  {
    countryCode: 'GF',
    capabilities: {
      canExport: ['V', 'XIII', 'IX'], // Minerales, metales preciosos, productos forestales
      canImport: ['XV', 'XVI', 'VI', 'X', 'IV'], // Maquinaria, vehículos, químicos, textiles, alimentos
      restrictions: [],
      specialities: ['V', 'XIII'] // Minerales y metales preciosos (oro)
    }
  },
  // Colombia - Café, petróleo, carbón, flores (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'CO',
    capabilities: {
      canExport: ['II', 'VIII', 'V', 'VI'], // Vegetales (café), combustibles, minerales, químicos
      canImport: ['XV', 'XVI', 'VI', 'X'], // Maquinaria, vehículos, químicos, textiles
      restrictions: [],
      specialities: ['II', 'VIII'] // Café y petróleo
    }
  },
  // Ecuador - Banano, petróleo, camarones, cacao (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'EC',
    capabilities: {
      canExport: ['II', 'VIII', 'I'], // Vegetales (banano), combustibles, animales (camarones)
      canImport: ['XV', 'XVI', 'VI', 'X'], // Maquinaria, vehículos, químicos, textiles
      restrictions: [],
      specialities: ['II', 'VIII'] // Banano y petróleo
    }
  },
  // Uruguay - Carne, soja, lácteos, lana (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'UY',
    capabilities: {
      canExport: ['I', 'II', 'IV', 'X'], // Animales (carne), vegetales (soja), alimentos (lácteos), textiles (lana)
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['I', 'II', 'IV'] // Ganadería, soja, alimentos
    }
  },
  // Paraguay - Soja, carne, electricidad (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'PY',
    capabilities: {
      canExport: ['II', 'I', 'XVII'], // Vegetales (soja), animales (carne), energía eléctrica
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'I'] // Soja y ganadería
    }
  },
  // Bolivia - Gas natural, zinc, plata, estaño (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'BO',
    capabilities: {
      canExport: ['VIII', 'V', 'XIII'], // Combustibles (gas), minerales, metales preciosos
      canImport: ['XV', 'XVI', 'VI', 'IV'], // Maquinaria, vehículos, químicos, alimentos
      restrictions: [],
      specialities: ['VIII', 'V'] // Gas natural y minerales
    }
  },
  // Venezuela - Petróleo, bauxita, hierro (COMPLETANDO AMÉRICA DEL SUR)
  {
    countryCode: 'VE',
    capabilities: {
      canExport: ['VIII', 'V'], // Combustibles, minerales
      canImport: ['XV', 'XVI', 'VI', 'IV'], // Maquinaria, vehículos, químicos, alimentos
      restrictions: [
        { sectionId: 'XV', reason: 'Sanciones limitan importación de tecnología', reasonEn: 'Sanctions limit technology imports' },
        { sectionId: 'XVII', reason: 'Restricciones en instrumentos de precisión', reasonEn: 'Restrictions on precision instruments' }
      ],
      specialities: ['VIII'] // Petróleo
    }
  },

  // AMÉRICA CENTRAL - MATRIZ DE CAPACIDADES COMERCIALES

  // Guatemala - Café, azúcar, textiles, cardamomo
  {
    countryCode: 'GT',
    capabilities: {
      canExport: ['II', 'IV', 'X'], // Vegetales (café), alimentos (azúcar), textiles
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'IV'] // Café y azúcar
    }
  },
  // El Salvador - Café, textiles, azúcar
  {
    countryCode: 'SV',
    capabilities: {
      canExport: ['II', 'X', 'IV'], // Vegetales (café), textiles, alimentos (azúcar)
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'X'] // Café y textiles
    }
  },
  // Honduras - Café, banano, textiles
  {
    countryCode: 'HN',
    capabilities: {
      canExport: ['II', 'X'], // Vegetales (café, banano), textiles
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'X'] // Café, banano y textiles
    }
  },
  // Nicaragua - Café, carne, textiles
  {
    countryCode: 'NI',
    capabilities: {
      canExport: ['II', 'I', 'X'], // Vegetales (café), animales (carne), textiles
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'I'] // Café y ganadería
    }
  },
  // Costa Rica - Banano, café, textiles, electrónicos
  {
    countryCode: 'CR',
    capabilities: {
      canExport: ['II', 'X', 'XV'], // Vegetales (banano, café), textiles, electrónicos
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['II', 'XV'] // Agricultura y electrónicos
    }
  },
  // Panamá - Banano, camarones, reexportaciones
  {
    countryCode: 'PA',
    capabilities: {
      canExport: ['II', 'I'], // Vegetales (banano), animales (camarones)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'XIX'], // Maquinaria, vehículos, químicos, combustibles, reexportaciones
      restrictions: [],
      specialities: ['II', 'XIX'] // Agricultura y servicios logísticos
    }
  },
  // Belice - Azúcar, banano, cítricos
  {
    countryCode: 'BZ',
    capabilities: {
      canExport: ['IV', 'II'], // Alimentos (azúcar), vegetales (banano, cítricos)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['IV', 'II'] // Azúcar y frutas tropicales
    }
  },

  // CARIBE - MATRIZ DE CAPACIDADES COMERCIALES

  // República Dominicana - Textiles, azúcar, tabaco (ya verificada parcialmente en CAFTA-DR)
  {
    countryCode: 'DO',
    capabilities: {
      canExport: ['X', 'IV', 'VII'], // Textiles, alimentos (azúcar), tabaco
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['X', 'IV'] // Textiles y azúcar
    }
  },
  // Jamaica - Bauxita, azúcar, bananos
  {
    countryCode: 'JM',
    capabilities: {
      canExport: ['V', 'IV', 'II'], // Minerales (bauxita), alimentos (azúcar), vegetales (banano)
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['V', 'IV'] // Bauxita y azúcar
    }
  },
  // Trinidad y Tobago - Petróleo, gas, químicos
  {
    countryCode: 'TT',
    capabilities: {
      canExport: ['VIII', 'VI'], // Combustibles (petróleo, gas), químicos
      canImport: ['XV', 'XVI', 'IV'], // Maquinaria, vehículos, alimentos
      restrictions: [],
      specialities: ['VIII', 'VI'] // Petróleo y químicos
    }
  },
  // Barbados - Azúcar, ron, químicos
  {
    countryCode: 'BB',
    capabilities: {
      canExport: ['IV', 'VI'], // Alimentos (azúcar, ron), químicos
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['IV', 'VI'] // Alimentos procesados y químicos
    }
  },
  // Bahamas - Farmacéuticos, reexportaciones
  {
    countryCode: 'BS',
    capabilities: {
      canExport: ['VI', 'XIX'], // Químicos (farmacéuticos), servicios (reexportaciones)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['VI', 'XIX'] // Farmacéuticos y servicios financieros
    }
  },
  // Haití - Textiles, café
  {
    countryCode: 'HT',
    capabilities: {
      canExport: ['X', 'II'], // Textiles, vegetales (café)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [
        { sectionId: 'XVII', reason: 'Limitaciones en instrumentos de precisión', reasonEn: 'Limitations on precision instruments' }
      ],
      specialities: ['X', 'II'] // Textiles y café
    }
  },
  // Antigua y Barbuda - Turismo, textiles
  {
    countryCode: 'AG',
    capabilities: {
      canExport: ['X', 'XIX'], // Textiles, servicios (turismo)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['XIX', 'X'] // Turismo y textiles
    }
  },
  // Dominica - Bananos, jabón
  {
    countryCode: 'DM',
    capabilities: {
      canExport: ['II', 'VI'], // Vegetales (banano), químicos (jabón)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['II', 'VI'] // Agricultura y productos químicos básicos
    }
  },
  // Granada - Nuez moscada, cacao
  {
    countryCode: 'GD',
    capabilities: {
      canExport: ['II'], // Vegetales (especias, cacao)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['II'] // Especias y agricultura tropical
    }
  },
  // San Cristóbal y Nieves - Azúcar, textiles
  {
    countryCode: 'KN',
    capabilities: {
      canExport: ['IV', 'X'], // Alimentos (azúcar), textiles
      canImport: ['XV', 'XVI', 'VI', 'VIII'], // Maquinaria, vehículos, químicos, combustibles
      restrictions: [],
      specialities: ['IV', 'X'] // Azúcar y textiles
    }
  },
  // Santa Lucía - Bananos, textiles
  {
    countryCode: 'LC',
    capabilities: {
      canExport: ['II', 'X'], // Vegetales (banano), textiles
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['II', 'X'] // Agricultura y textiles
    }
  },
  // San Vicente y las Granadinas - Bananos, arrurruz
  {
    countryCode: 'VC',
    capabilities: {
      canExport: ['II'], // Vegetales (banano, arrurruz)
      canImport: ['XV', 'XVI', 'VI', 'VIII', 'IV'], // Maquinaria, vehículos, químicos, combustibles, alimentos
      restrictions: [],
      specialities: ['II'] // Agricultura tropical
    }
  }
];

// Función para verificar si un país puede comercializar productos de una sección
export function canCountryTradeSection(
  countryCode: string, 
  sectionId: string, 
  operation: 'import' | 'export'
): { allowed: boolean; reason?: string; reasonEn?: string } {
  const matrix = COUNTRY_PRODUCT_MATRICES.find(m => m.countryCode === countryCode);
  
  if (!matrix) {
    // Si no hay matriz específica, permitir comercio básico pero avisar
    return { 
      allowed: true, 
      reason: 'Capacidades comerciales no especificadas para este país',
      reasonEn: 'Trade capabilities not specified for this country'
    };
  }

  // Verificar restricciones específicas
  const restriction = matrix.capabilities.restrictions.find(r => r.sectionId === sectionId);
  if (restriction) {
    return {
      allowed: false,
      reason: restriction.reason,
      reasonEn: restriction.reasonEn
    };
  }

  // Verificar capacidades
  const capabilities = operation === 'export' 
    ? matrix.capabilities.canExport 
    : matrix.capabilities.canImport;
    
  const allowed = capabilities.includes(sectionId);
  
  if (!allowed) {
    return {
      allowed: false,
      reason: operation === 'export' 
        ? 'El país no tiene capacidad exportadora significativa en esta categoría'
        : 'El país tiene restricciones para importar esta categoría',
      reasonEn: operation === 'export'
        ? 'Country does not have significant export capacity in this category'
        : 'Country has restrictions for importing this category'
    };
  }

  return { allowed: true };
}

// Función para obtener especialidades de un país
export function getCountrySpecialities(countryCode: string): string[] {
  const matrix = COUNTRY_PRODUCT_MATRICES.find(m => m.countryCode === countryCode);
  return matrix?.capabilities.specialities || [];
}

// Función para obtener recomendaciones comerciales entre países
export function getTradeRecommendations(
  exporterCode: string, 
  importerCode: string
): {
  recommended: string[];
  compatible: string[];
  restricted: string[];
} {
  const exporterMatrix = COUNTRY_PRODUCT_MATRICES.find(m => m.countryCode === exporterCode);
  const importerMatrix = COUNTRY_PRODUCT_MATRICES.find(m => m.countryCode === importerCode);
  
  if (!exporterMatrix || !importerMatrix) {
    return { recommended: [], compatible: [], restricted: [] };
  }

  const recommended = exporterMatrix.capabilities.specialities.filter(sectionId =>
    importerMatrix.capabilities.canImport.includes(sectionId)
  );

  const compatible = exporterMatrix.capabilities.canExport.filter(sectionId =>
    importerMatrix.capabilities.canImport.includes(sectionId) &&
    !recommended.includes(sectionId)
  );

  const exporterRestricted = exporterMatrix.capabilities.restrictions.map(r => r.sectionId);
  const importerRestricted = importerMatrix.capabilities.restrictions.map(r => r.sectionId);
  const restrictedSet = new Set([...exporterRestricted, ...importerRestricted]);
  const restricted = Array.from(restrictedSet);

  return { recommended, compatible, restricted };
}