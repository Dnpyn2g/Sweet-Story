document.addEventListener('DOMContentLoaded', () => {
    // Логика комментариев
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('comment-name').value.trim();
        const comment = document.getElementById('comment-text').value.trim();

        if (name && comment) {
            const commentElement = document.createElement('div');
            commentElement.classList.add('comment');

            const authorElement = document.createElement('p');
            authorElement.classList.add('author');
            authorElement.textContent = name;

            const textElement = document.createElement('p');
            textElement.textContent = comment;

            commentElement.appendChild(authorElement);
            commentElement.appendChild(textElement);

            commentsList.appendChild(commentElement);

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
