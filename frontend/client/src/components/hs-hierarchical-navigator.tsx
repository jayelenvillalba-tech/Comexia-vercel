import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Book, 
  FileText, 
  List,
  Target,
  Hash,
  Info,
  Package,
  ArrowRight,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { HsSection, HsChapter, HsPartida, HsSubpartida } from "@shared/schema";

interface HsHierarchicalNavigatorProps {
  onProductSelected?: (product: HsSubpartida) => void;
  onPartidaSelected?: (partida: HsPartida) => void;
}

export default function HsHierarchicalNavigator({ onProductSelected, onPartidaSelected }: HsHierarchicalNavigatorProps = {}) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedPartidas, setExpandedPartidas] = useState<Set<string>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [selectedPartida, setSelectedPartida] = useState<string>("");
  const [selectedSubpartida, setSelectedSubpartida] = useState<HsSubpartida | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("navigate");

  // Fetch sections
  const { data: sections = [] } = useQuery<HsSection[]>({
    queryKey: ["/api/hs-sections"],
    queryFn: async () => {
      const response = await fetch("/api/hs-sections");
      if (!response.ok) throw new Error("Failed to fetch sections");
      return response.json();
    },
  });

  // Fetch chapters for selected section
  const { data: chapters = [] } = useQuery<HsChapter[]>({
    queryKey: ["/api/hs-chapters", selectedSection],
    queryFn: async () => {
      const url = selectedSection 
        ? `/api/hs-chapters?section=${selectedSection}`
        : "/api/hs-chapters";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      return response.json();
    },
  });

  // Fetch partidas for selected chapter
  const { data: partidas = [] } = useQuery<HsPartida[]>({
    queryKey: ["/api/hs-partidas", selectedChapter],
    queryFn: async () => {
      const response = await fetch(`/api/hs-partidas/${selectedChapter}`);
      if (!response.ok) throw new Error("Failed to fetch partidas");
      return response.json();
    },
    enabled: !!selectedChapter,
  });

  // Fetch subpartidas for selected partida
  const { data: subpartidas = [] } = useQuery<HsSubpartida[]>({
    queryKey: ["/api/hs-subpartidas", selectedPartida],
    queryFn: async () => {
      const response = await fetch(`/api/hs-subpartidas/${selectedPartida}`);
      if (!response.ok) throw new Error("Failed to fetch subpartidas");
      return response.json();
    },
    enabled: !!selectedPartida,
  });

  // Search across all levels
  const { data: searchResults } = useQuery<{sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]}>({
    queryKey: ["/api/hs-search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`/api/hs-search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search");
      return response.json();
    },
    enabled: searchQuery.length > 2,
  });

  const toggleSection = (sectionCode: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionCode)) {
      newExpanded.delete(sectionCode);
      setSelectedSection("");
      setSelectedChapter("");
      setSelectedPartida("");
    } else {
      newExpanded.add(sectionCode);
      setSelectedSection(sectionCode);
    }
    setExpandedSections(newExpanded);
  };

  const toggleChapter = (chapterCode: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterCode)) {
      newExpanded.delete(chapterCode);
      setSelectedChapter("");
      setSelectedPartida("");
    } else {
      newExpanded.add(chapterCode);
      setSelectedChapter(chapterCode);
    }
    setExpandedChapters(newExpanded);
  };

  const togglePartida = (partidaCode: string) => {
    const newExpanded = new Set(expandedPartidas);
    if (newExpanded.has(partidaCode)) {
      newExpanded.delete(partidaCode);
      setSelectedPartida("");
    } else {
      newExpanded.add(partidaCode);
      setSelectedPartida(partidaCode);
    }
    setExpandedPartidas(newExpanded);
  };

  const selectSubpartida = (subpartida: HsSubpartida) => {
    setSelectedSubpartida(subpartida);
    
    // Show success message
    toast({
      title: language === 'en' ? 'Product Selected!' : '¡Producto Seleccionado!',
      description: `${subpartida.code} - ${language === 'en' ? subpartida.descriptionEn : subpartida.description}`,
    });
    
    // Auto-navigate to company map when product is selected
    if (onProductSelected) {
      setTimeout(() => {
        onProductSelected(subpartida);
      }, 1000); // Small delay to show selection feedback
    }
  };

  const resetNavigation = () => {
    setExpandedSections(new Set());
    setExpandedChapters(new Set());
    setExpandedPartidas(new Set());
    setSelectedSection("");
    setSelectedChapter("");
    setSelectedPartida("");
    setSelectedSubpartida(null);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Layers className="mr-3 text-blue-600 w-6 h-6" />
          {language === 'en' ? 'HS Code Navigator' : 'Navegador Código HS'}
        </h3>
        <Button onClick={resetNavigation} variant="outline" size="sm">
          <Target className="w-4 h-4 mr-2" />
          {language === 'en' ? 'Reset' : 'Reiniciar'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="navigate">
            <List className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Navigate' : 'Navegar'}
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Search' : 'Buscar'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="navigate" className="mt-6 space-y-4">
          {/* Breadcrumb */}
          {(selectedSection || selectedChapter || selectedPartida || selectedSubpartida) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Layers className="w-4 h-4" />
              <span>{language === 'en' ? 'Navigation:' : 'Navegación:'}</span>
              {selectedSection && (
                <>
                  <ArrowRight className="w-3 h-3" />
                  <Badge variant="outline">{language === 'en' ? 'Section' : 'Sección'} {selectedSection}</Badge>
                </>
              )}
              {selectedChapter && (
                <>
                  <ArrowRight className="w-3 h-3" />
                  <Badge variant="outline">{language === 'en' ? 'Chapter' : 'Capítulo'} {selectedChapter}</Badge>
                </>
              )}
              {selectedPartida && (
                <>
                  <ArrowRight className="w-3 h-3" />
                  <Badge variant="outline">{language === 'en' ? 'Heading' : 'Partida'} {selectedPartida}</Badge>
                </>
              )}
              {selectedSubpartida && (
                <>
                  <ArrowRight className="w-3 h-3" />
                  <Badge variant="secondary">{language === 'en' ? 'Subheading' : 'Subpartida'} {selectedSubpartida.code}</Badge>
                </>
              )}
            </div>
          )}

          {/* Navigation Tree */}
          <div className="space-y-3">
            {/* Sections Level */}
            {sections.map((section) => (
              <div key={section.code} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleSection(section.code)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.has(section.code) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <Book className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {language === 'en' ? 'Section' : 'Sección'} {section.code} ({section.chapterRange})
                      </div>
                      <div className="text-sm text-gray-600">
                        {language === 'en' ? section.descriptionEn : section.description}
                      </div>
                    </div>
                  </div>
                </button>

                {/* Chapters Level */}
                {expandedSections.has(section.code) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {chapters
                      .filter(chapter => chapter.sectionCode === section.code)
                      .map((chapter) => (
                      <div key={chapter.code} className="border-b border-gray-100 last:border-b-0">
                        <button
                          onClick={() => toggleChapter(chapter.code)}
                          className="w-full flex items-center justify-between p-3 pl-8 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedChapters.has(chapter.code) ? (
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                            )}
                            <FileText className="w-4 h-4 text-green-600" />
                            <div className="text-left">
                              <div className="font-medium text-gray-800">
                                {language === 'en' ? 'Chapter' : 'Capítulo'} {chapter.code}
                              </div>
                              <div className="text-xs text-gray-600">
                                {language === 'en' ? chapter.descriptionEn : chapter.description}
                              </div>
                            </div>
                          </div>
                        </button>

                        {/* Partidas Level */}
                        {expandedChapters.has(chapter.code) && (
                          <div className="bg-white">
                            {partidas
                              .filter(partida => partida.chapterCode === chapter.code)
                              .map((partida) => (
                              <div key={partida.code} className="border-b border-gray-50 last:border-b-0">
                                <button
                                  onClick={() => togglePartida(partida.code)}
                                  className="w-full flex items-center justify-between p-3 pl-12 hover:bg-blue-50 transition-colors"
                                >
                                  <div className="flex items-center space-x-3">
                                    {expandedPartidas.has(partida.code) ? (
                                      <ChevronDown className="w-3 h-3 text-gray-400" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3 text-gray-400" />
                                    )}
                                    <Hash className="w-4 h-4 text-purple-600" />
                                    <div className="text-left">
                                      <div className="font-medium text-gray-800">
                                        {partida.code}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {language === 'en' ? partida.descriptionEn : partida.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {partida.tariffRate}%
                                  </div>
                                </button>

                                {/* Subpartidas Level */}
                                {expandedPartidas.has(partida.code) && (
                                  <div className="bg-gray-50">
                                    {subpartidas
                                      .filter(sub => sub.partidaCode === partida.code)
                                      .map((subpartida) => (
                                      <button
                                        key={subpartida.code}
                                        onClick={() => selectSubpartida(subpartida)}
                                        className={`w-full flex items-center justify-between p-3 pl-16 hover:bg-blue-100 transition-colors border-l-2 group ${
                                          selectedSubpartida?.code === subpartida.code 
                                            ? 'bg-blue-100 border-blue-500' 
                                            : 'border-transparent'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <Package className="w-3 h-3 text-orange-600" />
                                          <div className="text-left">
                                            <div className="font-medium text-gray-800 text-sm">
                                              {subpartida.code}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                              {language === 'en' ? subpartida.descriptionEn : subpartida.description}
                                            </div>
                                            {subpartida.units && subpartida.units.length > 0 && (
                                              <div className="text-xs text-gray-500 mt-1">
                                                {language === 'en' ? 'Units:' : 'Unidades:'} {subpartida.units.join(', ')}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-xs text-gray-600">
                                            {subpartida.tariffRate}%
                                          </div>
                                          {subpartida.restrictions && subpartida.restrictions.length > 0 && (
                                            <div className="text-xs text-red-600">
                                              {language === 'en' ? 'Restricted' : 'Restricciones'}
                                            </div>
                                          )}
                                          <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {language === 'en' ? 'Click to proceed' : 'Clic para continuar'}
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Item Details */}
          {selectedSubpartida && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2 w-5 h-5 text-blue-600" />
                  {language === 'en' ? 'Selected Item Details' : 'Detalles del Producto Seleccionado'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'en' ? 'HS Code:' : 'Código HS:'}
                    </label>
                    <p className="text-lg font-bold text-blue-600">{selectedSubpartida.code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {language === 'en' ? 'Tariff Rate:' : 'Arancel:'}
                    </label>
                    <p className="text-lg font-semibold text-green-600">{selectedSubpartida.tariffRate}%</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    {language === 'en' ? 'Description:' : 'Descripción:'}
                  </label>
                  <p className="text-gray-900">
                    {language === 'en' ? selectedSubpartida.descriptionEn : selectedSubpartida.description}
                  </p>
                </div>

                {selectedSubpartida.units && selectedSubpartida.units.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {language === 'en' ? 'Units of Measurement:' : 'Unidades de Medida:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubpartida.units.map((unit, idx) => (
                        <Badge key={idx} variant="secondary">{unit}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubpartida.restrictions && selectedSubpartida.restrictions.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {language === 'en' ? 'Restrictions:' : 'Restricciones:'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubpartida.restrictions.map((restriction, idx) => (
                        <Badge key={idx} variant="destructive" className="text-xs">
                          {restriction.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubpartida.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      {language === 'en' ? 'Notes:' : 'Notas:'}
                    </label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {language === 'en' ? selectedSubpartida.notesEn || selectedSubpartida.notes : selectedSubpartida.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="search" className="mt-6 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={language === 'en' ? "Search products, codes, or descriptions..." : "Buscar productos, códigos o descripciones..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchQuery.length > 2 && searchResults && (
            <div className="space-y-4">
              {/* Search Results */}
              {searchResults.subpartidas.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {language === 'en' ? `Subheadings (${searchResults.subpartidas.length})` : `Subpartidas (${searchResults.subpartidas.length})`}
                  </h4>
                  <div className="space-y-2">
                    {searchResults.subpartidas.slice(0, 10).map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          selectSubpartida(item);
                          setActiveTab('navigate'); // Switch back to navigate tab to show selection
                        }}
                        className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-blue-600">{item.code}</div>
                            <div className="text-sm text-gray-700">
                              {language === 'en' ? item.descriptionEn : item.description}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {language === 'en' ? 'Chapter' : 'Capítulo'} {item.chapterCode} | {language === 'en' ? 'Tariff:' : 'Arancel:'} {item.tariffRate}%
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.partidas.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {language === 'en' ? `Headings (${searchResults.partidas.length})` : `Partidas (${searchResults.partidas.length})`}
                  </h4>
                  <div className="space-y-2">
                    {searchResults.partidas.slice(0, 5).map((item) => (
                      <button
                        key={item.code}
                        onClick={() => {
                          if (onPartidaSelected) {
                            onPartidaSelected(item);
                            toast({
                              title: language === 'en' ? 'Category Selected!' : '¡Categoría Seleccionada!',
                              description: `${item.code} - ${language === 'en' ? item.descriptionEn : item.description}`,
                            });
                          }
                        }}
                        className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                      >
                        <div className="font-medium text-purple-600">{item.code}</div>
                        <div className="text-sm text-gray-700">
                          {language === 'en' ? item.descriptionEn : item.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {language === 'en' ? 'Chapter' : 'Capítulo'} {item.chapterCode} | {language === 'en' ? 'Tariff:' : 'Arancel:'} {item.tariffRate}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {searchQuery.length > 2 && !searchResults && (
            <div className="text-center text-gray-400 py-4">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>{language === 'en' ? 'Searching...' : 'Buscando...'}</p>
            </div>
          )}

          {searchQuery.length > 2 && searchResults && 
           searchResults.subpartidas.length === 0 && 
           searchResults.partidas.length === 0 && 
           searchResults.chapters.length === 0 && 
           searchResults.sections.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>{language === 'en' ? 'No results found for your search.' : 'No se encontraron resultados para tu búsqueda.'}</p>
              <p className="text-sm mt-1">
                {language === 'en' ? 'Try using different keywords or browse by categories.' : 'Prueba con palabras clave diferentes o navega por categorías.'}
              </p>
              <div className="mt-4 text-xs text-gray-400">
                <p>{language === 'en' ? 'Search suggestions:' : 'Sugerencias de búsqueda:'}</p>
                <div className="flex flex-wrap gap-1 mt-1 justify-center">
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setSearchQuery('coffee')}>
                    {language === 'en' ? 'coffee' : 'café'}
                  </Badge>
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setSearchQuery('electronics')}>
                    {language === 'en' ? 'electronics' : 'electrónicos'}
                  </Badge>
                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" onClick={() => setSearchQuery('textiles')}>
                    {language === 'en' ? 'textiles' : 'textiles'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}