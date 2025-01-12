import os
from git import Repo

# Путь к вашему локальному репозиторию
repo_path = r"C:\Users\t460s\Documents\GitHub\Sweet-Story"

# Ваше сообщение коммита
commit_message = "Автоматическое обновление данных"

# Функция для пуша изменений
def push_to_github(repo_path, commit_message):
    try:
        repo = Repo(repo_path)
        if repo.is_dirty(untracked_files=True):
            repo.git.add(A=True)
            repo.index.commit(commit_message)
            origin = repo.remote(name='origin')
            origin.push()
            print("Изменения успешно отправлены на GitHub.")
        else:
            print("Нет изменений для коммита.")
    except Exception as e:
        print(f"Произошла ошибка: {e}")

# Запуск функции
push_to_github(repo_path, commit_message)
