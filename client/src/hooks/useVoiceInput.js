import { useState, useRef, useCallback } from "react";
import { transcribeAudio } from "../api/voiceService";
import toast from "react-hot-toast";

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
          toast.error("Couldn't transcribe that. Try again or type instead.");
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
        console.error("Microphone access denied or unavailable:", err);
       toast.error("Microphone access denied or unavailable.");
      setSupported(false);
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