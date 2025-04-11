document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            // Переворачиваем массив, чтобы сначала были новые истории
            const allStories = stories.reverse();
            const itemsPerPage = 6; // Количество историй на странице
            let currentPage = 1;
            const totalPages = Math.ceil(allStories.length / itemsPerPage);

            const gallery = document.getElementById('story-gallery');
            // В HTML желательно создать контейнер для управления пагинацией, например:
            // <div id="pagination-container"></div>
            const paginationContainer = document.getElementById('pagination-container');

            // Функция для отрисовки историй для выбранной страницы
            function renderPage(page) {
                gallery.innerHTML = ''; // Очистка галереи

                // Вычисляем индексы для среза массива
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const pageStories = allStories.slice(startIndex, endIndex);

                // Отрисовываем истории для текущей страницы
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

                // Если реклама нужна на каждой странице, добавляем её после отрисовки историй.
                // Пример для первого рекламного блока:
                addAds();

                // Привязка обработчиков событий, если требуется
                document.querySelectorAll('.story-item a').forEach(link => {
                    link.addEventListener('click', event => {
                        console.log('Клик по ссылке:', link.href);
                    });
                });
            }

            // Функция для добавления рекламы (можно адаптировать под все три ваших рекламных скрипта)
            function addAds() {
                // Пример добавления первого рекламного блока:
                const adContainer1 = document.createElement('div');
                adContainer1.id = 'bn_60d96ced6b';

                const storyItems = Array.from(gallery.children);
                const randomIndex1 = Math.floor(Math.random() * (storyItems.length + 1));

                if (randomIndex1 < storyItems.length) {
                    gallery.insertBefore(adContainer1, storyItems[randomIndex1]);
                } else {
                    gallery.appendChild(adContainer1);
                }
                
                // Если необходимо, вставьте сюда инициализацию рекламного скрипта, аналогично вашему исходному коду.
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

                // Отображение информации о текущей странице
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

            // Первоначальный вывод первой страницы и создание управления пагинацией
            renderPage(currentPage);
            createPaginationControls();
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
