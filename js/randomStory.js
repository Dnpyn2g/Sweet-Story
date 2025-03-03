document.addEventListener('DOMContentLoaded', function () {
    // URL файла с историями
    const storiesURL = 'stories.json';

    // Функция для загрузки данных
    fetch(storiesURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
            }
            return response.json();
        })
        .then(stories => {
            if (!stories || stories.length === 0) {
                throw new Error('Файл stories.json пуст или данные недоступны.');
            }

            // Выбираем случайную историю
            const randomStory = stories[Math.floor(Math.random() * stories.length)];

            // Проверяем, чтобы все данные были доступны
            const { id, image, title, shortText, content, views } = randomStory;

            if (!id || !image || !title || typeof views === 'undefined') {
                throw new Error('Некорректная структура данных случайной истории.');
            }

            // Генерация HTML для случайной истории
            const storyContent = `
                <div class="random-story-image" style="flex: 1; max-width: 150px;">
                    <a href="story1.html?id=${id}">
                        <img src="${image}" alt="${title}" style="width: 100%; height: auto; border-radius: 5px;">
                    </a>
                </div>
                <div class="random-story-details" style="flex: 3; text-align: left;">
                    <h3>${title}</h3>
                    <p>${shortText || content.substring(0, 100) + '...'}</p>
                    <p style="color: gray; font-size: 0.9em;">Просмотры: ${views}</p>
                    <a href="story1.html?id=${id}" style="color: var(--primary-color); font-weight: bold;">Читать всю историю</a>
                </div>
            `;

            // Вставка HTML в контейнер
            const randomStoryContainer = document.getElementById('random-story-content');
            randomStoryContainer.innerHTML = storyContent;
        })
        .catch(error => {
            console.error('Ошибка:', error.message);

            // Вывод сообщения об ошибке
            const randomStoryContainer = document.getElementById('random-story-content');
            randomStoryContainer.innerHTML = '<p>Не удалось загрузить случайную историю. Попробуйте позже.</p>';
        });
});
