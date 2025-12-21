import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface SmartRepliesProps {
  conversationId: string;
  onSelectReply: (reply: string) => void;
  lastMessageId?: string;
}

export default function SmartReplies({ conversationId, onSelectReply, lastMessageId }: SmartRepliesProps) {
  const { language } = useLanguage();
  
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['smart-replies', conversationId, lastMessageId],
    queryFn: async () => {
      const response = await fetch('/api/chat/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId })
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.suggestions || [];
    },
    enabled: !!conversationId && !!lastMessageId,
    staleTime: 60000 // Cache for 1 minute
  });
  
  if (isLoading || suggestions.length === 0) return null;
  
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
      <div className="flex items-center text-xs text-purple-400 mr-1 shrink-0">
        <Sparkles className="w-3 h-3 mr-1" />
        {language === 'es' ? 'Sugerencias IA' : 'AI Suggestions'}
      </div>
      {suggestions.map((reply: string, index: number) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelectReply(reply)}
          className="h-7 text-xs bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20 whitespace-nowrap shrink-0"
        >
          {reply}
        </Button>
      ))}
    </div>
  );
}
