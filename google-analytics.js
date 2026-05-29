// google-analytics.js — single source of GA4 wiring for Sweet Story.
//
// Design choices:
//   - One Measurement ID, one preconnect (done in HTML <head>).
//   - Consent Mode v2: analytics 'granted' by default, ads 'denied'. The
//     window.consent* helpers let a future cookie banner upgrade the choice.
//   - send_page_view is disabled in gtag config so we send ONE page_view
//     ourselves with the right `content_group` and `item_id` (for stories).
//   - Outbound link clicks are auto-tracked with beacon transport.
//   - Debug mode only on localhost.

(function () {
    if (window.__GA4_INITIALIZED__) return;
    window.__GA4_INITIALIZED__ = true;

    var MEASUREMENT_ID = 'G-LMX96T4785';

    // If another snippet already configured GA for this ID, bail out so we
    // don't double-track page_views.
    try {
        if (Array.isArray(window.dataLayer)) {
            var already = window.dataLayer.some(function (cmd) {
                return Array.isArray(cmd) && cmd[0] === 'config' && cmd[1] === MEASUREMENT_ID;
            });
            if (already) return;
        }
    } catch (_) {}

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    // ---------------- Consent Mode v2 ----------------
    // Analytics is granted by default — for stricter GDPR posture, change
    // analytics_storage below to 'denied' and gate it on a cookie banner.
    gtag('consent', 'default', {
        ad_user_data:          'denied',
        ad_personalization:    'denied',
        ad_storage:            'denied',
        analytics_storage:     'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage:      'granted'
    });

    try {
        var stored = localStorage.getItem('ss_consent');
        if (stored === 'all') {
            gtag('consent', 'update', {
                ad_user_data:       'granted',
                ad_personalization: 'granted',
                ad_storage:         'granted',
                analytics_storage:  'granted'
            });
        } else if (stored === 'analytics') {
            gtag('consent', 'update', {
                ad_user_data:       'denied',
                ad_personalization: 'denied',
                ad_storage:         'denied',
                analytics_storage:  'granted'
            });
        } else if (stored === 'none') {
            gtag('consent', 'update', {
                ad_user_data:       'denied',
                ad_personalization: 'denied',
                ad_storage:         'denied',
                analytics_storage:  'denied'
            });
        }
    } catch (_) {}

    // ---------------- Load gtag.js once ----------------
    if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id="]')) {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        document.head.appendChild(s);
    }

    gtag('js', new Date());

    // ---------------- Helpers ----------------
    var isLocal = ['localhost', '127.0.0.1', ''].indexOf(location.hostname) !== -1;

    function detectContentGroup() {
        var p = location.pathname;
        if (p === '/' || p === '/index.html')         return 'home';
        if (p.indexOf('/stories/') === 0)             return 'story';
        if (p === '/story1' || p === '/story1.html' ||
            p.indexOf('/story1/') === 0)              return 'legacy_redirect';
        if (p === '/about.html')                      return 'about';
        if (p === '/contact.html')                    return 'contact';
        if (p === '/privacy.html')                    return 'privacy';
        if (p === '/404.html')                        return 'not_found';
        return 'other';
    }

    function detectStoryId() {
        // 1. Story pages have <body data-story-id="NNNN">.
        var body = document.body;
        if (body && body.dataset && body.dataset.storyId) return body.dataset.storyId;
        // 2. Legacy /story1?id=NNNN.
        try {
            var qid = new URLSearchParams(location.search).get('id');
            if (qid && /^\d+$/.test(qid)) return qid;
        } catch (_) {}
        return null;
    }

    var contentGroup = detectContentGroup();
    var storyId      = detectStoryId();

    var internal = false;
    try {
        internal = isLocal
            || /[?&]internal=1(?!\d)/.test(location.search)
            || localStorage.getItem('ss_internal') === '1';
    } catch (_) {}

    // ---------------- Consent helpers (exposed to console / future banner) ----------------
    window.consentAcceptAll = function () {
        try { localStorage.setItem('ss_consent', 'all'); } catch (_) {}
        gtag('consent', 'update', {
            ad_user_data: 'granted', ad_personalization: 'granted',
            ad_storage:   'granted', analytics_storage:  'granted'
        });
    };
    window.consentAnalyticsOnly = function () {
        try { localStorage.setItem('ss_consent', 'analytics'); } catch (_) {}
        gtag('consent', 'update', {
            ad_user_data: 'denied', ad_personalization: 'denied',
            ad_storage:   'denied', analytics_storage:  'granted'
        });
    };
    window.consentDenyAll = function () {
        try { localStorage.setItem('ss_consent', 'none'); } catch (_) {}
        gtag('consent', 'update', {
            ad_user_data: 'denied', ad_personalization: 'denied',
            ad_storage:   'denied', analytics_storage:  'denied'
        });
    };
    window.setInternalTraffic = function (enabled) {
        internal = !!enabled;
        try { localStorage.setItem('ss_internal', enabled ? '1' : '0'); } catch (_) {}
    };

    // ---------------- Default params attached to every event ----------------
    function buildDefaultParams(extra) {
        var params = {
            page_title:    document.title,
            page_location: location.href,
            page_path:     location.pathname + location.search,
            content_group: contentGroup
        };
        if (storyId)  params.item_id      = String(storyId);
        if (internal) params.traffic_type = 'internal';
        if (extra) {
            for (var k in extra) {
                if (Object.prototype.hasOwnProperty.call(extra, k)) params[k] = extra[k];
            }
        }
        return params;
    }

    // Public wrapper (replaces the early shim in HTML).
    window.gaTrack = function (name, params) {
        gtag('event', name, buildDefaultParams(params || {}));
    };

    // Flush any events that were queued before this script ran.
    try {
        if (Array.isArray(window.gaQueue)) {
            for (var i = 0; i < window.gaQueue.length; i++) {
                var args = window.gaQueue[i];
                if (args && args[0]) window.gaTrack(args[0], args[1] || {});
            }
            window.gaQueue = [];
        }
    } catch (_) {}

    // ---------------- Config + initial page_view ----------------
    gtag('config', MEASUREMENT_ID, {
        debug_mode:     isLocal,
        send_page_view: false,
        linker:         { domains: ['sweet-story.com'] }
    });

    window.gaTrack('page_view', {});

    // Stories: also emit a structured view_item so Reports → Items works.
    if (contentGroup === 'story' && storyId) {
        window.gaTrack('view_item', {
            item_id:   String(storyId),
            item_name: document.title.replace(/\s+—\s+Sweet Story$/, ''),
            item_category: 'story'
        });
    }

    // ---------------- Outbound link tracking ----------------
    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var url;
        try { url = new URL(a.href, location.href); } catch (_) { return; }
        if (url.hostname && url.hostname !== location.hostname) {
            gtag('event', 'click', buildDefaultParams({
                link_url:       url.href,
                link_domain:    url.hostname,
                link_classes:   a.className || '',
                outbound:       true,
                transport_type: 'beacon'
            }));
        }
    }, true);
})();
