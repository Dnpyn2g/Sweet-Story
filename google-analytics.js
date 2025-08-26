(function() {
    // Prevent double-initialization
    if (window.__GA4_INITIALIZED__) return;
    window.__GA4_INITIALIZED__ = true;

    var MEASUREMENT_ID = 'G-LMX96T4785';

    // Load gtag script once
    if (!document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js?id="]')) {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
        document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    gtag('js', new Date());

    var isLocal = ['localhost', '127.0.0.1'].indexOf(location.hostname) !== -1;
    var config = {
        debug_mode: isLocal,
        // Enable cross-domain measurement if you use multiple domains
        linker: { domains: ['sweet-story.com', 'sweetstory.pp.ua', 'sweet-story.online'] }
    };

    gtag('config', MEASUREMENT_ID, config);
})();
