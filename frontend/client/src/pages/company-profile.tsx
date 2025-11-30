import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Building2, MapPin, Users, Star, TrendingUp, CheckCircle,
  Mail, Phone, Globe, Calendar, Package, Award, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import Header from "@/components/header";

// Mock company data
const mockCompany = {
  id: "c1",
  name: "Importadora ABC S.A.",
  verified: true,
  country: "AR",
  legalName: "Importadora ABC Sociedad Anónima",
  taxId: "30-12345678-9",
  businessType: "Importador/Exportador",
  establishedYear: 2010,
  employeeCount: 45,
  address: "Av. Corrientes 1234, CABA",
  city: "Buenos Aires",
  website: "https://www.importadoraabc.com",
  email: "contacto@importadoraabc.com",
  phone: "+54 11 1234-5678",
  description: "Empresa líder en importación y exportación de productos agrícolas con más de 10 años de experiencia en el mercado internacional.",
  products: ["Trigo", "Maíz", "Soja", "Cebada"],
  certifications: ["ISO 9001", "ISO 14001", "HACCP"],
  rating: 4.8,
  totalReviews: 127,
  totalTransactions: 450,
  onTimeDeliveryRate: 96,
  employees: [
    {
      id: "u1",
      name: "María López",
      role: "Directora de Compras",
      email: "maria.lopez@importadoraabc.com",
      phone: "+54 11 1234-5679",
      verified: true,
      joinedAt: new Date(2015, 5, 15)
    },
    {
      id: "u2",
      name: "Carlos Rodríguez",
      role: "Gerente de Exportaciones",
      email: "carlos.rodriguez@importadoraabc.com",
      phone: "+54 11 1234-5680",
      verified: true,
      joinedAt: new Date(2018, 2, 10)
    },
    {
      id: "u3",
      name: "Ana Martínez",
      role: "Coordinadora Logística",
      email: "ana.martinez@importadoraabc.com",
      verified: false,
      joinedAt: new Date(2023, 8, 1)
    }
  ],
  recentActivity: [
    {
      type: "post",
      title: "Busco Trigo - 500 toneladas",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      type: "negotiation",
      title: "Negociación cerrada: Maíz 300 ton",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]
};

export default function CompanyProfile() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"info" | "employees" | "activity">("info");

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'AR': '🇦🇷', 'BR': '🇧🇷', 'CL': '🇨🇱', 'US': '🇺🇸'
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/marketplace')}
          variant="outline"
          className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'es' ? 'Volver al Marketplace' : 'Back to Marketplace'}
        </Button>

        {/* Company Header */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              {/* Company Logo */}
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
                {mockCompany.name.charAt(0)}
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">{mockCompany.name}</h1>
                      {mockCompany.verified && (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      )}
                    </div>
                    <p className="text-slate-300 text-lg mb-2">{mockCompany.businessType}</p>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {getCountryFlag(mockCompany.country)} {mockCompany.city}, {mockCompany.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {language === 'es' ? 'Desde' : 'Since'} {mockCompany.establishedYear}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {mockCompany.employeeCount} {language === 'es' ? 'empleados' : 'employees'}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-2xl font-bold">{mockCompany.rating}</span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {mockCompany.totalReviews} {language === 'es' ? 'reseñas' : 'reviews'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-4">{mockCompany.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">{language === 'es' ? 'Transacciones' : 'Transactions'}</p>
                    <p className="text-white text-xl font-bold">{mockCompany.totalTransactions}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">{language === 'es' ? 'Entregas a tiempo' : 'On-time delivery'}</p>
                    <p className="text-white text-xl font-bold">{mockCompany.onTimeDeliveryRate}%</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-slate-400 text-xs mb-1">{language === 'es' ? 'Productos' : 'Products'}</p>
                    <p className="text-white text-xl font-bold">{mockCompany.products.length}</p>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Mail className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Contactar' : 'Contact'}
                  </Button>
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Globe className="w-4 h-4 mr-2" />
                    {language === 'es' ? 'Sitio Web' : 'Website'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "info" ? "default" : "outline"}
            onClick={() => setActiveTab("info")}
            className={activeTab === "info"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Información' : 'Information'}
          </Button>
          <Button
            variant={activeTab === "employees" ? "default" : "outline"}
            onClick={() => setActiveTab("employees")}
            className={activeTab === "employees"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Empleados' : 'Employees'} ({mockCompany.employees.length})
          </Button>
          <Button
            variant={activeTab === "activity" ? "default" : "outline"}
            onClick={() => setActiveTab("activity")}
            className={activeTab === "activity"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }
          >
            {language === 'es' ? 'Actividad' : 'Activity'}
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Details */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'es' ? '📋 Detalles de la Empresa' : '📋 Company Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">{language === 'es' ? 'Razón Social' : 'Legal Name'}</p>
                  <p className="text-white">{mockCompany.legalName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{language === 'es' ? 'CUIT/Tax ID' : 'Tax ID'}</p>
                  <p className="text-white">{mockCompany.taxId}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{language === 'es' ? 'Dirección' : 'Address'}</p>
                  <p className="text-white">{mockCompany.address}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">{language === 'es' ? 'Teléfono' : 'Phone'}</p>
                  <p className="text-white">{mockCompany.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white">{mockCompany.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Products & Certifications */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'es' ? '📦 Productos y Certificaciones' : '📦 Products & Certifications'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{language === 'es' ? 'Productos' : 'Products'}</p>
                  <div className="flex flex-wrap gap-2">
                    {mockCompany.products.map((product, index) => (
                      <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">{language === 'es' ? 'Certificaciones' : 'Certifications'}</p>
                  <div className="flex flex-wrap gap-2">
                    {mockCompany.certifications.map((cert, index) => (
                      <Badge key={index} className="bg-green-500/20 text-green-300 border-green-500/30">
                        <Award className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="space-y-4">
            {mockCompany.employees.map((employee) => (
              <Card key={employee.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-lg">{employee.name}</h3>
                          {employee.verified && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <p className="text-slate-300 mb-2">{employee.role}</p>
                        <div className="space-y-1 text-sm text-slate-400">
                          <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {employee.email}
                          </p>
                          {employee.phone && (
                            <p className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {employee.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      {language === 'es' ? 'Contactar' : 'Contact'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {language === 'es' ? '📈 Actividad Reciente' : '📈 Recent Activity'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCompany.recentActivity.map((activity, index) => (
                <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                      <p className="text-slate-400 text-sm">
                        {activity.date.toLocaleString()}
                      </p>
                    </div>
                    <Badge className={activity.type === "post"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30"
                    }>
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
