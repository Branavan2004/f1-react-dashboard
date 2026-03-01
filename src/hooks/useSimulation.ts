import { useState, useEffect, useCallback, useRef } from "react";

export type PlaybackSpeed = 0.01 | 0.15 | 0.25 | 0.5 | 1 | 2 | 3;

export function useSimulation(totalLaps: number) {
  const [currentLap, setCurrentLap] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>(0.01);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentLap(0);
  }, []);

  const setLap = useCallback((lap: number) => {
    setCurrentLap(Math.max(0, Math.min(lap, totalLaps)));
  }, [totalLaps]);

  const cycleSpeed = useCallback(() => {
    setSpeed((s) => {
      if (s === 0.01) return 0.15;
      if (s === 0.15) return 0.25;
      if (s === 0.25) return 0.5;
      if (s === 0.5) return 1;
      if (s === 1) return 2;
      if (s === 2) return 3;
      return 0.01;
    });
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && currentLap < totalLaps) {
      const ms = 1000 / speed;
      intervalRef.current = setInterval(() => {
        setCurrentLap((prev) => {
          if (prev >= totalLaps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, ms);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, totalLaps, currentLap]);

  // Reset when totalLaps changes (new race selected)
  useEffect(() => {
    setCurrentLap(0);
    setIsPlaying(false);
  }, [totalLaps]);

  return {
    currentLap,
    isPlaying,
    speed,
    play,
    pause,
    togglePlay,
    reset,
    setLap,
    setSpeed,
    cycleSpeed,
    isFinished: currentLap >= totalLaps,
  };
}
