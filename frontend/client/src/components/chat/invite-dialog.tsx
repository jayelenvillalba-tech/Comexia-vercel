import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Check, Mail, Link as LinkIcon } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface InviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

export default function InviteDialog({ isOpen, onClose, conversationId }: InviteDialogProps) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const [role, setRole] = useState("logistica");
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);
  
  const userId = "mock-user-1"; // TODO: Get from auth
  
  const generateInviteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role, accessLevel: 'limited' })
      });
      if (!response.ok) throw new Error('Failed to generate invite');
      return response.json();
    },
    onSuccess: (data) => {
      setInviteUrl(data.inviteUrl);
    }
  });
  
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleGenerate = () => {
    generateInviteMutation.mutate();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {language === 'es' ? 'Invitar Agente Externo' : 'Invite External Agent'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {!inviteUrl ? (
            <>
              <div>
                <Label className="text-slate-300">
                  {language === 'es' ? 'Rol del invitado' : 'Guest role'}
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logistica">
                      🚚 {language === 'es' ? 'Logística' : 'Logistics'}
                    </SelectItem>
                    <SelectItem value="compras">
                      💼 {language === 'es' ? 'Compras' : 'Purchasing'}
                    </SelectItem>
                    <SelectItem value="tecnico">
                      👨‍🔧 {language === 'es' ? 'Técnico' : 'Technical'}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'es' 
                    ? 'El invitado tendrá acceso limitado a la conversación' 
                    : 'Guest will have limited access to the conversation'}
                </p>
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={generateInviteMutation.isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                {generateInviteMutation.isPending 
                  ? (language === 'es' ? 'Generando...' : 'Generating...') 
                  : (language === 'es' ? 'Generar Link de Invitación' : 'Generate Invite Link')}
              </Button>
            </>
          ) : (
            <>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <Label className="text-slate-300 text-sm">
                  {language === 'es' ? 'Link de invitación' : 'Invitation link'}
                </Label>
                <div className="flex items-center mt-2 space-x-2">
                  <Input
                    value={inviteUrl}
                    readOnly
                    className="bg-white/10 border-white/20 text-white text-sm"
                  />
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="shrink-0 border-white/20 hover:bg-white/10"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {language === 'es' 
                    ? 'Comparte este link con el agente. Expira en 72 horas.' 
                    : 'Share this link with the agent. Expires in 72 hours.'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 hover:bg-white/10"
                  onClick={() => {
                    setInviteUrl("");
                    setRole("logistica");
                  }}
                >
                  {language === 'es' ? 'Generar Otro' : 'Generate Another'}
                </Button>
                <Button
                  className="flex-1 bg-white/10 hover:bg-white/20"
                  onClick={onClose}
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
