import { useState, useEffect } from "react";
import { Search, Info, MapPin, Zap, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import type { HsChapter, HsPartida } from "@shared/schema";
import CommercialOpportunitiesPanel from "./commercial-opportunities-panel";

export default function HsCodeLookup() {
  const { language, t } = useLanguage();
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedPartida, setSelectedPartida] = useState<HsPartida | null>(null);
  const [operationType, setOperationType] = useState<"importer" | "exporter">("importer");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showOpportunities, setShowOpportunities] = useState(false);
  const [finalSelection, setFinalSelection] = useState<{
    hsCode: string;
    productName: string;
    originCountry: string;
    operationType: "importer" | "exporter";
  } | null>(null);

  const { data: chapters = [] } = useQuery<HsChapter[]>({
    queryKey: ["/api/hs-chapters"],
  });

  const { data: partidas = [] } = useQuery<HsPartida[]>({
    queryKey: ["/api/hs-partidas", selectedChapter],
    enabled: !!selectedChapter,
  });

  // Enhanced search with continental intelligence
  const { data: enhancedSearchResults } = useQuery({
    queryKey: ["/api/hs-search", searchQuery, selectedCountry, operationType],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 3) return null;
      const params = new URLSearchParams({
        q: searchQuery,
        ...(selectedCountry && { country: selectedCountry }),
        ...(operationType && { operation: operationType })
      });
      const response = await fetch(`/api/hs-search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: searchQuery.length >= 3,
  });

  // Countries list for enhanced search (sorted alphabetically)
  const countries = [
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America' },
    { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
    { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
    { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'South America' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
    { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'South America' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', region: 'South America' },
  ];

  const handleChapterSelect = (chapterCode: string) => {
    setSelectedChapter(chapterCode);
    setSelectedPartida(null);
  };

  const handlePartidaSelect = (partida: HsPartida) => {
    setSelectedPartida(partida);
  };

  const handleProceedToOpportunities = () => {
    if (selectedPartida && selectedCountry) {
      setFinalSelection({
        hsCode: selectedPartida.code,
        productName: language === "es" ? selectedPartida.description : selectedPartida.descriptionEn,
        originCountry: selectedCountry,
        operationType: operationType
      });
      setShowOpportunities(true);
    }
  };

  const handleBackToSearch = () => {
    setShowOpportunities(false);
    setFinalSelection(null);
  };

  // Update search results when enhanced search completes
  useEffect(() => {
    if (enhancedSearchResults) {
      setSearchResults(enhancedSearchResults);
    }
  }, [enhancedSearchResults]);

  // Show Commercial Opportunities Panel if user has made selections
  if (showOpportunities && finalSelection) {
    return (
      <div className="space-y-4">
        <Button 
          onClick={handleBackToSearch}
          variant="outline"
          className="mb-4"
        >
          ← Back to Product Search
        </Button>
        <CommercialOpportunitiesPanel
          hsCode={finalSelection.hsCode}
          productName={finalSelection.productName}
          originCountry={finalSelection.originCountry}
          operationType={finalSelection.operationType}
        />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Zap className="mr-3 text-kora-primary w-6 h-6" />
          {t("hsLookup.title")} - Continental Intelligence
        </h3>
        <div className="flex space-x-2">
          <Button
            variant={operationType === "importer" ? "default" : "outline"}
            onClick={() => setOperationType("importer")}
            className={operationType === "importer" ? "bg-kora-primary text-white" : ""}
          >
            {t("hsLookup.importer")}
          </Button>
          <Button
            variant={operationType === "exporter" ? "default" : "outline"}
            onClick={() => setOperationType("exporter")}
            className={operationType === "exporter" ? "bg-kora-primary text-white" : ""}
          >
            {t("hsLookup.exporter")}
          </Button>
        </div>
      </div>

      {/* Enhanced Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Country Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Country Context (Optional)
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country for better results" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No country filter</SelectItem>
              {countries.map(country => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag} {country.name} ({country.region})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Search Type Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Intelligence
          </label>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800">
              ✨ Enhanced with 875 companies data
              {selectedCountry && (
                <div className="text-xs text-blue-600 mt-1">
                  🎯 Optimized for {countries.find(c => c.code === selectedCountry)?.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Search Bar */}
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search: 'smartphone', 'telefono', 'computadora', 'cafe', 'petroleo', or HS codes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 text-base"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
        
        {/* Search Status */}
        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <div className="text-xs text-gray-500 mt-1">
            Type at least 3 characters for intelligent search
          </div>
        )}
        {searchQuery.length >= 3 && (
          <div className="text-xs text-green-600 mt-1">
            🧠 Continental intelligence active - searching 875 companies database
          </div>
        )}
      </div>

      {/* Enhanced Search Results */}
      {searchResults && searchQuery.length >= 3 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-blue-600" />
            Enhanced Search Results
          </h4>
          
          {/* Smart Partidas Results */}
          {searchResults.partidas && searchResults.partidas.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 mb-2">🎯 Recommended HS Codes:</h5>
              <div className="grid gap-2">
                {searchResults.partidas.slice(0, 5).map((partida: any) => (
                  <div 
                    key={partida.id}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => handlePartidaSelect(partida)}
                  >
                    <div className="font-medium text-blue-700">
                      {partida.code} - {language === "es" ? partida.description : partida.descriptionEn}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Tariff: {partida.tariffRate}% {selectedCountry && `• Relevant for ${countries.find(c => c.code === selectedCountry)?.flag} ${countries.find(c => c.code === selectedCountry)?.name}`}
                    </div>
                    {selectedCountry && (
                      <Button 
                        size="sm" 
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPartida(partida);
                          handleProceedToOpportunities();
                        }}
                      >
                        Find Commercial Opportunities
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chapters Results */}
          {searchResults.chapters && searchResults.chapters.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-800 mb-2">📂 Related Categories:</h5>
              <div className="flex flex-wrap gap-2">
                {searchResults.chapters.slice(0, 4).map((chapter: any) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleChapterSelect(chapter.code)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {chapter.code} - {language === "es" ? chapter.description.slice(0, 30) : chapter.descriptionEn.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.partidas && searchResults.partidas.length === 0 && 
           searchResults.chapters && searchResults.chapters.length === 0 && (
            <div className="text-gray-600 text-center py-4">
              No results found. Try different keywords or check spelling.
              <br />
              <span className="text-sm">Common searches: smartphone, computer, coffee, oil, wine, meat</span>
            </div>
          )}
        </div>
      )}
      
      {/* HS Classification Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chapters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("hsLookup.chapters")}
          </label>
          <div className="bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedChapter === chapter.code ? "bg-blue-50" : ""
                }`}
                onClick={() => handleChapterSelect(chapter.code)}
              >
                <div className="font-medium text-gray-900">
                  {chapter.code} - {language === "es" ? chapter.description : chapter.descriptionEn}
                </div>
                <div className="text-sm text-gray-500">
                  {partidas.filter(p => p.chapterCode === chapter.code).length} {t("hsLookup.partidas")}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Partidas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("hsLookup.partidas")}
          </label>
          <div className="bg-white border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
            {selectedChapter ? (
              partidas.map((partida) => (
                <div
                  key={partida.id}
                  className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedPartida?.id === partida.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handlePartidaSelect(partida)}
                >
                  <div className="font-medium text-gray-900">
                    {partida.code} - {language === "es" ? partida.description : partida.descriptionEn}
                  </div>
                  <div className="text-sm text-gray-500">
                    {t("hsLookup.tariff")}: {partida.tariffRate}%
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                {t("hsLookup.selectChapter")}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Selected Item Info */}
      {selectedPartida && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="text-kora-primary mt-1 w-5 h-5" />
            <div>
              <h4 className="font-medium text-gray-900">{selectedPartida.code}</h4>
              <p className="text-sm text-gray-600 mb-2">
                {language === "es" ? selectedPartida.description : selectedPartida.descriptionEn}
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-gray-600">
                  {t("hsLookup.tariff")}: <span className="font-medium">{selectedPartida.tariffRate}%</span>
                </span>
                <span className="text-gray-600">
                  IVA: <span className="font-medium">21%</span>
                </span>
                <span className="text-gray-600">
                  {t("hsLookup.statistics")}: <span className="font-medium">0.5%</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
