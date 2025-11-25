# PowerShell script to setup Cloudflare D1 database
# Run this script after creating D1 database: wrangler d1 create iborrow

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  iBorrow System - D1 Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
Write-Host "Checking Wrangler installation..." -ForegroundColor Yellow
$wranglerVersion = wrangler --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Wrangler not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
} else {
    Write-Host "✅ Wrangler installed: $wranglerVersion" -ForegroundColor Green
}

Write-Host ""

# Check if user is logged in
Write-Host "Checking Cloudflare authentication..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Cloudflare. Please run: wrangler login" -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Logged in to Cloudflare" -ForegroundColor Green
}

Write-Host ""

# List existing databases
Write-Host "Listing existing D1 databases..." -ForegroundColor Yellow
wrangler d1 list

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "  1. Create NEW D1 database" -ForegroundColor White
Write-Host "  2. Initialize EXISTING database with schema" -ForegroundColor White
Write-Host "  3. Reset EXISTING database (deletes all data)" -ForegroundColor White
Write-Host "  4. View database contents" -ForegroundColor White
Write-Host "  5. Exit" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Creating new D1 database 'iborrow'..." -ForegroundColor Yellow
        wrangler d1 create iborrow
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Copy the 'database_id' from above and update wrangler.toml" -ForegroundColor Magenta
        Write-Host "Then run this script again and choose option 2 to initialize schema." -ForegroundColor Magenta
    }
    "2" {
        Write-Host ""
        Write-Host "Initializing database with schema.sql..." -ForegroundColor Yellow
        wrangler d1 execute iborrow --remote --file=./schema.sql
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Database initialized successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Default login accounts created:" -ForegroundColor Cyan
            Write-Host "  Admin: admin@iborrow.com / admin123" -ForegroundColor White
            Write-Host "  Staff ICT: staffict@iborrow.com / staffict123" -ForegroundColor White
            Write-Host "  User: user@iborrow.com / user123" -ForegroundColor White
        } else {
            Write-Host "❌ Failed to initialize database" -ForegroundColor Red
        }
    }
    "3" {
        Write-Host ""
        Write-Host "⚠️  WARNING: This will DELETE ALL DATA in the database!" -ForegroundColor Red
        $confirm = Read-Host "Type 'YES' to confirm"
        
        if ($confirm -eq "YES") {
            Write-Host "Resetting database..." -ForegroundColor Yellow
            wrangler d1 execute iborrow --remote --file=./schema.sql
            Write-Host "✅ Database reset complete" -ForegroundColor Green
        } else {
            Write-Host "❌ Reset cancelled" -ForegroundColor Yellow
        }
    }
    "4" {
        Write-Host ""
        Write-Host "Tables in database:" -ForegroundColor Cyan
        wrangler d1 execute iborrow --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
        
        Write-Host ""
        Write-Host "Users:" -ForegroundColor Cyan
        wrangler d1 execute iborrow --remote --command="SELECT id, email, nama, peranan, status FROM users;"
        
        Write-Host ""
        Write-Host "Barang:" -ForegroundColor Cyan
        wrangler d1 execute iborrow --remote --command="SELECT id, nama_barang, kategori, kuantiti_tersedia, status FROM barang;"
    }
    "5" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup complete! Next steps:" -ForegroundColor Green
Write-Host "  1. Run 'npm run dev' for local development" -ForegroundColor White
Write-Host "  2. Run 'npm run build' then deploy to Cloudflare Pages" -ForegroundColor White
Write-Host "  3. Bind D1 database in Cloudflare Pages dashboard" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
