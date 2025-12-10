
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus } from "lucide-react";
import { useUser } from "@/context/user-context";
import { useState } from "react";
import { useLocation } from "wouter";

interface AuthGuardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export default function AuthGuardModal({ 
  open, 
  onOpenChange,
  title = "Acceso Restringido",
  description = "Necesitas iniciar sesión para realizar esta acción."
}: AuthGuardModalProps) {
  const { login } = useUser();
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await login();
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto bg-slate-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-slate-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
        <div className="grid gap-4 py-4">
          <Button 
            onClick={() => {
              onOpenChange(false);
              navigate('/auth');
            }} 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium"
          >
            <LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión / Registrarse
          </Button>
          
          <div className="text-center text-xs text-slate-500">
             Acceso restringido a miembros verificados.
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
