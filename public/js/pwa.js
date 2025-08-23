class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isOnline = navigator.onLine;
        this.swRegistration = null;
        
        this.init();
    }

    async init() {
        console.log('[PWA] Initializing PWA Manager...');
        
        // Registrar Service Worker
        await this.registerServiceWorker();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Crear elementos UI
        this.createUIElements();
        
        // Verificar estado de conexión
        this.updateOnlineStatus();
        
        console.log('[PWA] PWA Manager initialized successfully');
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.swRegistration = await navigator.serviceWorker.register('/sw.js');
                console.log('[PWA] Service Worker registered:', this.swRegistration);
                
                // Escuchar actualizaciones
                this.swRegistration.addEventListener('updatefound', () => {
                    const newWorker = this.swRegistration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
            }
        }
    }

    setupEventListeners() {
        // Evento de instalación PWA
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Eventos de conexión
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateOnlineStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateOnlineStatus();
        });

        // Evento cuando la app se instala
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] App installed successfully');
            this.hideInstallButton();
            this.showToast('¡KoraApp instalada correctamente!', 'success');
        });
    }

    createUIElements() {
        // Botón de instalación
        this.installButton = document.createElement('button');
        this.installButton.className = 'pwa-install-button';
        this.installButton.innerHTML = '📱 Instalar App';
        this.installButton.addEventListener('click', () => this.installApp());
        document.body.appendChild(this.installButton);

        // Indicador offline
        this.offlineIndicator = document.createElement('div');
        this.offlineIndicator.className = 'offline-indicator';
        this.offlineIndicator.innerHTML = '⚠️ Sin conexión - Modo offline activado';
        document.body.appendChild(this.offlineIndicator);

        // Notificación de actualización
        this.updateNotification = document.createElement('div');
        this.updateNotification.className = 'update-notification';
        this.updateNotification.innerHTML = `
            <div>🔄 Nueva versión disponible</div>
            <button onclick="pwaManager.updateApp()">Actualizar</button>
            <button onclick="pwaManager.hideUpdateNotification()">Después</button>
        `;
        document.body.appendChild(this.updateNotification);
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.classList.add('show');
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.classList.remove('show');
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('[PWA] User accepted the install prompt');
            } else {
                console.log('[PWA] User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    updateOnlineStatus() {
        if (this.isOnline) {
            this.offlineIndicator.classList.remove('show');
            this.showToast('🌐 Conexión restaurada', 'success');
        } else {
            this.offlineIndicator.classList.add('show');
            this.showToast('📱 Modo offline activado', 'info');
        }
    }

    showUpdateNotification() {
        if (this.updateNotification) {
            this.updateNotification.classList.add('show');
        }
    }

    hideUpdateNotification() {
        if (this.updateNotification) {
            this.updateNotification.classList.remove('show');
        }
    }

    async updateApp() {
        if (this.swRegistration && this.swRegistration.waiting) {
            this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    }

    showToast(message, type = 'info') {
        // Crear toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Estilos inline para el toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1002',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Colores según tipo
        const colors = {
            success: '#4ecdc4',
            error: '#ff6b6b',
            warning: '#ffa726',
            info: '#667eea'
        };
        toast.style.background = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Animación de entrada
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remove después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Métodos utilitarios
    async getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: this.formatBytes(estimate.usage || 0),
                available: this.formatBytes(estimate.quota || 0)
            };
        }
        return null;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async clearCache() {
        if (this.swRegistration) {
            const messageChannel = new MessageChannel();
            
            return new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                    resolve(event.data);
                };
                
                this.swRegistration.active.postMessage(
                    { type: 'CLEAR_CACHE' },
                    [messageChannel.port2]
                );
            });
        }
    }
}

// Inicializar PWA Manager cuando el DOM esté listo
let pwaManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaManager = new PWAManager();
    });
} else {
    pwaManager = new PWAManager();
}

// Exportar para uso global
window.pwaManager = pwaManager;