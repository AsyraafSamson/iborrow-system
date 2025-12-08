# Email Configuration Guide

## Setup Resend API for Email Notifications

iBorrow System menggunakan [Resend](https://resend.com) untuk email notifications.

### Steps:

1. **Create Resend Account**
   - Go to https://resend.com
   - Sign up (Free tier: 100 emails/day)

2. **Get API Key**
   - Dashboard → API Keys
   - Create API key dengan nama "iBorrow System"
   - Copy API key (format: `re_xxxxxxxxxx`)

3. **Configure dalam Cloudflare Pages**
   - Go to: https://dash.cloudflare.com → Pages → iborrow → Settings → Environment variables
   - Add variable:
     - Name: `RESEND_API_KEY`
     - Value: `re_xxxxxxxxxx` (your API key)
     - Environment: Both Production & Preview
   - Save

4. **Verify Domain (Optional - untuk production)**
   - Resend → Domains → Add Domain
   - Add DNS records (MX, TXT, DKIM)
   - Update `from` address dalam `lib/email.ts`:
     ```typescript
     from: 'iBorrow System <noreply@yourdomain.com>'
     ```

### Email Types Implemented:

✅ **BOOKING_APPROVED** - Tempahan diluluskan
✅ **BOOKING_REJECTED** - Tempahan ditolak  
✅ **RETURN_UPDATE** - Status pemulangan dikemaskini
✅ **NEW_BOOKING** - Tempahan baru (to staff)
✅ **RETURN_REQUEST** - Permintaan pemulangan (to staff)

### Testing Locally:

```bash
# Add to .env.local
RESEND_API_KEY=re_your_api_key_here
```

If API key not configured, emails will fail silently (logged to console only).

### Email Recipients:

- **User emails**: Sent when booking approved/rejected/returned
- **Staff emails**: Sent when new booking or return request created
- Staff emails fetched from `users` table where `peranan = 'staff-ict'`

### Customization:

Edit email templates dalam `lib/email.ts`:
- HTML styling
- Subject lines
- Button URLs
- Email content
