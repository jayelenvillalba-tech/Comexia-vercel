
interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export class AIService {
  // Mock smart replies based on context
  static async generateSmartReplies(context: any[]): Promise<string[]> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lastMessage = context[context.length - 1]?.content?.toLowerCase() || '';
    
    if (lastMessage.includes('precio') || lastMessage.includes('costo')) {
      return [
        "Puedo enviarte una cotización formal",
        "El precio depende del volumen",
        "¿Qué Incoterm prefieres?"
      ];
    }
    
    if (lastMessage.includes('envío') || lastMessage.includes('flete')) {
      return [
        "Hacemos envíos a todo el país",
        "Podemos coordinar con tu forwarder",
        "El tiempo de tránsito es de 15 días"
      ];
    }
    
    if (lastMessage.includes('hola') || lastMessage.includes('buenos días')) {
      return [
        "¡Hola! ¿En qué puedo ayudarte?",
        "Buenos días, ¿buscas algún producto específico?",
        "Hola, gracias por contactarnos"
      ];
    }
    
    return [
      "Entendido, déjame revisar",
      "¿Podrías darme más detalles?",
      "Te confirmo en un momento"
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
    
    if (q.includes('documentos') || q.includes('requisitos')) {
      return "Generalmente necesitarás: Factura Comercial, Packing List, Bill of Lading (B/L) y Certificado de Origen si aplica tratado.";
    }
    
    return "Esa es una buena pregunta técnica. Te sugiero consultar la sección de regulaciones o usar la herramienta de clasificación arancelaria para estar seguro.";
  }
}
