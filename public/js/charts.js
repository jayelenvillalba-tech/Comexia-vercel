class ChartsManager {
    constructor() {
        this.chartInstances = {};
        this.initializeCharts();
    }

    initializeCharts() {
        this.createTradeVolumeChart();
        this.createTariffComparisonChart();
        this.createCountryDistributionChart();
        this.bindChartEvents();
    }

    createTradeVolumeChart() {
        const ctx = document.getElementById('tradeVolumeChart');
        if (!ctx) return;

        this.chartInstances.tradeVolume = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
                datasets: [{
                    label: 'Volumen de Comercio (USD)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#2E8B57',
                    backgroundColor: 'rgba(46, 139, 87, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Comercio Exterior'
                    }
                }
            }
        });
    }

    createTariffComparisonChart() {
        const ctx = document.getElementById('tariffChart');
        if (!ctx) return;

        this.chartInstances.tariff = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú'],
                datasets: [{
                    label: 'Arancel Promedio (%)',
                    data: [8.5, 12.3, 6.2, 9.8, 7.4],
                    backgroundColor: [
                        '#2E8B57', '#228B22', '#32CD32', 
                        '#90EE90', '#98FB98'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Comparación de Aranceles por País'
                    }
                }
            }
        });
    }

    createCountryDistributionChart() {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;

        this.chartInstances.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Argentina', 'Brasil', 'Chile', 'Colombia', 'Otros'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#2E8B57', '#228B22', '#32CD32',
                        '#90EE90', '#98FB98'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Comercio por País'
                    }
                }
            }
        });
    }

    updateChartData(chartType, newData) {
        if (this.chartInstances[chartType]) {
            this.chartInstances[chartType].data = newData;
            this.chartInstances[chartType].update();
        }
    }

    bindChartEvents() {
        // Actualizar gráficos cuando cambien los filtros
        document.addEventListener('countryChanged', (e) => {
            this.updateChartsForCountry(e.detail.country);
        });
    }

    updateChartsForCountry(country) {
        // Lógica para actualizar gráficos según país seleccionado
        console.log(`Actualizando gráficos para: ${country}`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.chartsManager = new ChartsManager();
});