import { USE_MOCK_CHAT, CHAT_SERVER_URL } from "./config";
import { getMockReply } from "../mocks/mockResponses";

/**
 * sendMessage streams the bot's reply chunk-by-chunk into onChunk.
 * This shape matches the real backend (text/event-stream), so swapping
 * USE_MOCK_CHAT to false requires no changes in useChat.js.
 */
export async function sendMessage(message, lang, onChunk) {
  if (USE_MOCK_CHAT) {
    return mockStream(message, lang, onChunk);
  }
  return realStream(message, lang, onChunk);
}

function mockStream(message, lang, onChunk) {
  return new Promise((resolve) => {
    const reply = getMockReply(message, lang);
    const words = reply.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        resolve();
        return;
      }
      onChunk(words[i] + " ");
      i++;
    }, 60 + Math.random() * 40);
  });
}

async function realStream(message, lang, onChunk) {
  const response = await fetch(`${CHAT_SERVER_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message, language: lang }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Server error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by double newlines: "data: ...\n\n"
    const parts = buffer.split("\n\n");
    buffer = parts.pop(); // keep incomplete trailing chunk for next read

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;

      const data = line.slice(5).trim();
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data);
        onChunk(parsed.token ?? parsed.text ?? "");
      } catch {
        // if server sends raw text instead of JSON per event, fall back to raw
        onChunk(data);
      }
    }
  }
}