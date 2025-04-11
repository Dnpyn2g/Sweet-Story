document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            // Переворачиваем массив, чтобы сначала были новые истории
            const reversedStories = stories.reverse();
            const itemsPerPage = 6;
            let currentPage = 1;
            const totalPages = Math.ceil(reversedStories.length / itemsPerPage);

            const gallery = document.getElementById('story-gallery');
            // Здесь предполагается, что в HTML уже есть контейнер для пагинации, например:
            // <div id="pagination-container"></div>
            const paginationContainer = document.getElementById('pagination-container');

            // Функция для отрисовки историй для определённой страницы
            function renderPage(page) {
                gallery.innerHTML = ''; // Очистка галереи
                
                // Вычисляем индексы элементов для текущей страницы
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageStories = reversedStories.slice(startIndex, endIndex);

                // Отрисовка каждой истории
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

                // Если нужно добавлять рекламу – можно здесь вставить тот же код по добавлению рекламных блоков.
                // Например, можно вызвать функцию addAds() после отрисовки историй, которая разместит рекламу.
                
                // Добавление обработчиков кликов для ссылок (если это требуется)
                document.querySelectorAll('.story-item a').forEach(link => {
                    link.addEventListener('click', event => {
                        console.log('Клик по ссылке:', link.href);
                    });
                });
            }

            // Функция для создания элементов управления пагинацией
            function createPaginationControls() {
                paginationContainer.innerHTML = '';

                // Кнопка "Предыдущая"
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Предыдущая';
                prevButton.disabled = currentPage === 1;
                prevButton.addEventListener('click', () => {
                    if (currentPage > 1) {
                        currentPage--;
                        renderPage(currentPage);
                        createPaginationControls();
                    }
                });
                paginationContainer.appendChild(prevButton);

                // Информация о текущей странице
                const pageInfo = document.createElement('span');
                pageInfo.textContent = ` Страница ${currentPage} из ${totalPages} `;
                paginationContainer.appendChild(pageInfo);

                // Кнопка "Следующая"
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Следующая';
                nextButton.disabled = currentPage === totalPages;
                nextButton.addEventListener('click', () => {
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderPage(currentPage);
                        createPaginationControls();
                    }
                });
                paginationContainer.appendChild(nextButton);
            }

            // Первоначальный вывод
            renderPage(currentPage);
            createPaginationControls();
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
