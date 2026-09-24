import { useState, useEffect, useCallback } from "react";
import { t as translate } from "../i18n";

const STORAGE_KEY = "bta_language";
const DEFAULT_LANG = "en";

export default function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((code) => {
    setLangState(code);
  }, []);

  // shorthand: t("send_button") -> looks up current language automatically
  const t = useCallback((key) => translate(key, lang), [lang]);

  return { lang, setLang, t };
}