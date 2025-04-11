document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(fetchedStories => {
            // Переворачиваем массив, чтобы новые истории были первыми
            const stories = fetchedStories.reverse();
            const storiesPerPage = 6;
            let currentPage = 1;
            const totalPages = Math.ceil(stories.length / storiesPerPage);
            const gallery = document.getElementById('story-gallery');
            // Контейнер для кнопок пагинации, например:
            const paginationContainer = document.getElementById('pagination');

            // Функция отрисовки историй для текущей страницы
            function renderStories() {
                // Очищаем контейнер галереи
                gallery.innerHTML = '';

                // Выбираем истории для текущей страницы
                const startIndex = (currentPage - 1) * storiesPerPage;
                const pageStories = stories.slice(startIndex, startIndex + storiesPerPage);

                // Добавляем каждую историю в галерею
                pageStories.forEach(story => {
                    const storyItem = document.createElement('div');
                    storyItem.className = 'story-item';
                    storyItem.innerHTML = `
                        <a href="story1.html?id=${story.id}">
                            <img src="${story.image}" alt="${story.title}">
                        </a>
                        <p>${story.title}</p>
                        <a href="story1.html?id=${story.id}">Читать больше</a>
                    `;
                    gallery.appendChild(storyItem);
                });

                // --- Старый блок рекламы (пример вставки случайным образом) ---
                const adContainer = document.createElement('div');
                adContainer.id = 'ad-example';
                const storyItems = Array.from(gallery.children);
                const randomIndex = Math.floor(Math.random() * (storyItems.length + 1));
                if (randomIndex < storyItems.length) {
                    gallery.insertBefore(adContainer, storyItems[randomIndex]);
                } else {
                    gallery.appendChild(adContainer);
                }

                // --- Дополнительный блок рекламы, стилизованный как карточка истории ---
                const storyItemsAfterAds = Array.from(gallery.children);
                const adCard = document.createElement('div');
                adCard.className = 'story-item'; // Сохраняем тот же класс, чтобы по размеру он соответствовал карточке истории.

                // Создаем контейнер для рекламы, как указанно в коде
                const adDiv = document.createElement('div');
                adDiv.className = 'FttrbF373253';
                adCard.appendChild(adDiv);

                // Вставляем рекламную карточку после третьего элемента, если их достаточно, иначе — в конец.
                if (storyItemsAfterAds.length >= 3) {
                    gallery.insertBefore(adCard, storyItemsAfterAds[3]);
                } else {
                    gallery.appendChild(adCard);
                }

                // Инициализация рекламного блока:
                // Добавляем настройки в массив k_init (если еще не определен)
                window.k_init = window.k_init || [];
                window.k_init.push({
                    id: 'FttrbF373253',
                    type: 'bn',
                    domain: 'hdbkome.com',
                    refresh: false,
                    next: 0
                });

                // Подключаем скрипт, если он еще не загружен (чтобы избежать дублирования при переключении страниц)
                if (!document.getElementById('ktdsr2bf-script')) {
                    const adScript = document.createElement('script');
                    adScript.id = 'ktdsr2bf-script';
                    adScript.async = true;
                    adScript.charset = 'utf-8';
                    adScript.setAttribute('data-cfasync', 'false');
                    adScript.src = 'https://hdbkome.com/ktdsr2bf.js';
                    document.head.appendChild(adScript);
                }
            }

            // Функция отрисовки пагинации
            function renderPagination() {
                paginationContainer.innerHTML = '';

                // Кнопка "Предыдущая"
                if (currentPage > 1) {
                    const prevButton = document.createElement('button');
                    prevButton.textContent = 'Предыдущая';
                    prevButton.addEventListener('click', function () {
                        if (currentPage > 1) {
                            currentPage--;
                            renderStories();
                            renderPagination();
                        }
                    });
                    paginationContainer.appendChild(prevButton);
                }

                // Номера страниц
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i;
                    if (i === currentPage) {
                        pageButton.style.fontWeight = 'bold';
                    }
                    pageButton.addEventListener('click', function () {
                        currentPage = i;
                        renderStories();
                        renderPagination();
                    });
                    paginationContainer.appendChild(pageButton);
                }

                // Кнопка "Следующая"
                if (currentPage < totalPages) {
                    const nextButton = document.createElement('button');
                    nextButton.textContent = 'Следующая';
                    nextButton.addEventListener('click', function () {
                        if (currentPage < totalPages) {
                            currentPage++;
                            renderStories();
                            renderPagination();
                        }
                    });
                    paginationContainer.appendChild(nextButton);
                }
            }

            // Первичная отрисовка
            renderStories();
            renderPagination();

            // Пример делегирования событий для отслеживания кликов по ссылкам историй
            gallery.addEventListener('click', function(e) {
                const storyLink = e.target.closest('.story-item a');
                if (storyLink) {
                    console.log('Клик по ссылке:', storyLink.href);
                }
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
