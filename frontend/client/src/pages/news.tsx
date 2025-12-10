
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, FileText, Truck, TrendingUp, ExternalLink } from "lucide-react";
import Header from "@/components/header";

export default function NewsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: news = [], isLoading } = useQuery({
    queryKey: ['news', activeTab],
    queryFn: async () => {
      const response = await fetch(`/api/news?category=${activeTab}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      return response.json();
    }
  });

  const filteredNews = news.filter((item: any) => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regulacion': return <FileText className="w-4 h-4" />;
      case 'logistica': return <Truck className="w-4 h-4" />;
      case 'mercado': return <TrendingUp className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulacion': return "bg-red-500/10 text-red-400 border-red-500/20";
      case 'logistica': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'mercado': return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col font-sans">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'es' ? 'Noticias Oficiales' : 'Official News'}
            </h1>
            <p className="text-slate-400">
              {language === 'es' 
                ? 'Actualizaciones regulatorias y tendencias del comercio global' 
                : 'Regulatory updates and global trade trends'}
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder={language === 'es' ? "Buscar noticias..." : "Search news..."}
              className="pl-9 bg-[#0D2137] border-cyan-900/30 text-white placeholder:text-slate-500 focus:border-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-[#0D2137] border border-cyan-900/30 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400">
              {language === 'es' ? 'Todo' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="regulacion" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400">
              {language === 'es' ? 'Regulaciones' : 'Regulations'}
            </TabsTrigger>
            <TabsTrigger value="mercado" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400">
              {language === 'es' ? 'Mercados' : 'Markets'}
            </TabsTrigger>
            <TabsTrigger value="logistica" className="data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400">
              {language === 'es' ? 'Logística' : 'Logistics'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="bg-[#0D2137] border-cyan-900/30 animate-pulse">
                    <div className="h-48 bg-slate-800" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-slate-800 rounded w-3/4 mb-4" />
                      <div className="h-4 bg-slate-800 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredNews.map((item: any) => (
                <Card key={item.id} className="bg-[#0D2137] border-cyan-900/30 group hover:border-cyan-500/50 transition-all duration-300">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className={`backdrop-blur-sm ${getCategoryColor(item.category)}`}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(item.category)}
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {item.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-slate-400 flex items-center gap-2 mt-2">
                      <Globe className="w-3 h-3" />
                      {item.source} • {new Date(item.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-slate-300 line-clamp-3 text-sm">
                      {item.summary}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <Button variant="link" className="text-cyan-400 p-0 h-auto hover:text-cyan-300 group-hover:underline">
                      {language === 'es' ? 'Leer completa' : 'Read more'} <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
