import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { sendMessage as sendMessageApi } from "../api/chatService";
import { t } from "../i18n";

let idCounter = 0;
const nextId = () => ++idCounter;

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function useChat(lang) {
  const [welcomeId] = useState(() => nextId());

  const [messages, setMessages] = useState(() => [
    {
      id: welcomeId,
      role: "bot",
      isWelcome: true,
      timestamp: timestamp(),
    },
  ]);

  const [isBotTyping, setIsBotTyping] = useState(false);
  const lastUserMessageRef = useRef(null);

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
        toast.error(t("error_generic", lang));
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
    messages: displayMessages,
    isBotTyping,
    send,
    retryLast,
  };
}