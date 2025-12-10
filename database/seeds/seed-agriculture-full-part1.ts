import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: CÓDIGOS HS AGRICULTURA (200 códigos) ===');

// Códigos HS de Agricultura - Capítulos 01-24
const AGRICULTURE_HS_CODES = [
  // CAPÍTULO 01: ANIMALES VIVOS
  { code: '0101', description: 'Caballos, asnos, mulos y burdéganos, vivos', chapter: '01', keywords: 'caballos,equinos,animales vivos' },
  { code: '0102', description: 'Animales vivos de la especie bovina', chapter: '01', keywords: 'bovinos,ganado,vacas,toros' },
  { code: '0103', description: 'Animales vivos de la especie porcina', chapter: '01', keywords: 'cerdos,porcinos,chanchos' },
  { code: '0104', description: 'Animales vivos de las especies ovina o caprina', chapter: '01', keywords: 'ovejas,cabras,ovinos,caprinos' },
  { code: '0105', description: 'Gallos, gallinas, patos, gansos, pavos y pintadas, vivos', chapter: '01', keywords: 'aves,pollos,gallinas,patos' },
  { code: '0106', description: 'Los demás animales vivos', chapter: '01', keywords: 'animales,mascotas,exóticos' },

  // CAPÍTULO 02: CARNE Y DESPOJOS COMESTIBLES
  { code: '0201', description: 'Carne de animales de la especie bovina, fresca o refrigerada', chapter: '02', keywords: 'carne,bovina,res,vacuno,fresca' },
  { code: '0202', description: 'Carne de animales de la especie bovina, congelada', chapter: '02', keywords: 'carne,bovina,res,congelada' },
  { code: '0203', description: 'Carne de animales de la especie porcina, fresca, refrigerada o congelada', chapter: '02', keywords: 'carne,cerdo,porcina' },
  { code: '0204', description: 'Carne de animales de las especies ovina o caprina, fresca, refrigerada o congelada', chapter: '02', keywords: 'carne,cordero,oveja,cabra' },
  { code: '0205', description: 'Carne de animales de las especies caballar, asnal o mular, fresca, refrigerada o congelada', chapter: '02', keywords: 'carne,caballo,equina' },
  { code: '0206', description: 'Despojos comestibles de animales de las especies bovina, porcina, ovina, caprina, caballar, asnal o mular', chapter: '02', keywords: 'vísceras,despojos,menudencias' },
  { code: '0207', description: 'Carne y despojos comestibles, de aves de la partida 01.05', chapter: '02', keywords: 'pollo,ave,gallina' },
  { code: '0208', description: 'Las demás carnes y despojos comestibles, frescos, refrigerados o congelados', chapter: '02', keywords: 'carne,exótica,conejo' },
  { code: '0209', description: 'Tocino sin partes magras y grasa de cerdo o de ave sin fundir ni extraer de otro modo', chapter: '02', keywords: 'tocino,grasa,cerdo' },
  { code: '0210', description: 'Carne y despojos comestibles, salados o en salmuera, secos o ahumados', chapter: '02', keywords: 'carne,salada,ahumada,jamón' },

  // CAPÍTULO 03: PESCADOS Y CRUSTÁCEOS
  { code: '0301', description: 'Peces vivos', chapter: '03', keywords: 'peces,vivos,acuicultura' },
  { code: '0302', description: 'Pescado fresco o refrigerado (excepto filetes)', chapter: '03', keywords: 'pescado,fresco,salmón,merluza' },
  { code: '0303', description: 'Pescado congelado (excepto filetes)', chapter: '03', keywords: 'pescado,congelado' },
  { code: '0304', description: 'Filetes y demás carne de pescado', chapter: '03', keywords: 'filetes,pescado' },
  { code: '0305', description: 'Pescado seco, salado o en salmuera; pescado ahumado', chapter: '03', keywords: 'pescado,seco,ahumado,bacalao' },
  { code: '0306', description: 'Crustáceos, incluso pelados, vivos, frescos, refrigerados, congelados, secos, salados o en salmuera', chapter: '03', keywords: 'camarones,langostinos,cangrejos,langosta' },
  { code: '0307', description: 'Moluscos, incluso separados de sus valvas, vivos, frescos, refrigerados, congelados, secos, salados o en salmuera', chapter: '03', keywords: 'moluscos,mejillones,ostras,calamares,pulpo' },
  { code: '0308', description: 'Invertebrados acuáticos, excepto los crustáceos y moluscos', chapter: '03', keywords: 'erizos,pepinos de mar' },

  // CAPÍTULO 04: LECHE Y PRODUCTOS LÁCTEOS
  { code: '0401', description: 'Leche y nata (crema), sin concentrar, sin adición de azúcar ni otro edulcorante', chapter: '04', keywords: 'leche,crema,fresca' },
  { code: '0402', description: 'Leche y nata (crema), concentradas o con adición de azúcar u otro edulcorante', chapter: '04', keywords: 'leche,condensada,evaporada' },
  { code: '0403', description: 'Suero de mantequilla, leche y nata (crema) cuajadas, yogur, kéfir', chapter: '04', keywords: 'yogur,kéfir,suero' },
  { code: '0404', description: 'Lactosuero, incluso concentrado o con adición de azúcar u otro edulcorante', chapter: '04', keywords: 'lactosuero,whey' },
  { code: '0405', description: 'Mantequilla (manteca) y demás materias grasas de la leche', chapter: '04', keywords: 'mantequilla,manteca,margarina' },
  { code: '0406', description: 'Quesos y requesón', chapter: '04', keywords: 'queso,requesón,parmesano,cheddar' },
  { code: '0407', description: 'Huevos de ave con cáscara, frescos, conservados o cocidos', chapter: '04', keywords: 'huevos,gallina' },
  { code: '0408', description: 'Huevos de ave sin cáscara y yemas de huevo', chapter: '04', keywords: 'huevo,yema,clara' },
  { code: '0409', description: 'Miel natural', chapter: '04', keywords: 'miel,apicultura' },
  { code: '0410', description: 'Productos comestibles de origen animal no expresados ni comprendidos en otra parte', chapter: '04', keywords: 'productos,animales' },

  // CAPÍTULO 05: OTROS PRODUCTOS DE ORIGEN ANIMAL
  { code: '0501', description: 'Cabello en bruto, incluso lavado o desgrasado', chapter: '05', keywords: 'cabello,pelo' },
  { code: '0502', description: 'Cerdas de cerdo o de jabalí; pelo de tejón y demás pelos para cepillería', chapter: '05', keywords: 'cerdas,pelo' },
  { code: '0504', description: 'Tripas, vejigas y estómagos de animales', chapter: '05', keywords: 'tripas,embutidos' },
  { code: '0505', description: 'Pieles y demás partes de ave, con sus plumas o plumón', chapter: '05', keywords: 'plumas,plumón' },
  { code: '0506', description: 'Huesos y núcleos córneos, en bruto, desgrasados, simplemente preparados', chapter: '05', keywords: 'huesos,cuernos' },
  { code: '0507', description: 'Marfil, concha (caparazón) de tortuga, ballenas de mamíferos marinos', chapter: '05', keywords: 'marfil,concha' },
  { code: '0508', description: 'Coral y materias similares, en bruto o simplemente preparados', chapter: '05', keywords: 'coral,perlas' },
  { code: '0510', description: 'Ámbar gris, castóreo, algalia y almizcle; cantáridas; bilis', chapter: '05', keywords: 'ámbar,almizcle' },
  { code: '0511', description: 'Productos de origen animal no expresados ni comprendidos en otra parte', chapter: '05', keywords: 'productos,animales' }
];

// Continuará en siguiente mensaje...
