// Добавление рекламного блока в определенную секцию страницы
function addAdBanner(containerId) {
    const container = document.getElementById(containerId);

    if (container) {
        const adBlock = document.createElement('ins');
        adBlock.className = "adsbygoogle";
        adBlock.style = "display:block";
        adBlock.setAttribute("data-ad-client", "ca-pub-4048193958934146");
        adBlock.setAttribute("data-ad-slot", "1234567890"); // Замените на ID вашего рекламного блока
        adBlock.setAttribute("data-ad-format", "auto");
        adBlock.setAttribute("data-full-width-responsive", "true");

        container.appendChild(adBlock);

        // Инициализация рекламного блока
        (adsbygoogle = window.adsbygoogle || []).push({});
    } else {
        console.error(`Container with ID ${containerId} not found.`);
    }
}

// Пример использования: добавление рекламы в sidebar
addAdBanner('sidebar');
