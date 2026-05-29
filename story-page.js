// story-page.js — progressive enhancement for /stories/{id}.html.
// The page itself is fully pre-rendered. This script only adds:
//   - reading progress bar
//   - bottom MGID banner (appears after 50% scroll)
//   - "Read also" recommendations from the chunked index
//   - Web Share API (where supported)
//   - mobile menu toggle
//   - GA pageview tracking is handled by /google-analytics.js

(() => {
  const body = document.body;
  const storyId = body && body.dataset ? body.dataset.storyId : null;
  if (!storyId) return;

  // ---------------------------------------------------------------- progress
  const progressBar = document.getElementById('progress');
  if (progressBar) {
    const milestones = { 25: 0, 50: 0, 75: 0, 90: 0, 100: 0 };
    document.addEventListener('scroll', () => {
      const docEl = document.documentElement;
      const height = docEl.scrollHeight - window.innerHeight;
      const pct = height ? (window.scrollY / height) * 100 : 0;
      progressBar.style.width = pct + '%';

      [25, 50, 75, 90].forEach((m) => {
        if (!milestones[m] && pct >= m) {
          milestones[m] = 1;
          if (window.gaTrack) window.gaTrack('read_depth', { percent: m });
        }
      });
      if (
        !milestones[100] &&
        window.innerHeight + window.scrollY + 5 >= docEl.scrollHeight
      ) {
        milestones[100] = 1;
        if (window.gaTrack) window.gaTrack('read_complete', {});
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------- banner
  class BottomBanner {
    constructor() {
      this.banner = document.getElementById('bottomBanner');
      this.hideBtn = document.getElementById('hideBannerBtn');
      if (!this.banner) return;
      this.isVisible = false;
      this.threshold = 0.5;
      this.resetThreshold = 0.45;
      this.crossedOnce = false;
      this._init();
    }
    _init() {
      window.addEventListener('scroll', () => this._onScroll(), { passive: true });
      if (this.hideBtn) this.hideBtn.addEventListener('click', () => this.hide());
      this.banner.addEventListener('transitionend', (e) => {
        if (e.target === this.banner && this.isVisible) this._loadMgid();
      });
      window.addEventListener('resize', () => {
        if (this.isVisible) document.body.style.marginBottom = this._height();
      });
    }
    _onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = window.scrollY / scrollable;
      if (progress < this.resetThreshold) this.crossedOnce = false;
      if (progress >= this.threshold && !this.crossedOnce && !this.isVisible) {
        this.crossedOnce = true;
        this.show();
      }
    }
    show() {
      if (this.isVisible || !this.banner) return;
      this.banner.classList.add('show');
      this.isVisible = true;
      document.body.style.marginBottom = this._height();
    }
    hide() {
      if (!this.isVisible || !this.banner) return;
      this.banner.classList.remove('show');
      this.isVisible = false;
      document.body.style.marginBottom = '0';
    }
    _height() {
      const w = window.innerWidth;
      if (w <= 480) return '70vh';
      if (w <= 768) return '60vh';
      return '50vh';
    }
    _loadMgid() { if (window._mgq) window._mgq.push(['_mgc.load']); }
  }
  window.bottomBanner = new BottomBanner();

  // load any MGID widgets that are already present in the pre-rendered HTML
  if (window._mgq) window._mgq.push(['_mgc.load']);

  // ---------------------------------------------------------------- share
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn && navigator.share) {
    const fallbackHref = shareBtn.href;
    shareBtn.href = '#share';
    shareBtn.removeAttribute('target');
    shareBtn.removeAttribute('rel');
    shareBtn.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await navigator.share({
          title: document.title,
          text:  (document.querySelector('meta[name="description"]') || {}).content || '',
          url:   window.location.href,
        });
        if (window.gaTrack) {
          window.gaTrack('share_click', {
            method: 'web_share',
            content_type: 'story',
            item_id: String(storyId),
          });
        }
      } catch (err) {
        if (err && err.name !== 'AbortError') {
          shareBtn.href = fallbackHref;
        }
      }
    });
  } else if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (window.gaTrack) {
        window.gaTrack('share_click', {
          method: 'facebook',
          content_type: 'story',
          item_id: String(storyId),
        });
      }
    });
  }

  // ---------------------------------------------------------------- recommendations
  const recContainer = document.getElementById('recommendations');
  if (recContainer && window.storyLoader) {
    (async () => {
      try {
        const excludeKey = String(storyId);
        const seen = new Set([excludeKey]);
        const picks = [];

        const primary = await window.storyLoader.getPage(1, 20);
        for (const story of primary.stories) {
          if (!story || story.id == null) continue;
          const key = String(story.id);
          if (seen.has(key)) continue;
          seen.add(key);
          picks.push(story);
        }

        if (picks.length < 5) {
          const extra = await window.storyLoader.getRandomStories(10);
          for (const story of extra) {
            if (!story || story.id == null) continue;
            const key = String(story.id);
            if (seen.has(key)) continue;
            seen.add(key);
            picks.push(story);
          }
        }

        for (let i = picks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [picks[i], picks[j]] = [picks[j], picks[i]];
        }
        const chosen = picks.slice(0, 5);
        if (!chosen.length) return;

        const fragment = document.createDocumentFragment();
        const heading = document.createElement('h3');
        heading.textContent = 'Читайте также';
        fragment.appendChild(heading);

        const list = document.createElement('ul');
        for (const story of chosen) {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = '/stories/' + encodeURIComponent(story.id) + '.html';
          link.textContent = story.title || 'История';
          li.appendChild(link);
          list.appendChild(li);
        }
        fragment.appendChild(list);

        recContainer.replaceChildren(fragment);
        recContainer.hidden = false;

        window.storyLoader.prefetchNext(12, 2);
      } catch (err) {
        console.warn('Не удалось отрисовать рекомендации', err);
      }
    })();
  }

  // ---------------------------------------------------------------- menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
})();
