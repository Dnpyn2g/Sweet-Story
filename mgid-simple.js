
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

    // Создает виджет с красивым контейнером и дополнительными возможностями
    createWidget(containerId, title = 'Рекомендуем прочитать', style = 'default') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`MGID container not found: ${containerId}`);
            return;
        }

        // Начинаем отслеживание времени загрузки
        const startTime = window.mgidAnalytics ? window.mgidAnalytics.startWidgetLoad(containerId) : Date.now();

        // Разные стили для разных типов виджетов
        const styleClass = style === 'compact' ? 'mgid-compact' : 'mgid-default';
        const titleIcon = this.getTitleIcon(title);

        container.innerHTML = `
            <div class="mgid-container ${styleClass}">
                <div class="mgid-header">
                    <span class="mgid-icon">${titleIcon}</span>
                    <span class="mgid-title">${title}</span>
                </div>
                <div class="mgid-content">
                    <div data-type="_mgwidget" data-widget-id="1828363"></div>
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
                console.log(`MGID widget created: ${containerId} with title: ${title}`);
                
                // Отслеживаем успешную загрузку виджета
                if (window.mgidAnalytics) {
                    window.mgidAnalytics.finishWidgetLoad(containerId, title, startTime);
                }
            } catch (error) {
                console.error(`Failed to initialize MGID widget ${containerId}:`, error);
                
                // Отслеживаем ошибку загрузки виджета
                if (window.mgidAnalytics) {
                    window.mgidAnalytics.reportWidgetError(containerId, error);
                }
            }
        }
    }

    // Получить иконку для заголовка виджета
    getTitleIcon(title) {
        if (title.includes('Интересн')) return '🔥';
        if (title.includes('Похожие')) return '📖';
        if (title.includes('Рекомендуем')) return '⭐';
        if (title.includes('По теме')) return '💡';
        if (title.includes('Читайте')) return '📰';
        return '📰';
    }

    // Создает компактный виджет для боковой панели
    createCompactWidget(containerId, title = 'Читайте также') {
        this.createWidget(containerId, title, 'compact');
    }

    // Создает виджет с задержкой для ленивой загрузки
    createWidgetLazy(containerId, title = 'Рекомендуем прочитать', delay = 1000, style = 'default') {
        setTimeout(() => {
            this.createWidget(containerId, title, style);
        }, delay);
    }

    // Создает виджет с проверкой видимости элемента
    createWidgetOnVisible(containerId, title = 'Рекомендуем прочитать', style = 'default') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.createWidget(containerId, title, style);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const container = document.getElementById(containerId);
        if (container) {
            observer.observe(container);
        }
    }
}

// Инициализируем глобально
window.mgid = new SimpleMGID();
