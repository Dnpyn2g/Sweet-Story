import requests

ACCESS_TOKEN = 'EAANymBxFNYUBOZCn3tJIxpEDuKEyCX5QrrCakfkCd5s9qkU55PPCCy0iQPKTkhwRpuUPAkvlyCmvtW9UNtVQ6gcmqZAOJlQdvZAZCZAGEOrHvhwLn3SOXZCGZBa4K8e9qZCtKhwgI6mH95KD07lDamRhZBnzDhgFpOZCZC2iPyM8KAI4ZA67vB70ZCF7us7zUnX4HG1ynqLZCFFTJlgRtjT4OHZAxx1qZAflsGnPgkqs1JQZD'
PAGE_ID = '61571952849694'  # Например, 476030298936806

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
