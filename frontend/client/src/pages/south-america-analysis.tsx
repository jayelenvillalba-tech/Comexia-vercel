import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-language';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Map, Marker } from 'pigeon-maps';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Target, 
  BarChart3, 
  Brain, 
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Handshake,
  Shield
} from 'lucide-react';

// South American countries for selection
const SOUTH_AMERICAN_COUNTRIES = [
  { code: 'BR', name: 'Brasil', nameEn: 'Brazil' },
  { code: 'AR', name: 'Argentina', nameEn: 'Argentina' },
  { code: 'CO', name: 'Colombia', nameEn: 'Colombia' },
  { code: 'PE', name: 'Perú', nameEn: 'Peru' },
  { code: 'CL', name: 'Chile', nameEn: 'Chile' },
  { code: 'EC', name: 'Ecuador', nameEn: 'Ecuador' },
  { code: 'BO', name: 'Bolivia', nameEn: 'Bolivia' },
  { code: 'UY', name: 'Uruguay', nameEn: 'Uruguay' },
  { code: 'PY', name: 'Paraguay', nameEn: 'Paraguay' },
  { code: 'VE', name: 'Venezuela', nameEn: 'Venezuela' },
  { code: 'GY', name: 'Guyana', nameEn: 'Guyana' },
  { code: 'SR', name: 'Suriname', nameEn: 'Suriname' }
];

// Coordenadas precisas de países sudamericanos para el mapa
const COUNTRY_COORDINATES = {
  'BR': [-14.235, -51.9253] as [number, number],
  'AR': [-38.4161, -63.6167] as [number, number], 
  'CO': [4.5709, -74.2973] as [number, number],
  'PE': [-9.19, -75.0152] as [number, number],
  'CL': [-35.6751, -71.543] as [number, number],
  'EC': [-1.8312, -78.1834] as [number, number],
  'BO': [-16.2902, -63.5887] as [number, number],
  'UY': [-32.5228, -55.7658] as [number, number],
  'PY': [-23.4425, -58.4438] as [number, number],
  'VE': [6.4238, -66.5897] as [number, number],
  'GY': [4.8604, -58.9302] as [number, number],
  'SR': [3.9193, -56.0278] as [number, number]
};

interface CountryAnalysis {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  rank: number;
  score: number;
  opportunity: 'high' | 'medium' | 'low';
  tradeVolume: string;
  growth: string;
  marketSize: string;
  competitiveness: string;
  treaties: string[];
  tariffRate: string;
  advantages: Array<{reason: string, reasonEn: string, impact: string}>;
  disadvantages: Array<{reason: string, reasonEn: string, impact: string}>;
  coordinates: [number, number];
}

interface MarketIntelligence {
  country: string;
  product: string;
  operation: 'import' | 'export';
  analysis: string;
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
  marketTrends: string[];
  competitiveAnalysis: string;
  riskAssessment: string;
  timeline: string;
  estimatedVolume: string;
  estimatedValue: string;
}

export default function SouthAmericaAnalysis() {
  const { language } = useLanguage();
  const [originCountry, setOriginCountry] = useState('');
  const [operation, setOperation] = useState<'import' | 'export'>('export');
  const [product, setProduct] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // State for TOP 10 analysis
  const [topCountriesData, setTopCountriesData] = useState<any>(null);
  const [isLoadingTop10, setIsLoadingTop10] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  // Mutation for AI market intelligence
  const marketIntelligenceMutation = useMutation({
    mutationFn: async (params: {
      targetCountry: string;
      originCountry: string;
      operation: 'import' | 'export';
      product: string;
    }) => {
      const response = await apiRequest('/api/south-america/market-intelligence', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      return response;
    },
    onSuccess: (data) => {
      setAiAnalysis(data);
      queryClient.invalidateQueries({ queryKey: ['/api/south-america/market-intelligence'] });
    }
  });

  const handleAnalyze = async () => {
    if (!originCountry || !operation || !product) {
      return;
    }

    setIsLoadingTop10(true);
    setTopCountriesData(null);
    setSelectedCountry(null);
    setAiAnalysis(null);

    try {
      const response = await apiRequest('/api/south-america-analysis', {
        method: 'POST',
        body: JSON.stringify({
          originCountry,
          operation,
          product
        })
      });

      if (response.success && response.topCountries) {
        setTopCountriesData(response);
        console.log('Analysis completed:', response);
        console.log(`Found ${response.totalCompanies} companies across ${Object.keys(response.companiesPerCountry || {}).length} countries`);
        console.log('Companies per country:', response.companiesPerCountry);
        
        // Auto-scroll to map section after analysis completes
        setTimeout(() => {
          const mapSection = document.querySelector('[data-map-section]');
          if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else {
        console.error('Analysis failed:', response);
      }
    } catch (error) {
      console.error('Error performing analysis:', error);
    } finally {
      setIsLoadingTop10(false);
    }
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    if (originCountry && operation && product) {
      marketIntelligenceMutation.mutate({
        targetCountry: countryCode,
        originCountry,
        operation,
        product
      });
    }
  };

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getOpportunityIcon = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'low': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'es' ? 'Análisis de Mercado - América del Sur' : 'Market Analysis - South America'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {language === 'es' 
            ? 'Análisis meticuloso de oportunidades comerciales considerando tratados, bloques económicos y políticas regionales'
            : 'Meticulous analysis of trade opportunities considering treaties, economic blocs and regional policies'}
        </p>
      </div>

      {/* Analysis Form */}
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            {language === 'es' ? 'Configuración del Análisis' : 'Analysis Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {language === 'es' ? 'País de Origen' : 'Origin Country'}
              </label>
              <Select value={originCountry} onValueChange={setOriginCountry}>
                <SelectTrigger>
                  <SelectValue placeholder={language === 'es' ? 'Seleccionar país' : 'Select country'} />
                </SelectTrigger>
                <SelectContent>
                  {SOUTH_AMERICAN_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {language === 'es' ? country.name : country.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {language === 'es' ? 'Operación' : 'Operation'}
              </label>
              <Select value={operation} onValueChange={(value: 'import' | 'export') => setOperation(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export">
                    {language === 'es' ? 'Exportar' : 'Export'}
                  </SelectItem>
                  <SelectItem value="import">
                    {language === 'es' ? 'Importar' : 'Import'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {language === 'es' ? 'Producto' : 'Product'}
              </label>
              <Input
                placeholder={language === 'es' ? 'ej: café, soja, cobre' : 'e.g: coffee, soybean, copper'}
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAnalyze}
                disabled={!originCountry || !operation || !product || isLoadingTop10}
                className="w-full"
              >
                {isLoadingTop10 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'es' ? 'Analizando...' : 'Analyzing...'}
                  </div>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Analizar' : 'Analyze'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP 10 Countries */}
        <div className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                {language === 'es' ? 'TOP 10 Países' : 'TOP 10 Countries'}
              </CardTitle>
{topCountriesData && (
                <p className="text-sm text-gray-600">
                  {language === 'es' 
                    ? `Análisis para ${operation === 'export' ? 'exportar' : 'importar'} ${product} desde ${SOUTH_AMERICAN_COUNTRIES.find(c => c.code === originCountry)?.name || ''}`
                    : `Analysis for ${operation}ing ${product} from ${SOUTH_AMERICAN_COUNTRIES.find(c => c.code === originCountry)?.nameEn || ''}`}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {isLoadingTop10 ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : topCountriesData && typeof topCountriesData === 'object' && 'topCountries' in topCountriesData ? (
                <div className="space-y-3">
                  {((topCountriesData as any)?.topCountries || []).map((country: CountryAnalysis) => (
                    <div
                      key={country.countryCode}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCountry === country.countryCode 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCountrySelect(country.countryCode)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                            {country.rank}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {language === 'es' ? country.countryName : country.countryNameEn}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{language === 'es' ? 'Puntaje:' : 'Score:'} {country.score}/100</span>
                              <span>•</span>
                              <span>{language === 'es' ? 'Mercado:' : 'Market:'} {country.marketSize}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getOpportunityColor(country.opportunity)} flex items-center gap-1`}>
                            {getOpportunityIcon(country.opportunity)}
                            {language === 'es' 
                              ? (country.opportunity === 'high' ? 'Alto' : country.opportunity === 'medium' ? 'Medio' : 'Bajo')
                              : country.opportunity.charAt(0).toUpperCase() + country.opportunity.slice(1)}
                          </Badge>
                          {country.treaties.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Handshake className="w-3 h-3 mr-1" />
                              {country.treaties.length} {language === 'es' ? 'tratados' : 'treaties'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">{language === 'es' ? 'Volumen:' : 'Volume:'}</span>
                          <div className="font-medium">{country.tradeVolume}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'es' ? 'Crecimiento:' : 'Growth:'}</span>
                          <div className="font-medium">{country.growth}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'es' ? 'Aranceles:' : 'Tariffs:'}</span>
                          <div className="font-medium">{country.tariffRate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{language === 'es' ? 'Competitividad:' : 'Competitiveness:'}</span>
                          <div className="font-medium">{country.competitiveness}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>{language === 'es' ? 'Configure los parámetros y haga clic en Analizar' : 'Configure parameters and click Analyze'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Market Intelligence */}
        <div className="space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                {language === 'es' ? 'Análisis de IA' : 'AI Analysis'}
              </CardTitle>
              {selectedCountry && (
                <p className="text-sm text-gray-600">
                  {SOUTH_AMERICAN_COUNTRIES.find(c => c.code === selectedCountry)?.[language === 'es' ? 'name' : 'nameEn']}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {marketIntelligenceMutation.isPending ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    {language === 'es' ? 'Generando análisis exhaustivo...' : 'Generating exhaustive analysis...'}
                  </div>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              ) : marketIntelligenceMutation.data ? (
                <div className="space-y-4">
                  {/* Analysis Overview */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {language === 'es' ? 'Análisis del Mercado' : 'Market Analysis'}
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {(marketIntelligenceMutation.data as MarketIntelligence)?.analysis}
                    </p>
                  </div>

                  <Separator />

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                        <DollarSign className="w-4 h-4" />
                        {language === 'es' ? 'Volumen Estimado' : 'Estimated Volume'}
                      </div>
                      <div className="text-lg font-bold text-green-900">
                        {(marketIntelligenceMutation.data as MarketIntelligence)?.estimatedVolume}
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                        <Clock className="w-4 h-4" />
                        {language === 'es' ? 'Cronograma' : 'Timeline'}
                      </div>
                      <div className="text-sm font-medium text-blue-900">
                        {(marketIntelligenceMutation.data as MarketIntelligence)?.timeline}
                      </div>
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {language === 'es' ? 'Oportunidades' : 'Opportunities'}
                    </h4>
                    <ul className="space-y-1">
                      {((marketIntelligenceMutation.data as MarketIntelligence)?.opportunities || []).map((opportunity: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Challenges */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      {language === 'es' ? 'Desafíos' : 'Challenges'}
                    </h4>
                    <ul className="space-y-1">
                      {((marketIntelligenceMutation.data as MarketIntelligence)?.challenges || []).map((challenge: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      {language === 'es' ? 'Recomendaciones' : 'Recommendations'}
                    </h4>
                    <ul className="space-y-1">
                      {((marketIntelligenceMutation.data as MarketIntelligence)?.recommendations || []).map((recommendation: string, index: number) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Assessment */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {language === 'es' ? 'Evaluación de Riesgos' : 'Risk Assessment'}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {(marketIntelligenceMutation.data as MarketIntelligence)?.riskAssessment}
                    </p>
                  </div>
                </div>
              ) : selectedCountry ? (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>{language === 'es' ? 'Seleccione un país del TOP 10 para generar análisis de IA' : 'Select a country from TOP 10 to generate AI analysis'}</p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>{language === 'es' ? 'Realice un análisis TOP 10 primero' : 'Perform TOP 10 analysis first'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mapa Geográfico con Análisis de Tratados */}
        <div className="mt-6" data-map-section>
          <Card className="bg-white/90 backdrop-blur-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {language === 'es' ? 'Mapa de Oportunidades Comerciales' : 'Trade Opportunities Map'}
              </CardTitle>
{topCountriesData && (
                <p className="text-sm text-gray-600">
                  {language === 'es' 
                    ? 'Visualización geográfica de países factibles con análisis de tratados comerciales'
                    : 'Geographic visualization of feasible countries with trade treaty analysis'}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {topCountriesData && (topCountriesData as any)?.topCountries ? (
                <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                  <Map
                    height={384}
                    center={[-15, -60]} // Centrado en América del Sur
                    zoom={3}
                    attribution={false}
                  >
                    {((topCountriesData as any)?.topCountries || []).map((country: CountryAnalysis) => (
                      <Marker
                        key={country.countryCode}
                        width={40}
                        anchor={country.coordinates}
                        onClick={() => handleCountrySelect(country.countryCode)}
                      >
                        <div
                          className={`
                            w-8 h-8 rounded-full border-2 cursor-pointer transform transition-all duration-200 hover:scale-110
                            ${country.opportunity === 'high' 
                              ? 'bg-green-500 border-green-600 shadow-green-500/50' 
                              : country.opportunity === 'medium'
                              ? 'bg-yellow-500 border-yellow-600 shadow-yellow-500/50'
                              : 'bg-red-500 border-red-600 shadow-red-500/50'
                            } 
                            ${selectedCountry === country.countryCode ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}
                            shadow-lg hover:shadow-xl
                          `}
                          title={`${language === 'es' ? country.countryName : country.countryNameEn} - Rank #${country.rank}`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {country.rank}
                            </span>
                          </div>
                        </div>
                      </Marker>
                    ))}
                    
                    {/* Marcador del país de origen */}
                    {originCountry && (() => {
                      const originCoords = SOUTH_AMERICAN_COUNTRIES.find(c => c.code === originCountry);
                      return originCoords && originCoords.code in COUNTRY_COORDINATES ? (
                        <Marker
                          width={50}
                          anchor={COUNTRY_COORDINATES[originCoords.code as keyof typeof COUNTRY_COORDINATES]}
                        >
                          <div className="w-10 h-10 bg-blue-600 border-3 border-white rounded-full shadow-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                        </Marker>
                      ) : null;
                    })()}
                  </Map>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">
                      {language === 'es' 
                        ? 'Configure los parámetros y realice el análisis para ver el mapa'
                        : 'Configure parameters and perform analysis to see the map'}
                    </p>
                  </div>
                </div>
              )}

              {/* Leyenda del mapa */}
              {topCountriesData && (topCountriesData as any)?.topCountries && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">
                    {language === 'es' ? 'Leyenda del Mapa' : 'Map Legend'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full border border-green-600"></div>
                      <span className="text-gray-700">
                        {language === 'es' ? 'Oportunidad Alta' : 'High Opportunity'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full border border-yellow-600"></div>
                      <span className="text-gray-700">
                        {language === 'es' ? 'Oportunidad Media' : 'Medium Opportunity'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full border border-red-600"></div>
                      <span className="text-gray-700">
                        {language === 'es' ? 'Oportunidad Baja' : 'Low Opportunity'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full border-3 border-white flex items-center justify-center">
                        <MapPin className="w-2 h-2 text-white" />
                      </div>
                      <span className="text-gray-700">
                        {language === 'es' ? 'País de Origen' : 'Origin Country'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}