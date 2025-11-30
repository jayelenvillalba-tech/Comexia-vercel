// Códigos HS adicionales - Secciones industriales y minerales
import { HSCode } from './hs-codes-database';

// Sección V: Productos minerales
const sectionV: HSCode[] = [
  {
    code: '2701',
    description: 'Hullas; briquetas, ovoides y combustibles sólidos similares',
    descriptionEn: 'Coal; briquettes, ovoids and similar solid fuels',
    section: 'V',
    chapter: '27',
    baseTariff: 5,
    specializations: ['AU', 'ID', 'RU', 'US'],
    keywords: ['carbón', 'coal', 'hulla']
  },
  {
    code: '2709',
    description: 'Aceites crudos de petróleo o de mineral bituminoso',
    descriptionEn: 'Petroleum oils and oils obtained from bituminous minerals, crude',
    section: 'V',
    chapter: '27',
    baseTariff: 3,
    specializations: ['SA', 'RU', 'US', 'IR'],
    keywords: ['petróleo', 'crudo', 'petroleum', 'crude', 'oil']
  },
  {
    code: '2710',
    description: 'Aceites de petróleo o de mineral bituminoso (excepto aceites crudos)',
    descriptionEn: 'Petroleum oils and oils obtained from bituminous minerals (other than crude)',
    section: 'V',
    chapter: '27',
    baseTariff: 5,
    specializations: ['SA', 'RU', 'US'],
    keywords: ['gasolina', 'diesel', 'gasoline', 'fuel']
  },
  {
    code: '2711',
    description: 'Gas de petróleo y demás hidrocarburos gaseosos',
    descriptionEn: 'Petroleum gases and other gaseous hydrocarbons',
    section: 'V',
    chapter: '27',
    baseTariff: 3,
    specializations: ['QA', 'RU', 'US', 'NO'],
    keywords: ['gas', 'natural', 'propano', 'butano']
  },
  {
    code: '2601',
    description: 'Minerales de hierro y sus concentrados',
    descriptionEn: 'Iron ores and concentrates',
    section: 'V',
    chapter: '26',
    baseTariff: 2,
    specializations: ['AU', 'BR', 'IN'],
    keywords: ['hierro', 'mineral', 'iron', 'ore']
  },
  {
    code: '2603',
    description: 'Minerales de cobre y sus concentrados',
    descriptionEn: 'Copper ores and concentrates',
    section: 'V',
    chapter: '26',
    baseTariff: 2,
    specializations: ['CL', 'PE', 'CN'],
    keywords: ['cobre', 'copper', 'mineral']
  },
  {
    code: '2608',
    description: 'Minerales de cinc y sus concentrados',
    descriptionEn: 'Zinc ores and concentrates',
    section: 'V',
    chapter: '26',
    baseTariff: 2,
    specializations: ['PE', 'AU', 'CN'],
    keywords: ['zinc', 'mineral']
  },
  {
    code: '2616',
    description: 'Minerales de metales preciosos y sus concentrados',
    descriptionEn: 'Precious metal ores and concentrates',
    section: 'V',
    chapter: '26',
    baseTariff: 2,
    specializations: ['ZA', 'AU', 'PE', 'RU'],
    keywords: ['oro', 'plata', 'gold', 'silver', 'precious']
  }
];

// Sección VI: Productos de las industrias químicas
const sectionVI: HSCode[] = [
  {
    code: '2804',
    description: 'Hidrógeno, gases nobles y demás elementos no metálicos',
    descriptionEn: 'Hydrogen, rare gases and other non-metals',
    section: 'VI',
    chapter: '28',
    baseTariff: 5,
    specializations: ['DE', 'US', 'JP'],
    keywords: ['hidrógeno', 'hydrogen', 'gas']
  },
  {
    code: '2814',
    description: 'Amoníaco anhidro o en disolución acuosa',
    descriptionEn: 'Ammonia, anhydrous or in aqueous solution',
    section: 'VI',
    chapter: '28',
    baseTariff: 5,
    specializations: ['RU', 'CN', 'US'],
    keywords: ['amoníaco', 'ammonia']
  },
  {
    code: '2836',
    description: 'Carbonatos; peroxocarbonatos',
    descriptionEn: 'Carbonates; peroxocarbonates',
    section: 'VI',
    chapter: '28',
    baseTariff: 5,
    specializations: ['CN', 'US', 'IN'],
    keywords: ['carbonato', 'carbonate']
  },
  {
    code: '3002',
    description: 'Sangre humana; sangre animal; antisueros, vacunas',
    descriptionEn: 'Human blood; animal blood; antisera, vaccines',
    section: 'VI',
    chapter: '30',
    baseTariff: 0,
    specializations: ['US', 'DE', 'CH'],
    keywords: ['vacuna', 'vaccine', 'antisuero', 'blood']
  },
  {
    code: '3004',
    description: 'Medicamentos (excepto productos de las partidas 30.02, 30.05 o 30.06)',
    descriptionEn: 'Medicaments (excluding goods of heading 30.02, 30.05 or 30.06)',
    section: 'VI',
    chapter: '30',
    baseTariff: 0,
    specializations: ['US', 'DE', 'CH', 'IN'],
    keywords: ['medicamento', 'medicine', 'drug', 'pharmaceutical']
  },
  {
    code: '3102',
    description: 'Abonos minerales o químicos nitrogenados',
    descriptionEn: 'Mineral or chemical fertilisers, nitrogenous',
    section: 'VI',
    chapter: '31',
    baseTariff: 5,
    specializations: ['RU', 'CN', 'US'],
    keywords: ['fertilizante', 'fertilizer', 'abono', 'nitrogenado']
  },
  {
    code: '3103',
    description: 'Abonos minerales o químicos fosfatados',
    descriptionEn: 'Mineral or chemical fertilisers, phosphatic',
    section: 'VI',
    chapter: '31',
    baseTariff: 5,
    specializations: ['MA', 'CN', 'RU'],
    keywords: ['fertilizante', 'fertilizer', 'fosfato', 'phosphate']
  },
  {
    code: '3105',
    description: 'Abonos minerales o químicos con varios elementos fertilizantes',
    descriptionEn: 'Mineral or chemical fertilisers containing multiple nutrients',
    section: 'VI',
    chapter: '31',
    baseTariff: 5,
    specializations: ['RU', 'CN', 'CA'],
    keywords: ['fertilizante', 'fertilizer', 'abono', 'npk']
  },
  {
    code: '3901',
    description: 'Polímeros de etileno en formas primarias',
    descriptionEn: 'Polymers of ethylene, in primary forms',
    section: 'VI',
    chapter: '39',
    baseTariff: 6.5,
    specializations: ['SA', 'US', 'DE', 'KR'],
    keywords: ['plástico', 'plastic', 'polietileno', 'polyethylene']
  },
  {
    code: '3902',
    description: 'Polímeros de propileno en formas primarias',
    descriptionEn: 'Polymers of propylene, in primary forms',
    section: 'VI',
    chapter: '39',
    baseTariff: 6.5,
    specializations: ['SA', 'US', 'DE', 'KR'],
    keywords: ['plástico', 'plastic', 'polipropileno', 'polypropylene']
  },
  {
    code: '3903',
    description: 'Polímeros de estireno en formas primarias',
    descriptionEn: 'Polymers of styrene, in primary forms',
    section: 'VI',
    chapter: '39',
    baseTariff: 6.5,
    specializations: ['KR', 'TW', 'DE'],
    keywords: ['plástico', 'plastic', 'poliestireno', 'polystyrene']
  },
  {
    code: '3920',
    description: 'Placas, láminas, hojas y tiras de plástico',
    descriptionEn: 'Plates, sheets, film, foil and strip, of plastics',
    section: 'VI',
    chapter: '39',
    baseTariff: 6.5,
    specializations: ['CN', 'DE', 'US'],
    keywords: ['plástico', 'lámina', 'plastic', 'sheet', 'film']
  }
];

// Sección XV: Metales comunes y manufacturas
const sectionXV: HSCode[] = [
  {
    code: '7201',
    description: 'Fundición en bruto y fundición especular',
    descriptionEn: 'Pig iron and spiegeleisen',
    section: 'XV',
    chapter: '72',
    baseTariff: 5,
    specializations: ['CN', 'IN', 'JP'],
    keywords: ['hierro', 'fundición', 'iron', 'pig']
  },
  {
    code: '7208',
    description: 'Productos laminados planos de hierro o acero sin alear',
    descriptionEn: 'Flat-rolled products of iron or non-alloy steel',
    section: 'XV',
    chapter: '72',
    baseTariff: 8,
    specializations: ['CN', 'JP', 'KR', 'DE'],
    keywords: ['acero', 'laminado', 'steel', 'rolled']
  },
  {
    code: '7210',
    description: 'Productos laminados planos de hierro o acero, chapados o revestidos',
    descriptionEn: 'Flat-rolled products of iron or steel, plated or coated',
    section: 'XV',
    chapter: '72',
    baseTariff: 8,
    specializations: ['CN', 'JP', 'KR'],
    keywords: ['acero', 'galvanizado', 'steel', 'coated', 'galvanized']
  },
  {
    code: '7213',
    description: 'Alambrón de hierro o acero sin alear',
    descriptionEn: 'Bars and rods of iron or non-alloy steel',
    section: 'XV',
    chapter: '72',
    baseTariff: 8,
    specializations: ['CN', 'TR', 'BR'],
    keywords: ['alambrón', 'acero', 'wire', 'rod', 'steel']
  },
  {
    code: '7214',
    description: 'Barras de hierro o acero sin alear, forjadas',
    descriptionEn: 'Bars and rods of iron or non-alloy steel, forged',
    section: 'XV',
    chapter: '72',
    baseTariff: 8,
    specializations: ['CN', 'IN', 'TR'],
    keywords: ['barra', 'acero', 'bar', 'steel', 'forged']
  },
  {
    code: '7228',
    description: 'Barras y perfiles de acero aleado',
    descriptionEn: 'Bars and rods of other alloy steel',
    section: 'XV',
    chapter: '72',
    baseTariff: 8,
    specializations: ['DE', 'JP', 'US'],
    keywords: ['acero', 'aleado', 'alloy', 'steel', 'bar']
  },
  {
    code: '7304',
    description: 'Tubos y perfiles huecos, sin soldadura, de hierro o acero',
    descriptionEn: 'Tubes, pipes and hollow profiles, seamless, of iron or steel',
    section: 'XV',
    chapter: '73',
    baseTariff: 8,
    specializations: ['CN', 'DE', 'JP'],
    keywords: ['tubo', 'tubería', 'pipe', 'tube', 'seamless']
  },
  {
    code: '7306',
    description: 'Tubos y perfiles huecos, soldados, de hierro o acero',
    descriptionEn: 'Tubes, pipes and hollow profiles, welded, of iron or steel',
    section: 'XV',
    chapter: '73',
    baseTariff: 8,
    specializations: ['CN', 'KR', 'TR'],
    keywords: ['tubo', 'tubería', 'soldado', 'pipe', 'welded']
  },
  {
    code: '7308',
    description: 'Construcciones y sus partes de fundición, hierro o acero',
    descriptionEn: 'Structures and parts of structures, of iron or steel',
    section: 'XV',
    chapter: '73',
    baseTariff: 8,
    specializations: ['CN', 'TR', 'IN'],
    keywords: ['estructura', 'construcción', 'structure', 'steel']
  },
  {
    code: '7403',
    description: 'Cobre refinado y aleaciones de cobre, en bruto',
    descriptionEn: 'Refined copper and copper alloys, unwrought',
    section: 'XV',
    chapter: '74',
    baseTariff: 5,
    specializations: ['CL', 'PE', 'CN', 'JP'],
    keywords: ['cobre', 'copper', 'refined']
  },
  {
    code: '7407',
    description: 'Barras y perfiles de cobre',
    descriptionEn: 'Copper bars, rods and profiles',
    section: 'XV',
    chapter: '74',
    baseTariff: 6,
    specializations: ['CL', 'CN', 'DE'],
    keywords: ['cobre', 'barra', 'copper', 'bar', 'rod']
  },
  {
    code: '7408',
    description: 'Alambre de cobre',
    descriptionEn: 'Copper wire',
    section: 'XV',
    chapter: '74',
    baseTariff: 6,
    specializations: ['CN', 'DE', 'CL'],
    keywords: ['cobre', 'alambre', 'copper', 'wire']
  },
  {
    code: '7601',
    description: 'Aluminio en bruto',
    descriptionEn: 'Unwrought aluminium',
    section: 'XV',
    chapter: '76',
    baseTariff: 6,
    specializations: ['CN', 'RU', 'CA', 'AE'],
    keywords: ['aluminio', 'aluminium', 'aluminum']
  },
  {
    code: '7604',
    description: 'Barras y perfiles de aluminio',
    descriptionEn: 'Aluminium bars, rods and profiles',
    section: 'XV',
    chapter: '76',
    baseTariff: 6,
    specializations: ['CN', 'DE', 'US'],
    keywords: ['aluminio', 'barra', 'aluminium', 'bar', 'profile']
  },
  {
    code: '7606',
    description: 'Chapas y tiras de aluminio',
    descriptionEn: 'Aluminium plates, sheets and strip',
    section: 'XV',
    chapter: '76',
    baseTariff: 6,
    specializations: ['CN', 'DE', 'US'],
    keywords: ['aluminio', 'chapa', 'aluminium', 'sheet', 'plate']
  }
];

// Sección XVI: Máquinas y aparatos
const sectionXVI: HSCode[] = [
  {
    code: '8407',
    description: 'Motores de émbolo (pistón) alternativo',
    descriptionEn: 'Spark-ignition reciprocating or rotary internal combustion piston engines',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['JP', 'DE', 'US'],
    keywords: ['motor', 'engine', 'pistón', 'piston']
  },
  {
    code: '8408',
    description: 'Motores de émbolo (pistón) de encendido por compresión',
    descriptionEn: 'Compression-ignition internal combustion piston engines (diesel)',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['JP', 'DE', 'KR'],
    keywords: ['motor', 'diesel', 'engine']
  },
  {
    code: '8411',
    description: 'Turborreactores, turbopropulsores y demás turbinas de gas',
    descriptionEn: 'Turbo-jets, turbo-propellers and other gas turbines',
    section: 'XVI',
    chapter: '84',
    baseTariff: 8,
    specializations: ['US', 'FR', 'UK'],
    keywords: ['turbina', 'turbine', 'jet', 'gas']
  },
  {
    code: '8413',
    description: 'Bombas para líquidos',
    descriptionEn: 'Pumps for liquids',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['DE', 'IT', 'CN'],
    keywords: ['bomba', 'pump', 'líquido']
  },
  {
    code: '8414',
    description: 'Bombas de aire o de vacío, compresores',
    descriptionEn: 'Air or vacuum pumps, compressors',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['DE', 'US', 'JP'],
    keywords: ['compresor', 'compressor', 'bomba', 'pump']
  },
  {
    code: '8418',
    description: 'Refrigeradores, congeladores y demás material de refrigeración',
    descriptionEn: 'Refrigerators, freezers and other refrigerating equipment',
    section: 'XVI',
    chapter: '84',
    baseTariff: 12,
    specializations: ['CN', 'KR', 'JP', 'IT'],
    keywords: ['refrigerador', 'congelador', 'refrigerator', 'freezer']
  },
  {
    code: '8419',
    description: 'Aparatos y dispositivos para tratamiento de materias mediante operaciones con cambio de temperatura',
    descriptionEn: 'Machinery for treatment of materials by temperature change',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['DE', 'IT', 'CN'],
    keywords: ['caldera', 'horno', 'boiler', 'furnace']
  },
  {
    code: '8421',
    description: 'Centrifugadoras; aparatos para filtrar o depurar',
    descriptionEn: 'Centrifuges; filtering or purifying machinery',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['DE', 'US', 'JP'],
    keywords: ['filtro', 'filter', 'centrifuga', 'centrifuge']
  },
  {
    code: '8425',
    description: 'Polipastos; tornos y cabrestantes; gatos',
    descriptionEn: 'Pulley tackle and hoists; winches and capstans; jacks',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['CN', 'JP', 'DE'],
    keywords: ['polipasto', 'torno', 'gato', 'winch', 'hoist', 'jack']
  },
  {
    code: '8428',
    description: 'Máquinas y aparatos de elevación, carga, descarga o manipulación',
    descriptionEn: 'Lifting, handling, loading or unloading machinery',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['CN', 'DE', 'JP'],
    keywords: ['grúa', 'montacargas', 'crane', 'forklift', 'elevator']
  },
  {
    code: '8429',
    description: 'Topadoras, palas mecánicas, excavadoras, cargadoras',
    descriptionEn: 'Bulldozers, mechanical shovels, excavators, loaders',
    section: 'XVI',
    chapter: '84',
    baseTariff: 10,
    specializations: ['JP', 'US', 'DE', 'KR'],
    keywords: ['excavadora', 'bulldozer', 'pala', 'excavator', 'loader']
  },
  {
    code: '8471',
    description: 'Máquinas automáticas para tratamiento o procesamiento de datos',
    descriptionEn: 'Automatic data processing machines and units',
    section: 'XVI',
    chapter: '84',
    baseTariff: 0,
    specializations: ['CN', 'US', 'TW'],
    keywords: ['computadora', 'ordenador', 'computer', 'servidor', 'server']
  },
  {
    code: '8473',
    description: 'Partes y accesorios de máquinas de la partida 84.71',
    descriptionEn: 'Parts and accessories of machines of heading 84.71',
    section: 'XVI',
    chapter: '84',
    baseTariff: 0,
    specializations: ['CN', 'TW', 'MY'],
    keywords: ['partes', 'computadora', 'parts', 'computer']
  },
  {
    code: '8501',
    description: 'Motores y generadores eléctricos',
    descriptionEn: 'Electric motors and generators',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'DE', 'JP'],
    keywords: ['motor', 'generador', 'eléctrico', 'electric', 'generator']
  },
  {
    code: '8502',
    description: 'Grupos electrógenos y convertidores rotativos eléctricos',
    descriptionEn: 'Electric generating sets and rotary converters',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'JP', 'DE'],
    keywords: ['generador', 'grupo electrógeno', 'generator', 'genset']
  },
  {
    code: '8504',
    description: 'Transformadores eléctricos, convertidores eléctricos estáticos',
    descriptionEn: 'Electrical transformers, static converters',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'DE', 'JP'],
    keywords: ['transformador', 'transformer', 'convertidor', 'converter']
  },
  {
    code: '8517',
    description: 'Aparatos eléctricos de telefonía o telegrafía',
    descriptionEn: 'Telephone sets and other apparatus for transmission',
    section: 'XVI',
    chapter: '85',
    baseTariff: 0,
    specializations: ['CN', 'KR', 'US'],
    keywords: ['teléfono', 'celular', 'smartphone', 'phone', 'mobile']
  },
  {
    code: '8528',
    description: 'Monitores y proyectores que no incorporen aparato receptor de televisión',
    descriptionEn: 'Monitors and projectors, not incorporating television reception apparatus',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'KR', 'JP'],
    keywords: ['monitor', 'proyector', 'pantalla', 'projector', 'display']
  },
  {
    code: '8536',
    description: 'Aparatos para corte, seccionamiento, protección, derivación de circuitos eléctricos',
    descriptionEn: 'Electrical apparatus for switching or protecting electrical circuits',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'DE', 'FR'],
    keywords: ['interruptor', 'switch', 'breaker', 'eléctrico']
  },
  {
    code: '8537',
    description: 'Cuadros, paneles, consolas, armarios para control o distribución eléctrica',
    descriptionEn: 'Boards, panels, consoles for electric control or distribution',
    section: 'XVI',
    chapter: '85',
    baseTariff: 10,
    specializations: ['CN', 'DE', 'IT'],
    keywords: ['tablero', 'panel', 'eléctrico', 'board', 'panel', 'electric']
  },
  {
    code: '8703',
    description: 'Automóviles de turismo y demás vehículos',
    descriptionEn: 'Motor cars and other motor vehicles for transport of persons',
    section: 'XVI',
    chapter: '87',
    baseTariff: 35,
    specializations: ['JP', 'DE', 'KR', 'US'],
    keywords: ['automóvil', 'carro', 'auto', 'car', 'vehicle']
  },
  {
    code: '8704',
    description: 'Vehículos automóviles para transporte de mercancías',
    descriptionEn: 'Motor vehicles for the transport of goods',
    section: 'XVI',
    chapter: '87',
    baseTariff: 25,
    specializations: ['JP', 'DE', 'US', 'KR'],
    keywords: ['camión', 'truck', 'carga', 'cargo']
  },
  {
    code: '8708',
    description: 'Partes y accesorios de vehículos automóviles',
    descriptionEn: 'Parts and accessories of motor vehicles',
    section: 'XVI',
    chapter: '87',
    baseTariff: 18,
    specializations: ['CN', 'DE', 'JP', 'MX'],
    keywords: ['repuesto', 'parte', 'auto', 'parts', 'spare']
  }
];

export const HS_CODES_INDUSTRIAL = [...sectionV, ...sectionVI, ...sectionXV, ...sectionXVI];
