// MGID Analytics and Monitoring
// Система мониторинга и аналитики для MGID виджетов

class MGIDAnalytics {
    constructor() {
        this.widgets = new Map();
        this.metrics = {
            loaded: 0,
            errors: 0,
            loadTimes: [],
            impressions: 0
        };
        this.init();
    }

    init() {
        // Отслеживаем успешную загрузку MGID скрипта
        const mgidScript = document.querySelector('script[src*="mgid.com"]');
        if (mgidScript) {
            mgidScript.addEventListener('load', () => {
                console.log('✅ MGID script loaded successfully');
                this.trackEvent('script_loaded');
            });
            
            mgidScript.addEventListener('error', () => {
                console.error('❌ MGID script failed to load');
                this.metrics.errors++;
                this.trackEvent('script_error');
            });
        }

        // Мониторинг производительности
        this.monitorPerformance();
        
        // Периодическая отправка метрик
        setInterval(() => this.sendMetrics(), 60000); // каждую минуту
    }

    trackWidget(containerId, title, startTime) {
        const loadTime = Date.now() - startTime;
        
        this.widgets.set(containerId, {
            title,
            loadTime,
            timestamp: new Date().toISOString(),
            visible: this.isElementVisible(document.getElementById(containerId))
        });

        this.metrics.loaded++;
        this.metrics.loadTimes.push(loadTime);
        
        console.log(`📊 MGID Widget tracked: ${containerId} (${loadTime}ms)`);
        this.trackEvent('widget_loaded', { containerId, title, loadTime });
    }

    trackError(containerId, error) {
        this.metrics.errors++;
        console.error(`❌ MGID Widget error: ${containerId}`, error);
        this.trackEvent('widget_error', { containerId, error: error.message });
    }

    isElementVisible(element) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
    }

    monitorPerformance() {
        // Мониторинг Core Web Vitals
        if ('web-vital' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('lcp', { value: lastEntry.startTime });
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((entryList) => {
                const firstInput = entryList.getEntries()[0];
                this.trackEvent('fid', { value: firstInput.processingStart - firstInput.startTime });
            }).observe({ entryTypes: ['first-input'] });
        }

        // Отслеживаем общее время загрузки страницы
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.trackEvent('page_load', { value: loadTime });
        });
    }

    trackEvent(eventName, data = {}) {
        // Отправляем события в Google Analytics (если подключен)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'MGID',
                ...data
            });
        }

        // Отправляем события в кастомную аналитику
        this.sendToCustomAnalytics(eventName, data);
    }

    sendToCustomAnalytics(event, data) {
        // Можно интегрировать с любой системой аналитики
        const payload = {
            event,
            data,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.getMetricsSummary()
        };

        // Сохраняем локально для отладки
        console.log('📈 Analytics Event:', payload);
        
        // Здесь можно добавить отправку на сервер аналитики
        // fetch('/analytics', { method: 'POST', body: JSON.stringify(payload) });
    }

    getMetricsSummary() {
        const avgLoadTime = this.metrics.loadTimes.length > 0 
            ? this.metrics.loadTimes.reduce((a, b) => a + b, 0) / this.metrics.loadTimes.length 
            : 0;

        return {
            widgets_loaded: this.metrics.loaded,
            errors: this.metrics.errors,
            avg_load_time: Math.round(avgLoadTime),
            total_widgets: this.widgets.size
        };
    }

    sendMetrics() {
        const summary = this.getMetricsSummary();
        this.trackEvent('metrics_summary', summary);
        
        // Сброс счетчиков для следующего периода
        this.metrics.loadTimes = [];
    }

    // Публичные методы для использования в MGID классе
    startWidgetLoad(containerId) {
        return Date.now();
    }

    finishWidgetLoad(containerId, title, startTime) {
        this.trackWidget(containerId, title, startTime);
    }

    reportWidgetError(containerId, error) {
        this.trackError(containerId, error);
    }

    // Генерация отчета
    generateReport() {
        const report = {
            summary: this.getMetricsSummary(),
            widgets: Array.from(this.widgets.entries()).map(([id, data]) => ({ id, ...data })),
            timestamp: new Date().toISOString()
        };

        console.log('📋 MGID Report:', report);
        return report;
    }

    // Экспорт данных для анализа
    exportData() {
        const data = {
            metrics: this.metrics,
            widgets: Object.fromEntries(this.widgets),
            performance: {
                navigation: performance.getEntriesByType('navigation')[0],
                resources: performance.getEntriesByType('resource').filter(r => r.name.includes('mgid'))
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mgid-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Инициализация системы аналитики
if (typeof window !== 'undefined') {
    window.mgidAnalytics = new MGIDAnalytics();
    
    // Добавляем методы в консоль для отладки
    window.getMGIDReport = () => window.mgidAnalytics.generateReport();
    window.exportMGIDData = () => window.mgidAnalytics.exportData();
    
    console.log('📊 MGID Analytics initialized. Use getMGIDReport() or exportMGIDData() in console.');
}
