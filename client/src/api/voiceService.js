import { USE_MOCK_VOICE, STT_SERVER_URL, TTS_SERVER_URL } from "./config";

const MOCK_TRANSCRIPTS = [
  "What should I visit in Bharatpur?",
  "Tell me about local food here.",
  "How do I get to Chitwan National Park?",
];

export async function transcribeAudio(blob) {
  if (USE_MOCK_VOICE) {
    await new Promise((r) => setTimeout(r, 900));
    const text =
      MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
    return { text };
  }

  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");

  const res = await fetch(`${STT_SERVER_URL}/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(`STT error: ${res.status}`);
  return res.json(); // expected: { text: "..." }
}

export async function synthesizeSpeech(text, lang = "en") {
  if (USE_MOCK_VOICE) {
    // no real audio in mock mode — caller should just skip playback
    return null;
  }

  const res = await fetch(`${TTS_SERVER_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language: lang }),
  });

  if (!res.ok) throw new Error(`TTS error: ${res.status}`);
  return res.blob(); // audio blob, play via new Audio(URL.createObjectURL(blob))
}