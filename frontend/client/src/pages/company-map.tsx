import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Building2, Globe, Search, Filter, Users, Briefcase, ChevronRight, Ship, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { apiRequest } from '@/lib/queryClient';
import { Map, Marker } from 'pigeon-maps';

interface Company {
  id: string;
  name: string;
  country: string;
  countryName: string;
  type: 'direct' | 'indirect' | 'cooperative' | 'state' | 'pyme';
  products: string[];
  hsCode: string;
  verified: boolean;
  coordinates: [number, number];
  contactEmail?: string;
  website?: string;
  rating?: number;
  sector: string;
}

interface CompanyMapData {
  companies: Company[];
  totalCompanies: number;
  countriesCount: number;
  continentsData: {
    americas: number;
    europe: number;
    asia: number;
    africa: number;
  };
}

// Dark satellite map provider
function darkMapTileProvider(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

export default function CompanyMap() {
  const { language } = useLanguage();
  const [mapData, setMapData] = useState<CompanyMapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.6037, -58.3816]); // Buenos Aires
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    loadCompanyMap();
  }, []);

  const loadCompanyMap = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/companies/map-data', {
        method: 'GET'
      });
      
      if (response.success) {
        setMapData(response);
      }
    } catch (error) {
      console.error('Error loading company map:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = mapData?.companies.filter(company => {
    const matchesType = filterType === 'all' || company.type === filterType;
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.countryName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  }) || [];

  const handleCompanyClick = (company: Company) => {
    setSelectedCompany(company);
    setMapCenter([company.coordinates[0], company.coordinates[1]]);
    setMapZoom(6);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg text-cyan-400 font-medium">
            {language === 'es' ? 'Cargando mapa...' : 'Loading map...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929]">
      {/* Breadcrumb */}
      <div className="bg-[#0D2137] border-b border-cyan-900/30 px-6 py-3">
        <div className="flex items-center gap-2 text-sm text-cyan-100">
          <Globe className="w-4 h-4" />
          <span className="text-gray-400">
            {language === 'es' ? 'País' : 'Country'}: Argentina
          </span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-gray-400">
            {language === 'es' ? 'Acción' : 'Action'}: Exportar
          </span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="text-cyan-400 font-medium">
            {language === 'es' ? 'Producto' : 'Product'}: Carne
          </span>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Map Section */}
        <div className="flex-1 relative">
          <Map
            provider={darkMapTileProvider}
            center={mapCenter}
            zoom={mapZoom}
            onBoundsChanged={({ center, zoom }) => {
              setMapCenter(center);
              setMapZoom(zoom);
            }}
            attribution={false}
          >
            {filteredCompanies.map((company) => (
              <Marker
                key={company.id}
                anchor={[company.coordinates[0], company.coordinates[1]]}
                onClick={() => handleCompanyClick(company)}
              >
                <div className="relative group cursor-pointer">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  {/* Pin */}
                  <div className="relative w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </Marker>
            ))}
          </Map>

          {/* Map Overlay Stats */}
          <div className="absolute top-4 left-4 space-y-2">
            <div className="bg-[#0D2137]/90 backdrop-blur-md border border-cyan-900/30 rounded-lg p-3 text-white">
              <div className="text-xs text-gray-400 mb-1">
                {language === 'es' ? 'Empresas Totales' : 'Total Companies'}
              </div>
              <div className="text-2xl font-bold text-cyan-400">{mapData?.totalCompanies || 0}</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-[#0D2137] border-l border-cyan-900/30 overflow-y-auto">
          {selectedCompany ? (
            // Company Details Panel
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {language === 'es' ? 'Detalle de Oportunidad' : 'Opportunity Detail'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCompany(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="bg-[#0A1929] rounded-lg p-4 border border-cyan-900/30 space-y-3">
                  <h3 className="text-lg font-semibold text-white">{selectedCompany.countryName}</h3>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">
                        {language === 'es' ? 'Tratados Comerciales Detallados' : 'Detailed Trade Agreements'}
                      </div>
                      <ul className="text-cyan-100 space-y-1 text-xs">
                        <li>- {language === 'es' ? 'Reducción arancelaria' : 'Tariff reduction'}</li>
                        <li>- {language === 'es' ? 'Protocolos sanitarios' : 'Sanitary protocols'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distance Card */}
              <div className="bg-[#0A1929] rounded-lg p-4 border border-cyan-900/30">
                <div className="text-sm text-gray-400 mb-2">
                  {language === 'es' ? 'Distancia Argentina - ' : 'Distance Argentina - '}{selectedCompany.countryName}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-white">~19,000 km</div>
                  <Ship className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-xs text-gray-500 mt-1">/ 11,800 mi</div>
              </div>

              {/* Alerts */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-yellow-400 mb-1">
                      {language === 'es' ? 'Alerta' : 'Alert'}
                    </div>
                    <div className="text-xs text-yellow-200">
                      {language === 'es' 
                        ? 'Nuevos requisitos de etiquetado para productos cárnicos' 
                        : 'New labeling requirements for meat products'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Tools */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-400 mb-3">
                  {language === 'es' ? 'Herramientas de Simulación' : 'Simulation Tools'}
                </div>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white justify-start">
                  <Ship className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Simulador de Logística (Incoterm)' : 'Logistics Simulator (Incoterm)'}
                </Button>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Calculadora de Costos' : 'Cost Calculator'}
                </Button>
              </div>

              {/* Company Info */}
              <div className="bg-[#0A1929] rounded-lg p-4 border border-cyan-900/30 space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'es' ? 'Empresa' : 'Company'}
                  </div>
                  <div className="text-sm text-white font-medium">{selectedCompany.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">
                    {language === 'es' ? 'Productos' : 'Products'}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedCompany.products.map((product, idx) => (
                      <Badge key={idx} className="bg-cyan-900/30 text-cyan-300 text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">HS Code</div>
                  <div className="text-sm text-white font-mono">{selectedCompany.hsCode}</div>
                </div>
              </div>
            </div>
          ) : (
            // Company List Panel
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Top 3 Compradores' : 'Top 3 Buyers'}
                </h2>
                <div className="space-y-2">
                  {filteredCompanies.slice(0, 3).map((company, idx) => (
                    <div
                      key={company.id}
                      onClick={() => handleCompanyClick(company)}
                      className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30 hover:border-cyan-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-cyan-400">{idx + 1}.</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{company.countryName}</div>
                          <div className="text-xs text-gray-400">{company.name}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Países Recomendados (Tratados)' : 'Recommended Countries (Treaties)'}
                </h2>
                <div className="space-y-2">
                  {filteredCompanies.slice(3, 6).map((company, idx) => (
                    <div
                      key={company.id}
                      onClick={() => handleCompanyClick(company)}
                      className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30 hover:border-cyan-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-cyan-400">{idx + 1}.</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{company.countryName}</div>
                          <div className="text-xs text-gray-400">{company.sector}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Noticias Globales Relevantes' : 'Relevant Global News'}
                </h2>
                <div className="space-y-2">
                  <div className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium mb-1">
                          {language === 'es' 
                            ? 'Aumento de la demanda de carne argentina en Asia' 
                            : 'Increase in demand for Argentine beef in Asia'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30">
                    <div className="flex gap-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-white font-medium mb-1">
                          {language === 'es' 
                            ? 'Nuevas regulaciones de exportación en la UE' 
                            : 'New export regulations in the EU'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}