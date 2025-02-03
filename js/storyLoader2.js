document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    function loadArticle() {
        const articleContent = document.getElementById('article-content');
        articleContent.innerHTML = '<strong>Загрузка...</strong>';

        fetch('articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке статьи');
                }
                return response.json();
            })
            .then(articles => {
                const article = articles.find(item => item.id == articleId);
                if (article) {
                    document.getElementById('article-title').innerText = article.title;
                    document.getElementById('article-title-main').innerText = article.title;
                    document.getElementById('article-views').innerText = `Просмотры: ${article.views}`;
                    document.getElementById('article-image').src = article.image;
                    document.getElementById('article-image').alt = article.title;
                    articleContent.innerHTML = article.content;
                } else {
                    articleContent.innerHTML = '<p>Статья не найдена!</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки статьи:', error);
                document.querySelector('.article').innerHTML = '<p>Произошла ошибка при загрузке данных. Попробуйте позже.</p>';
            });
    }

    function loadSidebar() {
        fetch('articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке сайдбара');
                }
                return response.json();
            })
            .then(articles => {
                const sidebar = document.querySelector('.sidebar ul');
                sidebar.innerHTML = '';

                // Сортировка по убыванию просмотров и вывод 5 самых популярных статей
                const popularArticles = articles.sort((a, b) => b.views - a.views).slice(0, 5);

                popularArticles.forEach(article => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="article.html?id=${article.id}">${article.title} <span class="views">(${article.views} просмотров)</span></a>`;
                    sidebar.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки статей для сайдбара:', error);
                document.querySelector('.sidebar ul').innerHTML = '<li>Не удалось загрузить статьи. Попробуйте позже.</li>';
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

                const articleComments = comments.filter(comment => comment.articleId == articleId);

                if (articleComments.length > 0) {
                    articleComments.forEach(comment => {
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
    loadArticle();
    loadSidebar();
    loadComments();
});
