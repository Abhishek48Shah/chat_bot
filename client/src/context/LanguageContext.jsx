import { createContext, useContext } from "react";
import useLanguage from "../hooks/useLanguage";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const value = useLanguage(); // { lang, setLang, t }
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }
  return ctx;
}