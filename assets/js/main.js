document.addEventListener("click", (event) => {
  const toggle = event.target.closest("[data-mobile-toggle]");
  if (toggle) {
    document.querySelector(".nav")?.classList.toggle("open");
  }

  const languageToggle = event.target.closest("[data-language-toggle]");
  if (languageToggle) {
    const switcher = languageToggle.closest("[data-language-switcher]");
    const isOpen = switcher?.classList.toggle("open");
    languageToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    return;
  }

  document.querySelectorAll("[data-language-switcher].open").forEach((switcher) => {
    if (!switcher.contains(event.target)) {
      switcher.classList.remove("open");
      switcher.querySelector("[data-language-toggle]")?.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll("[data-language-switcher].open").forEach((switcher) => {
    switcher.classList.remove("open");
    switcher.querySelector("[data-language-toggle]")?.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-inquiry-form]");
  if (!form) return;
  event.preventDefault();
  const message = form.querySelector(".success-message");
  if (message) message.style.display = "block";

  const data = new FormData(form);
  const body = Array.from(data.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  const mailto = `mailto:sales@leadoauto.com?subject=${encodeURIComponent("LEADO wholesale inquiry")}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
});
