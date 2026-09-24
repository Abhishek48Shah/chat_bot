import { useState, useRef, useCallback } from "react";
import { transcribeAudio } from "../api/voiceService";

function detectSupport() {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof window.MediaRecorder !== "undefined"
  );
}

export default function useVoiceInput({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(detectSupport); // lazy initializer, no effect needed

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    if (!supported) return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setIsProcessing(true);
        try {
          const { text } = await transcribeAudio(blob);
          onTranscript?.(text);
        } catch (err) {
            console.error("Transcription failed:", err);
          setError("Couldn't transcribe that. Try again or type instead.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
        console.error("Microphone access denied or unavailable:", err);
      setError("Microphone access denied or unavailable.");
      setSupported(false); // this one's fine — it's inside an event handler, not an effect
    }
  }, [supported, onTranscript]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    isProcessing,
    error,
    supported,
    startRecording,
    stopRecording,
  };
}