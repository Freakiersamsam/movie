// Google Analytics initialization and tracking
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-NMG202J7GP');

// Custom events for game tracking
function trackEvent(category, action, label) {
  gtag('event', action, {
    'event_category': category,
    'event_label': label
  });
}

// Make trackEvent globally available
window.trackEvent = trackEvent;
