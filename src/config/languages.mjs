export const siteLanguages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
    path: "/",
    hreflang: "en",
    htmlLang: "en",
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    path: "/es/",
    hreflang: "es",
    htmlLang: "es",
  },
  {
    code: "pt",
    name: "Português",
    flag: "🇧🇷",
    path: "/pt/",
    hreflang: "pt",
    htmlLang: "pt",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
    path: "/fr/",
    hreflang: "fr",
    htmlLang: "fr",
  },
  {
    code: "ru",
    name: "Русский",
    flag: "🇷🇺",
    path: "/ru/",
    hreflang: "ru",
    htmlLang: "ru",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
    path: "/de/",
    hreflang: "de",
    htmlLang: "de",
  },
];

export const defaultLanguage = siteLanguages[0];

export function getLanguageByCode(code = "en") {
  return siteLanguages.find((language) => language.code === code) || defaultLanguage;
}

export function normalizeBasePath(pathname = "/") {
  const cleanPath = `/${String(pathname).replace(/^\/+/, "")}`;
  const withoutLanguagePrefix = cleanPath.replace(/^\/(es|pt|fr|ru|de)(?=\/|$)/, "");
  if (!withoutLanguagePrefix || withoutLanguagePrefix === "") return "/";
  return withoutLanguagePrefix.endsWith("/") ? withoutLanguagePrefix : `${withoutLanguagePrefix}/`;
}

export function localizedPath(languageCode = "en", pathname = "/") {
  const language = getLanguageByCode(languageCode);
  const basePath = normalizeBasePath(pathname);
  if (language.code === defaultLanguage.code) return basePath;
  if (basePath === "/") return language.path;
  return `${language.path}${basePath.replace(/^\/+/, "")}`;
}
