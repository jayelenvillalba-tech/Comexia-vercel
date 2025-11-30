import { useState } from "react";
import { X, Package, MapPin, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

interface PostFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function PostForm({ onClose, onSubmit }: PostFormProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    type: "buy" as "buy" | "sell",
    hsCode: "",
    productName: "",
    quantity: "",
    country: "",
    deadline: "",
    requirements: "",
    certifications: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
      certifications: formData.certifications.split(',').map(c => c.trim()).filter(Boolean),
      createdAt: new Date(),
      status: "active"
    };
    
    onSubmit(postData);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl">
              {language === 'es' ? '📝 Nueva Publicación' : '📝 New Post'}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="text-white font-semibold mb-3 block">
                {language === 'es' ? 'Tipo de Publicación' : 'Post Type'}
              </label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.type === "buy" ? "default" : "outline"}
                  onClick={() => updateField("type", "buy")}
                  className={formData.type === "buy"
                    ? "flex-1 bg-green-600 hover:bg-green-700"
                    : "flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  🟢 {language === 'es' ? 'BUSCO Comprar' : 'BUYING'}
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "sell" ? "default" : "outline"}
                  onClick={() => updateField("type", "sell")}
                  className={formData.type === "sell"
                    ? "flex-1 bg-red-600 hover:bg-red-700"
                    : "flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  🔴 {language === 'es' ? 'VENDO' : 'SELLING'}
                </Button>
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-4">
              <div>
                <label className="text-white font-semibold mb-2 block">
                  <Package className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Código HS' : 'HS Code'}
                </label>
                <Input
                  type="text"
                  placeholder={language === 'es' ? 'Ej: 1001' : 'Ex: 1001'}
                  value={formData.hsCode}
                  onChange={(e) => updateField("hsCode", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  {language === 'es' ? 'Nombre del Producto' : 'Product Name'}
                </label>
                <Input
                  type="text"
                  placeholder={language === 'es' ? 'Ej: Trigo' : 'Ex: Wheat'}
                  value={formData.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  {language === 'es' ? 'Cantidad' : 'Quantity'}
                </label>
                <Input
                  type="text"
                  placeholder={language === 'es' ? 'Ej: 500 toneladas' : 'Ex: 500 tons'}
                  value={formData.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-white font-semibold mb-2 block">
                <MapPin className="w-4 h-4 inline mr-2" />
                {formData.type === "buy"
                  ? (language === 'es' ? 'País de Destino' : 'Destination Country')
                  : (language === 'es' ? 'País de Origen' : 'Origin Country')
                }
              </label>
              <Input
                type="text"
                placeholder={language === 'es' ? 'Ej: AR, BR, CL' : 'Ex: AR, BR, CL'}
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value.toUpperCase())}
                required
                maxLength={2}
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Deadline (only for buy) */}
            {formData.type === "buy" && (
              <div>
                <label className="text-white font-semibold mb-2 block">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Plazo (días)' : 'Deadline (days)'}
                </label>
                <Input
                  type="number"
                  placeholder={language === 'es' ? 'Ej: 30' : 'Ex: 30'}
                  value={formData.deadline}
                  onChange={(e) => updateField("deadline", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Requirements (for buy) */}
            {formData.type === "buy" && (
              <div>
                <label className="text-white font-semibold mb-2 block">
                  <FileText className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Requisitos (separados por coma)' : 'Requirements (comma separated)'}
                </label>
                <Textarea
                  placeholder={language === 'es' 
                    ? 'Ej: Certificación orgánica, Entrega CIF Buenos Aires'
                    : 'Ex: Organic certification, CIF Buenos Aires delivery'}
                  value={formData.requirements}
                  onChange={(e) => updateField("requirements", e.target.value)}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Certifications (for sell) */}
            {formData.type === "sell" && (
              <div>
                <label className="text-white font-semibold mb-2 block">
                  <FileText className="w-4 h-4 inline mr-2" />
                  {language === 'es' ? 'Certificaciones (separadas por coma)' : 'Certifications (comma separated)'}
                </label>
                <Textarea
                  placeholder={language === 'es' 
                    ? 'Ej: Orgánico, Fair Trade, ISO 9001'
                    : 'Ex: Organic, Fair Trade, ISO 9001'}
                  value={formData.certifications}
                  onChange={(e) => updateField("certifications", e.target.value)}
                  rows={3}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {language === 'es' ? 'Publicar' : 'Publish'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
