import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import { DollarSign, TrendingUp, Package, AlertCircle, Lock, Calculator } from 'lucide-react';

interface CostCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  origin: string;
  destination: string;
  product: string;
}

export default function CostCalculatorDialog({ open, onOpenChange, origin, destination, product }: CostCalculatorDialogProps) {
  const { language } = useLanguage();
  const [weight, setWeight] = useState('1000');
  const [volume, setVolume] = useState('10');
  const [value, setValue] = useState('50000');
  const [calculated, setCalculated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCalculate = () => {
    setCalculated(true);
    // Show login modal after first calculation (demo limitation)
    setTimeout(() => setShowLoginModal(true), 2000);
  };

  // Mock cost breakdown
  const costBreakdown = {
    cif: {
      freight: 2800,
      insurance: 250,
      customs: 1200,
      duties: 4500,
      localTransport: 450,
      documentation: 180,
      total: 9380
    },
    fob: {
      freight: 0,
      insurance: 0,
      customs: 800,
      duties: 4500,
      localTransport: 650,
      documentation: 120,
      shipping: 3200,
      total: 9270
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl bg-[#0D2137] border-cyan-900/30 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              {language === 'es' ? 'Calculadora de Costos' : 'Cost Calculator'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {origin} → {destination} | {product}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Input Section */}
            <Card className="bg-[#0A1929] border-cyan-900/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {language === 'es' ? 'Datos del Envío' : 'Shipment Data'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-400 text-sm">
                      {language === 'es' ? 'Peso (kg)' : 'Weight (kg)'}
                    </Label>
                    <Input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-[#0D2137] border-cyan-900/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">
                      {language === 'es' ? 'Volumen (m³)' : 'Volume (m³)'}
                    </Label>
                    <Input
                      type="number"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="bg-[#0D2137] border-cyan-900/30 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">
                      {language === 'es' ? 'Valor FOB (USD)' : 'FOB Value (USD)'}
                    </Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="bg-[#0D2137] border-cyan-900/30 text-white"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCalculate}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Calcular Costos' : 'Calculate Costs'}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            {calculated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CIF Breakdown */}
                <Card className="bg-[#0A1929] border-cyan-500">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-cyan-400">CIF</h3>
                      <Badge className="bg-green-600 text-white">
                        {language === 'es' ? 'Recomendado' : 'Recommended'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">Cost, Insurance and Freight</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Flete marítimo' : 'Sea freight'}:</span>
                        <span className="text-white">${costBreakdown.cif.freight.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Seguro' : 'Insurance'}:</span>
                        <span className="text-white">${costBreakdown.cif.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Despacho aduanero' : 'Customs clearance'}:</span>
                        <span className="text-white">${costBreakdown.cif.customs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Aranceles' : 'Duties'}:</span>
                        <span className="text-white">${costBreakdown.cif.duties.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Transporte local' : 'Local transport'}:</span>
                        <span className="text-white">${costBreakdown.cif.localTransport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Documentación' : 'Documentation'}:</span>
                        <span className="text-white">${costBreakdown.cif.documentation.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-cyan-900/30 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-cyan-400">TOTAL:</span>
                          <span className="text-cyan-400">${costBreakdown.cif.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-green-400">
                        {language === 'es'
                          ? '✓ Vendedor asume riesgo hasta destino'
                          : '✓ Seller assumes risk to destination'}
                      </p>
                      <p className="text-xs text-green-400">
                        {language === 'es'
                          ? '✓ Seguro incluido'
                          : '✓ Insurance included'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* FOB Breakdown */}
                <Card className="bg-[#0A1929] border-cyan-900/30">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white">FOB</h3>
                    <p className="text-xs text-gray-400">Free On Board</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Flete marítimo' : 'Sea freight'}:</span>
                        <span className="text-white">${costBreakdown.fob.shipping.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Seguro (comprador)' : 'Insurance (buyer)'}:</span>
                        <span className="text-white">$0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Despacho aduanero' : 'Customs clearance'}:</span>
                        <span className="text-white">${costBreakdown.fob.customs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Aranceles' : 'Duties'}:</span>
                        <span className="text-white">${costBreakdown.fob.duties.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Transporte local' : 'Local transport'}:</span>
                        <span className="text-white">${costBreakdown.fob.localTransport.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">{language === 'es' ? 'Documentación' : 'Documentation'}:</span>
                        <span className="text-white">${costBreakdown.fob.documentation.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-cyan-900/30 pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-white">TOTAL:</span>
                          <span className="text-white">${costBreakdown.fob.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 mt-4">
                      <p className="text-xs text-yellow-400">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        {language === 'es'
                          ? 'Comprador asume más riesgo'
                          : 'Buyer assumes more risk'}
                      </p>
                      <p className="text-xs text-yellow-400">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        {language === 'es'
                          ? 'Seguro no incluido'
                          : 'Insurance not included'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Comparison Summary */}
            {calculated && (
              <Card className="bg-cyan-900/20 border-cyan-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {language === 'es' ? 'Resumen de Comparación' : 'Comparison Summary'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">{language === 'es' ? 'Diferencia de costo' : 'Cost difference'}:</p>
                      <p className="text-white font-semibold">
                        ${Math.abs(costBreakdown.cif.total - costBreakdown.fob.total).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">{language === 'es' ? 'Opción más económica' : 'Most economical'}:</p>
                      <p className="text-cyan-400 font-semibold">
                        {costBreakdown.fob.total < costBreakdown.cif.total ? 'FOB' : 'CIF'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">{language === 'es' ? 'Recomendación' : 'Recommendation'}:</p>
                      <p className="text-green-400 font-semibold">CIF</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
              {language === 'es' ? '¡Desbloquea el Análisis Completo!' : 'Unlock Full Analysis!'}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400">
              {language === 'es'
                ? 'Regístrate para guardar tus cálculos, comparar múltiples rutas y exportar reportes detallados.'
                : 'Register to save your calculations, compare multiple routes and export detailed reports.'}
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
                ? '✓ Guardar cálculos  ✓ Comparar rutas  ✓ Exportar PDF  ✓ Alertas de precios'
                : '✓ Save calculations  ✓ Compare routes  ✓ Export PDF  ✓ Price alerts'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
