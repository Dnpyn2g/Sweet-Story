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

    const closeButton = document.createElement('button');
    closeButton.id = 'popup-close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '14px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '30px';
    closeButton.style.height = '30px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    closeButton.disabled = true;
    closeButton.textContent = '×';

    const timerText = document.createElement('p');
    let countdown = 10;
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
        // (Скрипт рекламы - оставил неизменным)
    `;

    adBlock.appendChild(adMessage);
    adBlock.appendChild(adScript);

    popup.appendChild(closeButton);
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
                closeButton.disabled = false;
                closeButton.textContent = '×';
                adBlock.addEventListener('click', () => {
                    alert('Спасибо за поддержку нашего проекта!');
                });
            }
        }, 1000);
    }, 3000);

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
    });

    popupOverlay.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Добавление мобильных стилей через media-запросы
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        @media (max-width: 768px) {
            #popup {
                width: 90%;
                padding: 15px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            #popup p {
                font-size: 14px;
            }

            #popup-close {
                width: 25px;
                height: 25px;
                font-size: 12px;
            }

            #bn_584225ff74 {
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(styleTag);
});
