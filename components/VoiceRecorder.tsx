
import React, { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, base64: string) => void;
  isProcessing: boolean;
  compact?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isProcessing, compact = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showError, setShowError] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const MIN_DURATION = 10;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setShowError(false);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Use the system clock to determine final duration, not the interval counter
        const finalDuration = (Date.now() - startTimeRef.current) / 1000;

        if (finalDuration >= MIN_DURATION) {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            const base64Content = base64data.split(',')[1];
            onRecordingComplete(audioBlob, base64Content);
          };
        } else {
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Please allow microphone access to record memories.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = Math.min((recordingTime / MIN_DURATION) * 100, 100);

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3">
        {showError && (
          <div className="absolute bottom-24 bg-rose-100 text-rose-600 text-[10px] font-bold py-1 px-3 rounded-full animate-bounce z-[60]">
            Record for at least 10s
          </div>
        )}
        <div className="flex items-center gap-4">
          {isRecording && (
            <div className="flex flex-col items-end">
              <span className="text-rose-500 font-bold text-xs tabular-nums">{formatTime(recordingTime)}</span>
              <div className="w-12 h-1 bg-stone-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90 ${isRecording
                ? 'bg-rose-500 text-white'
                : isProcessing
                  ? 'bg-stone-300 text-stone-500'
                  : 'bg-stone-800 text-white hover:scale-105'
              }`}
          >
            {isProcessing ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : isRecording ? (
              <i className="fas fa-stop"></i>
            ) : (
              <i className="fas fa-microphone"></i>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 glass-morphism rounded-3xl shadow-xl border-2 border-stone-100">
      <div className="relative">
        {isRecording && (
          <div className="absolute -inset-4 bg-rose-500/10 rounded-full recording-pulse border-2 border-rose-500/20" />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative h-20 w-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 ${isRecording
              ? 'bg-rose-500 text-white'
              : isProcessing
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-stone-800 text-white hover:bg-stone-900'
            }`}
        >
          {isProcessing ? (
            <i className="fas fa-spinner fa-spin text-2xl"></i>
          ) : isRecording ? (
            <i className="fas fa-stop text-2xl"></i>
          ) : (
            <i className="fas fa-microphone text-2xl"></i>
          )}
        </button>
      </div>
      <div className="text-center min-h-[40px]">
        {showError ? (
          <p className="text-rose-500 font-bold text-sm animate-in fade-in">
            Capture a few more seconds...
          </p>
        ) : isProcessing ? (
          <p className="text-stone-500 font-medium animate-pulse">Archiving...</p>
        ) : isRecording ? (
          <div className="flex flex-col items-center">
            <p className="text-rose-500 font-bold text-xl">{formatTime(recordingTime)}</p>
            <div className="w-32 h-1.5 bg-stone-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-stone-800 font-semibold">Ready to listen</h3>
            <p className="text-stone-500 text-xs italic">Minimum 10s for deep insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;
