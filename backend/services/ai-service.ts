
import { RegulatoryEngine } from './regulatory-engine.js';

interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export class AIService {
  // Enhanced Smart Replies with Negotiation heuristics
  static async generateSmartReplies(context: any[]): Promise<string[]> {
    // Simulate AI processing delay slightly for realism
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Get last message from partner
    const lastMessage = context[context.length - 1]?.content?.toLowerCase() || '';
    
    // 1. Price Negotiation Context
    if (lastMessage.includes('precio') || lastMessage.includes('price') || lastMessage.includes('usd') || lastMessage.includes('$')) {
      return [
        "El precio es aceptable, por favor envíe la Factura Proforma.",
        "Buscamos un precio más competitivo dado el volumen.",
        "¿Este precio incluye el flete (Incoterm CIF)?"
      ];
    }
    
    // 2. Logistics / Shipping Context
    if (lastMessage.includes('envío') || lastMessage.includes('shipping') || lastMessage.includes('flete') || lastMessage.includes('transit')) {
      return [
        "Preferimos usar nuestro propio forwarder (FOB).",
        "¿Cuál es el tiempo estimado de tránsito?",
        "Necesitamos el envío aéreo por urgencia."
      ];
    }
    
    // 3. Quality / Specs Context
    if (lastMessage.includes('calidad') || lastMessage.includes('quality') || lastMessage.includes('certifica')) {
      return [
        "¿Cuentan con análisis de laboratorio reciente?",
        "Requerimos certificación SGS antes del embarque.",
        "La calidad cumple con nuestros estándares."
      ];
    }
    
    // 4. Closing / Agreement
    if (lastMessage.includes('acuerdo') || lastMessage.includes('deal') || lastMessage.includes('contrato')) {
      return [
        "Estamos listos para firmar.",
        "Por favor envíe el borrador del contrato.",
        "Necesitamos revisar una cláusula más."
      ];
    }

    // Default commercial courtesy
    return [
      "Gracias, revisaré la información.",
      "¿Podríamos agendar una llamada breve?",
      "Por favor envíeme más detalles técnicos."
    ];
  }

  // Mock AI query analysis
  static async analyzeChatQuery(query: string, context: any[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const q = query.toLowerCase();
    
    if (q.includes('hs code') || q.includes('partida')) {
      return "Para este tipo de producto, el HS Code más común es 6404.11. Recuerda verificar las regulaciones específicas de tu país de destino.";
    }
    
    if (q.includes('incoterm')) {
      return "Recomendamos FOB para mayor control del flete, o CIF si prefieres que el vendedor se encargue del seguro y transporte principal.";
    }
    
    // REAL DATA INTEGRATION: Regulatory Requirements
    if (q.includes('documentos') || q.includes('requisitos') || q.includes('exportar')) {
      // Very basic extraction logic for MVP
      let countryCode = 'CN'; // Default to China for demo if not found
      if (q.includes('estados unidos') || q.includes('usa') || q.includes('eeuu')) countryCode = 'US';
      if (q.includes('españa') || q.includes('europa') || q.includes('ue')) countryCode = 'ES'; // UE trigger
      if (q.includes('brasil')) countryCode = 'BR';
      
      let hsCode = '0000'; // Default
      // Try to sniff HS Code or Product Chapter
      if (q.includes('quimico') || q.includes('químico')) hsCode = '2800';
      if (q.includes('carne') || q.includes('beef')) hsCode = '0201';
      if (q.includes('pharma') || q.includes('medicamento')) hsCode = '3004';

      const requirements = RegulatoryEngine.determineRequiredDocuments(hsCode, countryCode);
      const reqList = requirements.map(r => `- ${r.name}: ${r.requirements}`).join('\n');

      return `Para exportar a ${countryCode} (HS aprox ${hsCode}), necesitarás:\n\n${reqList}\n\n¿Necesitas ayuda con alguno de estos trámites?`;
    }
    
    return "Esa es una buena pregunta técnica. Te sugiero consultar la sección de regulaciones o usar la herramienta de clasificación arancelaria para estar seguro.";
  }
}
