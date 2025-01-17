from flask import Flask, render_template_string, request, redirect, url_for, jsonify
import json
import os

app = Flask(__name__)

# Путь к вашему JSON файлу
JSON_FILE_PATH = r'C:\Users\t460s\Documents\GitHub\Sweet-Story\stories.json'
# Директория для изображений
IMAGES_FOLDER = r'C:\Users\t460s\Documents\GitHub\Sweet-Story\images'
os.makedirs(IMAGES_FOLDER, exist_ok=True)  # Создание директории, если её нет

# Разрешенные форматы изображений
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Проверка расширения файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# HTML шаблон для отображения содержимого JSON
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Истории JSON</title>
    <style>
        body { font-family: 'Roboto', sans-serif; line-height: 1.8; margin: 0; padding: 0; background-color: #121212; color: #e0e0e0; }
        header { background-color: #1f1f1f; color: #ffffff; padding: 10px 20px; text-align: center; }
        header h1 { margin: 0; font-size: 2.5em; }
        main { padding: 20px; max-width: 800px; margin: 0 auto; }
        .story { margin-bottom: 20px; padding: 15px; background: #1e1e1e; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); transition: transform 0.3s, box-shadow 0.3s; }
        .story:hover { transform: translateY(-5px); box-shadow: 0 6px 10px rgba(0, 0, 0, 0.7); }
        .story h2 { margin: 0; font-size: 1.8em; color: #bb86fc; }
        .story img { width: 100%; max-width: 400px; margin: 10px 0; border-radius: 8px; }
        .story p { margin: 10px 0; }
        .views { color: #888; font-size: 0.9em; }
        .content { display: none; opacity: 0; transition: opacity 0.3s ease-in-out; }
        .content.show { display: block; opacity: 1; }
        button { padding: 10px 15px; border: none; border-radius: 4px; background-color: #bb86fc; color: #121212; font-size: 1em; cursor: pointer; transition: background-color 0.3s, transform 0.2s; }
        button:hover { background-color: #3700b3; transform: scale(1.05); }
        a { color: #bb86fc; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        form { margin-bottom: 20px; }
        input[type="text"] { padding: 10px; width: calc(100% - 22px); border: 1px solid #333; border-radius: 4px; background: #2b2b2b; color: #e0e0e0; }
    </style>
    <script>
        function toggleContent(id) {
            const content = document.getElementById('content-' + id);
            const button = document.getElementById('button-' + id);
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                button.textContent = 'Показать все';
            } else {
                content.classList.add('show');
                button.textContent = 'Скрыть';
            }
        }
    </script>
</head>
<body>
<header>
    <h1>Истории JSON</h1>
</header>
<main>
    <form method="get" action="/">
        <input type="text" name="query" placeholder="Поиск историй..." value="{{ query }}">
        <button type="submit">Поиск</button>
    </form>
    <a href="/add" style="margin-top: 20px; display: inline-block;">Добавить историю</a>
    <hr>
    {% for story in stories %}
    <div class="story">
        <h2>{{ story['title'] }}</h2>
        {% if story['image'] %}
        <img src="{{ story['image'] }}" alt="Изображение {{ story['title'] }}">
        {% endif %}
        <p><strong>ID:</strong> {{ story['id'] }}</p>
        <p class="views"><strong>Просмотры:</strong> {{ story['views'] }}</p>
        <p id="content-{{ story['id'] }}" class="content">{{ story['content'] }}</p>
        <button id="button-{{ story['id'] }}" onclick="toggleContent({{ story['id'] }})">Показать все</button>
        <a href="/edit/{{ story['id'] }}" style="display:inline-block; margin-top:10px;">Редактировать</a>
        <a href="/delete/{{ story['id'] }}" style="display:inline-block; margin-top:10px; color: red;">Удалить</a>
    </div>
    {% endfor %}
</main>
</body>
</html>
"""


# HTML шаблон для добавления истории
ADD_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Добавить историю</title>
    <style>
        body { font-family: 'Roboto', sans-serif; line-height: 1.8; margin: 0; padding: 20px; background-color: #121212; color: #e0e0e0; }
        main { max-width: 600px; margin: 0 auto; background: #1e1e1e; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); }
        h1 { color: #bb86fc; }
        form { display: flex; flex-direction: column; }
        label { margin-top: 10px; font-weight: bold; }
        input, textarea { margin-top: 5px; padding: 10px; border: 1px solid #333; border-radius: 4px; background: #2b2b2b; color: #e0e0e0; font-size: 1em; }
        button { margin-top: 20px; padding: 10px 15px; border: none; border-radius: 4px; background-color: #bb86fc; color: #121212; font-size: 1em; cursor: pointer; transition: background-color 0.3s, transform 0.2s; }
        button:hover { background-color: #3700b3; transform: scale(1.05); }
        .instructions { margin-top: 20px; padding: 10px; background-color: #2b2b2b; border-radius: 8px; color: #bbb; font-size: 0.9em; }
    </style>
</head>
<body>
<main>
    <h1>Добавить новую историю</h1>
    <form method="post" enctype="multipart/form-data">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" name="title" required>

        <label for="views">Просмотры:</label>
        <input type="text" id="views" name="views" required>

        <label for="image_number">Номер изображения:</label>
        <input type="number" id="image_number" name="image_number" min="1" required>

        <label for="image">Изображение:</label>
        <input type="file" id="image" name="image" accept="image/*" required>

        <label for="file">Файл истории (.txt):</label>
        <input type="file" id="file" name="file" accept=".txt" required>

        <button type="submit">Добавить историю</button>
    </form>
    <div class="instructions">
        <p><strong>Инструкция:</strong></p>
        <ul>
            <li>Заполните все обязательные поля формы.</li>
            <li>Файл истории должен быть в формате <strong>.txt</strong>.</li>
            <li>Изображение должно быть в формате <strong>JPG</strong>.</li>
            <li>После успешного добавления история появится в списке.</li>
        </ul>
    </div>
</main>
</body>
</html>
"""

EDIT_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Редактировать историю</title>
    <style>
        body { font-family: 'Roboto', sans-serif; line-height: 1.8; margin: 0; padding: 20px; background-color: #121212; color: #e0e0e0; }
        main { max-width: 600px; margin: 0 auto; background: #1e1e1e; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); }
        h1 { color: #bb86fc; }
        form { display: flex; flex-direction: column; }
        label { margin-top: 10px; font-weight: bold; }
        input, textarea { margin-top: 5px; padding: 10px; border: 1px solid #333; border-radius: 4px; background: #2b2b2b; color: #e0e0e0; font-size: 1em; }
        button { margin-top: 20px; padding: 10px 15px; border: none; border-radius: 4px; background-color: #bb86fc; color: #121212; font-size: 1em; cursor: pointer; transition: background-color 0.3s, transform 0.2s; }
        button:hover { background-color: #3700b3; transform: scale(1.05); }
    </style>
</head>
<body>
<main>
    <h1>Редактировать историю</h1>
    <form method="post">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" name="title" value="{{ story['title'] }}" required>

        <label for="views">Просмотры:</label>
        <input type="text" id="views" name="views" value="{{ story['views'] }}" required>

        <label for="content">Содержание:</label>
        <textarea id="content" name="content" rows="10" required>{{ story['content'] }}</textarea>

        <button type="submit">Сохранить изменения</button>
    </form>
</main>
</body>
</html>
"""

@app.route('/')
def show_json():
    query = request.args.get('query', '').lower()
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
            stories = json.load(file)
            if query:
                stories = [story for story in stories if query in story['title'].lower() or query in story['content'].lower()]
    except Exception as e:
        stories = []
        print(f"Ошибка чтения JSON файла: {e}")

    return render_template_string(HTML_TEMPLATE, stories=stories, query=query)

@app.route('/edit/<int:story_id>', methods=['GET', 'POST'])
def edit_story(story_id):
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
            stories = json.load(file)
    except Exception as e:
        print(f"Ошибка чтения JSON файла: {e}")
        return "Ошибка загрузки историй.", 500

    story = next((s for s in stories if s['id'] == story_id), None)
    if not story:
        return "История не найдена.", 404

    if request.method == 'POST':
        # Обновление данных истории
        story['title'] = request.form.get('title', story['title'])
        story['views'] = request.form.get('views', story['views'])
        story['content'] = request.form.get('content', story['content'])

        try:
            with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
                json.dump(stories, file, ensure_ascii=False, indent=4)
        except Exception as e:
            print(f"Ошибка сохранения JSON файла: {e}")
            return "Ошибка сохранения истории.", 500

        return redirect(url_for('show_json'))

    return render_template_string(EDIT_TEMPLATE, story=story)

@app.route('/add', methods=['GET', 'POST'])
def add_story():
    if request.method == 'POST':
        title = request.form.get('title')
        views = request.form.get('views')
        image_number = request.form.get('image_number')
        content = ""

        # Обработка файла истории
        if 'file' in request.files:
            file = request.files['file']
            if file.filename.endswith('.txt'):
                content = file.read().decode('utf-8')
            else:
                return "Файл должен быть формата .txt", 400
        else:
            return "Файл с историей не был загружен", 400

        # Обработка изображения
        if 'image' in request.files:
            image = request.files['image']
            if image and allowed_file(image.filename):
                image_filename = f"{image_number}.{image.filename.rsplit('.', 1)[1].lower()}"
                image_path = os.path.join(IMAGES_FOLDER, image_filename)
                image.save(image_path)
            else:
                return "Неверный формат изображения", 400
        else:
            return "Изображение не было загружено", 400

        # Чтение существующего JSON файла
        try:
            with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
                stories = json.load(file)
        except FileNotFoundError:
            stories = []

        # Добавление новой истории
        new_story = {
            "id": len(stories) + 1,
            "title": title,
            "views": views,
            "image": f"images/{image_filename}",
            "content": content
        }
        stories.append(new_story)

        # Сохранение в JSON файл
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(stories, file, ensure_ascii=False, indent=4)

        return redirect(url_for('show_json'))

    return render_template_string(ADD_TEMPLATE)

@app.route('/delete/<int:story_id>', methods=['GET'])
def delete_story(story_id):
    try:
        with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
            stories = json.load(file)
    except Exception as e:
        print(f"Ошибка чтения JSON файла: {e}")
        return "Ошибка загрузки историй.", 500

    story = next((s for s in stories if s['id'] == story_id), None)
    if not story:
        return "История не найдена.", 404

    stories = [s for s in stories if s['id'] != story_id]

    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(stories, file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Ошибка сохранения JSON файла: {e}")
        return "Ошибка удаления истории.", 500

    return redirect(url_for('show_json'))





from flask import send_from_directory

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_FOLDER, filename)



if __name__ == '__main__':
    app.run(debug=True)
