# Script de prueba para las APIs de ComexIA
# Ejecutar: .\test-apis.ps1

Write-Host "🧪 Testing ComexIA APIs..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Check API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "   HS Codes: $($response.services.hsCodes)" -ForegroundColor Gray
    Write-Host "   Countries: $($response.services.countries)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: HS Codes Search
Write-Host "2️⃣ Testing HS Codes Search API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/hs-codes/search?q=cafe" -Method Get
    Write-Host "✅ HS Codes Search: OK" -ForegroundColor Green
    Write-Host "   Total results: $($response.total)" -ForegroundColor Gray
    if ($response.results.Count -gt 0) {
        $first = $response.results[0]
        Write-Host "   First result: $($first.code) - $($first.description)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ HS Codes Search: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get specific HS Code
Write-Host "3️⃣ Testing Get HS Code by Code..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/hs-codes/0901" -Method Get
    Write-Host "✅ Get HS Code: OK" -ForegroundColor Green
    Write-Host "   Code: $($response.data.code)" -ForegroundColor Gray
    Write-Host "   Description: $($response.data.description)" -ForegroundColor Gray
    Write-Host "   Base Tariff: $($response.data.baseTariff)%" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get HS Code: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Country Recommendations
Write-Host "4️⃣ Testing Country Recommendations API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/country-recommendations?hsCode=0901&originCountry=CO" -Method Get
    Write-Host "✅ Country Recommendations: OK" -ForegroundColor Green
    Write-Host "   Total recommendations: $($response.total)" -ForegroundColor Gray
    if ($response.recommended.Count -gt 0) {
        Write-Host "   Top 3 countries:" -ForegroundColor Gray
        for ($i = 0; $i -lt [Math]::Min(3, $response.recommended.Count); $i++) {
            $country = $response.recommended[$i]
            Write-Host "      $($i+1). $($country.countryName) - Score: $($country.score) ($($country.opportunity))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "❌ Country Recommendations: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Companies Search
Write-Host "5️⃣ Testing Companies API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/companies?country=BR" -Method Get
    Write-Host "✅ Companies Search: OK" -ForegroundColor Green
    Write-Host "   Total companies: $($response.total)" -ForegroundColor Gray
    if ($response.companies.Count -gt 0) {
        $first = $response.companies[0]
        Write-Host "   First company: $($first.name) ($($first.country))" -ForegroundColor Gray
        Write-Host "   Type: $($first.type)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Companies Search: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get specific Company
Write-Host "6️⃣ Testing Get Company by ID..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/companies/BR001" -Method Get
    Write-Host "✅ Get Company: OK" -ForegroundColor Green
    Write-Host "   Name: $($response.data.name)" -ForegroundColor Gray
    Write-Host "   Country: $($response.data.country)" -ForegroundColor Gray
    Write-Host "   Type: $($response.data.type)" -ForegroundColor Gray
    Write-Host "   Credit Rating: $($response.data.creditRating)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Get Company: FAILED" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 API Testing Complete!" -ForegroundColor Cyan
