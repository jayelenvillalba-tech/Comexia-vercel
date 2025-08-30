class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.advancedDataManager = new AdvancedDataManager();
        this.init();
    }

    init() {
        this.advancedDataManager = new AdvancedDataManager();
        this.bindEvents();
        this.updateStats();
        this.loadTransactions();
        this.initializeModuleData();
    }

    bindEvents() {
        // Event listeners para el dashboard
        const refreshBtn = document.getElementById('refresh-stats');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.updateStats());
        }
    }

    updateStats() {
        // Actualizar estadísticas del dashboard
        const stats = {
            totalRevenue: '$2,450,000',
            activeShipments: '156',
            pendingOperations: '23',
            complianceScore: '94%'
        };

        // Actualizar elementos del DOM
        const revenueEl = document.getElementById('total-revenue');
        const shipmentsEl = document.getElementById('active-shipments');
        const operationsEl = document.getElementById('pending-operations');
        const complianceEl = document.getElementById('compliance-score');

        if (revenueEl) revenueEl.textContent = stats.totalRevenue;
        if (shipmentsEl) shipmentsEl.textContent = stats.activeShipments;
        if (operationsEl) operationsEl.textContent = stats.pendingOperations;
        if (complianceEl) complianceEl.textContent = stats.complianceScore;
    }

    loadTransactions() {
        const transactions = [
            { id: 'TXN001', type: 'Exportación', amount: '$45,000', status: 'Completada', date: '2024-01-15' },
            { id: 'TXN002', type: 'Importación', amount: '$32,500', status: 'Pendiente', date: '2024-01-14' },
            { id: 'TXN003', type: 'Transferencia', amount: '$18,750', status: 'En Proceso', date: '2024-01-13' }
        ];

        const tbody = document.getElementById('recent-transactions');
        if (tbody) {
            tbody.innerHTML = transactions.map(tx => `
                <tr>
                    <td>${tx.id}</td>
                    <td>${tx.type}</td>
                    <td>${tx.amount}</td>
                    <td><span class="status ${tx.status.toLowerCase().replace(' ', '-')}">${tx.status}</span></td>
                    <td>${tx.date}</td>
                </tr>
            `).join('');
        }
    }

    // Inicializar datos de todos los módulos
    initializeModuleData() {
        this.loadSupplyChainData();
        this.loadCustomsDocuments();
        this.loadInventoryData();
        this.loadInsurancePolicies();
        this.loadFinancialOperations();
        this.loadBudgetData();
        this.loadMarketAnalysis();
        this.loadCampaignData();
        this.loadRegulationsData();
        this.loadComplianceData();
        this.loadTreatiesData();
        this.loadLegalAlerts();
    }

    // ===========================================
    // MÓDULO DE LOGÍSTICA INTERNACIONAL
    // ===========================================

    loadSupplyChainData() {
        const data = this.advancedDataManager.getLogisticsData();
        this.updateSupplyChainMetrics(data.supplyChain);
    }

    updateSupplyChainMetrics(data) {
        const metricsContainer = document.querySelector('.chain-metrics');
        if (metricsContainer && data) {
            metricsContainer.innerHTML = `
                <div class="metric-card">
                    <h4>Tiempo Total</h4>
                    <div class="metric-value">${data.totalTime}</div>
                </div>
                <div class="metric-card">
                    <h4>Costo Total</h4>
                    <div class="metric-value">${data.totalCost}</div>
                </div>
                <div class="metric-card">
                    <h4>Eficiencia</h4>
                    <div class="metric-value">${data.efficiency}</div>
                </div>
            `;
        }
    }

    loadCustomsDocuments() {
        const data = this.advancedDataManager.getLogisticsData();
        const tbody = document.getElementById('customs-documents-tbody');
        if (tbody && data.customsDocuments) {
            tbody.innerHTML = data.customsDocuments.map(doc => `
                <tr>
                    <td>${doc.id}</td>
                    <td>${doc.type}</td>
                    <td>${doc.client}</td>
                    <td>${doc.country}</td>
                    <td><span class="status ${doc.status.toLowerCase()}">${doc.status}</span></td>
                    <td>${doc.date}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editCustomsDocument('${doc.id}')">Editar</button>
                        <button class="btn-action btn-view" onclick="viewCustomsDocument('${doc.id}')">Ver</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadInventoryData() {
        const data = this.advancedDataManager.getLogisticsData();
        const tbody = document.getElementById('inventory-tbody');
        if (tbody && data.inventory) {
            tbody.innerHTML = data.inventory.map(item => `
                <tr>
                    <td>${item.sku}</td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td class="${item.stock < item.minStock ? 'low-stock' : ''}">${item.stock}</td>
                    <td>$${item.price}</td>
                    <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editInventoryItem('${item.sku}')">Editar</button>
                        <button class="btn-action btn-restock" onclick="restockItem('${item.sku}')">Reabastecer</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadInsurancePolicies() {
        const data = this.advancedDataManager.getLogisticsData();
        const tbody = document.getElementById('insurance-policies-tbody');
        if (tbody && data.insurance) {
            tbody.innerHTML = data.insurance.map(policy => `
                <tr>
                    <td>${policy.policyNumber}</td>
                    <td>${policy.type}</td>
                    <td>$${policy.coverage.toLocaleString()}</td>
                    <td>$${policy.premium}</td>
                    <td>${policy.expiry}</td>
                    <td><span class="status ${policy.status.toLowerCase()}">${policy.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editInsurancePolicy('${policy.policyNumber}')">Editar</button>
                        <button class="btn-action btn-renew" onclick="renewPolicy('${policy.policyNumber}')">Renovar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // ===========================================
    // MÓDULO FINANCIERO
    // ===========================================

    loadFinancialOperations() {
        const data = this.advancedDataManager.getFinancialData();
        const tbody = document.getElementById('financial-operations-tbody');
        if (tbody && data.operations) {
            tbody.innerHTML = data.operations.map(op => `
                <tr>
                    <td>${op.id}</td>
                    <td>${op.type}</td>
                    <td>${op.currency}</td>
                    <td>$${op.amount.toLocaleString()}</td>
                    <td><span class="status ${op.status.toLowerCase()}">${op.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editFinancialOperation('${op.id}')">Editar</button>
                        <button class="btn-action btn-approve" onclick="approveOperation('${op.id}')">Aprobar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadBudgetData() {
        const data = this.advancedDataManager.getFinancialData();
        const tbody = document.getElementById('budget-tbody');
        if (tbody && data.budgets) {
            tbody.innerHTML = data.budgets.map(budget => `
                <tr>
                    <td>${budget.id}</td>
                    <td>${budget.project}</td>
                    <td>$${budget.total.toLocaleString()}</td>
                    <td>$${budget.spent.toLocaleString()}</td>
                    <td>$${budget.remaining.toLocaleString()}</td>
                    <td>${budget.percentUsed}%</td>
                    <td><span class="status ${budget.status.toLowerCase()}">${budget.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editBudget('${budget.id}')">Editar</button>
                        <button class="btn-action btn-report" onclick="budgetReport('${budget.id}')">Reporte</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    refreshExchangeRates() {
        Utils.showNotification('Actualizando tipos de cambio...', 'info');
        setTimeout(() => {
            const rates = document.querySelectorAll('.exchange-rate');
            rates.forEach(rate => {
                const currentRate = parseFloat(rate.textContent);
                const variation = (Math.random() - 0.5) * 0.01;
                const newRate = (currentRate * (1 + variation)).toFixed(4);
                rate.textContent = newRate;
            });
            Utils.showNotification('Tipos de cambio actualizados', 'success');
        }, 1500);
    }

    // ===========================================
    // MÓDULO MARKETING INTERNACIONAL
    // ===========================================

    loadMarketAnalysis() {
        const data = this.advancedDataManager.getMarketingData();
        const tbody = document.getElementById('market-analysis-tbody');
        if (tbody && data.marketAnalysis) {
            tbody.innerHTML = data.marketAnalysis.map(market => `
                <tr>
                    <td>${market.country}</td>
                    <td><span class="potential ${market.potential.toLowerCase()}">${market.potential}</span></td>
                    <td><span class="competition ${market.competition.toLowerCase()}">${market.competition}</span></td>
                    <td>$${market.investment.toLocaleString()}</td>
                    <td>${market.expectedROI}%</td>
                    <td><span class="status ${market.status.toLowerCase()}">${market.status}</span></td>
                    <td>
                        <button class="btn-action btn-analyze" onclick="analyzeMarket('${market.country}')">Analizar</button>
                        <button class="btn-action btn-invest" onclick="investInMarket('${market.country}')">Invertir</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadCampaignData() {
        const data = this.advancedDataManager.getMarketingData();
        const tbody = document.getElementById('campaigns-tbody');
        if (tbody && data.campaigns) {
            tbody.innerHTML = data.campaigns.map(campaign => `
                <tr>
                    <td>${campaign.id}</td>
                    <td>${campaign.name}</td>
                    <td>${campaign.channel}</td>
                    <td>$${campaign.budget.toLocaleString()}</td>
                    <td>${campaign.reach.toLocaleString()}</td>
                    <td>${campaign.ctr}%</td>
                    <td>${campaign.roi}%</td>
                    <td><span class="status ${campaign.status.toLowerCase()}">${campaign.status}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editCampaign('${campaign.id}')">Editar</button>
                        <button class="btn-action btn-pause" onclick="pauseCampaign('${campaign.id}')">Pausar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // ===========================================
    // MÓDULO LEGAL Y NORMATIVO
    // ===========================================

    loadRegulationsData() {
        const data = this.advancedDataManager.getLegalData();
        const tbody = document.getElementById('regulations-tbody');
        if (tbody && data.regulations) {
            tbody.innerHTML = data.regulations.map(reg => `
                <tr>
                    <td>${reg.id}</td>
                    <td>${reg.title}</td>
                    <td>${reg.country}</td>
                    <td>${reg.category}</td>
                    <td>${reg.effectiveDate}</td>
                    <td><span class="priority ${reg.priority.toLowerCase()}">${reg.priority}</span></td>
                    <td><span class="status ${reg.status.toLowerCase()}">${reg.status}</span></td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewRegulation('${reg.id}')">Ver</button>
                        <button class="btn-action btn-comply" onclick="markCompliant('${reg.id}')">Cumplir</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadComplianceData() {
        const data = this.advancedDataManager.getLegalData();
        const tbody = document.getElementById('compliance-tbody');
        if (tbody && data.compliance) {
            tbody.innerHTML = data.compliance.map(item => `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.requirement}</td>
                    <td>${item.department}</td>
                    <td>${item.dueDate}</td>
                    <td><span class="priority ${item.priority.toLowerCase()}">${item.priority}</span></td>
                    <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>
                        <button class="btn-action btn-update" onclick="updateCompliance('${item.id}')">Actualizar</button>
                        <button class="btn-action btn-audit" onclick="auditCompliance('${item.id}')">Auditar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadTreatiesData() {
        const data = this.advancedDataManager.getLegalData();
        const tbody = document.getElementById('treaties-tbody');
        if (tbody && data.treaties) {
            tbody.innerHTML = data.treaties.map(treaty => `
                <tr>
                    <td>${treaty.id}</td>
                    <td>${treaty.name}</td>
                    <td>${treaty.countries.join(', ')}</td>
                    <td>${treaty.type}</td>
                    <td>${treaty.signedDate}</td>
                    <td><span class="status ${treaty.status.toLowerCase()}">${treaty.status}</span></td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewTreaty('${treaty.id}')">Ver</button>
                        <button class="btn-action btn-analyze" onclick="analyzeTreaty('${treaty.id}')">Analizar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadLegalAlerts() {
        const data = this.advancedDataManager.getLegalData();
        const tbody = document.getElementById('legal-alerts-tbody');
        if (tbody && data.alerts) {
            tbody.innerHTML = data.alerts.map(alert => `
                <tr>
                    <td>${alert.id}</td>
                    <td>${alert.title}</td>
                    <td>${alert.type}</td>
                    <td>${alert.country}</td>
                    <td>${alert.date}</td>
                    <td><span class="priority ${alert.priority.toLowerCase()}">${alert.priority}</span></td>
                    <td><span class="status ${alert.status.toLowerCase()}">${alert.status}</span></td>
                    <td>
                        <button class="btn-action btn-view" onclick="viewAlert('${alert.id}')">Ver</button>
                        <button class="btn-action btn-dismiss" onclick="dismissAlert('${alert.id}')">Descartar</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    // ===========================================
    // FUNCIONES DE ACCIÓN PARA LOS MÓDULOS
    // ===========================================

    // Logística
    editCustomsDocument(id) {
        Utils.showNotification(`Editando documento ${id}...`, 'info');
    }

    viewCustomsDocument(id) {
        Utils.showNotification(`Visualizando documento ${id}...`, 'info');
    }

    editInventoryItem(sku) {
        Utils.showNotification(`Editando producto ${sku}...`, 'info');
    }

    restockItem(sku) {
        Utils.showNotification(`Reabasteciendo producto ${sku}...`, 'info');
    }

    editInsurancePolicy(policyNumber) {
        Utils.showNotification(`Editando póliza ${policyNumber}...`, 'info');
    }

    renewPolicy(policyNumber) {
        Utils.showNotification(`Renovando póliza ${policyNumber}...`, 'info');
    }

    // Financiero
    editFinancialOperation(id) {
        Utils.showNotification(`Editando operación ${id}...`, 'info');
    }

    approveOperation(id) {
        Utils.showNotification(`Operación ${id} aprobada`, 'success');
    }

    editBudget(id) {
        Utils.showNotification(`Editando presupuesto ${id}...`, 'info');
    }

    budgetReport(id) {
        Utils.showNotification(`Generando reporte para presupuesto ${id}...`, 'info');
    }

    // Marketing
    analyzeMarket(country) {
        Utils.showNotification(`Analizando mercado de ${country}...`, 'info');
    }

    investInMarket(country) {
        Utils.showNotification(`Iniciando inversión en ${country}...`, 'info');
    }

    editCampaign(id) {
        Utils.showNotification(`Editando campaña ${id}...`, 'info');
    }

    pauseCampaign(id) {
        Utils.showNotification(`Pausando campaña ${id}...`, 'info');
    }

    // Legal
    viewRegulation(id) {
        Utils.showNotification(`Visualizando regulación ${id}...`, 'info');
    }

    markCompliant(id) {
        Utils.showNotification(`Marcando regulación ${id} como cumplida...`, 'success');
    }

    updateCompliance(id) {
        Utils.showNotification(`Actualizando compliance ${id}...`, 'info');
    }

    auditCompliance(id) {
        Utils.showNotification(`Iniciando auditoría de compliance ${id}...`, 'info');
    }

    viewTreaty(id) {
        Utils.showNotification(`Visualizando tratado ${id}...`, 'info');
    }

    analyzeTreaty(id) {
        Utils.showNotification(`Analizando impacto del tratado ${id}...`, 'info');
    }

    viewAlert(id) {
        Utils.showNotification(`Visualizando alerta ${id}...`, 'info');
    }

    dismissAlert(id) {
        Utils.showNotification(`Alerta ${id} descartada`, 'success');
    }

    // ===========================================
    // FUNCIONES GLOBALES PARA CREAR ELEMENTOS
    // ===========================================

    createCustomsDocument() {
        Utils.showNotification('Creando nuevo documento aduanero...', 'info');
    }

    addInventoryItem() {
        Utils.showNotification('Agregando nuevo producto al inventario...', 'info');
    }

    createInsurancePolicy() {
        Utils.showNotification('Creando nueva póliza de seguro...', 'info');
    }

    createBudget() {
        Utils.showNotification('Creando nuevo presupuesto...', 'info');
    }

    generateReport() {
        Utils.showNotification('Generando reporte financiero...', 'info');
    }

    createStrategy() {
        Utils.showNotification('Creando nueva estrategia de marketing...', 'info');
    }

    addChannel() {
        Utils.showNotification('Agregando nuevo canal de marketing...', 'info');
    }

    calculateInsurance() {
        const cargoValue = document.getElementById('cargo-value')?.value;
        const transportType = document.getElementById('transport-type')?.value;
        
        if (cargoValue && transportType) {
            let rate = 0.005;
            if (transportType === 'air') rate = 0.003;
            if (transportType === 'land') rate = 0.004;
            
            const premium = parseFloat(cargoValue) * rate;
            const premiumElement = document.getElementById('insurance-premium');
            if (premiumElement) {
                premiumElement.textContent = `$${premium.toLocaleString()}`;
            }
        }
    }
}

// ===========================================
// FUNCIONES GLOBALES PARA ACCESO DESDE HTML
// ===========================================

// Inicialización
let dashboardManager;

document.addEventListener('DOMContentLoaded', function() {
    dashboardManager = new DashboardManager();
    window.dashboardManager = dashboardManager;
});

// Funciones globales de logística
function refreshExchangeRates() {
    if (window.dashboardManager) {
        window.dashboardManager.refreshExchangeRates();
    }
}

function createCustomsDocument() {
    if (window.dashboardManager) {
        window.dashboardManager.createCustomsDocument();
    }
}

function addInventoryItem() {
    if (window.dashboardManager) {
        window.dashboardManager.addInventoryItem();
    }
}

function createInsurancePolicy() {
    if (window.dashboardManager) {
        window.dashboardManager.createInsurancePolicy();
    }
}

// Funciones globales financieras
function createBudget() {
    if (window.dashboardManager) {
        window.dashboardManager.createBudget();
    }
}

function generateReport() {
    if (window.dashboardManager) {
        window.dashboardManager.generateReport();
    }
}

// Funciones globales de marketing
function createStrategy() {
    if (window.dashboardManager) {
        window.dashboardManager.createStrategy();
    }
}

function addChannel() {
    if (window.dashboardManager) {
        window.dashboardManager.addChannel();
    }
}

// Funciones específicas de edición
function editFinancialOperation(id) {
    if (window.dashboardManager) {
        window.dashboardManager.editFinancialOperation(id);
    }
}

function approveOperation(id) {
    if (window.dashboardManager) {
        window.dashboardManager.approveOperation(id);
    }
}

function editCustomsDocument(id) {
    if (window.dashboardManager) {
        window.dashboardManager.editCustomsDocument(id);
    }
}

function viewCustomsDocument(id) {
    if (window.dashboardManager) {
        window.dashboardManager.viewCustomsDocument(id);
    }
}

function editInventoryItem(sku) {
    if (window.dashboardManager) {
        window.dashboardManager.editInventoryItem(sku);
    }
}

function restockItem(sku) {
    if (window.dashboardManager) {
        window.dashboardManager.restockItem(sku);
    }
}

function editInsurancePolicy(policyNumber) {
    if (window.dashboardManager) {
        window.dashboardManager.editInsurancePolicy(policyNumber);
    }
}

function renewPolicy(policyNumber) {
    if (window.dashboardManager) {
        window.dashboardManager.renewPolicy(policyNumber);
    }
}

function editBudget(id) {
    if (window.dashboardManager) {
        window.dashboardManager.editBudget(id);
    }
}

function budgetReport(id) {
    if (window.dashboardManager) {
        window.dashboardManager.budgetReport(id);
    }
}

function analyzeMarket(country) {
    if (window.dashboardManager) {
        window.dashboardManager.analyzeMarket(country);
    }
}

function investInMarket(country) {
    if (window.dashboardManager) {
        window.dashboardManager.investInMarket(country);
    }
}

function editCampaign(id) {
    if (window.dashboardManager) {
        window.dashboardManager.editCampaign(id);
    }
}

function pauseCampaign(id) {
    if (window.dashboardManager) {
        window.dashboardManager.pauseCampaign(id);
    }
}

function viewRegulation(id) {
    if (window.dashboardManager) {
        window.dashboardManager.viewRegulation(id);
    }
}

function markCompliant(id) {
    if (window.dashboardManager) {
        window.dashboardManager.markCompliant(id);
    }
}

function updateCompliance(id) {
    if (window.dashboardManager) {
        window.dashboardManager.updateCompliance(id);
    }
}

function auditCompliance(id) {
    if (window.dashboardManager) {
        window.dashboardManager.auditCompliance(id);
    }
}

function viewTreaty(id) {
    if (window.dashboardManager) {
        window.dashboardManager.viewTreaty(id);
    }
}

function analyzeTreaty(id) {
    if (window.dashboardManager) {
        window.dashboardManager.analyzeTreaty(id);
    }
}

function viewAlert(id) {
    if (window.dashboardManager) {
        window.dashboardManager.viewAlert(id);
    }
}

function dismissAlert(id) {
    if (window.dashboardManager) {
        window.dashboardManager.dismissAlert(id);
    }
}

function calculateInsurance() {
    if (window.dashboardManager) {
        window.dashboardManager.calculateInsurance();
    }
}
// Función temporal para generar datos mock
generateMockLogisticsData() {
    return {
        shipments: [
            { id: 1, origin: 'México', destination: 'Estados Unidos', status: 'En tránsito', value: 15000 },
            { id: 2, origin: 'Brasil', destination: 'Argentina', status: 'Entregado', value: 8500 },
            { id: 3, origin: 'Chile', destination: 'Perú', status: 'Pendiente', value: 12000 }
        ],
        totalValue: 35500,
        activeShipments: 15,
        completedShipments: 42
    };
}

// Función para inicializar datos demo
initializeDemoData() {
    const mockData = this.generateMockLogisticsData();
    this.updateDashboardStats(mockData);
    this.renderShipmentsTable(mockData.shipments);
}

// Actualizar estadísticas del dashboard
updateDashboardStats(data) {
    const statsElements = {
        totalValue: document.querySelector('.stat-total-value .value'),
        activeShipments: document.querySelector('.stat-active .value'),
        completedShipments: document.querySelector('.stat-completed .value')
    };
    
    if (statsElements.totalValue) {
        statsElements.totalValue.textContent = `$${data.totalValue.toLocaleString()}`;
    }
    if (statsElements.activeShipments) {
        statsElements.activeShipments.textContent = data.activeShipments;
    }
    if (statsElements.completedShipments) {
        statsElements.completedShipments.textContent = data.completedShipments;
    }
}

// Renderizar tabla de envíos
renderShipmentsTable(shipments) {
    const tableContainer = document.querySelector('.shipments-table-container');
    if (!tableContainer) return;
    
    const tableHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Estado</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                ${shipments.map(shipment => `
                    <tr>
                        <td>${shipment.id}</td>
                        <td>${shipment.origin}</td>
                        <td>${shipment.destination}</td>
                        <td><span class="status-badge status-${shipment.status.toLowerCase().replace(' ', '-')}">${shipment.status}</span></td>
                        <td>$${shipment.value.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
}