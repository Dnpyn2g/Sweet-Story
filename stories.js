// stories.js
document.addEventListener('DOMContentLoaded', () => {
  // ————— Вставляем стили карточки «историй» с анимациями и синхронным водяным знаком —————
  const style = document.createElement('style');
  style.textContent = `
    /* Анимации */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .story-link {
      display: block;
      color: inherit;
      text-decoration: none;
    }

    .story-card {
      background: #fff;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      overflow: hidden;
      margin-bottom: 2rem;
      animation: fadeInUp 0.6s ease-out both;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .story-link:hover .story-card {
      transform: translateY(-8px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
    }

    /* Обёртка для картинки */
    .story-image-wrapper {
      position: relative;
      overflow: hidden;
      border-top-left-radius: var(--border-radius);
      border-top-right-radius: var(--border-radius);
      box-shadow: inset 0 -1px 0 rgba(0,0,0,0.05);
    }

    .story-image {
      width: 100%;
      display: block;
      transform: scale(0.95);
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    .story-link:hover .story-image {
      transform: scale(1.01);
      filter: brightness(1.0);
    }

    /* Водяной знак — по центру внизу, но чуть выше (на 2px), с синхронной анимацией */
    .story-image-wrapper::after {
      content: 'SWEET-STORY.COM';
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(20px) scale(0.95);
      padding: 2px 6px;
      background: rgba(0, 0, 0, 0.4);
      color: #fff;
      font-size: 0.8em;
      font-weight: bold;
      border-radius: 3px;
      pointer-events: none;
      user-select: none;

      opacity: 0;
      animation: fadeInUp 0.6s ease-out both;
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    .story-link:hover .story-image-wrapper::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0) scale(1.01);
    }

    .story-card header {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px;
      background: var(--background-color);
      box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.08);
      font-size: 0.9em;
      color: var(--muted-color);
      font-weight: 500;
    }
    .story-card header .views::before {
      content: '👁️';
      margin-right: 6px;
    }

    .story-title {
      margin: 1em 0 0.5em;
      font-size: 1.4em;
      font-weight: 700;
      color: var(--secondary-color);
      transition: transform 0.3s ease, color 0.3s ease;
      padding: 0 20px;
    }
    .story-link:hover .story-title {
      transform: translateY(-3px);
      color: var(--primary-color);
    }

    .story-text {
      padding: 0 20px;
      font-size: 1em;
      color: var(--muted-color);
      margin-bottom: 1.2em;
      line-height: 1.7;
      font-weight: 700;
    }

    .read-more {
      text-align: center;
      padding: 18px;
      background: var(--background-color);
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      animation: slideInUp 0.5s ease-out 0.2s both;
    }
    .read-btn {
      display: inline-block;
      padding: 10px 24px;
      background: var(--primary-color);
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 1em;
      transition: background 0.3s ease, transform 0.15s ease;
    }
    .read-btn:hover {
      background: rgba(255, 140, 0, 0.85);
      transform: translateY(-3px);
    }

    /* Скрыть аватарки и даты */
    .avatar-wrapper,
    .avatar,
    .user-info,
    .story-card header time {
      display: none !important;
    }

    .pagination button {
      opacity: 0;
      animation: fadeInUp 0.5s ease-out both;
      font-weight: 600;
      font-size: 1em;
      border-radius: 6px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .pagination button:nth-child(1) { animation-delay: 0.1s; }
    .pagination button:nth-child(2) { animation-delay: 0.15s; }
    .pagination button:nth-child(3) { animation-delay: 0.2s; }
    .pagination button:nth-child(4) { animation-delay: 0.25s; }
    .pagination button:nth-child(5) { animation-delay: 0.3s; }
    .pagination button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);

  // ————— Логика загрузки, рендеринга и пагинации —————
  const perPage = 6;  // теперь показываем по 6 историй на странице
  let currentPage = 1;
  let stories = [];

  const container = document.getElementById('stories-container');
  const pagination = document.getElementById('pagination');

  function createCard(s) {
    // Превью текста — первые 300 символов
    const snippet = s.content.length > 300
      ? s.content.slice(0, 300).replace(/\r?\n/g, '<br>') + '…'
      : s.content.replace(/\r?\n/g, '<br>');
    const detailUrl = `story1.html?id=${s.id}`;

    const link = document.createElement('a');
    link.href = detailUrl;
    link.className = 'story-link';

    const card = document.createElement('article');
    card.className = 'story-card';
    card.innerHTML = `
      <h2 class="story-title">${s.title}</h2>
      <div class="story-image-wrapper">
        <img src="${s.image}" alt="${s.title}" class="story-image">
      </div>
      <p class="story-text">${snippet}</p>
      <header><span class="views">${s.views} просмотров</span></header>
      <div class="read-more">
        <a href="${detailUrl}" class="read-btn">Читать историю полностью</a>
      </div>
    `;
    link.appendChild(card);
    return link;
  }

  function renderPage(page) {
    container.innerHTML = '';
    const start = (page - 1) * perPage;
    stories.slice(start, start + perPage).forEach(s => {
      container.appendChild(createCard(s));
    });
    renderPagination();
  }

  function renderPagination() {
    pagination.innerHTML = '';
    const total = Math.ceil(stories.length / perPage);
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(total, startPage + maxButtons - 1);
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    const addBtn = i => {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.classList.add('active');
      btn.onclick = () => { currentPage = i; renderPage(i); };
      pagination.appendChild(btn);
    };
    const addEllipsis = () => {
      const span = document.createElement('span');
      span.textContent = '…';
      span.className = 'ellipsis';
      pagination.appendChild(span);
    };

    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.disabled = currentPage === 1;
    prev.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    };
    pagination.appendChild(prev);

    if (startPage > 1) {
      addBtn(1);
      if (startPage > 2) addEllipsis();
    }
    for (let i = startPage; i <= endPage; i++) {
      addBtn(i);
    }
    if (endPage < total) {
      if (endPage < total - 1) addEllipsis();
      addBtn(total);
    }

    const next = document.createElement('button');
    next.textContent = '›';
    next.disabled = currentPage === total;
    next.onclick = () => {
      if (currentPage < total) {
        currentPage++;
        renderPage(currentPage);
      }
    };
    pagination.appendChild(next);
  }

  fetch('stories.json')
    .then(r => r.json())
    .then(data => {
      stories = data.reverse();
      renderPage(currentPage);
    })
    .catch(err => {
      console.error('Ошибка загрузки историй:', err);
      container.innerHTML = '<p>Не удалось загрузить истории.</p>';
    });
});
