/**
 * Google Analytics (gtag.js) initialization
 * Must load AFTER cookie-consent.js
 */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

gtag('js', new Date());
gtag('config', 'G-NMG202J7GP');

// Debug logging
console.log('Google Analytics initialized');
