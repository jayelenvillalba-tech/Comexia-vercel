@echo off
echo Starting ComexIA...

:: Kill existing node processes (brute force to ensure clean slates)
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM vite.exe /T 2>nul
taskkill /F /IM tsx.exe /T 2>nul

echo Starting Backend...
start "ComexIA Backend" cmd /k "cd backend && npm start"
timeout /t 5

echo Starting Frontend...
start "ComexIA Frontend" cmd /k "cd frontend/client && npm run dev"

echo Done. Backend on 3000, Frontend on 5173.
pause
