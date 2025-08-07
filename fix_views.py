import json
import os
import re

# Путь к папке с данными
data_dir = 'data'

# Получаем список всех JSON файлов с историями
json_files = []
for i in range(1, 101):
    file_path = os.path.join(data_dir, f'stories-{i}.json')
    if os.path.exists(file_path):
        json_files.append(file_path)

print(f"Найдено {len(json_files)} файлов для обработки")

# Обрабатываем каждый файл
for file_path in json_files:
    try:
        # Читаем файл
        with open(file_path, 'r', encoding='utf-8') as f:
            stories = json.load(f)
        
        # Проверяем, что это список историй
        if not isinstance(stories, list):
            print(f"Пропускаем {file_path} - неверный формат")
            continue
        
        # Обрабатываем каждую историю
        changed = False
        for story in stories:
            if 'views' in story:
                old_views = story['views']
                # Убираем слово "просмотров" и его варианты
                new_views = re.sub(r'\s*просмотров?\s*$', '', old_views, flags=re.IGNORECASE)
                new_views = re.sub(r'\s*просмотра\s*$', '', new_views, flags=re.IGNORECASE)
                
                if new_views != old_views:
                    story['views'] = new_views
                    changed = True
                    print(f"Изменено: '{old_views}' -> '{new_views}'")
        
        # Сохраняем файл, если были изменения
        if changed:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(stories, f, ensure_ascii=False, indent=4)
            print(f"Обновлен файл: {file_path}")
        else:
            print(f"Изменений нет в файле: {file_path}")
            
    except Exception as e:
        print(f"Ошибка при обработке {file_path}: {e}")

print("Обработка завершена!")
