// KoraApp - Aplicación SPA Principal
class KoraApp {
    constructor() {
        this.currentUser = null;
        this.currentSection = 'overview';
        this.isInitialized = false;
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
        console.log('🚀 Inicializando KoraApp...');
        
        // Verificar estado de autenticación primero
        this.checkAuthState();
        
        // Luego vincular eventos
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('✅ KoraApp inicializada correctamente');
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
            localStorage.setItem('koraapp_user', JSON.stringify(this.currentUser));
            localStorage.setItem('koraapp_session', Date.now().toString());
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
            localStorage.removeItem('koraapp_user');
            localStorage.removeItem('koraapp_session');
            console.log('🗑️ Datos de sesión eliminados');
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
        
        this.showLogin();
        
        if (window.Utils && typeof Utils.showNotification === 'function') {
            Utils.showNotification('Sesión cerrada correctamente', 'info');
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
        console.log('🔐 Mostrando pantalla de login');
        
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        
        if (loginScreen && dashboardScreen) {
            loginScreen.style.display = 'flex';
            dashboardScreen.style.display = 'none';
            
            // Limpiar formulario
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.reset();
            }
            
            // Focus en el campo email
            setTimeout(() => {
                const emailInput = document.getElementById('email');
                if (emailInput) {
                    emailInput.focus();
                }
            }, 100);
        } else {
            console.error('❌ No se encontraron las pantallas de login/dashboard');
        }
    }

    showDashboard() {
        console.log('📊 Mostrando dashboard');
        
        const loginScreen = document.getElementById('login-screen');
        const dashboardScreen = document.getElementById('dashboard-screen');
        
        if (loginScreen && dashboardScreen) {
            loginScreen.style.display = 'none';
            dashboardScreen.style.display = 'flex';
            
            // Mostrar sección por defecto
            this.showSection('overview');
            
            // Actualizar UI según permisos
            this.updateUIBasedOnPermissions();
            
            // Actualizar información del usuario
            this.updateUserInfo();
        } else {
            console.error('❌ No se encontraron las pantallas de login/dashboard');
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
        document.title = `KoraApp - ${titles[sectionName] || 'Dashboard'}`;
    }

    checkAuthState() {
        console.log('🔍 Verificando estado de autenticación...');
        
        try {
            const savedUser = localStorage.getItem('koraapp_user');
            const sessionTime = localStorage.getItem('koraapp_session');
            
            if (savedUser && sessionTime) {
                const user = JSON.parse(savedUser);
                const sessionAge = Date.now() - parseInt(sessionTime);
                
                // Sesión válida por 24 horas (86400000 ms)
                if (sessionAge < 86400000) {
                    this.currentUser = user;
                    console.log('✅ Sesión válida encontrada:', this.currentUser.email);
                    this.showDashboard();
                    
                    // Verificar si hay una sección específica en la URL
                    const hash = window.location.hash.substring(1);
                    if (hash) {
                        this.showSection(hash);
                    }
                    
                    if (window.Utils && typeof Utils.showNotification === 'function') {
                        Utils.showNotification('Sesión restaurada correctamente', 'info');
                    }
                    return;
                }
            }
            
            console.log('ℹ️ No hay sesión activa, mostrando login');
            this.showLogin();
        } catch (error) {
            console.error('❌ Error verificando autenticación:', error);
            // En caso de error, limpiar y mostrar login
            try {
                localStorage.removeItem('koraapp_user');
                localStorage.removeItem('koraapp_session');
            } catch (e) {
                console.error('Error limpiando localStorage:', e);
            }
            this.showLogin();
        }
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
    if (window.koraApp) {
        window.koraApp.handleLogout();
    }
}

// Inicializar aplicación
let koraAppInstance = null;

// Asegurar que solo se inicialice una vez
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeKoraApp);
} else {
    initializeKoraApp();
}

function initializeKoraApp() {
    if (!koraAppInstance) {
        koraAppInstance = new KoraApp();
        window.koraApp = koraAppInstance;
        console.log('🎉 KoraApp inicializada globalmente');
    }
}

// Manejar navegación del navegador
window.addEventListener('popstate', (e) => {
    if (window.koraApp && window.koraApp.currentUser) {
        const hash = window.location.hash.substring(1);
        const section = hash || 'overview';
        window.koraApp.showSection(section);
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

// Manejar errores de recursos no encontrados
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promesa rechazada:', e.reason);
    e.preventDefault();
});