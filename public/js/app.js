// ComexIA - Aplicación SPA Principal
class ComexIA {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'overview';
        this.isInitialized = false;
        this.autoLoginEnabled = true;
        this.init();
    }

    init() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        console.log('🚀 Inicializando ComexIA...');
        
        // FORZAR LOGIN AUTOMÁTICO DEMO INMEDIATAMENTE
        this.autoDemoLogin();
        
        // Luego vincular eventos
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('✅ ComexIA inicializada correctamente');
    }

    autoDemoLogin() {
        console.log('🎯 Iniciando login automático demo...');
        
        // Simular login automático con usuario demo
        this.currentUser = {
            email: 'demo@comexia.com',
            name: 'Usuario Demo ComexIA',
            role: 'demo',
            permissions: this.getRolePermissions('demo'),
            loginTime: new Date().toISOString(),
            isAutoLogin: true
        };
        
        // Guardar en localStorage
        try {
            localStorage.setItem('comexia_user', JSON.stringify(this.currentUser));
            localStorage.setItem('comexia_session', Date.now().toString());
        } catch (error) {
            console.error('Error guardando sesión:', error);
        }
        
        // Mostrar dashboard directamente
        this.showDashboard();
        
        // Notificación de bienvenida
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification('¡Bienvenido a ComexIA! Modo Demo Automático Activado 🎯', 'success');
        }
        
        return true;
    }

    bindEvents() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            console.log('📝 Formulario de login vinculado');
        }

        // Logout button - buscar múltiples selectores
        const logoutSelectors = ['.btn-logout', '#logout-btn', '[onclick="logout()"]'];
        logoutSelectors.forEach(selector => {
            const logoutBtn = document.querySelector(selector);
            if (logoutBtn) {
                // Remover onclick anterior si existe
                logoutBtn.removeAttribute('onclick');
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
                console.log('🚪 Botón de logout vinculado');
            }
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        console.log(`🧭 ${navLinks.length} enlaces de navegación vinculados`);
    }

    handleLogin(e) {
        e.preventDefault();
        console.log('🔐 Procesando login...');
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validación básica
        if (!email || !password) {
            this.showError('Por favor, completa todos los campos');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Por favor, ingresa un email válido');
            return;
        }

        // ✅ MODO DEMO SEGURO - Cualquier email y contraseña funcionan
        console.log('✅ Modo Demo Seguro: Autenticación exitosa');
        
        const userRole = this.determineUserRole(email);
        const permissions = this.getRolePermissions(userRole);

        this.currentUser = {
            email: email,
            name: this.getUserDisplayName(userRole),
            role: userRole,
            permissions: permissions,
            loginTime: new Date().toISOString()
        };

        // Guardar estado en localStorage con manejo de errores
        try {
            localStorage.setItem('comexia_user', JSON.stringify(this.currentUser));
            localStorage.setItem('comexia_session', Date.now().toString());
            console.log('💾 Sesión guardada en localStorage');
        } catch (error) {
            console.error('Error guardando sesión:', error);
            // Continuar sin localStorage si hay problemas
        }
        
        // Mostrar dashboard
        this.showDashboard();
        
        // Mostrar notificación de bienvenida
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification(`¡Bienvenido ${this.currentUser.name}! Modo Demo Activo`, 'success');
        } else {
            console.log(`¡Bienvenido ${this.currentUser.name}! Modo Demo Activo`);
        }

        // Limpiar formulario
        document.getElementById('login-form').reset();
    }

    // ✅ Determinar rol basado en email
    determineUserRole(email) {
        const emailLower = email.toLowerCase();
        if (emailLower.includes('admin') || emailLower.includes('administrador')) {
            return 'administrator';
        } else if (emailLower.includes('demo') || emailLower.includes('test')) {
            return 'demo';
        } else {
            return 'user';
        }
    }

    // ✅ Obtener permisos por rol
    getRolePermissions(role) {
        const permissions = {
            administrator: {
                logistics: { read: true, write: true, delete: true },
                financial: { read: true, write: true, delete: true },
                marketing: { read: true, write: true, delete: true },
                legal: { read: true, write: true, delete: true },
                users: { read: true, write: true, delete: true },
                settings: { read: true, write: true, delete: true },
                reports: { read: true, write: true, delete: true }
            },
            user: {
                logistics: { read: true, write: true, delete: false },
                financial: { read: true, write: true, delete: false },
                marketing: { read: true, write: false, delete: false },
                legal: { read: true, write: false, delete: false },
                users: { read: false, write: false, delete: false },
                settings: { read: true, write: false, delete: false },
                reports: { read: true, write: false, delete: false }
            },
            demo: {
                logistics: { read: true, write: false, delete: false },
                financial: { read: true, write: false, delete: false },
                marketing: { read: true, write: false, delete: false },
                legal: { read: true, write: false, delete: false },
                users: { read: false, write: false, delete: false },
                settings: { read: false, write: false, delete: false },
                reports: { read: true, write: false, delete: false }
            }
        };
        return permissions[role] || permissions.demo;
    }

    // ✅ Obtener nombre de usuario
    getUserDisplayName(role) {
        const names = {
            administrator: 'Administrador',
            user: 'Usuario',
            demo: 'Usuario Demo'
        };
        return names[role] || 'Usuario';
    }

    // ✅ Verificar permisos
    hasPermission(module, action) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        const modulePermissions = this.currentUser.permissions[module];
        return modulePermissions && modulePermissions[action];
    }

    handleLogout() {
        console.log('🚪 Cerrando sesión...');
        
        this.currentUser = null;
        
        // Limpiar localStorage
        try {
            localStorage.removeItem('comexia_user');
            localStorage.removeItem('comexia_session');
            console.log('🗑️ Datos de sesión eliminados');
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
        
        // EN LUGAR DE MOSTRAR LOGIN, REINICIAR DEMO AUTOMÁTICAMENTE
        this.autoDemoLogin();
        
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification('Sesión reiniciada en modo demo', 'info');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        
        const section = e.target.getAttribute('data-section');
        if (section) {
            console.log(`🧭 Navegando a: ${section}`);
            this.showSection(section);
        }
    }
        
    showLogin() {
        // ✅ COMPLETAMENTE DESHABILITADO - Siempre redirigir al demo
        console.log('🔐 Login deshabilitado - Redirigiendo a demo automático...');
        this.autoDemoLogin();
        return;
    }

    showDashboard() {
        console.log('📊 Mostrando dashboard');
        
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        if (dashboardScreen) {
            dashboardScreen.style.display = 'flex';
            
            // Mostrar sección por defecto
            this.showSection('overview');
            
            // Actualizar UI según permisos
            this.updateUIBasedOnPermissions();
            
            // Actualizar información del usuario
            this.updateUserInfo();
        } else {
            console.error('❌ No se encontró la pantalla de dashboard');
        }
    }

    // ✅ Actualizar información del usuario en la UI
    updateUserInfo() {
        if (!this.currentUser) return;

        const userNameEl = document.getElementById('user-name');
        const userRoleEl = document.getElementById('user-role');
        
        if (userNameEl) {
            userNameEl.textContent = this.currentUser.name;
        }
        
        if (userRoleEl) {
            userRoleEl.textContent = this.currentUser.role;
            userRoleEl.className = `user-role role-${this.currentUser.role}`;
        }
    }

    // ✅ Actualizar UI según permisos del usuario
    updateUIBasedOnPermissions() {
        if (!this.currentUser) return;

        console.log('🔧 Actualizando UI según permisos del usuario');

        // Mostrar/ocultar elementos según permisos
        const restrictedElements = [
            { selector: '[data-section="users"]', module: 'users', action: 'read' },
            { selector: '[data-section="settings"]', module: 'settings', action: 'read' },
            { selector: '.admin-only', module: 'users', action: 'write' }
        ];

        restrictedElements.forEach(({ selector, module, action }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this.hasPermission(module, action)) {
                    element.style.display = '';
                    element.classList.remove('hidden');
                } else {
                    element.style.display = 'none';
                    element.classList.add('hidden');
                }
            });
        });

        // Actualizar indicadores visuales de rol
        document.body.setAttribute('data-user-role', this.currentUser.role);
    }

    showSection(sectionName) {
        console.log(`📄 Mostrando sección: ${sectionName}`);
        
        // Actualizar navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Mostrar sección seleccionada
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
        } else {
            console.warn(`⚠️ Sección no encontrada: ${sectionName}-section`);
        }

        // Actualizar título
        this.updateSectionTitle(sectionName);
        
        // Actualizar URL sin recargar página
        if (history.pushState) {
            const newUrl = sectionName === 'overview' ? '/' : `/#${sectionName}`;
            history.pushState({ section: sectionName }, '', newUrl);
        }

        this.currentSection = sectionName;
        
        // Trigger evento personalizado para módulos
        window.dispatchEvent(new CustomEvent('sectionChanged', { 
            detail: { section: sectionName, user: this.currentUser } 
        }));
    }

    updateSectionTitle(sectionName) {
        const titles = {
            'overview': 'Dashboard - Resumen',
            'supply-chain': 'Logística - Cadenas Logísticas',
            'transport': 'Logística - Modos de Transporte',
            'customs': 'Logística - Documentación Aduanera',
            'inventory': 'Logística - Inventarios',
            'insurance': 'Logística - Seguros y Riesgos',
            'exchange-rates': 'Financiero - Tipos de Cambio',
            'costs': 'Financiero - Costos y Presupuestos',
            'financial-reports': 'Financiero - Reportes',
            'audit': 'Financiero - Auditoría',
            'strategies': 'Marketing - Estrategias',
            'channels': 'Marketing - Canales',
            'campaigns': 'Marketing - Campañas',
            'roi-metrics': 'Marketing - Métricas ROI',
            'regulations': 'Legal - Regulaciones',
            'compliance': 'Legal - Compliance',
            'treaties': 'Legal - Tratados',
            'legal-alerts': 'Legal - Alertas',
            'users': 'Dashboard - Usuarios',
            'settings': 'Dashboard - Configuración'
        };

        const titleElement = document.getElementById('section-title');
        if (titleElement && titles[sectionName]) {
            titleElement.textContent = titles[sectionName];
        }

        // Actualizar título de la página
        document.title = `ComexIA - ${titles[sectionName] || 'Dashboard'}`;
    }

    checkAuthState() {
        console.log('🔍 Forzando modo demo automático...');
        // SIEMPRE FORZAR DEMO AUTOMÁTICO
        this.autoDemoLogin();
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(message) {
        console.error('❌ Error:', message);
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // ✅ Método público para logout (para compatibilidad)
    logout() {
        this.handleLogout();
    }
}

// ✅ Función global de logout para compatibilidad
function logout() {
    if (window.ComexIAInstance) {
        window.ComexIAInstance.handleLogout();
    }
}

// Inicializar aplicación
let ComexIAInstance = null;

// Asegurar que solo se inicialice una vez
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComexIA);
} else {
    initializeComexIA();
}

function initializeComexIA() {
    if (!ComexIAInstance) {
        ComexIAInstance = new ComexIA();
        window.ComexIAInstance = ComexIAInstance;
        console.log('🎉 ComexIA inicializada globalmente');
    }
}

// ✅ Funciones para modal de login (mantenidas para compatibilidad)
function showLoginModal() {
    // REDIRIGIR A DEMO EN LUGAR DE MOSTRAR MODAL
    console.log('Modal de login deshabilitado - Iniciando demo automático');
    if (window.ComexIAInstance) {
        window.ComexIAInstance.autoDemoLogin();
    }
}

function closeLoginModal() {
    // No hacer nada - el modal no debería aparecer
    console.log('Modal de login cerrado');
}

// Manejar navegación del navegador
window.addEventListener('popstate', (e) => {
    if (window.ComexIAInstance && window.ComexIAInstance.currentUser) {
        const hash = window.location.hash.substring(1);
        const section = hash || 'overview';
        window.ComexIAInstance.showSection(section);
    }
});

// Prevenir errores globales y mantener la aplicación funcionando
window.addEventListener('error', (e) => {
    console.error('❌ Error global capturado:', e.error);
    
    // No mostrar notificación para errores de recursos faltantes
    if (!e.filename || !e.filename.includes('.js')) {
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification('Ha ocurrido un error menor. La aplicación sigue funcionando.', 'warning');
        }
    }
    
    // Prevenir que el error rompa la aplicación
    e.preventDefault();
});