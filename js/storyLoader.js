document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    function loadStory() {
        const storyContent = document.getElementById('story-content');
        storyContent.innerHTML = '<strong>Загрузка...</strong>';

        fetch('stories.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке истории');
                }
                return response.json();
            })
            .then(stories => {
                const story = stories.find(item => item.id == storyId);
                if (story) {
                    document.getElementById('story-title').innerText = story.title;
                    document.getElementById('story-title-main').innerText = story.title;
                    document.getElementById('story-views').innerText = `Просмотрено: ${story.views} человек`;
                    document.getElementById('story-image').src = story.image;
                    document.getElementById('story-image').alt = story.title;
                    storyContent.innerText = story.content;

                    const currentUrl = `https://sweet-story.online?id=${story.id}`;
                    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(story.title)}`;
                    document.getElementById('share-facebook').href = facebookShareUrl;
                } else {
                    document.querySelector('.story').innerHTML = '<p>История не найдена!</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки истории:', error);
                document.querySelector('.story').innerHTML = '<p>Произошла ошибка при загрузке данных. Попробуйте позже.</p>';
            });
    }

    function loadSidebar() {
        fetch('stories.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке сайдбара');
                }
                return response.json();
            })
            .then(stories => {
                const sidebar = document.querySelector('.sidebar ul');
                sidebar.innerHTML = '';

                const randomStories = stories.sort(() => 0.5 - Math.random()).slice(0, 9);

                randomStories.forEach(story => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="story1.html?id=${story.id}">${story.title}</a>`;
                    sidebar.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки историй для сайдбара:', error);
                document.querySelector('.sidebar ul').innerHTML = '<li>Не удалось загрузить истории. Попробуйте позже.</li>';
            });
    }

    function loadComments() {
        fetch('comments.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке комментариев');
                }
                return response.json();
            })
            .then(comments => {
                const commentsSection = document.getElementById('comments-section');
                commentsSection.innerHTML = '';

                if (comments.length > 0) {
                    const randomComments = comments.sort(() => 0.5 - Math.random()).slice(0, 3);

                    randomComments.forEach(comment => {
                        const commentBlock = document.createElement('div');
                        commentBlock.style.borderBottom = '1px solid #ddd';
                        commentBlock.style.marginBottom = '10px';
                        commentBlock.style.paddingBottom = '10px';

                        commentBlock.innerHTML = `
                            <p><strong>${comment.author}</strong></p>
                            <p>${comment.text}</p>
                        `;
                        commentsSection.appendChild(commentBlock);
                    });
                } else {
                    commentsSection.innerHTML = '<p style="text-align: center;">Здесь пока нет комментариев. Будьте первым!</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки комментариев:', error);
                document.getElementById('comments-section').innerHTML = '<p style="text-align: center;">Не удалось загрузить комментарии. Попробуйте позже.</p>';
            });
    }

    // Вызов функций загрузки
    loadStory();
    loadSidebar();
    loadComments();
});
