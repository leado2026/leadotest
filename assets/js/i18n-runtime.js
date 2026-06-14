(function () {
  const languages = {
    en: { name: "English", flag: "🇺🇸", htmlLang: "en" },
    es: { name: "Español", flag: "🇪🇸", htmlLang: "es" },
    pt: { name: "Português", flag: "🇧🇷", htmlLang: "pt" },
    fr: { name: "Français", flag: "🇫🇷", htmlLang: "fr" },
    ru: { name: "Русский", flag: "🇷🇺", htmlLang: "ru" },
    de: { name: "Deutsch", flag: "🇩🇪", htmlLang: "de" },
  };

  const storageKey = "leado.preferredLanguage";
  const textStore = new WeakMap();

  function normalize(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function currentPathLanguage() {
    const match = window.location.pathname.match(/^\/(es|pt|fr|ru|de)(?=\/|$)/);
    return match ? match[1] : "";
  }

  function browserLanguage() {
    const code = (navigator.language || navigator.userLanguage || "en").slice(0, 2).toLowerCase();
    return languages[code] ? code : "en";
  }

  function initialLanguage() {
    const saved = localStorage.getItem(storageKey);
    if (saved && languages[saved]) return saved;
    return currentPathLanguage() || browserLanguage();
  }

  function translationFor(text, lang) {
    const resources = window.LEADO_I18N_RESOURCES || {};
    const dictionaries = [resources.common, resources.categories, resources.questions, resources.terms].filter(Boolean);
    if (lang === "en") return canonicalText(text);
    for (const dictionary of dictionaries) {
      const entry = dictionary[text];
      if (entry && entry[lang]) return entry[lang];
    }
    return text;
  }

  function dictionaries() {
    const resources = window.LEADO_I18N_RESOURCES || {};
    return [resources.common, resources.categories, resources.questions, resources.terms].filter(Boolean);
  }

  function translateContent(text, lang) {
    text = canonicalText(text);
    if (lang === "en") return text;
    const exact = translationFor(text, lang);
    if (exact !== text) return exact;

    let output = text;
    const entries = dictionaries()
      .flatMap((dictionary) => Object.entries(dictionary))
      .sort(([a], [b]) => b.length - a.length);

    entries.forEach(([english, translations]) => {
      if (translations && translations[lang] && output.includes(english)) {
        output = output.split(english).join(translations[lang]);
      }
    });

    return output;
  }

  function canonicalText(text) {
    for (const dictionary of dictionaries()) {
      if (dictionary[text]) return text;
      for (const [english, translations] of Object.entries(dictionary)) {
        if (Object.values(translations).some((value) => normalize(value) === text)) return english;
      }
    }
    return text;
  }

  function rememberOriginalText(node) {
    if (!textStore.has(node)) textStore.set(node, canonicalText(normalize(node.nodeValue)));
    return textStore.get(node);
  }

  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) return true;
    if (parent.closest("[data-i18n-skip]")) return true;
    return !normalize(node.nodeValue);
  }

  function translateTextNodes(lang) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const original = rememberOriginalText(node);
      const translated = translateContent(original, lang);
      if (normalize(node.nodeValue) !== translated) node.nodeValue = node.nodeValue.replace(normalize(node.nodeValue), translated);
    });
  }

  function translateAttributes(lang) {
    document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((field) => {
      if (!field.dataset.i18nOriginalPlaceholder) field.dataset.i18nOriginalPlaceholder = canonicalText(field.getAttribute("placeholder") || "");
      const original = field.dataset.i18nOriginalPlaceholder;
      field.setAttribute("placeholder", translateContent(original, lang));
    });

    document.querySelectorAll("[alt], [title], [aria-label]").forEach((element) => {
      ["alt", "title", "aria-label"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        const key = `i18nOriginal${attribute.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase())}`;
        if (!element.dataset[key]) element.dataset[key] = canonicalText(element.getAttribute(attribute) || "");
        element.setAttribute(attribute, translateContent(element.dataset[key], lang));
      });
    });
  }

  function translateMetadata(lang) {
    if (!document.documentElement.dataset.i18nOriginalTitle) {
      document.documentElement.dataset.i18nOriginalTitle = canonicalText(document.title || "");
    }
    document.title = translateContent(document.documentElement.dataset.i18nOriginalTitle, lang);

    document.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]').forEach((meta) => {
      if (!meta.dataset.i18nOriginalContent) meta.dataset.i18nOriginalContent = canonicalText(meta.getAttribute("content") || "");
      meta.setAttribute("content", translateContent(meta.dataset.i18nOriginalContent, lang));
    });
  }

  function updateSwitcher(lang) {
    const language = languages[lang] || languages.en;
    document.documentElement.lang = language.htmlLang;
    document.querySelectorAll("[data-language-toggle]").forEach((toggle) => {
      const flag = toggle.querySelector(".language-flag");
      if (flag) flag.textContent = language.flag;
      const spans = toggle.querySelectorAll("span");
      if (spans[1]) spans[1].textContent = language.name;
      toggle.setAttribute("aria-label", `Change language, current language ${language.name}`);
      toggle.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll("[data-language-option]").forEach((option) => {
      const active = option.dataset.languageOption === lang;
      option.classList.toggle("active", active);
      if (active) option.setAttribute("aria-current", "true");
      else option.removeAttribute("aria-current");
    });

    document.querySelectorAll("[data-language-switcher].open").forEach((switcher) => switcher.classList.remove("open"));
  }

  function applyLanguage(lang, options = {}) {
    const nextLang = languages[lang] ? lang : "en";
    document.body.classList.add("i18n-transitioning");
    window.setTimeout(() => {
      translateTextNodes(nextLang);
      translateAttributes(nextLang);
      translateMetadata(nextLang);
      updateSwitcher(nextLang);
      localStorage.setItem(storageKey, nextLang);
      window.dispatchEvent(new CustomEvent("leado:languagechange", { detail: { language: nextLang } }));
      document.body.classList.remove("i18n-transitioning");
    }, options.instant ? 0 : 90);
  }

  document.addEventListener("click", (event) => {
    const option = event.target.closest("[data-language-option]");
    if (!option) return;
    event.preventDefault();
    applyLanguage(option.dataset.languageOption || "en");
  });

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(initialLanguage(), { instant: true });
  });

  window.LEADO_I18N = { applyLanguage };
})();
