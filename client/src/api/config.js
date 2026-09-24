// Toggle these independently — chat and voice backends will likely be ready at different times
export const USE_MOCK_CHAT = true;
export const USE_MOCK_VOICE = true;

// Update these once your teammates give you real ports/URLs
export const CHAT_SERVER_URL = "http://localhost:8000/api";
export const STT_SERVER_URL = "http://localhost:8001"; // whisper.cpp
export const TTS_SERVER_URL = "http://localhost:8002"; // Piper