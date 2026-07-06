/* ---------- Mobile menu (hamburger <-> X) ---------- */
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

function openMenu(){
  links.classList.add('open');
  document.body.classList.add('menu-open');
  if (toggle){ toggle.classList.add('active'); toggle.setAttribute('aria-expanded', 'true'); }
}
function closeMenu(){
  links.classList.remove('open');
  document.body.classList.remove('menu-open');
  if (toggle){ toggle.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); }
  document.querySelectorAll('.nav-links > li.dd-open').forEach(li => li.classList.remove('dd-open'));
}
if (toggle && links){
  toggle.addEventListener('click', () => {
    if (links.classList.contains('open')) closeMenu(); else openMenu();
  });
}

/* mobile dropdown accordion tap support (About / Get Involved / News) */
document.querySelectorAll('.nav-links > li > a').forEach(a => {
  a.addEventListener('click', (e) => {
    const parentLi = a.parentElement;
    const hasDropdown = parentLi.querySelector('.dropdown-wrap');
    if (window.innerWidth <= 900 && hasDropdown) {
      e.preventDefault();
      parentLi.classList.toggle('dd-open');
    } else if (window.innerWidth <= 900) {
      closeMenu();
    }
  });
});

/* close mobile menu on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && links && links.classList.contains('open')) closeMenu();
});

/* ---------- Dark mode ---------- */
const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" fill="currentColor"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.2" y1="4.2" x2="6" y2="6"/><line x1="18" y1="18" x2="19.8" y2="19.8"/><line x1="4.2" y1="19.8" x2="6" y2="18"/><line x1="18" y1="6" x2="19.8" y2="4.2"/></g></svg>';
const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 14.5C18.7 15.9 16.9 16.8 14.9 16.8C10.9 16.8 7.6 13.5 7.6 9.5C7.6 7.5 8.5 5.7 9.9 4.4C5.9 5.2 3 8.7 3 12.9C3 17.7 6.9 21.6 11.7 21.6C15.9 21.6 19.4 18.7 20 14.5Z" fill="currentColor"/></svg>';

const themeBtn = document.getElementById('themeToggleDesktop');
if (themeBtn){
  const themeIconEl = themeBtn.querySelector('.theme-icon');
  const themeLabelEl = themeBtn.querySelector('.theme-label');

  function setTheme(dark){
    document.body.classList.toggle('dark-mode', dark);
    if (themeIconEl) themeIconEl.innerHTML = dark ? sunIcon : moonIcon;
    if (themeLabelEl) themeLabelEl.textContent = dark ? 'Light Mode' : 'Dark Mode';
    try{ localStorage.setItem('sparkwhyz-theme', dark ? 'dark' : 'light'); }catch(e){}
  }

  let saved = null;
  try{ saved = localStorage.getItem('sparkwhyz-theme'); }catch(e){}
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved ? saved === 'dark' : prefersDark);

  themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark-mode')));
}

/* ---------- Chapter Leader modal (shows once per browser session) ---------- */
const chapterModal = document.getElementById('chapterModal');
if (chapterModal){
  const modalCloseBtn = chapterModal.querySelector('.modal-close');
  const modalLearnMore = chapterModal.querySelector('.modal-btn');

  function closeChapterModal(){
    chapterModal.classList.remove('show');
    try{ sessionStorage.setItem('sparkwhyz-chapter-modal-seen', '1'); }catch(e){}
  }

  let alreadySeen = false;
  try{ alreadySeen = sessionStorage.getItem('sparkwhyz-chapter-modal-seen'); }catch(e){}

  if (!alreadySeen){
    setTimeout(() => chapterModal.classList.add('show'), 900);
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeChapterModal);
  if (modalLearnMore) modalLearnMore.addEventListener('click', closeChapterModal);
  chapterModal.addEventListener('click', (e) => {
    if (e.target === chapterModal) closeChapterModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chapterModal.classList.contains('show')) closeChapterModal();
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
