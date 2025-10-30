# Security Deployment Guide - Cinemdle

## Pre-Deployment Security Checklist

### 1. Set Admin API Key (CRITICAL)

```bash
cd movie/worker

# Generate a strong random key (32+ characters)
openssl rand -base64 32

# Set as Cloudflare secret
wrangler secret put ADMIN_API_KEY
# Paste the generated key when prompted
```

⚠️ **Never commit this key to git!**

### 2. Verify CORS Configuration

Edit `worker/index.js` if needed:

```javascript
const ALLOWED_ORIGINS = [
  'https://cinemdle.com',
  'https://www.cinemdle.com',
  // Remove localhost entries for production:
  // 'http://localhost:8787',  // REMOVE IN PRODUCTION
  // 'http://127.0.0.1:8787',  // REMOVE IN PRODUCTION
];
```

### 3. Test Rate Limiting

```bash
# Test rate limiting locally
cd movie/worker
wrangler dev

# In another terminal, test burst requests:
for i in {1..12}; do
  curl http://localhost:8787/api/session/init -X POST \
    -H "Content-Type: application/json" \
    -d '{"userAgent":"test","isDev":false}'
  echo ""
done

# Should see 429 error after 5 requests
```

### 4. Validate CSP Headers

Open `index.html` in browser:
1. Open DevTools Console
2. Look for CSP violations (should be NONE)
3. Test all features (autocomplete, stats, help modal)
4. Verify no `Refused to execute inline script` errors

### 5. Deploy Worker with Security

```bash
cd movie/worker

# Deploy to production
wrangler deploy

# Verify deployment
curl https://cinemdle-api.samuel-ferland.workers.dev/api/health

# Test CORS
curl -H "Origin: https://cinemdle.com" \
  https://cinemdle-api.samuel-ferland.workers.dev/api/health -v

# Verify security headers in response
```

### 6. Deploy Frontend with CSP

```bash
cd movie

# Ensure Node 20+ is active
nvm use 20

# Deploy to Cloudflare Pages
npx wrangler pages deploy . --project-name=cinemdle --branch=gh-pages

# Test deployed site
open https://cinemdle.com

# Check browser console for:
# - No CSP errors
# - Service worker registered
# - Analytics loaded
```

## Post-Deployment Verification

### Security Headers Test

```bash
# Check all security headers are present
curl -I https://cinemdle-api.samuel-ferland.workers.dev/api/health

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000
```

### Rate Limiting Test

```bash
# Test submission rate limit (10/min)
for i in {1..15}; do
  curl https://cinemdle-api.samuel-ferland.workers.dev/api/results/submit \
    -X POST \
    -H "Content-Type: application/json" \
    -H "X-Session-ID: test-session-$(uuidgen)" \
    -d '{"date":"2025-10-30","difficulty":1,"won":true,"hintsUsed":3}'
  sleep 3
done

# Should see 429 after 10 requests
```

### CORS Test

```bash
# Valid origin - should succeed
curl https://cinemdle-api.samuel-ferland.workers.dev/api/health \
  -H "Origin: https://cinemdle.com" -v

# Invalid origin - should still return data but with different CORS header
curl https://cinemdle-api.samuel-ferland.workers.dev/api/health \
  -H "Origin: https://evil.com" -v

# Check Access-Control-Allow-Origin matches approved list
```

### Admin Endpoint Test

```bash
# Without API key - should fail
curl https://cinemdle-api.samuel-ferland.workers.dev/api/admin/sync-movies \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"movies":[]}'

# Should return: {"error":"Unauthorized"}

# With API key - should succeed
curl https://cinemdle-api.samuel-ferland.workers.dev/api/admin/sync-movies \
  -X POST \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_SECRET_KEY" \
  -d '{"movies":[]}'
```

### Session Expiration Test

```sql
-- Connect to D1 database
wrangler d1 execute cinemdle-db --command="
  SELECT session_id,
         datetime(last_active) as last_active,
         datetime(last_active, '+90 days') as expires_at
  FROM user_sessions
  ORDER BY last_active DESC
  LIMIT 5;
"

-- Verify expiration dates are correct
```

### CSP Test

Visit https://cinemdle.com and check browser console:

✅ **Should see:**
- `Service Worker registered`
- No CSP violation errors
- All scripts loaded successfully

❌ **Should NOT see:**
- `Refused to execute inline script`
- `Refused to load stylesheet`
- `Blocked by Content Security Policy`

### Cookie Security Test

1. Open https://cinemdle.com
2. DevTools → Application → Cookies
3. Click on `cinemdle_consent` cookie
4. Verify:
   - ✅ `Secure` flag is set (HTTPS only)
   - ✅ `SameSite` is `Lax`
   - ✅ `Path` is `/`
   - ✅ `Expires` is ~1 year from now

## Monitoring Setup

### Cloudflare Analytics

1. Go to Cloudflare Dashboard → Workers → cinemdle-api
2. Click "Metrics & Analytics"
3. Monitor:
   - **Request Volume:** Should be steady
   - **Error Rate:** Should be < 1%
   - **429 Responses:** Track rate limit hits
   - **401 Responses:** Admin auth failures (investigate if > 0)

### Database Health

```bash
# Check database size
wrangler d1 execute cinemdle-db --command="
  SELECT
    (SELECT COUNT(*) FROM user_sessions) as sessions,
    (SELECT COUNT(*) FROM round_results) as results,
    (SELECT COUNT(*) FROM daily_movies) as daily_movies,
    (SELECT COUNT(*) FROM movies) as total_movies;
"

# Check for expired sessions (should be cleaned up)
wrangler d1 execute cinemdle-db --command="
  SELECT COUNT(*)
  FROM user_sessions
  WHERE datetime(last_active, '+90 days') < datetime('now');
"
```

## Security Incident Response

### Scenario 1: Admin API Key Leaked

```bash
# 1. Immediately rotate key
openssl rand -base64 32 > new_key.txt
wrangler secret put ADMIN_API_KEY < new_key.txt
rm new_key.txt

# 2. Check for unauthorized database modifications
wrangler d1 execute cinemdle-db --command="
  SELECT * FROM movies ORDER BY id DESC LIMIT 20;
"

# 3. Check worker logs for admin endpoint access
wrangler tail

# 4. Restore from backup if needed
wrangler d1 export cinemdle-db > backup_current.sql
# Then restore from known good backup
```

### Scenario 2: XSS Vulnerability Discovered

```bash
# 1. Verify CSP blocked execution
# Check browser console for CSP report

# 2. Identify and patch vulnerability
# Use textContent instead of innerHTML
# Sanitize user input

# 3. Deploy patch immediately
cd movie
npx wrangler pages deploy . --project-name=cinemdle --branch=gh-pages

# 4. Monitor for similar issues
grep -r "innerHTML" *.js *.html
```

### Scenario 3: Rate Limit Bypass

```javascript
// Edit worker/utils/rateLimit.js

// Option 1: Reduce limits
const RATE_LIMIT_CONFIG = {
  '/api/results/submit': { maxRequests: 5, windowMs: 60000 }, // Was 10
  // ...
};

// Option 2: Add IP-based blocking
// Add to worker/index.js before rate limit check:
const blockedIPs = ['1.2.3.4', '5.6.7.8'];
const clientIP = request.headers.get('CF-Connecting-IP');
if (blockedIPs.includes(clientIP)) {
  return new Response('Forbidden', { status: 403 });
}

// Deploy immediately
cd movie/worker
wrangler deploy
```

## Security Best Practices

### Regular Maintenance

**Weekly:**
- Check Cloudflare analytics for anomalies
- Review 429/401 error counts
- Monitor database growth

**Monthly:**
- Rotate admin API key
- Review and update ALLOWED_ORIGINS list
- Check for dependency updates

**Quarterly:**
- Full security audit
- Penetration testing
- Update CSP policy if needed

### Backup Strategy

```bash
# Backup D1 database (weekly)
wrangler d1 export cinemdle-db > backups/cinemdle-$(date +%Y%m%d).sql

# Backup worker code (git)
cd movie/worker
git commit -am "Weekly backup"
git push origin main

# Backup frontend (git)
cd movie
git commit -am "Weekly backup"
git push origin gh-pages
```

### Environment Variables

```bash
# List all secrets (names only, values hidden)
wrangler secret list

# Update secret
wrangler secret put ADMIN_API_KEY

# Delete secret (emergency only)
wrangler secret delete ADMIN_API_KEY
```

## Support

For security issues, contact:
- **Email:** samue.ferland@gmail.com
- **Subject:** "SECURITY: Cinemdle Issue"
- **Include:** Detailed description, steps to reproduce, impact assessment

---

**Last Updated:** 2025-10-30
**Next Security Review:** 2026-01-30
