import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Lap, RaceResult } from "@/lib/f1-types";
import { getTeamColor } from "@/lib/team-colors";

interface LapTimeChartProps {
  laps: Lap[];
  results: RaceResult[];
  currentLap: number;
}

function lapTimeToSeconds(time: string): number {
  const parts = time.split(":");
  if (parts.length === 2) {
    const [min, sec] = parts;
    return parseInt(min) * 60 + parseFloat(sec);
  }
  return parseFloat(time);
}

export function LapTimeChart({ laps, results, currentLap }: LapTimeChartProps) {
  // Top 5 drivers to track
  const topDrivers = useMemo(() => {
    return results.slice(0, 5).map((r) => ({
      id: r.Driver.driverId,
      code: r.Driver.code,
      color: getTeamColor(r.Constructor.constructorId),
    }));
  }, [results]);

  const chartData = useMemo(() => {
    const visibleLaps = laps.slice(0, currentLap);
    return visibleLaps.map((lap) => {
      const point: Record<string, number | string> = { lap: parseInt(lap.number) };
      for (const driver of topDrivers) {
        const timing = lap.Timings.find((t) => t.driverId === driver.id);
        if (timing) {
          point[driver.code] = lapTimeToSeconds(timing.time);
        }
      }
      return point;
    });
  }, [laps, currentLap, topDrivers]);

  if (results.length === 0 || laps.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-mono">
        NO TELEMETRY DATA
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
          <XAxis
            dataKey="lap"
            stroke="hsl(0 0% 30%)"
            tick={{ fontSize: 10, fill: "hsl(0 0% 50%)", fontFamily: "JetBrains Mono" }}
            label={{ value: "LAP", position: "insideBottom", offset: -2, fontSize: 9, fill: "hsl(0 0% 40%)" }}
          />
          <YAxis
            stroke="hsl(0 0% 30%)"
            tick={{ fontSize: 10, fill: "hsl(0 0% 50%)", fontFamily: "JetBrains Mono" }}
            domain={["dataMin - 2", "dataMax + 2"]}
            label={{ value: "TIME (s)", angle: -90, position: "insideLeft", fontSize: 9, fill: "hsl(0 0% 40%)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(0 0% 8%)",
              border: "1px solid hsl(0 0% 20%)",
              borderRadius: "6px",
              fontSize: "11px",
              fontFamily: "JetBrains Mono",
            }}
            labelStyle={{ color: "hsl(0 0% 60%)" }}
          />
          {topDrivers.map((driver) => (
            <Line
              key={driver.code}
              type="monotone"
              dataKey={driver.code}
              stroke={driver.color}
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
