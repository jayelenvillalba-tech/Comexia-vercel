import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { MessageCircle, Search, Building2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useLocation } from "wouter";

interface Conversation {
  id: string;
  otherCompany: {
    id: string;
    name: string;
    verified: boolean;
    country: string;
  };
  lastMessage: {
    content: string;
    createdAt: Date;
    senderId: string;
  } | null;
  unreadCount: number;
  lastMessageAt: Date;
}

export default function ChatList() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock user ID - TODO: Get from auth
  const userId = "mock-user-1";
  
  // Fetch conversations with polling every 10 seconds
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/conversations?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    },
    refetchInterval: 10000 // Poll every 10 seconds
  });
  
  // Filter conversations by search
  const filteredConversations = conversations.filter(convo => 
    convo.otherCompany?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format time ago
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return language === 'es' ? 'Ahora' : 'Now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}${language === 'es' ? 'm' : 'm'}`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}${language === 'es' ? 'h' : 'h'}`;
    return `${Math.floor(seconds / 86400)}${language === 'es' ? 'd' : 'd'}`;
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            {language === 'es' ? 'Conversaciones' : 'Conversations'}
          </h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={language === 'es' ? 'Buscar empresa...' : 'Search company...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400"
          />
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-2">{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-300">
                {searchQuery 
                  ? (language === 'es' ? 'No se encontraron conversaciones' : 'No conversations found')
                  : (language === 'es' ? 'No tienes conversaciones aún' : 'No conversations yet')}
              </p>
              <p className="text-slate-400 text-sm mt-1">
                {language === 'es' 
                  ? 'Contacta empresas desde el marketplace'
                  : 'Contact companies from the marketplace'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((convo) => (
            <Card
              key={convo.id}
              onClick={() => navigate(`/chat/${convo.id}`)}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Company Name */}
                    <div className="flex items-center mb-1">
                      <Building2 className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                      <h3 className="text-white font-semibold truncate">
                        {convo.otherCompany?.name || 'Unknown Company'}
                      </h3>
                      {convo.otherCompany?.verified && (
                        <CheckCircle className="w-4 h-4 text-green-400 ml-1 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Last Message Preview */}
                    {convo.lastMessage && (
                      <p className="text-slate-300 text-sm truncate">
                        {convo.lastMessage.content}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end ml-3 flex-shrink-0">
                    {/* Time */}
                    <span className="text-slate-400 text-xs mb-1">
                      {timeAgo(convo.lastMessageAt)}
                    </span>
                    
                    {/* Unread Badge */}
                    {convo.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white">
                        {convo.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
