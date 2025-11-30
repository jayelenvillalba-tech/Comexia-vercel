import { Globe, User, Shield, Home, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <header className="bg-[#0D2137] border-b border-cyan-900/30 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate('/')}
            >
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-xl font-bold text-white">Che.Comex</h1>
              <p className="text-xs text-cyan-400">
                {language === 'es' ? 'El Futuro del Comercio Global' : 'Future of Global Commerce'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-cyan-400 transition-colors text-sm cursor-pointer flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              {language === 'es' ? 'INICIO' : 'HOME'}
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
              {language === 'es' ? 'NOTICIAS' : 'NEWS'}
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
              HS CODE
            </a>
            <a 
              onClick={() => navigate('/marketplace')}
              className="text-gray-300 hover:text-cyan-400 transition-colors text-sm cursor-pointer flex items-center gap-1"
            >
              <Package className="w-4 h-4" />
              MARKETPLACE
            </a>
            <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
              {language === 'es' ? 'QUIENES SOMOS' : 'ABOUT US'}
            </a>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-1 border border-cyan-900/30 rounded-md overflow-hidden">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-xs transition-colors ${
                  language === 'es' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ESP
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs transition-colors ${
                  language === 'en' 
                    ? 'bg-cyan-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Admin Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 hover:text-purple-200"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>

            <Button 
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
              onClick={() => navigate('/admin')}
            >
              {language === 'es' ? 'Iniciar sesión' : 'Login'}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
