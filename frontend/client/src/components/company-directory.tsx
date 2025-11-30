import { useState } from "react";
import { Building, Search, Shield, Award, TrendingUp, AlertTriangle, CheckCircle, Phone, Mail, MapPin, Calendar, Users, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { Company } from "@shared/schema";

export default function CompanyDirectory() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "details">("list");

  const { data: companies = [] } = useQuery<Company[]>({
    queryKey: ["/api/companies", searchQuery, filterType, filterCountry],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filterType && filterType !== "all") params.append("type", filterType);
      if (filterCountry && filterCountry !== "all") params.append("country", filterCountry);
      
      const url = `/api/companies${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch companies");
      return response.json();
    },
  });

  const getCompanyTypeColor = (type: string) => {
    switch (type) {
      case "exporter":
        return "bg-green-100 text-green-800";
      case "importer":
        return "bg-orange-100 text-orange-800";
      case "both":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCompanyTypeLabel = (type: string) => {
    switch (type) {
      case "exporter":
        return t("directory.exporter");
      case "importer":
        return t("directory.importer");
      case "both":
        return t("directory.both");
      default:
        return type;
    }
  };

  const getRiskColor = (riskScore: string | null) => {
    if (!riskScore) return "bg-gray-100 text-gray-800";
    const score = parseFloat(riskScore);
    if (score <= 20) return "bg-green-100 text-green-800";
    if (score <= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getCreditRatingColor = (rating: string | null) => {
    if (!rating) return "bg-gray-100 text-gray-800";
    if (["AAA", "AA", "A"].includes(rating)) return "bg-green-100 text-green-800";
    if (["BBB", "BB", "B"].includes(rating)) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedCompany(null);
  };

  const countries = [
    { value: "Argentina", label: "Argentina" },
    { value: "Brasil", label: "Brasil" },
    { value: "Chile", label: "Chile" },
    { value: "Alemania", label: "Alemania" },
    { value: "Estados Unidos", label: "Estados Unidos" },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Building className="mr-3 text-kora-secondary w-5 h-5" />
          {viewMode === "list" ? "Directorio de Empresas" : "Perfil de Empresa"}
        </h3>
        {viewMode === "details" && (
          <Button onClick={handleBackToList} variant="outline" size="sm">
            ← Volver al Listado
          </Button>
        )}
      </div>
      
      {viewMode === "list" ? (
        <div>
          {/* Filters and Search */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar empresa, producto o contacto..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="importer">Importadores</SelectItem>
                  <SelectItem value="exporter">Exportadores</SelectItem>
                  <SelectItem value="both">Ambos</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los países</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Company List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer transition-all"
                onClick={() => handleCompanySelect(company)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{company.name}</h4>
                  <div className="flex items-center space-x-2">
                    {company.verified && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                    {company.sanctions && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {company.country}
                  </span>
                  {company.establishedYear && (
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {company.establishedYear}
                    </span>
                  )}
                  {company.employeeCount && (
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {company.employeeCount} empleados
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mb-3">
                  {company.products?.slice(0, 3).join(", ") || "Sin productos especificados"}
                  {company.products && company.products.length > 3 && "..."}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${getCompanyTypeColor(company.type)}`}>
                      {getCompanyTypeLabel(company.type)}
                    </span>
                    {company.creditRating && (
                      <span className={`px-2 py-1 text-xs rounded ${getCreditRatingColor(company.creditRating)}`}>
                        {company.creditRating}
                      </span>
                    )}
                  </div>
                  
                  {company.riskScore && (
                    <div className={`px-2 py-1 text-xs rounded ${getRiskColor(company.riskScore)}`}>
                      Riesgo: {parseFloat(company.riskScore).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {companies.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No se encontraron empresas</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Company Details View */
        selectedCompany && (
          <div className="space-y-6">
            {/* Company Header */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedCompany.name}</h4>
                  {selectedCompany.legalName && (
                    <p className="text-sm text-gray-600">{selectedCompany.legalName}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {selectedCompany.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verificado</span>
                    </div>
                  )}
                  {selectedCompany.sanctions && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Sanciones</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">País:</span>
                  <p className="font-medium">{selectedCompany.country}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <p className="font-medium">{getCompanyTypeLabel(selectedCompany.type)}</p>
                </div>
                {selectedCompany.establishedYear && (
                  <div>
                    <span className="text-gray-600">Fundada:</span>
                    <p className="font-medium">{selectedCompany.establishedYear}</p>
                  </div>
                )}
                {selectedCompany.employeeCount && (
                  <div>
                    <span className="text-gray-600">Empleados:</span>
                    <p className="font-medium">{selectedCompany.employeeCount}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="mr-2 w-5 h-5 text-blue-600" />
                  Evaluación de Riesgo
                </h5>
                <div className="space-y-3">
                  {selectedCompany.creditRating && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Calificación Crediticia:</span>
                      <span className={`px-3 py-1 rounded ${getCreditRatingColor(selectedCompany.creditRating)}`}>
                        {selectedCompany.creditRating}
                      </span>
                    </div>
                  )}
                  {selectedCompany.riskScore && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Puntuación de Riesgo:</span>
                      <span className={`px-3 py-1 rounded ${getRiskColor(selectedCompany.riskScore)}`}>
                        {parseFloat(selectedCompany.riskScore).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {selectedCompany.paymentTerms && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Términos de Pago:</span>
                      <span className="font-medium">{selectedCompany.paymentTerms}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Business Performance */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="mr-2 w-5 h-5 text-green-600" />
                  Rendimiento Comercial
                </h5>
                <div className="space-y-3">
                  {selectedCompany.totalTransactions && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transacciones Totales:</span>
                      <span className="font-medium">{selectedCompany.totalTransactions.toLocaleString()}</span>
                    </div>
                  )}
                  {selectedCompany.averageOrderValue && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Promedio de Orden:</span>
                      <span className="font-medium">${parseFloat(selectedCompany.averageOrderValue).toLocaleString()}</span>
                    </div>
                  )}
                  {selectedCompany.onTimeDeliveryRate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entregas a Tiempo:</span>
                      <span className="font-medium text-green-600">{selectedCompany.onTimeDeliveryRate}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-4">Información de Contacto</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {selectedCompany.contactPerson && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Contacto:</span>
                      <span className="font-medium">{selectedCompany.contactPerson}</span>
                    </div>
                  )}
                  {selectedCompany.contactEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-blue-600">{selectedCompany.contactEmail}</span>
                    </div>
                  )}
                  {selectedCompany.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedCompany.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  {selectedCompany.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="text-sm text-gray-600">{selectedCompany.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Certifications */}
            {selectedCompany.certifications && selectedCompany.certifications.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2 w-5 h-5 text-yellow-600" />
                  Certificaciones
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Products */}
            {selectedCompany.products && selectedCompany.products.length > 0 && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-4">Productos</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.products.map((product, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
