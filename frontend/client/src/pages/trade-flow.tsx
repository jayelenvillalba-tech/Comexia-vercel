import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Navigation, Users, TrendingUp, Globe, Download, Upload, Star, AlertTriangle, CheckCircle, XCircle, Info, ZoomIn, ZoomOut, RotateCcw, MapPin, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Header from "@/components/header";
import { Map, Marker, Overlay } from "pigeon-maps";
import { countries } from "@shared/shared/countries-data";
import { getCountryCoordinates as getCoordinatesFromContinental } from "@shared/shared/continental-coordinates";

// Modern satellite map providers for high-quality visualization
const mapProviders = {
  // ESRI World Imagery - High quality satellite
  satellite: (x: number, y: number, z: number) => 
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`,
  
  // ESRI Street Map
  street: (x: number, y: number, z: number) => 
    `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}`,
  
  // CartoDB Positron - Clean street map
  clean: (x: number, y: number, z: number) => 
    `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`,
  
  // OpenStreetMap - Fallback
  osm: (x: number, y: number, z: number) => 
    `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
};

type MapStyle = keyof typeof mapProviders;

interface CountryRecommendation {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  score: number;
  opportunity: 'high' | 'medium' | 'low';
  companyCount?: number;
  specialization?: boolean;
  treaties?: string[]; // Optional - might not be present in API response
  treatyBenefits?: string[]; // This is what actually comes from the API
  tradeVolume?: string;
  growth?: string;
  coordinates: [number, number];
  restrictions?: string;
  advantages?: Array<{reason: string, reasonEn: string, impact: string}>;
  disadvantages?: Array<{reason: string, reasonEn: string, impact: string}>;
  estimatedTimeDelay?: number;
}

interface Company {
  id: string;
  name: string;
  country: string;
  type: string;
  products: string[];
  verified: boolean;
  contactEmail?: string;
  website?: string;
  legalName?: string;
  businessType?: string;
  establishedYear?: number;
  employeeCount?: number;
  creditRating?: string;
  riskScore?: number;
  certifications?: string[];
  contactPerson?: string;
  phone?: string;
  address?: string;
  coordinates?: [number, number];
}

import SubscriptionModal from "@/components/subscription-modal";

export default function TradeFlow() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<CountryRecommendation | null>(null);
  const [operation, setOperation] = useState<'import' | 'export'>('import');
  const [originCountry, setOriginCountry] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [mapStyle, setMapStyle] = useState<MapStyle>('satellite');
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [currentZoom, setCurrentZoom] = useState<number>(2);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [hasNavigationError, setHasNavigationError] = useState(false);
  const [navigationErrorMessage, setNavigationErrorMessage] = useState<string>('');
  
  // Subscription State
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // Mock premium state

  // Get parameters from URL 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') as 'import' | 'export';
    const code = urlParams.get('code');
    const country = urlParams.get('country');
    const product = urlParams.get('product');
    
    console.log('=== Trade-flow Page Initialization ===');
    console.log('Full URL:', window.location.href);
    console.log('Search params:', window.location.search);
    console.log('Parsed params:', { type, code, country, product });
    
    // Validate parameters before setting state
    let hasValidParams = true;
    let errorMessages = [];
    
    if (type && ['import', 'export'].includes(type)) {
      setOperation(type);
      console.log('✓ Operation set:', type);
    } else {
      console.warn('❌ Invalid or missing operation type, defaulting to export');
      setOperation('export');
      hasValidParams = false;
      errorMessages.push('Operation type missing or invalid');
    }
    
    if (code && code.trim().length > 0) {
      const trimmedCode = code.trim();
      setSelectedProduct(trimmedCode);
      console.log('✓ Product code set:', trimmedCode);
    } else {
      console.warn('❌ Invalid or missing product code');
      hasValidParams = false;
      errorMessages.push('Product code missing');
    }
    
    if (country && country !== 'all' && country.trim().length > 0) {
      const trimmedCountry = country.trim();
      setOriginCountry(trimmedCountry);
      console.log('✓ Origin country set:', trimmedCountry);
    } else {
      console.warn('❌ Invalid or missing country code');
      hasValidParams = false;
      errorMessages.push('Country code missing or set to "all"');
    }
    
    if (product) {
      try {
        const decodedProduct = decodeURIComponent(product);
        if (decodedProduct.trim().length > 0) {
          setProductName(decodedProduct.trim());
          console.log('✓ Product name set:', decodedProduct.trim());
        }
      } catch (error) {
        console.warn('❌ Error decoding product name:', error);
        setProductName(product);
      }
    }
    
    // If params are invalid, show detailed error information
    if (!hasValidParams) {
      console.error('=== NAVIGATION VALIDATION FAILED ===');
      console.error('Missing or invalid parameters:');
      errorMessages.forEach(msg => console.error('- ' + msg));
      console.error('This will cause the page to show limited functionality');
      console.error('=============================================');
      
      setHasNavigationError(true);
      setNavigationErrorMessage(
        `Parámetros de navegación inválidos: ${errorMessages.join(', ')}`
      );
    } else {
      console.log('✓ All navigation parameters validated successfully');
      setHasNavigationError(false);
      setNavigationErrorMessage('');
    }
  }, []);

  // Fetch country recommendations with origin country
  const { data: recommendationsData, isLoading, error: recommendationsError } = useQuery({
    queryKey: ['/api/country-recommendations', selectedProduct, operation, originCountry],
    enabled: !!selectedProduct && selectedProduct.trim().length > 0,
    queryFn: async () => {
      if (!selectedProduct || selectedProduct.trim().length === 0) {
        throw new Error('Product code is required');
      }
      
      const params = new URLSearchParams({
        hsCode: selectedProduct.trim(),
        operation: operation
      });
      
      if (originCountry && originCountry.trim().length > 0) {
        params.set('originCountry', originCountry.trim());
      }
      
      console.log('Fetching recommendations with params:', params.toString());
      
      const response = await fetch(`/api/country-recommendations?${params}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch recommendations: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Recommendations received:', data);
      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Extract recommendations array from response
  const recommendations: CountryRecommendation[] = Array.isArray(recommendationsData) 
    ? recommendationsData 
    : (recommendationsData?.recommended || []);

  // Fetch companies for selected country and product type (with government data)
  const { data: companiesResponse, isLoading: isLoadingCompanies, error: companiesError } = useQuery({
    queryKey: ['/api/companies', selectedCountry?.countryCode, operation, selectedProduct, 'government'],
    enabled: !!selectedCountry && !!selectedProduct && selectedProduct.trim().length > 0,
    queryFn: async (): Promise<{ companies: Company[]; source: string; governmentAPI?: string; lastUpdated?: Date }> => {
      if (!selectedCountry || !selectedProduct || selectedProduct.trim().length === 0) {
        return { companies: [], source: 'none' };
      }
      
      // Try government APIs first for supported countries
      const supportedCountries = ['BR', 'AR', 'CL', 'US'];
      const useGovernmentAPI = supportedCountries.includes(selectedCountry.countryCode);
      
      const searchParams = new URLSearchParams({
        search: selectedProduct.trim(), // Search by HS code or product name
        country: selectedCountry.countryCode,
        type: operation === 'import' ? 'exporter' : 'importer',
        useGovernmentData: useGovernmentAPI ? 'true' : 'false'
      });
      
      console.log('Fetching companies with params:', searchParams.toString());
      
      const response = await fetch(`/api/companies?${searchParams}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Companies API error:', response.status, errorText);
        // Return empty result instead of throwing to prevent page crash
        return { companies: [], source: 'error' };
      }
      
      const result = await response.json();
      
      // Handle both old and new response formats
      if (Array.isArray(result)) {
        return { companies: result, source: 'internal' };
      }
      
      return {
        companies: result.companies || [],
        source: result.source || 'internal',
        governmentAPI: result.governmentAPI,
        lastUpdated: result.lastUpdated ? new Date(result.lastUpdated) : undefined
      };
    },
    retry: 2,
    retryDelay: 1000
  });

  // Extract companies from response
  const companies = companiesResponse?.companies || [];
  const dataSource = companiesResponse?.source || 'internal';
  const governmentAPI = companiesResponse?.governmentAPI;

  // Helper functions for opportunity styling (must be defined before mapMarkers useMemo)
  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return '#10B981'; // Green
      case 'medium': return '#F59E0B'; // Yellow
      case 'low': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getOpportunityGradient = (opportunity: string) => {
    switch (opportunity) {
      case 'high': return 'from-emerald-400 to-green-600';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'low': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Memoize markers to prevent unnecessary re-renders
  const mapMarkers = useMemo(() => {
    if (!selectedCountry) return null;

    return (
      <>
        {/* Country Marker */}
        <Marker 
          anchor={selectedCountry.coordinates} 
          payload={selectedCountry}
          onClick={() => {
            setMapCenter(selectedCountry.coordinates);
            setCurrentZoom(5);
          }}
        >
          <div className="relative group cursor-pointer">
            <div className={`absolute -inset-4 rounded-full opacity-30 animate-pulse ${getOpportunityColor(selectedCountry.opportunity).replace('text-', 'bg-')}`}></div>
            <MapPin className={`w-8 h-8 drop-shadow-lg transform transition-transform group-hover:scale-110 ${getOpportunityColor(selectedCountry.opportunity)}`} />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {language === 'es' ? selectedCountry.countryName : selectedCountry.countryNameEn}
            </div>
          </div>
        </Marker>

        {/* Company Markers */}
        {companies.map((company) => {
           if (!company.coordinates) return null;
           return (
            <Marker 
              key={company.id} 
              anchor={company.coordinates} 
              payload={company}
              onClick={() => {
                setSelectedCompany(company);
                setShowCompanyDetails(true);
              }}
            >
              <div className="relative group cursor-pointer hover:z-50">
                <Building2 className={`w-6 h-6 ${company.verified ? 'text-blue-400' : 'text-slate-400'} drop-shadow-md transform transition-transform group-hover:scale-125`} />
                {company.verified && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-black">
                    <Check className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
            </Marker>
          );
        })}
      </>
    );
  }, [selectedCountry, companies, language]);

  // Get origin country data
  const originCountryData = countries.find(c => c.code === originCountry);
  
  // Function to get country coordinates safely using continental system
  const getCountryCoordinates = useCallback((countryCode: string): [number, number] => {
    // Try to get coordinates from continental system first
    try {
      const coords = getCoordinatesFromContinental(countryCode);
      if (coords) return coords;
    } catch (error) {
      console.warn('Continental coordinates not available, using fallback');
    }
    
    // Fallback coordinates organized by continents and commercial blocks
    const fallbackCoords: Record<string, [number, number]> = {
      // South America - MERCOSUR & Pacific Alliance
      'AR': [-38.4161, -63.6167], 'BR': [-14.2350, -51.9253], 'CL': [-35.6751, -71.5430],
      'CO': [4.5709, -74.2973], 'UY': [-32.5228, -55.7658], 'PY': [-23.4425, -58.4438],
      'PE': [-9.1900, -75.0152], 'EC': [-1.8312, -78.1834], 'BO': [-16.2902, -63.5887],
      'VE': [6.4238, -66.5897], 'GY': [4.8604, -58.9302], 'SR': [3.9193, -56.0278],
      
      // North America - USMCA
      'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528],
      
      // Europe - EU & EFTA
      'DE': [51.1657, 10.4515], 'FR': [46.6034, 1.8883], 'IT': [41.8719, 12.5674],
      'ES': [40.4637, -3.7492], 'NL': [52.1326, 5.2913], 'BE': [50.5039, 4.4699],
      'CH': [46.8182, 8.2275], 'NO': [60.4720, 8.4689], 'SE': [60.1282, 18.6435],
      'DK': [56.2639, 9.5018], 'FI': [61.9241, 25.7482], 'AT': [47.5162, 14.5501],
      'PL': [51.9194, 19.1451], 'CZ': [49.8175, 15.4730], 'HU': [47.1625, 19.5033],
      'RO': [45.9432, 24.9668], 'UK': [55.3781, -3.4360],
      
      // Asia - ASEAN & RCEP
      'CN': [35.8617, 104.1954], 'JP': [36.2048, 138.2529], 'KR': [35.9078, 127.7669],
      'IN': [20.5937, 78.9629], 'SG': [1.3521, 103.8198], 'MY': [4.2105, 101.9758],
      'TH': [15.8700, 100.9925], 'VN': [14.0583, 108.2772], 'ID': [-0.7893, 113.9213],
      'PH': [12.8797, 121.7740], 'KH': [12.5657, 104.9910], 'LA': [19.8563, 102.4955],
      'MM': [21.9162, 95.9560], 'BN': [4.5353, 114.7277],
      
      // Oceania - CPTPP
      'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860],
      
      // Africa - AfCFTA
      'ZA': [-30.5595, 22.9375], 'EG': [26.8206, 30.8025], 'NG': [9.0820, 8.6753],
      'KE': [-0.0236, 37.9062], 'MG': [-18.7669, 46.8691], 'MU': [-20.3484, 57.5522],
      'MZ': [-18.2435, 35.5291], 'ZW': [-19.0154, 29.1549], 'ZM': [-13.1339, 27.8493],
      'BW': [-22.3285, 24.6849], 'NA': [-22.9576, 18.4904], 'AO': [-11.2027, 17.8739],
      
      // Central America & Caribbean - SICA & CARICOM
      'CR': [9.7489, -83.7534], 'GT': [15.7835, -90.2308], 'PA': [8.5380, -80.7821],
      'SV': [13.7942, -88.8965], 'HN': [15.2000, -86.2419], 'NI': [12.8654, -85.2072],
      'BZ': [17.1899, -88.4976], 'JM': [18.1096, -77.2975], 'TT': [10.6918, -61.2225],
      'BB': [13.1939, -59.5432], 'CU': [21.5218, -77.7812], 'DO': [18.7357, -70.1627],
      
      // Middle East - GCC
      'SA': [23.8859, 45.0792], 'AE': [23.4241, 53.8478], 'QA': [25.3548, 51.1839],
      'KW': [29.3117, 47.4818], 'BH': [25.9304, 50.6378], 'OM': [21.5129, 55.9233],
      'IL': [31.0461, 34.8516], 'TR': [38.9637, 35.2433], 'IR': [32.4279, 53.6880],
      'IQ': [33.2232, 43.6793], 'JO': [30.5852, 36.2384], 'LB': [33.8547, 35.8623],
      'SY': [34.8021, 38.9968], 'YE': [15.5527, 48.5164]
    };
    
    return fallbackCoords[countryCode] || [20, 0]; // Default to world center
  }, []);
  
  // Ensure all recommendations have coordinates
  const enhancedRecommendations = (recommendations || []).map((rec: CountryRecommendation) => ({
    ...rec,
    coordinates: rec.coordinates || getCountryCoordinates(rec.countryCode)
  }));

  // Auto-zoom to selected country with smooth animation
  useEffect(() => {
    if (selectedCountry) {
      const coords = selectedCountry.coordinates || getCountryCoordinates(selectedCountry.countryCode);
      if (coords) {
      setIsZooming(true);
      setIsMapLoading(true);
      
      // Smooth transition to country location
      setTimeout(() => {
        setMapCenter(coords);
        setCurrentZoom(6); // Optimal zoom for country view
      }, 300);
      
      setTimeout(() => {
        setIsMapLoading(false);
        setIsZooming(false);
        setShowCompanyDetails(true);
      }, 1000);
      }
    } else {
      setShowCompanyDetails(false);
    }
  }, [selectedCountry, getCountryCoordinates]);

  // Generate company coordinates (simulated for demo)
  const getCompanyCoordinates = useCallback((country: CountryRecommendation, index: number): [number, number] => {
    const baseCoords = country.coordinates || getCountryCoordinates(country.countryCode);
    
    // Ensure we have valid coordinates
    if (!baseCoords || !Array.isArray(baseCoords) || baseCoords.length < 2) {
      return getCountryCoordinates(country.countryCode);
    }
    
    // Create realistic spread around major cities
    const angle = (index * 2.3) % (2 * Math.PI); // Distribute companies around country
    const distance = 0.1 + (index % 3) * 0.15; // Vary distance from center
    
    const lat = baseCoords[0] + Math.cos(angle) * distance;
    const lng = baseCoords[1] + Math.sin(angle) * distance;
    
    return [lat, lng];
  }, [getCountryCoordinates]);

  // Categorize countries by treaty relationship
  const categorizeCountryByTreaty = (country: CountryRecommendation) => {
    if (!originCountryData) return 'other';
    
    // Check if they share any trade treaty
    // Handle both treaties array and treatyBenefits from API
    const countryTreaties = country.treaties || [];
    const originTreaties = originCountryData.treaties || [];
    
    // Also check treatyBenefits if treaties array is empty
    let hasSharedTreaties = false;
    const sharedTreaties = countryTreaties.filter(treaty => 
      originTreaties.includes(treaty)
    );
    
    // If no direct treaty match, check if treatyBenefits indicates shared treaties
    if (sharedTreaties.length === 0 && country.treatyBenefits && country.treatyBenefits.length > 0) {
      // Check if any treatyBenefits contain keywords that indicate shared treaties
      const treatyKeywords = country.treatyBenefits.join(' ').toLowerCase();
      if (treatyKeywords.includes('mercosur') || treatyKeywords.includes('southern common market')) {
        hasSharedTreaties = true;
        if (originCountryData.treaties.includes('mercosur')) {
          return 'high_treaty';
        }
      }
      if (treatyKeywords.includes('aladi') || treatyKeywords.includes('latin american integration')) {
        hasSharedTreaties = true;
        if (originCountryData.treaties.includes('aladi')) {
          return 'medium_treaty';
        }
      }
      if (treatyKeywords.includes('unasur') || treatyKeywords.includes('union of south american')) {
        hasSharedTreaties = true;
        if (originCountryData.treaties.includes('unasur')) {
          return 'medium_treaty';
        }
      }
    }
    
    if (sharedTreaties.length > 0) {
      // Prioritize by treaty type importance
      if (sharedTreaties.includes('mercosur') || sharedTreaties.includes('eu') || sharedTreaties.includes('usmca')) {
        return 'high_treaty'; // Strong integration
      } else if (sharedTreaties.includes('cptpp') || sharedTreaties.includes('rcep') || sharedTreaties.includes('asean')) {
        return 'medium_treaty'; // Regional partnership
      } else {
        return 'basic_treaty'; // Basic agreement
      }
    }
    
    return hasSharedTreaties ? 'basic_treaty' : 'no_treaty';
  };

  // Optimized zoom levels for smooth satellite imagery
  const zoomLevels = [3, 4, 5, 6, 8, 10, 12, 14, 16, 18];

  // Optimized handlers with performance improvements
  const handleZoomIn = () => {
    setIsMapLoading(true);
    const currentIndex = zoomLevels.findIndex(level => level >= currentZoom);
    const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
    setCurrentZoom(zoomLevels[nextIndex]);
    setTimeout(() => setIsMapLoading(false), 300);
  };

  const handleZoomOut = () => {
    setIsMapLoading(true);
    const currentIndex = zoomLevels.findIndex(level => level >= currentZoom);
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentZoom(zoomLevels[prevIndex]);
    setTimeout(() => setIsMapLoading(false), 300);
  };

  const handleResetMap = () => {
    setIsMapLoading(true);
    setCurrentZoom(2);
    setMapCenter([20, 0]);
    setTimeout(() => setIsMapLoading(false), 500);
  };

  // Optimized map style changes
  const handleMapStyleChange = (style: MapStyle) => {
    setIsMapLoading(true);
    setMapStyle(style);
    setTimeout(() => setIsMapLoading(false), 300);
  };

  const handleBack = () => {
    navigate('/');
  };

  // Helper functions moved above to fix initialization order

  // Get treaty-based arrow styling
  const getTreatyArrowStyle = (treatyType: string) => {
    switch (treatyType) {
      case 'high_treaty':
        return {
          color: '#10B981', // Green - Strong integration
          strokeWidth: 3,
          arrowScale: 1.2,
          pulseColor: '#34D399'
        };
      case 'medium_treaty':
        return {
          color: '#3B82F6', // Blue - Regional partnership
          strokeWidth: 2.5,
          arrowScale: 1.1,
          pulseColor: '#60A5FA'
        };
      case 'basic_treaty':
        return {
          color: '#F59E0B', // Yellow - Basic agreement
          strokeWidth: 2,
          arrowScale: 1.0,
          pulseColor: '#FBBF24'
        };
      case 'no_treaty':
        return {
          color: '#6B7280', // Gray - No treaties
          strokeWidth: 1.5,
          arrowScale: 0.9,
          pulseColor: '#9CA3AF'
        };
      default:
        return {
          color: '#EF4444', // Red - Other
          strokeWidth: 1,
          arrowScale: 0.8,
          pulseColor: '#F87171'
        };
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'AR': '🇦🇷', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'UY': '🇺🇾',
      'PY': '🇵🇾', 'PE': '🇵🇪', 'EC': '🇪🇨', 'BO': '🇧🇴', 'VE': '🇻🇪',
      'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'UK': '🇬🇧', 'NL': '🇳🇱', 'BE': '🇧🇪',
      'CH': '🇨🇭', 'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳',
      'SG': '🇸🇬', 'MY': '🇲🇾', 'TH': '🇹🇭', 'VN': '🇻🇳', 'ID': '🇮🇩',
      'PH': '🇵🇭', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'ZA': '🇿🇦', 'EG': '🇪🇬',
      'NG': '🇳🇬', 'KE': '🇰🇪', 'SA': '🇸🇦', 'AE': '🇦🇪', 'IL': '🇮🇱',
      'TR': '🇹🇷'
    };
    return flags[countryCode] || '🌍';
  };

  // Show loading state
  if (isLoading || isLoadingCompanies) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Analizando datos comerciales...</h2>
          <p className="text-slate-400 mt-2">Buscando oportunidades para {selectedProduct}...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (recommendationsError || hasNavigationError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <Header />
        <div className="container mx-auto mt-12 max-w-2xl">
          <Card className="bg-slate-900 border-red-800">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                Error de Análisis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                {navigationErrorMessage || (recommendationsError as Error)?.message || "No se pudieron cargar los datos del análisis."}
              </p>
              <Button onClick={handleBack} variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="flex items-center bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Volver' : 'Back'}
            </Button>
          </div>
        </div>

        {/* Navigation Error Display */}
        {hasNavigationError && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-xl border border-red-400/30 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {language === 'es' ? 'Error de Navegación' : 'Navigation Error'}
                    </h3>
                    <p className="text-red-200 mb-4">
                      {language === 'es' 
                        ? 'Hay problemas con los parámetros de navegación. Por favor, regresa a la página principal e intenta de nuevo.'
                        : 'There are issues with the navigation parameters. Please go back to the main page and try again.'
                      }
                    </p>
                    <div className="flex items-center space-x-3">
                      <Button 
                        onClick={handleBack}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
                      </Button>
                      <Badge variant="outline" className="text-red-300 border-red-400">
                        {language === 'es' ? 'Detalles: ' : 'Details: '}{navigationErrorMessage}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Selections Display */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Country Selection */}
                {originCountryData && (
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <Flag className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-white/70 uppercase tracking-wide">
                        {language === 'es' ? 'País de Origen' : 'Origin Country'}
                      </p>
                      <p className="text-white font-bold flex items-center space-x-2">
                        <span className="text-xl">{getCountryFlag(originCountry)}</span>
                        <span>{language === 'es' ? originCountryData.name : originCountryData.nameEn}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Operation Type */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  {operation === 'import' ? (
                    <Download className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <Upload className="w-5 h-5 text-emerald-400" />
                  )}
                  <div>
                    <p className="text-xs text-white/70 uppercase tracking-wide">
                      {language === 'es' ? 'Operación' : 'Operation'}
                    </p>
                    <p className="text-white font-bold">
                      {operation === 'import' 
                        ? (language === 'es' ? 'IMPORTAR' : 'IMPORT')
                        : (language === 'es' ? 'EXPORTAR' : 'EXPORT')
                      }
                    </p>
                  </div>
                </div>
                
                {/* Product Selection */}
                {(selectedProduct || productName) && (
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-xs text-white/70 uppercase tracking-wide">
                        {language === 'es' ? 'Producto' : 'Product'}
                      </p>
                      <p className="text-white font-bold">
                        {productName || `HS ${selectedProduct}`}
                      </p>
                      {selectedProduct && (
                        <p className="text-xs text-white/60">
                          Código HS: {selectedProduct}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* AI Analysis Badge */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-purple-400/30">
                  <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                  <div>
                    <p className="text-xs text-purple-200 uppercase tracking-wide">
                      {language === 'es' ? 'Análisis IA' : 'AI Analysis'}
                    </p>
                    <p className="text-white font-bold">
                      {recommendations.length} {language === 'es' ? 'países analizados' : 'countries analyzed'}
                    </p>
                  </div>
{/* Companies List */}
{companies.length > 0 && (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-white mb-4">{language === 'es' ? 'Empresas relacionadas' : 'Related Companies'}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {companies.map(comp => (
        <Card key={comp.id} className="bg-gradient-to-br from-gray-800/70 to-purple-900/70 backdrop-blur-xl border border-white/20 hover:shadow-lg cursor-pointer" onClick={() => setSelectedCompany(comp)}>
          <CardHeader className="p-4">
            <CardTitle className="flex items-center">
              <span className="mr-2">{getCountryFlag(comp.country)} {countries.find(c => c.code === comp.country)?.[language === 'es' ? 'name' : 'nameEn']}</span>
              <Badge variant="outline" className="ml-2">{comp.type === 'importer' ? (language === 'es' ? 'IMPORTADOR' : 'IMPORTER') : (comp.type === 'exporter' ? (language === 'es' ? 'EXPORTADOR' : 'EXPORTER') : (language === 'es' ? 'IMPORT/EXPORT' : 'IMPORT/EXPORT'))}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-white font-medium">{comp.name}</p>
            {comp.creditRating && (
              <p className="text-sm text-gray-300">Rating: {comp.creditRating}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Details Panel */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gradient-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Users className="mr-3 w-6 h-6" />
                    {language === 'es' ? 'Detalles de Empresa' : 'Company Details'}
                    {selectedCompany.verified && (
                      <Badge className="ml-3 bg-green-500 text-white border-none">
                        {language === 'es' ? 'Verificada' : 'Verified'}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCompany(null)}
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Company Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCompany.name}</h2>
                  {selectedCompany.legalName && selectedCompany.legalName !== selectedCompany.name && (
                    <p className="text-gray-300 text-sm">{selectedCompany.legalName}</p>
                  )}
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <Badge className={`${
                      selectedCompany.type === 'importer' ? 'bg-cyan-600' :
                      selectedCompany.type === 'exporter' ? 'bg-emerald-600' : 'bg-purple-600'
                    } text-white`}>
                      {selectedCompany.type === 'importer' 
                        ? (language === 'es' ? 'IMPORTADOR' : 'IMPORTER')
                        : selectedCompany.type === 'exporter'
                        ? (language === 'es' ? 'EXPORTADOR' : 'EXPORTER')
                        : (language === 'es' ? 'IMPORTADOR/EXPORTADOR' : 'IMPORTER/EXPORTER')
                      }
                    </Badge>
                    <Badge variant="outline" className="text-white border-white/30">
                      {getCountryFlag(selectedCompany.country)} {countries.find(c => c.code === selectedCompany.country)?.[language === 'es' ? 'name' : 'nameEn']}
                    </Badge>
                  </div>
                </div>

                {/* Company Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCompany.businessType && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-sm">{language === 'es' ? 'Tipo de Negocio' : 'Business Type'}</p>
                      <p className="text-white font-medium">{selectedCompany.businessType}</p>
                    </div>
                  )}
                  
                  {selectedCompany.establishedYear && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-sm">{language === 'es' ? 'Año de Fundación' : 'Established Year'}</p>
                      <p className="text-white font-medium">{selectedCompany.establishedYear}</p>
                    </div>
                  )}
                  
                  {selectedCompany.employeeCount && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-sm">{language === 'es' ? 'Número de Empleados' : 'Employee Count'}</p>
                      <p className="text-white font-medium">{selectedCompany.employeeCount}+</p>
                    </div>
                  )}
                  
                  {selectedCompany.creditRating && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-gray-400 text-sm">{language === 'es' ? 'Calificación Crediticia' : 'Credit Rating'}</p>
                      <p className="font-bold" style={{
                        color: selectedCompany.creditRating.startsWith('A') ? '#10B981' : 
                              selectedCompany.creditRating.startsWith('B') ? '#F59E0B' : '#EF4444'
                      }}>
                        {selectedCompany.creditRating}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                {/* Contact Information with Paywall */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white flex items-center justify-between">
                    <span className="flex items-center">
                      📞 {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
                    </span>
                    {!isPremium && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/50 text-xs">
                        {language === 'es' ? 'PREMIUM' : 'PREMIUM'}
                      </Badge>
                    )}
                  </h3>
                  
                  {isPremium ? (
                    // Premium View: Full Contact Info
                    <div className="space-y-2">
                      {selectedCompany.contactEmail && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">{language === 'es' ? 'Email:' : 'Email:'}</span> {selectedCompany.contactEmail}
                        </p>
                      )}
                      {selectedCompany.phone && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">{language === 'es' ? 'Teléfono:' : 'Phone:'}</span> {selectedCompany.phone}
                        </p>
                      )}
                      {selectedCompany.website && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">{language === 'es' ? 'Sitio Web:' : 'Website:'}</span> 
                          <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                            {selectedCompany.website}
                          </a>
                        </p>
                      )}
                      {selectedCompany.contactPerson && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">{language === 'es' ? 'Persona de Contacto:' : 'Contact Person:'}</span> {selectedCompany.contactPerson}
                        </p>
                      )}
                    </div>
                  ) : (
                    // Demo View: Paywall
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700 text-center relative overflow-hidden group">
                      {/* Blur Effect Overlay */}
                      <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0"></div>
                      
                      <div className="relative z-10">
                        <div className="flex justify-center mb-3">
                          <div className="p-3 bg-slate-800 rounded-full border border-slate-600 shadow-lg">
                            <Users className="w-6 h-6 text-slate-400" />
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-4">
                          {language === 'es' 
                            ? 'Los datos de contacto están reservados para usuarios Premium.' 
                            : 'Contact details are reserved for Premium users.'}
                        </p>
                        <Button 
                          onClick={() => setShowSubscriptionModal(true)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold shadow-lg shadow-orange-900/20"
                        >
                          {language === 'es' ? '🔓 Ver Contacto' : '🔓 View Contact'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Products */}
                {selectedCompany.products && selectedCompany.products.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      📦 {language === 'es' ? 'Productos' : 'Products'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.products.map((product, index) => (
                        <Badge key={index} variant="outline" className="text-white border-white/30">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {selectedCompany.certifications && selectedCompany.certifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      🏆 {language === 'es' ? 'Certificaciones' : 'Certifications'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.certifications.map((cert, index) => (
                        <Badge key={index} className="bg-green-600 text-white">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-white/20">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => !isPremium && setShowSubscriptionModal(true)}
                  >
                    {language === 'es' ? '📧 Contactar' : '📧 Contact'}
                  </Button>
                  <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10">
                    {language === 'es' ? '📊 Ver Perfil Completo' : '📊 View Full Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Modern Satellite Map - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl h-[600px]">
              <CardHeader className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm text-white border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-xl">
                    <Globe className="mr-3 w-6 h-6 animate-pulse" />
                    {language === 'es' 
                      ? `🛰️ Mapa Satelital Inteligente`
                      : `🛰️ Smart Satellite Map`
                    }
                    {recommendations.length > 0 && (
                      <Badge className="ml-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                        {recommendations.length} {language === 'es' ? 'países' : 'countries'}
                      </Badge>
                    )}
                    {selectedCountry && (
                      <Badge className={`ml-2 text-white border-none ${
                        dataSource === 'government' 
                          ? 'bg-green-600 animate-pulse' 
                          : 'bg-blue-600'
                      }`}>
                        {dataSource === 'government' 
                          ? (language === 'es' ? '🏛️ Datos Oficiales' : '🏛️ Official Data')
                          : (language === 'es' ? '💼 Base Interna' : '💼 Internal DB')
                        }
                      </Badge>
                    )}
                  </CardTitle>
                  
                  {/* Modern Map Controls */}
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomIn}
                          disabled={currentZoom >= 18}
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === 'es' ? 'Acercar - Vista Satelital' : 'Zoom In - Satellite View'}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleZoomOut}
                          disabled={currentZoom <= 2}
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === 'es' ? 'Alejar' : 'Zoom Out'}
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetMap}
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === 'es' ? 'Vista Global' : 'Global View'}
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Enhanced zoom level indicator */}
                    <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1 text-xs text-white shadow-xl">
                      🛰️ {currentZoom.toFixed(1)}x {isMapLoading && '⟳'}
                    </div>
                    
                    {/* Map Style Selector */}
                    <div className="flex items-center space-x-1 ml-2">
                      {Object.keys(mapProviders).map((style) => (
                        <Tooltip key={style}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMapStyleChange(style as MapStyle)}
                              className={`${mapStyle === style ? 'bg-white/30 border-white/50' : 'bg-white/10 border-white/20'} backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-200 px-2 py-1 text-xs`}
                            >
                              {style === 'satellite' ? '🛰️' : 
                               style === 'street' ? '🗺️' : 
                               style === 'clean' ? '🌐' : '📍'}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {style === 'satellite' ? 'Satellite' : 
                             style === 'street' ? 'Street Map' : 
                             style === 'clean' ? 'Clean Map' : 'OpenStreetMap'}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[500px] relative p-0 bg-gradient-to-br from-slate-900 to-indigo-900">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white/80 text-lg">
                        {language === 'es' ? 'Analizando países...' : 'Analyzing countries...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Modern Satellite Map */}
                    {/* Performance Loading Overlay */}
                    {isMapLoading && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-white/90 text-sm font-medium">
                            {language === 'es' ? '🛰️ Optimizando vista...' : '🛰️ Optimizing view...'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* High-Performance Satellite Map */}
                    <Map
                      center={mapCenter}
                      zoom={currentZoom}
                      width={800}
                      height={500}
                      provider={mapProviders[mapStyle]}
                      animate={true}
                      animateMaxScreens={3}
                      zoomSnap={false}
                      mouseEvents={true}
                      touchEvents={true}
                      limitBounds="edge"
                      onBoundsChanged={({ center, zoom }: { center: [number, number], zoom: number }) => {
                        if (!isZooming) {
                          setMapCenter(center);
                          setCurrentZoom(zoom);
                        }
                      }}
                      attribution={false}
                      dprs={[1, 2]}
                    >
                    {mapMarkers}
                      {/* PERFECTLY COORDINATED GPS Markers - Optimized for Performance */}
                      {(recommendations || []).map((country, index) => {
                        const treatyType = categorizeCountryByTreaty(country);
                        const treatyStyle = getTreatyArrowStyle(treatyType);
                        
                        return (
                          <Overlay
                            key={`gps-marker-${country.countryCode}-${country.coordinates?.[0] || 0}-${country.coordinates?.[1] || 0}`}
                            anchor={country.coordinates || getCountryCoordinates(country.countryCode)}
                            offset={[0, 0]}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="relative cursor-pointer transition-all duration-150 hover:scale-110 hover:z-50"
                                  onClick={() => {
                                    if (selectedCountry?.countryCode === country.countryCode) {
                                      // Deselect if same country clicked
                                      setSelectedCountry(null);
                                      setSelectedCompany(null);
                                      handleResetMap();
                                    } else {
                                      // Select new country
                                      setSelectedCountry(country);
                                      setSelectedCompany(null);
                                    }
                                  }}
                                  style={{
                                    transform: 'translate(-50%, -100%)', // Perfect GPS pin pointing
                                    width: '32px',
                                    height: '40px',
                                    zIndex: selectedCountry?.countryCode === country.countryCode ? 1000 : 100
                                  }}
                                >
                                  {/* High-Performance GPS Pin */}
                                  <div 
                                    className={`w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-sm font-bold backdrop-blur-sm ${
                                      selectedCountry?.countryCode === country.countryCode ? 'ring-4 ring-yellow-400' : ''
                                    }`}
                                    style={{
                                      backgroundColor: selectedCountry?.countryCode === country.countryCode 
                                        ? '#FFD700' 
                                        : treatyStyle.color,
                                      boxShadow: selectedCountry?.countryCode === country.countryCode
                                        ? '0 0 30px #FFD700, 0 0 60px #FFD70080'
                                        : `0 4px 20px ${treatyStyle.pulseColor}60, 0 0 0 0px ${treatyStyle.pulseColor}40`,
                                      transition: 'all 0.2s ease-in-out'
                                    }}
                                  >
                                    {getCountryFlag(country.countryCode)}
                                  </div>
                                  
                                  {/* Precision pointing arrow */}
                                  <div 
                                    className="absolute w-0 h-0"
                                    style={{ 
                                      borderLeft: '4px solid transparent',
                                      borderRight: '4px solid transparent',
                                      borderTop: `8px solid ${treatyStyle.color}`,
                                      left: '50%',
                                      top: '30px',
                                      transform: 'translateX(-50%)',
                                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                    }}
                                  ></div>
                                  
                                  {/* Enhanced opportunity indicator */}
                                  <div 
                                    className="absolute w-3 h-3 rounded-full border border-white shadow-lg animate-pulse"
                                    style={{ 
                                      backgroundColor: getOpportunityColor(country.opportunity),
                                      top: '-3px',
                                      right: '-3px',
                                      boxShadow: `0 0 8px ${getOpportunityColor(country.opportunity)}80`
                                    }}
                                  ></div>
                                  
                                  {/* Premium ranking badge */}
                                  {index < 3 && (
                                    <div 
                                      className="absolute w-5 h-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse"
                                      style={{
                                        bottom: '-4px',
                                        left: '-4px',
                                        fontSize: '10px'
                                      }}
                                    >
                                      {index + 1}
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black/90 text-white p-3 rounded-lg border border-white/20 backdrop-blur-sm max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-bold text-lg">
                                    {getCountryFlag(country.countryCode)} {language === 'es' ? country.countryName : country.countryNameEn}
                                  </p>
                                  <p className="text-sm text-blue-300">
                                    {language === 'es' ? 'Oportunidad' : 'Opportunity'}: 
                                    <span className="font-bold ml-1" style={{ color: getOpportunityColor(country.opportunity) }}>
                                      {country.opportunity?.toUpperCase() || 'N/A'}
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {language === 'es' ? 'Puntuación' : 'Score'}: {country.score}/100
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {language === 'es' ? 'Empresas' : 'Companies'}: {country.companyCount}
                                  </p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </Overlay>
                        );
                      })}

                      {/* Company Markers - Show when country is selected */}
                      {selectedCountry && showCompanyDetails && companies.map((company, index) => {
                        const companyCoords = getCompanyCoordinates(selectedCountry, index);
                        
                        return (
                          <Overlay
                            key={`company-marker-${company.id}-${index}`}
                            anchor={companyCoords}
                            offset={[0, 0]}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="relative cursor-pointer transition-all duration-200 hover:scale-110 hover:z-50"
                                  onClick={() => setSelectedCompany(company)}
                                  style={{
                                    transform: 'translate(-50%, -100%)',
                                    zIndex: selectedCompany?.id === company.id ? 1000 : 200
                                  }}
                                >
                                  {/* Company Building Icon */}
                                  <div 
                                    className={`w-6 h-6 rounded-lg border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold backdrop-blur-sm ${
                                      selectedCompany?.id === company.id ? 'ring-2 ring-blue-400' : ''
                                    }`}
                                    style={{
                                      backgroundColor: selectedCompany?.id === company.id 
                                        ? '#3B82F6' 
                                        : company.verified ? '#10B981' : '#F59E0B',
                                      transition: 'all 0.2s ease-in-out'
                                    }}
                                  >
                                    🏢
                                  </div>
                                  
                                  {/* Company verification indicator */}
                                  {company.verified && (
                                    <div 
                                      className="absolute w-2 h-2 rounded-full bg-green-400 border border-white shadow-sm"
                                      style={{ 
                                        top: '-2px',
                                        right: '-2px'
                                      }}
                                    ></div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black/90 text-white p-3 rounded-lg border border-white/20 backdrop-blur-sm max-w-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="font-bold text-base text-white">
                                      {company.name}
                                    </p>
                                    <div className="flex items-center space-x-1">
                                      {dataSource === 'government' && (
                                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                                          {language === 'es' ? '🏛️ Oficial' : '🏛️ Official'}
                                        </span>
                                      )}
                                      {company.verified && (
                                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                                          {language === 'es' ? 'Verificado' : 'Verified'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1 text-sm">
                                    <p className="text-blue-300">
                                      {language === 'es' ? 'Tipo:' : 'Type:'} 
                                      <span className="font-medium ml-1 text-white">
                                        {company.type === 'importer' 
                                          ? (language === 'es' ? 'Importador' : 'Importer')
                                          : company.type === 'exporter'
                                          ? (language === 'es' ? 'Exportador' : 'Exporter')
                                          : (language === 'es' ? 'Ambos' : 'Both')
                                        }
                                      </span>
                                    </p>
                                    
                                    {company.businessType && (
                                      <p className="text-gray-300 text-xs">
                                        {language === 'es' ? 'Negocio:' : 'Business:'} {company.businessType}
                                      </p>
                                    )}
                                    
                                    {company.establishedYear && (
                                      <p className="text-gray-300 text-xs">
                                        {language === 'es' ? 'Establecido:' : 'Established:'} {company.establishedYear}
                                      </p>
                                    )}
                                    
                                    {company.employeeCount && (
                                      <p className="text-gray-300 text-xs">
                                        {language === 'es' ? 'Empleados:' : 'Employees:'} {company.employeeCount}+
                                      </p>
                                    )}
                                    
                                    {company.creditRating && (
                                      <p className="text-gray-300 text-xs">
                                        {language === 'es' ? 'Calificación:' : 'Rating:'} 
                                        <span className="font-bold ml-1" style={{
                                          color: company.creditRating.startsWith('A') ? '#10B981' : 
                                                company.creditRating.startsWith('B') ? '#F59E0B' : '#EF4444'
                                        }}>
                                          {company.creditRating}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                  
                                  <div className="text-xs text-cyan-300 border-t border-white/20 pt-2">
                                    {language === 'es' ? '🖱️ Clic para más detalles' : '🖱️ Click for more details'}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </Overlay>
                        );
                      })}
                    </Map>

                    {/* Modern Map Controls and Style Selector */}
                    <div className="absolute top-4 left-4 space-y-3">
                      {/* Map Style Selector */}
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/20">
                        <p className="text-white text-xs font-medium mb-2">
                          {language === 'es' ? 'Estilo de Mapa' : 'Map Style'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleMapStyleChange('satellite')}
                            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                              mapStyle === 'satellite'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/20 text-white/80 hover:bg-white/30'
                            }`}
                          >
                            🛰️ {language === 'es' ? 'Satélite' : 'Satellite'}
                          </button>
                          <button
                            onClick={() => handleMapStyleChange('street')}
                            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                              mapStyle === 'street'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/20 text-white/80 hover:bg-white/30'
                            }`}
                          >
                            🗺️ {language === 'es' ? 'Calles' : 'Streets'}
                          </button>
                          <button
                            onClick={() => handleMapStyleChange('clean')}
                            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                              mapStyle === 'clean'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/20 text-white/80 hover:bg-white/30'
                            }`}
                          >
                            ✨ {language === 'es' ? 'Limpio' : 'Clean'}
                          </button>
                          <button
                            onClick={() => handleMapStyleChange('osm')}
                            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                              mapStyle === 'osm'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white/20 text-white/80 hover:bg-white/30'
                            }`}
                          >
                            🌍 OSM
                          </button>
                        </div>
                      </div>
                      
                      {/* Enhanced Legend */}
                      <div className="bg-black/60 backdrop-blur-md rounded-lg p-3 text-white text-xs border border-white/20">
                        <p className="font-bold mb-2 text-blue-300">
                          {language === 'es' ? 'Oportunidades de Inversión' : 'Investment Opportunities'}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                            <span>{language === 'es' ? 'Alta oportunidad' : 'High opportunity'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
                            <span>{language === 'es' ? 'Media oportunidad' : 'Medium opportunity'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                            <span>{language === 'es' ? 'Baja oportunidad' : 'Low opportunity'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/70 pt-2 mt-2 border-t border-white/20">
                          <span>Zoom: {currentZoom}</span>
                          <span className="text-blue-300">
                            📍 {recommendations.length} {language === 'es' ? 'países' : 'countries'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Country Details Panel */}
          <div className="space-y-6">
            {selectedCountry ? (
              <>
                {/* Selected Country Details */}
                <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center text-2xl text-white">
                      <span className="text-4xl mr-3">{getCountryFlag(selectedCountry.countryCode)}</span>
                      {language === 'es' ? selectedCountry.countryName : selectedCountry.countryNameEn}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Opportunity Score */}
                    <div className="text-center">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold bg-gradient-to-r ${getOpportunityGradient(selectedCountry.opportunity)}`}>
                        <Star className="w-5 h-5 mr-2" />
                        {selectedCountry.score}/100 - {language === 'es' ? 'Oportunidad' : 'Opportunity'} {selectedCountry.opportunity?.toUpperCase() || 'N/A'}
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <Users className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                        <p className="text-white font-bold text-lg">{selectedCountry.companyCount}</p>
                        <p className="text-white/70 text-xs">{language === 'es' ? 'Empresas' : 'Companies'}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <TrendingUp className="w-6 h-6 mx-auto text-green-400 mb-2" />
                        <p className="text-white font-bold text-lg">{selectedCountry.growth}</p>
                        <p className="text-white/70 text-xs">{language === 'es' ? 'Crecimiento' : 'Growth'}</p>
                      </div>
                    </div>

                    {/* Treaties */}
                    <div>
                      <h4 className="text-white font-bold mb-2 text-sm">
                        {language === 'es' ? 'Tratados Comerciales' : 'Trade Treaties'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountry.treaties?.map((treaty) => (
                          <Badge key={treaty} variant="secondary" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                            {treaty.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Advantages */}
                    <div>
                      <h4 className="text-white font-bold mb-2 text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        {language === 'es' ? 'Ventajas' : 'Advantages'}
                      </h4>
                      <div className="space-y-2">
                        {selectedCountry.advantages?.map((advantage, index) => (
                          <div key={index} className="bg-green-500/10 border border-green-500/20 rounded-lg p-2">
                            <p className="text-green-200 text-xs">
                              {language === 'es' ? advantage.reason : advantage.reasonEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disadvantages */}
                    {selectedCountry.disadvantages && selectedCountry.disadvantages.length > 0 && (
                      <div>
                        <h4 className="text-white font-bold mb-2 text-sm flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                          {language === 'es' ? 'Consideraciones' : 'Considerations'}
                        </h4>
                        <div className="space-y-2">
                          {selectedCountry.disadvantages?.map((disadvantage, index) => (
                            <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                              <p className="text-yellow-200 text-xs">
                                {language === 'es' ? disadvantage.reason : disadvantage.reasonEn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        // Check if user is premium
                        if (!isPremium) {
                          // Show subscription modal for demo users
                          setShowSubscriptionModal(true);
                          return;
                        }
                        
                        // Premium users can access the company map
                        const params = new URLSearchParams({
                          country: selectedCountry.countryCode,
                          operation: operation,
                          hsCode: selectedProduct || '',
                          productName: productName || '',
                          originCountry: originCountry || ''
                        });
                        navigate(`/company-map?${params.toString()}`);
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 relative group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {!isPremium && (
                          <span className="text-yellow-300">🔒</span>
                        )}
                        {language === 'es' ? 'Ver Empresas en Mapa' : 'View Companies on Map'}
                        {!isPremium && (
                          <Badge className="bg-yellow-500 text-black text-xs ml-2">
                            PREMIUM
                          </Badge>
                        )}
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-white/60 mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">
                    {language === 'es' ? 'Selecciona un País' : 'Select a Country'}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {language === 'es' 
                      ? 'Haz clic en cualquier marcador del mapa para ver detalles de oportunidad de inversión'
                      : 'Click on any map marker to see investment opportunity details'
                    }
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Rankings */}
            <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {language === 'es' ? '🏆 Top Oportunidades' : '🏆 Top Opportunities'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.slice(0, 5).map((country, index) => (
                  <div
                    key={country.countryCode}
                    className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-200"
                    onClick={() => setSelectedCountry(country)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{getCountryFlag(country.countryCode)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                          {language === 'es' ? country.countryName : country.countryNameEn}
                        </p>
                        <div className="flex items-center text-xs text-white/70">
                          <span>{country.score}/100</span>
                          <span className="mx-1">•</span>
                          <span className={
                            country.opportunity === 'high' ? 'text-emerald-400' :
                            country.opportunity === 'medium' ? 'text-yellow-400' :
                            'text-red-400'
                          }>
                            {country.opportunity ? (language === 'es' ? 
                              (country.opportunity === 'high' ? 'Alta' : country.opportunity === 'medium' ? 'Media' : 'Baja') : 
                              country.opportunity.toUpperCase()) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      className="text-xs ml-2"
                      style={{ backgroundColor: getOpportunityColor(country.opportunity) }}
                    >
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SubscriptionModal 
        open={showSubscriptionModal} 
        onOpenChange={setShowSubscriptionModal} 
      />
    </div>
  );
}