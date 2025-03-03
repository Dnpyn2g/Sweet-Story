document.addEventListener('DOMContentLoaded', () => {
    const facebookShareButton = document.getElementById('share-facebook');

    if (facebookShareButton) {
        facebookShareButton.addEventListener('click', (event) => {
            event.preventDefault();

            // Получаем текущие метаданные истории
            const storyTitle = document.getElementById('story-title-main').textContent || 'Sweet Story';
            const storyUrl = window.location.href;

            // Формируем ссылку на Facebook
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(storyUrl)}&quote=${encodeURIComponent(storyTitle)}`;

            // Открываем новое окно для шаринга
            window.open(facebookShareUrl, '_blank', 'width=600,height=400');
        });
    }
});
