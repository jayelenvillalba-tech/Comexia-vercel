import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Star, Building2, Users, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

import { useState } from "react";
import { useUser } from "@/context/user-context";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const { language } = useLanguage();
  const { token } = useUser() as any; // Need to expose token in context or just use localStorage
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            toast({ title: "Error", description: "Debes iniciar sesión", variant: "destructive" });
            return;
        }

        const res = await fetch('/api/billing/checkout', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${storedToken}`
            },
            body: JSON.stringify({ planId })
        });

        const data = await res.json();
        if (res.ok && data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
             toast({ title: "Error", description: data.error || "Checkout failed", variant: "destructive" });
        }
    } catch (e) {
        toast({ title: "Error", description: "Network error", variant: "destructive" });
    } finally {
        setLoading(null);
    }
  };

  const plans = [
    {
      id: 'pyme',
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
      color: 'blue'
    },
    {
      id: 'corporate',
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
      popular: true
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-slate-950 border-slate-800 text-white">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {language === 'es' ? 'Desbloquea el Potencial de Che.Comex' : 'Unlock Che.Comex\'s Potential'}
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-lg">
            {language === 'es' 
              ? 'Accede a datos de contacto verificados y conecta directamente con socios comerciales.' 
              : 'Access verified contact data and connect directly with trade partners.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {plans.map((plan, index) => (
            <SubscriptionPlanCard 
                key={index} 
                plan={plan} 
                popular={plan.popular} 
                onSubscribe={handleSubscribe} 
                loading={loading === plan.id} 
            />
          ))}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-4 text-center sm:text-left text-sm text-slate-500 mt-4 border-t border-slate-800 pt-4">
          <p className="flex-1">
            {language === 'es' 
              ? '🔒 Pagos seguros y encriptados. Cancela cuando quieras.' 
              : '🔒 Secure and encrypted payments. Cancel anytime.'}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionPlanCard({ plan, popular, onSubscribe, loading }: { plan: any, popular?: boolean, onSubscribe: (id: string) => void, loading: boolean }) {
    const { language } = useLanguage();
    
    return (
        <div 
          className={`relative rounded-xl border p-6 flex flex-col ${
            popular 
              ? 'bg-slate-900/50 border-yellow-500/50 shadow-lg shadow-yellow-900/20' 
              : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
          }`}
        >
          {popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider">
              {language === 'es' ? 'Más Popular' : 'Most Popular'}
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg bg-${plan.color}-500/10`}>
              {plan.icon}
            </div>
            <div>
              <h3 className="font-bold text-xl">{plan.name}</h3>
              <p className="text-sm text-slate-400">{plan.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-slate-500">{plan.period}</span>
          </div>

          <div className="space-y-3 flex-1 mb-6">
            {plan.features.map((feature: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className={`w-4 h-4 mt-0.5 ${popular ? 'text-yellow-400' : 'text-blue-400'}`} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => onSubscribe(plan.id)}
            disabled={loading}
            className={`w-full font-bold ${
              popular 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black' 
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {loading ? 'Procesando...' : (language === 'es' ? 'Comenzar Ahora' : 'Start Now')}
          </Button>
        </div>
    );
}
