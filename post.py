import subprocess
import sys
import os

def run_hidden(script_path):
    """Запускает скрипт в скрытом окне"""
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    subprocess.Popen([sys.executable, script_path], startupinfo=startupinfo, creationflags=subprocess.CREATE_NO_WINDOW)

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))  # Путь к директории скрипта
    script_name = os.path.basename(__file__)  # Имя текущего скрипта (post.py)

    # Получаем список всех .py файлов в директории, кроме post.py
    scripts = [f for f in os.listdir(script_dir) if f.endswith('.py') and f != script_name]

    if not scripts:
        print("В директории нет других .py файлов для запуска.")
        sys.exit(1)

    print(f"Найдено {len(scripts)} скриптов, запускаем...")

    for script in scripts:
        script_path = os.path.join(script_dir, script)
        run_hidden(script_path)
    
    print("Все скрипты запущены в скрытом режиме.")
