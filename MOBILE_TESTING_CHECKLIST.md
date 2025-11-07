# Cinemdle Mobile Testing Checklist

## Date: 2025-11-07
## Build: v20251107-mobile-optimized

---

## ✅ Pre-Testing Setup

### Devices to Test
- [ ] iPhone SE (2022) - 375×667px - Small screen
- [ ] iPhone 14 Pro - 393×852px - Notch/Dynamic Island
- [ ] iPhone 14 Pro Max - 430×932px - Large screen
- [ ] Samsung Galaxy S21 - 360×800px - Android
- [ ] iPad Mini - 768×1024px - Tablet
- [ ] Desktop Chrome (for regression)

### Browsers to Test
- [ ] iOS Safari (primary)
- [ ] Chrome Mobile (Android)
- [ ] Firefox Mobile
- [ ] Samsung Internet (if available)

### Testing Modes
- [ ] Portrait orientation
- [ ] Landscape orientation
- [ ] Slow 3G connection (throttled)
- [ ] Offline mode (after first load)

---

## 📱 Core Functionality Tests

### 1. Game Loading
- [ ] Page loads in < 3 seconds on 3G
- [ ] No layout shift during load (CLS < 0.1)
- [ ] Fonts load without FOUT (flash of unstyled text)
- [ ] Safe area insets respected (no content behind notch)
- [ ] No horizontal scroll on any screen size

### 2. Input Field Behavior
**Test:** Tap input field to start typing
- [ ] Input field focuses properly
- [ ] Font size is 16px (no auto-zoom on iOS)
- [ ] Keyboard opens smoothly
- [ ] Input scrolls into view when keyboard opens
- [ ] Input remains visible above keyboard
- [ ] Placeholder text visible and readable

**Test:** After wrong guess
- [ ] Input clears automatically
- [ ] Keyboard does NOT popup again (desktop only refocuses)
- [ ] Shake animation plays smoothly
- [ ] "nope" message displays

**Test:** After correct guess
- [ ] Keyboard dismisses on mobile
- [ ] Celebration animation visible (not obscured by keyboard)
- [ ] Hint cascade reveal visible
- [ ] Input disables properly

### 3. Autocomplete Behavior
**Test:** Type "the" in input field
- [ ] Autocomplete dropdown appears
- [ ] Items are min 44px tall (easy to tap)
- [ ] Scrolling is smooth (momentum scrolling on iOS)
- [ ] Tapping item selects it immediately
- [ ] Touch feedback on tap (slight scale down)
- [ ] Selected item fills input field
- [ ] Dropdown closes after selection

**Test:** Scroll autocomplete list
- [ ] Momentum scrolling works (iOS)
- [ ] Doesn't trigger page scroll (overscroll contained)
- [ ] No accidental selections during scroll

### 4. Button Touch Targets
**Test:** Tap each button
- [ ] "reveal next hint" button - min 48px tall
- [ ] "give up" button - min 48px tall
- [ ] "view stats" button - full width, 48px tall
- [ ] "help & shortcuts" button - full width, 48px tall
- [ ] All buttons show touch feedback
- [ ] No dead zones around buttons
- [ ] Buttons don't trigger double-tap zoom

### 5. Modal Behavior
**Test:** Open stats modal
- [ ] Modal opens smoothly
- [ ] Body scroll is locked (can't scroll page behind modal)
- [ ] Modal content is scrollable if needed
- [ ] Close button is 44×44px touch target
- [ ] Tapping outside modal closes it
- [ ] Tapping X button closes it
- [ ] Body scroll restored after closing

**Test:** Open help modal
- [ ] Same checks as stats modal
- [ ] Content readable on small screens
- [ ] Keyboard shortcuts visible and formatted

**Test:** Modal in landscape
- [ ] Modal height is 70vh (not too tall)
- [ ] Content fits without excessive scroll
- [ ] Padding adjusted appropriately

### 6. Landscape Mode
**Test:** Rotate device to landscape
- [ ] Layout adjusts properly
- [ ] No content cut off
- [ ] Quotes area reduces height (150px min)
- [ ] Modal adjusts to 70vh
- [ ] Bottom padding reduced appropriately
- [ ] All buttons still accessible

### 7. Pull-to-Refresh
**Test:** Drag down from top of page
- [ ] Pull-to-refresh does NOT trigger
- [ ] Game doesn't accidentally reload
- [ ] Overscroll stops at body boundary

### 8. Keyboard Shortcuts (Mobile Bluetooth Keyboard)
**Test:** With external keyboard connected
- [ ] Enter submits guess
- [ ] Ctrl+H reveals hint
- [ ] Ctrl+S shows stats
- [ ] ? shows help
- [ ] ↑↓ navigate autocomplete

---

## 🎨 Visual & Animation Tests

### 1. Animations
- [ ] Shake animation on wrong guess (smooth, 500ms)
- [ ] Celebrate animation on correct guess (smooth, 600ms)
- [ ] Hint cascade reveal (staggered, 80ms between)
- [ ] Modal fade in/out (smooth)
- [ ] Button press feedback (subtle)
- [ ] No jank or dropped frames

### 2. Touch Feedback
- [ ] Buttons change color on hover (desktop)
- [ ] Buttons show :active state on tap (mobile)
- [ ] Autocomplete items scale down on tap
- [ ] Tap highlight color visible (webkit-tap-highlight)

### 3. Typography
- [ ] All text readable (min 14px on mobile)
- [ ] Actor names have proper contrast (#aaa)
- [ ] Line height adequate (1.5-1.6)
- [ ] No text overflow or truncation
- [ ] Quotes fit width without horizontal scroll

### 4. Spacing
- [ ] Adequate padding around edges (16px minimum)
- [ ] Touch targets not too close (avoid mis-taps)
- [ ] Whitespace balanced
- [ ] Footer visible and not cut off

---

## 🔍 Edge Case Tests

### 1. Very Long Movie Titles
**Test:** Guess "The Assassination of Jesse James by the Coward Robert Ford"
- [ ] Title fits in autocomplete
- [ ] Title displays properly when revealed
- [ ] No horizontal overflow

### 2. Small Screens (iPhone SE)
- [ ] All content fits without horizontal scroll
- [ ] Buttons remain accessible
- [ ] Modal not too large
- [ ] Text remains readable

### 3. Large Screens (iPad)
- [ ] Layout doesn't stretch awkwardly
- [ ] Centered properly
- [ ] Touch targets appropriate for tablet
- [ ] Text size appropriate

### 4. Slow Network
**Test:** Throttle to Slow 3G
- [ ] Page loads within 5 seconds
- [ ] Loading states visible
- [ ] No broken images
- [ ] API calls timeout gracefully

### 5. Offline Mode
**Test:** Enable airplane mode
- [ ] Service worker serves cached content
- [ ] Game playable offline (with cached data)
- [ ] Stats persist across sessions
- [ ] Graceful error if API unavailable

### 6. Multiple Rounds
**Test:** Play all 5 rounds
- [ ] Round transitions smooth
- [ ] Difficulty increases properly
- [ ] Stats update correctly
- [ ] Memory usage doesn't spike
- [ ] No slowdown after multiple rounds

### 7. Modal Interactions
**Test:** Open modal, rotate device, close modal
- [ ] No layout issues
- [ ] Body scroll restored properly
- [ ] Modal resizes appropriately

---

## 🚨 Regression Tests (Desktop)

### Ensure No Desktop Regressions
- [ ] Desktop layout unchanged
- [ ] Input focus works on desktop
- [ ] Hover states work on desktop
- [ ] Keyboard shortcuts function
- [ ] Modal behavior unchanged
- [ ] No mobile-only CSS leaking to desktop

---

## ♿ Accessibility Tests

### Screen Reader
**Test:** Enable VoiceOver (iOS) or TalkBack (Android)
- [ ] All buttons have proper labels
- [ ] ARIA labels present and correct
- [ ] Hint counter announced
- [ ] Messages announced (role="status")
- [ ] Modal close button labeled
- [ ] Autocomplete navigable

### Contrast
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Actor names meet contrast (#aaa on black)
- [ ] Button text readable
- [ ] No low-contrast issues

### Focus Indicators
- [ ] Focus ring visible on all interactive elements
- [ ] Focus order logical (top to bottom)
- [ ] No keyboard traps

---

## 📊 Performance Metrics

### Lighthouse Mobile Scores (Target)
- [ ] Performance: >90
- [ ] Accessibility: >95
- [ ] Best Practices: >95
- [ ] SEO: >95

### Core Web Vitals (Target)
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1

### Manual Performance
- [ ] Smooth 60fps animations
- [ ] No layout thrashing
- [ ] Fast autocomplete (<150ms debounce)
- [ ] Instant button responses

---

## 🐛 Known Issues / Limitations

### iOS Safari
- [ ] Standalone mode (PWA) - test if installed
- [ ] Private browsing - localStorage works?
- [ ] Multiple tabs - state sync?

### Android
- [ ] Chrome vs Samsung Internet differences?
- [ ] Back button behavior
- [ ] Share functionality

---

## ✅ Optimization Verification

### JavaScript Fixes
- [x] Input only refocuses on desktop (line 402 script.js)
- [x] Keyboard dismisses on correct guess (mobile only)
- [x] Body scroll locked when modal opens
- [x] Body scroll restored when modal closes

### CSS Enhancements
- [x] Pull-to-refresh prevention (overscroll-behavior-y)
- [x] Autocomplete momentum scrolling (iOS)
- [x] Touch feedback on autocomplete items
- [x] Modal scroll chaining prevented
- [x] Landscape mode optimizations
- [x] iOS Safari bottom padding (+20px)

### Manual Verification
- [ ] No keyboard popup after wrong guess (mobile)
- [ ] Keyboard dismisses after correct guess (mobile)
- [ ] Can't scroll page when modal open
- [ ] Pull down doesn't trigger refresh
- [ ] Autocomplete scroll feels native on iOS
- [ ] Touch on autocomplete gives instant feedback
- [ ] Landscape mode uses space efficiently
- [ ] Bottom buttons not hidden by iOS Safari bar

---

## 📝 Test Execution Log

### Tester: ___________
### Date: ___________
### Device: ___________
### Browser: ___________

| Test Category | Status | Notes |
|---------------|--------|-------|
| Game Loading | ⬜ Pass ⬜ Fail | |
| Input Behavior | ⬜ Pass ⬜ Fail | |
| Autocomplete | ⬜ Pass ⬜ Fail | |
| Buttons | ⬜ Pass ⬜ Fail | |
| Modals | ⬜ Pass ⬜ Fail | |
| Landscape | ⬜ Pass ⬜ Fail | |
| Pull-to-Refresh | ⬜ Pass ⬜ Fail | |
| Animations | ⬜ Pass ⬜ Fail | |
| Touch Feedback | ⬜ Pass ⬜ Fail | |
| Edge Cases | ⬜ Pass ⬜ Fail | |
| Accessibility | ⬜ Pass ⬜ Fail | |
| Performance | ⬜ Pass ⬜ Fail | |

### Overall Result: ⬜ PASS ⬜ FAIL

### Issues Found:
1. _______________________________________
2. _______________________________________
3. _______________________________________

### Recommendations:
1. _______________________________________
2. _______________________________________
3. _______________________________________

---

## 🎯 Sign-Off

- [ ] All critical tests passed
- [ ] No P0/P1 bugs found
- [ ] Performance targets met
- [ ] Accessibility compliant
- [ ] Ready for deployment

**Approved by:** ___________________
**Date:** ___________________
