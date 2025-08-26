(function() {
    // Prevent double-initialization
    if (window.__GA4_INITIALIZED__) return;
    window.__GA4_INITIALIZED__ = true;

    var MEASUREMENT_ID = 'G-LMX96T4785';

    // If GA was already configured elsewhere for this ID, skip our config to avoid double page_view
    try {
        if (Array.isArray(window.dataLayer)) {
            var alreadyConfigured = window.dataLayer.some(function(cmd) {
                return Array.isArray(cmd) && cmd[0] === 'config' && cmd[1] === MEASUREMENT_ID;
            });
            if (alreadyConfigured) {
                return; // another snippet already configured GA for this ID
            }
        }
    } catch(_) {}

        // Consent Mode v2: set defaults and apply stored choice
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = window.gtag || gtag;

        // Default consent: analytics allowed; ads denied (adjust to your policy)
        gtag('consent', 'default', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'granted',
            functionality_storage: 'granted',
            personalization_storage: 'granted',
            security_storage: 'granted'
        });

        // Apply stored consent from localStorage ("all" | "analytics" | "none")
        try {
            var stored = localStorage.getItem('ss_consent');
            if (stored === 'all') {
                gtag('consent', 'update', {
                    ad_user_data: 'granted',
                    ad_personalization: 'granted',
                    ad_storage: 'granted',
                    analytics_storage: 'granted'
                });
            } else if (stored === 'analytics') {
                gtag('consent', 'update', {
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    ad_storage: 'denied',
                    analytics_storage: 'granted'
                });
            } else if (stored === 'none') {
                gtag('consent', 'update', {
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    ad_storage: 'denied',
                    analytics_storage: 'denied'
                });
            }
        } catch(_) {}

    // Load gtag script once
    if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id="]')) {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        document.head.appendChild(script);
    }

    gtag('js', new Date());

    var isLocal = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
        var config = {
        debug_mode: isLocal,
        // Enable cross-domain measurement if you use multiple domains
        linker: { domains: ['sweet-story.com', 'sweetstory.pp.ua', 'sweet-story.online'] }
    };

        // Internal traffic detection: enable via localhost, ?internal=1, or localStorage flag
        var internal = false;
        try {
            internal = isLocal || /[?&]internal=1(?!\d)/.test(location.search) || localStorage.getItem('ss_internal') === '1';
        } catch(_) {}

        // Expose helpers to control consent and internal flag
        window.consentAcceptAll = function() {
            try { localStorage.setItem('ss_consent', 'all'); } catch(_) {}
            gtag('consent', 'update', {
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                ad_storage: 'granted',
                analytics_storage: 'granted'
            });
        };
        window.consentAnalyticsOnly = function() {
            try { localStorage.setItem('ss_consent', 'analytics'); } catch(_) {}
            gtag('consent', 'update', {
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'granted'
            });
        };
        window.consentDenyAll = function() {
            try { localStorage.setItem('ss_consent', 'none'); } catch(_) {}
            gtag('consent', 'update', {
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                ad_storage: 'denied',
                analytics_storage: 'denied'
            });
        };
        window.setInternalTraffic = function(enabled) {
            internal = !!enabled;
            try { localStorage.setItem('ss_internal', enabled ? '1' : '0'); } catch(_) {}
        };

        // Default params for events
        function buildDefaultParams(extra) {
            var params = {
                page_title: document.title,
                page_location: location.href,
                page_path: location.pathname + location.search
            };
            if (internal) params.traffic_type = 'internal';
            for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) params[k] = extra[k];
            return params;
        }

        // Public helper to send events with defaults
        window.gaTrack = function(name, params) {
            gtag('event', name, buildDefaultParams(params || {}));
        };

        // Configure without auto page_view; we'll send it manually with defaults
        config.send_page_view = false;
        gtag('config', MEASUREMENT_ID, config);

        // Send initial page_view
        window.gaTrack('page_view', {});

        // Outbound link tracking (capture-phase to catch early)
        document.addEventListener('click', function(e) {
            var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
            if (!a) return;
            var url;
            try { url = new URL(a.href, location.href); } catch(_) { return; }
            if (url.hostname && url.hostname !== location.hostname) {
                // Outbound
                gtag('event', 'click', buildDefaultParams({
                    link_url: url.href,
                    outbound: true,
                    transport_type: 'beacon'
                }));
            }
        }, true);
})();
