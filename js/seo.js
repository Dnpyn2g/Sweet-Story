// Добавление мета-тегов для SEO
(function() {
    const metaTags = [
        { name: "description", content: "Трогательная история о матери и сыне, которые спустя годы вновь встретились. История прощения, боли и судебных разбирательств." },
        { property: "og:title", content: "История о матери и сыне: Путь к прощению" },
        { property: "og:description", content: "Трогательная история прощения, боли и судебных разбирательств." },
        { property: "og:image", content: "images/story1.jpg" },
        { property: "og:url", content: "https://sweet-story.online/story1.html" },
        { name: "twitter:card", content: "summary_large_image" }
    ];

    metaTags.forEach(tag => {
        const meta = document.createElement('meta');
        Object.keys(tag).forEach(key => meta.setAttribute(key, tag[key]));
        document.head.appendChild(meta);
    });

    // Добавление структурированных данных JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "История о матери и сыне: Путь к прощению",
        "datePublished": "2025-01-05",
        "author": {
            "@type": "Person",
            "name": "Анна Петрова"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Sweet Story",
            "logo": {
                "@type": "ImageObject",
                "url": "https://sweet-story.online/images/favicon.ico"
            }
        }
    };

    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
})();
