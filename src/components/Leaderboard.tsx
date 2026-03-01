import { useMemo } from "react";
import type { RaceResult, Lap } from "@/lib/f1-types";
import { getTeamColor } from "@/lib/team-colors";
import { getDriverPhoto } from "@/lib/driver-photos";
import { Trophy, ArrowUp, ArrowDown, Minus, Flame } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardProps {
  results: RaceResult[];
  laps: Lap[];
  currentLap: number;
}

export function Leaderboard({ results, laps, currentLap }: LeaderboardProps) {
  const standings = useMemo(() => {
    if (currentLap === 0 || laps.length === 0) {
      return results
        .sort((a, b) => parseInt(a.grid) - parseInt(b.grid))
        .map((r, i) => ({
          position: i + 1,
          driver: r.Driver,
          constructor: r.Constructor,
          gridPos: parseInt(r.grid),
          gap: "",
          posChange: 0,
          isFastestLap: false,
        }));
    }

    const lapData = laps[Math.min(currentLap - 1, laps.length - 1)];
    if (!lapData) return [];

    // Find fastest lap holder
    const fastestLapDriver = results.find((r) => r.FastestLap?.rank === "1")?.Driver.driverId;

    return lapData.Timings.map((timing, i) => {
      const result = results.find((r) => r.Driver.driverId === timing.driverId);
      const gridPos = result ? parseInt(result.grid) : 20;
      const currentPos = parseInt(timing.position);

      return {
        position: currentPos,
        driver: result?.Driver || {
          driverId: timing.driverId,
          code: timing.driverId.substring(0, 3).toUpperCase(),
          givenName: "",
          familyName: timing.driverId,
          url: "",
          dateOfBirth: "",
          nationality: "",
        },
        constructor: result?.Constructor || {
          constructorId: "unknown",
          url: "",
          name: "Unknown",
          nationality: "",
        },
        gridPos,
        gap: i === 0 ? "LEADER" : timing.time,
        posChange: gridPos - currentPos,
        isFastestLap: timing.driverId === fastestLapDriver,
      };
    }).sort((a, b) => a.position - b.position);
  }, [results, laps, currentLap]);

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-mono">
        SELECT A RACE
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {standings.map((entry, i) => {
        const teamColor = getTeamColor(entry.constructor.constructorId);
        const photoUrl = getDriverPhoto(entry.driver.driverId);
        const isPodium = i < 3 && currentLap > 0;

        return (
          <div
            key={entry.driver.driverId}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md border transition-all duration-200 animate-slide-in ${
              isPodium
                ? "bg-card border-border hover:border-primary/40"
                : "bg-card/60 border-border/30 hover:border-border/60"
            }`}
            style={{ 
              animationDelay: `${i * 25}ms`,
              borderLeftWidth: "3px",
              borderLeftColor: teamColor,
            }}
          >
            {/* Position */}
            <div className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[11px] shrink-0 ${
              i === 0 ? "bg-primary text-primary-foreground" :
              i === 1 ? "bg-muted text-foreground" :
              i === 2 ? "bg-telemetry-orange/20 text-telemetry-orange" :
              "text-muted-foreground"
            }`}>
              {entry.position}
            </div>

            {/* Driver photo */}
            <Avatar className="w-7 h-7 shrink-0 border border-border/50">
              <AvatarImage src={photoUrl} alt={entry.driver.code} className="object-cover object-top" />
              <AvatarFallback className="text-[9px] font-mono font-bold bg-secondary text-secondary-foreground">
                {entry.driver.code}
              </AvatarFallback>
            </Avatar>

            {/* Driver info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-xs text-foreground">
                  {entry.driver.code}
                </span>
                {i === 0 && currentLap > 0 && (
                  <Trophy className="w-3 h-3 text-telemetry-yellow" />
                )}
                {entry.isFastestLap && (
                  <Flame className="w-3 h-3 text-accent" />
                )}
              </div>
              <p className="text-[9px] text-muted-foreground truncate leading-tight">
                {entry.constructor.name}
              </p>
            </div>

            {/* Gap */}
            <span className={`font-mono text-[10px] shrink-0 ${
              entry.gap === "LEADER" ? "text-primary font-bold" : "text-accent"
            }`}>
              {entry.gap}
            </span>

            {/* Position change */}
            <div className="w-5 shrink-0 flex justify-center">
              {entry.posChange > 0 ? (
                <div className="flex items-center">
                  <ArrowUp className="w-3 h-3 text-telemetry-green" />
                  <span className="text-[8px] font-mono text-telemetry-green">{entry.posChange}</span>
                </div>
              ) : entry.posChange < 0 ? (
                <div className="flex items-center">
                  <ArrowDown className="w-3 h-3 text-primary" />
                  <span className="text-[8px] font-mono text-primary">{Math.abs(entry.posChange)}</span>
                </div>
              ) : (
                <Minus className="w-3 h-3 text-muted-foreground/40" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
