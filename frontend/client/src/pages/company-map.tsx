
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Company } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Globe, Filter } from "lucide-react";
import CompanyMapLeaflet from "@/components/company-map-leaflet";

export default function CompanyMapPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry ? company.country === selectedCountry : true;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {language === 'es' ? 'Mapa Global de Empresas' : 'Global Company Map'}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {language === 'es' 
              ? 'Explora nuestra red de importadores y exportadores verificados en todo el mundo.' 
              : 'Explore our network of verified importers and exporters worldwide.'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder={language === 'es' ? "Buscar empresa, producto..." : "Search company, product..."}
              className="pl-10 bg-white/5 border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedCountry === null ? "default" : "outline"}
              onClick={() => setSelectedCountry(null)}
              className={selectedCountry === null ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent border-white/10 text-slate-300 hover:bg-white/5"}
            >
              All
            </Button>
            {['AR', 'BR', 'CL', 'UY', 'PY'].map(country => (
              <Button
                key={country}
                variant={selectedCountry === country ? "default" : "outline"}
                onClick={() => setSelectedCountry(country)}
                className={selectedCountry === country ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent border-white/10 text-slate-300 hover:bg-white/5"}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative">
          {isLoading ? (
            <div className="h-[600px] w-full rounded-xl bg-white/5 animate-pulse flex items-center justify-center">
              <Globe className="w-12 h-12 text-slate-600 animate-spin" />
            </div>
          ) : (
            <CompanyMapLeaflet companies={filteredCompanies} />
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                {language === 'es' ? 'Países Activos' : 'Active Countries'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">5</p>
              <p className="text-slate-400 text-sm">Mercosur + Chile</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-400" />
                {language === 'es' ? 'Empresas Verificadas' : 'Verified Companies'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{filteredCompanies.length}</p>
              <p className="text-slate-400 text-sm">
                {language === 'es' ? 'En el mapa actual' : 'In current view'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                {language === 'es' ? 'Sectores' : 'Sectors'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">12+</p>
              <p className="text-slate-400 text-sm">Agro, Tech, Textil...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}