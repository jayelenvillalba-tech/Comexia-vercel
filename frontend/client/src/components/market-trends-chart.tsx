import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface MarketTrendsChartProps {
    hsCode: string;
    country: string;
    productName: string;
}

export function MarketTrendsChart({ hsCode, country, productName }: MarketTrendsChartProps) {
    const { language } = useLanguage();

    const { data, isLoading } = useQuery({
        queryKey: ['trends', hsCode, country],
        queryFn: async () => {
            const res = await fetch(`/api/trends?hsCode=${hsCode}&country=${country}`);
            if (!res.ok) throw new Error('Failed to fetch trends');
            return res.json();
        }
    });

    if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading forecast...</div>;
    if (!data?.data) return null;

    const { history, forecast, cagr } = data.data;

    // Combine data for the chart
    // We want the lines to connect. The last history point should be the start of forecast visualization?
    // Or just plot them on the same axis.
    
    const chartData = [
        ...history.map((h: any) => ({ ...h, historyValue: h.value, forecastValue: null })),
        ...forecast.map((f: any) => ({ ...f, historyValue: null, forecastValue: f.value }))
    ];

    // Connect the lines visually by adding a bridge point if needed, or Recharts 'connectNulls' might handle it
    // Better strategy: Add the last history point as the first forecast point
    if (history.length > 0 && forecast.length > 0) {
        const lastHistory = history[history.length - 1];
        // Insert a bridge point at the start of forecast part that has both values (or just forecast value matching history)
        // Actually, just having them share the X axis is enough if we handle the lines correctly.
        // Let's rely on visual separation.
    }

    const isPositive = parseFloat(cagr) > 0;

    return (
        <Card className="bg-[#0D2137] border-cyan-900/30">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                             <Activity className="w-5 h-5 text-cyan-400" />
                             {language === 'es' ? 'Predicción de Mercado (IA)' : 'Market Prediction (AI)'}
                        </CardTitle>
                        <CardDescription>
                            {productName} - {country} (2020 - 2028)
                        </CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full border ${isPositive ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'} flex items-center gap-1`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-bold text-sm">{cagr}% CAGR</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                            <XAxis 
                                dataKey="year" 
                                stroke="#9ca3af" 
                                tick={{fill: '#9ca3af'}} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#9ca3af" 
                                tick={{fill: '#9ca3af'}} 
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value/1000000}M`}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0A1929', borderColor: '#1f2937', color: '#fff' }}
                                formatter={(value: number) => [`$${(value/1000000).toFixed(1)}M`, 'Volume']}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="historyValue" 
                                name={language === 'es' ? "Histórico" : "Historical"}
                                stroke="#06b6d4" 
                                strokeWidth={3}
                                dot={{ fill: '#06b6d4', r: 4 }}
                                connectNulls
                            />
                            <Line 
                                type="monotone" 
                                dataKey="forecastValue" 
                                name={language === 'es' ? "Predicción" : "Forecast"}
                                stroke="#f59e0b" 
                                strokeWidth={3} 
                                strokeDasharray="5 5"
                                dot={{ fill: '#f59e0b', r: 4 }}
                                connectNulls
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-gray-500 mt-4">
                    {language === 'es' 
                    ? '* Predicción basada en algoritmo de regresión lineal sobre datos históricos UN Comtrade.'
                    : '* Prediction based on linear regression algorithm over UN Comtrade historical data.'}
                </p>
            </CardContent>
        </Card>
    );
}
