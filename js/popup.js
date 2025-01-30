document.addEventListener('DOMContentLoaded', () => {
    const popup = document.createElement('div');
    const popupOverlay = document.createElement('div');

    // Стили для оверлея
    popupOverlay.id = 'popup-overlay';
    Object.assign(popupOverlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: '1000',
        display: 'none',
        opacity: '0',
        transition: 'opacity 0.4s ease-in-out',
    });

    // Стили для попапа
    popup.id = 'popup';
    Object.assign(popup.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '20px',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
        zIndex: '1001',
        borderRadius: '12px',
        textAlign: 'center',
        display: 'none',
        maxWidth: '400px',
        width: '90%',
        opacity: '0',
        transition: 'opacity 0.4s ease-in-out',
    });

    const timerText = document.createElement('p');
    let countdown = 5;
    Object.assign(timerText.style, {
        fontSize: '18px',
        color: '#333',
        marginBottom: '15px',
        fontWeight: 'bold',
    });
    timerText.textContent = `Подождите ${countdown} секунд...`;

    const popupText = document.createElement('p');
    Object.assign(popupText.style, {
        fontSize: '16px',
        color: '#444',
        marginBottom: '15px',
    });
    popupText.textContent = 'Для продолжения бесплатного чтения истории, нажмите на рекламу ниже. Это поддержит наш проект!';

    // Блок рекламы с вашим скриптом
    const adContainer = document.createElement('div');
    adContainer.innerHTML = `
        <div id="bn_584225ff74"></div>
        <script>
        'use strict';
        (function(C,b,m,r){
            function t(){b.removeEventListener("scroll",t);f()}
            function u(){p=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(p.unobserve(n.target),f())})},{root:null,rootMargin:"400px 200px",threshold:0});p.observe(e)}
            function f(){(e=e||b.getElementById("bn_"+m))?(e.innerHTML="",e.id="bn_"+v,q={act:"init",id:m,rnd:v,ms:w},(d=b.getElementById("rcMain"))?c=d.contentWindow:D(),c.rcMain?c.postMessage(q,x):c.rcBuf.push(q)):g("!bn")}
            function E(a,n,F,y){function z(){var h=n.createElement("script");h.type="text/javascript";h.src=a;h.onerror=function(){k++;5>k?setTimeout(z,10):g(k+"!"+a)};h.onload=function(){y&&y();k&&g(k+"!"+a)};F.appendChild(h)}var k=0;z()}
            function D(){try{d=b.createElement("iframe"),d.style.setProperty("display","none","important"),d.id="rcMain",b.body.insertBefore(d,b.body.children[0]),c=d.contentWindow,l=c.document,l.open(),l.close(),A=l.body,Object.defineProperty(c,"rcBuf",{enumerable:!1,configurable:!1,writable:!1,value:[]}),E("https://go.rcvlink.com/static/main.js",
            l,A,function(){for(var a;c.rcBuf&&(a=c.rcBuf.shift());)c.postMessage(a,x)})}catch(a){B(a)}}function B(a){g(a.name+": "+a.message+"\t"+(a.stack?a.stack.replace(a.name+": "+a.message,""):""))}function g(a){console.error(a);(new Image).src="https://go.rcvlinks.com/err/?code="+m+"&ms="+((new Date).getTime()-w)+"&ver="+G+"&text="+encodeURIComponent(a)}try{var G="231101-0007",x=location.origin||location.protocol+"//"+location.hostname+(location.port?":"+location.port:""),e=b.getElementById("bn_"+m),v=Math.random().toString(36).substring(2,
            15),w=(new Date).getTime(),p,H=!("IntersectionObserver"in C),q,d,c,l,A;e?"scroll"==r?b.addEventListener("scroll",t):"lazy"==r?H?f():"loading"==b.readyState?b.addEventListener("DOMContentLoaded",u):u():f():"loading"==b.readyState?b.addEventListener("DOMContentLoaded",f):g("!bn")}catch(a){B(a)}
        })(window, document, "584225ff74", "{LOADTYPE}");
        </script>
    `;

    popup.appendChild(timerText);
    popup.appendChild(popupText);
    popup.appendChild(adContainer);
    document.body.appendChild(popupOverlay);
    document.body.appendChild(popup);

    setTimeout(() => {
        // Показать попап с анимацией
        popup.style.display = 'block';
        popupOverlay.style.display = 'block';
        setTimeout(() => {
            popup.style.opacity = '1';
            popupOverlay.style.opacity = '1';
        }, 50);

        const interval = setInterval(() => {
            countdown -= 1;
            timerText.textContent = `Подождите ${countdown} секунд...`;

            if (countdown <= 0) {
                clearInterval(interval);

                // Закрыть попап через 5 секунд
                popup.style.opacity = '0';
                popupOverlay.style.opacity = '0';
                setTimeout(() => {
                    popup.style.display = 'none';
                    popupOverlay.style.display = 'none';
                }, 400);
            }
        }, 1000);
    }, 3000);

    popupOverlay.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Добавление стилей для мобильных устройств
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @media (max-width: 768px) {
            #popup {
                padding: 15px;
            }

            #popup p {
                font-size: 14px;
            }

            #bn_584225ff74 {
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(styleTag);
});
