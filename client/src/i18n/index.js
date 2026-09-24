import en from "./en.json";
import ne from "./ne.json";
import hi from "./hi.json";

const DICTIONARIES = { en, ne, hi };

/**
 * t(key, lang) — looks up a UI string in the given language,
 * falling back to English if the key or language is missing.
 */
export function t(key, lang = "en") {
  const dict = DICTIONARIES[lang] || DICTIONARIES.en;
  return dict[key] ?? DICTIONARIES.en[key] ?? key;
}

export default { t };