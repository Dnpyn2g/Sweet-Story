// seo.js — финальная версия с утилитами, нормализацией canonical, абсолютными URL
// Важно: динамические теги не видят многие шэринговые боты. Для 100% эффекта рендерьте
// критичные теги (title, meta OG/Twitter, canonical, JSON-LD) на сервере/сборке.

// =====================
// УТИЛИТЫ
// =====================
function toAbsolute(urlLike) {
  try { return new URL(urlLike, window.location.origin).href; } catch { return urlLike; }
}

function toAbsoluteCanonical(urlLike) {
  try {
    const u = new URL(urlLike || window.location.href, window.location.origin);
    // Убираем трекеры/хэши
    u.search = '';
    u.hash = '';
    // Нормализуем заключительный слэш по политике сайта (оставим слэш)
    const href = u.href.endsWith('/') ? u.href : (u.origin + u.pathname + '/');
    return href;
  } catch {
    return urlLike;
  }
}

function setMeta(attrName, attrValue, content) {
  if (content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', String(content));
}

function removeMeta(attrName, attrValue) {
  const el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (el) el.remove();
}

function setCanonical(href) {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', toAbsoluteCanonical(href));
}

function setJsonLd(id, obj) {
  let script = document.head.querySelector(`#${id}`);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(obj, null, 2);
}

function stripHtmlToText(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
}

function truncate(str, maxLen = 155) {
  if (!str) return '';
  const s = str.trim();
  return s.length <= maxLen ? s : s.slice(0, maxLen - 1).trimEnd() + '…';
}

function countWords(text) {
  if (!text) return 0;
  return stripHtmlToText(text).split(/\s+/).filter(Boolean).length;
}

// =====================
// ПУБЛИЧНЫЕ API
// =====================
/**
 * Применяет SEO-теги для обычных страниц (не статьи).
 * @param {Object} params
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.url - канонический URL (может быть относительным)
 * @param {string} params.image - URL превью (может быть относительным)
 * @param {string} [params.imageAlt]
 * @param {string} [params.robots='index, follow']
 * @param {string} [params.siteName='Sweet Story']
 * @param {string} [params.locale='ru_RU']
 */
export function applySEOTags({
  title,
  description,
  url,
  image,
  imageAlt,
  robots = 'index, follow',
  siteName = 'Sweet Story',
  locale = 'ru_RU',
}) {
  if (title) document.title = title;

  // Canonical
  setCanonical(url || window.location.href);

  // Базовые мета
  setMeta('name', 'description', truncate(stripHtmlToText(description || '')));
  setMeta('name', 'robots', robots);

  // Open Graph
  const absImg = image ? toAbsolute(image) : undefined;
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', truncate(stripHtmlToText(description || '')));
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:url', toAbsoluteCanonical(url || window.location.href));
  if (absImg) setMeta('property', 'og:image', absImg);
  if (imageAlt) setMeta('property', 'og:image:alt', imageAlt);
  setMeta('property', 'og:site_name', siteName);
  setMeta('property', 'og:locale', locale);

  // Twitter Card
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', truncate(stripHtmlToText(description || '')));
  if (absImg) setMeta('name', 'twitter:image', absImg);

  // WebSite JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: toAbsoluteCanonical(url || window.location.href),
    name: siteName,
    description: truncate(stripHtmlToText(description || '')),
  };
  setJsonLd('json-ld-seo', schema);
}

/**
 * Применяет SEO-теги для страницы статьи/истории.
 * @param {Object} story
 * @param {number|string} story.id
 * @param {string} story.title
 * @param {string} story.content - может содержать HTML/\n
 * @param {string|number} [story.views]
 * @param {string} [story.image]
 * @param {string} [story.imageAlt]
 * @param {string|Date} [story.datePublished]
 * @param {string|Date} [story.dateModified]
 * @param {string} [options.url] - канонический URL для этой статьи
 * @param {string} [options.siteName='Sweet Story']
 * @param {string} [options.locale='ru_RU']
 * @param {string} [options.robots='index, follow']
 */
export function applyStorySEO(story, options = {}) {
  if (!story) { console.warn('Story object is required for SEO'); return; }
  const {
    url = window.location.href,
    siteName = 'Sweet Story',
    locale = 'ru_RU',
    robots = 'index, follow',
  } = options;

  const title = story.title ? `${story.title} — ${siteName}` : siteName;
  const rawDesc = stripHtmlToText(story.content || '') || `Читайте историю "${story.title || ''}" на ${siteName}`;
  const description = truncate(rawDesc, 155);
  const absUrl = toAbsoluteCanonical(url);
  const absImg = story.image ? toAbsolute(story.image) : toAbsolute('/images/og-image.jpg');

  if (title) document.title = title;

  // Canonical + базовые мета
  setCanonical(absUrl);
  setMeta('name', 'description', description);
  setMeta('name', 'robots', robots);
  setMeta('name', 'author', siteName);
  // Не создаём meta keywords — не используется поисковиками
  removeMeta('name', 'keywords');

  // Open Graph (Article)
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:type', 'article');
  setMeta('property', 'og:url', absUrl);
  setMeta('property', 'og:image', absImg);
  if (story.imageAlt) setMeta('property', 'og:image:alt', story.imageAlt);
  setMeta('property', 'og:site_name', siteName);
  setMeta('property', 'og:locale', locale);

  // Twitter
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', absImg);

  // Даты
  const published = story.datePublished ? new Date(story.datePublished) : null;
  const modified  = story.dateModified  ? new Date(story.dateModified)  : null;

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title || siteName,
    description,
    image: absImg,
    url: absUrl,
    ...(published ? { datePublished: published.toISOString() } : {}),
    ...(modified  ? { dateModified:  modified.toISOString() } : {}),
    author: { '@type': 'Organization', name: siteName, url: window.location.origin },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: window.location.origin,
      logo: { '@type': 'ImageObject', url: toAbsolute('/images/logo.png') }
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absUrl },
    wordCount: countWords(story.content || ''),
    genre: 'Рассказ',
  };

  setJsonLd('json-ld-seo', articleSchema);
}

// =====================
// (Опционально) Экспорт утилит, если нужны снаружи
// export { toAbsolute, toAbsoluteCanonical, setMeta, setCanonical, setJsonLd };
