import { FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

interface QuoteMessageProps {
  content: string; // JSON string with quote details
}

export default function QuoteMessage({ content }: QuoteMessageProps) {
  const { language } = useLanguage();
  
  let quoteData;
  try {
    quoteData = JSON.parse(content);
  } catch (e) {
    return <p className="text-sm text-red-400">Error displaying quote</p>;
  }
  
  const { productName, totalCost, currency, incoterm, breakdown } = quoteData;
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden w-64">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center text-blue-300">
          <FileText className="w-4 h-4 mr-2" />
          <span className="text-xs font-bold uppercase">{language === 'es' ? 'Cotización' : 'Quote'}</span>
        </div>
        <span className="text-xs font-mono text-slate-400">{incoterm}</span>
      </div>
      
      <div className="p-3 space-y-2">
        <h4 className="text-white font-medium text-sm truncate">{productName}</h4>
        
        <div className="space-y-1 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>FOB:</span>
            <span>{currency} {breakdown?.fob?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{language === 'es' ? 'Flete' : 'Freight'}:</span>
            <span>{currency} {breakdown?.freight?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-white/10 text-white font-bold">
            <span>Total:</span>
            <span>{currency} {totalCost?.toLocaleString()}</span>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-2 text-xs h-7 bg-white/10 hover:bg-white/20 text-white border border-white/10"
        >
          {language === 'es' ? 'Ver Detalles' : 'View Details'}
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
