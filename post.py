import json
import requests
import os

# Конфигурация
ACCESS_TOKEN = 'ВАШ_НОВЫЙ_ТОКЕН_ДОСТУПА'
PAGE_ID = 'ID_ВАШЕЙ_СТРАНИЦЫ'
GRAPH_API_URL = f'https://graph.facebook.com/v17.0/{PAGE_ID}/photos'

# Читаем JSON-файл с историями
def load_stories(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        stories = json.load(file)
        # Возвращаем первую историю
        return stories

# Публикуем первую историю
def post_first_story(story):
    title = story.get("title", "")
    content = story.get("content", "")
    image_id = story.get("id", 1)  # Используем id для загрузки изображения
    image_path = os.path.join('images', f'{image_id}.jpg')

    # Проверка наличия изображения
    if not os.path.exists(image_path):
        print(f"❌ Изображение не найдено: {image_path}")
        return

    # Сообщение для публикации
    message = f"📖 {title}\n\n{content[:500]}...\n\nЧитать дальше на сайте."  # Обрезаем контент для удобства

    # Открываем изображение и отправляем POST-запрос
    with open(image_path, 'rb') as image_file:
        response = requests.post(
            GRAPH_API_URL,
            files={'source': image_file},
            data={
                'caption': message,
                'access_token': ACCESS_TOKEN
            }
        )

    if response.status_code == 200:
        print(f"✅ История успешно опубликована: {title}")
    else:
        print(f"❌ Ошибка при публикации: {response.json()}")

if __name__ == "__main__":
    # Загружаем первую историю из файла
    stories = load_stories('stories.json')

    if stories:
        first_story = stories[0]  # Публикуем первую историю
        post_first_story(first_story)
    else:
        print("❌ В stories.json нет данных.")
