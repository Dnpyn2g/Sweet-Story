// Улучшенное SEO для динамически загружаемых историй
(function() {
    function updateSEO(story) {
        // Очистить существующие мета-теги
        const oldMetaTags = document.head.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:card"], meta[name="keywords"]');
        oldMetaTags.forEach(tag => tag.remove());

        // Добавление новых мета-тегов
        const metaTags = [
            { name: "description", content: story.description },
            { name: "keywords", content: "Sweet Story, Свит стори, вдохновляющие истории, трогательные рассказы, короткие рассказы, семейные истории, истории о любви, мотивационные истории, жизненные уроки, вдохновение, позитивные истории, истории успеха, добрые рассказы, счастливые концовки, Sweet Story Украина, Sweet Story СНГ, вдохновляющие истории Украина, трогательные рассказы СНГ, короткие рассказы о жизни, вдохновляющие рассказы для СНГ, трогательные семейные рассказы СНГ" },
            { property: "og:title", content: story.title },
            { property: "og:description", content: story.description },
            { property: "og:image", content: story.image },
            { property: "og:url", content: window.location.href },
            { name: "twitter:card", content: "summary_large_image" }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            Object.keys(tag).forEach(key => meta.setAttribute(key, tag[key]));
            document.head.appendChild(meta);
        });

        // Обновление структурированных данных JSON-LD
        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": story.title,
            "description": story.description,
            "image": story.image,
            "datePublished": story.datePublished,
            "author": {
                "@type": "Person",
                "name": story.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "Sweet Story",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://sweet-story.online/images/favicon.ico"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            }
        };

        const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (existingJsonLd) existingJsonLd.remove();

        const script = document.createElement('script');
        script.type = "application/ld+json";
        script.text = JSON.stringify(jsonLd);
        document.head.appendChild(script);
    }

    // Добавление hreflang для мультиязычности
    function addHreflangTags() {
        const hreflangTags = [
            { rel: "alternate", hreflang: "ru", href: "https://sweet-story.online/" },
            { rel: "alternate", hreflang: "uk", href: "https://sweet-story.online/uk/" },
            { rel: "alternate", hreflang: "en", href: "https://sweet-story.online/en/" }
        ];

        hreflangTags.forEach(tag => {
            const link = document.createElement('link');
            Object.keys(tag).forEach(key => link.setAttribute(key, tag[key]));
            document.head.appendChild(link);
        });
    }

    // Добавление кнопок социальных сетей
    function addSocialShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.classList.add('share-buttons');
        shareContainer.innerHTML = `
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank">Поделиться в Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}" target="_blank">Поделиться в Twitter</a>
        `;
        document.body.appendChild(shareContainer);
    }

    // Подключение функций
    document.addEventListener('DOMContentLoaded', () => {
        addHreflangTags();
        addSocialShareButtons();
        loadStory(1); // Замените "1" на реальный ID истории
    });

    function loadStory(storyId) {
        fetch(`/api/stories/${storyId}`) // Пример API для получения данных истории
            .then(response => response.json())
            .then(story => {
                // Обновить содержимое страницы
                document.getElementById('story-title-main').textContent = story.title;
                document.getElementById('story-image').src = story.image;
                document.getElementById('story-content').textContent = story.content;

                // Обновить SEO
                updateSEO(story);
            })
            .catch(err => console.error('Ошибка загрузки истории:', err));
    }
})();