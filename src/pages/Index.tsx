import { useRaceCalendar, useRaceData } from "@/hooks/useRaceData";
import { useSimulation } from "@/hooks/useSimulation";
import { RaceCard } from "@/components/RaceCard";
import { Leaderboard } from "@/components/Leaderboard";
import { TrackSimulation } from "@/components/TrackSimulation";
import { PlaybackControls } from "@/components/PlaybackControls";
import { LapTimeChart } from "@/components/LapTimeChart";
import { getTeamColor } from "@/lib/team-colors";
import { Zap, Radio, Loader2, Activity } from "lucide-react";

const Index = () => {
  const { data: races, isLoading: calendarLoading } = useRaceCalendar();
  const { selectedRound, selectRace, results, laps, isLoading: raceLoading, hasData } = useRaceData();
  const totalLaps = laps.length;
  const sim = useSimulation(totalLaps);

  const selectedRace = races?.find((r) => r.round === selectedRound);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-5 py-2.5 flex items-center justify-between shrink-0 bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-red">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-black text-foreground text-lg leading-none tracking-tight">
              FanVolt <span className="text-primary">Pro</span>
            </h1>
            <p className="text-[9px] text-muted-foreground font-mono tracking-[0.25em] uppercase mt-0.5">
              Race Telemetry · 2025 Season
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {selectedRace && (
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
              <Activity className="w-3 h-3 text-accent" />
              <span className="text-accent">{selectedRace.raceName.replace(" Grand Prix", " GP")}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-telemetry-green animate-pulse-glow" />
            <span className="tracking-wider">LIVE</span>
          </div>
        </div>
      </header>

      {/* Main 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Race Calendar */}
        <aside className="w-[280px] border-r border-border bg-card/20 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase font-semibold">
              Race Calendar
            </h2>
            <span className="text-[10px] font-mono text-accent">{races?.length || 0} races</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
            {calendarLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-[10px] font-mono text-muted-foreground">LOADING CALENDAR</span>
              </div>
            ) : (
              races?.map((race) => {
                const raceKey = race.round;
                return (
                  <RaceCard
                    key={raceKey}
                    race={race}
                    isSelected={race.round === selectedRound}
                    onClick={() => selectRace(race.round)}
                    isPast={race.date <= today}
                  />
                );
              })
            )}
          </div>
        </aside>

        {/* Center Stage */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
            {!selectedRound ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-muted-foreground font-mono text-sm tracking-wider">
                    SELECT A RACE
                  </p>
                  <p className="text-muted-foreground/40 text-xs mt-1">
                    Choose a completed Grand Prix from the calendar
                  </p>
                </div>
              </div>
            ) : raceLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-glow" />
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground font-mono text-xs tracking-wider">
                    LOADING TELEMETRY
                  </p>
                  <p className="text-muted-foreground/40 text-[10px] mt-1">
                    Fetching lap data...
                  </p>
                </div>
              </div>
            ) : !hasData ? (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center mx-auto">
                  <Radio className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-muted-foreground font-mono text-sm">NO DATA AVAILABLE</p>
                  <p className="text-muted-foreground/40 text-xs mt-1">
                    This race hasn't occurred yet
                  </p>
                </div>
              </div>
            ) : (
              <>
                <TrackSimulation
                  laps={laps}
                  results={results}
                  currentLap={sim.currentLap}
                  raceName={selectedRace?.raceName || ""}
                  circuitId={selectedRace?.Circuit.circuitId || ""}
                />
                <div className="w-full max-w-sm">
                  <PlaybackControls
                    isPlaying={sim.isPlaying}
                    speed={sim.speed}
                    currentLap={sim.currentLap}
                    totalLaps={totalLaps}
                    onTogglePlay={sim.togglePlay}
                    onReset={sim.reset}
                    onCycleSpeed={sim.cycleSpeed}
                    onSeek={sim.setLap}
                    isFinished={sim.isFinished}
                  />
                </div>
              </>
            )}
          </div>

          {/* Lap Time Chart */}
          {hasData && (
            <div className="h-44 border-t border-border px-4 py-2 shrink-0 bg-card/20">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-accent" />
                <h3 className="text-[10px] font-mono text-muted-foreground tracking-[0.15em] uppercase font-semibold">
                  Pace Delta
                </h3>
                <div className="flex-1" />
                {results.slice(0, 5).map((r) => {
                  const color = getTeamColor(r.Constructor.constructorId);
                  return (
                    <span
                      key={r.Driver.code}
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm border"
                      style={{
                        color: color,
                        borderColor: `${color}30`,
                        backgroundColor: `${color}10`,
                      }}
                    >
                      {r.Driver.code}
                    </span>
                  );
                })}
              </div>
              <div className="h-[calc(100%-22px)]">
                <LapTimeChart laps={laps} results={results} currentLap={sim.currentLap} />
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Leaderboard */}
        <aside className="w-[300px] border-l border-border bg-card/20 flex flex-col shrink-0">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase font-semibold">
              Live Standings
            </h2>
            {sim.currentLap > 0 && (
              <span className="text-[10px] font-mono text-accent glow-text-cyan px-2 py-0.5 bg-accent/10 rounded-full">
                LAP {sim.currentLap}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            <Leaderboard results={results} laps={laps} currentLap={sim.currentLap} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
