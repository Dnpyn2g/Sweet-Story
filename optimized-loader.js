// optimized-loader.js - Оптимизированный загрузчик историй с ленивой загрузкой
class StoryLoader {
  constructor() {
    this.configUrl = 'data/config.json';
    this.configLoaded = false;
    this.config = {};

    this.activeFiles = [];
    this.pendingFiles = [];
    this.loadedFiles = new Set();
    this.fileStories = new Map();

    this.allStories = [];
    this.storyIndex = new Map();

    this.currentBatchPromise = null;
    this.totalEstimate = null;
  }

  async loadConfig() {
    if (this.configLoaded) return this.config;

    try {
      const response = await fetch(this.configUrl);
      const config = await response.json();

      this.activeFiles = Array.isArray(config.active_files) ? config.active_files : [];
      this.config = config;
      this.configLoaded = true;
    } catch (error) {
      console.warn('Не удалось загрузить конфигурацию, используем fallback', error);
      this.activeFiles = Array.from({ length: 15 }, (_, i) => i + 1);
      this.config = { active_files: this.activeFiles };
      this.configLoaded = true;
    }

    this.pendingFiles = [...this.activeFiles]
      .map(Number)
      .filter((num) => !Number.isNaN(num))
      .sort((a, b) => b - a); // Загрузка с актуальных файлов

    const { total_stories, stories_per_file } = this.config;
    const byConfig = typeof total_stories === 'number' && total_stories > 0 ? total_stories : null;
    const byCount = stories_per_file && this.pendingFiles.length
      ? stories_per_file * this.pendingFiles.length
      : null;
    this.totalEstimate = byConfig || byCount || null;

    return this.config;
  }

  async ensureStoriesForCount(targetCount) {
    await this.loadConfig();

    if (this.allStories.length >= targetCount || this.pendingFiles.length === 0) {
      return;
    }

    if (this.currentBatchPromise) {
      await this.currentBatchPromise;
      if (this.allStories.length >= targetCount || this.pendingFiles.length === 0) {
        return;
      }
    }

    const loadBatch = async () => {
      while (this.allStories.length < targetCount && this.pendingFiles.length) {
        const nextFile = this.pendingFiles.shift();
        await this.loadFile(nextFile);
      }
    };

    this.currentBatchPromise = loadBatch();

    try {
      await this.currentBatchPromise;
    } finally {
      this.currentBatchPromise = null;
    }
  }

  async loadFile(fileId) {
    if (this.loadedFiles.has(fileId)) return this.fileStories.get(fileId) || [];

    const url = `data/stories-${fileId}.json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const stories = Array.isArray(data) ? data : [];

      this.loadedFiles.add(fileId);
      this.fileStories.set(fileId, stories);
      this.mergeStories(stories);

      return stories;
    } catch (error) {
      console.warn(`Не удалось загрузить stories-${fileId}.json`, error);
      this.loadedFiles.add(fileId);
      this.fileStories.set(fileId, []);
      return [];
    }
  }

  mergeStories(stories) {
    if (!Array.isArray(stories) || !stories.length) return;

    for (const story of stories) {
      if (!story || story.id == null) continue;
      const key = String(story.id);
      if (this.storyIndex.has(key)) continue;
      this.storyIndex.set(key, story);
      this.allStories.push(story);
    }

    this.allStories.sort((a, b) => {
      const aid = Number(a?.id) || 0;
      const bid = Number(b?.id) || 0;
      return bid - aid;
    });
  }

  getLoadedStories() {
    return [...this.allStories];
  }

  getLoadedCount() {
    return this.allStories.length;
  }

  getEstimatedTotal() {
    if (this.pendingFiles.length === 0) return this.allStories.length;
    return Math.max(this.allStories.length, this.totalEstimate || 0);
  }

  calculateTotalPages(pageSize) {
    if (!pageSize) return 1;
    const estimate = this.getEstimatedTotal();
    if (!estimate) return 1;
    return Math.max(1, Math.ceil(estimate / pageSize));
  }

  hasRange(page, pageSize) {
    const safePage = Math.max(1, Number(page) || 1);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return this.allStories.length >= end;
  }

  peekPage(page = 1, pageSize = 12) {
    if (!this.hasRange(page, pageSize)) return null;
    const safePage = Math.max(1, Number(page) || 1);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return {
      page: safePage,
      stories: this.allStories.slice(start, end),
      totalLoaded: this.getLoadedCount(),
      totalPages: this.calculateTotalPages(pageSize),
      fullyLoaded: this.pendingFiles.length === 0,
    };
  }

  async getPage(page = 1, pageSize = 12) {
    const safePage = Math.max(1, Number(page) || 1);
    const targetCount = safePage * pageSize;
    await this.ensureStoriesForCount(targetCount);

    const totalPages = this.calculateTotalPages(pageSize);
    const normalizedPage = Math.min(safePage, totalPages) || 1;
    const start = (normalizedPage - 1) * pageSize;
    const end = start + pageSize;
    const stories = this.allStories.slice(start, end);

    if (this.pendingFiles.length === 0 && this.totalEstimate != null) {
      this.totalEstimate = this.allStories.length;
    }

    return {
      page: normalizedPage,
      stories,
      totalPages,
      totalLoaded: this.getLoadedCount(),
      totalAvailable: this.getEstimatedTotal(),
      fullyLoaded: this.pendingFiles.length === 0,
    };
  }

  async ensureMinimumStories(targetCount) {
    const desired = Math.max(0, Number(targetCount) || 0);
    await this.ensureStoriesForCount(desired);
    return this.getLoadedCount();
  }

  async prefetchNext(pageSize = 12, lookaheadPages = 1) {
    if (this.pendingFiles.length === 0) return false;

    const targetCount = this.allStories.length + pageSize * Math.max(1, lookaheadPages);

    if (this.allStories.length >= targetCount) return false;

    this.ensureStoriesForCount(targetCount).catch((err) => {
      console.warn('Не удалось выполнить предварительную загрузку историй', err);
    });

    return true;
  }

  async ensureAllStories() {
    await this.ensureStoriesForCount(Number.MAX_SAFE_INTEGER);
    return this.getLoadedStories();
  }

  async loadStories() {
    return this.ensureAllStories();
  }

  async searchStories(query) {
    const stories = await this.ensureAllStories();
    if (!query) return stories;

    const lowerQuery = query.toLowerCase();
    return stories.filter((story) =>
      story.title?.toLowerCase().includes(lowerQuery) ||
      story.content?.toLowerCase().includes(lowerQuery)
    );
  }

  async getRandomStories(count = 5) {
    await this.ensureStoriesForCount(Math.max(count, count * 2));
    if (this.pendingFiles.length && this.allStories.length < count) {
      await this.ensureAllStories();
    }

    const pool = this.allStories;
    if (pool.length <= count) return [...pool];

    const result = [];
    const used = new Set();

    while (result.length < count && used.size < pool.length) {
      const index = Math.floor(Math.random() * pool.length);
      if (used.has(index)) continue;
      used.add(index);
      result.push(pool[index]);
    }

    return result;
  }

  async findStoryById(id) {
    if (id == null) return undefined;
    const key = String(id);
    if (this.storyIndex.has(key)) return this.storyIndex.get(key);

    await this.loadConfig();

    const approxChunk = Number(this.config?.stories_per_file) || 200;
    let attempts = this.pendingFiles.length || this.activeFiles.length || 1;

    while (!this.storyIndex.has(key) && this.pendingFiles.length && attempts > 0) {
      const target = this.allStories.length + approxChunk;
      await this.ensureStoriesForCount(target);
      attempts -= 1;
    }

    if (this.storyIndex.has(key)) return this.storyIndex.get(key);

    if (this.pendingFiles.length === 0) {
      return this.storyIndex.get(key);
    }

    await this.ensureAllStories();
    return this.storyIndex.get(key);
  }
}

// Создаем глобальный экземпляр
window.storyLoader = new StoryLoader();
