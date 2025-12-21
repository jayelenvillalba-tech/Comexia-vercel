import { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useLocation } from 'wouter';
import { Map, Marker } from 'pigeon-maps';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { ChevronLeft, ChevronRight, Ship, TrendingUp, AlertCircle, Globe, MapPin } from 'lucide-react';
import LogisticsSimulator from '@/components/logistics-simulator';
import CostCalculatorDialog from '@/components/cost-calculator-dialog';
import { MarketTrendsChart } from "@/components/market-trends-chart";

// Dark satellite map provider
function darkMapTileProvider(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}

export default function Analysis() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]); // World view
  const [mapZoom, setMapZoom] = useState(2);
  const [showLogisticsSimulator, setShowLogisticsSimulator] = useState(false);
  const [showCostCalculator, setShowCostCalculator] = useState(false);
  
  // Get query parameters
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code') || '';
  const country = params.get('country') || 'AR';
  const operation = params.get('operation') || 'export';
  const product = params.get('product') || '';

  // [FIX] Fetch real requirements data
  const { data: requirements } = useQuery<any>({
    queryKey: ["/api/country-requirements", selectedCountry, code],
    queryFn: async () => {
      // Find country code for selected country name
      // This is a bit hacky because selectedCountry is a name here, not a code
      // We should really track countryCode in state
      let targetCode = 'US'; // Default fallback
      if (selectedCountry?.includes('China')) targetCode = 'CN';
      if (selectedCountry?.includes('Alemania')) targetCode = 'DE';
      if (selectedCountry?.includes('Brasil')) targetCode = 'BR';
      if (selectedCountry?.includes('Chile')) targetCode = 'CL';
      if (selectedCountry?.includes('Europa')) targetCode = 'EU';
      if (selectedCountry?.includes('Japón') || selectedCountry?.includes('Japan')) targetCode = 'JP';
      if (selectedCountry?.includes('Australia')) targetCode = 'AU';
      if (selectedCountry?.includes('México') || selectedCountry?.includes('Mexico')) targetCode = 'MX';
      if (selectedCountry?.includes('Rusia') || selectedCountry?.includes('Russia')) targetCode = 'RU';
      
      console.log('[DEBUG ANALYSIS] Fetching reqs for:', targetCode, code);
      const response = await fetch(`/api/country-requirements/${targetCode}/${code}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!selectedCountry && !!code,
  });

  // Mock data for top buyers and recommended countries with coordinates

  // Mock data for top buyers and recommended countries with coordinates
  const topBuyers = [
    { rank: 1, country: 'China', countryCode: 'CN', flag: '🇨🇳', coordinates: [35.8617, 104.1954] as [number, number] },
    { rank: 2, country: 'Estados Unidos', countryCode: 'US', flag: '🇺🇸', coordinates: [37.0902, -95.7129] as [number, number] },
    { rank: 3, country: 'Alemania', countryCode: 'DE', flag: '🇩🇪', coordinates: [51.1657, 10.4515] as [number, number] }
  ];

  const recommendedCountries = [
    { rank: 1, country: 'Brasil (Mercosur)', countryCode: 'BR', treaty: 'Mercosur', coordinates: [-14.2350, -51.9253] as [number, number] },
    { rank: 2, country: 'Chile (Acuerdo Bilateral)', countryCode: 'CL', treaty: 'Bilateral', coordinates: [-35.6751, -71.5430] as [number, number] },
    { rank: 3, country: 'Unión Europea', countryCode: 'EU', treaty: 'UE-Mercosur', coordinates: [54.5260, 15.2551] as [number, number] }
  ];

  // Additional opportunity pins
  const opportunityPins = [
    { coordinates: [35.6762, 139.6503] as [number, number], country: 'Japón' }, // Tokyo
    { coordinates: [-33.8688, 151.2093] as [number, number], country: 'Australia' }, // Sydney
    { coordinates: [19.4326, -99.1332] as [number, number], country: 'México' }, // Mexico City
    { coordinates: [55.7558, 37.6173] as [number, number], country: 'Rusia' }, // Moscow
  ];

  const allPins = [
    ...topBuyers.map(b => ({ ...b, type: 'buyer' as const })),
    ...recommendedCountries.map(c => ({ ...c, type: 'recommended' as const })),
    ...opportunityPins.map(p => ({ ...p, type: 'opportunity' as const }))
  ];

  const globalNews = [
    {
      title: language === 'es' ? 'Aumento de la demanda de carne argentina en Asia' : 'Increase in demand for Argentine beef in Asia',
      image: 'bg-gradient-to-br from-orange-500 to-red-600'
    },
    {
      title: language === 'es' ? 'Nuevas regulaciones de exportación en la UE' : 'New export regulations in the EU',
      image: 'bg-gradient-to-br from-blue-500 to-purple-600'
    }
  ];

  const handlePinClick = (country: string, coords: [number, number]) => {
    setSelectedCountry(country);
    setMapCenter(coords);
    setMapZoom(5);
  };

  return (
    <div className="min-h-screen bg-[#0A1929]">
      {/* Breadcrumb */}
      <div className="bg-[#0D2137] border-b border-cyan-900/30 px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-cyan-400"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {language === 'es' ? 'Volver al Mapa' : 'Back to Map'}
          </Button>
          <div className="flex items-center gap-2 text-cyan-100 ml-4">
            <Globe className="w-4 h-4" />
            <span className="text-gray-400">
              {language === 'es' ? 'País' : 'Country'}: 
            </span>
            <span className="text-white font-medium">
              {country === 'AR' ? 'Argentina' : country}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-400">
              {language === 'es' ? 'Acción' : 'Action'}:
            </span>
            <span className="text-white font-medium">
              {operation === 'export' ? (language === 'es' ? 'Exportar' : 'Export') : (language === 'es' ? 'Importar' : 'Import')}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-400">
              {language === 'es' ? 'Producto' : 'Product'}:
            </span>
            <span className="text-cyan-400 font-medium">{product || code}</span>
          </div>
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
            height={window.innerHeight - 60}
          >
            {allPins.map((pin, idx) => (
              <Marker
                key={idx}
                anchor={pin.coordinates}
                onClick={() => handlePinClick(pin.country, pin.coordinates)}
              >
                <div className="relative group cursor-pointer">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity w-8 h-8 -translate-x-4 -translate-y-4" />
                  {/* Pin */}
                  <div className="relative">
                    <MapPin className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" fill="currentColor" />
                  </div>
                </div>
              </Marker>
            ))}
          </Map>

          {/* Map Overlay Stats */}
          <div className="absolute top-4 left-4 space-y-2 z-10">
            <div className="bg-[#0D2137]/90 backdrop-blur-md border border-cyan-900/30 rounded-lg p-3 text-white">
              <div className="text-xs text-gray-400 mb-1">
                {language === 'es' ? 'Oportunidades Totales' : 'Total Opportunities'}
              </div>
              <div className="text-2xl font-bold text-cyan-400">47</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-[#0D2137] border-l border-cyan-900/30 overflow-y-auto">
          {selectedCountry ? (
            // Country Details Panel
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {language === 'es' ? 'Detalle de Oportunidad' : 'Opportunity Detail'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>

                <div className="bg-[#0A1929] rounded-lg p-4 border border-cyan-900/30 space-y-3">
                  <h3 className="text-lg font-semibold text-white">{selectedCountry}</h3>
                  
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
                  {language === 'es' ? 'Distancia Argentina - ' : 'Distance Argentina - '}{selectedCountry}
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
                <Button 
                  onClick={() => setShowLogisticsSimulator(true)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white justify-start"
                >
                  <Ship className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Simulador de Logística (Incoterm)' : 'Logistics Simulator (Incoterm)'}
                </Button>
                <Button 
                  onClick={() => setShowCostCalculator(true)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Calculadora de Costos' : 'Cost Calculator'}
                </Button>
              </div>

              {/* Regulatory Documentation Section */}
              {/* [FIX] Removed hardcoded check for 0201. Now shows for any product if requirements exist or if we want to show empty state */}
              <div className="bg-[#0A1929] rounded-lg p-4 border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                      📋 {language === 'es' ? 'Documentación Reglamentaria Requerida' : 'Required Regulatory Documentation'}
                    </h3>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      {code} → {selectedCountry}
                    </span>
                  </div>
                  


                  {requirements?.requiredDocuments && requirements.requiredDocuments.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {requirements.requiredDocuments.map((doc: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded border transition-all ${
                            doc.isSanction 
                              ? 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' 
                              : 'bg-[#0D2137] border-purple-900/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-xs font-bold flex items-center gap-1 ${doc.isSanction ? 'text-red-400' : 'text-white'}`}>
                              {doc.isSanction && <AlertCircle className="w-3 h-3" />}
                              {doc.name}
                            </h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded ${
                              doc.isSanction ? 'bg-red-600 text-white font-bold' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {doc.issuer}
                            </span>
                          </div>
                          <p className={`text-[10px] mb-2 ${doc.isSanction ? 'text-red-200 font-medium' : 'text-gray-400'}`}>
                            {doc.description || doc.importance || ''}
                          </p>
                          {(doc.requirements || doc.instruction) && (
                            <div className={`text-[10px] p-2 rounded ${doc.isSanction ? 'bg-red-900/40 text-red-100' : 'bg-gray-800/50 text-gray-400'}`}>
                                <span className="font-semibold">{doc.isSanction ? 'SANCIONA: ' : 'Requisito: '}</span>
                                <span>{doc.requirements || doc.instruction}</span>
                            </div>
                          )}
                          {doc.link && (
                            <a href={doc.link} target="_blank" rel="noopener noreferrer" className={`block mt-2 text-[10px] hover:underline ${doc.isSanction ? 'text-red-400' : 'text-cyan-400'}`}>
                              Ver fuente oficial →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs italic p-4 text-center">
                       {language === 'es' ? 'Cargando o sin requisitos específicos...' : 'Loading or no specific requirements...'}
                    </div>
                  )}

                  <Button 
                    onClick={() => {
                        import('jspdf').then(jsPDF => {
                            import('jspdf-autotable').then(autoTable => {
                                const doc = new jsPDF.default();
                                doc.text(`Requisitos: ${code} -> ${selectedCountry}`, 14, 20);
                                const rows = requirements?.requiredDocuments?.map((d: any) => [d.name, d.issuer, d.description]) || [];
                                autoTable.default(doc, {
                                    head: [['Documento', 'Emisor', 'Descripción']],
                                    body: rows,
                                    startY: 30
                                });
                                doc.save('requisitos.pdf');
                            });
                        });
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    📄 Descargar Guía PDF
                  </Button>
                </div>
            </div>
          ) : (
            // Lists Panel
            <div className="p-6 space-y-6">
              {/* Top 3 Buyers */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Top 3 Compradores' : 'Top 3 Buyers'}
                </h2>
                <div className="space-y-2">
                  {topBuyers.map((buyer) => (
                    <div
                      key={buyer.countryCode}
                      onClick={() => setSelectedCountry(buyer.country)}
                      className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30 hover:border-cyan-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-cyan-400">{buyer.rank}.</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white flex items-center gap-2">
                            <span>{buyer.flag}</span>
                            {buyer.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Countries */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Países Recomendados (Tratados)' : 'Recommended Countries (Treaties)'}
                </h2>
                <div className="space-y-2">
                  {recommendedCountries.map((country) => (
                    <div
                      key={country.countryCode}
                      onClick={() => setSelectedCountry(country.country)}
                      className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30 hover:border-cyan-500/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-cyan-400">{country.rank}.</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{country.country}</div>
                          <div className="text-xs text-gray-400">{country.treaty}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global News */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">
                  {language === 'es' ? 'Noticias Globales Relevantes' : 'Relevant Global News'}
                </h2>
                <div className="space-y-2">
                  {globalNews.map((news, idx) => (
                    <div key={idx} className="bg-[#0A1929] rounded-lg p-3 border border-cyan-900/30">
                      <div className="flex gap-2">
                        <div className={`w-12 h-12 ${news.image} rounded flex-shrink-0`} />
                        <div className="flex-1">
                          <div className="text-xs text-white font-medium">
                            {news.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Dialogs */}
      <LogisticsSimulator
        open={showLogisticsSimulator}
        onOpenChange={setShowLogisticsSimulator}
        origin={country === 'AR' ? 'Argentina' : country}
        destination={selectedCountry || 'China'}
        product={product || code}
      />
      
      <CostCalculatorDialog
        open={showCostCalculator}
        onOpenChange={setShowCostCalculator}
        origin={country === 'AR' ? 'Argentina' : country}
        destination={selectedCountry || 'China'}
        product={product || code}
      />
    </div>
  );
}