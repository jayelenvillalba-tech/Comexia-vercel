import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Ship, Plane, Truck, DollarSign, Clock, Package, TrendingUp, Lock, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface LogisticsSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  origin: string;
  destination: string;
  product: string;
}

interface RouteOption {
  id: string;
  name: string;
  modes: { icon: string, label: string, duration: string }[];
  totalDuration: string;
  cost: string;
  incoterm: string;
  recommended: boolean;
  details: {
    port: string;
    insurance: string;
    customs: string;
    risk: string;
  };
}

export default function LogisticsSimulator({ open, onOpenChange, origin, destination, product }: LogisticsSimulatorProps) {
  const { language } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Dynamic Data Fetching
  const { data, isLoading, isError } = useQuery<{data: RouteOption[]}>({
     queryKey: ['logistics', origin, destination, product],
     queryFn: async () => {
        if (!origin || !destination) return { data: [] };
        const res = await fetch(`/api/logistics/estimate?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&product=${encodeURIComponent(product)}`);
        if (!res.ok) throw new Error('API Error');
        return res.json();
     },
     enabled: open && !!origin && !!destination
  });

  const routes = data?.data || [];

  const icons: Record<string, any> = { ship: Ship, plane: Plane, truck: Truck };

  const incotermComparison = [
    {
      term: 'CIF',
      name: 'Cost, Insurance and Freight',
      seller: [
        language === 'es' ? 'Transporte hasta puerto destino' : 'Transport to destination port',
        language === 'es' ? 'Seguro de carga' : 'Cargo insurance',
        language === 'es' ? 'Despacho de exportación' : 'Export clearance'
      ],
      buyer: [
        language === 'es' ? 'Despacho de importación' : 'Import clearance',
        language === 'es' ? 'Transporte desde puerto' : 'Transport from port',
        language === 'es' ? 'Aranceles e impuestos' : 'Duties and taxes'
      ],
      recommended: true
    },
    {
      term: 'FOB',
      name: 'Free On Board',
      seller: [
        language === 'es' ? 'Transporte hasta puerto origen' : 'Transport to origin port',
        language === 'es' ? 'Despacho de exportación' : 'Export clearance',
        language === 'es' ? 'Carga en el barco' : 'Loading on ship'
      ],
      buyer: [
        language === 'es' ? 'Transporte marítimo' : 'Sea freight',
        language === 'es' ? 'Seguro de carga' : 'Cargo insurance',
        language === 'es' ? 'Despacho de importación' : 'Import clearance',
        language === 'es' ? 'Transporte desde puerto' : 'Transport from port'
      ],
      recommended: false
    }
  ];

  const handleSelectRoute = (routeId: string) => {
    setSelectedRoute(routeId);
    // Show login modal after viewing 2 routes (demo limitation)
    // if (selectedRoute && selectedRoute !== routeId) {
    //   setTimeout(() => setShowLoginModal(true), 1000);
    // }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl bg-[#0D2137] border-cyan-900/30 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              {language === 'es' ? 'Simulador de Logística (Real-Time)' : 'Logistics Simulator (Real-Time)'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {origin} → {destination} | {product}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Routes Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                {language === 'es' ? 'Opciones de Transporte' : 'Transport Options'}
                {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-cyan-400"/>}
              </h3>
              
              {isLoading ? (
                  <div className="text-center py-10 text-gray-500">Calculando mejores rutas...</div>
              ) : routes.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No routes found or check inputs.</div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {routes.map((route) => (
                  <Card
                    key={route.id}
                    className={`cursor-pointer transition-all ${
                      selectedRoute === route.id
                        ? 'bg-cyan-900/30 border-cyan-500'
                        : 'bg-[#0A1929] border-cyan-900/30 hover:border-cyan-500/50'
                    }`}
                    onClick={() => handleSelectRoute(route.id)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {route.recommended && (
                        <Badge className="bg-green-600 text-white">
                          {language === 'es' ? 'Recomendado' : 'Recommended'}
                        </Badge>
                      )}
                      <h4 className="font-semibold text-white">{route.name}</h4>
                      
                      {/* Transport modes */}
                      <div className="flex items-center gap-2">
                        {route.modes.map((mode, idx) => {
                          const Icon = icons[mode.icon] || Ship;
                          return (
                          <div key={idx} className="flex items-center gap-1">
                            <Icon className="w-5 h-5 text-cyan-400" />
                            {idx < route.modes.length - 1 && (
                              <span className="text-gray-500">→</span>
                            )}
                          </div>
                        )})}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4" />
                          {route.totalDuration}
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <DollarSign className="w-4 h-4" />
                          {route.cost}
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400 font-semibold">{route.incoterm}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              )}
            </div>

            {/* Selected Route Details */}
            {selectedRoute && (
              <div className="bg-[#0A1929] rounded-lg p-6 border border-cyan-900/30">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'es' ? 'Detalles de la Ruta' : 'Route Details'}
                </h3>
                {routes.find(r => r.id === selectedRoute)?.details && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">{language === 'es' ? 'Ruta:' : 'Route:'}</span>
                      <p className="text-white">{routes.find(r => r.id === selectedRoute)?.details.port}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{language === 'es' ? 'Seguro:' : 'Insurance:'}</span>
                      <p className="text-white">{routes.find(r => r.id === selectedRoute)?.details.insurance}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{language === 'es' ? 'Despacho:' : 'Customs:'}</span>
                      <p className="text-white">{routes.find(r => r.id === selectedRoute)?.details.customs}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">{language === 'es' ? 'Riesgo:' : 'Risk:'}</span>
                      <p className="text-white">{routes.find(r => r.id === selectedRoute)?.details.risk}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Incoterm Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'es' ? 'Comparación de Incoterms' : 'Incoterm Comparison'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incotermComparison.map((incoterm) => (
                  <Card key={incoterm.term} className="bg-[#0A1929] border-cyan-900/30">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xl text-cyan-400">{incoterm.term}</h4>
                        {incoterm.recommended && (
                          <Badge className="bg-green-600 text-white text-xs">
                            {language === 'es' ? 'Recomendado' : 'Recommended'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{incoterm.name}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">
                            {language === 'es' ? 'Vendedor paga:' : 'Seller pays:'}
                          </p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {incoterm.seller.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white mb-1">
                            {language === 'es' ? 'Comprador paga:' : 'Buyer pays:'}
                          </p>
                          <ul className="text-xs text-gray-300 space-y-1">
                            {incoterm.buyer.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
