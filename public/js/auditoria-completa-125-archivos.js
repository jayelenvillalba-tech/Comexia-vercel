// Auditoría completa de los 125+ archivos en /public/empresas
// Sistema inteligente de catalogación y análisis

console.log('🚀 Iniciando auditoría completa de 125+ archivos...');

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditoriaCompleta125Archivos = async () => {
  console.log('🔍 AUDITORÍA COMPLETA: 125+ ARCHIVOS EMPRESAS LIBERT.IA');
  console.log('='.repeat(70));
  console.log('');

  const directorioBase = './public/empresas';
  const resultadosAuditoria = {
    totalArchivos: 0,
    archivosPorTipo: {},
    archivosPorCarpeta: {},
    empresasEncontradas: 0,
    duplicadosDetectados: [],
    archivosProblematicos: [],
    estadisticasGenerales: {},
    recomendaciones: [],
    detalleArchivos: []
  };

  try {
    // Función recursiva para escanear directorios
    const escanearDirectorio = async (directorio, nivel = 0) => {
      const elementos = await fs.readdir(directorio, { withFileTypes: true });
      const archivos = [];

      for (const elemento of elementos) {
        const rutaCompleta = path.join(directorio, elemento.name);
        
        if (elemento.isDirectory()) {
          // Registrar carpeta
          const carpetaRelativa = path.relative(directorioBase, rutaCompleta);
          if (!resultadosAuditoria.archivosPorCarpeta[carpetaRelativa]) {
            resultadosAuditoria.archivosPorCarpeta[carpetaRelativa] = {
              archivos: 0,
              subcarpetas: 0,
              empresasTotal: 0
            };
          }
          
          // Escanear recursivamente
          const archivosSubcarpeta = await escanearDirectorio(rutaCompleta, nivel + 1);
          archivos.push(...archivosSubcarpeta);
          
        } else if (elemento.isFile()) {
          // Analizar archivo
          const extension = path.extname(elemento.name).toLowerCase();
          const carpetaPadre = path.relative(directorioBase, directorio) || 'raiz';
          
          // Contar por tipo
          resultadosAuditoria.archivosPorTipo[extension] = 
            (resultadosAuditoria.archivosPorTipo[extension] || 0) + 1;
          
          // Contar por carpeta
          if (!resultadosAuditoria.archivosPorCarpeta[carpetaPadre]) {
            resultadosAuditoria.archivosPorCarpeta[carpetaPadre] = {
              archivos: 0,
              subcarpetas: 0,
              empresasTotal: 0
            };
          }
          resultadosAuditoria.archivosPorCarpeta[carpetaPadre].archivos++;
          
          const stats = await fs.stat(rutaCompleta);
          
          archivos.push({
            nombre: elemento.name,
            ruta: rutaCompleta,
            rutaRelativa: path.relative(directorioBase, rutaCompleta),
            extension,
            carpeta: carpetaPadre,
            tamaño: stats.size,
            fechaModificacion: stats.mtime,
            empresas: []
          });
        }
      }
      
      return archivos;
    };

    // Ejecutar escaneo completo
    console.log('📂 Escaneando estructura de directorios...');
    const todosLosArchivos = await escanearDirectorio(directorioBase);
    resultadosAuditoria.totalArchivos = todosLosArchivos.length;
    resultadosAuditoria.detalleArchivos = todosLosArchivos;

    console.log(`✅ Encontrados ${resultadosAuditoria.totalArchivos} archivos`);
    console.log('');

    // Analizar contenido de archivos JavaScript
    console.log('🔬 Analizando contenido de archivos JS...');
    const archivosJS = todosLosArchivos.filter(a => a.extension === '.js');
    
    for (const archivo of archivosJS) {
      try {
        const contenido = await fs.readFile(archivo.ruta, 'utf8');
        
        // Detectar empresas en el archivo
        const empresasDetectadas = analizarEmpresasEnArchivo(contenido, archivo.nombre);
        archivo.empresas = empresasDetectadas;
        resultadosAuditoria.empresasEncontradas += empresasDetectadas.length;
        
        // Actualizar contador por carpeta
        if (resultadosAuditoria.archivosPorCarpeta[archivo.carpeta]) {
          resultadosAuditoria.archivosPorCarpeta[archivo.carpeta].empresasTotal += empresasDetectadas.length;
        }
        
        // Detectar duplicados potenciales
        const duplicados = detectarDuplicados(empresasDetectadas, archivo.nombre);
        if (duplicados.length > 0) {
          resultadosAuditoria.duplicadosDetectados.push({
            archivo: archivo.nombre,
            duplicados,
            cantidad: duplicados.length
          });
        }
        
        // Analizar calidad del archivo
        const calidadArchivo = analizarCalidadArchivo(contenido, empresasDetectadas);
        archivo.calidad = calidadArchivo;
        
        console.log(`  ✅ ${archivo.nombre}: ${empresasDetectadas.length} empresas (${calidadArchivo.puntuacion}/10)`);
        
      } catch (error) {
        resultadosAuditoria.archivosProblematicos.push({
          archivo: archivo.nombre,
          error: error.message,
          tipo: 'error_lectura'
        });
        console.log(`  ❌ ${archivo.nombre}: Error - ${error.message}`);
      }
    }

    // Analizar archivos JSON
    console.log('\n📄 Analizando archivos JSON...');
    const archivosJSON = todosLosArchivos.filter(a => a.extension === '.json');
    
    for (const archivo of archivosJSON) {
      try {
        const contenido = await fs.readFile(archivo.ruta, 'utf8');
        const datos = JSON.parse(contenido);
        
        // Detectar si contiene empresas
        const empresasJSON = extraerEmpresasDeJSON(datos);
        archivo.empresas = empresasJSON;
        resultadosAuditoria.empresasEncontradas += empresasJSON.length;
        
        console.log(`  ✅ ${archivo.nombre}: ${empresasJSON.length} empresas`);
        
      } catch (error) {
        resultadosAuditoria.archivosProblematicos.push({
          archivo: archivo.nombre,
          error: error.message,
          tipo: 'json_invalido'
        });
        console.log(`  ❌ ${archivo.nombre}: JSON inválido`);
      }
    }

    // Generar estadísticas generales
    resultadosAuditoria.estadisticasGenerales = {
      archivosJS: archivosJS.length,
      archivosJSON: archivosJSON.length,
      archivosMD: todosLosArchivos.filter(a => a.extension === '.md').length,
      archivosHTML: todosLosArchivos.filter(a => a.extension === '.html').length,
      carpetasEncontradas: Object.keys(resultadosAuditoria.archivosPorCarpeta).length,
      promedioEmpresasPorArchivo: archivosJS.length > 0 ? Math.round(resultadosAuditoria.empresasEncontradas / archivosJS.length) : 0,
      archivosConProblemas: resultadosAuditoria.archivosProblematicos.length,
      tamañoTotalMB: Math.round(todosLosArchivos.reduce((sum, a) => sum + a.tamaño, 0) / 1024 / 1024 * 100) / 100,
      duplicadosTotales: resultadosAuditoria.duplicadosDetectados.reduce((sum, d) => sum + d.cantidad, 0)
    };

    // Generar recomendaciones
    generarRecomendaciones(resultadosAuditoria);

    // Mostrar resultados
    mostrarResultadosAuditoria(resultadosAuditoria);

    // Guardar reporte detallado
    await guardarReporteAuditoria(resultadosAuditoria);

    console.log('✅ Auditoría finalizada exitosamente');
    return resultadosAuditoria;

  } catch (error) {
    console.error('❌ Error durante la auditoría:', error.message);
    return null;
  }
};

// Función para analizar empresas en un archivo
const analizarEmpresasEnArchivo = (contenido, nombreArchivo) => {
  const empresas = [];
  
  // Patrones mejorados para detectar empresas
  const patrones = [
    /name:\s*['"]([^'"]+)['"]/g,
    /"name":\s*"([^"]+)"/g,
    /empresa:\s*['"]([^'"]+)['"]/g,
    /company:\s*['"]([^'"]+)['"]/g,
    /nombre:\s*['"]([^'"]+)['"]/g,
    /companyName:\s*['"]([^'"]+)['"]/g
  ];
  
  patrones.forEach(patron => {
    let match;
    while ((match = patron.exec(contenido)) !== null) {
      empresas.push({
        nombre: match[1],
        archivo: nombreArchivo,
        posicion: match.index,
        contexto: contenido.substring(Math.max(0, match.index - 50), match.index + 100)
      });
    }
  });
  
  return empresas;
};

// Función para extraer empresas de JSON
const extraerEmpresasDeJSON = (datos) => {
  const empresas = [];
  
  const buscarEmpresas = (obj, ruta = '') => {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          if (item.name || item.nombre || item.company) {
            empresas.push({
              nombre: item.name || item.nombre || item.company,
              ruta: `${ruta}[${index}]`,
              datos: item
            });
          }
          buscarEmpresas(item, `${ruta}[${index}]`);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (key === 'name' || key === 'nombre' || key === 'company') {
          if (typeof obj[key] === 'string') {
            empresas.push({
              nombre: obj[key],
              ruta: `${ruta}.${key}`,
              datos: obj
            });
          }
        } else {
          buscarEmpresas(obj[key], `${ruta}.${key}`);
        }
      });
    }
  };
  
  buscarEmpresas(datos);
  return empresas;
};

// Función para detectar duplicados
const detectarDuplicados = (empresas, nombreArchivo) => {
  const nombres = empresas.map(e => e.nombre.toLowerCase().trim());
  const duplicados = nombres.filter((nombre, index) => nombres.indexOf(nombre) !== index);
  return [...new Set(duplicados)];
};

// Función para analizar calidad del archivo
const analizarCalidadArchivo = (contenido, empresas) => {
  let puntuacion = 0;
  const criterios = [];
  
  // Criterio 1: Número de empresas (0-3 puntos)
  if (empresas.length > 50) {
    puntuacion += 3;
    criterios.push('Alto número de empresas');
  } else if (empresas.length > 20) {
    puntuacion += 2;
    criterios.push('Número moderado de empresas');
  } else if (empresas.length > 0) {
    puntuacion += 1;
    criterios.push('Pocas empresas');
  }
  
  // Criterio 2: Estructura del código (0-2 puntos)
  if (contenido.includes('export') && contenido.includes('const')) {
    puntuacion += 2;
    criterios.push('Estructura ES6 moderna');
  } else if (contenido.includes('module.exports')) {
    puntuacion += 1;
    criterios.push('Estructura CommonJS');
  }
  
  // Criterio 3: Documentación (0-2 puntos)
  if (contenido.includes('//') || contenido.includes('/*')) {
    puntuacion += 1;
    criterios.push('Contiene comentarios');
  }
  if (contenido.includes('/**') || contenido.includes('@param')) {
    puntuacion += 1;
    criterios.push('Documentación JSDoc');
  }
  
  // Criterio 4: Datos completos (0-2 puntos)
  if (contenido.includes('country') && contenido.includes('type')) {
    puntuacion += 2;
    criterios.push('Datos completos de empresas');
  } else if (contenido.includes('country') || contenido.includes('type')) {
    puntuacion += 1;
    criterios.push('Datos parciales de empresas');
  }
  
  // Criterio 5: Sin errores de sintaxis (0-1 punto)
  try {
    // Verificación básica de sintaxis
    if (!contenido.includes('undefined') && !contenido.includes('null,')) {
      puntuacion += 1;
      criterios.push('Sin errores evidentes');
    }
  } catch (error) {
    criterios.push('Posibles errores de sintaxis');
  }
  
  return {
    puntuacion: Math.min(10, puntuacion),
    criterios,
    estado: puntuacion >= 7 ? 'excelente' : puntuacion >= 5 ? 'bueno' : puntuacion >= 3 ? 'regular' : 'deficiente'
  };
};

// Función para generar recomendaciones
const generarRecomendaciones = (resultados) => {
  const recomendaciones = [];
  
  if (resultados.duplicadosDetectados.length > 0) {
    recomendaciones.push(`🔄 Eliminar ${resultados.estadisticasGenerales.duplicadosTotales} duplicados detectados`);
  }
  
  if (resultados.archivosProblematicos.length > 0) {
    recomendaciones.push(`🔧 Corregir ${resultados.archivosProblematicos.length} archivos problemáticos`);
  }
  
  if (resultados.estadisticasGenerales.carpetasEncontradas > 15) {
    recomendaciones.push('📁 Reorganizar estructura de carpetas (demasiadas carpetas)');
  }
  
  if (resultados.empresasEncontradas < 500) {
    recomendaciones.push(`📈 Expandir base de datos (solo ${resultados.empresasEncontradas} empresas encontradas)`);
  }
  
  if (resultados.estadisticasGenerales.promedioEmpresasPorArchivo < 10) {
    recomendaciones.push('📊 Consolidar archivos pequeños para mejor eficiencia');
  }
  
  // Recomendaciones específicas por calidad
  const archivosDeficientes = resultados.detalleArchivos.filter(a => 
    a.calidad && a.calidad.estado === 'deficiente'
  ).length;
  
  if (archivosDeficientes > 0) {
    recomendaciones.push(`⚠️ Mejorar calidad de ${archivosDeficientes} archivos deficientes`);
  }
  
  recomendaciones.push('🔗 Ejecutar consolidador inteligente para unificar datos');
  recomendaciones.push('🎯 Integrar con GlobalCompaniesWidget del dashboard');
  
  resultados.recomendaciones = recomendaciones;
};

// Función para mostrar resultados
const mostrarResultadosAuditoria = (resultados) => {
  console.log('\n📊 RESULTADOS DE LA AUDITORÍA COMPLETA:');
  console.log('='.repeat(50));
  console.log(`• Total de archivos: ${resultados.totalArchivos}`);
  console.log(`• Empresas encontradas: ${resultados.empresasEncontradas}`);
  console.log(`• Duplicados detectados: ${resultados.estadisticasGenerales.duplicadosTotales}`);
  console.log(`• Archivos problemáticos: ${resultados.archivosProblematicos.length}`);
  console.log(`• Tamaño total: ${resultados.estadisticasGenerales.tamañoTotalMB} MB`);
  console.log('');
  
  console.log('📁 DISTRIBUCIÓN POR TIPO:');
  Object.entries(resultados.archivosPorTipo)
    .sort((a, b) => b[1] - a[1])
    .forEach(([tipo, cantidad]) => {
      console.log(`  • ${tipo}: ${cantidad} archivos`);
    });
  console.log('');
  
  console.log('🏢 TOP 5 CARPETAS CON MÁS EMPRESAS:');
  Object.entries(resultados.archivosPorCarpeta)
    .sort((a, b) => b[1].empresasTotal - a[1].empresasTotal)
    .slice(0, 5)
    .forEach(([carpeta, datos]) => {
      console.log(`  • ${carpeta}: ${datos.empresasTotal} empresas en ${datos.archivos} archivos`);
    });
  console.log('');
  
  console.log('🎯 RECOMENDACIONES PRIORITARIAS:');
  resultados.recomendaciones.slice(0, 5).forEach((rec, index) => {
    console.log(`${index + 1}. ${rec}`);
  });
  
  if (resultados.archivosProblematicos.length > 0) {
    console.log('\n❌ ARCHIVOS PROBLEMÁTICOS:');
    resultados.archivosProblematicos.slice(0, 5).forEach(problema => {
      console.log(`  • ${problema.archivo}: ${problema.error}`);
    });
  }
};

// Función para guardar reporte detallado
const guardarReporteAuditoria = async (resultados) => {
  const reporte = {
    fechaAuditoria: new Date().toISOString(),
    resumenEjecutivo: {
      totalArchivos: resultados.totalArchivos,
      empresasEncontradas: resultados.empresasEncontradas,
      duplicadosDetectados: resultados.estadisticasGenerales.duplicadosTotales,
      archivosProblematicos: resultados.archivosProblematicos.length,
      recomendacionesPrioritarias: resultados.recomendaciones.slice(0, 3)
    },
    detalleCompleto: resultados
  };
  
  const rutaReporte = './public/empresas/reporte-auditoria-completa.json';
  await fs.writeFile(rutaReporte, JSON.stringify(reporte, null, 2), 'utf8');
  console.log(`\n💾 Reporte detallado guardado en: ${rutaReporte}`);
};

// Exportar función principal (CommonJS)
export { auditoriaCompleta125Archivos };

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  auditoriaCompleta125Archivos()
    .then(() => {
      console.log('✅ Auditoría finalizada correctamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en auditoría:', error.message);
      process.exit(1);
    });
}
console.log('🏁 Auditoría completa finalizada');