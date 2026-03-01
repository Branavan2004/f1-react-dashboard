import { useMemo } from "react";
import type { Lap, RaceResult } from "@/lib/f1-types";
import { getTeamColor } from "@/lib/team-colors";
import { getTrackLayout } from "@/lib/track-layouts";

interface TrackSimulationProps {
  laps: Lap[];
  results: RaceResult[];
  currentLap: number;
  raceName: string;
  circuitId: string;
}

export function TrackSimulation({ laps, results, currentLap, raceName, circuitId }: TrackSimulationProps) {
  const track = useMemo(() => getTrackLayout(circuitId), [circuitId]);

  const drivers = useMemo(() => {
    if (currentLap === 0 || laps.length === 0) {
      return results.map((r, i) => ({
        code: r.Driver.code,
        color: getTeamColor(r.Constructor.constructorId),
        offset: i * 0.015,
        position: i + 1,
      }));
    }

    const lapData = laps[Math.min(currentLap - 1, laps.length - 1)];
    if (!lapData) return [];

    return lapData.Timings.map((t, i) => {
      const result = results.find((r) => r.Driver.driverId === t.driverId);
      return {
        code: result?.Driver.code || t.driverId.substring(0, 3).toUpperCase(),
        color: result ? getTeamColor(result.Constructor.constructorId) : "#888",
        offset: i * 0.02,
        position: parseInt(t.position),
      };
    });
  }, [laps, results, currentLap]);

  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <svg viewBox={track.viewBox} className="w-full h-full drop-shadow-lg">
        <defs>
          <filter id="trackGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="driverGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Track outline (curb effect) */}
        <path
          d={track.path}
          fill="none"
          stroke="hsl(0 0% 22%)"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Track surface */}
        <path
          d={track.path}
          fill="none"
          stroke="hsl(0 0% 13%)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Track edge lines */}
        <path
          d={track.path}
          fill="none"
          stroke="hsl(0 0% 28%)"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 8"
          opacity="0.4"
        />

        {/* Neon racing line */}
        <path
          d={track.path}
          fill="none"
          stroke="hsl(185 100% 50%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.35"
          filter="url(#trackGlow)"
        />

        {/* Start/finish line indicator */}
        <path
          d={track.path}
          fill="none"
          stroke="hsl(0 0% 100%)"
          strokeWidth="3"
          strokeLinecap="butt"
          strokeDasharray="0.1 9999"
          opacity="0.6"
        />

        {/* Driver markers - all 20 */}
        {drivers.map((driver) => (
          <g key={driver.code}>
            {/* Glow circle */}
            <circle r="8" fill={driver.color} filter="url(#driverGlow)" opacity="0.4">
              <animateMotion
                dur={`${3 + driver.offset * 20}s`}
                repeatCount="indefinite"
                begin={`${driver.offset * 3}s`}
              >
                <mpath href="#trackMotionPath" />
              </animateMotion>
            </circle>
            {/* Main dot */}
            <circle r="5.5" fill={driver.color} filter="url(#softShadow)" opacity="0.95">
              <animateMotion
                dur={`${3 + driver.offset * 20}s`}
                repeatCount="indefinite"
                begin={`${driver.offset * 3}s`}
              >
                <mpath href="#trackMotionPath" />
              </animateMotion>
            </circle>
            {/* Driver code label */}
            <text
              fontSize="4.5"
              fill="white"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              filter="url(#softShadow)"
            >
              <animateMotion
                dur={`${3 + driver.offset * 20}s`}
                repeatCount="indefinite"
                begin={`${driver.offset * 3}s`}
              >
                <mpath href="#trackMotionPath" />
              </animateMotion>
              {driver.code}
            </text>
          </g>
        ))}

        {/* Hidden path for animateMotion */}
        <path id="trackMotionPath" d={track.path} fill="none" stroke="none" />

        {/* Center circuit name */}
        <text
          x="250"
          y="240"
          textAnchor="middle"
          fill="hsl(0 0% 30%)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          letterSpacing="2"
        >
          {raceName.replace(" Grand Prix", "").toUpperCase()}
        </text>
        <text
          x="250"
          y="255"
          textAnchor="middle"
          fill="hsl(0 0% 20%)"
          fontSize="7"
          fontFamily="JetBrains Mono, monospace"
          letterSpacing="3"
        >
          GRAND PRIX
        </text>
      </svg>
    </div>
  );
}
