import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from git import Repo
import os

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

# Обработчик событий, который будет отслеживать изменения
class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        # Проверка, чтобы не срабатывать на изменениях в самой директории
        if not event.is_directory:
            print(f"Файл {event.src_path} был изменен.")
            push_to_github(repo_path, commit_message)

# Настройка наблюдателя
observer = Observer()
event_handler = ChangeHandler()
observer.schedule(event_handler, repo_path, recursive=True)

# Запуск наблюдения за изменениями
observer.start()

try:
    while True:
        time.sleep(1)  # Пауза между проверками изменений
except KeyboardInterrupt:
    observer.stop()

observer.join()
