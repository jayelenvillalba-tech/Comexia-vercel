import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Send, Calculator, Building2, CheckCircle, Users, UserPlus, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import ParticipantsList from "./participants-list";
import TransferDialog from "./transfer-dialog";
import RoleBadge from "./role-badge";
import SmartReplies from "./smart-replies";
import QuoteMessage from "./quote-message";
import AudioCall from "./audio-call";

interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: string;
  createdAt: Date;
  sender: {
    name: string;
    role: string;
    primaryRole?: string;
  };
}

interface ChatWindowProps {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: ChatWindowProps) {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  
  // Mock user ID - TODO: Get from auth
  const userId = "mock-user-1";
  
  // Fetch messages with polling every 5 seconds
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!conversationId
  });
  
  // Get conversation details
  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/conversations?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      return response.json();
    }
  });
  
  const conversation = conversations.find((c: any) => c.id === conversationId);
  const lastMessage = messages[messages.length - 1];
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ content, type = 'text' }: { content: string, type?: string }) => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content, messageType: type })
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onMutate: async ({ content, type }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      
      const previousMessages = queryClient.getQueryData(['messages', conversationId]);
      
      queryClient.setQueryData(['messages', conversationId], (old: any) => [
        ...(old || []),
        {
          id: 'temp-' + Date.now(),
          content,
          senderId: userId,
          messageType: type || 'text',
          createdAt: new Date(),
          sender: { name: 'Tú', role: '' },
          pending: true
        }
      ]);
      
      return { previousMessages };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['messages', conversationId], context?.previousMessages);
    },
    onSuccess: () => {
      // Refetch to get actual message
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
    }
  });
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle send message
  const handleSend = () => {
    if (!messageText.trim()) return;
    
    sendMessageMutation.mutate({ content: messageText });
    setMessageText("");
  };
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString(language === 'es' ? 'es-ES' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSmartReply = (reply: string) => {
    setMessageText(reply);
  };
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/chat')}
            className="mr-3 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div>
            <div className="flex items-center">
              <Building2 className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-white font-bold">
                {conversation?.otherCompany?.name || 'Loading...'}
              </h2>
              {conversation?.otherCompany?.verified && (
                <CheckCircle className="w-4 h-4 text-green-400 ml-2" />
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {conversation?.otherCompany?.country || ''}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
           <Button
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white hover:bg-purple-500/20"
            title={language === 'es' ? 'Asistente IA' : 'AI Assistant'}
          >
            <Sparkles className="w-5 h-5" />
          </Button>
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCallActive(true)}
            className="text-green-300 hover:text-white hover:bg-green-500/20"
            title={language === 'es' ? 'Llamada de voz' : 'Voice call'}
          >
            <Phone className="w-5 h-5" />
          </Button>
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsTransferOpen(true)}
            className="text-slate-300 hover:text-white hover:bg-white/10"
            title={language === 'es' ? 'Trasladar' : 'Transfer'}
          >
            <UserPlus className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className={`text-slate-300 hover:text-white hover:bg-white/10 ${showParticipants ? 'bg-white/10 text-white' : ''}`}
            title={language === 'es' ? 'Participantes' : 'Participants'}
          >
            <Users className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">
                  {language === 'es' 
                    ? 'No hay mensajes aún. ¡Inicia la conversación!'
                    : 'No messages yet. Start the conversation!'}
                </p>
              </div>
            ) : (
              messages.map((message: any) => {
                // System message
                if (message.messageType === 'system') {
                  return (
                    <div key={message.id} className="flex justify-center my-4">
                      <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1 text-xs text-slate-400 flex items-center">
                        <span className="italic">{message.content}</span>
                      </div>
                    </div>
                  );
                }
                
                const isSent = message.senderId === userId;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
                      {/* Sender name & role (for received messages) */}
                      {!isSent && (
                        <div className="flex items-center mb-1 ml-3 space-x-2">
                          <span className="text-slate-400 text-xs">
                            {message.sender?.name || 'Unknown'}
                          </span>
                          {message.sender?.primaryRole && (
                            <RoleBadge role={message.sender.primaryRole} className="text-[10px] px-1.5 py-0 h-4" />
                          )}
                        </div>
                      )}
                      
                      {/* Message bubble */}
                      {message.messageType === 'quote' ? (
                        <QuoteMessage content={message.content} />
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            isSent
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-bl-none'
                          } ${message.pending ? 'opacity-50' : ''}`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <span className={`text-slate-500 text-xs mt-1 ${isSent ? 'mr-3' : 'ml-3'}`}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
            {/* Smart Replies */}
            {lastMessage && lastMessage.senderId !== userId && (
              <SmartReplies 
                conversationId={conversationId} 
                lastMessageId={lastMessage.id}
                onSelectReply={handleSmartReply}
              />
            )}
            
            <div className="flex items-center space-x-2 mt-2">
              {/* Quick actions */}
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-white/10"
                title={language === 'es' ? 'Calculadora de costos' : 'Cost calculator'}
              >
                <Calculator className="w-5 h-5" />
              </Button>
              
              {/* Message input */}
              <Input
                type="text"
                placeholder={language === 'es' ? 'Escribe un mensaje...' : 'Type a message...'}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-slate-400"
              />
              
              {/* Send button */}
              <Button
                onClick={handleSend}
                disabled={!messageText.trim() || sendMessageMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Participants Sidebar */}
        {showParticipants && (
          <ParticipantsList 
            conversationId={conversationId} 
            onTransferClick={() => setIsTransferOpen(true)}
          />
        )}
      </div>
      
      {/* Transfer Dialog */}
      <TransferDialog 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        conversationId={conversationId} 
      />
      
      {/* Audio Call */}
      <AudioCall 
        conversationId={conversationId}
        isCallActive={isCallActive}
        onEndCall={() => setIsCallActive(false)}
      />
    </div>
  );
}
