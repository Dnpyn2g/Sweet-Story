// MGID Integration - Simple and Clean
// Простая и элегантная интеграция MGID виджетов

class SimpleMGID {
    constructor() {
        this.scriptLoaded = false;
        this.loadScript();
    }

    // Загружаем скрипт MGID один раз
    async loadScript() {
        if (this.scriptLoaded) return;
        
        try {
            const script = document.createElement('script');
            script.src = 'https://jsc.mgid.com/site/929581.js'; // ИСПРАВЛЕНО: используем правильный Site ID
            script.async = true;
            document.head.appendChild(script);
            this.scriptLoaded = true;
        } catch (error) {
            console.warn('MGID script loading failed:', error);
        }
    }

    // Создает виджет с красивым контейнером
    createWidget(containerId, title = 'Рекомендуем прочитать') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="mgid-container">
                <div class="mgid-header">
                    <span class="mgid-title">${title}</span>
                </div>
                <div class="mgid-content">
                    <div data-type="_mgwidget" data-widget-id="1828354"></div>
                    <script>(function(w,q){w[q]=w[q]||[];w[q].push(["_mgc.load"])})(window,"_mgq");</script>
                </div>
            </div>
        `;

        // Выполняем скрипт инициализации
        const script = container.querySelector('script');
        if (script) {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
        }
    }

    // Создает виджет с задержкой для ленивой загрузки
    createWidgetLazy(containerId, title = 'Рекомендуем прочитать', delay = 1000) {
        setTimeout(() => {
            this.createWidget(containerId, title);
        }, delay);
    }
}

// Инициализируем глобально
window.mgid = new SimpleMGID();
