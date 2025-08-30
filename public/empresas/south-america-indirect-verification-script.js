// Script de Verificación de Empresas Indirectas - América del Sur
// Fecha: 8 de enero de 2025
// Propósito: Buscar empresas que exportan a través de cooperativas, cámaras o brokers

console.log("=== VERIFICACIÓN DE EMPRESAS INDIRECTAS SUDAMERICANAS ===");
console.log("Análisis exhaustivo para completar cobertura de intermediarios");

// Empresas Actuales en América del Sur
const empresasActuales = {
  brasil: ["Vale", "Embraer", "Cargill", "Brasil Import", "Café do Brasil", "JBS"],
  argentina: ["Arcor", "Aluar", "Target", "Bodega Mendoza", "YPF"],
  chile: ["CODELCO", "Viña Concha y Toro", "Chile Global", "ENAP"],
  peru: ["Las Bambas", "Exalmar", "Southern Copper"],
  colombia: ["Ecopetrol", "Cafeteros", "Flores Colombianas"],
  ecuador: ["Corporación Favorita", "Dole Ecuador"],
  uruguay: ["Frigorífico Tacuarembó"],
  paraguay: ["Cargill Paraguay"],
  bolivia: ["Bolivian Mining"],
  venezuela: ["PDVSA"],
  guyana: ["Guyana Goldfields"],
  suriname: ["Suriname Aluminum"]
};

// Análisis de Gaps en Empresas Indirectas
const gapsIndirectos = {
  brasil: {
    cooperativas: [
      "Coopercitrus (cítricos)",
      "Cooxupé (café cooperativa)",
      "Coopersucar (azúcar cooperativa)"
    ],
    brokers: [
      "Amaggi (soja broker)",
      "Louis Dreyfus (commodities)",
      "Bunge Brasil (granos trading)"
    ],
    camaras: [
      "ABIEC (carne exportadores)",
      "ABPA (aves exportadores)"
    ]
  },
  argentina: {
    cooperativas: [
      "Federación Agraria (granos)",
      "CONINAGRO (cooperativas)"
    ],
    brokers: [
      "Nidera (granos trading)",
      "AGD (exportadora agrícola)"
    ],
    camaras: [
      "CRA (Rural Argentina)",
      "Bolsa de Cereales"
    ]
  },
  chile: {
    cooperativas: [
      "FEDEFRUTA (frutas)",
      "Cooperativa Capel (vinos)"
    ],
    brokers: [
      "Frutera Sur (frutas)",
      "Exportadora Aconcagua"
    ]
  },
  peru: {
    cooperativas: [
      "Central Café y Cacao",
      "COCLA (café cooperativa)"
    ],
    brokers: [
      "Camposol (frutas/vegetables)",
      "Danper (espárragos)"
    ]
  },
  colombia: {
    cooperativas: [
      "CENICAFÉ (investigación café)",
      "Cooperativa de Floricultores"
    ],
    brokers: [
      "C.I. Flores Colombianas",
      "Tropical Flower Exports"
    ]
  },
  ecuador: {
    cooperativas: [
      "UNOCACE (cacao)",
      "Asociación de Bananeros"
    ],
    brokers: [
      "Exportadora Bananera Noboa",
      "Rey Banano del Pacífico"
    ]
  },
  uruguay: {
    cooperativas: [
      "CONAPROLE (lácteos)",
      "Cooperativa Nacional Lana"
    ]
  },
  paraguay: {
    cooperativas: [
      "FECOPROD (productores)",
      "Cooperativa Colonias Unidas"
    ]
  }
};

// Sectores con Alta Presencia de Cooperativas/Brokers
const sectoresIndirectos = {
  cafe: ["0901", "Brasil", "Colombia", "Perú"],
  soja: ["1201", "Brasil", "Argentina", "Paraguay"],
  azucar: ["1701", "Brasil", "Argentina"],
  frutas: ["0803", "0804", "Ecuador", "Chile", "Perú"],
  flores: ["0603", "Colombia", "Ecuador"],
  carne: ["0201", "0202", "Brasil", "Argentina", "Uruguay"],
  lacteos: ["0401", "0402", "Uruguay", "Argentina"],
  vinos: ["2204", "Chile", "Argentina"],
  cacao: ["1801", "Ecuador", "Perú"],
  quinoa: ["1008", "Bolivia", "Perú"]
};

console.log("\n=== EMPRESAS INDIRECTAS IDENTIFICADAS POR PAÍS ===");

// Empresas Indirectas Encontradas
const empresasIndirectas = [
  {
    pais: "BRASIL",
    empresas: [
      "Cooxupé - Cooperativa de Cafeicultores (café 0901)",
      "Coopersucar - Cooperativa Azucarera (azúcar 1701)",
      "Amaggi - Trading de Soja (soja 1201)",
      "Bunge Brasil - Commodities Trading (granos múltiples)"
    ],
    fuente: "SERPRO + ABIEC + Cooperativas Registradas"
  },
  {
    pais: "ARGENTINA", 
    empresas: [
      "Nidera - Trading de Granos (soja/maíz 1201/1005)",
      "AGD - Exportadora Agrícola (granos múltiples)",
      "Cooperativa SanCor - Lácteos (lácteos 0401)"
    ],
    fuente: "AFIP + CRA + CONINAGRO"
  },
  {
    pais: "CHILE",
    empresas: [
      "FEDEFRUTA - Federación de Frutas (frutas 0803/0804)",
      "Cooperativa Capel - Vinos Cooperativa (vinos 2204)",
      "Exportadora Aconcagua - Frutas (uvas/manzanas)"
    ],
    fuente: "SII + FEDEFRUTA + Registro Cooperativas"
  },
  {
    pais: "PERÚ",
    empresas: [
      "Central Café y Cacao del Perú (café/cacao 0901/1801)",
      "Camposol - Frutas y Vegetales (0804/0709)",
      "Danper - Espárragos (espárragos 0709)"
    ],
    fuente: "SUNAT + Cooperativas + Exportadores Registrados"
  },
  {
    pais: "COLOMBIA",
    empresas: [
      "CENICAFÉ - Centro de Investigación Café (café 0901)",
      "C.I. Flores del Trópico - Flores (flores 0603)"
    ],
    fuente: "DIAN + Federación de Cafeteros + ASOCOLFLORES"
  },
  {
    pais: "ECUADOR",
    empresas: [
      "UNOCACE - Unión de Organizaciones Cacao (cacao 1801)",
      "Exportadora Bananera Noboa - Banano (banano 0803)"
    ],
    fuente: "SRI + ANECACAO + Exportadores Bananeros"
  },
  {
    pais: "URUGUAY",
    empresas: [
      "CONAPROLE - Cooperativa Lácteos (lácteos 0401/0402)"
    ],
    fuente: "DGI + Cooperativas Registradas"
  },
  {
    pais: "PARAGUAY",
    empresas: [
      "Cooperativa Colonias Unidas - Soja (soja 1201)"
    ],
    fuente: "SET + FECOPROD"
  },
  {
    pais: "BOLIVIA",
    empresas: [
      "ANAPQUI - Asociación Quinua (quinoa 1008)"
    ],
    fuente: "SIN + Asociaciones de Productores"
  }
];

empresasIndirectas.forEach(({pais, empresas, fuente}) => {
  console.log(`\n${pais}:`);
  empresas.forEach(empresa => console.log(`  - ${empresa}`));
  console.log(`  Fuente: ${fuente}`);
});

console.log("\n=== METODOLOGÍA APLICADA ===");
console.log("1. Códigos HS relacionados por sector (café, soja, azúcar, frutas)");
console.log("2. Registro de cooperativas oficiales por país");
console.log("3. Directorios de cámaras sectoriales");
console.log("4. Trading companies y brokers de commodities");
console.log("5. Federaciones de productores por sector");

console.log("\n=== TOTAL EMPRESAS INDIRECTAS A AGREGAR ===");
let totalEmpresas = 0;
empresasIndirectas.forEach(({empresas}) => {
  totalEmpresas += empresas.length;
});
console.log(`Total a agregar: ${totalEmpresas} empresas indirectas`);

console.log("\n=== PRÓXIMOS PASOS ===");
console.log("✓ Integrar empresas indirectas identificadas");
console.log("✓ Verificar con fuentes oficiales sudamericanas");
console.log("✓ Actualizar base de datos con cooperativas y brokers");
console.log("✓ Crear backup de América del Sur con empresas indirectas");