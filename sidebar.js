// sidebar.js — рекомендации в боковой панели.
// Использует chunked StoryLoader. Все вставки через textContent, чтобы исключить XSS
// из ненадёжных полей данных (title/excerpt приходят из generated content).

document.addEventListener('DOMContentLoaded', async () => {
  const styles = `
    @keyframes ssFadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .sidebar { background: rgba(255,255,255,.8); backdrop-filter: blur(8px); width: 300px; padding: 20px; border-radius: var(--border-radius); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 20px; position: static; font-family: var(--font-family); }
    .sidebar-section { animation: ssFadeInUp .4s ease-out both; }
    .sidebar-section h3 { margin-bottom: 12px; color: var(--secondary-color); font-weight: 700; position: relative; }
    .sidebar-section h3::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 40px; height: 3px; background: var(--primary-color); border-radius: 2px; }
    .sidebar-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
    .sidebar-list li { opacity: 0; animation: ssFadeInUp .4s ease-out forwards; }
    .sidebar-list a { display: flex; align-items: center; padding: 8px 12px; background: var(--background-color); border-radius: 4px; color: var(--secondary-color); font-weight: 600; text-decoration: none; transition: transform .2s ease, background .2s ease, color .2s ease; }
    .sidebar-list a:hover { color: var(--primary-color); background: rgba(255,140,0,.1); transform: translateX(4px); }
    .sidebar-icon { width: 16px; height: 16px; margin-right: 8px; flex-shrink: 0; filter: invert(30%); }
    @media (max-width: 1200px) { .sidebar { width: 100%; max-width: none; position: static; } }
    @media (max-width: 768px)  { .sidebar { width: 100%; padding: 15px; position: relative; top: auto; } }
    .sidebar .loading { text-align: center; padding: 20px; color: var(--secondary-color); font-style: italic; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  const root = document.getElementById('sidebar-container');
  if (!root) return;

  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  const slot = document.createElement('div');
  slot.id = 'dynamic-blocks';
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Загружаем рекомендации...';
  slot.appendChild(loading);
  aside.appendChild(slot);
  root.replaceChildren(aside);

  if (!window.storyLoader) {
    slot.replaceChildren(Object.assign(document.createElement('p'), { textContent: 'Загрузчик недоступен.' }));
    return;
  }

  const makeIcon = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sidebar-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm9 18 6-6-6-6');
    svg.appendChild(path);
    return svg;
  };

  const makeSection = (heading, stories, baseDelay = 0) => {
    const section = document.createElement('div');
    section.className = 'sidebar-section';

    const h3 = document.createElement('h3');
    h3.textContent = heading;
    section.appendChild(h3);

    const ul = document.createElement('ul');
    ul.className = 'sidebar-list';
    stories.forEach((story, index) => {
      if (!story || story.id == null) return;
      const li = document.createElement('li');
      li.style.animationDelay = ((baseDelay + index) * 0.1) + 's';

      const a = document.createElement('a');
      a.href = '/stories/' + encodeURIComponent(story.id) + '.html';
      a.appendChild(makeIcon());
      a.appendChild(document.createTextNode(story.title || 'История'));

      li.appendChild(a);
      ul.appendChild(li);
    });
    section.appendChild(ul);
    return section;
  };

  try {
    const random = await window.storyLoader.getRandomStories(5);
    const popular = await window.storyLoader.getRandomStories(3);

    slot.replaceChildren(
      makeSection('Рекомендуем к прочтению', random, 0),
      makeSection('Популярные истории', popular, 5),
    );
  } catch (error) {
    console.error('Ошибка загрузки рекомендаций:', error);
    const wrap = document.createElement('div');
    wrap.className = 'sidebar-section';
    const p = document.createElement('p');
    p.textContent = 'Не удалось загрузить рекомендации';
    wrap.appendChild(p);
    slot.replaceChildren(wrap);
  }
});
