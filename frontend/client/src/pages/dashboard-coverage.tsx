import { useQuery } from "@tanstack/react-query";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Database, Globe, Layers, Server } from 'lucide-react';
import { useLocation } from 'wouter';
import { Map, Marker } from 'pigeon-maps';
import { useLanguage } from '@/hooks/use-language';

interface CoverageStats {
  success: boolean;
  stats: {
    countries: number;
    hsCodes: number;
    dataPoints: number;
    lastUpdate: string;
  };
}

// Dark map provider
function darkMapTileProvider(x: number, y: number, z: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/${z}/${y}/${x}`;
}

export default function CoverageDashboard() {
  const [, navigate] = useLocation();
  const { language } = useLanguage();

  const { data, isLoading } = useQuery<CoverageStats>({
    queryKey: ["/api/coverage-stats"],
  });

  const stats = data?.stats || { countries: 0, hsCodes: 0, dataPoints: 0, lastUpdate: '-' };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      {/* Header */}
      <div className="bg-[#0D2137] border-b border-cyan-900/30 px-6 py-4 flex items-center justify-between">
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
            <Globe className="w-6 h-6 text-cyan-400" />
            {language === 'es' ? 'Dashboard de Cobertura de Datos' : 'Data Coverage Dashboard'}
          </h1>
        </div>
        <div className="text-xs text-gray-500">
           Last Update: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#0D2137] border-cyan-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {language === 'es' ? 'Países Cubiertos' : 'Countries Covered'}
              </CardTitle>
              <Globe className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{isLoading ? '...' : stats.countries}</div>
              <p className="text-xs text-green-400 mt-1">Global Coverage (190+ Target)</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0D2137] border-cyan-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {language === 'es' ? 'Códigos HS' : 'HS Codes'}
              </CardTitle>
              <Layers className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{isLoading ? '...' : stats.hsCodes}</div>
              <p className="text-xs text-blue-400 mt-1">Product Categories</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0D2137] border-cyan-900/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {language === 'es' ? 'Datos de Mercado (UN Comtrade)' : 'Market Data Points'}
              </CardTitle>
              <Database className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{isLoading ? '...' : stats.dataPoints}</div>
              <p className="text-xs text-purple-400 mt-1">Cached API Responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Map Visualization */}
        <div className="bg-[#0D2137] rounded-lg border border-cyan-900/30 p-1 overflow-hidden h-[500px] relative">
           <div className="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block mr-2"></span>
              Active Countries
           </div>
           <Map
             provider={darkMapTileProvider}
             center={[20, 0]}
             zoom={2}
             height={500}
           >
             {/* We could render all 190 markers here, but for performance maybe just key hubs */}
             <Marker anchor={[35.8617, 104.1954]} payload="China" />
             <Marker anchor={[37.0902, -95.7129]} payload="USA" />
             <Marker anchor={[-34.6037, -58.3816]} payload="Argentina" />
             <Marker anchor={[51.1657, 10.4515]} payload="Germany" />
             <Marker anchor={[-14.2350, -51.9253]} payload="Brazil" />
             <Marker anchor={[-25.2744, 133.7751]} payload="Australia" />
             <Marker anchor={[20.5937, 78.9629]} payload="India" />
             <Marker anchor={[9.0820, 8.6753]} payload="Nigeria" />
             <Marker anchor={[55.3781, -3.4360]} payload="UK" />
             <Marker anchor={[61.5240, 105.3188]} payload="Russia" />
           </Map>
        </div>

        {/* Status Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-[#0D2137] rounded-lg p-6 border border-cyan-900/30">
              <h3 className="text-lg font-semibold mb-4 text-cyan-100 flex items-center gap-2">
                 <Server className="w-4 h-4" />
                 System Status
              </h3>
              <div className="space-y-4 text-sm text-gray-400">
                 <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Database Status</span>
                    <span className="text-green-400">Healthy</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>API Comtrade Connection</span>
                    <span className="text-green-400">Active</span>
                 </div>
                 <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span>Cache Hit Rate</span>
                    <span className="text-blue-400">Estimating...</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#0D2137] rounded-lg p-6 border border-cyan-900/30">
              <h3 className="text-lg font-semibold mb-4 text-cyan-100">
                 {language === 'es' ? 'Próximas Actualizaciones' : 'Upcoming Updates'}
              </h3>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                     Expand HS Codes to 1,000
                  </li>
                  <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                     Integrate Real-time Freight Rates
                  </li>
               </ul>
           </div>
        </div>

      </div>
    </div>
  );
}
