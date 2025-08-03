
import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Целевой файл, куда будут перемещены все найденные истории
TARGET_FILE = os.path.join(DATA_DIR, 'stories-14.json')

# Собираем все истории из всех файлов
all_files = [os.path.join(DATA_DIR, f'stories-{i}.json') for i in range(1, 101)]
single_stories = []
single_files = []

# Находим файлы, где только одна история
for path in all_files:
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                arr = json.load(f)
                if isinstance(arr, list) and len(arr) == 1:
                    single_stories.append(arr[0])
                    single_files.append(path)
        except Exception:
            pass

# Сортируем истории по id
single_stories.sort(key=lambda s: s.get('id', 0))

# Удаляем истории из исходных файлов
for path in single_files:
    try:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=4)
    except Exception:
        pass

# Загружаем целевой файл
target_arr = []
if os.path.exists(TARGET_FILE):
    try:
        with open(TARGET_FILE, 'r', encoding='utf-8') as f:
            arr = json.load(f)
            if isinstance(arr, list):
                target_arr = arr
    except Exception:
        pass

# Добавляем истории
for story in single_stories:
    if story not in target_arr:
        target_arr.append(story)

# Сохраняем
with open(TARGET_FILE, 'w', encoding='utf-8') as f:
    json.dump(target_arr, f, ensure_ascii=False, indent=4)

print(f'Перенос завершён. Перемещено {len(single_stories)} историй в {TARGET_FILE}')
