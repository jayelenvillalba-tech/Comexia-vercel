
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  History, 
  Star, 
  Settings, 
  LogOut, 
  Check, 
  ShieldCheck, 
  Download,
  Search,
  MessageSquare
} from "lucide-react";
import FilteredNavbar from "@/components/filtered-navbar";
import Footer from "@/components/footer";

export default function ProfilePage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock User Data
  const { user: contextUser } = useUser();

  // Combine context user with mock details for display if missing
  const user = {
    name: contextUser?.name || "Usuario",
    email: contextUser?.email || "usuario@ejemplo.com",
    role: contextUser?.role || "Usuario",
    phone: "+54 9 11 1234-5678", // Mock phone for now
    location: "Buenos Aires, Argentina",
    company: contextUser?.company || "Sin Empresa",
    plan: "free",
    members: 1,
    joinDate: "Dic 2025"
  };

  // Mock Activity Data
  const recentActivity = [
    { type: "search", title: "Carne Bovina a China", date: "Hace 2 horas", icon: <Search className="w-4 h-4 text-blue-500" /> },
    { type: "quote", title: "Cálculo FOB - Contenedor 20ft", date: "Ayer", icon: <Download className="w-4 h-4 text-green-500" /> },
    { type: "chat", title: "Mensaje de Shanghai Trading Co.", date: "Ayer", icon: <MessageSquare className="w-4 h-4 text-purple-500" /> },
  ];

  const plans = [
    {
      id: "pyme",
      name: language === 'es' ? 'Plan Pyme' : 'SME Plan',
      price: '$49',
      period: language === 'es' ? '/mes' : '/mo',
      description: language === 'es' ? 'Para pequeñas empresas en crecimiento' : 'For growing small businesses',
      features: [
        language === 'es' ? 'Hasta 5 usuarios' : 'Up to 5 users',
        language === 'es' ? 'Verificación de empresa básica' : 'Basic company verification',
        language === 'es' ? 'Acceso a contactos limitado' : 'Limited contact access',
        language === 'es' ? 'Búsquedas por HS Code ilimitadas' : 'Unlimited HS Code searches',
      ],
      icon: <Building2 className="w-6 h-6 text-blue-400" />,
      color: 'blue',
      highlight: false
    },
    {
      id: "corporate",
      name: language === 'es' ? 'Plan Corporativo' : 'Corporate Plan',
      price: '$199',
      period: language === 'es' ? '/mes' : '/mo',
      description: language === 'es' ? 'Solución completa para multinacionales' : 'Complete solution for multinationals',
      features: [
        language === 'es' ? 'Usuarios ilimitados (+100)' : 'Unlimited users (+100)',
        language === 'es' ? 'Verificación de empleados completa' : 'Full employee verification',
        language === 'es' ? 'Acceso total a contactos directos' : 'Full access to direct contacts',
        language === 'es' ? 'Marketplace B2B Premium' : 'Premium B2B Marketplace',
        language === 'es' ? 'Soporte prioritario 24/7' : '24/7 Priority support',
      ],
      icon: <ShieldCheck className="w-6 h-6 text-yellow-400" />,
      color: 'yellow',
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col font-sans">
      <FilteredNavbar />
      
      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Profile */}
          <div className="bg-[#0D2137] rounded-2xl shadow-lg border border-cyan-900/30 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
             {/* Gradient Shine */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <div className="flex items-center gap-6 relative">
              <Avatar className="w-24 h-24 border-4 border-[#0A1929] shadow-md ring-2 ring-cyan-500/50">
                <AvatarImage src={user.email.includes('demo') ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "/placeholder-user.jpg"} />
                <AvatarFallback className="bg-cyan-900 text-cyan-200 text-2xl font-bold">{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-slate-400 font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" /> {user.role} <span className="text-cyan-600 font-semibold">{user.company !== "Sin Empresa" ? `en ${user.company}` : ""}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 transition-colors border border-blue-500/20">
                    <MapPin className="w-3 h-3 mr-1" /> {user.location}
                  </Badge>
                  <Badge variant="outline" className="text-slate-400 border-slate-700 bg-slate-900/50">
                    Miembro desde {user.joinDate}
                  </Badge>
                  {user.plan === 'free' && (
                    <Badge variant="destructive" className="bg-orange-900/20 text-orange-400 hover:bg-orange-900/30 border-orange-500/30">
                      Plan Gratuito
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto relative">
              <Button variant="outline" className="flex-1 md:flex-none border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Settings className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Configuración' : 'Settings'}
              </Button>
              <Button variant="destructive" className="flex-1 md:flex-none bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-500/30 shadow-none">
                <LogOut className="w-4 h-4 mr-2" />
                {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-[#0D2137] p-1 rounded-xl border border-cyan-900/30 w-full md:w-auto grid grid-cols-3 md:inline-flex h-auto">
              <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5 transition-all">
                Overview
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5 transition-all">
                {language === 'es' ? 'Planes y Facturación' : 'Plans & Billing'}
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white text-slate-400 rounded-lg px-6 py-2.5 transition-all">
                {language === 'es' ? 'Historial y Guardados' : 'History & Saved'}
              </TabsTrigger>
            </TabsList>

            {/* Overview Content */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* User Info Card */}
                <Card className="md:col-span-1 border-cyan-900/30 bg-[#0D2137]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-white">
                       <Building2 className="w-5 h-5 text-cyan-400" />
                       {language === 'es' ? 'Datos de Empresa' : 'Company Data'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <Mail className="w-4 h-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-white">{language === 'es' ? 'Email Corporativo' : 'Corporate Email'}</p>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Phone className="w-4 h-4 text-slate-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-white">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                        <p className="text-sm text-slate-400">{user.phone}</p>
                      </div>
                    </div>
                    <Separator className="bg-slate-700" />
                    <div className="pt-2">
                      <p className="text-sm font-medium text-white mb-2">{language === 'es' ? 'Estado de Verificación' : 'Verification Status'}</p>
                      <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3 flex items-start gap-3">
                         <div className="bg-yellow-900/50 p-1 rounded-full text-yellow-500">
                           <History className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-yellow-500">{language === 'es' ? 'En Revisión' : 'Under Review'}</p>
                            <p className="text-xs text-yellow-600/80 mt-1">
                              {language === 'es' 
                                ? 'Tus documentos están siendo analizados por nuestro equipo de compliance.'
                                : 'Your documents are being analyzed by our compliance team.'}
                            </p>
                         </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="md:col-span-2 border-cyan-900/30 bg-[#0D2137]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                       <History className="w-5 h-5 text-slate-500" />
                       Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, i) => (
                         <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-cyan-900/20 hover:border-cyan-500/30">
                            <div className="flex items-center gap-4">
                               <div className="bg-slate-900 p-2 rounded-full shadow-sm border border-slate-800">
                                  {activity.icon}
                               </div>
                               <div>
                                  <p className="font-medium text-white">{activity.title}</p>
                                  <p className="text-xs text-slate-400 capitalize">{activity.type} • {activity.date}</p>
                               </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20">
                               Ver
                            </Button>
                         </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-6 text-slate-600 border-slate-200 hover:bg-slate-50">
                       Ver todo el historial
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Plans Content */}
            <TabsContent value="billing" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
               <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    {language === 'es' ? 'Mejora tu plan' : 'Upgrade your plan'}
                  </h2>
                  <p className="text-slate-400 mt-2">
                    {language === 'es' 
                      ? 'Elige el plan que mejor se adapte a tu escala comercial.'
                      : 'Choose the plan that fits your business scale.'}
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 bg-[#0D2137] ${plan.highlight ? 'border-blue-500 shadow-xl shadow-blue-500/10 scale-105 z-10' : 'border-cyan-900/30 hover:border-blue-500/50'}`}>
                       {plan.highlight && (
                         <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            RECOMENDADO
                         </div>
                       )}
                       <CardHeader>
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${plan.highlight ? 'bg-yellow-900/20' : 'bg-blue-900/20'}`}>
                             {plan.icon}
                          </div>
                          <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                          <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                       </CardHeader>
                       <CardContent className="space-y-6">
                          <div>
                             <span className="text-4xl font-bold text-white">{plan.price}</span>
                             <span className="text-slate-500">{plan.period}</span>
                          </div>
                          <ul className="space-y-3">
                             {plan.features.map((feature, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                                  <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-green-400' : 'text-blue-400'}`} />
                                  <span>{feature}</span>
                               </li>
                             ))}
                          </ul>
                          <Button className={`w-full ${plan.highlight ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'bg-slate-800 hover:bg-slate-700'} text-white border-0`}>
                             {language === 'es' ? 'Seleccionar Plan' : 'Select Plan'}
                          </Button>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </TabsContent>

             {/* History Content (Placeholder) */}
             <TabsContent value="history">
                 <Card>
                    <CardContent className="py-12 text-center">
                       <div className="mb-4 bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                          <History className="w-8 h-8 text-slate-400" />
                       </div>
                       <h3 className="text-lg font-medium text-slate-900">Tu historial está vacío</h3>
                       <p className="text-slate-500 max-w-sm mx-auto mt-2">
                          Cuando realices búsquedas de HS Codes o calcules costos de importación, aparecerán aquí.
                       </p>
                       <Button className="mt-6 bg-blue-600">
                          Comenzar a explorar
                       </Button>
                    </CardContent>
                 </Card>
             </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
