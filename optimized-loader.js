// optimized-loader.js - Оптимизированный загрузчик историй
class StoryLoader {
  constructor() {
    this.configUrl = 'data/config.json';
    this.activeFiles = [];
    this.allStories = [];
    this.loadingPromise = null;
  }

  async loadConfig() {
    try {
      const response = await fetch(this.configUrl);
      const config = await response.json();
      this.activeFiles = config.active_files || [];
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
}

// Создаем глобальный экземпляр
window.storyLoader = new StoryLoader();
