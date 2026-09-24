import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import logo from "../../assets/logo.png";

export default function MessageBubble({ role, text, timestamp }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <FiUser size={16} />
        </div>
      ) : (
        <img
          src={logo}
          alt="Assistant"
          className="h-10 w-10 shrink-0 rounded-full object-contain"
        />
      )}

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
          isUser
            ? "rounded-br-sm bg-brand text-white"
            : "rounded-bl-sm bg-white text-gray-800 border border-gray-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
        {timestamp && (
          <span
            className={`mt-1 block text-[10px] ${
              isUser ? "text-brand-light/80" : "text-gray-400"
            }`}
          >
            {timestamp}
          </span>
        )}
      </div>
    </motion.div>
  );
}