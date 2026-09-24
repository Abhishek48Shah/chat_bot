import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGlobe, FiChevronDown } from "react-icons/fi";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ne", label: "Nepali", native: "नेपाली" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export default function LanguageSwitcher({ currentLang, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const active = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (code) => {
    setOpen(false);
    if (code !== currentLang) onChange(code);
  };

  return (
    <div ref={ref} className="relative">
     <button
  type="button"
  disabled={disabled}
  onClick={() => setOpen((o) => !o)}
  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-brand shadow-sm transition-colors hover:bg-brand-light disabled:opacity-50"
>
        <FiGlobe size={13} />
        <span>{active.native}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <FiChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-20 mt-2 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
          >
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-brand-light ${
  lang.code === currentLang
    ? "font-medium text-brand"
    : "text-gray-700"
}`}
                >
                  <span>{lang.native}</span>
                  <span className="text-xs text-gray-400">{lang.label}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}