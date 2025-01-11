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
                    <img src="${story.image}" alt="${story.title}">
                    <p>${story.title}</p>
                    <a href="story1.html?id=${story.id}">Читать больше</a>
                `;

                gallery.appendChild(storyItem);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
