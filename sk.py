from flask import Flask, request, redirect, url_for, render_template_string, send_from_directory, flash, jsonify
import os
import json
import re
from PIL import Image  # <-- добавляем Pillow
import datetime
import random

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
LOG_FILE = os.path.join(BASE_DIR, 'logs', 'logs.txt')

def smart_truncate(text, ratio=0.6):
    """
    Умно обрезает текст до ~60%, заканчивая на границе предложения.
    Добавляет '...' и 'Продолжение в комментариях 👇👇👇' в конце.
    """
    if not text or len(text) < 100:
        return text

    target_len = int(len(text) * ratio)

    # Ищем конец предложения (. ! ? или перенос строки) ближе к целевой длине
    # Сначала ищем назад от целевой позиции (в пределах 20% от цели)
    best_pos = -1
    search_start = max(0, int(target_len * 0.8))

    # Ищем границы предложений в диапазоне [search_start, target_len + немного]
    search_end = min(len(text), int(target_len * 1.1))
    search_zone = text[search_start:search_end]

    # Ищем последнюю точку окончания предложения в зоне поиска
    sentence_endings = []
    for i, ch in enumerate(search_zone):
        global_pos = search_start + i
        if ch in '.!?' and global_pos > 0:
            # Проверяем что это конец предложения, а не сокращение/число
            next_ch = text[global_pos + 1] if global_pos + 1 < len(text) else ' '
            if next_ch in ' \n\r\t':
                sentence_endings.append(global_pos + 1)  # +1 чтобы включить точку
        elif ch == '\n' and global_pos > search_start:
            # Перенос строки тоже хорошая точка разрыва
            sentence_endings.append(global_pos)

    if sentence_endings:
        # Берём ближайшую к целевой длине
        best_pos = min(sentence_endings, key=lambda p: abs(p - target_len))
    else:
        # Если нет конца предложения, ищем конец абзаца, запятую или пробел
        # Сначала пробуем запятую
        for i in range(min(target_len, len(text) - 1), search_start, -1):
            if text[i] in ',;:' and i + 1 < len(text) and text[i + 1] == ' ':
                best_pos = i + 1
                break
        # Если не нашли запятую, обрезаем по пробелу
        if best_pos == -1:
            for i in range(min(target_len, len(text) - 1), search_start, -1):
                if text[i] == ' ':
                    best_pos = i
                    break

    if best_pos == -1 or best_pos < search_start:
        best_pos = target_len

    truncated = text[:best_pos].rstrip()

    # Убираем завершающие знаки пунктуации типа запятой, тире, двоеточия (но не . ! ?)
    while truncated and truncated[-1] in ',-;:–—':
        truncated = truncated[:-1].rstrip()

    suffix = '...\n\nПродолжение в комментариях 👇👇👇'
    return truncated + suffix


def generate_views():
    """Генерирует случайное количество просмотров от 1к до 15к в формате 'X.Xк'"""
    # Генерируем число от 10 до 150 (это будет означать от 1.0к до 15.0к)
    views_number = random.randint(10, 150)
    # Преобразуем в формат X.X
    views_formatted = f"{views_number / 10:.1f}к"
    return views_formatted


def log_action(action, details=None):
    """
    Записывает действие пользователя в лог-файл на русском языке.
    action: строка с описанием действия
    details: словарь с дополнительной информацией
    """
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_entry = f"[{now}] {action}"
    if details:
        for k, v in details.items():
            log_entry += f"\n    {k}: {v}"
    log_entry += "\n"
    # Проверяем наличие папки logs
    logs_dir = os.path.dirname(LOG_FILE)
    if not os.path.exists(logs_dir):
        try:
            os.makedirs(logs_dir, exist_ok=True)
        except Exception as e:
            print(f"Ошибка создания папки logs: {e}")
            return
    # Пишем лог
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(log_entry)
    except Exception as e:
        print(f"Ошибка записи лога: {e}")

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


HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sweet Story CRM | Управление Историями</title>
    <style>
        :root {
            --primary-orange: #d4851a;
            --primary-orange-dark: #b8741a;
            --primary-orange-light: #e6a347;
            --bg-dark: #1a1a1a;
            --bg-card: #242424;
            --bg-secondary: #2f2f2f;
            --text-primary: #e8e8e8;
            --text-secondary: #a8a8a8;
            --border-color: #3a3a3a;
            --shadow-primary: 0 4px 16px rgba(212, 133, 26, 0.08);
            --shadow-hover: 0 6px 24px rgba(212, 133, 26, 0.12);
            --gradient-orange: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
            --gradient-bg: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
            line-height: 1.6; 
            background: var(--gradient-bg);
            color: var(--text-primary);
            min-height: 100vh;
        }
        
        /* Header Styles */
        header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-bottom: 2px solid var(--primary-orange);
            padding: 20px;
            text-align: center;
            box-shadow: var(--shadow-primary);
        }
        
        header h1 { 
            font-size: 2.8em; 
            font-weight: 700;
            background: var(--gradient-orange);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 5px;
        }
        
        /* Navigation Styles */
        nav { 
            background: var(--bg-card);
            padding: 15px;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
            border-bottom: 1px solid var(--border-color);
        }
        
        nav a { 
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 1.1em;
            font-weight: 500;
            padding: 12px 20px;
            border-radius: 25px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }
        
        nav a:hover, nav a.active { 
            background: var(--gradient-orange);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(212, 133, 26, 0.2);
        }
        
        /* Main Content */
        main { 
            padding: 40px 30px;
            max-width: 1600px;
            margin: 0 auto;
        }
        
        /* Search Form */
        form { 
            margin-bottom: 30px;
            display: flex;
            gap: 15px;
            background: var(--bg-card);
            padding: 20px;
            border-radius: 15px;
            box-shadow: var(--shadow-primary);
            border: 1px solid var(--border-color);
        }
        
        input[type="text"] { 
            flex: 1;
            padding: 15px 20px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 1.1em;
            transition: all 0.3s ease;
        }
        
        input[type="text"]:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 2px rgba(212, 133, 26, 0.1);
        }
        
        /* Story Cards */
        .story { 
            display: grid;
            grid-template-columns: 600px 1fr;
            gap: 35px;
            padding: 35px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            margin-bottom: 35px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .story::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient-orange);
            transform: scaleX(0);
            transition: transform 0.3s ease;
        }
        
        .story:hover { 
            transform: translateY(-4px);
            box-shadow: var(--shadow-hover);
            border-color: var(--primary-orange);
        }
        
        .story:hover::before {
            transform: scaleX(1);
        }
        
        .story h2 { 
            font-size: 1.6em;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 15px;
            line-height: 1.3;
        }
        
        .story img { 
            width: 100%;
            height: 420px;
            border-radius: 15px;
            object-fit: cover;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        }
        
        .story:hover img {
            transform: scale(1.02);
        }
        
        .story-content { 
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .story p { 
            margin: 8px 0;
            color: var(--text-secondary);
        }
        
        .views { 
            color: var(--primary-orange);
            font-size: 1em;
            font-weight: 600;
        }
        
        .content { 
            display: none;
            opacity: 0;
            transition: opacity 0.4s ease;
            margin: 15px 0;
            padding: 15px;
            background: var(--bg-secondary);
            border-radius: 10px;
            border-left: 4px solid var(--primary-orange);
        }
        
        .content.show { 
            display: block;
            opacity: 1;
        }
        
        /* Buttons */
        button { 
            padding: 12px 24px;
            border: none;
            border-radius: 20px;
            background: var(--gradient-orange);
            color: white;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 3px 12px rgba(212, 133, 26, 0.15);
        }
        
        button:hover { 
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(212, 133, 26, 0.25);
        }
        
        a { 
            color: var(--primary-orange);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        a:hover { 
            color: var(--primary-orange-light);
        }
        
        /* Story Tools */
        .story-tools { 
            display: flex;
            gap: 12px;
            margin-top: 15px;
        }
        
        .story-tools a { 
            padding: 10px 18px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9em;
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .story-tools a.edit { 
            background: linear-gradient(135deg, #4a9f5a 0%, #3e8449 100%);
            color: white;
            box-shadow: 0 3px 10px rgba(74, 159, 90, 0.15);
        }
        
        .story-tools a.edit:hover { 
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(74, 159, 90, 0.25);
        }
        
        .story-tools a.delete { 
            background: linear-gradient(135deg, #d14545 0%, #b13030 100%);
            color: white;
            box-shadow: 0 3px 10px rgba(209, 69, 69, 0.15);
        }
        
        .story-tools a.delete:hover { 
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(209, 69, 69, 0.25);
        }
        
        /* Stats Panel */
        .stats { 
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 25px;
            border-radius: 20px;
            box-shadow: var(--shadow-primary);
            margin-top: 30px;
            border-left: 4px solid var(--primary-orange);
        }
        
        .stats p {
            margin: 8px 0;
            color: var(--text-secondary);
        }
        
        .stats strong {
            color: var(--primary-orange);
        }
        
        /* Pagination */
        nav[style*="display: inline-block"] {
            background: none;
            padding: 0;
            border: none;
        }
        
        nav[style*="display: inline-block"] a {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            margin: 0 5px;
        }
        
        /* Footer */
        footer { 
            background: var(--bg-card);
            padding: 20px;
            color: var(--text-secondary);
            text-align: center;
            margin-top: 40px;
            border-top: 1px solid var(--border-color);
        }
        
        .highlight { 
            background: var(--gradient-orange);
            color: white;
            padding: 4px 8px;
            border-radius: 6px;
            font-weight: 600;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .story {
                grid-template-columns: 1fr;
                gap: 20px;
                padding: 25px;
                margin-bottom: 25px;
            }
            
            .story img {
                height: 350px;
            }
            
            nav {
                flex-direction: column;
                align-items: center;
            }
            
            form {
                flex-direction: column;
            }
            
            .story-tools {
                flex-direction: column;
            }
        }
        
        /* Loading Animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 140, 0, 0.3);
            border-radius: 50%;
            border-top-color: var(--primary-orange);
            animation: spin 1s ease-in-out infinite;
        }
        
        /* Inline Collapse Button */
        .inline-collapse-btn {
            background: var(--gradient-orange);
            color: white;
            border: none;
            border-radius: 15px;
            padding: 6px 12px;
            font-size: 0.8em;
            font-weight: 600;
            cursor: pointer;
            display: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(212, 133, 26, 0.3);
            margin-left: 15px;
            vertical-align: middle;
        }
        
        .inline-collapse-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(212, 133, 26, 0.4);
        }
        
        .inline-collapse-btn.show {
            display: inline-block;
        }
        
        .views {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
    </style>
    <script>
        function toggleContent(id) {
            const content = document.getElementById('content-' + id);
            const button = document.getElementById('button-' + id);
            const topButton = document.getElementById('top-button-' + id);
            
            if (content.classList.contains('show')) {
                content.classList.remove('show');
                button.textContent = 'Показать все';
                topButton.classList.remove('show');
            } else {
                content.classList.add('show');
                button.textContent = 'Скрыть';
                topButton.classList.add('show');
            }
        }

        function copyContent(id) {
            const content = document.getElementById('content-' + id);
            const text = content.innerText || content.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('copy-btn-' + id);
                btn.textContent = '✅ Скопировано';
                setTimeout(() => { btn.textContent = '📋 Копировать'; }, 1500);
            });
        }
    </script>
</head>
<body>
    <header>
        <h1>Sweet Story CRM</h1>
        <p style="color: var(--text-secondary); margin-top: 5px; font-size: 1.1em;">Система управления историями</p>
    </header>
    <nav>
        <a href="/">Главная</a>
        <a href="/add">Добавить историю</a>
        <a href="/logs" style="background-color:#333; color: var(--primary-orange);">📊 Логи</a>
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
                    <p class="views">
                        <strong>Просмотры:</strong> <span class="highlight">{{ story['views'] }}</span>
                        <button id="top-button-{{ story['id'] }}" class="inline-collapse-btn" onclick="toggleContent({{ story['id'] }})">Свернуть</button>
                    </p>
                    <p id="content-{{ story['id'] }}" class="content">{{ story['content_preview'] }}</p>
                    <p><strong>Ссылка:</strong> <a href="https://sweet-story.com/story1.html?id={{ story['id'] }}" target="_blank">https://sweet-story.com/story1.html?id={{ story['id'] }}</a></p>
                    <button id="button-{{ story['id'] }}" onclick="toggleContent({{ story['id'] }})">Показать все</button>
                    <button id="copy-btn-{{ story['id'] }}" onclick="copyContent({{ story['id'] }})" style="background:var(--bg-secondary); color:var(--text-secondary); border:1px solid var(--border-color); padding:6px 14px; border-radius:8px; cursor:pointer; font-size:0.85em; margin-left:8px; transition:all 0.2s;">📋 Копировать</button>
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
        <div style="margin: 30px 0; text-align: center;">
            {% if pagination.total_pages > 1 %}
                <nav style="display: inline-block;">
                    {% if pagination.has_prev %}
                        <a href="/?page={{ pagination.prev_page }}{% if query %}&query={{ query }}{% endif %}" style="margin-right: 10px; color: var(--primary-orange);">&laquo; Назад</a>
                    {% endif %}
                    <span style="color: #bbb; font-size: 1.1em;">Страница {{ pagination.page }} из {{ pagination.total_pages }}</span>
                    {% if pagination.has_next %}
                        <a href="/?page={{ pagination.next_page }}{% if query %}&query={{ query }}{% endif %}" style="margin-left: 10px; color: var(--primary-orange);">Вперёд &raquo;</a>
                    {% endif %}
                </nav>
            {% endif %}
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
    <title>Добавить новую историю | Sweet Story CRM</title>
    <style>
        :root {
            --primary-orange: #d4851a;
            --primary-orange-dark: #b8741a;
            --primary-orange-light: #e6a347;
            --bg-dark: #1a1a1a;
            --bg-card: #242424;
            --bg-secondary: #2f2f2f;
            --text-primary: #e8e8e8;
            --text-secondary: #a8a8a8;
            --border-color: #3a3a3a;
            --shadow-primary: 0 4px 16px rgba(212, 133, 26, 0.08);
            --gradient-orange: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
            --gradient-bg: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
            line-height: 1.6; 
            background: var(--gradient-bg);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 20px;
        }
        
        main { 
            max-width: 700px; 
            margin: 0 auto; 
            background: var(--bg-card); 
            padding: 40px; 
            border-radius: 20px; 
            box-shadow: var(--shadow-primary);
            border: 1px solid var(--border-color);
        }
        
        h1 { 
            background: var(--gradient-orange);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
        }
        
        form { 
            display: flex; 
            flex-direction: column; 
            gap: 20px;
        }
        
        label { 
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        
        input, textarea { 
            padding: 15px 20px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 1.1em;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }
        
        /* Dropzone container and sections */
        .dropzone-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin: 15px 0;
        }
        
        .dropzone-section {
            display: flex;
            flex-direction: column;
        }
        
        .dropzone-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 10px;
            font-size: 0.95em;
            text-align: left;
        }
        
        .file-input-label {
            font-weight: 600;
            color: var(--text-primary);
            margin-top: 10px;
            margin-bottom: 6px;
            font-size: 1em;
        }
        
        input[type="file"] {
            padding: 12px 14px;
            cursor: pointer;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            color: var(--text-primary);
            display: inline-block;
        }
        /* Drag & Drop zone */
        .dropzone {
            border: 2px dashed rgba(255,255,255,0.06);
            border-radius: 12px;
            padding: 16px 12px;
            text-align: center;
            color: var(--text-secondary);
            background: linear-gradient(180deg, rgba(255,255,255,0.01), transparent);
            transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 105px;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.01);
        }
        .dropzone .drop-title {
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 4px;
            font-size: 0.9em;
        }
        .dropzone .drop-sub {
            font-size: 0.85em;
            color: var(--text-secondary);
            margin-bottom: 6px;
            height: 16px;
            line-height: 16px;
        }
        .image-preview {
            margin-top: 8px;
            display: none;
            justify-content: center;
            align-items: center;
        }
        .image-preview img {
            max-width: 120px;
            max-height: 120px;
            border-radius: 6px;
            border: 2px solid rgba(212,133,26,0.3);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .dropzone.dragover {
            background: rgba(212,133,26,0.04);
            border-color: rgba(212,133,26,0.9);
            box-shadow: 0 6px 18px rgba(0,0,0,0.35);
            color: var(--text-primary);
        }
        .dropzone .files-list {
            margin-top: 8px;
            font-size: 0.88em;
            color: var(--text-secondary);
            background: rgba(0,0,0,0.06);
            padding: 5px 8px;
            border-radius: 6px;
            width: calc(100% - 10px);
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        @media (max-width: 900px) {
            .dropzone-container {
                gap: 20px;
            }
            .dropzone { min-height: 110px; padding: 18px; }
            .dropzone .files-list { width: 100%; }
        }
        
        button { 
            margin-top: 10px;
            padding: 18px 24px;
            border: none;
            border-radius: 25px;
            background: var(--gradient-orange);
            color: white;
            font-size: 1.2em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.2);
        }
        
        button:hover { 
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 140, 0, 0.4);
        }
        
        .instructions { 
            margin-top: 30px;
            padding: 25px;
            background: var(--bg-secondary);
            border-radius: 15px;
            border-left: 4px solid var(--primary-orange);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .instructions p {
            color: var(--text-primary);
            font-weight: 600;
            margin-bottom: 15px;
            font-size: 1.1em;
        }
        
        .instructions ul {
            list-style: none;
            padding: 0;
        }
        
        .instructions li {
            color: var(--text-secondary);
            margin: 10px 0;
            padding-left: 25px;
            position: relative;
        }
        
        .instructions li::before {
            content: '✨';
            position: absolute;
            left: 0;
            color: var(--primary-orange);
        }
        
        .instructions strong {
            color: var(--primary-orange);
        }
        
        /* Back button */
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--primary-orange);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            color: var(--primary-orange-light);
            transform: translateX(-5px);
        }
        
        .back-link::before {
            content: '← ';
            margin-right: 5px;
        }
        
        @media (max-width: 768px) {
            main {
                padding: 25px;
                margin: 0 10px;
            }
            
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
<main>
    <a href="/" class="back-link">Вернуться к списку историй</a>
    <h1>✨ Добавить новую историю</h1>
    <form method="post" enctype="multipart/form-data">
        <label for="title">Заголовок:</label>
        <input type="text" id="title" name="title" required>

        <!-- Перетаскивание файлов отдельно: отдельные зоны для изображения и файла истории -->
        <div class="dropzone-container">
            <div class="dropzone-section">
                <label class="dropzone-label">Перетащите изображение сюда</label>
                <div id="dropzone-img" class="dropzone" role="button" tabindex="0">
                    <div class="drop-title">Перетащите сюда <strong>изображение</strong></div>
                    <div class="drop-sub">(JPG/PNG)</div>
                    <div class="image-preview" id="image-preview">
                        <img id="preview-img" src="" alt="Предпросмотр">
                    </div>
                    <div class="files-list" id="drop-files-img">Нет файлов</div>
                </div>
                <label for="image" class="file-input-label">Изображение:</label>
                <input type="file" id="image" name="image" accept="image/*" required>
            </div>
            <div class="dropzone-section">
                <label class="dropzone-label">Перетащите .txt файл истории сюда</label>
                <div id="dropzone-txt" class="dropzone" role="button" tabindex="0">
                    <div class="drop-title">Перетащите сюда <strong>.txt</strong> файл истории</div>
                    <div class="drop-sub">&nbsp;</div>
                    <div class="files-list" id="drop-files-txt">Нет файлов</div>
                </div>
                <label for="file" class="file-input-label">Файл истории (.txt):</label>
                <input type="file" id="file" name="file" accept=".txt" required>
            </div>
        </div>

        <button type="submit">Добавить историю</button>
    </form>

    <script>
    (function(){
        const imgDrop = document.getElementById('dropzone-img');
        const txtDrop = document.getElementById('dropzone-txt');
        const imgInput = document.getElementById('image');
        const txtInput = document.getElementById('file');
        const imgList = document.getElementById('drop-files-img');
        const txtList = document.getElementById('drop-files-txt');

        function updateList(el, files){
            if(!files || files.length===0){ el.textContent = 'Нет файлов'; return; }
            el.textContent = Array.from(files).map(f => f.name).join(', ');
        }

        function showImagePreview(file){
            const previewContainer = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            
            if(file && file.type.startsWith('image/')){
                const reader = new FileReader();
                reader.onload = function(e){
                    previewImg.src = e.target.result;
                    previewContainer.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            } else {
                previewContainer.style.display = 'none';
            }
        }

        function handleImageFiles(list){
            const imgs = [];
            for(const f of Array.from(list)){
                if(f.type && f.type.startsWith('image/') || /\.(jpe?g|png|gif|webp)$/i.test(f.name)) imgs.push(f);
            }
            if(imgs.length){
                const dt = new DataTransfer();
                imgs.forEach(f => dt.items.add(f));
                imgInput.files = dt.files;
                showImagePreview(imgs[0]);
            }
            updateList(imgList, imgInput.files);
        }

        function handleTxtFiles(list){
            const txts = [];
            for(const f of Array.from(list)){
                if(f.name.toLowerCase().endsWith('.txt')) txts.push(f);
            }
            if(txts.length){
                const dt = new DataTransfer();
                txts.forEach(f => dt.items.add(f));
                txtInput.files = dt.files;
            }
            updateList(txtList, txtInput.files);
        }

        function addDropHandlers(dropEl, handler){
            ['dragenter','dragover'].forEach(evt => {
                dropEl.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropEl.classList.add('dragover'); });
            });
            ['dragleave','dragend','mouseout'].forEach(evt => {
                dropEl.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); dropEl.classList.remove('dragover'); });
            });
            dropEl.addEventListener('drop', e => {
                e.preventDefault(); e.stopPropagation();
                dropEl.classList.remove('dragover');
                const dt = e.dataTransfer;
                if(dt && dt.files && dt.files.length) handler(dt.files);
            });
        }

        addDropHandlers(imgDrop, handleImageFiles);
        addDropHandlers(txtDrop, handleTxtFiles);

        // Prevent default page behavior for drops
        window.addEventListener('dragover', e => e.preventDefault());
        window.addEventListener('drop', e => e.preventDefault());

        // Click to open corresponding file input
        imgDrop.addEventListener('click', () => imgInput.click());
        txtDrop.addEventListener('click', () => txtInput.click());

        imgInput.addEventListener('change', () => {
            updateList(imgList, imgInput.files);
            if(imgInput.files.length > 0) showImagePreview(imgInput.files[0]);
        });
        txtInput.addEventListener('change', () => updateList(txtList, txtInput.files));
    })();
    </script>
    <div class="instructions">
        <p><strong>Инструкция:</strong></p>
        <ul>
            <li>Заполните все обязательные поля формы.</li>
            <li>Файл истории должен быть в формате <strong>.txt</strong>.</li>
            <li>Изображение должно быть в формате <strong>JPG</strong>.</li>
            <li>Просмотры будут сгенерированы автоматически в формате от 1.0к до 15.0к.</li>
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
    <title>Редактировать историю | Sweet Story CRM</title>
    <style>
        :root {
            --primary-orange: #d4851a;
            --primary-orange-dark: #b8741a;
            --primary-orange-light: #e6a347;
            --bg-dark: #1a1a1a;
            --bg-card: #242424;
            --bg-secondary: #2f2f2f;
            --text-primary: #e8e8e8;
            --text-secondary: #a8a8a8;
            --border-color: #3a3a3a;
            --shadow-primary: 0 4px 16px rgba(212, 133, 26, 0.08);
            --gradient-orange: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
            --gradient-bg: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
            line-height: 1.6; 
            background: var(--gradient-bg);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 20px;
        }
        
        main { 
            max-width: 700px; 
            margin: 0 auto; 
            background: var(--bg-card); 
            padding: 40px; 
            border-radius: 20px; 
            box-shadow: var(--shadow-primary);
            border: 1px solid var(--border-color);
        }
        
        h1 { 
            background: var(--gradient-orange);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
        }
        
        form { 
            display: flex; 
            flex-direction: column; 
            gap: 20px;
        }
        
        label { 
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 8px;
            font-size: 1.1em;
        }
        
        input, textarea { 
            padding: 15px 20px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-size: 1.1em;
            transition: all 0.3s ease;
            font-family: inherit;
        }
        
        textarea {
            min-height: 200px;
            resize: vertical;
        }
        
        input:focus, textarea:focus {
            outline: none;
            border-color: var(--primary-orange);
            box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.1);
        }
        
        button { 
            margin-top: 10px;
            padding: 18px 24px;
            border: none;
            border-radius: 25px;
            background: var(--gradient-orange);
            color: white;
            font-size: 1.2em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.2);
        }
        
        button:hover { 
            transform: translateY(-3px);
            box-shadow: 0 12px 35px rgba(255, 140, 0, 0.4);
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--primary-orange);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            color: var(--primary-orange-light);
            transform: translateX(-5px);
        }
        
        .back-link::before {
            content: '← ';
            margin-right: 5px;
        }
        
        @media (max-width: 768px) {
            main {
                padding: 25px;
                margin: 0 10px;
            }
            
            h1 {
                font-size: 2em;
            }
        }
    </style>
</head>
<body>
<main>
    <a href="/" class="back-link">Вернуться к списку историй</a>
    <h1>✏️ Редактировать историю</h1>
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

LOGS_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Логи системы | Sweet Story CRM</title>
    <style>
        :root {
            --primary-orange: #d4851a;
            --primary-orange-dark: #b8741a;
            --primary-orange-light: #e6a347;
            --bg-dark: #1a1a1a;
            --bg-card: #242424;
            --bg-secondary: #2f2f2f;
            --text-primary: #e8e8e8;
            --text-secondary: #a8a8a8;
            --border-color: #3a3a3a;
            --shadow-primary: 0 4px 16px rgba(212, 133, 26, 0.08);
            --gradient-orange: linear-gradient(135deg, var(--primary-orange) 0%, var(--primary-orange-dark) 100%);
            --gradient-bg: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
            line-height: 1.6; 
            background: var(--gradient-bg);
            color: var(--text-primary);
            min-height: 100vh;
            padding: 20px;
        }
        
        main { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: var(--bg-card); 
            padding: 40px; 
            border-radius: 20px; 
            box-shadow: var(--shadow-primary);
            border: 1px solid var(--border-color);
        }
        
        h1 { 
            background: var(--gradient-orange);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: var(--primary-orange);
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .back-link:hover {
            color: var(--primary-orange-light);
            transform: translateX(-5px);
        }
        
        .back-link::before {
            content: '← ';
            margin-right: 5px;
        }
        
        .log-file {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 15px;
            margin-bottom: 25px;
            overflow: hidden;
        }
        
        .log-header {
            background: var(--gradient-orange);
            color: white;
            padding: 15px 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .log-info {
            font-size: 0.9em;
            opacity: 0.9;
        }
        
        .log-content {
            padding: 20px;
            background: #1e1e1e;
            font-family: 'JetBrains Mono', 'Consolas', monospace;
            font-size: 0.9em;
            line-height: 1.4;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 500px;
            overflow-y: auto;
            border-top: 1px solid var(--border-color);
        }
        
        .no-logs {
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
            font-size: 1.2em;
        }
        
        .no-logs::before {
            content: '📋';
            display: block;
            font-size: 3em;
            margin-bottom: 20px;
        }
        
        /* Стилизация скроллбара */
        .log-content::-webkit-scrollbar {
            width: 8px;
        }
        
        .log-content::-webkit-scrollbar-track {
            background: var(--bg-card);
            border-radius: 4px;
        }
        
        .log-content::-webkit-scrollbar-thumb {
            background: var(--primary-orange);
            border-radius: 4px;
        }
        
        .log-content::-webkit-scrollbar-thumb:hover {
            background: var(--primary-orange-light);
        }
        
        @media (max-width: 768px) {
            main {
                padding: 25px;
                margin: 0 10px;
            }
            
            h1 {
                font-size: 2em;
            }
            
            .log-header {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
<main>
    <a href="/" class="back-link">Вернуться к главной странице</a>
    <h1>📊 Логи системы</h1>
    
    {% if logs %}
        {% for log in logs %}
            {% if log.content is string %}
                <div class="no-logs">{{ log }}</div>
            {% else %}
                <div class="log-file">
                    <div class="log-header">
                        <span>📄 {{ log.filename }}</span>
                        <div class="log-info">
                            <span>Размер: {{ "%.1f"|format(log.size / 1024) }} KB</span> | 
                            <span>Изменен: {{ log.modified }}</span>
                        </div>
                    </div>
                    <div class="log-content">{{ log.content }}</div>
                </div>
            {% endif %}
        {% endfor %}
    {% else %}
        <div class="no-logs">
            Логи не найдены
        </div>
    {% endif %}
</main>
</body>
</html>
"""


@app.route('/')
def show_json():
    query = request.args.get('query', '').lower()
    page = int(request.args.get('page', 1))
    per_page = 20  # Количество историй на страницу

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

    # 4) Пагинация
    total_stories = len(combined)
    total_pages = max(1, (total_stories + per_page - 1) // per_page)
    page = max(1, min(page, total_pages))
    start = (page - 1) * per_page
    end = start + per_page
    paginated_stories = combined[start:end]

    # 5.5) Создаём превью контента (60% текста с умным обрезанием)
    for story in paginated_stories:
        story['content_preview'] = smart_truncate(story.get('content', ''), ratio=0.6)

    # 5) Навигация по страницам
    pagination = {
        'page': page,
        'total_pages': total_pages,
        'has_prev': page > 1,
        'has_next': page < total_pages,
        'prev_page': page - 1,
        'next_page': page + 1
    }

    return render_template_string(HTML_TEMPLATE, stories=paginated_stories, query=query, stats=stats, pagination=pagination)


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
            log_action(
                "Пользователь отредактировал историю",
                {
                    "ID истории": story_id,
                    "Заголовок": story['title'],
                    "Файл": os.path.basename(JSON_FILES[target_idx]),
                    "Просмотры": story['views']
                }
            )
        except Exception:
            return "Ошибка сохранения истории.", 500
        return redirect(url_for('show_json'))

    return render_template_string(EDIT_TEMPLATE, story=story)


@app.route('/delete/<int:story_id>', methods=['GET'])
def delete_story(story_id):
    # 1) Найти файл, где лежит история с этим id
    target_idx = None
    target_story = None
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
        # Найти конкретную историю для получения информации об изображении
        for story in arr:
            if story.get('id') == story_id:
                target_idx = idx
                target_story = story
                break

    if target_idx is None or target_story is None:
        return "История не найдена.", 404

    # 2) Удалить связанное изображение, если оно есть
    if target_story.get('image'):
        image_path = target_story['image'].replace('/images/', '')
        full_image_path = os.path.join(IMAGES_FOLDER, image_path)
        if os.path.exists(full_image_path):
            try:
                os.remove(full_image_path)
            except Exception as e:
                print(f"Ошибка удаления изображения: {e}")

    # 3) Удалить историю из JSON
    filtered = [s for s in all_lists[target_idx] if s.get('id') != story_id]
    all_lists[target_idx] = filtered

    try:
        with open(JSON_FILES[target_idx], 'w', encoding='utf-8') as f:
            json.dump(filtered, f, ensure_ascii=False, indent=4)
        log_action(
            "Пользователь удалил историю",
            {
                "ID истории": story_id,
                "Заголовок": target_story.get('title', 'Без названия'),
                "Файл": os.path.basename(JSON_FILES[target_idx]),
                "Изображение удалено": "Да" if target_story.get('image') else "Нет"
            }
        )
        
        # Обновляем config.json после удаления
        update_active_files()
        
    except Exception:
        return "Ошибка удаления истории.", 500

    return redirect(url_for('show_json'))


@app.route('/add', methods=['GET', 'POST'])
def add_story():
    if request.method == 'POST':
        title = request.form.get('title')
        # Автоматически генерируем просмотры
        views = generate_views()
        content = ""

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


        # Ищем первый файл, где меньше 199 историй
        chosen_idx = None
        for idx, arr in enumerate(all_lists):
            if len(arr) < 199:
                chosen_idx = idx
                break

        if chosen_idx is None:
            flash("Все файлы заполнены (199 историй в каждом). Добавление невозможно.")
            return redirect(url_for('add_story'))

        # Новый id = (максимальный id по всем файлам) + 1
        overall_max_id = max(max_id_per_file)
        new_id = overall_max_id + 1

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
                webp_filename = f"{new_id}.webp"
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
            log_action(
                "Пользователь добавил новую историю",
                {
                    "ID истории": new_id,
                    "Заголовок": title,
                    "Файл истории": txt_file.filename,
                    "Файл изображения": image.filename if 'image' in request.files else '',
                    "Файл JSON": os.path.basename(JSON_FILES[chosen_idx]),
                    "Просмотры": views
                }
            )
        except Exception:
            flash("Не удалось сохранить историю")
            return redirect(url_for('add_story'))
        return redirect(url_for('show_json'))

    return render_template_string(ADD_TEMPLATE)


@app.route('/logs')
def show_logs():
    """Показывает логи из папки logs"""
    logs_content = []
    logs_dir = os.path.dirname(LOG_FILE)
    
    if not os.path.exists(logs_dir):
        logs_content.append("Папка логов не найдена.")
    else:
        # Получаем все файлы логов
        log_files = []
        for filename in os.listdir(logs_dir):
            if filename.endswith('.txt'):
                file_path = os.path.join(logs_dir, filename)
                file_stat = os.stat(file_path)
                log_files.append({
                    'name': filename,
                    'path': file_path,
                    'size': file_stat.st_size,
                    'modified': datetime.datetime.fromtimestamp(file_stat.st_mtime)
                })
        
        # Сортируем по дате изменения (новые сверху)
        log_files.sort(key=lambda x: x['modified'], reverse=True)
        
        if not log_files:
            logs_content.append("Файлы логов не найдены.")
        else:
            for log_file in log_files:
                try:
                    with open(log_file['path'], 'r', encoding='utf-8') as f:
                        content = f.read()
                        if content.strip():
                            logs_content.append({
                                'filename': log_file['name'],
                                'size': log_file['size'],
                                'modified': log_file['modified'].strftime('%Y-%m-%d %H:%M:%S'),
                                'content': content
                            })
                except Exception as e:
                    logs_content.append({
                        'filename': log_file['name'],
                        'size': log_file['size'],
                        'modified': log_file['modified'].strftime('%Y-%m-%d %H:%M:%S'),
                        'content': f"Ошибка чтения файла: {e}"
                    })
    
    return render_template_string(LOGS_TEMPLATE, logs=logs_content)


@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
