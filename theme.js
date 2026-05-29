// theme.js — wires the theme-toggle button.
//
// The page <head> runs a tiny inline boot script that sets
// document.documentElement.dataset.theme BEFORE first paint, so the page
// never flashes the wrong colours. This file is the post-paint companion
// that flips the toggle on click and persists the choice.
//
// Storage key:  "sweet-theme"  →  "light" | "dark"
// Absence of the key means "follow OS preference".

(function () {
  var STORAGE_KEY = 'sweet-theme';

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
  }
  function writeStored(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (_) {}
  }

  function syncButton(theme) {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    btn.setAttribute('title', isDark ? 'Светлая тема' : 'Тёмная тема');
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    syncButton(theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(document.documentElement.dataset.theme || 'light');

    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var current = document.documentElement.dataset.theme || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      writeStored(next);
      applyTheme(next);
      if (window.gaTrack) {
        window.gaTrack('theme_change', { theme: next });
      }
    });
  });

  // If the user hasn't pressed the button, mirror their OS preference live.
  if (window.matchMedia) {
    try {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var handler = function (e) {
        if (readStored()) return; // user made an explicit choice — respect it
        applyTheme(e.matches ? 'dark' : 'light');
      };
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else if (mq.addListener)  mq.addListener(handler);
    } catch (_) {}
  }
})();
