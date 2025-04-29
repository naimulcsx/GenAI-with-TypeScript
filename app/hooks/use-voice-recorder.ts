import { useState, useRef } from "react";

type UseVoiceRecorderReturn = {
  mediaRecorder: MediaRecorder | null;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob>;
  cancelRecording: () => void;
  error: string | null;
};

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  async function startRecording(): Promise<void> {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener("dataavailable", (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error starting recording.");
      }
    }
  }

  async function stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder) {
        reject(new Error("No recording in progress."));
        return;
      }

      recorder.addEventListener(
        "stop",
        () => {
          setIsRecording(false);

          if (audioChunksRef.current.length === 0) {
            reject(new Error("No audio data captured."));
          } else {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm",
            });
            resolve(audioBlob);
          }
        },
        { once: true }
      );

      recorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    });
  }

  function cancelRecording(): void {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    audioChunksRef.current = [];
    setIsRecording(false);
  }

  return {
    mediaRecorder: mediaRecorderRef.current,
    isRecording,
    startRecording,
    stopRecording,
    cancelRecording,
    error,
  };
}
