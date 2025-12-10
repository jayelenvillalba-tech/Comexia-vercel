
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Search, Filter, TrendingUp, Package, Globe, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import PostCard from "@/components/marketplace/post-card";
import PostForm from "@/components/marketplace/post-form";
import MarketplaceFilters from "@/components/marketplace/filters";
import MarketplaceSidebar from "@/components/marketplace/sidebar";
import AuthGuardModal from "@/components/auth/auth-guard-modal";
import { useUser } from "@/context/user-context";

export default function Marketplace() {
  const { language } = useLanguage();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all" as "all" | "buy" | "sell",
    hsCode: "",
    country: "",
    dateRange: "all" as "all" | "today" | "week" | "month",
    verifiedOnly: false
  });

  // Load context from simulators
  useEffect(() => {
    const savedContext = sessionStorage.getItem('searchContext');
    if (savedContext) {
      try {
        const { product, origin, operation } = JSON.parse(savedContext);
        
        // Auto-apply filters based on context
        const targetType = operation === 'export' ? 'buy' : 'sell';
        
        setFilters(prev => ({
          ...prev,
          type: targetType,
          hsCode: product?.code || "",
          country: origin || ""
        }));

        if (product?.code) {
          setSearchQuery(product.code);
        }
      } catch (e) {
        console.error('Error parsing search context', e);
      }
    }
  }, []);

  const handleCreatePostClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowPostForm(true);
    }
  };

  // Fetch marketplace posts from API
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['marketplace-posts', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.type !== 'all') params.append('type', filters.type);
      if (filters.hsCode) params.append('hsCode', filters.hsCode);
      if (filters.country) params.append('country', filters.country);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
      if (filters.verifiedOnly) params.append('verifiedOnly', 'true');
      
      const response = await fetch(`/api/marketplace/posts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      return data;
    },
    initialData: [] 
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (newPost: any) => {
      const response = await fetch('/api/marketplace/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-posts'] });
      setShowPostForm(false);
    }
  });

  // Filter posts by search query (client-side for better UX)
  const filteredPosts = posts.filter((post: any) => {
    if (searchQuery && 
        !post.productName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.hsCode?.includes(searchQuery)) {
      return false;
    }
    return true;
  });

  // Calculate stats logic remains same but simplified for rewriting:
  const stats = {
    totalPosts: posts.length,
    verifiedCompanies: new Set(posts.filter((p: any) => p.company?.verified).map((p: any) => p.company?.id)).size,
    countries: new Set(posts.map((p: any) => p.company?.country).filter(Boolean)).size,
    todayPosts: posts.filter((p: any) => {
      if (!p.createdAt) return false;
      const postDate = new Date(p.createdAt);
      const hoursDiff = (Date.now() - postDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    }).length
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col font-sans">
      <Header />
      <AuthGuardModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        title={language === 'es' ? 'Acceso a Publicaciones' : 'Posting Access'}
        description={language === 'es' 
          ? 'Necesitas una cuenta verificada para publicar oportunidades de negocio.' 
          : 'You need a verified account to post business opportunities.'}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {language === 'es' ? '🌐 Mercado Global' : '🌐 Global Marketplace'}
              </h1>
              <p className="text-slate-400">
                {language === 'es' 
                  ? 'Conecta con empresas verificadas de comercio internacional'
                  : 'Connect with verified international trade companies'}
              </p>
            </div>
            <Button
              onClick={handleCreatePostClick}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              {language === 'es' ? 'Publicar Solicitud' : 'Post Request'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#0D2137] shadow-sm border-cyan-900/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{language === 'es' ? 'Publicaciones Activas' : 'Active Posts'}</p>
                    <p className="text-white text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <div className="p-2 bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D2137] shadow-sm border-cyan-900/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{language === 'es' ? 'Empresas Verificadas' : 'Verified Companies'}</p>
                    <p className="text-white text-2xl font-bold">{stats.verifiedCompanies}</p>
                  </div>
                  <div className="p-2 bg-blue-900/20 rounded-lg">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D2137] shadow-sm border-cyan-900/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{language === 'es' ? 'Países' : 'Countries'}</p>
                    <p className="text-white text-2xl font-bold">{stats.countries}</p>
                  </div>
                  <div className="p-2 bg-purple-900/20 rounded-lg">
                    <Globe className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">{language === 'es' ? 'Nuevas Hoy' : 'New Today'}</p>
                    <p className="text-slate-900 text-2xl font-bold">{stats.todayPosts}</p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={language === 'es' ? 'Buscar por producto o HS Code...' : 'Search by product or HS Code...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Filter className="w-5 h-5 mr-2" />
              {language === 'es' ? 'Filtros' : 'Filters'}
              {Object.values(filters).some(v => v && v !== "all") && (
                <Badge className="ml-2 bg-blue-500">
                  {Object.values(filters).filter(v => v && v !== "all").length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <MarketplaceFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </div>

        {/* Layout: Sidebar + Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <MarketplaceSidebar />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-12 text-center">
                  <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-slate-500">{language === 'es' ? 'Cargando publicaciones...' : 'Loading posts...'}</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-12 text-center">
                  <p className="text-red-500">{language === 'es' ? 'Error al cargar publicaciones' : 'Error loading posts'}</p>
                </CardContent>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <Card className="bg-white border-slate-200">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-slate-900 text-xl font-bold mb-2">
                    {language === 'es' ? 'No se encontraron publicaciones' : 'No posts found'}
                  </h3>
                  <p className="text-slate-500">
                    {language === 'es' 
                      ? 'Intenta ajustar los filtros o crea una nueva publicación'
                      : 'Try adjusting the filters or create a new post'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <PostForm
          onClose={() => setShowPostForm(false)}
          onSubmit={(data) => {
            createPostMutation.mutate(data);
          }}
        />
      )}
    </div>
  );
}
