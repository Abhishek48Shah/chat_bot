import { useState } from "react";
import { motion } from "framer-motion";
import { FiVolume2, FiVolumeX, FiLoader } from "react-icons/fi";

export default function SpeakerButton({ onSpeak, disabled }) {
  const [state, setState] = useState("idle"); // idle | loading | playing

  const handleClick = async () => {
    if (state === "playing") {
      onSpeak.stop();
      setState("idle");
      return;
    }

    setState("loading");
    try {
      await onSpeak.play(() => setState("idle")); // called when playback ends
      setState("playing");
    } catch {
      setState("idle");
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand-light hover:text-brand disabled:opacity-30"
      aria-label="Read reply aloud"
    >
      {state === "loading" && <FiLoader size={13} className="animate-spin" />}
      {state === "playing" && <FiVolumeX size={13} />}
      {state === "idle" && <FiVolume2 size={13} />}
    </motion.button>
  );
}