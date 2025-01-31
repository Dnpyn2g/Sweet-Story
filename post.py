import requests

ACCESS_TOKEN = 'ВАШ_СОПИРОВАННЫЙ_ТОКЕН'
PAGE_ID = 'ID_ВАШЕЙ_СТРАНИЦЫ'  # Например, 476030298936806

GRAPH_API_URL = f'https://graph.facebook.com/v17.0/{PAGE_ID}/feed'

# Отправляем простой текстовый пост
response = requests.post(
    GRAPH_API_URL,
    data={
        'message': 'Тестовый пост через правильный Page Access Token!',
        'access_token': ACCESS_TOKEN
    }
)

# Проверяем ответ
print(response.json())
