document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const storyId = urlParams.get('id');

    function loadStory() {
        const storyContent = document.getElementById('story-content');
        storyContent.innerHTML = '<strong>Загрузка...</strong>';

        fetch('stories.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке истории');
                }
                return response.json();
            })
            .then(stories => {
                const story = stories.find(item => item.id == storyId);
                if (story) {
                    document.getElementById('story-title').innerText = story.title;
                    document.getElementById('story-title-main').innerText = story.title;
                    document.getElementById('story-views').innerText = `Просмотрено: ${story.views} человек`;
                    document.getElementById('story-image').src = story.image;
                    document.getElementById('story-image').alt = story.title;

                    const storyTextParts = story.content.split(/\n+/); // Разделение текста на абзацы
                    const middleIndex = Math.floor(storyTextParts.length / 2);

                    const firstPart = storyTextParts.slice(0, middleIndex).map(paragraph => `<p>${paragraph}</p>`).join('');
                    const secondPart = storyTextParts.slice(middleIndex).map(paragraph => `<p>${paragraph}</p>`).join('');

                    storyContent.innerHTML = `
                        ${firstPart}
                        <div id="ad-container" style="text-align:center; margin: 20px 0;">
                            <div id="bn_fa2c257f43"></div>
                        </div>
                        ${secondPart}
                    `;

                    // Инициализация рекламы
                    const adScript = document.createElement('script');
                    adScript.type = 'text/javascript';
                    adScript.innerHTML = `
                        'use strict';(function(C,b,m,r){function t(){b.removeEventListener("scroll",t);f()}function u(){p=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(p.unobserve(n.target),f())})},{root:null,rootMargin:"400px 200px",threshold:0});p.observe(e)}function f(){(e=e||b.getElementById("bn_"+m))?(e.innerHTML="",e.id="bn_"+v,q={act:"init",id:m,rnd:v,ms:w},(d=b.getElementById("rcMain"))?c=d.contentWindow:D(),c.rcMain?c.postMessage(q,x):c.rcBuf.push(q)):g("!bn")}function E(a,n,F,y){function z(){var h=
                        n.createElement("script");h.type="text/javascript";h.src=a;h.onerror=function(){k++;5>k?setTimeout(z,10):g(k+"!"+a)};h.onload=function(){y&&y();k&&g(k+"!"+a)};F.appendChild(h)}var k=0;z()}function D(){try{d=b.createElement("iframe"),d.style.setProperty("display","none","important"),d.id="rcMain",b.body.insertBefore(d,b.body.children[0]),c=d.contentWindow,l=c.document,l.open(),l.close(),A=l.body,Object.defineProperty(c,"rcBuf",{enumerable:!1,configurable:!1,writable:!1,value:[]}),E("https://go.rcvlink.com/static/main.js",
                        l,A,function(){for(var a;c.rcBuf&&(a=c.rcBuf.shift());)c.postMessage(a,x)})}catch(a){B(a)}}function B(a){g(a.name+": "+a.message+"\t"+(a.stack?a.stack.replace(a.name+": "+a.message,""):""))}function g(a){console.error(a);(new Image).src="https://go.rcvlinks.com/err/?code="+m+"&ms="+((new Date).getTime()-w)+"&ver="+G+"&text="+encodeURIComponent(a)}try{var G="231101-0007",x=location.origin||location.protocol+"//"+location.hostname+(location.port?":"+location.port:""),e=b.getElementById("bn_"+m),v=Math.random().toString(36).substring(2,
                        15),w=(new Date).getTime(),p,H=!"IntersectionObserver"in C,q,d,c,l,A;e?"scroll"==r?b.addEventListener("scroll",t):"lazy"==r?H?f():"loading"==b.readyState?b.addEventListener("DOMContentLoaded",u):u():f():"loading"==b.readyState?b.addEventListener("DOMContentLoaded",f):g("!bn")}catch(a){B(a)}})(window,document,"fa2c257f43","{LOADTYPE}");
                    `;
                    document.getElementById('bn_fa2c257f43').appendChild(adScript);

                    const currentUrl = `https://sweet-story.online?id=${story.id}`;
                    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(story.title)}`;
                    document.getElementById('share-facebook').href = facebookShareUrl;
                } else {
                    document.querySelector('.story').innerHTML = '<p>История не найдена!</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки истории:', error);
                document.querySelector('.story').innerHTML = '<p>Произошла ошибка при загрузке данных. Попробуйте позже.</p>';
            });
    }

    function loadSidebar() {
        fetch('stories.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке сайдбара');
                }
                return response.json();
            })
            .then(stories => {
                const sidebar = document.querySelector('.sidebar ul');
                sidebar.innerHTML = '';

                const randomStories = stories.sort(() => 0.5 - Math.random()).slice(0, 9);

                randomStories.forEach(story => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="story1.html?id=${story.id}">${story.title}</a>`;
                    sidebar.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Ошибка загрузки историй для сайдбара:', error);
                document.querySelector('.sidebar ul').innerHTML = '<li>Не удалось загрузить истории. Попробуйте позже.</li>';
            });
    }

    function loadComments() {
        fetch('comments.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети при загрузке комментариев');
                }
                return response.json();
            })
            .then(comments => {
                const commentsSection = document.getElementById('comments-section');
                commentsSection.innerHTML = '';

                if (comments.length > 0) {
                    const randomComments = comments.sort(() => 0.5 - Math.random()).slice(0, 3);

                    randomComments.forEach(comment => {
                        const commentBlock = document.createElement('div');
                        commentBlock.style.borderBottom = '1px solid #ddd';
                        commentBlock.style.marginBottom = '10px';
                        commentBlock.style.paddingBottom = '10px';

                        commentBlock.innerHTML = `
                            <p><strong>${comment.author}</strong></p>
                            <p>${comment.text}</p>
                        `;
                        commentsSection.appendChild(commentBlock);
                    });
                } else {
                    commentsSection.innerHTML = '<p style="text-align: center;">Здесь пока нет комментариев. Будьте первым!</p>';
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки комментариев:', error);
                document.getElementById('comments-section').innerHTML = '<p style="text-align: center;">Не удалось загрузить комментарии. Попробуйте позже.</p>';
            });
    }

    // Вызов функций загрузки
    loadStory();
    loadSidebar();
    loadComments();
});
