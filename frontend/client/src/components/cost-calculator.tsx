import { useState } from "react";
import { Calculator, ArrowRight, Info, Download, Ship, DollarSign, Shield, Share2, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { exportCostAnalysisPDF } from "@/lib/pdf-export";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CostBreakdown {
  fob: number;
  freight: number;
  insurance: number;
  cif: number;
  tariff: number;
  vat: number;
  statistics: number;
  clearance: number;
  // Enhanced cost breakdown
  portHandling: number;
  documentation: number;
  inspection: number;
  storage: number;
  localTransport: number;
  brokerFees: number;
  bankCharges: number;
  contingency: number;
  total: number;
  perUnit: number;
  // Cost analysis
  costAnalysis: {
    logisticsCosts: number;
    taxesAndDuties: number;
    regulatoryCosts: number;
    serviceFees: number;
  };
  // Savings opportunities
  savingsOpportunities?: {
    tradeAgreementSavings: number;
    volumeDiscounts: number;
    alternativeRoutes: number;
  };
}

export default function CostCalculator() {
  // const { language } = useLanguage(); // Not currently used
  const [fobValue, setFobValue] = useState("");
  const [weight, setWeight] = useState("");
  const [volume, setVolume] = useState("");
  const [destination, setDestination] = useState("");
  const [origin, setOrigin] = useState("");
  const [transport, setTransport] = useState("maritime");
  const [hsCode, setHsCode] = useState("0901");
  const [incoterm, setIncoterm] = useState("FOB");
  const [urgency, setUrgency] = useState("standard");
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculate-costs", data);
      return response.json();
    },
  });

  const handleCalculate = () => {
    if (!fobValue || !weight || !destination || !origin) return;
    
    calculateMutation.mutate({
      fobValue: parseFloat(fobValue),
      weight: parseFloat(weight),
      volume: volume ? parseFloat(volume) : 0,
      destination,
      origin,
      transport,
      hsCode,
      incoterm,
      urgency,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const breakdown = calculateMutation.data as CostBreakdown | undefined;

  const destinations = [
    { value: "buenos-aires", label: "Buenos Aires, Argentina", country: "AR" },
    { value: "sao-paulo", label: "São Paulo, Brasil", country: "BR" },
    { value: "valparaiso", label: "Valparaíso, Chile", country: "CL" },
    { value: "lima", label: "Lima, Perú", country: "PE" },
    { value: "hamburg", label: "Hamburgo, Alemania", country: "DE" },
    { value: "los-angeles", label: "Los Ángeles, EE.UU.", country: "US" },
    { value: "rotterdam", label: "Rotterdam, Holanda", country: "NL" },
  ];

  const origins = [
    { value: "santos", label: "Santos, Brasil" },
    { value: "buenos-aires", label: "Buenos Aires, Argentina" },
    { value: "montevideo", label: "Montevideo, Uruguay" },
    { value: "valparaiso", label: "Valparaíso, Chile" },
  ];

  const hsProducts = [
    { value: "0901", label: "Café (0901)" },
    { value: "1001", label: "Trigo (1001)" },
    { value: "1005", label: "Maíz (1005)" },
    { value: "1507", label: "Aceite de Soja (1507)" },
    { value: "0201", label: "Carne Bovina (0201)" },
  ];

  const incoterms = [
    { value: "FOB", label: "FOB - Free On Board" },
    { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
    { value: "EXW", label: "EXW - Ex Works" },
    { value: "FCA", label: "FCA - Free Carrier" },
  ];

  const getChartData = (data: CostBreakdown) => [
    { name: 'FOB', value: data.fob, color: '#3b82f6' },
    { name: 'Logística', value: data.costAnalysis.logisticsCosts, color: '#f59e0b' },
    { name: 'Impuestos', value: data.costAnalysis.taxesAndDuties, color: '#ef4444' },
    { name: 'Servicios', value: data.costAnalysis.serviceFees, color: '#10b981' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Calculator className="mr-3 text-purple-600 w-6 h-6" />
        Simulador de Costos de Importación/Exportación
      </h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="optimization">Optimización</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enhanced Input Form */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="mr-2 w-5 h-5 text-blue-600" />
                  Información del Producto
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Producto (Código HS)
                    </label>
                    <Select value={hsCode} onValueChange={setHsCode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {hsProducts.map((product) => (
                          <SelectItem key={product.value} value={product.value}>
                            {product.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor {incoterm} (USD)
                      </label>
                      <Input
                        type="number"
                        placeholder="10,000"
                        value={fobValue}
                        onChange={(e) => setFobValue(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Términos
                      </label>
                      <Select value={incoterm} onValueChange={setIncoterm}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {incoterms.map((term) => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peso (kg)
                      </label>
                      <Input
                        type="number"
                        placeholder="1,000"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volumen (m³)
                      </label>
                      <Input
                        type="number"
                        placeholder="2.5"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Logistics Information */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2 w-5 h-5 text-orange-600" />
                  Información Logística
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puerto de Origen
                    </label>
                    <Select value={origin} onValueChange={setOrigin}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar origen" />
                      </SelectTrigger>
                      <SelectContent>
                        {origins.map((orig) => (
                          <SelectItem key={orig.value} value={orig.value}>
                            {orig.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Puerto de Destino
                    </label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar destino" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest.value} value={dest.value}>
                            {dest.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Transporte
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={transport === "maritime" ? "default" : "outline"}
                        onClick={() => setTransport("maritime")}
                        className={`flex items-center justify-center space-x-2 ${transport === "maritime" ? "bg-kora-primary text-white" : ""}`}
                      >
                        <Ship className="w-4 h-4" />
                        <span>Marítimo</span>
                      </Button>
                      <Button
                        variant={transport === "air" ? "default" : "outline"}
                        onClick={() => setTransport("air")}
                        className={`flex items-center justify-center space-x-2 ${transport === "air" ? "bg-kora-primary text-white" : ""}`}
                      >
                        <Plane className="w-4 h-4" />
                        <span>Aéreo</span>
                      </Button>
                      <Button
                        variant={transport === "road" ? "default" : "outline"}
                        onClick={() => setTransport("road")}
                        className={`flex items-center justify-center space-x-2 ${transport === "road" ? "bg-kora-primary text-white" : ""}`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>Terrestre</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgencia
                    </label>
                    <Select value={urgency} onValueChange={setUrgency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Estándar (30-45 días)</SelectItem>
                        <SelectItem value="express">Express (15-20 días)</SelectItem>
                        <SelectItem value="urgent">Urgente (7-10 días)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCalculate}
                disabled={calculateMutation.isPending}
                className="w-full bg-kora-primary text-white h-12 text-lg"
              >
                {calculateMutation.isPending ? "Calculando..." : "Calcular Costos Totales"}
              </Button>
            </div>
            
            {/* Enhanced Cost Breakdown */}
            <div className="space-y-4">
              {breakdown ? (
                <div>
                  {/* Cost Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-4">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">
                        {formatCurrency(breakdown.total)}
                      </h4>
                      <p className="text-gray-600">Costo Total de Importación</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatCurrency(breakdown.perUnit)} por kg
                      </p>
                      
                      {/* Export PDF Button */}
                      <Button
                        onClick={() => {
                          const hsProducts = [
                            { value: "0901", label: "Café" },
                            { value: "1001", label: "Trigo" },
                            { value: "1005", label: "Maíz" },
                            { value: "1201", label: "Soja" },
                            { value: "0201", label: "Carne Bovina" },
                            { value: "8517", label: "Smartphones" },
                            { value: "8471", label: "Laptops" },
                            { value: "2204", label: "Vino" }
                          ];
                          const product = hsProducts.find(p => p.value === hsCode);
                          
                          exportCostAnalysisPDF(breakdown, {
                            hsCode,
                            productName: product?.label || hsCode,
                            origin,
                            destination,
                            weight: parseFloat(weight),
                            fobValue: parseFloat(fobValue)
                          });
                        }}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Análisis PDF
                      </Button>
                      
                      {/* Share in Chat Button */}
                      <Button
                        onClick={async () => {
                          // For MVP, we'll just pick the first conversation or create a new one
                          // In a real app, we'd show a conversation selector modal
                          try {
                            const userId = "mock-user-1";
                            // Get conversations
                            const response = await fetch(`/api/chat/conversations?userId=${userId}`);
                            const conversations = await response.json();
                            
                            let targetConversationId;
                            
                            if (conversations.length > 0) {
                              targetConversationId = conversations[0].id;
                            } else {
                              alert("No active conversations found. Please start a chat first.");
                              return;
                            }
                            
                            const hsProducts = [
                              { value: "0901", label: "Café" },
                              { value: "1001", label: "Trigo" },
                              { value: "1005", label: "Maíz" },
                              { value: "1201", label: "Soja" },
                              { value: "0201", label: "Carne Bovina" },
                              { value: "8517", label: "Smartphones" },
                              { value: "8471", label: "Laptops" },
                              { value: "2204", label: "Vino" }
                            ];
                            const product = hsProducts.find(p => p.value === hsCode);
                            
                            const quoteData = {
                              productName: product?.label || `HS ${hsCode}`,
                              totalCost: breakdown.totalCost,
                              currency: "USD",
                              incoterm: "FOB", // Simplified
                              breakdown: {
                                fob: parseFloat(fobValue),
                                freight: breakdown.costAnalysis?.logisticsCosts || 0,
                                taxes: breakdown.costAnalysis?.taxCosts || 0
                              }
                            };
                            
                            await fetch(`/api/chat/conversations/${targetConversationId}/messages`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                userId,
                                content: JSON.stringify(quoteData),
                                messageType: 'quote'
                              })
                            });
                            
                            alert("Cotización enviada al chat!");
                            // navigate(`/chat/${targetConversationId}`);
                          } catch (error) {
                            console.error("Error sharing quote:", error);
                            alert("Error al compartir cotización");
                          }
                        }}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white ml-2"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Compartir en Chat
                      </Button>
                    </div>
                  </div>
                  
                  {/* Cost Categories */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Ship className="mr-2 w-4 h-4 text-blue-600" />
                        Logística
                      </h5>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(breakdown.costAnalysis?.logisticsCosts || 0)}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <DollarSign className="mr-2 w-4 h-4 text-red-600" />
                        Impuestos
                      </h5>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(breakdown.costAnalysis?.taxesAndDuties || 0)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Detailed Breakdown */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">Desglose Detallado</h4>
                    
                    <div className="space-y-2 text-sm">
                      {/* Base Costs */}
                      <div className="pb-2 border-b border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Valor {incoterm}:</span>
                          <span className="font-medium">{formatCurrency(breakdown.fob)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flete Internacional:</span>
                          <span className="font-medium">{formatCurrency(breakdown.freight)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seguro:</span>
                          <span className="font-medium">{formatCurrency(breakdown.insurance)}</span>
                        </div>
                      </div>
                      
                      {/* CIF Value */}
                      <div className="flex justify-between py-2 bg-blue-50 px-2 rounded">
                        <span className="font-medium text-blue-900">Valor CIF:</span>
                        <span className="font-bold text-blue-900">{formatCurrency(breakdown.cif)}</span>
                      </div>
                      
                      {/* Taxes and Duties */}
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Arancel de Importación:</span>
                          <span className="font-medium text-red-600">{formatCurrency(breakdown.tariff)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IVA (21%):</span>
                          <span className="font-medium text-red-600">{formatCurrency(breakdown.vat)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tasa Estadística:</span>
                          <span className="font-medium">{formatCurrency(breakdown.statistics)}</span>
                        </div>
                      </div>
                      
                      {/* Services and Fees */}
                      <div className="pt-2 border-t border-gray-100 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Despacho Aduanero:</span>
                          <span className="font-medium">{formatCurrency(breakdown.clearance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manipuleo Portuario:</span>
                          <span className="font-medium">{formatCurrency(breakdown.portHandling || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Documentación:</span>
                          <span className="font-medium">{formatCurrency(breakdown.documentation || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transporte Local:</span>
                          <span className="font-medium">{formatCurrency(breakdown.localTransport || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h4 className="font-medium text-gray-900 mb-2">Calculadora Lista</h4>
                  <p className="text-gray-600">Completa la información para obtener una cotización detallada</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          {breakdown ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cost Analysis Chart */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChartIcon className="mr-2 w-5 h-5 text-purple-600" />
                  Distribución de Costos
                </h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getChartData(breakdown)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getChartData(breakdown).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Risk Analysis */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="mr-2 w-5 h-5 text-yellow-600" />
                  Análisis de Riesgos
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Volatilidad de Precios:</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Media</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Riesgo Cambiario:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Bajo</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Complejidad Aduanera:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Estándar</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tiempo de Tránsito:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Predecible</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">Realiza un cálculo primero para ver el análisis detallado</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="optimization" className="space-y-6">
          {breakdown ? (
            <div className="space-y-6">
              {/* Savings Opportunities */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="mr-2 w-5 h-5 text-green-600" />
                  Oportunidades de Ahorro Identificadas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Acuerdos Comerciales</h5>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(breakdown.savingsOpportunities?.tradeAgreementSavings || 850)}
                    </p>
                    <p className="text-sm text-gray-600">Usando preferencias Mercosur</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Descuentos por Volumen</h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(breakdown.savingsOpportunities?.volumeDiscounts || 1200)}
                    </p>
                    <p className="text-sm text-gray-600">Consolide envíos similares</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Rutas Alternativas</h5>
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(breakdown.savingsOpportunities?.alternativeRoutes || 420)}
                    </p>
                    <p className="text-sm text-gray-600">Vía puerto alternativo</p>
                  </div>
                </div>
              </div>
              
              {/* Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Recomendaciones</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Certificado de Origen Mercosur</p>
                        <p className="text-sm text-gray-600">Reduzca aranceles del 15.2% al 0%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Consolide Envíos</p>
                        <p className="text-sm text-gray-600">Combine con otros productos para FCL</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Planificación Anual</p>
                        <p className="text-sm text-gray-600">Negocie tarifas preferenciales</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Alertas</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Cambio de Temporada</p>
                        <p className="text-sm text-gray-600">Fletes marítimos aumentan 15% en Q4</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Regulación Fitosanitaria</p>
                        <p className="text-sm text-gray-600">Nuevos requisitos desde enero 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600">Realiza un cálculo primero para ver las oportunidades de optimización</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
