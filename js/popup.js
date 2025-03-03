document.addEventListener('DOMContentLoaded', () => {
    const popup = document.createElement('div');
    const popupOverlay = document.createElement('div');

    popupOverlay.id = 'popup-overlay';
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100%';
    popupOverlay.style.height = '100%';
    popupOverlay.style.background = 'rgba(0, 0, 0, 0.6)';
    popupOverlay.style.zIndex = '1000';
    popupOverlay.style.display = 'none';

    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'white';
    popup.style.padding = '25px';
    popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1001';
    popup.style.borderRadius = '15px';
    popup.style.textAlign = 'center';
    popup.style.display = 'none';
    popup.style.maxWidth = '400px';

    const timerText = document.createElement('p');
    let countdown = 5;
    timerText.style.fontSize = '18px';
    timerText.style.color = '#333';
    timerText.style.marginBottom = '10px';
    timerText.textContent = `Подождите ${countdown} секунд...`;

    const popupText = document.createElement('p');
    popupText.style.fontSize = '16px';
    popupText.style.color = '#444';
    popupText.style.marginBottom = '20px';
    popupText.textContent = 'Для продолжения бесплатного чтения истории, нажмите на рекламу ниже. Это поддержит наш проект!';

    const adBlock = document.createElement('div');
    adBlock.id = 'bn_584225ff74';
    adBlock.style.padding = '15px';
    adBlock.style.border = '1px solid #ccc';
    adBlock.style.borderRadius = '10px';
    adBlock.style.backgroundColor = '#f9f9f9';
    adBlock.style.cursor = 'pointer';
    adBlock.style.transition = 'transform 0.3s';

    adBlock.addEventListener('mouseover', () => {
        adBlock.style.transform = 'scale(1.05)';
    });
    adBlock.addEventListener('mouseout', () => {
        adBlock.style.transform = 'scale(1)';
    });

    const adMessage = document.createElement('p');
    adMessage.style.fontSize = '14px';
    adMessage.style.color = '#555';
    adMessage.style.margin = '0';
    adMessage.textContent = 'Кликните здесь, чтобы продолжить';

    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.textContent = `
        'use strict';
        (function(C,b,m,r){
            function t(){b.removeEventListener("scroll",t);f()}
            function u(){p=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(p.unobserve(n.target),f())})},{root:null,rootMargin:"400px 200px",threshold:0});p.observe(e)}
            function f(){(e=e||b.getElementById("bn_"+m))?(e.innerHTML="",e.id="bn_"+v,q={act:"init",id:m,rnd:v,ms:w},(d=b.getElementById("rcMain"))?c=d.contentWindow:D(),c.rcMain?c.postMessage(q,x):c.rcBuf.push(q)):g("!bn")}
            function E(a,n,F,y){function z(){var h=n.createElement("script");h.type="text/javascript";h.src=a;h.onerror=function(){k++;5>k?setTimeout(z,10):g(k+"!"+a)};h.onload=function(){y&&y();k&&g(k+"!"+a)};F.appendChild(h)}var k=0;z()}
            function D(){
                try{
                    d=b.createElement("iframe");
                    d.style.setProperty("display","none","important");
                    d.id="rcMain";
                    b.body.insertBefore(d,b.body.children[0]);
                    c=d.contentWindow;
                    l=c.document;
                    l.open();
                    l.close();
                    A=l.body;
                    Object.defineProperty(c,"rcBuf",{enumerable:!1,configurable:!1,writable:!1,value:[]});
                    E("https://go.rcvlink.com/static/main.js",l,A,function(){
                        for(var a;c.rcBuf&&(a=c.rcBuf.shift());) c.postMessage(a,x)
                    })
                }catch(a){B(a)}
            }
            function B(a){
                g(a.name+": "+a.message+"\\t"+(a.stack?a.stack.replace(a.name+": "+a.message,""):""))
            }
            function g(a){
                console.error(a);
                (new Image).src="https://go.rcvlinks.com/err/?code="+m+"&ms="+((new Date).getTime()-w)+"&ver="+G+"&text="+encodeURIComponent(a)
            }
            try{
                var G="231101-0007",
                    x=location.origin||location.protocol+"//"+location.hostname+(location.port?":"+location.port:""),
                    e=b.getElementById("bn_"+m),
                    v=Math.random().toString(36).substring(2,15),
                    w=(new Date).getTime(),
                    p,H=!("IntersectionObserver"in C),q,d,c,l,A;
                e?"scroll"==r?b.addEventListener("scroll",t):"lazy"==r?H?f():"loading"==b.readyState?b.addEventListener("DOMContentLoaded",u):u():f()
                    :"loading"==b.readyState?b.addEventListener("DOMContentLoaded",f):g("!bn")
            }catch(a){B(a)}
        })(window, document, "584225ff74", "{LOADTYPE}");
    `;

    adBlock.appendChild(adMessage);
    adBlock.appendChild(adScript);

    popup.appendChild(timerText);
    popup.appendChild(popupText);
    popup.appendChild(adBlock);
    document.body.appendChild(popupOverlay);
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.display = 'block';
        popupOverlay.style.display = 'block';

        const interval = setInterval(() => {
            countdown -= 1;
            timerText.textContent = `Подождите ${countdown} секунд...`;

            if (countdown <= 0) {
                clearInterval(interval);
                popup.style.display = 'none';
                popupOverlay.style.display = 'none';
            }
        }, 1000);
    }, 3000);

    // Добавление стилей для мобильных устройств
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @media (max-width: 768px) {
            #popup {
                padding: 15px;
                max-width: 90%;
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
