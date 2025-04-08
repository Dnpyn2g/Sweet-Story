document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(storiesData => {
            // Переворачиваем массив, чтобы новые истории отображались первыми
            const stories = storiesData.reverse();
            const gallery = document.getElementById('story-gallery');
            const itemsPerPage = 6;
            let currentPage = 1;

            // Функция отрисовки историй для текущей страницы
            function renderPage(page) {
                gallery.innerHTML = '';
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const currentStories = stories.slice(start, end);

                currentStories.forEach(story => {
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

                // Если нужно вставить рекламу, можно добавить похожий код здесь.
                // Пример: вставка первого рекламного блока в случайное место страницы
                if (currentStories.length > 0) {
                    const adContainer1 = document.createElement('div');
                    adContainer1.id = 'bn_60d96ced6b';
                    const storyItems = Array.from(gallery.children);
                    const randomIndex = Math.floor(Math.random() * (storyItems.length + 1));
                    if (randomIndex < storyItems.length) {
                        gallery.insertBefore(adContainer1, storyItems[randomIndex]);
                    } else {
                        gallery.appendChild(adContainer1);
                    }
                    
                    // Дополнительные рекламные вставки можно добавить аналогичным образом.
                }
            }

            // Функция для отрисовки пагинации
            function renderPagination() {
                let paginationContainer = document.getElementById('pagination');
                if (!paginationContainer) {
                    // Если контейнер для пагинации отсутствует, создаём его и добавляем под галереей
                    paginationContainer = document.createElement('div');
                    paginationContainer.id = 'pagination';
                    // Можно изменить местоположение, если требуется другое расположение
                    gallery.parentNode.appendChild(paginationContainer);
                }
                paginationContainer.innerHTML = '';

                const totalPages = Math.ceil(stories.length / itemsPerPage);

                // Кнопка "Предыдущая"
                if (currentPage > 1) {
                    const prevButton = document.createElement('button');
                    prevButton.textContent = 'Предыдущая';
                    prevButton.addEventListener('click', function () {
                        currentPage--;
                        renderPage(currentPage);
                        renderPagination();
                    });
                    paginationContainer.appendChild(prevButton);
                }

                // Кнопки с номерами страниц
                for (let i = 1; i <= totalPages; i++) {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = i;
                    if (i === currentPage) {
                        pageButton.disabled = true;
                    }
                    pageButton.addEventListener('click', function () {
                        currentPage = i;
                        renderPage(currentPage);
                        renderPagination();
                    });
                    paginationContainer.appendChild(pageButton);
                }

                // Кнопка "Следующая"
                if (currentPage < totalPages) {
                    const nextButton = document.createElement('button');
                    nextButton.textContent = 'Следующая';
                    nextButton.addEventListener('click', function () {
                        currentPage++;
                        renderPage(currentPage);
                        renderPagination();
                    });
                    paginationContainer.appendChild(nextButton);
                }
            }

            // Начальная отрисовка
            renderPage(currentPage);
            renderPagination();

            // Пример: добавление обработчиков событий для отслеживания кликов по ссылкам историй
            document.querySelectorAll('.story-item a').forEach(link => {
                link.addEventListener('click', (event) => {
                    console.log('Клик по ссылке:', link.href);
                });
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
