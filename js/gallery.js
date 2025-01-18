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
                    <a href="story1.html?id=${story.id}" class="details-button">Читать больше</a>
                `;

                gallery.appendChild(storyItem);
            });

            // Добавление рекламного блока как карточки истории
            const adItem = document.createElement('div');
            adItem.className = 'story-item';

            adItem.innerHTML = `
                <a href="#">
                    <img src="https://via.placeholder.com/300x200" alt="Рекламный контент">
                </a>
                <p>Знижка 7% на двокімнатні квартири.</p>
                <a href="#" class="details-button">Детальніше</a>
            `;

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
