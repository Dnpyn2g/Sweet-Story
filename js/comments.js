document.addEventListener("DOMContentLoaded", function () {
    // Загрузка комментариев
    fetch('comments.json')
        .then(response => response.json())
        .then(comments => {
            const commentsSection = document.getElementById('comments-section');
            commentsSection.innerHTML = '';

            // Добавляем заголовок блока комментариев
            const commentsTitle = document.createElement('h2');
            commentsTitle.textContent = 'Комментарии';
            commentsSection.appendChild(commentsTitle);

            // Контейнер для списка комментариев
            const commentsList = document.createElement('div');
            commentsList.id = 'comments-list';
            commentsSection.appendChild(commentsList);

            // Выбор случайных 3-4 комментариев
            const shuffledComments = comments.sort(() => 0.5 - Math.random());
            const selectedComments = shuffledComments.slice(0, Math.floor(Math.random() * 2) + 3); // 3 или 4 комментария

            selectedComments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `<p><strong>${comment.author}</strong>: ${comment.text}</p>`;
                commentsList.appendChild(commentElement);
            });

            // Блок для добавления комментария
            const addCommentBlock = document.createElement('div');
            addCommentBlock.className = 'add-comment';

            const newCommentInput = document.createElement('textarea');
            newCommentInput.id = 'new-comment';
            newCommentInput.placeholder = 'Напишите комментарий...';
            newCommentInput.rows = 3;
            addCommentBlock.appendChild(newCommentInput);

            const submitButton = document.createElement('button');
            submitButton.id = 'submit-comment';
            submitButton.textContent = 'Добавить комментарий';
            addCommentBlock.appendChild(submitButton);

            commentsSection.appendChild(addCommentBlock);

            // Добавление нового комментария
            submitButton.addEventListener('click', () => {
                const newCommentText = newCommentInput.value;
                if (newCommentText.trim() !== '') {
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = `<p><strong>Вы</strong>: ${newCommentText}</p>`;
                    commentsList.appendChild(newComment);
                    newCommentInput.value = '';
                }
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки комментариев:', error);
            const commentsSection = document.getElementById('comments-section');
            commentsSection.innerHTML = '<p>Ошибка загрузки комментариев.</p>';
        });
});
