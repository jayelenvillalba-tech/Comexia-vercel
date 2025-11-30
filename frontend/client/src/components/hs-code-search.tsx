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
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import type { HsSubpartida, HsPartida } from "@shared/schema";
import { countries, getCountryTreaties, getTariffReduction, type CountryData } from "@shared/shared/countries-data";

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
      
      const response = await fetch(`/api/hs-codes/search?${params}`);
        if (!response.ok) throw new Error('Failed to search HS items');
        const data = await response.json();
        // Backend returns { results: HSCode[] }
        return { 
          sections: [],
          chapters: [],
          partidas: [],
          subpartidas: data.results || [],
          warnings: []
        };
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

  // API returns { results: [] } so we use that directly
  const allResults = searchResults?.subpartidas || [];

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
      <CardHeader className="bg-white/5 border-b border-white/10">
        <CardTitle className="flex items-center text-lg text-white">
          <Search className="mr-3 text-blue-400 w-5 h-5" />
          {language === 'es' ? 'Buscador de Códigos HS' : 'HS Code Search'}
          <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-200 border-blue-400/30">
            <Zap className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Filtros principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Selector de país */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-100">
              <Globe className="w-4 h-4 inline mr-2 text-blue-400" />
              {language === 'es' ? 'País de Origen/Destino' : 'Origin/Destination Country'}
            </Label>
            <Select value={originCountry} onValueChange={setOriginCountry}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500/50">
                <SelectValue placeholder={language === 'es' ? "Selecciona un país" : "Select a country"} />
              </SelectTrigger>
              <SelectContent className="max-h-96 bg-slate-900 border-white/10 text-white">
                <SelectItem value="all" className="focus:bg-white/10 focus:text-white">{language === 'es' ? 'Todos los países' : 'All countries'}</SelectItem>
                {countriesByRegion.map(group => [
                  <div key={`${group.region}-header`} className="px-2 py-1.5 text-sm font-semibold text-blue-400 bg-white/5">
                    {group.regionName}
                  </div>,
                  ...group.countries.map(country => (
                    <SelectItem key={country.code} value={country.code} className="pl-4 focus:bg-white/10 focus:text-white">
                      {language === 'es' ? country.name : country.nameEn}
                      {country.treaties.length > 0 && (
                        <span className="ml-2 text-xs text-blue-400">●</span>
                      )}
                    </SelectItem>
                  ))
                ])}
              </SelectContent>
            </Select>
          </div>

          {/* Selector de operación */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-100">
              {language === 'es' ? 'Tipo de Operación' : 'Operation Type'}
            </Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-blue-500/50 focus:border-blue-500/50">
                <SelectValue placeholder={language === 'es' ? "Selecciona operación" : "Select operation"} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all" className="focus:bg-white/10 focus:text-white">{language === 'es' ? 'Importar y Exportar' : 'Import and Export'}</SelectItem>
                <SelectItem value="import" className="focus:bg-white/10 focus:text-white">
                  <div className="flex items-center">
                    <TrendingDown className="w-4 h-4 mr-2 text-green-400" />
                    {language === 'es' ? 'Importar' : 'Import'}
                  </div>
                </SelectItem>
                <SelectItem value="export" className="focus:bg-white/10 focus:text-white">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                    {language === 'es' ? 'Exportar' : 'Export'}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buscador de productos */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-100">
            <Search className="w-4 h-4 inline mr-2 text-blue-400" />
            {language === 'es' ? 'Búsqueda de Producto' : 'Product Search'}
          </Label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={language === 'es' ? "Ej: Smartphones, Algodón, Café..." : "Ex: Smartphones, Cotton, Coffee..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && allResults.length > 0) {
                    handleProductSelect(allResults[0]);
                  }
                }}
                className="pl-10 pr-24 bg-slate-900/90 border-white/10 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent h-12"
              />
              <div className="absolute right-1 top-1 bottom-1">
                <Button 
                  size="sm"
                  className="h-full bg-blue-600 hover:bg-blue-500 text-white px-4"
                  onClick={() => {
                    if (allResults.length > 0) {
                      handleProductSelect(allResults[0]);
                    } else if (searchQuery.length >= 3) {
                      toast({
                        title: language === 'es' ? 'Buscando...' : 'Searching...',
                        description: language === 'es' ? 'No se encontraron resultados exactos. Intenta con otro término.' : 'No exact results found. Try another term.',
                        variant: "default",
                      });
                    }
                  }}
                >
                  {language === 'es' ? 'BUSCAR' : 'SEARCH'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Información de filtros activos */}
        <AnimatePresence>
          {(originCountry || operationType) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {originCountry && originCountry !== 'all' && (
                <div className="flex flex-col space-y-1">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                    <Globe className="w-3 h-3 mr-1" />
                    {countries.find(c => c.code === originCountry)?.[language === 'es' ? 'name' : 'nameEn'] || originCountry}
                  </Badge>
                </div>
              )}
              {operationType && operationType !== 'all' && (
                <Badge variant="secondary" className={operationType === 'import' ? "bg-green-500/20 text-green-200 border-green-400/30" : "bg-blue-500/20 text-blue-200 border-blue-400/30"}>
                  {operationType === 'import' ? (
                    <><TrendingDown className="w-3 h-3 mr-1" />{language === 'es' ? 'Importar' : 'Import'}</>
                  ) : (
                    <><TrendingUp className="w-3 h-3 mr-1" />{language === 'es' ? 'Exportar' : 'Export'}</>
                  )}
                </Badge>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400 text-center py-4"
            >
              {language === 'es' ? 'Escribe al menos 3 caracteres para buscar' : 'Type at least 3 characters to search'}
            </motion.div>
          )}

          {isLoading && searchQuery.length >= 3 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <div className="text-sm text-blue-300 animate-pulse">
                {language === 'es' ? 'Analizando base de datos global...' : 'Analyzing global database...'}
              </div>
            </motion.div>
          )}

          {!isLoading && searchQuery.length >= 3 && allResults.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-base text-gray-300 font-medium mb-1">
                {language === 'es' ? 'No se encontraron productos' : 'No products found'}
              </div>
              <div className="text-sm text-gray-500">
                {language === 'es' ? 'Intenta con otros términos de búsqueda' : 'Try different search terms'}
              </div>
            </motion.div>
          )}

          {!isLoading && allResults.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
            >
              <div className="flex items-center justify-between text-sm text-blue-300 mb-3 px-1">
                <span>{language === 'es' ? 'Resultados encontrados:' : 'Results found:'} {allResults.length}</span>
                <Sparkles className="w-4 h-4" />
              </div>
              
              {/* Display warning messages */}
              {searchResults?.warnings && searchResults.warnings.length > 0 && (
                <div className="space-y-2 mb-4">
                  {searchResults.warnings.map((warning: {message: string, messageEn: string, severity: 'info' | 'warning' | 'blocked'}, index: number) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-start p-3 rounded-lg border ${
                        warning.severity === 'blocked' ? 'bg-red-900/20 border-red-500/30 text-red-200' :
                        warning.severity === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-200' :
                        'bg-blue-900/20 border-blue-500/30 text-blue-200'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-sm">{language === 'es' ? warning.message : warning.messageEn}</p>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {allResults.map((item, index) => (
                <motion.div
                  key={`${item.code}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                  onClick={() => handleProductSelect(item)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/10 group-hover:to-blue-500/5 transition-all duration-500"></div>
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/20 font-mono">
                          <Hash className="w-3 h-3 mr-1" />
                          {item.code}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300 hover:bg-white/20">
                          {'partidaCode' in item 
                            ? (language === 'es' ? 'Subpartida' : 'Subheading')
                            : (language === 'es' ? 'Partida' : 'Heading')
                          }
                        </Badge>
                      </div>
                      <h6 className="font-medium text-white mb-1 leading-tight group-hover:text-blue-200 transition-colors">
                        {item.description}
                      </h6>
                      {item.descriptionEn && language === 'es' && (
                        <p className="text-xs text-gray-400 italic mb-2">{item.descriptionEn}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-500">{language === 'es' ? 'Arancel:' : 'Tariff:'}</span>
                          <span className="ml-1 text-green-400 font-medium">{item.tariffRate}%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 bg-blue-600 hover:bg-blue-500 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSelect(item);
                      }}
                    >
                      {language === 'es' ? 'Analizar' : 'Analyze'}
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {searchQuery.length >= 3 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20"
          >
            <div className="text-xs text-blue-300 font-medium mb-1 flex items-center">
              <Info className="w-3 h-3 mr-1" />
              {language === 'es' ? 'Consejos de búsqueda:' : 'Search tips:'}
            </div>
            <ul className="text-xs text-blue-400/80 space-y-1 ml-4 list-disc">
              <li>{language === 'es' ? 'Selecciona un país para ver regulaciones específicas' : 'Select a country to see specific regulations'}</li>
              <li>{language === 'es' ? 'Elige importar/exportar para filtrar productos permitidos' : 'Choose import/export to filter allowed products'}</li>
              <li>{language === 'es' ? 'Usa palabras clave específicas como "smartphone", "algodón"' : 'Use specific keywords like "smartphone", "cotton"'}</li>
            </ul>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}