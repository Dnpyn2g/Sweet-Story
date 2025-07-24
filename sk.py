from flask import Flask, request, redirect, url_for, render_template_string, send_from_directory, flash
import os
import json
import re
from PIL import Image  # <-- добавляем Pillow

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Для работы flash-сообщений
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Определяем папку, где лежит этот скрипт
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Четыре JSON-файла, в которых хранятся истории
JSON_FILES = [
    os.path.join(BASE_DIR, 'data', 'stories-1.json'),
    os.path.join(BASE_DIR, 'data', 'stories-2.json'),
    os.path.join(BASE_DIR, 'data', 'stories-3.json'),
    os.path.join(BASE_DIR, 'data', 'stories-4.json'),
    os.path.join(BASE_DIR, 'data', 'stories-5.json'),
    os.path.join(BASE_DIR, 'data', 'stories-6.json'),
    os.path.join(BASE_DIR, 'data', 'stories-7.json'),
    os.path.join(BASE_DIR, 'data', 'stories-8.json'),
    os.path.join(BASE_DIR, 'data', 'stories-9.json'),
    os.path.join(BASE_DIR, 'data', 'stories-10.json'),
    os.path.join(BASE_DIR, 'data', 'stories-11.json'),
    os.path.join(BASE_DIR, 'data', 'stories-12.json'),
    os.path.join(BASE_DIR, 'data', 'stories-13.json'),
    os.path.join(BASE_DIR, 'data', 'stories-14.json'),
    os.path.join(BASE_DIR, 'data', 'stories-15.json'),
    os.path.join(BASE_DIR, 'data', 'stories-16.json'),
    os.path.join(BASE_DIR, 'data', 'stories-17.json'),
    os.path.join(BASE_DIR, 'data', 'stories-18.json'),
    os.path.join(BASE_DIR, 'data', 'stories-19.json'),
    os.path.join(BASE_DIR, 'data', 'stories-20.json'),
    os.path.join(BASE_DIR, 'data', 'stories-21.json'),
    os.path.join(BASE_DIR, 'data', 'stories-22.json'),
    os.path.join(BASE_DIR, 'data', 'stories-23.json'),
    os.path.join(BASE_DIR, 'data', 'stories-24.json'),
    os.path.join(BASE_DIR, 'data', 'stories-25.json'),
    os.path.join(BASE_DIR, 'data', 'stories-26.json'),
    os.path.join(BASE_DIR, 'data', 'stories-27.json'),
    os.path.join(BASE_DIR, 'data', 'stories-28.json'),
    os.path.join(BASE_DIR, 'data', 'stories-29.json'),
    os.path.join(BASE_DIR, 'data', 'stories-30.json'),
    os.path.join(BASE_DIR, 'data', 'stories-31.json'),
    os.path.join(BASE_DIR, 'data', 'stories-32.json'),
    os.path.join(BASE_DIR, 'data', 'stories-33.json'),
    os.path.join(BASE_DIR, 'data', 'stories-34.json'),
    os.path.join(BASE_DIR, 'data', 'stories-35.json'),
    os.path.join(BASE_DIR, 'data', 'stories-36.json'),
    os.path.join(BASE_DIR, 'data', 'stories-37.json'),
    os.path.join(BASE_DIR, 'data', 'stories-38.json'),
    os.path.join(BASE_DIR, 'data', 'stories-39.json'),
    os.path.join(BASE_DIR, 'data', 'stories-40.json'),
    os.path.join(BASE_DIR, 'data', 'stories-41.json'),
    os.path.join(BASE_DIR, 'data', 'stories-42.json'),
    os.path.join(BASE_DIR, 'data', 'stories-43.json'),
    os.path.join(BASE_DIR, 'data', 'stories-44.json'),
    os.path.join(BASE_DIR, 'data', 'stories-45.json'),
    os.path.join(BASE_DIR, 'data', 'stories-46.json'),
    os.path.join(BASE_DIR, 'data', 'stories-47.json'),
    os.path.join(BASE_DIR, 'data', 'stories-48.json'),
    os.path.join(BASE_DIR, 'data', 'stories-49.json'),
    os.path.join(BASE_DIR, 'data', 'stories-50.json'),
    os.path.join(BASE_DIR, 'data', 'stories-51.json'),
    os.path.join(BASE_DIR, 'data', 'stories-52.json'),
    os.path.join(BASE_DIR, 'data', 'stories-53.json'),
    os.path.join(BASE_DIR, 'data', 'stories-54.json'),
    os.path.join(BASE_DIR, 'data', 'stories-55.json'),
    os.path.join(BASE_DIR, 'data', 'stories-56.json'),
    os.path.join(BASE_DIR, 'data', 'stories-57.json'),
    os.path.join(BASE_DIR, 'data', 'stories-58.json'),
    os.path.join(BASE_DIR, 'data', 'stories-59.json'),
    os.path.join(BASE_DIR, 'data', 'stories-60.json'),
    os.path.join(BASE_DIR, 'data', 'stories-61.json'),
    os.path.join(BASE_DIR, 'data', 'stories-62.json'),
    os.path.join(BASE_DIR, 'data', 'stories-63.json'),
    os.path.join(BASE_DIR, 'data', 'stories-64.json'),
    os.path.join(BASE_DIR, 'data', 'stories-65.json'),
    os.path.join(BASE_DIR, 'data', 'stories-66.json'),
    os.path.join(BASE_DIR, 'data', 'stories-67.json'),
    os.path.join(BASE_DIR, 'data', 'stories-68.json'),
    os.path.join(BASE_DIR, 'data', 'stories-69.json'),
    os.path.join(BASE_DIR, 'data', 'stories-70.json'),
    os.path.join(BASE_DIR, 'data', 'stories-71.json'),
    os.path.join(BASE_DIR, 'data', 'stories-72.json'),
    os.path.join(BASE_DIR, 'data', 'stories-73.json'),
    os.path.join(BASE_DIR, 'data', 'stories-74.json'),
    os.path.join(BASE_DIR, 'data', 'stories-75.json'),
    os.path.join(BASE_DIR, 'data', 'stories-76.json'),
    os.path.join(BASE_DIR, 'data', 'stories-77.json'),
    os.path.join(BASE_DIR, 'data', 'stories-78.json'),
    os.path.join(BASE_DIR, 'data', 'stories-79.json'),
    os.path.join(BASE_DIR, 'data', 'stories-80.json'),
    os.path.join(BASE_DIR, 'data', 'stories-81.json'),
    os.path.join(BASE_DIR, 'data', 'stories-82.json'),
    os.path.join(BASE_DIR, 'data', 'stories-83.json'),
    os.path.join(BASE_DIR, 'data', 'stories-84.json'),
    os.path.join(BASE_DIR, 'data', 'stories-85.json'),
    os.path.join(BASE_DIR, 'data', 'stories-86.json'),
    os.path.join(BASE_DIR, 'data', 'stories-87.json'),
    os.path.join(BASE_DIR, 'data', 'stories-88.json'),
    os.path.join(BASE_DIR, 'data', 'stories-89.json'),
    os.path.join(BASE_DIR, 'data', 'stories-90.json'),
    os.path.join(BASE_DIR, 'data', 'stories-91.json'),
    os.path.join(BASE_DIR, 'data', 'stories-92.json'),
    os.path.join(BASE_DIR, 'data', 'stories-93.json'),
    os.path.join(BASE_DIR, 'data', 'stories-94.json'),
    os.path.join(BASE_DIR, 'data', 'stories-95.json'),
    os.path.join(BASE_DIR, 'data', 'stories-96.json'),
    os.path.join(BASE_DIR, 'data', 'stories-97.json'),
    os.path.join(BASE_DIR, 'data', 'stories-98.json'),
    os.path.join(BASE_DIR, 'data', 'stories-99.json'),
    os.path.join(BASE_DIR, 'data', 'stories-100.json'),
]

# Директория для изображений внутри папки со скриптом
IMAGES_FOLDER = os.path.join(BASE_DIR, 'images')
CONFIG_FILE = os.path.join(BASE_DIR, 'data', 'config.json')

def load_config():
    """Загружает конфигурацию активных файлов"""
    try:
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        # Создаем базовую конфигурацию если файл не существует
        config = {
            "active_files": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            "total_files": 100,
            "stories_per_file": 200,
            "last_updated": "2025-07-24"
        }
        save_config(config)
        return config

def save_config(config):
    """Сохраняет конфигурацию активных файлов"""
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Ошибка сохранения конфигурации: {e}")

def update_active_files():
    """Обновляет список активных файлов в конфигурации"""
    config = load_config()
    active_files = []
    
    for i in range(1, 101):
        file_path = os.path.join(BASE_DIR, 'data', f'stories-{i}.json')
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if data:  # Если файл не пустой
                    active_files.append(i)
        except (FileNotFoundError, json.JSONDecodeError):
            continue
    
    config['active_files'] = active_files
    config['last_updated'] = "2025-07-24"
    save_config(config)
    return active_files
os.makedirs(IMAGES_FOLDER, exist_ok=True)  # Создание директории, если её нет

# Разрешенные форматы изображений
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Таблица замены символов для транслитерации
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
                    <p><strong>Ссылка:</strong> <a href="https://sweet-story.com/story1.html?id={{ story['id'] }}" target="_blank">https://sweet-story.com/story1.html?id={{ story['id'] }}</a></p>
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
            <p><strong>📊 Статистика системы:</strong></p>
            <p>• Общее количество историй: <strong>{{ stats.total_stories }}</strong></p>
            <p>• Заполненных файлов (200 историй): <strong>{{ stats.filled_files }}</strong></p>
            <p>• Частично заполненных файлов: <strong>{{ stats.partially_filled }}</strong></p>
            <p>• Пустых файлов: <strong>{{ stats.empty_files }}</strong></p>
            <p>• Всего файлов: <strong>{{ stats.total_files }}</strong></p>
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
    # 1) Собираем данные из всех 100 файлов и статистику
    combined = []
    file_stats = []
    
    for i, path in enumerate(JSON_FILES):
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    arr = json.load(f)
                    if isinstance(arr, list):
                        combined.extend(arr)
                        file_stats.append(len(arr))
                    else:
                        file_stats.append(0)
            except Exception:
                file_stats.append(0)
        else:
            file_stats.append(0)

    # Подсчитываем статистику
    filled_files = sum(1 for count in file_stats if count >= 200)
    partially_filled = sum(1 for count in file_stats if 0 < count < 200)
    empty_files = sum(1 for count in file_stats if count == 0)
    
    stats = {
        'total_stories': len(combined),
        'filled_files': filled_files,
        'partially_filled': partially_filled,
        'empty_files': empty_files,
        'total_files': len(JSON_FILES)
    }

    # 2) Фильтрация по запросу
    if query:
        combined = [
            story for story in combined
            if query in story.get('title', '').lower()
            or query in story.get('content', '').lower()
        ]

    # 3) Сортировка по id в обратном порядке
    combined.sort(key=lambda x: x.get('id', 0), reverse=True)

    return render_template_string(HTML_TEMPLATE, stories=combined, query=query, stats=stats)


@app.route('/edit/<int:story_id>', methods=['GET', 'POST'])
def edit_story(story_id):
    # 1) Найти файл, где лежит история с этим id
    target_idx = None
    all_lists = []
    for idx, path in enumerate(JSON_FILES):
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    arr = json.load(f)
            except Exception:
                arr = []
        else:
            arr = []
        all_lists.append(arr)
        if any(s.get('id') == story_id for s in arr):
            target_idx = idx

    if target_idx is None:
        return "История не найдена.", 404

    story = next((s for s in all_lists[target_idx] if s.get('id') == story_id), None)

    if request.method == 'POST':
        story['title'] = request.form.get('title', story['title'])
        story['views'] = request.form.get('views', story['views'])
        story['content'] = request.form.get('content', story['content'])
        try:
            with open(JSON_FILES[target_idx], 'w', encoding='utf-8') as f:
                json.dump(all_lists[target_idx], f, ensure_ascii=False, indent=4)
        except Exception:
            return "Ошибка сохранения истории.", 500
        return redirect(url_for('show_json'))

    return render_template_string(EDIT_TEMPLATE, story=story)


@app.route('/delete/<int:story_id>', methods=['GET'])
def delete_story(story_id):
    # 1) Найти файл, где лежит история с этим id
    target_idx = None
    all_lists = []
    for idx, path in enumerate(JSON_FILES):
        if os.path.exists(path):
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    arr = json.load(f)
            except Exception:
                arr = []
        else:
            arr = []
        all_lists.append(arr)
        if any(s.get('id') == story_id for s in arr):
            target_idx = idx

    if target_idx is None:
        return "История не найдена.", 404

    filtered = [s for s in all_lists[target_idx] if s.get('id') != story_id]
    all_lists[target_idx] = filtered

    try:
        with open(JSON_FILES[target_idx], 'w', encoding='utf-8') as f:
            json.dump(filtered, f, ensure_ascii=False, indent=4)
    except Exception:
        return "Ошибка удаления истории.", 500

    return redirect(url_for('show_json'))


@app.route('/add', methods=['GET', 'POST'])
def add_story():
    if request.method == 'POST':
        title = request.form.get('title')
        views = request.form.get('views')
        image_number = request.form.get('image_number')
        content = ""

        # Обработка файла истории
        if 'file' in request.files:
            txt_file = request.files['file']
            if txt_file and txt_file.filename.lower().endswith('.txt'):
                content = txt_file.read().decode('utf-8')
            else:
                flash("Файл истории должен быть в формате .txt")
                return redirect(url_for('add_story'))
        else:
            flash("Файл истории не был загружен")
            return redirect(url_for('add_story'))

        # Обработка изображения
        if 'image' in request.files:
            image = request.files['image']
            if image and allowed_file(image.filename):
                webp_filename = f"{image_number}.webp"
                webp_path = os.path.join(IMAGES_FOLDER, webp_filename)
                try:
                    img = Image.open(image.stream)
                    img.save(webp_path, 'WEBP')
                except Exception:
                    flash("Не удалось обработать изображение")
                    return redirect(url_for('add_story'))
            else:
                flash("Неверный формат изображения")
                return redirect(url_for('add_story'))
        else:
            flash("Изображение не было загружено")
            return redirect(url_for('add_story'))

        # 1) Считать содержимое всех файлов
        all_lists = []
        for path in JSON_FILES:
            if os.path.exists(path):
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        arr = json.load(f)
                        if isinstance(arr, list):
                            all_lists.append(arr)
                        else:
                            all_lists.append([])
                except Exception:
                    all_lists.append([])
            else:
                all_lists.append([])

        # 2) Найти максимальный id в каждом массиве
        max_id_per_file = []
        for arr in all_lists:
            if arr:
                max_id_per_file.append(max(item.get('id', 0) for item in arr))
            else:
                max_id_per_file.append(0)

        # 3) Определяем индекс файла, где лежит самая свежая запись
        idx_last = max_id_per_file.index(max(max_id_per_file))

        # 4) Проверяем количество историй в этом файле; если >= 200, ищем следующий доступный файл
        chosen_idx = idx_last
        stories_limit = 200  # Лимит историй на файл
        
        # Если в текущем файле уже 200 или больше историй, ищем первый файл с меньшим количеством
        if len(all_lists[chosen_idx]) >= stories_limit:
            # Ищем первый файл, где количество историй < 200
            found_available = False
            for i in range(len(JSON_FILES)):
                if len(all_lists[i]) < stories_limit:
                    chosen_idx = i
                    found_available = True
                    break
            
            # Если все файлы заполнены, берем файл с наименьшим количеством историй
            if not found_available:
                chosen_idx = min(range(len(all_lists)), key=lambda i: len(all_lists[i]))

        # 5) Новый id = (максимальный id по всем файлам) + 1
        overall_max_id = max(max_id_per_file)
        new_id = overall_max_id + 1

        # 6) Сформировать новую историю
        new_story = {
            "id": new_id,
            "title": title,
            "views": views,
            "image": f"images/{webp_filename}",
            "content": content
        }

        # 7) Добавляем в выбранный файл
        all_lists[chosen_idx].append(new_story)

        try:
            with open(JSON_FILES[chosen_idx], 'w', encoding='utf-8') as f:
                json.dump(all_lists[chosen_idx], f, ensure_ascii=False, indent=4)
            
            # Обновляем конфигурацию активных файлов
            update_active_files()
            
        except Exception:
            flash("Не удалось сохранить историю")
            return redirect(url_for('add_story'))

        return redirect(url_for('show_json'))

    return render_template_string(ADD_TEMPLATE)


@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
