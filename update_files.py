#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для автоматического обновления кода во всех файлах
для работы со 100 JSON файлами
"""

import os
import re

def generate_fetch_code(indent="        "):
    """Генерирует код для загрузки 100 JSON файлов"""
    lines = []
    for i in range(1, 101):
        if i == 100:
            lines.append(f"{indent}fetch('data/stories-{i}.json').then(res => res.json())")
        else:
            lines.append(f"{indent}fetch('data/stories-{i}.json').then(res => res.json()),")
    return '\n'.join(lines)

def generate_python_files_list():
    """Генерирует список файлов для Python"""
    lines = []
    for i in range(1, 101):
        lines.append(f"    os.path.join(BASE_DIR, 'data', 'stories-{i}.json'),")
    return '\n'.join(lines)

def update_html_file(file_path, description):
    """Обновляет HTML файл"""
    if not os.path.exists(file_path):
        print(f"❌ Файл не найден: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ищем и заменяем Promise.all блок
        pattern = r'Promise\.all\(\[\s*fetch\(\'data/stories-\d+\.json\'\)\.then\([^)]+\),?\s*(?:\s*fetch\(\'data/stories-\d+\.json\'\)\.then\([^)]+\),?\s*)*\s*\]\)'
        
        new_fetch_code = f"Promise.all([\n{generate_fetch_code()}\n      ])"
        
        # Заменяем
        new_content = re.sub(pattern, new_fetch_code, content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Обновлен {description}: {file_path}")
            return True
        else:
            print(f"⚠️  Не найден блок для замены в {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка при обновлении {file_path}: {e}")
        return False

def update_sidebar_js():
    """Обновляет sidebar.js"""
    file_path = "sidebar.js"
    if not os.path.exists(file_path):
        print(f"❌ Файл не найден: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ищем и заменяем Promise.all блок в sidebar.js
        pattern = r'Promise\.all\(\[\s*fetch\(\'data/stories-\d+\.json\'\)\.then\([^)]+\),?\s*(?:\s*fetch\(\'data/stories-\d+\.json\'\)\.then\([^)]+\),?\s*)*\s*\]\)'
        
        new_fetch_code = f"Promise.all([\n{generate_fetch_code('    ')}\n  ])"
        
        # Заменяем
        new_content = re.sub(pattern, new_fetch_code, content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Обновлен sidebar.js")
            return True
        else:
            print(f"⚠️  Не найден блок для замены в sidebar.js")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка при обновлении sidebar.js: {e}")
        return False

def update_sk_py():
    """Обновляет sk.py"""
    file_path = "sk.py"
    if not os.path.exists(file_path):
        print(f"❌ Файл не найден: {file_path}")
        return False
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ищем и заменяем JSON_FILES блок
        pattern = r'JSON_FILES\s*=\s*\[\s*(?:os\.path\.join\([^)]+\),?\s*)*\s*\]'
        
        new_files_code = f"JSON_FILES = [\n{generate_python_files_list()}\n]"
        
        # Заменяем
        new_content = re.sub(pattern, new_files_code, content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Обновлен sk.py")
            return True
        else:
            print(f"⚠️  Не найден блок JSON_FILES для замены в sk.py")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка при обновлении sk.py: {e}")
        return False

def main():
    print("Автоматическое обновление файлов для работы со 100 JSON файлами")
    print("=" * 70)
    
    # Обновляем HTML файлы
    html_files = [
        ("index.html", "главная страница"),
        ("story1.html", "страница истории"),
        ("blogosphere.html", "страница блога")
    ]
    
    for file_path, description in html_files:
        update_html_file(file_path, description)
    
    # Обновляем JavaScript файл
    update_sidebar_js()
    
    # Обновляем Python файл
    update_sk_py()
    
    print("\n" + "=" * 70)
    print("✅ Обновление завершено!")
    print("\nТеперь сайт будет загружать все 100 JSON файлов.")
    print("📊 Файлы 1-12 содержат истории (max 200 в файле)")
    print("📄 Файлы 13-100 пустые (готовы для новых историй)")

if __name__ == "__main__":
    main()
