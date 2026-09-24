import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { LanguageProvider, useLanguageContext } from "./context/LanguageContext";
import useChat from "./hooks/useChat";
import useVoiceInput from "./hooks/useVoiceInput";

import ChatWindow from "./components/chat/ChatWindow";
import Header from "./components/common/Header";
import LanguageSwitcher from "./components/language/LanguageSwitcher";
import VoiceButton from "./components/voice/VoiceButton";
import SplashScreen from "./components/common/SplashScreen";

function ChatApp() {
  const { lang, setLang, t } = useLanguageContext();
  const { messages, isBotTyping, send } = useChat(lang);

  const { isRecording, isProcessing, supported, startRecording, stopRecording } =
    useVoiceInput({
      onTranscript: (text) => send(text),
    });

  return (
    <ChatWindow
      messages={messages}
      isBotTyping={isBotTyping}
      onSend={send}
      disabled={isBotTyping}
      headerSlot={
        <Header
          rightSlot={
            <LanguageSwitcher
              currentLang={lang}
              onChange={setLang}
              disabled={isBotTyping}
            />
          }
        />
      }
      voiceSlot={
        <VoiceButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onStart={startRecording}
          onStop={stopRecording}
          disabled={isBotTyping}
          supported={supported}
        />
      }
    />
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LanguageProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#1f2937",
            fontSize: "13px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          },
        }}
      />

      <SplashScreen
        visible={showSplash}
        caption="Your Bharatpur travel companion"
        onFinish={() => setShowSplash(false)}
      />

      {!showSplash && <ChatApp />}
    </LanguageProvider>
  );
}