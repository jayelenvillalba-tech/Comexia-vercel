
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
    title: "Nueva actualización del Arancel Externo Común (AEC) del Mercosur",
    summary: "Los estados partes han acordado una reducción del 10% en alícuotas para bienes de capital e informática.",
    source: "Mercosur Oficial",
    date: new Date("2025-12-05T10:00:00"),
    url: "https://www.mercosur.int/",
    category: "aranceles",
    country: "AR", // Applies to region but flagging AR as user context
    imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n2",
    title: "China modifica protocolos para importación de carne bovina",
    summary: "Se exigen nuevos certificados sanitarios digitales a partir de enero 2026. Impacto directo en frigoríficos exportadores.",
    source: "Aduana China (GACC)",
    date: new Date("2025-12-04T14:30:00"),
    url: "#",
    category: "regulacion",
    country: "CN",
    imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n3",
    title: "Crisis en el Canal de Panamá: Impacto en rutas logísticas",
    summary: "Las restricciones de calado continúan afectando los tiempos de tránsito. Se recomiendan rutas alternativas por el Cabo de Hornos para cargas no perecederas.",
    source: "Logistics World",
    date: new Date("2025-12-03T09:15:00"),
    url: "#",
    category: "logistica",
    imageUrl: "https://images.unsplash.com/photo-1494412574643-35d324688b59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n4",
    title: "Acuerdo UE-Mercosur: Avances en capítulos de sostenibilidad",
    summary: "Bruselas y Montevideo acercan posiciones sobre la ley de deforestación. Se espera firma preliminar en la próxima cumbre.",
    source: "EuroNews",
    date: new Date("2025-12-02T11:00:00"),
    url: "#",
    category: "mercado",
    country: "UY",
    imageUrl: "https://images.unsplash.com/photo-1526304640152-d4619684e484?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "n5",
    title: "Brasil reporta récord en exportación de soja y maíz",
    summary: "El puerto de Santos opera a máxima capacidad. Oportunidades para proveedores de servicios logísticos fluviales.",
    source: "Comex Online",
    date: new Date("2025-12-01T16:45:00"),
    url: "#",
    category: "mercado",
    country: "BR"
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
