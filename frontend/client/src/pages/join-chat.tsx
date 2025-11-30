import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { MessageCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JoinChat() {
  const { token } = useParams();
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const userId = "mock-user-1"; // TODO: Get from auth
  
  const joinMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/invites/${token}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join conversation');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setStatus('success');
      setTimeout(() => {
        navigate(`/chat/${data.conversationId}`);
      }, 2000);
    },
    onError: (error: any) => {
      setStatus('error');
      setErrorMessage(error.message);
    }
  });
  
  const handleJoin = () => {
    setStatus('loading');
    joinMutation.mutate();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg border-white/20 p-8">
        {status === 'idle' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {language === 'es' ? '¡Has sido invitado!' : 'You\'ve been invited!'}
            </h1>
            <p className="text-slate-300 mb-6">
              {language === 'es' 
                ? 'Te han invitado a colaborar en una conversación de negociación.' 
                : 'You\'ve been invited to collaborate on a negotiation conversation.'}
            </p>
            <Button
              onClick={handleJoin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              {language === 'es' ? 'Unirse a la Conversación' : 'Join Conversation'}
            </Button>
          </div>
        )}
        
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'es' ? 'Uniéndote...' : 'Joining...'}
            </h2>
            <p className="text-slate-300">
              {language === 'es' ? 'Un momento por favor' : 'Please wait'}
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'es' ? '¡Éxito!' : 'Success!'}
            </h2>
            <p className="text-slate-300">
              {language === 'es' 
                ? 'Te has unido a la conversación. Redirigiendo...' 
                : 'You\'ve joined the conversation. Redirecting...'}
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {language === 'es' ? 'Error' : 'Error'}
            </h2>
            <p className="text-slate-300 mb-6">
              {errorMessage || (language === 'es' 
                ? 'No se pudo unir a la conversación' 
                : 'Could not join conversation')}
            </p>
            <Button
              onClick={() => navigate('/chat')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {language === 'es' ? 'Ir al Chat' : 'Go to Chat'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
