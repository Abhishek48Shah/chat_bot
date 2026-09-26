import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { sendMessage as sendMessageApi } from "../api/chatService";
import { synthesizeSpeech } from "../api/voiceService";
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
  const audioRef = useRef(null);

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

  // Called directly by the speaker button — user-initiated, so no autoplay concerns
  const speakMessage = useCallback(
    (text) => ({
      play: (onEnded) =>
        new Promise(async (resolve, reject) => {
          try {
            const audioBlob = await synthesizeSpeech(text, lang);
            if (!audioBlob) return reject(new Error("No audio (mock mode)"));

            audioRef.current?.pause();
            const url = URL.createObjectURL(audioBlob);
            const audio = new Audio(url);
            audioRef.current = audio;

            audio.onended = () => {
              URL.revokeObjectURL(url);
              onEnded();
            };
            await audio.play();
            resolve();
          } catch (err) {
            console.error("TTS playback failed:", err);
            toast.error("Couldn't play audio for this reply.");
            reject(err);
          }
        }),
      stop: () => {
        audioRef.current?.pause();
        audioRef.current = null;
      },
    }),
    [lang]
  );

  return {
    messages: displayMessages,
    isBotTyping,
    send,
    retryLast,
    speakMessage,
  };
}