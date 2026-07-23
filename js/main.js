/* =========================================================
   SPARKWHYZ MAIN JAVASCRIPT
   Navigation, theme, popup, animations, fundraising,
   Founding Readers, and contact form
   ========================================================= */

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const chapterModal = document.getElementById(
  "chapterModal"
);
const themeButton = document.getElementById(
  "themeToggleDesktop"
);


/* =========================================================
   WEBSITE LINKS
   ========================================================= */

const GOFUNDME_URL =
  "https://www.gofundme.com/f/get-our-book-into-el-morro-top-of-the-world-elementary";

const FOUNDING_READERS_URL =
  "https://script.google.com/macros/s/AKfycbzE3uEk4XQtkb8qyEXPNrhavnNuOdf-xDej9qfDXaaHXr0CM6zMC1YZZFA1C1SL5hdo/exec";

/*
  Leave this empty until the separate Contact Form
  Apps Script is created and deployed.
*/
const CONTACT_FORM_URL = "";


/* =========================================================
   MOBILE MENU
   ========================================================= */

function closeMobileDropdowns() {
  document
    .querySelectorAll(".nav-links > li.dd-open")
    .forEach((item) => {
      item.classList.remove("dd-open");
    });
}

function openMenu() {
  if (!navToggle || !navLinks) return;

  closeChapterModal(false);

  navLinks.classList.add("open");
  navToggle.classList.add("active");
  navToggle.setAttribute("aria-expanded", "true");

  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!navToggle || !navLinks) return;

  navLinks.classList.remove("open");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");

  document.body.classList.remove("menu-open");

  closeMobileDropdowns();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const menuIsOpen =
      navLinks.classList.contains("open");

    if (menuIsOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}


/* =========================================================
   MOBILE DROPDOWN MENUS
   ========================================================= */

document
  .querySelectorAll(".nav-links > li")
  .forEach((menuItem) => {
    const mainLink =
      menuItem.querySelector(":scope > a");

    const dropdownWrap =
      menuItem.querySelector(
        ":scope > .dropdown-wrap"
      );

    if (!mainLink) return;

    mainLink.addEventListener("click", (event) => {
      if (window.innerWidth > 900) return;

      if (dropdownWrap) {
        event.preventDefault();

        document
          .querySelectorAll(
            ".nav-links > li.dd-open"
          )
          .forEach((openItem) => {
            if (openItem !== menuItem) {
              openItem.classList.remove(
                "dd-open"
              );
            }
          });

        menuItem.classList.toggle("dd-open");
      } else {
        closeMenu();
      }
    });
  });

document
  .querySelectorAll(".dropdown a")
  .forEach((dropdownLink) => {
    dropdownLink.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});


/* =========================================================
   AUTOMATIC GOFUNDME LINKS
   ========================================================= */

function isPledgeLink(link) {
  if (!link) return false;

  const href = String(
    link.getAttribute("href") || ""
  ).toLowerCase();

  return (
    href.includes("get_involved.html#pledge") ||
    href.includes("get-involved.html#pledge") ||
    href.includes("/get-involved/#pledge")
  );
}

function createGoFundMeLink(className, text) {
  const link = document.createElement("a");

  link.href = GOFUNDME_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = text;
  link.className = className;
  link.dataset.sparkwhyzGofundme = "true";

  return link;
}

function addGoFundMeToNavigation() {
  if (!navLinks) return;

  const existingButton = navLinks.querySelector(
    '[data-sparkwhyz-gofundme="true"], .nav-gofundme'
  );

  if (existingButton) return;

  const pledgeButton = Array.from(
    navLinks.querySelectorAll("a")
  ).find((link) => {
    return (
      isPledgeLink(link) &&
      link.classList.contains("nav-cta")
    );
  });

  if (!pledgeButton) return;

  const listItem = document.createElement("li");
  listItem.className = "nav-action-item";

  const goFundMeButton = createGoFundMeLink(
    "nav-cta nav-gofundme",
    "GoFundMe"
  );

  listItem.appendChild(goFundMeButton);

  pledgeButton
    .closest("li")
    .insertAdjacentElement("afterend", listItem);
}

function addGoFundMeToDropdowns() {
  document
    .querySelectorAll(".dropdown")
    .forEach((dropdown) => {
      const existingLink = dropdown.querySelector(
        '[data-sparkwhyz-gofundme="true"], a[href*="gofundme.com"]'
      );

      if (existingLink) return;

      const pledgeLink = Array.from(
        dropdown.querySelectorAll("a")
      ).find(isPledgeLink);

      if (!pledgeLink) return;

      const listItem = document.createElement("li");

      const goFundMeLink = createGoFundMeLink(
        "",
        "Support Our GoFundMe"
      );

      listItem.appendChild(goFundMeLink);

      pledgeLink
        .closest("li")
        .insertAdjacentElement("afterend", listItem);
    });
}

function addGoFundMeToFooters() {
  document
    .querySelectorAll("footer ul")
    .forEach((list) => {
      const pledgeLink = Array.from(
        list.querySelectorAll("a")
      ).find(isPledgeLink);

      if (!pledgeLink) return;

      const existingLink = list.querySelector(
        '[data-sparkwhyz-gofundme="true"], a[href*="gofundme.com"]'
      );

      if (existingLink) return;

      const listItem = document.createElement("li");

      const goFundMeLink = createGoFundMeLink(
        "",
        "Support Our GoFundMe"
      );

      listItem.appendChild(goFundMeLink);

      pledgeLink
        .closest("li")
        .insertAdjacentElement("afterend", listItem);
    });
}

function addGoFundMeBesidePledgeButtons() {
  document
    .querySelectorAll("main a, section a")
    .forEach((pledgeLink) => {
      if (!isPledgeLink(pledgeLink)) return;

      if (
        pledgeLink.closest(
          ".nav-links, footer, .dropdown"
        )
      ) {
        return;
      }

      const buttonStyle =
        pledgeLink.classList.contains("btn") ||
        pledgeLink.classList.contains("nav-cta") ||
        pledgeLink.classList.contains("modal-btn");

      if (!buttonStyle) return;

      const nextElement =
        pledgeLink.nextElementSibling;

      if (
        nextElement &&
        (
          nextElement.dataset
            .sparkwhyzGofundme === "true" ||
          String(nextElement.href || "")
            .includes("gofundme.com")
        )
      ) {
        return;
      }

      const classes = Array.from(
        pledgeLink.classList
      );

      if (!classes.includes("btn")) {
        classes.push("btn");
      }

      const goFundMeLink = createGoFundMeLink(
        `${classes.join(" ")} btn-gofundme`,
        "Support Our GoFundMe"
      );

      pledgeLink.insertAdjacentElement(
        "afterend",
        goFundMeLink
      );
    });
}

addGoFundMeToNavigation();
addGoFundMeToDropdowns();
addGoFundMeToFooters();
addGoFundMeBesidePledgeButtons();


/* =========================================================
   DARK MODE
   ========================================================= */

const sunIcon = `
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="4.5"
      fill="currentColor"
    />

    <path
      d="
        M12 2V4.5
        M12 19.5V22
        M4.93 4.93L6.7 6.7
        M17.3 17.3L19.07 19.07
        M2 12H4.5
        M19.5 12H22
        M4.93 19.07L6.7 17.3
        M17.3 6.7L19.07 4.93
      "
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
    />
  </svg>
`;

const moonIcon = `
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="
        M21 14.4
        C19.6 18.5 15.7 21.5 11.1 21.5
        C5.8 21.5 1.5 17.2 1.5 11.9
        C1.5 7.3 4.5 3.4 8.6 2
        C7.8 3.3 7.4 4.8 7.4 6.4
        C7.4 11.9 12.1 16.6 17.6 16.6
        C19.2 16.6 20.7 16.2 21 14.4Z
      "
      fill="currentColor"
    />
  </svg>
`;

function applyTheme(useDarkMode) {
  document.body.classList.toggle(
    "dark-mode",
    useDarkMode
  );

  if (!themeButton) return;

  const themeIcon =
    themeButton.querySelector(".theme-icon");

  const themeLabel =
    themeButton.querySelector(".theme-label");

  if (themeIcon) {
    themeIcon.innerHTML = useDarkMode
      ? sunIcon
      : moonIcon;
  }

  if (themeLabel) {
    themeLabel.textContent = useDarkMode
      ? "Light Mode"
      : "Dark Mode";
  }

  themeButton.setAttribute(
    "aria-label",
    useDarkMode
      ? "Switch to light mode"
      : "Switch to dark mode"
  );

  try {
    localStorage.setItem(
      "sparkwhyz-theme",
      useDarkMode ? "dark" : "light"
    );
  } catch (error) {
    console.warn(
      "Theme preference could not be saved."
    );
  }
}

if (themeButton) {
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(
      "sparkwhyz-theme"
    );
  } catch (error) {
    savedTheme = null;
  }

  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

  const shouldUseDarkMode =
    savedTheme !== null
      ? savedTheme === "dark"
      : systemPrefersDark;

  applyTheme(shouldUseDarkMode);

  themeButton.addEventListener("click", () => {
    const darkModeIsActive =
      document.body.classList.contains(
        "dark-mode"
      );

    applyTheme(!darkModeIsActive);
  });
}


/* =========================================================
   CHAPTER LEADER POPUP
   ========================================================= */

function closeChapterModal(rememberChoice = true) {
  if (!chapterModal) return;

  chapterModal.classList.remove("show");

  chapterModal.setAttribute(
    "aria-hidden",
    "true"
  );

  if (rememberChoice) {
    try {
      sessionStorage.setItem(
        "sparkwhyz-chapter-modal-seen",
        "true"
      );
    } catch (error) {
      console.warn(
        "Popup preference could not be saved."
      );
    }
  }
}

function openChapterModal() {
  if (!chapterModal) return;

  closeMenu();

  chapterModal.classList.add("show");

  chapterModal.setAttribute(
    "aria-hidden",
    "false"
  );

  const closeButton =
    chapterModal.querySelector(".modal-close");

  if (closeButton) {
    closeButton.focus();
  }
}

if (chapterModal) {
  const closeButton =
    chapterModal.querySelector(".modal-close");

  const modalButton =
    chapterModal.querySelector(".modal-btn");

  let popupWasSeen = false;

  try {
    popupWasSeen =
      sessionStorage.getItem(
        "sparkwhyz-chapter-modal-seen"
      ) === "true";
  } catch (error) {
    popupWasSeen = false;
  }

  chapterModal.setAttribute(
    "aria-hidden",
    "true"
  );

  if (!popupWasSeen) {
    window.setTimeout(() => {
      const menuIsOpen =
        document.body.classList.contains(
          "menu-open"
        );

      if (!menuIsOpen) {
        openChapterModal();
      }
    }, 1200);
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      closeChapterModal(true);
    });
  }

  if (modalButton) {
    modalButton.addEventListener("click", () => {
      closeChapterModal(true);
    });
  }

  chapterModal.addEventListener(
    "click",
    (event) => {
      if (event.target === chapterModal) {
        closeChapterModal(true);
      }
    }
  );
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (
    navLinks &&
    navLinks.classList.contains("open")
  ) {
    closeMenu();
  }

  if (
    chapterModal &&
    chapterModal.classList.contains("show")
  ) {
    closeChapterModal(true);
  }
});


/* =========================================================
   SCROLL REVEAL
   ========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");

if (
  "IntersectionObserver" in window &&
  revealElements.length > 0
) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("in-view");
  });
}


/* =========================================================
   CURRENT PAGE LINK
   ========================================================= */

const currentFile =
  window.location.pathname.split("/").pop() ||
  "index.html";

document
  .querySelectorAll(".nav-links a")
  .forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const linkFile = href.split("#")[0];

    if (linkFile === currentFile) {
      link.setAttribute(
        "aria-current",
        "page"
      );
    }
  });


/* =========================================================
   FOUNDING READERS
   ========================================================= */

const nameParticles = [
  "de",
  "del",
  "la",
  "le",
  "van",
  "von",
  "der",
  "den",
  "di",
  "da",
  "do",
  "dos",
  "das",
  "du",
  "ter",
  "ten",
  "bin",
  "ibn",
  "al",
  "el",
  "y"
];

function formatPersonName(rawName) {
  return rawName
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word, index) => {
      const lower = word.toLowerCase();

      if (
        index > 0 &&
        nameParticles.includes(lower)
      ) {
        return lower;
      }

      return lower.replace(
        /(^|[-'])([a-z])/g,
        (match, separator, letter) =>
          separator + letter.toUpperCase()
      );
    })
    .join(" ");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(
    email.trim()
  );
}

function createHiddenFrame(frameId) {
  let frame = document.getElementById(frameId);

  if (frame) return frame;

  frame = document.createElement("iframe");

  frame.id = frameId;
  frame.name = frameId;
  frame.title = "Form submission";
  frame.style.display = "none";

  document.body.appendChild(frame);

  return frame;
}

function showFoundingReadersMessage(
  form,
  message,
  type
) {
  let messageElement =
    form.parentElement.querySelector(
      ".founding-readers-message"
    );

  if (!messageElement) {
    messageElement =
      document.createElement("div");

    messageElement.className =
      "founding-readers-message";

    form.insertAdjacentElement(
      "afterend",
      messageElement
    );
  }

  messageElement.textContent = message;
  messageElement.dataset.type = type;
  messageElement.style.display = "block";
}

const foundingReaderForms =
  document.querySelectorAll(
    'form[data-founding-readers="true"]'
  );

foundingReaderForms.forEach((form) => {
  const nameInput = form.querySelector(
    '[name="name"]'
  );

  const emailInput = form.querySelector(
    '[name="email"]'
  );

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (
    !nameInput ||
    !emailInput ||
    !submitButton
  ) {
    return;
  }

  createHiddenFrame("foundingReadersFrame");

  form.action = FOUNDING_READERS_URL;
  form.method = "POST";
  form.target = "foundingReadersFrame";

  form.addEventListener("submit", (event) => {
    const formattedName =
      formatPersonName(nameInput.value);

    const formattedEmail =
      emailInput.value
        .trim()
        .toLowerCase();

    if (!formattedName) {
      event.preventDefault();

      showFoundingReadersMessage(
        form,
        "Please enter your first and last name.",
        "error"
      );

      nameInput.focus();
      return;
    }

    if (!isValidEmail(formattedEmail)) {
      event.preventDefault();

      showFoundingReadersMessage(
        form,
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();
      return;
    }

    nameInput.value = formattedName;
    emailInput.value = formattedEmail;

    submitButton.disabled = true;
    submitButton.textContent = "Joining...";

    showFoundingReadersMessage(
      form,
      "Submitting your information...",
      "success"
    );

    window.setTimeout(() => {
      showFoundingReadersMessage(
        form,
        "Thank you! You have joined the Founding Readers list.",
        "success"
      );

      form.reset();

      submitButton.disabled = false;
      submitButton.textContent = "Join the List";
    }, 1500);
  });
});


/* =========================================================
   CONTACT FORM
   ========================================================= */

function showContactMessage(
  form,
  message,
  type
) {
  const messageElement =
    form.querySelector(
      ".contact-form-message"
    );

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.dataset.type = type;
  messageElement.style.display = "block";
}

const contactForms =
  document.querySelectorAll(
    'form[data-contact-form="true"]'
  );

contactForms.forEach((form) => {
  const nameInput = form.querySelector(
    '[name="name"]'
  );

  const emailInput = form.querySelector(
    '[name="email"]'
  );

  const topicInput = form.querySelector(
    '[name="topic"]'
  );

  const messageInput = form.querySelector(
    '[name="message"]'
  );

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  if (
    !nameInput ||
    !emailInput ||
    !topicInput ||
    !messageInput ||
    !submitButton
  ) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formattedName =
      formatPersonName(nameInput.value);

    const formattedEmail =
      emailInput.value
        .trim()
        .toLowerCase();

    const topic = topicInput.value.trim();
    const message = messageInput.value.trim();

    if (!formattedName) {
      showContactMessage(
        form,
        "Please enter your full name.",
        "error"
      );

      nameInput.focus();
      return;
    }

    if (!isValidEmail(formattedEmail)) {
      showContactMessage(
        form,
        "Please enter a valid email address.",
        "error"
      );

      emailInput.focus();
      return;
    }

    if (!topic) {
      showContactMessage(
        form,
        "Please enter a topic.",
        "error"
      );

      topicInput.focus();
      return;
    }

    if (!message) {
      showContactMessage(
        form,
        "Please enter your message.",
        "error"
      );

      messageInput.focus();
      return;
    }

    if (!CONTACT_FORM_URL) {
      showContactMessage(
        form,
        "The contact form is not connected yet. Please email contact@sparkwhyz.org for now.",
        "error"
      );

      return;
    }

    nameInput.value = formattedName;
    emailInput.value = formattedEmail;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    showContactMessage(
      form,
      "Sending your message...",
      "success"
    );

    const formData = new FormData(form);

    fetch(CONTACT_FORM_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    })
      .then(() => {
        showContactMessage(
          form,
          "Thank you! Your message has been sent to the SparkWhyz team.",
          "success"
        );

        form.reset();
      })
      .catch(() => {
        showContactMessage(
          form,
          "We could not send your message. Please email contact@sparkwhyz.org.",
          "error"
        );
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      });
  });
});
