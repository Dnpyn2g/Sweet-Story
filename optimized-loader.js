// optimized-loader.js — chunked story loader for the pre-rendered site.
// Reads data/chunks/index.json once and lazily fetches data/chunks/{n}.json on demand.
// Each chunk is ~30 KB and contains { id, title, image, excerpt } for STORIES_PER_CHUNK items.
// Full story content lives in the pre-rendered /stories/{id}.html — no full-content fetch here.

class StoryLoader {
  constructor() {
    this.indexUrl = '/data/chunks/index.json';
    this.chunkUrlBase = '/data/chunks/';

    this.indexLoaded = false;
    this.totalStories = 0;
    this.totalChunks = 0;
    this.storiesPerChunk = 60;

    this.chunks = new Map();          // chunkNum -> array of light stories
    this.chunkPromises = new Map();   // chunkNum -> in-flight promise
    this.allStories = [];             // ordered, deduplicated
    this.storyIndex = new Map();      // id (string) -> light story
  }

  async loadIndex() {
    if (this.indexLoaded) return;
    try {
      const response = await fetch(this.indexUrl);
      const meta = await response.json();
      this.totalStories = Number(meta.total_stories) || 0;
      this.totalChunks = Number(meta.total_chunks) || 0;
      this.storiesPerChunk = Number(meta.stories_per_chunk) || 60;
    } catch (error) {
      console.warn('Не удалось загрузить data/chunks/index.json', error);
      this.totalChunks = 0;
      this.totalStories = 0;
    }
    this.indexLoaded = true;
  }

  async loadChunk(chunkNum) {
    if (chunkNum < 1 || chunkNum > this.totalChunks) return [];
    if (this.chunks.has(chunkNum)) return this.chunks.get(chunkNum);
    if (this.chunkPromises.has(chunkNum)) return this.chunkPromises.get(chunkNum);

    const promise = (async () => {
      try {
        const response = await fetch(`${this.chunkUrlBase}${chunkNum}.json`);
        const data = await response.json();
        const stories = Array.isArray(data) ? data : [];
        this.chunks.set(chunkNum, stories);
        this.mergeStories(stories);
        return stories;
      } catch (error) {
        console.warn(`Не удалось загрузить chunk ${chunkNum}`, error);
        this.chunks.set(chunkNum, []);
        return [];
      } finally {
        this.chunkPromises.delete(chunkNum);
      }
    })();

    this.chunkPromises.set(chunkNum, promise);
    return promise;
  }

  mergeStories(stories) {
    for (const story of stories) {
      if (!story || story.id == null) continue;
      const key = String(story.id);
      if (this.storyIndex.has(key)) continue;
      this.storyIndex.set(key, story);
      this.allStories.push(story);
    }
  }

  async ensureChunksForCount(targetCount) {
    await this.loadIndex();
    if (!this.totalChunks) return;
    const chunksNeeded = Math.min(
      this.totalChunks,
      Math.max(1, Math.ceil(targetCount / this.storiesPerChunk)),
    );
    for (let n = 1; n <= chunksNeeded; n++) {
      if (!this.chunks.has(n)) await this.loadChunk(n);
    }
  }

  async ensureAllStories() {
    await this.loadIndex();
    for (let n = 1; n <= this.totalChunks; n++) {
      if (!this.chunks.has(n)) await this.loadChunk(n);
    }
    return this.allStories;
  }

  getLoadedStories() { return [...this.allStories]; }
  getLoadedCount()   { return this.allStories.length; }

  getEstimatedTotal() {
    return this.totalStories || this.allStories.length;
  }

  calculateTotalPages(pageSize) {
    if (!pageSize) return 1;
    const total = this.getEstimatedTotal();
    if (!total) return 1;
    return Math.max(1, Math.ceil(total / pageSize));
  }

  hasRange(page, pageSize) {
    const safePage = Math.max(1, Number(page) || 1);
    const end = safePage * pageSize;
    return this.allStories.length >= end;
  }

  async getPage(page = 1, pageSize = 12) {
    const safePage = Math.max(1, Number(page) || 1);
    const targetCount = safePage * pageSize;
    await this.ensureChunksForCount(targetCount);

    const totalPages = this.calculateTotalPages(pageSize);
    const normalizedPage = Math.min(safePage, totalPages) || 1;
    const start = (normalizedPage - 1) * pageSize;
    const end = start + pageSize;
    const stories = this.allStories.slice(start, end);

    const fullyLoaded =
      this.chunks.size === this.totalChunks && this.totalChunks > 0;

    return {
      page:           normalizedPage,
      stories,
      totalPages,
      totalLoaded:    this.getLoadedCount(),
      totalAvailable: this.getEstimatedTotal(),
      fullyLoaded,
    };
  }

  async ensureMinimumStories(targetCount) {
    await this.ensureChunksForCount(Math.max(0, Number(targetCount) || 0));
    return this.getLoadedCount();
  }

  async prefetchNext(pageSize = 12, lookaheadPages = 1) {
    await this.loadIndex();
    if (!this.totalChunks) return false;

    const targetCount =
      this.allStories.length + pageSize * Math.max(1, lookaheadPages);
    const chunksNeeded = Math.min(
      this.totalChunks,
      Math.ceil(targetCount / this.storiesPerChunk),
    );

    for (let n = 1; n <= chunksNeeded; n++) {
      if (!this.chunks.has(n) && !this.chunkPromises.has(n)) {
        this.loadChunk(n).catch(() => {});
      }
    }
    return true;
  }

  async getRandomStories(count = 5) {
    await this.ensureChunksForCount(Math.max(count * 4, this.storiesPerChunk));
    const pool = this.allStories;
    if (pool.length <= count) return [...pool];

    const result = [];
    const used = new Set();
    while (result.length < count && used.size < pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      if (used.has(i)) continue;
      used.add(i);
      result.push(pool[i]);
    }
    return result;
  }

  async searchStories(query) {
    const stories = await this.ensureAllStories();
    if (!query) return stories;
    const q = String(query).toLowerCase();
    return stories.filter((s) =>
      (s.title || '').toLowerCase().includes(q) ||
      (s.excerpt || '').toLowerCase().includes(q),
    );
  }

  async findStoryById(id) {
    if (id == null) return undefined;
    const key = String(id);
    if (this.storyIndex.has(key)) return this.storyIndex.get(key);

    await this.ensureAllStories();
    return this.storyIndex.get(key);
  }
}

window.storyLoader = new StoryLoader();
