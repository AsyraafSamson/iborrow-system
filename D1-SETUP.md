# iBorrow System - Cloudflare D1 Setup Guide

## Prerequisites
1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`

## Database Setup Commands

### 1. Create D1 Database (One Time Only)
```bash
# Create the database
wrangler d1 create iborrow

# Copy the database_id from output and update wrangler.toml
```

### 2. Initialize Database with Schema
```bash
# Apply schema to your D1 database
wrangler d1 execute iborrow --remote --file=./schema.sql
```

### 3. Verify Database Setup
```bash
# List all tables
wrangler d1 execute iborrow --remote --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check users table
wrangler d1 execute iborrow --remote --command="SELECT * FROM users;"

# Check barang table
wrangler d1 execute iborrow --remote --command="SELECT * FROM barang;"
```

## Development Commands

### Local Development
```bash
# Run Next.js dev server (uses mock data)
npm run dev

# Test with Cloudflare Pages locally (uses actual D1)
npx wrangler pages dev .next --compatibility-flag=nodejs_compat --binding DB=iborrow
```

### Database Queries

#### Insert New User
```bash
wrangler d1 execute iborrow --remote --command="INSERT INTO users (id, email, nama, peranan, jabatan, no_telefon, password_hash, status) VALUES ('user_004', 'test@iborrow.com', 'Test User', 'user', 'Testing', '0111111111', 'test123', 'active');"
```

#### Update User Password
```bash
wrangler d1 execute iborrow --remote --command="UPDATE users SET password_hash = 'newpassword123' WHERE email = 'admin@iborrow.com';"
```

#### Delete User
```bash
wrangler d1 execute iborrow --remote --command="DELETE FROM users WHERE email = 'test@iborrow.com';"
```

#### Add New Barang
```bash
wrangler d1 execute iborrow --remote --command="INSERT INTO barang (id, nama_barang, kategori, kod_barang, kuantiti_tersedia, kuantiti_total, lokasi, status, created_by) VALUES ('brg_006', 'Webcam Logitech C920', 'Multimedia', 'WEB-001', 5, 5, 'Bilik ICT', 'tersedia', 'user_001');"
```

## Deployment

### Deploy to Cloudflare Pages
```bash
# Build the Next.js app
npm run build

# Deploy to Cloudflare Pages (first time)
npx wrangler pages deploy .next --project-name=iborrow-system

# The D1 binding will be automatically available in production
```

### Bind D1 to Cloudflare Pages (via Dashboard)
1. Go to Cloudflare Dashboard
2. Navigate to Pages > iborrow-system
3. Go to Settings > Functions
4. Add D1 Database Binding:
   - Variable name: `DB`
   - D1 Database: `iborrow`

## Database Backup

### Export Database
```bash
# Export full database
wrangler d1 export iborrow --remote --output=./backup-$(Get-Date -Format "yyyyMMdd-HHmmss").sql
```

### Import Database
```bash
# Import from backup
wrangler d1 execute iborrow --remote --file=./backup-20241125-120000.sql
```

## Troubleshooting

### Check D1 Database ID
```bash
wrangler d1 list
```

### Reset Database (⚠️ Danger: Deletes All Data)
```bash
# Drop and recreate all tables
wrangler d1 execute iborrow --remote --file=./schema.sql
```

### View Query Logs
```bash
# Enable debug mode
$env:WRANGLER_LOG="debug"
wrangler pages dev .next --compatibility-flag=nodejs_compat --binding DB=iborrow
```

## Default Login Credentials

After running schema.sql, these accounts will be available:

| Email | Password | Role |
|-------|----------|------|
| admin@iborrow.com | admin123 | admin |
| staffict@iborrow.com | staffict123 | staff-ict |
| user@iborrow.com | user123 | user |

## Notes

- Development mode uses mock data if D1 is not available
- Production automatically uses D1 database
- Password hashing should be implemented before production use (currently using plain text)
- Schema includes indexes for better query performance
