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
  