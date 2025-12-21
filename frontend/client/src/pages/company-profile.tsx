import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Building2, MapPin, Users, Star, TrendingUp, CheckCircle,
  Mail, Phone, Globe, Calendar, Package, Award, ArrowLeft,
  MessageSquare, UserPlus, FileText, Video, Share2, MoreHorizontal,
  Briefcase, Truck, ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import ReputationBadge from "@/components/ui/reputation-badge";
import VerificationModal from "@/components/verification-modal";
import { useUser } from "@/context/user-context";

// Fallback mock data for development/demo if API fails or ID is missing
const fallbackCompany = {
  id: "c1",
  name: "Frigorífico Very",
  verified: true,
  country: "AR",
  tagline: "Un futuro conectado con carne premium argentina!",
  legalName: "Frigorífico Very S.A.",
  taxId: "30-12345678-9",
  businessType: "Frigorífico Exportador",
  establishedYear: 1985,
  employeeCount: "500-1000",
  address: "Ruta Nacional 5 Km 200, Buenos Aires",
  city: "Buenos Aires",
  website: "https://www.frigorificovery.com",
  email: "contacto@frigorificovery.com",
  phone: "+54 11 1234-5678",
  description: "Frigorífico Very es el epítome global de innovación y disrupción en la industria cárnica. Lideramos de forma segura el futuro del marketing. Un ecosistema de tecnologías y mercados electrónicos que conecta la demanda global con la industria del futuro.",
  products: ["Carne Bovina", "Cuota Hilton", "Menudencias", "Hamburguesas Premium"],
  certifications: ["HACCP", "BRC", "Halal", "Kosher", "Organic"],
  rating: 4.9,
  totalReviews: 888,
  followers: "14 mil",
  keyContacts: [
    {
      id: "u1",
      name: "Juan Pérez",
      role: "Enlace de contacto de ventas",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      verified: true
    },
    {
      id: "u2",
      name: "María López",
      role: "Gerente de Logística y Exportación",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      verified: true
    },
    {
      id: "u3",
      name: "Carlos Ramírez",
      role: "Ventas y Negocios Internacionales",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      verified: true
    },
    {
      id: "u4",
      name: "Ana Gómez",
      role: "Gerente de Calidad y Costos",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      verified: true
    }
  ],
  recentPosts: [
    {
      id: "p1",
      type: "video",
      title: "Nueva exportación exitosa a China",
      content: "Cumplimos con procesos estrictos (China, UE, EE.UU). #CarneArgentina #Blockchain. Contenedor refrigerado con monitoreo satelital.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      stats: "Hace 45 días • 5 semanas • 120 likes"
    },
    {
      id: "p2",
      type: "article",
      title: "Actualización: Protocolo sanitario China renovado",
      content: "Fuente: SENASA. Nuevas regulaciones para la exportación de carne bovina congelada sin hueso.",
      image: null,
      stats: "Hace 2 días • Fuente Oficial"
    }
  ]
};

export default function CompanyProfile() {
  const { user } = useUser();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/company/:id");
  const companyId = params?.id;

  const [activeTab, setActiveTab] = useState<"about" | "videos" | "articles" | "documents">("about");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  // Fetch company data
  const { data: companyData, isLoading } = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      // In a real app, this would be a fetch call:
      // const res = await fetch(`/api/companies/${companyId}`);
      // if (!res.ok) throw new Error('Failed to fetch company');
      // return res.json();
      
      // For now, we simulate an API call that returns the fallback data
      // but allows us to easily switch to real data later
      await new Promise(resolve => setTimeout(resolve, 500));
      return fallbackCompany;
    },
    enabled: !!companyId
  });

  const company = companyData || fallbackCompany;
  const isOwner = user?.companyId === company.id;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing 
        ? (language === 'es' ? 'Dejaste de seguir' : 'Unfollowed') 
        : (language === 'es' ? '¡Siguiendo!' : 'Following!'),
      description: isFollowing
        ? (language === 'es' ? `Ya no sigues a ${company.name}` : `You are no longer following ${company.name}`)
        : (language === 'es' ? `Ahora sigues a ${company.name}` : `You are now following ${company.name}`),
    });
  };

  const handleContact = () => {
    toast({
      title: language === 'es' ? 'Solicitud de contacto enviada' : 'Contact request sent',
      description: language === 'es' 
        ? 'La empresa recibirá tu mensaje y te contactará pronto.' 
        : 'The company will receive your message and contact you soon.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A1929]">
        <Header />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Left Column Skeleton */}
             <div className="lg:col-span-8 space-y-6">
               <Card className="bg-[#0D2137] border-cyan-900/30 overflow-hidden">
                 <div className="h-48 bg-gray-800 animate-pulse" /> {/* Cover */}
                 <CardContent className="px-6 pb-6 pt-0 relative">
                    <div className="absolute -top-16 left-6">
                      <div className="w-32 h-32 rounded-xl bg-gray-700 animate-pulse border-4 border-[#0D2137]" /> {/* Logo */}
                    </div>
                    <div className="flex justify-end pt-4 gap-3 mb-12">
                      <div className="w-24 h-10 bg-gray-700 rounded animate-pulse" />
                      <div className="w-24 h-10 bg-gray-700 rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <div className="w-3/4 h-8 bg-gray-700 rounded animate-pulse" />
                       <div className="w-1/2 h-6 bg-gray-800 rounded animate-pulse" />
                       <div className="flex gap-4">
                         <div className="w-24 h-6 bg-gray-800 rounded animate-pulse" />
                         <div className="w-24 h-6 bg-gray-800 rounded animate-pulse" />
                       </div>
                    </div>
                 </CardContent>
               </Card>
             </div>
             {/* Sidebar Skeleton */}
             <div className="lg:col-span-4 space-y-6">
               <Card className="bg-[#0D2137] border-cyan-900/30 h-64">
                  <CardHeader><div className="w-1/2 h-6 bg-gray-800 rounded animate-pulse" /></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full h-4 bg-gray-800 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-800 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-800 rounded animate-pulse" />
                  </CardContent>
               </Card>
             </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1929]">
      <Header />
      <VerificationModal 
         open={showVerifyModal} 
         onOpenChange={setShowVerifyModal} 
         entityId={company.id}
         entityType="company"
         countryCode={company.country}
      />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/marketplace')}
          variant="ghost"
          className="mb-4 text-gray-400 hover:text-cyan-400 pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Volver al Marketplace' : 'Back to Marketplace'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Company Header Card */}
            <Card className="bg-[#0D2137] border-cyan-900/30 overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                <img 
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Cover" 
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Badge className="bg-black/50 text-white border-none backdrop-blur-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {company.city}, {company.country}
                  </Badge>
                </div>
              </div>

              <CardContent className="px-6 pb-6 pt-0 relative">
                {/* Logo */}
                <div className="absolute -top-16 left-6">
                  <div className="w-32 h-32 rounded-xl border-4 border-[#0D2137] bg-[#0A1929] flex items-center justify-center overflow-hidden shadow-xl">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${company.name}&backgroundColor=006064`}
                      alt={company.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Actions (Top Right) */}
                <div className="flex justify-end pt-4 gap-3 mb-12">
                  {isOwner && !company.verified && (
                     <Button 
                       onClick={() => setShowVerifyModal(true)}
                       variant="outline" 
                       className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 mr-2"
                     >
                       <ShieldCheck className="w-4 h-4 mr-2" />
                       {language === 'es' ? 'Verificar' : 'Verify'}
                     </Button>
                  )}
                  <Button variant="outline" size="icon" className="border-cyan-900/30 text-cyan-400 hover:bg-cyan-900/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-cyan-900/30 text-cyan-400 hover:bg-cyan-900/20">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={handleFollow}
                    variant={isFollowing ? "outline" : "default"}
                    className={isFollowing 
                      ? "border-cyan-500 text-cyan-400 hover:bg-cyan-900/20" 
                      : "bg-cyan-600 hover:bg-cyan-700 text-white"
                    }
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Siguiendo' : 'Following'}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Seguir' : 'Follow'}
                      </>
                    )}
                  </Button>
                  <Button 
                    onClick={handleContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Mensaje' : 'Message'}
                  </Button>
                </div>

                {/* Company Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                    {company.verified && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        {language === 'es' ? 'Verificado' : 'Verified'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-gray-300 mb-4">{company.tagline}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-cyan-500" />
                      {company.businessType}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-cyan-500" />
                      {company.employeeCount} {language === 'es' ? 'empleados' : 'employees'}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                      Est. {company.establishedYear}
                    </div>
import ReputationBadge from "@/components/ui/reputation-badge";

// ... (inside render)
                    <div className="flex items-center text-cyan-200">
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      {company.rating} ({company.totalReviews} reviews)
                    </div>
// Wait, I should replace it with the badge usage.
                    <ReputationBadge 
                      score={company.rating} 
                      reviews={company.totalReviews}
                      size="md"
                    />
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-cyan-900/30">
                    <button
                      onClick={() => setActiveTab("about")}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "about" 
                          ? "border-cyan-500 text-cyan-400" 
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {language === 'es' ? 'Sobre Nosotros' : 'About'}
                    </button>
                    <button
                      onClick={() => setActiveTab("videos")}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "videos" 
                          ? "border-cyan-500 text-cyan-400" 
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      Videos
                    </button>
                    <button
                      onClick={() => setActiveTab("articles")}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "articles" 
                          ? "border-cyan-500 text-cyan-400" 
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {language === 'es' ? 'Artículos' : 'Articles'}
                    </button>
                    <button
                      onClick={() => setActiveTab("documents")}
                      className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "documents" 
                          ? "border-cyan-500 text-cyan-400" 
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      {language === 'es' ? 'Documentos' : 'Documents'}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "about" && (
                <>
                  <Card className="bg-[#0D2137] border-cyan-900/30">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">
                        {language === 'es' ? 'Descripción General' : 'Overview'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed mb-6">
                        {company.description}
                      </p>
                      
                      <h4 className="text-white font-medium mb-3">
                        {language === 'es' ? 'Productos Principales' : 'Main Products'}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {company.products.map((product, i) => (
                          <Badge key={i} variant="outline" className="border-cyan-500/30 text-cyan-300 bg-cyan-900/10">
                            {product}
                          </Badge>
                        ))}
                      </div>

                      <h4 className="text-white font-medium mb-3">
                        {language === 'es' ? 'Certificaciones' : 'Certifications'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.certifications.map((cert, i) => (
                          <Badge key={i} variant="secondary" className="bg-green-900/20 text-green-400 border-green-500/30">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity / Posts */}
                  <h3 className="text-xl font-bold text-white mt-8 mb-4">
                    {language === 'es' ? 'Actividad Reciente' : 'Recent Activity'}
                  </h3>
                  
                  {company.recentPosts.map((post) => (
                    <Card key={post.id} className="bg-[#0D2137] border-cyan-900/30 mb-4 hover:border-cyan-500/30 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {post.image && (
                            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                                {post.type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                                {post.type.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">{post.stats}</span>
                            </div>
                            <h4 className="text-white font-medium mb-1">{post.title}</h4>
                            <p className="text-sm text-gray-400 line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
              
              {/* Other tabs placeholders */}
              {activeTab !== "about" && (
                <Card className="bg-[#0D2137] border-cyan-900/30">
                  <CardContent className="p-12 text-center">
                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeTab === "videos" && <Video className="w-8 h-8 text-cyan-500" />}
                      {activeTab === "articles" && <FileText className="w-8 h-8 text-cyan-500" />}
                      {activeTab === "documents" && <Briefcase className="w-8 h-8 text-cyan-500" />}
                    </div>
                    <h3 className="text-white text-lg font-medium mb-2">
                      {language === 'es' ? 'Contenido Próximamente' : 'Content Coming Soon'}
                    </h3>
                    <p className="text-gray-400">
                      {language === 'es' 
                        ? 'Esta sección está bajo construcción. ¡Vuelve pronto!' 
                        : 'This section is under construction. Check back soon!'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Card */}
            <Card className="bg-[#0D2137] border-cyan-900/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {language === 'es' ? 'Información de Contacto' : 'Contact Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Globe className="w-4 h-4 mr-3 text-cyan-500" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                    www.frigorificovery.com
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-cyan-500" />
                  <a href={`mailto:${company.email}`} className="hover:text-cyan-400 transition-colors">
                    {company.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-cyan-500" />
                  {company.phone}
                </div>
                <div className="flex items-start text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-cyan-500 mt-1" />
                  <span>{company.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Key Personnel */}
            <Card className="bg-[#0D2137] border-cyan-900/30">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  {language === 'es' ? 'Personal Clave' : 'Key Personnel'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.keyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                    <div className="relative">
                      <img 
                        src={contact.image} 
                        alt={contact.name} 
                        className="w-10 h-10 rounded-full bg-white/10"
                      />
                      {contact.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-[#0D2137]">
                          <CheckCircle className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{contact.name}</h4>
                      <p className="text-gray-400 text-xs truncate">{contact.role}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-cyan-400">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/30">
              <CardContent className="p-6 space-y-3">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Truck className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Solicitar Cotización Logística' : 'Request Logistics Quote'}
                </Button>
                <Button variant="outline" className="w-full border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20">
                  <Package className="w-4 h-4 mr-2" />
                  {language === 'es' ? 'Ver Catálogo Completo' : 'View Full Catalog'}
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
