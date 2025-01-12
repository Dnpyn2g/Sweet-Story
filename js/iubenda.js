var _iub = _iub || [];
_iub.csConfiguration = {
    "siteId": 3892806,
    "cookiePolicyId": 29992816,
    "lang": "en",
    "storage": { "useSiteId": true }
};

// Загрузка необходимых скриптов
(function loadIubendaScripts() {
    var scripts = [
        "https://cs.iubenda.com/autoblocking/3892806.js",
        "//cdn.iubenda.com/cs/tcf/stub-v2.js",
        "//cdn.iubenda.com/cs/tcf/safe-tcf-v2.js",
        "//cdn.iubenda.com/cs/iubenda_cs.js"
    ];

    scripts.forEach(function (src) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.charset = "UTF-8";
        script.async = true;
        document.head.appendChild(script);
    });
})();
