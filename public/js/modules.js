// Modules.js - Módulos adicionales y utilidades
class ModuleManager {
    constructor() {
        this.modules = {
            importaciones: new ImportacionesModule(),
            exportaciones: new ExportacionesModule(),
            documentos: new DocumentosModule(),
            reportes: new ReportesModule()
        };
        this.init();
    }

    init() {
        this.setupModuleEvents();
    }

    setupModuleEvents() {
        // Eventos globales para todos los módulos
        document.addEventListener('moduleLoad', (e) => {
            this.loadModule(e.detail.moduleName);
        });
    }

    loadModule(moduleName) {
        const module = this.modules[moduleName];
        if (module) {
            module.load();
        }
    }
}

// Módulo de Importaciones
class ImportacionesModule {
    constructor() {
        this.data = [];
    }

    load() {
        console.log('Cargando módulo de Importaciones');
        this.loadImportaciones();
    }

    loadImportaciones() {
        // Simular carga de datos de importaciones
        this.data = [
            {
                id: 'IMP-001',
                producto: 'Productos electrónicos',
                origen: 'China',
                valor: 50000,
                estado: 'En tránsito'
            },
            {
                id: 'IMP-002',
                producto: 'Maquinaria industrial',
                origen: 'Alemania',
                valor: 120000,
                estado: 'Pendiente documentación'
            }
        ];
    }

    getImportaciones() {
        return this.data;
    }
}

// Módulo de Exportaciones
class ExportacionesModule {
    constructor() {
        this.data = [];
    }

    load() {
        console.log('Cargando módulo de Exportaciones');
        this.loadExportaciones();
    }

    loadExportaciones() {
        this.data = [
            {
                id: 'EXP-001',
                producto: 'Productos agrícolas',
                destino: 'Europa',
                valor: 75000,
                estado: 'Completado'
            },
            {
                id: 'EXP-002',
                producto: 'Textiles',
                destino: 'Estados Unidos',
                valor: 45000,
                estado: 'En proceso'
            }
        ];
    }

    getExportaciones() {
        return this.data;
    }
}

// Módulo de Documentos
class DocumentosModule {
    constructor() {
        this.documentos = [];
    }

    load() {
        console.log('Cargando módulo de Documentos');
        this.loadDocumentos();
    }

    loadDocumentos() {
        this.documentos = [
            {
                id: 'DOC-001',
                tipo: 'Factura comercial',
                operacion: 'IMP-001',
                estado: 'Válido',
                vencimiento: '2024-12-31'
            },
            {
                id: 'DOC-002',
                tipo: 'Certificado sanitario',
                operacion: 'EXP-001',
                estado: 'Vencido',
                vencimiento: '2024-01-15'
            }
        ];
    }

    getDocumentos() {
        return this.documentos;
    }
}

// Módulo de Reportes
class ReportesModule {
    constructor() {
        this.reportes = [];
    }

    load() {
        console.log('Cargando módulo de Reportes');
        this.generateReportes();
    }

    generateReportes() {
        this.reportes = [
            {
                id: 'REP-001',
                nombre: 'Reporte mensual de importaciones',
                periodo: 'Enero 2024',
                estado: 'Generado'
            },
            {
                id: 'REP-002',
                nombre: 'Análisis de exportaciones',
                periodo: 'Q1 2024',
                estado: 'En proceso'
            }
        ];
    }

    getReportes() {
        return this.reportes;
    }
}

// Utilidades globales
class Utils {
    static formatDate(date) {
        return new Intl.DateTimeFormat('es-ES').format(new Date(date));
    }

    static formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    static showLoading(element) {
        element.innerHTML = '<div class="loading"></div>';
    }

    static hideLoading(element, content) {
        element.innerHTML = content;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Inicializar módulos
document.addEventListener('DOMContentLoaded', () => {
    window.moduleManager = new ModuleManager();
    window.utils = Utils;
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModuleManager, Utils };
}