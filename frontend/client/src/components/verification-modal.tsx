
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string;
  entityType?: 'company' | 'employee';
  countryCode?: string; // e.g., 'AR', 'BR', 'UY', 'PY'
}

// MERCOSUR Requirements Mapping
const COUNTRY_REQUIREMENTS: Record<string, { label: string; key: string; required: boolean }[]> = {
  // Argentina
  'AR': [
    { label: 'Constancia de CUIT (AFIP)', key: 'cuit', required: true },
    { label: 'Estatuto Social / Contrato', key: 'bylaws', required: true },
    { label: 'DNI Representante Legal', key: 'identity', required: true }
  ],
  // Brazil
  'BR': [
    { label: 'Cartão CNPJ', key: 'cnpj', required: true },
    { label: 'Contrato Social', key: 'bylaws', required: true },
    { label: 'RG/CPF Representante', key: 'identity', required: true }
  ],
  // Uruguay
  'UY': [
    { label: 'Tarjeta RUT (DGI)', key: 'rut', required: true },
    { label: 'Certificado Notarial', key: 'notary', required: true },
    { label: 'CI Representante', key: 'identity', required: true }
  ],
  // Paraguay
  'PY': [
    { label: 'Constancia de RUC', key: 'ruc', required: true },
    { label: 'Escritura de Constitución', key: 'bylaws', required: true },
    { label: 'Cédula Representante', key: 'identity', required: true }
  ],
  // Default / International
  'default': [
    { label: 'Official Tax ID / Registration', key: 'tax_id', required: true },
    { label: 'Incorporation Document', key: 'bylaws', required: true },
    { label: 'Director ID / Passport', key: 'identity', required: true }
  ]
};

export default function VerificationModal({ 
  open, 
  onOpenChange,
  entityId,
  entityType = 'company',
  countryCode = 'AR' // Default fallback
}: VerificationModalProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [notes, setNotes] = useState("");

  const actualCountry = countryCode || 'default';
  const requirements = COUNTRY_REQUIREMENTS[actualCountry] || COUNTRY_REQUIREMENTS['default'];

  // Reset when opening
  useEffect(() => {
    if (open) {
      setUploadedFiles({});
      setNotes("");
    }
  }, [open]);

  const handleFileSelect = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isValidType = ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType || !isValidSize) {
        toast({
          title: "Archivo inválido",
          description: "Solo PDF, JPG, PNG menor a 5MB.",
          variant: "destructive"
        });
        return;
      }

      setUploadedFiles(prev => ({ ...prev, [key]: file }));
    }
  };

  const removeFile = (key: string) => {
    const newFiles = { ...uploadedFiles };
    delete newFiles[key];
    setUploadedFiles(newFiles);
  };

  const handleSubmit = async () => {
    // Validate all required files are present
    const missing = requirements.filter(req => req.required && !uploadedFiles[req.key]);
    
    if (missing.length > 0) {
      toast({
        title: "Faltan documentos",
        description: `Por favor sube: ${missing.map(m => m.label).join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    
    // Append Notes with Country Context
    const contextNote = `[Country: ${actualCountry}] ${notes}`;
    formData.append('notes', contextNote);
    
    // Append files with labeled names
    Object.entries(uploadedFiles).forEach(([key, file]) => {
      // Rename file to include type for Admin convenience e.g. "CUIT_filename.pdf"
      const reqLabel = requirements.find(r => r.key === key)?.label.split(' ')[0] || key;
      const cleanLabel = reqLabel.replace(/[^a-zA-Z0-9]/g, '');
      const newName = `${cleanLabel}_${file.name}`;
      formData.append('documents', file, newName);
    });

    try {
      const res = await fetch('/api/verifications/request', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit verification');

      toast({
        title: language === 'es' ? 'Solicitud enviada' : 'Request sent',
        description: language === 'es' 
          ? 'Tus documentos serán revisados por un administrador.' 
          : 'Your documents will be reviewed by an administrator.',
      });
      
      onOpenChange(false);

    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0D2137] border-cyan-900/30 text-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-full">
               <AlertCircle className="w-6 h-6 text-blue-400" />
            </div>
            <DialogTitle className="text-xl">
              {language === 'es' ? 'Verificación de Identidad' : 'Identity Verification'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400">
            {language === 'es' 
              ? `Requisitos según tu país (${actualCountry}). Sube la documentación oficial para obtener la insignia.` 
              : `Requirements for your country (${actualCountry}). Upload official documentation to get the badge.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* Dynamic Requirements List */}
          <div className="space-y-3">
            {requirements.map((req) => (
              <div key={req.key} className="bg-white/5 p-4 rounded-lg border border-white/10 transition-colors hover:border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-slate-200 font-medium flex items-center gap-2">
                      {req.label}
                      {req.required && <span className="text-red-400 text-xs">*</span>}
                    </Label>
                    <p className="text-xs text-slate-500">
                      Formatos: PDF, JPG, PNG (Max 5MB)
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {uploadedFiles[req.key] ? (
                      <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded border border-green-500/30">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-300 max-w-[100px] truncate">
                          {uploadedFiles[req.key].name}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(req.key)}
                          className="h-5 w-5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileSelect(req.key, e)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                        <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 pointer-events-none">
                          <Upload className="w-4 h-4 mr-2" />
                          Subir
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">
                {language === 'es' ? 'Notas Adicionales (Opcional)' : 'Additional Notes (Optional)'}
            </Label>
            <Textarea 
                value={notes} 
                onChange={e => setNotes(e.target.value)}
                placeholder={language === 'es' ? 'Comentarios para el revisor...' : 'Comments for the reviewer...'}
                className="bg-[#0A1929] border-cyan-900/30 text-white placeholder:text-slate-600 min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 text-slate-300 hover:bg-white/10">
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[150px]"
            disabled={isSubmitting}
          >
            {isSubmitting 
                ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                : (language === 'es' ? 'Enviar Solicitud' : 'Submit Request')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
