
#!/usr/bin/env python3
"""
Скрипт для обновления полей image в JSON и переименования файлов в папке images:
- Замена расширений .jpg/.jpeg/.png на .webp в stories.json
- Переименование файлов *.jpg, *.jpeg, *.png в папке images на .webp
stories.json и папка images должны находиться в той же директории, что и скрипт.
Usage:
    python app.py update-json        # обновить JSON
    python app.py rename-images      # переименовать файлы в папке images
    python app.py all                # выполнить оба действия
    python app.py                    # эквивалентно 'all'
"""
import json
import re
import argparse
from pathlib import Path


def update_json_images(stories_path: Path):
    pattern = re.compile(r"\.(jpe?g|png)$", flags=re.IGNORECASE)
    if not stories_path.is_file():
        print(f"❌ JSON-файл не найден: {stories_path}")
        return
    try:
        data = json.loads(stories_path.read_text(encoding='utf-8'))
        for story in data:
            img = story.get('image')
            if isinstance(img, str):
                story['image'] = pattern.sub('.webp', img)
        stories_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f"✅ JSON обновлён: {stories_path.name}")
    except Exception as e:
        print(f"❌ Ошибка при обновлении JSON: {e}")


def rename_images_folder(images_dir: Path):
    if not images_dir.is_dir():
        print(f"❌ Папка не найдена: {images_dir}")
        return
    for ext in ('*.jpg', '*.jpeg', '*.png'):
        for img_path in images_dir.glob(ext):
            new_path = img_path.with_suffix('.webp')
            try:
                img_path.rename(new_path)
                print(f"✅ {img_path.name} → {new_path.name}")
            except Exception as e:
                print(f"❌ Ошибка переименования {img_path.name}: {e}")


def main():
    base_dir = Path(__file__).parent
    stories_path = base_dir / 'stories.json'
    images_dir = base_dir / 'images'

    parser = argparse.ArgumentParser(
        description='Update JSON and/or rename images to .webp'
    )
    parser.add_argument(
        'action',
        nargs='?',  # сделать аргумент необязательным
        choices=['update-json', 'rename-images', 'all'],
        default='all',  # действие по умолчанию
        help="Действие: update-json, rename-images или all (по умолчанию all)"
    )
    args = parser.parse_args()

    if args.action in ('update-json', 'all'):
        update_json_images(stories_path)
    if args.action in ('rename-images', 'all'):
        rename_images_folder(images_dir)


if __name__ == '__main__':
    main()

