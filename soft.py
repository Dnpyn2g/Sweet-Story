from flask import Flask, request, render_template, jsonify
import json
import os

app = Flask(__name__)

# Путь к JSON файлу и директории для изображений
file_name = "stories.json"
images_folder = "images"
os.makedirs(images_folder, exist_ok=True)  # Создание директории для изображений, если её нет

# Разрешенные форматы изображений
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Функция для проверки расширения файла
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('form.html')

@app.route('/view_json')
def view_json():
    # Загружаем все истории из JSON файла
    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            stories = json.load(file)
    except FileNotFoundError:
        stories = []

    # Преобразуем данные в строку для отображения
    json_content = json.dumps(stories, ensure_ascii=False, indent=4)

    # Отправляем содержимое JSON на страницу
    return render_template('view_json.html', json_content=json_content)

@app.route('/add_story', methods=['POST'])
def add_story():
    title = request.form.get('title')
    author = request.form.get('author')
    views = request.form.get('views')
    image_number = request.form.get('image_number')
    content = ""

    # Получаем файл с историей
    if 'file' in request.files:
        file = request.files['file']
        if file.filename.endswith('.txt'):
            content = file.read().decode('utf-8')
        else:
            return jsonify({"error": "Файл должен быть формата .txt"}), 400
    else:
        return jsonify({"error": "Файл с историей не был загружен"}), 400

    # Обрабатываем изображение
    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            image_extension = image.filename.rsplit('.', 1)[1].lower()  # Получаем расширение файла
            image_filename = f"{image_number}.{image_extension}"  # Используем номер картинки как имя файла
            image_path = os.path.join(images_folder, image_filename)
            image.save(image_path)
        else:
            return jsonify({"error": "Неверный формат изображения"}), 400
    else:
        return jsonify({"error": "Изображение не было загружено"}), 400

    # Формируем путь к изображению
    image_path = f"images/{image_filename}"

    # Чтение существующего файла
    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            stories = json.load(file)
    except FileNotFoundError:
        stories = []

    # Определяем новый ID как следующий за последним
    new_story = {
        "id": len(stories) + 1,  # Генерируем ID
        "title": title,
        "author": author,
        "views": views,
        "image": image_path,
        "content": content
    }

    # Добавляем новую историю в список
    stories.append(new_story)

    # Сохраняем обновленный список в файл
    with open(file_name, 'w', encoding='utf-8') as file:
        json.dump(stories, file, ensure_ascii=False, indent=4)

    return jsonify({"message": "Новая история успешно добавлена!"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
