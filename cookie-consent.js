/**
 * Cookie Consent Banner for Cinemdle
 * GDPR/CCPA compliant with Google Consent Mode v2
 */

(function() {
    'use strict';

    // Configuration
    const CONSENT_COOKIE_NAME = 'cinemdle_consent';
    const CONSENT_COOKIE_EXPIRY = 365; // days

    // Initialize Google Consent Mode (before gtag loads)
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    // Set default consent to denied
    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted'
    });

    // Cookie utilities
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function updateConsent(analytics, ads) {
        // Update Google Consent Mode
        gtag('consent', 'update', {
            'ad_storage': ads ? 'granted' : 'denied',
            'ad_user_data': ads ? 'granted' : 'denied',
            'ad_personalization': ads ? 'granted' : 'denied',
            'analytics_storage': analytics ? 'granted' : 'denied',
            'personalization_storage': analytics ? 'granted' : 'denied'
        });

        // Log for debugging
        console.log('Consent updated:', { analytics, ads });
    }

    function saveConsent(analytics, ads) {
        const consent = {
            analytics: analytics,
            ads: ads,
            timestamp: new Date().toISOString()
        };
        setCookie(CONSENT_COOKIE_NAME, JSON.stringify(consent), CONSENT_COOKIE_EXPIRY);
        updateConsent(analytics, ads);
    }

    function loadConsent() {
        const cookie = getCookie(CONSENT_COOKIE_NAME);
        if (cookie) {
            try {
                return JSON.parse(cookie);
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    function showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'flex';
            // Announce to screen readers
            banner.setAttribute('role', 'dialog');
            banner.setAttribute('aria-live', 'polite');
            banner.setAttribute('aria-label', 'Cookie consent');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Create and inject banner HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h3>🍪 We value your privacy</h3>
                    <p>
                        We use cookies to enhance your experience, analyze site traffic, and show personalized ads.
                        By clicking "Accept All", you consent to our use of cookies.
                    </p>
                    <p class="cookie-consent-links">
                        <a href="/privacy.html" target="_blank">Privacy Policy</a> •
                        <a href="/terms.html" target="_blank">Terms</a>
                    </p>
                </div>
                <div class="cookie-consent-buttons">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary" aria-label="Accept all cookies">
                        Accept All
                    </button>
                    <button id="cookie-accept-essential" class="cookie-btn cookie-btn-secondary" aria-label="Accept essential cookies only">
                        Essential Only
                    </button>
                    <button id="cookie-settings" class="cookie-btn cookie-btn-link" aria-label="Customize cookie settings">
                        Customize
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept-all').addEventListener('click', function() {
            saveConsent(true, true);
            hideBanner();
        });

        document.getElementById('cookie-accept-essential').addEventListener('click', function() {
            saveConsent(false, false);
            hideBanner();
        });

        document.getElementById('cookie-settings').addEventListener('click', function() {
            showSettingsModal();
        });
    }

    // Create settings modal
    function createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.innerHTML = `
            <div class="cookie-modal-overlay"></div>
            <div class="cookie-modal-content" role="dialog" aria-labelledby="cookie-modal-title" aria-modal="true">
                <button class="cookie-modal-close" aria-label="Close settings">×</button>
                <h2 id="cookie-modal-title">Cookie Settings</h2>

                <div class="cookie-settings-section">
                    <div class="cookie-setting-item">
                        <div class="cookie-setting-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="essential-cookies" checked disabled>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                            <h3>Essential Cookies</h3>
                            <span class="cookie-badge">Required</span>
                        </div>
                        <p>These cookies are necessary for the website to function and cannot be disabled.</p>
                    </div>

                    <div class="cookie-setting-item">
                        <div class="cookie-setting-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="analytics-cookies">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                            <h3>Analytics Cookies</h3>
                        </div>
                        <p>Help us understand how you use our site so we can improve your experience.</p>
                        <small>Provider: Google Analytics</small>
                    </div>

                    <div class="cookie-setting-item">
                        <div class="cookie-setting-header">
                            <label class="cookie-toggle">
                                <input type="checkbox" id="advertising-cookies">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                            <h3>Advertising Cookies</h3>
                        </div>
                        <p>Used to show you relevant ads and support the site.</p>
                        <small>Provider: Google AdSense</small>
                    </div>
                </div>

                <div class="cookie-modal-buttons">
                    <button id="cookie-save-settings" class="cookie-btn cookie-btn-primary">
                        Save Settings
                    </button>
                    <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close button
        modal.querySelector('.cookie-modal-close').addEventListener('click', hideSettingsModal);
        modal.querySelector('.cookie-modal-overlay').addEventListener('click', hideSettingsModal);

        // Save settings button
        document.getElementById('cookie-save-settings').addEventListener('click', function() {
            const analytics = document.getElementById('analytics-cookies').checked;
            const ads = document.getElementById('advertising-cookies').checked;
            saveConsent(analytics, ads);
            hideSettingsModal();
            hideBanner();
        });

        // Accept all button
        document.getElementById('cookie-accept-all-modal').addEventListener('click', function() {
            document.getElementById('analytics-cookies').checked = true;
            document.getElementById('advertising-cookies').checked = true;
            saveConsent(true, true);
            hideSettingsModal();
            hideBanner();
        });
    }

    function showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (!modal) {
            createSettingsModal();
        }

        // Load current settings
        const consent = loadConsent();
        if (consent) {
            document.getElementById('analytics-cookies').checked = consent.analytics;
            document.getElementById('advertising-cookies').checked = consent.ads;
        }

        document.getElementById('cookie-settings-modal').style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Focus trap
        const modalContent = document.querySelector('.cookie-modal-content');
        const focusableElements = modalContent.querySelectorAll('button, input');
        focusableElements[0].focus();
    }

    function hideSettingsModal() {
        document.getElementById('cookie-settings-modal').style.display = 'none';
        document.body.style.overflow = '';
    }

    // Initialize
    function init() {
        const consent = loadConsent();

        if (consent) {
            // Consent already given, update Google
            updateConsent(consent.analytics, consent.ads);
        } else {
            // No consent yet, show banner
            createBanner();
            showBanner();
        }
    }

    // Expose global function to show settings
    window.showCookieSettings = function() {
        showSettingsModal();
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
