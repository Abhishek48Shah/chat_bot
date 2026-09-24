import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function MessageList({ messages, isBotTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
            timestamp={msg.timestamp}
          />
        ))}
        {isBotTyping && <TypingIndicator key="typing" />}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  );
}