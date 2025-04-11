document.addEventListener('DOMContentLoaded', function() {
    // Пример: создаём массив с данными историй.
    // В реальном проекте данные можно получать через AJAX или fetch.
    var stories = [];
    for (var i = 0; i < 20; i++) {
        stories.push({
            title: "История " + (i + 1),
            content: "Содержимое истории номер " + (i + 1) + "..."
        });
    }

    var currentPage = 1;
    var storiesPerPage = 5; // Количество историй на одной странице
    var storyGallery = document.getElementById("story-gallery");
    var paginationElement = document.getElementById("pagination");

    // Функция для отображения историй текущей страницы
    function displayStories(page) {
        storyGallery.innerHTML = "";
        var start = (page - 1) * storiesPerPage;
        var end = start + storiesPerPage;
        var pageStories = stories.slice(start, end);

        pageStories.forEach(function(story) {
            var article = document.createElement('article');
            var title = document.createElement('h3');
            title.innerText = story.title;
            var content = document.createElement('p');
            content.innerText = story.content;
            article.appendChild(title);
            article.appendChild(content);
            storyGallery.appendChild(article);
        });
        updatePagination();
    }

    // Функция для создания и обновления элементов пагинации
    function updatePagination() {
        // Очищаем блок пагинации
        paginationElement.innerHTML = "";
        var totalPages = Math.ceil(stories.length / storiesPerPage);

        // Кнопка "Предыдущая"
        var prevButton = document.createElement('button');
        prevButton.innerText = "Предыдущая";
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayStories(currentPage);
            }
        });
        paginationElement.appendChild(prevButton);

        // Кнопки с номерами страниц
        for (var i = 1; i <= totalPages; i++) {
            var pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            // Используем IIFE для привязки переменной i
            (function(page) {
                pageButton.addEventListener('click', function() {
                    currentPage = page;
                    displayStories(currentPage);
                });
            })(i);
            paginationElement.appendChild(pageButton);
        }

        // Кнопка "Следующая"
        var nextButton = document.createElement('button');
        nextButton.innerText = "Следующая";
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                displayStories(currentPage);
            }
        });
        paginationElement.appendChild(nextButton);
    }

    // Изначальное отображение первой страницы
    displayStories(currentPage);
});
