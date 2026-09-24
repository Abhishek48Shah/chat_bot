import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

const APP_NAME = "Bharatpur Assistant";

export default function SplashScreen({ visible, caption, onFinish, holdMs = 2200 }) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onFinish, holdMs);
    return () => clearTimeout(timer);
  }, [visible, holdMs, onFinish]);

  const letters = APP_NAME.split("");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-2"
          >
            <motion.img
              src={logo}
              alt="App logo"
              animate={{ rotate: [0, -6, 6, -3, 3, 0] }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
              className="h-35 w-35 object-contain"
            />
          </motion.div>

          {/* App name, letter-by-letter */}
          <div className="flex overflow-hidden">
            {letters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.15 + i * 0.035,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="text-2xl font-semibold text-gray-800"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Caption */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + letters.length * 0.035 + 0.2, duration: 0.4 }}
            className="mt-2 text-sm text-gray-400"
          >
            {caption}
          </motion.p>

          {/* Subtle pulsing dots to show "loading" */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + letters.length * 0.035 + 0.4 }}
            className="mt-6 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gray-300"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}