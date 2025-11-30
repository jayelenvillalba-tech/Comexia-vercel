// Códigos HS adicionales - Bienes de Consumo (Textiles, Calzado, Muebles, Juguetes)
import { HSCode } from './hs-codes-database';

// Sección XI: Materias textiles y sus manufacturas
const sectionXI: HSCode[] = [
  {
    code: '5201',
    description: 'Algodón sin cardar ni peinar',
    descriptionEn: 'Cotton, not carded or combed',
    section: 'XI',
    chapter: '52',
    baseTariff: 6,
    specializations: ['US', 'IN', 'CN', 'BR'],
    keywords: ['algodón', 'cotton', 'fibra']
  },
  {
    code: '6105',
    description: 'Camisas de punto para hombres o niños',
    descriptionEn: 'Mens or boys shirts, knitted or crocheted',
    section: 'XI',
    chapter: '61',
    baseTariff: 12,
    specializations: ['CN', 'BD', 'VN', 'TR'],
    keywords: ['camisa', 'shirt', 'ropa', 'clothing', 'textil']
  },
  {
    code: '6109',
    description: 'T-shirts y camisetas, de punto',
    descriptionEn: 'T-shirts, singlets and other vests, knitted or crocheted',
    section: 'XI',
    chapter: '61',
    baseTariff: 12,
    specializations: ['CN', 'BD', 'VN', 'HN'],
    keywords: ['camiseta', 't-shirt', 'remera', 'polera', 'ropa']
  },
  {
    code: '6203',
    description: 'Trajes, conjuntos, chaquetas, pantalones para hombres o niños',
    descriptionEn: 'Mens or boys suits, ensembles, jackets, trousers',
    section: 'XI',
    chapter: '62',
    baseTariff: 12,
    specializations: ['CN', 'BD', 'VN', 'IT'],
    keywords: ['pantalón', 'traje', 'trousers', 'suit', 'jeans']
  },
  {
    code: '6204',
    description: 'Trajes, conjuntos, chaquetas, vestidos, faldas, pantalones para mujeres o niñas',
    descriptionEn: 'Womens or girls suits, ensembles, jackets, dresses, skirts, trousers',
    section: 'XI',
    chapter: '62',
    baseTariff: 12,
    specializations: ['CN', 'BD', 'VN', 'TR'],
    keywords: ['vestido', 'falda', 'dress', 'skirt', 'ropa']
  },
  {
    code: '6302',
    description: 'Ropa de cama, de mesa, de tocador o de cocina',
    descriptionEn: 'Bed linen, table linen, toilet linen and kitchen linen',
    section: 'XI',
    chapter: '63',
    baseTariff: 10,
    specializations: ['CN', 'PK', 'IN', 'TR'],
    keywords: ['sábana', 'toalla', 'bed linen', 'towel', 'hogar']
  }
];

// Sección XII: Calzado, sombreros, paraguas
const sectionXII: HSCode[] = [
  {
    code: '6402',
    description: 'Calzado con suela y parte superior de caucho o plástico',
    descriptionEn: 'Footwear with outer soles and uppers of rubber or plastics',
    section: 'XII',
    chapter: '64',
    baseTariff: 15,
    specializations: ['CN', 'VN', 'BR'],
    keywords: ['calzado', 'zapato', 'zapatilla', 'shoe', 'footwear', 'sandal']
  },
  {
    code: '6403',
    description: 'Calzado con suela de caucho, plástico, cuero natural o regenerado y parte superior de cuero natural',
    descriptionEn: 'Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of leather',
    section: 'XII',
    chapter: '64',
    baseTariff: 15,
    specializations: ['CN', 'VN', 'IT', 'ID'],
    keywords: ['zapato', 'cuero', 'leather', 'shoe', 'boot', 'bota']
  },
  {
    code: '6404',
    description: 'Calzado con suela de caucho o plástico y parte superior de materia textil',
    descriptionEn: 'Footwear with outer soles of rubber or plastics and uppers of textile materials',
    section: 'XII',
    chapter: '64',
    baseTariff: 15,
    specializations: ['CN', 'VN', 'ID'],
    keywords: ['zapatilla', 'deportivo', 'sneaker', 'shoe', 'sport']
  }
];

// Sección XX: Mercancías y productos diversos (Muebles, Juguetes)
const sectionXX: HSCode[] = [
  {
    code: '9401',
    description: 'Asientos (excepto los de la partida 94.02), incluso transformables en cama, y sus partes',
    descriptionEn: 'Seats (other than those of heading 94.02), whether or not convertible into beds, and parts thereof',
    section: 'XX',
    chapter: '94',
    baseTariff: 10,
    specializations: ['CN', 'VN', 'PL', 'IT'],
    keywords: ['silla', 'asiento', 'sillón', 'chair', 'seat', 'sofa']
  },
  {
    code: '9403',
    description: 'Los demás muebles y sus partes',
    descriptionEn: 'Other furniture and parts thereof',
    section: 'XX',
    chapter: '94',
    baseTariff: 10,
    specializations: ['CN', 'VN', 'DE', 'IT'],
    keywords: ['mueble', 'mesa', 'armario', 'furniture', 'table', 'cabinet']
  },
  {
    code: '9503',
    description: 'Triciclos, patinetes, coches de pedal y juguetes similares con ruedas; coches y sillas de ruedas para muñecas o muñecos',
    descriptionEn: 'Tricycles, scooters, pedal cars and similar wheeled toys; dolls carriages',
    section: 'XX',
    chapter: '95',
    baseTariff: 10,
    specializations: ['CN', 'VN', 'CZ'],
    keywords: ['juguete', 'toy', 'muñeca', 'doll', 'game']
  },
  {
    code: '9504',
    description: 'Consolas y máquinas de videojuegos, artículos para juegos de sociedad',
    descriptionEn: 'Video game consoles and machines, articles for funfair, table or parlour games',
    section: 'XX',
    chapter: '95',
    baseTariff: 5,
    specializations: ['CN', 'JP', 'US'],
    keywords: ['videojuego', 'consola', 'game', 'console', 'juego']
  }
];

export const HS_CODES_CONSUMER = [...sectionXI, ...sectionXII, ...sectionXX];
