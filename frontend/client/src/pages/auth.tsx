
import { useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/context/user-context";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Mail, Lock, User, Building2, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/header";

export default function AuthPage() {
  const { language } = useLanguage();
  const { login, register } = useUser();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCompany, setRegCompany] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate real login
      await login(loginEmail, loginPassword);
      // Redirect to Profile unless user came from somewhere else
      navigate("/profile");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name: regName, email: regEmail, company: regCompany });
      navigate("/profile");
    } catch (error) {
      console.error("Register failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col font-sans">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md relative">
          {/* Decorative background glow */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-[100px] pointer-events-none" />
          
          <Card className="bg-[#0D2137]/90 backdrop-blur-xl border-cyan-900/30 shadow-2xl relative z-10">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Che.Comex</CardTitle>
              <CardDescription className="text-slate-400">
                {activeTab === "login" 
                  ? (language === 'es' ? 'Bienvenido de nuevo' : 'Welcome back') 
                  : (language === 'es' ? 'Comienza tu viaje global' : 'Start your global journey')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#0A1929] border border-cyan-900/30 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-cyan-900/40 data-[state=active]:text-cyan-400">
                    {language === 'es' ? 'Iniciar Sesión' : 'Login'}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-cyan-900/40 data-[state=active]:text-cyan-400">
                    {language === 'es' ? 'Registrarse' : 'Register'}
                  </TabsTrigger>
                </TabsList>
                
                {/* LOGIN TAB */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Email' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="juan@empresa.com" 
                          type="email" 
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Contraseña' : 'Password'}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'es' ? 'Ingresando...' : 'Logging in...'}
                        </>
                      ) : (
                        <>
                          {language === 'es' ? 'Ingresar' : 'Sign In'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center mt-4">
                       <p className="text-xs text-slate-500">
                         Demo: juan@demo.com / password
                       </p>
                    </div>
                  </form>
                </TabsContent>
                
                {/* REGISTER TAB */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                     <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Nombre Completo' : 'Full Name'}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="Juan Pérez" 
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Empresa (Opcional)' : 'Company (Optional)'}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="Mi Empresa S.A." 
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Email' : 'Email'}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          placeholder="juan@empresa.com" 
                          type="email" 
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-slate-300">{language === 'es' ? 'Contraseña' : 'Password'}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <Input 
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="pl-10 bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 focus:border-cyan-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {language === 'es' ? 'Creando cuenta...' : 'Creating account...'}
                        </>
                      ) : (
                         <>
                          {language === 'es' ? 'Crear Cuenta' : 'Create Account'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
