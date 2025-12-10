Write-Host "Starting ComexIA..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"
Start-Sleep -Seconds 5
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend/client; npm run dev"
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"
