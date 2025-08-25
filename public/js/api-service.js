class APIService {
    constructor() {
        this.offlineMode = true; 
        this.baseURLs = {
            // APIs de comercio internacional
            comtrade: 'https://comtradeapi.un.org/data/v1/get',
            worldbank: 'https://api.worldbank.org/v2',
            wto: 'https://api.wto.org/timeseries/v1',
            
            // APIs de aranceles y aduanas
            tariffs: 'https://api.tariffdata.wto.org/v1',
            customs: 'https://api.wcoomd.org/v1',
            
            // APIs de países y monedas
            countries: 'https://restcountries.com/v3.1',
            exchange: 'https://api.exchangerate-api.com/v4/latest',
            
            // APIs de productos y clasificación
            hs_codes: 'https://api.hscode.com/v1',
            products: 'https://api.productontology.org/v1'
        };
        
        this.cache = new Map();
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutos
        this.retryAttempts = 3;
        this.retryDelay = 1000;
        
        this.init();
    }

    init() {
        console.log('[API] Initializing API Service in offline mode...');
        this.setupInterceptors();
        this.loadMockData(); 
    }

    setupInterceptors() {
        // Interceptor para agregar headers comunes
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'KoraApp/1.0.0'
        };
    }

    loadMockData() {
        // Datos mock para funcionar sin APIs externas
        this.cache.set('dashboard_data', {
            data: {
                globalTrade: { 
                    value: '$2.1T', 
                    change: '+5.2%',
                    trend: 'up'
                },
                exchangeRates: { 
                    USD: 1, 
                    EUR: 0.85, 
                    GBP: 0.73,
                    JPY: 110.25,
                    CNY: 6.45
                },
                topCountries: [
                    { name: 'Estados Unidos', value: '$1.2T', flag: '🇺🇸' },
                    { name: 'China', value: '$980B', flag: '🇨🇳' },
                    { name: 'Alemania', value: '$750B', flag: '🇩🇪' },
                    { name: 'Japón', value: '$650B', flag: '🇯🇵' }
                ],
                trendingProducts: [
                    { name: 'Electrónicos', growth: '+12%', category: 'tech' },
                    { name: 'Textiles', growth: '+8%', category: 'fashion' },
                    { name: 'Maquinaria', growth: '+15%', category: 'industrial' },
                    { name: 'Químicos', growth: '+6%', category: 'chemical' }
                ],
                tariffData: {
                    average: '8.5%',
                    range: '0-25%',
                    mostProtected: 'Agricultura',
                    leastProtected: 'Materias Primas'
                }
            },
            timestamp: Date.now()
        });
        
        console.log('[API] Mock data loaded successfully');
    }

    // Método principal para hacer peticiones
    async request(url, options = {}) {
        if (this.offlineMode) {
            console.log('[API] Offline mode - returning mock data');
            return this.cache.get('dashboard_data')?.data || {};
        }
        
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        
        // Verificar cache
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('[API] Serving from cache:', url);
                return cached.data;
            }
        }

        // Configurar opciones por defecto
        const config = {
            method: 'GET',
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        let lastError;
        
        // Reintentos automáticos
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`[API] Request attempt ${attempt}:`, url);
                
                const response = await fetch(url, config);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Guardar en cache
                this.cache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                console.log('[API] Request successful:', url);
                return data;
                
            } catch (error) {
                lastError = error;
                console.warn(`[API] Attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }
        
        // Si todos los intentos fallan, devolver datos mock
        console.error('[API] All attempts failed, using fallback data:', lastError);
        return this.getFallbackData(url);
    }

    // === MÉTODOS ESPECÍFICOS DE COMERCIO EXTERIOR ===

    // Obtener datos de comercio por país
    async getTradeData(countryCode, year = new Date().getFullYear()) {
        try {
            const url = `${this.baseURLs.comtrade}/C/${countryCode}/A/${year}/HS`;
            return await this.request(url);
        } catch (error) {
            return this.getMockTradeData(countryCode, year);
        }
    }

    // Obtener aranceles por producto y país
    async getTariffData(hsCode, importerCode, exporterCode) {
        try {
            const url = `${this.baseURLs.tariffs}/tariff/${importerCode}/${exporterCode}/${hsCode}`;
            return await this.request(url);
        } catch (error) {
            return this.getMockTariffData(hsCode, importerCode, exporterCode);
        }
    }

    // Obtener información de países
    async getCountryInfo(countryCode) {
        try {
            const url = `${this.baseURLs.countries}/alpha/${countryCode}`;
            return await this.request(url);
        } catch (error) {
            return this.getMockCountryData(countryCode);
        }
    }

    // Obtener tipos de cambio
    async getExchangeRates(baseCurrency = 'USD') {
        try {
            const url = `${this.baseURLs.exchange}/${baseCurrency}`;
            return await this.request(url);
        } catch (error) {
            return this.getMockExchangeRates(baseCurrency);
        }
    }

    // Buscar productos por código HS
    async searchHSCodes(query, limit = 20) {
        try {
            const url = `${this.baseURLs.hs_codes}/search?q=${encodeURIComponent(query)}&limit=${limit}`;
            return await this.request(url);
        } catch (error) {
            return this.getMockHSCodes(query, limit);
        }
    }

    // Obtener estadísticas de comercio mundial
    async getGlobalTradeStats() {
        try {
            const url = `${this.baseURLs.worldbank}/indicator/TG.VAL.TOTL.GD.ZS?format=json&date=2020:2023`;
            return await this.request(url);
        } catch (error) {
            return this.getMockGlobalStats();
        }
    }

    // === DATOS MOCK PARA FALLBACK ===

    getMockTradeData(countryCode, year) {
        return {
            country: countryCode,
            year: year,
            totalExports: Math.random() * 1000000000,
            totalImports: Math.random() * 1000000000,
            tradeBalance: Math.random() * 500000000 - 250000000,
            topProducts: [
                { hsCode: '8703', description: 'Automóviles', value: Math.random() * 100000000 },
                { hsCode: '2709', description: 'Petróleo crudo', value: Math.random() * 100000000 },
                { hsCode: '8517', description: 'Teléfonos', value: Math.random() * 100000000 }
            ],
            topPartners: [
                { country: 'USA', value: Math.random() * 200000000 },
                { country: 'CHN', value: Math.random() * 200000000 },
                { country: 'DEU', value: Math.random() * 200000000 }
            ]
        };
    }

    getMockTariffData(hsCode, importerCode, exporterCode) {
        return {
            hsCode: hsCode,
            importer: importerCode,
            exporter: exporterCode,
            mfnRate: Math.random() * 25,
            preferentialRate: Math.random() * 15,
            currency: 'USD',
            unit: 'ad valorem',
            effectiveDate: new Date().toISOString().split('T')[0]
        };
    }

    getMockCountryData(countryCode) {
        const countries = {
            'US': { name: 'Estados Unidos', currency: 'USD', region: 'América del Norte' },
            'CN': { name: 'China', currency: 'CNY', region: 'Asia' },
            'DE': { name: 'Alemania', currency: 'EUR', region: 'Europa' },
            'JP': { name: 'Japón', currency: 'JPY', region: 'Asia' },
            'MX': { name: 'México', currency: 'MXN', region: 'América del Norte' }
        };
        
        return countries[countryCode] || {
            name: 'País Desconocido',
            currency: 'USD',
            region: 'Desconocido'
        };
    }

    getMockExchangeRates(baseCurrency) {
        return {
            base: baseCurrency,
            date: new Date().toISOString().split('T')[0],
            rates: {
                USD: 1.0,
                EUR: 0.85 + Math.random() * 0.1,
                GBP: 0.75 + Math.random() * 0.1,
                JPY: 110 + Math.random() * 20,
                CNY: 6.5 + Math.random() * 1,
                MXN: 18 + Math.random() * 2
            }
        };
    }

    getMockHSCodes(query, limit) {
        const mockCodes = [
            { code: '8703', description: 'Automóviles de turismo y demás vehículos' },
            { code: '2709', description: 'Aceites crudos de petróleo o de mineral bituminoso' },
            { code: '8517', description: 'Teléfonos, incluidos los teléfonos móviles' },
            { code: '8471', description: 'Máquinas automáticas para tratamiento de datos' },
            { code: '2710', description: 'Aceites de petróleo o de mineral bituminoso' },
            { code: '8708', description: 'Partes y accesorios de vehículos automóviles' },
            { code: '8542', description: 'Circuitos integrados electrónicos' },
            { code: '9013', description: 'Dispositivos de cristal líquido' },
            { code: '6203', description: 'Trajes, conjuntos, chaquetas para hombres' },
            { code: '6204', description: 'Trajes, conjuntos, chaquetas para mujeres' }
        ];
        
        return mockCodes
            .filter(item => 
                item.description.toLowerCase().includes(query.toLowerCase()) ||
                item.code.includes(query)
            )
            .slice(0, limit);
    }

    getMockGlobalStats() {
        return {
            globalTradeVolume: 28500000000000, // 28.5 trillones USD
            topExporters: [
                { country: 'China', value: 3363000000000 },
                { country: 'Estados Unidos', value: 1754000000000 },
                { country: 'Alemania', value: 1748000000000 },
                { country: 'Países Bajos', value: 836000000000 },
                { country: 'Japón', value: 705000000000 }
            ],
            topImporters: [
                { country: 'Estados Unidos', value: 2407000000000 },
                { country: 'China', value: 2061000000000 },
                { country: 'Alemania', value: 1448000000000 },
                { country: 'Reino Unido', value: 691000000000 },
                { country: 'Francia', value: 625000000000 }
            ]
        };
    }

    getFallbackData(url) {
        console.log('[API] Providing fallback data for:', url);
        
        if (url.includes('comtrade')) {
            return this.getMockTradeData('US', 2023);
        } else if (url.includes('tariff')) {
            return this.getMockTariffData('8703', 'US', 'MX');
        } else if (url.includes('countries')) {
            return this.getMockCountryData('US');
        } else if (url.includes('exchange')) {
            return this.getMockExchangeRates('USD');
        } else if (url.includes('hscode')) {
            return this.getMockHSCodes('auto', 10);
        } else {
            return this.getMockGlobalStats();
        }
    }

    // Utilidades
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearCache() {
        this.cache.clear();
        console.log('[API] Cache cleared');
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Inicializar servicio API
const apiService = new APIService();

// Exportar para uso global
window.apiService = apiService;