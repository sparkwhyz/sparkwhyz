const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const chapterModal = document.getElementById("chapterModal");

function closeMenu() {
  if (!navLinks || !navToggle) return;
  navLinks.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  document.querySelectorAll(".nav-links > li.dd-open").forEach((item) => {
    item.classList.remove("dd-open");
  });
}

function openMenu() {
  if (!navLinks || !navToggle) return;
  closeChapterModal(false);
  navLinks.classList.add("open");
  navToggle.classList.add("active");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.contains("open") ? closeMenu() : openMenu();
  });
}

document.querySelectorAll(".nav-links > li").forEach((item) => {
  const mainLink = item.querySelector(":scope > a");
  const dropdown = item.querySelector(":scope > .dropdown-wrap");
  if (!mainLink) return;

  mainLink.addEventListener("click", (event) => {
    if (window.innerWidth > 900) return;

    if (dropdown) {
      event.preventDefault();
      document.querySelectorAll(".nav-links > li.dd-open").forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove("dd-open");
      });
      item.classList.toggle("dd-open");
    } else {
      closeMenu();
    }
  });
});

document.querySelectorAll(".dropdown a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 900) closeMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

const sunIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
  <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

const moonIcon = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M21 14.4C19.6 18.5 15.7 21.5 11.1 21.5C5.8 21.5 1.5 17.2 1.5 11.9C1.5 7.3 4.5 3.4 8.6 2C7.8 3.3 7.4 4.8 7.4 6.4C7.4 11.9 12.1 16.6 17.6 16.6C19.2 16.6 20.7 16.2 21 14.4Z" fill="currentColor"/>
</svg>`;

const themeButton = document.getElementById("themeToggleDesktop");

function applyTheme(useDarkMode) {
  document.body.classList.toggle("dark-mode", useDarkMode);
  if (!themeButton) return;

  const icon = themeButton.querySelector(".theme-icon");
  const label = themeButton.querySelector(".theme-label");
  if (icon) icon.innerHTML = useDarkMode ? sunIcon : moonIcon;
  if (label) label.textContent = useDarkMode ? "Light Mode" : "Dark Mode";

  themeButton.setAttribute(
    "aria-label",
    useDarkMode ? "Switch to light mode" : "Switch to dark mode"
  );

  try {
    localStorage.setItem("sparkwhyz-theme", useDarkMode ? "dark" : "light");
  } catch (_) {}
}

if (themeButton) {
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("sparkwhyz-theme");
  } catch (_) {}

  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(savedTheme ? savedTheme === "dark" : systemPrefersDark);

  themeButton.addEventListener("click", () => {
    applyTheme(!document.body.classList.contains("dark-mode"));
  });
}

function closeChapterModal(remember = true) {
  if (!chapterModal) return;
  chapterModal.classList.remove("show");
  chapterModal.setAttribute("aria-hidden", "true");

  if (remember) {
    try {
      sessionStorage.setItem("sparkwhyz-chapter-modal-seen", "true");
    } catch (_) {}
  }
}

function openChapterModal() {
  if (!chapterModal) return;
  closeMenu();
  chapterModal.classList.add("show");
  chapterModal.setAttribute("aria-hidden", "false");
}

if (chapterModal) {
  const closeButton = chapterModal.querySelector(".modal-close");
  const modalButton = chapterModal.querySelector(".modal-btn");
  chapterModal.setAttribute("aria-hidden", "true");

  let seen = false;
  try {
    seen = sessionStorage.getItem("sparkwhyz-chapter-modal-seen") === "true";
  } catch (_) {}

  if (!seen) {
    window.setTimeout(() => {
      if (!document.body.classList.contains("menu-open")) openChapterModal();
    }, 1200);
  }

  if (closeButton) closeButton.addEventListener("click", () => closeChapterModal(true));
  if (modalButton) modalButton.addEventListener("click", () => closeChapterModal(true));

  chapterModal.addEventListener("click", (event) => {
    if (event.target === chapterModal) closeChapterModal(true);
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenu();
  closeChapterModal(true);
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

/*
  Founding Readers intentionally has no submission code yet.
  The next step will connect it directly to Google Sheets without opening Google Forms.
*/
