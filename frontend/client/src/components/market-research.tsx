import { useState } from "react";
import { TrendingUp, Package, DollarSign, BarChart3, Building, MapPin, Star, Shield, Truck, AlertTriangle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { CountryOpportunity, CountryRequirement } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { motion } from "framer-motion";

export default function MarketResearch() {
  const { t } = useLanguage();
  const [hsCode, setHsCode] = useState("0901"); // Default to coffee
  const [selectedCountry, setSelectedCountry] = useState<CountryOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<"ranking" | "details">("ranking");

  const { data: opportunities = [] } = useQuery<CountryOpportunity[]>({
    queryKey: ["/api/country-opportunities", hsCode],
    queryFn: async () => {
      const response = await fetch(`/api/country-opportunities/${hsCode}`);
      if (!response.ok) throw new Error("Failed to fetch country opportunities");
      return response.json();
    },
  });

  const { data: requirements } = useQuery<CountryRequirement>({
    queryKey: ["/api/country-requirements", selectedCountry?.countryCode, hsCode],
    queryFn: async () => {
      if (!selectedCountry) return null;
      const response = await fetch(`/api/country-requirements/${selectedCountry.countryCode}/${hsCode}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!selectedCountry,
  });

  const hsProducts = [
    { value: "0201", label: "Carne Bovina (0201)" },
    { value: "0901", label: "Café (0901)" },
    { value: "1001", label: "Trigo (1001)" },
    { value: "1005", label: "Maíz (1005)" },
    { value: "8471", label: "Máquinas de procesamiento de datos (8471)" },
    { value: "8703", label: "Automóviles (8703)" },
  ];

  // [FRONTEND MOCK FALLBACK]
  const US_BEEF_MOCK = {
      id: 'mock-frontend-001',
      countryCode: 'US',
      hsCode: '0201',
      requiredDocuments: [
          {
            name: "Certificado Sanitario Veterinario (C.S.V.)",
            issuer: "SENASA (Argentina)",
            description: "Certifica que la carne proviene de animales sanos, con inspección ante/post mortem.",
            requirements: "Establecimiento autorizado, Vacunación, Trazabilidad completa.",
            link: "https://www.argentina.gob.ar/senasa"
          },
          {
             name: "FSIS Form 9060-5",
             issuer: "USDA / FSIS (EE.UU.)",
             description: "Certificado de Salubridad de Exportación de Carnes y Aves.",
             requirements: "Requiere inspección oficial en puerto de entrada.",
             link: "https://www.fsis.usda.gov/"
          },
          {
             name: "Etiquetado Aprobado (Label Approval)",
             issuer: "USDA / FSIS",
             description: "Aprobación de etiquetas genéricas o específicas.",
             requirements: "Incluir país de origen, establecimiento, peso neto.",
             link: "https://www.fsis.usda.gov/"
          }
      ]
  };

  const getScoreColor = (score: string) => {
    const numScore = parseFloat(score);
    if (numScore >= 90) return "text-green-600 bg-green-50";
    if (numScore >= 80) return "text-blue-600 bg-blue-50";
    if (numScore >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCompetitionIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "high": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const handleCountrySelect = (opportunity: CountryOpportunity) => {
    console.log('🌍 País seleccionado:', opportunity);
    console.log('📋 Código país:', opportunity.countryCode);
    console.log('📦 HS Code actual:', hsCode);
    setSelectedCountry(opportunity);
    setViewMode("details");
  };

  const handleBackToRanking = () => {
    setViewMode("ranking");
    setSelectedCountry(null);
  };

  // Mock data for charts
  const trendData = [
    { year: '2020', value: 100 },
    { year: '2021', value: 120 },
    { year: '2022', value: 115 },
    { year: '2023', value: 140 },
    { year: '2024', value: 160 },
    { year: '2025', value: 180 },
  ];

  const getRadarData = (country: CountryOpportunity) => [
    { subject: 'Demanda', A: parseFloat(country.demandScore || "0"), fullMark: 100 },
    { subject: 'Aranceles', A: parseFloat(country.tariffScore || "0"), fullMark: 100 },
    { subject: 'Logística', A: parseFloat(country.logisticsScore || "0"), fullMark: 100 },
    { subject: 'Riesgo', A: parseFloat(country.riskScore || "0"), fullMark: 100 },
    { subject: 'Facilidad', A: parseFloat(country.opportunityScore || "0"), fullMark: 100 },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="mr-3 text-kora-success w-6 h-6" />
          Análisis de Mercados Globales
        </h3>
        {viewMode === "details" && (
          <Button onClick={handleBackToRanking} variant="outline">
            ← Volver al Ranking
          </Button>
        )}
      </div>
      
      {/* Product Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona el producto a exportar:
        </label>
        <Select value={hsCode} onValueChange={setHsCode}>
          <SelectTrigger className="max-w-md">
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

      {viewMode === "ranking" ? (
        /* Country Opportunities Ranking */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Star className="mr-2 text-yellow-500 w-5 h-5" />
            Ranking de Países por Oportunidad
          </h4>
          
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCountrySelect(opportunity)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-kora-primary text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 flex items-center">
                        <MapPin className="mr-2 w-4 h-4 text-gray-500" />
                        {opportunity.countryName}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Mercado: ${parseFloat(opportunity.marketSizeUsd || "0").toLocaleString()}M USD</span>
                        <span className="flex items-center text-green-600">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{opportunity.importVolumeGrowth}%
                        </span>
                        <span>Arancel: {opportunity.avgTariffRate}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(opportunity.opportunityScore || "0")}`}>
                        {opportunity.opportunityScore} pts
                      </div>
                      <div className="flex items-center space-x-2 mt-1 justify-end">
                        {getCompetitionIcon(opportunity.competitionLevel || "medium")}
                        <span className="text-xs text-gray-500 capitalize">
                          {opportunity.competitionLevel} competencia
                        </span>
                      </div>
                    </div>
                    
                    <div className="hidden md:grid grid-cols-4 gap-2 text-center">
                      <div className="text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${getScoreColor(opportunity.demandScore || "0")}`}>
                          {Math.round(parseFloat(opportunity.demandScore || "0"))}
                        </div>
                        <span className="text-gray-500 mt-1 block">Demanda</span>
                      </div>
                      <div className="text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${getScoreColor(opportunity.tariffScore || "0")}`}>
                          {Math.round(parseFloat(opportunity.tariffScore || "0"))}
                        </div>
                        <span className="text-gray-500 mt-1 block">Aranceles</span>
                      </div>
                      <div className="text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${getScoreColor(opportunity.logisticsScore || "0")}`}>
                          {Math.round(parseFloat(opportunity.logisticsScore || "0"))}
                        </div>
                        <span className="text-gray-500 mt-1 block">Logística</span>
                      </div>
                      <div className="text-xs">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${getScoreColor(opportunity.riskScore || "0")}`}>
                          {Math.round(parseFloat(opportunity.riskScore || "0"))}
                        </div>
                        <span className="text-gray-500 mt-1 block">Riesgo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        /* Country Details View */
        selectedCountry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                  <MapPin className="mr-2 text-kora-primary w-6 h-6" />
                  Análisis Detallado: {selectedCountry.countryName}
                </h4>
                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${getScoreColor(selectedCountry.opportunityScore || "0")}`}>
                  <Star className="mr-2 w-4 h-4" />
                  Puntuación de Oportunidad: {selectedCountry.opportunityScore}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Market Overview Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="mr-2 w-5 h-5 text-blue-600" />
                  Tendencia de Crecimiento del Mercado
                </h5>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6, fill: '#2563eb' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium uppercase">Tamaño</div>
                    <div className="text-lg font-bold text-blue-900">${parseFloat(selectedCountry.marketSizeUsd || "0").toLocaleString()}M</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-xs text-green-600 font-medium uppercase">Crecimiento</div>
                    <div className="text-lg font-bold text-green-900">+{selectedCountry.importVolumeGrowth}%</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs text-purple-600 font-medium uppercase">Arancel</div>
                    <div className="text-lg font-bold text-purple-900">{selectedCountry.avgTariffRate}%</div>
                  </div>
                </div>
              </div>

              {/* Score Radar Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="mr-2 w-5 h-5 text-purple-600" />
                  Análisis Multidimensional
                </h5>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(selectedCountry)}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name={selectedCountry.countryName}
                        dataKey="A"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  Evaluación integral basada en 5 factores clave
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trade Agreements */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="mr-2 w-5 h-5 text-green-600" />
                  Acuerdos Comerciales
                </h5>
                <div className="space-y-3">
                  {selectedCountry.tradeAgreements?.map((agreement, index) => (
                    <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-sm font-medium text-green-900">{agreement}</span>
                    </div>
                  ))}
                  {(!selectedCountry.tradeAgreements || selectedCountry.tradeAgreements.length === 0) && (
                    <div className="text-sm text-gray-500 italic">No hay acuerdos comerciales registrados.</div>
                  )}
                </div>
              </div>

              {/* Logistics Information */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2 w-5 h-5 text-orange-600" />
                  Información Logística
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Complejidad Logística</span>
                    <span className={`font-medium px-3 py-1 rounded-full text-xs capitalize ${
                      selectedCountry.logisticsComplexity === "simple" ? "bg-green-100 text-green-800" :
                      selectedCountry.logisticsComplexity === "moderate" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                    }`}>
                      {selectedCountry.logisticsComplexity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm">Puntuación Logística</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3 overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{ width: `${selectedCountry.logisticsScore}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-sm">{selectedCountry.logisticsScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-100 p-2 text-red-800 text-xs font-mono mb-4 border border-red-300 rounded">
                  DEBUG: SelectedCountryCode="{selectedCountry?.countryCode}" | HS="{hsCode}" | ReqsLoaded={requirements ? "YES" : "NO"}
              </div>

              {/* Mostrar documentación para US + Carne Bovina */}
              {selectedCountry && hsCode === '0201' && (
                selectedCountry.countryCode === 'US' || 
                selectedCountry.countryName?.toLowerCase().includes('estados unidos') ||
                selectedCountry.countryName?.toLowerCase().includes('united states')
              ) && (
                 (() => {
                    const activeRequirements = requirements || US_BEEF_MOCK;
                    return (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="font-semibold text-gray-900 flex items-center">
                      <Package className="mr-2 w-5 h-5 text-purple-600" />
                      {t('requirements_export', 'Requisitos de Exportación')}
                    </h5>
                    <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      {activeRequirements.hsCode} → {activeRequirements.countryCode}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1: Docs & Standards */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="font-medium text-gray-800 text-sm uppercase tracking-wide flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                            {t('documents_required', 'Documentación Reglamentaria Requerida')}
                          </h6>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs gap-2"
                            onClick={() => {
                              import('jspdf').then(jsPDF => {
                                import('jspdf-autotable').then(autoTable => {
                                  const doc = new jsPDF.default();
                                  
                                  // Header
                                  doc.setFontSize(18);
                                  doc.text('Guía de Requisitos de Exportación', 14, 22);
                                  
                                  doc.setFontSize(11);
                                  doc.setTextColor(100);
                                  doc.text(`${activeRequirements.hsCode} -> ${activeRequirements.countryCode} (Generado por Che Comex AI)`, 14, 32);
                                  
                                  // Data preparation
                                  const tableRows = activeRequirements.requiredDocuments?.map((d: any) => {
                                    if (typeof d === 'string') return [d, '-', '-', '-'];
                                    return [d.name, d.issuer, d.description, d.requirements];
                                  });

                                  // Table
                                  autoTable.default(doc, {
                                    head: [['Documento', 'Entidad Emisora', 'Descripción', 'Requisitos Clave']],
                                    body: tableRows,
                                    startY: 40,
                                    theme: 'grid',
                                    headStyles: { fillColor: [41, 128, 185] },
                                    styles: { fontSize: 8 }
                                  });
                                  
                                  // Disclaimer
                                  const finalY = (doc as any).lastAutoTable.finalY + 10;
                                  doc.setFontSize(8);
                                  doc.setTextColor(150);
                                  doc.text('Disclaimer: Esta guía es informativa. Verifique con fuentes oficiales antes de exportar.', 14, finalY);
                                  
                                  doc.save(`Requisitos_${activeRequirements.hsCode}_${activeRequirements.countryCode}.pdf`);
                                });
                              });
                            }}
                          >
                             <span className="sr-only">Descargar</span>
                             📄 PDF
                          </Button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 max-h-[400px] overflow-y-auto">
                          {activeRequirements.requiredDocuments?.length > 0 && typeof activeRequirements.requiredDocuments[0] !== 'string' ? (
                            <div className="space-y-4">
                               {activeRequirements.requiredDocuments.map((doc: any, index: number) => (
                                 <div key={index} className="bg-white p-3 rounded border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start">
                                       <h5 className="font-bold text-gray-800 text-sm">{doc.name}</h5>
                                       <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                                          {doc.issuer}
                                       </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                                       <span className="font-semibold text-gray-700">Requisito: </span>
                                       <span className="text-gray-600">{doc.requirements}</span>
                                    </div>
                                    {doc.link && (
                                       <a href={doc.link} target="_blank" rel="noopener noreferrer" className="block mt-2 text-xs text-blue-600 hover:underline flex items-center">
                                          Ver fuente oficial →
                                       </a>
                                    )}
                                 </div>
                               ))}
                            </div>
                          ) : (
                            <ul className="space-y-2">
                              {activeRequirements.requiredDocuments?.map((doc: string, index: number) => (
                                <li key={index} className="flex items-start text-sm">
                                  <div className="min-w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2"></div>
                                  <span className="text-gray-700">{doc}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                      <div>
                        <h6 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-green-500" />
                          {t('tech_standards', 'Normas Técnicas y Sanitarias')}
                        </h6>
                        <div className="space-y-2">
                          {requirements.technicalStandards?.map((std: string, index: number) => (
                            <div key={index} className="flex items-center text-sm p-2 bg-green-50 rounded border border-green-100">
                              <span className="text-green-800 font-medium">{std}</span>
                            </div>
                          ))}
                          {requirements.phytosanitaryReqs?.map((req: string, index: number) => (
                            <div key={`phyto-${index}`} className="flex items-center text-sm p-2 bg-green-50 rounded border border-green-100">
                              <span className="text-green-800">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Column 2: Labeling, Packaging & Fees */}
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h6 className="text-purple-800 text-xs font-bold uppercase mb-2">Procesamiento</h6>
                            <div className="flex items-baseline">
                              <span className="text-2xl font-bold text-purple-900">{requirements.estimatedProcessingTime}</span>
                              <span className="text-purple-600 text-sm ml-1">días</span>
                            </div>
                         </div>
                         
                         {requirements.additionalFees && (
                           <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                              <h6 className="text-orange-800 text-xs font-bold uppercase mb-2">Tasas Estimadas</h6>
                              <div className="space-y-1">
                                {Object.entries(requirements.additionalFees).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-sm">
                                    <span className="text-orange-700 capitalize">{key.replace('_', ' ')}:</span>
                                    <span className="font-medium text-orange-900">{String(value)}</span> 
                                  </div>
                                ))}
                              </div>
                           </div>
                         )}
                       </div>

                      <div>
                        <h6 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
                          Etiquetado y Empaque
                        </h6>
                        <div className="space-y-3">
                           {requirements.labelingReqs?.length > 0 && (
                             <div className="text-sm">
                               <strong className="text-gray-900 block mb-1">Etiquetado:</strong>
                               <ul className="list-disc list-inside text-gray-600 pl-2">
                                 {requirements.labelingReqs.map((req: string, i: number) => (
                                   <li key={i}>{req}</li>
                                 ))}
                               </ul>
                             </div>
                           )}
                           
                           {requirements.packagingReqs?.length > 0 && (
                             <div className="text-sm border-t border-gray-100 pt-2">
                               <strong className="text-gray-900 block mb-1">Empaque:</strong>
                               <ul className="list-disc list-inside text-gray-600 pl-2">
                                 {requirements.packagingReqs.map((req: string, i: number) => (
                                   <li key={i}>{req}</li>
                                 ))}
                               </ul>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}
