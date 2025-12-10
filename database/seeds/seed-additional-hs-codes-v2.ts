import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: CÓDIGOS HS ADICIONALES (Textiles, Minerales, Químicos) ===');

// Códigos HS adicionales - Siguiendo el formato del seed existente
const ADDITIONAL_HS_CODES = [
  // TEXTILES (Capítulos 50-63) - 50 códigos
  { code: '5001', chapter: '50', description: 'Capullos de seda aptos para el devanado', descriptionEn: 'Silkworm cocoons suitable for reeling', keywords: ['seda', 'capullos', 'silk'] },
  { code: '5002', chapter: '50', description: 'Seda cruda (sin torcer)', descriptionEn: 'Raw silk (not thrown)', keywords: ['seda', 'cruda', 'raw silk'] },
  { code: '5101', chapter: '51', description: 'Lana sin cardar ni peinar', descriptionEn: 'Wool, not carded or combed', keywords: ['lana', 'wool'] },
  { code: '5102', chapter: '51', description: 'Pelo fino u ordinario, sin cardar ni peinar', descriptionEn: 'Fine or coarse animal hair, not carded or combed', keywords: ['pelo', 'animal', 'hair'] },
  { code: '5201', chapter: '52', description: 'Algodón sin cardar ni peinar', descriptionEn: 'Cotton, not carded or combed', keywords: ['algodón', 'cotton'] },
  { code: '5202', chapter: '52', description: 'Desperdicios de algodón', descriptionEn: 'Cotton waste', keywords: ['algodón', 'desperdicios', 'cotton waste'] },
  { code: '5301', chapter: '53', description: 'Lino en bruto o enriado', descriptionEn: 'Flax, raw or retted', keywords: ['lino', 'flax'] },
  { code: '5302', chapter: '53', description: 'Cáñamo en bruto o enriado', descriptionEn: 'Hemp, raw or retted', keywords: ['cáñamo', 'hemp'] },
  { code: '5401', chapter: '54', description: 'Hilo de coser de filamentos sintéticos o artificiales', descriptionEn: 'Sewing thread of man-made filaments', keywords: ['hilo', 'sintético', 'thread'] },
  { code: '5402', chapter: '54', description: 'Hilados de filamentos sintéticos', descriptionEn: 'Synthetic filament yarn', keywords: ['hilados', 'sintéticos', 'yarn'] },
  { code: '5501', chapter: '55', description: 'Cables de filamentos sintéticos', descriptionEn: 'Synthetic staple fibres', keywords: ['fibras', 'sintéticas', 'synthetic'] },
  { code: '5502', chapter: '55', description: 'Cables de filamentos artificiales', descriptionEn: 'Artificial staple fibres', keywords: ['fibras', 'artificiales', 'artificial'] },
  { code: '5601', chapter: '56', description: 'Guata de materia textil', descriptionEn: 'Wadding of textile materials', keywords: ['guata', 'wadding'] },
  { code: '5602', chapter: '56', description: 'Fieltro', descriptionEn: 'Felt', keywords: ['fieltro', 'felt'] },
  { code: '5701', chapter: '57', description: 'Alfombras de nudo', descriptionEn: 'Carpets and rugs, knotted', keywords: ['alfombras', 'carpets', 'rugs'] },
  { code: '5702', chapter: '57', description: 'Alfombras tejidas', descriptionEn: 'Carpets and rugs, woven', keywords: ['alfombras', 'tejidas', 'woven carpets'] },
  { code: '5801', chapter: '58', description: 'Terciopelo y felpa', descriptionEn: 'Woven pile fabrics and chenille fabrics', keywords: ['terciopelo', 'felpa', 'velvet'] },
  { code: '5802', chapter: '58', description: 'Tejidos de rizo', descriptionEn: 'Terry towelling and similar woven terry fabrics', keywords: ['rizo', 'toallas', 'terry'] },
  { code: '5901', chapter: '59', description: 'Telas recubiertas de cola o materias amiláceas', descriptionEn: 'Textile fabrics coated with gum', keywords: ['telas', 'recubiertas', 'coated'] },
  { code: '5902', chapter: '59', description: 'Napas tramadas para neumáticos', descriptionEn: 'Tyre cord fabric', keywords: ['neumáticos', 'tyre cord'] },
  { code: '6001', chapter: '60', description: 'Terciopelo, felpa y tejidos de punto', descriptionEn: 'Pile fabrics, knitted or crocheted', keywords: ['punto', 'terciopelo', 'knitted'] },
  { code: '6002', chapter: '60', description: 'Tejidos de punto de anchura <= 30 cm', descriptionEn: 'Knitted fabrics of width <= 30 cm', keywords: ['punto', 'tejidos', 'knitted'] },
  { code: '6101', chapter: '61', description: 'Abrigos, chaquetones, capas de punto', descriptionEn: 'Overcoats, knitted or crocheted', keywords: ['abrigos', 'punto', 'overcoats'] },
  { code: '6102', chapter: '61', description: 'Abrigos para mujeres o niñas, de punto', descriptionEn: 'Women\'s overcoats, knitted', keywords: ['abrigos', 'mujeres', 'women overcoats'] },
  { code: '6103', chapter: '61', description: 'Trajes, conjuntos para hombres, de punto', descriptionEn: 'Men\'s suits, knitted', keywords: ['trajes', 'hombres', 'suits'] },
  { code: '6104', chapter: '61', description: 'Trajes sastre, conjuntos para mujeres, de punto', descriptionEn: 'Women\'s suits, knitted', keywords: ['trajes', 'mujeres', 'women suits'] },
  { code: '6105', chapter: '61', description: 'Camisas de punto para hombres', descriptionEn: 'Men\'s shirts, knitted', keywords: ['camisas', 'hombres', 'shirts'] },
  { code: '6106', chapter: '61', description: 'Camisas, blusas de punto para mujeres', descriptionEn: 'Women\'s blouses, knitted', keywords: ['blusas', 'mujeres', 'blouses'] },
  { code: '6107', chapter: '61', description: 'Calzoncillos, slips de punto', descriptionEn: 'Men\'s underpants, knitted', keywords: ['calzoncillos', 'ropa interior', 'underwear'] },
  { code: '6108', chapter: '61', description: 'Combinaciones, enaguas de punto', descriptionEn: 'Women\'s slips, knitted', keywords: ['combinaciones', 'ropa interior', 'slips'] },
  { code: '6109', chapter: '61', description: 'Camisetas de punto', descriptionEn: 'T-shirts, knitted', keywords: ['camisetas', 't-shirts'] },
  { code: '6110', chapter: '61', description: 'Suéteres, pulóveres de punto', descriptionEn: 'Sweaters, pullovers, knitted', keywords: ['suéteres', 'pulóveres', 'sweaters'] },
  { code: '6201', chapter: '62', description: 'Abrigos, chaquetones, capas (no de punto)', descriptionEn: 'Overcoats, not knitted', keywords: ['abrigos', 'overcoats'] },
  { code: '6202', chapter: '62', description: 'Abrigos para mujeres (no de punto)', descriptionEn: 'Women\'s overcoats, not knitted', keywords: ['abrigos', 'mujeres', 'women'] },
  { code: '6203', chapter: '62', description: 'Trajes, conjuntos para hombres (no de punto)', descriptionEn: 'Men\'s suits, not knitted', keywords: ['trajes', 'hombres', 'suits'] },
  { code: '6204', chapter: '62', description: 'Trajes sastre para mujeres (no de punto)', descriptionEn: 'Women\'s suits, not knitted', keywords: ['trajes', 'mujeres', 'women suits'] },
  { code: '6205', chapter: '62', description: 'Camisas para hombres (no de punto)', descriptionEn: 'Men\'s shirts, not knitted', keywords: ['camisas', 'hombres', 'shirts'] },
  { code: '6206', chapter: '62', description: 'Camisas, blusas para mujeres (no de punto)', descriptionEn: 'Women\'s blouses, not knitted', keywords: ['blusas', 'mujeres', 'blouses'] },
  { code: '6207', chapter: '62', description: 'Camisetas, calzoncillos (no de punto)', descriptionEn: 'Men\'s underpants, not knitted', keywords: ['calzoncillos', 'ropa interior', 'underwear'] },
  { code: '6208', chapter: '62', description: 'Camisetas, combinaciones (no de punto)', descriptionEn: 'Women\'s slips, not knitted', keywords: ['combinaciones', 'ropa interior', 'slips'] },
  { code: '6209', chapter: '62', description: 'Prendas de vestir para bebés', descriptionEn: 'Babies\' garments', keywords: ['bebés', 'ropa', 'babies'] },
  { code: '6210', chapter: '62', description: 'Prendas confeccionadas con telas de las partidas 56.02 o 56.03', descriptionEn: 'Garments made up of fabrics', keywords: ['prendas', 'confeccionadas', 'garments'] },
  { code: '6211', chapter: '62', description: 'Conjuntos de abrigo para entrenamiento o deporte', descriptionEn: 'Track suits, ski suits', keywords: ['deportiva', 'ropa', 'sportswear'] },
  { code: '6212', chapter: '62', description: 'Sostenes, fajas, corsés', descriptionEn: 'Bras, girdles, corsets', keywords: ['sostenes', 'ropa interior', 'bras'] },
  { code: '6213', chapter: '62', description: 'Pañuelos de bolsillo', descriptionEn: 'Handkerchiefs', keywords: ['pañuelos', 'handkerchiefs'] },
  { code: '6214', chapter: '62', description: 'Chales, pañuelos de cuello, bufandas', descriptionEn: 'Shawls, scarves', keywords: ['chales', 'bufandas', 'scarves'] },
  { code: '6215', chapter: '62', description: 'Corbatas y lazos similares', descriptionEn: 'Ties, bow ties', keywords: ['corbatas', 'ties'] },
  { code: '6216', chapter: '62', description: 'Guantes, mitones y manoplas', descriptionEn: 'Gloves, mittens', keywords: ['guantes', 'gloves'] },
  { code: '6217', chapter: '62', description: 'Complementos de vestir confeccionados', descriptionEn: 'Made up clothing accessories', keywords: ['accesorios', 'vestir', 'accessories'] },
  { code: '6301', chapter: '63', description: 'Mantas', descriptionEn: 'Blankets', keywords: ['mantas', 'frazadas', 'blankets'] },

  // MINERALES (Capítulos 25-27) - 30 códigos
  { code: '2501', chapter: '25', description: 'Sal (incluida la de mesa y la desnaturalizada)', descriptionEn: 'Salt', keywords: ['sal', 'salt'] },
  { code: '2502', chapter: '25', description: 'Piritas de hierro sin tostar', descriptionEn: 'Unroasted iron pyrites', keywords: ['piritas', 'hierro', 'pyrites'] },
  { code: '2503', chapter: '25', description: 'Azufre de cualquier clase', descriptionEn: 'Sulphur of all kinds', keywords: ['azufre', 'sulphur'] },
  { code: '2504', chapter: '25', description: 'Grafito natural', descriptionEn: 'Natural graphite', keywords: ['grafito', 'graphite'] },
  { code: '2505', chapter: '25', description: 'Arenas naturales de cualquier clase', descriptionEn: 'Natural sands of all kinds', keywords: ['arena', 'sand'] },
  { code: '2506', chapter: '25', description: 'Cuarzo', descriptionEn: 'Quartz', keywords: ['cuarzo', 'quartz'] },
  { code: '2507', chapter: '25', description: 'Caolín y demás arcillas caolínicas', descriptionEn: 'Kaolin and other kaolinic clays', keywords: ['caolín', 'arcilla', 'kaolin'] },
  { code: '2508', chapter: '25', description: 'Arcillas (excepto las arcillas dilatadas de la partida 68.06)', descriptionEn: 'Other clays', keywords: ['arcilla', 'clay'] },
  { code: '2509', chapter: '25', description: 'Creta', descriptionEn: 'Chalk', keywords: ['creta', 'tiza', 'chalk'] },
  { code: '2510', chapter: '25', description: 'Fosfatos de calcio naturales', descriptionEn: 'Natural calcium phosphates', keywords: ['fosfatos', 'calcio', 'phosphates'] },
  { code: '2511', chapter: '25', description: 'Sulfato de bario natural (baritina)', descriptionEn: 'Natural barium sulphate', keywords: ['baritina', 'bario', 'barite'] },
  { code: '2512', chapter: '25', description: 'Harinas silíceas fósiles', descriptionEn: 'Siliceous fossil meals', keywords: ['harinas', 'silíceas', 'siliceous'] },
  { code: '2513', chapter: '25', description: 'Piedra pómez; esmeril; corindón natural', descriptionEn: 'Pumice stone; emery; natural corundum', keywords: ['piedra pómez', 'esmeril', 'pumice'] },
  { code: '2514', chapter: '25', description: 'Pizarra', descriptionEn: 'Slate', keywords: ['pizarra', 'slate'] },
  { code: '2515', chapter: '25', description: 'Mármol, travertinos, alabastro', descriptionEn: 'Marble, travertine, alabaster', keywords: ['mármol', 'marble'] },
  { code: '2516', chapter: '25', description: 'Granito, pórfido, basalto, arenisca', descriptionEn: 'Granite, porphyry, basalt, sandstone', keywords: ['granito', 'granite'] },
  { code: '2517', chapter: '25', description: 'Cantos, grava, piedras trituradas', descriptionEn: 'Pebbles, gravel, crushed stone', keywords: ['grava', 'piedra', 'gravel'] },
  { code: '2518', chapter: '25', description: 'Dolomita', descriptionEn: 'Dolomite', keywords: ['dolomita', 'dolomite'] },
  { code: '2519', chapter: '25', description: 'Carbonato de magnesio natural (magnesita)', descriptionEn: 'Natural magnesium carbonate', keywords: ['magnesita', 'magnesio', 'magnesite'] },
  { code: '2520', chapter: '25', description: 'Yeso; anhidrita; cales', descriptionEn: 'Gypsum; anhydrite; plasters', keywords: ['yeso', 'gypsum'] },
  { code: '2521', chapter: '25', description: 'Castinas; piedras para la fabricación de cal o cemento', descriptionEn: 'Limestone flux; limestone for lime or cement', keywords: ['caliza', 'limestone'] },
  { code: '2522', chapter: '25', description: 'Cal viva, apagada e hidráulica', descriptionEn: 'Quicklime, slaked lime and hydraulic lime', keywords: ['cal', 'lime'] },
  { code: '2523', chapter: '25', description: 'Cemento Portland, cemento aluminoso', descriptionEn: 'Portland cement, aluminous cement', keywords: ['cemento', 'cement'] },
  { code: '2524', chapter: '25', description: 'Amianto (asbesto)', descriptionEn: 'Asbestos', keywords: ['amianto', 'asbesto', 'asbestos'] },
  { code: '2525', chapter: '25', description: 'Mica', descriptionEn: 'Mica', keywords: ['mica'] },
  { code: '2526', chapter: '25', description: 'Esteatita natural', descriptionEn: 'Natural steatite', keywords: ['esteatita', 'talco', 'steatite'] },
  { code: '2601', chapter: '26', description: 'Minerales de hierro y sus concentrados', descriptionEn: 'Iron ores and concentrates', keywords: ['hierro', 'mineral', 'iron ore'] },
  { code: '2602', chapter: '26', description: 'Minerales de manganeso y sus concentrados', descriptionEn: 'Manganese ores and concentrates', keywords: ['manganeso', 'manganese'] },
  { code: '2603', chapter: '26', description: 'Minerales de cobre y sus concentrados', descriptionEn: 'Copper ores and concentrates', keywords: ['cobre', 'copper ore'] },
  { code: '2604', chapter: '26', description: 'Minerales de níquel y sus concentrados', descriptionEn: 'Nickel ores and concentrates', keywords: ['níquel', 'nickel'] },

  // QUÍMICOS (Capítulos 28-29) - 40 códigos
  { code: '2801', chapter: '28', description: 'Flúor, cloro, bromo y yodo', descriptionEn: 'Fluorine, chlorine, bromine and iodine', keywords: ['flúor', 'cloro', 'fluorine', 'chlorine'] },
  { code: '2802', chapter: '28', description: 'Azufre sublimado o precipitado', descriptionEn: 'Sulphur, sublimed or precipitated', keywords: ['azufre', 'sulphur'] },
  { code: '2803', chapter: '28', description: 'Carbono (negros de humo y otras formas)', descriptionEn: 'Carbon (carbon blacks)', keywords: ['carbono', 'carbon black'] },
  { code: '2804', chapter: '28', description: 'Hidrógeno, gases nobles', descriptionEn: 'Hydrogen, rare gases', keywords: ['hidrógeno', 'hydrogen'] },
  { code: '2805', chapter: '28', description: 'Metales alcalinos o alcalinotérreos', descriptionEn: 'Alkali or alkaline-earth metals', keywords: ['metales', 'alcalinos', 'alkali'] },
  { code: '2806', chapter: '28', description: 'Cloruro de hidrógeno (ácido clorhídrico)', descriptionEn: 'Hydrogen chloride (hydrochloric acid)', keywords: ['ácido', 'clorhídrico', 'hydrochloric'] },
  { code: '2807', chapter: '28', description: 'Ácido sulfúrico; óleum', descriptionEn: 'Sulphuric acid; oleum', keywords: ['ácido', 'sulfúrico', 'sulphuric'] },
  { code: '2808', chapter: '28', description: 'Ácido nítrico; ácidos sulfonítricos', descriptionEn: 'Nitric acid; sulphonitric acids', keywords: ['ácido', 'nítrico', 'nitric'] },
  { code: '2809', chapter: '28', description: 'Pentóxido de difósforo; ácido fosfórico', descriptionEn: 'Diphosphorus pentaoxide; phosphoric acid', keywords: ['ácido', 'fosfórico', 'phosphoric'] },
  { code: '2810', chapter: '28', description: 'Óxidos de boro; ácidos bóricos', descriptionEn: 'Oxides of boron; boric acids', keywords: ['boro', 'ácido bórico', 'boric'] },
  { code: '2811', chapter: '28', description: 'Otros ácidos inorgánicos', descriptionEn: 'Other inorganic acids', keywords: ['ácidos', 'inorgánicos', 'acids'] },
  { code: '2812', chapter: '28', description: 'Halogenuros y oxihalogenuros de los no metales', descriptionEn: 'Halides and halide oxides of non-metals', keywords: ['halogenuros', 'halides'] },
  { code: '2813', chapter: '28', description: 'Sulfuros de los no metales', descriptionEn: 'Sulphides of non-metals', keywords: ['sulfuros', 'sulphides'] },
  { code: '2814', chapter: '28', description: 'Amoníaco anhidro o en disolución acuosa', descriptionEn: 'Ammonia, anhydrous or in aqueous solution', keywords: ['amoníaco', 'ammonia'] },
  { code: '2815', chapter: '28', description: 'Hidróxido de sodio (sosa o soda cáustica)', descriptionEn: 'Sodium hydroxide (caustic soda)', keywords: ['soda', 'cáustica', 'caustic soda'] },
  { code: '2816', chapter: '28', description: 'Hidróxido y peróxido de magnesio', descriptionEn: 'Hydroxide and peroxide of magnesium', keywords: ['hidróxido', 'magnesio', 'hydroxide'] },
  { code: '2817', chapter: '28', description: 'Óxido de cinc; peróxido de cinc', descriptionEn: 'Zinc oxide; zinc peroxide', keywords: ['óxido', 'cinc', 'zinc oxide'] },
  { code: '2818', chapter: '28', description: 'Corindón artificial', descriptionEn: 'Artificial corundum', keywords: ['corindón', 'artificial', 'corundum'] },
  { code: '2819', chapter: '28', description: 'Óxidos e hidróxidos de cromo', descriptionEn: 'Chromium oxides and hydroxides', keywords: ['cromo', 'óxidos', 'chromium'] },
  { code: '2820', chapter: '28', description: 'Óxidos de manganeso', descriptionEn: 'Manganese oxides', keywords: ['manganeso', 'óxidos', 'manganese'] },
  { code: '2821', chapter: '28', description: 'Óxidos e hidróxidos de hierro', descriptionEn: 'Iron oxides and hydroxides', keywords: ['hierro', 'óxidos', 'iron oxide'] },
  { code: '2822', chapter: '28', description: 'Óxidos e hidróxidos de cobalto', descriptionEn: 'Cobalt oxides and hydroxides', keywords: ['cobalto', 'óxidos', 'cobalt'] },
  { code: '2823', chapter: '28', description: 'Óxidos de titanio', descriptionEn: 'Titanium oxides', keywords: ['titanio', 'óxidos', 'titanium'] },
  { code: '2824', chapter: '28', description: 'Óxidos de plomo', descriptionEn: 'Lead oxides', keywords: ['plomo', 'óxidos', 'lead oxide'] },
  { code: '2825', chapter: '28', description: 'Hidrazina e hidroxilamina', descriptionEn: 'Hydrazine and hydroxylamine', keywords: ['hidrazina', 'hydrazine'] },
  { code: '2826', chapter: '28', description: 'Fluoruros; fluorosilicatos', descriptionEn: 'Fluorides; fluorosilicates', keywords: ['fluoruros', 'fluorides'] },
  { code: '2827', chapter: '28', description: 'Cloruros, oxicloruros e hidroxicloruros', descriptionEn: 'Chlorides, oxychlorides and hydroxychlorides', keywords: ['cloruros', 'chlorides'] },
  { code: '2828', chapter: '28', description: 'Hipocloritos; hipoclorito de calcio comercial', descriptionEn: 'Hypochlorites; commercial calcium hypochlorite', keywords: ['hipocloritos', 'hypochlorites'] },
  { code: '2829', chapter: '28', description: 'Cloratos y percloratos', descriptionEn: 'Chlorates and perchlorates', keywords: ['cloratos', 'chlorates'] },
  { code: '2830', chapter: '28', description: 'Sulfuros; polisulfuros', descriptionEn: 'Sulphides; polysulphides', keywords: ['sulfuros', 'sulphides'] },
  { code: '2831', chapter: '28', description: 'Ditionitos y sulfoxilatos', descriptionEn: 'Dithionites and sulphoxylates', keywords: ['ditionitos', 'dithionites'] },
  { code: '2832', chapter: '28', description: 'Sulfitos; tiosulfatos', descriptionEn: 'Sulphites; thiosulphates', keywords: ['sulfitos', 'sulphites'] },
  { code: '2833', chapter: '28', description: 'Sulfatos; alumbres; peroxosulfatos', descriptionEn: 'Sulphates; alums; peroxosulphates', keywords: ['sulfatos', 'sulphates'] },
  { code: '2834', chapter: '28', description: 'Nitritos; nitratos', descriptionEn: 'Nitrites; nitrates', keywords: ['nitritos', 'nitratos', 'nitrites'] },
  { code: '2835', chapter: '28', description: 'Fosfinatos, fosfonatos y fosfatos', descriptionEn: 'Phosphinates, phosphonates and phosphates', keywords: ['fosfatos', 'phosphates'] },
  { code: '2836', chapter: '28', description: 'Carbonatos; peroxocarbonatos', descriptionEn: 'Carbonates; peroxocarbonates', keywords: ['carbonatos', 'carbonates'] },
  { code: '2837', chapter: '28', description: 'Cianuros, oxicianuros y cianuros complejos', descriptionEn: 'Cyanides, cyanide oxides and complex cyanides', keywords: ['cianuros', 'cyanides'] },
  { code: '2901', chapter: '29', description: 'Hidrocarburos acíclicos', descriptionEn: 'Acyclic hydrocarbons', keywords: ['hidrocarburos', 'hydrocarbons'] },
  { code: '2902', chapter: '29', description: 'Hidrocarburos cíclicos', descriptionEn: 'Cyclic hydrocarbons', keywords: ['hidrocarburos', 'cíclicos', 'cyclic'] },
  { code: '2903', chapter: '29', description: 'Derivados halogenados de los hidrocarburos', descriptionEn: 'Halogenated derivatives of hydrocarbons', keywords: ['halogenados', 'halogenated'] }
];

async function main() {
  try {
    await initDatabase();
    console.log(`📊 Insertando ${ADDITIONAL_HS_CODES.length} códigos HS adicionales...`);
    console.log('📦 Categorías: Textiles (50-63), Minerales (25-27), Químicos (28-29)');
    
    let insertedCount = 0;
    
    for (const hs of ADDITIONAL_HS_CODES) {
      try {
        if (hs.code.length === 4) {
          // Partida
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_partidas (id, code, description, description_en, chapter_code, keywords) VALUES (?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), hs.code, hs.description, hs.descriptionEn, hs.chapter, JSON.stringify(hs.keywords || [])]
          );
        } else {
          // Subpartida
          const partidaCode = hs.code.substring(0, 4);
          
          // Insertar partida padre si no existe
          try {
            sqliteDb.run(
              `INSERT OR IGNORE INTO hs_partidas (id, code, description, description_en, chapter_code) VALUES (?, ?, ?, ?, ?)`,
              [crypto.randomUUID(), partidaCode, `Partida ${partidaCode}`, `Heading ${partidaCode}`, hs.chapter]
            );
          } catch (e) {}

          // Insertar subpartida con keywords
          sqliteDb.run(
            `INSERT OR IGNORE INTO hs_subpartidas (id, code, description, description_en, partida_code, chapter_code, keywords, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [crypto.randomUUID(), hs.code, hs.description, hs.descriptionEn, partidaCode, hs.chapter, JSON.stringify(hs.keywords || []), 1]
          );
        }
        insertedCount++;
        if (insertedCount % 10 === 0) process.stdout.write('.');
      } catch (error: any) {
        console.error(`Error insertando ${hs.code}:`, error.message);
      }
    }
    
    console.log('');
    saveDatabase();
    console.log(`✅ ${insertedCount} códigos HS adicionales insertados exitosamente!`);
    console.log('📦 Resumen por categoría:');
    console.log('   - Textiles (50-63): ~50 códigos');
    console.log('   - Minerales (25-27): ~30 códigos');
    console.log('   - Químicos (28-29): ~40 códigos');
    console.log('💾 Database saved');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
