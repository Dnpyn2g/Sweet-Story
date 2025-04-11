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
            // Предполагаем, что для кнопок пагинации в разметке есть контейнер с id="pagination"
            const paginationContainer = document.getElementById('pagination');

            // Функция для рендера историй на текущей странице
            function renderStories() {
                // Очистка контейнера историй
                gallery.innerHTML = '';
                
                // Определяем с какого элемента начинать вывод
                const startIndex = (currentPage - 1) * storiesPerPage;
                // Получаем истории для текущей страницы
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

                // Пример вставки рекламного блока (одного блока) в случайное место среди историй:
                const adContainer = document.createElement('div');
                adContainer.id = 'ad-example'; // Измените id, если необходимо
                const storyItems = Array.from(gallery.children);
                const randomIndex = Math.floor(Math.random() * (storyItems.length + 1));
                if (randomIndex < storyItems.length) {
                    gallery.insertBefore(adContainer, storyItems[randomIndex]);
                } else {
                    gallery.appendChild(adContainer);
                }

                // Если необходимо добавить подключение рекламного скрипта,
                // можно добавить его здесь аналогично тому, как это делалось в исходном коде.
            }

            // Функция для рендера кнопок пагинации
            function renderPagination() {
                // Очищаем контейнер пагинации
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
                    // Выделяем текущую страницу жирным шрифтом
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

            // Первоначальный рендер
            renderStories();
            renderPagination();

            // Пример: добавление обработчика событий для клика по ссылкам историй
            // Этот обработчик можно менять, так как элементы добавляются динамически
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
