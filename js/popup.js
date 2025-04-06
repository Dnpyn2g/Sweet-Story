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

    // Создаём адаптивный AMP-блок рекламы
    const ampAdBlock = document.createElement('div');
    ampAdBlock.id = 'amp-ad-block';
    ampAdBlock.style.padding = '15px';
    ampAdBlock.style.border = '1px solid #ccc';
    ampAdBlock.style.borderRadius = '10px';
    ampAdBlock.style.backgroundColor = '#f9f9f9';
    ampAdBlock.style.cursor = 'pointer';
    ampAdBlock.style.transition = 'transform 0.3s';
    ampAdBlock.innerHTML = `<amp-embed height="350"
        type="recreativ"
        layout="fixed-height"
        data-bn="923b72c7cf">
    </amp-embed>`;

    ampAdBlock.addEventListener('mouseover', () => {
        ampAdBlock.style.transform = 'scale(1.05)';
    });
    ampAdBlock.addEventListener('mouseout', () => {
        ampAdBlock.style.transform = 'scale(1)';
    });

    popup.appendChild(timerText);
    popup.appendChild(popupText);
    popup.appendChild(ampAdBlock);
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
            #amp-ad-block {
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(styleTag);
});
