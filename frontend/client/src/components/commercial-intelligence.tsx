import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Clock, 
  Globe, 
  Target,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity,
  TrendingDown,
  Eye,
  Users,
  Gauge
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TradeAlert, TradeOpportunity, MarketIntelligence } from "@shared/schema";

export default function CommercialIntelligence() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: alerts = [] } = useQuery<TradeAlert[]>({
    queryKey: ["/api/trade-alerts"],
    queryFn: async () => {
      const response = await fetch("/api/trade-alerts?active=true");
      if (!response.ok) throw new Error("Failed to fetch alerts");
      return response.json();
    },
  });

  const { data: opportunities = [] } = useQuery<TradeOpportunity[]>({
    queryKey: ["/api/trade-opportunities"],
    queryFn: async () => {
      const response = await fetch("/api/trade-opportunities?active=true");
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      return response.json();
    },
  });

  const { data: reports = [] } = useQuery<MarketIntelligence[]>({
    queryKey: ["/api/market-intelligence"],
    queryFn: async () => {
      const response = await fetch("/api/market-intelligence?recent=true");
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <AlertCircle className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "opportunity": return <TrendingUp className="w-4 h-4" />;
      case "risk": return <Shield className="w-4 h-4" />;
      case "regulatory": return <FileText className="w-4 h-4" />;
      case "market": return <BarChart3 className="w-4 h-4" />;
      case "price": return <DollarSign className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600";
      case "medium": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600";
      case "moderate": return "text-yellow-600";
      case "difficult": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Brain className="mr-3 text-purple-600 w-6 h-6" />
            {t("intelligence.title")}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{t("intelligence.subtitle")}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">En Vivo</span>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">{t("intelligence.tabs.dashboard")}</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            {t("intelligence.tabs.alerts")}
            {alerts.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1 py-0">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="relative">
            {t("intelligence.tabs.opportunities")}
            {opportunities.length > 0 && (
              <Badge className="ml-2 bg-green-500 text-white text-xs px-1 py-0">
                {opportunities.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">{t("intelligence.tabs.reports")}</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("intelligence.dashboard.activeAlerts")}
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{alerts.length}</div>
                <p className="text-xs text-gray-600">
                  {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length} alta prioridad
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("intelligence.dashboard.newOpportunities")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{opportunities.length}</div>
                <p className="text-xs text-gray-600">
                  {opportunities.filter(o => parseFloat(o.roi || '0') > 25).length} alto ROI (&gt;25%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("intelligence.dashboard.recentReports")}
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
                <p className="text-xs text-gray-600">
                  {reports.filter(r => r.isFeature).length} análisis destacados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 w-5 h-5 text-yellow-600" />
                  Alertas Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert, index) => (
                    <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-1 rounded ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {language === 'en' ? alert.titleEn : alert.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.affectedCountries && alert.affectedCountries.slice(0, 2).join(", ")}
                          {alert.affectedCountries && alert.affectedCountries.length > 2 && " +more"}
                        </p>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      {t("intelligence.alerts.noAlerts")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 w-5 h-5 text-green-600" />
                  Mejores Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {opportunities
                    .sort((a, b) => parseFloat(b.confidenceScore || '0') - parseFloat(a.confidenceScore || '0'))
                    .slice(0, 3)
                    .map((opportunity, index) => (
                    <div key={opportunity.id} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-1 rounded bg-green-100 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {language === 'en' ? opportunity.titleEn : opportunity.title}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                          <span>ROI: {opportunity.roi}%</span>
                          <span>Confianza: {opportunity.confidenceScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {opportunities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      {t("intelligence.opportunities.noOpportunities")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="mr-2 w-5 h-5 text-orange-600" />
              {t("intelligence.alerts.title")}
            </h4>
            <Badge variant="outline">
              {alerts.length} activas
            </Badge>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {language === 'en' ? alert.titleEn : alert.title}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {t(`intelligence.alerts.severity.${alert.severity}`)}
                        </Badge>
                        <Badge variant="outline">
                          {t(`intelligence.alerts.types.${alert.type}`)}
                        </Badge>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {alert.createdAt ? formatDate(alert.createdAt) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {t("intelligence.alerts.confidence")}: {alert.confidence}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {t("intelligence.alerts.impact")}: {alert.impactLevel}%
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">
                  {language === 'en' ? alert.descriptionEn : alert.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {alert.affectedCountries && alert.affectedCountries.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        {t("intelligence.alerts.affectedCountries")}
                      </h6>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedCountries.map((country, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {alert.affectedProducts && alert.affectedProducts.length > 0 && (
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        {t("intelligence.alerts.affectedProducts")}
                      </h6>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedProducts.map((product, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {alert.actionRecommendation && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h6 className="font-medium text-blue-900 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t("intelligence.alerts.recommendedAction")}
                    </h6>
                    <p className="text-blue-800 text-sm">
                      {language === 'en' ? alert.actionRecommendationEn : alert.actionRecommendation}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {t("intelligence.alerts.source")}: {alert.source || 'Kora Intelligence'}
                  </span>
                  {alert.validUntil && (
                    <span>
                      {t("intelligence.alerts.validUntil")}: {formatDate(alert.validUntil)}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t("intelligence.alerts.noAlerts")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 w-5 h-5 text-green-600" />
              {t("intelligence.opportunities.title")}
            </h4>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {opportunities.length} disponibles
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? opportunity.titleEn : opportunity.title}
                    </h5>
                    <p className="text-sm text-gray-600 mb-3">
                      {opportunity.originCountry} → {opportunity.targetCountry}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {opportunity.productName}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50 text-gray-700">
                        {opportunity.hsCode}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(parseFloat(opportunity.opportunityValue || '0'))}
                    </div>
                    <div className="text-sm text-gray-600">
                      ROI: {opportunity.roi}%
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4">
                  {language === 'en' ? opportunity.descriptionEn : opportunity.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.growth")}:</span>
                      <span className="font-medium text-green-600">+{opportunity.growthProjection}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.competition")}:</span>
                      <span className={`font-medium ${getCompetitionColor(opportunity.competitionLevel)}`}>
                        {t(`intelligence.opportunities.${opportunity.competitionLevel}`)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.difficulty")}:</span>
                      <span className={`font-medium ${getDifficultyColor(opportunity.marketEntryDifficulty)}`}>
                        {t(`intelligence.opportunities.${opportunity.marketEntryDifficulty}`)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.timeToMarket")}:</span>
                      <span className="font-medium">{opportunity.timeToMarket} {t("intelligence.opportunities.months")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.confidence")}:</span>
                      <span className="font-medium text-blue-600">{opportunity.confidenceScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("intelligence.opportunities.initialInvestment")}:</span>
                      <span className="font-medium">{formatCurrency(parseFloat(opportunity.initialInvestment || '0'))}</span>
                    </div>
                  </div>
                </div>

                {opportunity.keyBenefits && opportunity.keyBenefits.length > 0 && (
                  <div className="mb-4">
                    <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {t("intelligence.opportunities.keyBenefits")}
                    </h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {(language === 'en' ? opportunity.keyBenefitsEn || [] : opportunity.keyBenefits).slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-1">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {opportunity.recommendedAction && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-blue-800 text-sm">
                      <strong>{t("intelligence.opportunities.recommendedAction")}:</strong>{" "}
                      {language === 'en' ? opportunity.recommendedActionEn : opportunity.recommendedAction}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Confianza: {opportunity.confidenceScore}%</span>
                  <span>Expira: {opportunity.expiresAt ? formatDate(opportunity.expiresAt) : 'N/A'}</span>
                </div>
              </div>
            ))}

            {opportunities.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t("intelligence.opportunities.noOpportunities")}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <FileText className="mr-2 w-5 h-5 text-blue-600" />
              {t("intelligence.reports.title")}
            </h4>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {reports.length} disponibles
            </Badge>
          </div>

          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {t(`intelligence.reports.types.${report.type}`)}
                      </Badge>
                      {report.region && (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700">
                          {t(`intelligence.reports.regions.${report.region}`)}
                        </Badge>
                      )}
                      {report.isFeature && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Destacado
                        </Badge>
                      )}
                    </div>
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {language === 'en' ? report.titleEn : report.title}
                    </h5>
                    <p className="text-gray-700 text-sm mb-3">
                      {language === 'en' ? report.summaryEn : report.summary}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Gauge className="w-3 h-3 mr-1" />
                        {t("intelligence.reports.reliability")}: {report.reliability}%
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Eye className="w-3 h-3 mr-1" />
                        {t("intelligence.reports.relevance")}: {report.relevanceScore}%
                      </div>
                    </div>
                  </div>
                </div>

                {report.keyInsights && report.keyInsights.length > 0 && (
                  <div className="mb-4">
                    <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-600" />
                      {t("intelligence.reports.keyInsights")}
                    </h6>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {(language === 'en' ? report.keyInsightsEn || [] : report.keyInsights).slice(0, 3).map((insight, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-yellow-500 mr-2">→</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.affectedCountries && report.affectedCountries.length > 0 && (
                  <div className="mb-4">
                    <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Países Afectados
                    </h6>
                    <div className="flex flex-wrap gap-1">
                      {report.affectedCountries.map((country, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {report.author || 'Kora Intelligence'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {report.publishedAt ? formatDate(report.publishedAt) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.sources && report.sources.length > 0 && (
                      <span className="text-xs">
                        {report.sources.length} fuentes
                      </span>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      {t("intelligence.reports.readMore")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center text-gray-500 py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>{t("intelligence.reports.noReports")}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}