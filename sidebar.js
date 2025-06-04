// sidebar.js
// Версия: 1.0.4
// Улучшенный сайдбар с SVG-иконками и адаптивностью, подгрузка из четырёх файлов

document.addEventListener('DOMContentLoaded', () => {
  // 1. Вставляем стили сайдбара
  const css = `
    /* Анимация появления */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Основной контейнер сайдбара */
    .sidebar {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      width: 300px;
      padding: 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: static;
      font-family: var(--font-family);
    }

    /* Секции внутри сайдбара */
    .sidebar-section {
      animation: fadeInUp 0.4s ease-out both;
    }
    .sidebar-section h3 {
      margin-bottom: 12px;
      color: var(--secondary-color);
      font-weight: 700;
      position: relative;
    }
    .sidebar-section h3::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 40px;
      height: 3px;
      background: var(--primary-color);
      border-radius: 2px;
    }

    /* Список рекомендаций */
    .sidebar-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .sidebar-list li {
      opacity: 0;
      animation: fadeInUp 0.4s ease-out forwards;
    }
    .sidebar-list a {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: var(--background-color);
      border-radius: 4px;
      color: var(--secondary-color);
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
    }
    .sidebar-list a:hover {
      color: var(--primary-color);
      background: rgba(255, 140, 0, 0.1);
      transform: translateX(4px);
    }
    /* SVG-иконка перед ссылкой */
    .sidebar-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      flex-shrink: 0;
      filter: invert(30%);
    }

    /* Адаптивность */
    @media (max-width: 1200px) {
      .sidebar {
        width: 100%;
        max-width: none;
        position: static;
      }
    }
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        padding: 15px;
        position: relative;
        top: auto;
      }
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Создаём контейнер сайдбара
  const container = document.getElementById('sidebar-container');
  container.innerHTML = `
    <aside class="sidebar">
      <div id="dynamic-blocks"></div>
    </aside>
  `;

  // 3. Подгружаем четырёх JSON-файлов и покажем 5 случайных записей
  Promise.all([
    fetch('stories-1.json').then(res => res.json()),
    fetch('stories-2.json').then(res => res.json()),
    fetch('stories-3.json').then(res => res.json()),
    fetch('stories-4.json').then(res => res.json())
  ])
    .then(arrays => {
      // Объединяем все четыре массива
      const allStories = arrays.flat();

      // Перемешиваем и берём 5 случайных
      const picks = allStories
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      let recHtml = `
        <section class="sidebar-section">
          <h3>Также читают</h3>
          <ul class="sidebar-list">
      `;
      picks.forEach((item, idx) => {
        recHtml += `
          <li style="animation-delay: ${0.2 + idx * 0.1}s">
            <a href="story1.html?id=${item.id}">
              <img src="https://cdn.jsdelivr.net/npm/feather-icons/dist/icons/book-open.svg" class="sidebar-icon" alt="icon">
              ${item.title}
            </a>
          </li>
        `;
      });
      recHtml += `
          </ul>
        </section>
      `;

      document.getElementById('dynamic-blocks')
        .insertAdjacentHTML('beforeend', recHtml);
    })
    .catch(err => {
      console.error('Не удалось загрузить рекомендации:', err);
      document.getElementById('dynamic-blocks')
        .innerHTML = '<p>Не удалось загрузить раздел «Также читают».</p>';
    });
});
