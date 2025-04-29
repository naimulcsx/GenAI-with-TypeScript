import { useState, useCallback } from "react";

interface UseVoiceRecorderProps {
  onDataAvailable?: (blob: Blob) => void;
}

interface UseVoiceRecorderReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: Error | null;
}

export function useVoiceRecorder({
  onDataAvailable,
}: UseVoiceRecorderProps = {}): UseVoiceRecorderReturn {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        onDataAvailable?.(blob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error : new Error("Failed to start recording")
      );
      console.error("Error accessing microphone:", error);
    }
  }, [onDataAvailable]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
}
