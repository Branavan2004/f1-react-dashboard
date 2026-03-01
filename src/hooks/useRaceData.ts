import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Race, RaceResult, Lap, RaceCalendarResponse, RaceResultsResponse, LapsResponse } from "@/lib/f1-types";

const BASE_URL = "https://api.jolpi.ca/ergast/f1/2025";

async function fetchCalendar(): Promise<Race[]> {
  const res = await fetch(`${BASE_URL}.json`);
  const data: RaceCalendarResponse = await res.json();
  return data.MRData.RaceTable.Races;
}

async function fetchResults(round: string): Promise<RaceResult[]> {
  const res = await fetch(`${BASE_URL}/${round}/results.json`);
  const data: RaceResultsResponse = await res.json();
  return data.MRData.RaceTable.Races[0]?.Results || [];
}

async function fetchLaps(round: string): Promise<Lap[]> {
  // The API caps at 100 results per request, so we must paginate
  const allLaps: Lap[] = [];
  let offset = 0;
  const limit = 100;

  // First request to get total
  const firstRes = await fetch(`${BASE_URL}/${round}/laps.json?limit=${limit}&offset=0`);
  const firstData: LapsResponse = await firstRes.json();
  const total = parseInt(firstData.MRData.total || "0");
  const firstLaps = firstData.MRData.RaceTable.Races[0]?.Laps || [];
  allLaps.push(...firstLaps);
  offset += limit;

  // Fetch remaining pages in parallel
  if (total > limit) {
    const requests: Promise<Response>[] = [];
    for (let o = offset; o < total; o += limit) {
      requests.push(fetch(`${BASE_URL}/${round}/laps.json?limit=${limit}&offset=${o}`));
    }
    const responses = await Promise.all(requests);
    const dataArr = await Promise.all(responses.map((r) => r.json() as Promise<LapsResponse>));
    for (const d of dataArr) {
      const pageLaps = d.MRData.RaceTable.Races[0]?.Laps || [];
      allLaps.push(...pageLaps);
    }
  }

  // Merge laps by number (API may split a single lap across pages)
  const lapMap = new Map<string, Lap>();
  for (const lap of allLaps) {
    const existing = lapMap.get(lap.number);
    if (existing) {
      // Merge timings, avoiding duplicates
      const existingIds = new Set(existing.Timings.map((t) => t.driverId));
      for (const timing of lap.Timings) {
        if (!existingIds.has(timing.driverId)) {
          existing.Timings.push(timing);
        }
      }
    } else {
      lapMap.set(lap.number, { ...lap, Timings: [...lap.Timings] });
    }
  }

  return Array.from(lapMap.values()).sort((a, b) => parseInt(a.number) - parseInt(b.number));
}

export function useRaceCalendar() {
  return useQuery({
    queryKey: ["f1-calendar-2025"],
    queryFn: fetchCalendar,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useRaceData() {
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  const resultsQuery = useQuery({
    queryKey: ["f1-results", selectedRound],
    queryFn: () => fetchResults(selectedRound!),
    enabled: !!selectedRound,
    staleTime: 1000 * 60 * 60,
  });

  const lapsQuery = useQuery({
    queryKey: ["f1-laps", selectedRound],
    queryFn: () => fetchLaps(selectedRound!),
    enabled: !!selectedRound,
    staleTime: 1000 * 60 * 60,
  });

  const selectRace = useCallback((round: string) => {
    setSelectedRound(round);
  }, []);

  return {
    selectedRound,
    selectRace,
    results: resultsQuery.data || [],
    laps: lapsQuery.data || [],
    isLoading: resultsQuery.isLoading || lapsQuery.isLoading,
    isError: resultsQuery.isError || lapsQuery.isError,
    hasData: (resultsQuery.data?.length ?? 0) > 0 && (lapsQuery.data?.length ?? 0) > 0,
  };
}
