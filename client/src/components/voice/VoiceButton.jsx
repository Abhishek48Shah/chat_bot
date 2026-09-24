import { motion, AnimatePresence } from "framer-motion";
import { FiMic, FiSquare } from "react-icons/fi";
import VoiceWaveform from "./VoiceWaveform";

export default function VoiceButton({
  isRecording,
  isProcessing,
  onStart,
  onStop,
  disabled,
  supported = true,
}) {
  if (!supported) return null; 

  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden rounded-full bg-indigo-50 px-3 py-2"
          >
            <VoiceWaveform active={isRecording} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
  type="button"
  onClick={handleClick}
  disabled={disabled || isProcessing}
  whileTap={{ scale: 0.9 }}
  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:bg-gray-200 disabled:text-gray-400 ${
    isRecording
      ? "bg-red-500 text-white"
      : "bg-brand-light text-brand hover:bg-brand/10"
  }`}
>
        {isRecording && (
          <motion.span
            className="absolute inset-0 rounded-full bg-red-400"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="relative z-10">
          {isRecording ? <FiSquare size={14} /> : <FiMic size={16} />}
        </span>
      </motion.button>

      {isProcessing && (
        <span className="text-xs text-gray-400 animate-pulse">
          Transcribing…
        </span>
      )}
    </div>
  );
}