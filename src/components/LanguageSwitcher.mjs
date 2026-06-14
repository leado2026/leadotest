import { defaultLanguage, getLanguageByCode, localizedPath, siteLanguages } from "../config/languages.mjs";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderLanguageSwitcher(currentLanguageCode = defaultLanguage.code, currentPath = "/") {
  const currentLanguage = getLanguageByCode(currentLanguageCode);

  return `<div class="language-switcher" data-language-switcher>
    <button class="language-toggle" type="button" aria-label="Change language" aria-haspopup="true" aria-expanded="false" data-language-toggle>
      <span class="language-flag" aria-hidden="true">${currentLanguage.flag}</span>
      <span>${esc(currentLanguage.name)}</span>
      <span class="language-chevron" aria-hidden="true">▾</span>
    </button>
    <div class="language-menu" role="menu" aria-label="Website languages">
      ${siteLanguages.map((language) => `<a role="menuitem" lang="${esc(language.htmlLang)}" hreflang="${esc(language.hreflang)}" href="${esc(localizedPath(language.code, currentPath))}" data-language-option="${esc(language.code)}"${language.code === currentLanguage.code ? ' class="active" aria-current="true"' : ""}>
        <span class="language-flag" aria-hidden="true">${language.flag}</span>
        <span>${esc(language.name)}</span>
      </a>`).join("")}
    </div>
  </div>`;
}
