import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Briefcase, Globe, ShoppingCart, Truck, Clock } from 'lucide-react';
import { MarketplacePost } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Simple Card Component for Listing
function ListingCard({ post }: { post: any }) {
    const { language } = useLanguage();
    const [, navigate] = useLocation();
    
    const handleContact = async () => {
        try {
            // Mock ID for current user - in real app from auth context
            const userId = 'mock-user-1'; // Ensure this matches user created in seeds or generic mock
            
            const res = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, postId: post.id })
            });
            
            if (res.ok) {
                const data = await res.json();
                navigate(`/chat/${data.id}`);
            }
        } catch (error) {
            console.error('Failed to start conversation', error);
        }
    };

    return (
        <div className="bg-[#0D2137] border border-cyan-900/30 rounded-lg p-5 hover:border-cyan-500/50 transition-all group">
            <div className="flex justify-between items-start mb-3">
                <Badge variant={post.type === 'sell' ? 'default' : 'secondary'} className={post.type === 'sell' ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'}>
                    {post.type === 'sell' ? (language === 'es' ? 'OFERTA' : 'OFFER') : (language === 'es' ? 'DEMANDA' : 'DEMAND')}
                </Badge>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">{post.productName}</h3>
            
            <div className="space-y-2 text-sm text-gray-400 mb-4">
                 <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <span>{post.originCountry} <span className="text-gray-600">→</span> {post.destinationCountry}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                    <span>{post.quantity}</span>
                 </div>
                 {post.price && (
                    <div className="flex items-center gap-2">
                        <span className="text-green-400 font-semibold">{post.price}</span>
                    </div>
                 )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                        {post.companyName?.substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-400 line-clamp-1">{post.companyName}</span>
                </div>
                <Button size="sm" variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs h-8" onClick={handleContact}>
                    {language === 'es' ? 'Contactar' : 'Contact'}
                </Button>
            </div>
        </div>
    );
}


// Create Post Dialog Component
function CreatePostDialog({ open, onOpenChange, onSuccess }: { open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        type: 'sell',
        title: '',
        hsCode: '',
        quantity: '',
        origin: '',
        description: '',
        price: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/marketplace/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0D2137] border-cyan-900/30 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{language === 'es' ? 'Publicar Nueva Oportunidad' : 'Post New Opportunity'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-xs text-gray-400">Type</label>
                            <select 
                                className="w-full bg-[#0A1929] border border-gray-700 rounded p-2 text-sm"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="sell">Venta / Oferta</option>
                                <option value="buy">Compra / Demanda</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs text-gray-400">HS Code</label>
                            <Input 
                                placeholder="e.g. 1001" 
                                className="bg-[#0A1929] border-gray-700" 
                                value={formData.hsCode}
                                onChange={e => setFormData({...formData, hsCode: e.target.value})}
                                required
                            />
                         </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Title / Product Name</label>
                        <Input 
                            placeholder="e.g. Exportación Soja 2024" 
                            className="bg-[#0A1929] border-gray-700" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Quantity</label>
                            <Input 
                                placeholder="e.g. 500 Tons" 
                                className="bg-[#0A1929] border-gray-700" 
                                value={formData.quantity}
                                onChange={e => setFormData({...formData, quantity: e.target.value})}
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs text-gray-400">Target Price (Optional)</label>
                            <Input 
                                placeholder="e.g. USD 400/MT" 
                                className="bg-[#0A1929] border-gray-700" 
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Origin / Destination</label>
                        <Input 
                            placeholder="e.g. Argentina / China" 
                            className="bg-[#0A1929] border-gray-700" 
                            value={formData.origin}
                            onChange={e => setFormData({...formData, origin: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400">Description</label>
                        <textarea 
                            className="w-full bg-[#0A1929] border border-gray-700 rounded p-2 text-sm min-h-[100px]"
                            placeholder="Describe quality, terms, incoterms..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                             {language === 'es' ? 'Publicar' : 'Post Now'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function Marketplace() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'buy' | 'sell'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<{data: any[]}>({
      queryKey: ['marketplace-posts', typeFilter],
      queryFn: async () => {
          let url = '/api/marketplace/posts';
          if (typeFilter !== 'all') url += `?type=${typeFilter}`;
          const res = await fetch(url);
          return res.json();
      }
  });

  const posts = data?.data || [];
  const filteredPosts = posts.filter(post => 
      post.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.hsCode.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#0A1929] text-white p-6 md:p-10">
      
      {/* Create Dialog */}
      <CreatePostDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        onSuccess={() => {
            refetch();
        }} 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Marketplace B2B
            </h1>
            <p className="text-gray-400 mt-1">
                {language === 'es' 
                 ? 'Conecta directamente con importadores y exportadores verificados.'
                 : 'Connect directly with verified importers and exporters.'}
            </p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Publicar Oportunidad' : 'Post Opportunity'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#0D2137] p-4 rounded-lg border border-cyan-900/30">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <Input 
                placeholder={language === 'es' ? "Buscar por producto, HS Code..." : "Search by product, HS Code..."} 
                className="pl-10 bg-[#0A1929] border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <Button 
                variant={typeFilter === 'all' ? 'default' : 'outline'} 
                className={typeFilter === 'all' ? 'bg-gray-700 hover:bg-gray-600' : 'border-gray-700 text-gray-400'}
                onClick={() => setTypeFilter('all')}
            >
                {language === 'es' ? 'Todos' : 'All'}
            </Button>
            <Button 
                variant={typeFilter === 'sell' ? 'default' : 'outline'} 
                className={typeFilter === 'sell' ? 'bg-green-700 hover:bg-green-600' : 'border-gray-700 text-gray-400'}
                onClick={() => setTypeFilter('sell')}
            >
                {language === 'es' ? 'Ofertas' : 'Offers'}
            </Button>
            <Button 
                variant={typeFilter === 'buy' ? 'default' : 'outline'} 
                className={typeFilter === 'buy' ? 'bg-blue-700 hover:bg-blue-600' : 'border-gray-700 text-gray-400'}
                onClick={() => setTypeFilter('buy')}
            >
                {language === 'es' ? 'Demandas' : 'Demands'}
            </Button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading marketplace...</div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post: any) => (
                  <ListingCard key={post.id} post={post} />
              ))}
          </div>
      )}

      {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-[#0D2137]/50 rounded-lg border-2 border-dashed border-gray-800">
              <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No matching listings found.</p>
          </div>
      )}
    </div>
  );
}
