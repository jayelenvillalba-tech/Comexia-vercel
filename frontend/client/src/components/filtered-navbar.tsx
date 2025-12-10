
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Globe, User, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function FilteredNavbar() {
  const { language, setLanguage } = useLanguage();
  const [location, navigate] = useLocation();

  return (
    <header className="bg-[#0D2137] border-b border-cyan-900/30 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate('/')}
          >
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
             <a href="/" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
               INICIO
             </a>
             <a href="/news" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
               NOTICIAS
             </a>
             <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
               HS CODE
             </a>
             <a href="/marketplace" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium">
               MARKETPLACE
             </a>
             <a href="/chat" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium flex items-center">
               <MessageCircle className="w-4 h-4 mr-1 text-cyan-400" />
               CHATS
             </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex bg-[#0A1929] rounded-lg p-1 border border-cyan-900/30">
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  language === 'es'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ESP
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  language === 'en'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ENG
              </button>
            </div>

            <Button 
              onClick={() => navigate('/profile')}
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-slate-800 text-white"
            >
               <Avatar className="w-8 h-8 border border-cyan-500/50">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-cyan-900 text-cyan-200">JP</AvatarFallback>
               </Avatar>
               <span className="hidden md:inline text-sm">Mi Perfil</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
