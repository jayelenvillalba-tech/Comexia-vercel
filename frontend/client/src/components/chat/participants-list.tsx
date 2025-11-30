import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Users, UserPlus, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import RoleBadge from "./role-badge";
import InviteDialog from "./invite-dialog";

interface Participant {
  id: string;
  userId: string;
  role: string;
  addedAt: string;
  user: {
    name: string;
    email: string;
    primaryRole: string;
  };
}

interface ParticipantsListProps {
  conversationId: string;
  onTransferClick: () => void;
}

export default function ParticipantsList({ conversationId, onTransferClick }: ParticipantsListProps) {
  const { language } = useLanguage();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  const { data: participants = [], isLoading } = useQuery<Participant[]>({
    queryKey: ['participants', conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/participants`);
      if (!response.ok) throw new Error('Failed to fetch participants');
      return response.json();
    },
    enabled: !!conversationId
  });
  
  return (
    <div className="w-64 border-l border-white/10 bg-black/20 hidden md:flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center text-sm">
          <Users className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Participantes' : 'Participants'}
          <span className="ml-2 bg-white/10 text-xs px-2 py-0.5 rounded-full text-slate-300">
            {participants.length}
          </span>
        </h3>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-slate-400 text-sm">
              {language === 'es' ? 'Cargando...' : 'Loading...'}
            </div>
          ) : (
            participants.map((p) => (
              <div key={p.id} className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 border border-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs text-white">
                    {p.user?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {p.user?.name || 'Unknown'}
                  </p>
                  <RoleBadge role={p.role} className="mt-1 text-[10px] px-1.5 py-0 h-5" />
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(p.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-white/10 space-y-2">
        <Button 
          onClick={() => setIsInviteOpen(true)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          size="sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Invitar Agente' : 'Invite Agent'}
        </Button>
        <Button 
          onClick={onTransferClick}
          className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
          size="sm"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Trasladar' : 'Transfer'}
        </Button>
      </div>
      
      <InviteDialog 
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        conversationId={conversationId}
      />
    </div>
  );
}
