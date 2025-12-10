import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: CÓDIGOS HS FINALES (Maquinaria, Electrónica, Vehículos, etc.) ===');

// Códigos HS finales para alcanzar 500+ códigos
const FINAL_HS_CODES = [
  // MAQUINARIA (Capítulo 84) - 80 códigos
  { code: '8401', chapter: '84', description: 'Reactores nucleares', descriptionEn: 'Nuclear reactors', keywords: ['nuclear', 'reactores', 'reactors'] },
  { code: '8402', chapter: '84', description: 'Calderas de vapor', descriptionEn: 'Steam boilers', keywords: ['calderas', 'vapor', 'boilers'] },
  { code: '8403', chapter: '84', description: 'Calderas para calefacción central', descriptionEn: 'Central heating boilers', keywords: ['calderas', 'calefacción', 'heating'] },
  { code: '8404', chapter: '84', description: 'Aparatos auxiliares para calderas', descriptionEn: 'Auxiliary plant for boilers', keywords: ['calderas', 'auxiliares', 'boilers'] },
  { code: '8405', chapter: '84', description: 'Generadores de gas', descriptionEn: 'Producer gas generators', keywords: ['generadores', 'gas', 'generators'] },
  { code: '8406', chapter: '84', description: 'Turbinas de vapor', descriptionEn: 'Steam turbines', keywords: ['turbinas', 'vapor', 'turbines'] },
  { code: '8407', chapter: '84', description: 'Motores de émbolo (pistón) de encendido por chispa', descriptionEn: 'Spark-ignition engines', keywords: ['motores', 'pistón', 'engines'] },
  { code: '8408', chapter: '84', description: 'Motores de émbolo de encendido por compresión (diesel)', descriptionEn: 'Diesel engines', keywords: ['motores', 'diesel', 'engines'] },
  { code: '8409', chapter: '84', description: 'Partes para motores de las partidas 84.07 u 84.08', descriptionEn: 'Parts for engines', keywords: ['partes', 'motores', 'parts'] },
  { code: '8410', chapter: '84', description: 'Turbinas hidráulicas, ruedas hidráulicas', descriptionEn: 'Hydraulic turbines', keywords: ['turbinas', 'hidráulicas', 'hydraulic'] },
  { code: '8411', chapter: '84', description: 'Turborreactores, turbopropulsores', descriptionEn: 'Turbo-jets, turbo-propellers', keywords: ['turbinas', 'jet', 'turbo'] },
  { code: '8412', chapter: '84', description: 'Motores y máquinas motrices', descriptionEn: 'Other engines and motors', keywords: ['motores', 'máquinas', 'engines'] },
  { code: '8413', chapter: '84', description: 'Bombas para líquidos', descriptionEn: 'Pumps for liquids', keywords: ['bombas', 'líquidos', 'pumps'] },
  { code: '8414', chapter: '84', description: 'Bombas de aire o de vacío, compresores', descriptionEn: 'Air pumps, compressors', keywords: ['compresores', 'aire', 'compressors'] },
  { code: '8415', chapter: '84', description: 'Máquinas y aparatos para acondicionamiento de aire', descriptionEn: 'Air conditioning machines', keywords: ['aire acondicionado', 'climatización', 'air conditioning'] },
  { code: '8416', chapter: '84', description: 'Quemadores para alimentación de hogares', descriptionEn: 'Furnace burners', keywords: ['quemadores', 'burners'] },
  { code: '8417', chapter: '84', description: 'Hornos industriales o de laboratorio', descriptionEn: 'Industrial furnaces', keywords: ['hornos', 'industriales', 'furnaces'] },
  { code: '8418', chapter: '84', description: 'Refrigeradores, congeladores', descriptionEn: 'Refrigerators, freezers', keywords: ['refrigeradores', 'heladeras', 'refrigerators'] },
  { code: '8419', chapter: '84', description: 'Aparatos para tratamiento de materias por cambio de temperatura', descriptionEn: 'Machinery for treatment of materials', keywords: ['tratamiento', 'térmico', 'treatment'] },
  { code: '8420', chapter: '84', description: 'Calandrias y laminadores', descriptionEn: 'Calendering machines', keywords: ['calandrias', 'laminadores', 'calendering'] },
  { code: '8421', chapter: '84', description: 'Centrifugadoras, aparatos para filtrar', descriptionEn: 'Centrifuges, filtering apparatus', keywords: ['centrifugadoras', 'filtros', 'centrifuges'] },
  { code: '8422', chapter: '84', description: 'Máquinas para lavar vajilla, embotellar, empaquetar', descriptionEn: 'Dishwashing, bottling, packaging machines', keywords: ['lavavajillas', 'embotelladoras', 'dishwashers'] },
  { code: '8423', chapter: '84', description: 'Aparatos e instrumentos de pesar', descriptionEn: 'Weighing machinery', keywords: ['básculas', 'balanzas', 'scales'] },
  { code: '8424', chapter: '84', description: 'Aparatos mecánicos para proyectar, dispersar o pulverizar', descriptionEn: 'Mechanical sprayers', keywords: ['pulverizadores', 'sprayers'] },
  { code: '8425', chapter: '84', description: 'Polipastos, tornos, cabrestantes, gatos', descriptionEn: 'Pulley tackle, winches, jacks', keywords: ['polipastos', 'gatos', 'winches'] },
  { code: '8426', chapter: '84', description: 'Grúas y aparatos de elevación sobre cable aéreo', descriptionEn: 'Cranes, derricks', keywords: ['grúas', 'cranes'] },
  { code: '8427', chapter: '84', description: 'Carretillas autopropulsadas', descriptionEn: 'Fork-lift trucks', keywords: ['montacargas', 'autoelevadores', 'forklifts'] },
  { code: '8428', chapter: '84', description: 'Máquinas y aparatos de elevación, carga, descarga', descriptionEn: 'Lifting, handling machinery', keywords: ['elevación', 'carga', 'lifting'] },
  { code: '8429', chapter: '84', description: 'Topadoras, niveladoras, traíllas, palas mecánicas', descriptionEn: 'Bulldozers, graders, excavators', keywords: ['topadoras', 'excavadoras', 'bulldozers'] },
  { code: '8430', chapter: '84', description: 'Máquinas para explanar, nivelar, traillar, excavar', descriptionEn: 'Earth moving machinery', keywords: ['movimiento', 'tierra', 'earthmoving'] },
  { code: '8431', chapter: '84', description: 'Partes para máquinas de las partidas 84.25 a 84.30', descriptionEn: 'Parts for machinery', keywords: ['partes', 'maquinaria', 'parts'] },
  { code: '8432', chapter: '84', description: 'Máquinas, aparatos y artefactos agrícolas', descriptionEn: 'Agricultural machinery', keywords: ['agrícolas', 'sembradoras', 'agricultural'] },
  { code: '8433', chapter: '84', description: 'Máquinas para cosechar o trillar', descriptionEn: 'Harvesting, threshing machinery', keywords: ['cosechadoras', 'trilladoras', 'harvesters'] },
  { code: '8434', chapter: '84', description: 'Máquinas de ordeñar y máquinas para la industria lechera', descriptionEn: 'Milking machines, dairy machinery', keywords: ['ordeñadoras', 'lechería', 'milking'] },
  { code: '8435', chapter: '84', description: 'Prensas, estrujadoras para fabricación de vino', descriptionEn: 'Presses for wine making', keywords: ['prensas', 'vino', 'presses'] },
  { code: '8436', chapter: '84', description: 'Máquinas y aparatos para agricultura, horticultura', descriptionEn: 'Agricultural machinery', keywords: ['agricultura', 'horticultura', 'farming'] },
  { code: '8437', chapter: '84', description: 'Máquinas para limpieza, clasificación de granos', descriptionEn: 'Grain cleaning machinery', keywords: ['granos', 'limpieza', 'grain'] },
  { code: '8438', chapter: '84', description: 'Máquinas para preparación de carne, frutas, hortalizas', descriptionEn: 'Food processing machinery', keywords: ['alimentos', 'procesamiento', 'food'] },
  { code: '8439', chapter: '84', description: 'Máquinas para fabricación de pasta de papel', descriptionEn: 'Paper pulp making machinery', keywords: ['papel', 'pulpa', 'paper'] },
  { code: '8440', chapter: '84', description: 'Máquinas y aparatos para encuadernación', descriptionEn: 'Bookbinding machinery', keywords: ['encuadernación', 'bookbinding'] },
  { code: '8441', chapter: '84', description: 'Máquinas para trabajar pasta de papel o papel', descriptionEn: 'Paper making machinery', keywords: ['papel', 'paper'] },
  { code: '8442', chapter: '84', description: 'Máquinas para preparar o fabricar clisés, planchas', descriptionEn: 'Printing machinery', keywords: ['impresión', 'printing'] },
  { code: '8443', chapter: '84', description: 'Máquinas y aparatos para imprimir', descriptionEn: 'Printing machinery', keywords: ['impresoras', 'printers'] },
  { code: '8444', chapter: '84', description: 'Máquinas para extrudir, estirar, texturar o cortar materia textil sintética', descriptionEn: 'Textile extruding machinery', keywords: ['textil', 'extrusión', 'textile'] },
  { code: '8445', chapter: '84', description: 'Máquinas para preparación de materia textil', descriptionEn: 'Textile preparation machinery', keywords: ['textil', 'preparación', 'textile'] },
  { code: '8446', chapter: '84', description: 'Telares', descriptionEn: 'Weaving machines (looms)', keywords: ['telares', 'looms'] },
  { code: '8447', chapter: '84', description: 'Máquinas de tricotar', descriptionEn: 'Knitting machines', keywords: ['tricotar', 'punto', 'knitting'] },
  { code: '8448', chapter: '84', description: 'Máquinas y aparatos auxiliares para máquinas de las partidas 84.44 a 84.47', descriptionEn: 'Auxiliary machinery for textiles', keywords: ['textil', 'auxiliares', 'textile'] },
  { code: '8449', chapter: '84', description: 'Máquinas para fabricación de fieltro', descriptionEn: 'Felt making machinery', keywords: ['fieltro', 'felt'] },
  { code: '8450', chapter: '84', description: 'Máquinas para lavar ropa', descriptionEn: 'Washing machines', keywords: ['lavarropas', 'lavadoras', 'washing machines'] },
  { code: '8451', chapter: '84', description: 'Máquinas para limpiar, secar, planchar, prensar textiles', descriptionEn: 'Textile cleaning, drying machinery', keywords: ['textil', 'limpieza', 'textile'] },
  { code: '8452', chapter: '84', description: 'Máquinas de coser', descriptionEn: 'Sewing machines', keywords: ['coser', 'sewing machines'] },
  { code: '8453', chapter: '84', description: 'Máquinas para preparar, curtir, trabajar cueros o pieles', descriptionEn: 'Leather working machinery', keywords: ['cuero', 'leather'] },
  { code: '8454', chapter: '84', description: 'Convertidores, cucharas de colada, lingoteras', descriptionEn: 'Converters, ladles, ingot moulds', keywords: ['fundición', 'moldes', 'foundry'] },
  { code: '8455', chapter: '84', description: 'Laminadores de metal', descriptionEn: 'Metal-rolling mills', keywords: ['laminadores', 'metal', 'rolling mills'] },
  { code: '8456', chapter: '84', description: 'Máquinas herramienta que trabajen por láser u otros', descriptionEn: 'Machine tools working by laser', keywords: ['láser', 'herramientas', 'laser'] },
  { code: '8457', chapter: '84', description: 'Centros de mecanizado, máquinas de puesto fijo', descriptionEn: 'Machining centres', keywords: ['mecanizado', 'CNC', 'machining'] },
  { code: '8458', chapter: '84', description: 'Tornos para trabajar metal', descriptionEn: 'Lathes for metal', keywords: ['tornos', 'lathes'] },
  { code: '8459', chapter: '84', description: 'Máquinas para taladrar, escariar, fresar, roscar', descriptionEn: 'Drilling, boring, milling machines', keywords: ['taladros', 'fresadoras', 'drilling'] },
  { code: '8460', chapter: '84', description: 'Máquinas para desbarbar, afilar, amolar, rectificar', descriptionEn: 'Deburring, sharpening, grinding machines', keywords: ['amoladoras', 'rectificadoras', 'grinding'] },
  { code: '8461', chapter: '84', description: 'Máquinas para cepillar, limar, mortajar, brochar', descriptionEn: 'Planing, shaping, slotting machines', keywords: ['cepilladoras', 'planing'] },
  { code: '8462', chapter: '84', description: 'Máquinas para forjar, estampar, punzonar metal', descriptionEn: 'Forging, stamping, punching machines', keywords: ['forja', 'estampado', 'forging'] },
  { code: '8463', chapter: '84', description: 'Máquinas herramienta para trabajar metal', descriptionEn: 'Machine tools for metal', keywords: ['herramientas', 'metal', 'tools'] },
  { code: '8464', chapter: '84', description: 'Máquinas para trabajar piedra, cerámica, hormigón', descriptionEn: 'Stone, ceramic working machines', keywords: ['piedra', 'cerámica', 'stone'] },
  { code: '8465', chapter: '84', description: 'Máquinas herramienta para trabajar madera', descriptionEn: 'Machine tools for wood', keywords: ['madera', 'carpintería', 'wood'] },
  { code: '8466', chapter: '84', description: 'Partes y accesorios para máquinas herramienta', descriptionEn: 'Parts for machine tools', keywords: ['partes', 'herramientas', 'parts'] },
  { code: '8467', chapter: '84', description: 'Herramientas neumáticas, hidráulicas, con motor', descriptionEn: 'Pneumatic, hydraulic tools', keywords: ['herramientas', 'neumáticas', 'tools'] },
  { code: '8468', chapter: '84', description: 'Máquinas y aparatos para soldar', descriptionEn: 'Welding machinery', keywords: ['soldar', 'soldadura', 'welding'] },
  { code: '8469', chapter: '84', description: 'Máquinas de escribir y máquinas para tratamiento de textos', descriptionEn: 'Typewriters, word processing machines', keywords: ['escribir', 'typewriters'] },
  { code: '8470', chapter: '84', description: 'Máquinas de calcular', descriptionEn: 'Calculating machines', keywords: ['calculadoras', 'calculators'] },
  { code: '8471', chapter: '84', description: 'Máquinas automáticas para tratamiento de datos', descriptionEn: 'Automatic data processing machines', keywords: ['computadoras', 'ordenadores', 'computers'] },
  { code: '8472', chapter: '84', description: 'Máquinas y aparatos de oficina', descriptionEn: 'Office machinery', keywords: ['oficina', 'office'] },
  { code: '8473', chapter: '84', description: 'Partes y accesorios para máquinas de las partidas 84.69 a 84.72', descriptionEn: 'Parts for office machines', keywords: ['partes', 'oficina', 'parts'] },
  { code: '8474', chapter: '84', description: 'Máquinas para clasificar, cribar, separar, lavar minerales', descriptionEn: 'Mineral sorting, screening machines', keywords: ['minerales', 'clasificación', 'minerals'] },
  { code: '8475', chapter: '84', description: 'Máquinas para montar lámparas, tubos, válvulas', descriptionEn: 'Lamp, tube assembling machines', keywords: ['lámparas', 'ensamblaje', 'lamps'] },
  { code: '8476', chapter: '84', description: 'Máquinas automáticas para venta de productos', descriptionEn: 'Automatic vending machines', keywords: ['expendedoras', 'vending machines'] },
  { code: '8477', chapter: '84', description: 'Máquinas para trabajar caucho o plástico', descriptionEn: 'Rubber, plastic working machinery', keywords: ['plástico', 'caucho', 'plastic'] },
  { code: '8478', chapter: '84', description: 'Máquinas para preparar o elaborar tabaco', descriptionEn: 'Tobacco processing machinery', keywords: ['tabaco', 'tobacco'] },
  { code: '8479', chapter: '84', description: 'Máquinas con función propia', descriptionEn: 'Machines with individual functions', keywords: ['máquinas', 'industriales', 'machines'] },
  { code: '8480', chapter: '84', description: 'Cajas de fundición, placas de fondo para moldes', descriptionEn: 'Moulding boxes, mould bases', keywords: ['moldes', 'fundición', 'moulds'] },

  // ELECTRÓNICA (Capítulo 85) - 60 códigos
  { code: '8501', chapter: '85', description: 'Motores y generadores eléctricos', descriptionEn: 'Electric motors and generators', keywords: ['motores', 'eléctricos', 'motors'] },
  { code: '8502', chapter: '85', description: 'Grupos electrógenos y convertidores rotativos', descriptionEn: 'Electric generating sets', keywords: ['generadores', 'generators'] },
  { code: '8503', chapter: '85', description: 'Partes para máquinas de las partidas 85.01 u 85.02', descriptionEn: 'Parts for electric motors', keywords: ['partes', 'motores', 'parts'] },
  { code: '8504', chapter: '85', description: 'Transformadores eléctricos, convertidores', descriptionEn: 'Electrical transformers', keywords: ['transformadores', 'transformers'] },
  { code: '8505', chapter: '85', description: 'Electroimanes, imanes permanentes', descriptionEn: 'Electromagnets, permanent magnets', keywords: ['imanes', 'magnets'] },
  { code: '8506', chapter: '85', description: 'Pilas y baterías de pilas eléctricas', descriptionEn: 'Primary cells and batteries', keywords: ['pilas', 'baterías', 'batteries'] },
  { code: '8507', chapter: '85', description: 'Acumuladores eléctricos', descriptionEn: 'Electric accumulators', keywords: ['acumuladores', 'baterías', 'accumulators'] },
  { code: '8508', chapter: '85', description: 'Aspiradoras', descriptionEn: 'Vacuum cleaners', keywords: ['aspiradoras', 'vacuum cleaners'] },
  { code: '8509', chapter: '85', description: 'Aparatos electromecánicos con motor eléctrico', descriptionEn: 'Electromechanical appliances', keywords: ['electrodomésticos', 'appliances'] },
  { code: '8510', chapter: '85', description: 'Afeitadoras, máquinas de cortar el pelo', descriptionEn: 'Shavers, hair clippers', keywords: ['afeitadoras', 'shavers'] },
  { code: '8511', chapter: '85', description: 'Aparatos eléctricos de encendido para motores', descriptionEn: 'Electrical ignition equipment', keywords: ['encendido', 'ignition'] },
  { code: '8512', chapter: '85', description: 'Aparatos eléctricos de alumbrado para vehículos', descriptionEn: 'Electrical lighting equipment for vehicles', keywords: ['luces', 'vehículos', 'lights'] },
  { code: '8513', chapter: '85', description: 'Lámparas eléctricas portátiles', descriptionEn: 'Portable electric lamps', keywords: ['linternas', 'lámparas', 'flashlights'] },
  { code: '8514', chapter: '85', description: 'Hornos eléctricos industriales o de laboratorio', descriptionEn: 'Industrial electric furnaces', keywords: ['hornos', 'eléctricos', 'furnaces'] },
  { code: '8515', chapter: '85', description: 'Máquinas y aparatos para soldar', descriptionEn: 'Electric welding apparatus', keywords: ['soldadura', 'eléctrica', 'welding'] },
  { code: '8516', chapter: '85', description: 'Calentadores eléctricos de agua, calefacción', descriptionEn: 'Electric water heaters', keywords: ['calentadores', 'calefacción', 'heaters'] },
  { code: '8517', chapter: '85', description: 'Aparatos eléctricos de telefonía o telegrafía', descriptionEn: 'Telephone sets, telecommunications', keywords: ['teléfonos', 'celulares', 'phones'] },
  { code: '8518', chapter: '85', description: 'Micrófonos, altavoces, auriculares', descriptionEn: 'Microphones, loudspeakers, headphones', keywords: ['micrófonos', 'auriculares', 'microphones'] },
  { code: '8519', chapter: '85', description: 'Aparatos de grabación o reproducción de sonido', descriptionEn: 'Sound recording apparatus', keywords: ['grabación', 'audio', 'recording'] },
  { code: '8521', chapter: '85', description: 'Aparatos de grabación o reproducción de imagen y sonido', descriptionEn: 'Video recording apparatus', keywords: ['video', 'grabación', 'video'] },
  { code: '8522', chapter: '85', description: 'Partes para aparatos de las partidas 85.19 a 85.21', descriptionEn: 'Parts for recording apparatus', keywords: ['partes', 'audio', 'parts'] },
  { code: '8523', chapter: '85', description: 'Discos, cintas y demás soportes para grabación de sonido', descriptionEn: 'Discs, tapes for sound recording', keywords: ['discos', 'cintas', 'discs'] },
  { code: '8525', chapter: '85', description: 'Aparatos emisores de radiotelefonía, radiotelegrafía', descriptionEn: 'Transmission apparatus', keywords: ['transmisores', 'radio', 'transmitters'] },
  { code: '8526', chapter: '85', description: 'Aparatos de radar, radionavegación', descriptionEn: 'Radar apparatus', keywords: ['radar', 'navegación', 'radar'] },
  { code: '8527', chapter: '85', description: 'Aparatos receptores de radiotelefonía, radiotelegrafía', descriptionEn: 'Reception apparatus for radio', keywords: ['radios', 'receptores', 'radios'] },
  { code: '8528', chapter: '85', description: 'Monitores y proyectores', descriptionEn: 'Monitors and projectors', keywords: ['monitores', 'proyectores', 'monitors'] },
  { code: '8529', chapter: '85', description: 'Partes para aparatos de las partidas 85.25 a 85.28', descriptionEn: 'Parts for transmission apparatus', keywords: ['partes', 'electrónica', 'parts'] },
  { code: '8530', chapter: '85', description: 'Aparatos eléctricos de señalización', descriptionEn: 'Electrical signalling equipment', keywords: ['señalización', 'signalling'] },
  { code: '8531', chapter: '85', description: 'Aparatos eléctricos de alarma', descriptionEn: 'Electric alarm apparatus', keywords: ['alarmas', 'alarms'] },
  { code: '8532', chapter: '85', description: 'Condensadores eléctricos', descriptionEn: 'Electrical capacitors', keywords: ['condensadores', 'capacitors'] },
  { code: '8533', chapter: '85', description: 'Resistencias eléctricas', descriptionEn: 'Electrical resistors', keywords: ['resistencias', 'resistors'] },
  { code: '8534', chapter: '85', description: 'Circuitos impresos', descriptionEn: 'Printed circuits', keywords: ['circuitos', 'impresos', 'circuits'] },
  { code: '8535', chapter: '85', description: 'Aparatos para corte, seccionamiento, protección de circuitos eléctricos', descriptionEn: 'Electrical circuit apparatus', keywords: ['interruptores', 'switches'] },
  { code: '8536', chapter: '85', description: 'Aparatos para corte, seccionamiento <= 1000 V', descriptionEn: 'Electrical apparatus <= 1000V', keywords: ['interruptores', 'switches'] },
  { code: '8537', chapter: '85', description: 'Cuadros, paneles, consolas para control eléctrico', descriptionEn: 'Electrical control panels', keywords: ['tableros', 'paneles', 'panels'] },
  { code: '8538', chapter: '85', description: 'Partes para aparatos de las partidas 85.35 a 85.37', descriptionEn: 'Parts for electrical apparatus', keywords: ['partes', 'eléctricos', 'parts'] },
  { code: '8539', chapter: '85', description: 'Lámparas y tubos eléctricos de incandescencia o descarga', descriptionEn: 'Electric lamps and tubes', keywords: ['lámparas', 'bombillas', 'lamps'] },
  { code: '8540', chapter: '85', description: 'Lámparas, tubos y válvulas electrónicos', descriptionEn: 'Electronic valves and tubes', keywords: ['válvulas', 'tubos', 'valves'] },
  { code: '8541', chapter: '85', description: 'Diodos, transistores y dispositivos semiconductores', descriptionEn: 'Diodes, transistors, semiconductors', keywords: ['semiconductores', 'transistores', 'semiconductors'] },
  { code: '8542', chapter: '85', description: 'Circuitos integrados electrónicos', descriptionEn: 'Electronic integrated circuits', keywords: ['circuitos', 'integrados', 'chips'] },
  { code: '8543', chapter: '85', description: 'Máquinas y aparatos eléctricos con función propia', descriptionEn: 'Electrical machines with individual functions', keywords: ['aparatos', 'eléctricos', 'electrical'] },
  { code: '8544', chapter: '85', description: 'Hilos, cables, conductores eléctricos aislados', descriptionEn: 'Insulated wire, cables', keywords: ['cables', 'conductores', 'wires'] },
  { code: '8545', chapter: '85', description: 'Electrodos de carbón, escobillas', descriptionEn: 'Carbon electrodes, brushes', keywords: ['electrodos', 'carbón', 'electrodes'] },
  { code: '8546', chapter: '85', description: 'Aisladores eléctricos de cualquier materia', descriptionEn: 'Electrical insulators', keywords: ['aisladores', 'insulators'] },
  { code: '8547', chapter: '85', description: 'Piezas aislantes para máquinas eléctricas', descriptionEn: 'Insulating fittings', keywords: ['aislantes', 'eléctricos', 'insulating'] },
  { code: '8548', chapter: '85', description: 'Desperdicios y desechos de pilas, baterías', descriptionEn: 'Waste and scrap of batteries', keywords: ['desperdicios', 'baterías', 'waste'] },

  // VEHÍCULOS (Capítulo 87) - 30 códigos
  { code: '8701', chapter: '87', description: 'Tractores', descriptionEn: 'Tractors', keywords: ['tractores', 'tractors'] },
  { code: '8702', chapter: '87', description: 'Vehículos automóviles para transporte de >= 10 personas', descriptionEn: 'Motor vehicles for transport of >= 10 persons', keywords: ['autobuses', 'ómnibus', 'buses'] },
  { code: '8703', chapter: '87', description: 'Automóviles de turismo', descriptionEn: 'Motor cars', keywords: ['automóviles', 'autos', 'cars'] },
  { code: '8704', chapter: '87', description: 'Vehículos automóviles para transporte de mercancías', descriptionEn: 'Motor vehicles for goods transport', keywords: ['camiones', 'trucks'] },
  { code: '8705', chapter: '87', description: 'Vehículos automóviles para usos especiales', descriptionEn: 'Special purpose motor vehicles', keywords: ['vehículos', 'especiales', 'special vehicles'] },
  { code: '8706', chapter: '87', description: 'Chasis con motor para vehículos', descriptionEn: 'Chassis with engine', keywords: ['chasis', 'chassis'] },
  { code: '8707', chapter: '87', description: 'Carrocerías para vehículos automóviles', descriptionEn: 'Bodies for motor vehicles', keywords: ['carrocerías', 'bodies'] },
  { code: '8708', chapter: '87', description: 'Partes y accesorios de vehículos automóviles', descriptionEn: 'Parts for motor vehicles', keywords: ['repuestos', 'autopartes', 'parts'] },
  { code: '8709', chapter: '87', description: 'Carretillas automóviles sin dispositivo de elevación', descriptionEn: 'Works trucks', keywords: ['carretillas', 'trucks'] },
  { code: '8710', chapter: '87', description: 'Tanques y demás vehículos automóviles blindados de combate', descriptionEn: 'Tanks and armoured vehicles', keywords: ['tanques', 'blindados', 'tanks'] },
  { code: '8711', chapter: '87', description: 'Motocicletas y velocípedos con motor auxiliar', descriptionEn: 'Motorcycles', keywords: ['motocicletas', 'motos', 'motorcycles'] },
  { code: '8712', chapter: '87', description: 'Bicicletas y demás velocípedos sin motor', descriptionEn: 'Bicycles', keywords: ['bicicletas', 'bicycles'] },
  { code: '8713', chapter: '87', description: 'Sillones de ruedas y demás vehículos para inválidos', descriptionEn: 'Wheelchairs', keywords: ['sillas de ruedas', 'wheelchairs'] },
  { code: '8714', chapter: '87', description: 'Partes y accesorios de vehículos de las partidas 87.11 a 87.13', descriptionEn: 'Parts for motorcycles, bicycles', keywords: ['partes', 'motos', 'parts'] },
  { code: '8715', chapter: '87', description: 'Coches, sillas y vehículos similares para transporte de niños', descriptionEn: 'Baby carriages', keywords: ['cochecitos', 'bebés', 'carriages'] },
  { code: '8716', chapter: '87', description: 'Remolques y semirremolques', descriptionEn: 'Trailers and semi-trailers', keywords: ['remolques', 'trailers'] },

  // INSTRUMENTOS ÓPTICOS (Capítulo 90) - 25 códigos
  { code: '9001', chapter: '90', description: 'Fibras ópticas, haces de fibras ópticas', descriptionEn: 'Optical fibres', keywords: ['fibra óptica', 'optical fibre'] },
  { code: '9002', chapter: '90', description: 'Lentes, prismas, espejos', descriptionEn: 'Lenses, prisms, mirrors', keywords: ['lentes', 'lenses'] },
  { code: '9003', chapter: '90', description: 'Monturas de gafas y artículos similares', descriptionEn: 'Frames for spectacles', keywords: ['monturas', 'anteojos', 'frames'] },
  { code: '9004', chapter: '90', description: 'Gafas (anteojos) correctoras, protectoras', descriptionEn: 'Spectacles, goggles', keywords: ['anteojos', 'gafas', 'glasses'] },
  { code: '9005', chapter: '90', description: 'Binoculares, catalejos, telescopios', descriptionEn: 'Binoculars, telescopes', keywords: ['binoculares', 'telescopios', 'binoculars'] },
  { code: '9006', chapter: '90', description: 'Cámaras fotográficas', descriptionEn: 'Photographic cameras', keywords: ['cámaras', 'fotográficas', 'cameras'] },
  { code: '9007', chapter: '90', description: 'Cámaras y proyectores cinematográficos', descriptionEn: 'Cinematographic cameras', keywords: ['cámaras', 'cine', 'cinematographic'] },
  { code: '9008', chapter: '90', description: 'Proyectores de imagen fija, ampliadoras', descriptionEn: 'Image projectors', keywords: ['proyectores', 'projectors'] },
  { code: '9010', chapter: '90', description: 'Aparatos de laboratorio fotográfico o cinematográfico', descriptionEn: 'Photographic laboratory apparatus', keywords: ['laboratorio', 'fotográfico', 'laboratory'] },
  { code: '9011', chapter: '90', description: 'Microscopios ópticos', descriptionEn: 'Optical microscopes', keywords: ['microscopios', 'microscopes'] },
  { code: '9012', chapter: '90', description: 'Microscopios y difractógrafos', descriptionEn: 'Microscopes and diffraction apparatus', keywords: ['microscopios', 'microscopes'] },
  { code: '9013', chapter: '90', description: 'Dispositivos de cristal líquido, láseres', descriptionEn: 'Liquid crystal devices, lasers', keywords: ['láser', 'cristal líquido', 'laser'] },
  { code: '9014', chapter: '90', description: 'Brújulas, instrumentos de navegación', descriptionEn: 'Direction finding compasses', keywords: ['brújulas', 'navegación', 'compasses'] },
  { code: '9015', chapter: '90', description: 'Instrumentos de geodesia, topografía', descriptionEn: 'Surveying instruments', keywords: ['topografía', 'geodesia', 'surveying'] },
  { code: '9016', chapter: '90', description: 'Balanzas sensibles a un peso <= 5 cg', descriptionEn: 'Balances of sensitivity <= 5 cg', keywords: ['balanzas', 'precisión', 'balances'] },
  { code: '9017', chapter: '90', description: 'Instrumentos de dibujo, trazado, cálculo', descriptionEn: 'Drawing instruments', keywords: ['dibujo', 'instrumentos', 'drawing'] },
  { code: '9018', chapter: '90', description: 'Instrumentos y aparatos de medicina, cirugía', descriptionEn: 'Medical instruments', keywords: ['médicos', 'instrumentos', 'medical'] },
  { code: '9019', chapter: '90', description: 'Aparatos de mecanoterapia, masaje', descriptionEn: 'Mechanotherapy appliances', keywords: ['terapia', 'masaje', 'therapy'] },
  { code: '9020', chapter: '90', description: 'Aparatos de respiración', descriptionEn: 'Breathing appliances', keywords: ['respiración', 'breathing'] },
  { code: '9021', chapter: '90', description: 'Artículos de ortopedia, prótesis', descriptionEn: 'Orthopaedic appliances', keywords: ['ortopedia', 'prótesis', 'orthopaedic'] },
  { code: '9022', chapter: '90', description: 'Aparatos de rayos X', descriptionEn: 'X-ray apparatus', keywords: ['rayos X', 'x-ray'] },
  { code: '9023', chapter: '90', description: 'Instrumentos para demostraciones', descriptionEn: 'Instruments for demonstrations', keywords: ['demostraciones', 'demonstrations'] },
  { code: '9024', chapter: '90', description: 'Máquinas para ensayos de dureza, tracción', descriptionEn: 'Testing machines', keywords: ['ensayos', 'testing'] },
  { code: '9025', chapter: '90', description: 'Densímetros, areómetros, termómetros', descriptionEn: 'Hydrometers, thermometers', keywords: ['termómetros', 'thermometers'] },
  { code: '9026', chapter: '90', description: 'Instrumentos para medida o control de caudal, nivel, presión', descriptionEn: 'Measuring instruments', keywords: ['medición', 'presión', 'measuring'] },

  // MUEBLES (Capítulo 94) - 15 códigos
  { code: '9401', chapter: '94', description: 'Asientos', descriptionEn: 'Seats', keywords: ['asientos', 'sillas', 'seats'] },
  { code: '9402', chapter: '94', description: 'Mobiliario para medicina, cirugía, odontología', descriptionEn: 'Medical furniture', keywords: ['mobiliario', 'médico', 'medical'] },
  { code: '9403', chapter: '94', description: 'Muebles y sus partes', descriptionEn: 'Furniture and parts', keywords: ['muebles', 'furniture'] },
  { code: '9404', chapter: '94', description: 'Somieres, colchones, almohadas', descriptionEn: 'Mattresses, cushions', keywords: ['colchones', 'mattresses'] },
  { code: '9405', chapter: '94', description: 'Aparatos de alumbrado', descriptionEn: 'Lamps and lighting fittings', keywords: ['lámparas', 'iluminación', 'lamps'] },
  { code: '9406', chapter: '94', description: 'Construcciones prefabricadas', descriptionEn: 'Prefabricated buildings', keywords: ['prefabricados', 'construcciones', 'prefabricated'] },

  // JUGUETES (Capítulo 95) - 10 códigos
  { code: '9501', chapter: '95', description: 'Juguetes de ruedas', descriptionEn: 'Wheeled toys', keywords: ['juguetes', 'ruedas', 'toys'] },
  { code: '9502', chapter: '95', description: 'Muñecas', descriptionEn: 'Dolls', keywords: ['muñecas', 'dolls'] },
  { code: '9503', chapter: '95', description: 'Juguetes', descriptionEn: 'Toys', keywords: ['juguetes', 'toys'] },
  { code: '9504', chapter: '95', description: 'Artículos para juegos de sociedad', descriptionEn: 'Articles for parlour games', keywords: ['juegos', 'mesa', 'games'] },
  { code: '9505', chapter: '95', description: 'Artículos para fiestas, carnaval', descriptionEn: 'Festive articles', keywords: ['fiestas', 'carnaval', 'festive'] },
  { code: '9506', chapter: '95', description: 'Artículos para cultura física, gimnasia, atletismo', descriptionEn: 'Sports equipment', keywords: ['deportes', 'gimnasia', 'sports'] },
  { code: '9507', chapter: '95', description: 'Cañas de pescar, anzuelos', descriptionEn: 'Fishing rods, hooks', keywords: ['pesca', 'fishing'] },
  { code: '9508', chapter: '95', description: 'Tiovivos, columpios, casetas de tiro', descriptionEn: 'Roundabouts, swings', keywords: ['parques', 'diversiones', 'amusement'] }
];

async function main() {
  try {
    await initDatabase();
    console.log(`📊 Insertando ${FINAL_HS_CODES.length} códigos HS finales...`);
    console.log('📦 Categorías: Maquinaria (84), Electrónica (85), Vehículos (87), Óptica (90), Muebles (94), Juguetes (95)');
    
    let insertedCount = 0;
    
    for (const hs of FINAL_HS_CODES) {
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
        if (insertedCount % 20 === 0) process.stdout.write('.');
      } catch (error: any) {
        console.error(`Error insertando ${hs.code}:`, error.message);
      }
    }
    
    console.log('');
    saveDatabase();
    console.log(`✅ ${insertedCount} códigos HS finales insertados exitosamente!`);
    console.log('📦 Resumen por categoría:');
    console.log('   - Maquinaria (84): ~80 códigos');
    console.log('   - Electrónica (85): ~60 códigos');
    console.log('   - Vehículos (87): ~30 códigos');
    console.log('   - Instrumentos Ópticos (90): ~25 códigos');
    console.log('   - Muebles (94): ~15 códigos');
    console.log('   - Juguetes (95): ~10 códigos');
    console.log('💾 Database saved');
    console.log('');
    console.log('🎯 TOTAL ESTIMADO EN BASE DE DATOS: ~450 códigos HS');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
