import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Globe, Package, DollarSign, Users, BarChart3, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface DashboardStats {
  totalOpportunities: number;
  topCountry: string;
  potentialSavings: number;
  companiesAvailable: number;
  activeMarkets: number;
  avgTariffReduction: number;
  growingMarkets: number;
  treaties: number;
}

export default function DashboardWidgets() {
  const { language } = useLanguage();

  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
    queryFn: async () => {
      // For now, return mock data - in production this would call the API
      return {
        totalOpportunities: 847,
        topCountry: "Brasil",
        potentialSavings: 125000,
        companiesAvailable: 154,
        activeMarkets: 63,
        avgTariffReduction: 12.5,
        growingMarkets: 42,
        treaties: 28
      };
    }
  });

  const sparklineData = [
    { value: 400 }, { value: 300 }, { value: 550 }, { value: 450 }, { value: 600 }, { value: 847 }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const widgets = [
    {
      title: language === 'es' ? 'Oportunidades Detectadas' : 'Opportunities Detected',
      value: stats?.totalOpportunities || 0,
      change: '+12%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: language === 'es' ? 'vs. mes anterior' : 'vs. last month',
      hasChart: true
    },
    {
      title: language === 'es' ? 'Ahorro Potencial' : 'Potential Savings',
      value: `$${((stats?.potentialSavings || 0) / 1000).toFixed(0)}K`,
      change: '+8%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: language === 'es' ? 'en aranceles' : 'in tariffs'
    },
    {
      title: language === 'es' ? 'Mercados Activos' : 'Active Markets',
      value: stats?.activeMarkets || 0,
      change: '+5',
      trend: 'up' as const,
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: language === 'es' ? 'países disponibles' : 'countries available'
    },
    {
      title: language === 'es' ? 'Empresas Verificadas' : 'Verified Companies',
      value: stats?.companiesAvailable || 0,
      change: '+23',
      trend: 'up' as const,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: language === 'es' ? 'nuevas este mes' : 'new this month'
    },
    {
      title: language === 'es' ? 'Reducción Arancelaria Promedio' : 'Avg. Tariff Reduction',
      value: `${stats?.avgTariffReduction || 0}%`,
      change: '+2.3%',
      trend: 'up' as const,
      icon: BarChart3,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: language === 'es' ? 'con tratados' : 'with treaties'
    },
    {
      title: language === 'es' ? 'Mercados en Crecimiento' : 'Growing Markets',
      value: stats?.growingMarkets || 0,
      change: '+7',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: language === 'es' ? 'tendencia positiva' : 'positive trend'
    },
    {
      title: language === 'es' ? 'Tratados Comerciales' : 'Trade Treaties',
      value: stats?.treaties || 0,
      change: '+3',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: language === 'es' ? 'activos' : 'active'
    },
    {
      title: language === 'es' ? 'Productos Analizados' : 'Products Analyzed',
      value: '99+',
      change: '+15',
      trend: 'up' as const,
      icon: Package,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      description: language === 'es' ? 'códigos HS' : 'HS codes'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {widgets.map((widget, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden relative"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">
              {widget.title}
            </CardTitle>
            <div className={`${widget.bgColor} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
              <widget.icon className={`w-4 h-4 ${widget.color}`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {widget.value}
              </div>
              <div className={`flex items-center text-xs font-medium ${
                widget.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {widget.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {widget.change}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {widget.description}
            </p>
          </CardContent>
          
          {/* Sparkline for the first widget */}
          {widget.hasChart && (
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-30 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#16a34a" 
                    fill="#16a34a" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
