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

    // Блок рекламы
    const adBlock = document.createElement('div');
    adBlock.id = 'bn_584225ff74';
    Object.assign(adBlock.style, {
        padding: '15px',
        border: '2px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f1f1f1',
        cursor: 'pointer',
        transition: 'transform 0.3s, box-shadow 0.3s',
        textAlign: 'center',
    });

    adBlock.addEventListener('mouseover', () => {
        adBlock.style.transform = 'scale(1.05)';
        adBlock.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });

    adBlock.addEventListener('mouseout', () => {
        adBlock.style.transform = 'scale(1)';
        adBlock.style.boxShadow = 'none';
    });

    const adMessage = document.createElement('p');
    Object.assign(adMessage.style, {
        fontSize: '14px',
        color: '#555',
        margin: '0',
    });
    adMessage.textContent = 'Кликните здесь, чтобы продолжить';

    const adScript = document.createElement('script');
    adScript.type = 'text/javascript';
    adScript.textContent = `
        (function(C, b, m, r) {
            function f() {
                e.innerHTML = '<iframe src="https://example-ad-url.com" width="100%" height="150px" frameborder="0"></iframe>';
            }
            var e = b.getElementById("bn_" + m);
            b.addEventListener('DOMContentLoaded', f);
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

                // Автоматическое закрытие после 5 секунд
                setTimeout(() => {
                    popup.style.opacity = '0';
                    popupOverlay.style.opacity = '0';
                    setTimeout(() => {
                        popup.style.display = 'none';
                        popupOverlay.style.display = 'none';
                    }, 400);
                }, 5000);
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
