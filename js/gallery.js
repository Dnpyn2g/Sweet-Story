document.addEventListener('DOMContentLoaded', function () {
    fetch('stories.json')
        .then(response => response.json())
        .then(stories => {
            const gallery = document.getElementById('story-gallery');
            
            // Очистка галереи
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
            
            // Создаем карточку рекламы, аналогичную карточке истории
            const adCard = document.createElement('div');
            adCard.className = 'story-item';
            adCard.innerHTML = `<div class="DnEgzR373253"></div>`;
            gallery.appendChild(adCard);
            
            // Инициализация рекламного блока
            window.k_init = window.k_init || [];
            window.k_init.push({
                id: 'DnEgzR373253',
                type: 'bn',
                domain: 'hdbkome.com',
                refresh: false,
                next: 0
            });
            
            const s = document.createElement('script');
            s.async = true;
            s.charset = 'utf-8';
            s.setAttribute('data-cfasync', 'false');
            s.src = 'https://hdbkome.com/89t5gk2n.js';
            if (document.head) {
                document.head.appendChild(s);
            }
            
            // Добавление обработчиков событий для проверки кликов по ссылкам историй
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
