# Cloudflare Pages Deployment Guide for Cinemdle.com

## 📦 Pre-Deployment Checklist

- [ ] All files created and ready
- [ ] Favicon assets generated
- [ ] Google Analytics ID obtained (replace G-XXXXXXXXXX)
- [ ] Social preview image created (1200x630px)
- [ ] Test locally one final time

---

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
cd /Users/samuelferland/Documents/shit/movie

# Create a new git repository (if not already done)
git init

# Create .gitignore
cat > .gitignore << 'EOF'
# Development files
*.pyc
__pycache__/
.DS_Store
node_modules/
.env

# Backup files
*_backup_*.js
movies_cleaned.js
new_movie_entry.txt
new_movies_batch.txt

# Development scripts
remove_duplicates.py
add_movie_helper.py
find_missing_movies.py
check_afi_coverage.py
auto_add_movies.py
merge_additions.py
movies_to_add.md
verified_additions.txt

# Test files
test.js
browser-test.html
comprehensive-test.html

# Keep production files only
!index.html
!style.css
!script.js
!movies.js
!manifest.json
!sw.js
!robots.txt
!sitemap.xml
!browserconfig.xml
!privacy.html
!terms.html
!about.html
!favicon*
!android-chrome*
!apple-touch-icon.png
!safari-pinned-tab.svg
!mstile-150x150.png
!og-image.png
EOF

# Copy production index.html
cp index-production.html index.html

# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Cinemdle production ready"
```

### 2. Create GitHub Repository

```bash
# Install GitHub CLI if not already installed
# brew install gh

# Authenticate
gh auth login

# Create repository
gh repo create cinemdle --public --source=. --remote=origin

# Push to GitHub
git push -u origin main
```

### 3. Set Up Cloudflare Pages

#### Option A: Via Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Pages** in the sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select your **cinemdle** repository
6. Configure build settings:
   - **Project name:** cinemdle
   - **Production branch:** main
   - **Build command:** (leave empty - static site)
   - **Build output directory:** / (root)
7. Click **Save and Deploy**

#### Option B: Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=cinemdle
```

### 4. Configure Custom Domain

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `cinemdle.com`
5. Cloudflare will automatically configure DNS
6. Add redirect from `www.cinemdle.com` to `cinemdle.com`:
   - Go to **Redirects**
   - Add rule: `www.cinemdle.com/*` → `https://cinemdle.com/$1` (301)

### 5. Configure DNS (if domain not on Cloudflare)

If cinemdle.com is registered elsewhere, add these records:

```
Type: CNAME
Name: cinemdle.com (or @)
Value: cinemdle.pages.dev

Type: CNAME
Name: www
Value: cinemdle.pages.dev
```

### 6. Enable SSL/TLS

1. Go to **SSL/TLS** settings
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

---

## 🔧 Post-Deployment Configuration

### Update Google Analytics

1. Create Google Analytics 4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update `index.html` line 104:
   ```javascript
   gtag('config', 'G-XXXXXXXXXX', {
   ```
4. Commit and push changes

### Set Up Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `cinemdle.com`
3. Verify ownership (use HTML tag method)
4. Submit sitemap: `https://cinemdle.com/sitemap.xml`

### Apply for Google AdSense

**Requirements:**
- Site must be live and have original content ✓
- Privacy policy page ✓
- Terms of service page ✓
- About page ✓
- At least 30 quality pages (add blog posts if needed)
- Site must be 6 months old (some regions)

**Steps:**
1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign up with your Gmail account
3. Add your site: cinemdle.com
4. Add AdSense code to your site (already prepared in index.html)
5. Wait for approval (can take 1-4 weeks)

**Once Approved:**
1. Uncomment AdSense script in `index.html` (line 120)
2. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID
3. Uncomment ad slots (lines 125, 175)
4. Add your ad unit IDs
5. Test ads in preview
6. Deploy to production

### Performance Optimization

```bash
# Add these headers in Cloudflare Pages settings
# Pages > Settings > Functions > _headers

cat > public/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/manifest.json
  Cache-Control: public, max-age=3600

/sw.js
  Cache-Control: public, max-age=0, must-revalidate
EOF
```

---

## 📊 Analytics & Monitoring

### Set Up Monitoring

1. **Cloudflare Analytics** (built-in)
   - Already active in your Cloudflare dashboard
   - Shows traffic, bandwidth, threats

2. **Google Analytics** (once GA ID added)
   - User behavior
   - Traffic sources
   - Conversions

3. **UptimeRobot** (optional)
   - Go to [uptimerobot.com](https://uptimerobot.com)
   - Add monitor for cinemdle.com
   - Get alerts if site goes down

### Track Important Events

Add to `script.js` to track game events:

```javascript
// When user completes a round
trackEvent('Game', 'round_complete', `difficulty_${difficulty}`);

// When user shares results
trackEvent('Social', 'share', 'twitter');

// When user gives up
trackEvent('Game', 'give_up', `round_${roundNumber}`);
```

---

## 🎨 Asset Checklist

Before deploying, ensure you have:

- [ ] favicon.ico (16x16, 32x32 multi-size)
- [ ] favicon-16x16.png
- [ ] favicon-32x32.png
- [ ] apple-touch-icon.png (180x180)
- [ ] android-chrome-192x192.png
- [ ] android-chrome-512x512.png
- [ ] safari-pinned-tab.svg (monochrome)
- [ ] mstile-150x150.png
- [ ] og-image.png (1200x630 - social preview)
- [ ] screenshot-mobile.png (390x844)
- [ ] screenshot-desktop.png (1920x1080)

---

## 🚨 Troubleshooting

### Site Not Loading
- Check DNS propagation: https://dnschecker.org
- Verify CNAME record points to `cinemdle.pages.dev`
- Check Cloudflare deployment status

### SSL Certificate Issues
- Wait 24 hours for certificate to provision
- Check SSL/TLS mode is "Full (strict)"
- Clear browser cache

### Analytics Not Tracking
- Verify GA Measurement ID is correct
- Check browser console for errors
- Test with GA Debugger extension

### AdSense Not Showing
- Verify AdSense approval email received
- Check ad code is uncommented
- Ad units can take 24-48 hours to activate
- Check browser ad blocker is disabled

---

## 📈 Growth Strategy

### Week 1: Soft Launch
- Share with friends and family
- Post on personal social media
- Join movie enthusiast communities

### Week 2-4: Community Building
- Post daily on Twitter/Instagram
- Engage with Wordle community
- Submit to:
  - Product Hunt
  - Hacker News
  - Reddit (r/wordle, r/movies, r/WebGames)

### Month 2+: Content Marketing
- Write blog posts about movie trivia
- Create TikTok/Instagram Reels with movie facts
- Collaborate with movie YouTubers
- Guest posts on film blogs

---

## ✅ Launch Checklist

- [ ] Repository created and pushed to GitHub
- [ ] Cloudflare Pages project created
- [ ] Custom domain (cinemdle.com) connected
- [ ] SSL certificate active
- [ ] All assets uploaded (favicons, images)
- [ ] Google Analytics configured
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] About page live
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS, Android)
- [ ] Share button works
- [ ] Stats persist correctly
- [ ] Daily reset works
- [ ] Social preview image displays correctly
- [ ] PWA installable on mobile
- [ ] No console errors
- [ ] Lighthouse score >90

---

## 🎉 You're Ready to Launch!

Once everything is checked off, announce your launch:

**Social Media Template:**
```
🎬 Introducing Cinemdle - A daily movie quote guessing game!

🎯 5 difficulty levels
📝 Progressive hints
📊 Track your stats
🔄 Share your results

Like Wordle, but for cinema lovers!

Play now: https://cinemdle.com

#Cinemdle #MovieTrivia #DailyGame #Wordle
```

Good luck! 🚀🎬
