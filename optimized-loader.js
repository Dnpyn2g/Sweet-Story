// optimized-loader.js - Оптимизированный загрузчик историй
class StoryLoader {
  constructor() {
    this.configUrl = 'data/config.json';
    this.activeFiles = [];
    this.allStories = [];
    this.loadingPromise = null;
  this.loadedFiles = new Set();
  this.cacheKey = 'stories_cache_v1';
  this.cacheTTLms = 6 * 60 * 60 * 1000; // 6h
  this.initialFileLimit = null; // можно задать извне (например мобильная оптимизация)
  }

  async loadConfig() {
    try {
      const response = await fetch(this.configUrl);
      const config = await response.json();
      this.activeFiles = config.active_files || [];
  this.configVersion = config.last_updated || '';
      return config;
    } catch (error) {
      console.warn('Не удалось загрузить конфигурацию, используем fallback');
      // Fallback: пробуем первые 15 файлов
      this.activeFiles = Array.from({length: 15}, (_, i) => i + 1);
      return { active_files: this.activeFiles };
    }
  }

  async loadStories() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._doLoadStories();
    return this.loadingPromise;
  }

  async _doLoadStories() {
    // Загружаем конфигурацию
    await this.loadConfig();

    // Загружаем только активные файлы
    const fetchPromises = this.activeFiles.map(fileNum => 
      fetch(`data/stories-${fileNum}.json`)
        .then(res => res.json())
        .catch(error => {
          console.warn(`Не удалось загрузить stories-${fileNum}.json:`, error);
          return []; // Возвращаем пустой массив при ошибке
        })
    );

    try {
      const arrays = await Promise.all(fetchPromises);
      this.allStories = arrays.flat().sort((a, b) => b.id - a.id);
  this.saveCache(this.allStories);
      return this.allStories;
    } catch (error) {
      console.error('Ошибка при загрузке историй:', error);
      return [];
    }
  }

  getStories() {
    return this.allStories;
  }

  async searchStories(query) {
    const stories = await this.loadStories();
    if (!query) return stories;
    
    const lowerQuery = query.toLowerCase();
    return stories.filter(story => 
      story.title?.toLowerCase().includes(lowerQuery) ||
      story.content?.toLowerCase().includes(lowerQuery)
    );
  }

  async getRandomStories(count = 5) {
    const stories = await this.loadStories();
    const shuffled = [...stories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async findStoryById(id) {
    const stories = await this.loadStories();
    return stories.find(story => String(story.id) === String(id));
  }

  /**
   * Инкрементальная загрузка: по одному JSON файлу подряд.
   * callback получает растущий массив историй (отсортированных).
   */
  async loadStoriesIncremental(onBatch) {
    if (this.allStories.length) {
      onBatch?.(this.allStories);
    }
    await this.loadConfig();
    // Загружаем последовательно чтобы быстрее отдать первый контент
    const remaining = [];
    let processed = 0;
    for (const fileNum of this.activeFiles) {
      if (this.loadedFiles.has(fileNum)) continue;
      const withinInitial = !this.initialFileLimit || processed < this.initialFileLimit;
      if (!withinInitial) { remaining.push(fileNum); continue; }
      try {
        const res = await fetch(`data/stories-${fileNum}.json`);
        const arr = await res.json();
        this.loadedFiles.add(fileNum);
        processed++;
        this.allStories = this.allStories.concat(arr).sort((a,b)=>b.id-a.id);
        onBatch?.(this.allStories);
        this.saveCache(this.allStories, true);
      } catch(e) { console.warn('Incremental load error for', fileNum, e); }
    }
    if (remaining.length) {
      const schedule = (cb)=> (window.requestIdleCallback? window.requestIdleCallback(cb,{timeout:5000}): setTimeout(cb,800));
      schedule(async () => {
        for (const fileNum of remaining) {
          if (this.loadedFiles.has(fileNum)) continue;
            try {
              const res = await fetch(`data/stories-${fileNum}.json`);
              const arr = await res.json();
              this.loadedFiles.add(fileNum);
              this.allStories = this.allStories.concat(arr).sort((a,b)=>b.id-a.id);
              onBatch?.(this.allStories);
              this.saveCache(this.allStories, true);
            } catch(e){ console.warn('Deferred load error', fileNum, e); }
        }
      });
    }
    return this.allStories;
  }

  // ===== Local cache =====
  getCache() {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (!obj || !obj.stories) return null;
      if (this.configVersion && obj.version && obj.version !== this.configVersion) return null; // версия сменилась
      if (obj.ts && Date.now() - obj.ts > this.cacheTTLms) return null; // TTL
      return obj;
    } catch(e){ return null; }
  }
  saveCache(stories, incremental=false) {
    try {
      if (!Array.isArray(stories) || !stories.length) return;
      // не переписываем слишком часто при инкрементальных батчах
      if (incremental) {
        if (this._lastCacheWrite && Date.now() - this._lastCacheWrite < 5000) return;
      }
      const payload = { stories, ts: Date.now(), version: this.configVersion || '' };
      localStorage.setItem(this.cacheKey, JSON.stringify(payload));
      this._lastCacheWrite = Date.now();
    } catch(e){ /* ignore quota */ }
  }
}

// Создаем глобальный экземпляр
window.storyLoader = new StoryLoader();
