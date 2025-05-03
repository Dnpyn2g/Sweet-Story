from flask import Flask, request, redirect, url_for, render_template_string, send_from_directory
import os
import json
from PIL import Image  # <-- добавляем Pillow

app = Flask(__name__)






# Определяем папку, где лежит этот скрипт
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Путь к вашему JSON файлу в папке со скриптом
JSON_FILE_PATH = os.path.join(BASE_DIR, 'stories.json')

# Директория для изображений внутри папки со скриптом
IMAGES_FOLDER = os.path.join(BASE_DIR, 'images')
os.makedirs(IMAGES_FOLDER, exist_ok=True)  # Создание директории, если её нет

# Разрешенные форматы изображений
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Проверка расширения файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS








# Добавьте эту функцию маршрута и шаблон в существующий Flask
import os
from flask import Flask, render_template_string, request, flash, redirect, url_for
import re

# Настройка приложения Flask
app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Для работы flash-сообщений
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Таблица замены символов
def transliterate(text):
    replacements = {
        'а': 'a',
        'е': 'e',
        'о': 'o',
        'р': 'p',
        'с': 'c',
        'у': 'y',
        'х': 'x',
        'А': 'A',
        'Е': 'E',
        'О': 'O',
        'Р': 'P',
        'С': 'C',
        'У': 'Y',
        'Х': 'X'
    }
    replaced_count = 0
    result_text = []
    for char in text:
        if char in replacements:
            replaced_count += 1
        result_text.append(replacements.get(char, char))
    return ''.join(result_text), replaced_count

# Примитивная проверка на совпадения с известными шаблонами авторского текста
def check_copyright_violations(text):
    common_phrases = [
        "все права защищены", "не для распространения", "авторское право", "copyright"
    ]
    for phrase in common_phrases:
        if re.search(re.escape(phrase), text, re.IGNORECASE):
            return True
    return False

@app.route('/transliterate', methods=['GET', 'POST'])
def transliterate_page():
    result_text = None
    replaced_count = 0
    copyright_violation = False

    if request.method == 'POST':
        if 'reset' in request.form:
            return redirect(url_for('transliterate_page'))
        elif 'textfile' in request.files:
            file = request.files['textfile']
            if file and file.filename.endswith('.txt'):
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(file_path)
                with open(file_path, 'r', encoding='utf-8') as f:
                    original_text = f.read()
                    copyright_violation = check_copyright_violations(original_text)
                    result_text, replaced_count = transliterate(original_text)
            else:
                flash('Пожалуйста, загрузите файл в формате .txt')
                return redirect(url_for('transliterate_page'))
        else:
            flash('Файл не был загружен или выбран неверный тип файла.')
            return redirect(url_for('transliterate_page'))

    return render_template_string('''
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Транслитерация текста</title>
        <style>
            body { font-family: 'Roboto', sans-serif; background-color: #121212; color: #e0e0e0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; background: #1e1e1e; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7); }
            h1 { text-align: center; color: #bb86fc; }
            form { display: flex; flex-direction: column; gap: 15px; }
            input[type="file"] { padding: 10px; background-color: #2b2b2b; color: #e0e0e0; border: 1px solid #444; border-radius: 5px; }
            button { padding: 12px; background-color: #bb86fc; color: #121212; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; }
            button:hover { background-color: #3700b3; }
            textarea { width: 100%; height: 400px; padding: 12px; background-color: #2b2b2b; color: #e0e0e0; border: 1px solid #444; border-radius: 5px; font-family: monospace; }
            .info { margin-top: 15px; font-size: 1em; color: #bbb; }
            .copy-btn, .reset-btn, .back-btn { margin-top: 10px; padding: 12px; color: #121212; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; }
            .copy-btn { background-color: #007BFF; }
            .copy-btn:hover { background-color: #0056b3; }
            .reset-btn { background-color: #f44336; }
            .reset-btn:hover { background-color: #d32f2f; }
            .back-btn { background-color: #8bc34a; }
            .back-btn:hover { background-color: #689f38; }
            .flash-message { color: #ff4d4d; font-size: 1em; text-align: center; }
            .warning-message { color: #ffa500; font-size: 1.2em; font-weight: bold; text-align: center; }
        </style>
        <script>
            function copyText() {
                const textArea = document.getElementById('resultTextArea');
                textArea.select();
                document.execCommand('copy');
                alert('Текст скопирован в буфер обмена!');
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>Загрузка и транслитерация текста</h1>
            {% with messages = get_flashed_messages() %}
                {% if messages %}
                    <div class="flash-message">{{ messages[0] }}</div>
                {% endif %}
            {% endwith %}
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="textfile" accept=".txt" required {% if result_text %}disabled{% endif %}>
                <button type="submit" {% if result_text %}disabled{% endif %}>Загрузить и преобразовать</button>
            </form>
            {% if result_text %}
            <h2 style="color: #bb86fc;">Преобразованный текст:</h2>
            <textarea id="resultTextArea" readonly>{{ result_text }}</textarea>
            <div class="info">Количество изменённых символов: {{ replaced_count }}</div>
            {% if copyright_violation %}
                <div class="warning-message">⚠️ Обнаружены возможные нарушения авторских прав!</div>
            {% endif %}
            <form method="POST">
                <button class="copy-btn" type="button" onclick="copyText()">Скопировать весь текст</button>
                <button class="reset-btn" name="reset">Сделать новый текст</button>
                <a href="/" class="back-btn" style="display: inline-block; text-align: center; text-decoration: none;">Вернуться на страницу с историями</a>
            </form>
            {% endif %}
        </div>
    </body>
    </html>
    ''', result_text=result_text, replaced_count=replaced_count)





HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRM: Управление Историями JSON</title>
    <style>
        body { font-family: 'Roboto', sans-serif; line-height: 1.8; margin: 0; padding: 0; background-color: #121212; color: #e0e0e0; }
        header { background-color: #1f1f1f; color: #ffffff; padding: 15px 20px; text-align: center; }
        header h1 { margin: 0; font-size: 2.5em; }
        nav { background-color: #333; padding: 10px; display: flex; justify-content: space-around; }
        nav a { color: #e0e0e0; text-decoration: none; font-size: 1.2em; padding: 10px 15px; border-radius: 4px; transition: background-color 0.3s; }
        nav a:hover { background-color: #bb86fc; color: #121212; }
        main { padding: 20px; max-width: 1000px; margin: 20px auto; background-color: #1e1e1e; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); }
        .story { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; padding: 15px; background: #2b2b2b; border: 1px solid #444; border-radius: 8px; transition: box-shadow 0.3s, transform 0.3s; }
        .story:hover { transform: translateY(-5px); box-shadow: 0 6px 10px rgba(0, 0, 0, 0.7); }
        .story h2 { margin: 0; font-size: 1.8em; color: #bb86fc; }
        .story img { width: 100%; max-width: 300px; margin: 0 auto; border-radius: 8px; object-fit: cover; }
        .story-content { display: flex; flex-direction: column; justify-content: space-between; }
        .story p { margin: 10px 0; }
        .views { color: #888; font-size: 0.9em; }
        .content { display: none; opacity: 0; transition: opacity 0.3s ease-in-out; }
        .content.show { display: block; opacity: 1; }
        button { padding: 10px 15px; border: none; border-radius: 4px; background-color: #bb86fc; color: #121212; font-size: 1em; cursor: pointer; transition: background-color 0.3s, transform 0.2s; }
        button:hover { background-color: #3700b3; transform: scale(1.05); }
        a { color: #bb86fc; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
        form { margin-bottom: 20px; display: flex; gap: 10px; }
        input[type="text"] { padding: 10px; width: 100%; border: 1px solid #333; border-radius: 4px; background: #2b2b2b; color: #e0e0e0; }
        .stats { background-color: #1f1f1f; color: #bb86fc; padding: 10px 15px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); font-size: 0.9em; margin-top: 20px; }
        footer { background-color: #1f1f1f; padding: 10px; color: #bbb; text-align: center; font-size: 0.9em; margin-top: 20px; border-top: 1px solid #333; }
        .story-tools { display: flex; gap: 15px; margin-top: 10px; }
        .story-tools a { padding: 8px 12px; border-radius: 4px; text-decoration: none; }
        .story-tools a.edit { background-color: #2d7b2d; color: white; }
        .story-tools a.edit:hover { background-color: #1e581e; }
        .story-tools a.delete { background-color: #a80000; color: white; }
        .story-tools a.delete:hover { background-color: #750000; }
        .highlight { background-color: #333333; padding: 5px; border-radius: 4px; font-style: italic; }
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
        <h1>CRM: Управление Историями</h1>
    </header>
    <nav>
        <a href="/">Главная</a>
        <a href="/add">Добавить историю</a>
        <a href="/transliterate">ФРОД ТЕКСТА</a>
        <a href="/optimistka">Оптимистка</a>
    </nav>

    <main>
        <form method="get" action="/">
            <input type="text" name="query" placeholder="Поиск историй..." value="{{ query }}">
            <button type="submit">Поиск</button>
        </form>

        <div>
            {% for story in stories %}
            <div class="story">
                {% if story['image'] %}
                <img src="{{ story['image'] }}" alt="Изображение {{ story['title'] }}">
                {% endif %}
                <div class="story-content">
                    <h2>{{ story['title'] }}</h2>
                    <p><strong>ID:</strong> <span class="highlight">{{ story['id'] }}</span></p>
                    <p class="views"><strong>Просмотры:</strong> <span class="highlight">{{ story['views'] }}</span></p>
                    <p id="content-{{ story['id'] }}" class="content">{{ story['content'] }}</p>
                    <p><strong>Ссылка:</strong> <a href="https://sweet-story.online/story1.html?id={{ story['id'] }}" target="_blank">https://sweet-story.online/story1.html?id={{ story['id'] }}</a></p>
                    <button id="button-{{ story['id'] }}" onclick="toggleContent({{ story['id'] }})">Показать все</button>
                    <div class="story-tools">
                        <a href="/edit/{{ story['id'] }}" class="edit">Редактировать</a>
                        <a href="/delete/{{ story['id'] }}" class="delete">Удалить</a>
                    </div>
                </div>
            </div>
            {% endfor %}
        </div>

        <div class="stats">
            <p>Общее количество историй: {{ stories|length }}</p>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 CRM Истории JSON | Все права защищены</p>
    </footer>
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
            
            # Сортируем по id в обратном порядке (последняя добавленная история первой)
            stories.sort(key=lambda x: x['id'], reverse=True)
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
            if file.filename.lower().endswith('.txt'):
                content = file.read().decode('utf-8')
            else:
                return "Файл должен быть формата .txt", 400
        else:
            return "Файл с историей не был загружен", 400

        # Обработка изображения
        if 'image' in request.files:
            image = request.files['image']
            if image and allowed_file(image.filename):
                # Определяем название выходного WebP-файла
                webp_filename = f"{image_number}.webp"
                webp_path = os.path.join(IMAGES_FOLDER, webp_filename)

                # Открываем через Pillow и конвертируем в WebP
                try:
                    img = Image.open(image.stream)
                    img.save(webp_path, 'WEBP')
                except Exception as e:
                    print(f"Ошибка конвертации изображения: {e}")
                    return "Не удалось обработать изображение", 500
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
            # всегда указываем .webp
            "image": f"images/{webp_filename}",
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

