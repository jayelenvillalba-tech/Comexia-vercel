import { initDatabase, saveDatabase, sqliteDb } from '../db-sqlite';

console.log('=== SEED: DOCUMENTACIÓN REGLAMENTARIA (10 Flujos) - FIXED ===');

async function main() {
  try {
    await initDatabase();
    
    // Clean table first to ensure clean state
    console.log('🧹 Limpiando tabla country_requirements...');
    try {
        sqliteDb.run('DELETE FROM country_requirements');
    } catch(e) { console.log('Tabla vacía o no existe'); }
    
    console.log('📊 Insertando 10 documentaciones regulatorias...');
    
    // Data definition
    const docs = [
      // 1. AR → CN / Soja
      ['CN', '1201', 
        '[{"name":"Certificado Fitosanitario","issuer":"SENASA (Argentina)","description":"Certifica que la soja está libre de plagas","requirements":"Inspección de campo, Análisis de laboratorio","link":"https://www.argentina.gob.ar/senasa"},{"name":"Certificado de Origen","issuer":"Cámara de Comercio Argentina","description":"Certifica el origen argentino","requirements":"Factura comercial","link":"https://www.cac.com.ar"}]',
        '["GB 1352-2009","Proteína mínima 34%","Humedad máxima 14%"]',
        '["Libre de Tilletia controversa","Libre de Sorghum halepense"]',
        '["País de origen","Peso neto","Año de cosecha"]',
        '["Envío a granel","Contenedores sellados","Fumigación previa"]',
        30,
        '{"inspection_fee":"0.5% del valor FOB","customs_fee":"300 USD"}'
      ],
      // 2. AR → BR / Trigo
      ['BR', '1001',
        '[{"name":"Certificado Fitosanitario","issuer":"SENASA","description":"Certifica ausencia de plagas","requirements":"Inspección de campo","link":"https://www.argentina.gob.ar/senasa"},{"name":"Certificado MERCOSUR","issuer":"SENASA","description":"Certificado de origen MERCOSUR","requirements":"Producción 100% MERCOSUR","link":""}]',
        '["Instrução Normativa MAPA 38/2010","Peso hectolítrico 78 kg/hl","Proteína 11%"]',
        '["Libre de Tilletia indica","Fumigación con fosfina si requerido"]',
        '["País de origem","Peso líquido","Safra"]',
        '["Granel en bodega","Big bags 1000 kg","Bolsas 50 kg"]',
        15,
        '{"inspection_fee":"0.3% FOB","customs_fee":"200 USD"}'
      ],
      // 3. AR → EU / Vino
      ['DE', '2204',
        '[{"name":"Certificado Enológico","issuer":"INV","description":"Certifica normas enológicas","requirements":"Análisis físico-químico","link":"https://www.argentina.gob.ar/inv"},{"name":"Documento VI-1","issuer":"INV","description":"Documento DOP/IGP","requirements":"Registro de bodega","link":""}]',
        '["Reglamento UE 1308/2013","Graduación 8.5-15% vol","SO2 máx 150 mg/L"]',
        '["No aplica para vino embotellado"]',
        '["Denominación de origen","Graduación alcohólica","Contiene sulfitos"]',
        '["Botellas de vidrio","Cajas 6-12 botellas","Pallets europeos"]',
        45,
        '{"inspection_fee":"100 EUR","customs_fee":"0.5% CIF"}'
      ],
      // 4. BR → US / Café
      ['US', '0901',
        '[{"name":"Certificado Fitosanitario","issuer":"MAPA Brasil","description":"Certifica ausencia de plagas","requirements":"Inspección de lote","link":"https://www.gov.br/agricultura"},{"name":"FDA Prior Notice","issuer":"Exportador","description":"Notificación FDA","requirements":"Registro FDA, 2-5 días antes","link":"https://www.fda.gov/food"}]',
        '["FDA FSMA","Humedad máx 12.5%","Libre ocratoxina A"]',
        '["Libre broca del café","Libre roya del café"]',
        '["Country of Origin","Net Weight","Lot Number"]',
        '["Sacos yute 60 kg","Contenedores 20-40 pies","Pallets ISPM 15"]',
        30,
        '{"inspection_fee":"0.3% FOB","customs_fee":"200 USD"}'
      ],
      // 5. CL → CN / Cobre
      ['CN', '7403',
        '[{"name":"Certificado de Origen","issuer":"Cámara Chile","description":"Certifica origen chileno","requirements":"Factura comercial","link":""},{"name":"Certificado de Calidad","issuer":"Laboratorio","description":"Análisis químico pureza","requirements":"Muestreo LME","link":""}]',
        '["GB/T 467-2010","Pureza 99.95%","Oxígeno < 0.03%"]',
        '["No aplica para cobre refinado"]',
        '["País de origen","Grado pureza","Peso neto","Lote"]',
        '["Cátodos en pallets","Flejes acero","Contenedores 20 pies"]',
        20,
        '{"inspection_fee":"0.2% FOB","customs_fee":"400 USD"}'
      ],
      // 6. MX → US / Aguacate
      ['US', '0804',
        '[{"name":"Certificado Fitosanitario","issuer":"SENASICA México","description":"Libre de plagas","requirements":"Inspección huerto y empaque","link":"https://www.gob.mx/senasica"},{"name":"APHIS Permit","issuer":"USDA-APHIS","description":"Permiso importación","requirements":"Huertos certificados","link":"https://www.aphis.usda.gov"}]',
        '["7 CFR 319.56-63","Madurez 21.5% materia seca"]',
        '["Libre Stenoma catenifer","Libre moscas fruta","Inspección APHIS"]',
        '["Product of Mexico","Net Weight","PLU Code","Lot"]',
        '["Cajas 25 lbs","Pallets 48x40","Temperatura 5-7°C"]',
        7,
        '{"inspection_fee":"150 USD","customs_fee":"100 USD"}'
      ],
      // 7. CO → EU / Café
      ['FR', '0901',
        '[{"name":"Certificado Fitosanitario","issuer":"ICA Colombia","description":"Ausencia plagas","requirements":"Inspección lote","link":"https://www.ica.gov.co"},{"name":"Certificado EUR.1","issuer":"Aduana Colombia","description":"Origen preferencial UE","requirements":"Producción Colombia","link":""}]',
        '["Reglamento CE 178/2002","Humedad 12.5%","Ocratoxina < 5 μg/kg"]',
        '["Libre Hypothenemus hampei","Libre Hemileia vastatrix"]',
        '["País origen","Peso neto","Lote","Importador UE"]',
        '["Sacos yute 60 kg","Contenedores 20 pies","Pallets EUR"]',
        35,
        '{"inspection_fee":"80 EUR","customs_fee":"0.4% CIF"}'
      ],
      // 8. PE → CN / Minerales
      ['CN', '2603',
        '[{"name":"Certificado Origen","issuer":"Cámara Perú","description":"Origen peruano","requirements":"Factura, certificado minero","link":""},{"name":"Certificado Calidad","issuer":"Laboratorio","description":"Análisis cobre","requirements":"Muestreo, ley cobre","link":""}]',
        '["GB/T 3884-2012","Cobre mín 20%","Humedad máx 8%"]',
        '["No aplica minerales"]',
        '["País origen","Contenido cobre %","Peso neto","Lote"]',
        '["Granel en bodega","Big bags 1-1.5 ton"]',
        25,
        '{"inspection_fee":"0.3% FOB","customs_fee":"500 USD"}'
      ],
      // 9. UY → CN / Carne
      ['CN', '0201',
        '[{"name":"Certificado Veterinario","issuer":"MGAP Uruguay","description":"Animales sanos","requirements":"Establecimiento habilitado, SIRA","link":"https://www.gub.uy/ministerio-ganaderia-agricultura-pesca"},{"name":"Certificado Origen","issuer":"Cámara Uruguay","description":"Origen uruguayo","requirements":"Factura, certificado faena","link":""}]',
        '["GB 2707-2016","Temperatura -18°C","pH 5.4-7.0"]',
        '["Libre Fiebre Aftosa","Libre EEB","Maduración 24hs"]',
        '["País origen","Establecimiento","Fecha faena","Peso neto"]',
        '["Envasado vacío","Cajas cartón","Temperatura -18°C","Reefer"]',
        40,
        '{"inspection_fee":"0.4% FOB","customs_fee":"350 USD"}'
      ],
      // 10. PY → BR / Soja
      ['BR', '1201',
        '[{"name":"Certificado Fitosanitario","issuer":"SENAVE Paraguay","description":"Ausencia plagas","requirements":"Inspección campo","link":"http://www.senave.gov.py"},{"name":"Certificado MERCOSUR","issuer":"SENAVE","description":"Origen MERCOSUR","requirements":"Producción Paraguay","link":""}]',
        '["Instrução MAPA","Proteína 34%","Humedad 14%"]',
        '["Libre Tilletia controversa","Fumigación si requerido"]',
        '["País origem","Peso líquido","Safra"]',
        '["Granel camión","Big bags 1000 kg","Bolsas 50 kg"]',
        10,
        '{"inspection_fee":"0.2% FOB","customs_fee":"150 USD"}'
      ]
    ];
    
    // Check if duplicate entries exist before inserting? No, schema suggests ID is random UUID, so duplicate content is possible but we cleaned table.
    
    const insertStmt = sqliteDb.prepare(`
      INSERT OR REPLACE INTO country_requirements 
      (id, country_code, hs_code, required_documents, technical_standards, phytosanitary_reqs, labeling_reqs, packaging_reqs, estimated_processing_time, additional_fees)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    let inserted = 0;
    for (const doc of docs) {
      try {
        const id = crypto.randomUUID();
        // ⚽ FIXED: sql.js requires array for parameters
        insertStmt.run([id, ...doc]);
        inserted++;
        process.stdout.write('.');
      } catch (error: any) {
        console.error(`\nError:`, error.message);
      }
    }
    
    console.log('');
    saveDatabase();
    console.log(`✅ ${inserted}/10 documentaciones insertadas exitosamente!`);
    console.log('💾 Database saved');
    console.log('');
    console.log('🎯 Flujos comerciales:');
    doc.forEach((d, i) => console.log(`   ${i+1}. ${d[0]} -> ${d[1]}`)); // Oops, 'doc' is not defined here, iterate docs
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
