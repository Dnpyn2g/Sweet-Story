// smartAd.js
document.addEventListener('DOMContentLoaded', () => {
    // Ждём вставки .story-detail
    const observer = new MutationObserver((mutations, obs) => {
      const storyDetail = document.querySelector('.story-detail');
      if (!storyDetail) return;
      obs.disconnect();
  
      // 1. Добавляем стили для smart-ad
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }
  
        .smart-ad {
          position: relative;
          margin: 30px auto;
          max-width: 800px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          overflow: hidden;
          animation: fadeIn 0.5s ease-out both;
        }
        .smart-ad .ad-close-btn {
          position: absolute;
          top: 8px;
          right: 12px;
          width: 24px;
          height: 24px;
          background: rgba(0,0,0,0.5);
          color: #fff;
          border: none;
          border-radius: 50%;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .smart-ad .ad-close-btn:hover {
          background: rgba(0,0,0,0.8);
        }
  
        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .smart-ad {
            margin: 20px 0;
            max-width: 100%;
            border-radius: 0;
            box-shadow: none;
          }
          .smart-ad .ad-close-btn {
            top: 4px;
            right: 8px;
          }
        }
      `;
      document.head.appendChild(style);
  
      // 2. Создаём контейнер и кнопку закрытия
      const ad = document.createElement('div');
      ad.className = 'smart-ad';
      ad.innerHTML = `
        <button class="ad-close-btn" aria-label="Закрыть объявление">&times;</button>
        <div class="AeSeqT373166"></div>
      `;
  
      // 3. Вставляем сразу после истории
      storyDetail.insertAdjacentElement('afterend', ad);
  
      // 4. Инициализируем ваш рекламный скрипт
      window.k_init = window.k_init || [];
      window.k_init.push({
        id: 'AeSeqT373166',
        type: 'bn',
        domain: 'hdbkome.com',
        refresh: false,
        next: 0
      });
      const s = document.createElement('script');
      s.async = true;
      s.charset = 'utf-8';
      s.setAttribute('data-cfasync', 'false');
      s.src = 'https://hdbkome.com/18n27g00.js';
      document.head.appendChild(s);
  
      // 5. Закрытие рекламы
      ad.querySelector('.ad-close-btn').addEventListener('click', () => {
        ad.remove();
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  });
  