// Улучшенное SEO для динамически загружаемых историй
(function() {
    function updateSEO(story) {
        // Очистить существующие мета-теги
        const oldMetaTags = document.head.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:card"]');
        oldMetaTags.forEach(tag => tag.remove());

        // Добавление новых мета-тегов
        const metaTags = [
            { name: "description", content: story.description },
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

    // Пример использования для загрузки истории
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

    // Пример: Загрузка истории с ID "1"
    document.addEventListener('DOMContentLoaded', () => {
        loadStory(1); // Замените "1" на реальный ID истории
    });
})();
