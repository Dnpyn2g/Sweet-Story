'use strict';

function loadAd(adId, loadType) {
    (function (C, b, m, r) {
        function t() {
            b.removeEventListener("scroll", t);
            f();
        }
        function u() {
            p = new IntersectionObserver(
                (a) => {
                    a.forEach((n) => {
                        n.isIntersecting && (p.unobserve(n.target), f());
                    });
                },
                { root: null, rootMargin: "400px 200px", threshold: 0 }
            );
            p.observe(e);
        }
        function f() {
            (e = e || b.getElementById("bn_" + m)) ?
                ((e.innerHTML = ""),
                    (e.id = "bn_" + v),
                    (q = { act: "init", id: m, rnd: v, ms: w }),
                    (d = b.getElementById("rcMain")) ? c = d.contentWindow : D(),
                    c.rcMain ? c.postMessage(q, x) : c.rcBuf.push(q)) :
                g("!bn");
        }
        function E(a, n, F, y) {
            function z() {
                var h = n.createElement("script");
                h.type = "text/javascript";
                h.src = a;
                h.onerror = function () {
                    k++;
                    5 > k ? setTimeout(z, 10) : g(k + "!" + a);
                };
                h.onload = function () {
                    y && y();
                    k && g(k + "!" + a);
                };
                F.appendChild(h);
            }
            var k = 0;
            z();
        }
        function D() {
            try {
                (d = b.createElement("iframe")),
                    d.style.setProperty("display", "none", "important"),
                    (d.id = "rcMain"),
                    b.body.insertBefore(d, b.body.children[0]),
                    (c = d.contentWindow),
                    (l = c.document),
                    l.open(),
                    l.close(),
                    (A = l.body),
                    Object.defineProperty(c, "rcBuf", {
                        enumerable: !1,
                        configurable: !1,
                        writable: !1,
                        value: [],
                    }),
                    E("https://go.rcvlink.com/static/main.js", l, A, function () {
                        for (var a; c.rcBuf && (a = c.rcBuf.shift()); ) c.postMessage(a, x);
                    });
            } catch (a) {
                B(a);
            }
        }
        function B(a) {
            g(a.name + ": " + a.message + "\t" + (a.stack ? a.stack.replace(a.name + ": " + a.message, "") : ""));
        }
        function g(a) {
            console.error(a);
            new Image().src =
                "https://go.rcvlinks.com/err/?code=" +
                m +
                "&ms=" +
                ((new Date()).getTime() - w) +
                "&ver=" +
                G +
                "&text=" +
                encodeURIComponent(a);
        }
        try {
            var G = "231101-0007",
                x = location.origin || location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : ""),
                e = b.getElementById("bn_" + m),
                v = Math.random().toString(36).substring(2, 15),
                w = new Date().getTime(),
                p,
                H = !("IntersectionObserver" in C),
                q,
                d,
                c,
                l,
                A;
            e
                ? "scroll" == r
                    ? b.addEventListener("scroll", t)
                    : "lazy" == r
                        ? H
                            ? f()
                            : "loading" == b.readyState
                                ? b.addEventListener("DOMContentLoaded", u)
                                : u()
                        : f()
                : "loading" == b.readyState
                    ? b.addEventListener("DOMContentLoaded", f)
                    : g("!bn");
        } catch (a) {
            B(a);
        }
    })(window, document, adId, loadType);
}

// Инициализация рекламы
document.addEventListener('DOMContentLoaded', function () {
    loadAd("eaf43435f1", "lazy");
    loadAd("cb9ef61927", "lazy");
});
