import { USE_MOCK_CHAT, CHAT_SERVER_URL } from "./config";
import { getMockReply } from "../mocks/mockResponses";

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
  const response = await fetch(`${CHAT_SERVER_URL}/chat/stream`, {
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

    // SSE frames are separated by a blank line: "event: ...\ndata: ...\n\n"
    const frames = buffer.split("\n\n");
    buffer = frames.pop(); // keep incomplete trailing frame for next read

    for (const frame of frames) {
      const lines = frame.split("\n").map((l) => l.trim());

      let eventType = "message"; // SSE default if no "event:" line is present
      let dataLine = "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLine = line.slice(5).trim();
        }
      }

      if (!dataLine) continue;

      if (eventType === "token") {
        try {
          const parsed = JSON.parse(dataLine);
          onChunk(parsed.content ?? "");
        } catch (err) {
          console.error("Failed to parse token event:", err, dataLine);
        }
      } else if (eventType === "done") {
        return; // stream complete
      } else if (eventType === "error") {
        throw new Error(dataLine);
      }
      // any other named events are ignored for now
    }
  }
}