#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Sweet Stories — Facebook Autoposting
Run: python posting.py
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path

import requests

# ======================================================
# SETTINGS
# ======================================================

PAGE_ID    = "504763026059300"
PAGE_TOKEN = "EAAMoSJw3YHIBQ4B5WUaRrok7ct03crLVGU1cHghIK780YDx4zsus70ONNudAGkRXRvB48t8hi23FuGRx8kIe72ZBSr2Di3U1nFDHW4rrguYMbcS7o5FD6TLbO3U7zX9QZBw20LZCvcfiVBByiw3uIli0QsYtgQ02OostEGezhUaiTO4yaPNKl3MBo5yZCZB2dq0VL3waMt7xE8jkIdv6D"

POST_HOURS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
POST_TIMES = [f"{h:02d}:00" for h in POST_HOURS]

LAST_PUBLISHED_ID = 6291          # истории до этого ID уже опубликованы
STORY_URL         = "https://sweet-story.com/story1?id={}"
SLOT_WINDOW_MIN   = 5             # постить только если слот прошёл не более N минут назад
REQUEST_TIMEOUT   = (10, 30)
GRAPH             = "https://graph.facebook.com/v24.0"

RETRY_COUNT       = 3             # попыток при сетевой ошибке
RETRY_DELAY       = 15            # секунд между попытками
TOKEN_ERROR_PAUSE = 3600          # пауза (сек) при истёкшем токене — 1 час

BASE_DIR   = Path(__file__).resolve().parent
DATA_DIR   = BASE_DIR / "data"
IMAGES_DIR = BASE_DIR / "images"
STATE_FILE = BASE_DIR / "state.json"
LOG_FILE   = BASE_DIR / "posting.log"

# ======================================================
# LOGGING — консоль + файл
# ======================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[
        logging.FileHandler(str(LOG_FILE), encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ======================================================
# STATE  (state.json)
# ======================================================
# {
#   "last_id": 6291,
#   "today": "2026-02-22",
#   "today_slots": ["04:00"]
# }

def load_state() -> dict:
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, encoding="utf-8") as f:
                data = json.load(f)
            # Базовая валидация
            if isinstance(data.get("last_id"), int):
                return data
            log.warning("state.json повреждён — сброс к значениям по умолчанию")
        except Exception as e:
            log.warning(f"Не удалось прочитать state.json ({e}) — сброс к значениям по умолчанию")
    return {"last_id": LAST_PUBLISHED_ID, "today": "", "today_slots": []}


def save_state(state: dict):
    try:
        tmp = STATE_FILE.with_suffix(".tmp")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False, indent=2)
        tmp.replace(STATE_FILE)   # атомарная замена — не портит файл при обрыве питания
    except Exception as e:
        log.warning(f"Не удалось сохранить state.json: {e}")


def get_today_slots(state: dict) -> list:
    """Возвращает список использованных слотов. При смене дня — сбрасывает."""
    today = datetime.now().date().isoformat()
    if state.get("today") != today:
        state["today"] = today
        state["today_slots"] = []
    return state["today_slots"]

# ======================================================
# STORIES
# ======================================================

_stories_cache = None


def load_all_stories() -> list:
    global _stories_cache
    if _stories_cache is not None:
        return _stories_cache

    stories = []
    for path in sorted(DATA_DIR.glob("stories-*.json"),
                       key=lambda p: int(p.stem.split("-")[1])):
        try:
            with open(path, encoding="utf-8") as f:
                stories.extend(json.load(f))
        except Exception as e:
            log.warning(f"Пропуск файла {path.name}: {e}")

    stories.sort(key=lambda s: s["id"])
    _stories_cache = stories
    log.info(f"Загружено {len(stories)} историй из {DATA_DIR}")
    return stories


def get_next_story(last_id: int):
    for story in load_all_stories():
        if story["id"] > last_id:
            return story
    return None

# ======================================================
# SCHEDULING
# ======================================================

def get_active_slot(used_slots: list):
    """Возвращает слот, который наступил, но ещё не использован сегодня."""
    now_dt = datetime.now()
    for t in POST_TIMES:
        if t in used_slots:
            continue
        slot_dt = datetime.strptime(t, "%H:%M").replace(
            year=now_dt.year, month=now_dt.month, day=now_dt.day
        )
        diff = (now_dt - slot_dt).total_seconds()
        if 0 <= diff <= SLOT_WINDOW_MIN * 60:
            return t
    return None

# ======================================================
# TEXT
# ======================================================

def prepare_text(story: dict) -> str:
    title   = (story.get("title") or "История").strip()
    content = (story.get("content") or "").strip()

    if not content:
        return f"{title.upper()}\n\nПродолжение в комментариях ⬇️"

    cut   = int(len(content) * 0.6)
    short = content[:cut]
    if " " in short:
        short = short.rsplit(" ", 1)[0]
    short = short.rstrip(".,;:-—").rstrip()
    if len(content) > len(short):
        short += "..."

    return f"{title.upper()}\n\n{short}\n\nПродолжение в комментариях ⬇️"

# ======================================================
# FACEBOOK API — с retry
# ======================================================

def fb_post_photo(image_path: Path, caption: str):
    """Загружает фото на страницу. Возвращает JSON-ответ или None после всех попыток."""
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            with open(image_path, "rb") as img:
                resp = requests.post(
                    f"{GRAPH}/{PAGE_ID}/photos",
                    files={"source": img},
                    data={"caption": caption, "access_token": PAGE_TOKEN},
                    timeout=REQUEST_TIMEOUT,
                )
            return resp.json()
        except requests.RequestException as e:
            log.warning(f"Попытка {attempt}/{RETRY_COUNT} загрузки фото не удалась: {e}")
            if attempt < RETRY_COUNT:
                time.sleep(RETRY_DELAY)
    return None


def fb_post_comment(post_id: str, message: str):
    """Добавляет комментарий к посту. Возвращает JSON-ответ или None."""
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            resp = requests.post(
                f"{GRAPH}/{post_id}/comments",
                data={"message": message, "access_token": PAGE_TOKEN},
                timeout=REQUEST_TIMEOUT,
            )
            return resp.json()
        except requests.RequestException as e:
            log.warning(f"Попытка {attempt}/{RETRY_COUNT} добавления комментария не удалась: {e}")
            if attempt < RETRY_COUNT:
                time.sleep(RETRY_DELAY)
    return None

# ======================================================
# POSTING
# ======================================================

def post_story(story: dict, slot: str, state: dict) -> bool:
    sid        = story["id"]
    image_path = IMAGES_DIR / f"{sid}.webp"

    # Картинка не найдена — пропускаем историю, сдвигаем last_id
    if not image_path.exists():
        log.error(f"Картинка не найдена: {image_path} — пропускаю историю {sid}")
        state["last_id"] = sid
        get_today_slots(state).append(slot)
        save_state(state)
        return False

    text = prepare_text(story)

    # Загружаем фото
    r = fb_post_photo(image_path, text)

    if r is None:
        log.error(f"Все {RETRY_COUNT} попытки загрузки фото не удались — слот {slot} пропущен")
        # Слот не сжигаем — дадим шанс следующему запуску (если окно ещё не закрылось)
        return False

    if "post_id" not in r:
        error = r.get("error", {}) if isinstance(r, dict) else {}
        code  = error.get("code")
        msg   = error.get("message", str(r))
        log.error(f"Facebook ошибка код={code}: {msg}")

        if code == 190:
            log.critical("ТОКЕН ИСТЁК! Обнови PAGE_TOKEN в скрипте. Пауза 1 час.")
            time.sleep(TOKEN_ERROR_PAUSE)

        return False

    # Комментарий со ссылкой
    cr = fb_post_comment(r["post_id"], STORY_URL.format(sid))
    if not cr or "id" not in cr:
        log.warning(f"Комментарий не добавлен для истории {sid}: {cr}")

    # Сохраняем состояние
    state["last_id"] = sid
    get_today_slots(state).append(slot)
    save_state(state)

    log.info(f"OK | {slot} | Story {sid} | {story.get('title', '')[:60]}")
    return True

# ======================================================
# MAIN LOOP
# ======================================================

if __name__ == "__main__":
    state = load_state()
    load_all_stories()

    log.info("=" * 65)
    log.info("SWEET STORIES — Facebook Autoposting")
    log.info("=" * 65)
    log.info(f"Page ID      : {PAGE_ID}")
    log.info(f"Schedule     : {', '.join(POST_TIMES)}")
    log.info(f"Last posted  : ID {state['last_id']}")
    nxt = get_next_story(state["last_id"])
    if nxt:
        log.info(f"Next story   : ID {nxt['id']} | {nxt.get('title', '')[:55]}")
    else:
        log.warning("Все истории опубликованы!")
    log.info("=" * 65)
    log.info("Запущен. Проверка каждые 30 секунд. Ctrl+C для остановки.")

    try:
        while True:
            try:
                used_slots = get_today_slots(state)
                slot = get_active_slot(used_slots)
                if slot:
                    story = get_next_story(state["last_id"])
                    if story:
                        post_story(story, slot, state)
                    else:
                        log.warning("Больше нет историй для публикации!")
            except Exception as e:
                log.exception(f"Неожиданная ошибка в цикле: {e}")
            time.sleep(30)
    except KeyboardInterrupt:
        log.info("Остановлен вручную.")
