# ComexIA - Desarrollo Local

## 🚀 Inicio Rápido

### Iniciar Servidores de Desarrollo

```powershell
.\start-dev.ps1
```

Este script iniciará automáticamente:
- **Backend** en `http://localhost:3000`
- **Frontend** en `http://localhost:5173`

### Acceder a la Aplicación

Abre tu navegador y visita: **http://localhost:5173**

## 📋 Requisitos

- Node.js 18+ instalado
- npm instalado

## 🗂️ Estructura del Proyecto

```
ComexIA-Trae-main/
├── backend/           # Servidor Express (Puerto 3000)
├── frontend/client/   # Aplicación React+Vite (Puerto 5173)
├── database/          # Sistema de almacenamiento JSON
├── shared/            # Schemas y tipos compartidos
├── data.json          # Base de datos JSON (se crea automáticamente)
└── start-dev.ps1      # Script de inicio
```

## 🔧 Comandos Manuales

### Backend
```powershell
cd backend
npm start
```

### Frontend
```powershell
cd frontend/client
npm run dev
```

### Build de Producción (Frontend)
```powershell
cd frontend/client
npm run build
```

## 📊 Base de Datos

El proyecto usa almacenamiento JSON (`data.json`) para evitar dependencias de compilación nativa.

- **Ubicación**: `./data.json` (raíz del proyecto)
- **Formato**: JSON con estructura de tablas
- **Persistencia**: Automática al guardar cambios

## 🌐 API Endpoints

- `GET /api/health` - Estado del servidor
- `GET /api/empresas` - Lista de empresas

## 🎨 Tecnologías

### Frontend
- React 18
- Vite
- TailwindCSS
- Wouter (routing)
- TanStack Query
- Radix UI Components
- Pigeon Maps

### Backend
- Express
- TypeScript
- JSON Storage

## 🐛 Solución de Problemas

### Puerto ya en uso
Si ves errores de puerto ocupado, cierra las aplicaciones que usan los puertos 3000 o 5173.

### Módulos no encontrados
```powershell
# En backend
cd backend
npm install

# En frontend
cd frontend/client
npm install
```

### Limpiar y reiniciar
```powershell
# Eliminar node_modules y reinstalar
rm -r node_modules
npm install
```

## 📝 Notas

- El archivo `data.json` se crea automáticamente al iniciar el backend
- Los cambios en el código se recargan automáticamente (hot reload)
- Para producción, considera migrar a PostgreSQL o MySQL
