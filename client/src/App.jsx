{/* This is for mock tyipig test only */}

import { useState } from "react";
import ChatWindow from "./components/chat/ChatWindow";

const dummyMessages = [
  { id: 1, role: "bot", text: "Namaste! Ask me anything about visiting Bharatpur.", timestamp: "10:00 AM" },
  { id: 2, role: "user", text: "What should I visit?", timestamp: "10:01 AM" },
];

export default function App() {
  const [typing, setTyping] = useState(true);
  return <ChatWindow messages={dummyMessages} isBotTyping={typing} onSend={() => {}} />;
}