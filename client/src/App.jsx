import { LanguageProvider, useLanguageContext } from "./context/LanguageContext";
import useChat from "./hooks/useChat";
import useVoiceInput from "./hooks/useVoiceInput";

import ChatWindow from "./components/chat/ChatWindow";
import Header from "./components/common/Header";
import ErrorBanner from "./components/common/ErrorBanner";
import LanguageSwitcher from "./components/language/LanguageSwitcher";
import VoiceButton from "./components/voice/VoiceButton";

function ChatApp() {
  const { lang, setLang, t } = useLanguageContext();
  const { messages, isBotTyping, error, send, retryLast, dismissError } =
    useChat(lang);

  const { isRecording, isProcessing, supported, startRecording, stopRecording } =
    useVoiceInput({
      onTranscript: (text) => send(text), // transcribed speech becomes a normal message
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
      errorSlot={
        <ErrorBanner
          message={error}
          onRetry={retryLast}
          onDismiss={dismissError}
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
  return (
    <LanguageProvider>
      <ChatApp />
    </LanguageProvider>
  );
}