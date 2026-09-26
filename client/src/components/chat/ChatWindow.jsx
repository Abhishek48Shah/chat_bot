import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  messages,
  isBotTyping,
  onSend,
  disabled,
  voiceSlot,
  headerSlot,
  onSpeak,
}) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col bg-gray-50 shadow-xl sm:h-[90vh] sm:rounded-2xl sm:my-4 overflow-hidden">
      {headerSlot}
      <MessageList messages={messages} isBotTyping={isBotTyping} onSpeak={onSpeak} />
      <ChatInput onSend={onSend} disabled={disabled} voiceSlot={voiceSlot} />
    </div>
  );
}