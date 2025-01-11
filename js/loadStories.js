fetch('stories.json')
    .then(response => response.json())
    .then(stories => {
        const storyList = document.getElementById('story-list');
        stories.forEach(story => {
            const storyElement = `
                <div class="story">
                    <h2>${story.title}</h2>
                    <p><strong>Автор:</strong> ${story.author}</p>
                    <p><strong>Просмотры:</strong> ${story.views}</p>
                    <a href="${story.url}">Читать дальше</a>
                </div>
            `;
            storyList.innerHTML += storyElement;
        });
    })
    .catch(error => console.error('Ошибка загрузки историй:', error));
