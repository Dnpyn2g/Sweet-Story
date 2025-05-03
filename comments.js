document.addEventListener('DOMContentLoaded', () => {
    // Добавляем стили через JS
    const style = document.createElement('style');
    style.textContent = `
      .comments-section {
        margin: 40px auto;
        background: #fff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        max-width: 800px;
        animation: fadeIn 0.5s ease-out both;
      }
      .comments-section h3 {
        margin-bottom: 20px;
        font-size: 1.6em;
        color: #222;
        text-align: center;
      }
      #comments-list {
        margin-bottom: 30px;
      }
      .comment {
        background: #f9f9f9;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        animation: slideUp 0.4s ease-out both;
      }
      .comment strong {
        display: block;
        margin-bottom: 8px;
        color: #4a90e2;
        font-size: 1.1em;
      }
      #comment-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      #comment-form input,
      #comment-form textarea {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1em;
      }
      #comment-form textarea {
        resize: vertical;
        min-height: 100px;
      }
      #comment-form button {
        padding: 12px;
        background: #4a90e2;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-weight: 700;
        font-size: 1em;
        cursor: pointer;
        transition: background 0.3s;
      }
      #comment-form button:hover {
        background: #357ab8;
      }
      @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
      @keyframes slideUp { from {transform:translateY(20px);opacity:0;} to {transform:translateY(0);opacity:1;} }
    `;
    document.head.appendChild(style);
  
    // Фиксированные комментарии прямо в коде
    const commentsData = [
      { "author": "Виктор", "text": "Потрясающая история! Очень тронула, спасибо за эмоции." },
      { "author": "Елена", "text": "Чудесная история, такая теплая и искренняя." },
      { "author": "Денис", "text": "Эмоции просто зашкаливают. Спасибо за такую историю!" },
      { "author": "Алёна", "text": "Не могу перестать думать о ней. Очень вдохновляет." },
      { "author": "Константин", "text": "Прекрасное произведение! Особенно понравился момент с прощением." },
      { "author": "Надежда", "text": "Тема очень близка. Хорошо написано, будет интересно почитать продолжение." },
      { "author": "Максим", "text": "Что-то в этой истории есть особенное. Очень понравилось!" },
      { "author": "Юлия", "text": "Как приятно читать такие душевные истории. Продолжайте в том же духе!" },
      { "author": "Дмитрий", "text": "Читал на одном дыхании. Мощно!" },
      { "author": "Ксения", "text": "Очень понравилась концовка. Столько чувств!" },
      { "author": "Андрей", "text": "Эмоционально и очень живо. Спасибо за такую публикацию." },
      { "author": "Виктория", "text": "Как здорово, что такие истории еще пишут. Спасибо за вдохновение." },
      { "author": "Роман", "text": "Прочитал и не могу забыть. Это что-то невероятное." },
      { "author": "Татьяна", "text": "Очень тронула, понравилась идея прощения. Спасибо автору." }
    ];
  
    const commentsContainer = document.getElementById('comments-container');
    if (!commentsContainer) {
      console.error('Нет элемента #comments-container для вставки комментариев.');
      return;
    }
  
    commentsContainer.innerHTML = `
      <section class="comments-section">
        <h3>Комментарии</h3>
        <div id="comments-list"></div>
        <form id="comment-form">
          <input type="text" id="comment-author" placeholder="Ваше имя" required>
          <input type="email" id="comment-email" placeholder="Ваша почта" required>
          <textarea id="comment-text" placeholder="Ваш комментарий..." required></textarea>
          <button type="submit">Оставить комментарий</button>
        </form>
      </section>
    `;
  
    const commentsList = document.getElementById('comments-list');
    const commentForm = document.getElementById('comment-form');
    const authorInput = document.getElementById('comment-author');
    const emailInput = document.getElementById('comment-email');
    const textInput = document.getElementById('comment-text');
  
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    function loadComments() {
      commentsList.innerHTML = '';
  
      if (commentsData.length === 0) {
        commentsList.innerHTML = '<p>Комментариев пока нет. Будьте первым!</p>';
        return;
      }
  
      shuffle(commentsData);
  
      const numberOfComments = Math.floor(Math.random() * 3) + 5; // 5–7 комментариев
      const selectedComments = commentsData.slice(0, numberOfComments);
  
      selectedComments.forEach(c => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `<strong>${c.author}</strong><p>${c.text}</p>`;
        commentsList.appendChild(div);
      });
    }
  
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = authorInput.value.trim();
      const email = emailInput.value.trim();
      const text = textInput.value.trim();
      if (!author || !email || !text) {
        alert('Пожалуйста, заполните все поля: имя, почта и комментарий.');
        return;
      }
  
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<strong>${author}</strong><p>${text}</p>`;
      commentsList.prepend(div);
  
      commentForm.reset();
    });
  
    loadComments();
  });
  