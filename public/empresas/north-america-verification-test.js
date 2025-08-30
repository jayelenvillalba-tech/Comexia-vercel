#!/bin/bash
# Verificación sistemática de América del Norte
# Siguiendo la metodología exitosa de América del Sur, América Central y Caribe

echo "🌎 VERIFICACIÓN SISTEMÁTICA DE AMÉRICA DEL NORTE"
echo "=================================================="

declare -A countries=(
  ["US"]="Estados Unidos|maquinaria"
  ["CA"]="Canadá|petroleo"
  ["MX"]="México|vehiculos"
)

working_countries=0
error_countries=0

echo "Nota: Contexto USMCA 2025 - Sistema dual tariff para bienes conformes/no conformes"
echo ""

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
echo ""
echo "CONTEXTO USMCA 2025:"
echo "- Bienes USMCA-conformes: 0% aranceles"
echo "- Bienes no conformes: 25-35% aranceles según país"
echo "- Sistema bifurcado por verificación de origen"