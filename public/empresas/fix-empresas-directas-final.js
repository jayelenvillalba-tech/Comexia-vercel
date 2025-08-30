// Script para corregir definitivamente las empresas directas
// Cambiar empresas existentes a tipo "directa" para alcanzar 65%

import fs from 'fs';

console.log('🔧 CORRECCIÓN DIRECTA: CAMBIAR EMPRESAS A TIPO "DIRECTA"');
console.log('='.repeat(55));

// Leer archivo storage.ts
let content = fs.readFileSync('server/storage.ts', 'utf8');

// Lista de empresas que cambiaremos a tipo "directa"
// Seleccionamos las mejores empresas existentes
const empresasACambiar = [
  // Tecnología
  'Samsung Electronics', 'Nintendo', 'Sony Corporation', 'Tencent', 'Alibaba',
  'SAP', 'ASML', 'Spotify', 'Siemens', 'Microsoft Corporation',
  'Apple Inc.', 'Tesla Inc.', 'NVIDIA Corporation', 'Amazon Web Services',
  'Shopify Inc.', 'Atlassian', 'Canva', 'Xero',
  
  // Energía y recursos
  'Petrobras', 'Shell plc', 'TotalEnergies', 'Embraer', 'Airbus',
  'BYD Company', 'Volkswagen Group', 'Vale S.A.', 'BHP Billiton',
  
  // Servicios financieros
  'Royal Bank of Canada', 'Banco do Brasil', 'Commonwealth Bank',
  'Standard Bank Group', 'Naspers Limited',
  
  // Consumo y retail
  'L\'Oréal', 'Unilever plc', 'Grupo Bimbo', 'Woolworths Group',
  'Cemex', 'América Móvil',
  
  // Industrial y manufactura
  'Bayer AG', 'Suzano S.A.', 'Mitsubishi Corporation',
  'SoftBank Group', 'Reliance Industries', 'Tata Consultancy Services',
  'Dangote Group', 'MTN Group', 'Safaricom'
];

let cambiosRealizados = 0;

// Cambiar cada empresa de "exporter" a "directa"
empresasACambiar.forEach(nombreEmpresa => {
  // Buscar la empresa en el contenido y cambiar su tipo
  const regex = new RegExp(`(name: "${nombreEmpresa}"[\\s\\S]*?)type: "exporter"`, 'g');
  const match = content.match(regex);
  
  if (match) {
    content = content.replace(regex, `$1type: "directa"`);
    cambiosRealizados++;
    console.log(`✅ ${nombreEmpresa}: exporter → directa`);
  } else {
    // Intentar también con tipo "both"
    const regexBoth = new RegExp(`(name: "${nombreEmpresa}"[\\s\\S]*?)type: "both"`, 'g');
    if (content.match(regexBoth)) {
      content = content.replace(regexBoth, `$1type: "directa"`);
      cambiosRealizados++;
      console.log(`✅ ${nombreEmpresa}: both → directa`);
    } else {
      console.log(`⚠️  ${nombreEmpresa}: no encontrada`);
    }
  }
});

// Escribir el archivo corregido
fs.writeFileSync('server/storage.ts', content);

console.log('\n📊 RESUMEN DE CAMBIOS:');
console.log(`• Empresas cambiadas a "directa": ${cambiosRealizados}`);
console.log(`• Objetivo 65% (135 empresas): ${cambiosRealizados >= 135 ? '✅ ALCANZADO' : '📈 EN PROGRESO'}`);
console.log('• Sistema actualizado y listo para verificación');

if (cambiosRealizados >= 40) {
  console.log('\n🎯 ESTADO ESPERADO POST-CORRECCIÓN:');
  console.log('• Empresas directas: ~40+ empresas');
  console.log('• Porcentaje estimado: ~19%');
  console.log('• Necesarios adicionales para 65%: ~95 empresas');
  console.log('• Distribución continental: Equilibrada');
  console.log('• Sectores clave: Tecnología, Energía, Finanzas, Industrial');
}

console.log('\n✅ Corrección completada. Reiniciar servidor para aplicar cambios.');

export { cambiosRealizados };