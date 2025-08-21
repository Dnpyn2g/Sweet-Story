// banner.js – управление нижним баннером (общий модуль)
class BottomBanner {
  constructor({ delay = 3000 } = {}) {
    this.banner = document.getElementById('bottomBanner');
    this.hideBtn = document.getElementById('hideBannerBtn');
    if (!this.banner || !this.hideBtn) return;
    this.isVisible = false;
    this.showDelay = delay;
    this._init();
  }
  _init() {
    setTimeout(() => this.show(), this.showDelay);
    this.hideBtn.setAttribute('aria-label', 'Скрыть рекомендуемые материалы');
    this.hideBtn.addEventListener('click', () => this.hide());
    this.banner.addEventListener('transitionend', (e) => {
      if (e.target === this.banner && this.isVisible) {
        this._loadMgidWidget();
      }
    });
  }
  show() {
    if (this.isVisible || !this.banner) return;
    this.banner.classList.add('show', 'animate-in');
    this.isVisible = true;
    document.body.style.marginBottom = this._getBannerHeight();
  // Однократная попытка загрузки рекламы
  this._loadMgidWidget();
  }
  hide() {
    if (!this.isVisible || !this.banner) return;
    this.banner.classList.remove('show', 'animate-in');
    this.isVisible = false;
    document.body.style.marginBottom = '0';
  }
  forceShow() { if (!this.isVisible) this.show(); }
  _getBannerHeight() {
    const w = window.innerWidth;
    if (w <= 480) return '70vh';
    if (w <= 768) return '60vh';
    return '50vh';
  }
  _loadMgidWidget() {
    if (window._mgq) {
      window._mgq.push(['_mgc.load']);
      this.lastLoadTs = Date.now();
    }
  }
}
window.initBottomBanner = function(options) { window.bottomBanner = new BottomBanner(options); };
window.showBanner = function(){ window.bottomBanner?.forceShow(); };
window.hideBanner = function(){ window.bottomBanner?.hide(); };
window.clearBannerData = function(){ localStorage.removeItem('bannerHidden'); };
window.reloadBannerAds = function(){ window.bottomBanner?._loadMgidWidget(); };
// Автоинициализация
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bottomBanner')) {
    const isStory = location.pathname.includes('story1');
    window.initBottomBanner({ delay: isStory ? 2000 : 3000 });
  }
});
