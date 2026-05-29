#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Sweet Story — static site builder.

Reads data/stories-*.json (legacy chunks) and produces:
  data/chunks/{n}.json   — compact pages of 60 stories (id, title, image, excerpt)
  data/chunks/index.json — { total_stories, total_chunks, stories_per_chunk }
  stories/{id}.html      — fully pre-rendered story pages (SEO, social share)
  sitemap.xml            — list of all URLs for search engines
  robots.txt             — crawler rules

Run:  python build.py
"""
import html
import json
import re
import shutil
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR    = Path(__file__).resolve().parent
DATA_DIR    = BASE_DIR / "data"
CHUNKS_DIR  = DATA_DIR / "chunks"
STORIES_DIR = BASE_DIR / "stories"
IMAGES_DIR  = BASE_DIR / "images"

SITE_URL          = "https://sweet-story.com"
SITE_NAME         = "Sweet Story"
SITE_DESCRIPTION  = "Сообщество историй — короткие рассказы и реальные истории из жизни."
DEFAULT_OG_IMAGE  = "/images/Cupcake.svg"
STORIES_PER_CHUNK = 60
EXCERPT_LEN       = 160
DESC_LEN          = 160
TITLE_TAG_LIMIT   = 45   # Google trims <title> around 60 chars; leave room for " — Sweet Story" suffix

BUILD_ISO = datetime.now(timezone.utc).isoformat()
BUILD_DATE = datetime.now(timezone.utc).strftime("%Y-%m-%d")


def cap_title(text: str, limit: int = TITLE_TAG_LIMIT) -> str:
    if len(text) <= limit:
        return text
    cut = text[:limit - 1].rstrip()
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip(",.;:-—") + "…"


def escape_json_ld(text: str) -> str:
    """Prevent script-tag breakout in JSON-LD blocks.

    Replaces '</' with '<\\/' which is still valid JSON but doesn't terminate
    the surrounding <script> element when the HTML parser sees it.
    """
    return text.replace("</", "<\\/")


# ---------------------------------------------------------------- utilities

def strip_html(text: str) -> str:
    if not text:
        return ""
    no_tags = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", no_tags).strip()


def make_excerpt(content: str, length: int = EXCERPT_LEN) -> str:
    plain = strip_html(content or "")
    if len(plain) <= length:
        return plain
    cut = plain[:length].rstrip()
    if " " in cut:
        cut = cut.rsplit(" ", 1)[0]
    return cut.rstrip(",.;:-—") + "…"


def absolute(path: str) -> str:
    if not path:
        return SITE_URL + DEFAULT_OG_IMAGE
    if path.startswith(("http://", "https://")):
        return path
    if not path.startswith("/"):
        path = "/" + path
    return SITE_URL + path


def story_url(story_id) -> str:
    return f"{SITE_URL}/stories/{story_id}.html"


# ---------------------------------------------------------------- load data

def load_all_stories() -> list:
    stories = []
    seen = set()
    files = sorted(
        DATA_DIR.glob("stories-*.json"),
        key=lambda p: int(p.stem.split("-")[1]),
    )
    for path in files:
        try:
            with open(path, encoding="utf-8") as f:
                payload = json.load(f)
        except Exception as e:
            print(f"  ! skip {path.name}: {e}")
            continue
        if not isinstance(payload, list):
            continue
        for story in payload:
            if not isinstance(story, dict):
                continue
            sid = story.get("id")
            if sid is None or sid in seen:
                continue
            seen.add(sid)
            stories.append(story)
    stories.sort(key=lambda s: int(s.get("id", 0)), reverse=True)
    return stories


# ---------------------------------------------------------------- chunks

def build_chunks(stories: list) -> int:
    if CHUNKS_DIR.exists():
        shutil.rmtree(CHUNKS_DIR)
    CHUNKS_DIR.mkdir(parents=True, exist_ok=True)

    light = [
        {
            "id":      s.get("id"),
            "title":   s.get("title", ""),
            "image":   s.get("image", ""),
            "excerpt": make_excerpt(s.get("content", "")),
        }
        for s in stories
    ]

    total_chunks = (len(light) + STORIES_PER_CHUNK - 1) // STORIES_PER_CHUNK or 1
    for n in range(total_chunks):
        chunk = light[n * STORIES_PER_CHUNK : (n + 1) * STORIES_PER_CHUNK]
        with open(CHUNKS_DIR / f"{n + 1}.json", "w", encoding="utf-8") as f:
            json.dump(chunk, f, ensure_ascii=False, separators=(",", ":"))

    index = {
        "total_stories":      len(light),
        "total_chunks":       total_chunks,
        "stories_per_chunk":  STORIES_PER_CHUNK,
        "generated_at":       datetime.now(timezone.utc).isoformat(),
    }
    with open(CHUNKS_DIR / "index.json", "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    return total_chunks


# ---------------------------------------------------------------- story page

STORY_TEMPLATE = """<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title_tag}</title>
<meta name="description" content="{description}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">

<meta property="og:type" content="article">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og_image}">
<meta property="og:site_name" content="Sweet Story">
<meta property="og:locale" content="ru_RU">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">

<link rel="icon" href="/images/favicon.ico" type="image/x-icon">
<link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
{image_preload}
<script>(function(){{try{{var t=localStorage.getItem('sweet-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;}}catch(e){{}}}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://jsc.mgid.com" crossorigin>
<link rel="preconnect" href="https://www.googletagmanager.com">
<link rel="stylesheet" href="/st.css">

<style>
.bottom-banner{{position:fixed;left:0;right:0;bottom:0;transform:translateY(100%);transition:transform .35s ease,opacity .35s ease;opacity:.98;z-index:1000}}
.bottom-banner.show{{transform:translateY(0)}}
.reading-progress{{position:fixed;top:0;left:0;height:3px;background:#555;width:0;z-index:1100}}
.skip-link{{position:absolute;left:-9999px;top:0;background:#fff;color:#cc6f00;padding:8px 12px;border-radius:4px;z-index:9999}}
.skip-link:focus{{left:8px;top:8px}}
</style>

<script type="application/ld+json">{json_ld}</script>

<script src="/optimized-loader.js" defer></script>
<script>window.gaTrack=window.gaTrack||function(){{(window.gaQueue=window.gaQueue||[]).push(arguments)}};</script>
<script src="/google-analytics.js" defer></script>
<script src="https://jsc.mgid.com/site/1042649.js" async></script>
</head>
<body data-story-id="{story_id}">
<a href="#story-container" class="skip-link">Перейти к содержимому</a>
<div id="global-mgid" data-type="_mgwidget" data-widget-id="1828363"></div>

<header class="site-header">
  <div class="container">
    <a href="/" class="logo" aria-label="На главную">← Назад</a>
    <button class="menu-toggle" aria-label="Открыть меню">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>
    <nav class="main-nav" aria-label="Основная навигация">
      <a href="/">Главная</a>
      <a href="/about.html">О нас</a>
      <a href="/contact.html">Контакты</a>
    </nav>
    <button class="theme-toggle" id="themeToggle" type="button" aria-label="Переключить тему" aria-pressed="false">
      <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
      <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </div>
</header>

<div class="reading-progress" id="progress" role="presentation"></div>

<div class="container">
  <main>
    <article class="story-detail" id="story-container">
      <h1 class="story-title">{title_html}</h1>
      {image_block}
      <div class="story-meta">Просмотров: {views}</div>
      <div class="story-content">{content_html}</div>

      <div class="mgid-widget-story mgid-widget-end">
        <div data-type="_mgwidget" data-widget-id="1838858"></div>
      </div>

      <div class="btn-group">
        <a href="/" class="btn return-btn">Вернуться к списку</a>
        <a href="{share_url}" target="_blank" rel="noopener noreferrer" class="btn share-btn" id="shareBtn">Поделиться историей</a>
      </div>
    </article>

    <div id="recommendations" class="recommendations" hidden></div>
    <div id="comments-container"></div>
  </main>
</div>

<footer class="site-footer">
  <div class="container">© 2025 Сообщество Историй · <a href="/privacy.html">Конфиденциальность</a> · <a href="/contact.html">Контакты</a></div>
</footer>

<div id="bottomBanner" class="bottom-banner" role="region" aria-label="Рекомендуемые материалы">
  <div class="banner-header">
    <h3 class="banner-title">Рекомендуемые материалы</h3>
    <button id="hideBannerBtn" class="banner-hide-btn" aria-label="Скрыть баннер">Спрятать</button>
  </div>
  <div class="banner-content">
    <div class="banner-widget">
      <div data-type="_mgwidget" data-widget-id="1843264"></div>
    </div>
  </div>
</div>

<script src="/story-page.js" defer></script>
<script src="/comments.js" defer></script>
<script src="/theme.js" defer></script>
</body>
</html>
"""


def render_story_html(story: dict) -> str:
    sid          = story.get("id")
    raw_title    = (story.get("title") or "История").strip()
    raw_content  = story.get("content") or ""
    raw_views    = story.get("views") or "—"
    raw_image    = story.get("image") or ""

    short_title  = cap_title(raw_title)
    title_tag    = html.escape(f"{short_title} — {SITE_NAME}", quote=True)
    og_title     = html.escape(raw_title, quote=True)
    title_html   = html.escape(raw_title)

    plain        = strip_html(raw_content)
    description  = html.escape(
        (plain[:DESC_LEN].rstrip() + "…") if len(plain) > DESC_LEN else plain,
        quote=True,
    )

    canonical    = story_url(sid)
    share_url    = html.escape(
        "https://www.facebook.com/sharer/sharer.php?u=" + canonical,
        quote=True,
    )

    if raw_image:
        rel_image_path = absolute(raw_image).replace(SITE_URL, "")
        image_path     = html.escape(rel_image_path, quote=True)
        og_image       = html.escape(absolute(raw_image), quote=True)
        image_preload  = f'<link rel="preload" as="image" href="{image_path}" fetchpriority="high">'
        alt_text       = raw_title if len(raw_title) <= 100 else raw_title[:99].rstrip() + "…"
        image_block    = (
            f'<img class="story-image" src="{image_path}" '
            f'alt="{html.escape(alt_text, quote=True)}" '
            f'width="1200" height="630" fetchpriority="high">'
        )
    else:
        og_image       = html.escape(SITE_URL + DEFAULT_OG_IMAGE, quote=True)
        image_preload  = ""
        image_block    = ""

    paragraphs   = [p.strip() for p in re.split(r"\r?\n", raw_content) if p.strip()]
    rendered     = []
    for i, p in enumerate(paragraphs):
        rendered.append(f"<p>{html.escape(p)}</p>")
        if i == 2 and len(paragraphs) > 4:
            rendered.append(
                '<div class="mgid-widget-story mgid-widget-inline">'
                '<div data-type="_mgwidget" data-widget-id="1828354"></div>'
                '</div>'
            )
    content_html = "".join(rendered)

    json_ld_raw = json.dumps({
        "@context":         "https://schema.org",
        "@type":            "Article",
        "headline":         raw_title,
        "description":      strip_html(raw_content)[:DESC_LEN],
        "image":            absolute(raw_image) if raw_image else SITE_URL + DEFAULT_OG_IMAGE,
        "url":              canonical,
        "datePublished":    BUILD_ISO,
        "dateModified":     BUILD_ISO,
        "author":           {"@type": "Organization", "name": SITE_NAME, "url": SITE_URL},
        "publisher": {
            "@type": "Organization",
            "name":  SITE_NAME,
            "url":   SITE_URL,
            "logo":  {"@type": "ImageObject", "url": f"{SITE_URL}/images/logo.png"},
        },
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
        "genre":            "Рассказ",
    }, ensure_ascii=False, separators=(",", ":"))
    json_ld = escape_json_ld(json_ld_raw)

    return STORY_TEMPLATE.format(
        title_tag     = title_tag,
        og_title      = og_title,
        title_html    = title_html,
        description   = description,
        canonical     = canonical,
        share_url     = share_url,
        image_preload = image_preload,
        og_image      = og_image,
        image_block   = image_block,
        content_html  = content_html,
        views         = html.escape(str(raw_views)),
        story_id      = html.escape(str(sid)),
        json_ld       = json_ld,
    )


def build_story_pages(stories: list) -> int:
    if STORIES_DIR.exists():
        shutil.rmtree(STORIES_DIR)
    STORIES_DIR.mkdir(parents=True, exist_ok=True)

    written = 0
    for story in stories:
        sid = story.get("id")
        if sid is None:
            continue
        out = STORIES_DIR / f"{sid}.html"
        with open(out, "w", encoding="utf-8") as f:
            f.write(render_story_html(story))
        written += 1
    return written


# ---------------------------------------------------------------- sitemap / robots

def build_sitemap(stories: list):
    today = BUILD_DATE

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    static_pages = [
        ("/",              "1.0", "daily"),
        ("/about.html",    "0.5", "monthly"),
        ("/contact.html",  "0.5", "monthly"),
        ("/privacy.html",  "0.3", "yearly"),
    ]
    for path, prio, freq in static_pages:
        lines += [
            "  <url>",
            f"    <loc>{SITE_URL}{path}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f"    <changefreq>{freq}</changefreq>",
            f"    <priority>{prio}</priority>",
            "  </url>",
        ]

    for story in stories:
        sid = story.get("id")
        if sid is None:
            continue
        lines += [
            "  <url>",
            f"    <loc>{story_url(sid)}</loc>",
            f"    <lastmod>{today}</lastmod>",
            "    <changefreq>monthly</changefreq>",
            "    <priority>0.7</priority>",
            "  </url>",
        ]

    lines.append("</urlset>")

    with open(BASE_DIR / "sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def build_robots():
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /data/\n"
        "Disallow: /story1\n"
        "Disallow: /story1/\n"
        "Disallow: /story1.html\n"
        f"Sitemap: {SITE_URL}/sitemap.xml\n"
    )
    with open(BASE_DIR / "robots.txt", "w", encoding="utf-8") as f:
        f.write(content)


def sync_legacy_story1():
    """Keep story1/index.html identical to story1.html.

    GitHub Pages and most static hosts honour both /story1 -> story1.html and
    /story1 -> story1/index.html, but local servers (python -m http.server,
    workers.dev) only resolve the second form. Mirroring the file makes the
    legacy URL /story1?id=NNNN work everywhere.
    """
    src = BASE_DIR / "story1.html"
    if not src.exists():
        return
    dst_dir = BASE_DIR / "story1"
    dst_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst_dir / "index.html")


# ---------------------------------------------------------------- main

def main():
    print("Sweet Story — build start")
    stories = load_all_stories()
    print(f"  loaded stories      : {len(stories)}")
    if not stories:
        print("  no stories — abort")
        return

    chunks = build_chunks(stories)
    print(f"  chunks written      : {chunks}  -> data/chunks/")

    pages = build_story_pages(stories)
    print(f"  story pages written : {pages}  -> stories/")

    build_sitemap(stories)
    print(f"  sitemap.xml         : {len(stories) + 4} urls")

    build_robots()
    print(f"  robots.txt          : ok")

    sync_legacy_story1()
    print(f"  story1/index.html   : synced from story1.html")

    print("done.")


if __name__ == "__main__":
    main()
