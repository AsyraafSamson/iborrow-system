# D1 Binding Configuration for Cloudflare Pages

## Problem
Deployment fails with: `binding DB of type d1 failed to generate`

## Root Cause
Cloudflare Pages (via GitHub Actions) doesn't automatically bind D1 databases from `wrangler.toml`. You must configure bindings in the Cloudflare dashboard.

## Solution

### Option 1: Configure in Cloudflare Dashboard (RECOMMENDED)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **iborrow** project
3. Go to **Settings** tab
4. Scroll to **Functions** section
5. Click **Add binding** under **D1 database bindings**
6. Set:
   - **Variable name**: `DB`
   - **D1 database**: Select `iborrow` from dropdown
7. Click **Save**
8. **Trigger a new deployment** by pushing any commit or re-running the GitHub Action

### Option 2: Use wrangler.toml with Direct Deployment

Instead of GitHub Actions, use direct wrangler deploy:

```bash
# Build Next.js
npm run build

# Deploy with wrangler (reads wrangler.toml bindings)
npx wrangler pages deploy .next --project-name=iborrow
```

This method respects `wrangler.toml` D1 bindings.

### Option 3: Update GitHub Action to Pass D1 Binding

If using `cloudflare/pages-action`, you can't pass D1 bindings directly. You MUST configure them in the dashboard (Option 1).

## Verification

After configuring in dashboard:
1. Push a test commit to trigger deployment
2. Check deployment logs—should see no D1 binding errors
3. Visit `https://iborrow.pages.dev/api/test-d1` to verify D1 connection

## Current wrangler.toml D1 Config

```toml
[[d1_databases]]
binding = "DB"
database_name = "iborrow"
database_id = "51ddaea3-c7f4-4c5c-ad87-0a4e592e0154"
```

This config is used for:
- ✅ Local dev: `wrangler pages dev`
- ✅ Direct deploy: `wrangler pages deploy`
- ❌ GitHub Actions: Must configure in dashboard
