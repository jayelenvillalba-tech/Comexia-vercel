import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CostBreakdown {
  fob: number;
  freight: number;
  insurance: number;
  cif: number;
  tariff: number;
  vat: number;
  statistics: number;
  clearance: number;
  portHandling: number;
  documentation: number;
  inspection: number;
  storage: number;
  localTransport: number;
  brokerFees: number;
  bankCharges: number;
  contingency: number;
  total: number;
  perUnit: number;
}

interface MarketAnalysis {
  country: string;
  countryName: string;
  hsCode: string;
  productName: string;
  marketSize: {
    estimated: number;
    trend: string;
    growthRate: number;
  };
  competition: {
    level: string;
    activeCompanies: number;
  };
  opportunities: Array<{ title: string; description: string; impact: string }>;
  risks: Array<{ title: string; description: string; severity: string }>;
  recommendations: Array<{ action: string; priority: string; timeframe: string }>;
  overallScore: number;
  viability: string;
}

interface CountryRecommendation {
  countryCode: string;
  countryName: string;
  score: number;
  opportunity: string;
  treatyBenefits: string[];
  baseTariff: number;
  effectiveTariff: number;
  tariffSavings: number;
  companyCount: number;
}

export function exportCostAnalysisPDF(
  breakdown: CostBreakdown,
  metadata: {
    hsCode: string;
    productName: string;
    origin: string;
    destination: string;
    weight: number;
    fobValue: number;
  }
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text('ComexIA - Análisis de Costos', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 105, 28, { align: 'center' });
  
  // Product Information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Información del Producto', 14, 40);
  
  doc.setFontSize(10);
  const productInfo = [
    ['Código HS:', metadata.hsCode],
    ['Producto:', metadata.productName],
    ['Origen:', metadata.origin],
    ['Destino:', metadata.destination],
    ['Peso:', `${metadata.weight} kg`],
    ['Valor FOB:', `$${metadata.fobValue.toLocaleString('es-AR')}`]
  ];
  
  autoTable(doc, {
    startY: 45,
    head: [],
    body: productInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 40 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Cost Breakdown
  const finalY = (doc as any).lastAutoTable.finalY || 80;
  doc.setFontSize(14);
  doc.text('Desglose de Costos', 14, finalY + 10);
  
  const costData = [
    ['Valor FOB', `$${breakdown.fob.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Flete', `$${breakdown.freight.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Seguro', `$${breakdown.insurance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Valor CIF', `$${breakdown.cif.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Arancel de Importación', `$${breakdown.tariff.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['IVA (21%)', `$${breakdown.vat.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Tasa Estadística', `$${breakdown.statistics.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Despacho Aduanero', `$${breakdown.clearance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Manipuleo Portuario', `$${breakdown.portHandling.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Documentación', `$${breakdown.documentation.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Inspección', `$${breakdown.inspection.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Almacenaje', `$${breakdown.storage.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Transporte Local', `$${breakdown.localTransport.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Honorarios Despachante', `$${breakdown.brokerFees.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Gastos Bancarios', `$${breakdown.bankCharges.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`],
    ['Contingencias', `$${breakdown.contingency.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`]
  ];
  
  autoTable(doc, {
    startY: finalY + 15,
    head: [['Concepto', 'Monto']],
    body: costData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 'auto', halign: 'right' }
    }
  });
  
  // Total
  const totalY = (doc as any).lastAutoTable.finalY + 5;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('COSTO TOTAL:', 14, totalY);
  doc.text(`$${breakdown.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 195, totalY, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Costo por kg: $${breakdown.perUnit.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 14, totalY + 7);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('ComexIA - Plataforma de Inteligencia Comercial', 105, 285, { align: 'center' });
  doc.text('www.comexia.com', 105, 290, { align: 'center' });
  
  // Save
  doc.save(`ComexIA-Analisis-Costos-${metadata.hsCode}-${Date.now()}.pdf`);
}

export function exportMarketAnalysisPDF(analysis: MarketAnalysis) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ComexIA - Análisis de Mercado', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 105, 28, { align: 'center' });
  
  // Market Overview
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Resumen del Mercado', 14, 40);
  
  const marketInfo = [
    ['País:', analysis.countryName],
    ['Producto:', `${analysis.productName} (${analysis.hsCode})`],
    ['Tamaño de Mercado:', `$${analysis.marketSize.estimated}M USD`],
    ['Tendencia:', analysis.marketSize.trend],
    ['Tasa de Crecimiento:', `${analysis.marketSize.growthRate}%`],
    ['Nivel de Competencia:', analysis.competition.level],
    ['Empresas Activas:', analysis.competition.activeCompanies.toString()],
    ['Score General:', `${analysis.overallScore}/100`],
    ['Viabilidad:', analysis.viability]
  ];
  
  autoTable(doc, {
    startY: 45,
    body: marketInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Opportunities
  let currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Oportunidades', 14, currentY);
  
  const opportunitiesData = analysis.opportunities.map(opp => [
    opp.title,
    opp.description,
    opp.impact.toUpperCase()
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Oportunidad', 'Descripción', 'Impacto']],
    body: opportunitiesData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 30, halign: 'center' }
    }
  });
  
  // Risks
  currentY = (doc as any).lastAutoTable.finalY + 10;
  
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.text('Riesgos', 14, currentY);
  
  const risksData = analysis.risks.map(risk => [
    risk.title,
    risk.description,
    risk.severity.toUpperCase()
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Riesgo', 'Descripción', 'Severidad']],
    body: risksData,
    theme: 'striped',
    headStyles: { fillColor: [239, 68, 68], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 100 },
      2: { cellWidth: 30, halign: 'center' }
    }
  });
  
  // Recommendations
  currentY = (doc as any).lastAutoTable.finalY + 10;
  
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.text('Recomendaciones', 14, currentY);
  
  const recommendationsData = analysis.recommendations.map(rec => [
    rec.action,
    rec.priority.toUpperCase(),
    rec.timeframe
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['Acción', 'Prioridad', 'Plazo']],
    body: recommendationsData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 50 }
    }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('ComexIA - Plataforma de Inteligencia Comercial', 105, 285, { align: 'center' });
    doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  }
  
  doc.save(`ComexIA-Analisis-Mercado-${analysis.hsCode}-${analysis.country}-${Date.now()}.pdf`);
}

export function exportCountryRecommendationsPDF(
  recommendations: CountryRecommendation[],
  metadata: {
    hsCode: string;
    productName: string;
    originCountry: string;
    operation: string;
  }
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text('ComexIA - Recomendaciones de Países', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 105, 28, { align: 'center' });
  
  // Product Information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Información de Búsqueda', 14, 40);
  
  const searchInfo = [
    ['Producto:', `${metadata.productName} (${metadata.hsCode})`],
    ['País de Origen:', metadata.originCountry],
    ['Operación:', metadata.operation],
    ['Países Analizados:', recommendations.length.toString()]
  ];
  
  autoTable(doc, {
    startY: 45,
    body: searchInfo,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Top Recommendations
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Top 10 Destinos Recomendados', 14, currentY);
  
  const top10 = recommendations.slice(0, 10);
  const recommendationsData = top10.map((rec, index) => [
    (index + 1).toString(),
    rec.countryName,
    rec.score.toString(),
    rec.opportunity.toUpperCase(),
    `${rec.baseTariff}%`,
    `${rec.effectiveTariff}%`,
    `${rec.tariffSavings}%`,
    rec.companyCount.toString()
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [['#', 'País', 'Score', 'Oportunidad', 'Arancel Base', 'Arancel Efectivo', 'Ahorro', 'Empresas']],
    body: recommendationsData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontSize: 8 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 20, halign: 'right' },
      7: { cellWidth: 20, halign: 'right' }
    }
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('ComexIA - Plataforma de Inteligencia Comercial', 105, 285, { align: 'center' });
  doc.text('www.comexia.com', 105, 290, { align: 'center' });
  
  doc.save(`ComexIA-Recomendaciones-${metadata.hsCode}-${Date.now()}.pdf`);
}
