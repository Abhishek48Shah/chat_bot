import { motion } from "framer-motion";

export default function VoiceWaveform({ active }) {
  const bars = [0, 1, 2, 3, 4];

  return (
    <div className="flex h-5 items-center gap-[3px]">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-brand"
          animate={
            active
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "30%" }
          }
          transition={{
            duration: 0.9,
            repeat: active ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          style={{ height: "30%" }}
        />
      ))}
    </div>
  );
}