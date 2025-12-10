import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Ship, Plane, Truck, DollarSign, Clock, Package, TrendingUp, Lock } from 'lucide-react';

interface LogisticsSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  origin: string;
  destination: string;
  product: string;
}

export default function LogisticsSimulator({ open, onOpenChange, origin, destination, product }: LogisticsSimulatorProps) {
  const { language } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock logistics data
  const routes = [
    {
      id: 'sea-truck',
      name: language === 'es' ? 'Marítimo + Terrestre' : 'Sea + Land',
      modes: [
        { icon: Ship, label: language === 'es' ? 'Barco' : 'Ship', duration: '25-30 días' },
        { icon: Truck, label: language === 'es' ? 'Camión' : 'Truck', duration: '2-3 días' }
      ],
      totalDuration: '27-33 días',
      cost: '$2,500 - $3,200',
      incoterm: 'CIF',
      recommended: true,
      details: {
        port: 'Puerto de Buenos Aires → Puerto de Shanghai',
        insurance: language === 'es' ? 'Incluido' : 'Included',
        customs: language === 'es' ? 'Destino' : 'Destination',
        risk: language === 'es' ? 'Bajo' : 'Low'
      }
    },
    {
      id: 'air-truck',
      name: language === 'es' ? 'Aéreo + Terrestre' : 'Air + Land',
      modes: [
        { icon: Plane, label: language === 'es' ? 'Avión' : 'Plane', duration: '5-7 días' },
        { icon: Truck, label: language === 'es' ? 'Camión' : 'Truck', duration: '1-2 días' }
      ],
      totalDuration: '6-9 días',
      cost: '$8,500 - $12,000',
      incoterm: 'FOB',
      recommended: false,
      details: {
        port: 'Aeropuerto Ezeiza → Aeropuerto Pudong',
        insurance: language === 'es' ? 'No incluido' : 'Not included',
        customs: language === 'es' ? 'Origen' : 'Origin',
        risk: language === 'es' ? 'Medio' : 'Medium'
      }
    },
    {
      id: 'sea-only',
      name: language === 'es' ? 'Solo Marítimo (Puerto a Puerto)' : 'Sea Only (Port to Port)',
      modes: [
        { icon: Ship, label: language === 'es' ? 'Barco' : 'Ship', duration: '25-30 días' }
      ],
      totalDuration: '25-30 días',
      cost: '$1,800 - $2,400',
      incoterm: 'FOB',
      recommended: false,
      details: {
        port: 'Puerto de Buenos Aires → Puerto de Shanghai',
        insurance: language === 'es' ? 'No incluido' : 'Not included',
        customs: language === 'es' ? 'Origen' : 'Origin',
        risk: language === 'es' ? 'Alto' : 'High'
      }
    }
  ];

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
    if (selectedRoute && selectedRoute !== routeId) {
      setTimeout(() => setShowLoginModal(true), 1000);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl bg-[#0D2137] border-cyan-900/30 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              {language === 'es' ? 'Simulador de Logística (Incoterm)' : 'Logistics Simulator (Incoterm)'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {origin} → {destination} | {product}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Routes Comparison */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                {language === 'es' ? 'Opciones de Transporte' : 'Transport Options'}
              </h3>
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
                        {route.modes.map((mode, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <mode.icon className="w-5 h-5 text-cyan-400" />
                            {idx < route.modes.length - 1 && (
                              <span className="text-gray-500">→</span>
                            )}
                          </div>
                        ))}
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

      {/* Login/Register Modal for Demo */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="bg-[#0D2137] border-cyan-900/30 text-white">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-cyan-600/20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-cyan-400">
              {language === 'es' ? '¡Desbloquea Todas las Funciones!' : 'Unlock All Features!'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              {language === 'es'
                ? 'Has alcanzado el límite de la versión demo. Regístrate para acceder a todas las herramientas de simulación.'
                : 'You\'ve reached the demo version limit. Register to access all simulation tools.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <Button 
              onClick={() => {
                sessionStorage.setItem('searchContext', JSON.stringify({
                  product,
                  origin,
                  destination,
                  operation: origin.includes('Argentina') ? 'export' : 'import',
                  timestamp: Date.now()
                }));
                window.location.href = '/marketplace';
              }}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-6 text-lg font-semibold"
            >
              {language === 'es' ? 'Crear Cuenta Gratis' : 'Create Free Account'}
            </Button>
            <Button 
              onClick={() => {
                sessionStorage.setItem('searchContext', JSON.stringify({
                  product,
                  origin,
                  destination,
                  operation: origin.includes('Argentina') ? 'export' : 'import',
                  timestamp: Date.now()
                }));
                window.location.href = '/marketplace';
              }}
              variant="outline" 
              className="w-full border-cyan-900/30 text-cyan-400 hover:bg-cyan-900/20"
            >
              {language === 'es' ? 'Iniciar Sesión' : 'Login'}
            </Button>
            <p className="text-center text-xs text-gray-500">
              {language === 'es'
                ? '✓ Acceso ilimitado a simuladores  ✓ Comparaciones detalladas  ✓ Exportar reportes'
                : '✓ Unlimited simulator access  ✓ Detailed comparisons  ✓ Export reports'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
