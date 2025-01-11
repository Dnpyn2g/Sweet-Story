function includeHTML(id, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(error => console.error(error));
}

// Вставляем шапку, подвал, сайдбар и комментарии
includeHTML("sidebar", "sidebar.html");

