// Base de datos de empresas demo para ComexIA
// Empresas importadoras y exportadoras por país y sector

export interface Company {
  id: string;
  name: string;
  legalName: string;
  country: string;
  type: 'importer' | 'exporter' | 'both';
  products: string[]; // Códigos HS que maneja
  businessType: string;
  establishedYear: number;
  employeeCount: number;
  verified: boolean;
  creditRating: string; // AAA, AA, A, BBB, BB, B
  riskScore: number; // 0-100 (menor es mejor)
  certifications: string[];
  contactPerson: string;
  contactEmail: string;
  phone: string;
  website: string;
  address: string;
}

export const COMPANIES_DATABASE: Company[] = [
  // ========== BRASIL - Exportadores ==========
  {
    id: 'BR001',
    name: 'JBS S.A.',
    legalName: 'JBS S.A.',
    country: 'BR',
    type: 'exporter',
    products: ['0201', '0202', '0203', '0207'], // Carnes
    businessType: 'Frigorífico y procesador de carnes',
    establishedYear: 1953,
    employeeCount: 245000,
    verified: true,
    creditRating: 'AA',
    riskScore: 15,
    certifications: ['ISO 9001', 'HACCP', 'Halal', 'Kosher'],
    contactPerson: 'Carlos Silva',
    contactEmail: 'export@jbs.com.br',
    phone: '+55 11 3144-4000',
    website: 'www.jbs.com.br',
    address: 'Av. Marginal Direita do Tietê, 500, São Paulo, SP'
  },
  {
    id: 'BR002',
    name: 'Amaggi',
    legalName: 'Amaggi Exportação e Importação Ltda',
    country: 'BR',
    type: 'exporter',
    products: ['1201', '1507', '1005'], // Soja, aceite, maíz
    businessType: 'Trading agrícola',
    establishedYear: 1977,
    employeeCount: 3500,
    verified: true,
    creditRating: 'AAA',
    riskScore: 10,
    certifications: ['ISO 14001', 'RTRS', 'ProTerra'],
    contactPerson: 'Maria Santos',
    contactEmail: 'comercial@amaggi.com.br',
    phone: '+55 65 3688-8000',
    website: 'www.amaggi.com.br',
    address: 'Cuiabá, Mato Grosso'
  },
  {
    id: 'BR003',
    name: 'Vale S.A.',
    legalName: 'Vale S.A.',
    country: 'BR',
    type: 'exporter',
    products: ['2601', '2603'], // Minerales de hierro y cobre
    businessType: 'Minería',
    establishedYear: 1942,
    employeeCount: 70000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'Roberto Oliveira',
    contactEmail: 'sales@vale.com',
    phone: '+55 21 3814-4477',
    website: 'www.vale.com',
    address: 'Rio de Janeiro, RJ'
  },
  {
    id: 'BR004',
    name: 'Embraer',
    legalName: 'Embraer S.A.',
    country: 'BR',
    type: 'exporter',
    products: ['8411'], // Turbinas y aeronaves
    businessType: 'Fabricante aeroespacial',
    establishedYear: 1969,
    employeeCount: 18000,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['AS9100', 'ISO 9001'],
    contactPerson: 'Ana Paula Costa',
    contactEmail: 'sales@embraer.com.br',
    phone: '+55 12 3927-4000',
    website: 'www.embraer.com',
    address: 'São José dos Campos, SP'
  },

  // ========== ARGENTINA - Exportadores ==========
  {
    id: 'AR001',
    name: 'Molinos Río de la Plata',
    legalName: 'Molinos Río de la Plata S.A.',
    country: 'AR',
    type: 'exporter',
    products: ['1001', '1507', '0401'], // Trigo, aceite, lácteos
    businessType: 'Agroindustria',
    establishedYear: 1902,
    employeeCount: 4500,
    verified: true,
    creditRating: 'A',
    riskScore: 20,
    certifications: ['ISO 9001', 'HACCP', 'BRC'],
    contactPerson: 'Juan Martínez',
    contactEmail: 'export@molinos.com.ar',
    phone: '+54 11 4317-8900',
    website: 'www.molinos.com.ar',
    address: 'Buenos Aires, Argentina'
  },
  {
    id: 'AR002',
    name: 'Aceitera General Deheza',
    legalName: 'Aceitera General Deheza S.A.',
    country: 'AR',
    type: 'exporter',
    products: ['1201', '1507', '1512'], // Soja y aceites
    businessType: 'Procesamiento de oleaginosas',
    establishedYear: 1948,
    employeeCount: 3200,
    verified: true,
    creditRating: 'AA',
    riskScore: 14,
    certifications: ['ISO 9001', 'ISO 14001', 'RTRS'],
    contactPerson: 'Diego Fernández',
    contactEmail: 'ventas@agd.com.ar',
    phone: '+54 358 446-8600',
    website: 'www.agd.com.ar',
    address: 'General Deheza, Córdoba'
  },
  {
    id: 'AR003',
    name: 'Techint',
    legalName: 'Techint Compañía Técnica Internacional',
    country: 'AR',
    type: 'both',
    products: ['7304', '7306', '7308'], // Tubos y estructuras de acero
    businessType: 'Ingeniería y construcción',
    establishedYear: 1945,
    employeeCount: 55000,
    verified: true,
    creditRating: 'AA',
    riskScore: 16,
    certifications: ['ISO 9001', 'API 5L', 'API 5CT'],
    contactPerson: 'Martín Rodríguez',
    contactEmail: 'comercial@techint.com',
    phone: '+54 11 4018-8900',
    website: 'www.techint.com',
    address: 'Buenos Aires, Argentina'
  },

  // ========== CHILE - Exportadores ==========
  {
    id: 'CL001',
    name: 'Codelco',
    legalName: 'Corporación Nacional del Cobre de Chile',
    country: 'CL',
    type: 'exporter',
    products: ['2603', '7403', '7407'], // Cobre
    businessType: 'Minería de cobre',
    establishedYear: 1976,
    employeeCount: 18000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 8,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
    contactPerson: 'Claudia Ramírez',
    contactEmail: 'sales@codelco.cl',
    phone: '+56 2 2690-3000',
    website: 'www.codelco.com',
    address: 'Santiago, Chile'
  },
  {
    id: 'CL002',
    name: 'Agrosuper',
    legalName: 'Empresas Agrosuper S.A.',
    country: 'CL',
    type: 'exporter',
    products: ['0201', '0203', '0207'], // Carnes
    businessType: 'Producción y procesamiento de alimentos',
    establishedYear: 1955,
    employeeCount: 22000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'HACCP', 'BRC', 'IFS'],
    contactPerson: 'Rodrigo González',
    contactEmail: 'export@agrosuper.cl',
    phone: '+56 2 2477-7000',
    website: 'www.agrosuper.com',
    address: 'Rancagua, Chile'
  },
  {
    id: 'CL003',
    name: 'Dole Chile',
    legalName: 'Dole Chile S.A.',
    country: 'CL',
    type: 'exporter',
    products: ['0806', '0808', '0810'], // Frutas
    businessType: 'Producción y exportación de frutas',
    establishedYear: 1990,
    employeeCount: 8500,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['GlobalGAP', 'HACCP', 'GRASP'],
    contactPerson: 'Patricia Muñoz',
    contactEmail: 'ventas@dole.cl',
    phone: '+56 2 2818-8000',
    website: 'www.dole.cl',
    address: 'Santiago, Chile'
  },

  // ========== COLOMBIA - Exportadores ==========
  {
    id: 'CO001',
    name: 'Federación Nacional de Cafeteros',
    legalName: 'Federación Nacional de Cafeteros de Colombia',
    country: 'CO',
    type: 'exporter',
    products: ['0901'], // Café
    businessType: 'Cooperativa cafetera',
    establishedYear: 1927,
    employeeCount: 500000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 5,
    certifications: ['Rainforest Alliance', 'UTZ', 'Fair Trade', '4C'],
    contactPerson: 'Carlos Andrés López',
    contactEmail: 'export@cafedecolombia.com',
    phone: '+57 1 313-6600',
    website: 'www.cafedecolombia.com',
    address: 'Bogotá, Colombia'
  },
  {
    id: 'CO002',
    name: 'Ecopetrol',
    legalName: 'Ecopetrol S.A.',
    country: 'CO',
    type: 'exporter',
    products: ['2709', '2710', '2711'], // Petróleo y derivados
    businessType: 'Petróleo y gas',
    establishedYear: 1951,
    employeeCount: 18000,
    verified: true,
    creditRating: 'AA',
    riskScore: 15,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'María Fernanda Suárez',
    contactEmail: 'comercial@ecopetrol.com.co',
    phone: '+57 1 234-4000',
    website: 'www.ecopetrol.com.co',
    address: 'Bogotá, Colombia'
  },

  // ========== ESTADOS UNIDOS - Importadores/Exportadores ==========
  {
    id: 'US001',
    name: 'Cargill',
    legalName: 'Cargill, Incorporated',
    country: 'US',
    type: 'both',
    products: ['1001', '1005', '1201', '1507'], // Granos y aceites
    businessType: 'Trading agrícola',
    establishedYear: 1865,
    employeeCount: 155000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 5,
    certifications: ['ISO 9001', 'FSSC 22000', 'RTRS'],
    contactPerson: 'John Smith',
    contactEmail: 'trading@cargill.com',
    phone: '+1 952-742-7575',
    website: 'www.cargill.com',
    address: 'Minneapolis, Minnesota'
  },
  {
    id: 'US002',
    name: 'Caterpillar',
    legalName: 'Caterpillar Inc.',
    country: 'US',
    type: 'exporter',
    products: ['8429', '8428', '8425'], // Maquinaria pesada
    businessType: 'Fabricante de maquinaria',
    establishedYear: 1925,
    employeeCount: 107700,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'ISO 14001'],
    contactPerson: 'Michael Johnson',
    contactEmail: 'sales@cat.com',
    phone: '+1 309-675-1000',
    website: 'www.caterpillar.com',
    address: 'Peoria, Illinois'
  },
  {
    id: 'US003',
    name: 'Apple Inc.',
    legalName: 'Apple Inc.',
    country: 'US',
    type: 'both',
    products: ['8471', '8517'], // Computadoras y smartphones
    businessType: 'Tecnología',
    establishedYear: 1976,
    employeeCount: 164000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 3,
    certifications: ['ISO 9001', 'ISO 14001'],
    contactPerson: 'Sarah Williams',
    contactEmail: 'b2b@apple.com',
    phone: '+1 408-996-1010',
    website: 'www.apple.com',
    address: 'Cupertino, California'
  },

  // ========== CHINA - Importadores/Exportadores ==========
  {
    id: 'CN001',
    name: 'COFCO',
    legalName: 'China National Cereals, Oils and Foodstuffs Corporation',
    country: 'CN',
    type: 'both',
    products: ['1201', '1001', '1005', '1006'], // Granos
    businessType: 'Trading agrícola',
    establishedYear: 1949,
    employeeCount: 120000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'HACCP'],
    contactPerson: 'Li Wei',
    contactEmail: 'trade@cofco.com',
    phone: '+86 10 5956-8888',
    website: 'www.cofco.com',
    address: 'Beijing, China'
  },
  {
    id: 'CN002',
    name: 'Huawei Technologies',
    legalName: 'Huawei Technologies Co., Ltd.',
    country: 'CN',
    type: 'exporter',
    products: ['8517', '8471', '8528'], // Telecomunicaciones
    businessType: 'Tecnología y telecomunicaciones',
    establishedYear: 1987,
    employeeCount: 197000,
    verified: true,
    creditRating: 'A',
    riskScore: 20,
    certifications: ['ISO 9001', 'ISO 14001', 'TL 9000'],
    contactPerson: 'Wang Chen',
    contactEmail: 'enterprise@huawei.com',
    phone: '+86 755-2878-0808',
    website: 'www.huawei.com',
    address: 'Shenzhen, Guangdong'
  },
  {
    id: 'CN003',
    name: 'Baosteel',
    legalName: 'China Baowu Steel Group',
    country: 'CN',
    type: 'exporter',
    products: ['7208', '7210', '7213'], // Acero
    businessType: 'Siderurgia',
    establishedYear: 1978,
    employeeCount: 230000,
    verified: true,
    creditRating: 'AA',
    riskScore: 14,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'Zhang Ming',
    contactEmail: 'export@baosteel.com',
    phone: '+86 21 2064-7777',
    website: 'www.baowugroup.com',
    address: 'Shanghai, China'
  },

  // ========== ALEMANIA - Exportadores ==========
  {
    id: 'DE001',
    name: 'Volkswagen',
    legalName: 'Volkswagen AG',
    country: 'DE',
    type: 'exporter',
    products: ['8703', '8704', '8708'], // Vehículos
    businessType: 'Fabricante automotriz',
    establishedYear: 1937,
    employeeCount: 675000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949'],
    contactPerson: 'Hans Mueller',
    contactEmail: 'export@volkswagen.de',
    phone: '+49 5361 9-0',
    website: 'www.volkswagen.de',
    address: 'Wolfsburg, Germany'
  },
  {
    id: 'DE002',
    name: 'Siemens',
    legalName: 'Siemens AG',
    country: 'DE',
    type: 'exporter',
    products: ['8501', '8504', '8537'], // Equipos eléctricos
    businessType: 'Ingeniería y tecnología',
    establishedYear: 1847,
    employeeCount: 293000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 8,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 50001'],
    contactPerson: 'Klaus Schmidt',
    contactEmail: 'sales@siemens.com',
    phone: '+49 89 636-00',
    website: 'www.siemens.com',
    address: 'Munich, Germany'
  },
  {
    id: 'DE003',
    name: 'BASF',
    legalName: 'BASF SE',
    country: 'DE',
    type: 'both',
    products: ['3901', '3902', '3004', '3102'], // Químicos
    businessType: 'Química',
    establishedYear: 1865,
    employeeCount: 111000,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'ISO 14001', 'RC 14001'],
    contactPerson: 'Friedrich Weber',
    contactEmail: 'chemicals@basf.com',
    phone: '+49 621 60-0',
    website: 'www.basf.com',
    address: 'Ludwigshafen, Germany'
  },

  // ========== JAPÓN - Exportadores ==========
  {
    id: 'JP001',
    name: 'Toyota',
    legalName: 'Toyota Motor Corporation',
    country: 'JP',
    type: 'exporter',
    products: ['8703', '8704', '8708'], // Vehículos
    businessType: 'Fabricante automotriz',
    establishedYear: 1937,
    employeeCount: 375000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 5,
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949'],
    contactPerson: 'Takeshi Yamamoto',
    contactEmail: 'export@toyota.co.jp',
    phone: '+81 3-3817-7111',
    website: 'www.toyota.co.jp',
    address: 'Toyota City, Aichi'
  },
  {
    id: 'JP002',
    name: 'Mitsubishi Corporation',
    legalName: 'Mitsubishi Corporation',
    country: 'JP',
    type: 'both',
    products: ['2601', '2709', '7208', '8429'], // Trading diversificado
    businessType: 'Trading y servicios',
    establishedYear: 1954,
    employeeCount: 86000,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'ISO 14001'],
    contactPerson: 'Kenji Tanaka',
    contactEmail: 'trade@mitsubishicorp.com',
    phone: '+81 3-3210-2121',
    website: 'www.mitsubishicorp.com',
    address: 'Tokyo, Japan'
  },

  // ========== COREA DEL SUR - Exportadores ==========
  {
    id: 'KR001',
    name: 'Samsung Electronics',
    legalName: 'Samsung Electronics Co., Ltd.',
    country: 'KR',
    type: 'exporter',
    products: ['8517', '8471', '8528'], // Electrónicos
    businessType: 'Electrónica',
    establishedYear: 1969,
    employeeCount: 267000,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
    contactPerson: 'Kim Min-jun',
    contactEmail: 'b2b@samsung.com',
    phone: '+82 2-2255-0114',
    website: 'www.samsung.com',
    address: 'Suwon, Gyeonggi'
  },
  {
    id: 'KR002',
    name: 'Hyundai Motor',
    legalName: 'Hyundai Motor Company',
    country: 'KR',
    type: 'exporter',
    products: ['8703', '8704', '8708'], // Vehículos
    businessType: 'Fabricante automotriz',
    establishedYear: 1967,
    employeeCount: 120000,
    verified: true,
    creditRating: 'A',
    riskScore: 15,
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949'],
    contactPerson: 'Park Ji-hoon',
    contactEmail: 'export@hyundai.com',
    phone: '+82 2-3464-1114',
    website: 'www.hyundai.com',
    address: 'Seoul, South Korea'
  },
  {
    id: 'KR003',
    name: 'POSCO',
    legalName: 'POSCO',
    country: 'KR',
    type: 'exporter',
    products: ['7208', '7210', '7213'], // Acero
    businessType: 'Siderurgia',
    establishedYear: 1968,
    employeeCount: 36000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'Lee Sung-min',
    contactEmail: 'sales@posco.com',
    phone: '+82 2-3457-0114',
    website: 'www.posco.com',
    address: 'Pohang, Gyeongsangbuk'
  },

  // ========== INDIA - Importadores/Exportadores ==========
  {
    id: 'IN001',
    name: 'Tata Steel',
    legalName: 'Tata Steel Limited',
    country: 'IN',
    type: 'both',
    products: ['7208', '7210', '7213', '7214'], // Acero
    businessType: 'Siderurgia',
    establishedYear: 1907,
    employeeCount: 80000,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'Rajesh Kumar',
    contactEmail: 'export@tatasteel.com',
    phone: '+91 22 6665-8282',
    website: 'www.tatasteel.com',
    address: 'Mumbai, Maharashtra'
  },
  {
    id: 'IN002',
    name: 'Reliance Industries',
    legalName: 'Reliance Industries Limited',
    country: 'IN',
    type: 'both',
    products: ['2709', '2710', '3901', '3902'], // Petróleo y petroquímicos
    businessType: 'Petróleo, gas y petroquímicos',
    establishedYear: 1966,
    employeeCount: 347000,
    verified: true,
    creditRating: 'AA',
    riskScore: 14,
    certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
    contactPerson: 'Amit Patel',
    contactEmail: 'trade@ril.com',
    phone: '+91 22 3555-5000',
    website: 'www.ril.com',
    address: 'Mumbai, Maharashtra'
  },

  // ========== MÉXICO - Importadores/Exportadores ==========
  {
    id: 'MX001',
    name: 'Grupo Bimbo',
    legalName: 'Grupo Bimbo S.A.B. de C.V.',
    country: 'MX',
    type: 'exporter',
    products: ['1001', '1701'], // Trigo, azúcar (productos de panadería)
    businessType: 'Alimentos',
    establishedYear: 1945,
    employeeCount: 138000,
    verified: true,
    creditRating: 'A',
    riskScore: 16,
    certifications: ['ISO 9001', 'HACCP', 'BRC', 'IFS'],
    contactPerson: 'José García',
    contactEmail: 'export@grupobimbo.com',
    phone: '+52 55 5268-6600',
    website: 'www.grupobimbo.com',
    address: 'Ciudad de México, México'
  },
  {
    id: 'MX002',
    name: 'Cemex',
    legalName: 'Cemex S.A.B. de C.V.',
    country: 'MX',
    type: 'exporter',
    products: ['7308'], // Construcción
    businessType: 'Materiales de construcción',
    establishedYear: 1906,
    employeeCount: 40000,
    verified: true,
    creditRating: 'BBB',
    riskScore: 22,
    certifications: ['ISO 9001', 'ISO 14001'],
    contactPerson: 'María Hernández',
    contactEmail: 'sales@cemex.com',
    phone: '+52 81 8888-8888',
    website: 'www.cemex.com',
    address: 'San Pedro Garza García, Nuevo León'
  },

  // ========== PERÚ - Exportadores ==========
  {
    id: 'PE001',
    name: 'Southern Copper',
    legalName: 'Southern Peru Copper Corporation',
    country: 'PE',
    type: 'exporter',
    products: ['2603', '7403'], // Cobre
    businessType: 'Minería de cobre',
    establishedYear: 1952,
    employeeCount: 12000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
    contactPerson: 'Carlos Mendoza',
    contactEmail: 'ventas@southernperu.com',
    phone: '+51 1 512-5000',
    website: 'www.southernperu.com',
    address: 'Lima, Perú'
  },
  {
    id: 'PE002',
    name: 'Camposol',
    legalName: 'Camposol S.A.',
    country: 'PE',
    type: 'exporter',
    products: ['0804', '0810'], // Frutas (aguacate, arándanos)
    businessType: 'Agroindustria',
    establishedYear: 1997,
    employeeCount: 15000,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['GlobalGAP', 'HACCP', 'GRASP', 'SMETA'],
    contactPerson: 'Ana Flores',
    contactEmail: 'export@camposol.com.pe',
    phone: '+51 1 215-8300',
    website: 'www.camposol.com.pe',
    address: 'La Libertad, Perú'
  },

  // ========== ECUADOR - Exportadores ==========
  {
    id: 'EC001',
    name: 'Reybanpac',
    legalName: 'Reybanpac S.A.',
    country: 'EC',
    type: 'exporter',
    products: ['0803'], // Banano
    businessType: 'Producción y exportación de banano',
    establishedYear: 1979,
    employeeCount: 8000,
    verified: true,
    creditRating: 'A',
    riskScore: 16,
    certifications: ['GlobalGAP', 'Rainforest Alliance', 'Fair Trade'],
    contactPerson: 'Luis Álvarez',
    contactEmail: 'export@reybanpac.com',
    phone: '+593 4 371-5400',
    website: 'www.reybanpac.com',
    address: 'Guayaquil, Ecuador'
  },
  {
    id: 'EC002',
    name: 'Omarsa',
    legalName: 'Omarsa S.A.',
    country: 'EC',
    type: 'exporter',
    products: ['0306'], // Camarón
    businessType: 'Acuicultura',
    establishedYear: 1980,
    employeeCount: 5000,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['BAP', 'ASC', 'HACCP'],
    contactPerson: 'Roberto Morales',
    contactEmail: 'sales@omarsa.com',
    phone: '+593 4 601-0100',
    website: 'www.omarsa.com',
    address: 'Guayaquil, Ecuador'
  },

  // ========== URUGUAY - Exportadores ==========
  {
    id: 'UY001',
    name: 'Conaprole',
    legalName: 'Cooperativa Nacional de Productores de Leche',
    country: 'UY',
    type: 'exporter',
    products: ['0401', '0402', '0406'], // Lácteos
    businessType: 'Cooperativa láctea',
    establishedYear: 1936,
    employeeCount: 2500,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'HACCP', 'BRC', 'IFS'],
    contactPerson: 'Gustavo Pérez',
    contactEmail: 'export@conaprole.com.uy',
    phone: '+598 2 924-0101',
    website: 'www.conaprole.com.uy',
    address: 'Montevideo, Uruguay'
  },

  // ========== AUSTRALIA - Exportadores ==========
  {
    id: 'AU001',
    name: 'BHP',
    legalName: 'BHP Group Limited',
    country: 'AU',
    type: 'exporter',
    products: ['2601', '2603', '2701'], // Minerales
    businessType: 'Minería',
    establishedYear: 1885,
    employeeCount: 80000,
    verified: true,
    creditRating: 'AAA',
    riskScore: 6,
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
    contactPerson: 'Andrew Wilson',
    contactEmail: 'sales@bhp.com',
    phone: '+61 3 9609-3333',
    website: 'www.bhp.com',
    address: 'Melbourne, Victoria'
  },
  {
    id: 'AU002',
    name: 'Meat & Livestock Australia',
    legalName: 'Meat & Livestock Australia Limited',
    country: 'AU',
    type: 'exporter',
    products: ['0201', '0202'], // Carne bovina
    businessType: 'Producción y exportación de carne',
    establishedYear: 1998,
    employeeCount: 450,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['HACCP', 'MSA', 'EU Approved'],
    contactPerson: 'David Thompson',
    contactEmail: 'export@mla.com.au',
    phone: '+61 2 9463-9333',
    website: 'www.mla.com.au',
    address: 'Sydney, New South Wales'
  },

  // ========== NUEVA ZELANDA - Exportadores ==========
  {
    id: 'NZ001',
    name: 'Fonterra',
    legalName: 'Fonterra Co-operative Group Limited',
    country: 'NZ',
    type: 'exporter',
    products: ['0401', '0402', '0406'], // Lácteos
    businessType: 'Cooperativa láctea',
    establishedYear: 2001,
    employeeCount: 22000,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'HACCP', 'FSSC 22000'],
    contactPerson: 'James Anderson',
    contactEmail: 'export@fonterra.com',
    phone: '+64 9 374-9000',
    website: 'www.fonterra.com',
    address: 'Auckland, New Zealand'
  },

  // ========== TAILANDIA - Exportadores ==========
  {
    id: 'TH001',
    name: 'Thai Union Group',
    legalName: 'Thai Union Group Public Company Limited',
    country: 'TH',
    type: 'exporter',
    products: ['0302', '0303'], // Pescado
    businessType: 'Productos del mar',
    establishedYear: 1977,
    employeeCount: 47000,
    verified: true,
    creditRating: 'A',
    riskScore: 16,
    certifications: ['MSC', 'BAP', 'HACCP', 'BRC'],
    contactPerson: 'Somchai Pattana',
    contactEmail: 'export@thaiunion.com',
    phone: '+66 2 298-0024',
    website: 'www.thaiunion.com',
    address: 'Bangkok, Thailand'
  },

  // ========== VIETNAM - Exportadores ==========
  {
    id: 'VN001',
    name: 'Vingroup',
    legalName: 'Vingroup Joint Stock Company',
    country: 'VN',
    type: 'both',
    products: ['0901', '0306', '1006'], // Café, camarón, arroz
    businessType: 'Conglomerado',
    establishedYear: 1993,
    employeeCount: 60000,
    verified: true,
    creditRating: 'BBB',
    riskScore: 20,
    certifications: ['ISO 9001', 'HACCP'],
    contactPerson: 'Nguyen Van An',
    contactEmail: 'trade@vingroup.net',
    phone: '+84 24 3974-9999',
    website: 'www.vingroup.net',
    address: 'Hanoi, Vietnam'
  },

  // ========== INDONESIA - Exportadores ==========
  {
    id: 'ID001',
    name: 'Wilmar International',
    legalName: 'Wilmar International Limited',
    country: 'ID',
    type: 'exporter',
    products: ['1511'], // Aceite de palma
    businessType: 'Agroindustria',
    establishedYear: 1991,
    employeeCount: 90000,
    verified: true,
    creditRating: 'A',
    riskScore: 18,
    certifications: ['RSPO', 'ISO 9001', 'HACCP'],
    contactPerson: 'Budi Santoso',
    contactEmail: 'sales@wilmar.com.sg',
    phone: '+65 6216-0244',
    website: 'www.wilmar-international.com',
    address: 'Jakarta, Indonesia'
  },

  // ========== ESPAÑA - Importadores/Exportadores ==========
  {
    id: 'ES001',
    name: 'Inditex',
    legalName: 'Industria de Diseño Textil S.A.',
    country: 'ES',
    type: 'both',
    products: ['0805', '0709'], // Frutas y hortalizas (también textiles pero no en HS aquí)
    businessType: 'Retail y textiles',
    establishedYear: 1985,
    employeeCount: 174000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['ISO 9001', 'ISO 14001'],
    contactPerson: 'Pablo Martínez',
    contactEmail: 'comercial@inditex.com',
    phone: '+34 981 18-5400',
    website: 'www.inditex.com',
    address: 'A Coruña, España'
  },

  // ========== FRANCIA - Importadores/Exportadores ==========
  {
    id: 'FR001',
    name: 'Airbus',
    legalName: 'Airbus SE',
    country: 'FR',
    type: 'exporter',
    products: ['8411'], // Turbinas y aeronaves
    businessType: 'Aeroespacial',
    establishedYear: 1970,
    employeeCount: 134000,
    verified: true,
    creditRating: 'AA',
    riskScore: 12,
    certifications: ['AS9100', 'ISO 9001', 'ISO 14001'],
    contactPerson: 'Pierre Dubois',
    contactEmail: 'commercial@airbus.com',
    phone: '+33 5 61 93-33-33',
    website: 'www.airbus.com',
    address: 'Toulouse, France'
  },

  // ========== ITALIA - Exportadores ==========
  {
    id: 'IT001',
    name: 'Ferrero',
    legalName: 'Ferrero S.p.A.',
    country: 'IT',
    type: 'both',
    products: ['1701', '0801'], // Azúcar, nueces (para Nutella)
    businessType: 'Alimentos',
    establishedYear: 1946,
    employeeCount: 38000,
    verified: true,
    creditRating: 'AA',
    riskScore: 10,
    certifications: ['ISO 9001', 'HACCP', 'BRC', 'IFS'],
    contactPerson: 'Marco Rossi',
    contactEmail: 'export@ferrero.com',
    phone: '+39 0173 313-1',
    website: 'www.ferrero.com',
    address: 'Alba, Piedmont'
  }
];

// Funciones de búsqueda y filtrado
export function searchCompanies(params: {
  country?: string;
  type?: 'importer' | 'exporter' | 'both';
  hsCode?: string;
  search?: string;
}): Company[] {
  let results = [...COMPANIES_DATABASE];

  if (params.country) {
    results = results.filter(c => c.country === params.country);
  }

  if (params.type) {
    results = results.filter(c => c.type === params.type || c.type === 'both');
  }

  if (params.hsCode) {
    results = results.filter(c => c.products.includes(params.hsCode));
  }

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    results = results.filter(c => 
      c.name.toLowerCase().includes(searchTerm) ||
      c.businessType.toLowerCase().includes(searchTerm) ||
      c.products.some(p => p.includes(searchTerm))
    );
  }

  return results;
}

export function getCompanyById(id: string): Company | undefined {
  return COMPANIES_DATABASE.find(c => c.id === id);
}

export function getCompaniesByCountry(country: string): Company[] {
  return COMPANIES_DATABASE.filter(c => c.country === country);
}

export function getCompaniesByProduct(hsCode: string): Company[] {
  return COMPANIES_DATABASE.filter(c => c.products.includes(hsCode));
}
