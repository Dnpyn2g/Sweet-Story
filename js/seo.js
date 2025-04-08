(function() {
    /**
     * Обновление мета-тегов, заголовка страницы и структурированных данных JSON‑LD.
     * @param {Object} story - Объект с данными истории.
     */
    function updateSEO(story) {
        // Удаление старых мета-тегов (для og, description, twitter и keywords)
        const oldMetaTags = document.head.querySelectorAll('meta[property^="og:"], meta[name="description"], meta[name="twitter:card"], meta[name="keywords"]');
        oldMetaTags.forEach(tag => tag.remove());

        // Массив новых мета-тегов
        const metaTags = [
            { name: "description", content: story.description },
            { name: "keywords", content: "Свит стори, вдохновляющие истории, трогательные рассказы, семейные истории, мотивационные истории из СНГ, уроки жизни, вдохновение, позитивные истории, Россия, Украина, Казахстан" },
            { property: "og:title", content: story.title },
            { property: "og:description", content: story.description },
            { property: "og:image", content: story.image },
            { property: "og:image:alt", content: story.imageAlt || "Трогательная история из СНГ" },
            { property: "og:url", content: window.location.href },
            { property: "og:type", content: "article" },
            { property: "og:locale", content: "ru_RU" },
            { property: "fb:app_id", content: "61571370822088" },
            { name: "twitter:card", content: "summary_large_image" }
        ];

        metaTags.forEach(tagData => {
            const meta = document.createElement('meta');
            Object.keys(tagData).forEach(key => {
                meta.setAttribute(key, tagData[key]);
            });
            document.head.appendChild(meta);
        });

        // Добавление или обновление канонической ссылки
        const oldCanonical = document.head.querySelector('link[rel="canonical"]');
        if (oldCanonical) oldCanonical.remove();
        const canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', window.location.href);
        document.head.appendChild(canonicalLink);

        // Обновление заголовка страницы
        document.title = story.title;

        // Формирование JSON‑LD структурированных данных
        const jsonLdData = {
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

        // Удаляем ранее добавленный JSON‑LD если он уже присутствует
        const existingJsonLd = document.head.querySelector('script[type="application/ld+json"]');
        if (existingJsonLd) existingJsonLd.remove();

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(jsonLdData);
        document.head.appendChild(script);
    }

    /**
     * Добавление hreflang ссылок для поддержки локализации.
     */
    function addHreflangTags() {
        // Очистка существующих hreflang-ссылок (если имеются)
        const oldHreflangLinks = document.head.querySelectorAll('link[rel="alternate"][hreflang]');
        oldHreflangLinks.forEach(link => link.remove());

        const hreflangTags = [
            { rel: "alternate", hreflang: "ru-RU", href: "https://sweet-story.online/" },
            { rel: "alternate", hreflang: "uk-UA", href: "https://sweet-story.online/uk/" },
            { rel: "alternate", hreflang: "kk-KZ", href: "https://sweet-story.online/kz/" }
        ];

        hreflangTags.forEach(tagData => {
            const link = document.createElement('link');
            Object.keys(tagData).forEach(key => {
                link.setAttribute(key, tagData[key]);
            });
            document.head.appendChild(link);
        });
    }

    /**
     * Добавление кнопок социальных сетей для быстрой публикации.
     */
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
        // Здесь можно добавить контейнер в определённое место страницы, например, после основного контента.
        document.body.appendChild(shareContainer);
    }

    /**
     * Загрузка данных истории из API и обновление содержимого страницы вместе с SEO.
     * @param {number|string} storyId - Идентификатор истории.
     */
    function loadStory(storyId) {
        fetch(`/api/stories/${storyId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки данных');
                }
                return response.json();
            })
            .then(story => {
                // Обновляем содержимое страницы, если соответствующие элементы существуют
                const titleElement = document.getElementById('story-title-main');
                if (titleElement) titleElement.textContent = story.title;

                const imageElement = document.getElementById('story-image');
                if (imageElement) imageElement.src = story.image;

                const contentElement = document.getElementById('story-content');
                if (contentElement) contentElement.textContent = story.content;

                // Обновляем SEO (мета-теги, JSON‑LD и т.п.)
                updateSEO(story);
            })
            .catch(err => console.error('Ошибка загрузки истории:', err));
    }

    // Подключаем функции после полной загрузки DOM
    document.addEventListener('DOMContentLoaded', () => {
        addHreflangTags();
        addSocialShareButtons();
        // Замените "1" на актуальный идентификатор истории или механизм выбора нужной истории.
        loadStory(1);
    });
})();
