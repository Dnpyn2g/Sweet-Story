#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для создания 100 JSON файлов с историями
Распределяет существующие истории по файлам (не более 200 историй в файле)
Остальные файлы остаются пустыми массивами
"""

import json
import os
import math

# Конфигурация
DATA_DIR = "data"
MAX_STORIES_PER_FILE = 200
TOTAL_FILES = 100

def load_existing_stories():
    """Загружает все существующие истории из текущих JSON файлов"""
    all_stories = []
    
    # Загружаем истории из существующих файлов
    for i in range(1, 5):  # stories-1.json до stories-4.json
        file_path = os.path.join(DATA_DIR, f"stories-{i}.json")
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    stories = json.load(f)
                    if isinstance(stories, list):
                        all_stories.extend(stories)
                        print(f"Загружено {len(stories)} историй из {file_path}")
            except Exception as e:
                print(f"Ошибка при загрузке {file_path}: {e}")
    
    return all_stories

def create_story_files():
    """Создает 100 JSON файлов с распределенными историями"""
    
    # Загружаем все существующие истории
    all_stories = load_existing_stories()
    total_stories = len(all_stories)
    print(f"Всего загружено историй: {total_stories}")
    
    # Сортируем истории по ID (по убыванию, как в оригинале)
    all_stories.sort(key=lambda x: x.get('id', 0), reverse=True)
    
    # Рассчитываем количество файлов, которые будут содержать истории
    files_needed = math.ceil(total_stories / MAX_STORIES_PER_FILE)
    print(f"Потребуется файлов с историями: {files_needed}")
    print(f"Пустых файлов будет создано: {TOTAL_FILES - files_needed}")
    
    # Создаем все 100 файлов
    for file_num in range(1, TOTAL_FILES + 1):
        file_path = os.path.join(DATA_DIR, f"stories-{file_num}.json")
        
        # Вычисляем диапазон историй для текущего файла
        start_idx = (file_num - 1) * MAX_STORIES_PER_FILE
        end_idx = start_idx + MAX_STORIES_PER_FILE
        
        # Получаем истории для текущего файла
        if start_idx < total_stories:
            file_stories = all_stories[start_idx:end_idx]
            stories_count = len(file_stories)
        else:
            file_stories = []
            stories_count = 0
        
        # Записываем файл
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(file_stories, f, ensure_ascii=False, indent=2)
            
            if stories_count > 0:
                print(f"✓ Создан {file_path} с {stories_count} историями")
            else:
                print(f"✓ Создан пустой {file_path}")
                
        except Exception as e:
            print(f"✗ Ошибка при создании {file_path}: {e}")

def update_code_files():
    """Обновляет файлы кода для работы со 100 файлами"""
    
    # Генерируем список всех 100 файлов для fetch запросов
    fetch_lines = []
    for i in range(1, TOTAL_FILES + 1):
        fetch_lines.append(f"        fetch('data/stories-{i}.json').then(res => res.json()),")
    
    # Убираем запятую у последнего элемента
    if fetch_lines:
        fetch_lines[-1] = fetch_lines[-1].rstrip(',')
    
    fetch_code = '\n'.join(fetch_lines)
    
    print("\n" + "="*60)
    print("КОД ДЛЯ ОБНОВЛЕНИЯ ФАЙЛОВ:")
    print("="*60)
    print("\nДля замены в index.html, story1.html и sidebar.js:")
    print("\nПромise.all([")
    print(fetch_code)
    print("      ])")
    
    # Генерируем список для Python файла sk.py
    py_lines = []
    for i in range(1, TOTAL_FILES + 1):
        py_lines.append(f"    os.path.join(BASE_DIR, 'data', 'stories-{i}.json'),")
    
    py_code = '\n'.join(py_lines)
    
    print("\n" + "-"*60)
    print("Для sk.py (JSON_FILES):")
    print("-"*60)
    print("JSON_FILES = [")
    print(py_code)
    print("]")

if __name__ == "__main__":
    print("Создание 100 JSON файлов с историями...")
    print("="*60)
    
    # Создаем папку data если её нет
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Создаем файлы
    create_story_files()
    
    print("\n" + "="*60)
    print("✓ Создание файлов завершено!")
    
    # Показываем код для обновления
    update_code_files()
