import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { Globe, Search, TrendingUp, Ship, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import HsCodeSearch from '@/components/hs-code-search';

export default function Home() {
  const { language, setLanguage } = useLanguage();
  const [, navigate] = useLocation();

  const handleProductSelected = (product: any, country: string, operation: string, productName: string) => {
    console.log('Product selected:', { product, country, operation, productName });
    // Navigate to analysis page with parameters
    navigate(`/analysis?code=${product.code}&country=${country}&operation=${operation}&product=${encodeURIComponent(productName)}`);
  };

  const handlePartidaSelected = (partida: any, country: string, operation: string, productName: string) => {
    console.log('Partida selected:', { partida, country, operation, productName });
    // Navigate to analysis page with parameters
    navigate(`/analysis?code=${partida.code}&country=${country}&operation=${operation}&product=${encodeURIComponent(productName)}`);
  };

  return (
    <div className="min-h-screen bg-[#0A1929]">
      {/* Header */}
      <header className="bg-[#0D2137] border-b border-cyan-900/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Che.Comex</h1>
                <p className="text-xs text-cyan-400">
                  {language === 'es' ? 'El Futuro del Comercio Global' : 'Future of Global Commerce'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/news" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                {language === 'es' ? 'NOTICIAS' : 'NEWS'}
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                HS CODE
              </a>
              <a 
                onClick={() => navigate('/marketplace')}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm cursor-pointer"
              >
                MARKETPLACE
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                {language === 'es' ? 'QUIENES SOMOS' : 'ABOUT US'}
              </a>
              
              {/* Language Toggle */}
              <div className="flex items-center gap-1 border border-cyan-900/30 rounded-md overflow-hidden">
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-3 py-1 text-xs ${language === 'es' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  ESP
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-xs ${language === 'en' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  ENG
                </button>
              </div>

              <Button 
                onClick={() => navigate('/auth')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
              >
                {language === 'es' ? 'Iniciar sesión' : 'Login'}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with world map */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {language === 'es' 
                ? 'El Futuro del Comercio Global' 
                : 'The Future of Global Commerce'}
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              {language === 'es'
                ? 'Plataforma de comercio exterior potenciada con inteligencia artificial para análisis de códigos HS, costos y oportunidades'
                : 'Foreign trade platform powered by artificial intelligence for HS code analysis, costs and opportunities'}
            </p>

            {/* HsCodeSearch Component - Integrated */}
            <div className="max-w-4xl mx-auto">
              <HsCodeSearch 
                onProductSelected={handleProductSelected}
                onPartidaSelected={handlePartidaSelected}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0D2137]/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0D2137] border-cyan-900/30 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">
                  {language === 'es' ? 'Análisis de Mercado' : 'Market Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  {language === 'es'
                    ? 'Análisis en tiempo real de oportunidades comerciales globales'
                    : 'Real-time analysis of global trade opportunities'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D2137] border-cyan-900/30 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <Ship className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">
                  {language === 'es' ? 'Logística Inteligente' : 'Smart Logistics'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  {language === 'es'
                    ? 'Optimización de rutas y costos de transporte internacional'
                    : 'Route optimization and international transport costs'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0D2137] border-cyan-900/30 hover:border-cyan-500/50 transition-all">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">
                  {language === 'es' ? 'Red Global' : 'Global Network'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  {language === 'es'
                    ? 'Conecta con empresas verificadas en todo el mundo'
                    : 'Connect with verified companies worldwide'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === 'es' 
                ? '¿Listo para expandir tu negocio?' 
                : 'Ready to expand your business?'}
            </h2>
            <p className="text-xl text-cyan-100 mb-8">
              {language === 'es'
                ? 'Únete a miles de empresas que ya confían en Che.Comex'
                : 'Join thousands of companies that already trust Che.Comex'}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => navigate('/marketplace')}
            >
              {language === 'es' ? 'Comenzar Ahora' : 'Get Started'}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D2137] border-t border-cyan-900/30 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 Che.Comex - {language === 'es' ? 'Plataforma de Comercio Internacional' : 'International Trade Platform'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}