document.addEventListener('DOMContentLoaded', () => {
    // Логика комментариев
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    // Получаем уникальный ID истории
    const storyId = commentForm.getAttribute('data-story-id');

    // Загружаем сохранённые комментарии из LocalStorage
    const savedComments = JSON.parse(localStorage.getItem(storyId)) || [];

    // Функция для отображения комментариев
    function renderComments() {
        commentsList.innerHTML = savedComments.map(comment => `
            <div class="comment">
                <p class="author"><strong>${comment.name}:</strong></p>
                <p>${comment.text}</p>
            </div>
        `).join('');
    }

    renderComments();

    // Обработка отправки комментариев
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('comment-name').value.trim();
        const comment = document.getElementById('comment-text').value.trim();

        if (name && comment) {
            const newComment = { name, text: comment };
            savedComments.push(newComment);

            // Сохранение комментариев в LocalStorage
            localStorage.setItem(storyId, JSON.stringify(savedComments));

            // Перерисовка комментариев
            renderComments();

            // Очистка формы
            commentForm.reset();
        } else {
            alert('Пожалуйста, заполните все поля!');
        }
    });

    // Загрузка блока "Также читают"
    const relatedReadsElement = document.getElementById('related-reads');
    if (relatedReadsElement) {
        fetch('related-reads.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка загрузки блока: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                relatedReadsElement.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
                relatedReadsElement.innerHTML = '<p>Не удалось загрузить блок "Также читают".</p>';
            });
    } else {
        console.warn('Элемент для блока "Также читают" не найден.');
    }
});
