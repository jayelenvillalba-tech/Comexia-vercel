import { useState } from "react";
import { useUser } from "@/context/user-context";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, User, Building2, Lock, Mail } from "lucide-react";
import Header from "@/components/header";

export default function AuthPage() {
  const { login, register } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      navigate('/'); 
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await register({
          name: regName,
          companyName: regCompany,
          email: regEmail,
          password: regPassword
      });

      if (success) {
        navigate('/');
      }
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col font-sans text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-[#0D2137] border-cyan-900/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        ComexIA ID
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Accede a la plataforma líder de comercio exterior
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-900/50">
                            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                            <TabsTrigger value="register">Registrarse</TabsTrigger>
                        </TabsList>

                        {/* LOGIN TAB */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="email" 
                                            type="email" 
                                            placeholder="empresa@ejemplo.com"
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={loginEmail}
                                            onChange={e => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="password" 
                                            type="password" 
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={loginPassword}
                                            onChange={e => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loading}>
                                    {loading ? 'Cargando...' : 'Ingresar'}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* REGISTER TAB */}
                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Nombre de Empresa</Label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="company" 
                                            placeholder="Global Exports S.A."
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={regCompany}
                                            onChange={e => setRegCompany(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre de Usuario</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="name" 
                                            placeholder="Juan Pérez"
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={regName}
                                            onChange={e => setRegName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="reg-email" 
                                            type="email" 
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={regEmail}
                                            onChange={e => setRegEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reg-password">Contraseña</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input 
                                            id="reg-password" 
                                            type="password" 
                                            className="pl-9 bg-slate-900/50 border-slate-700"
                                            value={regPassword}
                                            onChange={e => setRegPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={loading}>
                                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Conexión segura encriptada
                    </p>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
