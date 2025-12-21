
// Simulated News Service for ComexIA
// In production, this would use rss-parser to fetch real feeds from:
// - Mercosur Official: https://www.mercosur.int/feed/
// - China Customs: http://www.customs.gov.cn/
// - WTO News: https://www.wto.org/english/news_e/news_e.htm

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: Date;
  url: string;
  category: "regulacion" | "mercado" | "logistica" | "aranceles";
  country?: string; // AR, BR, CN, US, etc.
  imageUrl?: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "OMC: Nuevo Acuerdo de Facilitación del Comercio (TFA)",
    summary: "La Organización Mundial del Comercio anuncia nuevas medidas para digitalizar procesos aduaneros globales.",
    source: "WTO Official (OMC)",
    date: new Date("2025-12-18T09:00:00"),
    url: "https://www.wto.org/",
    category: "regulacion",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n2",
    title: "FDA: Alerta de Importación 99-19 (Salmonella)",
    summary: "La FDA actualiza la lista roja para productos vegetales frescos provenientes de Sudamérica. Se intensifican controles.",
    source: "FDA Alerts",
    date: new Date("2025-12-17T14:30:00"),
    url: "https://www.fda.gov/",
    category: "regulacion",
    country: "US",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n3",
    title: "Aduana China (GACC): Decreto 248/249 Actualizado",
    summary: "Nuevos requisitos de etiquetado para alimentos procesados y bebidas alcohólicas a partir de Enero 2026.",
    source: "GACC China",
    date: new Date("2025-12-16T08:15:00"),
    url: "http://www.customs.gov.cn/",
    category: "regulacion",
    country: "CN",
    imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n4",
    title: "Unión Europea: Reglamento de Deforestación (EUDR)",
    summary: "Entrada en vigor de la prohibición de importar soja, carne y madera de zonas deforestadas. Requiere geolocalización.",
    source: "European Commission",
    date: new Date("2025-12-15T11:00:00"),
    url: "https://ec.europa.eu/",
    category: "mercado",
    country: "EU",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-dfd8f3793371?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n5",
    title: "SENASA: Apertura de mercado de Cítricos a India",
    summary: "Se aprobaron los protocolos fitosanitarios para la exportación de limones y naranjas dulces.",
    source: "SENASA Oficial",
    date: new Date("2025-12-14T16:45:00"),
    url: "#",
    category: "mercado",
    country: "AR",
    imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53385f9?auto=format&fit=crop&w=800&q=80"
  }
];

export const newsService = {
  async getLatestNews(limit: number = 10, category?: string): Promise<NewsItem[]> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let news = [...MOCK_NEWS];
    
    if (category && category !== 'all') {
      news = news.filter(item => item.category === category);
    }
    
    return news.slice(0, limit);
  },

  async searchNews(query: string): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    
    return MOCK_NEWS.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.summary.toLowerCase().includes(lowerQuery)
    );
  }
};
