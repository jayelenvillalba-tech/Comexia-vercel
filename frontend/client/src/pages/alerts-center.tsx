import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Bell, Search, Filter, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/hooks/use-language';
import { useState } from "react";

interface Alert {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  category: string;
  affectedCountries: string; // JSON string
  affectedProducts: string; // JSON string
  source: string;
  actionRecommendation: string;
  actionRecommendationEn: string;
  createdAt: string;
}

export default function AlertsCenter() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery<{data: Alert[]}>({
    queryKey: ["/api/alerts"],
  });

  const alerts = data?.data || [];

  const filteredAlerts = alerts.filter(alert => 
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
      switch(severity) {
          case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
          case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
          case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      }
  };

  const getIcon = (severity: string) => {
      if (severity === 'critical') return <AlertOctagon className="w-5 h-5 text-red-500" />;
      if (severity === 'high') return <AlertOctagon className="w-5 h-5 text-orange-500" />;
      return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      {/* Header */}
      <div className="bg-[#0D2137] border-b border-cyan-900/30 px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-cyan-400"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              {language === 'es' ? 'Volver' : 'Back'}
            </Button>
            <h1 className="text-xl font-bold text-cyan-100 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-500" />
              {language === 'es' ? 'Centro de Alertas Regulatorias' : 'Regulatory Alerts Center'}
            </h1>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        
        {/* Search & Filter */}
        <div className="flex gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                    placeholder={language === 'es' ? "Buscar por regulación, país o producto..." : "Search by regulation, country or product..."} 
                    className="pl-10 bg-[#172a46] border-gray-700 text-white focus:ring-cyan-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" className="border-gray-700 text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
            </Button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading alerts...</div>
            ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    No active alerts found.
                </div>
            ) : (
                filteredAlerts.map(alert => (
                    <Card key={alert.id} className="bg-[#0D2137] border-cyan-900/30 hover:border-cyan-500/50 transition-all cursor-pointer group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {getIcon(alert.severity)}
                                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                                            {alert.severity.toUpperCase()}
                                        </Badge>
                                        <span className="text-xs text-gray-500">{new Date(alert.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                                        {language === 'es' ? alert.title : alert.titleEn}
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-400 text-sm">
                                {language === 'es' ? alert.description : alert.descriptionEn}
                            </p>
                            
                            <div className="bg-[#0A1929]/50 p-3 rounded border border-gray-800 text-sm">
                                <strong className="text-cyan-500 block mb-1">
                                    {language === 'es' ? 'Acción Recomendada:' : 'Recommended Action:'}
                                </strong>
                                <span className="text-gray-300">
                                    {language === 'es' ? alert.actionRecommendation : alert.actionRecommendationEn}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 pt-2 border-t border-gray-800/50">
                                <span>Source: {alert.source}</span>
                                <span>•</span>
                                <span>Type: {alert.type}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>

      </div>
    </div>
  );
}
