import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ErrorBanner({ message, onRetry, onDismiss }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mx-4 mt-2 flex items-center justify-between gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          <div className="flex items-center gap-2">
            <FiAlertTriangle size={14} className="shrink-0" />
            <span>{message}</span>
          </div>
          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="font-medium underline underline-offset-2 hover:text-red-800"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
                <FiX size={14} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}