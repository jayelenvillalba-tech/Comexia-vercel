// SISTEMA DE EXPANSIÓN GRADUAL GLOBAL - K.O.R.A (Enero 8, 2025)
// Objetivo: Completar 132 países restantes (68% del mundo) mediante expansión sistemática
// Metodología: Priorización por volumen comercial + automatización + verificación oficial

const GLOBAL_EXPANSION_SYSTEM = {
  estadoActual: {
    paisesCompletados: 63,
    paisesTotales: 195,
    porcentajeCompletado: 32.3,
    paisesRestantes: 132,
    objetivoFinal: "100% cobertura global"
  },

  // =============================================
  // FASE 1: MERCADOS EMERGENTES PRIORITARIOS (20 países)
  // Criterio: PIB > $500B o volumen comercial > $100B
  // =============================================
  
  fase1_MercadosEmergentes: {
    prioridad: "ALTA",
    timeline: "2-3 semanas",
    paises: [
      // Europa Oriental
      { codigo: "RU", nombre: "Rusia", pib: 1829, comercio: 686, sectores: ["energy", "metals", "agriculture"] },
      { codigo: "TR", nombre: "Turquía", pib: 761, comercio: 438, sectores: ["textiles", "automotive", "steel"] },
      { codigo: "UA", nombre: "Ucrania", pib: 200, comercio: 108, sectores: ["agriculture", "metals", "chemicals"] },
      
      // Oriente Medio
      { codigo: "AE", nombre: "Emiratos Árabes Unidos", pib: 507, comercio: 507, sectores: ["oil", "trading", "logistics"] },
      { codigo: "SA", nombre: "Arabia Saudí", pib: 833, comercio: 478, sectores: ["oil", "petrochemicals", "mining"] },
      { codigo: "IR", nombre: "Irán", pib: 231, comercio: 123, sectores: ["oil", "petrochemicals", "carpets"] },
      { codigo: "IL", nombre: "Israel", pib: 482, comercio: 123, sectores: ["technology", "pharmaceuticals", "diamonds"] },
      
      // Asia Central/Sur
      { codigo: "VN", nombre: "Vietnam", pib: 409, comercio: 734, sectores: ["electronics", "textiles", "agriculture"] },
      { codigo: "BD", nombre: "Bangladesh", pib: 460, comercio: 110, sectores: ["textiles", "pharmaceuticals", "jute"] },
      { codigo: "PK", nombre: "Pakistán", pib: 347, comercio: 89, sectores: ["textiles", "agriculture", "sports goods"] },
      { codigo: "KZ", nombre: "Kazajstán", pib: 220, comercio: 89, sectores: ["oil", "metals", "agriculture"] },
      
      // África
      { codigo: "DZ", nombre: "Argelia", pib: 193, comercio: 67, sectores: ["oil", "gas", "minerals"] },
      { codigo: "AO", nombre: "Angola", pib: 124, comercio: 56, sectores: ["oil", "diamonds", "agriculture"] },
      { codigo: "TN", nombre: "Túnez", pib: 48, comercio: 28, sectores: ["agriculture", "textiles", "phosphates"] },
      
      // América Latina
      { codigo: "CR", nombre: "Costa Rica", pib: 68, comercio: 35, sectores: ["agriculture", "electronics", "medical devices"] },
      { codigo: "DO", nombre: "República Dominicana", pib: 113, comercio: 23, sectores: ["agriculture", "textiles", "mining"] },
      { codigo: "GT", nombre: "Guatemala", pib: 87, comercio: 24, sectores: ["agriculture", "textiles", "food processing"] },
      
      // Oceanía
      { codigo: "NC", nombre: "Nueva Caledonia", pib: 11, comercio: 8, sectores: ["nickel", "agriculture", "tourism"] },
      { codigo: "PF", nombre: "Polinesia Francesa", pib: 6, comercio: 3, sectores: ["pearls", "agriculture", "tourism"] },
      
      // Europa
      { codigo: "HR", nombre: "Croacia", pib: 69, comercio: 37, sectores: ["shipbuilding", "tourism", "agriculture"] }
    ]
  },

  // =============================================
  // FASE 2: MERCADOS MEDIANOS (30 países)
  // Criterio: PIB $50B-$500B o importancia regional
  // =============================================
  
  fase2_MercadosMedianos: {
    prioridad: "MEDIA",
    timeline: "1-2 meses",
    paises: [
      // África Subsahariana
      { codigo: "ET", nombre: "Etiopía", sectores: ["coffee", "leather", "textiles"] },
      { codigo: "UG", nombre: "Uganda", sectores: ["coffee", "tea", "cotton"] },
      { codigo: "TZ", nombre: "Tanzania", sectores: ["agriculture", "mining", "tourism"] },
      { codigo: "SN", nombre: "Senegal", sectores: ["fishing", "agriculture", "phosphates"] },
      { codigo: "CI", nombre: "Costa de Marfil", sectores: ["cocoa", "coffee", "palm oil"] },
      
      // Asia-Pacífico
      { codigo: "MM", nombre: "Myanmar", sectores: ["agriculture", "gems", "textiles"] },
      { codigo: "KH", nombre: "Camboya", sectores: ["textiles", "agriculture", "tourism"] },
      { codigo: "LA", nombre: "Laos", sectores: ["agriculture", "mining", "hydropower"] },
      { codigo: "MN", nombre: "Mongolia", sectores: ["mining", "agriculture", "textiles"] },
      { codigo: "LK", nombre: "Sri Lanka", sectores: ["tea", "textiles", "rubber"] },
      
      // Oriente Medio Expandido
      { codigo: "JO", nombre: "Jordania", sectores: ["phosphates", "textiles", "pharmaceuticals"] },
      { codigo: "LB", nombre: "Líbano", sectores: ["banking", "agriculture", "jewelry"] },
      { codigo: "QA", nombre: "Qatar", sectores: ["gas", "petrochemicals", "aluminum"] },
      { codigo: "KW", nombre: "Kuwait", sectores: ["oil", "petrochemicals", "shipping"] },
      { codigo: "BH", nombre: "Baréin", sectores: ["banking", "aluminum", "oil refining"] },
      { codigo: "OM", nombre: "Omán", sectores: ["oil", "gas", "fishing"] },
      
      // Europa Oriental/Balcanes
      { codigo: "RS", nombre: "Serbia", sectores: ["automotive", "agriculture", "mining"] },
      { codigo: "BG", nombre: "Bulgaria", sectores: ["agriculture", "mining", "textiles"] },
      { codigo: "SK", nombre: "Eslovaquia", sectores: ["automotive", "steel", "electronics"] },
      { codigo: "SI", nombre: "Eslovenia", sectores: ["automotive", "pharmaceuticals", "machinery"] },
      { codigo: "EE", nombre: "Estonia", sectores: ["technology", "wood", "metals"] },
      { codigo: "LV", nombre: "Letonia", sectores: ["wood", "metals", "agriculture"] },
      { codigo: "LT", nombre: "Lituania", sectores: ["agriculture", "chemicals", "textiles"] },
      { codigo: "BY", nombre: "Bielorrusia", sectores: ["machinery", "chemicals", "textiles"] },
      { codigo: "MD", nombre: "Moldavia", sectores: ["agriculture", "wine", "textiles"] },
      
      // América Central/Caribe
      { codigo: "HN", nombre: "Honduras", sectores: ["coffee", "bananas", "textiles"] },
      { codigo: "NI", nombre: "Nicaragua", sectores: ["coffee", "beef", "textiles"] },
      { codigo: "SV", nombre: "El Salvador", sectores: ["coffee", "textiles", "chemicals"] },
      { codigo: "PA", nombre: "Panamá", sectores: ["logistics", "banking", "agriculture"] },
      { codigo: "JM", nombre: "Jamaica", sectores: ["bauxite", "agriculture", "tourism"] },
      { codigo: "TT", nombre: "Trinidad y Tobago", sectores: ["oil", "gas", "chemicals"] }
    ]
  },

  // =============================================
  // FASE 3: PAÍSES PEQUEÑOS Y TERRITORIOS (82 países)
  // Criterio: Completar cobertura global
  // =============================================
  
  fase3_PaisesPequenos: {
    prioridad: "BAJA",
    timeline: "3-6 meses",
    estrategia: "Automatización masiva + APIs gubernamentales",
    categorias: {
      islasCaribe: 25,
      islasOceania: 20,
      africaSubsahariana: 25,
      europaPequena: 12
    }
  },

  // =============================================
  // METODOLOGÍA DE EXPANSIÓN AUTOMÁTICA
  // =============================================
  
  metodologiaExpansion: {
    pasos: [
      "1. Identificar registros empresariales oficiales del país",
      "2. Conectar con APIs gubernamentales de aduanas/comercio",
      "3. Aplicar filtros por volumen de exportación/importación",
      "4. Verificar empresas mediante registros oficiales",
      "5. Geo-localizar mediante coordenadas GPS",
      "6. Integrar al sistema con códigos HS correspondientes"
    ],
    
    fuentesAutomaticas: [
      "UN Comtrade API",
      "World Bank Trade Data",
      "International Trade Centre (ITC)",
      "Registros de Cámaras de Comercio",
      "APIs de aduanas nacionales",
      "Bases de datos empresariales oficiales"
    ],
    
    criteriosSeleccion: [
      "Volumen de comercio > $10M anuales",
      "Empresa registrada oficialmente",
      "Actividad en últimos 2 años",
      "Datos de contacto verificables",
      "Códigos HS identificables"
    ]
  },

  // =============================================
  // SISTEMA DE AUTOMATIZACIÓN
  // =============================================
  
  sistemAutomatizacion: {
    herramientas: [
      "Web scraping de registros oficiales",
      "APIs RESTful de gobiernos",
      "Validación automática de datos",
      "Geo-codificación de direcciones",
      "Verificación de códigos HS",
      "Sistema de puntuación de calidad"
    ],
    
    validacion: [
      "Cross-reference con múltiples fuentes",
      "Verificación de registros legales",
      "Validación de coordenadas GPS",
      "Confirmación de actividad comercial",
      "Check de duplicados globales"
    ]
  }
};

// Función para ejecutar Fase 1
function ejecutarFase1() {
  console.log("🚀 INICIANDO FASE 1: MERCADOS EMERGENTES PRIORITARIOS");
  console.log(`📊 Objetivo: ${GLOBAL_EXPANSION_SYSTEM.fase1_MercadosEmergentes.paises.length} países`);
  console.log(`⏱️ Timeline: ${GLOBAL_EXPANSION_SYSTEM.fase1_MercadosEmergentes.timeline}`);
  
  return GLOBAL_EXPANSION_SYSTEM.fase1_MercadosEmergentes.paises.map(pais => ({
    ...pais,
    status: "pendiente",
    metodologia: ["directas", "indirectas", "pymes", "cooperativas", "estatales"],
    fechaInicio: new Date().toISOString()
  }));
}

// Función para generar plan de expansión completo
function generarPlanExpansion() {
  const totalPaises = GLOBAL_EXPANSION_SYSTEM.fase1_MercadosEmergentes.paises.length + 
                     GLOBAL_EXPANSION_SYSTEM.fase2_MercadosMedianos.paises.length + 
                     GLOBAL_EXPANSION_SYSTEM.fase3_PaisesPequenos.categorias.islasCaribe +
                     GLOBAL_EXPANSION_SYSTEM.fase3_PaisesPequenos.categorias.islasOceania +
                     GLOBAL_EXPANSION_SYSTEM.fase3_PaisesPequenos.categorias.africaSubsahariana +
                     GLOBAL_EXPANSION_SYSTEM.fase3_PaisesPequenos.categorias.europaPequena;
  
  return {
    paisesActuales: 63,
    paisesObjetivo: 195,
    paisesNuevos: totalPaises,
    porcentajeFinal: Math.round(((63 + totalPaises) / 195) * 100),
    estimadoEmpresas: totalPaises * 3.2, // Promedio 3.2 empresas por país
    timelineTotal: "6-8 meses para cobertura completa"
  };
}

module.exports = {
  GLOBAL_EXPANSION_SYSTEM,
  ejecutarFase1,
  generarPlanExpansion
};