import { useState } from "react";
import { useVoiceRecorder } from "./use-voice-recorder";

type UseTranscribeOptions = {
  onTranscribe?: (transcript: string) => void;
};

export function useTranscribe({ onTranscribe }: UseTranscribeOptions = {}) {
  const {
    isRecording,
    mediaRecorder,
    startRecording,
    stopRecording,
    cancelRecording,
    error: recorderError,
  } = useVoiceRecorder();

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function stopAndTranscribe() {
    try {
      setIsTranscribing(true);
      const audioBlob = await stopRecording();

      const formData = new FormData();
      formData.append("audio", audioBlob, "audio.webm");

      const response = await fetch("/api/get-transcript", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      const transcript = data.transcript as string;

      if (onTranscribe) {
        onTranscribe(transcript);
      }
    } catch (err) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError("Unknown transcription error.");
      }
    } finally {
      setIsTranscribing(false);
    }
  }

  return {
    mediaRecorder,
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording: stopAndTranscribe,
    cancelRecording,
    error: recorderError || apiError,
  };
}
