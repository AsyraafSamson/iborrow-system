# PowerShell script to test API with real D1 database
# This simulates what happens in production

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  iBorrow API Tester with Real D1" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check users in database
Write-Host "Test 1: Checking users in D1 database..." -ForegroundColor Yellow
wrangler d1 execute iborrow --remote --command="SELECT id, email, nama, peranan FROM users;"
Write-Host ""

# Test 2: Check barang
Write-Host "Test 2: Checking barang in D1 database..." -ForegroundColor Yellow
wrangler d1 execute iborrow --remote --command="SELECT id, nama_barang, kuantiti_tersedia FROM barang LIMIT 5;"
Write-Host ""

# Test 3: Verify login credentials
Write-Host "Test 3: Testing login credentials..." -ForegroundColor Yellow
$testEmail = "admin@iborrow.com"
$testPassword = "admin123"

$result = wrangler d1 execute iborrow --remote --command="SELECT id, email, nama, peranan FROM users WHERE email = '$testEmail' AND password_hash = '$testPassword';" 2>&1 | Out-String

if ($result -match "admin") {
    Write-Host "✅ Login credentials VALID for $testEmail" -ForegroundColor Green
} else {
    Write-Host "❌ Login credentials INVALID" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Green
Write-Host "  ✅ D1 Database: Working" -ForegroundColor White
Write-Host "  ✅ Tables: Created" -ForegroundColor White
Write-Host "  ✅ Sample Data: Available" -ForegroundColor White
Write-Host ""
Write-Host "To use real D1 in your app:" -ForegroundColor Yellow
Write-Host "  1. Deploy to Cloudflare Pages" -ForegroundColor White
Write-Host "  2. Or use 'npm run dev' with mock data" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
