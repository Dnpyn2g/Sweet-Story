import json
import os
import time
from telethon import TelegramClient

# Ваши данные для Telethon
API_ID = '21190287'
API_HASH = '17f4b680c4d61be49e5d2151d3d3d4c6'
SESSION_NAME = 'sweet_story_session'
# ID вашего канала (например, @your_channel или числовой ID)
TELEGRAM_CHANNEL_ID = '@sweet_storyTG'

# Пути к JSON файлу и папке с изображениями
JSON_FILE_PATH = 'stories.json'
IMAGE_FOLDER_PATH = 'images'
POSTED_IDS_FILE = 'posted_ids.json'

# Максимальное количество символов в подписи Telegram
TELEGRAM_CAPTION_LIMIT = 1024

# Интервал между постами (в секундах)
POST_INTERVAL = 60


def load_posted_ids():
    """Загружаем уже опубликованные ID из файла и сортируем их."""
    if os.path.exists(POSTED_IDS_FILE):
        try:
            with open(POSTED_IDS_FILE, 'r', encoding='utf-8') as file:
                ids = json.load(file)
                return {str(id) for id in ids}  # Преобразуем все ID в строки и убираем дубликаты
        except Exception as e:
            print(f"Ошибка при чтении файла с опубликованными ID: {e}")
    return set()


def save_posted_ids(posted_ids):
    """Сохраняем опубликованные ID в файл."""
    try:
        with open(POSTED_IDS_FILE, 'w', encoding='utf-8') as file:
            json.dump(sorted(posted_ids, key=int), file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Ошибка при сохранении опубликованных ID: {e}")


def post_to_telegram():
    # Создаем клиент Telethon
    client = TelegramClient(SESSION_NAME, API_ID, API_HASH)

    async def main():
        posted_ids = load_posted_ids()  # Загружаем ID уже опубликованных историй

        while True:
            try:
                # Читаем данные из JSON файла
                with open(JSON_FILE_PATH, 'r', encoding='utf-8') as file:
                    data = sorted(json.load(file), key=lambda x: int(x['id']))  # Сортируем истории по ID
            except Exception as e:
                print(f"Ошибка при чтении JSON файла: {e}")
                time.sleep(POST_INTERVAL)
                continue

            new_posts = [story for story in data if str(story.get('id')) not in posted_ids]

            if not new_posts:
                print("Новых историй для публикации нет. Ожидаю...")
                time.sleep(POST_INTERVAL)
                continue

            for story in new_posts:
                title = story.get('title', '')
                content = story.get('content', '')
                story_id = str(story.get('id', ''))  # Преобразуем ID в строку для согласованности

                # Проверяем форматы изображений
                image_path_jpg = os.path.join(IMAGE_FOLDER_PATH, f"{story_id}.jpg")
                image_path_png = os.path.join(IMAGE_FOLDER_PATH, f"{story_id}.png")

                # Определяем существующее изображение
                image_path = None
                if os.path.exists(image_path_jpg):
                    image_path = image_path_jpg
                elif os.path.exists(image_path_png):
                    image_path = image_path_png
                else:
                    print(f"Файл изображения {story_id} не найден в формате JPG или PNG. Пропускаем...")
                    continue

                # Формируем текст для постинга с ограничением на количество символов
                post_text = f"<b>✨ {title}</b>\n\n{content}"
                if len(post_text) > TELEGRAM_CAPTION_LIMIT - 50:  # Резервируем место для ссылки
                    post_text = post_text[:TELEGRAM_CAPTION_LIMIT - 53] + '...'

                # Добавляем ссылку в конце текста
                post_text += f"\n\n<a href='https://sweet-story.online/story1.html?id={story_id}'>📖 Читать полностью историю</a>"

                # Отправляем текст и изображение в Telegram канал
                try:
                    await client.send_file(TELEGRAM_CHANNEL_ID, file=image_path, caption=post_text, parse_mode='html')
                    print(f"История '{title}' успешно отправлена!")
                    posted_ids.add(story_id)  # Добавляем ID в список опубликованных
                    save_posted_ids(posted_ids)  # Сохраняем обновленный список
                except Exception as e:
                    print(f"Ошибка при отправке истории '{title}': {e}")

                # Интервал между отправками постов
                time.sleep(POST_INTERVAL)

    # Запуск клиента
    with client:
        client.loop.run_until_complete(main())

if __name__ == '__main__':
    post_to_telegram()
