document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            const gallery = document.getElementById('story-gallery');

            // Очистка галереи перед добавлением
            gallery.innerHTML = '';

            // Генерация истории
            stories.forEach(story => {
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

            // Добавление рекламного блока как карточки истории
            const adItem = document.createElement('div');
            adItem.className = 'story-item';

            // Динамическое обновление рекламного изображения
            function updateAdImage() {
                fetch('https://example.com/current-ad') // Замените на реальный URL API рекламного изображения
                    .then(response => response.json())
                    .then(adData => {
                        adItem.innerHTML = `
                            <a href="${adData.link}">
                                <img src="${adData.image}" alt="Рекламный контент">
                            </a>
                            <p>${adData.title}</p>
                            <a href="${adData.link}">Читать больше</a>
                        `;
                    })
                    .catch(error => {
                        console.error('Ошибка загрузки рекламы:', error);
                        adItem.innerHTML = '<p>Реклама временно недоступна</p>';
                    });
            }

            updateAdImage();

            // Обновление изображения каждые 5 минут
            setInterval(updateAdImage, 300000);

            gallery.appendChild(adItem);

            // Тест: добавление обработчиков событий для проверки кликов
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
