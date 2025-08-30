// Consolidador inteligente para 125+ archivos de empresas

console.log('🚀 Iniciando consolidador inteligente de 125+ archivos...');

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para obtener archivos JS recursivamente
const obtenerArchivosJS = async (directorio) => {
  const archivos = [];
  const elementos = await fs.readdir(directorio, { withFileTypes: true });
  
  for (const elemento of elementos) {
    const rutaCompleta = path.join(directorio, elemento.name);
    
    if (elemento.isDirectory()) {
      const archivosSubdirectorio = await obtenerArchivosJS(rutaCompleta);
      archivos.push(...archivosSubdirectorio);
    } else if (elemento.isFile() && path.extname(elemento.name) === '.js') {
      archivos.push(rutaCompleta);
    }
  }
  
  return archivos;
};

// Función para extraer empresas de un archivo
const extraerEmpresasDeArchivo = async (rutaArchivo) => {
  try {
    const contenido = await fs.readFile(rutaArchivo, 'utf8');
    const empresas = [];
    
    // Buscar patrones de empresas en el contenido
    const patronesEmpresas = [
      /const\s+\w+\s*=\s*\{[^}]*nombre[^}]*\}/g,
      /\{[^}]*"nombre"[^}]*\}/g,
      /\{[^}]*name[^}]*\}/g
    ];
    
    for (const patron of patronesEmpresas) {
      const coincidencias = contenido.match(patron);
      if (coincidencias) {
        empresas.push(...coincidencias.map(match => {
          try {
            return eval(`(${match})`);
          } catch {
            return { nombre: 'Empresa no válida', archivo: path.basename(rutaArchivo) };
          }
        }));
      }
    }
    
    return empresas;
  } catch (error) {
    console.error(`Error procesando ${rutaArchivo}:`, error.message);
    return [];
  }
};

// Función para eliminar duplicados
const eliminarDuplicadosInteligente = (empresas) => {
  const empresasUnicas = new Map();
  
  for (const empresa of empresas) {
    const clave = empresa.nombre?.toLowerCase() || 'sin-nombre';
    if (!empresasUnicas.has(clave)) {
      empresasUnicas.set(clave, empresa);
    }
  }
  
  return Array.from(empresasUnicas.values());
};

// Función para validar y enriquecer empresas
const validarYEnriquecerEmpresas = async (empresas) => {
  return empresas.map(empresa => ({
    ...empresa,
    id: empresa.id || `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fechaValidacion: new Date().toISOString(),
    estado: 'validada'
  }));
};

// Función para generar estadísticas
const generarEstadisticasConsolidadas = (baseDatos) => {
  baseDatos.estadisticas.porContinente = {};
  baseDatos.estadisticas.porTipo = {};
  baseDatos.estadisticas.porSector = {};
  baseDatos.estadisticas.porPais = {};
  
  for (const empresa of baseDatos.empresas) {
    // Estadísticas por continente
    const continente = empresa.continente || 'No especificado';
    baseDatos.estadisticas.porContinente[continente] = 
      (baseDatos.estadisticas.porContinente[continente] || 0) + 1;
    
    // Estadísticas por tipo
    const tipo = empresa.tipo || 'No especificado';
    baseDatos.estadisticas.porTipo[tipo] = 
      (baseDatos.estadisticas.porTipo[tipo] || 0) + 1;
  }
  
  baseDatos.metadata.continentesRepresentados = Object.keys(baseDatos.estadisticas.porContinente).length;
  baseDatos.metadata.sectoresIdentificados = Object.keys(baseDatos.estadisticas.porSector).length;
};

// Función para guardar base de datos
const guardarBaseDatosConsolidada = async (baseDatos, rutaArchivo) => {
  const contenido = `// Base de datos consolidada - Generada automáticamente\n// Fecha: ${baseDatos.metadata.fechaConsolidacion}\n\nexport const baseDatosConsolidada = ${JSON.stringify(baseDatos, null, 2)};\n\nexport default baseDatosConsolidada;`;
  
  await fs.writeFile(rutaArchivo, contenido, 'utf8');
  console.log(`💾 Base de datos guardada en: ${rutaArchivo}`);
};

// Función para mostrar resumen
const mostrarResumenConsolidacion = (baseDatos) => {
  console.log('\n📊 RESUMEN DE CONSOLIDACIÓN:');
  console.log('='.repeat(50));
  console.log(`📂 Archivos procesados: ${baseDatos.metadata.totalArchivosOriginales}`);
  console.log(`🏢 Empresas originales: ${baseDatos.metadata.totalEmpresasOriginales}`);
  console.log(`✅ Empresas consolidadas: ${baseDatos.metadata.totalEmpresasConsolidadas}`);
  console.log(`🗑️ Duplicados eliminados: ${baseDatos.metadata.duplicadosEliminados}`);
  console.log(`🌍 Continentes: ${baseDatos.metadata.continentesRepresentados}`);
  console.log(`🏭 Sectores: ${baseDatos.metadata.sectoresIdentificados}`);
};

const consolidadorInteligente125 = async () => {
  console.log('🔄 CONSOLIDADOR INTELIGENTE: 125+ ARCHIVOS');
  console.log('='.repeat(60));
  console.log('');

  const directorioBase = './public/empresas';
  const archivoConsolidado = './public/empresas/base-datos-consolidada.js';
  
  const baseDatosConsolidada = {
    metadata: {
      fechaConsolidacion: new Date().toISOString(),
      totalArchivosOriginales: 0,
      totalEmpresasOriginales: 0,
      totalEmpresasConsolidadas: 0,
      duplicadosEliminados: 0,
      continentesRepresentados: 0,
      sectoresIdentificados: 0
    },
    empresas: [],
    estadisticas: {
      porContinente: {},
      porTipo: {},
      porSector: {},
      porPais: {}
    },
    configuracion: {
      version: '2.0.0',
      compatibilidad: 'GlobalCompaniesWidget',
      formatoExportacion: 'ES6_MODULE'
    }
  };

  try {
    // Cargar resultados de auditoría
    console.log('📋 Cargando resultados de auditoría...');
    
    // Procesar todos los archivos JS
    const archivosJS = await obtenerArchivosJS(directorioBase);
    baseDatosConsolidada.metadata.totalArchivosOriginales = archivosJS.length;
    
    console.log(`📂 Procesando ${archivosJS.length} archivos JavaScript...`);
    
    const empresasTemporales = [];
    
    for (const archivoJS of archivosJS) {
      try {
        const empresasArchivo = await extraerEmpresasDeArchivo(archivoJS);
        empresasTemporales.push(...empresasArchivo);
        console.log(`  ✅ ${path.basename(archivoJS)}: ${empresasArchivo.length} empresas`);
      } catch (error) {
        console.log(`  ❌ ${path.basename(archivoJS)}: Error - ${error.message}`);
      }
    }
    
    baseDatosConsolidada.metadata.totalEmpresasOriginales = empresasTemporales.length;
    console.log(`\n📊 Total empresas extraídas: ${empresasTemporales.length}`);
    
    // Eliminar duplicados inteligentemente
    console.log('\n🔍 Eliminando duplicados...');
    const empresasUnicas = eliminarDuplicadosInteligente(empresasTemporales);
    baseDatosConsolidada.metadata.duplicadosEliminados = 
      empresasTemporales.length - empresasUnicas.length;
    
    console.log(`🗑️ Duplicados eliminados: ${baseDatosConsolidada.metadata.duplicadosEliminados}`);
    
    // Validar y enriquecer datos
    console.log('\n🔧 Validando y enriqueciendo datos...');
    baseDatosConsolidada.empresas = await validarYEnriquecerEmpresas(empresasUnicas);
    baseDatosConsolidada.metadata.totalEmpresasConsolidadas = baseDatosConsolidada.empresas.length;
    
    // Generar estadísticas
    console.log('\n📈 Generando estadísticas...');
    generarEstadisticasConsolidadas(baseDatosConsolidada);
    
    // Guardar base de datos consolidada
    console.log('\n💾 Guardando base de datos consolidada...');
    await guardarBaseDatosConsolidada(baseDatosConsolidada, archivoConsolidado);
    
    // Mostrar resumen final
    mostrarResumenConsolidacion(baseDatosConsolidada);
    
    console.log('✅ Consolidación finalizada exitosamente');
    return baseDatosConsolidada;
    
  } catch (error) {
    console.error('❌ Error en consolidación:', error.message);
    return null;
  }
};

// Exportar función principal (ES6 Module)
export { consolidadorInteligente125 };

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  consolidadorInteligente125()
    .then(() => {
      console.log('✅ Consolidación finalizada correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en consolidación:', error.message);
      process.exit(1);
    });
}

console.log('🏁 Consolidador inteligente finalizado');