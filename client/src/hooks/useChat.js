import { useState, useCallback, useRef } from "react";
import { sendMessage as sendMessageApi } from "../api/chatService";
import { t } from "../i18n";

let idCounter = 0;
const nextId = () => ++idCounter;

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function useChat(lang) {
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: "bot",
     text: t("welcome_message", lang),
      timestamp: timestamp(),
    },
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState(null);
  const lastUserMessageRef = useRef(null);

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

      // placeholder bot message we'll stream tokens into
      const botMsgId = appendMessage("bot", "");

      try {
        await sendMessageApi(text, lang, (chunk) => {
          updateMessageText(botMsgId, (prev) => prev + chunk);
        });
      } catch (err) {
        console.log("couldnt reach the assistant",err);
        setError("Couldn't reach the assistant. Check your connection and try again.");
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
    messages,
    isBotTyping,
    error,
    send,
    retryLast,
    dismissError: () => setError(null),
  };
}