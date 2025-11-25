# iBorrow System

Sistem pengurusan peminjaman barang menggunakan Next.js 15 dan Cloudflare D1 Database.

## 🎯 Ciri-ciri Utama

- **3 Peranan Pengguna**: Admin, Staff ICT, dan User biasa
- **Pengurusan Barang**: CRUD barang dengan kategori dan status
- **Sistem Tempahan**: User boleh buat tempahan barang
- **Kelulusan**: Staff ICT approve/reject tempahan
- **Laporan**: Generate laporan untuk admin dan staff
- **Cloudflare D1**: SQLite database yang scalable dan global

## 🏗️ Teknologi

- **Frontend**: Next.js 15 (App Router), React 18, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: Cloudflare D1 (SQLite)
- **Hosting**: Cloudflare Pages
- **Language**: TypeScript 5

## 📁 Struktur Projek

```
iborrow-system/
├── app/
│   ├── admin/           # Admin dashboard & pages
│   ├── staff-ict/       # Staff ICT dashboard & pages
│   ├── user/            # User dashboard & pages
│   ├── api/             # API routes untuk database
│   │   ├── auth/        # Login/logout
│   │   ├── admin/       # Admin APIs
│   │   ├── staff-ict/   # Staff ICT APIs
│   │   └── user/        # User APIs
│   └── login/           # Login page
├── lib/
│   └── database.ts      # D1 database utilities
├── types/
│   └── cloudflare.d.ts  # TypeScript types untuk D1
├── schema.sql           # Database schema
├── wrangler.toml        # Cloudflare configuration
├── setup-d1.ps1         # PowerShell setup script
└── D1-SETUP.md          # Detailed setup guide
```

## 🚀 Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Setup Cloudflare D1 Database

```powershell
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Run setup script (interactive)
npm run d1:setup
```

**Atau manual:**

```powershell
# Create D1 database
wrangler d1 create iborrow

# Copy database_id to wrangler.toml, then initialize
npm run d1:init
```

### 3. Development

```powershell
# Local development (uses mock data)
npm run dev

# Test with actual D1 database locally
npm run pages:dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Default Login Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@iborrow.com | admin123 | Admin |
| staffict@iborrow.com | staffict123 | Staff ICT |
| user@iborrow.com | user123 | User |

## 📦 Deployment ke Cloudflare Pages

### Option 1: Via Wrangler CLI

```powershell
# Build
npm run build

# Deploy
npx wrangler pages deploy .next --project-name=iborrow-system
```

### Option 2: Via GitHub (Recommended)

1. Push code ke GitHub repository
2. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project → Connect to Git
4. Select repository: `iborrow-system`
5. Build settings:
   - Framework: Next.js
   - Build command: `npm run build`
   - Build output: `.next`
6. Deploy!

### Bind D1 Database (One Time)

After first deployment:

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Settings → Functions
3. Add D1 Database Binding:
   - Variable name: `DB`
   - D1 Database: `iborrow` (select from dropdown)
4. Save and redeploy

## 🛠️ NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development (mock data) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run d1:setup` | Interactive D1 setup (PowerShell) |
| `npm run d1:init` | Initialize database with schema |
| `npm run d1:query` | Execute D1 query |
| `npm run d1:list` | List all D1 databases |
| `npm run pages:dev` | Test locally with D1 |

## 📊 Database Schema

### Tables

- **users**: User accounts dengan roles
- **barang**: Items untuk dipinjam
- **tempahan**: Booking records
- **log_aktiviti**: Activity logs

Lihat `schema.sql` untuk full schema.

## 🔧 Database Commands

### Query Users

```powershell
wrangler d1 execute iborrow --remote --command="SELECT * FROM users;"
```

### Add New User

```powershell
wrangler d1 execute iborrow --remote --command="INSERT INTO users (id, email, nama, peranan, jabatan, no_telefon, password_hash, status) VALUES ('user_new', 'newuser@iborrow.com', 'New User', 'user', 'HR', '0123456789', 'password123', 'active');"
```

### Update User Password

```powershell
wrangler d1 execute iborrow --remote --command="UPDATE users SET password_hash = 'newpass123' WHERE email = 'admin@iborrow.com';"
```

### View All Barang

```powershell
wrangler d1 execute iborrow --remote --command="SELECT * FROM barang;"
```

### Backup Database

```powershell
wrangler d1 export iborrow --remote --output=./backup.sql
```

Lihat `D1-SETUP.md` untuk more commands.

## 🏃 Development Workflow

1. **Local Development** - Uses mock data, fast iteration
   ```powershell
   npm run dev
   ```

2. **Test with D1** - Test actual database queries
   ```powershell
   npm run pages:dev
   ```

3. **Deploy** - Push to production
   ```powershell
   npm run build
   git push origin main  # Auto-deploy via Cloudflare Pages
   ```

## 📝 API Routes

All API routes follow this pattern:

- `/api/auth/login` - POST: Login
- `/api/admin/*` - Admin endpoints
- `/api/staff-ict/*` - Staff ICT endpoints
- `/api/user/*` - User endpoints

Each route automatically detects D1 availability and falls back to mock data during development.

## 🔐 Security Notes

⚠️ **IMPORTANT**: Current implementation uses plain text passwords for development. Before production:

1. Implement bcrypt/argon2 password hashing
2. Add JWT/session management
3. Implement rate limiting
4. Add CSRF protection
5. Enable HTTPS only

## 🐛 Troubleshooting

### D1 Not Available During Development

This is normal. Use mock data during `npm run dev`, or use `npm run pages:dev` to test with actual D1.

### TypeScript Errors for D1

Make sure `types/cloudflare.d.ts` exists and is included in `tsconfig.json`.

### Wrangler Login Issues

```powershell
wrangler logout
wrangler login
```

### Database Reset (Deletes All Data)

```powershell
npm run d1:init
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

## 📄 License

Private - Internal Use Only

## 👨‍💻 Development

Developed with ❤️ using GitHub Copilot
