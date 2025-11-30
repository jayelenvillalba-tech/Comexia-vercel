import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";
import { UserPlus, Check, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import RoleBadge from "./role-badge";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
}

// Mock teammates for demo
const MOCK_TEAMMATES = [
  { id: "mock-user-2", name: "Juan Pérez", email: "juan@company.com", primaryRole: "compras" },
  { id: "mock-user-3", name: "Ana García", email: "ana@company.com", primaryRole: "logistica" },
  { id: "mock-user-4", name: "Carlos Ruiz", email: "carlos@company.com", primaryRole: "tecnico" },
];

export default function TransferDialog({ isOpen, onClose, conversationId }: TransferDialogProps) {
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("tecnico");
  const [note, setNote] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock current user ID
  const currentUserId = "mock-user-1";
  
  const transferMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/chat/conversations/${conversationId}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: selectedUser,
          role: selectedRole,
          fromUserId: currentUserId,
          note: note
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to transfer');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      onClose();
      // Reset form
      setSelectedUser("");
      setNote("");
    }
  });
  
  const filteredTeammates = MOCK_TEAMMATES.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserSelect = (userId: string, defaultRole: string) => {
    setSelectedUser(userId);
    setSelectedRole(defaultRole);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-400" />
            {language === 'es' ? 'Trasladar / Agregar Miembro' : 'Transfer / Add Member'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Search User */}
          <div className="space-y-2">
            <Label>{language === 'es' ? 'Seleccionar compañero' : 'Select teammate'}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder={language === 'es' ? 'Buscar por nombre...' : 'Search by name...'} 
                className="pl-9 bg-white/5 border-white/10 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="border border-white/10 rounded-md max-h-40 overflow-y-auto bg-black/20 mt-2">
              {filteredTeammates.map(user => (
                <div 
                  key={user.id}
                  onClick={() => handleUserSelect(user.id, user.primaryRole)}
                  className={`p-3 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors ${selectedUser === user.id ? 'bg-blue-500/20 border-l-2 border-blue-500' : ''}`}
                >
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <RoleBadge role={user.primaryRole} className="text-[10px] h-5" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Role Selection */}
          <div className="space-y-2">
            <Label>{language === 'es' ? 'Rol en esta conversación' : 'Role in this conversation'}</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="tecnico">
                  <div className="flex items-center">
                    <RoleBadge role="tecnico" className="mr-2" />
                  </div>
                </SelectItem>
                <SelectItem value="compras">
                  <div className="flex items-center">
                    <RoleBadge role="compras" className="mr-2" />
                  </div>
                </SelectItem>
                <SelectItem value="logistica">
                  <div className="flex items-center">
                    <RoleBadge role="logistica" className="mr-2" />
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Note */}
          <div className="space-y-2">
            <Label>{language === 'es' ? 'Nota (Opcional)' : 'Note (Optional)'}</Label>
            <Textarea 
              placeholder={language === 'es' ? 'Explica el contexto...' : 'Explain context...'}
              className="bg-white/5 border-white/10 text-white min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10">
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={() => transferMutation.mutate()}
            disabled={!selectedUser || transferMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {transferMutation.isPending 
              ? (language === 'es' ? 'Procesando...' : 'Processing...') 
              : (language === 'es' ? 'Confirmar Traslado' : 'Confirm Transfer')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
