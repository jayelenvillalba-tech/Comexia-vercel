import { useLanguage } from "@/hooks/use-language";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  ShieldCheck, 
  Bookmark, 
  FileText, 
  Users, 
  Zap,
  ArrowRight,
  Plus
} from "lucide-react";

export default function MarketplaceSidebar() {
  const { language } = useLanguage();
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Premium Promo Card */}
      <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-cyan-500/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl -mr-12 -mt-12"></div>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">
                {language === 'es' ? 'Accede a Información Exclusiva' : 'Access Exclusive Information'}
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                {language === 'es' 
                  ? 'Desbloquea análisis de mercado, contactos directos y herramientas avanzadas.'
                  : 'Unlock market analysis, direct contacts, and advanced tools.'}
              </p>
              <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                {language === 'es' ? 'Prueba 1 mes gratis' : 'Try 1 month free'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Profile Card */}
      {user ? (
        <Card className="bg-[#0D2137] border-cyan-900/30">
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-20 h-20 border-2 border-cyan-500 mx-auto">
                <AvatarImage src={user.avatar || "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-cyan-900 text-cyan-200 text-xl font-bold">
                   {user.name.substring(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-1 border-2 border-[#0D2137]">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h3 className="text-white font-bold text-lg">{user.company || user.name}</h3>
            {user.company && (
               <p className="text-cyan-400 text-sm mb-1">
                 {language === 'es' ? 'Miembro Verificado' : 'Verified Member'}
               </p>
            )}
            <p className="text-slate-400 text-xs mb-4">
              {user.email}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-left text-sm">
              <div className="bg-white/5 p-2 rounded">
                <p className="text-slate-400 text-xs">{language === 'es' ? 'Vistas' : 'Views'}</p>
                <p className="text-white font-bold">0</p>
              </div>
              <div className="bg-white/5 p-2 rounded">
                <p className="text-slate-400 text-xs">Leads</p>
                <p className="text-white font-bold">0</p>
              </div>
            </div>

            <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20" onClick={() => window.location.href='/profile'}>
              {language === 'es' ? 'Ver Mi Perfil' : 'View My Profile'}
            </Button>
          </CardContent>
        </Card>
      ) : (
         <Card className="bg-[#0D2137] border-cyan-900/30">
          <CardContent className="p-6 text-center">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
             </div>
             <h3 className="text-white font-bold text-lg mb-2">
               {language === 'es' ? 'Únete a la Comunidad' : 'Join the Community'}
             </h3>
             <p className="text-slate-400 text-sm mb-4">
               {language === 'es' ? 'Conecta con miles de empresas y expande tu red.' : 'Connect with check thousands of companies.'}
             </p>
             <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" onClick={() => window.location.href='/auth'}>
               {language === 'es' ? 'Crear Cuenta Gratis' : 'Sign Up Free'}
             </Button>
          </CardContent>
         </Card>
      )}

      {/* AI Insights */}
      <Card className="bg-[#0D2137] border-cyan-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            {language === 'es' ? 'Insights IA: HS 0202.30' : 'AI Insights: HS 0202.30'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{language === 'es' ? 'Relevancia' : 'Relevance'}</span>
              <span className="text-green-400 font-bold">98% match</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[98%]"></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">{language === 'es' ? 'Oportunidad' : 'Opportunity'}</span>
              <span className="text-blue-400 font-bold">High</span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'es' 
                ? 'Alta demanda detectada en China para este HS Code (+15% vs mes anterior).'
                : 'High demand detected in China for this HS Code (+15% vs last month).'}
            </p>
          </div>

          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs">
            {language === 'es' ? 'Generar Simulación de Costos' : 'Generate Cost Simulation'}
          </Button>
        </CardContent>
      </Card>

      {/* Saved Items */}
      <Card className="bg-[#0D2137] border-cyan-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-cyan-400" />
            {language === 'es' ? 'Tus Guardados' : 'Saved Items'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: 'Demanda Carne Bovina China', type: 'Lead', date: '2d' },
            { title: 'Flete Marítimo Shanghai', type: 'Logistics', date: '5d' },
            { title: 'Regulaciones SENASA 2024', type: 'Doc', date: '1w' }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
              <div className="mt-1">
                {item.type === 'Lead' && <Users className="w-3 h-3 text-green-400" />}
                {item.type === 'Logistics' && <TrendingUp className="w-3 h-3 text-blue-400" />}
                {item.type === 'Doc' && <FileText className="w-3 h-3 text-yellow-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-medium truncate">{item.title}</p>
                <p className="text-slate-500 text-xs">{item.type} • {item.date}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Relevant Groups */}
      <Card className="bg-[#0D2137] border-cyan-900/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            {language === 'es' ? 'Grupos Relevantes' : 'Relevant Groups'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: 'Exportadores de Carne', members: '12k' },
            { name: 'Logística Internacional', members: '8.5k' },
            { name: 'Comercio China-Latam', members: '5k' }
          ].map((group, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs text-white font-bold">
                  {group.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-medium">{group.name}</p>
                  <p className="text-slate-500 text-xs">{group.members} members</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-cyan-400 hover:text-cyan-300">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
