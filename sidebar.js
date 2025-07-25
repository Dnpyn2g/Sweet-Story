// sidebar.js
// Версия: 2.0.0 - Оптимизированная загрузка
// Улучшенный сайдбар с оптимизированной загрузкой только активных JSON файлов

document.addEventListener('DOMContentLoaded', async () => {
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

    /* Индикатор загрузки */
    .loading {
      text-align: center;
      padding: 20px;
      color: var(--secondary-color);
      font-style: italic;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // 2. Создаём контейнер сайдбара
  const container = document.getElementById('sidebar-container');
  container.innerHTML = `
    <aside class="sidebar">
      <div id="dynamic-blocks">
        <div class="loading">Загружаем рекомендации...</div>
      </div>
    </aside>
  `;

  // 3. Используем оптимизированный загрузчик для получения случайных историй
  try {
    const randomStories = await window.storyLoader.getRandomStories(5);
    
    // 4. Генерируем HTML для рекомендаций
    const dynamicBlocks = document.getElementById('dynamic-blocks');
    const icon = `
      <svg class="sidebar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    `;

    dynamicBlocks.innerHTML = `
      <div class="sidebar-section">
        <h3>Рекомендуем к прочтению</h3>
        <ul class="sidebar-list">
          ${randomStories.map((story, index) => `
            <li style="animation-delay: ${index * 0.1}s">
              <a href="story1.html?id=${story.id}">
                ${icon}
                ${story.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

    // 5. Добавляем блок популярных историй
    const popularStories = await window.storyLoader.getRandomStories(3);
    dynamicBlocks.innerHTML += `
      <div class="sidebar-section">
        <h3>Популярные истории</h3>
        <ul class="sidebar-list">
          ${popularStories.map((story, index) => `
            <li style="animation-delay: ${(index + 5) * 0.1}s">
              <a href="story1.html?id=${story.id}">
                ${icon}
                ${story.title}
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    `;

  } catch (error) {
    console.error('Ошибка загрузки рекомендаций:', error);
    const dynamicBlocks = document.getElementById('dynamic-blocks');
    dynamicBlocks.innerHTML = `
      <div class="sidebar-section">
        <p>Не удалось загрузить рекомендации</p>
      </div>
    `;
  }
});
