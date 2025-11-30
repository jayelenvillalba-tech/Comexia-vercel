import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Users, Building2, CheckCircle, XCircle, TrendingUp, 
  DollarSign, Package, AlertTriangle, Settings, LogOut,
  Search, Filter, MoreVertical, Eye, Trash2, Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import Header from "@/components/header";

// Mock admin user
const ADMIN_PASSWORD = "admin123"; // En producción, esto debe estar en el backend

// Mock data
const mockStats = {
  totalUsers: 156,
  totalCompanies: 89,
  activeSubscriptions: 45,
  pendingVerifications: 12,
  totalRevenue: 22450,
  activePosts: 234
};

const mockPendingVerifications = [
  {
    id: "v1",
    type: "company",
    entityName: "Importadora ABC S.A.",
    country: "AR",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    documents: ["RUT", "Comprobante domicilio", "Cámara de comercio"],
    status: "pending"
  },
  {
    id: "v2",
    type: "employee",
    entityName: "Juan Pérez",
    company: "Exportadora XYZ Ltda.",
    email: "juan.perez@xyz.com",
    submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    documents: ["DNI", "Carta empresa"],
    status: "pending"
  }
];

const mockSubscriptions = [
  {
    id: "s1",
    company: "Importadora ABC S.A.",
    plan: "multinacional",
    status: "active",
    employees: 45,
    maxEmployees: 100,
    monthlyRevenue: 499,
    startDate: new Date(2024, 0, 15),
    nextBilling: new Date(2025, 0, 15)
  },
  {
    id: "s2",
    company: "Tech Imports Inc.",
    plan: "pyme",
    status: "active",
    employees: 3,
    maxEmployees: 5,
    monthlyRevenue: 99,
    startDate: new Date(2024, 10, 1),
    nextBilling: new Date(2024, 11, 1)
  }
];

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "verifications" | "subscriptions" | "posts">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert(language === 'es' ? 'Contraseña incorrecta' : 'Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleApproveVerification = (id: string) => {
    console.log('Approving verification:', id);
    // TODO: Connect to backend
  };

  const handleRejectVerification = (id: string) => {
    console.log('Rejecting verification:', id);
    // TODO: Connect to backend
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              {language === 'es' ? '🔐 Acceso Administrador' : '🔐 Admin Access'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-white text-sm mb-2 block">
                  {language === 'es' ? 'Contraseña' : 'Password'}
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {language === 'es' ? 'Ingresar' : 'Login'}
              </Button>
              <p className="text-slate-400 text-xs text-center mt-4">
                Demo: admin123
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {language === 'es' ? '⚙️ Panel de Administración' : '⚙️ Admin Dashboard'}
            </h1>
            <p className="text-slate-300">
              {language === 'es' ? 'Gestión completa de la plataforma' : 'Complete platform management'}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {language === 'es' ? 'Salir' : 'Logout'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Usuarios' : 'Users'}</p>
                  <p className="text-white text-2xl font-bold">{mockStats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Empresas' : 'Companies'}</p>
                  <p className="text-white text-2xl font-bold">{mockStats.totalCompanies}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Suscripciones' : 'Subscriptions'}</p>
                  <p className="text-white text-2xl font-bold">{mockStats.activeSubscriptions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Verificaciones' : 'Verifications'}</p>
                  <p className="text-white text-2xl font-bold">{mockStats.pendingVerifications}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Ingresos/mes' : 'Revenue/mo'}</p>
                  <p className="text-white text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300 text-xs">{language === 'es' ? 'Publicaciones' : 'Posts'}</p>
                  <p className="text-white text-2xl font-bold">{mockStats.activePosts}</p>
                </div>
                <Package className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className={activeTab === "overview"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Resumen' : 'Overview'}
          </Button>
          <Button
            variant={activeTab === "verifications" ? "default" : "outline"}
            onClick={() => setActiveTab("verifications")}
            className={activeTab === "verifications"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Verificaciones' : 'Verifications'}
            {mockStats.pendingVerifications > 0 && (
              <Badge className="ml-2 bg-yellow-500 text-black">
                {mockStats.pendingVerifications}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "subscriptions" ? "default" : "outline"}
            onClick={() => setActiveTab("subscriptions")}
            className={activeTab === "subscriptions"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Suscripciones' : 'Subscriptions'}
          </Button>
          <Button
            variant={activeTab === "posts" ? "default" : "outline"}
            onClick={() => setActiveTab("posts")}
            className={activeTab === "posts"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Publicaciones' : 'Posts'}
          </Button>
        </div>

        {/* Content */}
        {activeTab === "verifications" && (
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'es' ? '⏳ Verificaciones Pendientes' : '⏳ Pending Verifications'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockPendingVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{verification.entityName}</h3>
                          <Badge className={verification.type === "company"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          }>
                            {verification.type === "company"
                              ? (language === 'es' ? 'Empresa' : 'Company')
                              : (language === 'es' ? 'Empleado' : 'Employee')
                            }
                          </Badge>
                        </div>
                        {verification.type === "employee" && (
                          <p className="text-slate-400 text-sm">{verification.company}</p>
                        )}
                        <p className="text-slate-400 text-xs mt-1">
                          {new Date(verification.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-slate-300 text-sm mb-2">
                        {language === 'es' ? 'Documentos:' : 'Documents:'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {verification.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-slate-300 border-slate-500">
                            📄 {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveVerification(verification.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Aprobar' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleRejectVerification(verification.id)}
                        variant="outline"
                        className="flex-1 bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {language === 'es' ? 'Rechazar' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'es' ? '💳 Suscripciones Activas' : '💳 Active Subscriptions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white/5 p-4 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-bold">{sub.company}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={sub.plan === "multinacional"
                            ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          }>
                            {sub.plan.toUpperCase()}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {sub.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-2xl font-bold">${sub.monthlyRevenue}</p>
                        <p className="text-slate-400 text-xs">/mes</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">{language === 'es' ? 'Empleados:' : 'Employees:'}</p>
                        <p className="text-white">{sub.employees} / {sub.maxEmployees}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">{language === 'es' ? 'Próximo cobro:' : 'Next billing:'}</p>
                        <p className="text-white">{sub.nextBilling.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
