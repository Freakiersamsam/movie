# DNS Setup for cinemdle.com

## Quick Start (5 minutes)

1. **Go to Cloudflare Dashboard**
   - https://dash.cloudflare.com/
   - Navigate to: Workers & Pages → cinemdle → Custom domains

2. **Add Custom Domain**
   - Click "Set up a custom domain"
   - Enter: `cinemdle.com`
   - Click "Continue"
   - Cloudflare automatically creates DNS records ✅

3. **Add www (Optional)**
   - Click "Set up a custom domain" again
   - Enter: `www.cinemdle.com`
   - Click "Continue"

4. **Wait for DNS Propagation** (5-10 minutes)

5. **Test Your Site**
   - https://cinemdle.com
   - https://www.cinemdle.com

---

## DNS Records Created Automatically

```
Type: CNAME
Name: cinemdle.com
Target: cinemdle.pages.dev
Proxy: Enabled (orange cloud)
```

```
Type: CNAME
Name: www
Target: cinemdle.pages.dev
Proxy: Enabled (orange cloud)
```

---

## Manual Setup (If Needed)

If automatic setup doesn't work:

1. Go to: Cloudflare → Websites → cinemdle.com → DNS → Records

2. Click "Add record"

3. Fill in:
   ```
   Type: CNAME
   Name: @ (or cinemdle.com)
   Target: cinemdle.pages.dev
   Proxy status: Proxied (click for orange cloud)
   TTL: Auto
   ```

4. Save

5. Repeat for www:
   ```
   Type: CNAME
   Name: www
   Target: cinemdle.pages.dev
   Proxy status: Proxied
   TTL: Auto
   ```

---

## SSL/TLS Settings

**Required for Cloudflare Pages:**

1. Go to: Websites → cinemdle.com → SSL/TLS
2. Set to: **"Full"** or **"Full (strict)"**
3. Enable: **"Always Use HTTPS"**

---

## Verify DNS

### In Terminal
```bash
dig cinemdle.com
dig www.cinemdle.com
```

### In Browser
- Visit: https://cinemdle.com
- Should show your game!

---

## Troubleshooting

**Domain not working after 15 minutes?**
1. Check DNS records in Cloudflare Dashboard
2. Verify SSL/TLS is set to "Full" mode
3. Clear browser cache
4. Try incognito/private browsing

**Getting SSL errors?**
- Set SSL/TLS mode to "Full" or "Full (strict)"
- Wait 5 minutes for SSL certificate to provision

**Getting 520 errors?**
- Check that Pages deployment is active at cinemdle.pages.dev
- Verify DNS target is exactly: `cinemdle.pages.dev`

---

## Current Deployment

- **Pages URL:** https://8d1da775.cinemdle.pages.dev
- **Project:** cinemdle
- **Branch:** gh-pages
- **Custom Domain:** (add above)

---

## Need Help?

- Cloudflare Docs: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Check deployment status: https://dash.cloudflare.com/ → Workers & Pages → cinemdle
