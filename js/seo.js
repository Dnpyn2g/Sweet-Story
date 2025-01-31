(function() {
    function updateSEO(story) {
        // Очистка старых мета-тегов
        const oldMetaTags = document.head.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:card"], meta[name="keywords"]');
        oldMetaTags.forEach(tag => tag.remove());

        // Обновление мета-тегов
        const metaTags = [
            { name: "description", content: story.description },
            { name: "keywords", content: "Sweet Story, Свит стори, вдохновляющие истории, трогательные рассказы, короткие рассказы, семейные истории, истории о любви, мотивационные истории, жизненные уроки, вдохновение, позитивные истории, истории успеха, добрые рассказы, счастливые концовки" },
            { property: "og:title", content: story.title },
            { property: "og:description", content: story.description },
            { property: "og:image", content: story.image },
            { property: "og:image:alt", content: story.imageAlt || "Default image description" },
            { property: "og:url", content: window.location.href },
            { property: "og:type", content: "article" },
            { property: "fb:app_id", content: "YOUR_APP_ID" }, // Замените YOUR_APP_ID
            { name: "twitter:card", content: "summary_large_image" }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            Object.keys(tag).forEach(key => meta.setAttribute(key, tag[key]));
            document.head.appendChild(meta);
        });

        // Обновление тега <title>
        document.title = story.title;

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
                "name": story.author,
                "url": story.authorUrl || ""
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
    shareContainer.style.display = 'flex';
    shareContainer.style.gap = '10px';
    shareContainer.style.marginTop = '20px';

    shareContainer.innerHTML = `
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" 
           target="_blank" 
           class="share-facebook-btn"
           style="display: flex; align-items: center; gap: 5px; padding: 10px 15px; background-color: #1877f2; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
           <span class="facebook-icon" style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf09a;</span> Поделиться в Facebook
        </a>

        <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}" 
           target="_blank" 
           class="share-twitter-btn"
           style="display: flex; align-items: center; gap: 5px; padding: 10px 15px; background-color: #1DA1F2; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
           <span class="twitter-icon" style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf099;</span> Поделиться в Twitter
        </a>
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
