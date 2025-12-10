
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import { FileText, Calculator } from "lucide-react";

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (order: any) => void;
}

export default function PurchaseOrderDialog({ open, onOpenChange, onSubmit }: PurchaseOrderDialogProps) {
  const { language } = useLanguage();
  
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [incoterm, setIncoterm] = useState("FOB");
  const [currency, setCurrency] = useState("USD");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseFloat(quantity) || 0;
    const unitPrice = parseFloat(price) || 0;
    const total = qty * unitPrice;
    
    // Construct quote/PO object structure matching QuoteMessage
    const orderData = {
      productName: product || "Producto General",
      description: `${quantity} units @ ${currency} ${price}`,
      totalCost: total,
      currency: currency,
      incoterm: incoterm,
      breakdown: {
        fob: total,
        freight: 0, // Placeholder
        insurance: 0
      }
    };

    onSubmit(orderData);
    // Reset form
    setProduct("");
    setQuantity("");
    setPrice("");
    setIncoterm("FOB");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0D2137] border-cyan-900/30 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            {language === 'es' ? 'Generar Orden de Compra' : 'Generate Purchase Order'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {language === 'es' 
              ? 'Crea una cotización formal rápida para enviar al chat.' 
              : 'Create a quick formal quote to send in chat.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="product" className="text-slate-300">
              {language === 'es' ? 'Producto' : 'Product'}
            </Label>
            <Input
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="Ej. Carne Bovina Cortes Premium"
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity" className="text-slate-300">
                {language === 'es' ? 'Cantidad' : 'Quantity'}
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1000"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="incoterm" className="text-slate-300">Incoterm</Label>
              <Select value={incoterm} onValueChange={setIncoterm}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select Incoterm" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1929] border-cyan-900/30 text-white">
                  <SelectItem value="FOB">FOB</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="EXW">EXW</SelectItem>
                  <SelectItem value="DDP">DDP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
              <Label htmlFor="price" className="text-slate-300">
                {language === 'es' ? 'Precio Unitario' : 'Unit Price'}
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="currency" className="text-slate-300">
                {language === 'es' ? 'Moneda' : 'Currency'}
              </Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#0A1929] border-cyan-900/30 text-white">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="CNY">CNY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-cyan-900/20 p-3 rounded border border-cyan-900/30 text-center">
             <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
               {language === 'es' ? 'Total Estimado' : 'Estimated Total'}
             </p>
             <p className="text-xl font-bold text-cyan-400">
               {currency} {((parseFloat(quantity)||0) * (parseFloat(price)||0)).toLocaleString()}
             </p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
              {language === 'es' ? 'Generar Orden' : 'Generate Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
