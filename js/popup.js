document.addEventListener('DOMContentLoaded', () => {
    const popup = document.createElement('div');
    const popupOverlay = document.createElement('div');

    popupOverlay.id = 'popup-overlay';
    popupOverlay.style.position = 'fixed';
    popupOverlay.style.top = '0';
    popupOverlay.style.left = '0';
    popupOverlay.style.width = '100%';
    popupOverlay.style.height = '100%';
    popupOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
    popupOverlay.style.zIndex = '1000';
    popupOverlay.style.display = 'none';

    popup.id = 'popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = 'white';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '1001';
    popup.style.borderRadius = '10px';
    popup.style.textAlign = 'center';
    popup.style.display = 'none';

    const closeButton = document.createElement('button');
    closeButton.id = 'popup-close';
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';

    const popupText = document.createElement('p');
    popupText.textContent = 'Привет, добавь сайт в закладки!';

    popup.appendChild(closeButton);
    popup.appendChild(popupText);
    document.body.appendChild(popupOverlay);
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.display = 'block';
        popupOverlay.style.display = 'block';
    }, 3000);

    const closePopup = () => {
        popup.style.display = 'none';
        popupOverlay.style.display = 'none';
    };

    closeButton.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', closePopup);
});
