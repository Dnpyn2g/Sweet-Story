// sidebar.js
window.onload = function() {
    fetch('sidebar.html')  // Путь к файлу сайдбара
        .then(response => response.text())
        .then(data => {
            // Вставляем содержимое сайдбара в элемент с классом "sidebar-container"
            document.querySelector('.sidebar-container').innerHTML = data;
        })
        .catch(error => console.error('Ошибка при загрузке сайдбара:', error));
}
