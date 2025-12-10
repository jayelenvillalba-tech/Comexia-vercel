import { useState } from "react";
import { X, FileCheck, AlertTriangle, CheckCircle, DollarSign, Package, Ship, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";

interface CostAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    productName: string;
    hsCode: string;
    quantity: string;
    originCountry?: string;
    destinationCountry?: string;
    requirements?: string[];
    certifications?: string[];
  };
}

export default function CostAnalysisModal({ isOpen, onClose, post }: CostAnalysisModalProps) {
  const { language } = useLanguage();

  // Simulated document compliance check
  const requiredDocs = [
    { name: "Factura Comercial", nameEn: "Commercial Invoice", required: true, hasIt: true },
    { name: "Certificado de Origen", nameEn: "Certificate of Origin", required: true, hasIt: true },
    { name: "Certificado Sanitario SENASA", nameEn: "SENASA Sanitary Certificate", required: true, hasIt: true },
    { name: "Inspección USDA", nameEn: "USDA Inspection", required: true, hasIt: false },
    { name: "Etiquetado FDA", nameEn: "FDA Labeling", required: true, hasIt: false },
    { name: "Bill of Lading", nameEn: "Bill of Lading", required: true, hasIt: false },
    { name: "Packing List", nameEn: "Packing List", required: true, hasIt: true },
  ];

  const compliantDocs = requiredDocs.filter(d => d.hasIt).length;
  const totalDocs = requiredDocs.length;
  const compliancePercentage = Math.round((compliantDocs / totalDocs) * 100);

  // Simulated cost breakdown
  const costs = {
    productValue: 62500, // 5 ton x $12,500
    transport: 3200,
    insurance: 625,
    customsDuties: 2500, // 4% GSP tariff
    handling: 450,
    documentation: 300,
  };

  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0D2137] border-cyan-900/30 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-cyan-400" />
            {language === 'es' ? 'Análisis de Costos y Documentación' : 'Cost & Documentation Analysis'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Product Info */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2">{post.productName}</h3>
              <div className="flex gap-4 text-sm text-gray-400">
                <span>HS Code: {post.hsCode}</span>
                <span>•</span>
                <span>{post.quantity}</span>
                <span>•</span>
                <span>{post.originCountry} → {post.destinationCountry}</span>
              </div>
            </CardContent>
          </Card>

          {/* Document Compliance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                {language === 'es' ? 'Cumplimiento Documental' : 'Document Compliance'}
              </h3>
              <Badge 
                variant={compliancePercentage >= 80 ? "default" : "destructive"}
                className={compliancePercentage >= 80 ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}
              >
                {compliancePercentage}% {language === 'es' ? 'Completo' : 'Complete'}
              </Badge>
            </div>

            <div className="space-y-2">
              {requiredDocs.map((doc, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    doc.hasIt ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {doc.hasIt ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                    <span className="text-sm text-white">
                      {language === 'es' ? doc.name : doc.nameEn}
                    </span>
                  </div>
                  <Badge variant="outline" className={doc.hasIt ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}>
                    {doc.hasIt 
                      ? (language === 'es' ? 'Disponible' : 'Available')
                      : (language === 'es' ? 'Faltante' : 'Missing')
                    }
                  </Badge>
                </div>
              ))}
            </div>

            {compliancePercentage < 100 && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-400">
                      {language === 'es' ? 'Documentos Faltantes' : 'Missing Documents'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {language === 'es' 
                        ? `Te faltan ${totalDocs - compliantDocs} documentos para completar el proceso de exportación. Contacta al vendedor para coordinar.`
                        : `You are missing ${totalDocs - compliantDocs} documents to complete the export process. Contact the seller to coordinate.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-cyan-400" />
              {language === 'es' ? 'Desglose de Costos' : 'Cost Breakdown'}
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">{language === 'es' ? 'Valor del Producto' : 'Product Value'}</span>
                <span className="text-white font-semibold">${costs.productValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  {language === 'es' ? 'Transporte Marítimo' : 'Maritime Transport'}
                </span>
                <span className="text-white font-semibold">${costs.transport.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">{language === 'es' ? 'Seguro de Carga' : 'Cargo Insurance'}</span>
                <span className="text-white font-semibold">${costs.insurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">{language === 'es' ? 'Aranceles Aduanales (GSP 4%)' : 'Customs Duties (GSP 4%)'}</span>
                <span className="text-white font-semibold">${costs.customsDuties.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400">{language === 'es' ? 'Manejo y Almacenaje' : 'Handling & Storage'}</span>
                <span className="text-white font-semibold">${costs.handling.toLocaleString()}</span>
              </div>
              <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-gray-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {language === 'es' ? 'Documentación' : 'Documentation'}
                </span>
                <span className="text-white font-semibold">${costs.documentation.toLocaleString()}</span>
              </div>

              <div className="flex justify-between p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg mt-4">
                <span className="text-cyan-300 font-bold text-lg">
                  {language === 'es' ? 'Costo Total Landed (DAP Miami)' : 'Total Landed Cost (DAP Miami)'}
                </span>
                <span className="text-cyan-300 font-bold text-xl">${totalCost.toLocaleString()}</span>
              </div>

              <p className="text-xs text-gray-500 text-center mt-2">
                {language === 'es' 
                  ? 'Costo por tonelada: $' + Math.round(totalCost / 5).toLocaleString()
                  : 'Cost per ton: $' + Math.round(totalCost / 5).toLocaleString()
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-gray-300 hover:bg-white/5"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </Button>
            <Button
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={() => {
                onClose();
                // This will be handled by parent component
              }}
            >
              {language === 'es' ? 'Contactar Vendedor' : 'Contact Seller'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
