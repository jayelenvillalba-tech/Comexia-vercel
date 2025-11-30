import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Search, Filter, TrendingUp, Package, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import PostCard from "@/components/marketplace/post-card";
import PostForm from "@/components/marketplace/post-form";
import MarketplaceFilters from "@/components/marketplace/filters";

export default function Marketplace() {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all" as "all" | "buy" | "sell",
    hsCode: "",
    country: "",
    dateRange: "all" as "all" | "today" | "week" | "month",
    verifiedOnly: false
  });

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
      return response.json();
    }
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

  // Calculate stats
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {language === 'es' ? '🌐 Marketplace B2B' : '🌐 B2B Marketplace'}
              </h1>
              <p className="text-slate-300">
                {language === 'es' 
                  ? 'Conecta con empresas verificadas de comercio internacional'
                  : 'Connect with verified international trade companies'}
              </p>
            </div>
            <Button
              onClick={() => setShowPostForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              {language === 'es' ? 'Nueva Publicación' : 'New Post'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{language === 'es' ? 'Publicaciones Activas' : 'Active Posts'}</p>
                    <p className="text-white text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{language === 'es' ? 'Empresas Verificadas' : 'Verified Companies'}</p>
                    <p className="text-white text-2xl font-bold">{stats.verifiedCompanies}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{language === 'es' ? 'Países' : 'Countries'}</p>
                    <p className="text-white text-2xl font-bold">{stats.countries}</p>
                  </div>
                  <Globe className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">{language === 'es' ? 'Hoy' : 'Today'}</p>
                    <p className="text-white text-2xl font-bold">{stats.todayPosts}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-yellow-400" />
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
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
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

        {/* Feed */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white">{language === 'es' ? 'Cargando publicaciones...' : 'Loading posts...'}</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-12 text-center">
                <p className="text-red-400">{language === 'es' ? 'Error al cargar publicaciones' : 'Error loading posts'}</p>
              </CardContent>
            </Card>
          ) : filteredPosts.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-white text-xl font-bold mb-2">
                  {language === 'es' ? 'No se encontraron publicaciones' : 'No posts found'}
                </h3>
                <p className="text-slate-300">
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
