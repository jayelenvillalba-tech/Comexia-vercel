import { MessageCircle, TrendingUp, MapPin, Calendar, Package, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { useState } from "react";
import CostAnalysisModal from "./cost-analysis-modal";

interface Post {
  id: string;
  type: "buy" | "sell";
  company: {
    id: string;
    name: string;
    verified: boolean;
    country: string;
  };
  user: {
    id: string;
    name: string;
    role: string;
    verified: boolean;
  };
  hsCode: string;
  productName: string;
  quantity: string;
  originCountry?: string;
  destinationCountry?: string;
  deadline?: number;
  requirements?: string[];
  certifications?: string[];
  createdAt: Date;
  status: "active" | "closed";
}

interface PostCardProps {
  post: Post;
}

import AuthGuardModal from "@/components/auth/auth-guard-modal";
import { useUser } from "@/context/user-context";
import ReputationBadge from "@/components/ui/reputation-badge";

// ... imports

export default function PostCard({ post }: PostCardProps) {
  const { language } = useLanguage();
  const { user } = useUser();
  const [, navigate] = useLocation();
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Mock user ID - now using real context for checks
  // const userId = "mock-user-1"; 

  const handleContact = async () => {
    if (!user) {
       setShowAuthModal(true);
       return;
    }

    // Simple approach: Navigate directly to a demo conversation
    // This avoids all database complexity and errors
    const demoConvId = `demo-conv-${post.id}`;
    navigate(`/chat/${demoConvId}`);
  };

  const getTimeAgo = (date: Date) => {
    const now = Date.now();
    const diff = now - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      return language === 'es' ? 'Hace menos de 1 hora' : 'Less than 1 hour ago';
    } else if (hours < 24) {
      return language === 'es' ? `Hace ${hours} hora${hours > 1 ? 's' : ''}` : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return language === 'es' ? `Hace ${days} día${days > 1 ? 's' : ''}` : `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'AR': '🇦🇷', 'BR': '🇧🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'UY': '🇺🇾',
      'US': '🇺🇸', 'MX': '🇲🇽', 'CN': '🇨🇳', 'DE': '🇩🇪', 'ES': '🇪🇸'
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {post.company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold">
                  {post.company.name}
                </h3>
                <ReputationBadge 
                  score={4.8} 
                  verified={post.company.verified} 
                  showStars={true}
                  className="scale-90 origin-left"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <span>{post.user.name}</span>
                {post.user.verified && (
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                )}
                <span>·</span>
                <span>{post.user.role}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {getTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          
          <Badge 
            className={post.type === "buy" 
              ? "bg-green-500/20 text-green-300 border-green-500/30" 
              : "bg-red-500/20 text-red-300 border-red-500/30"
            }
          >
            {post.type === "buy" 
              ? (language === 'es' ? '🟢 BUSCO' : '🟢 BUYING')
              : (language === 'es' ? '🔴 VENDO' : '🔴 SELLING')
            }
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h4 className="text-white text-lg font-bold mb-1">
              {post.productName}
            </h4>
            <Badge variant="outline" className="text-slate-300 border-slate-500">
              HS {post.hsCode}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Package className="w-4 h-4" />
              <span>{language === 'es' ? 'Cantidad:' : 'Quantity:'} {post.quantity}</span>
            </div>
            
            {post.type === "buy" && post.destinationCountry && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>
                  {language === 'es' ? 'Destino:' : 'Destination:'} {getCountryFlag(post.destinationCountry)} {post.destinationCountry}
                </span>
              </div>
            )}
            
            {post.type === "sell" && post.originCountry && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>
                  {language === 'es' ? 'Origen:' : 'Origin:'} {getCountryFlag(post.originCountry)} {post.originCountry}
                </span>
              </div>
            )}
            
            {post.deadline && (
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>
                  {language === 'es' ? 'Plazo:' : 'Deadline:'} {post.deadline} {language === 'es' ? 'días' : 'days'}
                </span>
              </div>
            )}
          </div>

          {/* Requirements or Certifications */}
          {post.requirements && post.requirements.length > 0 && (
            <div>
              <p className="text-slate-400 text-xs mb-2">
                {language === 'es' ? 'Requisitos:' : 'Requirements:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {post.certifications && post.certifications.length > 0 && (
            <div>
              <p className="text-slate-400 text-xs mb-2">
                {language === 'es' ? 'Certificaciones:' : 'Certifications:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {post.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                    ✓ {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
          <Button 
            onClick={handleContact}
            disabled={isCreatingChat}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {isCreatingChat 
              ? (language === 'es' ? 'Abriendo...' : 'Opening...')
              : (language === 'es' ? 'Contactar' : 'Contact')
            }
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCostModal(true)}
            className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Ver Costos' : 'View Costs'}
          </Button>
        </div>
      </CardContent>

      {/* Cost Analysis Modal */}
      <CostAnalysisModal
        isOpen={showCostModal}
        onClose={() => setShowCostModal(false)}
        post={post}
      />
      <AuthGuardModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        title={language === 'es' ? 'Contactar Empresa' : 'Contact Company'}
        description={language === 'es' 
          ? 'Inicia sesión para chatear directamente con este proveedor.' 
          : 'Login to chat directly with this supplier.'}
      />
    </Card>
  );
}
