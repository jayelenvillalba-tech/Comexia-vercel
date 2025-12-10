import { useState } from "react";
import { 
  Users, Bot, FileText, Newspaper, Plus, MoreHorizontal, 
  Search, Play, FileCheck, Download, ExternalLink, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";

interface ChatSidebarProps {
  conversationId: string;
}

export default function ChatSidebar({ conversationId }: ChatSidebarProps) {
  const { language } = useLanguage();
  const [activePanel, setActivePanel] = useState<"participants" | "ai" | "recordings" | "news">("participants");

  // Mock data - In a real app, this would come from props or queries
  const participants = [
    { id: 1, name: "Juan Pérez", role: "Export Manager", online: true, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan" },
    { id: 2, name: "Maria Chen", role: "Buyer", online: false, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" },
    { id: 3, name: "Carlos Ruiz", role: "Logistics", online: true, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" }
  ];

  const aiActions = [
    { id: 1, label: language === 'es' ? 'Generar Contrato' : 'Generate Contract', icon: FileCheck },
    { id: 2, label: language === 'es' ? 'Resumir Chat' : 'Summarize Chat', icon: FileText },
    { id: 3, label: language === 'es' ? 'Análisis de Sentimiento' : 'Sentiment Analysis', icon: Search },
  ];

  const recordings = [
    { id: 1, date: "2023-11-20", duration: "14:20", title: "Acuerdo Inicial" },
    { id: 2, date: "2023-11-22", duration: "08:45", title: "Discusión Logística" },
  ];

  const news = [
    { id: 1, title: "Nuevo protocolo sanitario China-Argentina", source: "Senasa", date: "Hace 2h" },
    { id: 2, title: "Aumento en demanda de carne premium", source: "Bloomberg", date: "Hace 5h" },
  ];

  return (
    <div className="w-80 border-l border-cyan-900/30 bg-[#0A1929] flex flex-col h-full">
      {/* Sidebar Navigation */}
      <div className="flex border-b border-cyan-900/30">
        <button
          onClick={() => setActivePanel("participants")}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-cyan-900/10 transition-colors ${activePanel === "participants" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"}`}
          title={language === 'es' ? "Participantes" : "Participants"}
        >
          <Users className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActivePanel("ai")}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-cyan-900/10 transition-colors ${activePanel === "ai" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"}`}
          title="AI Tools"
        >
          <Bot className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActivePanel("recordings")}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-cyan-900/10 transition-colors ${activePanel === "recordings" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"}`}
          title={language === 'es' ? "Grabaciones" : "Recordings"}
        >
          <Play className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActivePanel("news")}
          className={`flex-1 py-3 flex justify-center items-center hover:bg-cyan-900/10 transition-colors ${activePanel === "news" ? "border-b-2 border-cyan-500 text-cyan-400" : "text-gray-400"}`}
          title={language === 'es' ? "Noticias" : "News"}
        >
          <Newspaper className="w-5 h-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Participants Panel */}
        {activePanel === "participants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                {language === 'es' ? 'Participantes' : 'Participants'} ({participants.length})
              </h3>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-cyan-400 hover:text-cyan-300">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {participants.map((user) => (
                <div key={user.id} className="flex items-center gap-3 group">
                  <div className="relative">
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full bg-gray-700" />
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0A1929] rounded-full"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.role}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full border-dashed border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 text-xs">
              <Plus className="w-3 h-3 mr-2" />
              {language === 'es' ? 'Invitar Usuario' : 'Invite User'}
            </Button>
          </div>
        )}

        {/* AI Tools Panel */}
        {activePanel === "ai" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                ComexIA Assistant
              </h3>
              <p className="text-xs text-gray-400">
                {language === 'es' 
                  ? 'Herramientas inteligentes para agilizar tu negociación.' 
                  : 'Smart tools to streamline your negotiation.'}
              </p>
            </div>

            <div className="grid gap-2">
              {aiActions.map((action) => (
                <Button 
                  key={action.id} 
                  variant="outline" 
                  className="justify-start border-cyan-900/30 text-gray-300 hover:text-cyan-400 hover:bg-cyan-900/20 h-auto py-3"
                >
                  <action.icon className="w-4 h-4 mr-3 text-cyan-500" />
                  <span className="text-xs text-left">{action.label}</span>
                </Button>
              ))}
            </div>

            <Card className="bg-cyan-900/10 border-cyan-500/20">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-cyan-300">AI Insight</p>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      {language === 'es'
                        ? 'Basado en la conversación, parece que están discutiendo términos Incoterms. Sugiero revisar el seguro de carga.'
                        : 'Based on the conversation, it seems you are discussing Incoterms. I suggest reviewing cargo insurance.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recordings Panel */}
        {activePanel === "recordings" && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              {language === 'es' ? 'Grabaciones y Transcripciones' : 'Recordings & Transcripts'}
            </h3>
            <div className="space-y-3">
              {recordings.map((rec) => (
                <Card key={rec.id} className="bg-[#0D2137] border-cyan-900/30 hover:border-cyan-500/30 transition-colors cursor-pointer group">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 h-5">
                        {rec.date}
                      </Badge>
                      <span className="text-[10px] text-gray-500">{rec.duration}</span>
                    </div>
                    <h4 className="text-xs font-medium text-gray-200 mb-2 group-hover:text-cyan-300 transition-colors">{rec.title}</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-gray-400 hover:text-white bg-white/5">
                        <Play className="w-3 h-3 mr-1" /> Reprod.
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] text-gray-400 hover:text-white bg-white/5">
                        <FileText className="w-3 h-3 mr-1" /> Leer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs">
              <FileCheck className="w-3 h-3 mr-2" />
              {language === 'es' ? 'Generar Factura Pro-forma' : 'Generate Pro-forma Invoice'}
            </Button>
          </div>
        )}

        {/* News Panel */}
        {activePanel === "news" && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-white">
              {language === 'es' ? 'Noticias Relacionadas' : 'Related News'}
            </h3>
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] bg-blue-900/20 text-blue-300 hover:bg-blue-900/30">
                      {item.source}
                    </Badge>
                    <span className="text-[10px] text-gray-500">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-medium text-gray-300 group-hover:text-cyan-400 transition-colors leading-snug mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-[10px] text-gray-500 group-hover:text-gray-400">
                    {language === 'es' ? 'Leer reporte completo' : 'Read full report'}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                  <Separator className="mt-3 bg-cyan-900/20" />
                </div>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
