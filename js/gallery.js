document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            const gallery = document.getElementById('story-gallery');
            
            // Очистка галереи перед добавлением
            gallery.innerHTML = '';
            
            // Выбираем последние 6 историй и переворачиваем массив для отображения от новых к старым
            const lastSixStories = stories.slice(-6).reverse();
            
            lastSixStories.forEach(story => {
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
            
            // Тест: добавление обработчиков событий для проверки кликов
            document.querySelectorAll('.story-item a').forEach(link => {
                link.addEventListener('click', () => {
                    console.log('Клик по ссылке:', link.href);
                });
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки историй:', error);
            document.getElementById('story-gallery').innerHTML = '<p>Не удалось загрузить истории. Попробуйте позже.</p>';
        });
});
