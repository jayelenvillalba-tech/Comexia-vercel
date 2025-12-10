import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: CÓDIGOS HS AGRICULTURA (200 códigos) ===');

const AGRICULTURE_HS_CODES = [
  // CAP 01: ANIMALES VIVOS
  { code: '0101', desc: 'Caballos, asnos, mulos, vivos', kw: 'caballos,equinos' },
  { code: '0102', desc: 'Animales vivos bovinos', kw: 'bovinos,ganado,vacas' },
  { code: '0103', desc: 'Animales vivos porcinos', kw: 'cerdos,porcinos' },
  { code: '0104', desc: 'Animales vivos ovinos/caprinos', kw: 'ovejas,cabras' },
  { code: '0105', desc: 'Gallos, gallinas, patos, pavos, vivos', kw: 'aves,pollos' },
  { code: '0106', desc: 'Otros animales vivos', kw: 'animales,mascotas' },
  
  // CAP 02: CARNES
  { code: '0201', desc: 'Carne bovina fresca/refrigerada', kw: 'carne,res,bovina,fresca' },
  { code: '0202', desc: 'Carne bovina congelada', kw: 'carne,res,congelada' },
  { code: '0203', desc: 'Carne porcina', kw: 'carne,cerdo,porcina' },
  { code: '0204', desc: 'Carne ovina/caprina', kw: 'carne,cordero,cabra' },
  { code: '0205', desc: 'Carne equina', kw: 'carne,caballo' },
  { code: '0206', desc: 'Despojos comestibles', kw: 'vísceras,menudencias' },
  { code: '0207', desc: 'Carne de aves', kw: 'pollo,ave,gallina' },
  { code: '0208', desc: 'Otras carnes', kw: 'carne,conejo,exótica' },
  { code: '0209', desc: 'Tocino y grasa', kw: 'tocino,grasa,cerdo' },
  { code: '0210', desc: 'Carne salada/ahumada', kw: 'jamón,salada,ahumada' },
  
  // CAP 03: PESCADOS
  { code: '0301', desc: 'Peces vivos', kw: 'peces,vivos,acuicultura' },
  { code: '0302', desc: 'Pescado fresco/refrigerado', kw: 'pescado,salmón,merluza' },
  { code: '0303', desc: 'Pescado congelado', kw: 'pescado,congelado' },
  { code: '0304', desc: 'Filetes de pescado', kw: 'filetes,pescado' },
  { code: '0305', desc: 'Pescado seco/salado/ahumado', kw: 'bacalao,ahumado' },
  { code: '0306', desc: 'Crustáceos', kw: 'camarones,langosta,cangrejos' },
  { code: '0307', desc: 'Moluscos', kw: 'mejillones,ostras,calamares,pulpo' },
  { code: '0308', desc: 'Otros invertebrados acuáticos', kw: 'erizos,pepinos mar' },
  
  // CAP 04: LÁCTEOS
  { code: '0401', desc: 'Leche y nata frescas', kw: 'leche,crema,fresca' },
  { code: '0402', desc: 'Leche concentrada/condensada', kw: 'leche,condensada,evaporada' },
  { code: '0403', desc: 'Yogur, kéfir, suero', kw: 'yogur,kéfir' },
  { code: '0404', desc: 'Lactosuero', kw: 'lactosuero,whey' },
  { code: '0405', desc: 'Mantequilla', kw: 'mantequilla,manteca' },
  { code: '0406', desc: 'Quesos', kw: 'queso,parmesano,cheddar' },
  { code: '0407', desc: 'Huevos con cáscara', kw: 'huevos,gallina' },
  { code: '0408', desc: 'Huevos sin cáscara, yemas', kw: 'huevo,yema,clara' },
  { code: '0409', desc: 'Miel natural', kw: 'miel,apicultura' },
  { code: '0410', desc: 'Otros productos animales', kw: 'productos,animales' },
  
  // CAP 06: PLANTAS VIVAS
  { code: '0601', desc: 'Bulbos, cebollas, tubérculos', kw: 'bulbos,flores' },
  { code: '0602', desc: 'Plantas vivas', kw: 'plantas,vivero' },
  { code: '0603', desc: 'Flores cortadas', kw: 'flores,rosas,claveles' },
  { code: '0604', desc: 'Follaje, ramas', kw: 'follaje,decoración' },
  
  // CAP 07: HORTALIZAS
  { code: '0701', desc: 'Papas (patatas) frescas/refrigeradas', kw: 'papa,patata' },
  { code: '0702', desc: 'Tomates frescos/refrigerados', kw: 'tomate' },
  { code: '0703', desc: 'Cebollas, chalotes, ajos, puerros', kw: 'cebolla,ajo' },
  { code: '0704', desc: 'Coles, coliflores, brócoli', kw: 'col,brócoli,coliflor' },
  { code: '0705', desc: 'Lechugas y achicorias', kw: 'lechuga,escarola' },
  { code: '0706', desc: 'Zanahorias, nabos, remolachas', kw: 'zanahoria,nabo,remolacha' },
  { code: '0707', desc: 'Pepinos y pepinillos', kw: 'pepino,pepinillo' },
  { code: '0708', desc: 'Legumbres de vaina', kw: 'arvejas,guisantes,habas' },
  { code: '0709', desc: 'Otras hortalizas frescas', kw: 'espárragos,berenjenas,pimientos' },
  { code: '0710', desc: 'Hortalizas congeladas', kw: 'vegetales,congelados' },
  { code: '0711', desc: 'Hortalizas conservadas provisionalmente', kw: 'conservas,salmuera' },
  { code: '0712', desc: 'Hortalizas secas', kw: 'vegetales,secos,deshidratados' },
  { code: '0713', desc: 'Legumbres secas desvainadas', kw: 'porotos,lentejas,garbanzos' },
  { code: '0714', desc: 'Raíces y tubérculos', kw: 'mandioca,yuca,batata' },
  
  // CAP 08: FRUTAS
  { code: '0801', desc: 'Cocos, nueces del Brasil, nueces de cajú', kw: 'coco,nueces,cajú' },
  { code: '0802', desc: 'Otros frutos de cáscara', kw: 'almendras,avellanas,nueces' },
  { code: '0803', desc: 'Bananas (plátanos)', kw: 'banana,plátano' },
  { code: '0804', desc: 'Dátiles, higos, piñas, aguacates, guayabas, mangos', kw: 'aguacate,mango,piña' },
  { code: '0805', desc: 'Cítricos', kw: 'naranja,limón,mandarina,pomelo' },
  { code: '0806', desc: 'Uvas', kw: 'uvas,vid' },
  { code: '0807', desc: 'Melones, sandías, papayas', kw: 'melón,sandía,papaya' },
  { code: '0808', desc: 'Manzanas, peras, membrillos', kw: 'manzana,pera,membrillo' },
  { code: '0809', desc: 'Damascos, cerezas, duraznos, ciruelas', kw: 'durazno,cereza,ciruela,damasco' },
  { code: '0810', desc: 'Otras frutas frescas', kw: 'frutillas,arándanos,kiwi' },
  { code: '0811', desc: 'Frutas congeladas', kw: 'frutas,congeladas' },
  { code: '0812', desc: 'Frutas conservadas provisionalmente', kw: 'frutas,conservadas' },
  { code: '0813', desc: 'Frutas secas', kw: 'pasas,ciruelas secas,dátiles' },
  { code: '0814', desc: 'Cortezas de agrios, melones, sandías', kw: 'cáscara,corteza' },
  
  // CAP 09: CAFÉ, TÉ, ESPECIAS
  { code: '0901', desc: 'Café', kw: 'café,arábica,robusta' },
  { code: '0902', desc: 'Té', kw: 'té,infusiones' },
  { code: '0903', desc: 'Yerba mate', kw: 'yerba,mate' },
  { code: '0904', desc: 'Pimienta, pimientos', kw: 'pimienta,pimentón,ají' },
  { code: '0905', desc: 'Vainilla', kw: 'vainilla' },
  { code: '0906', desc: 'Canela', kw: 'canela' },
  { code: '0907', desc: 'Clavo de olor', kw: 'clavo' },
  { code: '0908', desc: 'Nuez moscada, macis, cardamomo', kw: 'nuez moscada,cardamomo' },
  { code: '0909', desc: 'Semillas de anís, badiana, hinojo, cilantro', kw: 'anís,hinojo,cilantro' },
  { code: '0910', desc: 'Jengibre, azafrán, cúrcuma, tomillo, laurel', kw: 'jengibre,azafrán,cúrcuma' },
  
  // CAP 10: CEREALES
  { code: '1001', desc: 'Trigo y morcajo', kw: 'trigo,wheat' },
  { code: '1002', desc: 'Centeno', kw: 'centeno,rye' },
  { code: '1003', desc: 'Cebada', kw: 'cebada,barley' },
  { code: '1004', desc: 'Avena', kw: 'avena,oats' },
  { code: '1005', desc: 'Maíz', kw: 'maíz,corn' },
  { code: '1006', desc: 'Arroz', kw: 'arroz,rice' },
  { code: '1007', desc: 'Sorgo de grano', kw: 'sorgo,sorghum' },
  { code: '1008', desc: 'Alforfón, mijo, alpiste, otros cereales', kw: 'mijo,quinoa,amaranto' },
  
  // CAP 11: PRODUCTOS DE MOLINERÍA
  { code: '1101', desc: 'Harina de trigo o de morcajo', kw: 'harina,trigo' },
  { code: '1102', desc: 'Harina de cereales (excepto trigo)', kw: 'harina,maíz,avena' },
  { code: '1103', desc: 'Grañones, sémola, pellets', kw: 'sémola,grañones' },
  { code: '1104', desc: 'Granos aplastados, copos', kw: 'copos,avena,cereales' },
  { code: '1105', desc: 'Harina, sémola, polvo, copos de papa', kw: 'papa,fécula' },
  { code: '1106', desc: 'Harina, sémola de legumbres, sagú, raíces', kw: 'harina,legumbres' },
  { code: '1107', desc: 'Malta', kw: 'malta,cerveza' },
  { code: '1108', desc: 'Almidón y fécula', kw: 'almidón,fécula,maicena' },
  { code: '1109', desc: 'Gluten de trigo', kw: 'gluten,trigo' },
  
  // CAP 12: SEMILLAS OLEAGINOSAS
  { code: '1201', desc: 'Habas de soja', kw: 'soja,soya,soybeans' },
  { code: '1202', desc: 'Cacahuates (maníes)', kw: 'maní,cacahuate,peanuts' },
  { code: '1203', desc: 'Copra', kw: 'copra,coco' },
  { code: '1204', desc: 'Semillas de lino', kw: 'lino,linaza' },
  { code: '1205', desc: 'Semillas de nabo o colza', kw: 'colza,canola,rapeseed' },
  { code: '1206', desc: 'Semillas de girasol', kw: 'girasol,sunflower' },
  { code: '1207', desc: 'Otras semillas oleaginosas', kw: 'semillas,algodón,sésamo' },
  { code: '1208', desc: 'Harina de semillas oleaginosas', kw: 'harina,soja,girasol' },
  { code: '1209', desc: 'Semillas, frutos, esporas para siembra', kw: 'semillas,siembra' },
  { code: '1210', desc: 'Conos de lúpulo', kw: 'lúpulo,cerveza' },
  { code: '1211', desc: 'Plantas aromáticas o medicinales', kw: 'hierbas,medicinales,aromáticas' },
  { code: '1212', desc: 'Algarrobas, algas, remolacha azucarera', kw: 'algarroba,algas,remolacha' },
  { code: '1213', desc: 'Paja y cascabillo de cereales', kw: 'paja,forraje' },
  { code: '1214', desc: 'Nabos forrajeros, heno, alfalfa', kw: 'heno,alfalfa,forraje' },
  
  // CAP 13: GOMAS, RESINAS
  { code: '1301', desc: 'Goma laca, resinas naturales', kw: 'goma,resina' },
  { code: '1302', desc: 'Jugos y extractos vegetales', kw: 'extractos,vegetales' },
  
  // CAP 14: MATERIAS TRENZABLES
  { code: '1401', desc: 'Materias vegetales para cestería', kw: 'mimbre,cestería' },
  { code: '1404', desc: 'Productos vegetales diversos', kw: 'productos,vegetales' },
  
  // CAP 15: GRASAS Y ACEITES
  { code: '1501', desc: 'Grasa de cerdo', kw: 'grasa,cerdo,manteca' },
  { code: '1502', desc: 'Grasa de animales bovinos, ovinos, caprinos', kw: 'sebo,grasa' },
  { code: '1503', desc: 'Estearina solar, aceite de manteca de cerdo', kw: 'estearina' },
  { code: '1504', desc: 'Grasas y aceites de pescado', kw: 'aceite,pescado,omega3' },
  { code: '1505', desc: 'Grasa de lana y sustancias grasas derivadas', kw: 'lanolina,lana' },
  { code: '1506', desc: 'Otras grasas y aceites animales', kw: 'grasas,animales' },
  { code: '1507', desc: 'Aceite de soja', kw: 'aceite,soja,soybean oil' },
  { code: '1508', desc: 'Aceite de maní (cacahuate)', kw: 'aceite,maní,peanut oil' },
  { code: '1509', desc: 'Aceite de oliva', kw: 'aceite,oliva,olive oil' },
  { code: '1510', desc: 'Otros aceites de oliva', kw: 'aceite,oliva,orujo' },
  { code: '1511', desc: 'Aceite de palma', kw: 'aceite,palma,palm oil' },
  { code: '1512', desc: 'Aceites de girasol, cártamo, algodón', kw: 'aceite,girasol,sunflower oil' },
  { code: '1513', desc: 'Aceites de coco, almendra de palma, babasú', kw: 'aceite,coco,coconut oil' },
  { code: '1514', desc: 'Aceites de nabo, colza, mostaza', kw: 'aceite,colza,canola oil' },
  { code: '1515', desc: 'Otras grasas y aceites vegetales fijos', kw: 'aceite,lino,sésamo,jojoba' },
  { code: '1516', desc: 'Grasas y aceites animales o vegetales hidrogenados', kw: 'margarina,hidrogenado' },
  { code: '1517', desc: 'Margarina', kw: 'margarina' },
  { code: '1518', desc: 'Grasas y aceites modificados químicamente', kw: 'aceites,modificados' },
  
  // CAP 16: PREPARACIONES DE CARNE
  { code: '1601', desc: 'Embutidos y productos similares de carne', kw: 'embutidos,salchichas,chorizos' },
  { code: '1602', desc: 'Otras preparaciones y conservas de carne', kw: 'conservas,carne,paté' },
  { code: '1603', desc: 'Extractos y jugos de carne, pescado, crustáceos', kw: 'extractos,carne' },
  { code: '1604', desc: 'Preparaciones y conservas de pescado', kw: 'conservas,atún,sardinas' },
  { code: '1605', desc: 'Crustáceos, moluscos preparados o conservados', kw: 'conservas,camarones,mejillones' },
  
  // CAP 17: AZÚCARES
  { code: '1701', desc: 'Azúcar de caña o remolacha', kw: 'azúcar,sugar' },
  { code: '1702', desc: 'Otros azúcares, jarabes, miel artificial', kw: 'fructosa,glucosa,jarabe' },
  { code: '1703', desc: 'Melaza', kw: 'melaza,molasses' },
  { code: '1704', desc: 'Artículos de confitería sin cacao', kw: 'caramelos,chicles,confites' },
  
  // CAP 18: CACAO
  { code: '1801', desc: 'Cacao en grano', kw: 'cacao,cocoa beans' },
  { code: '1802', desc: 'Cáscara, películas y residuos de cacao', kw: 'cacao,residuos' },
  { code: '1803', desc: 'Pasta de cacao', kw: 'pasta,cacao' },
  { code: '1804', desc: 'Manteca de cacao', kw: 'manteca,cacao,cocoa butter' },
  { code: '1805', desc: 'Cacao en polvo sin azúcar', kw: 'cacao,polvo,cocoa powder' },
  { code: '1806', desc: 'Chocolate y preparaciones con cacao', kw: 'chocolate,bombones' },
  
  // CAP 19: PRODUCTOS DE CEREALES
  { code: '1901', desc: 'Extracto de malta, preparaciones alimenticias de harina', kw: 'leche,maternizada,fórmula' },
  { code: '1902', desc: 'Pastas alimenticias', kw: 'pasta,fideos,macarrones' },
  { code: '1903', desc: 'Tapioca y sus sucedáneos', kw: 'tapioca' },
  { code: '1904', desc: 'Productos a base de cereales obtenidos por inflado o tostado', kw: 'cereales,copos,corn flakes' },
  { code: '1905', desc: 'Productos de panadería, pastelería o galletería', kw: 'pan,galletas,bizcochos' },
  
  // CAP 20: CONSERVAS DE HORTALIZAS Y FRUTAS
  { code: '2001', desc: 'Hortalizas, frutas preparadas en vinagre o ácido acético', kw: 'pickles,encurtidos' },
  { code: '2002', desc: 'Tomates preparados o conservados', kw: 'tomate,conserva,salsa' },
  { code: '2003', desc: 'Hongos y trufas preparados o conservados', kw: 'hongos,champiñones' },
  { code: '2004', desc: 'Otras hortalizas preparadas o conservadas', kw: 'conservas,vegetales' },
  { code: '2005', desc: 'Otras hortalizas preparadas o conservadas', kw: 'conservas,arvejas,espárragos' },
  { code: '2006', desc: 'Hortalizas, frutas confitadas con azúcar', kw: 'confitadas,azúcar' },
  { code: '2007', desc: 'Confituras, jaleas, mermeladas', kw: 'mermelada,jalea,dulce' },
  { code: '2008', desc: 'Frutas preparadas o conservadas', kw: 'conservas,frutas,duraznos' },
  { code: '2009', desc: 'Jugos de frutas u hortalizas', kw: 'jugo,naranja,manzana' },
  
  // CAP 21: PREPARACIONES ALIMENTICIAS DIVERSAS
  { code: '2101', desc: 'Extractos, esencias de café, té, yerba mate', kw: 'café,soluble,instantáneo' },
  { code: '2102', desc: 'Levaduras, polvos para hornear', kw: 'levadura,polvo,hornear' },
  { code: '2103', desc: 'Preparaciones para salsas, condimentos', kw: 'salsa,ketchup,mayonesa,mostaza' },
  { code: '2104', desc: 'Preparaciones para sopas, caldos', kw: 'sopa,caldo,consomé' },
  { code: '2105', desc: 'Helados', kw: 'helado,ice cream' },
  { code: '2106', desc: 'Preparaciones alimenticias diversas', kw: 'suplementos,proteínas,edulcorantes' },
  
  // CAP 22: BEBIDAS
  { code: '2201', desc: 'Agua, incluida el agua mineral y gaseada', kw: 'agua,mineral,soda' },
  { code: '2202', desc: 'Agua con azúcar, bebidas no alcohólicas', kw: 'gaseosa,bebidas,refrescos' },
  { code: '2203', desc: 'Cerveza de malta', kw: 'cerveza,beer' },
  { code: '2204', desc: 'Vino de uvas frescas', kw: 'vino,wine' },
  { code: '2205', desc: 'Vermut y otros vinos con plantas aromáticas', kw: 'vermut,vermouth' },
  { code: '2206', desc: 'Otras bebidas fermentadas', kw: 'sidra,perada,hidromiel' },
  { code: '2207', desc: 'Alcohol etílico sin desnaturalizar', kw: 'alcohol,etanol' },
  { code: '2208', desc: 'Alcohol etílico desnaturalizado, aguardientes', kw: 'whisky,ron,vodka,gin,tequila' },
  { code: '2209', desc: 'Vinagre', kw: 'vinagre,acético' },
  
  // CAP 23: RESIDUOS INDUSTRIAS ALIMENTARIAS
  { code: '2301', desc: 'Harina de carne, pescado, crustáceos', kw: 'harina,carne,pescado' },
  { code: '2302', desc: 'Salvados, moyuelos, residuos de cereales', kw: 'salvado,afrechillo' },
  { code: '2303', desc: 'Residuos de la industria del almidón', kw: 'residuos,almidón' },
  { code: '2304', desc: 'Tortas y residuos de aceite de soja', kw: 'expeller,soja' },
  { code: '2305', desc: 'Tortas y residuos de aceite de maní', kw: 'expeller,maní' },
  { code: '2306', desc: 'Tortas y residuos de otros aceites vegetales', kw: 'expeller,girasol,colza' },
  { code: '2307', desc: 'Heces de vino, tártaro bruto', kw: 'heces,vino' },
  { code: '2308', desc: 'Materias vegetales para alimentación animal', kw: 'forraje,alimento,animal' },
  { code: '2309', desc: 'Preparaciones para alimentación animal', kw: 'balanceado,alimento,mascotas' },
  
  // CAP 24: TABACO
  { code: '2401', desc: 'Tabaco en rama o sin elaborar', kw: 'tabaco,hoja' },
  { code: '2402', desc: 'Cigarros, cigarritos, cigarrillos', kw: 'cigarrillos,cigarros' },
  { code: '2403', desc: 'Otros tabacos y sucedáneos elaborados', kw: 'tabaco,picadura,rapé' }
];

async function main() {
  try {
    await initDatabase();
    console.log(`📊 Insertando ${AGRICULTURE_HS_CODES.length} códigos HS de agricultura...`);
    
    const insertStmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO hs_subpartidas (id, code, description, description_en, partida_code, chapter_code, keywords)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    let inserted = 0;
    for (const item of AGRICULTURE_HS_CODES) {
      const id = crypto.randomUUID();
      // Pad code to 6 digits if needed
      const fullCode = item.code.padEnd(6, '0');
      const partidaCode = fullCode.substring(0, 4);
      const chapterCode = fullCode.substring(0, 2);
      
      insertStmt.run(
        id,
        fullCode,
        item.desc,
        item.desc, // Same for EN (can be translated later)
        partidaCode,
        chapterCode,
        item.kw
      );
      inserted++;
    }
    
    saveDatabase();
    console.log(`✅ ${inserted} códigos HS de agricultura insertados exitosamente!`);
    console.log('📦 Categorías incluidas:');
    console.log('   - Animales vivos (01)');
    console.log('   - Carnes y despojos (02)');
    console.log('   - Pescados y mariscos (03)');
    console.log('   - Lácteos y huevos (04)');
    console.log('   - Plantas vivas y flores (06)');
    console.log('   - Hortalizas (07)');
    console.log('   - Frutas y frutos secos (08)');
    console.log('   - Café, té, especias (09)');
    console.log('   - Cereales (10)');
    console.log('   - Productos de molinería (11)');
    console.log('   - Semillas oleaginosas (12)');
    console.log('   - Grasas y aceites (15)');
    console.log('   - Preparaciones de carne/pescado (16)');
    console.log('   - Azúcares y confitería (17-18)');
    console.log('   - Productos de cereales (19)');
    console.log('   - Conservas (20)');
    console.log('   - Bebidas (22)');
    console.log('   - Alimentos para animales (23)');
    console.log('   - Tabaco (24)');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
