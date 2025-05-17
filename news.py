# article_uploader.py
# Скрипт на Tkinter для добавления статей в файл news.json с автогенерацией ID
# Поддержка drag-and-drop .txt, редактирования, кнопки для inline-картинок всегда видимой,
# конвертация всех изображений (главная и inline) в WebP, предпросмотр картинок,
# и горячих клавиш Ctrl+C, Ctrl+V, Ctrl+X на лат и кирилл для копирования/вставки

import os
import json
import re
import tkinter as tk
from tkinter import filedialog, messagebox

# Для drag-and-drop:
# pip install tkinterdnd2
try:
    from tkinterdnd2 import DND_FILES, TkinterDnD
except ImportError:
    raise ImportError("Установите tkinterdnd2: pip install tkinterdnd2")

# Для конвертации и предпросмотра WebP:
# pip install pillow
try:
    from PIL import Image, ImageTk
except ImportError:
    raise ImportError("Установите Pillow: pip install pillow")

JSON_FILE = 'news.json'
IMAGES_DIR = 'images2'
EXT = '.webp'
INLINE_PATTERN = r"{dir}/{{id}}-(\d+){ext}".format(dir=IMAGES_DIR, ext=re.escape(EXT))

class ArticleUploader(TkinterDnD.Tk):
    def __init__(self):
        super().__init__()
        self.title("Загрузчик статей")
        self.geometry("800x800")

        os.makedirs(IMAGES_DIR, exist_ok=True)

        # Загрузка существующих данных и вычисление следующего ID
        data = []
        if os.path.exists(JSON_FILE):
            try:
                with open(JSON_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except json.JSONDecodeError:
                data = []
        ids = [a.get('id', 0) for a in data]
        self.next_id = max(ids, default=0) + 1

        # Метка ID
        self.id_label = tk.Label(self, text=f"ID новой статьи: {self.next_id}", font=(None, 12, 'bold'))
        self.id_label.pack(anchor='w', padx=10, pady=(10,5))

        # Заголовок
        tk.Label(self, text="Заголовок:").pack(anchor='w', padx=10)
        self.title_entry = tk.Entry(self)
        self.title_entry.pack(fill='x', padx=10)

        # Просмотры
        tk.Label(self, text="Просмотры (например, 5.6к):").pack(anchor='w', padx=10, pady=(10,0))
        self.views_entry = tk.Entry(self)
        self.views_entry.pack(fill='x', padx=10)

        # Обложка
        tk.Label(self, text="Обложка (конвертируется в WebP):").pack(anchor='w', padx=10, pady=(10,0))
        self.btn_cover = tk.Button(self, text="Выбрать файл...", command=self.select_cover)
        self.btn_cover.pack(anchor='w', padx=10)
        self.cover_label = tk.Label(self, text="(не выбрано)")
        self.cover_label.pack(anchor='w', padx=10)
        self.cover_preview = tk.Label(self)
        self.cover_preview.pack(anchor='w', padx=10, pady=(5,10))
        self.cover_path = ''

        # Кнопка inline-картинки всегда видима
        self.btn_inline = tk.Button(self, text="Добавить доп картинку", command=self.insert_inline_image)
        self.btn_inline.pack(anchor='w', padx=10, pady=(10,0))
        self.inline_preview_frame = tk.Frame(self)
        self.inline_preview_frame.pack(anchor='w', padx=10, pady=(5,10))

        # Контент
        tk.Label(self, text="Контент: перетащите .txt или введите текст; абзацы через пустую строку").pack(anchor='w', padx=10, pady=(10,0))
        self.content_text = tk.Text(self, height=15)
        self.content_text.pack(fill='both', expand=True, padx=10)
        self.content_text.drop_target_register(DND_FILES)
        self.content_text.dnd_bind('<<Drop>>', self.drop_txt)

        # Горячие клавиши для копирования/вставки (лат и кирилл)
        self.content_text.bind('<Control-KeyPress>', self.handle_ctrl)

        # Сохранение
        tk.Button(self, text="Сохранить статью", command=self.save_article).pack(pady=10)

    def select_cover(self):
        path = filedialog.askopenfilename(
            title="Выберите файл для обложки",
            filetypes=[("Изображения", "*.png *.jpg *.jpeg *.webp *.svg *.*")]
        )
        if path:
            try:
                img = Image.open(path)
                dst = os.path.join(IMAGES_DIR, f"{self.next_id}{EXT}")
                img.save(dst, 'WEBP')
                self.cover_path = dst
                self.cover_label.config(text=os.path.basename(dst))
                thumb = img.copy()
                thumb.thumbnail((150, 150))
                self.cover_photo = ImageTk.PhotoImage(thumb)
                self.cover_preview.config(image=self.cover_photo)
            except Exception as e:
                messagebox.showerror("Ошибка", f"Не удалось конвертировать обложку: {e}")

    def drop_txt(self, event):
        files = self.splitlist(event.data)
        if files:
            try:
                with open(files[0], 'r', encoding='utf-8') as f:
                    txt = f.read()
                self.content_text.delete('1.0', 'end')
                self.content_text.insert('1.0', txt)
            except Exception as e:
                messagebox.showerror("Ошибка", f"Не удалось загрузить текст: {e}")

    def insert_inline_image(self):
        path = filedialog.askopenfilename(
            title="Выберите файл доп-картинки",
            filetypes=[("Изображения", "*.png *.jpg *.jpeg *.webp *.svg *.*")]
        )
        if not path:
            return
        try:
            img = Image.open(path)
            content = self.content_text.get('1.0', 'end')
            pattern = INLINE_PATTERN.format(id=self.next_id)
            matches = re.findall(pattern, content)
            idx = len(matches) + 1
            dst = os.path.join(IMAGES_DIR, f"{self.next_id}-{idx}{EXT}")
            img.save(dst, 'WEBP')
            placeholder = f"\"{IMAGES_DIR}/{self.next_id}-{idx}{EXT}\"," + ' '
            self.content_text.insert('insert', placeholder)
            thumb = img.copy()
            thumb.thumbnail((100,100))
            photo = ImageTk.PhotoImage(thumb)
            lbl = tk.Label(self.inline_preview_frame, image=photo)
            lbl.image = photo
            lbl.pack(side='left', padx=5)
        except Exception as e:
            messagebox.showerror("Ошибка", f"Не удалось конвертировать картинку: {e}")

    def handle_ctrl(self, event):
        # Поддержка Ctrl+C/V/X на лат и кирилл
        ks = event.keysym
        # копирование: лат 'c', кир 'с'
        if ks in ('c','C','с','С'):
            self.content_text.event_generate('<<Copy>>')
            return 'break'
        # вставка: лат 'v', кир 'м'
        if ks in ('v','V','м','М'):
            self.content_text.event_generate('<<Paste>>')
            return 'break'
        # вырезание: лат 'x', кир 'ч'
        if ks in ('x','X','ч','Ч'):
            self.content_text.event_generate('<<Cut>>')
            return 'break'

    def save_article(self):
        title = self.title_entry.get().strip()
        views = self.views_entry.get().strip()
        if not title or not views or not self.cover_path:
            messagebox.showerror("Ошибка", "Заполните все поля и выберите обложку.")
            return
        raw = self.content_text.get('1.0', 'end').strip()
        parts = [s.strip() for s in raw.split("\n\n") if s.strip()]
        article = {
            "id": self.next_id,
            "title": title,
            "views": views,
            "image": f"{IMAGES_DIR}/{self.next_id}{EXT}",
            "content": parts
        }
        data = []
        if os.path.exists(JSON_FILE):
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                except json.JSONDecodeError:
                    data = []
        data.append(article)
        data.sort(key=lambda x: x.get('id', 0))
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        messagebox.showinfo("Готово", f"Статья с ID {self.next_id} сохранена.")
        self.clear_all()

    def clear_all(self):
        self.next_id += 1
        self.id_label.config(text=f"ID новой статьи: {self.next_id}")
        self.title_entry.delete(0, 'end')
        self.views_entry.delete(0, 'end')
        self.cover_label.config(text="(не выбрано)")
        self.cover_path = ''
        self.cover_preview.config(image='')
        self.content_text.delete('1.0', 'end')
        for widget in self.inline_preview_frame.winfo_children():
            widget.destroy()

if __name__ == '__main__':
    app = ArticleUploader()
    app.mainloop()