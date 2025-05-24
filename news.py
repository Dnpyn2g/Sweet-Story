# article_uploader.py
# Улучшенный скрипт на Tkinter для добавления статей в файл news.json с автогенерацией ID
# Просмотры генерируются случайно от 1к до 30к и форматируются вида "8.5к"
# Поддержка drag-and-drop .txt, редактора с меню Edit, кнопок inline-картинок,
# конвертации изображений в WebP, предпросмотра картинок,
# контекстного меню и горячих клавиш Cut/Copy/Paste, работающих во всех языковых раскладках.

import os
import json
import re
import random
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

        # Меню Edit
        self._create_menus()

        # Глобальные бинды для всех Entry и Text виджетов
        self.bind_class('Entry', '<Control-KeyPress>', self.handle_ctrl)
        self.bind_class('Text', '<Control-KeyPress>', self.handle_ctrl)
        self.bind_class('Entry', '<Button-3>', self._show_context)
        self.bind_class('Text', '<Button-3>', self._show_context)

        os.makedirs(IMAGES_DIR, exist_ok=True)

        # Вычисление следующего ID
        data = []
        if os.path.exists(JSON_FILE):
            try:
                with open(JSON_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except json.JSONDecodeError:
                data = []
        ids = [a.get('id', 0) for a in data]
        self.next_id = max(ids, default=0) + 1

        # UI элементы
        self._build_ui()

    def _create_menus(self):
        menubar = tk.Menu(self)
        edit_menu = tk.Menu(menubar, tearoff=0)
        edit_menu.add_command(label="Cut", accelerator="Ctrl+X",
                              command=lambda: self.focus_get().event_generate('<<Cut>>'))
        edit_menu.add_command(label="Copy", accelerator="Ctrl+C",
                              command=lambda: self.focus_get().event_generate('<<Copy>>'))
        edit_menu.add_command(label="Paste", accelerator="Ctrl+V",
                              command=lambda: self.focus_get().event_generate('<<Paste>>'))
        menubar.add_cascade(label="Edit", menu=edit_menu)
        self.config(menu=menubar)

    def _show_context(self, event):
        widget = event.widget
        menu = tk.Menu(self, tearoff=0)
        menu.add_command(label="Cut", command=lambda: widget.event_generate('<<Cut>>'))
        menu.add_command(label="Copy", command=lambda: widget.event_generate('<<Copy>>'))
        menu.add_command(label="Paste", command=lambda: widget.event_generate('<<Paste>>'))
        menu.tk_popup(event.x_root, event.y_root)

    def _build_ui(self):
        # ID
        self.id_label = tk.Label(self, text=f"ID новой статьи: {self.next_id}", font=(None, 12, 'bold'))
        self.id_label.pack(anchor='w', padx=10, pady=(10,5))

        # Заголовок
        tk.Label(self, text="Заголовок:").pack(anchor='w', padx=10)
        self.title_entry = tk.Entry(self)
        self.title_entry.pack(fill='x', padx=10)

        # Инфо о просмотрах
        tk.Label(self, text="(Просмотры генерируются автоматически от 1к до 30к)").pack(anchor='w', padx=10, pady=(10,0))

        # Обложка
        tk.Label(self, text="Обложка (конвертируется в WebP):").pack(anchor='w', padx=10, pady=(10,0))
        self.btn_cover = tk.Button(self, text="Выбрать файл...", command=self.select_cover)
        self.btn_cover.pack(anchor='w', padx=10)
        self.cover_label = tk.Label(self, text="(не выбрано)")
        self.cover_label.pack(anchor='w', padx=10)
        self.cover_preview = tk.Label(self)
        self.cover_preview.pack(anchor='w', padx=10, pady=(5,10))
        self.cover_path = ''

        # Inline картинки
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

        # Кнопка Сохранить
        tk.Button(self, text="Сохранить статью", command=self.save_article).pack(pady=10)

    def select_cover(self):
        path = filedialog.askopenfilename(title="Выберите файл для обложки",
                                           filetypes=[("Изображения", "*.png *.jpg *.jpeg *.webp *.svg *.*")])
        if path:
            try:
                img = Image.open(path)
                dst = os.path.join(IMAGES_DIR, f"{self.next_id}{EXT}")
                img.save(dst, 'WEBP')
                self.cover_path = dst
                self.cover_label.config(text=os.path.basename(dst))
                thumb = img.copy()
                thumb.thumbnail((150,150))
                self.cover_photo = ImageTk.PhotoImage(thumb)
                self.cover_preview.config(image=self.cover_photo)
            except Exception as e:
                messagebox.showerror("Ошибка", f"Не удалось конвертировать обложку: {e}")

    def drop_txt(self, event):
        files = self.splitlist(event.data)
        if files:
            try:
                txt = open(files[0], 'r', encoding='utf-8').read()
                self.content_text.delete('1.0','end')
                self.content_text.insert('1.0', txt)
            except Exception as e:
                messagebox.showerror("Ошибка", f"Не удалось загрузить текст: {e}")

    def insert_inline_image(self):
        path = filedialog.askopenfilename(title="Выберите файл доп-картинки",
                                           filetypes=[("Изображения", "*.png *.jpg *.jpeg *.webp *.svg *.*")])
        if not path: return
        try:
            img = Image.open(path)
            content = self.content_text.get('1.0','end')
            matches = re.findall(INLINE_PATTERN.format(id=self.next_id), content)
            idx = len(matches) + 1
            dst = os.path.join(IMAGES_DIR, f"{self.next_id}-{idx}{EXT}")
            img.save(dst,'WEBP')
            placeholder = f'"{IMAGES_DIR}/{self.next_id}-{idx}{EXT}", '
            self.content_text.insert('insert', placeholder)
            thumb = img.copy(); thumb.thumbnail((100,100))
            photo = ImageTk.PhotoImage(thumb)
            lbl = tk.Label(self.inline_preview_frame, image=photo)
            lbl.image = photo; lbl.pack(side='left',padx=5)
        except Exception as e:
            messagebox.showerror("Ошибка", f"Не удалось конвертировать картинку: {e}")

    def handle_ctrl(self, event):
        ks = event.keysym.lower()
        if ks in ('x','с','ч'):
            event.widget.event_generate('<<Cut>>'); return 'break'
        if ks in ('c','с'):
            event.widget.event_generate('<<Copy>>'); return 'break'
        if ks in ('v','м'):
            event.widget.event_generate('<<Paste>>'); return 'break'

    def save_article(self):
        title = self.title_entry.get().strip()
        if not title or not self.cover_path:
            messagebox.showerror("Ошибка", "Заполните заголовок и выберите обложку.")
            return
        views_num = random.randint(1000,30000)
        views = f"{views_num//1000}к" if views_num%1000==0 else f"{views_num/1000:.1f}к"
        raw = self.content_text.get('1.0','end').strip()
        parts = [s.strip() for s in raw.split("\n\n") if s.strip()]
        article = {"id":self.next_id,"title":title,"views":views,
                   "image":f"{IMAGES_DIR}/{self.next_id}{EXT}","content":parts}
        data=[]
        if os.path.exists(JSON_FILE):
            try:
                data=json.load(open(JSON_FILE,'r',encoding='utf-8'))
            except:
                data=[]
        data.append(article); data.sort(key=lambda x:x.get('id',0))
        json.dump(data, open(JSON_FILE,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
        messagebox.showinfo("Готово", f"Статья с ID {self.next_id} сохранена.")
        self.clear_all()

    def clear_all(self):
        self.next_id+=1
        self.id_label.config(text=f"ID новой статьи: {self.next_id}")
        self.title_entry.delete(0,'end')
        self.cover_label.config(text="(не выбрано)")
        self.cover_path=''
        self.cover_preview.config(image='')
        self.content_text.delete('1.0','end')
        for w in self.inline_preview_frame.winfo_children(): w.destroy()

if __name__ == '__main__':
    app=ArticleUploader(); app.mainloop()
