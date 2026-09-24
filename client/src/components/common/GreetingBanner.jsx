import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiRobot2Fill } from "react-icons/ri";

export default function GreetingBanner({ text, autoHideMs = 4500 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed left-1/2 top-4 z-50 flex max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-lg"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
            <RiRobot2Fill size={18} />
          </div>
          <p className="text-sm text-gray-700">{text}</p>
          <button
            onClick={() => setVisible(false)}
            className="ml-1 text-gray-300 hover:text-gray-500"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}