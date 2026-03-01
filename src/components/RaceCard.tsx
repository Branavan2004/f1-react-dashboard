import type { Race } from "@/lib/f1-types";
import { getCountryFlag } from "@/lib/team-colors";
import { MapPin, ChevronRight, CheckCircle2 } from "lucide-react";

export interface RaceCardProps {
  race: Race;
  isSelected: boolean;
  onClick: () => void;
  isPast: boolean;
  key?: string;
}

export function RaceCard({ race, isSelected, onClick, isPast }: RaceCardProps) {
  const flag = getCountryFlag(race.Circuit.Location.country);
  const date = new Date(race.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 group ${
        isSelected
          ? "border-primary bg-primary/10 glow-red"
          : isPast
          ? "border-transparent bg-card/50 hover:bg-card hover:border-border/50"
          : "border-transparent bg-transparent opacity-40 cursor-default"
      }`}
      disabled={!isPast}
    >
      <div className="flex items-center gap-2.5">
        {/* Round badge */}
        <div className={`w-7 h-7 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
          isSelected
            ? "bg-primary text-primary-foreground"
            : isPast
            ? "bg-secondary text-secondary-foreground"
            : "bg-muted/50 text-muted-foreground"
        }`}>
          {race.round}
        </div>

        {/* Race info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-lg leading-none">{flag}</span>
            <p className={`font-semibold text-sm truncate ${
              isSelected ? "text-primary" : "text-foreground"
            }`}>
              {race.raceName.replace(" Grand Prix", "")}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-[10px] text-muted-foreground font-mono">{formattedDate}</span>
            <div className="flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground/60 truncate">
                {race.Circuit.Location.locality}
              </span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="shrink-0">
          {isSelected ? (
            <ChevronRight className="w-4 h-4 text-primary" />
          ) : isPast ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-telemetry-green/40" />
          ) : null}
        </div>
      </div>
    </button>
  );
}
