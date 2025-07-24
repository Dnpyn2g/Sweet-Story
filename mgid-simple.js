// MGID Integration - Simple and Clean
// Простая и элегантная интеграция MGID виджетов
// Site ID: 1042649, Widget ID: 1828354

class SimpleMGID {
    constructor() {
        this.scriptLoaded = false;
        this.loadScript();
    }

    // Загружаем скрипт MGID один раз (согласно инструкции MGID)
    async loadScript() {
        if (this.scriptLoaded) return;
        
        try {
            const script = document.createElement('script');
            script.src = 'https://jsc.mgid.com/site/1042649.js'; // Используем Site ID из инструкции MGID
            script.async = true;
            script.onload = () => {
                console.log('MGID script loaded successfully');
                this.scriptLoaded = true;
            };
            script.onerror = () => {
                console.error('MGID script failed to load');
            };
            document.head.appendChild(script);
        } catch (error) {
            console.warn('MGID script loading failed:', error);
        }
    }

    // Создает виджет с красивым контейнером (код точно по инструкции MGID)
    createWidget(containerId, title = 'Рекомендуем прочитать') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`MGID container not found: ${containerId}`);
            return;
        }

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
            try {
                const newScript = document.createElement('script');
                newScript.textContent = script.textContent;
                document.body.appendChild(newScript);
                console.log(`MGID widget created: ${containerId}`);
            } catch (error) {
                console.error(`Failed to initialize MGID widget ${containerId}:`, error);
            }
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
