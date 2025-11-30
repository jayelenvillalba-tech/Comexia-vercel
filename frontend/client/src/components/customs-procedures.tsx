import { useState } from "react";
import { FileText, Download, Info, List, CheckCircle, Clock, DollarSign, AlertTriangle, Flag, BookOpen, Shield, Truck, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CustomsProcedure, CountryRequirement } from "@shared/schema";

export default function CustomsProcedures() {
  const { language, t } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState("DE");
  const [selectedProduct, setSelectedProduct] = useState("0901");
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"selection" | "details">("selection");

  const { data: procedures = [] } = useQuery<CustomsProcedure[]>({
    queryKey: ["/api/customs-procedures", selectedCountry],
    queryFn: async () => {
      const response = await fetch(`/api/customs-procedures?country=${selectedCountry}`);
      if (!response.ok) throw new Error("Failed to fetch customs procedures");
      return response.json();
    },
  });

  const { data: requirements } = useQuery<CountryRequirement>({
    queryKey: ["/api/country-requirements", selectedCountry, selectedProduct],
    queryFn: async () => {
      const response = await fetch(`/api/country-requirements/${selectedCountry}/${selectedProduct}`);
      if (!response.ok) throw new Error("Failed to fetch country requirements");
      return response.json();
    },
    enabled: viewMode === "details"
  });

  const countries = [
    { code: "DE", name: "Alemania", flag: "🇩🇪" },
    { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "JP", name: "Japón", flag: "🇯🇵" },
    { code: "CN", name: "China", flag: "🇨🇳" },
    { code: "CA", name: "Canadá", flag: "🇨🇦" },
    { code: "BR", name: "Brasil", flag: "🇧🇷" },
    { code: "AR", name: "Argentina", flag: "🇦🇷" },
    { code: "CL", name: "Chile", flag: "🇨🇱" },
  ];

  const products = [
    { code: "0901", name: "Café", description: "Café, incluso tostado o descafeinado" },
    { code: "1001", name: "Trigo", description: "Trigo y morcajo" },
    { code: "1005", name: "Maíz", description: "Maíz" },
    { code: "1507", name: "Aceite de Soja", description: "Aceite de soja y sus fracciones" },
    { code: "0201", name: "Carne Bovina", description: "Carne de bovino, fresca o refrigerada" },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "complex": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case "simple": return CheckCircle;
      case "moderate": return Clock;
      case "complex": return AlertTriangle;
      default: return Info;
    }
  };

  const handleProceedToDetails = () => {
    setViewMode("details");
  };

  const handleBackToSelection = () => {
    setViewMode("selection");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <FileText className="mr-3 text-blue-600 w-6 h-6" />
          {viewMode === "selection" ? "Procedimientos Aduaneros" : "Guía Detallada de Importación"}
        </h3>
        {viewMode === "details" && (
          <Button onClick={handleBackToSelection} variant="outline" size="sm">
            ← Volver a Selección
          </Button>
        )}
      </div>
      
      {viewMode === "selection" ? (
        <div className="space-y-6">
          {/* Country and Product Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Flag className="mr-2 w-5 h-5 text-blue-600" />
              Selecciona País de Destino y Producto
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País de Destino
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto (Código HS)
                </label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.code} value={product.code}>
                        {product.name} ({product.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleProceedToDetails}
              className="w-full mt-4 bg-kora-primary text-white"
              disabled={!selectedCountry || !selectedProduct}
            >
              Ver Procedimientos Detallados
            </Button>
          </div>
          
          {/* General Procedures Overview */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="mr-2 w-5 h-5 text-green-600" />
              Procedimientos Generales
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h5 className="font-medium text-gray-900 mb-1">Documentación</h5>
                <p className="text-sm text-gray-600">Preparar documentos requeridos</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h5 className="font-medium text-gray-900 mb-1">Declaración</h5>
                <p className="text-sm text-gray-600">Presentar declaración aduanera</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Truck className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h5 className="font-medium text-gray-900 mb-1">Despacho</h5>
                <p className="text-sm text-gray-600">Autorización y liberación</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Requirements View */
        requirements ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="standards">Normas</TabsTrigger>
              <TabsTrigger value="timeline">Cronograma</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Country & Product Overview */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">
                    Importación de {products.find(p => p.code === selectedProduct)?.name} a {countries.find(c => c.code === selectedCountry)?.name}
                  </h4>
                  <span className="text-2xl">{countries.find(c => c.code === selectedCountry)?.flag}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Tiempo Estimado</p>
                    <p className="font-bold text-green-800">{requirements.estimatedProcessingTime} días</p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Documentos</p>
                    <p className="font-bold text-blue-800">{requirements.requiredDocuments?.length || 0} requeridos</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <DollarSign className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-gray-600">Tasas Adicionales</p>
                    <p className="font-bold text-purple-800">
                      {requirements.additionalFees && typeof requirements.additionalFees === 'object' ? 
                        formatCurrency(Object.values(requirements.additionalFees).reduce((a, b) => Number(a) + Number(b), 0))
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick Checklist */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="mr-2 w-5 h-5 text-green-600" />
                  Lista de Verificación Rápida
                </h4>
                
                <div className="space-y-3">
                  {requirements.requiredDocuments?.slice(0, 4).map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">{doc}</span>
                    </div>
                  ))}
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Verificar normas técnicas aplicables</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Cumplir requisitos de etiquetado</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              {/* Required Documents */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="mr-2 w-5 h-5 text-red-600" />
                  Documentos Obligatorios
                </h4>
                
                <div className="space-y-3">
                  {requirements.requiredDocuments?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-gray-900">{doc}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Plantilla
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Labeling Requirements */}
              {requirements.labelingReqs && requirements.labelingReqs.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="mr-2 w-5 h-5 text-blue-600" />
                    Requisitos de Etiquetado
                  </h4>
                  
                  <div className="space-y-2">
                    {requirements.labelingReqs.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Packaging Requirements */}
              {requirements.packagingReqs && requirements.packagingReqs.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Package className="mr-2 w-5 h-5 text-orange-600" />
                    Requisitos de Empaque
                  </h4>
                  
                  <div className="space-y-2">
                    {requirements.packagingReqs.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="standards" className="space-y-6">
              {/* Technical Standards */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="mr-2 w-5 h-5 text-blue-600" />
                  Normas Técnicas
                </h4>
                
                <div className="space-y-3">
                  {requirements.technicalStandards?.map((standard, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{standard}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Phytosanitary Requirements */}
              {requirements.phytosanitaryReqs && requirements.phytosanitaryReqs.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="mr-2 w-5 h-5 text-green-600" />
                    Requisitos Fitosanitarios
                  </h4>
                  
                  <div className="space-y-2">
                    {requirements.phytosanitaryReqs.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-6">
              {/* Processing Timeline */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="mr-2 w-5 h-5 text-orange-600" />
                  Cronograma de Procesamiento
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Preparación de Documentos</h5>
                      <p className="text-sm text-gray-600">2-3 días hábiles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-green-600">2</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Presentación Aduanera</h5>
                      <p className="text-sm text-gray-600">1 día hábil</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-yellow-600">3</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Inspección y Verificación</h5>
                      <p className="text-sm text-gray-600">{Math.ceil((requirements.estimatedProcessingTime || 7) * 0.6)} días hábiles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">4</span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">Liberación de Mercancía</h5>
                      <p className="text-sm text-gray-600">1-2 días hábiles</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Fees Breakdown */}
              {requirements.additionalFees && typeof requirements.additionalFees === 'object' && (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="mr-2 w-5 h-5 text-green-600" />
                    Desglose de Tasas Adicionales
                  </h4>
                  
                  <div className="space-y-3">
                    {Object.entries(requirements.additionalFees).map(([fee, amount]) => (
                      <div key={fee} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{fee.replace('_', ' ')}</span>
                        <span className="font-medium text-gray-900">{formatCurrency(Number(amount))}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Total Estimado:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(Object.values(requirements.additionalFees).reduce((a, b) => Number(a) + Number(b), 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No hay requisitos disponibles para esta combinación de país y producto</p>
          </div>
        )
      )}
    </div>
  );
}
