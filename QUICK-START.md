# iBorrow System - Quick Start Checklist

## ✅ Completed Setup

- [x] Database schema created (`schema.sql`)
- [x] TypeScript types for D1 configured
- [x] Next.js config optimized for Cloudflare Pages
- [x] API route updated with proper D1 integration
- [x] D1 database initialized with data
- [x] Setup scripts created
- [x] Documentation complete
- [x] No TypeScript errors

## 🚀 Ready to Use

### Test Your Setup

1. **Start Development Server**
   ```powershell
   npm run dev
   ```
   Open http://localhost:3000

2. **Login with Test Account**
   - Email: `admin@iborrow.com`
   - Password: `admin123`
   - Should redirect to `/admin/dashboard`

3. **Test with Real D1** (Optional)
   ```powershell
   npm run pages:dev
   ```
   This uses actual Cloudflare D1 database

### Verify Database

```powershell
# View users
npm run d1:query "SELECT * FROM users;"

# View barang
npm run d1:query "SELECT * FROM barang;"
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `schema.sql` | Database structure |
| `wrangler.toml` | Cloudflare D1 config |
| `lib/database.ts` | D1 helper utilities |
| `types/cloudflare.d.ts` | TypeScript types |
| `app/api/auth/login/route.ts` | Example API route |
| `setup-d1.ps1` | Interactive setup script |
| `D1-SETUP.md` | Detailed setup guide |
| `README.md` | Project documentation |

## 🎯 Next Steps

### 1. Implement Remaining API Routes

Pattern to follow (from `login/route.ts`):

```typescript
import { getD1Database, type User } from '@/lib/database';

export async function GET(request: NextRequest) {
  const db = getD1Database();
  
  if (db) {
    // Use real D1
    const result = await db.prepare('SELECT * FROM users').all<User>();
    return NextResponse.json(result.results);
  } else {
    // Use mock data
    return NextResponse.json(mockData);
  }
}
```

### 2. Update Other API Routes

Apply the same pattern to:
- [ ] `/api/admin/barang/route.ts`
- [ ] `/api/admin/pengguna/route.ts`
- [ ] `/api/staff-ict/barang/route.ts`
- [ ] `/api/staff-ict/kelulusan/route.ts`
- [ ] `/api/user/barang/route.ts`
- [ ] `/api/user/tempahan/route.ts`
- [ ] And all other API routes...

### 3. Security (Before Production!)

- [ ] Implement bcrypt password hashing
- [ ] Add JWT authentication
- [ ] Add session management
- [ ] Add rate limiting
- [ ] Add CSRF protection
- [ ] Environment variables for secrets

### 4. Testing

```powershell
# Development (uses mock data)
npm run dev

# Test with D1
npm run pages:dev

# Build for production
npm run build
```

### 5. Deploy to Cloudflare Pages

```powershell
# Option 1: Manual
npm run build
npx wrangler pages deploy .next --project-name=iborrow-system

# Option 2: GitHub (Recommended)
git push origin main
# Then connect repo to Cloudflare Pages Dashboard
```

After deployment, bind D1 in Cloudflare Pages:
- Settings → Functions → D1 Bindings
- Add: `DB` → `iborrow`

## 📊 Database Schema Summary

### Tables
1. **users** - User accounts (3 sample users)
2. **barang** - Items for borrowing (5 sample items)
3. **tempahan** - Booking records (empty)
4. **log_aktiviti** - Activity logs (empty)

### Sample Data Included
- 3 users (admin, staff-ict, user)
- 5 barang items (laptops, projectors, cameras, etc.)

## 🎓 Key Concepts

### Development vs Production

| Environment | Database | Speed | Use Case |
|-------------|----------|-------|----------|
| `npm run dev` | Mock data | Fast | Development |
| `npm run pages:dev` | Real D1 | Slower | Testing |
| Production | Real D1 | Fast | Live |

### Type Safety

All database queries are type-safe:

```typescript
// ✅ Correct - Type-safe
const result = await db.prepare('SELECT * FROM users').all<User>();
const user: User = result.results[0];

// ❌ Wrong - No type safety
const result = await db.prepare('SELECT * FROM users').all();
const user: any = result.results[0];  // Avoid this!
```

### Database Access Helper

Use `getD1Database()` from `lib/database.ts`:

```typescript
import { getD1Database } from '@/lib/database';

const db = getD1Database();
if (db) {
  // D1 available
} else {
  // Use mock data
}
```

## 💡 Tips

1. **Always test with mock data first** - Faster development cycle
2. **Use `pages:dev` before deploying** - Catch D1-specific issues
3. **Check wrangler.toml** - Ensure database_id is correct
4. **Backup regularly** - Use `wrangler d1 export`
5. **Read the logs** - `console.log` shows which data source is used

## 🐛 Common Issues

### "D1 not available"
**Normal during development!** Use `npm run pages:dev` or use mock data.

### "Database not found"
Check `wrangler.toml` has correct `database_id`.

### TypeScript errors
All should be fixed. Run `npm run lint` to verify.

### Login not working
Check:
1. Database initialized: `npm run d1:query "SELECT * FROM users;"`
2. Email/password correct
3. Check console logs for detailed error messages

## 📞 Need Help?

1. Check `D1-SETUP.md` for detailed commands
2. Check `README.md` for full documentation
3. Check `SETUP-COMPLETE.md` for troubleshooting
4. Check browser console for error messages
5. Check terminal logs for D1 connection status

## 🎉 You're All Set!

Run `npm run dev` and start coding! 🚀
