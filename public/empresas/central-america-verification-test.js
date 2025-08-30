#!/bin/bash
# Verificación sistemática de América Central
# Basado en el procedimiento exitoso de América del Sur

echo "🌎 VERIFICACIÓN SISTEMÁTICA DE AMÉRICA CENTRAL"
echo "=================================================="

declare -A countries=(
  ["GT"]="Guatemala|cafe"
  ["BZ"]="Belice|azucar"  
  ["SV"]="El Salvador|cafe"
  ["HN"]="Honduras|banano"
  ["NI"]="Nicaragua|cafe"
  ["CR"]="Costa Rica|banano"
  ["PA"]="Panama|banano"
)

working_countries=0
error_countries=0

for code in "${!countries[@]}"; do
  IFS='|' read -r name product <<< "${countries[$code]}"
  
  response=$(curl -s "http://localhost:5000/api/hs-search?q=${product}&country=${code}&operation=export")
  
  if [ $? -eq 0 ]; then
    partidas=$(echo "$response" | grep -o '"partidas":\[.*\]' | grep -o '{"id"' | wc -l)
    restrictions=$(echo "$response" | grep -o '"severity":"blocked"' | wc -l)
    
    echo "✅ $name ($code)"
    echo "   Producto: $product | Partidas: $partidas | Restricciones: $restrictions"
    
    if [ $restrictions -gt 0 ]; then
      blocked_msgs=$(echo "$response" | grep -o '"message":"[^"]*"' | grep "❌")
      echo "   ⚠️  Restricciones: $blocked_msgs"
    fi
    
    working_countries=$((working_countries + 1))
  else
    echo "❌ $name ($code)"
    echo "   Error: No se pudo conectar al API"
    error_countries=$((error_countries + 1))
  fi
  
  echo ""
done

echo "📊 RESUMEN FINAL"
echo "================"
echo "✅ Países funcionando: $working_countries/${#countries[@]}"
echo "❌ Países con errores: $error_countries/${#countries[@]}"