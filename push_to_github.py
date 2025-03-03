import time
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from git import Repo, GitCommandError
import os
from time import sleep

# Путь к вашему локальному репозиторию
repo_path = r"C:\Users\dnpyn\Documents\GitHub\Sweet-Story"

# Ваше сообщение коммита
commit_message = "Автоматическое обновление данных"

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Функция для пуша изменений
def push_to_github(repo_path, commit_message):
    try:
        repo = Repo(repo_path)
        if repo.is_dirty(untracked_files=True):
            repo.git.add(A=True)
            repo.index.commit(commit_message)
            origin = repo.remote(name='origin')
            origin.push()
            logging.info("Изменения успешно отправлены на GitHub.")
        else:
            logging.info("Нет изменений для коммита.")
    except GitCommandError as e:
        logging.error(f"Ошибка Git: {e}")
    except Exception as e:
        logging.error(f"Произошла ошибка при пуше: {e}")

# Обработчик событий, который будет отслеживать изменения
class ChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory:
            logging.info(f"Файл {event.src_path} был изменен.")
            push_to_github(repo_path, commit_message)

# Настройка наблюдателя
observer = Observer()
event_handler = ChangeHandler()
observer.schedule(event_handler, repo_path, recursive=True)

# Запуск наблюдения за изменениями
try:
    observer.start()
    logging.info("Наблюдение за изменениями начато.")
    while True:
        time.sleep(1)  # Пауза между проверками изменений
except KeyboardInterrupt:
    observer.stop()
    logging.info("Наблюдение остановлено.")
except Exception as e:
    logging.error(f"Ошибка: {e}")
finally:
    observer.join()
    logging.info("Скрипт завершил работу.")
