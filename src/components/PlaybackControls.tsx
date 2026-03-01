import { Play, Pause, RotateCcw, Gauge, Flag } from "lucide-react";
import React, { useRef, useCallback } from "react";
import type { PlaybackSpeed } from "@/hooks/useSimulation";

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  currentLap: number;
  totalLaps: number;
  onTogglePlay: () => void;
  onReset: () => void;
  onCycleSpeed: () => void;
  onSeek: (lap: number) => void;
  isFinished: boolean;
}

export function PlaybackControls({
  isPlaying,
  speed,
  currentLap,
  totalLaps,
  onTogglePlay,
  onReset,
  onCycleSpeed,
  onSeek,
  isFinished,
}: PlaybackControlsProps) {
  const progress = totalLaps > 0 ? (currentLap / totalLaps) * 100 : 0;
  const barRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      if (!barRef.current || totalLaps === 0) return;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      onSeek(Math.round(ratio * totalLaps));
    },
    [totalLaps, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDragging.current = true;
      seekFromClientX(e.clientX);

      const onMouseMove = (ev: MouseEvent) => {
        if (isDragging.current) seekFromClientX(ev.clientX);
      };
      const onMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [seekFromClientX]
  );

  return (
    <div className="space-y-3">
      {/* Draggable seek bar */}
      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        className="relative h-3 bg-secondary rounded-full overflow-visible group cursor-pointer select-none"
        title={`Lap ${currentLap} / ${totalLaps} — drag to seek`}
      >
        {/* Filled portion */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--neon-red-glow)))`,
          }}
        />
        {/* Drag handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-2 border-foreground shadow-lg transition-[left] duration-75 group-hover:scale-125"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Lap counter */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Lap</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-mono font-bold text-accent glow-text-cyan tabular-nums">
            {String(currentLap).padStart(2, "0")}
          </span>
          <span className="text-sm font-mono text-muted-foreground">/</span>
          <span className="text-sm font-mono text-muted-foreground tabular-nums">
            {String(totalLaps).padStart(2, "00")}
          </span>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-muted transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onTogglePlay}
          disabled={totalLaps === 0}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-red shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : isFinished ? (
            <Flag className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <button
          onClick={onCycleSpeed}
          className="h-9 px-3 rounded-full bg-secondary hover:bg-muted transition-colors flex items-center gap-1.5"
          title="Cycle playback speed"
        >
          <Gauge className="w-3.5 h-3.5 text-accent" />
          <span className="font-mono text-xs font-bold text-foreground">{speed}×</span>
        </button>
      </div>

      {isFinished && totalLaps > 0 && (
        <div className="text-center text-xs font-mono text-primary glow-text-red animate-pulse-glow flex items-center justify-center gap-1.5">
          <Flag className="w-3 h-3" />
          RACE COMPLETE
          <Flag className="w-3 h-3" />
        </div>
      )}
    </div>
  );
}
