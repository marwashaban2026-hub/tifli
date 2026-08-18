// =====================================================================
// دوال العرض الديناميكي — تقرأ من js/site-config.js
// لإضافة محتوى جديد، عدّل site-config.js فقط، لا حاجة لتعديل HTML.
// =====================================================================

function renderNav() {
  const navEl = document.getElementById('site-nav');
  if (!navEl || typeof SITE_PAGES === 'undefined') return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const ul = document.createElement('ul');
  SITE_PAGES.forEach(p => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = p.href;
    a.textContent = p.label;
    if (p.href === current) a.classList.add('active');
    li.appendChild(a);
    ul.appendChild(li);
  });
  navEl.appendChild(ul);
}

function videoCardHTML(v) {
  const filterAttr = v.filter ? ` data-age="${v.filter}"` : '';
  return `<a class="video-card"${filterAttr} href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
    <div class="video-real-thumb" style="background-image:url('https://img.youtube.com/vi/${v.id}/hqdefault.jpg');">
      <span class="play">▶</span><span class="src-badge">يوتيوب</span>
    </div>
    <div class="body">
      <span class="age-tag">${v.age}</span>
      <h3>${v.title}</h3>
      <p>${v.desc}</p>
    </div>
  </a>`;
}

function renderVideoGrid(containerId, group) {
  const el = document.getElementById(containerId);
  if (!el || typeof VIDEOS === 'undefined') return;
  const list = VIDEOS.filter(v => v.group === group);
  el.innerHTML = list.map(videoCardHTML).join('');
}

function renderRecycleProjects(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof RECYCLE_PROJECTS === 'undefined') return;
  el.innerHTML = RECYCLE_PROJECTS.map(p => `
    <div class="content-card">
      <div class="thumb" style="background:${p.bg};">${p.emoji}</div>
      <div class="body">
        <span class="age-tag">${p.age}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="materials-row">
          ${p.materials.map(m => `<span class="material-chip">${m}</span>`).join('')}
        </div>
      </div>
    </div>`).join('');
}

function renderRecipes(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof RECIPES === 'undefined') return;
  el.innerHTML = RECIPES.map(r => `
    <div class="recipe-mini-card">
      <div class="top-band"></div>
      <div class="body">
        <span class="steps-count">⏱️ ${r.time}</span>
        <h3>${r.title}</h3>
        <p style="color:var(--ink-soft); font-size:0.92rem;">${r.desc}</p>
      </div>
    </div>`).join('');
}

function exerciseCardHTML(ex) {
  return `<div class="exercise-card">
    <div class="exercise-thumb" style="background:${ex.bg};">${ex.emoji}</div>
    <div class="body">
      <span class="age-tag">${ex.age}</span>
      <h3>${ex.title}</h3>
      <p>${ex.desc}</p>
      <div class="benefit-row">
        ${ex.benefits.map(b => `<span class="benefit-chip">${b}</span>`).join('')}
      </div>
      <span class="duration-tag">⏱ ${ex.duration}</span>
    </div>
  </div>`;
}

function renderExercises(containerId) {
  const el = document.getElementById(containerId);
  if (!el || typeof EXERCISES === 'undefined') return;
  el.innerHTML = EXERCISES.map(exerciseCardHTML).join('');
}

// =====================================================================
// قائمة اللغات المخصّصة — واجهة متناسقة مع الموقع تتحكم بمحرك Google Translate
// =====================================================================
const LANG_NAMES = {
  ar: 'العربية', en: 'English', fr: 'Français', es: 'Español',
  ur: 'اردو', tr: 'Türkçe', de: 'Deutsch', ru: 'Русский', hi: 'हिन्दी'
};

function getCurrentLangFromCookie() {
  const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
  return match ? match[1] : 'ar';
}

function setSiteLanguage(lang) {
  const domain = location.hostname;
  const expire = 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  // نمسح أي كوكي سابقة أولًا (مع ومن دون domain) لتفادي تعارضها
  document.cookie = `googtrans=; ${expire} path=/;`;
  document.cookie = `googtrans=; ${expire} path=/; domain=${domain};`;
  if (lang !== 'ar') {
    document.cookie = `googtrans=/ar/${lang}; path=/;`;
  }
  location.reload();
}

function initLangSwitcher() {
  const btn = document.getElementById('lang-switcher-btn');
  const dropdown = document.getElementById('lang-dropdown');
  const label = document.getElementById('current-lang-label');
  if (!btn || !dropdown) return;

  const current = getCurrentLangFromCookie();
  if (label) label.textContent = LANG_NAMES[current] || 'العربية';

  dropdown.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.dataset.lang === current) opt.classList.add('active');
    opt.addEventListener('click', () => setSiteLanguage(opt.dataset.lang));
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
    btn.classList.toggle('open');
    btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

// ================= القائمة للجوال =================
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  initLangSwitcher();
  renderVideoGrid('speech-video-grid', 'speech');
  renderVideoGrid('moral-video-grid', 'moral');
  renderVideoGrid('recycle-video-grid', 'recycle');
  renderVideoGrid('nutrition-recipe-video-grid', 'nutrition-recipe');
  renderVideoGrid('exercise-video-grid', 'exercise');
  renderRecycleProjects('recycle-projects-grid');
  renderRecipes('recipes-grid');
  renderExercises('exercises-grid');

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });
  }

  // ================= فلترة البطاقات (قصص/ألعاب) =================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('[data-age]');
  if (filterBtns.length && filterCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const group = btn.dataset.filter;
        filterCards.forEach(card => {
          const show = group === 'all' || card.dataset.age === group;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ================= نموذج التواصل =================
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) {
        success.style.display = 'block';
        form.reset();
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // ================= لعبة الذاكرة =================
  const board = document.querySelector('.memory-board');
  if (board) initMemoryGame(board);

  // ================= تبويبات الفصول (صفحة الأزياء) =================
  const seasonTabs = document.querySelectorAll('.season-tab');
  const seasonPanels = document.querySelectorAll('.season-panel');
  if (seasonTabs.length && seasonPanels.length) {
    seasonTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        seasonTabs.forEach(t => t.classList.remove('active'));
        seasonPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.season-panel[data-season="${tab.dataset.season}"]`).classList.add('active');
      });
    });
  }
});

function initMemoryGame(board) {
  const emojiSet = ['🐘', '🦁', '🐸', '🐝', '🦋', '🐢', '🦊', '🐧'];
  const scoreEl = document.querySelector('.score');
  const winEl = document.querySelector('.game-win');
  const resetBtn = document.querySelector('.game-reset');

  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let lock = false;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function render() {
    board.innerHTML = '';
    cards.forEach((emoji, idx) => {
      const el = document.createElement('button');
      el.className = 'memory-card';
      el.setAttribute('aria-label', 'بطاقة مقلوبة');
      el.dataset.index = idx;
      el.textContent = '❔';
      el.addEventListener('click', () => flipCard(idx, el));
      board.appendChild(el);
    });
  }

  function flipCard(idx, el) {
    if (lock) return;
    if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
    if (flipped.length === 2) return;

    el.classList.add('flipped');
    el.textContent = cards[idx];
    flipped.push({ idx, el });

    if (flipped.length === 2) {
      moves++;
      if (scoreEl) scoreEl.textContent = `المحاولات: ${moves}`;
      const [a, b] = flipped;
      if (cards[a.idx] === cards[b.idx]) {
        a.el.classList.add('matched');
        b.el.classList.add('matched');
        matchedCount += 2;
        flipped = [];
        if (matchedCount === cards.length && winEl) {
          winEl.textContent = `🎉 أحسنت! أنهيت اللعبة في ${moves} محاولة`;
        }
      } else {
        lock = true;
        setTimeout(() => {
          a.el.classList.remove('flipped');
          b.el.classList.remove('flipped');
          a.el.textContent = '❔';
          b.el.textContent = '❔';
          flipped = [];
          lock = false;
        }, 800);
      }
    }
  }

  function startGame() {
    cards = shuffle([...emojiSet, ...emojiSet]);
    flipped = [];
    matchedCount = 0;
    moves = 0;
    lock = false;
    if (scoreEl) scoreEl.textContent = 'المحاولات: 0';
    if (winEl) winEl.textContent = '';
    render();
  }

  if (resetBtn) resetBtn.addEventListener('click', startGame);
  startGame();
}
