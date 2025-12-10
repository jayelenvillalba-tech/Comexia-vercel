# 🚀 Guía de Inicio Rápido - ComexIA

## Problema Común: "La página no carga" o "Búsqueda no funciona"

**Causa:** El backend (servidor en puerto 3000) se cayó o no está corriendo.

## ✅ Solución Definitiva

### Opción 1: Inicio Automático (Recomendado)

1. Cierra TODAS las ventanas de terminal/consola
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta:
   ```powershell
   .\start-dev.bat
   ```
4. Espera 15 segundos
5. Abre el navegador en `http://localhost:5173`

### Opción 2: Inicio Manual (Más Control)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
Espera a ver: `Server running on port 3000`

**Terminal 2 - Frontend:**
```powershell
cd frontend/client
npm run dev
```
Espera a ver: `VITE ... Local: http://localhost:5173`

**Luego abre:** `http://localhost:5173`

## 🔍 Verificar que Todo Funciona

1. **Búsqueda HS Code:** Busca "carne" - debe mostrar resultados
2. **Análisis de Mercados:** Selecciona "Carne Bovina (0201)" y "Estados Unidos"
3. **Documentación Reglamentaria:** Debe aparecer la sección con documentos y botón PDF

## ⚠️ Si Algo Falla

### Backend no arranca (Error "EADDRINUSE")
```powershell
# Mata todos los procesos Node.js
taskkill /F /IM node.exe
# Luego vuelve a iniciar
cd backend
npm start
```

### Frontend no actualiza cambios
```powershell
# Ctrl+F5 en el navegador (recarga forzada)
# O cierra y reinicia el terminal del frontend
```

### Base de datos corrupta
```powershell
# Regenera la base de datos
cd database
npm run seed
```

## 📝 Notas Importantes

- **Siempre** espera a que ambos servidores terminen de iniciar antes de abrir el navegador
- El backend tarda ~5 segundos, el frontend ~10 segundos
- Si cierras una terminal por accidente, solo reinicia ESA terminal (no ambas)
- Los cambios en el código se aplican automáticamente (Hot Reload)
