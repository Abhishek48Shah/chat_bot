import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";
import { useLanguageContext } from "../../context/LanguageContext";

export default function ChatInput({ onSend, disabled, voiceSlot }) {
  const { t } = useLanguageContext();
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-gray-100 bg-white px-3 py-3"
    >
      {/* Slot for VoiceButton, passed in from parent so this stays voice-agnostic */}
      {voiceSlot}

      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t("input_placeholder")}
       className="max-h-32 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand-light disabled:opacity-50"
      />

      <motion.button
  type="submit"
  disabled={disabled || !value.trim()}
  whileTap={{ scale: 0.9 }}
  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400"
>
  <FiSend size={16} />
</motion.button>
    </form>
  );
}