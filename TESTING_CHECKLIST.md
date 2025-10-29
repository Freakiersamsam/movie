# Testing Checklist for Cinemdle

Test URL: https://8d1da775.cinemdle.pages.dev
(Soon: https://cinemdle.com)

## ✅ Critical Functionality Tests

### Game Mechanics
- [ ] First quote appears automatically when page loads
- [ ] Input field is focused and ready for typing
- [ ] **NEW FIX:** Enter wrong movie name → next hint auto-reveals after shake animation
- [ ] Enter correct movie name → all hints cascade reveal → auto-advance to next round
- [ ] "Next hint" button works
- [ ] "Give up" button appears after hint 4
- [ ] "Give up" button reveals answer and requires manual next round click
- [ ] All 5 rounds playable (difficulty 1-5)
- [ ] After completing all 5 rounds, stats modal auto-opens

### Autocomplete
- [ ] Type 3 letters → suggestions appear
- [ ] Click suggestion → fills input correctly
- [ ] Arrow keys navigate suggestions
- [ ] Enter key selects highlighted suggestion
- [ ] Click outside → autocomplete closes

### Stats & Sharing
- [ ] Stats modal shows correct data
- [ ] Guess distribution displays as bars
- [ ] Difficulty win rates show correctly
- [ ] "Share" button copies emoji results to clipboard
- [ ] Share text includes cinemdle.com link

### Animations & Feedback
- [ ] Wrong guess → input shakes
- [ ] Correct guess → screen celebrates (subtle scale animation)
- [ ] Hints fade in smoothly
- [ ] Message appears after wrong/correct guess

### Keyboard Shortcuts
- [ ] Press `?` → Help modal opens
- [ ] Press `Ctrl+H` → Next hint reveals
- [ ] Press `Ctrl+S` → Stats modal opens
- [ ] Press `Enter` in input → Submits guess

## 🔗 Links & Pages

### Navigation
- [ ] Click "how to play" → Help modal opens
- [ ] Click "stats" button → Stats modal opens
- [ ] Click "help (?)" button → Help modal opens

### Footer Links
- [ ] Click "privacy" → `/privacy.html` loads with proper styling
- [ ] Click "terms" → `/terms.html` loads with proper styling
- [ ] Click "contact" → Opens email to hello@cinemdle.com
- [ ] All footer links use correct font/colors

### Legal Pages
- [ ] privacy.html → Stylesheet loads (purple headers, dark background)
- [ ] terms.html → Stylesheet loads (purple headers, dark background)
- [ ] about.html → Stylesheet loads (not linked but should work)
- [ ] "← back to game" links work on all legal pages

## 📱 Mobile Testing

### iOS Safari
- [ ] Layout responsive (no horizontal scroll)
- [ ] Input doesn't auto-zoom on focus (16px font size)
- [ ] Touch targets large enough (44px minimum)
- [ ] Autocomplete works with touch
- [ ] Stats modal scrollable if needed
- [ ] Share button works on mobile

### Android Chrome
- [ ] Same as iOS checks above
- [ ] Virtual keyboard doesn't break layout

## 🎨 Visual/Design

### Header
- [ ] Header fixed at top
- [ ] Logo and nav visible
- [ ] "how to play" link works
- [ ] No "about" link (removed per fix)

### Footer
- [ ] Footer visible at bottom
- [ ] All links styled correctly
- [ ] "made with ❤️ for cinema lovers" text displays

### Colors & Contrast
- [ ] Purple theme (#6B46C1) consistent
- [ ] Actor names readable (color: #aaa)
- [ ] Focus states visible on all buttons/inputs

## 📊 Analytics & Performance

### Google Analytics
- [ ] Open browser dev tools → Network tab
- [ ] Page load → Check for gtag.js request to G-NMG202J7GP
- [ ] Play game → Events should be tracked

### Performance
- [ ] Page loads quickly (< 2 seconds)
- [ ] No console errors in browser dev tools
- [ ] No broken images/assets (check Network tab)
- [ ] Service worker registers (check Application tab)

## 🔒 Security & SEO

### Meta Tags (View Source)
- [ ] Title: "Cinemdle - Daily Movie Quote Guessing Game | Like Wordle for Movies"
- [ ] Description meta tag present
- [ ] Open Graph tags present (og:title, og:description, og:image)
- [ ] Twitter Card tags present
- [ ] Canonical URL: https://cinemdle.com/

### Favicons
- [ ] Favicon visible in browser tab (currently placeholder)
- [ ] Apple touch icon works on iOS home screen
- [ ] Manifest.json loads correctly

### SSL/Security
- [ ] HTTPS enabled (green lock in browser)
- [ ] No mixed content warnings
- [ ] CSP headers (optional check)

## 🐛 Edge Cases

### Data Persistence
- [ ] Play a round → Reload page → Progress persists
- [ ] Complete all rounds → Check back tomorrow → New movies load
- [ ] Clear localStorage → Game resets correctly

### Dev Mode
- [ ] Click dev reset button → Confirms before reset
- [ ] After reset → New set of 5 movies loads
- [ ] Stats clear after dev reset

### Error Handling
- [ ] Disable internet → Game still works offline (PWA)
- [ ] Clear cache → Page still loads
- [ ] Old browsers → Graceful degradation

## 🚨 Known Issues to Watch For

1. **Autocomplete on mobile** - Sometimes keyboard covers suggestions
2. **localStorage full** - Rare, but handle gracefully
3. **Timezone edge cases** - Daily reset at midnight local time
4. **Very long movie titles** - Check text wrapping

## ✨ Post-Testing Actions

After testing passes:
1. Set up DNS for cinemdle.com
2. Test again at cinemdle.com
3. Submit sitemap to Google Search Console
4. Monitor Analytics for 24 hours
5. Consider enabling AdSense (after traffic builds)

---

**Test completed on:** _______________
**Tested by:** _______________
**Issues found:** _______________
