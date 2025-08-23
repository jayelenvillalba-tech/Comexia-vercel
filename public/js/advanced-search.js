class AdvancedSearchManager {
    constructor() {
        this.searchData = [];
        this.filteredResults = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.init();
    }

    init() {
        this.loadSearchData();
        this.bindEvents();
        this.populateFilters();
    }

    loadSearchData() {
        // Cargar datos desde country-structure.js
        if (typeof countryData !== 'undefined') {
            this.searchData = this.extractSearchableData(countryData);
        }
    }

    extractSearchableData(data) {
        const searchableItems = [];
        
        Object.keys(data).forEach(country => {
            Object.keys(data[country]).forEach(userType => {
                const userData = data[country][userType];
                if (userData.products) {
                    userData.products.forEach(product => {
                        searchableItems.push({
                            country: country,
                            userType: userType,
                            productName: product.name,
                            saCode: product.sa_code,
                            tariff: product.tariff,
                            category: product.category || 'general',
                            description: product.description || '',
                            searchText: `${product.name} ${product.sa_code} ${product.description || ''}`.toLowerCase()
                        });
                    });
                }
            });
        });
        
        return searchableItems;
    }

    bindEvents() {
        const searchInput = document.getElementById('product-search');
        const searchBtn = document.getElementById('search-btn');
        const clearBtn = document.getElementById('clear-filters');
        const countryFilter = document.getElementById('country-filter');
        const tariffFilter = document.getElementById('tariff-filter');
        const categoryFilter = document.getElementById('category-filter');

        // Búsqueda en tiempo real
        searchInput.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 300);
        });

        searchBtn.addEventListener('click', () => this.performSearch());
        clearBtn.addEventListener('click', () => this.clearFilters());
        
        // Filtros
        [countryFilter, tariffFilter, categoryFilter].forEach(filter => {
            filter.addEventListener('change', () => this.performSearch());
        });

        // Paginación
        document.getElementById('prev-page').addEventListener('click', () => this.previousPage());
        document.getElementById('next-page').addEventListener('click', () => this.nextPage());
    }

    populateFilters() {
        const countryFilter = document.getElementById('country-filter');
        const countries = [...new Set(this.searchData.map(item => item.country))];
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }

    performSearch() {
        const searchTerm = document.getElementById('product-search').value.toLowerCase();
        const countryFilter = document.getElementById('country-filter').value;
        const tariffFilter = document.getElementById('tariff-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;

        this.filteredResults = this.searchData.filter(item => {
            // Filtro de texto
            const matchesSearch = !searchTerm || item.searchText.includes(searchTerm);
            
            // Filtro de país
            const matchesCountry = !countryFilter || item.country === countryFilter;
            
            // Filtro de arancel
            const matchesTariff = this.matchesTariffRange(item.tariff, tariffFilter);
            
            // Filtro de categoría
            const matchesCategory = !categoryFilter || item.category === categoryFilter;
            
            return matchesSearch && matchesCountry && matchesTariff && matchesCategory;
        });

        this.currentPage = 1;
        this.displayResults();
    }

    matchesTariffRange(tariff, range) {
        if (!range) return true;
        
        const tariffValue = parseFloat(tariff);
        
        switch(range) {
            case '0-5': return tariffValue >= 0 && tariffValue <= 5;
            case '5-10': return tariffValue > 5 && tariffValue <= 10;
            case '10-15': return tariffValue > 10 && tariffValue <= 15;
            case '15+': return tariffValue > 15;
            default: return true;
        }
    }

    displayResults() {
        const resultsSection = document.getElementById('search-results');
        const resultsGrid = document.getElementById('results-grid');
        const resultsCount = document.getElementById('results-count');
        
        if (this.filteredResults.length === 0) {
            resultsSection.style.display = 'none';
            return;
        }

        resultsSection.style.display = 'block';
        resultsCount.textContent = `${this.filteredResults.length} productos encontrados`;
        
        // Paginación
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResults = this.filteredResults.slice(startIndex, endIndex);
        
        // Limpiar resultados anteriores
        resultsGrid.innerHTML = '';
        
        // Mostrar resultados
        pageResults.forEach(item => {
            const resultCard = this.createResultCard(item);
            resultsGrid.appendChild(resultCard);
        });
        
        this.updatePagination();
    }

    createResultCard(item) {
        const card = document.createElement('div');
        card.className = 'result-card';
        
        card.innerHTML = `
            <div class="result-header">
                <h4 class="product-name">${item.productName}</h4>
                <span class="sa-code">SA: ${item.saCode}</span>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="label">🌍 País:</span>
                    <span class="value">${item.country}</span>
                </div>
                <div class="detail-item">
                    <span class="label">👤 Usuario:</span>
                    <span class="value">${item.userType}</span>
                </div>
                <div class="detail-item">
                    <span class="label">💰 Arancel:</span>
                    <span class="value tariff">${item.tariff}%</span>
                </div>
                <div class="detail-item">
                    <span class="label">📦 Categoría:</span>
                    <span class="value">${item.category}</span>
                </div>
            </div>
            ${item.description ? `<div class="result-description">${item.description}</div>` : ''}
        `;
        
        return card;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredResults.length / this.itemsPerPage);
        const pagination = document.getElementById('pagination');
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayResults();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.filteredResults.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.displayResults();
        }
    }

    clearFilters() {
        document.getElementById('product-search').value = '';
        document.getElementById('country-filter').value = '';
        document.getElementById('tariff-filter').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('search-results').style.display = 'none';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearchManager = new AdvancedSearchManager();
});