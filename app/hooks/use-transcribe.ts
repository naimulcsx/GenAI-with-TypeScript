import { useCallback, useState } from "react";
import { useVoiceRecorder } from "./use-voice-recorder";

interface UseTranscribeProps {
  onTranscribe?: (transcript: string) => void;
}

interface UseTranscribeReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: Error | null;
}

export function useTranscribe({
  onTranscribe,
}: UseTranscribeProps = {}): UseTranscribeReturn {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<Error | null>(null);

  const handleDataAvailable = useCallback(
    async (blob: Blob) => {
      setIsTranscribing(true);
      setTranscribeError(null);

      const formData = new FormData();
      formData.append("audio", blob);

      try {
        const response = await fetch("/api/get-transcript", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Transcription failed: ${response.statusText}`);
        }

        const data = await response.json();
        onTranscribe?.(data.transcript);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to transcribe audio";
        setTranscribeError(new Error(errorMessage));
        console.error("Error transcribing audio:", error);
      } finally {
        setIsTranscribing(false);
      }
    },
    [onTranscribe]
  );

  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recordingError,
  } = useVoiceRecorder({
    onDataAvailable: handleDataAvailable,
  });

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    error: recordingError || transcribeError,
  };
}
