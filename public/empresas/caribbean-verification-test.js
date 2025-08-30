#!/bin/bash
# Verificación sistemática del Caribe
# Basado en la metodología exitosa de América del Sur y América Central

echo "🏝️ VERIFICACIÓN SISTEMÁTICA DEL CARIBE"
echo "=================================================="

declare -A countries=(
  ["DO"]="República Dominicana|azucar"
  ["JM"]="Jamaica|bauxita"
  ["TT"]="Trinidad y Tobago|petroleo"
  ["BB"]="Barbados|azucar"
  ["BS"]="Bahamas|farmaceuticos"
  ["HT"]="Haití|textiles"
  ["AG"]="Antigua y Barbuda|textiles"
  ["DM"]="Dominica|banano"
  ["GD"]="Granada|cacao"
  ["KN"]="San Cristóbal y Nieves|azucar"
  ["LC"]="Santa Lucía|banano"
  ["VC"]="San Vicente y Granadinas|banano"
)

working_countries=0
error_countries=0

echo "Nota: Guyana (GY) y Suriname (SR) ya verificados en América del Sur ✅"
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
echo "✅ Países funcionando: $working_countries/${#countries[@]} (nuevos)"
echo "✅ Países ya verificados: 2 (Guyana, Suriname)"
echo "✅ Total Caribe operativo: $((working_countries + 2))/14"
echo "❌ Países con errores: $error_countries/${#countries[@]}"