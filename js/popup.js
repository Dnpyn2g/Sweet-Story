document.addEventListener('DOMContentLoaded', () => {
    // Создание затемнённого фона
    const popupOverlay = document.createElement('div');
    popupOverlay.id = 'popup-overlay';
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Создание контейнера всплывающего окна
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 25px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        border-radius: 15px;
        text-align: center;
        display: none;
        max-width: 400px;
        width: 90%;
        box-sizing: border-box;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Текст таймера
    const timerText = document.createElement('p');
    timerText.style.cssText = `
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
    `;
    let countdown = 5;
    timerText.textContent = `Подождите ${countdown} секунд...`;

    // Текст всплывающего окна
    const popupText = document.createElement('p');
    popupText.style.cssText = `
        font-size: 16px;
        color: #444;
        margin-bottom: 20px;
    `;
    popupText.textContent = 'Для продолжения бесплатного чтения истории, нажмите на рекламу ниже. Это поддержит наш проект!';

    // Блок рекламы
    const adBlock = document.createElement('div');
    adBlock.id = 'bn_584225ff74';
    adBlock.style.cssText = `
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #f9f9f9;
        cursor: pointer;
        transition: transform 0.3s;
    `;
    adBlock.addEventListener('mouseover', () => {
        adBlock.style.transform = 'scale(1.05)';
    });
    adBlock.addEventListener('mouseout', () => {
        adBlock.style.transform = 'scale(1)';
    });

    // Сообщение в блоке рекламы
    const adMessage = document.createElement('p');
    adMessage.style.cssText = `
        font-size: 14px;
        color: #555;
        margin: 0;
    `;
    adMessage.textContent = 'Кликните здесь, чтобы продолжить';

    // Добавление скрипта для рекламы (без изменений)
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

    // Собираем рекламный блок
    adBlock.appendChild(adMessage);
    adBlock.appendChild(adScript);

    // Собираем все элементы всплывающего окна
    popup.appendChild(timerText);
    popup.appendChild(popupText);
    popup.appendChild(adBlock);

    // Добавляем элементы в документ
    document.body.appendChild(popupOverlay);
    document.body.appendChild(popup);

    // Функция для плавного скрытия всплывающего окна
    const hidePopup = () => {
        popup.style.opacity = '0';
        popupOverlay.style.opacity = '0';
        setTimeout(() => {
            popup.style.display = 'none';
            popupOverlay.style.display = 'none';
        }, 300);
    };

    // Показ всплывающего окна с плавным появлением
    setTimeout(() => {
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
                hidePopup();
            }
        }, 1000);
    }, 3000);

    // Дополнительные адаптивные стили
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        /* Стили для всплывающего окна и текста */
        #popup p {
            margin: 10px 0;
        }

        /* Стили для устройств с шириной экрана до 768px */
        @media (max-width: 768px) {
            #popup {
                padding: 15px;
            }
            #popup p {
                font-size: 14px;
            }
            #bn_584225ff74 {
                padding: 12px;
            }
        }

        /* Стили для устройств с шириной экрана до 480px */
        @media (max-width: 480px) {
            #popup {
                padding: 10px;
            }
            #popup p {
                font-size: 13px;
            }
            #bn_584225ff74 {
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(styleTag);
});
