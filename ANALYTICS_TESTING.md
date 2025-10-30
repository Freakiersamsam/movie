# Analytics & AdSense Testing Guide

## Current Status

### ✅ Google Analytics
- **Tracking ID:** G-NMG202J7GP
- **Status:** Configured and ready
- **Script:** Loaded via gtag.js

### ✅ Google AdSense
- **Publisher ID:** ca-pub-8052290720138654
- **Status:** Script loaded, ads slots ready (currently commented out)
- **Ad slots:** Need to be created in AdSense dashboard

---

## 🔍 Testing Google Analytics

### Method 1: Real-time Reports (Easiest)
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property (G-NMG202J7GP)
3. Go to **Reports** → **Realtime**
4. Open your site in another tab: https://cinemdle.com
5. You should see **1 active user** within 30 seconds
6. Play the game and watch events appear

### Method 2: Browser DevTools (Most Reliable)
1. Open your site: https://cinemdle.com
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to **Network** tab
4. Filter by "collect" or "gtag"
5. Refresh the page
6. Look for requests to:
   - `https://www.googletagmanager.com/gtag/js?id=G-NMG202J7GP` ✅
   - `https://www.google-analytics.com/g/collect?...` ✅
7. If you see these, analytics is working!

### Method 3: Console Check
1. Open DevTools Console
2. Type: `typeof gtag`
3. Should return: `"function"` ✅
4. Type: `dataLayer`
5. Should return: `Array [...]` with data ✅

### Method 4: GA Debugger Extension (Advanced)
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
2. Enable the extension
3. Open DevTools Console
4. Visit your site
5. See detailed GA debug info in console

---

## 📊 Game Event Tracking

### Events That Should Be Tracked:
- ✅ **Page View** - Automatic
- 🔧 **Game Started** - When first hint is shown
- 🔧 **Guess Made** - Correct/wrong guess
- 🔧 **Hint Revealed** - Manual hint reveal
- 🔧 **Round Completed** - Win/loss per round
- 🔧 **Game Completed** - All 5 rounds finished
- 🔧 **Stats Viewed** - Stats modal opened
- 🔧 **Result Shared** - Share button clicked
- 🔧 **Give Up** - Give up button clicked

**Note:** 🔧 = Needs to be implemented (events are defined but not called)

---

## 💰 Testing Google AdSense

### Current Setup:
```html
<!-- AdSense script is loaded in <head> -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8052290720138654" crossorigin="anonymous"></script>

<!-- Ad slots are ready but commented out -->
<!-- Lines 118-130: Top banner ad -->
<!-- Lines 168-179: Mid-content ad -->
```

### Step 1: Create Ad Units in AdSense Dashboard
1. Go to [Google AdSense](https://adsense.google.com)
2. Navigate to **Ads** → **By ad unit**
3. Click **New ad unit**
4. Create two ad units:

   **Top Banner Ad:**
   - Name: "Cinemdle Top Banner"
   - Type: Display ads
   - Size: Responsive
   - Copy the ad slot ID (looks like: `1234567890`)

   **Mid-Content Ad:**
   - Name: "Cinemdle Mid Content"
   - Type: Display ads
   - Size: Rectangle (300x250) or Responsive
   - Copy the ad slot ID

### Step 2: Update index.html with Ad Slot IDs
Replace `XXXXXXXXXX` with your actual ad slot IDs:
```html
<!-- Line 123 -->
data-ad-slot="YOUR_TOP_BANNER_SLOT_ID"

<!-- Line 173 -->
data-ad-slot="YOUR_MID_CONTENT_SLOT_ID"
```

### Step 3: Uncomment Ad Blocks
Remove the `<!--` and `-->` around:
- Lines 118-130 (top banner)
- Lines 168-179 (mid-content ad)

### Step 4: Test Ads
1. Deploy to production
2. Wait 10-20 minutes for ads to activate
3. Visit your site
4. Look for ad placeholders or actual ads

### Checking if AdSense is Working:
**DevTools Method:**
1. Open DevTools → Network tab
2. Filter by "pagead" or "googlesyndication"
3. Refresh page
4. Look for:
   - `adsbygoogle.js` ✅
   - `show_ads_impl.js` ✅
   - Ad requests to `googleads.g.doubleclick.net` ✅

**Console Method:**
```javascript
// Check if AdSense loaded
typeof adsbygoogle !== 'undefined' // Should return true

// Check ad status
adsbygoogle.loaded // Should be true
```

**Visual Method:**
- Blank gray boxes = Ads loading
- "Ads by Google" = Working!
- Nothing = Not working (check console for errors)

---

## 🚨 Common Issues & Fixes

### Google Analytics Issues:

❌ **No data showing up**
- Wait 24-48 hours for initial setup
- Check Real-time reports (instant)
- Verify tracking ID is correct
- Check for ad blockers (disable them)

❌ **Console error: "gtag is not defined"**
- Script blocked by ad blocker
- Check network tab for failed requests
- Verify script tag is in `<head>`

❌ **Events not tracking**
- Events haven't been implemented yet in script.js
- See "Implementing Event Tracking" below

### Google AdSense Issues:

❌ **"Ad request from a site not registered..."**
- Add your domain in AdSense dashboard
- Go to **Sites** → **Add site** → Enter cinemdle.com

❌ **Blank spaces where ads should be**
- AdSense approval pending (can take 1-2 weeks)
- Not enough traffic yet (need ~100 daily visitors)
- Ad blockers active
- Waiting for ads to fill (can take 24-48 hours)

❌ **"Site not ready" error**
- Ensure privacy policy is live: /privacy.html
- Ensure terms are live: /terms.html
- Site needs original content ✅ (you have this)
- Must have HTTPS ✅ (Cloudflare provides)

---

## 🔧 Implementing Event Tracking

### Add to script.js (after game actions):

```javascript
// Track game started (add to startGame function)
if (typeof trackEvent === 'function') {
    trackEvent('Game', 'game_started', `Difficulty ${currentDifficulty}`);
}

// Track guess made (add after guess submission)
if (typeof trackEvent === 'function') {
    trackEvent('Game', isCorrect ? 'guess_correct' : 'guess_wrong', movieTitle);
}

// Track hint revealed (add to nextHint function)
if (typeof trackEvent === 'function') {
    trackEvent('Game', 'hint_revealed', `Hint ${currentHint}`);
}

// Track round completed (add after round ends)
if (typeof trackEvent === 'function') {
    trackEvent('Game', 'round_completed', `Difficulty ${currentDifficulty} - ${won ? 'Won' : 'Lost'}`);
}

// Track share (add to share button click)
if (typeof trackEvent === 'function') {
    trackEvent('Social', 'result_shared', 'Share clicked');
}

// Track stats viewed (add to stats modal open)
if (typeof trackEvent === 'function') {
    trackEvent('Engagement', 'stats_viewed', 'Stats opened');
}

// Track give up (add to give up button)
if (typeof trackEvent === 'function') {
    trackEvent('Game', 'gave_up', `Difficulty ${currentDifficulty}`);
}
```

---

## ✅ Quick Test Checklist

### Google Analytics:
- [ ] Open Network tab → See gtag.js load
- [ ] Open Console → Type `typeof gtag` → Returns "function"
- [ ] Visit Real-time reports → See 1 active user
- [ ] Play game → Events should appear in GA4

### Google AdSense:
- [ ] Create ad units in AdSense dashboard
- [ ] Copy ad slot IDs
- [ ] Update index.html with slot IDs
- [ ] Uncomment ad blocks
- [ ] Deploy to production
- [ ] Check Network tab for ad requests
- [ ] Wait 10-20 minutes for ads to show
- [ ] Verify no console errors

---

## 📈 Expected Results After 24 Hours

### Analytics Should Show:
- Page views
- Active users
- Average session duration
- Bounce rate
- Top pages (should be `/` mostly)

### AdSense Should Show:
- Ad impressions
- Estimated earnings (likely $0.00 at first)
- Click-through rate (CTR)
- Ads served per page

---

## 🎯 Next Steps

1. ✅ Verify Google Analytics is tracking page views
2. 🔧 Add event tracking to game actions
3. 💰 Create AdSense ad units
4. 💰 Uncomment ad blocks with real slot IDs
5. 🚀 Deploy and test
6. 📊 Monitor analytics daily
7. 💰 Apply for AdSense approval if not yet approved

---

**Need help?**
- [Google Analytics Help](https://support.google.com/analytics)
- [Google AdSense Help](https://support.google.com/adsense)
- [GA Debugger Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
