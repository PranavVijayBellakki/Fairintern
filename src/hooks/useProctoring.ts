import { useState, useCallback, useRef, useEffect } from 'react';

export const useProctoring = (threshold = 0.06, debounceMs = 2000) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAudioPeak, setIsAudioPeak] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const audioIntervalRef = useRef<number | null>(null);
  const lastPeakTimeRef = useRef<number>(0);

  const startMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: false 
      });
      setStream(s);
      // setupAudioAnalysis(s);
      setIsLive(true);
      return true;
    } catch (err) {
      console.error("Hardware access denied:", err);
      return false;
    }
  }, []);

  const setupAudioAnalysis = (s: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(s);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const normalizedVolume = volume / 255;

        if (normalizedVolume > threshold) {
          const now = Date.now();
          // Only trigger if sustained or repeated noise
          if (now - lastPeakTimeRef.current < debounceMs) {
            setIsAudioPeak(true);
          }
          lastPeakTimeRef.current = now;
        } else {
          setIsAudioPeak(false);
        }
        
        audioIntervalRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (e) {
      console.warn("Audio Context failed, possibly incompatible browser move.", e);
    }
  };

  const stopMedia = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (audioIntervalRef.current) {
      cancelAnimationFrame(audioIntervalRef.current);
    }
    setIsLive(false);
  }, [stream]);

  // Handle hardware disconnects
  useEffect(() => {
    const handleDisconnect = () => {
       alert("Hardware disconnected! Please reconnect your camera/mic to continue.");
       setIsLive(false);
    };
    navigator.mediaDevices.addEventListener('devicechange', handleDisconnect);
    return () => navigator.mediaDevices.removeEventListener('devicechange', handleDisconnect);
  }, []);

  return { stream, isAudioPeak, startMedia, stopMedia, isLive };
};
