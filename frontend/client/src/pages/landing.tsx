import { useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Globe, Download, Upload, ArrowRight, Sparkles, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
  const [, navigate] = useLocation();
  const { language, t, setLanguage } = useLanguage();
  const [selectedFlow, setSelectedFlow] = useState<'import' | 'export' | null>(null);

  const handleFlowSelection = (flow: 'import' | 'export') => {
    setSelectedFlow(flow);
    // Navigate to the main trade flow screen with the selected flow
    navigate(`/trade-flow?type=${flow}`);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      {/* Animated World Map Background */}
      <div className="absolute inset-0">
        {/* World map SVG pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="worldGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#worldGrid)" />
          
          {/* Simplified world continents outlines */}
          <g stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="rgba(255,255,255,0.05)">
            {/* North America */}
            <path d="M200,200 Q250,180 300,200 Q350,220 380,260 Q360,300 320,320 Q280,340 240,330 Q200,310 180,280 Z" />
            {/* South America */}
            <path d="M250,400 Q280,380 300,420 Q320,460 310,500 Q290,540 270,520 Q250,480 240,440 Z" />
            {/* Europe */}
            <path d="M500,180 Q540,170 580,190 Q600,210 590,240 Q570,260 540,250 Q510,240 500,210 Z" />
            {/* Africa */}
            <path d="M520,280 Q560,270 580,310 Q590,350 580,390 Q560,420 540,400 Q520,360 515,320 Z" />
            {/* Asia */}
            <path d="M650,150 Q750,140 850,170 Q900,200 880,250 Q860,280 800,290 Q750,300 700,280 Q670,260 650,220 Z" />
            {/* Australia */}
            <path d="M800,420 Q850,410 880,430 Q890,450 870,470 Q840,480 820,470 Q800,450 795,440 Z" />
          </g>
        </svg>

        {/* Animated dots representing global trade */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl border border-white/30">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Che.Comex</h1>
            <p className="text-blue-200 text-sm">LIBRE COMERCIO & INTELIGENCIA ARTIFICIAL</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="text-white hover:bg-white/20 border border-white/30"
          >
            {language.toUpperCase()}
          </Button>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Title */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {language === 'es' ? (
                <>
                  Comercio Internacional <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Sin Fronteras
                  </span>
                </>
              ) : (
                <>
                  International Trade <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Without Borders
                  </span>
                </>
              )}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {language === 'es' 
                ? "Plataforma de libre comercio potenciada con inteligencia artificial para optimizar tus operaciones de importación y exportación. Encuentra productos, empresas, y oportunidades comerciales globales."
                : "Free trade platform powered by artificial intelligence to optimize your import and export operations. Find products, companies, and global trade opportunities."
              }
            </p>
          </div>

          {/* Trade Flow Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Import Card */}
            <Card 
              className={`glass-card border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedFlow === 'import' ? 'border-cyan-400 bg-cyan-50/10' : 'border-white/30'
              }`}
              onClick={() => handleFlowSelection('import')}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-white mb-2">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-xl mr-4">
                    <Download className="w-8 h-8 text-white" />
                  </div>
                  {language === 'es' ? 'Quiero Importar' : 'I Want to Import'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-100 text-left">
                  {language === 'es' 
                    ? "Encuentra productos internacionales, proveedores verificados, y optimiza tus costos de importación con IA."
                    : "Find international products, verified suppliers, and optimize your import costs with AI."
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Códigos HS' : 'HS Codes'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Proveedores' : 'Suppliers'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Aranceles' : 'Tariffs'}
                  </Badge>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  onClick={() => handleFlowSelection('import')}
                >
                  {language === 'es' ? 'Comenzar a Importar' : 'Start Importing'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Export Card */}
            <Card 
              className={`glass-card border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                selectedFlow === 'export' ? 'border-green-400 bg-green-50/10' : 'border-white/30'
              }`}
              onClick={() => handleFlowSelection('export')}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-2xl text-white mb-2">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-xl mr-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  {language === 'es' ? 'Quiero Exportar' : 'I Want to Export'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-100 text-left">
                  {language === 'es' 
                    ? "Descubre oportunidades de mercado, encuentra compradores internacionales, y expande tu negocio globalmente."
                    : "Discover market opportunities, find international buyers, and expand your business globally."
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Mercados' : 'Markets'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Compradores' : 'Buyers'}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    {language === 'es' ? 'Oportunidades' : 'Opportunities'}
                  </Badge>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  onClick={() => handleFlowSelection('export')}
                >
                  {language === 'es' ? 'Comenzar a Exportar' : 'Start Exporting'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-2">
                <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-blue-200 text-sm">
                {language === 'es' ? 'Países Conectados' : 'Connected Countries'}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-2">
                <Users className="w-8 h-8 text-green-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-blue-200 text-sm">
                {language === 'es' ? 'Empresas Verificadas' : 'Verified Companies'}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-2">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto" />
              </div>
              <div className="text-2xl font-bold text-white">AI</div>
              <div className="text-blue-200 text-sm">
                {language === 'es' ? 'Inteligencia Comercial' : 'Trade Intelligence'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6">
        <p className="text-blue-200 text-sm">
          © 2024 Che.Comex - {language === 'es' ? 'Plataforma de Comercio Internacional' : 'International Trade Platform'}
        </p>
      </footer>
    </div>
  );
}