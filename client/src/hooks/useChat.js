import { useState, useCallback, useRef } from "react";
import { sendMessage as sendMessageApi } from "../api/chatService";
import { t } from "../i18n";

let idCounter = 0;
const nextId = () => ++idCounter;

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function useChat(lang) {
  const [welcomeId] = useState(() => nextId());

  // The welcome message stores NO translated text — just a marker.
  // Its text is computed fresh on every render from the current `lang`,
  // so switching language updates it instantly with no effect needed.
  const [messages, setMessages] = useState(() => [
    {
      id: welcomeId,
      role: "bot",
      isWelcome: true,
      timestamp: timestamp(),
    },
  ]);

  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState(null);
  const lastUserMessageRef = useRef(null);

  // Derived, not stored: real messages pass through unchanged,
  // the welcome message gets its text computed on the fly.
  const displayMessages = messages.map((m) =>
    m.isWelcome ? { ...m, text: t("welcome_message", lang) } : m
  );

  const appendMessage = useCallback((role, text) => {
    const msg = { id: nextId(), role, text, timestamp: timestamp() };
    setMessages((prev) => [...prev, msg]);
    return msg.id;
  }, []);

  const updateMessageText = useCallback((id, updater) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text: updater(m.text) } : m))
    );
  }, []);

  const send = useCallback(
    async (text) => {
      if (!text.trim()) return;
      setError(null);
      lastUserMessageRef.current = text;

      appendMessage("user", text);
      setIsBotTyping(true);

      const botMsgId = appendMessage("bot", "");

      try {
        await sendMessageApi(text, lang, (chunk) => {
          updateMessageText(botMsgId, (prev) => prev + chunk);
        });
      } catch (err) {
        console.error("Chat send failed:", err);
        setError(t("error_generic", lang));
        updateMessageText(botMsgId, () => "⚠️ Something went wrong generating a reply.");
      } finally {
        setIsBotTyping(false);
      }
    },
    [lang, appendMessage, updateMessageText]
  );

  const retryLast = useCallback(() => {
    if (lastUserMessageRef.current) {
      send(lastUserMessageRef.current);
    }
  }, [send]);

  return {
    messages: displayMessages, // note: returning the derived version now
    isBotTyping,
    error,
    send,
    retryLast,
    dismissError: () => setError(null),
  };
}