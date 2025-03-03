(function() {
    function updateSEO(story) {
        // Очистка старых мета-тегов
        const oldMetaTags = document.head.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:card"], meta[name="keywords"]');
        oldMetaTags.forEach(tag => tag.remove());

        // Обновление мета-тегов для СНГ
        const metaTags = [
            { name: "description", content: story.description },
            { name: "keywords", content: "Свит стори, вдохновляющие истории, трогательные рассказы, семейные истории, мотивационные истории из СНГ, уроки жизни, вдохновение, позитивные истории, Россия, Украина, Казахстан" },
            { property: "og:title", content: story.title },
            { property: "og:description", content: story.description },
            { property: "og:image", content: story.image },
            { property: "og:image:alt", content: story.imageAlt || "Трогательная история из СНГ" },
            { property: "og:url", content: window.location.href },
            { property: "og:type", content: "article" },
            { property: "og:locale", content: "ru_RU" },  // Установлена локаль СНГ
            { property: "fb:app_id", content: "61571370822088" },  // Замените YOUR_APP_ID
            { name: "twitter:card", content: "summary_large_image" }
        ];

        metaTags.forEach(tag => {
            const meta = document.createElement('meta');
            Object.keys(tag).forEach(key => meta.setAttribute(key, tag[key]));
            document.head.appendChild(meta);
        });

        // Обновление тега <title>
        document.title = story.title;

        // Обновление структурированных данных JSON-LD с учетом СНГ
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
            },
            "inLanguage": "ru"
        };

        const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
        if (existingJsonLd) existingJsonLd.remove();

        const script = document.createElement('script');
        script.type = "application/ld+json";
        script.text = JSON.stringify(jsonLd);
        document.head.appendChild(script);
    }

    // Обновление hreflang для СНГ
    function addHreflangTags() {
        const hreflangTags = [
            { rel: "alternate", hreflang: "ru-RU", href: "https://sweet-story.online/" },
            { rel: "alternate", hreflang: "uk-UA", href: "https://sweet-story.online/uk/" },
            { rel: "alternate", hreflang: "kk-KZ", href: "https://sweet-story.online/kz/" }
        ];

        hreflangTags.forEach(tag => {
            const link = document.createElement('link');
            Object.keys(tag).forEach(key => link.setAttribute(key, tag[key]));
            document.head.appendChild(link);
        });
    }

    // Добавление кнопок социальных сетей (оставил только ВКонтакте и Одноклассники)
    function addSocialShareButtons() {
        const shareContainer = document.createElement('div');
        shareContainer.classList.add('share-buttons');
        shareContainer.style.display = 'flex';
        shareContainer.style.gap = '10px';
        shareContainer.style.marginTop = '20px';

        shareContainer.innerHTML = `
            <a href="https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}"
               target="_blank"
               class="share-vk-btn"
               style="display: flex; align-items: center; gap: 5px; padding: 10px 15px; background-color: #4a76a8; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
               <span class="vk-icon" style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf189;</span> Поделиться в ВКонтакте
            </a>

            <a href="https://connect.ok.ru/offer?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(document.title)}"
               target="_blank"
               class="share-ok-btn"
               style="display: flex; align-items: center; gap: 5px; padding: 10px 15px; background-color: #f58220; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
               <span class="ok-icon" style="font-family: 'Font Awesome 5 Free'; font-weight: 900;">&#xf1d7;</span> Поделиться в Одноклассниках
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
