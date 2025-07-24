#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тестовый скрипт для проверки алгоритма выбора файла для новой истории
"""

import json
import os

# Симуляция структуры файлов
BASE_DIR = "data"
JSON_FILES = [f"data/stories-{i}.json" for i in range(1, 101)]

def test_file_selection_algorithm():
    """Тестирует алгоритм выбора файла для новой истории"""
    
    print("Тест алгоритма выбора файла для новой истории")
    print("=" * 60)
    
    # Создаем тестовые данные - симулируем состояние файлов
    all_lists = []
    
    # Файлы 1-12 заполнены (200 историй в первых 11, 116 в 12-м)
    for i in range(12):
        if i < 11:
            # Первые 11 файлов по 200 историй
            stories = [{"id": j + i*200 + 1} for j in range(200)]
        else:
            # 12-й файл - 116 историй
            stories = [{"id": j + 2201} for j in range(116)]
        all_lists.append(stories)
    
    # Файлы 13-100 пустые
    for i in range(12, 100):
        all_lists.append([])
    
    # Тестируем алгоритм
    stories_limit = 200
    
    # Находим максимальный ID
    max_id_per_file = []
    for arr in all_lists:
        if arr:
            max_id_per_file.append(max(item.get('id', 0) for item in arr))
        else:
            max_id_per_file.append(0)
    
    idx_last = max_id_per_file.index(max(max_id_per_file))
    print(f"Файл с последней записью: stories-{idx_last + 1}.json")
    print(f"Количество историй в нем: {len(all_lists[idx_last])}")
    
    # Выбираем файл для новой истории
    chosen_idx = idx_last
    
    if len(all_lists[chosen_idx]) >= stories_limit:
        print(f"Файл stories-{chosen_idx + 1}.json заполнен ({len(all_lists[chosen_idx])} историй)")
        
        # Ищем первый файл, где количество историй < 200
        found_available = False
        for i in range(len(JSON_FILES)):
            if len(all_lists[i]) < stories_limit:
                chosen_idx = i
                found_available = True
                print(f"Найден доступный файл: stories-{i + 1}.json ({len(all_lists[i])} историй)")
                break
        
        if not found_available:
            chosen_idx = min(range(len(all_lists)), key=lambda i: len(all_lists[i]))
            print(f"Все файлы заполнены, выбран файл с минимальным количеством: stories-{chosen_idx + 1}.json")
    
    print(f"\n✅ Новая история будет сохранена в файл: stories-{chosen_idx + 1}.json")
    print(f"📊 Текущее количество историй в файле: {len(all_lists[chosen_idx])}")
    print(f"📊 После добавления будет: {len(all_lists[chosen_idx]) + 1}")
    
    # Проверяем статистику
    total_stories = sum(len(arr) for arr in all_lists)
    filled_files = sum(1 for arr in all_lists if len(arr) >= stories_limit)
    partially_filled = sum(1 for arr in all_lists if 0 < len(arr) < stories_limit)
    empty_files = sum(1 for arr in all_lists if len(arr) == 0)
    
    print(f"\n📈 Статистика:")
    print(f"   Всего историй: {total_stories}")
    print(f"   Заполненных файлов (200 историй): {filled_files}")
    print(f"   Частично заполненных файлов: {partially_filled}")
    print(f"   Пустых файлов: {empty_files}")

if __name__ == "__main__":
    test_file_selection_algorithm()
