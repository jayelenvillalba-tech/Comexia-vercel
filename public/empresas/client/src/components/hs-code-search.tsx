import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Hash,
  Package,
  ArrowRight,
  Zap,
  Globe,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { HsSubpartida, HsPartida } from "@shared/schema";
import { countries, getCountryTreaties, getTariffReduction } from "@shared/countries-data";

interface HsCodeSearchProps {
  onProductSelected?: (product: HsSubpartida, country: string, operation: string, productName: string) => void;
  onPartidaSelected?: (partida: HsPartida, country: string, operation: string, productName: string) => void;
}

export default function HsCodeSearch({ onProductSelected, onPartidaSelected }: HsCodeSearchProps = {}) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [originCountry, setOriginCountry] = useState<string>("");
  const [operationType, setOperationType] = useState<string>("");

  // Agrupar países por región para mejor organización
  const regionOrder = ['South America', 'North America', 'Europe', 'Asia', 'Oceania', 'Africa', 'Middle East'];
  const countriesByRegion = regionOrder.map(region => ({
    region,
    regionName: {
      'South America': language === 'es' ? 'Sudamérica' : 'South America',
      'North America': language === 'es' ? 'Norteamérica' : 'North America', 
      'Europe': language === 'es' ? 'Europa' : 'Europe',
      'Asia': language === 'es' ? 'Asia' : 'Asia',
      'Oceania': language === 'es' ? 'Oceanía' : 'Oceania',
      'Africa': language === 'es' ? 'África' : 'Africa',
      'Middle East': language === 'es' ? 'Medio Oriente' : 'Middle East'
    }[region],
    countries: countries.filter(c => c.region === region)
  })).filter(group => group.countries.length > 0);

  // Search HS items with country and operation filters
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["/api/hs-search", searchQuery, originCountry, operationType],
    queryFn: async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) return { sections: [], chapters: [], partidas: [], subpartidas: [], warnings: [] };
      
      const params = new URLSearchParams({
        q: searchQuery,
        ...(originCountry && originCountry !== 'all' && { country: originCountry }),
        ...(operationType && operationType !== 'all' && { operation: operationType })
      });
      
      const response = await fetch(`/api/hs-search?${params}`);
      if (!response.ok) throw new Error("Failed to search HS items");
      return response.json();
    },
    enabled: searchQuery.length >= 3
  });

  const handleProductSelect = (item: HsSubpartida | HsPartida) => {
    // Validation: ensure country and operation are selected and not 'all'
    if (!originCountry || originCountry === 'all' || originCountry.trim().length === 0) {
      toast({
        title: language === 'es' ? 'País específico requerido' : 'Specific country required',
        description: language === 'es' ? 'Selecciona un país específico antes de elegir un producto' : 'Select a specific country before choosing a product',
        variant: "destructive",
      });
      return;
    }
    
    if (!operationType || operationType === 'all' || operationType.trim().length === 0) {
      toast({
        title: language === 'es' ? 'Operación específica requerida' : 'Specific operation required',
        description: language === 'es' ? 'Selecciona importar o exportar específicamente' : 'Select import or export specifically',
        variant: "destructive",
      });
      return;
    }

    // Additional validation for the product item
    if (!item || !item.code || item.code.trim().length === 0) {
      toast({
        title: language === 'es' ? 'Producto inválido' : 'Invalid product',
        description: language === 'es' ? 'El producto seleccionado no es válido' : 'The selected product is not valid',
        variant: "destructive",
      });
      return;
    }

    const productName = language === 'es' ? item.description : item.descriptionEn || item.description;
    
    // Final validation before navigation
    const navParams = {
      code: item.code.trim(),
      country: originCountry.trim(), 
      operation: operationType.trim(),
      productName: productName?.trim() || ''
    };
    
    console.log('Navigating with params:', navParams);
    
    // Ensure all required params are present
    if (!navParams.code || !navParams.country || !navParams.operation) {
      toast({
        title: language === 'es' ? 'Error de navegación' : 'Navigation error',
        description: language === 'es' ? 'Faltan parámetros requeridos para la navegación' : 'Missing required parameters for navigation',
        variant: "destructive",
      });
      return;
    }
    
    if ('partidaCode' in item) {
      // It's a subpartida
      onProductSelected?.(item as HsSubpartida, navParams.country, navParams.operation, navParams.productName);
      toast({
        title: language === 'es' ? 'Producto seleccionado' : 'Product selected',
        description: `${navParams.code} - ${navParams.productName}`,
      });
    } else {
      // It's a partida
      onPartidaSelected?.(item as HsPartida, navParams.country, navParams.operation, navParams.productName);
      toast({
        title: language === 'es' ? 'Categoría seleccionada' : 'Category selected', 
        description: `${navParams.code} - ${navParams.productName}`,
      });
    }
  };

  const allResults = [
    ...(searchResults?.partidas || []),
    ...(searchResults?.subpartidas || [])
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center text-lg text-gray-900">
          <Search className="mr-3 text-blue-600 w-5 h-5" />
          {language === 'es' ? 'Buscador de Códigos HS' : 'HS Code Search'}
          <Badge variant="secondary" className="ml-2">
            <Zap className="w-3 h-3 mr-1" />
            AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector de país */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              <Globe className="w-4 h-4 inline mr-2" />
              {language === 'es' ? 'País' : 'Country'}
            </Label>
            <Select value={originCountry} onValueChange={setOriginCountry}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'es' ? "Selecciona un país" : "Select a country"} />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                <SelectItem value="all">{language === 'es' ? 'Todos los países' : 'All countries'}</SelectItem>
                {countriesByRegion.map(group => [
                  <div key={`${group.region}-header`} className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                    {group.regionName}
                  </div>,
                  ...group.countries.map(country => (
                    <SelectItem key={country.code} value={country.code} className="pl-4">
                      {language === 'es' ? country.name : country.nameEn}
                      {country.treaties.length > 0 && (
                        <span className="ml-2 text-xs text-blue-600">●</span>
                      )}
                    </SelectItem>
                  ))
                ])}
              </SelectContent>
            </Select>
          </div>

          {/* Selector de operación */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {language === 'es' ? 'Operación' : 'Operation'}
            </Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'es' ? "Tipo de operación" : "Operation type"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'es' ? 'Importar y Exportar' : 'Import and Export'}</SelectItem>
                <SelectItem value="import">
                  <TrendingDown className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Importar' : 'Import'}
                </SelectItem>
                <SelectItem value="export">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Exportar' : 'Export'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buscador de productos */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={language === 'es' ? "Buscar productos, códigos HS, categorías..." : "Search products, HS codes, categories..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Información de filtros activos */}
        {(originCountry || operationType) && (
          <div className="flex flex-wrap gap-2">
            {originCountry && originCountry !== 'all' && (
              <div className="flex flex-col space-y-1">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <Globe className="w-3 h-3 mr-1" />
                  {countries.find(c => c.code === originCountry)?.[language === 'es' ? 'name' : 'nameEn'] || originCountry}
                </Badge>
                {(() => {
                  const selectedCountry = countries.find(c => c.code === originCountry);
                  const treaties = selectedCountry ? getCountryTreaties(originCountry) : [];
                  return treaties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {treaties.slice(0, 2).map(treaty => (
                        <Badge key={treaty.id} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                          {language === 'es' ? treaty.name : treaty.nameEn}
                        </Badge>
                      ))}
                      {treaties.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{treaties.length - 2} {language === 'es' ? 'más' : 'more'}
                        </Badge>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
            {operationType && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                {operationType === 'import' ? (
                  <><TrendingDown className="w-3 h-3 mr-1" />{language === 'es' ? 'Importar' : 'Import'}</>
                ) : (
                  <><TrendingUp className="w-3 h-3 mr-1" />{language === 'es' ? 'Exportar' : 'Export'}</>
                )}
              </Badge>
            )}
          </div>
        )}

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="text-sm text-gray-500 text-center py-4">
            {language === 'es' ? 'Escribe al menos 3 caracteres para buscar' : 'Type at least 3 characters to search'}
          </div>
        )}

        {isLoading && searchQuery.length >= 3 && (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-sm text-gray-500">
              {language === 'es' ? 'Buscando...' : 'Searching...'}
            </div>
          </div>
        )}

        {!isLoading && searchQuery.length >= 3 && allResults.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <div className="text-sm text-gray-500">
              {language === 'es' ? 'No se encontraron productos' : 'No products found'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {language === 'es' ? 'Intenta con otros términos de búsqueda' : 'Try different search terms'}
            </div>
          </div>
        )}

        {!isLoading && allResults.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <div className="text-sm text-gray-600 mb-3">
              {language === 'es' ? 'Resultados encontrados:' : 'Results found:'} {allResults.length}
            </div>
            
            {/* Display warning messages */}
            {searchResults?.warnings && searchResults.warnings.length > 0 && (
              <div className="space-y-2 mb-4">
                {searchResults.warnings.map((warning: {message: string, messageEn: string, severity: 'info' | 'warning' | 'blocked'}, index: number) => {
                  const getSeverityStyles = (severity: 'info' | 'warning' | 'blocked') => {
                    switch (severity) {
                      case 'blocked':
                        return 'bg-red-50 border-red-200 text-red-800';
                      case 'warning':
                        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                      case 'info':
                        return 'bg-blue-50 border-blue-200 text-blue-800';
                      default:
                        return 'bg-gray-50 border-gray-200 text-gray-800';
                    }
                  };
                  
                  const getSeverityIcon = (severity: 'info' | 'warning' | 'blocked') => {
                    switch (severity) {
                      case 'blocked':
                        return <AlertCircle className="w-4 h-4" />;
                      case 'warning':
                        return <AlertCircle className="w-4 h-4" />;
                      case 'info':
                        return <CheckCircle className="w-4 h-4" />;
                      default:
                        return <Info className="w-4 h-4" />;
                    }
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-start p-3 rounded-lg border ${getSeverityStyles(warning.severity)}`}
                    >
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        {getSeverityIcon(warning.severity)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {language === 'es' ? warning.message : warning.messageEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {allResults.map((item, index) => (
              <div
                key={`${item.code}-${index}`}
                className="p-4 bg-white/70 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleProductSelect(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 font-mono">
                        <Hash className="w-3 h-3 mr-1" />
                        {item.code}
                      </Badge>
                      {'partidaCode' in item && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'es' ? 'Subpartida' : 'Subheading'}
                        </Badge>
                      )}
                      {!('partidaCode' in item) && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'es' ? 'Partida' : 'Heading'}
                        </Badge>
                      )}
                    </div>
                    <h6 className="font-medium text-gray-900 mb-1 leading-tight">
                      {item.description}
                    </h6>
                    {item.descriptionEn && language === 'es' && (
                      <p className="text-xs text-gray-500 italic mb-2">{item.descriptionEn}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center">
                        <span className="font-medium">{language === 'es' ? 'Arancel:' : 'Tariff:'}</span>
                        <span className="ml-1 text-green-600 font-medium">{item.tariffRate}%</span>
                      </div>
                      {'partidaCode' in item && (
                        <div className="flex items-center">
                          <span className="font-medium">{language === 'es' ? 'Partida:' : 'Heading:'}</span>
                          <span className="ml-1 font-mono">{item.partidaCode}</span>
                        </div>
                      )}
                      {'chapterCode' in item && (
                        <div className="flex items-center">
                          <span className="font-medium">{language === 'es' ? 'Capítulo:' : 'Chapter:'}</span>
                          <span className="ml-1 font-mono">{item.chapterCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductSelect(item);
                    }}
                  >
                    {language === 'es' ? 'Seleccionar' : 'Select'}
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchQuery.length >= 3 && !isLoading && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 font-medium mb-1">
              {language === 'es' ? 'Consejos de búsqueda:' : 'Search tips:'}
            </div>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• {language === 'es' ? 'Selecciona un país para ver regulaciones específicas' : 'Select a country to see specific regulations'}</li>
              <li>• {language === 'es' ? 'Elige importar/exportar para filtrar productos permitidos' : 'Choose import/export to filter allowed products'}</li>
              <li>• {language === 'es' ? 'Usa palabras clave específicas como "smartphone", "algodón"' : 'Use specific keywords like "smartphone", "cotton"'}</li>
              <li>• {language === 'es' ? 'Funciona en español e inglés' : 'Works in Spanish and English'}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}