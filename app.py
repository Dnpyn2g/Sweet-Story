import json

def add_story_from_file_to_json(file_name, text_file):
    # Запрос информации у пользователя
    title = input("Введите заголовок истории: ")
    author = input("Введите автора: ")
    views = input("Введите количество просмотров: ")
    image_number = input("Введите номер картинки: ")  # Вводим только номер картинки
    
    # Формируем путь к изображению
    image = f"images/{image_number}.jpg"

    # Чтение содержания истории из текстового файла
    try:
        with open(text_file, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        print(f"Ошибка: файл {text_file} не найден!")
        return

    # Создаем новую историю в формате словаря
    new_story = {
        "id": 1,  # Идентификатор будет автоматически сгенерирован
        "title": title,
        "author": author,
        "views": views,
        "image": image,
        "content": content
    }

    # Чтение существующего файла
    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            stories = json.load(file)
    except FileNotFoundError:
        stories = []

    # Определяем новый ID как следующий за последним
    new_story["id"] = len(stories) + 1

    # Добавляем новую историю в список
    stories.append(new_story)

    # Сохраняем обновленный список в файл
    with open(file_name, 'w', encoding='utf-8') as file:
        json.dump(stories, file, ensure_ascii=False, indent=4)

    print("Новая история успешно добавлена!")

# Вызов функции
add_story_from_file_to_json("stories.json", "3463.txt")
