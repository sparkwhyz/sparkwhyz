/* ---------- Mobile menu ---------- */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

function closeChapterModalOnly(){
  const chapterModal = document.getElementById('chapterModal');
  if (chapterModal) {
    chapterModal.classList.remove('show');
  }
}

function openMenu(){
  closeChapterModalOnly();

  if (!links) return;

  links.classList.add('open');
  document.body.classList.add('menu-open');

  if (toggle){
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  }
}

function closeMenu(){
  if (!links) return;

  links.classList.remove('open');
  document.body.classList.remove('menu-open');

  if (toggle){
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }

  document.querySelectorAll('.nav-links > li.dd-open').forEach(li => {
    li.classList.remove('dd-open');
  });
}

if (toggle && links){
  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

/* ---------- Mobile dropdown accordion ---------- */
document.querySelectorAll('.nav-links > li > a').forEach(a => {
  a.addEventListener('click', (e) => {
    const parentLi = a.parentElement;
    const hasDropdown = parentLi && parentLi.querySelector('.dropdown-wrap');

    if (window.innerWidth <= 900 && hasDropdown) {
      e.preventDefault();

      document.querySelectorAll('.nav-links > li.dd-open').forEach(li => {
        if (li !== parentLi) li.classList.remove('dd-open');
      });

      parentLi.classList.toggle('dd-open');
    } else if (window.innerWidth <= 900) {
      closeMenu();
    }
  });
});

/* ---------- Escape closes menu/modal ---------- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (links && links.classList.contains('open')) closeMenu();

    const chapterModal = document.getElementById('chapterModal');
    if (chapterModal && chapterModal.classList.contains('show')) {
      closeChapterModal();
    }
  }
});

/* ---------- Dark mode ---------- */
const sunIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
  <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const moonIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M21 14.4C19.6 18.5 15.7 21.5 11.1 21.5C5.8 21.5 1.5 17.2 1.5 11.9C1.5 7.3 4.5 3.4 8.6 2C7.8 3.3 7.4 4.8 7.4 6.4C7.4 11.9 12.1 16.6 17.6 16.6C19.2 16.6 20.7 16.2 21 14.4Z" fill="currentColor"/>
</svg>`;

const themeBtn = document.getElementById('themeToggleDesktop');

if (themeBtn){
  const themeIconEl = themeBtn.querySelector('.theme-icon');
  const themeLabelEl = themeBtn.querySelector('.theme-label');

  function setTheme(dark){
    document.body.classList.toggle('dark-mode', dark);

    if (themeIconEl) {
      themeIconEl.innerHTML = dark ? sunIcon : moonIcon;
    }

    if (themeLabelEl) {
      themeLabelEl.textContent = dark ? 'Light Mode' : 'Dark Mode';
    }

    try {
      localStorage.setItem('sparkwhyz-theme', dark ? 'dark' : 'light');
    } catch(e) {}
  }

  let saved = null;

  try {
    saved = localStorage.getItem('sparkwhyz-theme');
  } catch(e) {}

  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  setTheme(saved ? saved === 'dark' : prefersDark);

  themeBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
  });
}

/* ---------- Chapter Leader modal ---------- */
const chapterModal = document.getElementById('chapterModal');

function closeChapterModal(){
  if (!chapterModal) return;

  chapterModal.classList.remove('show');

  try {
    sessionStorage.setItem('sparkwhyz-chapter-modal-seen', '1');
  } catch(e) {}
}

if (chapterModal){
  const modalCloseBtn = chapterModal.querySelector('.modal-close');
  const modalLearnMore = chapterModal.querySelector('.modal-btn');

  let alreadySeen = false;

  try {
    alreadySeen = sessionStorage.getItem('sparkwhyz-chapter-modal-seen');
  } catch(e) {}

  if (!alreadySeen){
    setTimeout(() => {
      if (!document.body.classList.contains('menu-open')) {
        chapterModal.classList.add('show');
      }
    }, 1200);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeChapterModal);
  }

  if (modalLearnMore) {
    modalLearnMore.addEventListener('click', closeChapterModal);
  }

  chapterModal.addEventListener('click', (e) => {
    if (e.target === chapterModal) {
      closeChapterModal();
    }
  });
}

/* ---------- Scroll reveal animations ---------- */
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}
