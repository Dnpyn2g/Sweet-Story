// seo.js
// Модуль для динамического применения SEO-тегов на страницах сайта

/**
 * Применяет основные SEO-теги: title, description, canonical, Open Graph, Twitter Card и JSON-LD
 * @param {Object} params
 * @param {string} params.title - Заголовок страницы
 * @param {string} params.description - Описание страницы
 * @param {string} params.url - Канонический URL страницы
 * @param {string} params.image - URL изображения для превью
 */
export function applySEOTags({ title, description, url, image }) {
    // Устанавливаем заголовок
    document.title = title;
  
    // Утилиты для meta-тегов
    const setMeta = (attrName, attrValue, content) => {
      let el = document.head.querySelector(`meta[${attrName}='${attrValue}']`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
  
    // Основные мета-теги
    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index, follow');
  
    // Canonical
    let canon = document.head.querySelector("link[rel='canonical']");
    if (!canon) {
      canon = document.createElement('link');
      canon.setAttribute('rel', 'canonical');
      document.head.appendChild(canon);
    }
    canon.setAttribute('href', url);
  
    // Open Graph
    const og = {
      'og:title': title,
      'og:description': description,
      'og:type': 'website',
      'og:url': url,
      'og:image': image
    };
    Object.entries(og).forEach(([prop, content]) => setMeta('property', prop, content));
  
    // Twitter Card
    const tw = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image
    };
    Object.entries(tw).forEach(([name, content]) => setMeta('name', name, content));
  
    // JSON-LD
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url,
      name: title,
      description
    };
    let script = document.head.querySelector('#json-ld-seo');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.id = 'json-ld-seo';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Применяет SEO-теги специально для страниц историй
 * @param {Object} story - Объект истории
 * @param {number} story.id - ID истории
 * @param {string} story.title - Заголовок истории
 * @param {string} story.content - Содержание истории
 * @param {string} story.views - Количество просмотров
 * @param {string} story.image - Путь к изображению
 */
export function applyStorySEO(story) {
    if (!story) {
        console.warn('Story object is required for SEO');
        return;
    }

    // Генерируем описание из первых 150 символов контента
    const description = generateDescription(story.content, story.title);
    
    // Формируем заголовок
    const title = `${story.title} — Sweet Story`;
    
    // Получаем полный URL изображения
    const imageUrl = story.image ? 
        `https://sweet-story.com/${story.image}` : 
        'https://sweet-story.com/images/og-image.jpg';
    
    // Получаем текущий URL
    const currentUrl = window.location.href;

    // Устанавливаем заголовок
    document.title = title;
  
    // Утилита для meta-тегов
    const setMeta = (attrName, attrValue, content) => {
        let el = document.head.querySelector(`meta[${attrName}='${attrValue}']`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attrName, attrValue);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };
  
    // Основные мета-теги
    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index, follow');
    setMeta('name', 'author', 'Sweet Story');
    setMeta('name', 'keywords', generateKeywords(story.title, story.content));
  
    // Canonical URL
    let canon = document.head.querySelector("link[rel='canonical']");
    if (!canon) {
        canon = document.createElement('link');
        canon.setAttribute('rel', 'canonical');
        document.head.appendChild(canon);
    }
    canon.setAttribute('href', currentUrl);
  
    // Open Graph теги
    const ogTags = {
        'og:title': title,
        'og:description': description,
        'og:type': 'article',
        'og:url': currentUrl,
        'og:image': imageUrl,
        'og:site_name': 'Sweet Story',
        'og:locale': 'ru_RU'
    };
    Object.entries(ogTags).forEach(([prop, content]) => 
        setMeta('property', prop, content)
    );
  
    // Twitter Card
    const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': imageUrl,
        'twitter:site': '@sweetstory'
    };
    Object.entries(twitterTags).forEach(([name, content]) => 
        setMeta('name', name, content)
    );
  
    // JSON-LD для статьи
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': story.title,
        'description': description,
        'image': imageUrl,
        'url': currentUrl,
        'datePublished': new Date().toISOString(),
        'dateModified': new Date().toISOString(),
        'author': {
            '@type': 'Organization',
            'name': 'Sweet Story',
            'url': 'https://sweet-story.com'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Sweet Story',
            'url': 'https://sweet-story.com',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://sweet-story.com/images/logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': currentUrl
        },
        'wordCount': story.content ? story.content.length : 0,
        'genre': 'Рассказ'
    };

    // Удаляем старую схему и добавляем новую
    let oldScript = document.head.querySelector('#json-ld-seo');
    if (oldScript) {
        oldScript.remove();
    }
    
    const script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.id = 'json-ld-seo';
    script.textContent = JSON.stringify(articleSchema, null, 2);
    document.head.appendChild(script);
}

/**
 * Генерирует описание из контента истории
 * @param {string} content - Содержание истории
 * @param {string} title - Заголовок истории
 * @returns {string} Описание для meta-тега
 */
function generateDescription(content, title) {
    if (!content) return `Читайте историю "${title}" на Sweet Story`;
    
    // Убираем лишние символы и сокращаем до 155 символов
    const cleanContent = content
        .replace(/[«»""]/g, '"')
        .replace(/—/g, '-')
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    if (cleanContent.length <= 155) {
        return cleanContent;
    }
    
    return cleanContent.substring(0, 152) + '...';
}

/**
 * Генерирует ключевые слова из заголовка и контента
 * @param {string} title - Заголовок истории
 * @param {string} content - Содержание истории
 * @returns {string} Ключевые слова через запятую
 */
function generateKeywords(title, content) {
    const baseKeywords = ['история', 'рассказ', 'Sweet Story', 'читать онлайн'];
    
    // Извлекаем значимые слова из заголовка
    const titleWords = title
        .toLowerCase()
        .split(/[^\wа-яё]+/)
        .filter(word => word.length > 3)
        .slice(0, 5);
    
    return [...baseKeywords, ...titleWords].join(', ');
}
  